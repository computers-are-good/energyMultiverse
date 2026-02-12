function choice(arr) {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

const getDistance = (x1, y1, x2, y2) => Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);

function deepClone(input) {
    if (Array.isArray(input)) {
        let output = [];
        for (let item in input) {
            if (typeof input[item] !== "object") {
                output.push(input[item]);
            } else {
                if (Object.keys(input[item]).length > 0) {
                    output[item] = deepClone(input[item]);
                }
            }
        }
        return output
    } else {
        let output = {}
        for (let item in input) {
            if (typeof input[item] !== 'object') {
                output[item] = input[item]
            } else {
                if (Object.keys(input[item]).length > 0) {
                    output[item] = deepClone(input[item])
                } else {
                    output[item] = input[item]
                }
            }
        }
        return output
    }

}

function wait(ms) {
    return new Promise(res => setTimeout(res, ms));
}

function removeFromArray(array, element) {
    array.splice(array.indexOf(element), 1);
}

//https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
function getTextWidth(text, font) {
    // re-use canvas object for better performance
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}

function getCssStyle(element, prop) {
    return window.getComputedStyle(element, null).getPropertyValue(prop);
}

function getCanvasFont(el = document.body) {
    const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
    const fontSize = getCssStyle(el, 'font-size') || '16px';
    const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';

    return `${fontWeight} ${fontSize} ${fontFamily}`;
}

function textWidth(text, e) {
    // Gets the text width if text was drawn on an element e
    return getTextWidth(text, getCanvasFont(e));
}

function formatPlaytime(seconds) {
    let hours = (seconds - (seconds % 3600)) / 3600;
    seconds -= hours * 3600;
    let minutes = (seconds - (seconds % 60)) / 60;
    seconds -= minutes * 60;
    return `${hours}H ${minutes}M ${seconds}s`
}

export {
    choice,
    formatPlaytime,
    deepClone,
    wait,
    removeFromArray,
    textWidth
}