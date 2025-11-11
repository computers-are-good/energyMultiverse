import { checkCosts, subtractCosts } from "../itemCosts.js";
import notifyUnique from "../notifs/notifyUnique.js";
import { addNavigationAttention, unlockUIElement } from "../toggleUIElement.js";

function updateWarpDriveButton(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    if (currentMultiverse.researchCompleted.includes("Warp Drive")) {
        if (currentMultiverse.warpDriveBuilt) {
            document.getElementById("buildWarpDrive").style.display = "none";
            document.getElementById("galaxyView").style.display = "block";
        } else {
            document.getElementById("buildWarpDrive").style.display = "block";
            document.getElementById("galaxyView").style.display = "none";
        }
    } else {
        document.getElementById("buildWarpDrive").style.display = "none";
        document.getElementById("galaxyView").style.display = "none";
    }
}
const warpDriveCosts = {
    iridium: 5,
    metal: 10
}
function buildWarpDrive(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    if (checkCosts(userData, warpDriveCosts)) {
        subtractCosts(userData, warpDriveCosts);
        currentMultiverse.warpDriveBuilt = true;
        updateWarpDriveButton(userData);
        unlockUIElement(userData.multiverses[userData.currentMultiverse].UIElementsUnlocked, "pageManufactory");
        notifyUnique("manufactoryUnlocked");
        addNavigationAttention("Manufactory", "pageManufactory");
    }
}

export {updateWarpDriveButton, buildWarpDrive}