import {notify} from "./notifs/notify.js";
import { useAntimatter, useDust, useEnergy, useIridium, useMetal } from "./resources/useResources.js";

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
const functionMappings = {
    "energy": useEnergy,
    "dust": useDust,
    "metal": useMetal,
    "iridium": useIridium,
    "antimatter": useAntimatter
}
function subtractCosts(userData, cost) {
    for (let item in cost) functionMappings[item](userData, cost[item]);
}

const costTextMappings = {
    energy: "Energy",
    dust: "Dust",
    metal: "Metal",
    iridium: "Iridium",
    researchPoints: "Research Point(s)",
    solarPanel: "Solar panel",
    antimatter: "Antimatter"
}
function writeCostsReadable(costs) {
    const keys = Object.keys(costs);
    if (keys.length === 1) {
        return `${costs[keys[0]]} ${costTextMappings[keys[0]]}`;
    } else if (keys.length === 2) {
        return `${costs[keys[0]]} ${costTextMappings[keys[0]]} and ${costs[keys[1]]} ${costTextMappings[keys[1]]}`;
    } else {
        let arr = [];
        keys.forEach((e, i) => arr.push(`${i === keys.length - 1 ? "and ": ""}${costs[e]} ${costTextMappings[e]}`));
        return arr.join(", ");
    }
}

export {checkCosts, subtractCosts, writeCostsReadable, costTextMappings};