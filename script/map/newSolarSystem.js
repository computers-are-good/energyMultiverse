import { notify } from "../notifs/notify.js";
import { choice } from "../utils.js"

const planetNames = [
    "Help me",
    "Calculus is hard",
    "Eternal Calculus",
    "WTRENG SUKZ balls",
    "AAAAAAAAAA",
    "Please come back",
    "Why",
    "Just why??",
    "Zipzorb"
];
const starNames = [
    "Yatvas VII",
    "Urium III",
    "Solabs",
    "Huatrs",
    "Trasbes"
];
const planetNumbers = {
    "Desert": 2,
    "Temperate": 3,
    "Ocean": 4,
    "Warm": 4,
    "Living": 1, //TODO: Add something cool for the living planet
    "Paradise": 7,
    "Ice": 6,
    "Gas": 12,
    "Volcanic": 13,
    "Diamond": 7,
    "Barren": 10,
    "Intrarelativistic": 5,
    "Exotic": 4,
    "White": 3,
};
const planetColours = {
    "Desert": "#db711a",
    "Temperate": "#49ed64",
    "Ocean": "#495fed",
    "Warm": "#ed9099",
    "Living": "#00ff00ff",
    "Paradise": "#14c90e",
    "Ice": "#0e59c9",
    "Gas": "#d39ab1",
    "Volcanic": "#ed2a2a",
    "Diamond": "#5b69e5",
    "Barren": "#444444",
    "Intrarelativistic": "#f22979",
    "Exotic": "#29f294",
    "White": "#f7fcfc",
}
const guaranteedSpawns = [
    {
        i: 1,
        j: 2,
        spawns: {
            Temperate: 2,
            Ocean: 1
        }
    },
    {
        i: 2,
        j: 1,
        spawns: {
            Warm: 1
        }
    }
]

const tieredPlanets = {
    1: ["Desert", "Temperate", "Ocean", "Warm"],
    2: ["Paradise", "Ice", "Living"],
    3: ["Gas", "Volcanic"],
    4: ["Diamond", "Barren"],
    5: ["Intrarelativistic", "Exotic"],
    6: ["White"]
}

// If you have to work with this function, I'm sorry.
// I don't know how this function works, even though I just wrote it.
function generateAllSystems(multiverse) {
    multiverse.solarSystems = [];
    let solarSystemsMade = 0;
    const planetsSpawned = {
        "Desert": 0,
        "Temperate": 0,
        "Ocean": 0,
        "Living": 0,
        "Warm": 0,
        "Paradise": 0,
        "Ice": 0,
        "Gas": 0,
        "Volcanic": 0,
        "Diamond": 0,
        "Barren": 0,
        "Intrarelativistic": 0,
        "Exotic": 0,
        "White": 0,
    }

    const countOfTierSystemsWithoutPlanets = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0
    };
    const systemTiersCount = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
    }
    // Our first iteration of loops does everything EXCEPT spawning in the planets.
    for (let i = 1; i < 8; i++) {
        for (let j = 1; j < 6; j++) {
            solarSystemsMade++;
            let x = i * 100 - 100 + Math.floor(Math.random() * 200);
            let y = j * 100 - 100 + Math.floor(Math.random() * 200);
            for (const system of multiverse.solarSystems) {
                while (Math.abs(system.galaxyX - x) + Math.abs(system.galaxyY - y) < 50) {
                    x = i * 100 - 100 + Math.floor(Math.random() * 250);
                    y = j * 100 - 100 + Math.floor(Math.random() * 250);
                }
            }
            countOfTierSystemsWithoutPlanets[Math.floor((i + j) / 2)]++
            systemTiersCount[Math.floor((i + j) / 2)]++
            const systemTier = Math.floor((i + j) / 2); // A system tier is how elusive a solar system is. Higher tier systems have better rewards and stronger enemies. 
            const dangerLevel = systemTier * 2 + Math.floor(Math.random() * 5); // Base difficulty on system tier, but add a bit of randomness.
            const solarSystem = {
                name: choice(starNames),
                objects: {},
                starSize: 9,
                dangerLevel: dangerLevel,
                galaxyX: x,
                galaxyY: y,
                tier: systemTier,
                timeUntilHostileSpawn: 99,
                isBlackHoleSystem: false,

            }
            // Spawn in the player
            const distanceToStar = Math.random() * 100 + 259;
            const theta = Math.random() * Math.PI * 2;
            solarSystem.objects.player = {
                type: "player",
                color: "white",
                posX: distanceToStar * Math.cos(theta) + 375,
                posY: distanceToStar * Math.sin(theta) + 375
            }
            multiverse.solarSystems.push(solarSystem);

        }
    }
    
    // When randomly generating planets, guaranteed planets should take away from the total list of planets to generate
    guaranteedSpawns.forEach(e => {
        for (const type in e.spawns) {
            planetsSpawned[type] += e.spawns[type]
        }
    })

    let systemNumber = 0; // We are working with the systemNumber-th solar system in the big multiverse.solarSystems array

    for (let i = 1; i < 8; i++) { // Our second loop decides how many planets each solar system should have.
        for (let j = 1; j < 6; j++) {
            const solarSystem = multiverse.solarSystems[systemNumber];
            let numberOfPlanetsSpawned = 0;
            let numberOfPlanetsInSystem = 0; // This many planets will be spawned in the solar system.
            const systemTier = Math.floor((i + j) / 2); // This uses the same formula as the first loop.
            const systemTiersLeft = countOfTierSystemsWithoutPlanets[systemTier]; // This keeps track of how many solar systems of the same tier has no planets.

            // Keep track of how many planet types we have to spawn in ALL solar systems
            const planetTypesLeftToSpawn = {}
            const planetsToSpawnInThisSystem = {} // Lists all the planet types, and their quantities, we need to spawn in this solar system.

            // And keep track of the total amount of planet types we have not spawned
            for (let k in tieredPlanets[systemTier]) {
                const planetType = tieredPlanets[systemTier][k];
                planetTypesLeftToSpawn[planetType] = planetNumbers[planetType] - planetsSpawned[planetType];
            }

            // populate planetsToSpawnInThisSystem with 0 values
            for (let planetType in planetTypesLeftToSpawn) {
                planetsToSpawnInThisSystem[planetType] = 0;
            }

            // First, spawn in any GUARANTEED planet spawns
            for (const k in guaranteedSpawns) {
                const spawnConfig = guaranteedSpawns[k];
                if (spawnConfig.i === i && spawnConfig.j === j) {
                    for (const type in spawnConfig.spawns) {
                        const number = spawnConfig.spawns[type];
                        planetsToSpawnInThisSystem[type] += number;
                        numberOfPlanetsInSystem += number;
                    }
                }
            }


            // Spawn a random amount of planets that is close to the average, but with some variation, for each planet type we have left to spawn.

            for (let planetType in planetTypesLeftToSpawn) {
                let countOfType; // How many planets of this type we are going to spawn in THIS solar system.
                if (systemTiersLeft > 1) {
                    const avgNumberOfPlanets = planetTypesLeftToSpawn[planetType] / systemTiersCount[systemTier];
                    const variance = (Math.random() * 0.7) * planetTypesLeftToSpawn[planetType] / systemTiersLeft;
                    countOfType = Math.floor(avgNumberOfPlanets + variance); // How many planets of this type we are spawning
                    if (countOfType > 4) countOfType = 4; // Maximum of 4 planets of same type in solar system
                    if (countOfType > planetTypesLeftToSpawn[planetType]) {
                        countOfType = planetTypesLeftToSpawn[planetType]
                    }
                } else {
                    countOfType = planetTypesLeftToSpawn[planetType];
                }
                if (countOfType > 0) {
                    planetsSpawned[planetType] += countOfType;
                    planetsToSpawnInThisSystem[planetType] += countOfType;
                    numberOfPlanetsInSystem += countOfType;
                }
            }

            // Hard code in a limit. Max 6 planets in a solar system. Only applies if it's not on the last "guaranteeing" solar system.
            if (systemTiersLeft > 1 && numberOfPlanetsInSystem > 6) {
                let iterationTimes = numberOfPlanetsInSystem - 6
                for (let i = 0; i < iterationTimes; i++) {
                    let maxKey = Object.keys(planetsToSpawnInThisSystem)[0];
                    let maxValue = planetsToSpawnInThisSystem[maxKey];
                    for (const planetType in planetsToSpawnInThisSystem) {
                        if (planetsToSpawnInThisSystem[planetType] > maxValue) {
                            maxKey = planetType;
                            maxValue = planetsToSpawnInThisSystem[planetType];
                        }
                    }
                    planetsToSpawnInThisSystem[maxKey]--;
                    planetsSpawned[maxKey]--;
                    numberOfPlanetsInSystem--;
                }
            }

            // Actually spawn the new planet types in this system.
            if (numberOfPlanetsInSystem === 0 || systemTier === 6) { // A system with no planets in it, or a tier 6 system, is a black hole system.
                solarSystem.isBlackHoleSystem = true;
            }
            const arrOfTypes = [];
            for (const type in planetsToSpawnInThisSystem) {
                let count = planetsToSpawnInThisSystem[type];
                for (let k = 0; k < count; k++) {
                    arrOfTypes.push(type);
                }
            }

            while (arrOfTypes.length > 0) {
                const randomInt = Math.floor(Math.random() * arrOfTypes.length);
                solarSystem.objects[1000 + numberOfPlanetsSpawned + 1] = newPlanet(numberOfPlanetsSpawned, arrOfTypes[randomInt], systemNumber, systemTier);
                
                if (systemNumber == 1) console.log(i, j)

                numberOfPlanetsSpawned++
                arrOfTypes.splice(randomInt, 1);
            }

            if (j === 2 && i === 1) { // Special events that exist only on specific planets.
                const chosenPlanet = solarSystem.objects[choice(Object.keys(solarSystem.objects).filter(e => solarSystem.objects[e].type === "planet"))];
                chosenPlanet.uniqueEvents.push("unlockFabribot");
                chosenPlanet.totalUniqueEvents++;
            }
            countOfTierSystemsWithoutPlanets[systemTier]--;
            systemNumber++;
        }
    }
    validatePlanetCount(multiverse.solarSystems);
}
function validatePlanetCount(allSolarSystems) {
    const planetTypesCount = {
        "Desert": 0,
        "Living": 0,
        "Temperate": 0,
        "Ocean": 0,
        "Warm": 0,
        "Paradise": 0,
        "Ice": 0,
        "Gas": 0,
        "Volcanic": 0,
        "Diamond": 0,
        "Barren": 0,
        "Intrarelativistic": 0,
        "Exotic": 0,
        "White": 0
    }
    for (const system of allSolarSystems) {
        for (const systemCount in system.objects) {
            const object = system.objects[systemCount];
            if (object.type === "planet") {
                planetTypesCount[object.planetType]++
            }
        }
    }
    let validGeneratedResult = true;
    for (const type in planetTypesCount) {
        if (planetTypesCount[type] != planetNumbers[type]) {
            console.error(`Differing counts for planet type ${type}! Expected ${planetNumbers[type]} but got ${planetTypesCount[type]}!`);
            validGeneratedResult = false;
        }
    }
    for (const event in uniqueEventsAssigned) {
        if (!uniqueEventsAssigned[event]) {
            console.error(`Unique event ${event} is not assigned to a planet. This may impact progression.`);
            validGeneratedResult = false;
        }
    }

    if (!validGeneratedResult) {
        notify("Invalid solar system generated! You should not be seeing this.");
    }
}
const uniqueEventsAssigned = {
    solarPanels1: false,
    unlockRadar: false,
}
function newPlanet(planetCount, planetType, solarSystemsMade, solarSystemTier) {
    if (solarSystemsMade == 1) {
        console.log(planetType)
    }
    const uniqueEvents = [];
    const biomeSpecificEventsAvailable = 2;

    if (planetCount === 0 && solarSystemsMade === 1) {
        uniqueEvents.push("Warp Drive");
    }
    if (planetType === "Ocean" && solarSystemsMade === 1 && !uniqueEventsAssigned.solarPanels1) {
        uniqueEvents.push("solarPanels1");
        uniqueEventsAssigned.solarPanels1 = true;
    }
    if (planetType === "Warm" && solarSystemsMade === 5 && !uniqueEventsAssigned.unlockRadar) {
        uniqueEvents.push("unlockRadar");
        uniqueEventsAssigned.unlockRadar = true;
    }
    const factoryMultipliers = {
        energy: Math.floor(Math.random() * 15) + 1,
        dust: Math.floor(Math.random() * 10) + 1,
        metal: Math.floor(Math.random() * 8) + 1
    }
    const newPlanet = {
        type: "planet",
        planetType,
        color: planetColours[planetType],
        name: choice(planetNames),
        radius: Math.floor(Math.random() * 5) + 8,
        theta: Math.PI * Math.random(),
        orbitalRadius: 40 * planetCount + 80,
        antimatterBeamEnergyReq: Math.floor((Math.random() * 0.3 + 0.85) * 1000 * solarSystemTier),
        antimatterBeamEnergyYield: Math.floor((Math.random() * 0.3 + 0.85) * 6000 * solarSystemTier),
        uniqueEvents,
        totalUniqueEvents: uniqueEvents.length,
        biomeSpecificEventsAvailable,
        totalBiomeSpecificEventsAvailable: biomeSpecificEventsAvailable,
        factoryMultipliers,
    }
    return newPlanet;
}
export default generateAllSystems;