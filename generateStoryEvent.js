//Read in the story from story.md and generate key: value pairs we can put into the event engine
const fs = require("fs");

const storyFile = fs.readFileSync("./story.md", "UTF-8");
const chapters = storyFile.split("##");

chapters.splice(0, 1); //Remove the disclaimers
const outputString = "";

for (const chapter of chapters) {
    lines = chapter.split("\r\n");
    const storyTitle = lines.splice(0, 1)[0].trim();
    let individualChapter =
        `${storyTitle}: {
    script: [
`
    lines.forEach(e => {
        if (e)
        individualChapter +=
`       {
            text: "${e.replaceAll("\"", "\\\"")}",
        },
`
    })
    individualChapter +=
        `   ]
},`;

    console.log(individualChapter);
}