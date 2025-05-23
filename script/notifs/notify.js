import fadeIn from "../animations/fadeIn.js";

let messageCount = 0;
let lastMessage = "";
let sameMessageCount = 0;
let lastPAdded;

const notificationsDiv = document.getElementById("notifications");
function notify(message) {
    if (message === lastMessage) {
        sameMessageCount++;
        lastPAdded.textContent = `${lastMessage} x${sameMessageCount + 1}`
    } else {
        messageCount++;
        sameMessageCount = 0;
        const newP = document.createElement("p");
        newP.textContent = message;
        lastMessage = message;
        lastPAdded = newP;
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
        newP.style.filter = "blur(5px)";
        setTimeout(_ => newP.style.filter = "blur(0px)", 10);
    }
}

export default notify;