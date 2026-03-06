import { notify } from "./notifs/notify.js";
import { updateResearchButtons } from "./pageUpdates.js";
import { addNavigationAttention } from "./toggleUIElement.js";

const messages = {
    Upgrades: "It's time to start doing things with the energy you've been collecting.",
    Sunscoop: "Flying this close to a star makes you wonder... what if you could scoop up its energy?",
    repairKit: "That ship looks like it could use some patching up. Maybe you can research how?",
    dustbot: "Tired of making dust by hand? Maybe something can help you.",
    statistics: "Perhaps it's useful to check out some information about your world?",
    energyStatistics: "There's more statistics to unlock...",
    factoryShip: "You have explored the whole planet. Go forth and build a factory here. Let your reach grow.",
    antimatterBeamBuilt: "Now go forth into your previous multiverses, and destroy planets for energy.",
}
function unlockResearchForElement(userData, elementId) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    notify(messages[elementId]);
    addNavigationAttention("research", "pageResearch");
    currentMultiverse.researchUnlocked.push(elementId);
    updateResearchButtons(userData);
    currentMultiverse.eventsDone.push(elementId);
}

export default unlockResearchForElement;