let virtualDom = document.querySelector('.app');

let getAttrInJson = function (rootJson, virtualDom) {
    for (let attr in rootJson) {
        if (attr === 'attributes') {
            if (virtualDom[attr]) {
                rootJson[attr] = [].slice.call(virtualDom[attr]).map(attribute => {
                    return {
                        [attribute.name]: attribute.nodeValue
                    }
                });
            }
        } else if (attr === 'childNodes') {
            rootJson.childNodes = [];
        } else {
            // 包括nodeName，nodeType
            rootJson[attr] = virtualDom[attr];
        }
    }
};

function getJson(virtualDom) {
    // 创建父节点的json
    let rootJson = {
        nodeType: 1,  // 文本节点
        nodeName: 'DIV',  // 文本节点#text
        attributes: [],
        nodeValue: null,  // 文本节点是字符串
        childNodes: [],
    };
    // 更新json属性
    getAttrInJson(rootJson, virtualDom);
    // 得到父节点子节点，将子节点放入json的childNodes中。
    // 同时子节点的childNodes的个数不为空，对子节点进行递归
    let childNodes = virtualDom.childNodes;
    [].slice.call(childNodes).forEach(child => {
        let json = {
            nodeType: 1,  // 文本节点
            nodeName: 'DIV',  // 文本节点#text
            attributes: [],
            nodeValue: null,  // 文本节点是字符串
            childNodes: [],
        };
        // 更新json属性
        getAttrInJson(json, child);
        // 判断子节点的类型，确定是否递归
        if (!child.childNodes.length) {
            rootJson.childNodes.push(json);
        } else {
            rootJson.childNodes.push(getJson(child));
        }
    });
    return rootJson;
}

let json = getJson(virtualDom);

// console.log(JSON.stringify(json));


function updateAttributes(json, node) {
    if (json.attributes.length) {
        json.attributes.forEach(attribute => {
            Object.keys(attribute).forEach(key => {
                node.setAttribute(key, attribute[key]);
            })
        })
    }
}


function json2node(json) {
    // 获取父节点，将子节点加入父节点。子节点如果还有元素，递归执行
    let rootNode = document.createElement(json.nodeName);
    updateAttributes(json, rootNode);
    json.childNodes.forEach(child => {
        if (!child.childNodes.length) {
            // 无子节点json
            let node;
            if (child.nodeType === 3) {
                node = document.createTextNode(child.nodeValue);
            } else {
                // img...
                node = document.createElement(child.nodeName);
                updateAttributes(child, node);
            }
            rootNode.appendChild(node);
        } else {
            rootNode.appendChild(json2node(child));
        }
    });
    return rootNode;
}


let virtualDom2 = json2node(json);
$('.test').append(virtualDom2);
