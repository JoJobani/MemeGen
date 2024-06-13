'use strict'

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: []
}

function getMeme() {
    return gMeme
}

function setLineTxt(newText) {
    let currLine = gMeme.lines[gMeme.selectedLineIdx]
    currLine.txt = newText
}

function setLineColor(newColor) {
    let currLine = gMeme.lines[gMeme.selectedLineIdx]
    currLine.color = newColor
}

function setImg(imgId) {
    gMeme.selectedImgId = imgId
}

function setFontSize(newSize) {
    let currLine = gMeme.lines[gMeme.selectedLineIdx]
    currLine.size = newSize
}

function addLine() {
    const canvasHeight = 500
    let yPos
    if (gMeme.lines.length === 0) {
        yPos = 50
    } else if (gMeme.lines.length === 1) {
        yPos = canvasHeight - 50
    } else {
        yPos = canvasHeight / 2
    }
    gMeme.lines.push({
        txt: 'New Line',
        size: 50,
        color: '#000000',
        xPos: 250,
        yPos: yPos
    })
}

function switchLine() {
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1){
        gMeme.selectedLineIdx = 0
    } else{
        gMeme.selectedLineIdx++
    }
}

function setSelectedLineIdx(idx){
    gMeme.selectedLineIdx = idx
}