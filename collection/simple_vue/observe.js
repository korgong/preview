// 创建viewModel
// 提取解析指令（订阅数据变化，绑定视图更新函数、初始化视图
function defineReactive(data, key, value) {
    let dep = new Dep();
    //递归监听，value是对象会返回一个new Observer(value)，否则childObserver为undefined
    observe(value);
    Object.defineProperty(data, key, {
        get () {
            // Dep.target === watcher
            if (Dep.target) {
                Dep.target.isAddToDep(dep);
            }
            return value;
        },
        set (newValue) {
            // console.log('set attribute');
            if (newValue === value) {
                return;
            }
            if (typeof newValue === 'object') {
                //观察新值
                observe(newValue);
            }
            value = newValue;
            dep.publish();
        }
    });
}

function observe(data) {
    if (typeof data !== 'object') {
        return
    }
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]));
}
