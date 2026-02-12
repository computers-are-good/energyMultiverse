import { hideOverlay, showOverlay } from "./overlay.js";

// Displays a message and ask for a "yes" or "no" confirmation.
// Returns a promise that resolves true if user clicks "yes", and false if user clicks "no".
// if justDisplayMsg is set to true, an "ok" button will be displayed instead.
function overlayConfirm(msg) {
    return new Promise((res) => {
        showOverlay(true);
        const overlay = document.getElementById("overlay");
        const h2 = document.createElement("h2");
        overlay.classList.add("overlaySmall");
        h2.style.textAlign = "center";
        h2.textContent = "Confirmation";
        overlay.appendChild(h2);
        const confirmationP = document.createElement("p");
        confirmationP.textContent = msg;
        overlay.appendChild(confirmationP);
        
        const confirmationButtonsDiv = document.createElement("div");
        confirmationButtonsDiv.classList.add("flexCenter");
        confirmationButtonsDiv.style.width = "40%";
        confirmationButtonsDiv.style.margin = "auto";
        const yesButton = document.createElement("button");
        yesButton.textContent = "Yes";
        confirmationButtonsDiv.appendChild(yesButton);
        
        const noButton = document.createElement("button");
        noButton.textContent = "No";
        confirmationButtonsDiv.appendChild(noButton);

        yesButton.addEventListener("click", _ => {
            hideOverlay();
            setTimeout(_ => overlay.classList.remove("overlaySmall"), 300);
            res(true);
        });

        noButton.addEventListener("click", _ => {
            hideOverlay();
            setTimeout(_ => overlay.classList.remove("overlaySmall"), 300);
            res(false);
        });
        
        overlay.appendChild(confirmationButtonsDiv);
    });
}
export default overlayConfirm

