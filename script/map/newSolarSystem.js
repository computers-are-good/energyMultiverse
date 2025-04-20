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
function generateAllSystems(multiverse) {
    let solarSystemsMade = 0;
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
            const systemTier = Math.floor((i + j) / 2);
            const dangerLevel = systemTier * 2 + Math.floor(Math.random() * 5);
            const solarSystem = {
                name: choice(starNames),
                objects: {},
                starSize: 10,
                dangerLevel: dangerLevel,
                galaxyX: x,
                galaxyY: y,
                tier: systemTier,
                timeUntilHostileSpawn: 100
            }
            let planetCount = 0;
            for (let i = 0; i < Math.random() * 2 + systemTier + 1; i++) {
                let newID = Math.floor(Math.random() * 10000)
                while (newID in solarSystem.objects) {
                    newID = Math.floor(Math.random() * 10000);
                }
                solarSystem.objects[newID] = newPlanet(planetCount, systemTier, solarSystemsMade);
                planetCount++
            }
            solarSystem.objects.player = {
                type: "player",
                color: "white",
                posX: Math.random() * 400 - 200 + 375,
                posY: Math.random() * 400 - 200 + 375
            }
            multiverse.solarSystems.push(solarSystem);
        }
    }

}

const planetPity = {
    "Desert": 0,
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
    "Black": 0,
};
const planetColours = {
    "Desert": "#db711a",
    "Temperate": "#49ed64",
    "Ocean": "#495fed",
    "Warm": "#ed9099",
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

const tieredPlanets = {
    1: ["Desert", "Temperate", "Ocean", "Warm"],
    2: ["Paradise", "Ice"],
    3: ["Gas", "Volcanic"],
    4: ["Diamond", "Barren"],
    5: ["Intrarelativistic", "Exotic"],
    6: ["White"]
}
function newPlanet(planetCount, solarSystemTier, solarSystemsMade) {
    const uniqueEvents = [];
    const biomeSpecificEventsAvailable = 2;

    const availablePlanetTypes = [];
    for (let i = 1; i <= solarSystemTier; i++) {
        tieredPlanets[i].forEach(e => availablePlanetTypes.push(e));
    }
    let planetType = choice(availablePlanetTypes);
    for (const type in planetPity) {
        if (!(type in availablePlanetTypes)) continue;
        const maxPity = type === "Diamond" ? 20 : 10;
        if (planetPity[type] > maxPity) {
            planetType = type;
            break;
        }
    }
    for (const planet of availablePlanetTypes) {
        if (planet !== planetType) planetPity[planet]++
    }
    if (solarSystemTier === 6) planetType = "White";
    planetPity[planetType] = 0;

    if (planetCount === 0 && solarSystemsMade === 1) {
        uniqueEvents.push("Warp Drive");
    }
    if (planetCount === 2 && solarSystemsMade === 1) {
        uniqueEvents.push("solarPanels1");
        planetType = "Paradise";
    }
    const newPlanet = {
        type: "planet",
        planetType,
        color: planetColours[planetType],
        name: choice(planetNames),
        radius: Math.floor(Math.random() * 5) + 8,
        theta: Math.PI * Math.random(),
        orbitalRadius: 40 * planetCount + 80,
        uniqueEvents,
        totalUniqueEvents: uniqueEvents.length,
        biomeSpecificEventsAvailable,
        totalBiomeSpecificEventsAvailable: biomeSpecificEventsAvailable
    }
    return newPlanet;
}
export default generateAllSystems;