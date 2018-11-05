var des = {
    name: 'A',
    child: [
        {
            name: 'B', child: [
                {name: 'C', child: []},
                {name: 'D', child: []},
            ]
        },
        {name: 'E', child: []}
    ]
};
var json2html = function (json) {
    var node = document.createElement('div');
    node.id = json.name;
    if (json.child.length === 0) {
        return node;
    }
    for (var i = 0; i < json.child.length; i++) {
        var childNode = json2html(json.child[i]);
        node.appendChild(childNode);
    }
    return node;
};
var nodeRes = json2html(des);
// var frontErgodic = function (json) {
//     console.log(json.name);
//     if (json.child.length > 0) {
//         for (var i = json.child.length -1; i > -1; i--) {
//             frontErgodic(json.child[i]);
//         }
//     }
// };
// frontErgodic(des);