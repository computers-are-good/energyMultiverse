import { currentScreenDisplayed } from "../toggleUIElement.js";

// TODO: Allow this animation to be turned off.
let cellsInProgress = [];
let tBottom;
let resizeFinished = true;
let tRight;
let energyGenerated = 0;
function drawTable() {
    const table = document.createElement("table");
    const boundingBox = document.getElementById("solarPanel").getBoundingClientRect();
    table.classList.add("solarPanelTable");
    const cellHeight = 7;
    tBottom = Math.floor(boundingBox.height / cellHeight);
    tRight = Math.floor(boundingBox.width / cellHeight);
    for (let i = 0; i < tBottom; i++) {
        const newRow = document.createElement("tr");
        newRow.classList.add(`row${i}`);
        for (let j = 0; j < tRight; j++) {
            const newCol = document.createElement("td");
            newCol.classList.add(`col${j}`);
            newRow.appendChild(newCol);
        }
        table.append(newRow);
    }
    document.getElementById("solarPanel").insertBefore(table, document.getElementById("solarPanel").firstChild);
}
function startSolarPanelAnimation() {
    drawTable()
    continueSolarPanelAnimation();
}
function resizePanel() {
    // Actions for when the window is resized
    resizeFinished = false; // Don't allow animation to play while we are resizing
    setTimeout(_ => resizeFinished = true, 1000); // Add a delay in case other resize events are fired, to prevent flickering
    if (currentScreenDisplayed == "Energy") {
        document.querySelector("#solarPanel table").remove(); // Draw a new table
        drawTable();
    }
}
function acknowledgeEnergyGenerated(energy) {
    // Acknowledges that some energy has been generated, and spans a new cell to reflect that in the animation
    let i = 0;
    for (energyGenerated += energy; energyGenerated > 10; energyGenerated -= 10) {
        i++;
        // If we try to spawn too much particles, we probably have generated a lot of energy.
        // Reset the energy counter to prevent too much lag.
        if (i > 5) {
            energyGenerated = 0;
            break;
        }
        spawnNewCell();
    }
}
function spawnNewCell() {
    // Draws a new cell that will be animated
    // Initialise variables with placeholder values
    if (currentScreenDisplayed !== "Energy") return; // Only spawn new cell when screen is on energy, to prevent clutter

    const rand = Math.random();
    let row = 0; // The row this cell will be start on
    let col = 0; // The column the cell will start on
    let xVelDirection = 0; // 1 means move to the right, -1 means move to the left
    let yVelDirection = 0; // 1 means move down, -1 means move up
    let allowXVelocity = false; // Are we allowed to move left and right?
    let allowYVelocity = false; // Are we allowed to move up and down?
    const totalCells = 2 * tBottom + 2 * tRight;
    const selectedCell = Math.floor(rand * totalCells);
    
    // Determine which side the new cell should spawn on, and initialise variables accordingly
    if (selectedCell < tRight) {
        row = 0;
        col = selectedCell;
        xVelDirection = 1;
        yVelDirection = 1;
        allowXVelocity = false;
        allowYVelocity = true;
    } else if (selectedCell < tBottom + tRight) {
        col = tRight - 1;
        row = selectedCell - tRight;
        xVelDirection = -1;
        yVelDirection = 1;
        allowYVelocity = false;
        allowXVelocity = true;
    } else if (selectedCell < tBottom + 2 * tRight) {
        row = tBottom - 1;
        col = selectedCell - tBottom - tRight;
        xVelDirection = -1;
        yVelDirection = -1;
        allowXVelocity = false;
        allowYVelocity = true;
    } else {
        col = 0;
        row = selectedCell - tBottom - 2 * tRight;
        yVelDirection = -1;
        xVelDirection = 1;
        allowXVelocity = true;
        allowYVelocity = false;
    }
    const newCell = {
        row,
        col,
        xVelDirection,
        isMoving: true,
        yVelDirection,
        allowXVelocity,
        allowYVelocity,
        previousCells: []
    };
    cellsInProgress.push(newCell);
}
function continueSolarPanelAnimation() {
    // This function generates the next frame of the background animation
    // It runs once every 100ms
    if (currentScreenDisplayed == "Energy" && resizeFinished) {
        // If the player will actually see the animation, and we aren't resizing the window
        cellsInProgress.forEach((e, i) => { // Stores the position of previous cells
            if ((e.col < tRight && e.row < tBottom && e.row >= 0 && e.col >= 0 && e.isMoving)) {
                e.previousCells.unshift({
                    row: e.row,
                    col: e.col,
                    life: 15
                });
            }
            // If the "trail" is still moving
            if ((e.col <= tRight && e.row <= tBottom && e.row >= 0 && e.col >= 0 && e.isMoving)) {
                const targetEl = document.querySelector(`.solarPanelTable .row${e.row} .col${e.col}`);
                if (targetEl) targetEl.style.backgroundColor = "rgb(255, 255, 255)";
                if (e.allowXVelocity && e.col + e.xVelDirection >= -1 && e.col + e.xVelDirection <= tRight && e.isMoving) {
                    if ((e.col <= 0 && e.xVelDirection == -1) || (e.col == tRight - 1 && e.xVelDirection == 1)) {
                        e.isMoving = false; // The "trail" has gone off either the left or right edge 
                    } else {
                        e.col += e.xVelDirection;
                    }
                }
                if (e.allowYVelocity && e.row + e.yVelDirection >= -1 && e.row + e.yVelDirection <= tBottom && e.isMoving) {
                    if ((e.row == 0 && e.yVelDirection == -1) || (e.row == tBottom - 1 && e.yVelDirection == 1)) {
                        e.isMoving = false; // The "trail" has gone off either the top or bottom edge
                    } else {
                        e.row += e.yVelDirection;
                    }
                }
                // Randomly switch up the direction of a moving particle
                if (!e.allowXVelocity) {
                    if (Math.random() < 0.1) {
                        e.allowXVelocity = true;
                        e.allowYVelocity = false;
                    }
                }
                if (!e.allowYVelocity) {
                    if (Math.random() < 0.1) {
                        e.allowYVelocity = true;
                        e.allowXVelocity = false;
                    }
                }
            }
            let hasLifeLeft = false;
            e.previousCells.forEach(f => {
                // Update the "trail" cells
                if (f.life >= 0) {
                    let value = Math.max(20 + 235 * (f.life / 15), 20)
                    hasLifeLeft = true;
                    const randR = 50 * f.life / 15;
                    const randG = 50 * f.life / 15;
                    const randB = -50 * f.life / 15;
                    const targetEl = document.querySelector(`.solarPanelTable .row${f.row} .col${f.col}`);
                    if (targetEl) targetEl.style.backgroundColor =
                        `rgb(${value + randR}, ${value + randG}, ${value + randB})`;
                    f.life--;
                }
            });
            if (!hasLifeLeft && !e.isMoving) {
                cellsInProgress.splice(i, 1)
            }
        });
    }
    setTimeout(continueSolarPanelAnimation, 100);
}
export {
    startSolarPanelAnimation,
    acknowledgeEnergyGenerated,
    resizePanel
}