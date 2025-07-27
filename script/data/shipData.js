const shipClasses = {
    "Scout": {
        baseStats: {
            baseHealth: 10,
            baseAttack: 1,
            baseShield: 5,
            baseSpeed: 10,
        },
        class: "Recon",
        description: "A basic ship for scouting out the area.",
        accessorySlots: 1,
        baseCost: {
            dust: 10,
            metal: 1
        },
        energyCost: 500
    },
    "Fighter": {
        baseStats: {
            baseHealth: 30,
            baseAttack: 10,
            baseShield: 5,
            baseSpeed: 5
        },
        accessorySlots: 2,
        class: "Light",
        description: "A small and nimble ship.",
        baseCost: {
            dust: 30,
            metal: 5
        },
        energyCost: 1000
    },
    "Blackbird": {
        baseStats: {
            baseHealth: 60,
            baseAttack: 3,
            baseShield: 10,
            baseSpeed: 4
        },
        class: "Medium",
        description: "Tired of losing your ships? The blackbird is built to be durable!",
        accessorySlots: 1,
        baseCost: {
            dust: 50,
            metal: 15
        },
        energyCost: 2500
    }, 
    "Factory Ship": {
        baseStats: {
            baseHealth: 50,
            baseAttack: 1,
            baseShield: 1,
            baseSpeed: 3
        },
        class: "Special",
        description: "The factory ship will become a factory! Just fly it to a planet to start.",
        baseCost: {
            metal: 30,
            iridium: 10
        },
        energyCost: 5000,
        accessorySlots: 0,
    },
    "Titan": {
        baseStats: {
            baseHealth: 150,
            baseAttack: 10,
            baseShield: 50,
            baseSpeed: 1
        },
        class: "Giant",
        description: "He big.",
        accessorySlots: 5,
        baseCost: {
            dust: 150,
            metal: 50
        },
        energyCost: 5000
    }
}

const shipAccessories = {
    "Basic shield": {
        description: "Increases a ship's base shield by 3.",
        baseCost: {
            dust: 15
        },
        energyCost: 300,
        accessorySlots: 1,
        onComplete: function (userData, shipObject) {
            shipObject.baseStats.baseShield += 3;
        }
    },
    "Reinforcement Plates": {
        description: "Increases a ship's base hull by 10.",
        baseCost: {
            dust: 30
        },
        accessorySlots: 1,
        onComplete: function (userData, shipObject) {
            shipObject.baseStats.baseHealth += 10;
            shipObject.currentHealth += 10;
        },
        energyCost: 500
    },
    "Sunscoop": {
        description: "Equip this on a ship to scoop vast amount of energy from the sun! Once this accessory is used once, it is destroyed.",
        baseCost: {
            dust: 15
        },
        accessorySlots: 1,
        energyCost: 100
    },
    "Cloaking Device": {
        description: "A cloaking device decrease the range in which enemy ships can detect your ship.",
        baseCost: {
            iridium: 10,
            metal: 10
        },
        accessorySlots: 1,
        energyCost: 1500
    }

}

export { shipClasses, shipAccessories }