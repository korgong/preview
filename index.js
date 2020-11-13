// from forty to ten

// 1 basic structure
// 2 state change
// 3 promise.then
// 4 this
// 5 promise.resolve promise.reject promise.all promise.race
// parameters: onFulfilled, onRejected
// 当promise的状态变成成功时，onFulfilled将会被调用。失败时，onRejected会被调用
// 返回一个新的promise

// basic structure
// let promise = new Promise(function (resolve, reject) {
//     resolve(111);
// });
// promise.then(function (value) {
//     console.log('success, value is ', value);
// }, function (error) {
//     console.log('error, value is ', error);
// });
//
// let promise1 = Promise.resolve(222);
// let promise2 = Promise.reject(333);
//
// Promise.all([promise1, promise2]).then((value) => {
//     console.log('the value of promise all is ', value);
// });
//
// Promise.race([promise1, promise2]).then((value) => {
//     console.log('the value of promise all is ', value);
// });

// state change
const PENDING = 'PENDING';
const RESOLVED = 'RESOLVED';
const REJECT = 'REJECT';
class MyPromise {
    constructor(handler) {
        this._status = PENDING;
        this._fulfilledQueues = [];
        this._rejectedQueues = [];
        try {
            handler(this._resolve.bind(this), this._reject.bind(this));
        } catch (e) {
            this._reject(e);
        }
    }

    _resolve(value) {
        if (this._status !== PENDING) {
            return;
        }
        let run = () => {
            let fulfilled = () => {
                this._status = RESOLVED;
                let callback;
                while (callback = this._fulfilledQueues.shift()) {
                    callback(value);
                }
            };
            let rejected = () => {
                this._status = REJECT;
                let callback;
                while (callback = this._rejectedQueues.shift()) {
                    callback(value);
                }
            };
            if (value instanceof MyPromise) {
                value.then(fulfilled, rejected);
            } else {
                fulfilled();
            }
        };
        setTimeout(run, 0);
    }

    _reject(error) {
        if (this._status !== PENDING) {
            return;
        }
        let run = () => {
            this._status = REJECT;
            let callback;
            while (callback = this._rejectedQueues.shift()) {
                callback(error);
            }
        };
        setTimeout(run, 0);
    }

    then(onFulfilled, onRejected) {
        return new MyPromise((onFulfilledNext, onRejectedNext) => {
            let fulfilled = (value) => {
                try {
                    let result = onFulfilled(value);
                    if (result instanceof MyPromise) {
                        result.then(onFulfilledNext, onRejectedNext);
                    } else {
                        onFulfilledNext(result);
                    }
                } catch (e) {
                    onRejectedNext(e);
                }
            };
            let rejected = (error) => {
                try {
                    let result = onRejected(error);
                    if (result instanceof MyPromise) {
                        result.then(onFulfilledNext, onRejectedNext)
                    } else {
                        onFulfilledNext(result);
                    }
                } catch (e) {
                    onRejectedNext(e);
                }
            };
            this._fulfilledQueues.push(fulfilled);
            this._rejectedQueues.push(rejected);
        })
    }

    static resolve (value) {
        if (value instanceof  MyPromise) {
            return value;
        }
        return new MyPromise((resolve) => {
            resolve(value);
        });
    }

    static reject (error) {
        return new MyPromise((resolve, reject) => {
            reject(error);
        });
    }

    static all(promiseArr) {
        return new MyPromise((resolve, reject) => {
            let valueArr = [];
            for (let [index, item] of promiseArr.entries()) {
                this.resolve(item).then((value) => {
                    valueArr[index] = value;
                    if (valueArr.length === promiseArr.length) {
                        resolve(valueArr);
                    }
                }, (error) => {
                    reject(error);
                });
            }
        });
    }

    static race(promiseArr) {
        return new MyPromise((resolve, reject) => {
            for (let item of promiseArr) {
                this.resolve(item).then(value => {
                    resolve(value);
                }, error => {
                    reject(error);
                });
            }
        });
    }
}

new MyPromise(function (resolve) {
    resolve(111);
}).then(function (value) {
    console.log('value', value);
});

let promise1 = new MyPromise(function (resolve) {
    resolve(111);
});
let promise2 = new MyPromise(function (resolve) {
    resolve(2);
});
MyPromise.all([1, promise2]).then(value => console.log('all value', value));
MyPromise.race([promise1, promise2]).then(value => console.log('race value', value));
