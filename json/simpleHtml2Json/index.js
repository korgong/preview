function node2Json(node) {
    let json = {};
    json.tagName = node.tagName;
    json.nodeType = node.nodeType;
    json.nodeValue = node.nodeValue;
    json.childNodes = [];
    // 只有文本没有attributes属性
    if (node.nodeType !== 3) {
        json.attributes = [];
        let attributes = Array.prototype.slice.call(node.attributes);
        attributes.forEach(attribute => {
            json.attributes.push({
                [attribute.nodeName]: attribute.nodeValue
            })
        });
    }
    let childNodes = Array.prototype.slice.call(node.childNodes);
    childNodes.forEach(child => {
        json.childNodes.push(node2Json(child));
    });
    return json;
}

function json2Node(json) {
    if (json.nodeType === 3) {
        return document.createTextNode(json.nodeValue);
    }
    let node = document.createElement(json.tagName.toLowerCase());
    json.childNodes.forEach(json => {
        node.appendChild(json2Node(json));
    });
    json.attributes.forEach(attribute => {
        let key = Object.keys(attribute)[0];
        let value = attribute[key];
        node.setAttribute(key, value);
    });
    return node;
}

let node = document.querySelector('.app');
let json = node2Json(node);
// console.log(JSON.stringify(json));
console.log(json);
let virtualDom2 = json2Node(json);
document.querySelector('.test').appendChild(virtualDom2);
