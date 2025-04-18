import notify from "../notifs/notify.js";
import eventPlayer from "./eventPlayer.js";
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
        addNavigationAttention("Map", "pageMap");
        notify(`A ship has arrived at ${targetObject.name}.`);
        shipInfo.targetObjectId = "player";
        await eventPlayer(shipInfo, userData, choice(genericEvents));
        res();
    });
}

export { arriveAtTarget }