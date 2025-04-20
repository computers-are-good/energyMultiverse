import {getUserData, storeUserData} from "./userdata.js";
import {firstLoadFunctions, applyEvents} from "./pageLoad.js";
import { updateSolarSystem } from "./map/solarSystem.js";

const userData = getUserData();
updateSolarSystem(userData);
document.body.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === "s" && e.ctrlKey) {
        e.preventDefault();
        storeUserData(userData);
    }
})
firstLoadFunctions(userData);
applyEvents(userData);