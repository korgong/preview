// 使用方法存储id
// function throttle(method, context) {
//     clearInterval(method.timeout);
//     method.timeout = setTimeout(function () {
//         method.call(context);
//     }, 300);
// }
//
// let method = function () {
//     console.log('hello, world');
// };
//
// window.onresize = function () {
//     throttle(method);
// };

// 使用闭包存储id
let method = function () {
    console.log(arguments);
};
function throttle(method, delay) {
    let timeout = null;
    return function (arg) {
        let context = this;
        let args = arguments;
        clearInterval(timeout);
        timeout = setTimeout(function () {
            method.apply(context, args);
        }, delay)
    }
}

// window.onresize = throttle(method);


// 顺序执行三次，只有最后一次会调用
// let fn = throttle(method);
// fn(1);
// fn(2);
// fn(3);

