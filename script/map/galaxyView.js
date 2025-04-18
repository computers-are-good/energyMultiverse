const bigGalaxyMap = document.getElementById("bigGalaxyMap");
const tierColours = {
    1: "#52cc38",
    2: "#8e9d42",
    3: "#b97a49",
    4: "#db5f4f",
    5: "#e64a6f",
    6: "#df3d98",

}
function galaxyView(userData) {
    document.getElementById("galaxyMap").style.display = "block";
    bigGalaxyMap.innerHTML = "";
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    for (const i in currentMultiverse.solarSystems) {
        const system = currentMultiverse.solarSystems[i];
        const systemDiv = drawSystem(system.galaxyX, system.galaxyY);

        if (i === currentMultiverse.currentSolarSystem) {
            systemDiv.style.backgroundColor = "white";
        } else {
            systemDiv.style.backgroundColor = tierColours[system.tier];
        }
        systemDiv.addEventListener("click", _ => {
            currentMultiverse.currentSolarSystem = i;
        })
    }
}
function drawSystem(x, y) {
    const newSystem = document.createElement("div");
    newSystem.style.position = "absolute";
    newSystem.style.marginTop = `${y}px`;
    newSystem.style.marginLeft = `${x}px`;
    newSystem.style.width = "20px";
    newSystem.style.height = "20px";
    newSystem.style.borderRadius = "20px";
    bigGalaxyMap.appendChild(newSystem);
    return newSystem;
}
function closeGalaxyView(userData) {
    document.getElementById("galaxyMap").style.display = "none";
}

export { galaxyView, closeGalaxyView }