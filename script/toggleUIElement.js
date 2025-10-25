import fadeIn from "./animations/fadeIn.js"
import { updateBoundingBoxes } from "./data/tutorialText.js";
import { updateSolarSystem, updateSolarSystemPositions } from "./map/solarSystem.js";
import displayTutorialText from "./notifs/tutorialText.js";

const hideableIDs = [
    "dust",
    "dustCounter",
    "pageUpgrades",
    "pageSelector",
    "sidebar",
    "drones",
    "energyTitle",
    "dustbotDiv",
    "fabriBot",
    "dustBot",
    "turret",
    "makeRepairKit",
    "metals",
    "metalCounter",
    "pageShipyard",
    "pageMap",
    "dispatchToSun",
    "buildWarpDrive",
    "recallShip",
    "pageStatistics",
    "energyStatistics",
    "buildAntimatterBeam",
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
    "Statistics",
    "fabriBotView"
]
let currentScreenDisplayed = "";

const inlineBlockElements = [
]
const flexElements = [
    "drones",
    "metals"
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
            document.getElementById(e).style.display = inlineBlockElements.includes(e) ? "inline-block" :
                (flexElements.includes(e) ? "flex" : "block");
        }
    });
}

function unlockUIElement(elementsArray, elementName) {
    if (!elementsArray.includes(elementName)) {
        elementsArray.push(elementName);
        const element = document.getElementById(elementName);
        element.style.display = inlineBlockElements.includes(elementName) ? "inline-block" :
            (flexElements.includes(elementName) ? "flex" : "block");
        fadeIn(element, 2);
    }
}

function toggleScreen(userData, screenName) {
    screens.forEach(e => {
        document.getElementById(e).style.display = "none";
    });
    const screensWithTutorials = ["Research", "Upgrades"];
    if (screensWithTutorials.includes(screenName)) {
        if (!userData.multiverses[userData.currentMultiverse].eventsDone.includes(`${screenName}Tutorial`)) {
            setTimeout(_ => { //wait so the upgrade buttons can be drawn before we display tutorial text.
                updateBoundingBoxes();
                displayTutorialText(screenName);
            });
            userData.multiverses[userData.currentMultiverse].eventsDone.push(`${screenName}Tutorial`);
        }
    }

    if (screenName == "energy") {
        document.getElementById("buildAntimatterBeam").style.display =
            (!userData.antimatterBeamBuilt && userData.antimatterBeamNotifDone) ?
                "block" : "none";
    }
    document.getElementById(screenName).style.display = "block";
    currentScreenDisplayed = screenName;
}
export { hideLockedElements, unlockUIElement, toggleScreen, currentScreenDisplayed, addNavigationAttention, hideableIDs }