import defaultData from "./data/defaultData.js";
import defaultMultiverseData from "./data/defaultMultiverseData.js";
import generateAllSystems from "./map/newSolarSystem.js";
import multiverseNames from "./data/multiverseNames.js";
import {notify} from "./notifs/notify.js";
import { choice, deepClone } from "./utils.js";

function addMissingEntries(dataToFix, dataReference) {
    for (let data in dataReference) {
        if (typeof dataReference[data] === "object") {
            if (!(data in dataToFix))
                dataToFix[data] = deepClone(dataReference[data]);
        } else {
            if (!(data in dataToFix))
                dataToFix[data] = dataReference[data];
        }
    }
}
function getUserData() {
    const readData = window.localStorage.getItem("saveData");
    let dataToReturn;
    if (readData === null) {
        dataToReturn = defaultData;
        newMultiverse(dataToReturn);
    } else {
        dataToReturn = JSON.parse(readData);
        addMissingEntries(dataToReturn.multiverses[0], defaultMultiverseData);
    }

    return dataToReturn;
}

function newMultiverse(userData) {
    const chosenName = multiverseNames[userData.currentMultiverse % multiverseNames.length];
    const multiverse = structuredClone(defaultMultiverseData);
    multiverse.name = chosenName;
    generateAllSystems(multiverse);
    userData.multiverses.push(multiverse);
    return multiverse;
}
function storeUserData(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    if (!currentMultiverse.allowSolarSystemUpdates) {
        notify("Please resolve event in the solar system before saving.");
        return;
    }
    window.localStorage.setItem("saveData", JSON.stringify(userData));
    notify("Data saved.");
}
export { getUserData, storeUserData, newMultiverse }