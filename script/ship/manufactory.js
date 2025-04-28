import { checkCosts, subtractCosts } from "../itemCosts.js";
import notify from "../notifs/notify.js";
import { updateEnergyCounter, updateMetalCounter } from "../pageUpdates.js";

const costs = {
    missile: {
        energy: 50,
        metal: 5
    },
    repairKit: {
        metal: 3
    }
}

function makeMissile(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    if (checkCosts(userData, costs.missile)) {
        notify("Created missile.");
        currentMultiverse.missiles++;
        subtractCosts(userData, costs.missile);
        updateMetalCounter(userData);
        updateEnergyCounter(userData);
    }
}

function makeRepairKit(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    if (checkCosts(userData, costs.repairKit)) {
        currentMultiverse.repairKit++;
        subtractCosts(userData, costs.repairKit);
        updateMetalCounter(userData);
    }
}

export {
    makeMissile,
    makeRepairKit
};