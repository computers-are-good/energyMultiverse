import notify from "../notifs/notify.js";
import eventPlayer from "./eventPlayer.js";
import {updateEnergyCounter, updateDustCounter, updateMetalCounter, updateResearchButtons} from "../pageUpdates.js"
import { choice } from "../utils.js";
import { addNavigationAttention } from "../toggleUIElement.js";
import notifyUnique from "../notifs/notifyUnique.js";
const genericEvents = [
    "Research Station",
    "Batteries"
]

function arriveAtTarget(shipInfo, userData) { //for use with player ships arriving on planets only
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const currentSystem = currentMultiverse.solarSystems[currentMultiverse.currentSolarSystem];
    const targetObject = currentSystem.objects[shipInfo.targetObjectId];
    return new Promise(async res => {
        if (shipInfo.targetObjectId !== "player") {
            addNavigationAttention("Map", "pageMap");
            notify(`A ship has arrived at ${targetObject.name}.`);
            shipInfo.targetObjectId = "player";
            await eventPlayer(shipInfo, userData, choice(genericEvents));
            res();
        } else {
            shipInfo.isBusy = false;
            shipInfo.inSolarSystem = false;
            let cargoText = ""
            for (let item in shipInfo.cargo) {
                currentMultiverse[item] += shipInfo.cargo[item];
                cargoText += `${shipInfo.cargo[item]} ${item} `;
                shipInfo.cargo[item] = 0;
            }
            updateEnergyCounter(userData);
            updateDustCounter(userData);
            updateMetalCounter(userData);

            if (shipInfo.currentHealth < shipInfo.baseStats.baseHealth && !currentMultiverse.eventsDone.includes("unlockRepairKit")) {
                notifyUnique("unlockRepairKit");
                addNavigationAttention("Research", "pageResearch");
                currentMultiverse.researchUnlocked.push("repairKit");
                updateResearchButtons(userData);
                currentMultiverse.eventsDone.push("unlockRepairKit");
            }

            notify(`A ship has returned ${cargoText ? `carrying ${cargoText}` : ""}`);
            res()
        }
    });
}

export {arriveAtTarget}