import notifyUnique from "../notifs/notifyUnique.js";
import { updateEnergyCounter } from "../pageUpdates.js";
import {unlockUIElement} from "../toggleUIElement.js";
import { updateResearchButtons } from "../pageUpdates.js";
import { gainEnergy } from "./gainResources.js";

function energyClicker(userData) {
   const currentMultiverse = userData.multiverses[userData.currentMultiverse];

   gainEnergy(userData, 1 + currentMultiverse.upgradeTimes.energyClicker ?? 0);
    if (currentMultiverse.energy > 5 && !currentMultiverse.eventsDone.includes("firstEnergy")) {
        notifyUnique("gettingEnergy");
        unlockUIElement(currentMultiverse.UIElementsUnlocked, "sidebar");
        currentMultiverse.eventsDone.push("firstEnergy");
    }

    if (currentMultiverse.statistics.energyGained > 30 && !currentMultiverse.eventsDone.includes("energyTitle")) {
        unlockUIElement(currentMultiverse.UIElementsUnlocked, "energyTitle");
        currentMultiverse.eventsDone.push("energyTitle");
    }
    if (currentMultiverse.statistics.energyGained > 100 && !currentMultiverse.eventsDone.includes("unlockResearch")) {
        notifyUnique("unlockResearch");
        unlockUIElement(currentMultiverse.UIElementsUnlocked, "pageSelector");
        currentMultiverse.researchUnlocked.push("Upgrades");
        updateResearchButtons(userData);
        currentMultiverse.eventsDone.push("unlockResearch");
    }
    if (currentMultiverse.energy > 10) {
        unlockUIElement(currentMultiverse.UIElementsUnlocked, "dust");
    }
}

export default energyClicker