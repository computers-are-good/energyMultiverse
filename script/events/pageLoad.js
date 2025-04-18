import energyClicker from "../resources/energyClicker.js";
import dustClicker from "../resources/dustClicker.js";
import {hideLockedElements, toggleScreen} from "../toggleUIElement.js";
import {spawnDrone, animateDrones} from "../drone/drones.js";
import tick from "../interval/tick.js"
import {addUIDescriptions, mouseoverDescriptions, removeDescription} from "../addUIDescriptions.js";
import { updateEnergyCounter, updateDustCounter, updateResearchPoints, updateResearchRate, updateResearchBar, updateResearchButtons, updateDustbot, updateShipConstruction, updateShipConstructionBar, updateMetalCounter, updateIridiumCounter } from "../pageUpdates.js";
import { droneClicker, droneCost, drawDronesDivs} from "../drone/droneClicker.js";
import { decreaseResearchRate, increaseResearchRate, showResearchProgress } from "../research/researchClicker.js";
import notifyUnique from "../notifs/notifyUnique.js";
import {wait} from "../utils.js";
import fadeIn from "../animations/fadeIn.js";
import { buildDustbotEvent, dustbotSlider } from "../resources/dustbotClicker.js";
import { buildShip, drawBuildShipsDiv, showShipbuildingProgress } from "../ship/buildShip.js";
import { decreaseBuildRate, increaseBuildRate } from "../ship/shipEvents.js";
import { closeHangar, openHangar } from "../ship/hangar.js";
import { dispatchShipEvent, goToHostile, launchMissile, moveMothership, sendShipToSun } from "../map/solarSystem.js";
import {makeMissile, makeRepairKit} from "../ship/manufactory.js";
import { decreaseShipThrust, increaseShipThrust, updateShipThrust } from "../map/thrust.js";
import metalClicker from "../resources/metal.js";
import addCheats from "../cheats.js";
import { closeGalaxyView, galaxyView } from "../map/galaxyView.js";
import generateAllSystems from "../map/newSolarSystem.js";

async function pageLoad(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    hideLockedElements(currentMultiverse.UIElementsUnlocked);

    for (let i = 0; i < currentMultiverse.drones.length; i++) {
        spawnDrone(currentMultiverse.drones[i]);
    }

    mouseoverDescriptions.drone.cost = `${droneCost(currentMultiverse.drones.length)} dust`;

    toggleScreen(currentMultiverse.lastScreen || "Energy");

    document.getElementById("drone").addEventListener("mousedown", _ => droneClicker(userData));
    document.getElementById("dust").addEventListener("mousedown", _ => dustClicker(userData));
    document.getElementById("energyClicker").addEventListener("mouseup", _ => energyClicker(userData));
    document.querySelectorAll("#pageSelector li").forEach(e => e.addEventListener("click", _ => {
        e.classList.remove("navigationAttention");
        currentMultiverse.lastScreen = e.textContent;
        toggleScreen(e.textContent);
    }));
    document.getElementById("viewDrones").addEventListener("mousedown", _ => {
        drawDronesDivs(userData);
        toggleScreen("droneView");
    });
    document.getElementById("viewDronesBack").addEventListener("mousedown", _ => toggleScreen("Energy"));
    document.getElementById("dustBot").addEventListener("mousedown", _ => toggleScreen("dustbotView"));
    document.getElementById("viewDustbotBack").addEventListener("mousedown", _ => toggleScreen("Energy"));
    document.getElementById("buildDustbot").addEventListener("mousedown", _ => buildDustbotEvent(userData));
    document.getElementById("dustbotSlider").addEventListener("input", _ => dustbotSlider(userData))
    document.getElementById("decreaseResearchRate").addEventListener("mousedown", _ => decreaseResearchRate(userData));
    document.getElementById("increaseResearchRate").addEventListener("mousedown", _ => increaseResearchRate(userData));
    document.getElementById("buildShip").addEventListener("click", _ => buildShip(userData));
    document.getElementById("decreaseBuildingRate").addEventListener("click", _ => decreaseBuildRate(userData));
    document.getElementById("increaseBuildingRate").addEventListener("click", _ => increaseBuildRate(userData));
    document.getElementById("closeHangar").addEventListener("click", closeHangar);
    document.getElementById("hangar").addEventListener("click", _ => openHangar(userData, false));
    document.getElementById("researchBarBackground").addEventListener("mouseover", e => showResearchProgress(userData, e.x, e.y));
    document.getElementById("researchBarBackground").addEventListener("mouseout", removeDescription);
    document.getElementById("buildingBarBackground").addEventListener("mouseover", e => showShipbuildingProgress(userData, e.x, e.y));
    document.getElementById("buildingBarBackground").addEventListener("mouseout", removeDescription);
    document.getElementById("Dispatch").addEventListener("mousedown", _ => dispatchShipEvent(userData));
    document.getElementById("buildingBarBackground").addEventListener("mouseover", _ => updateShipConstructionBar(userData));
    document.getElementById("hostileAttack").addEventListener("click", _ => goToHostile(userData));
    document.getElementById("launchMissile").addEventListener("click", _ => launchMissile(userData));
    document.getElementById("makeMissile").addEventListener("click", _ => makeMissile(userData));
    document.getElementById("decreaseShipThrust").addEventListener("click", _ => decreaseShipThrust(userData));
    document.getElementById("increaseShipThrust").addEventListener("click", _ => increaseShipThrust(userData));
    document.getElementById("moveMothership").addEventListener("click", _ => moveMothership(userData));
    document.getElementById("dispatchToSun").addEventListener("click", _ => sendShipToSun(userData));
    document.getElementById("metal").addEventListener("click", _ => metalClicker(userData));
    document.getElementById("makeRepairKit").addEventListener("click", _ => makeRepairKit(userData));
    document.getElementById("galaxyMapBack").addEventListener("click", closeGalaxyView);
    document.getElementById("galaxyView").addEventListener("click", _ => galaxyView(userData));
    
    addCheats(userData);
    currentMultiverse.solarSystems = [];
    generateAllSystems(userData);
    addUIDescriptions();
    updateResearchRate(userData);
    updateResearchBar(userData);
    updateMetalCounter(userData);
    updateDustbot(userData);
    drawBuildShipsDiv(userData);
    updateShipConstruction(userData);
    updateShipThrust(userData);
    updateShipConstructionBar(userData);
    updateResearchPoints(userData);
    updateIridiumCounter(userData);
    updateEnergyCounter(userData);
    updateDustCounter(userData);
    updateResearchButtons(userData);

    setInterval(_ => {
        tick(userData);
    }, 10);

    animateDrones();

    if (!currentMultiverse.eventsDone.includes("awake")) { //Event for new users
        notifyUnique("awake");
        const elementMain = document.querySelector("main");
        elementMain.style.display = "none";

        await wait(3000);

        notifyUnique("light");

        elementMain.style.display = "inline-block";
        fadeIn(elementMain, 1)

        currentMultiverse.eventsDone.push("awake");
    }
}
export default pageLoad;