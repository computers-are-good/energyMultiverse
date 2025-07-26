import { mouseoverDescriptions, rewriteDescription } from "./addUIDescriptions.js";
import { checkCosts, subtractCosts } from "./itemCosts.js";
import { firstLoadFunctions } from "./pageLoad.js";
import { gainAntimatter } from "./resources/gainResources.js";
import { newMultiverse } from "./userdata.js";

function createNewMultiverse(userData, multipliers) {
    const multiverse = newMultiverse(userData);
    multiverse.multipliers = multipliers;
}
function callCreateFunction(userData) {
    createNewMultiverse(userData, userData.savedUniverseMultipliers);
    document.getElementById("multiverseTravel").style.display = "block";
    matchMultipliers(userData);
    updateMultiverseMultipliers(userData);
}
function matchMultipliers(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    for (const multiplier in currentMultiverse.multipliers) {
        userData.savedUniverseMultipliers[multiplier] = currentMultiverse.multipliers[multiplier];
    }
    userData.savedMultipliersIncrease = {
        energyGained: 0,
        dustGained: 0,
        metalGained: 0,
        iridiumGained: 0
    }
}

function updateMultiverseMultipliers(userData) {
    document.getElementById("energyMultiplier").textContent = userData.savedUniverseMultipliers.energyGained;
    document.getElementById("dustMultiplier").textContent = userData.savedUniverseMultipliers.dustGained;
    document.getElementById("metalMultiplier").textContent = userData.savedUniverseMultipliers.metalGained;
    document.getElementById("iridiumMultiplier").textContent = userData.savedUniverseMultipliers.iridiumGained;
    mouseoverDescriptions.increaseEnergyMultiplier.cost.antimatter = generateIncreaseCost("energyGained", userData.savedUniverseMultipliers.energyGained);
    mouseoverDescriptions.increaseDustMultiplier.cost.antimatter = generateIncreaseCost("dustGained", userData.savedUniverseMultipliers.dustGained);
    mouseoverDescriptions.increaseMetalMultiplier.cost.antimatter = generateIncreaseCost("metalGained", userData.savedUniverseMultipliers.metalGained);
    mouseoverDescriptions.increaseIridiumMultiplier.cost.antimatter = generateIncreaseCost("iridiumGained", userData.savedUniverseMultipliers.iridiumGained);
    mouseoverDescriptions.decreaseEnergyMultiplier.refund.antimatter = generateIncreaseCost("energyGained", userData.savedUniverseMultipliers.energyGained - 1);
    mouseoverDescriptions.decreaseDustMultiplier.refund.antimatter = generateIncreaseCost("dustGained", userData.savedUniverseMultipliers.dustGained - 1);
    mouseoverDescriptions.decreaseMetalMultiplier.refund.antimatter = generateIncreaseCost("metalGained", userData.savedUniverseMultipliers.metalGained - 1);
    mouseoverDescriptions.decreaseIridiumMultiplier.refund.antimatter = generateIncreaseCost("iridiumGained", userData.savedUniverseMultipliers.iridiumGained - 1);
    rewriteDescription();
}

function generateIncreaseCost(resource, level) {
    if (level <= 0) return 0;
    switch (resource) {
        case "energyGained":
            return (level) * 5 + 1;
        case "dustGained":
            return (level) * 10 + 5;
        case "metalGained":
            return (level) * 15 + 5;
        case "iridiumGained":
            return (level + 4) ** 2 + 3;
    }
}
function increaseMultiplier(resource, userData) {
    if (checkCosts(userData, { antimatter: generateIncreaseCost(resource, userData.savedUniverseMultipliers[resource]) })) {
        subtractCosts(userData, { antimatter: generateIncreaseCost(resource, userData.savedUniverseMultipliers[resource]) })
        userData.savedUniverseMultipliers[resource]++;
        userData.savedMultipliersIncrease[resource]++;
        updateMultiverseMultipliers(userData);
    }
}
function decreaseMultiplier(resource, userData) {
    if (userData.savedMultipliersIncrease[resource] > 0) {
        userData.savedUniverseMultipliers[resource]--;
        userData.savedMultipliersIncrease[resource]--;
        gainAntimatter(userData, generateIncreaseCost(resource, userData.savedUniverseMultipliers[resource]));
        updateMultiverseMultipliers(userData);
    }
}

function multiverseTravel(userData, targetMultiverse) {
    document.getElementById("notifications").innerHTML = "";
    userData.currentMultiverse = targetMultiverse;
    document.querySelectorAll(".drone").forEach(e => {
        e.remove();
    });
    firstLoadFunctions(userData);
}
export { createNewMultiverse, multiverseTravel, matchMultipliers, updateMultiverseMultipliers, increaseMultiplier, decreaseMultiplier, callCreateFunction }