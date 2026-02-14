import {notify} from "../notifs/notify.js"
import eventPlayer from "./eventPlayer.js";
import { choice, removeFromArray } from "../utils.js";
import { addNavigationAttention } from "../toggleUIElement.js";
import notifyUnique from "../notifs/notifyUnique.js";
const genericEvents = [
    "Research Station",
    "Asteroid",
    "Battery"
]
const biomeSpecificEvents = {
    "Desert": [
        "Harvest Sand",
        "solarPanels2"
    ],
    "Temperate": [
        "Batteries",
        "palmTree",
        "literallyJustGetMetal",
        "scanner"
    ],
    "Ocean": [
        "ancientPonderer",
    ],
    "Warm": [
        "cloakingDevice"
    ],
    "Paradise": [],
    "Ice": [
        "unlockRepairSwarm"
    ],
    "Gas": ["turret"],
    "Volcanic": ["gradientDriveUnlock"],
    "Diamond": [],
    "Barren": [],
    "Intrarelativistic": [],
    "Exotic": [],
    "White": [],
}

function getBiomeEvents(userData, planetInfo) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const availableEvents = [];
    biomeSpecificEvents[planetInfo.planetType].forEach(e => {
        if (!currentMultiverse.biomeSpecificEventsDone[planetInfo.planetType].includes(e)) availableEvents.push(e);
    });

    return availableEvents;
}

const storyEvents = {
    10: "story1",
    15: "story2",
    18: "story3",
    22: "story4",
    25: "story5",
    27: "story6",
    28: "story7",
    32: "story8",
    35: "story9",
    36: "story10"
}

const globalEventsMilestones = {
    5: "deflectionDriveUnlock",
    8: "fasterShips",
}

function arriveAtTarget(shipInfo, userData) { 
    // For use with player ships arriving on planets only
    // This function selects an event for the player, plays the event, and 
    // sets the destination for the player ship back to the mothership.
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const currentSystem = currentMultiverse.solarSystems[currentMultiverse.currentSolarSystem];
    const targetObject = currentSystem.objects[shipInfo.targetObjectId];

    return new Promise(async res => {
        addNavigationAttention("Map", "pageMap");
        notify(`A ship has arrived at ${targetObject.name}.`);
        let eventToDo = choice(genericEvents);
        let totalPlanetsVisitedAllMultiverses = 0;
        userData.multiverses.forEach(e => totalPlanetsVisitedAllMultiverses += e.statistics.planetsVisited);

        // Event priority: Constants below are listed in order of event priority.
        // Events at the top have the highest priority.
        // If there is a story event and a unique event available, the story event will be shown
        // as it is the "first" event and thus the highest priority.

        // First we will show events present in the event queue.
        // The event queue stores global events that may have been overriden by story events.
        const eventQueueFull = currentMultiverse.eventQueue.length > 0
        // Events relevant to the story, will only be shown once in ALL multiverses
        const storyEventAvailable = totalPlanetsVisitedAllMultiverses in storyEvents;
        const storyEvent = storyEvents[totalPlanetsVisitedAllMultiverses];
        // Events unlocked after a certain amount of planets are visited, 
        const globalEventAvailable = currentMultiverse.statistics.planetsVisited in globalEventsMilestones;
        const globalEvent = globalEventsMilestones[currentMultiverse.statistics.planetsVisited];
        // Events unique on for a specific planet
        const uniqueEventAvailable = targetObject.uniqueEvents.length > 0;
        // Events unique for a specific biome the planet has.
        const biomeSpecificEventsAvailable = targetObject.biomeSpecificEventsAvailable > 0;
        // If no "special" events are available, we will show a generic event.
    
        if (eventQueueFull) {
            eventToDo = currentMultiverse.eventQueue[0];
        } else if (storyEventAvailable) {
            eventToDo = storyEvent;
            if (globalEventAvailable) {
                currentMultiverse.eventQueue.push(globalEvent);
            }
        } else if (globalEventAvailable) {
            eventToDo = globalEvent;
        } else if (uniqueEventAvailable) {
            eventToDo = choice(targetObject.uniqueEvents);
        } else if (biomeSpecificEventsAvailable) {
            const availableEvents = getBiomeEvents(userData, targetObject);
            if (availableEvents.length > 0) {
                eventToDo = choice(availableEvents);
            }
        }

        //If an event is resolved, it is finished and can be safely removed from the potential events pool.
        const eventResolved = await eventPlayer(shipInfo, userData, eventToDo);
        shipInfo.targetObjectId = "player";
        if (eventResolved) {
            if (!(currentMultiverse.statistics.planetsVisited in globalEventsMilestones)) {
                if (eventQueueFull) { //Done the events in event queue, now remove it
                    currentMultiverse.eventQueue.shift();
                } else if (uniqueEventAvailable) {
                    removeFromArray(targetObject.uniqueEvents, eventToDo);
                } else if (biomeSpecificEventsAvailable) {
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
    // A solar system with no planets is 100% explored by default
    return explorationLevels.length > 0 ? Math.floor(explorationLevels.reduce((a, b) => a + b) / explorationLevels.length) : 100;
}

export { arriveAtTarget, getPlanetExplorationLevel, getSolarSystemExplorationLevel }