import { addDescriptionEvent, changeDescriptionText, manualDescriptionUpdate } from "../addUIDescriptions.js";
import { shipClasses, shipAccessories, shipWeapons } from "../data/shipData.js";
import { checkCosts, subtractCosts, writeCostsReadable } from "../itemCosts.js";
import notify from "../notifs/notify.js";
import { appendCloseButton, hideOverlay, setOverlayTitle, showOverlay } from "../overlay.js";
import { updateEnergyCounter, updateShipConstruction } from "../pageUpdates.js";
import { deepClone } from "../utils.js";

let selectedShipType = "";
let selectedWeaponsType = "Phasor";
let totalEnergyCost = 0;
let accessoriesSelected = [];
let accessorySlotsUsed = 0;
let accessorySlotsAvailable = 0;
let userDataBig;

const statMappings = {
    baseHealth: "Hull",
    baseAttack: "Attack",
    baseShield: "Shield",
    baseSpeed: "Speed",
    minRange: "Minimum range",
    maxRange: "Maximum range",
    baseDamageMultiplier: "Damage multiplier"
}
let totalShipCost = {}
function openChooseShipOverlay(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    showOverlay();
    setOverlayTitle("Choose ship class");

    const chooseShipClass = document.createElement("div");
    chooseShipClass.id = "chooseShipClass";
    document.getElementById("overlay").appendChild(chooseShipClass);

    const classesUnlockedArray = [];
    for (let shipClass of currentMultiverse.shipClassesUnlocked) {
        const shipObj = shipClasses[shipClass];
        if (!classesUnlockedArray.includes(shipObj.class)) classesUnlockedArray.push(shipObj.class);
    }

    const classesUnlockedObj = {}
    for (const shipClass of classesUnlockedArray) {
        const newHeading = document.createElement("h2")
        newHeading.textContent = shipClass;
        const newDiv = document.createElement("div");

        newDiv.appendChild(newHeading);
        newDiv.classList.add("specificShipClass");

        const divForClasses = document.createElement("div");
        divForClasses.classList.add("divForClasses");
        classesUnlockedObj[shipClass] = divForClasses;
        newDiv.appendChild(divForClasses);
        chooseShipClass.appendChild(newDiv);
    }

    let allShipDivs = [];
    for (let shipClass of currentMultiverse.shipClassesUnlocked) {
        const shipObj = shipClasses[shipClass];
        const newDiv = document.createElement("div");
        allShipDivs.push(newDiv);
        newDiv.classList.add("shipClassDiv");
        const classTitle = document.createElement("p");
        classTitle.textContent = shipClass;
        newDiv.appendChild(classTitle);

        if (selectedShipType === shipClass) {
            newDiv.classList.add("shipSelected");
        }

        const statsWrapper = document.createElement("ul");

        for (const stat in shipObj.baseStats) {
            const newLi = document.createElement("li");
            newLi.textContent = `${statMappings[stat]}: ${shipObj.baseStats[stat]}`;
            statsWrapper.appendChild(newLi);
        }

        addDescriptionEvent(newDiv, {
            content: shipObj.description,
            cost: shipObj.baseCost
        }, userData);

        newDiv.addEventListener("click", _ => {
            document.getElementById("chooseShipAccessories").style.display = "flex";
            document.getElementById("selectAccessoriesText").style.display = "block";
            document.getElementById("selectedShipClassDisplay").textContent = shipClass;
            document.getElementById("selectedShipClass").style.display = "block";
            document.getElementById("selectWeapons").style.display = "block";

            if (selectedShipType) {
                document.querySelectorAll(".shipClassDiv").forEach(e => e.classList.remove("selectedShip"))
            }
            if (shipObj.accessorySlots < accessorySlotsUsed) {
                //remove accessories until we have gotten below the limit
                for (let index in accessoriesSelected) {
                    const accessory = accessoriesSelected[index];
                    accessory.associatedDiv.classList.remove("shipSelected");
                    accessorySlotsUsed -= shipAccessories[accessory.name].accessorySlots;
                    accessoriesSelected[index] = 0;
                    if (accessorySlotsUsed <= shipObj.accessorySlots) {
                        break;
                    }
                }
                accessoriesSelected = accessoriesSelected.filter(e => e !== 0);
            }
            accessorySlotsAvailable = shipObj.accessorySlots;
            selectedShipType = shipClass;
            allShipDivs.forEach(e => e.classList.remove("shipSelected"));
            newDiv.classList.add("shipSelected");

            calculateShipCost();
            updateShipCost();
            updateAccessoriesCost();
        });

        newDiv.appendChild(statsWrapper);
        classesUnlockedObj[shipObj.class].appendChild(newDiv);
    }

    appendCloseButton();
}

function openChooseWeaponOverlay(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    showOverlay();
    setOverlayTitle("Choose weapons system");

    const weaponsDiv = document.createElement("div");
    weaponsDiv.classList.add("flexCenter");
    currentMultiverse.weaponsUnlocked.forEach(e => {
        const newDiv = document.createElement("div");
        newDiv.classList.add("weaponsDiv");
        const weaponInfo = shipWeapons[e];
        const statsWrapper = document.createElement("ul");

        // Indicate if weapon is selected
        if (e === selectedWeaponsType) newDiv.classList.add("shipSelected");

        // Weapon name
        const name = document.createElement("li");
        name.textContent = e;
        statsWrapper.appendChild(name);

        // Weapon stats
        for (const stat in weaponInfo.baseStats) {
            const newLi = document.createElement("li");
            newLi.textContent = `${statMappings[stat]}: ${weaponInfo.baseStats[stat]}`;
            statsWrapper.appendChild(newLi);
        }

        // Mouseover description
        addDescriptionEvent(newDiv, {
            content: weaponInfo.description,
            cost: weaponInfo.baseCost
        }, userData);

        // Select weapon
        newDiv.addEventListener("click", _ => {
            document.querySelectorAll(".weaponsDiv").forEach(e => e.classList.remove("shipSelected"));
            newDiv.classList.add("shipSelected");
            selectedWeaponsType = e;

            // Update all costs for ship
            calculateShipCost();
            updateShipCost();
            updateAccessoriesCost();
        });

        newDiv.appendChild(statsWrapper);
        weaponsDiv.appendChild(newDiv);
    });
    document.getElementById("overlay").appendChild(weaponsDiv);

    appendCloseButton();
}
function drawBuildShipsDiv(userData) {
    userDataBig = userData;
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    document.getElementById("totalEnergyCost").style.display = "none";
    document.getElementById("chooseShipAccessories").style.display = "none";
    document.getElementById("chooseShipAccessories").innerHTML = "";
    document.getElementById("selectAccessoriesText").style.display = "none";
    for (let shipAccessory of currentMultiverse.shipAccessoriesUnlocked) {
        const accessoryInfo = shipAccessories[shipAccessory];
        const newDiv = document.createElement("div");

        const title = document.createElement("p");
        title.textContent = shipAccessory;

        const accessoryObj = {
            name: shipAccessory,
            associatedDiv: newDiv
        }

        addDescriptionEvent(newDiv, {
            content: accessoryInfo.description,
            cost: accessoryInfo.baseCost,
        }, userData);

        newDiv.addEventListener("click", _ => {
            if ((_ => {
                for (let e of accessoriesSelected) {
                    if (e.name === shipAccessory) return true;
                }
                return false;
            })()
            ) {
                newDiv.classList.remove("shipSelected");
                for (let i = 0; i < accessoriesSelected.length; i++) {
                    if (accessoriesSelected[i].name === shipAccessory) {
                        accessoriesSelected.splice(i, 1);
                    }
                }
                accessorySlotsUsed -= accessoryInfo.accessorySlots;

            } else {
                if (accessorySlotsUsed + accessoryInfo.accessorySlots <= accessorySlotsAvailable) {
                    accessorySlotsUsed += accessoryInfo.accessorySlots;
                    newDiv.classList.add("shipSelected");
                    accessoriesSelected.push(accessoryObj);
                }
            }
            calculateShipCost();
            updateShipCost();
            updateAccessoriesCost();
        });

        newDiv.appendChild(title);

        document.getElementById("chooseShipAccessories").appendChild(newDiv);
    }
}
function calculateShipCost() {
    totalShipCost = {
        dust: 0,
        metal: 0,
        iridium: 0
    }

    //Base cost
    for (let cost in shipClasses[selectedShipType].baseCost) {
        totalShipCost[cost] += shipClasses[selectedShipType].baseCost[cost];
    }

    // Weapon cost
    for (let cost in shipWeapons[selectedWeaponsType].baseCost) {
        totalShipCost[cost] += shipWeapons[selectedWeaponsType].baseCost[cost];
    }

    totalEnergyCost = 0;
    totalEnergyCost += shipClasses[selectedShipType].energyCost;

    //Cost for accessories
    for (let accessory of accessoriesSelected) {
        const accessoryInfo = shipAccessories[accessory.name];
        totalEnergyCost += accessoryInfo.energyCost;
        for (let cost in accessoryInfo.baseCost) {
            totalShipCost[cost] += accessoryInfo.baseCost[cost];
        }
    }

    for (let key in totalShipCost) {
        if (totalShipCost[key] === 0) delete totalShipCost[key];
    }
}
document.getElementById("buildShip").addEventListener("mouseover", e => {
    const obj = {
        content: "Start building your ship. You will pay the material costs, but the energy costs are paid as you go.",
    }
    if (Object.keys(totalShipCost).length > 0) obj.cost = totalShipCost;
    changeDescriptionText(obj, userDataBig);
});

function updateShipCost() {
    document.getElementById("totalEnergyCost").style.display = "block";
    document.getElementById("totalEnergyCostSpan").textContent = totalEnergyCost;
}

function updateAccessoriesCost() {
    document.getElementById("accessoriesCostUsed").textContent = accessorySlotsUsed;
    document.getElementById("accessoriesCostTotal").textContent = accessorySlotsAvailable;
}

function buildShip(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    if (!selectedShipType) {
        notify("Please select a ship class.");
        return;
    }
    if (currentMultiverse.ships.length >= currentMultiverse.maxHangarShips) {
        notify("You have reached the maximum number of ships in your hangar.");
        return;
    }
    calculateShipCost();
    if (checkCosts(userData, totalShipCost)) {
        const shipObj = {
            shipInfo: {
                class: selectedShipType,
                baseStats: deepClone(shipClasses[selectedShipType].baseStats),
                cost: deepClone(totalShipCost),
                weapon: selectedWeaponsType,
                accessories: []
            },
            energyCostTotal: totalEnergyCost,
            energySpent: 0
        }
        selectedWeaponsType = "Phasor"; //default weapon for new ships
        subtractCosts(userData, totalShipCost);
        for (let accessory of accessoriesSelected) {
            shipObj.shipInfo.accessories.push(accessory.name);
        }

        currentMultiverse.shipInProgress = shipObj;
        document.getElementById("selectWeapons").style.display = "none";
        updateShipConstruction(userData);
        updateEnergyCounter(userData);
    }

}

function showShipbuildingProgress(userData, x, y) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const energyCost = currentMultiverse.shipInProgress.energyCostTotal;
    const energySpent = currentMultiverse.shipInProgress.energySpent;
    manualDescriptionUpdate({
        content: `${energySpent} / ${energyCost} until complete.`
    }, x, y, "shipbuildingBar");
}

export {
    drawBuildShipsDiv,
    buildShip,
    showShipbuildingProgress,
    openChooseShipOverlay,
    openChooseWeaponOverlay
}