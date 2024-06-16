'use strict'

var gImgs = []

function onInit() {
    loadGallery()
    addLine()
}

function loadGallery() {
    var elGallery = document.querySelector('.gallery')
    for (let i = 1; i <= 18; i++) {
        gImgs.push({ id: i, url: `img/${i}.jpg`, keywords: [] })
        elGallery.innerHTML += `<img src="img/${i}.jpg" alt="" onclick="onImgSelect(${i})">`
    }
}

function onImgSelect(imgId) {
    setImg(imgId)
    onOpenEditor()
    renderMeme(gImgs[imgId - 1].url)
}

function onGallerySelect() {
    onCloseEditor()
}

function openAbout() {
    event.preventDefault()
    var modal = document.getElementById('aboutModal')
    modal.style.display = 'block'

    var span = document.getElementsByClassName("close")[0]
    span.onclick = function() {
        modal.style.display = "none"
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}