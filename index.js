// var s = 'bbb';
let s = "pwwkew";

let findMaxLength = (str) => {

    let maxLengthArr = [];
    let maxNum = 0;
    for (let i=0;i<str.length;i++) {
        let keyValueObj = {};
        for (let j=i;j<str.length;j++) {
            if (!keyValueObj[str[j]]) {
                keyValueObj[str[j]] = true;
                if (j===str.length-1) {
                    maxLengthArr.push(Object.keys(keyValueObj).length);
                }
            } else {
                maxLengthArr.push(Object.keys(keyValueObj).length);
                break;
            }
        }
    }

    for (let k=0;k<maxLengthArr.length;k++) {
        if (maxLengthArr[k] > maxNum) {
            maxNum = maxLengthArr[k];
        }
    }
    return maxNum;
};


console.log('findMaxLength(s)', findMaxLength(s));

