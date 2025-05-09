import { updateDustbot } from "../pageUpdates.js";

const upgrades = {
    "energyClicker": {
        name: "Advanced energy extraction",
        cost(upgradedTimes) {
            return {
                dust: (upgradedTimes + 1) * 5
            }
        },
        description: "Gives you more energy for each click."
    },
    "dustbotSpeed": {
        name: "Dustbot speed",
        cost: function(upgradedTimes) {
            return {
                dust: upgradedTimes + 3
            }
        },
        upgradeDone(userData) {
            const currentMultiverse = userData.multiverses[userData.currentMultiverse];

            currentMultiverse.dustbotMaxSpeed += 2;
            updateDustbot(userData);
        },
        description: "Increases dustbot's maximum fabrication speed."
    },
    "turretCharge" : {
        name: "Turret Charge",
        description: "Reduces the charge needed for a turret to fire.",
        cost: function (upgradedTimes) {
            return {
                iridium: upgradedTimes + 1,
                dust: upgradedTimes * 2 + 5
            }
        },
        upgradeDone(userData) {
            const currentMultiverse = userData.multiverses[userData.currentMultiverse];

            currentMultiverse.turret.chargeToFire -= 10;
            currentMultiverse.turret.charge -= 10;
            if (currentMultiverse.turret.charge < 0) currentMultiverse.turret.charge = 0;
        }
    },
    "engineSpeed": {
        name: "Engine Speed",
        description: "Makes all your ships faster.",
        cost: function (upgradedTimes) {
            return {
                iridium: upgradedTimes + 1,
                energy: upgradedTimes * 100 + 150
            }
        },
        upgradeDone(userData) {
            const currentMultiverse = userData.multiverses[userData.currentMultiverse];
            currentMultiverse.shipSpeedMultiplier += 0.3;
        }
    },
    "missileDamage": {
        name: "Missile Damage",
        description: "Increase the damage your missile deals to enemy ships.",
        cost: function(upgradedTimes) {
            return {
                iridium: upgradedTimes * 5 + 10,
            }
        },
        upgradeDone(userData) {
            const currentMultiverse = userData.multiverses[userData.currentMultiverse];
            currentMultiverse.missileDamage++;
        }
    }
}

export default upgrades;