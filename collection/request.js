// 1、original ajax
function ajax(url, cb, data) {
    var xhr = new(window.XMLHttpRequest || ActiveXObject)('Microsoft.XMLHTTP');

    xhr.onreadystatechange = function() {
        // 这里的this是XMLHttpRequest
        if (this.readyState == 4) {
            cb(this.responseText);
        }
    };
    xhr.open(data ? 'POST' : 'GET', url + '&t=' + ~~(Math.random() * 1e6), true);

    if (data) {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send(data);
}

// 2、abort previous request by jquery
function abortPreviousRequest() {
    let xhr;
    return function (url, callback) {
        if (xhr && xhr.readyState !== 4) {
            xhr.abort();
        }
        xhr = $.ajax({
            url: url,
            success (data) {
                // do something
                callback(data);
            },
            error(err) {

            }
        })
    };
}

// 3、abort previous request by abortAblePromise
// fetch with timeout and abort
// https://imweb.io/topic/57c6ea35808fd2fb204eef63
function getAbortAbleFetch(url, timeout) {

    let abort = null;
    let abortAblePromise = new Promise(function (resolve, reject) {
        abort = function () {
            reject('reject a promise');
        }
    });
    let request = fetch(url);

    let abortAbleFetch = Promise.race([
        abortAblePromise,
        request
    ]);

    if (timeout) {
        setTimeout(function () {
            abort();
        }, timeout);
    }

    abortAbleFetch.abort = abort;

    return abortAbleFetch;
}

function getUpdateSug () {
    let promise = null;
    return function (url) {
        if (promise) {
            promise.abort();
        }
        promise = getAbortAbleFetch(url);
        promise.then(function () {
            console.log('update view');
        })
    }
}

// 4、isomorphic-fetch
require('es6-promise').polyfill();
require('isomorphic-fetch');

// https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch
fetch(url, {
    body: JSON.stringify({data: ''}), // must match 'Content-Type' header
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, same-origin, *omit
    headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // *client, no-referrer
}).then(function (data) {
    console.log(data);
});


// 5、封装过的基础http请求
const request = require('request');
function http(option) {
    let interval = null;
    let retry = 0;
    let inst = null;
    let timeout = 3000;
    return new Promise((resolve, reject) => {
        let cb = function (err, resp, httpBody) {
            if (err) {
                console.error('base scrape method error and retry, error message:', err);
                inst = request.get(option, cb);
            }
            else {
                resolve(httpBody);
                clearInterval(interval);
            }
        };
        inst = request.get(option, cb);
        interval = setInterval(() => {
            console.log('retry time:', ++retry);
            inst.abort();
            inst = request.get(option, cb);
        }, timeout);
    });
}
