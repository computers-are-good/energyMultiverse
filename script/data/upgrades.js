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
    }
}

export default upgrades;