function swapUseTemp(a, b) {
    let temp = a;
    a = b;
    b = temp;
    console.log(a, b);
}
function swapUseJs(a, b) {
    b = [a, a = b][0];
    console.log(a, b);
}

// c实现，适用于数字类型的交换，上面两种适用于任何类型
// 注意这里的=不是数学意义上的，而是赋值操作。
function swapUseC(a, b) {
    a = a + b;
    b = a - b;
    a = a - b;
    console.log(a, b);
}

swapUseJs(3, 6);
