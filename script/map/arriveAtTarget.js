import notify from "../notifs/notify.js";
import eventPlayer from "./eventPlayer.js";
import { choice, removeFromArray } from "../utils.js";
import { addNavigationAttention } from "../toggleUIElement.js";
import notifyUnique from "../notifs/notifyUnique.js";
const genericEvents = [
    "Research Station",
    "Batteries"
]
const biomeSpecificEvents = {
    "Desert": ["Harvest Sand"],
    "Temperate": [],
    "Ocean": [],
    "Warm": [],
    "Paradise": [],
    "Ice": [],
    "Gas": [],
    "Volcanic": [],
    "Diamond": [],
    "Barren": [],
    "Intrarelativistic": [],
    "Exotic": [],
    "Black": [],
}

function arriveAtTarget(shipInfo, userData) { //for use with player ships arriving on planets only
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const currentSystem = currentMultiverse.solarSystems[currentMultiverse.currentSolarSystem];
    const targetObject = currentSystem.objects[shipInfo.targetObjectId];

    targetObject.biomeSpecificEventsAvailable = 999;
    return new Promise(async res => {
        addNavigationAttention("Map", "pageMap");
        notify(`A ship has arrived at ${targetObject.name}.`);
        shipInfo.targetObjectId = "player";
        let eventToDo = choice(genericEvents);
        if (targetObject.uniqueEvents.length > 0) {
            eventToDo = choice(targetObject.uniqueEvents);
        } else if (targetObject.biomeSpecificEventsAvailable > 0) {
            const availableEvents = [];
            biomeSpecificEvents[targetObject.planetType].forEach(e => {
                if (!currentMultiverse.biomeSpecificEventsDone[targetObject.planetType].includes(e)) availableEvents.push(e);
            });
            if (availableEvents.length > 0) {
                eventToDo = choice(availableEvents);
            }
        }
        const eventResolved = await eventPlayer(shipInfo, userData, eventToDo);
        if (eventResolved) {
            if (targetObject.uniqueEvents.length > 0) {
                removeFromArray(targetObject.uniqueEvents, eventToDo);
            } else if (targetObject.biomeSpecificEventsAvailable > 0) {
                targetObject.biomeSpecificEventsAvailable--
                currentMultiverse.biomeSpecificEventsDone[targetObject.planetType].push(eventToDo);
            }   
        }
        res();
    });
}

export { arriveAtTarget }