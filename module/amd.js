// amd for browser
// math.js
define([], function () {
    return {
        add: function (a, b) {
            return a + b;
        }
    }
})

// main.js
define(['./math'], function (math) {
    console.log(math.add(2, 3));
})