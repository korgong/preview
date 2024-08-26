// cmd for node.js
// you can export multiple functions as an object
// math.js
function add(a, b) {
    return a + b;
}

module.exports = add;
// exports = add;   work too



// main.js
const add = require('./math');
console.log(add(2, 3));