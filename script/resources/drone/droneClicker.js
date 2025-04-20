import { spawnDrone } from "./drones.js";
import {deepClone} from "../../utils.js"
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
    mouseoverDescriptions.drone.cost = `${droneCost(currentMultiverse.drones.length)} dust`;
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
function upgradeDroneTicks(droneData, userData) {
    const dustRequired = upgradeDroneTicksCost(droneData.energyUpgradedTimes);
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    if (currentMultiverse.dust > dustRequired) {
        currentMultiverse.dust -= dustRequired;
        droneData.ticksUpgradedTimes++;
        droneData.ticksTilEnergy -= 5;
        notify(`Upgraded drone.`);
        updateMouseoverDescription(droneData);
    } else {
        notify(`Not enough dust.`);
    }
}
let lastMouseX;
let lastMouseY;
function updateMouseoverDescription(droneObj) {
    manualDescriptionUpdate({
        content: `Reduce the time needed for this drone to create energy.`,
        upgradePreview: `${droneObj.ticksTilEnergy / 10}s -> ${(droneObj.ticksTilEnergy - 5) / 10}s`,
        cost: `${upgradeDroneTicksCost(droneObj.ticksUpgradedTimes)} dust`
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
        ticks.insertBefore(upgradeTicks, ticks.firstChild);

        upgradeTicks.addEventListener("mouseover", e => {
            lastMouseX = e.x;
            lastMouseY = e.y;
            updateMouseoverDescription(droneObj);
        });

        upgradeTicks.addEventListener("click", _ => {
            upgradeDroneTicks(droneObj, userData);
        })

        upgradeTicks.addEventListener("mouseout", removeDescription);

        const ticksRemaining = document.createElement("span");
        ticks.appendChild(ticksRemaining);

        newDiv.appendChild(ticks);


        const energyGained = document.createElement("span");
        newDiv.appendChild(energyGained);
        newDiv.classList.add("dronesDisplayElement")
        droneDivs.push({
            ticksRemaining: ticksRemaining,
            energyGained: energyGained,
            bigDiv: newDiv,
            droneData: currentMultiverse.drones[drone]
        })
        dronesDisplay.appendChild(newDiv);
    }
}
function updateDroneDivs(userData) {
    droneDivs.forEach((e, i) => {
        const ticksRemaining = e.droneData.ticksTilEnergy - e.droneData.ticksElapsed;
        const energyGained = e.droneData.energyProduced;
        e.ticksRemaining.textContent = `${ticksRemaining / 10}s`;
        e.energyGained.textContent = `Energy: ${energyGained}`
    });
}
export {droneClicker, droneCost, drawDronesDivs, updateDroneDivs}