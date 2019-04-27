let arr = [85, 24, 63, 45, 17, 31, 96, 50];
function swap(arr, index1, index2) {
    let temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
}
function bubble(arr) {
    let newArr = JSON.parse(JSON.stringify(arr));
    for (let i=newArr.length;i> 1;i--) {
        for (let j=0;j<i;j++) {
            // compare currentValue and nextValue
            // currentValue > nextValue then swap
            let currentValue = newArr[j];
            let nextValue = newArr[j + 1];
            if (currentValue > nextValue) {
                swap(newArr, j, j + 1);
            }
        }
    }
    return newArr;
}

//  [ 17, 24, 31, 45, 50, 63, 85, 96 ]
console.log(bubble(arr));
