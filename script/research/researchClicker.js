import { manualDescriptionUpdate, currentDescription } from "../addUIDescriptions.js";
import { updateResearchRate } from "../pageUpdates.js";

function changeResearchRate(userData, increment) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
        currentMultiverse.researchRate += increment;

    updateResearchRate(userData);
}
function increaseResearchRate(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    if (currentMultiverse.researchRate < currentMultiverse.maxResearchRate)
        changeResearchRate(userData, 1);
}
function decreaseResearchRate(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    if (currentMultiverse.researchRate > 0)
        changeResearchRate(userData, -1);
}
function showResearchProgress(userData, x, y) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    manualDescriptionUpdate({
        content: `${currentMultiverse.progressUntilResearchPoint} / ${currentMultiverse.energyUntilResearchPoint} until next research point.`
    }, x, y, "researchBar");
}

export {increaseResearchRate, decreaseResearchRate, showResearchProgress}