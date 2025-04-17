import notifyUnique from "../notifs/notifyUnique.js";
import { updateEnergyCounter } from "../pageUpdates.js";
import {unlockUIElement} from "../toggleUIElement.js";
import { updateResearchButtons } from "../pageUpdates.js";

function energyClicker(userData) {
   const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    currentMultiverse.energy++;
    currentMultiverse.statistics.energyClicked++;

    if (currentMultiverse.energy > 5 && !currentMultiverse.eventsDone.includes("firstEnergy")) {
        notifyUnique("gettingEnergy");
        unlockUIElement(currentMultiverse.UIElementsUnlocked, "sidebar");
        currentMultiverse.eventsDone.push("firstEnergy");
    }

    if (currentMultiverse.statistics.energyClicked > 30 && !currentMultiverse.eventsDone.includes("energyTitle")) {
        unlockUIElement(currentMultiverse.UIElementsUnlocked, "energyTitle");
        currentMultiverse.eventsDone.push("energyTitle");
    }

    if (currentMultiverse.statistics.energyClicked > 100 && !currentMultiverse.eventsDone.includes("unlockResearch")) {
        notifyUnique("unlockResearch");
        unlockUIElement(currentMultiverse.UIElementsUnlocked, "pageSelector");
        currentMultiverse.researchUnlocked.push("Upgrades");
        updateResearchButtons(userData);
        currentMultiverse.eventsDone.push("unlockResearch");
    }
    if (currentMultiverse.energy > 10) {
        unlockUIElement(currentMultiverse.UIElementsUnlocked, "dust");
    }

    document.getElementById("energyAmount").textContent = currentMultiverse.energy;
    updateEnergyCounter(userData);
}

export default energyClicker