import defaultData from "./data/defaultData.js";
import defaultMultiverseData from "./data/defaultMultiverseData.js";
import newSolarSystem from "./map/newSolarSystem.js";
import {choice, deepClone} from "./utils.js";

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
const multiverseNames = ["Ytare", "Baela", "Starwater"];
function newMultiverse(userData) {
    const chosenName = choice(multiverseNames);
    const multiverse = deepClone(defaultMultiverseData);
    multiverse.name = chosenName;
    multiverse.solarSystems.push(newSolarSystem());
    userData.multiverses.push(multiverse);
}
function storeUserData(data) {
    window.localStorage.setItem("saveData", JSON.stringify(data));
}
export {getUserData, storeUserData}