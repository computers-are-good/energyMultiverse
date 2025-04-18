import combatLog from "../notifs/notifyCombat.js";

function combat(playerShip, enemyShip) { //resolve with true if the player has won

    playerShip.currentShield = 0;
    enemyShip.currentShield = 0;
    return new Promise(res => {
        updateStatsDisplay(playerShip, enemyShip);

        document.getElementById("combat").style.display = "block";

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
    })
}
async function playerTurn(playerShip, enemyShip) {
    document.getElementById("actionButtons").style.display = "block";

    const action = await getPlayerAction();
    if (action === "attack") {
        const oldHealth = enemyShip.currentHealth;
        attack(playerShip, enemyShip);
        combatLog(`You attacked the enemy for ${oldHealth - enemyShip.currentHealth} damage!`);
        if (enemyShip.currentHealth <= 0) {
            enemyShip.currentHealth = 0;
            updateStatsDisplay(playerShip, enemyShip);
            combatLog("You are victorious.");
            await endCombat();
            return true;
        } else {
            updateStatsDisplay(playerShip, enemyShip);
            return enemyTurn(playerShip, enemyShip);
        }
    }
}

async function enemyTurn(playerShip, enemyShip) {
    document.getElementById("actionButtons").style.display = "none";
    const oldHealth = playerShip.currentHealth;
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
}

function updateStatsDisplay(playerShip, enemyShip) {
    document.getElementById("playerHull").textContent = playerShip.currentHealth;
    document.getElementById("playerShield").textContent = playerShip.currentShield;
    document.getElementById("playerAttack").textContent = playerShip.baseStats.baseAttack;
    document.getElementById("enemyHull").textContent = enemyShip.currentHealth;
    document.getElementById("enemyShield").textContent = enemyShip.currentShield;
    document.getElementById("enemyAttack").textContent = enemyShip.baseStats.baseAttack;
}

export { combat }