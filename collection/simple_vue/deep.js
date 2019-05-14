let uid = 0;
function Deep() {
    this.id = ++uid;
    this.list = [];
}

Deep.prototype = {
    dep: function () {
        Deep.target.addDep(this);
    },
    subscribe: function (watcher) {
        this.list.push(watcher);
    },
    publish: function () {
        this.list.forEach(watcher => watcher.updater());
    }
};
