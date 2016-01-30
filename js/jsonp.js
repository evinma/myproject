(function () {
    //url:http://suggest.lagou.com/suggestion/mix?
    // suggestback=jQuery1113043307324149645865_1453187678022
    // &input=a&type=1&num=10
    // &_=1453187678024
    var j = this.jsonp = function (url, data, jsonpCallback, callback) {
        //获取一个随机数
        var random = getRandom();
        //创建一个全局随机方法名
        var cbname = 'jsonp.' + random;
        //var cbname=this.jsonp.random;
        //根据上边的方法名创建对应的方法
        j[random] = function (data) {
            try {
                //执行回调函数
                callback(data);
            } finally {
                //不管成功与否都要删除创建的script标签和全局方法
                //script.parentNode.removeChild(script);
                script1.parentNode.removeChild(script1);
                delete j[random];
            }
        };
        //拼接给定的jsonpCallback=定义的callback方法名
        if (hasSearch(url)) {
            url += "&" + jsonpCallback + "=" + cbname;
        } else {
            url += "?" + jsonpCallback + "=" + cbname;
        }
        //将传进来的data变成uri字符串
        data = encodeURIString(data);
        //将转变完成的uri字符串拼接到url后边
        if (data) {
            if (hasSearch(url)) {
                url += "&" + data;
            } else {
                url += "?" + data;
            }
        }


        var script1 = document.createElement("script");
        script1.id="t";
        script1.src = url;
        document.body.appendChild(script1);

    };
    var getRandom = function () {
        return "a" + Math.abs(Math.random() * 0xffffffff | 0).toString(36);
    };
    var hasSearch = function (str) {
        return /\?/.test(str);
    };
    var encodeURIString = function (data) {
        if (typeof data === "string") {
            return data;
        } else {
            var ary = [];
            for (var n in data) {
                if (data.hasOwnProperty(n)) {
                    ary.push(encodeURIComponent(n) + "=" + encodeURIComponent(data[n]));
                }
            }
            return ary.join("&");
        }
    }
})();