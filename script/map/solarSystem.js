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
import { writeCostsReadable } from "../itemCosts.js";
import fadeIn from "../animations/fadeIn.js";
const planetVelocity = 8.8;

let activeScreen = "";
let cursorX = 0;
let cursorY = 0;
let selected;
let shipSelected;
let redirectionInProgress = false;
let redirectTarget;

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
    if (currentMultiverse.allowSolarSystemUpdates && currentDescription !== "buildWarpDrive") {
        removeDescription();
    }

    updateVisibleDivs();
    let cumulativeOffsetY = 0;

    if (currentScreenDisplayed === "Map") {

        document.getElementById("systemMap").innerHTML = "";
        const currentSystem = currentMultiverse.solarSystems[currentMultiverse.currentSolarSystem];

        //Draw the star
        const star = drawNewElement(375, 375);
        star.style.backgroundColor = "Yellow";
        star.style.height = "20px";
        star.style.width = "20px";
        cumulativeOffsetY += 20;
        star.style.borderRadius = `15px`;

        star.addEventListener("mousedown", _ => {
            if (activeScreen !== "scriptPlayer") {
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
            switch (thing.type) {
                case "planet":
                    posX = thing.posX;
                    posY = thing.posY;
                    const radius = thing.radius;
                    const systemObject = drawNewElement(posX - radius, posY - cumulativeOffsetY - radius);
                    systemObject.attributes.id = id;

                    addDescriptionEvent(systemObject, {
                        content: `Planet ${thing.name} (${getPlanetExplorationLevel(userData, thing)} % explored)`
                    });

                    selectTargetButton.classList.add("selectTargetButton");

                    if (redirectionInProgress) {
                        selectTargetButton.textContent = "Choose target";

                        selectTargetButton.addEventListener("click", _ => {
                            shipSelected.targetObjectId = id;
                            redirectionInProgress = false;
                            currentMultiverse.allowSolarSystemUpdates = true;
                            selectTargetButton.remove();
                        });
                        document.getElementById("Dispatch").style.display = "none";
                    } else {
                        document.getElementById("Dispatch").style.display = "block";
                    }

                    systemObject.addEventListener("mousedown", _ => {
                        if (activeScreen !== "scriptPlayer") {
                            activeScreen = "planetInfo";
                            selected = id;
                            updateVisibleDivs();
                            document.getElementById("planetName").textContent = thing.name;
                            document.getElementById("planetTypeDisplay").textContent = thing.planetType;
                            document.querySelectorAll(".selectTargetButton").forEach(e => e.remove());
                            if (redirectionInProgress) document.getElementById("planetInfo").appendChild(selectTargetButton);
                        }
                    });
                    systemObject.style.backgroundColor = thing.color;
                    systemObject.style.borderRadius = "500px";
                    systemObject.style.height = `${thing.radius * 2}px`;
                    cumulativeOffsetY += thing.radius * 2;
                    systemObject.style.width = `${thing.radius * 2}px`;
                    break;
                case "player":
                    const you = drawNewElement(thing.posX - 10, thing.posY - cumulativeOffsetY - 10);
                    you.style.width = "20px";
                    you.style.height = "20px";
                    cumulativeOffsetY += 20;
                    you.style.backgroundColor = "white";
                    addDescriptionEvent(you, {
                        content: "You"
                    });
                    break;
                case "hostile":
                    const enemy = drawNewElement(thing.posX - 7.5, thing.posY - cumulativeOffsetY - 7.5);
                    enemy.attributes.id = id;

                    addDescriptionEvent(enemy, {
                        content: `Hostile: threat level ${threatLevel(thing)}`
                    });

                    selectTargetButton.classList.add("selectTargetButton");

                    if (redirectionInProgress) {
                        selectTargetButton.textContent = "Choose target";

                        selectTargetButton.addEventListener("click", _ => {
                            shipSelected.targetObjectId = id;
                            redirectionInProgress = false;
                            currentMultiverse.allowSolarSystemUpdates = true;
                            selectTargetButton.remove();
                        });
                        document.getElementById("hostileAttack").style.display = "none";
                        document.getElementById("launchMissile").style.display = "none";
                    } else {
                        document.getElementById("hostileAttack").style.display = "block";
                        document.getElementById("launchMissile").style.display = currentMultiverse.missiles > 0 ? "block" : "none";
                    }

                    enemy.addEventListener("mousedown", _ => {
                        if (activeScreen !== "scriptPlayer") {
                            selected = id;
                            activeScreen = "hostileInfo";
                            document.getElementById("missileCount").textContent = currentMultiverse.missiles;
                            document.getElementById("launchMissile").style.display = currentMultiverse.missiles > 0 ? "block" : "none";
                            updateVisibleDivs();
                            document.querySelectorAll(".selectTargetButton").forEach(e => e.remove());
                            if (redirectionInProgress) document.getElementById("hostileInfo").appendChild(selectTargetButton);
                        }
                    });
                    cumulativeOffsetY += 15;
                    enemy.style.backgroundColor = "red";
                    enemy.style.width = "15px";
                    enemy.style.height = "15px";
                    break;
                case "missile":
                    const missile = drawNewElement(thing.posX - 2.5, thing.posY - 2.5 - cumulativeOffsetY);
                    cumulativeOffsetY += 5;
                    missile.style.width = "5px";
                    missile.style.height = "5px";
                    missile.style.backgroundColor = "purple";
                    break;
                case "debris":
                    const debris = drawNewElement(thing.posX - 5, thing.posY - 5 - cumulativeOffsetY);
                    cumulativeOffsetY += 10;
                    debris.style.width = "10px";
                    debris.style.height = "10px";
                    debris.style.backgroundColor = "grey";

                    addDescriptionEvent(debris, {
                        content: "Debris"
                    });

                    debris.addEventListener("mousedown", _ => {
                        selected = id;

                        if (activeScreen !== "scriptPlayer") {

                            const debrisDiv = document.getElementById("debrisContent");
                            debrisDiv.innerHTML = "";

                            for (const item in thing.cargo) {
                                const newLi = document.createElement("li");
                                newLi.textContent = `${item}: ${thing.cargo[item]}`;
                                debrisDiv.appendChild(newLi);
                            }

                            activeScreen = "debrisInfo";
                            updateVisibleDivs();
                        }
                    });
                    break;
            }
        }
        for (const ship of currentMultiverse.ships) {
            if (ship.inSolarSystem) {
                const shipX = ship.posX;
                const shipY = ship.posY;

                const shipDiv = drawNewElement(shipX - 2.5, shipY - cumulativeOffsetY - 2.5);

                shipDiv.style.height = "10px";
                shipDiv.style.width = "10px";
                shipDiv.style.borderRadius = "10px";
                cumulativeOffsetY += 10;
                shipDiv.style.backgroundColor = "green";

                shipDiv.addEventListener("mousedown", _ => {
                    if (activeScreen !== "scriptPlayer") {
                        shipSelected = ship;
                        activeScreen = "shipInfo";
                        updateVisibleDivs();
                        document.getElementById("destinationSpan").textContent = ship.targetObjectId === "player" ? "Mothership" : 
                            (currentSystem.objects[ship.targetObjectId].type === "hostile" ? "Enemy ship" : currentSystem.objects[ship.targetObjectId].name);
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

const clickOnPlanetOrHostile = document.getElementById("clickOnPlanetOrHostile");
async function newTargetButton(userData) {
    if (!redirectionInProgress) {
        const currentMultiverse = userData.multiverses[userData.currentMultiverse];

        redirectionInProgress = true;
        updateSolarSystem(userData);
        currentMultiverse.allowSolarSystemUpdates = false;
        clickOnPlanetOrHostile.style.display = "block";
        fadeIn(clickOnPlanetOrHostile, 1.5);
        setTimeout(_ => clickOnPlanetOrHostile.style.display = "none", 3000);
    }

}

document.getElementById("systemMap").addEventListener("click", e => {
    if (e.target.id == "systemMap" && activeScreen !== "scriptPlayer" && activeScreen !== "attacked") {
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
    if (activeScreen !== "scriptPlayer" && activeScreen !== "attacked") {
        //Did we click outside the system map?
        let clickedOutside = true;
        let node = e.target;
        while (node) {
            if (node.id === "systemMap" || node.id === "encounterInfo") {
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
            damage: 5
        }
    }
    document.getElementById("missileCount").textContent = currentMultiverse.missiles;
}

async function goToHostile(userData) {
    openHangar(userData, true).then(ship => {
        dispatchShip(ship, selected, userData);
    });
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
        for (const ship of currentMultiverse.ships) {
            if (ship.inSolarSystem && ship.targetObjectId) {
                if (ship.targetObjectId === "sun") {
                    const distanceToTarget = getDistanceTo(ship, {
                        posX: 375,
                        posY: 375
                    });
                    moveTowards(ship, {
                        posX: 375,
                        posY: 375
                    }, Math.min(ship.baseStats.baseSpeed * 0.5, distanceToTarget));

                    if (distanceToTarget < 20) {
                        const energyGained = Math.ceil(Math.random() * 5000) + 5000;
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
                                    activeScreen = "scriptPlayer";
                                    currentMultiverse.allowSolarSystemUpdates = false;
                                    arriveAtTarget(ship, userData).then(res => {
                                        activeScreen = "";
                                        currentMultiverse.allowSolarSystemUpdates = true;
                                    });
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

                                if (ship.currentHealth < ship.baseStats.baseHealth && !currentMultiverse.eventsDone.includes("unlockRepairKit")) {
                                    notifyUnique("unlockRepairKit");
                                    addNavigationAttention("Research", "pageResearch");
                                    currentMultiverse.researchUnlocked.push("repairKit");
                                    updateResearchButtons(userData);
                                    currentMultiverse.eventsDone.push("unlockRepairKit");
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
                        moveTowards(ship, target, Math.min(ship.baseStats.baseSpeed * 0.5, distToTarget));
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
                        if (distToShip < closestDistance) {
                            closestShip = ship;
                            closestShipIndex = i;
                            closestDistance = distToShip;
                        }
                    }
                }
                if (closestShip && closestDistance < 100) {
                    moveTowards(thing, closestShip, thing.baseStats.baseSpeed * 1.2);
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

                    const distanceToTarget = Math.sqrt(Math.pow(hostileX - targetX, 2) + Math.pow(hostileY - targetY, 2));
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
                moveTowards(thing, target, 5);
                const distance = getDistanceTo(thing, target);
                if (distance < 10) {
                    if (thing.targetObjectId === "player") {
                        currentMultiverse.missiles++;
                        document.getElementById("missileCount").textContent = currentMultiverse.missiles;
                        delete currentSystem.objects[object];
                    } else {
                        target.currentHealth -= thing.damage;
                        if (target.currentHealth < 0) {
                            delete currentSystem.objects[thing.targetObjectId];
                            notify(`A missile detonated and destroyed an enemy.`);
                            generateDebris(userData, target);
                        } else {
                            notify(`A missile detonated and dealt 5 damage to an enemy (their hull: ${target.currentHealth}).`);
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
                        }, energyUsed * 0.5);
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
                if (distanceToSun < 50 && !currentMultiverse.eventsDone.includes("unlockSunscoop")) {
                    addNavigationAttention("Research", "pageResearch");
                    notifyUnique("unlockSunscoop");
                    currentMultiverse.researchUnlocked.push("Sunscoop");
                    updateResearchButtons(userData);
                    currentMultiverse.eventsDone.push("unlockSunscoop");
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
    }
}
const getDistanceTo = (obj1, obj2) => Math.sqrt(Math.pow(obj1.posX - obj2.posX, 2) + Math.pow(obj1.posY - obj2.posY, 2));
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

    return {
        type: "hostile",
        currentHealth: selectedHostileStats.baseStats.baseHealth,
        baseStats: deepClone(selectedHostileStats.baseStats),
        posX: playerX - 100 + Math.random() * 200,
        posY: playerY - 100 + Math.random() * 200,
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
export {
    updateSolarSystem,
    dispatchShipEvent,
    updateSolarSystemPositions,
    goToHostile,
    launchMissile,
    moveMothership,
    sendShipToSun,
    recallButton,
    sendShipToDebris,
    newTargetButton
};