var mv = {};
// 中间变量，set和get操作的值
var value = 0;
Object.defineProperty(mv, 'status', {
    set: function (valNew) {
        value = valNew;
        // 这里的console也可以是操作dom
        console.log(value+'is done')
    },
    get: function () {
        return value;
    }
});

mv.status;  // 0
mv.status = 9;  // 9is done
mv.status;  // 9