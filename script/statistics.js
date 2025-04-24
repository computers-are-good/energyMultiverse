import notifyUnique from "./notifs/notifyUnique.js";
import { updateResearchButtons } from "./pageUpdates.js";
import { getEnergyPerSecond } from "./resources/solarPanel.js";
import { addNavigationAttention } from "./toggleUIElement.js";

function updateStatistics(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    document.getElementById("totalEnergyMade").textContent = currentMultiverse.statistics.energyGained;
    document.getElementById("totalDustMade").textContent = currentMultiverse.statistics.dustGained;
    document.getElementById("totalMetalMade").textContent = currentMultiverse.statistics.metalGained;
    document.getElementById("totalIridiumMade").textContent = currentMultiverse.statistics.iridiumGained;
    document.getElementById("planetsVisited").textContent = currentMultiverse.statistics.planetsVisited;
    document.getElementById("statisticsPlaytime").textContent = `${Math.floor(currentMultiverse.statistics.totalTicksPassed / 20)}s`;

    document.getElementById("energyConsumptionList").innerHTML = "";
    const energyConsumed = calculateEnergyConsumptionPerSec(userData);
    let totalEnergyUsed = 0;
    for (const thing in energyConsumed) {
        if (energyConsumed[thing] > 0) {
            const li = document.createElement("li");
            li.textContent = `${thing}: ${energyConsumed[thing]}`;
            totalEnergyUsed += energyConsumed[thing];
            document.getElementById("energyConsumptionList").appendChild(li);
        }
    }
    totalEnergyUsed = Math.round(totalEnergyUsed * 1000) / 1000;
    const energyConsumedLi = document.createElement("li");
    energyConsumedLi.textContent = `Total consumption: ${totalEnergyUsed}`;
    document.getElementById("energyConsumptionList").appendChild(energyConsumedLi);

    document.getElementById("energyProductionList").innerHTML = "";
    const energyProduced = calculateEnergyProductionPerSec(userData);
    let totalEnergyProduced = 0;
    for (const thing in energyProduced) {
        if (energyProduced[thing] > 0) {
            const li = document.createElement("li");
            li.textContent = `${thing}: ${energyProduced[thing]}`;
            totalEnergyProduced += energyProduced[thing];
            document.getElementById("energyProductionList").appendChild(li);
        }
    }
    totalEnergyProduced = Math.round(totalEnergyProduced * 1000) / 1000;
    const energyProducedLi = document.createElement("li");
    energyProducedLi.textContent = `Total production: ${totalEnergyProduced}`;
    document.getElementById("energyProductionList").appendChild(energyProducedLi);

    if (totalEnergyProduced + totalEnergyProduced > 3 && !currentMultiverse.eventsDone.includes("energyStatistics")) {
        notifyUnique("energyStatistics");
        currentMultiverse.researchUnlocked.push("energyStatistics");
        updateResearchButtons(userData);
        addNavigationAttention("research", "pageResearch");
        currentMultiverse.eventsDone.push("energyStatistics");
    }
}

function calculateEnergyConsumptionPerSec(userData) {
    let energyUsed = {};
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    if (currentMultiverse.dustbotSpeed > 0) energyUsed["Dustbot"] = Math.floor(10 / ((100 - currentMultiverse.dustbotSpeed * 2) / 10) * 1000) / 1000 //Energy used by DustBot
    if (currentMultiverse.fabriBotSpeed > 0) energyUsed["fabriBot"] = Math.floor(30 / ((100 - currentMultiverse.fabriBotSpeed * 2) / 10) * 1000) / 1000
    energyUsed["Propulsion"] = currentMultiverse.mothershipCurrentThrust;
    energyUsed["Research"] = currentMultiverse.researchRate * (currentMultiverse.ticksPerResearchAdvancement / 10);
    energyUsed["Shipyard"] = currentMultiverse.currentShipBuildingRate;

    return energyUsed;
}

function calculateEnergyProductionPerSec(userData) {
    let energyProduced = {};
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    let energyFromDrones = 0;
    currentMultiverse.drones.forEach(e => {
        energyFromDrones += e.energyProduced / (e.ticksTilEnergy / 10)
    });
    energyProduced.Drones = Math.round(energyFromDrones * 1000) / 1000;
    if (currentMultiverse.solarPanel > 0) energyProduced["Solar Panels"] = getEnergyPerSecond(userData);

    return energyProduced;
}
export default updateStatistics;