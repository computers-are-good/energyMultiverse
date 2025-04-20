import { unlockUIElement } from "../toggleUIElement.js";
import notifyUnique from "../notifs/notifyUnique.js"
import { checkCosts, subtractCosts } from "../itemCosts.js";
import { gainMetal } from "./gainResources.js";

function metalClicker(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    makeMetal(userData);
    unlockUIElement(currentMultiverse.UIElementsUnlocked, "dustCounter");
}

function makeMetal(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    if (checkCosts(userData, {energy: 30, dust: 5})) {
        gainMetal(userData, 1);
        subtractCosts(userData, {energy: 30, dust: 5});
    }
}

export default metalClicker