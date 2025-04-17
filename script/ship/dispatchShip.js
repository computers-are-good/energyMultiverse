function dispatchShip(ship, target, userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const currentSystem = currentMultiverse.solarSystems[currentMultiverse.currentSolarSystem];

    ship.isBusy = true;
    ship.targetObjectId = target;
    ship.inSolarSystem = true;
    ship.posX = currentSystem.objects.player.posX;
    ship.posY = currentSystem.objects.player.posY;
}

export default dispatchShip