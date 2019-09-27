// https://juejin.im/post/5b83cb5ae51d4538cc3ec354#heading-2
let PENDING = 'PENDING';
let RESOLVED = 'RESOLVED';
let REJECTED = 'REJECTED';
let isFunction = func => typeof func === 'function';

class MyPromise {
    constructor(handler) {
        if (!isFunction(handler)) {
            throw new Error('MyPromise must accept a function as a parameter');
        }
        this._status = PENDING;
        this._value = null;
        this._fulfilledQueues = [];
        this._rejectedQueues = [];
        try {
            handler(this._resolve.bind(this), this._reject.bind(this));
        } catch (e) {
            this._reject();
        }
    }

    _resolve(val) {
        if (this._status !== PENDING) {
            return;
        }
        // when you resolve a val which is a instance of MyPromise, you need to invoke val.then(fulfilled, rejected)
        // if you resolve a ordinary val, just invoke fulfilled(val)
        let run = () => {
            let fulfilled = (newVal) => {
                this._status = RESOLVED;
                this._value = newVal;
                let callback;
                while (callback = this._fulfilledQueues.shift()) {
                    callback(newVal);
                }
            };
            let rejected = (newErr) => {
                this._status = REJECTED;
                this._value = newErr;
                let callback;
                while (callback = this._rejectedQueues.shift()) {
                    callback(newErr);
                }
            };
            if (val instanceof MyPromise) {
                val.then(fulfilled, rejected);
            } else {
                fulfilled(val);
            }
        };
        setTimeout(run, 0);
    }

    _reject(err) {
        if (this._status !== PENDING) {
            return;
        }
        let run = () => {
            let callback;
            while (callback = this._rejectedQueues.shift()) {
                callback(err);
            }
        };
        setTimeout(run, 0);
    }

    then(onfulfilled, onrejected) {
        return new MyPromise((onfulfilledNext, onrejectedNext) => {
            let fullfilled = (val) => {
                try {
                    let res = onfulfilled(val);
                    if (res instanceof MyPromise) {
                        res.then(onfulfilledNext, onrejectedNext);
                    } else {
                        onfulfilledNext(res);
                    }
                } catch (e) {
                    onrejectedNext(e);
                }
            };
            let rejected = (err) => {
                try {
                    let res = onrejected(err);
                    if (res instanceof MyPromise) {
                        res.then(onfulfilledNext, onrejectedNext);
                    } else {
                        onfulfilledNext(res);
                    }
                } catch (e) {
                    onrejectedNext(e);
                }
            };
            this._fulfilledQueues.push(fullfilled);
            this._rejectedQueues.push(rejected);
        });
    }

    static resolve(val) {
        if (val instanceof MyPromise) {
            return val;
        }
        return new MyPromise(resolve => resolve(val));
    }

    static reject(err) {
        return new MyPromise((resolve, reject) => {
            reject(err);
        });
    }

    static all(list) {
        return new MyPromise((resolve, reject) => {
            let values = [];
            let count = 0;
            for (let [index, item] of list.entries()) {
                this.resolve(item).then(res => {
                    values[index] = res;
                    count++;
                    if (count === list.length) {
                        resolve(values);
                    }
                }, error => {
                    reject(error);
                });
            }
        });
    }

    static race(list) {
        return new Promise((resolve, reject) => {
            for (let p of list) {
                this.resolve(p).then(res => {
                    resolve(res);
                }, err => {
                    reject(err);
                });
            }
        });
    }
}

new MyPromise(function (resolve, reject) {
    resolve(1);
}).then(function (val) {
    return val;
}, function (err) {

}).then(function (val) {
    console.log(123, val);
}, function (err) {

});
