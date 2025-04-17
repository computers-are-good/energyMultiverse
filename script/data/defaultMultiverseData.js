const defaultMultiverseData = {
    name: "",
    energy: 0,
    dust: 0,
    metal: 0,
    items: [],
    drones: [],
    UIElementsUnlocked: [],
    researchPoints: 0,
    researchUnlocked: [],
    researchCompleted: [],
    dustbotUnlocked: false,
    dustbotSpeed: 0,
    dustbotMaxSpeed: 5,
    dustbotTicksElapsed: 0,
    energyUntilResearchPoint: 150,
    progressUntilResearchPoint: 0,
    researchRate: 0,
    maxResearchRate: 3,
    ticksPerResearchAdvancement: 30,
    upgradesCount: {
        maxResearchRate: 0,
        energyUntilResearchPoint: 0,
        ticksPerResearchAdvancement: 0
    },
    uniqueNotifsDone: [],
    eventsDone: [],
    statistics: {
        energyClicked: 0,
        dustClicked: 0,
        metalMade: 0
    },
    ships: [],
    shipInProgress: {},
    currentShipBuildingRate: 0,
    allowSolarSystemUpdates: true,
    maxShipBuildingRate: 5,
    shipClassesUnlocked: ["Scout", "Fighter"],
    shipAccessoriesUnlocked: ["Basic shield", "Reinforcement Plates"],
    solarSystems: [],
    currentSolarSystem: 0,
    mothershipMaxThrust: 3,
    mothershipCurrentThrust: 0
}

export default defaultMultiverseData;