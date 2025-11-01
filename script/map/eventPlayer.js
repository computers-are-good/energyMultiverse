import { addDescriptionEvent } from "../addUIDescriptions.js";
import events from "../data/events.js";
import notify from "../notifs/notify.js";
import { updateDustCounter, updateEnergyCounter, updateIridiumCounter, updateMetalCounter, updateResearchButtons } from "../pageUpdates.js";
import { addNavigationAttention } from "../toggleUIElement.js";
import { wait } from "../utils.js";
import { updateSolarSystem } from "./solarSystem.js";

function eventPlayer(shipData, userData, eventId) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const currentSystem = currentMultiverse.solarSystems[currentMultiverse.currentSolarSystem];

    return new Promise(res => {
        const eventScript = events[eventId].script;
        const itemsToSubtract = {};
        const shipCargo = {};
        const researchToUnlock = [];

        let currentIndex = 0;

        const eventNext = document.createElement("button");
        eventNext.textContent = "Next";
        document.getElementById("scriptPlayer").appendChild(eventNext);

        const eventChoices = document.getElementById("eventChoices");
        const endButton = document.createElement("button");
        endButton.textContent = "End";

        function endEvent() {
            const successfulResolution = eventScript[currentIndex].eventResolved;

            endButton.remove();
            eventNext.remove();
            if (successfulResolution) {
                for (const item in shipCargo) {
                    if (item in shipData.cargo) {
                        shipData.cargo[item] += shipCargo[item];
                    } else {
                        shipData.cargo[item] = shipCargo[item];
                    }
                }
                if (Object.keys(itemsToSubtract).length > 0) {
                    for (const item in itemsToSubtract) {
                        currentMultiverse[item] -= itemsToSubtract[item];
                    }
                    updateDustCounter(userData);
                    updateIridiumCounter(userData);
                    updateEnergyCounter(userData);
                    updateMetalCounter(userData);
                }
                if (researchToUnlock.length > 0) {
                    researchToUnlock.forEach(e => currentMultiverse.researchUnlocked.push(e));
                    updateResearchButtons(userData);
                    addNavigationAttention("research", "pageResearch");
                }
            }

            if ("endScript" in events[eventId]) events[eventId].endScript(shipData, userData);
            res(successfulResolution);
        }

        endButton.addEventListener("click", endEvent);
        document.getElementById("scriptPlayer").appendChild(endButton);

        async function readEvent(index) {
            let i;
            let text = eventScript[index].text;
            function skipText() {
                i = text.length - 1;
                document.getElementById("eventText").textContent = text;
            }
            if ("probability" in eventScript[index]) {
                if (Math.random() > eventScript[index].probability) {
                    currentIndex++;
                    if (currentIndex >= eventScript.length - 1) {
                        endEvent();
                    } else {
                        readEvent(currentIndex);
                    }
                    return;
                }
            }

            const replacementKeys = {
                "{STARNAME}": currentSystem.name,
                "{SHIPCLASS}": shipData.class,
                "{PLANETNAME}": currentSystem.objects[shipData.targetObjectId]?.name ?? "Planet failure"
            }

            for (const key in replacementKeys) {
                text = text.replaceAll(key, replacementKeys[key]);
            }

            document.getElementById("eventText").textContent = "";
            eventNext.style.display = "none";
            endButton.style.display = "none";
            await wait(150);
            document.getElementById("encounterInfo").addEventListener("click", skipText);
            for (i = 0; i < text.length; i++) {
                document.getElementById("eventText").textContent = text.slice(0, i + 1);
                await wait(25);
            }
            document.getElementById("encounterInfo").removeEventListener("click", skipText);
            eventNext.style.display = "block";

            if (eventScript[index].researchUnlocked)
                eventScript[index].researchUnlocked.forEach(e => researchToUnlock.push(e));

            if (eventScript[index].item) {
                for (const item in eventScript[index].item) {
                    if (shipCargo[item]) {
                        shipCargo[item] += eventScript[index].item[item];
                    } else {
                        shipCargo[item] = eventScript[index].item[item];
                    }
                }
            }

            if (eventScript[index].script) {
                eventScript[index].script(shipData, userData);
            }

            if (eventScript[index].endEvent || index >= eventScript.length - 1) {
                eventChoices.style.display = "none";
                eventNext.style.display = "none";
                endButton.style.display = "block";
            } else {
                if (eventScript[index].choice) {
                    eventNext.style.display = "none";
                    eventChoices.innerHTML = "";
                    eventChoices.style.display = "block";
                    endButton.style.display = "none";

                    for (const choice of eventScript[index].choice) {
                        const button = document.createElement("button");
                        button.textContent = choice.text;

                        if (choice.cost) {
                            let costObj = {};
                            for (const cost in choice.cost) {
                                costObj[cost] = choice.cost[cost];
                            }
                            addDescriptionEvent(button, {
                                cost: costObj
                            }, userData);
                        }

                        button.addEventListener("click", _ => {
                            if (choice.cost) {
                                let insufficentItems = [];
                                let canAffordCost = true;
                                for (const cost in choice.cost) {
                                    if (currentMultiverse[cost] - (itemsToSubtract[cost] ?? 0) < choice.cost[cost]) {
                                        canAffordCost = false;
                                        insufficentItems.push(cost);
                                    }
                                }
                                if (canAffordCost) {
                                    for (const cost in choice.cost) {
                                        if (cost in itemsToSubtract) {
                                            itemsToSubtract[cost] += choice.cost[cost];
                                        } else {
                                            itemsToSubtract[cost] = choice.cost[cost];
                                        }
                                    }
                                    currentIndex = choice.goto;
                                    readEvent(currentIndex);
                                } else {
                                    notify(`You don't have enough ${insufficentItems.join(", ")}`);
                                }
                            } else {
                                currentIndex = choice.goto;
                                readEvent(currentIndex);
                            }
                        });

                        eventChoices.appendChild(button);
                    }
                } else {
                    eventNext.style.display = "block";
                    eventChoices.style.display = "none";
                    endButton.style.display = "none";
                }
            }
        }

        eventNext.addEventListener("click", _ => {
            if ("goto" in eventScript[currentIndex]) {
                currentIndex = eventScript[currentIndex].goto;
            } else {
                currentIndex++;
            }
            readEvent(currentIndex);
        });
        readEvent(0);

    })
}

export default eventPlayer