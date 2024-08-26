// export
// named export
// math.js
export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}

// default export
// calculator.js
export default function multiply(a, b) {
    return a * b;
}




// import
// import named export
// main.js
import { add, subtract } from './math.js';
console.log(add(2, 3));


// import default export
import multiply from './calculator.js';
console.log(multiply(2, 3));


// import all named export
import * as math from './math.js';
console.log(math.add(2, 3));