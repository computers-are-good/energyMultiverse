const mouseoverDescriptions = {
    "dust": {
        content: "Create a small piece of dust from energy. It's not a lot, but perhaps they can be used for something better.",
        cost: "10 energy"
    },
    "drone": {
        content: "Make a drone using some dust. Maybe it can collect energy for you.",
        cost: "5 dust."
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
        cost: "200 energy, 20 dust"
    },
    "buildShip": {
        content: "Start building your ship. You will pay the material costs, but the energy costs are paid as you go."
    },
    "makeMissile": {
        content: "A missile will deal 5 damage to any enemy ship's hull when it hits them.",
        cost: "50 energy 5 metal"
    },
    "metal": {
        content: "Make somthing better and more usable from dust.",
        cost: "30 energy, 5 dust"
    },
    "makeRepairKit": {
        content: "Repairs 15% of a ship's hull.",
        cost: "3 metal"
    },
    "dispatchToSun": {
        content: "Sends a ship to harvest energy from the star. The ship must have a sunscoop. The sunscoop will be destroyed."
    }
}
let currentDescription = "";
const cost = document.getElementById("cost");
const upgradePreview = document.getElementById("upgradePreview");
const descriptionText = document.getElementById("description");
const descriptionBox = document.getElementById("descriptionBox");
let showingDescription = false;

function updateDescription(description, x, y) {
    showingDescription = true;
    descriptionBox.style.display = "block";
    descriptionBox.style.top = `${y + 25}px`;
    descriptionBox.style.left = `${x + 25}px`;
    populateDescription(description);
}
function populateDescription(description) {
    descriptionText.textContent = description.content;
    if (description.cost) {
        cost.textContent = `Cost: ${description.cost}`;
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
function addUIDescriptions() {
    for (let id in mouseoverDescriptions) {
        const description = mouseoverDescriptions[id];
        const element = document.getElementById(id);
        addDescriptionEvent(element, description)
    }
}
function manualDescriptionUpdate(description, x, y, screen) {
    currentDescription = screen;
    updateDescription(description, x, y);
}
function changeDescriptionText(description) {
    populateDescription(description)
}
function addDescriptionEvent(element, description, screen) {
    currentDescription = screen;
    element.addEventListener("mouseover", e => {
        updateDescription(description, e.x, e.y);
    });
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