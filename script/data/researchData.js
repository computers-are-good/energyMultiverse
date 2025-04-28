import { updateTurret } from "../../turret.js";
import { updateResearchRate } from "../pageUpdates.js";
import { drawBuildShipsDiv } from "../ship/buildShip.js";
import { addNavigationAttention, unlockUIElement } from "../toggleUIElement.js";
import { drawUpgradeButtons } from "../upgrades.js";

const research = {
    "Upgrades": {
        cost: {
            points: 5
        },
        name: "Unlock upgrades",
        description: "Unlocks the upgrades tab",
        complete: function (userData) {
            unlockUIElement(userData.multiverses[userData.currentMultiverse].UIElementsUnlocked, "pageUpgrades");
        }
    },
    "Faster Research": {
        cost: {
            points: 2
        },
        name: "Faster Research",
        description: "Research points accumulating too slow? Try researching about research!",
        complete: function (userData) {
            userData.multiverses[userData.currentMultiverse].ticksPerResearchAdvancement -= 10;
            updateResearchRate(userData);
        }
    },
    "dustbot": {
        cost: {
            points: 5
        },
        name: "Dustbot",
        description: "Tired of creating dust by hand? Dustbot will help you!",
        complete: function (userData) {
            unlockUIElement(userData.multiverses[userData.currentMultiverse].UIElementsUnlocked, "dustBot");
            addNavigationAttention("Energy", "pageEnergy");
        }
    },
    "fabriBot": {
        cost: {
            points: 15
        },
        name: "fabriBot",
        description: "You found this robot on an industrial planet. Now you just have to figure out how to operate it...",
        complete: function (userData) {
            unlockUIElement(userData.multiverses[userData.currentMultiverse].UIElementsUnlocked, "fabriBot");
            addNavigationAttention("Energy", "pageEnergy");
        }
    },
    "statistics": {
        cost: {
            points: 1
        },
        name: "Statistics",
        description: "Unlock the statistics tab",
        complete: function (userData) {
            unlockUIElement(userData.multiverses[userData.currentMultiverse].UIElementsUnlocked, "pageStatistics");
            addNavigationAttention("Statistics", "pageStatistics");
        }
    },
    "energyStatistics": {
        cost: {
            points: 4
        },
        name: "Energy Statistics",
        description: "Tired of tracking your energy usage by hand? Let YOUR computer do it for you!",
        complete(userData) {
            unlockUIElement(userData.multiverses[userData.currentMultiverse].UIElementsUnlocked, "energyStatistics");
            addNavigationAttention("Statistics", "pageStatistics");
        }
    },
    "Sunscoop": {
        cost: {
            points: 5
        },
        name: "Sunscoop",
        description: "Learn to build sunscoops to harvest energy from a star",
        complete: function (userData) {
            if (!userData.multiverses[userData.currentMultiverse].shipAccessoriesUnlocked.includes("Sunscoop"))
                userData.multiverses[userData.currentMultiverse].shipAccessoriesUnlocked.push("Sunscoop");
            unlockUIElement(userData.multiverses[userData.currentMultiverse].UIElementsUnlocked, "dispatchToSun");
            drawBuildShipsDiv(userData);
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
    },
    "deflectionDrive": {
        cost: {
            points: 15
        },
        name: "Deflection Drive",
        description: "A deflection drive will protect your ship during system jumps, allowing you to jump to tier 3 systems.",
        complete: function (userData) {
            userData.multiverses[userData.currentMultiverse].maxJumpTier = 3;
        }
    },
    "radar": {
        cost: {
            points: 5,
        },
        name: "Radar",
        description: "After you research the radar, you can recall a ship midway to a destination.",
        complete: function (userData) {
            unlockUIElement(userData.multiverses[userData.currentMultiverse].UIElementsUnlocked, "recallShip");
        }
    },
    "turret": {
        cost: {
            points: 20
        },
        name: 'Turret',
        description: "A turret will automatically shoot at enemies for you.",
        complete(userData) {
            const currentMultiverse = userData.multiverses[userData.currentMultiverse];
            currentMultiverse.turret.unlocked = true;
            unlockUIElement(currentMultiverse.UIElementsUnlocked, "turret");
            updateTurret(userData);
        }
    },
    "engineUpgrades": {
        cost: {
            points: 10
        },
        name: "Unlock Engine Upgrades",
        description: "Allows you to upgrade the engine of all your spaceships so they are faster.",
        complete(userData) {
            const currentMultiverse = userData.multiverses[userData.currentMultiverse];
            if (!currentMultiverse.maxUpgradeTimes.engineSpeed) {
                currentMultiverse.maxUpgradeTimes.engineSpeed = 5;
            } else {
                currentMultiverse.maxUpgradeTimes.engineSpeed += 5;
            }
            addNavigationAttention("Upgrades", "pageUpgrades");
            drawUpgradeButtons(userData);
        }
    }
}

export default research;