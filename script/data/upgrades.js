const upgrades = {
    "energyClicker": {
        name: "Advanced energy extraction",
        cost: function(upgradedTimes) {
            return {
                dust: (upgradedTimes + 1) * 5
            }
        },
        upgradeDone: function(userData) {

        },
        description: "Gives you more energy for each click."
    }
}

export default upgrades;