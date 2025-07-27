import { particles } from "../animations/particles.js";
import combatLog from "../notifs/notifyCombat.js";
import { wait } from "../utils.js";

const combatVisualisation = document.getElementById("combatVisualisation");
const shipPosY = 115;

let playerX;
let enemyShipX;
let combatVisualisationX;
let combatVisualisationY;
let combatVisualisationWidth;
let playerShipDiv;
let enemyShipDiv;
let offset;

function drawPlayerAndEnemy() {
    const combatVisualisationRect = combatVisualisation.getBoundingClientRect();
    combatVisualisationWidth = combatVisualisationRect.width;
    offset = combatVisualisationRect.left;

    playerShipDiv = document.createElement("div");
    playerShipDiv.style.height = "30px";
    playerShipDiv.style.width = "30px";
    playerShipDiv.style.position = "absolute";
    playerShipDiv.style.top = `${shipPosY + combatVisualisationRect.top}px`;
    playerShipDiv.style.left = `${playerX / battlefieldSize * combatVisualisationWidth + offset}px`;
    playerShipDiv.style.backgroundColor = "green";

    combatVisualisation.appendChild(playerShipDiv);

    enemyShipDiv = document.createElement("div");
    enemyShipDiv.style.height = "30px";
    enemyShipDiv.style.width = "30px";
    enemyShipDiv.style.position = "absolute";
    enemyShipDiv.style.top = `${shipPosY + combatVisualisationRect.top}px`;
    enemyShipDiv.style.left = `${enemyShipX / battlefieldSize * combatVisualisationWidth + offset - 30}px`;
    enemyShipDiv.style.backgroundColor = "red";

    combatVisualisation.appendChild(enemyShipDiv);
}

function blasterAnimation(fromPlayerToEnemy, size) {
    function accelerate(time) {
        return (time / 10) ** 4
    }
    const speed = 0.00000001;
    const originX = fromPlayerToEnemy ? playerX + 1 : enemyShipX - 5;
    return new Promise(res => {
        const blaster = document.createElement("div");
        blaster.style.height = `${size}px`;
        blaster.style.width = `${size}px`;
        blaster.style.position = "absolute";
        blaster.style.transform = "scale(0)";
        blaster.style.backgroundColor = "white";
        blaster.style.borderRadius = "20px";
        blaster.style.top = `${shipPosY + combatVisualisationY + size - 7.5}px`;
        let blasterX = originX;

        document.getElementById("combatVisualisation").appendChild(blaster);
        let t0 = performance.now();
        let cumulativeTime = 0;
        function animationFrame() {
            let t1 = performance.now();
            let deltaT = t1 - t0;
            t0 = t1;
            cumulativeTime += deltaT;
            blasterX += deltaT * speed * (fromPlayerToEnemy ? 1 : -1) * accelerate(cumulativeTime);
            blaster.style.left = `${blasterX / battlefieldSize * combatVisualisationWidth + combatVisualisationX}px`;
            blaster.style.transform = `scale(${Math.min(cumulativeTime / 200, 1)})`;

            let endAnimation = false;
            if (fromPlayerToEnemy && blasterX > enemyShipX) endAnimation = true;
            if (!fromPlayerToEnemy && blasterX < playerX) endAnimation = true;
            if (endAnimation) {
                res();
                blaster.remove();
            } else {
                requestAnimationFrame(animationFrame);
            }
        }
        animationFrame();
    })
}

function moveForwardAnimation(amount, div, divCurrentOffset) {
    const speed = 0.05;
    return new Promise(res => {
        let amountMoved = 0;
        let t0 = performance.now();
        function animationFrame() {
            let t1 = performance.now();
            let deltaT = t1 - t0;
            t0 = t1;
            amountMoved += speed * deltaT * (amount > 0 ? 1 : -1);
            div.style.left = `${(amountMoved + divCurrentOffset) / battlefieldSize * combatVisualisationWidth + offset}px`;
                if (amount > 0 ? amountMoved >= amount : amountMoved <= amount) {
                    amountMoved = amount;
                    res();
                } else {
                    requestAnimationFrame(animationFrame);
                }
        }
        animationFrame();
    })
}
const battlefieldSize = 200;

function combat(playerShip, enemyShip) { //resolve with true if the player has won
    playerShip.currentShield = 0;
    enemyShip.currentShield = 0;
    document.getElementById("combatLog").innerHTML = "";
    return new Promise(res => {
        combatInProgress = true;
        updateStatsDisplay(playerShip, enemyShip);

        document.getElementById("combat").style.display = "block";

        const combatVisualisationBounding = combatVisualisation.getBoundingClientRect();
        enemyShipX = battlefieldSize;
        playerX = 0;
        combatVisualisationX = combatVisualisationBounding.left;
        combatVisualisationY = combatVisualisationBounding.top;

        drawPlayerAndEnemy(playerShip, enemyShip);

        let particleInterval = setInterval(_ => {
            particles({
                particleX: combatVisualisationX + combatVisualisationWidth * Math.random(),
                particleY: combatVisualisationY + 250 * Math.random(),
                particleColor: "white",
                spawnVariance: 0,
                particleLifetime: 5000,
                particleNumber: 2,
                fadeIn: 2500,
                particleSize: 3,
                zIndex: 999999,
                direction: Math.PI / 2,
                particleSpeed: 0.0
            }, combatVisualisation);
            if (!combatInProgress) {
                clearInterval(particleInterval);
            }
        }, 3500);


        if (playerShip.baseStats.baseSpeed >= enemyShip.baseStats.baseSpeed) {
            res(playerTurn(playerShip, enemyShip));
        } else {
            res(enemyTurn(playerShip, enemyShip));
        }

    });
}
let combatInProgress;
async function endCombat() {
    return new Promise(res => {
        const endButton = document.createElement("button");
        endButton.textContent = "End combat";
        document.getElementById("player").appendChild(endButton);
        combatInProgress = false;
        endButton.addEventListener("click", _ => {
            res();
            endButton.remove();
            document.getElementById("combat").style.display = "none";
        });
    });
}
function attack(attacker, attacked) {
    const damage = attacker.baseStats.baseAttack;
    attacked.currentShield -= damage;
    if (attacked.currentShield < 0) {
        attacked.currentHealth += attacked.currentShield;
        attacked.currentShield = 0;
    }
}
function getPlayerAction() {
    return new Promise(res => {
        document.getElementById("actionButtons").innerHTML = "";

        const basicActions = document.createElement("div");
        const attackButton = document.createElement("button");
        attackButton.textContent = "Attack";
        attackButton.addEventListener("click", _ => res("attack"));
        basicActions.appendChild(attackButton);

        const blockButton = document.createElement("button");
        blockButton.textContent = "Block";
        blockButton.addEventListener("click", _ => res("block"));
        basicActions.appendChild(blockButton);

        basicActions.style.display = "flex";
        document.getElementById("actionButtons").appendChild(basicActions);

        const moveButtons = document.createElement("div");

        const moveBack = document.createElement("button");
        moveBack.textContent = "<-";
        moveBack.addEventListener("click", _ => res("moveBack"));
        moveButtons.appendChild(moveBack);

        const moveForward = document.createElement("button");
        moveForward.textContent = "->";
        moveForward.addEventListener("click", _ => res("moveForward"));
        moveButtons.appendChild(moveForward);

        moveButtons.style.display = "flex";
        document.getElementById("actionButtons").appendChild(moveButtons);
    });
}

function block(ship) {
    ship.currentShield += ship.baseStats.baseShield;
    if (ship.currentShield > ship.baseStats.baseShield * 2) {
        ship.currentShield = ship.baseStats.baseShield * 2;
    }
}
async function playerTurn(playerShip, enemyShip) {
    document.getElementById("actionButtons").style.display = "block";

    const action = await getPlayerAction();
    switch (action) {
        case "attack":
            const oldHealth = enemyShip.currentHealth;
            attack(playerShip, enemyShip);
            await blasterAnimation(true, Math.min(playerShip.baseStats.baseAttack, 15));
            if (oldHealth - enemyShip.currentHealth <= 0) {
                particles({
                    particleX: enemyShipX / battlefieldSize * combatVisualisationWidth + combatVisualisationX - 22,
                    particleY: combatVisualisationY + shipPosY - 22,
                    particleColor: "DodgerBlue",
                    spawnVariance: 0,
                    particleLifetime: 750,
                    particleNumber: 1,
                    particleSize: 75,
                    zIndex: 999999,
                    particleSpeed: 0
                });
            } else {
                particles({
                    particleX: enemyShipX / battlefieldSize * combatVisualisationWidth + combatVisualisationX - 10,
                    particleY: combatVisualisationY + shipPosY,
                    particleColor: "red",
                    particleLifetime: 2000,
                    particleNumber: Math.min(Math.max((oldHealth - enemyShip.currentHealth) * 2, 8), 50),
                    particleSize: 3,
                    zIndex: 99999,
                    particleSpeed: 0.1
                });
            }
            combatLog(`You attacked the enemy for ${oldHealth - enemyShip.currentHealth} damage!`);
            if (enemyShip.currentHealth <= 0) {
                enemyShip.currentHealth = 0;
                updateStatsDisplay(playerShip, enemyShip);
                document.getElementById("actionButtons").style.display = "none";
                combatLog("You are victorious.");
                await endCombat();
                return true;
            } else {
                updateStatsDisplay(playerShip, enemyShip);
                return enemyTurn(playerShip, enemyShip);
            }
        case "block":
            block(playerShip);
            combatLog(`You regenerated your shield.`);
            updateStatsDisplay(playerShip, enemyShip);
            return enemyTurn(playerShip, enemyShip);
        case "moveForward":
            await moveForwardAnimation(10, playerShipDiv, playerX);
            playerX += 10;
            return enemyTurn(playerShip, enemyShip);
        case "moveBack":
            await moveForwardAnimation(-10, playerShipDiv, playerX);
            playerX -= 10;
            return enemyTurn(playerShip, enemyShip);
    }
}
async function enemyTurn(playerShip, enemyShip) {
    document.getElementById("actionButtons").style.display = "none";
    await wait(500);
    const oldHealth = playerShip.currentHealth;
    if (enemyShip.currentHealth / enemyShip.baseStats.baseHealth > 0.3) {
        attack(enemyShip, playerShip);
        await blasterAnimation(false, Math.min(enemyShip.baseStats.baseAttack, 15));
        if (oldHealth - playerShip.currentHealth <= 0) {
            particles({ //shield pulse
                particleX: playerX / battlefieldSize * combatVisualisationWidth + combatVisualisationX - 22,
                particleY: combatVisualisationY + shipPosY - 22,
                particleColor: "DodgerBlue",
                particleLifetime: 500,
                particleNumber: 1,
                particleSize: 75,
                zIndex: 999999,
                particleScalingRate: 0.001,
                spawnVariance: 0,
                particleSpeed: 0,
                circular: true
            }, combatVisualisation);
        } else {
            particles({ //damage particles
                particleX: playerX / battlefieldSize * combatVisualisationWidth + combatVisualisationX + 10,
                particleY: combatVisualisationY + shipPosY,
                spawnVariance: 0,
                particleColor: "red",
                particleLifetime: 2000,
                particleNumber: Math.min(Math.max((oldHealth - playerShip.currentHealth) * 2, 8), 50),
                particleSize: 3,
                zIndex: 99999,
                particleSpeed: 0.1
            });
        }
        combatLog(`The enemy attacked you for ${oldHealth - playerShip.currentHealth} damage!`);
        if (playerShip.currentHealth <= 0) {
            playerShip.currentHealth = 0;
            updateStatsDisplay(playerShip, enemyShip);
            combatLog("You were defeated.");
            await endCombat();
            return false;
        } else {
            updateStatsDisplay(playerShip, enemyShip);
            return playerTurn(playerShip, enemyShip);
        }
    } else {
        block(enemyShip);
        return playerTurn(playerShip, enemyShip);
    }

}

function updateStatsDisplay(playerShip, enemyShip) {
    document.getElementById("playerHull").textContent = playerShip.currentHealth;
    document.getElementById("playerShield").textContent = `${playerShip.currentShield} / ${playerShip.baseStats.baseShield * 2}`;
    document.getElementById("playerAttack").textContent = playerShip.baseStats.baseAttack;
    document.getElementById("enemyHull").textContent = enemyShip.currentHealth;
    document.getElementById("enemyShield").textContent = enemyShip.currentShield;
    document.getElementById("enemyAttack").textContent = enemyShip.baseStats.baseAttack;
}

export { combat }