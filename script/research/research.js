import notifyUnique from "../notifs/notifyUnique.js";
import { updateEnergyCounter, updateResearchBar, updateResearchButtons, updateResearchPoints } from "../pageUpdates.js";
import { useEnergy } from "../resources/useResources.js";

function updateResearch(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const researchToAdd = Math.min(currentMultiverse.researchRate, currentMultiverse.energy);
    useEnergy(userData, researchToAdd);
    currentMultiverse.progressUntilResearchPoint += researchToAdd;

    if (currentMultiverse.progressUntilResearchPoint >= currentMultiverse.energyUntilResearchPoint) {
        if (!currentMultiverse.eventsDone.includes("researchTooSlow")) {
            notifyUnique("researchTooSlow");
            currentMultiverse.researchUnlocked.push("Faster Research");
            updateResearchButtons(userData);
            currentMultiverse.eventsDone.push("researchTooSlow");
        }
        currentMultiverse.progressUntilResearchPoint = 0;
        currentMultiverse.researchPoints++;
        updateResearchPoints(userData);
    }
    updateResearchBar(userData);
    updateEnergyCounter(userData);
}
export default updateResearch