import { writeCostsReadable } from "../itemCosts.js";
import threatLevel from "../map/threatLevel.js";
import { updateDustCounter, updateEnergyCounter, updateIridiumCounter, updateMetalCounter } from "../pageUpdates.js";

const statMappings = {
    baseHealth: "Hull",
    baseAttack: "Attack",
    baseShield: "Shield",
    baseSpeed: "Speed"
}
let selectedShip;
let selectedDiv;

function openHangar(userData, askForShipSelection, f) {
    document.getElementById("playerShips").style.display = "block";
    document.getElementById("playerShipsDisplay").innerHTML = "";
    if (askForShipSelection) {
        document.getElementById("closeHangar").style.display = "none";
        document.getElementById("submitShipSelection").style.display = "block";
        document.getElementById("cancelShipDispatch").style.display = "block";
    } else {
        document.getElementById("closeHangar").style.display = "block";
        document.getElementById("submitShipSelection").style.display = "none";
        document.getElementById("cancelShipDispatch").style.display = "none";
    }
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    document.getElementById("hangarCapacityUsed").textContent = currentMultiverse.ships.length;
    document.getElementById("hangarCapacityTotal").textContent = currentMultiverse.maxHangarShips;

    document.getElementById("repairKitCount").textContent = currentMultiverse.manufactoryItems.repairKit;

    for (const i in currentMultiverse.ships) {
        let healthDiv;
        const ship = currentMultiverse.ships[i];
        if (f) if (!f(ship)) continue;
        const newDiv = document.createElement("div");
        const newP = document.createElement("p");
        newP.textContent = ship.class;
        if (ship.isBusy) newDiv.classList.add("shipBusy");
        newDiv.appendChild(newP);

        for (const stat in ship.baseStats) {
            const newP = document.createElement("p");
            if (stat === "baseHealth") {
                healthDiv = newP;
                newP.textContent = `Hull: ${ship.currentHealth} / ${ship.baseStats.baseHealth}`
            } else {
                newP.textContent = `${statMappings[stat]}: ${ship.baseStats[stat]}`
            }
            newDiv.appendChild(newP);
        }

        const powerLevel = document.createElement("p");
        powerLevel.textContent = `Power level: ${threatLevel(ship)}`;
        newDiv.appendChild(powerLevel);

        if (ship.accessories?.length > 0) {
            const shipAccessories = document.createElement("p");
            const accessoriesString = ship.accessories?.join(", ")
            shipAccessories.textContent = `Accessories: ${accessoriesString}`;
            newDiv.appendChild(shipAccessories);
        }

        if (askForShipSelection && !ship.isBusy) {
            newDiv.addEventListener("click", e => {
                if (e.target.classList.contains("repairButton") || e.target.classList.contains("scrapButton")) return;
                selectedShip = ship;
                if (selectedDiv) {
                    selectedDiv.classList.remove("shipSelected");
                }
                selectedDiv = newDiv;
                selectedDiv.classList.add("shipSelected");
            });
        }
        if (!ship.isBusy) {

            const buttonsDiv = document.createElement("div");
            buttonsDiv.classList.add("hangarButtons");
            const repairButton = document.createElement("button");
            repairButton.textContent = "Repair";
            repairButton.classList.add("repairButton");
            if (ship.currentHealth < ship.baseStats.baseHealth) buttonsDiv.appendChild(repairButton);

            repairButton.addEventListener("click", _ => {
                if (currentMultiverse.manufactoryItems.repairKit > 0) {
                    currentMultiverse.manufactoryItems.repairKit--;
                    document.getElementById("repairKitCount").textContent = currentMultiverse.manufactoryItems.repairKit;
                    ship.currentHealth += Math.ceil(ship.baseStats.baseHealth * 0.15);
                    if (ship.currentHealth >= ship.baseStats.baseHealth) {
                        ship.currentHealth = ship.baseStats.baseHealth;
                        repairButton.remove();
                    }
                    healthDiv.textContent = `Hull: ${ship.currentHealth} / ${ship.baseStats.baseHealth}`;
                }
            });

            const scrapButton = document.createElement("button");
            scrapButton.classList.add("scrapButton");
            scrapButton.textContent = "Scrap";
            buttonsDiv.appendChild(scrapButton);

            scrapButton.addEventListener("click", _ => {
                const confirmed = confirm(`Scrap ship? You will obtain ${writeCostsReadable(ship.cost)}.`);
                if (confirmed) {
                    for (const cost in ship.cost) currentMultiverse[cost] += ship.cost[cost];
                    updateEnergyCounter(userData);
                    updateMetalCounter(userData);
                    updateDustCounter(userData);
                    updateIridiumCounter(userData);
                    document.getElementById("hangarCapacityUsed").textContent = currentMultiverse.ships.length;
                    currentMultiverse.ships.splice(i, 1);
                    newDiv.remove();
                }
            });
            newDiv.appendChild(buttonsDiv);
        }



        document.getElementById("playerShipsDisplay").appendChild(newDiv);
    }


    if (askForShipSelection) {
        return new Promise((res, rej) => {
            document.getElementById("cancelShipDispatch").addEventListener("click", cancelEvent);
            document.getElementById("submitShipSelection").addEventListener("click", submitEvent);
            function cancelEvent() {
                closeHangar();
                rej();
                document.getElementById("cancelShipDispatch").removeEventListener("click", cancelEvent);
            }
            function submitEvent() {
                if (selectedShip) {
                    closeHangar();
                    res(selectedShip);
                    document.getElementById("submitShipSelection").removeEventListener("click", submitEvent);
                }
            }
        });
    }

    //Use Esc to back out of the hangar screen
    document.body.addEventListener("keyup", handleEscape);
    function handleEscape(e) {
        if (e.key === "Escape") {
            closeHangar();
            document.body.removeEventListener("keyup", handleEscape);
        }
    }
}
function closeHangar() {
    document.getElementById("playerShips").style.display = "none";
}

export { openHangar, closeHangar }