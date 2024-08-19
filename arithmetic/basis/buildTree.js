let objArr = [1, 2, 3, 4, 5, null, null];

class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}
function buildTree(objArr) {
    if (objArr.length === 0) {
        return null;
    }
    let root = new Node(objArr[0]);
    let queue = [root];
    let i = 1;
    while (i < objArr.length) {
        let currentNode = queue.shift();

        if (objArr[i] !== null) {
            let newNode = new Node(objArr[i]);
            currentNode.left = newNode;
            queue.push(newNode);
        }
        i++;

        if (objArr[i] !== null && i < objArr.length) {
            let newNode = new Node(objArr[i]);
            currentNode.right = newNode;
            queue.push(newNode);
        }
        i++;
    }
    return root;
}

let result = buildTree(objArr);
console.log(JSON.stringify(result));