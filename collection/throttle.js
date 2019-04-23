// throttle 节流
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


// debounce 防抖
function debounce(method, delay, mustRunTime) {
    let timer = null;
    let startTime = null;
    return function () {
        let that = this;
        let args = arguments;
        let currentTime = new Date().getTime();
        clearTimeout(timer);
        if (!startTime) {
            startTime = currentTime;
        } else if (currentTime - startTime >= mustRunTime) {
            method.apply(that, args);
            startTime = currentTime;
        } else {
            timer = setTimeout(function () {
                method.apply(that, args);
            }, delay)
        }
    }
}

// 第一次和第二次小于最小执行时间，都被clear。但是初始时间一直被记录。
// 第三次大于最小间隔，执行。第四次小于最小间隔。但是没有新的执行动作。40ms后就会执行。
let fn = debounce(method, 50, 30);
fn(1)
setTimeout(function () {
    fn(2);
}, 20);
setTimeout(function () {
    fn(3);
}, 30);
setTimeout(function () {
    fn(4);
}, 40);
