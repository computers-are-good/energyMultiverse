import { updateDustCounter, updateEnergyCounter, updateIridiumCounter, updateMetalCounter } from "../pageUpdates.js";

const resourceMappings = {
    "energy": gainEnergy,
    "dust": gainDust,
    "metal": gainMetal,
    "iridium": gainIridium
}

function gainEnergy(userData, energy) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const energyGained = energy * currentMultiverse.multipliers.energyGained
    currentMultiverse.energy += energyGained;
    currentMultiverse.statistics.energyGained += energyGained;
    userData.lifetimeEnergyGained += energyGained;
    updateEnergyCounter(userData);
}
function gainDust(userData, dust) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    currentMultiverse.dust += dust * currentMultiverse.multipliers.dustGained;
    currentMultiverse.statistics.dustGained += dust * currentMultiverse.multipliers.dustGained;
    updateDustCounter(userData);
}
function gainMetal(userData, metal) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    currentMultiverse.metal += metal * currentMultiverse.multipliers.metalGained;
    currentMultiverse.statistics.metalGained += metal * currentMultiverse.multipliers.metalGained;
    updateMetalCounter(userData);
}

function gainIridium(userData, iridium) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    currentMultiverse.iridium += iridium * currentMultiverse.multipliers.iridiumGained;
    currentMultiverse.statistics.iridiumGained += iridium * currentMultiverse.multipliers.iridiumGained;
    updateIridiumCounter(userData);
}

export { gainEnergy, gainDust, gainMetal, gainIridium, resourceMappings }