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

// https://api.github.com/users/github
ajax('http://cp01-gongke.epc.baidu.com:8085/ydnatopic/proxy/nauser/twentyonemap?na_uncheck=1&t=1528770570336',function (result) {
    console.log(result);
})