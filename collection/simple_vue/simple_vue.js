// 创建viewModel
// 提取解析指令（订阅数据变化，绑定视图更新函数、初始化视图）
// todo 1、defineProperty只提取了最外层的key值
function observe(vm, data) {
    let deep = new Deep();
    Object.keys(data).forEach(key => {
        vm[key] = data[key];
        let value = data[key];
        Object.defineProperty(vm, key, {
            set: function (newV) {
                if (newV === value) {
                    return;
                }
                value = newV;
                deep.publish();
            },
            get: function () {
                if (Deep.target) {
                    deep.subscribe(Deep.target);
                }
                return value;
            }
        });
    });
}

function Deep() {
    this.list = [];
}

Deep.prototype = {
    subscribe: function (watcher) {
        this.list.push(watcher);
    },
    publish: function (watcher) {
        this.list.forEach(watcher => watcher.updater());
    }
};

function Watcher(vm, vName, node, type) {
    Deep.target = this;
    this.value = null;
    this.vm = vm;
    this.vName = vName;
    this.node = node;
    this.type = type;
    this.updater();
    Deep.target = null;
}

Watcher.prototype = {
    updater: function () {
        this.get();
        if (this.type === 'input') {
            this.node.value = this.value;
        }
        if (this.type === 'text') {
            this.node.nodeValue = this.value;
        }
    },
    get: function () {
        this.value = this.vm[this.vName];
    }
};

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
                node.addEventListener('input', function (e) {
                    vm[vName] = e.target.value;
                });
                // node.value = vm[vName];
                node.removeAttribute(name);
            }
            new Watcher(vm, vName, node, 'input');
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

function Vue(option) {
    this.el = option.el;
    this.data = option.data;
    observe(this, option.data);
    let virtualDom = document.getElementById(this.el);
    let dom = nodeToFragment(this, virtualDom);
    virtualDom.parentNode.removeChild(virtualDom);
    document.body.appendChild(dom);
}

let vm = new Vue({
    el: 'app',
    data: {
        content: 'hello, world!'
    }
});
