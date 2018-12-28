let express = require('express');
let app = express();
let multer = require('multer'); // v1.0.5
let options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now())
    }
};
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
let upload = multer({
    storage: storage
});

// 上传接口
app.post('/upload', upload.single('file'), function (req, res, next) {
    console.log(req.body);
    res.json({status: 200});
});

// 静态内容
app.use(express.static('static', options));

console.log('listen at 127.0.0.1:8888');
app.listen(8888);
