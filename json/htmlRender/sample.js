// 1,2,3,4,5
let tree = {
    id: 1, parentId: null, children: [
        {
            id: 2, parentId: 1, children: [
                {id: 4, parentId: 2, children: []},
                {id: 5, parentId: 2, children: []}
            ]
        },
        {id: 3, parentId: 1, children: []}
    ]
};

// currentNode id: 5
function clearPreview(tree, current) {
    if (current.parentId !== null) {
        let parentNode = findNode(tree, current.parentId);
        for (let i = 0; i < parentNode.children.length; i++) {
            let node = parentNode.children[i];
            if (node.id !== current.id) {
                parentNode.children.splice(i, 1);
                i--;
            } else {
                break;
            }
        }
        clearPreview(tree, parentNode);
    }
}
function findNode(tree, id) {
    if (tree.id === id) {
        return tree;
    }
    for (let i = 0; i < tree.children.length; i++) {
        let node = tree.children[i];
        let result = findNode(node, id);
        if (result) {
            return result;
        }
    }
}

clearPreview(tree, {id: 3, parentId: 1, children: []});
console.log(JSON.stringify(tree));