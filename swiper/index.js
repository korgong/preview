//---------主角：轮播图函数-------------
function slideshow() {
    var slideshow=document.getElementById("slideshow"),
        imgs=slideshow.getElementsByTagName("img"), //图片们
        pages=slideshow.getElementsByTagName("span"), //页码们
        descrips=slideshow.getElementsByTagName("p"), //描述们
        length=imgs.length, //图片数目
        current=1; //current为当前活跃的图片、页码、描述的编号

    function changeSlide() { //切换图片的函数
        for (var i=0; i<length; i++) {
            if(i==current) {
                imgs[i].className="active";
                pages[i].className="active";
                descrips[i].className="active";
            } else {
                pages[i].className="";
                descrips[i].className="";
                if(i<current) {
                    imgs[i].className="left";
                } else {
                    imgs[i].className="";
                }
            }
        }
        current++; //自增1
        if(current>=length) {
            current=0;
        }
    }

    //每2s调用changeSlide函数进行图片轮播
    var slideon=setInterval(changeSlide,2000);

    slideshow.onmouseover=function(){
        clearInterval(slideon); //当鼠标移入时清除轮播事件
    }
    slideshow.onmouseout=function(){
        slideon=setInterval(changeSlide,2000); //当鼠标移出时重新开始轮播事件
    }

    for(var i=0; i<length; i++) {  //定义鼠标移入页码事件
        pages[i].onmouseover=function(){
            current=this.getAttribute("name");  //得到当前鼠标指的页码
            changeSlide();
        }
    }

}

slideshow();

