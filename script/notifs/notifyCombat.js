import fadeIn from "../animations/fadeIn.js";

let messageCount = 0;

const notificationsDiv = document.getElementById("combatLog");
function combatLog(message) {
        messageCount++;
        const newP = document.createElement("p");
        newP.textContent = message;
        if (messageCount === 0) {
            notificationsDiv.appendChild(newP);
        } else {
            notificationsDiv.insertBefore(newP, notificationsDiv.firstChild);
        }

        if (messageCount > 10) {
            notificationsDiv.lastChild.remove();
            messageCount--;
        }

        fadeIn(newP, 0.5);
}

export default combatLog;