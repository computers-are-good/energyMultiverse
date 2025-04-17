import notify from "../notifs/notify.js";
import eventPlayer from "./eventPlayer.js";
import {updateEnergyCounter, updateDustCounter} from "../pageUpdates.js"
import { choice } from "../utils.js";
import { addNavigationAttention } from "../toggleUIElement.js";
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
            }
            updateEnergyCounter(userData);
            updateDustCounter(userData);

            notify(`A ship has returned ${cargoText ? `carrying ${cargoText}` : ""}`);
            res()
        }
    });
}

export {arriveAtTarget}