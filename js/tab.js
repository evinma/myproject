//导航栏效果
$(".navigation_fir li").mouseover(function () {
    $(this).children().addClass("select");
}).mouseout(function () {
    $(this).children().removeClass("select");
});

//首页搜索栏
//blur   失去焦点的事件
(function () {
    $(".search_input").focus(function () {
        this.value = "";
        var val = this.value.replace(/^ +| +$/g, "");
        var temp = val.length > 0 ? "block" : "none";
        $(".search_ul").css("display", temp);
    }).keyup(function (e) {
        window.clearTimeout(this.timer);
        var val = this.value.replace(/^ +| +$/g, "");
        var temp = val.length > 0 ? "block" : "none";
        $(".search_ul").css("display", temp);
        this.timer=window.setTimeout(search.bind(null,val),100);
    }).blur(function () {
        $(".search_input").val("前端工程师");
    });
    var search = function (str) {
        jsonp("http://suggest.lagou.com/suggestion/mix", {
            input: str,
            type: "1",
            num: "10"
        }, "suggestback", function (data) {
            console.log(data);
            $(".search_ul").html("");
            var frg = document.createDocumentFragment();
            var flag=null;
            if (data["POSITION"]) {
                //$("#outer").css('display',"block");
                flag=true;
                var li = document.createElement("div");
                li.id = "li1";
                li.innerHTML = "职位";
                frg.appendChild(li);
                var poS = data["POSITION"].length;
                for (var i = 0; i < data["POSITION"].length; i++) {
                    var obj = data["POSITION"][i];
                    var li1 = document.createElement("li");
                    li1.innerHTML = obj.cont;
                    frg.appendChild(li1);
                }
            }
            if (data["COMPANY"]) {
                var li2 = document.createElement("div");
                li2.id = "li2";
                li2.innerHTML = "公司";
                frg.appendChild(li2);
                for (var k = 0; k < data["COMPANY"].length; k++) {
                    var attr = data["COMPANY"][k];
                    var li3 = document.createElement("li");
                    li3.innerHTML = attr.cont;
                    frg.appendChild(li3);
                }
                $(".search_ul").append(frg);
                $("#li1").css({position: "absolute",top: 0,right: 0,width: 50,height: "" + poS * 32 + "",textAlign: "center",borderLeft: "1px dashed #ccc"});
                if (data["COMPANY"]) {
                    var coS = data["COMPANY"].length;
                    $(".search_ul>li").eq(poS - 1).css({borderBottom: "1px dashed #ccc"});
                    $("#li2").css({position: "absolute",top: "" + (poS * 32 - 1) + "",right: 0,width: 50,height: "" + coS * 32 + "",textAlign: "center",borderLeft: "1px dashed #ccc",borderTop: "1px dashed #ccc"});
                    if(!flag)$("#li2").css({borderTop:"none"});
                }
            }
            $(".search_ul").css("display", "block")
        });
    };
})();

//console.log($(".search_ul").tagName);
//$("body").click(function (e) {
//    e = e || window.event;
//    var target= e.target|| e.srcElement;
//    if($(target).etag.=="a"&&$(target).parentsUntil(".search_ul")){
//        $(".search_input").val(target.innerHTML);
//        $(".search_ul").css("display","none");
////        return;
//    }
//    $(".search_ul").css("display","none");
//});
document.body.onclick = function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    if (target.tagName.toLowerCase() === "li" && $(target).parentsUntil(".search_ul")) {
        var val = target.innerHTML;
        window.location.href = "http://www.lagou.com/jobs/list_" + "(" + val + ")" + "?labelWords=&fromSearch=true&suginput=";
        return;
    } else if (target.id === "search_submit") {
        var cur = $("#search_input").val();
        window.location.href = "http://www.lagou.com/jobs/list_" + "(" + cur + ")" + "?labelWords=&fromSearch=true&suginput=";
    }
    $(".search_ul").css("display", "none");
};
//轮播图
//1、数据绑定
function bindData() {
    var str = "";
    for (var i = 0; i < data.length; i++) {
        var cur = data[i];
        str += "<div>";
        str += "<a href='javascript:;' trueImg='" + cur + "'></a>";
        str += "</div>";
    }
    $(".banner_left").html(str).css("height", "" + (data.length * 160) + "");
    str = "";
    for (var k = 0; k < dataLi.length; k++) {
        var curK = dataLi[k];
        str += "<li trueImg='" + curK + "'>";
        str += "<i>";
        str += "</i>";
        str += "</li>";
    }
    $(".banner_right_tab").html(str);
}
bindData();
//2、延迟加载
function delayImg() {
    $(".banner_left a").each(function (index, item) {
        //var _this=this;
        var oImg = new Image;
        oImg.src = $(item).attr("trueImg");
        oImg.onload = function () {
            $(item).append(oImg);
            animate(oImg, {opacity: 1}, 800);
        }
    });
    $(".banner_right_tab li").each(function (index, item) {
        var OImg = new Image;
        OImg.src = $(item).attr("trueImg");
        //var _item=item;
        OImg.onload = function () {
            $(item).append(OImg);
            //animate(OImg,{opacity:1},200);
        }
    })
}
delayImg();
//window.setTimeout(delayImg,300);
//3、轮播
(function () {
    var step = 0;
    var autoTimer = null;
    var $inner = $(".banner_left");
    var count = $inner.children("div").length;
    //自动轮播
    function autoMove() {
        step++;
        if (step >= count) {
            step = 0;
        }
        $inner.animate({marginTop: -step * 160}, 300, "linear");
        changeTip();
        changeFrame();
    }

    autoTimer = window.setInterval(autoMove, 4000);
    //焦点对齐
    function changeTip() {
        $(".banner_right_tab li").each(function (index, item) {
            if (step == index) {
                $(item).children("i").css("background", "none");
            } else {
                $(item).children("i").css("background", "black");
            }
        })
    }

    //小框对齐
    function changeFrame() {
        $(".banner_right").children("em").animate({top: step * 55}, 150, "linear");
        //css("top",step*55);
    }

    //焦点切换
    $(".banner_right_tab li").mouseover(function () {
        window.clearInterval(autoTimer);
        step = $(this).index();
        $inner.animate({marginTop: -step * 160}, 100, "linear");
        changeTip();
        changeFrame();
        autoTimer = window.setInterval(autoMove, 4000);
    })
})();
//滑动图片
//1、数据绑定
function bindSliderData() {
    var str = "";
    for (var i = 0; i < sliderData.length; i++) {
        var cur = sliderData[i];
        str += "<li class='slider_1'>";
        str += "<a href='javascript:;' class='slider_1_a'>";
        str += "<img src='" + cur.bg + "'/>";
        str += "<div class='slider_1_tab'>";
        str += "<h2>" + cur.title + "</h2>";
        str += "<em></em>";
        str += "<p>" + cur.cent + "</p>";
        str += "</div>";
        str += "</a>";
        str += "</li>"
    }
    $(".slider").html(str);
}
bindSliderData();
//window.setTimeout(bindSliderData,100);
//console.log($(".slider li"));
//$(".slider li").mouseenter(function (e) {
//    var left = $(this).offset().left, bottom = $(this).offset().top + this.offsetHeight, length = this.offsetWidth;
//    this.x = e.pageX - left;
//    this.y = bottom - e.pageY;
//    var $tab = $(this).children().eq(0).children("div");
//    if (this.y > this.x && this.y > (length - this.x) && this.y <= length) {
//        $tab.css({left: 0, top: -113});
//        animate($tab[0], {top: 0}, 300);
//    } else if (this.y < this.x && this.y > (length - this.x) && this.x <= length) {
//        $tab.css({left: 113, top: 0});
//        animate($tab[0], {left: 0}, 300);
//    } else if (this.y < this.x && this.y < (length - this.x) && this.y >= 0) {
//        $tab.css({left: 0, top: 113});
//        animate($tab[0], {top: 0}, 300);
//    } else if (this.y > this.x && this.y < (length - this.x) && this.x >= 0) {
//        $tab.css({left: -113, top: 0});
//        animate($tab[0], {left: 0}, 300);
//    }
//}).mouseleave(function (e) {
//    var left = $(this).offset().left, bottom = $(this).offset().top + this.offsetHeight, length = this.offsetWidth;
//    this.x = e.pageX - left;
//    this.y = bottom - e.pageY;
//    var $tab = $(this).children().eq(0).children("div");
//    if (this.y >= length) {
//        animate($tab[0], {top: -113}, 300);
//    } else if (this.x >= length) {
//        animate($tab[0], {left: 113}, 300);
//    } else if (this.y <= 0) {
//        animate($tab[0], {top: 113}, 300);
//    } else if (this.x <= 0) {
//        animate($tab[0], {left: -113}, 300);
//    }
//});
////$(".slider li").eq(5).css({"margin-right":0});
//$(".slider li").eq(5).css("margin-right",0);
$(".slider>li").mouseenter(function (e) {
    var left = $(this).offset().left, bottom = $(this).offset().top + this.offsetHeight, length = this.offsetWidth;
    var x = e.pageX - left;
    var y = bottom - e.pageY;
    var $tab = $(this).children().eq(0).children(".slider_1_tab");
    if (y > x && y > (length - x) && y <= length) {
        $tab.css({left: 0, top: -113});
        animate($tab[0], {top: 0}, 300);
        //$tab.stop().animate({top: 0}, 300,"linear");
    } else if (y < x && y > (length - x) && x <= length) {
        $tab.css({left: 113, top: 0});
        animate($tab[0], {left: 0}, 300);
        //$tab.stop().animate({left: 0}, 300,"linear");
    } else if (y < x && y < (length - x) && y > -1) {
        $tab.css({left: 0, top: 113});
        animate($tab[0], {top: 0}, 300);
        //$tab.stop().animate({top: 0}, 300,"linear");
    } else if (y > x && y < (length - x) && x > -1) {
        $tab.css({left: -113, top: 0});
        animate($tab[0], {left: 0}, 300);
        //$tab.stop().animate({left: 0}, 300,"linear");
    }
}).mouseleave(function (e) {
    var left = $(this).offset().left, bottom = $(this).offset().top + this.offsetHeight, length = this.offsetWidth;
    var x = e.pageX - left;
    var y = bottom - e.pageY;
    var $tab = $(this).children().eq(0).children("div").eq(0);
    if (y >= length) {
        animate($tab[0], {top: -113}, 300);
        //$tab.stop().animate({top: -113}, 300,"linear");
    } else if (x >= length) {
        animate($tab[0], {left: 113}, 300);
        //$tab.stop().animate({left: 113}, 300,"linear");
    } else if (y <= 0) {
        animate($tab[0], {top: 113}, 300);
        //$tab.stop().animate({top: 113}, 300,"linear");
    } else if (x <= 0) {
        animate($tab[0], {left: -113}, 300);
        //$tab.stop().animate({left: -113}, 300,"linear");
    }
}).last().css("margin-right", 0);//去掉最后一个的右margin
//选项卡切换
$(".file_fir li").click(function () {
    var _this = this;
    $(this).addClass("select").siblings().removeClass("select");
    $(".file_sec>div").each(function (index, item) {
        if ($(_this).index() == index) {
            $(item).css("display", "block");
        } else {
            $(item).css("display", "none");
        }
    });

});
//回到顶部
~function () {
    $(".backTop").click(function () {
        var speed = (document.documentElement.scrollTop || document.body.scrollTop) * (15 / 300);
        var timer = window.setInterval(function () {
            var t = document.documentElement.scrollTop || document.body.scrollTop;
            //win("scrollTop",(t-speed));
            $(document.body || document.documentElement).scrollTop(t - speed);
            if (t <= 0) {
                window.clearInterval(timer);
                //window.onscroll=fn;
                $(window).bind("scroll", fn);
            } else {
                //window.onscroll=null;
                $(window).unbind("scroll", fn);
                $(".backTop").css("display", "none");
            }
        }, 15);
    }).mouseenter(function () {
        $(this).css("background-position", "right");
    }).mouseleave(function () {
        $(this).css("background-position", "left");
    });
    //window.onscroll=fn;
    $(window).bind("scroll", fn);
    function fn() {
        var t = document.documentElement.scrollTop || document.body.scrollTop;
        if (t >= 85) {
            $(".backTop").css("display", "inline-block");
        } else {
            $(".backTop").css("display", "none");
        }
    }
}();


//底部导航栏
//function fn(){
//    var t=(document.documentElement.clientHeight||document.body.clientHeight)-$(".bt_login").css('height');
//    $(".bt_login").css('bottom','t');
//
//}
//fn();
//$(".bt_login").removeClass("bt_login_t");
animate($(".bt_login")[0], {bottom: 0}, 1000, 4);

//最下边效果
(function () {
    function unload() {
        var winH = document.documentElement.clientHeight || document.body.clientHeight;
        var h = winH + $(window).scrollTop();
        var t = $(".load").offset().top;
        if (h >= t) {
            $(".backTop")[0].style.bottom = 140 + (h - t) + "px";
            $(".feedback")[0].style.bottom = 80 + (h - t) + "px";
            $(".bt_login")[0].style.bottom = (h - t) + "px";
        } else {
            $(".backTop")[0].style.bottom = 140 + "px";
            $(".feedback")[0].style.bottom = 80 + "px";
            $(".bt_login")[0].style.bottom = 0;
        }
    }

    $(window).bind("scroll", unload);
})();

