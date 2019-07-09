Vue.prototype = {
    /**
     * intercept the attribute of vm, and correspond to vm.data
     * vm.attribute => vm.data.attribute
     * @param vm
     * @param data
     */
    proxy: function (vm, data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(vm, key, {
                set (newVal) {
                    // console.log('intercept the attribute of vm, and correspond to vm.data');
                    if(newVal !== data[key]) {
                        data[key] = newVal;
                    }
                },
                get () {
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
    observe(this.data);
    this.$el = document.querySelector(this.el);
    if (this.$el) {
        //转换原始node并将其加入一个新的片段（原始node会被删除）
        this.$fragment = this.createFragment(this.$el);
        //编译这个片段
        compile(this, this.$fragment);
        this.$el.appendChild(this.$fragment);
    }
}
