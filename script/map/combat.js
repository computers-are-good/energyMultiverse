import { particles } from "../animations/particles.js";
import combatLog from "../notifs/notifyCombat.js";
import { wait } from "../utils.js";

const combatVisualisation = document.getElementById("combatVisualisation");
const shipPosY = 115;

let playerX;
let enemyShipX;
let combatVisualisationX;
let combatVisualisationY;
function drawPlayerAndEnemy(playerShip, enemyShip) {

    const combatVisualisationRect = combatVisualisation.getBoundingClientRect();
    const playerShipDiv = document.createElement("div");
    playerShipDiv.style.height = "20px";
    playerShipDiv.style.width = "20px";
    playerShipDiv.style.position = "absolute";
    playerShipDiv.style.top = `${shipPosY + combatVisualisationRect.top}px`;
    playerShipDiv.style.left = `${playerX + combatVisualisationRect.left}px`;
    playerShipDiv.style.backgroundColor = "green";

    combatVisualisation.appendChild(playerShipDiv);

    const enemyShipDiv = document.createElement("div");
    enemyShipDiv.style.height = "20px";
    enemyShipDiv.style.width = "20px";
    enemyShipDiv.style.position = "absolute";
    enemyShipDiv.style.top = `${shipPosY + combatVisualisationRect.top}px`;
    enemyShipDiv.style.left = `${enemyShipX + combatVisualisationRect.left}px`;
    enemyShipDiv.style.backgroundColor = "red";

    combatVisualisation.appendChild(enemyShipDiv);
}
function blasterAnimation(fromPlayerToEnemy) {
    const speed = 1;
    const originX = fromPlayerToEnemy ? playerX : enemyShipX;
    const targetX = fromPlayerToEnemy ? enemyShipX : playerX;
    return new Promise(res => {
        const blaster = document.createElement("div");
        blaster.style.height = "5px";
        blaster.style.width = "5px";
        blaster.style.position = "absolute";
        blaster.style.backgroundColor = "white";
        blaster.style.top = `${shipPosY + combatVisualisationY + 7.5}px`;
        let blasterX = originX;

        document.getElementById("combatVisualisation").appendChild(blaster);
        let t0 = performance.now();
        function animationFrame() {
            let t1 = performance.now();
            let deltaT = t1 - t0;
            t0 = t1;
            blasterX += deltaT * speed * (fromPlayerToEnemy ? 1 : -1);
            blaster.style.left = `${blasterX + combatVisualisationX}px`;

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

function combat(playerShip, enemyShip) { //resolve with true if the player has won
    playerShip.currentShield = 0;
    enemyShip.currentShield = 0;
    return new Promise(res => {
        updateStatsDisplay(playerShip, enemyShip);

        document.getElementById("combat").style.display = "block";

        const combatVisualisationBounding = combatVisualisation.getBoundingClientRect();
        enemyShipX = combatVisualisationBounding.width * 0.9;
        playerX = combatVisualisationBounding.width * 0.1;
        combatVisualisationX = combatVisualisationBounding.left;
        combatVisualisationY = combatVisualisationBounding.top;

        drawPlayerAndEnemy(playerShip, enemyShip);

        if (playerShip.baseStats.baseSpeed >= enemyShip.baseStats.baseSpeed) {
            res(playerTurn(playerShip, enemyShip));
        } else {
            res(enemyTurn(playerShip, enemyShip));
        }

    });
}
async function endCombat() {
    return new Promise(res => {
        const endButton = document.createElement("button");
        endButton.textContent = "End combat";
        document.getElementById("player").appendChild(endButton);
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
        const attackButton = document.createElement("button");
        attackButton.textContent = "Attack";
        attackButton.addEventListener("click", _ => res("attack"));
        document.getElementById("actionButtons").appendChild(attackButton);

        const blockButton = document.createElement("button");
        blockButton.textContent = "Block";
        blockButton.addEventListener("click", _ => res("block"));
        document.getElementById("actionButtons").appendChild(blockButton);

    })
}

function block(ship) {
    ship.currentShield += ship.baseStats.baseShield;
    if (ship.currentShield > ship.baseStats.baseShield * 2) {
        ship.currentShield = ship.baseStats.baseShield * 2;
    }
}
async function playerTurn(playerShip, enemyShip) {
    document.getElementById("actionButtons").style.display = "flex";

    const action = await getPlayerAction();
    if (action === "attack") {
        const oldHealth = enemyShip.currentHealth;
        await blasterAnimation(true);
        particles({
            particleX: enemyShipX + combatVisualisationX + 10,
            particleY: combatVisualisationY + shipPosY,
            particleColor: "red",
            particleLifetime: 2000,
            particleNumber: 10,
            particleSize: 3,
            zIndex: 99999,
            particleSpeed: 0.1
        });
        attack(playerShip, enemyShip);
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
    } else if (action === "block") {
        block(playerShip);
        combatLog(`You regenerated your shield.`);
        updateStatsDisplay(playerShip, enemyShip);
        return enemyTurn(playerShip, enemyShip);
    }
}

async function enemyTurn(playerShip, enemyShip) {
    document.getElementById("actionButtons").style.display = "none";
    await wait(500);
    const oldHealth = playerShip.currentHealth;
    if (enemyShip.currentHealth / enemyShip.baseStats.baseHealth > 0.3) {
        await blasterAnimation(false);
        particles({
            particleX: playerX + combatVisualisationX + 10,
            particleY: combatVisualisationY + shipPosY,
            particleColor: "red",
            particleLifetime: 2000,
            particleNumber: 10,
            particleSize: 3,
            zIndex: 99999,
            particleSpeed: 0.1
        });
        attack(enemyShip, playerShip);
        combatLog(`The enemy attacked you for ${oldHealth - playerShip.currentHealth} damage!`)
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