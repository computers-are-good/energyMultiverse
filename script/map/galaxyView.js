import fadeIn from "../animations/fadeIn.js";
import { notify } from "../notifs/notify.js"
import { updateEnergyCounter } from "../pageUpdates.js";
import { useEnergy } from "../resources/useResources.js";
import { getSolarSystemExplorationLevel } from "./planetEvents.js";
import { updateSolarSystem, updateSolarSystemPositions } from "./solarSystem.js";

const bigGalaxyMap = document.getElementById("bigGalaxyMap");
const tierColours = {
    1: "#52cc38",
    2: "#8e9d42",
    3: "#b97a49",
    4: "#db5f4f",
    5: "#e64a6f",
    6: "#df3d98",
}
let selectedIndex;
function calculateEnergyRequired(userData, targetSystemId) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const currentSystem = currentMultiverse.solarSystems[currentMultiverse.currentSolarSystem];
    const targetSystem = currentMultiverse.solarSystems[targetSystemId];
    return Math.floor(Math.sqrt((currentSystem.galaxyX - targetSystem.galaxyX) ** 2 + (currentSystem.galaxyY - targetSystem.galaxyY) ** 2) * 15);
}
function galaxyView(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    document.getElementById("systemInfo").style.display = "none";

    if (currentMultiverse.allowSolarSystemUpdates) {
        document.getElementById("galaxyMap").style.display = "block";
        bigGalaxyMap.innerHTML = "";
        for (const i in currentMultiverse.solarSystems) {
            const system = currentMultiverse.solarSystems[i];
            const systemDiv = drawSystem(system.galaxyX, system.galaxyY);
            const planetCount = Object.keys(system.objects).filter(e => system.objects[e].type === "planet").length;

            const explorationPercent = getSolarSystemExplorationLevel(userData, system);

            if (i == currentMultiverse.currentSolarSystem) {
                systemDiv.style.backgroundColor = "white";
            } else {
                systemDiv.style.backgroundColor = tierColours[system.tier];
                if (explorationPercent === 100) {
                    systemDiv.style.opacity = 0.4;
                    if (planetCount == 0) systemDiv.style.backgroundColor = "gray";
                }
            }

            systemDiv.addEventListener("click", _ => {
                selectedIndex = i;
                document.getElementById("systemInfo").style.display = "block";
                document.getElementById("energyRequired").textContent = calculateEnergyRequired(userData, i);
                document.getElementById("numberOfPlanetsDisplay").textContent = planetCount;
                document.getElementById("systemTierDisplayGalaxy").textContent = system.tier;
                document.getElementById("dangerLevelDisplay").textContent = system.dangerLevel;
                document.getElementById("systemName").textContent = system.name;
                document.getElementById("explorationPercentageDisplay").textContent = explorationPercent;
                document.getElementById("driveCellsRequired").textContent = currentMultiverse.solarSystems[selectedIndex].tier;
            });
        }
    } else {
        notify("Please resolve the event in the solar system before opening the galaxy map.");
    }
}

const cannotJump = document.getElementById("cannotJump");
const cannotJumpTier = document.getElementById("cannotJumpTier");
const cannotJumpEnergy = document.getElementById("cannotJumpEnergy");
const cannotJumpDriveCell = document.getElementById("cannotJumpDriveCell");


// This is called when the jump to system button is called. It contains a preliminary check to make sure we have enough resources for the jump
function jumpButtonClicked(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const energyReq = calculateEnergyRequired(userData, selectedIndex);
    const driveCellReq = currentMultiverse.solarSystems[selectedIndex].tier;
    // We have enough energy AND drive cells to complete the jump
    if (currentMultiverse.energy >= energyReq && currentMultiverse.manufactoryItems.driveCell >= driveCellReq) {
        jumpToSystem(userData, selectedIndex);
        useEnergy(userData, energyReq);
        currentMultiverse.manufactoryItems.driveCell -= driveCellReq;
        updateEnergyCounter(userData);
    } else {
        // notify user if we don't have enough energy
        if (currentMultiverse.energy < energyReq) {
            document.getElementById("cannotJumpEnergyReq").innerText = energyReq - currentMultiverse.energy;
            feedbackToUserCannotJump(cannotJumpEnergy);
        // notify user if we don't have enough drive cells
        } else if (currentMultiverse.manufactoryItems.driveCell < driveCellReq) {
            document.getElementById("cannotJumpDriveCellReq").innerText = driveCellReq - currentMultiverse.manufactoryItems.driveCell;
            feedbackToUserCannotJump(cannotJumpDriveCell);
        }
    }
}
// If the player cannot jump to another system, pass in an element corresponding to a hidden element in #galaxyMapSidebar with the relevant reason why they cannot jump.
// Fade in that element, then remove it after 3 seconds.
function feedbackToUserCannotJump(elementToDisplay) {
    console.log(elementToDisplay);
    elementToDisplay.style.display = "block";
    fadeIn(elementToDisplay, 0.2);
    setTimeout(_ => elementToDisplay.style.display = "none", 3000);
}

function jumpToSystem(userData, systemId) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    let canMakeJump = true;
    for (let ship of currentMultiverse.ships) {
        if (ship.isBusy) {
            canMakeJump = false;
            feedbackToUserCannotJump(cannotJump)
            break;
        }
    }

    if (currentMultiverse.solarSystems[systemId].tier > currentMultiverse.maxJumpTier) {
        canMakeJump = false;
        document.getElementById("maxJumpTier").textContent = currentMultiverse.maxJumpTier;
        feedbackToUserCannotJump(cannotJumpTier);
    }
    if (canMakeJump) {
        currentMultiverse.currentSolarSystem = systemId;
        closeGalaxyView();
        updateSolarSystemPositions(userData);
        updateSolarSystem(userData);
    }

}
function drawSystem(x, y) {
    const newSystem = document.createElement("div");
    newSystem.style.position = "absolute";
    newSystem.style.marginTop = `${y}px`;
    newSystem.style.marginLeft = `${x}px`;
    newSystem.style.width = "20px";
    newSystem.style.height = "20px";
    newSystem.style.borderRadius = "20px";
    newSystem.style.cursor = "pointer";
    bigGalaxyMap.appendChild(newSystem);
    return newSystem;
}
function closeGalaxyView() {
    document.getElementById("galaxyMap").style.display = "none";
}

export { galaxyView, closeGalaxyView, jumpButtonClicked }