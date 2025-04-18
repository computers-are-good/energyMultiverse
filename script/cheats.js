import research from "./data/researchData.js";
import { updateDustCounter, updateEnergyCounter, updateMetalCounter } from "./pageUpdates.js";

const enableCheats = true;

function addCheats(userData) {
    if (enableCheats) {
        const currentMultiverse = userData.multiverses[userData.currentMultiverse];
        document.body.addEventListener("keypress", e => {
            if (e.key === "\\") {
                const code = prompt("Confess, young child, and speak thy soul.");
                switch (code) {
                    case "ENERGYFORDAYS":
                        currentMultiverse.energy = 99999;
                        updateEnergyCounter(userData);
                        break;
                    case "ITSDUSTYINHERE":
                        currentMultiverse.dust = 99999;
                        updateDustCounter(userData);
                        break;
                    case "GIVEMETHEMETAL":
                        currentMultiverse.metal = 99999;
                        updateMetalCounter(userData);
                        break;
                    case "IAMSMORT":
                        for (const item in research) research[item].complete(userData);
                        
                        break;
                    case "PEWPEW":
                        currentMultiverse.ships = [];
                        break;
                }
            }
        })
    }
}

export default addCheats;