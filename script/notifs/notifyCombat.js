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

        notificationsDiv.childNodes.forEach((e, i) => {
            if (i > 0) e.style.opacity = 1 - i * 0.075;
        })

        fadeIn(newP, 0.5);
}

export default combatLog;