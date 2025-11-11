import energyClicker from "./resources/energyClicker.js";
import dustClicker from "./resources/dustClicker.js";
import { hideLockedElements, toggleScreen } from "./toggleUIElement.js";
import { spawnDrone, animateDrones } from "./resources/drone/drones.js";
import tick from "./tick.js"
import { addUIDescriptions, mouseoverDescriptions, removeDescription } from "./addUIDescriptions.js";
import { updateEnergyCounter, updateDustCounter, updateResearchPoints, updateResearchRate, updateResearchBar, updateResearchButtons, updateDustbot, updateShipConstruction, updateShipConstructionBar, updateMetalCounter, updateIridiumCounter, updateAntimatterCounter } from "./pageUpdates.js";
import { droneClicker, droneCost, drawDronesDivs } from "./resources/drone/droneClicker.js";
import { decreaseResearchRate, increaseResearchRate, showResearchProgress } from "./research/researchClicker.js";
import notifyUnique from "./notifs/notifyUnique.js";
import { wait } from "./utils.js";
import fadeIn from "./animations/fadeIn.js";
import { buildDustbotEvent, dustbotSlider } from "./resources/dustbotClicker.js";
import { buildShip, drawBuildShipsDiv, openChooseShipOverlay, openChooseWeaponOverlay, showShipbuildingProgress } from "./ship/buildShip.js";
import { decreaseBuildRate, increaseBuildRate } from "./ship/shipEvents.js";
import { closeHangar, openHangar } from "./ship/hangar.js";
import { buildScanner, cancelRedirect, dispatchShipEvent, goToHostile, launchMissile, moveMothership, newTargetButton, obliteratePlanet, recallButton, scaleSolarSystem, sendShipToDebris, sendShipToSun, updateSolarSystem, updateSolarSystemPositions } from "./map/solarSystem.js";
import { makeMissile, simpleItemMaker, updateInventoryDisplay, updateManufactoryButtons } from "./ship/manufactory.js";
import { decreaseShipThrust, increaseShipThrust, updateShipThrust } from "./map/thrust.js";
import metalClicker from "./resources/metal.js";
import addCheats from "./cheats.js";
import { closeGalaxyView, galaxyView, jumpButtonClicked } from "./map/galaxyView.js";
import { buildWarpDrive, updateWarpDriveButton } from "./map/warpDriveEvents.js";
import { updateSolarPanels } from "./resources/solarPanel.js";
import { drawUpgradeButtons } from "./upgrades.js";
import { particles } from "./animations/particles.js";
import { ending } from "./ending.js";
import { fabriBotSlider, updateFabriBot } from "./resources/fabribotClicker.js";
import { buildTurret, toggleTurret, updateTurret } from "./turret.js";
import displayTutorialText from "./notifs/tutorialText.js";
import { callCreateFunction, decreaseMultiplier, increaseMultiplier, matchMultipliers, selectMultiverse, updateMultiverseMultipliers } from "./multiverse.js";
import { hideOverlay } from "./overlay.js";
import { checkCosts, subtractCosts } from "./itemCosts.js";
import { resetMessageCount } from "./notifs/notify.js";
import updateStatistics from "./statistics.js";

function applyEvents(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    document.getElementById("drone").addEventListener("mousedown", _ => droneClicker(userData));
    document.getElementById("dust").addEventListener("mousedown", _ => dustClicker(userData));
    document.getElementById("energyClicker").addEventListener("mousedown", e => {
        particles({
            particleX: e.pageX,
            particleY: e.pageY,
            particleColor: "White",
            particleLifetime: 500,
            particleNumber: 5,
            particleSize: 3,
            particleSpeed: 0.1
        });
        energyClicker(userData);
    });
    document.querySelectorAll("#pageSelector li").forEach(e => e.addEventListener("click", _ => {
        e.classList.remove("navigationAttention");
        toggleScreen(userData, e.textContent);
        if (e.textContent === "Map" && currentMultiverse.lastScreen !== "Map") {
            updateSolarSystemPositions(userData);
            updateSolarSystem(userData);
        }
        currentMultiverse.lastScreen = e.textContent;
    }));
    document.getElementById("viewDrones").addEventListener("mousedown", _ => {
        drawDronesDivs(userData);
        toggleScreen(userData, "droneView");
        removeDescription();
    });
    document.getElementById("viewDronesBack").addEventListener("mousedown", _ => toggleScreen(userData, "Energy"));
    document.getElementById("dustBot").addEventListener("mousedown", _ => toggleScreen(userData, "dustbotView"));
    document.getElementById("fabriBot").addEventListener("mousedown", _ => toggleScreen(userData, "fabriBotView"));
    document.getElementById("viewDustbotBack").addEventListener("mousedown", _ => toggleScreen(userData, "Energy"));
    document.getElementById("viewFabriBotBack").addEventListener("mousedown", _ => toggleScreen(userData, "Energy"));
    document.getElementById("buildDustbot").addEventListener("mousedown", _ => buildDustbotEvent(userData));
    document.getElementById("dustbotSlider").addEventListener("input", _ => dustbotSlider(userData));
    document.getElementById("fabriBotSlider").addEventListener("input", _ => fabriBotSlider(userData));
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
    document.getElementById("makeRepairKit").addEventListener("click", _ => simpleItemMaker(userData, "repairKit"));
    document.getElementById("makeDriveCell").addEventListener("click", _ => simpleItemMaker(userData, "driveCell"));
    document.getElementById("galaxyMapBack").addEventListener("click", closeGalaxyView);
    document.getElementById("galaxyView").addEventListener("click", _ => galaxyView(userData));
    document.getElementById("recallShip").addEventListener("click", recallButton);
    document.getElementById("dispatchToDebris").addEventListener("click", _ => sendShipToDebris(userData));
    document.getElementById("jumpToSystem").addEventListener("click", _ => jumpButtonClicked(userData));
    document.getElementById("buildWarpDrive").addEventListener("click", _ => buildWarpDrive(userData));
    document.getElementById("redirectShip").addEventListener("click", _ => newTargetButton(userData));
    document.getElementById("redirectCancel").addEventListener("click", _ => cancelRedirect(userData));
    document.getElementById("toggleTurret").addEventListener("click", _ => toggleTurret(userData));
    document.getElementById("buildTurret").addEventListener("click", _ => buildTurret(userData));
    document.getElementById("buildScanner").addEventListener("click", _ => buildScanner(userData));
    document.getElementById("decreaseEnergyMultiplier").addEventListener("click", _ => decreaseMultiplier("energyGained", userData));
    document.getElementById("decreaseDustMultiplier").addEventListener("click", _ => decreaseMultiplier("dustGained", userData));
    document.getElementById("decreaseMetalMultiplier").addEventListener("click", _ => decreaseMultiplier("metalGained", userData));
    document.getElementById("decreaseIridiumMultiplier").addEventListener("click", _ => decreaseMultiplier("iridiumGained", userData));
    document.getElementById("increaseEnergyMultiplier").addEventListener("click", _ => increaseMultiplier("energyGained", userData));
    document.getElementById("increaseDustMultiplier").addEventListener("click", _ => increaseMultiplier("dustGained", userData));
    document.getElementById("increaseMetalMultiplier").addEventListener("click", _ => increaseMultiplier("metalGained", userData));
    document.getElementById("selectShipClass").addEventListener("click", _ => openChooseShipOverlay(userData));
    document.getElementById("increaseIridiumMultiplier").addEventListener("click", _ => increaseMultiplier("iridiumGained", userData));
    document.getElementById("newMultiverse").addEventListener("click", _ => callCreateFunction(userData));
    document.getElementById("multiverseTravel").addEventListener("click", _ => selectMultiverse(userData, false, true));
    document.getElementById("obliteratePlanet").addEventListener("click", _ => obliteratePlanet(userData));
    document.getElementById("selectWeapons").addEventListener("click", _ => openChooseWeaponOverlay(userData));
    document.getElementById("pageStatistics").addEventListener("click", _ => updateStatistics(userData));
    document.getElementById("overlayBG").addEventListener("click", e => {
        if (e.target.id === "overlayBG") hideOverlay();
    });
    document.getElementById("ending").addEventListener("click", _ => {
        ending();
        document.getElementById("ending").blur();
    });
    document.getElementById("buildAntimatterBeam").addEventListener("click", _ => {
        if (checkCosts(userData, {
            energy: 1000,
            antimatter: 15
        }, true)) {
            subtractCosts(userData, {energy: 10000, antimatter: 15});
            userData.antimatterBeamBuilt = true;
            notifyUnique("antimatterBeamBuilt");
            document.getElementById("buildAntimatterBeam").style.display = "none";
        }
    });
    
    addCheats(userData);
    scaleSolarSystem();
    window.onresize = scaleSolarSystem;

    setInterval(_ => tick(userData), 100);

    //Double tapping and holding shift speeds up game
    let quickInterval1;
    let quickInterval2;
    let intervalSet = false;
    let lastShiftTime = 0;
    document.body.addEventListener("keydown", e => {
        let currentTime = performance.now();
        if (e.key === "Shift") {
            if (currentTime - lastShiftTime < 500) {
                lastShiftTime = 0;
                document.getElementById("tickCount").style.display = "block";
                if (userData.speedModeEnabled) {
                    quickInterval1 = setInterval(_ => {
                        tick(userData);
                        document.getElementById("tickCount").textContent = `[Fast forwarding] Tick number: ${userData.multiverses[userData.currentMultiverse].statistics.totalTicksPassed}`;
                    }, 10);
                    quickInterval2 = setInterval(_ => tick(userData), 10);
                    intervalSet = true;
                }
            } else {
                lastShiftTime = currentTime;
            }
        }
    });
    document.addEventListener("keyup", e => {
        if (e.key === "Shift") {
            clearInterval(quickInterval1);
            clearInterval(quickInterval2);
            document.getElementById("tickCount").style.display = "none";
            intervalSet = false;
        }
    });
}
async function firstLoadFunctions(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    hideLockedElements(currentMultiverse.UIElementsUnlocked);

    for (let i = 0; i < currentMultiverse.drones.length; i++) {
        spawnDrone(currentMultiverse.drones[i]);
    }

    mouseoverDescriptions.drone.cost = { dust: droneCost(currentMultiverse.drones.length) };

    resetMessageCount();
    
    toggleScreen(userData, currentMultiverse.lastScreen || "Energy");
    if (currentMultiverse.lastScreen === "Map") updateSolarSystem(userData);

    updateWarpDriveButton(userData);
    addUIDescriptions(userData);
    updateTurret(userData);
    updateResearchRate(userData);
    updateResearchBar(userData);
    updateMetalCounter(userData);
    updateDustbot(userData);
    updateFabriBot(userData);
    drawBuildShipsDiv(userData);
    updateShipConstruction(userData);
    updateShipThrust(userData);
    updateShipConstructionBar(userData);
    updateResearchPoints(userData);
    updateIridiumCounter(userData);
    updateAntimatterCounter(userData);
    updateEnergyCounter(userData);
    updateDustCounter(userData);
    updateResearchButtons(userData);
    updateSolarPanels(userData);
    drawUpgradeButtons(userData);
    updateMultiverseMultipliers(userData);
    updateManufactoryButtons(userData);
    updateInventoryDisplay(userData);

    if (userData.multiverses.length > 1) {
        document.getElementById("multiverseTravel").style.display = "block";
    } else {
        document.getElementById("multiverseTravel").style.display = "none";
    }

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

        let tutorialPrompt = setTimeout(_ => displayTutorialText("clickEnergy"), 3000);
        const el = document.getElementById("Energy");
        function eventHandler() {
            clearTimeout(tutorialPrompt);
            el.removeEventListener("mousedown", eventHandler)
        }
        el.addEventListener("mousedown", eventHandler);
    }
}
export {
    applyEvents,
    firstLoadFunctions,
};