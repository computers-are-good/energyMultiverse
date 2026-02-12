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
    if (screenName == currentScreenDisplayed) return; // If we're going to the same screen, skip the whole procedure.
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    // First hide all screens.
    screens.forEach(e => {
        document.getElementById(e).style.opacity = 0;
        setTimeout(_ => document.getElementById(e).style.display = "none", 100);
    });
    // Change which tab is marked as active by the CSS. Active tabs have a white background.
    document.querySelectorAll("#pageSelector li").forEach(e => e.classList.remove("activeTab"));
    document.getElementById(`page${screenName}`)?.classList.add("activeTab");

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
    setTimeout(_ => {
        document.getElementById(screenName).style.display = "block";
        setTimeout(_ => document.getElementById(screenName).style.opacity = 1, 5);
        currentScreenDisplayed = screenName;
    }, 110);
}

// Shortcut way to navigate between different screens using the nubmer keys
document.body.addEventListener("keydown", e => {
    if (document.getElementById("pageSelector").style.display != "none") { // Only allow switching the page if the user can actually select the page.
        if ("123456789".includes(e.key)) { // number key pressed
            const tabsShowing = []; // holds all of the tabs that the player have unlocked and can see
            const tabsAvailable = document.querySelectorAll("#pageSelector li") // hold every single tab, including the ones the player hasn't unlocked
            tabsAvailable.forEach(e => {
                if (e.style.display !== "none") { // filter out the tabs the player cannot see
                    tabsShowing.push(e);
                }
            });
            const keyAsNumber = parseInt(e.key) - 1; // convert to usable index. Account for difference between zero index and one index
            if (keyAsNumber < tabsShowing.length) {
                tabsShowing[keyAsNumber].click();
            }
        }
    }
});
export { hideLockedElements, unlockUIElement, toggleScreen, currentScreenDisplayed, addNavigationAttention, hideableIDs }