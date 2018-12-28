function uploadFile() {
    let file = document.getElementById("file");
    let formData = new FormData();
    formData.append('file', file.files[0]);
    $.ajax({
        url: 'http://127.0.0.1:8888/upload',
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            if (200 === data.status) {
                $('#result').html("上传成功！");
                $('#img').attr('src', data.data);
            } else {
                $('#result').html("上传失败！");
            }
        },
        error: function () {
            $("#result").html("与服务器通信发生错误");
        }
    });
}

function postPage() {
    let uploada = document.getElementById('upload');
    uploada.addEventListener("click", function () {
        uploadFile();
    }, false);
}

window.onload = function () {
    postPage();
};
