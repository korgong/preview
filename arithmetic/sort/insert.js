//  [ 17, 24, 31, 45, 50, 63, 85, 96 ]
// 方法1
// let arr = [85, 24, 63, 45, 17, 31, 96, 50];
// let newArr = [];
// function insert(arr) {
//     for (let i=0;i<arr.length;i++) {
//         let currentV = arr[i];
//         let isInsert = false;
//         for (let j =0;j<newArr.length;j++) {
//             if (currentV < newArr[j]) {
//                 isInsert = true;
//                 newArr.splice(j, 0, currentV);
//                 break;
//             }
//
//         }
//         if (!isInsert) {
//             newArr.push(currentV);
//         }
//     }
//     return newArr;
// }
//
// console.log(insert(arr));


// 方法2
// let arr = [85, 24, 63, 45, 17, 31, 96, 50];
// let newArr = [];
// function insert(arr) {
//     if (arr.length === 0) {
//         return
//     }
//     let currentV = arr.shift();
//     let isInsert = false;
//     for (let j =0;j<newArr.length;j++) {
//         if (currentV < newArr[j]) {
//             isInsert = true;
//             newArr.splice(j, 0, currentV);
//             break;
//         }
//
//     }
//     if (!isInsert) {
//         newArr.push(currentV);
//     }
//     insert(arr);
//     return newArr;
// }
//
// console.log(insert(arr));


// 方法3
// let arr = [85, 24, 63, 45, 17, 31, 96, 50];
// let newArr = [];
//
// function insertToArr(val, i, obj) {
//     let currentV = newArr[i];
//     if (val < currentV) {
//         newArr.splice(i, 0, val);
//         obj.isInsert = true;
//     } else {
//         i++;
//         insert(val, newArr, i);
//     }
//
// }
//
// function insert(arr) {
//     if (arr.length === 0) {
//         return
//     }
//     let currentV = arr.shift();
//     let i = 0;
//     let obj = {isInsert: false};
//     insertToArr(currentV, i, obj);
//     if (!obj.isInsert) {
//         newArr.push(currentV);
//     }
//     insert(arr);
//     return newArr;
// }
//
// console.log(insert(arr));

// 方法4
// only one arr
//  [ 17, 24, 31, 45, 50, 63, 85, 96 ]
// let arr = [85, 24, 63, 45, 17, 31, 96, 50];
//
// function insert(arr) {
//     for (let i = 0; i < arr.length; i++) {
//         let currentV = arr.splice(i, 1)[0];
//         let isInsert = false;
//         for (let j = i - 1; j > -1; j--) {
//             if (currentV > arr[j]) {
//                 arr.splice(j + 1, 0, currentV);
//                 isInsert = true;
//                 break;
//             }
//         }
//         if (!isInsert) {
//             arr.splice(0, 0, currentV);
//         }
//     }
//     return arr;
// }
//
// console.log(insert(arr));


// 方法5
//  [ 17, 24, 31, 45, 50, 63, 85, 96 ]
// only one arr
//   ①②④③
//   ①
//   ①②
//   ①②④
//   ①② ④
//   ①②③④

let arr = [85, 24, 63, 45, 17, 31, 96, 50];

function insert(myArr) {
    for (let i = 0; i < arr.length; i++) {
        // 记录取出元素的值value
        let value = myArr[i];
        let j;
        // 将value和当前元素比较，如果value小于当前元素，当前元素后移一位。当前元素的下标-1
        for (j = i - 1; j > -1 && myArr[j] > value; j--) {
            myArr[j + 1] = myArr[j];
        }
        // 如果valve大于等于当前元素。当前元素的下一位就是valve。
        // 如果value小于所有元素，当前下标为-1，那么下一位就是value
        myArr[j + 1] = value;

    }
    return myArr;
}
