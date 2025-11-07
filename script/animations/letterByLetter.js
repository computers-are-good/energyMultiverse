import { textWidth, wait } from "../utils.js";

async function letterByLetter(targetDiv, timeToWait) {
    //This function returns a promise that resolves when the animation is done.
    return new Promise(async res => {
        const targetDivWidth = targetDiv.getBoundingClientRect().width;
        const targetDivText = targetDiv.textContent.split(" ");
        let widthUsed = 0;

        targetDiv.textContent = "";
        for (let i = 0; i < targetDivText.length; i++) {
            if (widthUsed > targetDivWidth) {
                targetDiv.innerHTML += "<br>";
                widthUsed = 0;
            }
            for (let j = 0; j < targetDivText[i].length; j++) {
                targetDiv.innerHTML += targetDivText[i][j];
                await wait(timeToWait);
            }
            targetDiv.innerHTML += " ";
            widthUsed += textWidth(`${targetDivText[i]}  `, targetDiv);
        }
        res();
    });
}
export default letterByLetter