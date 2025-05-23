import { updateEnergyCounter, updateDustCounter, updateResearchButtons } from "../pageUpdates.js";
import { addNavigationAttention, unlockUIElement } from "../toggleUIElement.js";
import notifyUnique from "../notifs/notifyUnique.js"
import { checkCosts, subtractCosts } from "../itemCosts.js";
import { gainDust } from "./gainResources.js";
import unlockResearchForElement from "../unlockResearch.js";

function dustClicker(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    makeDust(userData);
    unlockUIElement(currentMultiverse.UIElementsUnlocked, "dustCounter");
}

function makeDust(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    if (checkCosts(userData, {energy: 10})) {
        gainDust(userData, 1);
        subtractCosts(userData, {energy: 10})
        if (currentMultiverse.dust >= 5 && !currentMultiverse.eventsDone.includes("unlockDust")) {
            notifyUnique("dustUseful");
            unlockUIElement(currentMultiverse.UIElementsUnlocked, "drones");
            currentMultiverse.eventsDone.push("unlockDust");
        }

        if (currentMultiverse.dust > 10 && !currentMultiverse.eventsDone.includes("dustbot")) {
            unlockResearchForElement(userData, "dustbot");
        }

        if (currentMultiverse.statistics.dustGained > 10 && !currentMultiverse.eventsDone.includes("unlockMetal")) {
            notifyUnique("unlockMetal");
            unlockUIElement(currentMultiverse.UIElementsUnlocked, "metals");
            currentMultiverse.eventsDone.push("unlockMetal");
        }
    }
}

export default dustClicker