import { updateDustCounter, updateEnergyCounter, updateIridiumCounter, updateMetalCounter, updateAntimatterCounter} from "../pageUpdates.js";

function useEnergy(userData, energy) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    currentMultiverse.energy -= energy;
    updateEnergyCounter(userData);
}

function useDust(userData, dust) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    currentMultiverse.dust -= dust;
    updateDustCounter(userData);
}

function useMetal(userData, metal) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    currentMultiverse.metal -= metal;
    updateMetalCounter(userData);
}

function useIridium(userData, iridium) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    currentMultiverse.iridium -= iridium;
    updateIridiumCounter(userData);
}

function useAntimatter(userData, antimatter) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    currentMultiverse.antimatter -= antimatter;
    updateAntimatterCounter(userData);
}

export {useEnergy, useDust, useMetal, useIridium, useAntimatter}