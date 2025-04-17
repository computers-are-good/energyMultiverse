import notify from "./notifs/notify.js";

function checkCosts(userData, cost, notifyUser = true) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    for (let item in cost) {
        if (currentMultiverse[item] < cost[item]) {
            if (notifyUser) notify(`Not enough ${item}.`);
            return false;
        }
    }
    return true;
}

function subtractCosts(userData, cost) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    for (let item in cost) {
        currentMultiverse[item] -= cost[item];
    }
}

export {checkCosts, subtractCosts};