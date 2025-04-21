import fadeIn from "../animations/fadeIn.js";
import notify from "../notifs/notify.js";
import { updateEnergyCounter } from "../pageUpdates.js";
import { useEnergy } from "../resources/useResources.js";
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
    return Math.floor(Math.sqrt(Math.pow(currentSystem.galaxyX - targetSystem.galaxyX, 2) + Math.pow(currentSystem.galaxyY - targetSystem.galaxyY, 2)) * 15);
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

            if (i == currentMultiverse.currentSolarSystem) {
                systemDiv.style.backgroundColor = "white";
            } else {
                systemDiv.style.backgroundColor = tierColours[system.tier];
            }

            systemDiv.addEventListener("click", _ => {

                document.getElementById("systemInfo").style.display = "block";
                document.getElementById("energyRequired").textContent = calculateEnergyRequired(userData, i);
                document.getElementById("numberOfPlanetsDisplay").textContent = Object.keys(system.objects).filter(e => system.objects[e].type === "planet").length;
                document.getElementById("systemTierDisplayGalaxy").textContent = system.tier;
                document.getElementById("dangerLevelDisplay").textContent = system.dangerLevel;
                document.getElementById("systemName").textContent = system.name;
                selectedIndex = i;
            });
        }
    } else {
        notify("Please resolve the event in the solar system before opening the galaxy map.");
    }
}
function jumpButtonClicked(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const energyReq = calculateEnergyRequired(userData, selectedIndex);
    if (currentMultiverse.energy > energyReq) {
        jumpToSystem(userData, selectedIndex);
        useEnergy(userData, energyReq);
        updateEnergyCounter(userData);
    }
}
const cannotJump = document.getElementById("cannotJump");
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
    bigGalaxyMap.appendChild(newSystem);
    return newSystem;
}
function closeGalaxyView() {
    document.getElementById("galaxyMap").style.display = "none";
}

export { galaxyView, closeGalaxyView, jumpButtonClicked }