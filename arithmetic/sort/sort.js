let arr = [85, 24, 63, 45, 17, 31, 96, 50];
// let afterSort = arr.sort();
let afterSort = arr.sort(function (a, b) {
    if (a < b) {
        return false;

    } else if (a === b) {
        return 0;

    } else if (a > b) {
        return true;

    }
});
console.log(afterSort);  //  [ 17, 24, 31, 45, 50, 63, 85, 96 ]
