import { addDescriptionEvent, changeDescriptionText, manualDescriptionUpdate } from "../addUIDescriptions.js";
import { shipClasses, shipAccessories } from "../data/shipData.js";
import { checkCosts, subtractCosts, writeCostsReadable } from "../itemCosts.js";
import notify from "../notifs/notify.js";
import { updateEnergyCounter, updateShipConstruction } from "../pageUpdates.js";
import { deepClone } from "../utils.js";

let selectedShipType = "";
let selectedShipDiv;
let totalEnergyCost = 0;
let accessoriesSelected = [];
let accessorySlotsUsed = 0;
let accessorySlotsAvailable = 0;
let userDataBig;

const statMappings = {
    baseHealth: "Hull",
    baseAttack: "Attack",
    baseShield: "Shield",
    baseSpeed: "Speed"
}
let totalShipCost = {
}
function drawBuildShipsDiv(userData) {
    userDataBig = userData;
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    document.getElementById("totalEnergyCost").style.display = "none";
    document.getElementById("chooseShipAccessories").style.display = "none";
    document.getElementById("chooseShipAccessories").innerHTML = "";
    document.getElementById("chooseShipClass").innerHTML = "";
    document.getElementById("selectAccessoriesText").style.display = "none";

    for (let shipClass of currentMultiverse.shipClassesUnlocked) {
        const shipObj = shipClasses[shipClass];
        const newDiv = document.createElement("div");
        const classTitle = document.createElement("p");
        classTitle.textContent = shipClass;
        newDiv.appendChild(classTitle);

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
            if (selectedShipType) {
                selectedShipDiv.classList.remove("shipSelected");
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
            selectedShipDiv = newDiv;
            selectedShipType = shipClass;
            newDiv.classList.add("shipSelected");

            calculateShipCost();
            updateShipCost();
            updateAccessoriesCost();
        });

        newDiv.appendChild(statsWrapper);

        document.getElementById("chooseShipClass").appendChild(newDiv);
    }

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
    for (let cost in shipClasses[selectedShipType].baseCost) {
        totalShipCost[cost] += shipClasses[selectedShipType].baseCost[cost];
    }
    totalEnergyCost = 0;
    totalEnergyCost += shipClasses[selectedShipType].energyCost;
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
                accessories: []
            },
            energyCostTotal: totalEnergyCost,
            energySpent: 0
        }
        subtractCosts(userData, totalShipCost);
        for (let accessory of accessoriesSelected) {
            shipObj.shipInfo.accessories.push(accessory.name);
        }

        currentMultiverse.shipInProgress = shipObj;
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

export { drawBuildShipsDiv, buildShip, showShipbuildingProgress }