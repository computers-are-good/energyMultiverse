import { checkCosts, subtractCosts } from "../itemCosts.js";
import {notify} from "../notifs/notify.js"
import notifyUnique from "../notifs/notifyUnique.js";
import { addNavigationAttention } from "../toggleUIElement.js";
import { drawUpgradeButtons } from "../upgrades.js";

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
        currentMultiverse.statistics.missilesBuilt++;
        subtractCosts(userData, costs.missile);
        if (currentMultiverse.statistics.missilesBuilt > 5) {
            if (!currentMultiverse.eventsDone.includes("missileUpgrades")) {
                currentMultiverse.maxUpgradeTimes.missileDamage = 10;
                addNavigationAttention("upgrades", "pageUpgrades");
                drawUpgradeButtons(userData);
                currentMultiverse.eventsDone.push("missileUpgrades");
                notifyUnique("missileDamage");
            }
        }
    }
}

function makeRepairKit(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    if (checkCosts(userData, costs.repairKit)) {
        currentMultiverse.repairKit++;
        subtractCosts(userData, costs.repairKit);
    }
}

export {
    makeMissile,
    makeRepairKit
};