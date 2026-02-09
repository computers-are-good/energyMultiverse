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
    "pageUniverse",
    "energyTitle",
    "dustbotDiv",
    "fabriBot",
    "dustBot",
    "turret",
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
    "makeMissile",
    "pageManufactory"
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
    "Manufactory",
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
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    // First hide all screens.
    screens.forEach(e => {
        document.getElementById(e).style.display = "none";
    });

    // Tutorial system
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

    // If switching to energy, check if we have built the antimatter beam
    if (screenName == "energy") {
        document.getElementById("buildAntimatterBeam").style.display =
            (!userData.antimatterBeamBuilt && userData.antimatterBeamNotifDone) ?
                "block" : "none";
    }

    // Display any unique resources relevant to a specific screen.
    switch (screenName) {
        case "Map": // On the map screen, the player is also interested in how many missiles (if unlocked) and drive cells they have.
            document.getElementById("screenSpecificResources").style.display = "block";
            document.querySelector("#screenSpecificResources ul").innerHTML = "";
            const driveCellCount = document.createElement("li")
            driveCellCount.innerText = `Drive cell: ${currentMultiverse.manufactoryItems.driveCell}`;
            document.querySelector("#screenSpecificResources ul").appendChild(driveCellCount);
            if (currentMultiverse.manufactoryItemsUnlocked.includes("missile")) {
                const missileCount = document.createElement("li");
                missileCount.innerText = `Missile: ${currentMultiverse.manufactoryItems.missile}`;
                document.querySelector("#screenSpecificResources ul").appendChild(missileCount);
            }
            break;
        case "Shipyard": // On the shipyard screen, the player is also interested in the number of repair kits they have (if applicable)
            if (currentMultiverse.manufactoryItemsUnlocked.includes("repairKit")) {
                document.getElementById("screenSpecificResources").style.display = "block";
                document.querySelector("#screenSpecificResources ul").innerHTML = "";
                const repairKitCount = document.createElement("li");
                repairKitCount.innerText = `Repair kit: ${currentMultiverse.manufactoryItems.repairKit}`;
                document.querySelector("#screenSpecificResources ul").appendChild(repairKitCount);
            }
            break;
        default:
            document.getElementById("screenSpecificResources").style.display = "none";
            break;
    }
    document.getElementById(screenName).style.display = "block";
    currentScreenDisplayed = screenName;
}
export { hideLockedElements, unlockUIElement, toggleScreen, currentScreenDisplayed, addNavigationAttention, hideableIDs }