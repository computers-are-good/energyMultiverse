import fadeIn from "../animations/fadeIn.js"
let drones = [];
const targetNode = document.getElementById("energyClicker");
let centerX = targetNode.offsetLeft + targetNode.offsetWidth / 2;
let centerY = targetNode.offsetTop + targetNode.offsetHeight / 2;

function updateCenters() {
    centerX = targetNode.offsetLeft + targetNode.offsetWidth / 2;
    centerY = targetNode.offsetTop + targetNode.offsetHeight / 2;
}
window.addEventListener("resize", updateCenters);
function spawnDrone(droneInfo) {
    const droneDiv = document.createElement("div");
    const radius = 150 + Math.random() * 50;
    const newDrone = {
        radius: radius,
        theta: Math.random() * Math.PI * 2,
        div: droneDiv,
        droneInfo: droneInfo
    }
    drones.push(newDrone);
    droneDiv.classList.add("drone");
    document.getElementById("bigEnergy").appendChild(droneDiv);
    fadeIn(droneDiv, 2);
}
let lastTime = performance.now();
function animateDrones() {
    updateCenters();
    let newTime = performance.now();
    const deltaTime = lastTime - newTime;
    lastTime = newTime;
    drones.forEach(e => {
        const speed = (1 / (e.droneInfo.ticksTilEnergy)) * deltaTime;
        const deltaTheta = speed / e.radius * 2 * Math.PI;
        e.theta += deltaTheta;
        if (e.theta > Math.PI * 2) {
            e.theta -= Math.PI * 2
        }
        const posX = e.radius * Math.cos(e.theta);
        const posY = e.radius * Math.sin(e.theta);
        e.div.style.left = `${posX + centerX}px`;
        e.div.style.top = `${posY + centerY}px`;
    });

    requestAnimationFrame(animateDrones);
}

export { spawnDrone, animateDrones }