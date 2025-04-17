import {getUserData, storeUserData} from "./userdata.js";
import pageLoad from "./events/pageLoad.js";
import { updateSolarSystem } from "./map/solarSystem.js";

const userData = getUserData();
updateSolarSystem(userData);
document.body.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === "s" && e.ctrlKey) {
        e.preventDefault();
        storeUserData(userData);
    }
})
pageLoad(userData);