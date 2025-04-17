import threatLevel from "../map/threatLevel.js";

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

    for (const ship of currentMultiverse.ships) {
        if (f) if (!f(ship)) continue;
        const newDiv = document.createElement("div");
        const newP = document.createElement("p");
        newP.textContent = ship.class;
        if (ship.isBusy) newDiv.classList.add("shipBusy");
        newDiv.appendChild(newP);

        for (const stat in ship.baseStats) {
            const newP = document.createElement("p");
            if (stat === "baseHealth") {
                newP.textContent = `Hull: ${ship.currentHealth} / ${ship.baseStats.baseHealth}`
            } else {
                newP.textContent = `${statMappings[stat]}: ${ship.baseStats[stat]}`
            }
            newDiv.appendChild(newP);
        }

        const powerLevel = document.createElement("p");
        powerLevel.textContent = `Power level: ${threatLevel(ship)}`;
        newDiv.appendChild(powerLevel);
        if (askForShipSelection && !ship.isBusy) {
            newDiv.addEventListener("click", _ => {
                selectedShip = ship;
                if (selectedDiv) {
                    selectedDiv.classList.remove("shipSelected");
                }
                selectedDiv = newDiv;
                selectedDiv.classList.add("shipSelected");
            });
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
}
function closeHangar() {
    document.getElementById("playerShips").style.display = "none";
}

export { openHangar, closeHangar }