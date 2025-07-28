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

export { choice, deepClone, wait, removeFromArray }