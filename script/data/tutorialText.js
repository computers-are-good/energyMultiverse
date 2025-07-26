const tutorialTextData = {
    clickEnergy: [],
    Research: [],
    Upgrades: []
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
tutorialTextData.Research.push(researchDescription);

const researchBox = document.createElement("div");
researchBox.classList.add("tutorialBrightArea");
let researchBounding = document.getElementById("Research").getBoundingClientRect();
researchBox.style.width = `${researchBounding.width <= 0 ? 1000 : researchBounding.width}px`;
researchBox.style.height = `300px`;
researchBox.style.left = `${researchBounding.x <= 0 ? 0 : researchBounding.x}px`;
researchBox.style.top = `45px`;
tutorialTextData.Research.push(researchBox);

window.addEventListener("resize", _ => {
    clickBox.style.left = `${document.getElementById("bigEnergy").getBoundingClientRect().x}px`;
    clickText.style.left = `${document.getElementById("bigEnergy").getBoundingClientRect().x}px`;

    researchBounding = document.getElementById("Research").getBoundingClientRect();
    researchBox.style.width = `${researchBounding.width}px`;
    researchBox.style.left = `${researchBounding.x}px`;
});

const researchButtonsBounding = document.getElementById("upgradeButtonsContainer").getBoundingClientRect();


const upgradeBox = document.createElement("div");
upgradeBox.classList.add("tutorialBrightArea");
upgradeBox.style.width = `${researchButtonsBounding.width - 300}px`;
upgradeBox.style.left = "150px";
upgradeBox.style.top = "30px";
upgradeBox.style.height = "200px";
tutorialTextData.Upgrades.push(upgradeBox);

const upgradeDescription = document.createElement("p");
upgradeDescription.classList.add("tutorialText");
upgradeDescription.textContent =
    `Upgrades have to be unlocked first, either through gameplay or research.
Once you have the necessary resources to unlock an upgrade, click on it. 
Upgrades are more expensive the more they are upgraded.
Once an upgrade is maxed out, it will disappear.`;
upgradeDescription.style.left = "250px";
upgradeDescription.style.width = `${researchButtonsBounding.width - 500}px`;
upgradeDescription.style.top = "250px";
tutorialTextData.Upgrades.push(upgradeDescription);

export default tutorialTextData;