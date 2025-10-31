import { shipWeapons } from "../data/shipData.js";


function threatLevel(shipInfo) {
    let threatLevel = 0;
    const weaponStats = shipWeapons[shipInfo.weapon].baseStats;
    threatLevel += (weaponStats.baseDamageMultiplier * shipInfo.baseStats.baseAttack) / 5;
    threatLevel += shipInfo.baseStats.baseHealth / 10;
    threatLevel += shipInfo.baseStats.baseShield / 5;

    //The less range the weapon has, the lower the threat level.
    threatLevel += Math.floor((weaponStats.maxRange - weaponStats.minRange) / 50) - 1;

    return Math.ceil(threatLevel);

}

export default threatLevel;