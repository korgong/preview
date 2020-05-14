let trees = [{
    id: 1,
    children: [
        {
            id: 2,
            children: [
                {
                    id: 4,
                    children: [
                        {

                            id: 6,
                            children: []
                        },
                        {
                            id: 7,
                            children: []
                        }
                    ]
                },
                {
                    id: 5,
                    children: []
                }
            ]
        },
        {
            id: 3,
            children: []
        },
    ]
}, {
    id: 8,
    children: []
}, {
    id: 9,
    children: []
}];


// traverse a array
function findParent(trees, targetId) {
    let going = true;
    let stack = [];

    let walker = (trees, targetId) => {
        trees.forEach(tree => {
            if (going) {
                stack.push(tree.id);
                if (tree.id === targetId) {
                    going = false;
                } else if (tree.children) {
                    walker(tree.children, targetId)
                } else {
                    stack.pop();
                }
            }
        });
        if (going) {
            stack.pop();
        }
    };

    walker(trees, targetId);

    return stack;
}


//  // traverse a node
// function findParent(trees, id) {
//     let stack = [];
//     let going = true;
//     let walker = (tree, targetId) => {
//         let stack = [];
//         stack.push(tree.id);
//         if (targetId === tree.id) {
//             going = false;
//         }
//         if (going) {
//             tree.children.forEach((node) => {
//                 if (going) {
//                     stack = stack.concat(walker(node, targetId));
//                 }
//             });
//         }
//         if (going) {
//             stack.pop();
//         }
//         return stack;
//     };
//
//     trees.forEach(tree => {
//         if (going) {
//             stack = stack.concat(walker(tree, id));
//         }
//     });
//
//     return stack;
// }


console.log('Parent is ' + findParent(trees, 6).toLocaleString());




