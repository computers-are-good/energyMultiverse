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
]
function generateAllSystems(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    for (let i = 1; i < 8; i++) {
        for (let j = 1; j < 6; j++) {
            let x = i * 100 - 100 + Math.floor(Math.random() * 200);
            let y = j * 100 - 100 + Math.floor(Math.random() * 200);
            for (const system of currentMultiverse.solarSystems) {
                while (Math.abs(system.galaxyX - x) + Math.abs(system.galaxyY - y) < 50) {
                    x = i * 100 - 100 + Math.floor(Math.random() * 250);
                    y = j * 100 - 100 + Math.floor(Math.random() * 250);
                } 
            }
            const systemTier = Math.floor((i + j) / 2)
            const solarSystem = {
                name: choice(starNames),
                objects: {},
                starSize: 10,
                galaxyX: x,
                galaxyY: y,
                tier: systemTier,
                timeUntilHostileSpawn: Math.random() * 1500 + 500
            }
            let planetCount = 0;
            for (let i = 0; i < Math.random() * 2 + systemTier + 1; i++) {
                let newID = Math.floor(Math.random() * 10000)
                while (newID in solarSystem.objects) {
                    newID = Math.floor(Math.random() * 10000);
                }
                solarSystem.objects[newID] = newPlanet(planetCount);
                planetCount++
            }
            solarSystem.objects.player = {
                type: "player",
                color: "white",
                posX: Math.random() * 400 - 200 + 375,
                posY: Math.random() * 400 - 200 + 375
            }
            currentMultiverse.solarSystems.push(solarSystem);
        }
    }

}
function newPlanet(planetCount) {
    const newPlanet = {
        type: "planet",
        color: "#944654",
        name: choice(planetNames),
        radius: Math.floor(Math.random() * 5) + 8,
        theta: Math.PI * Math.random(),
        orbitalRadius: 40 * planetCount + 80
    }
    planetCount++;
    return newPlanet;
}

export default generateAllSystems;