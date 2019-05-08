// 创建viewModel
// 提取解析指令（订阅数据变化，绑定视图更新函数、初始化视图）
// todo 1、defineProperty只提取了最外层的key值  2、创建碎片dom只取第一个孩子节点，如果指令在孩子节点的子节点无法识别
// todo 3、碎片dom如何工作的
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

function nodeToFragment(vm, app) {
    let fragment = document.createDocumentFragment();
    let child;
    while (child = app.firstChild) {
        compile(vm, child);
        fragment.appendChild(child);
    }
    return fragment;
}

function Vue(option) {
    this.el = option.el;
    this.data = option.data;
    observe(this, option.data);
    let app = document.getElementById('app');
    let dom = nodeToFragment(this, app);
    app.appendChild(dom);
}

let vm = new Vue({
    el: 'app',
    data: {
        content: 'hello, world!'
    }
});
