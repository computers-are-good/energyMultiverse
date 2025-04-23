function fabriBotSlider(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];
    const slider = document.getElementById("fabriBotSlider");
    currentMultiverse.fabriBotSpeed = slider.valueAsNumber;

    updateFabriBot(userData);
}
function updateFabriBot(userData) {
    const currentMultiverse = userData.multiverses[userData.currentMultiverse];

    const slider = document.getElementById("fabriBotSlider");

    slider.max = currentMultiverse.fabriBotMaxSpeed;
    slider.value = currentMultiverse.fabriBotSpeed;

    if (currentMultiverse.fabriBotSpeed === 0) {
        document.getElementById("fabriBotInactive").style.display = "block";
        document.getElementById("fabriBotSliderInfo").style.display = "none";
    } else {
        document.getElementById("fabriBotInactive").style.display = "none";
        document.getElementById("fabriBotSliderInfo").style.display = "block";
        document.getElementById("fabriBotSliderSeconds").textContent = `${(100 - currentMultiverse.fabriBotSpeed * 2) / 10}`
    }
}

export {fabriBotSlider, updateFabriBot}