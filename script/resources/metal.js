import { unlockUIElement } from "../toggleUIElement.js";
import { checkCosts, subtractCosts } from "../itemCosts.js";
import { gainMetal } from "./gainResources.js";

function metalClicker(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    makeMetal(userData);
    unlockUIElement(currentMultiverse.UIElementsUnlocked, "metalCounter");
}

function makeMetal(userData) {
    if (checkCosts(userData, {energy: 30, dust: 5})) {
        gainMetal(userData, 1);
        subtractCosts(userData, {energy: 30, dust: 5});
        const currentMultiverse = userData.multiverses[userData.currentMultiverse];
        if (!currentMultiverse.eventsDone.includes("unlockShipyard")) {
            unlockUIElement(currentMultiverse.UIElementsUnlocked, "pageShipyard");
            notify("And when you have metal, you can make spaceships. Venture forwards into the unknown.");
            currentMultiverse.eventsDone.push("unlockShipyard");
        }
    }
}

export default metalClicker