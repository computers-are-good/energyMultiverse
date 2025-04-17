import notify from "./notify.js";

const messages = {
    awake: "As the light from the distant room fades, you find yourself awake among darkness.",
    light: "And, in the distant, a faint glow of an unfamiliar light.",
    gettingEnergy: "Every time you touch the light, you appear to get some energy. Perhaps they'll become useful.",
    dustUseful: "Maybe the dust you've been collecting can be used to build something?",
    unlockResearch: "It's time to start doing things with the energy you've been collecting.",
    researchTooSlow: "This rate of research is too slow. Maybe you can do research into researching?",
    unlockSunscoop: "Flying this close to a star makes you wonder... what if you could scoop up its energy?"
}

function notifyUnique(messageId) {
    notify(messages[messageId]);
}

export default notifyUnique;