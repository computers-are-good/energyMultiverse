import { addDescriptionEvent, currentDescription, removeDescription } from "./addUIDescriptions.js";
import upgrades from "./data/upgrades.js";
import { checkCosts, subtractCosts, writeCostsReadable } from "./itemCosts.js";
const container = document.getElementById("upgradeButtonsContainer");
function drawUpgradeButtons(userData) {
    container.innerHTML = "";
    if (currentDescription === "upgrade") removeDescription();
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    for (const unlocked in currentMultiverse.maxUpgradeTimes) {
        const upgradeInfo = upgrades[unlocked];
        const upgradeTimes = currentMultiverse.upgradeTimes[unlocked] ?? 0;
        const maxUpgradeTimes = currentMultiverse.maxUpgradeTimes[unlocked];

        if (upgradeTimes >= maxUpgradeTimes) continue;

        const upgradeCost = upgradeInfo.cost(upgradeTimes);
        const button = document.createElement("button");
        button.textContent = `${upgradeInfo.name} ${upgradeTimes} / ${maxUpgradeTimes}`;
        addDescriptionEvent(button, {
            content: upgradeInfo.description,
            cost: writeCostsReadable(upgradeCost)   
        }, "upgrade");
        button.addEventListener("click", _ => {
            if (checkCosts(userData, upgradeCost)) {
                subtractCosts(userData, upgradeCost);
                if ("upgradeDone" in upgradeInfo) {
                    upgradeInfo.upgradeDone(userData);
                }
                if (unlocked in currentMultiverse.upgradeTimes) {
                    currentMultiverse.upgradeTimes[unlocked]++;
                } else {
                    currentMultiverse.upgradeTimes[unlocked] = 1;
                }
            }
            drawUpgradeButtons(userData);
        })
        container.appendChild(button);
    }
}

export {drawUpgradeButtons}