import research from "./data/researchData.js";
import generateAllSystems from "./map/newSolarSystem.js";
import { newHostile, updateSolarSystem } from "./map/solarSystem.js";
import { createNewMultiverse, multiverseTravel } from "./multiverse.js";
import { updateDustCounter, updateEnergyCounter, updateIridiumCounter, updateMetalCounter, updateResearchButtons, updateResearchPoints } from "./pageUpdates.js";
import { updateSolarPanels } from "./resources/solarPanel.js";
import { hideableIDs, unlockUIElement } from "./toggleUIElement.js";
import { getUserData } from "./userdata.js";
import { deepClone } from "./utils.js";

const enableCheats = true;

function addCheats(userData) {
    if (enableCheats) {
        document.body.addEventListener("keypress", e => {
            const currentMultiverse = userData.multiverses[userData.currentMultiverse];
            const currentSystem = currentMultiverse.solarSystems[currentMultiverse.currentSolarSystem];
            if (e.key === "\\") {
                const code = prompt("Confess, young child, and speak thy soul.");
                let targetMultiverse;
                switch (code) {
                    case "ENERGYFORDAYS":
                        currentMultiverse.energy = 99999;
                        updateEnergyCounter(userData);
                        break;
                    case "ITSDUSTYINHERE":
                        currentMultiverse.dust = 99999;
                        updateDustCounter(userData);
                        break;
                    case "GIVEMETHEMETAL":
                        currentMultiverse.metal = 99999;
                        updateMetalCounter(userData);
                        break;
                    case "SAYYESTOIRIDIUM":
                        currentMultiverse.iridium = 99999;
                        updateIridiumCounter(userData);
                        break;
                    case "IAMSMORT":
                        for (const item in research) {
                            currentMultiverse.researchCompleted.push(item);
                            if ("complete" in research[item]) research[item].complete(userData);
                        }
                        for (const item of hideableIDs) unlockUIElement(currentMultiverse.UIElementsUnlocked, item);
                        currentMultiverse.researchUnlocked = [];
                        updateResearchButtons(userData);
                        break;
                    case "IAMDUMB":
                        for (const item of currentMultiverse.researchCompleted) {
                            currentMultiverse.researchUnlocked.push(item);
                        }
                        currentMultiverse.researchCompleted = [];
                        updateResearchButtons(userData);
                        break;
                    case "IAMTHERESEARCH":
                        currentMultiverse.researchPoints = 999999;
                        updateResearchPoints(userData);
                        break;
                    case "PEWPEW":
                        currentMultiverse.ships = [];
                        break;
                    case "CTRL+N":
                        currentMultiverse.solarSystems = [];
                        generateAllSystems(currentMultiverse);
                        break;
                    case "BETTERTHANGAS":
                        currentMultiverse.solarPanel = 10;
                        updateSolarPanels(userData);
                        break;
                    case "GODVERSE":
                        createNewMultiverse(userData, {
                            energyGained: 9999,
                            dustGained: 9999,
                            metalGained: 9999,
                            iridiumGained: 9999
                        });
                        break;
                    case "DELETETHEMULTIVERSE":
                        targetMultiverse = userData.currentMultiverse;
                        userData.multiverses.splice(targetMultiverse, 1);
                        break;
                    case "NEXT":
                        targetMultiverse = userData.currentMultiverse + 1;
                        if (userData.multiverses[targetMultiverse])
                            multiverseTravel(userData, targetMultiverse)
                        break;
                    case "BACK":
                        targetMultiverse = userData.currentMultiverse - 1;
                        if (userData.multiverses[targetMultiverse])
                            multiverseTravel(userData, targetMultiverse)
                        break;
                    case "GIMMEMYDATA":
                        console.log(JSON.stringify(userData));
                        break;
                    case "GOODBYEWORLD":
                        localStorage.clear();
                        userData = getUserData();
                        multiverseTravel(userData, 0);
                        break;
                    case "DANIEL":
                        currentMultiverse.ships.push(deepClone(
                            {
                                class: "D A N I E L",
                                currentHealth: 9999,
                                posX: 0,
                                posY: 0,
                                inSolarSystem: false,
                                isBusy: false,
                                accessories: [],
                                targetObjectId: 0,
                                cargo: {},
                                baseStats: {
                                    baseHealth: 9999,
                                    baseAttack: 9999,
                                    baseShield: 9999,
                                    baseSpeed: 150
                                }
                            }
                        ));
                        break;
                    case "HURRYUP":
                        currentMultiverse.shipInProgress.energySpent = currentMultiverse.shipInProgress.energyCostTotal;
                        break;
                    case "ENEMYABOUND":
                        let key = Math.floor(Math.random() * 10000);
                        while (key in currentSystem.objects) {
                            key = Math.floor(Math.random() * 10000);
                        }
                        currentSystem.objects[key] = newHostile(userData);
                        updateSolarSystem(userData);
                        break;

                }
            }
        })
    }
}

export default addCheats;