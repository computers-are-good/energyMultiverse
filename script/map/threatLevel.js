function threatLevel(shipInfo) {
    let threatLevel = 0;
    threatLevel += shipInfo.baseStats.baseAttack / 5;
    threatLevel += shipInfo.baseStats.baseHealth / 10;
    threatLevel += shipInfo.baseStats.baseShield / 5;

    return Math.ceil(threatLevel);

}

export default threatLevel;