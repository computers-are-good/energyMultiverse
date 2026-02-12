let allowBGClose = true;
const overlay = document.getElementById("overlay");
const overlayBG = document.getElementById("overlayBG");

function showOverlay(askingForConfirmation) {
    // If the overlay is asking a yes or no question, we cannot let the user click the background and close it
    // Instead, we wait for explicit confirmation from the user whether to close the background.
    if (askingForConfirmation) {
        allowBGClose = false;
    } else {
        allowBGClose = true;
    }
    overlay.style.display = "block";
    overlayBG.style.display = "block";
    overlay.innerHTML = "";
    overlay.style.opacity = 0;
    overlayBG.style.backdropFilter = "blur(0px)";
    setTimeout(_ => overlay.style.opacity = 1, 10);
    setTimeout(_ => overlayBG.style.backdropFilter = "blur(10px)", 10);
}

// clickedFromBG is set to true when the overlay is hidden because the user clicked outside the overlay.
// This cannot close the overlay when the overlay is asking for a confirmation.
function hideOverlay(clickedFromBG) {
    if (clickedFromBG && !allowBGClose) return;
    overlay.style.opacity = 0;
    overlayBG.style.backdropFilter = "blur(0px)"
    setTimeout(_ => {
        document.getElementById("overlayBG").style.display = "none";
        document.getElementById("overlay").style.display = "none";
    }, 300);
}

function appendCloseButton(callThisWhenClosed) {
    // Close the overlay, because Esc or the "close" button is pressed
    function handleClose() {
        hideOverlay();
        if (callThisWhenClosed) callThisWhenClosed();
    }
    function handleKeyDown(e) {
        if (e.key === "Escape") {
            handleClose();
            document.body.removeEventListener("keyup", handleKeyDown);
        }
    }
    const close = document.createElement("button");
    close.textContent = "close";
    document.getElementById("overlay").appendChild(close);
    close.addEventListener("click", handleClose);
    close.style.position = "relative";
    close.style.top = "10px";
    document.body.addEventListener("keyup", handleKeyDown)
}

function setOverlayTitle(title) {
    const heading = document.createElement("h2");
    heading.textContent = title;
    document.getElementById("overlay").appendChild(heading);
    heading.style.textAlign = "center";
}

export {
    showOverlay,
    hideOverlay,
    appendCloseButton,
    setOverlayTitle
}