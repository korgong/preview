function getPromise() {
    return new Promise(function (resolve,reject) {
        resolve([1])
    })
}
getPromise().then(function (value) {
    value.push(2)
    return value
}).then(function (value) {
    console.log(value,'console')
})