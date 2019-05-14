// 创建viewModel
// 提取解析指令（订阅数据变化，绑定视图更新函数、初始化视图
function defineReactive(data, key, value) {
    let deep = new Deep();
    //递归监听，value是对象会返回一个new Observer(value)，否则childObserver为undefined
    walk(value);
    Object.defineProperty(data, key, {
        get: function () {
            if (Deep.target) {
                deep.dep(Deep.target);
            }
            return value;
        },
        set: function (newValue) {
            if (newValue === value) {
                return;
            }
            if (typeof newValue === 'object') {
                //观察新值
                walk(newValue);
            }
            value = newValue;
            deep.publish();
        }
    });
}

function walk(data) {
    if (typeof data !== 'object') {
        return
    }
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]));
}

function observe(vm, data) {
    Object.keys(data).forEach(key => {
        vm[key] = data[key];
    });
    walk(data);
}
