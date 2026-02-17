import { textWidth, wait } from "../utils.js";

async function letterByLetter(targetDiv, timeToWait) {
    //This function returns a promise that resolves when the animation is done.
    // What was I doing back here
    return new Promise(async res => {
        const targetDivWidth = targetDiv.getBoundingClientRect().width;
        const targetDivText = targetDiv.textContent.split(" ");
        targetDiv.classList.add("letterByLetterText");
        const fontSize = 8;
        let widthUsed = 0;

        targetDiv.textContent = "";
        for (let i = 0; i < targetDivText.length; i++) {
            let widthOfWord = targetDivText[i].length * fontSize;
        }

        for (let i = 0; i < targetDivText.length; i++) {
            targetDiv.innerHTML += " "; // Technically this adds a space BEFORE every word...
            widthUsed += targetDivText[i].length * fontSize;
            if (i > 0) widthUsed += fontSize;// But we don't need a space before the first word, and it doens't render in HTML, so only account for the space after the first word.
            if (i + 1 < targetDivText.length && widthUsed >= targetDivWidth) {
                targetDiv.innerHTML += "<br>";
                widthUsed = targetDivText[i].length * fontSize;
            }
            for (let j = 0; j < targetDivText[i].length; j++) {
                targetDiv.innerHTML += targetDivText[i][j];
                await wait(25);
            }
        }
        res();
    });
}
export default letterByLetter