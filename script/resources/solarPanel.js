import { acknowledgeEnergyGenerated } from "../animations/solarPanel.js";
import { updateEnergyCounter } from "../pageUpdates.js";
import { gainEnergy } from "./gainResources.js";

function getDistanceToStar(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const currentSystem = currentMultiverse.solarSystems[currentMultiverse.currentSolarSystem];
    return Math.floor(Math.sqrt((currentSystem.objects.player.posX - 375) ** 2 + (currentSystem.objects.player.posY - 375) ** 2));
}
function getEnergyPerSecond(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    return Math.floor(200 / getDistanceToStar(userData) * currentMultiverse.solarPanel);
}
function solarPanelTick(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    if (currentMultiverse.solarPanel > 0) {
        const energyPerSecond = getEnergyPerSecond(userData);
        gainEnergy(userData, energyPerSecond);
        updateEnergyCounter(userData)

        updateSolarPanels(userData);
    }
}

const solarPanelDiv = document.getElementById("solarPanel");
function updateSolarPanels(userData) {
    const solarPanelTable = document.querySelector(".solarPanelTable");
    const eps = getEnergyPerSecond(userData);
    const dropShadowBlur = Math.min(eps / 2, 4);
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    acknowledgeEnergyGenerated(eps);
    solarPanelDiv.style.display = currentMultiverse.solarPanel > 0 ? "block" : "none";
    document.getElementById("numberOfSolarPanels").textContent = currentMultiverse.solarPanel;
    document.getElementById("solarPanelEPS").textContent = eps;
    document.getElementById("solarPanelDistanceToStar").textContent = getDistanceToStar(userData);
    if (solarPanelTable) solarPanelTable.style.filter = `blur(3px) drop-shadow(0px 0px ${dropShadowBlur}px rgba(223, 218, 115, 0.33))`;
}

export { solarPanelTick, updateSolarPanels, getEnergyPerSecond }