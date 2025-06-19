const tutorialTextData = {
    clickEnergy: [],
    research: [],
}
const clickBox = document.createElement("div");
clickBox.classList.add("tutorialBrightArea");
clickBox.style.width = "400px";
clickBox.style.height = "400px";
clickBox.style.left = `${document.getElementById("bigEnergy").getBoundingClientRect().x}px`;
tutorialTextData.clickEnergy.push(clickBox);

const clickText = document.createElement("p");
clickText.classList.add("tutorialText");
clickText.style.left = `${document.getElementById("bigEnergy").getBoundingClientRect().x}px`;
clickText.textContent = "Click to obtain energy.";
clickText.style.width = "400px";
clickText.style.top = "420px";
tutorialTextData.clickEnergy.push(clickText);

const researchDescription = document.createElement("p");
researchDescription.classList.add("tutorialText");
researchDescription.textContent =
    `Click the rate up and down buttons to adjust how much energy is used per second for research.
    Once you have spent 150 energy, you will get a research point.
    Research points can be used to unlock upgrades.
    More upgrades will be available as you progress.`;
researchDescription.style.left = "20%";
researchDescription.style.width = "40%";
researchDescription.style.top = "350px";
tutorialTextData.research.push(researchDescription);

const researchBox = document.createElement("div");
researchBox.classList.add("tutorialBrightArea");
let researchBounding = document.getElementById("Research").getBoundingClientRect();
researchBox.style.width = `${researchBounding.width}px`;
researchBox.style.height = `300px`;
researchBox.style.left = `${researchBounding.x}px`;
researchBox.style.top = `45px`;
tutorialTextData.research.push(researchBox);

window.addEventListener("resize", _ => {
    clickBox.style.left = `${document.getElementById("bigEnergy").getBoundingClientRect().x}px`;
    clickText.style.left = `${document.getElementById("bigEnergy").getBoundingClientRect().x}px`;

    researchBounding = document.getElementById("Research").getBoundingClientRect();
    researchBox.style.width = `${researchBounding.width}px`;
    researchBox.style.left = `${researchBounding.x}px`;
});

export default tutorialTextData;