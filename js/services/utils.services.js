'use strict'

//util to get center of a given canvas
function getCanvasCenter(canvas) {
    return { x: canvas.width / 2, y: canvas.height / 2 }
}

//util to get positioning of object on a canvas
function getObjectPos(object, canvas) {
    const { x, y } = getCanvasCenter(canvas)
    return { x: object.xPos * x * 2, y: object.yPos * y * 2 }
}

//setting default font of text on canvas
function setCanvasFont(line) {
    gCtx.font = `${line.size}px Impact`
    gCtx.textBaseline = 'middle'
    gCtx.textAlign = 'center'
    gCtx.fillStyle = line.color
    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = 1
}

//clear all selected lines when editor is closed
function clearSelectionBorders() {
    document.querySelectorAll('.selected-line').forEach(el => el.remove())
}

//get size of a given text
function getTextDimensions(line) {
    const textWidth = gCtx.measureText(line.txt).width
    return { width: textWidth, height: line.size }
}

//check if current line was clicked using its positioning
function isClickInside(x, y, object) {
    const { width, height } = getTextDimensions(object)
    const { x: objectX, y: objectY } = getObjectPos(object, gElCanvas)
    return (
        x >= objectX - width / 2 - PADDING &&
        x <= objectX + width / 2 + PADDING &&
        y >= objectY - height / 2 - PADDING &&
        y <= objectY + height / 2 + PADDING
    )
}