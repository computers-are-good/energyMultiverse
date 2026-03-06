import {unlockUIElement} from "../toggleUIElement.js";
import { updateResearchButtons } from "../pageUpdates.js";
import { gainEnergy } from "./gainResources.js";
import { notify } from "../notifs/notify.js";

function energyClicker(userData) {
   const currentMultiverse = userData.multiverses[userData.currentMultiverse];

   gainEnergy(userData, 1 + (currentMultiverse.upgradeTimes.energyClicker ?? 0));
   document.getElementById("energyClicker").style.transform = "scale(0.7)";
   setTimeout(_ => document.getElementById("energyClicker").style.transform = "scale(1)", 100);

    if (currentMultiverse.energy > 5 && !currentMultiverse.eventsDone.includes("firstEnergy")) {
        notify("Every time you touch the light, you appear to get some energy. Perhaps they'll become useful.");
        unlockUIElement(currentMultiverse.UIElementsUnlocked, "sidebar");
        currentMultiverse.eventsDone.push("firstEnergy");
    }

    if (currentMultiverse.statistics.energyGained > 30 && !currentMultiverse.eventsDone.includes("energyTitle")) {
        unlockUIElement(currentMultiverse.UIElementsUnlocked, "energyTitle");
        currentMultiverse.eventsDone.push("energyTitle");
    }
    if (currentMultiverse.statistics.energyGained > 100 && !currentMultiverse.eventsDone.includes("unlockResearch")) {
        notify("It's time to learn more about yourself and the world around you.");
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