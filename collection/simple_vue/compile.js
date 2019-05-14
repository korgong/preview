function compile(vm, node) {
    let reg = /\{\{(.*)\}\}/;
    // element类型
    if (node.nodeType === 1) {
        let attrs = node.attributes;
        for (let i = 0; i < attrs.length; i++) {
            // acquire name of vue data in v-model
            let name = attrs[i].nodeName;
            let vName;
            if (name === 'v-model') {
                vName = attrs[i].nodeValue;
                let vNameArr = vName.split('.');
                node.addEventListener('input', function (e) {
                    let value = vm;
                    vNameArr.forEach((vName, index) => {
                        if (index !== vNameArr.length-1) {
                            value = value[vName];
                        } else {
                            value[vName] = e.target.value;
                        }
                    });
                });
                node.removeAttribute(name);
                new Watcher(vm, vName, node, 'input');
            }
        }
    }
    // text类型
    if (node.nodeType === 3) {
        if (reg.test(node.nodeValue)) {
            let vName = RegExp.$1;
            vName = vName.trim();
            new Watcher(vm, vName, node, 'text');
        }
    }

}

function updateAttrInJson(rootJson, virtualDom) {
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
}

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
    updateAttrInJson(rootJson, virtualDom);
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
        updateAttrInJson(json, child);
        // 判断子节点的类型，确定是否递归
        if (!child.childNodes.length) {
            rootJson.childNodes.push(json);
        } else {
            rootJson.childNodes.push(getJson(child));
        }
    });
    return rootJson;
}


function updateAttributes(json, node) {
    if (json.attributes.length) {
        json.attributes.forEach(attribute => {
            Object.keys(attribute).forEach(key => {
                node.setAttribute(key, attribute[key]);
            })
        })
    }
}


function json2node(json, vm) {
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
            compile(vm, node);
            rootNode.appendChild(node);
        } else {
            rootNode.appendChild(json2node(child, vm));
        }
    });
    return rootNode;
}

function nodeToFragment(vm, virtualDom) {
    let json = getJson(virtualDom);
    let dom = json2node(json, vm);
    return dom;
}
