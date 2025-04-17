function increaseShipThrust(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    if (currentMultiverse.mothershipCurrentThrust < currentMultiverse.mothershipMaxThrust) {
        currentMultiverse.mothershipCurrentThrust++;
        updateShipThrust(userData);
    }
}

function decreaseShipThrust(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    if (currentMultiverse.mothershipCurrentThrust > 0) {
        currentMultiverse.mothershipCurrentThrust--;
        updateShipThrust(userData);
    }
}

function updateShipThrust(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    document.getElementById("thrustSpeed").textContent = currentMultiverse.mothershipCurrentThrust;
}
export {increaseShipThrust, decreaseShipThrust, updateShipThrust}