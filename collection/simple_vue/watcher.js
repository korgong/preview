/**
 * subscribe data, and bind updater
 * **/
function Watcher(vm, vName, node, type) {
    // watcher监听的属性的Id
    this.depIds = {};
    this.value = null;
    this.vm = vm;
    this.vName = vName;
    this.node = node;
    this.type = type;
    this.updater();
}

Watcher.prototype = {
    //观察某个属性
    isAddToDep (dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
            // 添加订阅者
            dep.subscribe(this);
            // 该属性的依赖列表
            this.depIds[dep.id] = dep;
        }
    },
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
        Dep.target = this;
        let vNameArr = this.vName.split('.');
        this.value = vNameArr.reduce((accumulator, curr) => {
            return accumulator[curr];
        }, this.vm);
        Dep.target = null;
    }
};
