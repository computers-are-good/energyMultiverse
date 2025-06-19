import tutorialTextData from "../data/tutorialText.js";

function displayTutorialText(textId) {
    const el = document.getElementById("tutorialTexts");
    el.style.display = "block";
    el.innerHTML = "";
    tutorialTextData[textId].forEach(e => el.appendChild(e));

    function eventHandler() {
        el.style.display = "none";
        el.removeEventListener("click", eventHandler);
    }
    el.addEventListener("click", eventHandler);
}

export default displayTutorialText