import fadeIn from "../animations/fadeIn.js";
import {notify} from "../notifs/notify.js"
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
function jumpButtonClicked(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const energyReq = calculateEnergyRequired(userData, selectedIndex);
    if (currentMultiverse.energy > energyReq && currentMultiverse.driveCell > currentMultiverse.solarSystems[selectedIndex].tier) {
        jumpToSystem(userData, selectedIndex);
        useEnergy(userData, energyReq);
        currentMultiverse.driveCell -= currentMultiverse.solarSystems[selectedIndex].tier;
        updateEnergyCounter(userData);
    }
}
const cannotJump = document.getElementById("cannotJump");
const cannotJumpTier = document.getElementById("cannotJumpTier");
function jumpToSystem(userData, systemId) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    let canMakeJump = true;

    for (let ship of currentMultiverse.ships) {
        if (ship.isBusy) {
            canMakeJump = false;
            cannotJump.style.display = "block";
            fadeIn(cannotJump, 0.2);
            setTimeout(_ => cannotJump.style.display = "none", 3000);
            break;
        }
    }

    if (currentMultiverse.solarSystems[systemId].tier > currentMultiverse.maxJumpTier) {
        canMakeJump = false;
        cannotJumpTier.style.display = "block";
        document.getElementById("maxJumpTier").textContent = currentMultiverse.maxJumpTier;
        fadeIn(cannotJumpTier, 0.2);
        setTimeout(_ => cannotJumpTier.style.display = "none", 3000);

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