var mv = {status: 0};
var value = mv.status;
Object.defineProperty(mv, 'status', {
    set: function (valNew) {
        value = valNew;
        console.log(value+'is done')
    },
    get: function () {
        return value;
    }
});