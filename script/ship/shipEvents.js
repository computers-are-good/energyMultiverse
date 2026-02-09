import { shipAccessories } from "../data/shipData.js";
import {notify} from "../notifs/notify.js"
import notifyUnique from "../notifs/notifyUnique.js";
import { updateEnergyCounter, updateShipConstruction, updateShipConstructionBar } from "../pageUpdates.js";
import { useEnergy } from "../resources/useResources.js";
import { addNavigationAttention, unlockUIElement } from "../toggleUIElement.js";

function buildShip(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const currentShip = currentMultiverse.shipInProgress;
    if (Object.keys(currentShip).length > 0) {
        const progress = Math.min(currentMultiverse.currentShipBuildingRate, currentMultiverse.energy);
        useEnergy(userData, progress);
        currentShip.energySpent += progress;
    
        if (currentShip.energySpent >= currentShip.energyCostTotal) {
            const shipInfo = currentShip.shipInfo;
            addNavigationAttention("Shipyard", "pageShipyard");
            notify(`Your ${shipInfo.class} has finished construction.`);
            document.getElementById("shipToBuildInfo").style.display = "none";
            shipInfo.currentHealth = shipInfo.baseStats.baseHealth;
            shipInfo.posX = 0;
            shipInfo.poxY = 0;
            shipInfo.inSolarSystem = false;
            shipInfo.isBusy = false;
            shipInfo.targetObjectId = 0;
            shipInfo.cargo = {};
            currentMultiverse.ships.push(shipInfo);
            currentMultiverse.shipInProgress = {};
            const accessories = currentShip.shipInfo.accessories;
            accessories.forEach(e => {
                if (shipAccessories[e].onComplete) {
                    shipAccessories[e].onComplete(userData, currentShip.shipInfo);
                }
            });

            currentMultiverse.statistics.shipsBuilt++;

            if (accessories.includes("Cloaking Device")) {
                shipInfo.makeDivDim = false;
            }

            if (!currentMultiverse.eventsDone.includes("firstShip")){
                notifyUnique("firstShip");
                unlockUIElement(currentMultiverse.UIElementsUnlocked, "pageMap");
                currentMultiverse.eventsDone.push("firstShip");
            } else {
                notify(`Finsihed building ${currentShip.shipInfo.class}.`);
            }
            updateShipConstruction(userData);
        }
        updateShipConstructionBar(userData);
        updateEnergyCounter(userData);
    }
}

function increaseBuildRate(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    if (currentMultiverse.currentShipBuildingRate < currentMultiverse.maxShipBuildingRate) {
        currentMultiverse.currentShipBuildingRate++;
    }
    updateShipConstructionBar(userData);
}
function decreaseBuildRate(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    if (currentMultiverse.currentShipBuildingRate > 0) {
        currentMultiverse.currentShipBuildingRate--;
    }
    updateShipConstructionBar(userData);
}

export {
    buildShip,
    increaseBuildRate,
    decreaseBuildRate
}