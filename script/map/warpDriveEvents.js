import { checkCosts, subtractCosts } from "../itemCosts.js";

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
    }
}

export {updateWarpDriveButton, buildWarpDrive}