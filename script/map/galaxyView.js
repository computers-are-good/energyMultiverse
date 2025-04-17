function galaxyView(userData) {
    document.getElementById("galaxyMap").style.display = "block";
}
function closeGalaxyView(userData) {
    document.getElementById("galaxyMap").style.display = "none";
}

export { galaxyView, closeGalaxyView }