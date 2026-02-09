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
    console.log("yes")
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    document.getElementById("thrustSpeed").textContent = currentMultiverse.mothershipCurrentThrust;
    if (currentMultiverse.mothershipCurrentThrust > 0) { // Thrusters on, display to user thrusters are on
        document.getElementById("mothershipThrustersOn").style.display = "block";
        document.getElementById("mothershipThrustersOff").style.display = "none";
    } else { // Thrusters off, display thrusters are off
        document.getElementById("mothershipThrustersOn").style.display = "none";
        document.getElementById("mothershipThrustersOff").style.display = "block";
    }
}
export { increaseShipThrust, decreaseShipThrust, updateShipThrust }