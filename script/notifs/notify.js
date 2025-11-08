import fadeIn from "../animations/fadeIn.js";
import letterByLetter from "../animations/letterByLetter.js";

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

        //Update visibility of all previous divs
        notificationsDiv.childNodes.forEach((e, i) => {
            e.style.opacity = 1 - i * 0.1;
        });

        fadeIn(newP, 0.5);
        letterByLetter(newP, 25);
    }
}
function resetMessageCount() {
    messageCount = 0;
}
export {notify, resetMessageCount};