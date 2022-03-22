// let sourceArr = [47, 29, 71, 99, 7, 19, 24, 4];
// function concurrentControl (dataList, limit, asyncHandle) {
//     let recursion = (arr) => {
//         if (arr.length === 0) {
//             return 'finished';
//         }
//         return asyncHandle(arr.shift()).then(() => {
//             return recursion(arr);
//         });
//     };
//     let promiseArr = [];
//     let copyDataList = [...dataList];
//     while (limit--) {
//         promiseArr.push(recursion(copyDataList));
//     }
//     return Promise.all(promiseArr);
// }
//
// let data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// let count = 0;
// let handler = (number) => {
//     return new Promise((resolve, reject) => {
//         count++;
//         setTimeout(() => {
//             console.log('并发count', count--);
//             if (number === 4) {
//                 console.log(`fetch ${number} fail`);
//                 reject('error fetch')
//             } else {
//                 console.log(`fetch ${number} done`);
//                 resolve();
//             }
//         }, Math.random() * 1000);
//     });
// };
// let result = concurrentControl(data, 3, handler)
// console.log('result', result);
// result.then(res=> console.log('res', res))
// 实现taskSum(1000,()=>{console.log(1)}).task(1200,()=>{console.log(2)}).task(1300,()=>{console.log(3)})，
// 这里等待1s，打印1，之后等待1.2s，打印2，之后打印1.3s，打印3
// function taskSum(wait, func) {
//     setTimeout(func, wait);
//     return {
//         task: function (wait2, func2) {
//             return taskSum(wait + wait2, func2);
//         }
//     }
// }
// taskSum(1000,()=>{console.log(1)}).task(1200,()=>{console.log(2)}).task(1300,()=>{console.log(3)})
// function sum(a) {
//     return function (b) {
//         if (b===undefined) {
//             return a;
//         }
//         return sum(a+b);
//     }
// }
//
// console.log('result', sum(1)(2)(3)());
// function sum(...args) {
//     return function (){
//         if (arguments[0]===undefined) {
//             return args.reduce((result, next) => {
//                 return result + next;
//             }, 0);
//         }
//         return sum(...args, ...arguments);
//     };
// }
// console.log('result', sum(1)(2, 3)(4)());
// let templateStr = 'i am {{name.value.inner}},age {{age}},job {{job}} ';
// let data = {
//     name:{value: { inner: 'kor'}},
//     age:18,
//     job:'CTO'
// }
// function templateFunc(str, data) {
//     let computed = str.replace(/\{\{(.*?)\}\}/g, function (_match, key) {
//         let keyArr = key.split('.');
//         let result = keyArr.reduce((result, nextKey) => {
//             return result[nextKey];
//         }, data);
//         return result;
//     });
//     return computed;
// }
// console.log('result', templateFunc(templateStr, data));
// 1, 3, 5, 7
// n >= 0
// function accumulation(n) {
//     if (n===0) {
//         return 1;
//     }
//     return 2*n + 1 + accumulation(n - 1);
// }
//
// console.log('result', accumulation(2));
// 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233……
// f(n) = f(n-1) + f(n-2)
// function fibonacci (n) {
//     if (n===0) {
//         return 0;
//     }
//     if (n === 1) {
//         return 1;
//     }
//     return fibonacci(n - 1) + fibonacci(n - 2);
// }
//
// fibonacci(4);
// let tree = {
//     val: 1,
//     left: {val: 2,left: {val: 4,left: null, right: null}, right: {val: 5,left: null, right: null}},
//     right: {val: 3,left: null, right: null}
// }
// function maxDepth(root) {
//     if (root === null) {
//         return 0;
//     }
//     let leftDepth = maxDepth(root.left);
//     let rightDepth = maxDepth(root.right);
//     let maxDepthResult = Math.max(leftDepth, rightDepth);
//     return 1 + maxDepthResult;
// }
// let result = maxDepth(tree);
// console.log('result', result);
// let dom2Json = (dom) => {
//     let singleDom2Json = (singleDom) => {
//         let json = {
//             jsonId: Math.random(),
//             nodeType: singleDom.nodeType, // 1 node 3 text
//             nodeValue: singleDom.nodeValue, // null || text
//             tagName: singleDom.tagName ? singleDom.tagName.toLowerCase(): undefined,  // text -> undefined
//             attrs: {},
//             children: []
//         }
//         if (singleDom.attributes) {
//             for (let i=0;i<singleDom.attributes.length;i++) {
//                 let attrName = singleDom.attributes[i].nodeName;
//                 let attrValue = singleDom.attributes[i].nodeValue;
//                 json.attrs[attrName] = attrValue;
//             }
//         }
//         return json;
//     };
//     let traverseChildNode = (rootChildren, childNodes) => {
//         for (let i=0;i<childNodes.length;i++) {
//             let childNode = childNodes[i];
//             let singleJson = singleDom2Json(childNode);
//             rootChildren.push(singleJson);
//             if (childNode.childNodes.length > 0) {
//                 traverseChildNode(singleJson.children, childNode.childNodes);
//             }
//         }
//     };
//     let rootJson = singleDom2Json(dom);
//     traverseChildNode(rootJson.children, dom.childNodes);
//     return rootJson;
// };
// let json2Dom = (json) => {
//     let singleJson2Dom = (singleJson) => {
//         if (singleJson.nodeType === 1) {
//             let element = document.createElement(singleJson.tagName);
//             for (let attr in singleJson.attrs) {
//                 element.setAttribute(attr, singleJson.attrs[attr]);
//             }
//             return element;
//         } else {
//             return document.createTextNode(singleJson.nodeValue);
//         }
//     };
//     let rootElement = singleJson2Dom(json);
//     let traverseJsonChildren = (rootElement, jsonChildren) => {
//         for(let i=0;i<jsonChildren.length;i++) {
//             let jsonChild = jsonChildren[i];
//             let jsonElement = singleJson2Dom(jsonChild);
//             rootElement.appendChild(jsonElement);
//             if (jsonChild.children.length > 0) {
//                 traverseJsonChildren(jsonElement, jsonChild.children);
//             }
//         }
//     };
//     traverseJsonChildren(rootElement, json.children);
//     return rootElement;
// };
// let json = {
//     val: 1, children: [
//         {
//             val: 2, children: [
//                 {val: 4, children: []}, {val: 5, children: []}]
//         },
//         {val: 3, children: []}]
// };
// function jsonTraversal(tree) {
//     if (tree) {
//         console.log(tree.val);
//         tree.children.forEach(item => {
//             jsonTraversal(item)
//         });
//     }
// }
//
// jsonTraversal(json);
// let walker = (obj, key, value) => {
//     let depValue = value;
//     if (typeof value === 'object') {
//         observe(value);
//     }
//     Object.defineProperty(obj, key, {
//         set: (newValue) => {
//             console.log('set path is ', key);
//             depValue = newValue;
//             if (typeof newValue === 'object') {
//                 observe(newValue);
//             }
//         },
//         get: () => {
//             console.log('get path is', key);
//             return depValue;
//         }
//     });
// };
// let observe = (rootObj) => {
//     if (typeof rootObj !== 'object') {
//         return;
//     }
//     for (let attr in rootObj) {
//         walker(rootObj, attr, rootObj[attr]);
//     }
// };
// let result = {a: {c: 1}, b: 2}
// observe(result);
// result.a = {d: 1}
// console.log('get', result.a.d);
// let tree = {
//     val: 1,
//     left: {val: 2,left: {val: 4,left: null, right: null}, right: {val: 5,left: null, right: null}},
//     right: {val: 3,left: null, right: null}
// }
// var preorder = function(root) {
//     let paths = [];
//     let constructPath = (tree) => {
//         if (tree) {
//             paths.push(tree.val);
//             tree.children.forEach(item => {
//                 constructPath(item);
//             });
//         }
//     }
//     constructPath(root);
//     return paths;
// };
// var preorderTraversal = function(root) {
//     let paths = [];
//     let constructPaths = (root) => {
//         if (root) {
//             constructPaths(root.left);
//             constructPaths(root.right);
//             paths.push(root.val);
//         }
//     };
//     constructPaths(root);
//     return paths;
// };
// console.log('preorderTraversal', preorderTraversal(tree));
// var hasPathSum = function(root, targetSum) {
//     let paths = [];
//     let constructPath = (parentPath, currentNode) => {
//         if (currentNode) {
//             parentPath.push(currentNode.val);
//             if (currentNode.left === null && currentNode.right === null) {
//                 paths.push(parentPath);
//             } else {
//                 constructPath([...parentPath], currentNode.left)
//                 constructPath([...parentPath], currentNode.right)
//             }
//         }
//     };
//     constructPath([], root);
//     let resultPaths = paths.map(arr => {
//         return arr.reduce((previous, current) => {
//             return previous + current;
//         }, 0);
//     });
//     return resultPaths.indexOf(targetSum) > -1;
//
// };
// console.log('result', hasPathSum(tree, 4));
// var maxDepth = function(root) {
//     let paths = [];
//     // 1 parameters and returned value
//     let constructPath = (parentPath, currentNode) => {
//         if (currentNode) {
//             // 2 entrance to exit
//             parentPath += String(currentNode.val);
//             if (currentNode.left === null && currentNode.right === null) {
//                 paths.push(parentPath);
//             } else {
//                 // 3 complete single layer logic
//                 parentPath += '->';
//                 constructPath(parentPath, currentNode.left);
//                 constructPath(parentPath, currentNode.right);
//             }
//         }
//     };
//     constructPath('', root);
//     return paths;
// };
// console.log('result', maxDepth(tree));
// let tree = {
//     val: 1,
//     left: {val: 2,left: null, right: null},
//     right: {val: 2,left: null, right: null}
// }
// var isSymmetric = function(root) {
//     // https://programmercarl.com/0101.%E5%AF%B9%E7%A7%B0%E4%BA%8C%E5%8F%89%E6%A0%91.html#javascript
//     // 1 parameters and return boolean
//     let compare = (left, right) => {
//         // 2 entrance to exit
//         if (left===null && right!==null || left!==null && right=== null) {
//             return false;
//         } else if (left === null && right === null) {
//             return true;
//         } else if (left.val !== right.val) {
//             return false;
//         }
//         // 3 single layer recursive logic
//         return compare(left.left, right.right) && compare(left.right, right.left)
//     };
//     if (root === null) {
//         return true;
//     }
//     return compare(root.left, root.right);
// };
// console.log('isSymmetric', isSymmetric(tree));
// var isSymmetric = function(root) {
//     //使用递归遍历左右子树 递归三部曲
//     // 1. 确定递归的参数 root.left root.right和返回值true false
//     const compareNode=function(left,right){
//         //2. 确定终止条件 空的情况
//         if(left===null&&right!==null||left!==null&&right===null){
//             return false;
//         }else if(left===null&&right===null){
//             return true;
//         }else if(left.val!==right.val){
//             return false;
//         }
//         //3. 确定单层递归逻辑
//         let outSide=compareNode(left.left,right.right);
//         let inSide=compareNode(left.right,right.left);
//         return outSide&&inSide;
//     }
//     if(root===null){
//         return true;
//     }
//     return compareNode(root.left,root.right);
// };
// console.log('isSymmetric', isSymmetric(tree));
// var compareVersion = function(version1, version2) {
//     let v1Arr = version1.split('.');
//     let v2Arr = version2.split('.');
//     let v1Cur = Number(v1Arr.shift()) || 0;
//     let v2Cur = Number(v2Arr.shift()) || 0;
//     if (v1Arr.length === 0 && v2Arr.length === 0) {
//         return v1Cur - v2Cur === 0 ? 0 : v1Cur >  v2Cur ? 1: -1;
//     }
//     if (v1Cur !== v2Cur) {
//         return v1Cur > v2Cur ? 1 : -1;
//     } else {
//         return compareVersion(v1Arr.join('.'), v2Arr.join('.'))
//     }
// };
// console.log('11', compareVersion('1.01', '1.001'));


// 2 > 1
// 2.6 > 2.5
// 2.6.6 > 2.6.5

//
// function compare(v1, v2) {
//     if (v1 === v2) {
//         return  0;
//     }
//     let v1Arr = v1.split('.');
//     let v2Arr = v2.split('.');
//     let v1Cur = v1Arr.shift();
//     let v2Cur = v2Arr.shift();
//     // return v1Cur !== v2Cur ? v1Cur - v2Cur: compare(v1Arr.join('.'), v2Arr.join('.'));
//     if (v1Cur !== v2Cur) {
//         return v1Cur - v2Cur;
//     } else {
//         return compare(v1Arr.join('.'), v2Arr.join('.'))
//     }
// }
// var v1 =  '2.6.6';
// var v2 =  '2.6.5';
// return > 0 即 v1 > v2;
// return = 0 即 v1 = v2;
// return < 0 即 v1 < v2;
// console.log('compare(v1, v2)', compare(v1, v2));


// []
// [{name: '1'}]
// [{name: '1', children: [{name: '1-1'}]}]

// function flat (arr) {
//     return arr.reduce((previous, current)=>{
//         // current: object
//         let item = {name: current.name};
//         previous.push(item);
//         if (Array.isArray(current.children)) {
//             previous = previous.concat(flat(current.children))
//         }
//         return previous;
//     }, []);
// }
// var test = [{name: '1', children: [{name: '1-1'}, {name: '1-2', children: [{name: '1-2-3'}]}]}, {name: '2'}, {name: '3'}];
// // var test = [{name: '1', children: [{name: '1-1'}]}, {name: '2'}];
// console.log('result', flat(test));


// var test = [1,2,3,4,5]  // 15
// function calc (arr) {
//     return arr.reduce((pre, accumulation) => {
//         return pre + accumulation;
//     }, 0);
// }
//
// console.log('result', calc(test));


// var test1 = [];
// var test2 = [1, 2, 3];
// var test3 = [1, [2,3]];
// var test4 = [1,[2,3, [4,5]]];
//
//
// function flat(arr) {
//     return arr.reduce((previous, current)=>{
//         if (Array.isArray(current)) {
//             return previous.concat(flat(current));
//         } else {
//             return previous.concat(current);
//         }
//     }, []);
// }
//
// console.log('result', flat(test4));


// 2. arr.flat(key) 实现将[{name: '1', children: [{name: '1-1'}]}]得到
//     [{name: '1'}, {name: '1-1'}]

// []
// [{name: '1'}]
// [{name: '1', children: [{name: '1-1'}]}]
// function flat(arr) {
//     let resultArr = [];
//     arr.forEach((item)=>{
//         resultArr.push(item);
//         if (item.children) {
//             resultArr = resultArr.concat(flat(item.children))
//         }
//     });
//     return resultArr;
// }

// Array.prototype.flat = function () {
//     let resultArr = [];
//     let orgArr = this;
//     orgArr.forEach((item)=>{
//         resultArr.push(item);
//         if (item.children) {
//             resultArr = resultArr.concat(item.children.flat())
//         }
//     });
//     return resultArr;
// };
// var test = [{name: '1', children: [{name: '1-1'}, {name: '1-2', children: [{name: '1-2-3'}]}]}, {name: '2'}, {name: '3'}];
// console.log('result', test.flat());


// function flat (arr) {
//     let newArr = [];
//     arr.forEach((item)=>{
//         if (Array.isArray(item)) {
//             newArr = newArr.concat(flat(item))
//         } else {
//             newArr.push(item)
//         }
//     });
//     return newArr;
// }
// 测试数据1 var test = [1, [2, 3]]
// 测试数据2 var test = [1, [2, 3, [4, 5]]]
// const test = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }];
// var test = [1, [2, 3, [4, 5]]];
// console.log('result', flat(test));
