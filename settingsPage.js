import { addDescriptionEvent } from "./script/addUIDescriptions.js";
import { appendCloseButton, showOverlay } from "./script/overlay.js"

/* 
Structure of settings:
- One big settings div to put everything except the close button in
-- A dedicated div for each setting you can turn on or off
--- A paragraph describing what the setting does
--- Another div, containing...
---- The buttons which are used to change the setting
*/
function openSettingsPage(userData) {
    showOverlay();

    const settingsDiv = document.createElement("div");
    const settingsHeader = document.createElement("h2");
    settingsDiv.id = "settingsDiv";
    settingsHeader.textContent = "Settings";
    settingsDiv.appendChild(settingsHeader);

    // Change autosave interval
    const autosaveDiv = document.createElement("div");
    autosaveDiv.id = "settingsAutosaveDiv";
    const autosavep = document.createElement("p");
    autosavep.innerText = "Autosave interval:"
    autosaveDiv.appendChild(autosavep);
    addDescriptionEvent(autosaveDiv, {
        content: "Control the time between autosaves."
    }, userData, "settingsDiv")

    const autosaveButtonsContainer = document.createElement("div");
    const times = [300, 600, 1200, 99999999];
    times.forEach(e => {
        const newButton = document.createElement("button");
        newButton.classList.add("timeButtons");
        if (e == userData.settings.autosaveInterval) {
            newButton.classList.add("shipSelected");
        }
        newButton.textContent = e == 99999999 ? "Off" : `${e / 10}s`;
        autosaveButtonsContainer.appendChild(newButton);
        newButton.addEventListener("click", _ => {
            document.querySelectorAll("#settingsAutosaveDiv button").forEach(e => e.classList.remove("shipSelected"));
            newButton.classList.add("shipSelected");
            userData.settings.autosaveInterval = e;
        })
    })
    autosaveDiv.appendChild(autosaveButtonsContainer);
    settingsDiv.appendChild(autosaveDiv)

    // Turn off or on particles
    const particlesDiv = document.createElement("div");

    const particlesp = document.createElement("p");
    particlesp.textContent = "Global particles:"
    particlesDiv.appendChild(particlesp);

    const particlesButtonsContainer = document.createElement("div")

    const particlesOnButton = document.createElement("button");
    particlesOnButton.textContent = "On";
    particlesButtonsContainer.appendChild(particlesOnButton);

    particlesOnButton.addEventListener("click", _ => {
        userData.settings.particlesOn = true;
        particlesOnButton.classList.add("shipSelected");
        particlesOffButton.classList.remove("shipSelected");
    });

    const particlesOffButton = document.createElement("button");

    particlesOffButton.addEventListener("click", _ => {
        userData.settings.particlesOn = false;
        particlesOffButton.classList.add("shipSelected");
        particlesOnButton.classList.remove("shipSelected");
    });

    particlesOffButton.textContent = "Off";
    particlesButtonsContainer.appendChild(particlesOffButton);

    if (userData.settings.particlesOn) {
        particlesOnButton.classList.add("shipSelected");
        particlesOffButton.classList.remove("shipSelected");
    } else {
        particlesOffButton.classList.add("shipSelected");
        particlesOnButton.classList.remove("shipSelected");
    }

    particlesDiv.appendChild(particlesButtonsContainer);

    settingsDiv.appendChild(particlesDiv);
    
    document.getElementById("overlay").appendChild(settingsDiv);
    appendCloseButton();
}

export {
    openSettingsPage
}