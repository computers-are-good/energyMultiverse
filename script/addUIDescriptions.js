import { checkCosts, costTextMappings, writeCostsReadable } from "./itemCosts.js";

const mouseoverDescriptions = {
    "dust": {
        content: "Create a small piece of dust from energy. It's not a lot, but perhaps they can be used for something better.",
        cost: {
            energy: 10
        }
    },
    "drone": {
        content: "Make a drone using some dust. Maybe it can collect energy for you.",
        cost: {
            dust: 5
        }
    },
    "viewDrones": {
        content: "View your drones."
    },
    "decreaseResearchRate": {
        content: "Decrease your research rate."
    },
    "increaseResearchRate": {
        content: "Increase your research rate."
    },
    "buildDustbot": {
        content: "Dustbot can make dust for you. You just have to build him first.",
        cost: {
            dust: 20,
            energy: 200
        }
    },
    "buildShip": {
        content: "Start building your ship. You will pay the material costs, but the energy costs are paid as you go."
    },
    "makeMissile": {
        content: "A missile will deal a base of 5 damage to any enemy ship's hull when it hits them.",
        cost: {
            energy: 50,
            metal: 5
        }
    },
    "metal": {
        content: "Make somthing better and more usable from dust.",
        cost: {
            energy: 30,
            dust: 5
        }
    },
    "makeRepairKit": {
        content: "Repairs 15% of a ship's hull.",
        cost: {
            metal: 3
        }
    },
    "buildScanner": {
        content: "Builds a scanner so you can see enemy ship stats.",
        cost: {
            iridium: 3,
            metal: 5
        }
    },
    "dispatchToSun": {
        content: "Sends a ship to harvest energy from the star. The ship must have a sunscoop. The sunscoop will be destroyed."
    },
    "buildWarpDrive": {
        content: "Build a warp drive, which allows you to jump between systems.",
        cost: {
            metal: 10,
            iridium: 5
        }
    },
    "buildTurret": {
        content: "Build a turret that will automatically fire at enemies.",
        cost: {
            energy: 500,
            dust: 50,
            metal: 10,
            iridium: 10
        }
    }
}
let currentDescription = "";
const cost = document.getElementById("cost");
const upgradePreview = document.getElementById("upgradePreview");
const descriptionText = document.getElementById("description");
const descriptionBox = document.getElementById("descriptionBox");
let showingDescription = false;

function updateDescription(description, x, y, userData) {
    showingDescription = true;
    descriptionBox.style.display = "block";
    descriptionBox.style.top = `${y + 25}px`;
    descriptionBox.style.left = `${x + 25}px`;
    populateDescription(description, userData);
}
function populateDescription(description, userData) {
    descriptionText.textContent = description.content;
    if (description.cost) {
        cost.innerHTML = "Cost: ";
        if (userData) {
            const currentMultiverse = userData.multiverses[userData.currentMultiverse];
            for (const thing in description.cost) {
                const newSpan = document.createElement("span");
                newSpan.textContent = `${description.cost[thing]} ${costTextMappings[thing]} `;
                cost.appendChild(newSpan);
                if (description.cost[thing] > currentMultiverse[thing]) {
                    newSpan.style.color = "red";
                } else {
                    newSpan.style.color = "green";
                }
            }
        } else {
            cost.style.color = "white";
            for (const thing in description.cost) {
                const newSpan = document.createElement("span");
                newSpan.textContent = `${description.cost[thing]} ${costTextMappings[thing]} `;
                cost.appendChild(newSpan);
            }
        }
    }
    if (description.upgradePreview) {
        upgradePreview.textContent = description.upgradePreview;
    }
}
document.body.addEventListener("mousemove", e => {
    if (showingDescription) {
        descriptionBox.style.top = `${e.y + 25}px`;
        descriptionBox.style.left = `${e.x + 25}px`;
    }
})
function removeDescription() {
    descriptionText.textContent = "";
    cost.textContent = "";
    currentDescription = "";
    upgradePreview.textContent = "";
    descriptionBox.style.display = "none";
    showingDescription = false;
}
function addUIDescriptions(userData) {
    for (let id in mouseoverDescriptions) {
        const description = mouseoverDescriptions[id];
        const element = document.getElementById(id);
        addDescriptionEvent(element, description, userData, id);
    }
}
function manualDescriptionUpdate(description, x, y, screen) {
    currentDescription = screen;
    updateDescription(description, x, y);
}
function changeDescriptionText(description, userData) {
    populateDescription(description, userData)
}
function addDescriptionEvent(element, description, userData, screen) {
    element.addEventListener("mouseover", e => {
        currentDescription = screen;
        updateDescription(description, e.x, e.y, userData);
    });
    element.addEventListener("mousedown", e => {
        setTimeout(_ => {
            if (screen === currentDescription) updateDescription(description, e.x, e.y, userData)
        }, 10);
    })
    element.addEventListener("mouseout", removeDescription);
}
export {
    addUIDescriptions,
    mouseoverDescriptions,
    manualDescriptionUpdate,
    removeDescription,
    currentDescription,
    changeDescriptionText,
    addDescriptionEvent,
}