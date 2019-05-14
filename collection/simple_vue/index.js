Vue.prototype = {
    proxy: function (vm, data) {
        // vm.属性 => vm.data.属性
        Object.keys(data).forEach(key => {
            Object.defineProperty(vm, key, {
                set: function (newVal) {
                    if(newVal !== data[key]) {
                        data[key] = newVal;
                    }
                },
                get: function () {
                    return data[key];
                }
            })
        })
    }
};

function Vue(option) {
    this.el = option.el;
    this.data = option.data;
    this.proxy(this, this.data);
    observe(this, option.data);
    let virtualDom = document.getElementById(this.el);
    let dom = nodeToFragment(this, virtualDom);
    virtualDom.parentNode.removeChild(virtualDom);
    document.body.appendChild(dom);
}
