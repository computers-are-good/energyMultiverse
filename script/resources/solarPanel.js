import { updateEnergyCounter } from "../pageUpdates.js";
import { currentScreenDisplayed } from "../toggleUIElement.js";

function getDistanceToStar(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const currentSystem = currentMultiverse.solarSystems[currentMultiverse.currentSolarSystem];
    return Math.floor(Math.sqrt(Math.pow(currentSystem.objects.player.posX - 375, 2) + Math.pow(currentSystem.objects.player.posY - 375, 2)));
}
function getEnergyPerSecond(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    return Math.floor(100 / getDistanceToStar(userData) * currentMultiverse.solarPanel);
}
function solarPanelTick(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    if (currentMultiverse.solarPanel > 0) {
        const energyPerSecond = getEnergyPerSecond(userData);
        currentMultiverse.energy += energyPerSecond;
        updateEnergyCounter(userData)
    
        updateSolarPanels(userData);
    }
}
const solarPanelDiv = document.getElementById("solarPanel")
function updateSolarPanels(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    solarPanelDiv.style.display = currentMultiverse.solarPanel > 0 ? "block" : "none";
    document.getElementById("numberOfSolarPanels").textContent = currentMultiverse.solarPanel;
    document.getElementById("solarPanelEPS").textContent = getEnergyPerSecond(userData);
    document.getElementById("solarPanelDistanceToStar").textContent = getDistanceToStar(userData);
    const bgColor = Math.floor(-0.9 * getDistanceToStar(userData) + 255);

    console.log(bgColor);
    
    solarPanelDiv.style.color = bgColor > 150 ? "black" : "white";
    solarPanelDiv.style.backgroundColor = `rgb(${bgColor}, ${bgColor}, ${bgColor})`
}

export { solarPanelTick, updateSolarPanels }