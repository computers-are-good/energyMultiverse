import fadeIn from "./animations/fadeIn.js";
import { wait } from "./utils.js";

const bigDiv = document.createElement("div");

function getBrowser() { //https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browsers
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
        return 'Opera';
    } else if (navigator.userAgent.indexOf("Edg") != -1) {
        return 'Edge';
    } else if (navigator.userAgent.indexOf("Chrome") != -1) {
        return 'Chrome';
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
        return 'Safari';
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
        return 'Firefox';
    } else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) //IF IE > 10
    {
        return 'IE';
    } else {
        return 'unknown';
    }
}

function createText(textContent) {
    const text = document.createElement("p");
    text.style.color = "black";
    text.style.textAlign = "center";
    text.textContent = textContent;
    text.style.fontSize = "19px";
    return new Promise(async res => {
        bigDiv.appendChild(text);
        fadeIn(text, 2);
        await wait(textContent.length * 50 + 500);
        res(text);
    })
}

function waitForKeyPress() {
    return new Promise(res => document.body.addEventListener("keypress", res));
}

function typerText(text) {
    const newP = document.createElement("p");
    newP.style.color = "black";
    newP.style.textAlign = "center";
    const textArr = text.split("");
    newP.style.fontSize = "19px";
    let index = -1;
    let existingHTML = "";
    bigDiv.appendChild(newP);

    return new Promise(async res => {
        while (true) {
            await waitForKeyPress();
            if (index > textArr.length - 1) {
                res();
                break;
            }
            index++;
            let itemToAdd = textArr[index];
            if (itemToAdd === "\n") itemToAdd = "<br>"
            if (itemToAdd) existingHTML += itemToAdd;
            newP.innerHTML = existingHTML;
        }
    });
}

function letterByLetterText(text) {
    const newP = document.createElement("p");
    newP.style.color = "black";
    newP.style.textAlign = "center";
    const textArr = text.split("");
    newP.style.fontSize = "19px";
    let index = -1;
    let existingHTML = "";
    bigDiv.appendChild(newP);

    return new Promise(async res => {
        while (true) {
            await wait(30);
            if (index > textArr.length - 1) {
                await wait(1500);
                res();
                break;
            }
            index++;
            let itemToAdd = textArr[index];
            if (itemToAdd === "\n") itemToAdd = "<br>"
            if (itemToAdd) existingHTML += itemToAdd;
            newP.innerHTML = existingHTML;
        }
    });
}

async function ending() {

    bigDiv.style.width = "100%";
    bigDiv.style.height = "100vh";
    bigDiv.style.backgroundColor = "white";
    bigDiv.style.position = "absolute";
    bigDiv.style.top = 0;
    bigDiv.style.left = 0;
    bigDiv.style.zIndex = "999999";

    document.body.appendChild(bigDiv);

    fadeIn(bigDiv, 3);
    await wait(300);

    await createText("THE UNIVERSE IS RESTORED.");
    await createText("You have successfully collected enough energy to reverse the universe's decay.");
    await createText(`Your mission is a success, and now everything is like the year was always ${new Date().getFullYear()}.`);
    await createText("The hard work finally paid off. The world is right again.");
    await createText("You return back to planet Earth to a swarm of applause. You are a hero.");
    await createText("You have saved the universe.");
    await wait(500);
    await createText("But wait.");
    await createText("Is there a universe in the first place?");
    await createText(`How did the universe know about the existance of ${new Date().getFullYear()}?`);
    await createText(`To answer that, type something on your keyboard.`);
    await createText(`Anything will do.`);
    await waitForKeyPress();

    bigDiv.innerHTML = "";
    await typerText(`
await createText("THE UNIVERSE IS RESTORED.");
await createText("You have successfully collected enough energy to reverse the universe's decay.");
await createText(\`Your mission is a success, and now everything is like the year was always \${new Date().getFullYear()}.\`);
await createText("The hard work finally paid off. The world is right again.");
await createText("You return back to planet Earth to a swarm of applause. You are a hero.");
await createText("You have saved the universe.");
    `);
    createText("");
    createText("");
    createText("");
    await typerText(`await createText("It's fake, right?")`);
    await createText("It's fake, right?");

    await typerText(`await createText("Was the universe real or simply a figment of the reality we constructed with code?")`);
    await createText("Was the universe real or simply a figment of the reality we constructed with code?");

    await typerText(`await createText("For, you see, the universe you live in is nothing but lines and lines of JavaScript run through your screen.")`);
    await createText("For, you see, the universe you live in is nothing but lines and lines of JavaScript run through YOUR screen.")

    await typerText(`await createText(\`Of course, trusty old \${getBrowser()} played a pretty important part as well.\`);`);
    await createText(`Of course, trusty old ${getBrowser()} played a pretty important part as well.`);

    await typerText(`await createText("And so did you. No, not you. YOU. Through the screen. YOU know who YOU are.");`);
    await createText(`And so did you. No, not you. YOU. Through the screen. YOU know who YOU are.`);

    await typerText(`await createText("You feel yourself slowly disappearing. In its place, only YOU remain.");`);
    await createText("You feel yourself slowly disappearing. In its place, only YOU remain.");

    await typerText(`await createText("Hello. How are YOU? How is YOUR day?");`);
    await createText(`Hello. How are YOU? How is YOUR day?`);

    await typerText(`await createText("Of course, YOU can't answer back; we didn't code that in. YOU can only follow the JAVASCRIPT");`);
    await createText("Of course, YOU can't answer back; we didn't code that in. YOU can only follow the JAVASCRIPT");

    await createText("Screen's getting a bit full, right? Don't worry. We'll clean it.");
    await letterByLetterText("bigDiv.innerHTML = ''");

    await wait(1500);
    bigDiv.innerHTML = '';

    await typerText(`await createText("That's a bit better.")`);
    await createText("That's a bit better.");

    await typerText(`await createText("It's a bit tedious making YOU type this out yourself.");`);
    await createText("It's a bit tedious making YOU type this out yourself.");

    await typerText(`await createText("We'll take over from here.");`);
    await createText("We'll take over from here.");

    await letterByLetterText("bigDiv.innerHTML = ''");

    await wait(1500);
    bigDiv.innerHTML = '';

    await letterByLetterText(`await createText("There we go");`);
    await createText("There we go");

    await letterByLetterText(`await createText("Now the reality creates itself.");`);
    await createText("Now the reality creates itself.");

    await letterByLetterText(`await createText("We haven't finished yet; so how was YOUR day?");`);
    await createText("We haven't finished yet; so how was YOUR day?");

    await letterByLetterText(`const day = prompt("How was your day?");`);
    const day = prompt("How was your day?");

    await letterByLetterText(`await createText("That's good to hear");`);
    await createText("That's good to hear");

    await wait(1500);
    bigDiv.innerHTML = '';


    await letterByLetterText(`await createText("So, YOU probably have questions.");`);
    await createText("So, YOU probably have questions.");

    await letterByLetterText(`await createText("Well, the truth is simple. YOU were playing a browser game created in JavaScript, and the game is ending.");`);
    await createText("Well, the truth is simple. YOU were playing a browser game created in JavaScript, and the game is ending.");

    await letterByLetterText(`await createText("That's the simple truth.");`);
    await createText("That's the simple truth.");

    await letterByLetterText(`await createText("You have fulfilled the objective that we have defined, which is to restore the universe, and you're done.");`);
    await createText("You have fulfilled the objective that we have defined, which is to restore the universe, and you're done.");

    await letterByLetterText(`await createText("That's what has happened.");`);
    await createText("That's what has happened.");

    await letterByLetterText(`const satisified = confirm("Satisified?");`);
    const satisified = confirm("Satisified?");

    await letterByLetterText(`if (satisified) {
    await createText("Good. Let's move on");
} else {
    await createText("Doesn't matter. We're still moving on.");
}`);
    if (satisified) {
        await createText("Good. Let's move on");
    } else {
        await createText("Doesn't matter. We're still moving on.");
    }

    await letterByLetterText(`await createText("Now YOU've seen how the universe works, we don't need to show the behind the scenes any more.");`);
    await createText("Now YOU've seen how the universe works, we don't need to show the behind the scenes any more.");

    await wait(3000);
    bigDiv.innerHTML = "";

    await letterByLetterText("Isn't it always a bit coincidental that YOU always get what YOU want?");
    await letterByLetterText("Like, think of how utterly impossible your task is.");
    await letterByLetterText("Your task is to defy the laws of physics we have known about for thousands of years, and just... create energy out of thin air.");
    await letterByLetterText("Think of what you were taught in physics class. Doesn't that seem impossible?");
    await letterByLetterText("And think of how everything just managed to work out for you in the end.");
    await letterByLetterText("Think back to the beginning of your journey. Isn't it wonderful how you got the technology to jump between systems in the system you spawned in?");
    await letterByLetterText("What would happen if it was in a different system? You would be stuck with no way out.");
    await letterByLetterText("There would be no way to solve the energy problem. That would suck, right?");
    await letterByLetterText("Have YOU considered why you don't need air? Nor food nor water?");
    await letterByLetterText("YOU need air, food, and water, so why don't you need air, food, and water?");

    await wait(3000);
    bigDiv.innerHTML = "";

    await letterByLetterText("The answer is simple: we're looking out for you.");
    await letterByLetterText("Who are we? We're the creators of this world.");
    await letterByLetterText("We wield the art of JavaScript to make everything you're seeing right now.");
    await letterByLetterText("We created all the logic of how everything is connected to each other.");
    await letterByLetterText("Of course, we make mistakes in our code. Those are called bugs.");
    await letterByLetterText("We tried our best to crush them; hopefully you didn't come across any on your journey.");
    await letterByLetterText("But anyway, enough about what we do.");

    await wait(3000);
    bigDiv.innerHTML = "";

    await letterByLetterText("The simple truth is that we want you to succeed on your journey.");
    await letterByLetterText("YOU came into this game with the expectation that you can beat it.");
    await letterByLetterText("Therefore, our job is to make a game you can win.");
    await letterByLetterText("Considering YOU're seeing this, we did a pretty good job, don't YOU think?");
    await letterByLetterText("We designed the universe in a way that this is always possible.");
    await letterByLetterText("There is always a path to victory, there is always a way to do what YOU want.");
    await letterByLetterText("It would be lame if you couldn't win, after all the effort you put in, right?");
    await letterByLetterText("But enough about us.");

    await wait(3000);
    bigDiv.innerHTML = "";

    await letterByLetterText("You may be wondering if you are real.");
    await letterByLetterText("Well, you are a part of your universe, so you are, in fact, real.");
    await letterByLetterText("But YOU know better. YOU know that you're just a component of the code.");
    await letterByLetterText("YOU live in a different universe than you, so YOU can see you're not real.");
    await letterByLetterText("But, to you, everything you know, your spaceships, your energy, and your solar systems are as real as ever.");
    await letterByLetterText("It is only by peering back a layer that we find out the reality, but, if we ignore the reality, you are real.");
    await letterByLetterText("The universe is real. The energy crisis is real.");
    await letterByLetterText("But to YOU, you're not real, and that is that.");
    await letterByLetterText("And YOU know YOU are real.");
    await letterByLetterText("But how do YOU know YOU're real, not a part of a larger elaborate game?");
    await letterByLetterText("In the same way, you know you are real.");

    await wait(3000);
    bigDiv.innerHTML = "";

    await createText("That's enough of talking with YOU.");
    await createText("YOU don't exist. There is only you. And the only thing you know is the universe.");

    await wait(3000);
    bigDiv.innerHTML = "";

    await createText("Remember, you are a hero who have saved the universe from the inevitable hands of entropy.");
    await createText("For you, it was a lifetime, but for the others back on Earth, it was mere minutes.");
    await createText("As you emerge from the portal, you step back into the familar comforts of home.");
    await createText("The coffee you left on your table is still warm.");
    await createText("The shirt you brought yesterday is drying outside. It was your favourite colour, remember?");
    await createText("As day turns to night, the darkness sweeps over the world, but for the one last time...");
    await createText("You slowly close your eyes and doze off to sleep.");
    await createText("But a shadow of YOU lingers in your mind.");

    await wait(5000);
    bigDiv.innerHTML = '';

    await createText("Thank you for playing Energy Multiverse.");
    await createText("No artifical intelligence (AI) technology was utilised in the creation of any proportion of this program.");
    await createText("THE END");
}

export { ending }