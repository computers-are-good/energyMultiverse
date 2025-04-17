import { updateEnergyCounter, updateDustCounter, updateResearchButtons, updateMetalCounter } from "../pageUpdates.js";
import { unlockUIElement } from "../toggleUIElement.js";
import notifyUnique from "../notifs/notifyUnique.js"
import { checkCosts, subtractCosts } from "../itemCosts.js";

function metalClicker(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    makeMetal(userData);
    unlockUIElement(currentMultiverse.UIElementsUnlocked, "dustCounter");
}

function makeMetal(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    if (checkCosts(userData, {energy: 30, dust: 5})) {
        currentMultiverse.metal++;
        currentMultiverse.statistics.metalMade++;
        subtractCosts(userData, {energy: 30, dust: 5});
    }
    updateDustCounter(userData);
    updateEnergyCounter(userData);
    updateMetalCounter(userData);
}

export default metalClicker