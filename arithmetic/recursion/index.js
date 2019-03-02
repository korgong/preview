obj = [{
    a: {
        b: 3
    },
    c: [1, 2, 3]
}, 2];

function deepCopy(obj) {
    let parentObj = Object.prototype.toString.call(obj) === '[object Object]' ? {} : [];
    // 添加子元素。子元素判断，如果是数组或者对象就递归
    for (let attr in obj) {
        let child = obj[attr];
        let type = Object.prototype.toString.call(child);
        if (type === '[object Object]') {
            parentObj[attr] = deepCopy(obj[attr]);
        } else if (type === '[object Array]') {
            parentObj[attr] = deepCopy(obj[attr]);
        } else {
            // number boolean string...
            parentObj[attr] = obj[attr];
        }
    }
    return parentObj;
}


let newObj = deepCopy(obj);

console.log(newObj);
