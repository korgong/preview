function swapUseTemp(a, b) {
    let temp = a;
    a = b;
    b = temp;
    console.log(a, b);
}
function swapUseJs(a, b) {
    b = [a, a = b][0];
    debugger
    console.log(a, b);
}

function swapUseC(a, b) {
    a = a + b;
    b = a - b;
    a = a - b;
    console.log(a, b);
}

swapUseJs(3, 6);