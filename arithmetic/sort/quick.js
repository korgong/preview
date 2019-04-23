let arr = [85, 24, 63, 45, 17, 31, 96, 50];
let quick = function (arr) {
    if (arr.length < 2) {
        return arr;
    }
    let arrLeft = [];
    let arrRight = [];
    let pivotIndex = Math.floor(arr.length / 2);
    let pivot = arr.splice(pivotIndex, 1)[0];
    for (let i = 0; i < arr.length; i++) {
        let currVal = arr[i];
        currVal < pivot ? arrLeft.push(currVal) : arrRight.push(currVal);
    }
    return quick(arrLeft).concat([pivot], quick(arrRight));
};
let result = quick(arr);
console.log(result);
