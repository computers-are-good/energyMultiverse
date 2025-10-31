function showOverlay() {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("overlayBG").style.display = "block";
    document.getElementById("overlay").innerHTML = "";
}

function hideOverlay() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("overlayBG").style.display = "none";
}

function appendCloseButton() {
    const close = document.createElement("button");
    close.textContent = "close";
    document.getElementById("overlay").appendChild(close);
    close.addEventListener("click", hideOverlay);
    close.style.position = "relative";
    close.style.top = "10px";
}

function setOverlayTitle(title) {
    const heading = document.createElement("h2");
    heading.textContent = title;
    document.getElementById("overlay").appendChild(heading);
    heading.style.textAlign = "center";
}

export {
    showOverlay,
    hideOverlay,
    appendCloseButton,
    setOverlayTitle
}