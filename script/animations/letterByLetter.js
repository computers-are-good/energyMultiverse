import { wait } from "../utils.js";

async function letterByLetter(targetDiv, timeToWait) {
    //This function returns a promise that resolves when the animation is done.
    return new Promise(async res => {
        const targetDivText = targetDiv.textContent;
        targetDiv.textContent = "";
        for (let i = 0; i < targetDivText.length; i++) {
            targetDiv.textContent += targetDivText[i];
            await wait(timeToWait);
        }
        res();
    });
}
export default letterByLetter