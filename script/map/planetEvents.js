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

function getBiomeEvents(userData, planetInfo) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const availableEvents = [];
    biomeSpecificEvents[planetInfo.planetType].forEach(e => {
        if (!currentMultiverse.biomeSpecificEventsDone[planetInfo.planetType].includes(e)) availableEvents.push(e);
    });

    return availableEvents;
}
const globalEventsMilestones = {
    5: "deflectionDriveUnlock"
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
        if (currentMultiverse.statistics.planetsVisited in globalEventsMilestones) {
            eventToDo = globalEventsMilestones[currentMultiverse.statistics.planetsVisited]
        } else if (targetObject.uniqueEvents.length > 0) {
            eventToDo = choice(targetObject.uniqueEvents);
        } else if (targetObject.biomeSpecificEventsAvailable > 0) {
            const availableEvents = getBiomeEvents(userData, targetObject);
            if (availableEvents.length > 0) {
                eventToDo = choice(availableEvents);
            }
        }
        const eventResolved = await eventPlayer(shipInfo, userData, eventToDo);
        if (eventResolved) {
            if (!(currentMultiverse.statistics.planetsVisited in globalEventsMilestones)) {
                if (targetObject.uniqueEvents.length > 0) {
                    removeFromArray(targetObject.uniqueEvents, eventToDo);
                } else if (targetObject.biomeSpecificEventsAvailable > 0) {
                    targetObject.biomeSpecificEventsAvailable--
                    currentMultiverse.biomeSpecificEventsDone[targetObject.planetType].push(eventToDo);
                }
            }
            currentMultiverse.statistics.planetsVisited++;
        }
        res();
    });
}


function getPlanetExplorationLevel(userData, planetInfo) {
        let totalEvents = planetInfo.totalUniqueEvents + planetInfo.totalBiomeSpecificEventsAvailable;
        let eventsDone = planetInfo.totalUniqueEvents - planetInfo.uniqueEvents.length;
        const availableBiomeEvents = getBiomeEvents(userData, planetInfo);
        if (availableBiomeEvents.length < planetInfo.totalBiomeSpecificEventsAvailable) {
            eventsDone += planetInfo.totalBiomeSpecificEventsAvailable - availableBiomeEvents.length;
        }
        return Math.floor((eventsDone / totalEvents) * 100);
}

function getSolarSystemExplorationLevel(userData, systemInfo) {
    let explorationLevels = [];
    const objects = Object.keys(systemInfo.objects);
    for (const object of objects) {
        if (systemInfo.objects[object].type === "planet") {
            explorationLevels.push(getPlanetExplorationLevel(userData, systemInfo.objects[object]));
        }
    }
    return Math.floor(explorationLevels.reduce((a, b) => a + b) / explorationLevels.length);
}

export { arriveAtTarget, getPlanetExplorationLevel, getSolarSystemExplorationLevel }