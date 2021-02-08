let data = {
    id: 1,
    children: [{
        id: 2,
        children: [{
            id: 4,
            children: []
        }]
    }, {
        id: 3,
        children: [{
            id: 5,
            children: []
        }]
    }]
};

// traverse all path
// function getNode(tree, id) {
//     let paths = [];
//     paths.push(tree.id);
//     if (tree.id === id) {
//         return {tree: tree, paths: paths, isFind: true};
//     }
//     for (let childNode of tree.children) {
//         let result = getNode(childNode, id);
//         if (result.isFind) {
//             paths.push(...result.paths);
//             return {tree: result.tree, paths: paths, isFind: true};
//         } else {
//             paths.push(...result.paths);
//         }
//     }
//     return {
//         tree: tree,
//         paths: paths,
//         isFind: false
//     }
// }

// traverse all path
// function getNode (tree, id) {
//     let paths = [];
//     let iterate = function (tree, id) {
//         paths.push(tree.id);
//         if (tree.id === id) {
//             return tree;
//         }
//         for (let node of tree.children) {
//             let result = iterate(node, id);
//             if (result) {
//                 return result;
//             }
//         }
//     };
//     let node = iterate(tree, id);
//     return {
//         paths: paths,
//         node: node
//     }
// }

// traverse parent path
function getNode(tree, id) {
    let paths = [];
    paths.push(tree.id);
    if (tree.id === id) {
        return {tree: tree, paths: paths};
    }
    for (let childNode of tree.children) {
        let result = getNode(childNode, id);
        if (result) {
            paths.push(...result.paths);
            return {tree: result.tree, paths: paths};
        }
    }
}

console.log('getNode(data, 5)', getNode(data, 5));
