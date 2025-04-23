import fadeIn from "./animations/fadeIn.js"
import { updateSolarSystem, updateSolarSystemPositions } from "./map/solarSystem.js";

const hideableIDs = [
    "dust",
    "dustCounter",
    "pageUpgrades",
    "pageSelector",
    "sidebar",
    "drones",
    "energyTitle",
    "dustbotDiv",
    "dustBot",
    "makeRepairKit",
    "dispatchToSun",
    "buildWarpDrive",
    "recallShip"
];
const screens = [
    "Energy",
    "Upgrades",
    "droneView",
    "Research",
    "dustbotView",
    "Shipyard",
    "playerShips",
    "Map",
    "Universe",
    "fabriBotView"
]
let currentScreenDisplayed = "";

const inlineBlockElements = [
]
const flexElements = [
    "drones"
]

function addNavigationAttention(screenName, elementID) {
    if (currentScreenDisplayed !== screenName)
        document.getElementById(elementID).classList.add("navigationAttention");
}
function hideLockedElements(elementsArray) {
    hideableIDs.forEach(e => {
        if (!elementsArray.includes(e)) {
            document.getElementById(e).style.display = "none";
        } else {
            document.getElementById(e).style.display = inlineBlockElements.includes(e) ? "inline-block": 
            (flexElements.includes(e) ? "flex" : "block");
        }
    });
}

function unlockUIElement(elementsArray, elementName) {
    if (!elementsArray.includes(elementName)) {
        elementsArray.push(elementName);
        const element = document.getElementById(elementName);
        element.style.display = inlineBlockElements.includes(elementName) ? "inline-block": 
            (flexElements.includes(elementName) ? "flex" : "block");
        fadeIn(element, 2);
    }
}

function toggleScreen(screenName) {
    screens.forEach(e => {
        document.getElementById(e).style.display = "none";
    })
    document.getElementById(screenName).style.display = "block";
    currentScreenDisplayed = screenName;
}
export {hideLockedElements, unlockUIElement, toggleScreen, currentScreenDisplayed, addNavigationAttention}