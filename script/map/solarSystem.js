import { addDescriptionEvent, removeDescription, currentDescription } from "../addUIDescriptions.js";
import dispatchShip from "../ship/dispatchShip.js";
import { openHangar } from "../ship/hangar.js";
import { addNavigationAttention, currentScreenDisplayed } from "../toggleUIElement.js";
import notify from "../notifs/notify.js";
import { arriveAtTarget, getSolarSystemExplorationLevel } from "./planetEvents.js";
import { combat } from "./combat.js";
import threatLevel from "./threatLevel.js";
import notifyUnique from "../notifs/notifyUnique.js";
import { choice, deepClone, removeFromArray } from "../utils.js";
import { updateDustCounter, updateEnergyCounter, updateIridiumCounter, updateMetalCounter, updateResearchButtons } from "../pageUpdates.js";
import hostileTiers from "../data/hostileTiers.js";
import { useEnergy } from "../resources/useResources.js";
import { resourceMappings } from "../resources/gainResources.js";
import { getPlanetExplorationLevel } from "./planetEvents.js";
import { checkCosts, subtractCosts, writeCostsReadable } from "../itemCosts.js";
import fadeIn from "../animations/fadeIn.js";
import { particles } from "../animations/particles.js";
import unlockResearchForElement from "../unlockResearch.js";
import { drawUpgradeButtons } from "../upgrades.js";
const blockingScreens = ["attacked", "scriptPlayer"]
const planetVelocity = 8.8;

let activeScreen = "";
let cursorX = 0;
let cursorY = 0;
let selected;
let shipSelected;
let redirectionInProgress = false;

const map = document.getElementById("Map");
const systemMap = document.getElementById("systemMap");
let mapTop;
let mapLeft;

function updateVisibleDivs() {
    document.querySelectorAll(".sidebarScreen").forEach(e => {
        if (e.id !== activeScreen) {
            e.style.display = "none";
        } else {
            e.style.display = "block";
        }
    });
}
function updateSolarSystem(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    if (currentMultiverse.allowSolarSystemUpdates && !["buildWarpDrive", "dispatchToSun", "buildScanner"].includes(currentDescription)) {
        removeDescription();
    }

    updateVisibleDivs();
    if (currentScreenDisplayed === "Map") {
        document.getElementById("systemMap").innerHTML = "";
        const currentSystem = currentMultiverse.solarSystems[currentMultiverse.currentSolarSystem];

        const mapRect = systemMap.getBoundingClientRect();
        mapTop = mapRect.top;
        mapLeft = mapRect.left;

        //Draw the star
        const star = drawNewElement(375, 375);
        star.style.backgroundColor = "Yellow";
        star.style.height = "20px";
        star.style.width = "20px";
        star.style.borderRadius = `15px`;

        particles({
            particleX: 385 + mapLeft,
            particleY: 385 + mapTop,
            particleColor: "#f7f29e",
            particleLifetime: 9000,
            particleNumber: 3,
            particleSize: 1,
            particleSpeed: 0.006
        }, map);

        star.addEventListener("mousedown", _ => {
            if (!blockingScreens.includes(activeScreen)) {
                activeScreen = "sunInfo";
                updateVisibleDivs();
                document.getElementById("solarSystemName").textContent = currentSystem.name;
                document.getElementById("systemTierDisplay").textContent = currentSystem.tier;
                document.getElementById("threatLevelDisplay").textContent = currentSystem.dangerLevel;
                document.getElementById("explorationLevelDisplay").textContent = getSolarSystemExplorationLevel(userData, currentSystem);

            }
        });

        addDescriptionEvent(star, {
            content: currentSystem.name
        });

        for (const id in currentSystem.objects) {
            const thing = currentSystem.objects[id];

            let posX = 0;
            let posY = 0;

            const selectTargetButton = document.createElement("button");

            selectTargetButton.addEventListener("click", _ => {
                shipSelected.targetObjectId = id;
                redirectionInProgress = false;
                currentMultiverse.allowSolarSystemUpdates = true;
                document.getElementById("redirectCancel").style.display = "none";
                document.getElementById("redirectShip").style.display = "block";
                selectTargetButton.remove();
            });

            selectTargetButton.classList.add("selectTargetButton");
            selectTargetButton.textContent = "Choose target";

            switch (thing.type) {
                case "planet":
                    posX = thing.posX;
                    posY = thing.posY;
                    const radius = thing.radius;
                    const systemObject = drawNewElement(posX - radius, posY - radius);
                    systemObject.attributes.id = id;

                    addDescriptionEvent(systemObject, {
                        content: `Planet ${thing.name} (${getPlanetExplorationLevel(userData, thing)} % explored)`
                    });

                    if (redirectionInProgress) {
                        document.getElementById("Dispatch").style.display = "none";
                    } else {
                        document.getElementById("Dispatch").style.display = "block";
                    }

                    systemObject.addEventListener("mousedown", _ => {
                        if (!blockingScreens.includes(activeScreen)) {
                            document.getElementById("buildFactoryButton").innerHTML = "";

                            activeScreen = "planetInfo";
                            selected = id;
                            updateVisibleDivs();
                            document.getElementById("planetName").textContent = thing.name;
                            document.getElementById("planetTypeDisplay").textContent = thing.planetType;
                            document.querySelectorAll(".selectTargetButton").forEach(e => e.remove());
                            if (redirectionInProgress) document.getElementById("planetInfo").appendChild(selectTargetButton);

                            document.getElementById("factory").style.display = (currentMultiverse.researchCompleted.includes("factoryShip") && getPlanetExplorationLevel(userData, thing) >= 100) ? "block" : "none";
                            const factoryBuilt = "factory" in thing;
                            document.getElementById("factoryNotBuilt").style.display = factoryBuilt ? "none" : "block";
                            document.getElementById("factoryBuilt").style.display = factoryBuilt ? "block" : "none";
                            document.getElementById("energyEfficency").textContent = thing.factoryMultipliers.energy;
                            document.getElementById("dustEfficency").textContent = thing.factoryMultipliers.dust;
                            document.getElementById("metalEfficency").textContent = thing.factoryMultipliers.metal;

                            const buildFactory = document.createElement("button");
                            buildFactory.textContent = "Build Factory";
                            document.getElementById("buildFactoryButton").appendChild(buildFactory);

                            buildFactory.addEventListener("click", _ => {
                                openHangar(userData, true, e => e.class === "Factory Ship").then(ship => {
                                    dispatchShip(ship, selected, userData);
                                }, _ => { });
                            });

                            updateFactory(userData);
                        }
                    });
                    systemObject.style.backgroundColor = thing.color;
                    systemObject.style.borderRadius = "500px";
                    systemObject.style.height = `${thing.radius * 2}px`;
                    systemObject.style.width = `${thing.radius * 2}px`;
                    break;
                case "player":
                    const you = drawNewElement(thing.posX - 10, thing.posY - 10);
                    you.style.width = "20px";
                    you.style.height = "20px";
                    you.style.backgroundColor = "white";
                    addDescriptionEvent(you, {
                        content: "You"
                    });
                    break;
                case "hostile":
                    const enemy = drawNewElement(thing.posX - 7.5, thing.posY - 7.5);
                    enemy.attributes.id = id;

                    addDescriptionEvent(enemy, {
                        content: `Hostile: threat level ${threatLevel(thing)}`
                    });

                    if (redirectionInProgress) {
                        selectTargetButton.textContent = "Choose target";
                        document.getElementById("hostileAttack").style.display = "none";
                        document.getElementById("launchMissile").style.display = "none";
                    } else {
                        document.getElementById("hostileAttack").style.display = "block";
                        document.getElementById("launchMissile").style.display = currentMultiverse.missiles > 0 ? "block" : "none";
                    }

                    enemy.addEventListener("mousedown", _ => {
                        if (!blockingScreens.includes(activeScreen)) {
                            selected = id;
                            activeScreen = "hostileInfo";
                            document.getElementById("missileCount").textContent = currentMultiverse.missiles > 0 ? `Missiles: ${currentMultiverse.missiles}` : "";
                            document.getElementById("launchMissile").style.display = currentMultiverse.missiles > 0 ? "block" : "none";
                            updateVisibleDivs();
                            document.querySelectorAll(".selectTargetButton").forEach(e => e.remove());
                            if (redirectionInProgress) document.getElementById("hostileInfo").appendChild(selectTargetButton);

                            if (currentMultiverse.researchCompleted.includes("scanner")) {
                                document.getElementById("scanner").style.display = "block";

                                if (currentMultiverse.scannerBuilt) {
                                    document.getElementById("buildScanner").style.display = "none";
                                    document.getElementById("scanResults").style.display = "block";
                                } else {
                                    document.getElementById("buildScanner").style.display = "block";
                                    document.getElementById("scanResults").style.display = "none";
                                }

                                updateScannerResults(thing, currentMultiverse.scannerError);

                            } else {
                                document.getElementById("scanner").style.display = "none";
                            }
                        }
                    });
                    enemy.style.backgroundColor = "red";
                    enemy.style.width = "15px";
                    enemy.style.height = "15px";
                    break;
                case "missile":
                    const missile = drawNewElement(thing.posX - 2.5, thing.posY - 2.5);
                    missile.style.width = "5px";
                    missile.style.height = "5px";
                    missile.style.backgroundColor = "#e87474";
                    break;
                case "debris":
                    const debris = drawNewElement(thing.posX - 5, thing.posY - 5);
                    debris.style.width = "10px";
                    debris.style.height = "10px";
                    debris.style.backgroundColor = "grey";

                    addDescriptionEvent(debris, {
                        content: "Debris"
                    });

                    debris.addEventListener("mousedown", _ => {
                        selected = id;

                        if (!blockingScreens.includes(activeScreen)) {

                            const debrisDiv = document.getElementById("debrisContent");
                            debrisDiv.innerHTML = "";

                            for (const item in thing.cargo) {
                                const newLi = document.createElement("li");
                                newLi.textContent = `${item}: ${thing.cargo[item]}`;
                                debrisDiv.appendChild(newLi);
                            }

                            activeScreen = "debrisInfo";
                            updateVisibleDivs();

                            if (redirectionInProgress) {
                                debrisDiv.appendChild(selectTargetButton);
                                document.getElementById("dispatchToDebris").style.display = "none";
                            } else {
                                document.getElementById("dispatchToDebris").style.display = "block";
                            }
                        }
                    });
                    break;
            }
        }
        for (const ship of currentMultiverse.ships) {
            if (ship.inSolarSystem) {
                const shipX = ship.posX;
                const shipY = ship.posY;

                const shipDiv = drawNewElement(shipX - 2.5, shipY - 2.5);

                shipDiv.style.height = "10px";
                shipDiv.style.width = "10px";
                shipDiv.style.borderRadius = "10px";
                shipDiv.style.backgroundColor = "green";

                if (ship.accessories.includes("Cloaking Device")) {
                    shipDiv.style.opacity = ship.makeDivDim ? "0.5" : 1;
                    ship.makeDivDim = !ship.makeDivDim;
                }

                shipDiv.addEventListener("mousedown", _ => {
                    if (!blockingScreens.includes(activeScreen)) {
                        shipSelected = ship;
                        activeScreen = "shipInfo";
                        updateVisibleDivs();
                        let destinationText;
                        if (ship.targetObjectId === "player") {
                            destinationText = "Mothership";
                        } else if (currentSystem.objects[ship.targetObjectId].type === "hostile" ) {
                            destinationText = "Enemy Ship";
                        } else if (currentSystem.objects[ship.targetObjectId].type == "debris") {
                            destinationText = "Debris";
                        } else {
                            destinationText = currentSystem.objects[ship.targetObjectId].name
                        }
                        document.getElementById("destinationSpan").textContent = destinationText;
                    }
                });
            }
        }
    }
}

function recallButton() {
    shipSelected.targetObjectId = "player";
    activeScreen = "";
    updateVisibleDivs();
}

function updateScannerResults(enemy, scannerError) {
    const attackError = enemy.baseStats.baseAttack * (scannerError / 100);
    const attackShift = Math.floor(enemy.baseStats.baseAttack * (scannerError / 100) * 0.4);
    const attackLow = Math.floor(Math.max((enemy.baseStats.baseAttack - attackError), 0));
    const attackHigh = Math.floor((enemy.baseStats.baseAttack + attackError));
    if (attackError === 0 || attackError < 1) {
        document.getElementById("enemyInfoAttack").textContent = enemy.baseStats.baseAttack;
    } else {
        document.getElementById("enemyInfoAttack").textContent = `${attackLow + attackShift} - ${attackHigh + attackShift}`;
    }

    if (scannerError <= 80) {
        document.getElementById("shieldDisplay").style.display = "block";
        const shieldError = enemy.baseStats.baseShield * (scannerError / 100);
        const shieldShift = Math.floor(enemy.baseStats.baseShield * (scannerError / 100) * 0.7);
        const shieldLow = Math.floor(Math.max((enemy.baseStats.baseShield - shieldError), 0));
        const shieldHigh = Math.floor((enemy.baseStats.baseShield + shieldError));

        if (shieldError === 0 || shieldError < 1) {
            document.getElementById("enemyInfoShield").textContent = enemy.baseStats.baseShield;
        } else {
            document.getElementById("enemyInfoShield").textContent = `${shieldLow + shieldShift} - ${shieldHigh + shieldShift}`;
        }
    } else {
        document.getElementById("shieldDisplay").style.display = "none";
    }

    if (scannerError <= 50) {
        document.getElementById("hullDisplay").style.display = "block";
        document.getElementById("enemyInfoHull").textContent = scannerError < 50 ?
            `${enemy.currentHealth} / ${enemy.baseStats.baseHealth}` :
            `${Math.ceil(enemy.currentHealth / enemy.baseStats.baseHealth * 100)}%`;
    } else {
        document.getElementById("hullDisplay").style.display = "none";
    }
}

function buildScanner(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    if (checkCosts(userData, { iridium: 3, metal: 5 })) {
        subtractCosts(userData, { iridium: 3, metal: 5 });
        currentMultiverse.scannerBuilt = true;
        document.getElementById("buildScanner").style.display = "none";
        document.getElementById("scanResults").style.display = "block";

        notifyUnique("scannerAccuracy");
        currentMultiverse.maxUpgradeTimes.scannerAccuracy = 10;
        drawUpgradeButtons(userData);
    }
}

const clickOnPlanetOrHostile = document.getElementById("clickOnPlanetOrHostile");
async function newTargetButton(userData) {
    if (!redirectionInProgress) {
        const currentMultiverse = userData.multiverses[userData.currentMultiverse];

        document.getElementById("redirectCancel").style.display = "block";
        document.getElementById("redirectShip").style.display = "none";
        redirectionInProgress = true;
        updateSolarSystem(userData);
        currentMultiverse.allowSolarSystemUpdates = false;
        clickOnPlanetOrHostile.style.display = "block";
        fadeIn(clickOnPlanetOrHostile, 1.5);
        setTimeout(_ => clickOnPlanetOrHostile.style.display = "none", 3000);
    }
}

function cancelRedirect(userData) {
    if (redirectionInProgress) {
        const currentMultiverse = userData.multiverses[userData.currentMultiverse];
        redirectionInProgress = false;
        currentMultiverse.allowSolarSystemUpdates = true;
        document.getElementById("redirectCancel").style.display = "none";
        document.getElementById("redirectShip").style.display = "block";
    }
}

document.getElementById("systemMap").addEventListener("click", e => {
    if (e.target.id == "systemMap" && !blockingScreens.includes(activeScreen)) {
        activeScreen = "emptySpaceInfo";
        updateVisibleDivs();

        cursorX = e.offsetX;
        cursorY = e.offsetY;
        document.getElementById("spaceCoordsX").textContent = cursorX;
        document.getElementById("spaceCoordsY").textContent = cursorY;

    }
});

async function sendShipToSun(userData) {
    const callback = e => {
        return e.accessories?.includes("Sunscoop");
    }
    openHangar(userData, true, callback).then(ship => {
        dispatchShip(ship, "sun", userData);
    }, _ => { });
}

async function sendShipToDebris(userData) {
    openHangar(userData, true).then(ship => {
        dispatchShip(ship, selected, userData);
    }, _ => { });
}

function moveMothership(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const currentSystem = currentMultiverse.solarSystems[currentMultiverse.currentSolarSystem];
    currentSystem.objects.player.targetX = cursorX;
    currentSystem.objects.player.targetY = cursorY;

    activeScreen = "";
    updateVisibleDivs();
}

document.body.addEventListener("click", e => {
    if (!blockingScreens.includes(activeScreen)) {
        //Did we click outside the system map?
        let clickedOutside = true;
        let node = e.target;
        while (node) {
            if (node.id === "systemMap" || node.id === "encounterInfo" || node.classList?.contains("factoryButton")) {
                clickedOutside = false;
                break;
            }
            node = node.parentNode;
        }
        if (clickedOutside) {
            activeScreen = "";
            updateVisibleDivs();
        }
    }
});

function launchMissile(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const currentSystem = currentMultiverse.solarSystems[currentMultiverse.currentSolarSystem];
    if (currentMultiverse.missiles > 0) {
        currentMultiverse.missiles--;
        let key = Math.floor(Math.random() * 10000);
        while (key in currentSystem.objects) {
            key = Math.floor(Math.random() * 10000);
        }
        currentSystem.objects[key] = {
            type: "missile",
            posX: currentSystem.objects.player.posX,
            posY: currentSystem.objects.player.posY,
            targetObjectId: selected,
            damage: currentMultiverse.missileDamage ?? 5,
        }
    }
    document.getElementById("missileCount").textContent = currentMultiverse.missiles > 0 ? `Missiles: ${currentMultiverse.missiles}` : "";
    if (currentMultiverse.missiles <= 0) {
        document.getElementById("launchMissile").style.display = "none";
    }
}

async function goToHostile(userData) {
    openHangar(userData, true).then(ship => {
        dispatchShip(ship, selected, userData);
    }, _ => { });
}

function moveTowards(ship, target, speed) {
    const shipX = ship.posX;
    const shipY = ship.posY;
    const targetX = target.posX;
    const targetY = target.posY;
    const deltaX = shipX - targetX;
    const deltaY = shipY - targetY;
    const theta = deltaX != 0 ? Math.atan(deltaY / deltaX) : 0;
    const changeX = Math.abs(speed * Math.cos(theta) * 0.4);
    const changeY = Math.abs(speed * Math.sin(theta) * 0.4);
    if (shipX > targetX) {
        ship.posX -= changeX;
    } else {
        ship.posX += changeX;
    }
    if (shipY > targetY) {
        ship.posY -= changeY;
    } else {
        ship.posY += changeY;
    }
}

const turretStatus = document.getElementById("turretStatus");
async function updateSolarSystemPositions(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const currentSystem = currentMultiverse.solarSystems[currentMultiverse.currentSolarSystem];
    if (currentMultiverse.allowSolarSystemUpdates) {
        for (const id in currentSystem.objects) {
            const thing = currentSystem.objects[id];
            if (thing.type === "planet") {
                thing.theta += planetVelocity / (2 * Math.PI * thing.orbitalRadius);
                thing.posX = Math.cos(thing.theta) * thing.orbitalRadius + 375;
                thing.posY = Math.sin(thing.theta) * thing.orbitalRadius + 375;
                if (thing.theta >= 2 * Math.PI) thing.theta -= 2 * Math.PI;
            }
        }
        for (const index in currentMultiverse.ships) {
            const ship = currentMultiverse.ships[index];
            if (ship.inSolarSystem && ship.targetObjectId) {
                if (ship.targetObjectId === "sun") {
                    const distanceToTarget = getDistanceTo(ship, {
                        posX: 375,
                        posY: 375
                    });
                    moveTowards(ship, {
                        posX: 375,
                        posY: 375
                    }, Math.min(ship.baseStats.baseSpeed * currentMultiverse.shipSpeedMultiplier, distanceToTarget));

                    if (distanceToTarget < 20) {
                        const energyGained = currentSystem.tier * (Math.ceil(Math.random() * 1000) + 1000);
                        if (ship.cargo.energy) {
                            ship.cargo.energy += energyGained;
                        } else {
                            ship.cargo.energy = energyGained;
                        }
                        ship.targetObjectId = "player";
                        removeFromArray(ship.accessories, "Sunscoop");
                    }

                } else {
                    let target = currentSystem.objects[ship.targetObjectId];

                    if (!target) {
                        target = currentSystem.objects.player;
                        ship.targetObjectId = "player";
                    }

                    const deltaX = ship.posX - target.posX;
                    const deltaY = ship.posY - target.posY;
                    const distToTarget = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                    if (distToTarget < 10) {
                        switch (currentSystem.objects[ship.targetObjectId].type) {
                            case "planet":
                                if (ship.targetObjectId !== "player") {
                                    const targetPlanet = currentSystem.objects[ship.targetObjectId];
                                    if (ship.class === "Factory Ship" && !("factory" in targetPlanet)) {
                                        targetPlanet.factory = {
                                            currentProgress: 0,
                                            progressRequired: 100,
                                            making: "dust"
                                        }
                                        currentMultiverse.ships.splice(index, 1);
                                        notify(`A factory ship arrived at ${targetPlanet.name} and established a factory.`);
                                    } else {
                                        activeScreen = "scriptPlayer";
                                        currentMultiverse.allowSolarSystemUpdates = false;
                                        arriveAtTarget(ship, userData).then(res => {
                                            activeScreen = "";
                                            currentMultiverse.allowSolarSystemUpdates = true;
                                            if (getPlanetExplorationLevel(userData, targetPlanet) >= 100) {
                                                if (!currentMultiverse.eventsDone.includes("factoryShip")) {
                                                    unlockResearchForElement(userData, "factoryShip");
                                                }
                                            }
                                        });
                                    }
                                } else {
                                    arriveAtTarget(ship, userData);
                                }
                                break;
                            case "debris":
                                let notifyString = "A ship arrived at debris and picked up";
                                for (let item in target.cargo) {
                                    if (item in ship.cargo) {
                                        ship.cargo[item] += target.cargo[item];
                                    } else {
                                        ship.cargo[item] = target.cargo[item]
                                    }
                                    notifyString += ` ${target.cargo[item]} ${item}`;
                                }
                                notifyString += ".";
                                notify(notifyString);
                                delete currentSystem.objects[ship.targetObjectId];
                                ship.targetObjectId = "player";
                                break;
                            case "player":
                                ship.isBusy = false;
                                ship.inSolarSystem = false;
                                let cargoProcessed = {}
                                for (let item in ship.cargo) {
                                    const oldAmount = currentMultiverse[item];
                                    if (item in resourceMappings) {
                                        resourceMappings[item](userData, ship.cargo[item]);
                                    } else {
                                        currentMultiverse[item] += ship.cargo[item];
                                    }
                                    const newAmount = currentMultiverse[item]
                                    cargoProcessed[item] = newAmount - oldAmount;
                                    delete ship.cargo[item];
                                }
                                updateEnergyCounter(userData);
                                updateDustCounter(userData);
                                updateMetalCounter(userData);
                                updateIridiumCounter(userData);

                                if (ship.currentHealth < ship.baseStats.baseHealth && !currentMultiverse.eventsDone.includes("repairKit")) {
                                    unlockResearchForElement(userData, "repairKit");
                                }

                                const cargoText = writeCostsReadable(cargoProcessed);
                                notify(`A ship has returned ${Object.keys(cargoProcessed).length > 0 ? `carrying ${cargoText}` : ""}`);
                                if (activeScreen === "shipInfo") {
                                    activeScreen = "";
                                    updateVisibleDivs();
                                }
                                break;
                        }
                    } else {
                        moveTowards(ship, target, Math.min(ship.baseStats.baseSpeed * currentMultiverse.shipSpeedMultiplier, distToTarget));
                    }
                }
            }
        }

        let hostileCount = 0;
        for (const object in currentSystem.objects) {
            const thing = currentSystem.objects[object];
            if (thing.type == "hostile") {
                const hostileX = thing.posX;
                const hostileY = thing.posY;
                hostileCount++;
                let closestShip;
                let closestShipIndex;
                let closestDistance = 9999;
                for (const i in currentMultiverse.ships) {
                    const ship = currentMultiverse.ships[i];
                    if (ship.inSolarSystem) {
                        const distToShip = getDistanceTo(thing, ship);
                        if (ship.accessories.includes("Cloaking Device")) {
                            if (distToShip > 30) continue;
                        }

                        if (distToShip < closestDistance) {
                            closestShip = ship;
                            closestShipIndex = i;
                            closestDistance = distToShip;
                        }
                    }
                }
                if (closestShip && closestDistance < 150) {
                    moveTowards(thing, closestShip, thing.baseStats.baseSpeed * 1.6);
                    if (closestDistance < 10) {
                        const loot = generateShipLoot(thing);
                        addNavigationAttention("Map", "pageMap");
                        notify(`Your ${closestShip.class} is under attack!`);
                        const combatOutcome = await initCombat(closestShip, thing, userData);
                        currentMultiverse.allowSolarSystemUpdates = true;
                        if (combatOutcome) { //if the player won
                            delete currentSystem.objects[object];
                            for (const material in loot) {
                                if (material in closestShip.cargo) {
                                    closestShip.cargo[material] += loot[material];
                                } else {
                                    closestShip.cargo[material] = loot[material];
                                }
                            }
                        } else {
                            currentMultiverse.ships.splice(closestShipIndex, 1);
                        }
                        updateSolarSystem(userData);
                    }
                } else { //Move between random points in the solar system if we have no ship to target
                    const targetX = thing.targetX;
                    const targetY = thing.targetY;
                    moveTowards(thing, {
                        posX: targetX,
                        posY: targetY
                    }, thing.baseStats.baseSpeed * 0.6);

                    const distanceToTarget = Math.sqrt((hostileX - targetX) ** 2 + (hostileY - targetY) ** 2);
                    if (distanceToTarget < 10) {
                        thing.targetX = Math.random() * 750;
                        thing.targetY = Math.random() * 750;
                    }
                }
            } else if (thing.type === "missile") {
                let target = currentSystem.objects[thing.targetObjectId];
                if (!target) {
                    target = currentSystem.objects.player;
                    thing.targetObjectId = "player";
                }
                moveTowards(thing, target, 12);
                const distance = getDistanceTo(thing, target);
                if (distance < 10) {
                    if (thing.targetObjectId === "player") {
                        currentMultiverse.missiles++;
                        document.getElementById("missileCount").textContent = currentMultiverse.missiles > 0 ? `Missiles: ${currentMultiverse.missiles}` : "";
                        delete currentSystem.objects[object];
                    } else {
                        target.currentHealth -= thing.damage;
                        if (target.currentHealth <= 0) {
                            delete currentSystem.objects[thing.targetObjectId];
                            notify(`A missile detonated and destroyed an enemy.`);
                            particles({
                                particleX: thing.posX + 30,
                                particleY: thing.posY + 90,
                                particleColor: "red",
                                particleLifetime: 5000,
                                particleNumber: 15,
                                particleSize: 1,
                                particleSpeed: 0.05
                            }, map);
                            generateDebris(userData, target);
                        } else {
                            notify(`A missile detonated and dealt ${thing.damage} damage to an enemy.`);
                            particles({
                                particleX: thing.posX + mapLeft,
                                particleY: thing.posY + mapTop,
                                particleColor: "red",
                                particleLifetime: 3000,
                                particleNumber: 5,
                                particleSize: 1,
                                particleSpeed: 0.05
                            }, map);
                        }
                        delete currentSystem.objects[object];
                    }

                }
            } else if (thing.type === "player") {
                if ("targetX" in thing && "targetY" in thing) {
                    if (currentMultiverse.energy > 0) {
                        const energyUsed = Math.min(currentMultiverse.energy, currentMultiverse.mothershipCurrentThrust);
                        moveTowards(thing, {
                            posX: thing.targetX,
                            posY: thing.targetY
                        }, energyUsed * 1.5);
                        if (getDistanceTo(thing, {
                            posX: thing.targetX,
                            posY: thing.targetY
                        }) < 10) {
                            delete thing.targetX;
                            delete thing.targetY;
                        }
                        useEnergy(userData, energyUsed);
                    }
                }

                const distanceToSun = getDistanceTo(thing, { posX: 375, posY: 375 });
                if (distanceToSun < 50 && !currentMultiverse.eventsDone.includes("Sunscoop")) {
                    unlockResearchForElement(userData, "Sunscoop");
                }
            }
        }
        if (hostileCount < Math.max(currentSystem.dangerLevel / 2, 3)) {
            currentSystem.timeUntilHostileSpawn--;
            if (currentSystem.timeUntilHostileSpawn <= 0) {
                currentSystem.timeUntilHostileSpawn = Math.random() * 50 + 250 - currentSystem.dangerLevel * 15;
                let key = Math.floor(Math.random() * 10000);
                while (key in currentSystem.objects) {
                    key = Math.floor(Math.random() * 10000);
                }
                currentSystem.objects[key] = newHostile(userData);
            }
        }

        //Turrets
        if (currentMultiverse.turret.enabled) {
            if (currentMultiverse.turret.currentCharge < currentMultiverse.turret.chargeToFire) {
                turretStatus.textContent = `Charging ${Math.round(currentMultiverse.turret.currentCharge / currentMultiverse.turret.chargeToFire * 100)}%`;
                if (currentMultiverse.energy > 0) {
                    useEnergy(userData, 1);
                    currentMultiverse.turret.currentCharge++;
                }
            } else {
                turretStatus.textContent = "Waiting for target";
                const hostiles = [];
                for (const thing in currentSystem.objects) {
                    if (currentSystem.objects[thing].type === "hostile") hostiles.push(thing);
                }
                const target = choice(hostiles);
                if (hostiles.length > 0) {
                    turretStatus.textContent = "Firing";
                    let key = Math.floor(Math.random() * 10000);
                    while (key in currentSystem.objects) {
                        key = Math.floor(Math.random() * 10000);
                    }
                    currentSystem.objects[key] = {
                        type: "missile",
                        posX: currentSystem.objects.player.posX,
                        posY: currentSystem.objects.player.posY,
                        targetObjectId: target,
                        damage: 1
                    }

                    currentMultiverse.turret.currentCharge = 0;
                }

            }
        }

        let debrisCount = 0;
        for (const object in currentSystem.objects) {
            const currentObject = currentSystem.objects[object];
            if (currentObject.type === "debris") debrisCount++;
        }
        
        //Randomly spawn some debris that can give you iridium
        if (debrisCount < 3) {
            if (Math.random() < .005) {
                let key = Math.floor(Math.random() * 10000);
                while (key in currentSystem.objects) {
                    key = Math.floor(Math.random() * 10000);
                }
                currentSystem.objects[key] = {
                    type: "debris",
                    posX: Math.ceil(Math.random() * 750),
                    posY: Math.ceil(Math.random() * 750),
                    cargo: {
                        iridium: 1,
                        dust: Math.ceil(currentSystem.tier * Math.random() * 2),
                        metal: Math.ceil(currentSystem.tier * Math.random())
                    }
                }
            }
        }
    }
}

const getDistanceTo = (obj1, obj2) => Math.sqrt((obj1.posX - obj2.posX) ** 2 + (obj1.posY - obj2.posY) ** 2);
const statMappings = {
    baseAttack: "Attack",
    baseHealth: "Hull",
    baseShield: "Shield",
    baseSpeed: "Speed"
}

function generateShipLoot(enemyShip) {
    const evaluatedThreatLevel = threatLevel(enemyShip);
    const iridiumGained = Math.ceil(evaluatedThreatLevel / 2);
    const metalGained = Math.ceil(evaluatedThreatLevel * Math.random());

    return {
        iridium: iridiumGained,
        metal: metalGained
    }
}

function generateDebris(userData, enemyShip) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const currentSystem = currentMultiverse.solarSystems[currentMultiverse.currentSolarSystem];
    const debrisObj = {
        type: "debris",
        posX: enemyShip.posX,
        posY: enemyShip.posY,
        cargo: generateShipLoot(enemyShip)
    }
    let key = Math.floor(Math.random() * 10000);
    while (key in currentSystem.objects) {
        key = Math.floor(Math.random() * 10000);
    }
    currentSystem.objects[key] = debrisObj;
}

async function initCombat(ship, enemy, userData) {
    return new Promise(res => {
        const currentMultiverse = userData.multiverses[userData.currentMultiverse];
        currentMultiverse.allowSolarSystemUpdates = false;
        activeScreen = "attacked";
        updateVisibleDivs();
        for (const stat in ship.baseStats) {
            const newLi = document.createElement("li");
            newLi.classList.add("center");
            newLi.textContent = `${statMappings[stat]}: ${ship.baseStats[stat]}`;
            document.getElementById("attackedYourStats").appendChild(newLi);
        }
        for (const stat in enemy.baseStats) {
            const newLi = document.createElement("li");
            newLi.classList.add("center");
            newLi.textContent = `${statMappings[stat]}: ${enemy.baseStats[stat]}`;
            document.getElementById("attackedEnemyStats").appendChild(newLi);
        }

        const combatButton = document.createElement("button");
        combatButton.textContent = "Combat";
        document.getElementById("attacked").appendChild(combatButton);

        combatButton.addEventListener("click", async _ => {
            document.getElementById("attackedYourStats").innerHTML = "";
            document.getElementById("attackedEnemyStats").innerHTML = "";
            activeScreen = "";
            updateVisibleDivs();
            const combatResults = await combat(ship, enemy);
            res(combatResults);
            combatButton.remove();
        });
    })
}
function newHostile(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const currentSystem = currentMultiverse.solarSystems[currentMultiverse.currentSolarSystem];
    const playerX = currentSystem.objects.player.posX;
    const playerY = currentSystem.objects.player.posY;

    const selectedHostileStats = choice(hostileTiers[currentSystem.tier]);

    let posX = playerX - 100 + Math.random() * 200;
    let posY = playerY - 100 + Math.random() * 200;

    while (posX < 0 || posX > 750) {
        posX = playerX - 100 + Math.random() * 200;
    }
    while (posY < 0 || posY > 750) {
        posY = playerY - 100 + Math.random() * 200;
    }
    return {
        type: "hostile",
        currentHealth: selectedHostileStats.baseStats.baseHealth,
        baseStats: deepClone(selectedHostileStats.baseStats),
        posX,
        posY,
        targetX: Math.random() * 750,
        targetY: Math.random() * 750,
    }
}

async function dispatchShipEvent(userData) {
    openHangar(userData, true).then(ship => {
        dispatchShip(ship, selected, userData);
    }, _ => { });
}
function drawNewElement(x, y) {
    const newDiv = document.createElement("div");
    newDiv.style.left = `${x}px`;
    newDiv.style.top = `${y}px`;
    document.getElementById("systemMap").appendChild(newDiv);
    return newDiv;
}

function updateFactory(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const currentSystem = currentMultiverse.solarSystems[currentMultiverse.currentSolarSystem];
    document.getElementById("factorySwitchProduction").innerHTML = "";

    const targetPlanet = currentSystem.objects[selected];
    if (selected && "factory" in targetPlanet) {
        if (activeScreen === "planetInfo") {
            const factoryInfo = targetPlanet.factory;
            document.getElementById("factoryCurrentProduction").textContent = factoryInfo.making;
            document.getElementById("factoryManufacturingProgress").textContent = `${factoryInfo.currentProgress} / ${factoryInfo.progressRequired}`;
            for (const element of ["energy", "dust", "metal"]) {
                if (element === factoryInfo.making) continue;
                const newButton = document.createElement("button");
                newButton.classList.add("factoryButton");
                newButton.textContent = element;
                newButton.addEventListener("click", _ => {
                    if (element === "energy") factoryInfo.progressRequired = 100;
                    if (element === "dust") factoryInfo.progressRequired = 200;
                    if (element === "metal") factoryInfo.progressRequired = 400;
                    factoryInfo.making = element;
                    updateFactory(userData);
                })
                document.getElementById("factorySwitchProduction").appendChild(newButton);
            }
        }

    }
}

export {
    updateSolarSystem,
    dispatchShipEvent,
    updateSolarSystemPositions,
    goToHostile,
    launchMissile,
    moveMothership,
    sendShipToSun,
    recallButton,
    newHostile,
    sendShipToDebris,
    newTargetButton,
    cancelRedirect,
    buildScanner,
    updateFactory
};