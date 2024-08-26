// umd for node.js and browser
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // CommonJS
        module.exports = factory();
    } else {
        // Global (browser)
        root.math = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    // Module code
    return {
        add: function(a, b) {
            return a + b;
        }
    };
}));

// Usage in CommonJS environment
const math = require('./math');
console.log(math.add(2, 3)); // Outputs: 5

// Usage in AMD environment
define(['./math'], function(math) {
    console.log(math.add(2, 3)); // Outputs: 5
});

// Usage in the global scope
console.log(math.add(2, 3)); // Outputs: 5
