import notify from "./notify.js";

const messages = {
    awake: "As the light from the distant room fades, you find yourself awake among darkness.",
    light: "And, in the distant, a faint glow of an unfamiliar light.",
    gettingEnergy: "Every time you touch the light, you appear to get some energy. Perhaps they'll become useful.",
    dustUseful: "Maybe the dust you've been collecting can be used to build something?",
    Upgrades: "It's time to start doing things with the energy you've been collecting.",
    researchTooSlow: "This rate of research is too slow. Maybe you can do research into researching?",
    Sunscoop: "Flying this close to a star makes you wonder... what if you could scoop up its energy?",
    repairKit: "That ship looks like it could use some patching up. Maybe you can research how?",
    dustbot: "Tired of making dust by hand? Maybe something can help you.",
    statistics: "Perhaps it's useful to check out some information about your world?",
    energyStatistics: "There's more statistics to unlock...",
    unlockMetal: "The dust you've been making could be made into something more...",
    makeShip: "And when you have metal, you can make spaceships. Venture forwards into the unknown.",
    firstShip: "Go forward, and explore the unknown. This little ship will keep you safe.",
    factoryShip: "You have explored the whole planet. Go forth and build a factory here. Let your reach grow.",
    missileDamage: "You've made a lot of missiles. Now it's time to make them stronger.",
    scannerAccuracy: "You've built a scanner, but it still needs calibration."
}

function notifyUnique(messageId) {
    notify(messages[messageId]);
}

export default notifyUnique;