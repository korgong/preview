/**
 * @param {string} s
 * @return {string}
 */
var reverseVowels = function(s) {
    // todo deal with empty string
    if (s.length <= 1) {
        return s;
    }
    // change string into array
    let arr = s.split('');
    let n = arr.length;
    let i = 0;
    let j = n - 1;
    let beginFlag = false;
    let endFlag = false;
    let temp;
    // create two points to the start and end
    // move the point until start meet the end
    while (i < j) {
        let begin = arr[i];
        let end = arr[j];
        // if we find the target element, stop move temporarily
        // todo check
        while (i < n && !['a','e','i','o','u', 'A','E','I','O','U'].includes(begin)) {
            i++;
        }
        while (j > 0 && !['a','e','i','o','u', 'A','E','I','O','U'].includes(end)) {
            j--;
        }
        // if we find two targets together, swap the target,
        // and begin to move again
        if (i < j) {
            temp = arr[j];
            arr[j] = arr[i];
            arr[i] = temp;
        }
    }
    // revert array to string
    return arr.join('');
};
let result = reverseVowels("hello");
console.log(result);