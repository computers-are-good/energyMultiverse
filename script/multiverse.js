import { firstLoadFunctions } from "./pageLoad.js";
import { newMultiverse } from "./userdata.js";

function createNewMultiverse(userData, multipliers) {
    const multiverse = newMultiverse(userData);
    multiverse.multipliers = multipliers;
}

function multiverseTravel(userData, targetMultiverse) {
    document.getElementById("notifications").innerHTML = "";
    userData.currentMultiverse = targetMultiverse;
    document.querySelectorAll(".drone").forEach(e => {
        e.remove();
    });
    firstLoadFunctions(userData);
}
export {createNewMultiverse, multiverseTravel}