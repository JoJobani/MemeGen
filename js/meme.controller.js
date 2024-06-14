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

function renderMeme(img) {
    let image = new Image()
    image.src = img
    image.onload = () => {
        //render fresh image
        gCtx.drawImage(image, 0, 0, gElCanvas.width, gElCanvas.height)
        document.querySelectorAll('.selected-line').forEach(el => el.remove())
        //render lines
        getMeme().lines.forEach((line, index) => {
            renderText(line)
            if (index === getMeme().selectedLineIdx) {
                addSelectionBorder(line)
            }
        })
    }
}

function renderText(line) {
    gCtx.font = `${line.size}px Impact`
    gCtx.textBaseline = 'middle'
    gCtx.textAlign = 'center'
    gCtx.fillStyle = line.color
    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = 1
    const xPos = line.xPos * gElCanvas.width
    const yPos = line.yPos * gElCanvas.height
    gCtx.strokeText(line.txt, xPos, yPos)
    gCtx.fillText(line.txt, xPos, yPos)
}

function addSelectionBorder(line) {
    const textHeight = +line.size
    const textWidth = +gCtx.measureText(line.txt).width
    const xPos = line.xPos * gElCanvas.width
    const yPos = line.yPos * gElCanvas.height
    const borderDiv = document.createElement('div')
    borderDiv.className = 'selected-line'

    //calculate position relative to canvas
    const canvasRect = gElCanvas.getBoundingClientRect()
    const containerRect = gElCanvas.parentElement.getBoundingClientRect()
    const leftOffset = canvasRect.left - containerRect.left
    const topOffset = canvasRect.top - containerRect.top
    
    //calculate the positioning of the border while adjusting to the position of the canvas in the container
    borderDiv.style.left = `${xPos - textWidth / 2 - PADDING + leftOffset}px`
    borderDiv.style.top = `${yPos - textHeight / 2 - PADDING + topOffset}px`
    borderDiv.style.width = `${textWidth + PADDING * 2}px`
    borderDiv.style.height = `${textHeight + PADDING * 2}px`

    document.querySelector('.canvas-container').appendChild(borderDiv)
}

function resizeCanvas() {
    let elContainer = document.querySelector('.canvas-container')
    let containerWidth = elContainer.offsetWidth
    let aspectRatio = gElCanvas.width / gElCanvas.height
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
    gElCanvas.width = newWidth;
    gElCanvas.height = newHeight;
    renderMeme(gImgs[getMeme().selectedImgId - 1].url);
}

function getClickedLineIdx(x, y) {
    const lines = getMeme().lines
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const textHeight = line.size
        const textWidth = gCtx.measureText(line.txt).width
        const xPos = line.xPos * gElCanvas.width
        const yPos = line.yPos * gElCanvas.height
        if (
            x >= xPos - textWidth / 2 - PADDING &&
            x <= xPos + textWidth / 2 + PADDING &&
            y >= yPos - textHeight / 2 - PADDING &&
            y <= yPos + textHeight / 2 + PADDING
        ) {
            return i;
        }
    }
    return -1
}

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

function downloadImg(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}