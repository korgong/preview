function compose(...functions) {
    return functions.reduce((a, b) => (...args) => a(b(args)));
}

function double(a) {
    console.log('first double');
    return Math.pow(a, 2);
}

function three(a) {
    console.log('second three');
    return Math.pow(a, 3);
}

let result = compose(double, three)(3);  // 3=> 81*9 = 729
console.log('result', result);
