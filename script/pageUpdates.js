import { addDescriptionEvent, changeDescriptionText, currentDescription, manualDescriptionUpdate } from "./addUIDescriptions.js";
import fadeIn from "./animations/fadeIn.js";
import research from "./data/researchData.js";
import { addResearchDescription, doResearch } from "./research/researchScripts.js";

const energyRequiredRestore = 10000000;
let fadedIn = false;
const THEEND = document.getElementById("ending");

function updateEnergyCounter(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    document.getElementById("energyAmount").textContent = currentMultiverse.energy;
    document.getElementById("energyRequiredRestore").textContent = energyRequiredRestore;
    document.getElementById("eneryProducedTotal").textContent = userData.lifetimeEnergyGained;
    document.getElementById("energyRequiredProgress").style.transform = `scale(${Math.min(userData.lifetimeEnergyGained / energyRequiredRestore, 1)})`;
    if (userData.lifetimeEnergyGained > energyRequiredRestore && !fadedIn) {
        THEEND.style.display = "block";
        fadedIn = true;
        fadeIn(THEEND, 5);
    }
}
function updateDustCounter(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    document.getElementById("dustAmount").textContent = currentMultiverse.dust;
}
function updateMetalCounter(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    document.getElementById("metalAmount").textContent = currentMultiverse.metal;
}
function updateResearchPoints(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    document.getElementById("researchPointCount").textContent = currentMultiverse.researchPoints;
}
function updateIridiumCounter(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    document.getElementById("iridiumAmount").textContent = currentMultiverse.iridium;
    if (currentMultiverse.iridium === 0) {
        document.getElementById("iridiumCounter").style.display = "none";
    }
}
function updateResearchBar(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const width = 750 * (currentMultiverse.progressUntilResearchPoint / currentMultiverse.energyUntilResearchPoint);
    if (currentDescription === "researchBar") {
        changeDescriptionText({
            content: `${currentMultiverse.progressUntilResearchPoint} / ${currentMultiverse.energyUntilResearchPoint} until next research point.`
        });
    }
    document.getElementById("researchBarForeground").style.width = `${width}px`;
}
function updateResearchRate(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    document.getElementById("researchRateDisplay").textContent = currentMultiverse.researchRate;
    document.getElementById("ticksPerResearchAdvancementDisplay").textContent = `${currentMultiverse.ticksPerResearchAdvancement / 10}s`
}

function updateResearchButtons(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    document.getElementById("researchButtons").innerHTML = "";
    for (let researchItem of currentMultiverse.researchUnlocked) {
        const button = document.createElement("button");
        const researchObject = research[researchItem];
        button.textContent = researchObject.name;
        document.getElementById("researchButtons").appendChild(button);
        addResearchDescription(button, researchItem);
        button.addEventListener("click", _ => {
            doResearch(userData, researchItem);
        });
    }
}

function updateDustbot(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const slider = document.getElementById("dustbotSlider");
    if (currentMultiverse.dustbotUnlocked) {
        document.getElementById("buildDustbot").style.display = "none";
    }

    slider.max = currentMultiverse.dustbotMaxSpeed;
    slider.value = currentMultiverse.dustbotSpeed;
    if (currentMultiverse.dustbotSpeed === 0) {
        document.getElementById("dustbotInactive").style.display = "block";
        document.getElementById("dustbotSliderInfo").style.display = "none";
    } else {
        document.getElementById("dustbotInactive").style.display = "none";
        document.getElementById("dustbotSliderInfo").style.display = "block";
        document.getElementById("dustbotSliderSeconds").textContent = `${(100 - currentMultiverse.dustbotSpeed * 2) / 10}`
    }
}

function updateShipConstruction(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    if (Object.keys(currentMultiverse.shipInProgress).length > 0) {
        document.getElementById("chooseShipToBuild").style.display = "none";
        document.getElementById("buildShipDiv").style.display = "block";
    } else {
        document.getElementById("buildShipDiv").style.display = "none";
        document.getElementById("chooseShipToBuild").style.display = "block";
    }
}
function updateShipConstructionBar(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    document.getElementById("shipBuildingEnergyUsed").textContent = currentMultiverse.currentShipBuildingRate;
    const energyCost = currentMultiverse.shipInProgress.energyCostTotal;
    const energySpent = currentMultiverse.shipInProgress.energySpent;
    const width = 750 * (energySpent / energyCost);
    if (currentDescription === "shipbuildingBar") {
        changeDescriptionText({
            content: `${energySpent} / ${energyCost} until complete.`
        })
    }
    document.getElementById("buildingBarForeground").style.width = `${width}px`;
}

export {
    updateEnergyCounter,
    updateDustCounter,
    updateResearchPoints,
    updateResearchBar,
    updateResearchRate,
    updateResearchButtons,
    updateDustbot,
    updateShipConstruction,
    updateShipConstructionBar,
    updateMetalCounter,
    updateIridiumCounter
}