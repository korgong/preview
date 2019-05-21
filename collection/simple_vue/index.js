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
    },
    createFragment(el) {
        let fragment = document.createDocumentFragment();
        let child;
        while (child = el.firstChild) {
            fragment.appendChild(child);
        }
        return fragment;
    }
};

function Vue(option) {
    this.el = option.el;
    this.data = option.data;
    this.proxy(this, this.data);
    observe(this, option.data);
    this.$el = document.querySelector(this.el);
    if (this.$el) {
        //转换原始node并将其加入一个新的片段（原始node会被删除）
        this.$fragment = this.createFragment(this.$el);
        //编译这个片段
        compile(this, this.$fragment);
        this.$el.appendChild(this.$fragment);
    }
}
