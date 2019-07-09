let uid = 0;
function Dep() {
    this.id = ++uid;
    this.list = [];
}

Dep.prototype = {
    subscribe: function (watcher) {
        this.list.push(watcher);
    },
    publish: function () {
        this.list.forEach(watcher => watcher.updater());
    }
};
