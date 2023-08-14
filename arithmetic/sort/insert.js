let arr = [85, 24, 63, 45, 17, 31, 96, 50];

function insert(arr) {
    for (let i = 1; i < arr.length; i++) {
        let tobeInserted = arr[i];
        let j;
        for (j = i - 1; j >= 0; j--) {
            let current = arr[j];
            if (tobeInserted >= current) {
                break;
            } else {
                // copy current to next position
                // index--;
                arr[j + 1] = current;
            }
        }
        arr[j + 1] = tobeInserted;
    }
    return arr;
}
