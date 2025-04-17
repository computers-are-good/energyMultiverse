import events from "../data/events.js";
import { updateSolarSystem } from "./solarSystem.js";

function eventPlayer(shipData, userData, eventId) {
    return new Promise(res => {
        const eventScript = events[eventId].script;

        let currentIndex = 0;

        const eventNext = document.createElement("button");
        eventNext.textContent = "Next";
        document.getElementById("scriptPlayer").appendChild(eventNext);

        const eventChoices = document.getElementById("eventChoices");
        const endButton = document.createElement("button");
        endButton.textContent = "End";

        function endEvent() {
            res();
            endButton.remove();
            eventNext.remove();
        }

        endButton.addEventListener("click", endEvent)
        document.getElementById("scriptPlayer").appendChild(endButton);

        function readEvent(index) {
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

            document.getElementById("eventText").textContent = eventScript[index].text;

            if (eventScript[index].item) {
                for (const item in eventScript[index].item) {
                    if (shipData.cargo[item]) {
                        shipData.cargo[item] += eventScript[index].item[item];
                    } else {
                        shipData.cargo[item] = eventScript[index].item[item];
                    }
                }
            }

            if (eventScript[index].endEvent || index >= eventScript.length - 1) {
                eventChoices.style.display = "none";
                eventNext.style.display = "none";
                endButton.style.display = "block";
            } else {
                if (!eventScript[index].choice) {
                    eventNext.style.display = "block";
                    eventChoices.style.display = "none";
                    endButton.style.display = "none";
                } else {
                    eventNext.style.display = "none";
                    eventChoices.innerHTML = "";
                    eventChoices.style.display = "block";
                    endButton.style.display = "none";

                    for (const choice of eventScript[index].choice) {
                        const button = document.createElement("button");
                        button.textContent = choice.text;

                        button.addEventListener("click", _ => {
                            currentIndex = choice.goto;
                            readEvent(currentIndex);
                        });

                        eventChoices.appendChild(button);
                    }
                }
            }
        }

        eventNext.addEventListener("click", _ => {
            currentIndex++;
            readEvent(currentIndex);
        });
        readEvent(0);

    })
}

export default eventPlayer