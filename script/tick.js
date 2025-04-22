import { updateDroneDivs } from "./resources/drone/droneClicker.js"
import { updateDustCounter, updateEnergyCounter } from "./pageUpdates.js";
import updateResearch from "./research/research.js";
import { checkCosts, subtractCosts } from "./itemCosts.js";
import notify from "./notifs/notify.js";
import { buildShip } from "./ship/shipEvents.js";
import { updateSolarSystem, updateSolarSystemPositions } from "./map/solarSystem.js";
import { currentScreenDisplayed } from "./toggleUIElement.js";
import { solarPanelTick } from "./resources/solarPanel.js";
import { gainEnergy } from "./resources/gainResources.js";

let tickCount = 0;
function tick(userData) {
    tickCount++;
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    if (tickCount % 1000 === 0) {
        // storeUserData(userData);
    }
    let energyChanged = false;
    currentMultiverse.drones.forEach(e => {
        e.ticksElapsed++;
        if (e.ticksElapsed >= e.ticksTilEnergy) {
            e.ticksElapsed = 0;
            energyChanged = true;
            gainEnergy(userData, e.energyProduced);
        }
    });
    if (energyChanged) updateEnergyCounter(userData);
    updateDroneDivs(userData);

    if (tickCount % currentMultiverse.ticksPerResearchAdvancement === 0) {
        updateResearch(userData);
    }

    if (currentMultiverse.dustbotSpeed > 0) {
        currentMultiverse.dustbotTicksElapsed++;
        document.getElementById("dustbotNextDust").textContent = (101 - currentMultiverse.dustbotSpeed * 2 - currentMultiverse.dustbotTicksElapsed) / 10;
        if (currentMultiverse.dustbotTicksElapsed > 100 - currentMultiverse.dustbotSpeed * 2) {
            currentMultiverse.dustbotTicksElapsed = 0;
            if (checkCosts(userData, { energy: 10 }, false)) {
                subtractCosts(userData, { energy: 10 });
                currentMultiverse.dust++;
                updateDustCounter(userData);
                updateEnergyCounter(userData);
            } else {
                notify("[Dustbot] Not enough energy.");
            }
        }
    }
    if (tickCount % 10 === 0) { //events that happen every second
        solarPanelTick(userData);
        buildShip(userData);
        updateSolarSystemPositions(userData);
        if (currentScreenDisplayed === "Map") updateSolarSystem(userData);
    }

    if (tickCount % 20 === 0) { //events that happen every 2 seconds

    }
    currentMultiverse.statistics.totalTicksPassed++;
}

export default tick;