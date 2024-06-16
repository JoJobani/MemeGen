'use strict'

var gElCanvas
var gCtx
const PADDING = 10

function onOpenEditor() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    document.querySelector('.editor').classList.remove('hidden')
    document.querySelector('.gallery').classList.add('hidden')
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    gElCanvas.addEventListener('click', onCanvasClick)
}

function onCloseEditor() {
    document.querySelector('.editor').classList.add('hidden')
    document.querySelector('.gallery').classList.remove('hidden')
    gElCanvas.removeEventListener('click', onCanvasClick)
}

//render the meme with everythig on it
function renderMeme(img) {
    let image = new Image()
    image.src = img
    image.onload = () => {
        //render fresh image and text and clear previous clutter
        gCtx.drawImage(image, 0, 0, gElCanvas.width, gElCanvas.height)
        clearSelectionBorders()
        renderLines()
    }
}

//go over the lines to render them
function renderLines() {
    getMeme().lines.forEach((line, index) => {
        renderText(line)
        if (index === getMeme().selectedLineIdx) {
            addSelectionBorder(line)
        }
    })
}

//render text of each individual line
function renderText(line) {
    setCanvasFont(line)
    const { x, y } = getObjectPos(line, gElCanvas)
    gCtx.strokeText(line.txt, x, y)
    gCtx.fillText(line.txt, x, y)
}

//create div for the border adjusted to the line size and positioning
function addSelectionBorder(line) {
    //text size calc
    const { width, height } = getTextDimensions(line)
    //line positioning relative to canvas
    const { x, y } = getObjectPos(line, gElCanvas)
    const borderDiv = createBorderDiv(x, y, width, height)
    document.querySelector('.canvas-container').appendChild(borderDiv)
}

//create the actual border object
function createBorderDiv(x, y, width, height) {
    const borderDiv = document.createElement('div')
    borderDiv.className = 'selected-line'

    //calc offset due to canvas being smaller than container
    const canvasRect = gElCanvas.getBoundingClientRect();
    const containerRect = gElCanvas.parentElement.getBoundingClientRect();
    const leftOffset = canvasRect.left - containerRect.left;
    const topOffset = canvasRect.top - containerRect.top;

    //calculate final border position
    Object.assign(borderDiv.style, {
        left: `${x - width / 2 - PADDING + leftOffset}px`,
        top: `${y - height / 2 - PADDING + topOffset}px`,
        width: `${width + PADDING * 2}px`,
        height: `${height + PADDING * 2}px`
    })
    return borderDiv
}

//resize canvas whenever window size changes (with some limits)
function resizeCanvas() {
    let elContainer = document.querySelector('.canvas-container')
    let containerWidth = elContainer.offsetWidth
    let aspectRatio = gElCanvas.width / gElCanvas.height
    //make sure canvas image doesnt get too large when viewing with large viewport
    const maxWidth = Math.min(800, containerWidth)
    const maxHeight = 600
    let newWidth = containerWidth
    let newHeight = containerWidth / aspectRatio
    if (newWidth > maxWidth) {
        newWidth = maxWidth
        newHeight = maxWidth / aspectRatio
    }
    if (newHeight > maxHeight) {
        newHeight = maxHeight
        newWidth = maxHeight * aspectRatio
    }
    //apply new canvas position relative to window
    gElCanvas.width = newWidth;
    gElCanvas.height = newHeight;
    renderMeme(gImgs[getMeme().selectedImgId - 1].url);
}

//get the Idx of a clicked line
function getClickedLineIdx(x, y) {
    return getMeme().lines.findIndex(line => isClickInside(x, y, line))
}

//detect positioning of a click on the canvas
function onCanvasClick(event) {
    const rect = gElCanvas.getBoundingClientRect()
    const xPos = event.clientX - rect.left
    const yPos = event.clientY - rect.top
    const clickedLineIdx = getClickedLineIdx(xPos, yPos)
    if (clickedLineIdx !== -1) {
        setSelectedLineIdx(clickedLineIdx)
        document.querySelector('.line-txt').value = getMeme().lines[clickedLineIdx].txt
        renderMeme(gImgs[getMeme().selectedImgId - 1].url)
    }
    updateControlsForSelectedLine()
}

//apply the lines current settings to the line decoration bar
function updateControlsForSelectedLine() {
    const selectedLine = getMeme().lines[getMeme().selectedLineIdx]
    document.querySelector('.line-txt').value = selectedLine.txt
    document.getElementById('textColor').value = selectedLine.color
    document.getElementById('fontSize').value = selectedLine.size
    document.getElementById('fontSizeValue').textContent = selectedLine.size
}

function onSetLineTxt(ev) {
    setLineTxt(ev.txt)
    renderMeme(gImgs[getMeme().selectedImgId - 1].url)
}

function onSetTextColor(color) {
    setLineColor(color)
    renderMeme(gImgs[getMeme().selectedImgId - 1].url)
}

function onSetFontSize(size) {
    setFontSize(size)
    document.getElementById('fontSizeValue').textContent = size
    renderMeme(gImgs[getMeme().selectedImgId - 1].url)
}

function onAddLine() {
    addLine()
    renderMeme(gImgs[getMeme().selectedImgId - 1].url)
}

function onSwitchLine() {
    switchLine()
    updateControlsForSelectedLine()
    renderMeme(gImgs[getMeme().selectedImgId - 1].url)
}

function onDeleteLine(){
    if (!confirm('are you sure?')) return
    deleteLine()
    renderMeme(gImgs[getMeme().selectedImgId - 1].url)
}

function downloadImg(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}