let tree = {
    id: 1,
    title: 'tree root',
    children: [
        {
            id: 2,
            title: 'tree 2',
            children: [
                {
                    id: 4,
                    title: 'tree 4',
                    children: []
                },
                {
                    id: 5,
                    title: 'tree 5',
                    children: []
                }
            ]
        },
        {
            id: 3,
            title: 'tree 3',
            children: []
        }
    ]
}


let treeNodes =  [
    {
        id: 2,
        title: 'tree 2',
        children: [
            {
                id: 4,
                title: 'tree 4',
                children: []
            },
            {
                id: 5,
                title: 'tree 5',
                children: []
            }
        ]
    },
    {
        id: 3,
        title: 'tree 3',
        children: []
    }
]

let results = [];
// 根左右 expect 1,2,4,5,3
let sayNode = (tree) => {
    results.push(tree.id)
    tree.children.forEach(subTree => {
        sayNode(subTree);
    });
};
// console.log('根左右 expect 1,2,4,5,3', (()=>{sayNode(tree);return results})());

// 根左右 expect 2,4,5,3
let sayNodes = (subTrees) => {
    subTrees.forEach(tree => {
        sayNode(tree);
    });
};

console.log('根左右 expect 2,4,5,3', (()=>{sayNodes(treeNodes);return results})());
