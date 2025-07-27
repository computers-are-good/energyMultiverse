function showOverlay() {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("overlayBG").style.display = "block";
    document.getElementById("overlay").innerHTML = "";
}

function hideOverlay() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("overlayBG").style.display = "none";
}

export {showOverlay, hideOverlay}