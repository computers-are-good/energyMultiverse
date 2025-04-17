import combatLog from "../notifs/notifyCombat.js";

function combat(playerShip, enemyShip) { //resolve with true if the player has won

    playerShip.currentShield = 0;
    enemyShip.currentShield = 0;
    return new Promise(res => {
        updateStatsDisplay(playerShip, enemyShip)
        document.getElementById("combat").style.display = "block";

        if (playerShip.baseStats.baseSpeed >= enemyShip.baseStats.baseSpeed) {
            res(playerTurn(playerShip, enemyShip));
        } else {
            res(enemyTurn(playerShip, enemyShip));
        }

    });
}
function endCombatCleanup() {
    document.getElementById("combat").style.display = "none";
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
    })
}
async function playerTurn(playerShip, enemyShip) {
    document.getElementById("actionButtons").style.display = "block";

    const action = await getPlayerAction();
    if (action === "attack") {
        const oldHealth = enemyShip.currentHealth;
        attack(playerShip, enemyShip);
        combatLog(`You attacked the enemy for ${oldHealth - enemyShip.currentHealth} damage!`);
        updateStatsDisplay(playerShip, enemyShip);
        if (enemyShip.currentHealth <= 0) {
            endCombatCleanup();
            return true;
        } else {
            return enemyTurn(playerShip, enemyShip);
        }
    }
}

function enemyTurn(playerShip, enemyShip) {
    document.getElementById("actionButtons").style.display = "none";
    const oldHealth = playerShip.currentHealth;
    attack(enemyShip, playerShip);
    combatLog(`The enemy attacked you for ${oldHealth - playerShip.currentHealth} damage!`)
    updateStatsDisplay(playerShip, enemyShip);
    if (playerShip.currentHealth <= 0) {
        endCombatCleanup();
        return false;
    } else {
        return playerTurn(playerShip, enemyShip);
    }
}

function updateStatsDisplay(playerShip, enemyShip) {
    document.getElementById("playerHull").textContent = playerShip.currentHealth;
    document.getElementById("playerShield").textContent = playerShip.currentShield;
    document.getElementById("playerAttack").textContent = playerShip.baseStats.baseAttack;
    document.getElementById("enemyHull").textContent = enemyShip.currentHealth;
    document.getElementById("enemyShield").textContent = enemyShip.currentShield;
    document.getElementById("enemyAttack").textContent = enemyShip.baseStats.baseAttack;
}

export {combat}