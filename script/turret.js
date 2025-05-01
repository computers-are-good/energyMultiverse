import { checkCosts, subtractCosts } from "./itemCosts.js";
import { addNavigationAttention } from "./toggleUIElement.js";
import { drawUpgradeButtons } from "./upgrades.js";

const turretCost = {
    energy: 500,
    dust: 50,
    metal: 10,
    iridium: 10
}
function toggleTurret(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    if (currentMultiverse.turret.unlocked) {
        currentMultiverse.turret.enabled = !currentMultiverse.turret.enabled;
        if (currentMultiverse.turret.enabled) {
            document.getElementById("turretStatus").textContent = "Starting";
        }
    }

    updateTurret(userData);
}

function buildTurret(userData) {
    if (checkCosts(userData, turretCost)) {
        subtractCosts(userData, turretCost);
        const currentMultiverse = userData.multiverses[userData.currentMultiverse];
        currentMultiverse.turret.built = true;
        currentMultiverse.maxUpgradeTimes.turretCharge = 15;
        addNavigationAttention("Upgrades", "pageUpgrades");
        drawUpgradeButtons(userData);
        currentMultiverse.turret.enabled = false;
        updateTurret(userData);
    }
}

function updateTurret(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    if (currentMultiverse.turret.built) {
        document.getElementById("buildTurret").style.display = "none";
        document.getElementById("turretControls").style.display = "block";
        document.getElementById("toggleTurret").textContent = `${currentMultiverse.turret.enabled ? "Disable turret" : "Enable turret"}`;
    } else {
        document.getElementById("turretControls").style.display = "none";
    }
}

export { updateTurret, toggleTurret, buildTurret }