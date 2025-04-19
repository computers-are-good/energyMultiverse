import { updateResearchRate } from "../pageUpdates.js";
import {unlockUIElement} from "../toggleUIElement.js";

const research = {
    "Upgrades" : {
        cost: {
            points: 5
        },
        name: "Unlock upgrades",
        description: "Unlocks the upgrades tab",
        complete: function(userData) {
            unlockUIElement(userData.multiverses[userData.currentMultiverse].UIElementsUnlocked, "pageUpgrades");
        }
    },
    "Faster Research": {
        cost: {
            points: 2
        },
        name: "Faster Research",
        description: "Research points accumulating too slow? Try researching about research!",
        complete: function(userData) {
            userData.multiverses[userData.currentMultiverse].ticksPerResearchAdvancement -= 10;
            updateResearchRate(userData);
        }
    },
    "dustbot": {
        cost: {
            points: 10
        },
        name: "Dustbot",
        description: "Tired of creating dust by hand? Dustbot will help you!",
        complete: function(userData) {
            unlockUIElement(userData.multiverses[userData.currentMultiverse].UIElementsUnlocked, "dustBot");
        }
    },
    "Sunscoop": {
        cost: {
            points: 5
        },
        name: "Sunscoop",
        description: "Learn to build sunscoops to harvest energy from a star",
        complete: function(userData) {
            userData.multiverses[userData.currentMultiverse].shipAccessoriesUnlocked.push("Sunscoop");
            unlockUIElement(userData.multiverses[userData.currentMultiverse].UIElementsUnlocked, "dispatchToSun");   
        }
    },
    "repairKit": {
        cost: {
            points: 10
        },
        name: "Repair kits",
        description: "Tired of your ships never being at full hull? Learn how to repair them!",
        complete: function (userData) {
            unlockUIElement(userData.multiverses[userData.currentMultiverse].UIElementsUnlocked, "makeRepairKit");
        }
    },
    "Warp Drive": {
        cost: {
            points: 25
        },
        name: "Warp Drive",
        description: "Use this to jump between star systems.",
        complete: function (userData) {
            unlockUIElement(userData.multiverses[userData.currentMultiverse].UIElementsUnlocked, "buildWarpDrive");
        }
    }
}

export default research;