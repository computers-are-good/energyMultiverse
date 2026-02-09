import events from "./data/events.js";
import research from "./data/researchData.js";
import eventPlayer from "./map/eventPlayer.js";
import generateAllSystems from "./map/newSolarSystem.js";
import { newHostile, testEvent, updateSolarSystem } from "./map/solarSystem.js";
import { createNewMultiverse, multiverseTravel } from "./multiverse.js";
import { notify } from "./notifs/notify.js";
import { updateAntimatterCounter, updateDustCounter, updateEnergyCounter, updateIridiumCounter, updateMetalCounter, updateResearchButtons, updateResearchPoints } from "./pageUpdates.js";
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
                if (code.startsWith("EVENT")) {
                    const eventTitle = code.replace("EVENT ", "");
                    if (eventTitle in events) testEvent(userData, eventTitle);
                }
                switch (code) {
                    case "SUGARDADDY":
                        currentMultiverse.energy = 99999;
                        updateEnergyCounter(userData);
                        currentMultiverse.dust = 99999;
                        updateDustCounter(userData);
                        currentMultiverse.metal = 99999;
                        updateMetalCounter(userData);
                        currentMultiverse.iridium = 99999;
                        updateIridiumCounter(userData);
                        currentMultiverse.antimatter = 99999;
                        updateAntimatterCounter(userData);
                        break;
                    case "ENERGYFORDAYS":
                        currentMultiverse.energy = 999999;
                        updateEnergyCounter(userData);
                        break;
                    case "ITSDUSTYINHERE":
                        currentMultiverse.dust = 999999;
                        updateDustCounter(userData);
                        break;
                    case "GIVEMETHEMETAL":
                        currentMultiverse.metal = 999999;
                        updateMetalCounter(userData);
                        break;
                    case "SAYYESTOIRIDIUM":
                        currentMultiverse.iridium = 999999;
                        updateIridiumCounter(userData);
                        break;
                    case "MATTERN'T":
                        currentMultiverse.antimatter = 999999;
                        updateAntimatterCounter(userData);
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
                        userData.currentMultiverse = Math.min(targetMultiverse - 1, 0);
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
                        notify("Erasing World...");
                        setTimeout(_ => notify("Three seconds left."), 1000);
                        setTimeout(_ => notify("Two seconds left."), 2000);
                        setTimeout(_ => notify("One second left."), 3000);
                        setTimeout(_ => {
                            localStorage.clear();
                            location.reload();
                        }, 4000);
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
                                weapon: "Phasor",
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
                    case "HEHESPED":
                        userData.speedModeEnabled = !userData.speedModeEnabled;
                        break;

                }
            }
        })
    }
}

export default addCheats;