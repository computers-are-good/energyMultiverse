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

let screenOffsetX = 0;
let screenOffsetY = 0;
let mapOffsetX = 0; // How much the underlying galaxyMap should be shifted by.
let mapOffsetY = 0;
let mouseMapX = 0; // The x coordinate of the bit of "map" under the mouse
let mouseMapY = 0;
let mapScale = 5;
let mapVelX = 0; // After player releases their mouse, "slide" the map with some residual decaying velocity.
let mapVelY = 0;
let mapWidth = 900;
let mapHeight = 700;
let lastMouseX = 0;
let lastMouseY = 0;
let mouseDownTime = performance.now();
let xWhenMouseDown = 0;
let yWhenMouseDown = 0;
let mouseHeldDown = false;

const maxMapVelocity = 10;
function calculateEnergyRequired(userData, targetSystemId) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const currentSystem = currentMultiverse.solarSystems[currentMultiverse.currentSolarSystem];
    const targetSystem = currentMultiverse.solarSystems[targetSystemId];
    return Math.floor(Math.sqrt((currentSystem.galaxyX - targetSystem.galaxyX) ** 2 + (currentSystem.galaxyY - targetSystem.galaxyY) ** 2) * 15);
}
function moveMap() {
    if (mapOffsetX > 300) {
        mapOffsetX = 300;
        mapVelX *= -0.5;
    }
    if (mapOffsetY > 300) {
        mapOffsetY = 300;
        mapVelY *= -0.5;
    }
    if (mapOffsetX < -((mapScale - 1) * mapWidth) - 300) {
        mapOffsetX = -((mapScale - 1) * mapWidth) - 300;
        mapVelX *= -0.5;
    }
    if (mapOffsetY < -((mapScale - 1) * mapHeight) - 300) {
        mapOffsetY = -((mapScale - 1) * mapHeight) - 300;
        mapVelY *= -0.5;
    }
    bigGalaxyMap.style.left = `${mapOffsetX}px`;
    bigGalaxyMap.style.top = `${mapOffsetY}px`;
    bigGalaxyMap.style.transform = `scale(${mapScale})`;
}

const velDecayConstant = 0.96;
function residualVelocity() {
    // Decrease ||vx|| and ||vy||
    // Velocity decay for x
    mapVelX *= velDecayConstant;
    mapVelY *= velDecayConstant;
    if (Math.abs(mapVelX) < 0.5) mapVelX = 0;
    if (Math.abs(mapVelY) < 0.5) mapVelY = 0;

    if (mapVelX != 0 && mapVelY != 0) {
        mapOffsetX += mapVelX;
        mapOffsetY += mapVelY;
        moveMap();
        requestAnimationFrame(residualVelocity);
    }
}

function updateGalaxyMapScreenPosition() {
    const container = document.getElementById("bigGalaxyMapContainer").getBoundingClientRect();
    screenOffsetX = container.left;
    screenOffsetY = container.top;
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
                mapOffsetX = Math.max(system.galaxyX * -mapScale + 450, -((mapScale - 1) * mapWidth));
                mapOffsetY = Math.max(system.galaxyY * -mapScale + 350, -((mapScale - 1) * mapHeight));
                moveMap();
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
        ;
        updateGalaxyMapScreenPosition();

        // Events for moving the map around
        bigGalaxyMap.addEventListener("mousedown", e => {
            mouseHeldDown = true;
            lastMouseX = xWhenMouseDown = e.x;
            lastMouseY = yWhenMouseDown = e.y;
            mapVelX = 0;
            mapVelY = 0;
            mouseDownTime = performance.now();
            bigGalaxyMap.style.cursor = "pointer";
        });
        function handleMouseUpOrOut(e) {
            mouseHeldDown = false;
            let deltaT = performance.now() - mouseDownTime;
            if (mapScale > 1.1 && deltaT < 250) {
                mapVelX = -(xWhenMouseDown - e.x) / deltaT * 1.2 * mapScale;
                mapVelY = -(yWhenMouseDown - e.y) / deltaT * 1.2 * mapScale;
                if (mapVelX < -maxMapVelocity) mapVelX = -maxMapVelocity;
                if (mapVelX > maxMapVelocity) mapVelX = maxMapVelocity;
                if (mapVelY < -maxMapVelocity) mapVelY = -maxMapVelocity;
                if (mapVelY > maxMapVelocity) mapVelY = maxMapVelocity;
            }
            residualVelocity();
            bigGalaxyMap.style.cursor = "default";
        }
        bigGalaxyMap.addEventListener("mouseup", handleMouseUpOrOut);
        bigGalaxyMap.addEventListener("mouseout", handleMouseUpOrOut);

        // Event for zooming map in and out
        bigGalaxyMap.addEventListener("wheel", e => {
            mapScale -= e.deltaY * 0.0015;
            if (mapScale < 1) mapScale = 1;

            // Ensure the coordinates under mouse cursor is moved to the mouse cursor after zooming out.
            // This code worked first try btw.
            let newMouseMapX = (e.x - screenOffsetX - mapOffsetX) / mapScale;
            let newMouseMapY = (e.y - screenOffsetY - mapOffsetY) / mapScale;
            let delX = newMouseMapX - mouseMapX;
            let delY = newMouseMapY - mouseMapY;
            mapOffsetX += delX * mapScale;
            mapOffsetY += delY * mapScale;
            moveMap();
        });

        bigGalaxyMap.addEventListener("mousemove", e => {
            // When you drag the map with the mouse
            if (mouseHeldDown) {
                let xDiff = e.x - lastMouseX;
                let yDiff = e.y - lastMouseY;
                mapOffsetX += xDiff;
                mapOffsetY += yDiff;
                moveMap();
                lastMouseX = e.x;
                lastMouseY = e.y;
            }
            // Find the equalvent coordinates of the map under your mouse.
            mouseMapX = (e.x - screenOffsetX - mapOffsetX) / mapScale;
            mouseMapY = (e.y - screenOffsetY - mapOffsetY) / mapScale;
            document.getElementById("galaxyMapCoords").textContent = `x: ${Math.round(mouseMapX)} y: ${Math.round(mouseMapY)}`;

        });
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
    elementToDisplay.style.display = "block";
    fadeIn(elementToDisplay, 0.2);
    setTimeout(_ => elementToDisplay.style.display = "none", 3000);
}

function jumpToSystem(userData, systemId) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    // Clear all particles from the star when we jump
    document.querySelectorAll(".particle").forEach(e => e.remove());
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
    newSystem.style.width = "4px";
    newSystem.style.height = "4px";
    newSystem.style.borderRadius = "20px";
    newSystem.style.cursor = "pointer";
    bigGalaxyMap.appendChild(newSystem);
    return newSystem;
}
function closeGalaxyView() {
    document.getElementById("galaxyMap").style.display = "none";
}

export { galaxyView, closeGalaxyView, jumpButtonClicked, updateGalaxyMapScreenPosition }