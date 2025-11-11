import { checkCosts, subtractCosts } from "../itemCosts.js";
import { notify } from "../notifs/notify.js"
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
    },
    driveCell: {
        iridium: 1,
        metal: 5,
        dust: 10
    }
}

const itemNameMappings = {
    missile: "Missile",
    repairKit: "Repair kit",
    driveCell: "Drive cell"
}

function makeMissile(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    if (checkCosts(userData, costs.missile)) {
        notify("Created missile.");
        console.log(currentMultiverse.manufactoryItems)
        currentMultiverse.manufactoryItems.missile++;
        currentMultiverse.statistics.missilesBuilt++;
        subtractCosts(userData, costs.missile);
        updateInventoryDisplay(userData);
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

function simpleItemMaker(userData, itemName) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    if (checkCosts(userData, costs[itemName])) {
        currentMultiverse.manufactoryItems[itemName]++;
        subtractCosts(userData, costs[itemName]);
        updateInventoryDisplay(userData);
    }
}
function manufactoryUnlockItem(userData, itemName) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    currentMultiverse.manufactoryItemsUnlocked.push(itemName);
    updateManufactoryButtons(userData);
}
function updateManufactoryButtons(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    document.querySelectorAll("#manufactoryItems button").forEach(e => {
        e.style.display = "none";
    });
    currentMultiverse.manufactoryItemsUnlocked.forEach(e => {
        document.querySelector(`#manufactoryItems .${e}`).style.display = "block";
    });
}
function updateInventoryDisplay(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    document.querySelectorAll("#manufactoryInventory li").forEach(e => {
        e.style.display = "none";
    });
    currentMultiverse.manufactoryItemsUnlocked.forEach(e => {
        const el = document.querySelector(`#manufactoryInventory .${e}`);
        el.style.display = "block";
        el.textContent = `${itemNameMappings[e]}: ${currentMultiverse.manufactoryItems[e]}`;
    })
}
export {
    makeMissile,
    simpleItemMaker,
    manufactoryUnlockItem,
    updateManufactoryButtons,
    updateInventoryDisplay
};