import { checkCosts, subtractCosts } from "../itemCosts.js";
import { updateDustbot } from "../pageUpdates.js";
import { addNavigationAttention, unlockUIElement } from "../toggleUIElement.js";
import { drawUpgradeButtons } from "../upgrades.js";

const dustbotCost = {
    energy: 200,
    dust: 20
}

function buildDustbotEvent(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    if (checkCosts(userData, dustbotCost)) {
        subtractCosts(userData, dustbotCost);
        currentMultiverse.dustbotUnlocked = true;
        unlockUIElement(currentMultiverse.UIElementsUnlocked, "dustbotDiv");
        updateDustbot(userData);
        currentMultiverse.maxUpgradeTimes.dustbotSpeed = 20;
        addNavigationAttention("Upgrades", "pageUpgrades");
        drawUpgradeButtons(userData);
    }
}

function dustbotSlider(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const slider = document.getElementById("dustbotSlider");
    currentMultiverse.dustbotSpeed = parseInt(slider.value);
    updateDustbot(userData);
}

export {buildDustbotEvent, dustbotSlider}