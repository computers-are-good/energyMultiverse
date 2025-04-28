import { addDescriptionEvent, removeDescription } from "../addUIDescriptions.js"
import research from "../data/researchData.js"
import notify from "../notifs/notify.js";
import { updateResearchButtons, updateResearchPoints } from "../pageUpdates.js";
import { removeFromArray } from "../utils.js";

function addResearchDescription(element, researchId, userData) {
    addDescriptionEvent(element, {
        cost: {researchPoints: research[researchId].cost.points},
        content: `${research[researchId].description}`
    }, userData);
}
function doResearch(userData, researchId) {
    const researchInfo = research[researchId];
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    if (currentMultiverse.researchPoints >= researchInfo.cost.points) {
        currentMultiverse.researchPoints -= researchInfo.cost.points;
        removeFromArray(currentMultiverse.researchUnlocked, researchId);
        currentMultiverse.researchCompleted.push(researchId);
        if (researchInfo.complete) researchInfo.complete(userData);
        updateResearchButtons(userData);
        removeDescription();
        updateResearchPoints(userData);
    } else {
        notify("Not enough research points.")
    }
}
export {addResearchDescription, doResearch}