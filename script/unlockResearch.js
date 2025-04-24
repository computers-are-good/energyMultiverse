import notifyUnique from "./notifs/notifyUnique.js";
import { updateResearchButtons } from "./pageUpdates.js";
import { addNavigationAttention } from "./toggleUIElement.js";

function unlockResearchForElement(userData, elementId) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    notifyUnique(elementId);
    addNavigationAttention("research", "pageResearch");
    currentMultiverse.researchUnlocked.push(elementId);
    updateResearchButtons(userData);
    currentMultiverse.eventsDone.push(elementId);
}

export default unlockResearchForElement;