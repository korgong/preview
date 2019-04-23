function SuperClass() {
    this.c = 3;
}

SuperClass.prototype = {
    a: 1,
    b: function () {
        console.log('hello,world');
    }
};

// copy property of source to target
function extend(target, source) {
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            var value = source[key];
            if (value !== undefined) {
                target[key] = value;
            }
        }
    }
}

// SubClass inherits SuperClass prototype
function inherits(SuperClass, SubClass) {
    var subProto = SubClass.prototype;
    var F = new Function();
    F.prototype = SuperClass.prototype;
    SubClass.prototype = new F();
    SubClass.prototype.constructor = SubClass;
    extend(SubClass.prototype, subProto);
}

// get SubClass
function getSubClass(proto) {
    function SubClass() {
        // SubClass inherits SuperClass property
        SuperClass.call(this);
    }
    SubClass.prototype = proto;

    inherits(SuperClass, SubClass);

    return SubClass;
}

var SubClass = getSubClass({
    a: 2,
});
var subClass = new SubClass();
console.log(subClass);


