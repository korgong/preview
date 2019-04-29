function Super() {
    this.c = 3;
}

Super.prototype = {
    a: 1,
    b: function () {
        console.log('hello,world');
    }
};

function extend(target, source) {
    for (let attr in source) {
        if (source.hasOwnProperty(attr) && source[attr]!== undefined) {
            target[attr] = source[attr];
        }
    }
}

function create(proto) {
    let F = new Function();
    F.prototype = proto;
    return new F();
}

function getSubClass(Super, proto) {
    function Sub() {
        Super.call(this);
    }
    Sub.prototype = Object.create ? Object.create(Super.prototype): create(Super.prototype);
    Sub.prototype.constructor = Sub;
    extend(Sub.prototype, proto);
    return Sub;
}

let SubClass = getSubClass(Super,{
    a: 2,
});
let subClass = new SubClass();
console.log(subClass);
