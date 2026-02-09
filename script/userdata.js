import defaultData from "./data/defaultData.js";
import defaultMultiverseData from "./data/defaultMultiverseData.js";
import generateAllSystems from "./map/newSolarSystem.js";
import multiverseNames from "./data/multiverseNames.js";
import { notify } from "./notifs/notify.js";
import { choice, deepClone } from "./utils.js";

function recursivelyAddProperties(dataToFix, dataReference, skipMultiverses) {
    for (let data in dataReference) {
        if (skipMultiverses && data == "multiverses") continue;
        if (typeof dataReference[data] === "object") {
            if (!(data in dataToFix)) {
                dataToFix[data] = deepClone(dataReference[data]);
            } else {
                recursivelyAddProperties(dataToFix[data], dataReference[data], skipMultiverses);
            }
        } else {
            if (!(data in dataToFix))
                dataToFix[data] = dataReference[data];
        }
    }
}

// If there's a new object property that is not in the user's save file, add the default value to the user's save
function addMissingProperties(dataToFix) {
    // Add missing properties in userData for everything except multiverses
    recursivelyAddProperties(dataToFix, defaultData, true);

    // Add missing properties to multiverses
    dataToFix.multiverses.forEach(e => recursivelyAddProperties(e, defaultMultiverseData, false));
}
function getUserData() {
    const readData = window.localStorage.getItem("saveData");
    let dataToReturn;
    if (readData === null) {
        dataToReturn = structuredClone(defaultData);
        newMultiverse(dataToReturn);
    } else {
        dataToReturn = JSON.parse(readData);
        addMissingProperties(dataToReturn);
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