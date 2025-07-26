import { spawnDrone } from "./drones.js";
import { deepClone } from "../../utils.js"
import { manualDescriptionUpdate, mouseoverDescriptions, removeDescription } from "../../addUIDescriptions.js";
import { updateDustCounter } from "../../pageUpdates.js";
import notify from "../../notifs/notify.js";
import { checkCosts, subtractCosts } from "../../itemCosts.js";
const defaultDroneData = {
    ticksTilEnergy: 100,
    ticksUpgradedTimes: 0,
    energyUpgradedTimes: 0,
    ticksElapsed: 0,
    energyProduced: 1
}
function droneCost(numberDrones) {
    return numberDrones * 5 + 5;
}

function droneClicker(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const cost = {
        dust: droneCost(currentMultiverse.drones.length)
    }
    if (checkCosts(userData, cost)) {
        subtractCosts(userData, cost);
        makeDrone(userData);
    }
    mouseoverDescriptions.drone.cost = cost;
    updateDustCounter(userData);
}
function makeDrone(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const newDroneData = deepClone(defaultDroneData)
    currentMultiverse.drones.push(newDroneData);
    spawnDrone(newDroneData);
}
let droneDivs = [];
function deleteDroneDivs() {
    droneDivs.forEach(e => {
        e.bigDiv.remove();
    });
    droneDivs = [];
}
function upgradeDroneTicksCost(level) {
    return level * 3 + 2;
}
function upgradeDroneEnergyCost(level) {
    return level * 5 + 4;
}
function upgradeDroneTicks(droneData, userData) {
    if (droneData.ticksTilEnergy > 10) {
        const dustRequired = upgradeDroneTicksCost(droneData.ticksUpgradedTimes);
        if (checkCosts(userData, {
            dust: dustRequired
        })) {
            subtractCosts(userData, {
                dust: dustRequired
            });
            droneData.ticksUpgradedTimes++;
            droneData.ticksTilEnergy -= 5;
            notify(`Upgraded drone.`);
            updateMouseoverDescriptionTicks(droneData);
        } else {
            notify(`Not enough dust.`);
        }
    }
}

function upgradeDroneEnergy(droneData, userData) {
    if (droneData.energyProduced < 10) {
        const dustRequired = upgradeDroneEnergyCost(droneData.energyUpgradedTimes);
        if (checkCosts(userData, {
            dust: dustRequired
        })) {
            subtractCosts(userData, {
                dust: dustRequired
            });
            droneData.energyUpgradedTimes++;
            droneData.energyProduced++;
            notify(`Upgraded drone.`);
            updateMouseoverDescriptionEnergy(droneData);
        }
    }
}
let lastMouseX;
let lastMouseY;
function updateMouseoverDescriptionTicks(droneObj) {
    manualDescriptionUpdate({
        content: `Reduce the time needed for this drone to create energy.`,
        upgradePreview: `${droneObj.ticksTilEnergy / 10}s -> ${(droneObj.ticksTilEnergy - 5) / 10}s`,
        cost: {dust: upgradeDroneTicksCost(droneObj.ticksUpgradedTimes)}
    }, lastMouseX, lastMouseY)
}
function updateMouseoverDescriptionEnergy(droneObj) {
    manualDescriptionUpdate({
        content: `Increases the amount of energy gained fom this drone.`,
        upgradePreview: `${droneObj.energyProduced} energy -> ${droneObj.energyProduced + 1} energy`,
        cost: {dust: upgradeDroneEnergyCost(droneObj.energyUpgradedTimes)}
    }, lastMouseX, lastMouseY)
}

function drawDronesDivs(userData) {
    deleteDroneDivs();
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const dronesDisplay = document.getElementById("dronesDisplay");
    droneDivs = [];
    for (let drone in currentMultiverse.drones) {
        const droneObj = currentMultiverse.drones[drone];
        const newDiv = document.createElement("div");
        const ticks = document.createElement("p");
        ticks.textContent = "Time: ";

        const upgradeTicks = document.createElement("button");
        upgradeTicks.classList.add("upgradeTicks");
        upgradeTicks.textContent = "+";
        if (droneObj.ticksTilEnergy > 10) ticks.insertBefore(upgradeTicks, ticks.firstChild);

        upgradeTicks.addEventListener("mouseover", e => {
            lastMouseX = e.x;
            lastMouseY = e.y;
            updateMouseoverDescriptionTicks(droneObj);
        });

        upgradeTicks.addEventListener("click", _ => {
            upgradeDroneTicks(droneObj, userData);
            if (droneObj.ticksTilEnergy <= 10) {
                upgradeTicks.remove();
                removeDescription();
            }
        });

        upgradeTicks.addEventListener("mouseout", removeDescription);

        const ticksRemaining = document.createElement("span");
        ticks.appendChild(ticksRemaining);

        newDiv.appendChild(ticks);

        const energyWrapper = document.createElement("p");
        energyWrapper.textContent = "Energy: "

        const energy = document.createElement("span");
        energyWrapper.appendChild(energy);

        const upgradeEnergy = document.createElement("button");
        upgradeEnergy.textContent = "+";

        upgradeEnergy.addEventListener("click", _ => {
            upgradeDroneEnergy(droneObj, userData);
            if (droneObj.energyProduced >= 10) {
                upgradeEnergy.remove();
                removeDescription();
            }
        });

        upgradeEnergy.addEventListener("mouseover", e => {
            lastMouseX = e.x;
            lastMouseY = e.y;
            updateMouseoverDescriptionEnergy(droneObj);
        });

        upgradeEnergy.addEventListener("mouseout", removeDescription);

        upgradeEnergy.classList.add("upgradeTicks");

        if (droneObj.energyProduced < 10) energyWrapper.insertBefore(upgradeEnergy, energyWrapper.firstChild);

        newDiv.appendChild(energyWrapper);

        newDiv.classList.add("dronesDisplayElement");
        droneDivs.push({
            ticksRemaining: ticksRemaining,
            energyGained: energy,
            bigDiv: newDiv,
            droneData: currentMultiverse.drones[drone]
        });
        dronesDisplay.appendChild(newDiv);
    }
}
function updateDroneDivs(userData) {
    droneDivs.forEach((e, i) => {
        const ticksRemaining = e.droneData.ticksTilEnergy - e.droneData.ticksElapsed;
        const energyGained = e.droneData.energyProduced;
        e.ticksRemaining.textContent = `${ticksRemaining / 10}s`;
        e.energyGained.textContent = energyGained;
    });
}
export { droneClicker, droneCost, drawDronesDivs, updateDroneDivs }