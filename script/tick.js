import { updateDroneDivs } from "./resources/drone/droneClicker.js"
import { updateDustCounter, updateEnergyCounter, updateResearchButtons } from "./pageUpdates.js";
import updateResearch from "./research/research.js";
import { checkCosts, subtractCosts } from "./itemCosts.js";
import notify from "./notifs/notify.js";
import { buildShip } from "./ship/shipEvents.js";
import { updateSolarSystem, updateSolarSystemPositions } from "./map/solarSystem.js";
import { addNavigationAttention, currentScreenDisplayed } from "./toggleUIElement.js";
import { solarPanelTick } from "./resources/solarPanel.js";
import { gainDust, gainEnergy, gainMetal } from "./resources/gainResources.js";
import notifyUnique from "./notifs/notifyUnique.js";
import updateStatistics from "./statistics.js";

let tickCount = 0;
function tick(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    tickCount++;
    currentMultiverse.statistics.totalTicksPassed++;

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
                gainDust(userData, 1);
            } else {
                notify("[Dustbot] Not enough energy.");
            }
        }
    }
    if (currentMultiverse.fabriBotSpeed > 0) {
        currentMultiverse.fabriBotTicksElapsed++;
        document.getElementById("fabriBotNextMetal").textContent = (101 - currentMultiverse.fabriBotSpeed * 2 - currentMultiverse.fabriBotTicksElapsed) / 10;
        if (currentMultiverse.fabriBotTicksElapsed > 100 - currentMultiverse.fabriBotSpeed * 2) {
            currentMultiverse.fabriBotTicksElapsed = 0;
            if (checkCosts(userData, { energy: 30, dust: 5 }, false)) {
                subtractCosts(userData, { energy: 30, dust: 5 });
                gainMetal(userData, 1);
            } else {
                if (currentMultiverse.energy < 30) {
                    notify("[fabriBot] Not enough energy.");
                }
                if (currentMultiverse.dust < 5) {
                    notify("[fabriBot] Not enough dust.");
                }
            }
        }
    }

    if (currentMultiverse.statistics.totalTicksPassed > 600 && !currentMultiverse.eventsDone.includes("statistics")) {
        notifyUnique("statistics");
        addNavigationAttention("research", "pageResearch");
        currentMultiverse.researchUnlocked.push("statistics");
        updateResearchButtons(userData);
        currentMultiverse.eventsDone.push("statistics");

    }

    if (tickCount % 5 === 0) { //events that happen twice every second
        if (currentScreenDisplayed === "Statistics") updateStatistics(userData);
    }

    if (tickCount % 10 === 0) { //events that happen every second
        solarPanelTick(userData);
        buildShip(userData);
        updateSolarSystemPositions(userData);
        if (currentScreenDisplayed === "Map") updateSolarSystem(userData);
    }

    if (tickCount % 20 === 0) { //events that happen every 2 seconds

    }
}

export default tick;