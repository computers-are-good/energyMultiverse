import { mouseoverDescriptions, rewriteDescription } from "./addUIDescriptions.js";
import { checkCosts, subtractCosts } from "./itemCosts.js";
import { hideOverlay, showOverlay } from "./overlay.js";
import { firstLoadFunctions } from "./pageLoad.js";
import { gainAntimatter } from "./resources/gainResources.js";
import { newMultiverse } from "./userdata.js";

function multiverseCreationCost(userData) {
    return userData.multiverses.length * 50;
}
function createNewMultiverse(userData, multipliers) {
    const multiverse = newMultiverse(userData, multipliers);
    multiverse.multipliers = structuredClone(multipliers);
    multiverse.multipliers.antimatterGained = 1;
}
function callCreateFunction(userData) {
    if (checkCosts(userData, {antimatter: multiverseCreationCost(userData)})) {
        subtractCosts(userData, {antimatter: multiverseCreationCost(userData)});
        const currentMultiverse = userData.multiverses[userData.currentMultiverse];
        for (const multiplier in currentMultiverse.savedUniverseMultipliers) {
            userData.highestUniverseMultipliers[multiplier] = Math.max(currentMultiverse.highestUniverseMultipliers[multiplier], currentMultiverse.savedUniverseMultipliers[multiplier]);
        }
        createNewMultiverse(userData, userData.savedUniverseMultipliers);
        document.getElementById("multiverseTravel").style.display = "block";
        matchMultipliers(userData);
        updateMultiverseMultipliers(userData);
        openMultiverseTravelUI(userData, true, true);
    }

}
function matchMultipliers(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    for (const multiplier in currentMultiverse.highestUniverseMultipliers) {
        userData.savedUniverseMultipliers[multiplier] = currentMultiverse.highestUniverseMultipliers[multiplier];
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
    mouseoverDescriptions.newMultiverse.cost.antimatter = multiverseCreationCost(userData);
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

let selectedMultiverseIndex;

function selectMultiverse(userData, selectLastMultiverse = false, travelToMultiverse = false, customMessage) {
    return new Promise((res, rej) => {
        showOverlay();
        const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    
        const overlay = document.getElementById("overlay");
    
        const closeButton = document.createElement("button");
        closeButton.textContent = "close";
    
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.justifyContent = "center";
    
        const currentMulitverseText = document.createElement("p"); //Display which multiverse we are in
        currentMulitverseText.textContent = `Current Multiverse: ${currentMultiverse.name}`;
        currentMulitverseText.style.textAlign = "center";
        overlay.appendChild(currentMulitverseText);

        if (customMessage) {
            const customMessageText = document.createElement("p");
            customMessageText.textContent = customMessage;
            customMessageText.style.textAlign = "center";
            overlay.appendChild(customMessageText);
        }
    
        for (const index in userData.multiverses) {
            if (index == userData.currentMultiverse) continue; //Do not display the multiverse we are currently in
    
            const multiverse = userData.multiverses[index];
            const newDiv = document.createElement("div");
            newDiv.classList.add("shipClassDiv");
            container.appendChild(newDiv);
    
            const multiverseName = document.createElement("p");
            multiverseName.textContent = multiverse.name;
            newDiv.appendChild(multiverseName);
    
            const ul = document.createElement("ul");
            let multiverseLevel = 1;
            for (const multiplier in multiverse.multipliers) {
                multiverseLevel += multiverse.multipliers[multiplier] - 1;
            }
            const li = document.createElement("li");
            li.textContent = `Multiplier level ${multiverseLevel}`;
            ul.appendChild(li);
    
            if (selectLastMultiverse && index == userData.multiverses.length - 1) {
                selectedMultiverseIndex = index;
                newDiv.classList.add("shipSelected");
            }
    
            newDiv.appendChild(ul);
    
            newDiv.addEventListener("click", _ => {
                selectedMultiverseIndex = index;
                document.querySelectorAll(".shipClassDiv").forEach(e => e.classList.remove("shipSelected"));
                newDiv.classList.add("shipSelected");
            });
        }
        overlay.appendChild(container);
     
        const confirmButton = document.createElement("button");
        confirmButton.textContent = travelToMultiverse ? "Travel" : "Confirm";
        overlay.appendChild(confirmButton);
        
        confirmButton.addEventListener("click", _ => {
            hideOverlay();
            res(selectedMultiverseIndex);
            if (travelToMultiverse) multiverseTravel(userData, selectedMultiverseIndex);
        });
    
        closeButton.addEventListener("click", hideOverlay);
        closeButton.addEventListener("click", rej);
        overlay.appendChild(closeButton);
    })
}

function multiverseTravel(userData, targetMultiverse) {
    document.getElementById("notifications").innerHTML = "";
    userData.currentMultiverse = targetMultiverse;
    document.querySelectorAll(".drone").forEach(e => {
        e.remove();
    });
    firstLoadFunctions(userData);
}
export {
    createNewMultiverse,
    multiverseTravel,
    matchMultipliers,
    updateMultiverseMultipliers,
    increaseMultiplier,
    decreaseMultiplier,
    callCreateFunction,
    selectMultiverse
}