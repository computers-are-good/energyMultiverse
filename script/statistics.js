import unlockResearchForElement from "./unlockResearch.js";
import { getEnergyPerSecond } from "./resources/solarPanel.js";

function formatPlaytime(seconds) {
    let hours = (seconds - (seconds % 3600)) / 3600;
    seconds -= hours * 3600;
    let minutes = (seconds - (seconds % 60)) / 60;
    seconds -= minutes * 60;
    return `${hours}H ${minutes}M ${seconds}s`
}

function updateStatistics(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    document.getElementById("totalEnergyMade").textContent = currentMultiverse.statistics.energyGained;
    document.getElementById("totalDustMade").textContent = currentMultiverse.statistics.dustGained;
    document.getElementById("totalMetalMade").textContent = currentMultiverse.statistics.metalGained;
    document.getElementById("totalIridiumMade").textContent = currentMultiverse.statistics.iridiumGained;
    document.getElementById("planetsVisited").textContent = currentMultiverse.statistics.planetsVisited;
    document.getElementById("shipsMade").textContent = currentMultiverse.statistics.shipsBuilt;
    document.getElementById("statisticsPlaytime").textContent = formatPlaytime(Math.floor(currentMultiverse.statistics.totalTicksPassed / 10));

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

    document.getElementById("deficencyOrSurplus").textContent = totalEnergyProduced > totalEnergyUsed ? "surplus" : "deficency";
    document.getElementById("energyChange").textContent = Math.round(Math.abs(totalEnergyProduced - totalEnergyUsed) * 1000) / 1000;
    document.getElementById("energyChange").style.color = totalEnergyProduced > totalEnergyUsed ? "green" : "red";

    if (totalEnergyProduced + totalEnergyUsed > 3 && !currentMultiverse.eventsDone.includes("energyStatistics")) {
        unlockResearchForElement(userData, "energyStatistics");
    }
}

const getDistanceTo = (obj1, obj2) => Math.sqrt((obj1.posX - obj2.posX) ** 2 + (obj1.posY - obj2.posY) ** 2);

function calculateEnergyConsumptionPerSec(userData) {
    let energyUsed = {};
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    if (currentMultiverse.dustbotSpeed > 0) energyUsed["Dustbot"] = Math.floor(10 / ((100 - currentMultiverse.dustbotSpeed * 2) / 10) * 1000) / 1000 //Energy used by DustBot
    if (currentMultiverse.fabriBotSpeed > 0) energyUsed["fabriBot"] = Math.floor(30 / ((100 - currentMultiverse.fabriBotSpeed * 2) / 10) * 1000) / 1000
    
    //high quality code
    let mothershipIsMoving = false;
    const currentSystem = currentMultiverse.solarSystems[currentMultiverse.currentSolarSystem];
    for (const id in currentSystem.objects) {
        const thing = currentSystem.objects[id];
        if (currentSystem.objects[id].type === "player") {
            if ("targetX" in currentSystem.objects[id] && "targetY" in currentSystem.objects[id]) {
                if (currentMultiverse.energy > 0) {
                    if (getDistanceTo(thing, {
                        posX: thing.targetX,
                        posY: thing.targetY
                    }) >= 10) {
                        mothershipIsMoving = true;
                    }
                }
            }
        }
    }
    
    energyUsed["Propulsion"] = mothershipIsMoving ? currentMultiverse.mothershipCurrentThrust : 0;
    energyUsed["Research"] = Math.floor(currentMultiverse.researchRate / (currentMultiverse.ticksPerResearchAdvancement / 10) * 10) / 10;
    energyUsed["Shipyard"] = Object.keys(currentMultiverse.shipInProgress).length === 0 ? 0 : currentMultiverse.currentShipBuildingRate;

    if (currentMultiverse.turret.enabled && currentMultiverse.turret.currentCharge < currentMultiverse.turret.chargeToFire) {
        energyUsed["Turret"] = 1;
    }

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

    let energyFromFactory = 0;
    for (const system of currentMultiverse.solarSystems) {
        for (const id in system.objects) {
            if (system.objects[id].factory) {
                const factoryInfo = system.objects[id].factory;
                const making = factoryInfo.making;
                if (making === "energy") {
                    energyFromFactory += 20 * (system.objects[id].factoryMultipliers[making] / factoryInfo.progressRequired);
                }
            }
        }
    }
    energyFromFactory = Math.floor(energyFromFactory * 10) / 10;
    energyProduced.Factory = energyFromFactory;

    return energyProduced;
}
export default updateStatistics;