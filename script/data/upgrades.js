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
    }
}

export default upgrades;