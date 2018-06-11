var express = require('express');
var app = express();
var path = require("path");
app.get('/', function(req, res){
    // res.setHeader("Cache-Control","no-cache");
    // res.setHeader('Cache-Control', "max-age=0");
    // res.setHeader('pragma', "no-cache");
    // res.set({'ETag': false});

    res.send('hello world123');
});

// 静态资源配置。etag,lastModified,redirect 默认为true。
var options = {
    maxAge: 1000000,
    etag: true,
    lastModified: false
};
var dir = path.join(__dirname, "./");
app.use(express.static(dir, options));
// 关闭etag
app.disable('etag');
app.listen(3000);
console.log('start at http://localhost:3000/')