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
function newSolarSystem() {
    const solarSystem = {
        name: "Suffering please help me",
        objects: {},
        starSize: 10,
        timeUntilHostileSpawn: Math.random() * 1500 + 500
    }
    for (let i = 0; i < Math.random() * 4 + 2; i++) {
        let newID = Math.floor(Math.random() * 10000)
        while (newID in solarSystem.objects) {
            newID = Math.floor(Math.random() * 10000);
        }
        solarSystem.objects[newID] = newPlanet();
    }
    solarSystem.objects.player = {
        type: "player",
        color: "white",
        posX: Math.random() * 400 - 200 + 375,
        posY: Math.random() * 400 - 200 + 375
    }
    return solarSystem;
}
let planetCount = 0;
function newPlanet() {
    const newPlanet = {
        type: "planet",
        color: "#944654",
        name: choice(planetNames),
        radius: Math.floor(Math.random() * 5) + 8,
        theta: Math.PI * Math.random(),
        orbitalRadius: 75 * planetCount + 80
    }
    planetCount++;
    return newPlanet;
}

export default newSolarSystem;