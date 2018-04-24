import axios from 'axios';
import qs from 'qs';

var baseUrl = process.env.NODE_ENV == 'development' ? '192.168.31.234' : ''

var util = {};

util.ajax = function(param){
    var _this = param.this || '';
    return axios({
        method : param.method || 'POST',
        url : baseUrl + param.url || '',
        data : qs.stringify(param.data) || ''
    })
    .then(function(res) {
        _this.save_loading = false; 
        var data = res.data;
        if (data.ReturnCode === 'success') {
            var res = data.ReturnData;
            if (!res || !util.length(res)) {
                res = ''
            }
            typeof param.success === 'function' && param.success(res)
        }else{
            // 错误信息提示
            _this.$Message.error({
                content: data.ReturnMessage,
                duration: 5
            })
        }
        // 下一个请求
        typeof param.nextAPI === 'function' && param.nextAPI()
    }, function(err) {
        errFn('403')
        errFn('404')
        errFn('500')
        function errFn(value){
            if (err.status == value) {
                return _this.$router.push({
                    name : 'error-' + value
                })
            }
        }
        if (err.status != '403' && err.status != '404' && err.status != '500') {
            // 错误信息提示
            _this.$Message.error({
                content: '哪里不对了~',
                duration: 5
            })
        }
    })
}

// 表单验证
util.validate = function(type,value){
    if (type == 'email') {
        var regex = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
        if (!regex.test(value)) {
            return true
        }
    }
}

// 获取url参数
util.getUrlParam = function(name){
    var reg     = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var result  = window.location.search.substr(1).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
}

// 复制文本
util.copyText = function (obj1,obj2) {
    var input = obj2;
    input.value = obj1.innerText; // 修改文本框的内容
    input.select(); // 选中文本
    document.execCommand("copy"); // 执行浏览器复制命令
}

// 拆数组
util.sliceArray = function(arr, num){
    var result = [];
    for(var i = 0; i<arr.length; i+=num) {
        result.push(arr.slice(i, i+num))
    }
    return result;  
}

// 数组排序
util.setArrSort = function(arr, val, type, status, currentStep){
    var arr = arr instanceof Array ? arr : []
    var newArr = []
    var statusObj = {}
    for (var j = 1; j <= arr.length; j++) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][val] == j) {
                newArr.push(arr[i])
            }
        }
    }
    return newArr
};

// 获取obj array的长度
util.length = function(obj) {
    var count = 0;
    for(var i in obj){
        count ++;
    }
    return count;
};

util.getNumber0 = function (obj){
    for(var key in obj){
        obj[key] == '' ? obj[key] = 0 : ''
    }
    return obj
};

util.getNeedData = function (needData, allData){
    for(var key in needData){
        allData[key] ? needData[key] = allData[key] : ''
    }
};
// 乘积
util.getOrderTotal = function (mult1, mult2){
    var res = mult1 * mult2;
    if (res && res.toString().indexOf('.') > -1 && res.toString().split('.')[1].length > 2) {
        res = res.toFixed(2)
    }
    res = res ? res : 0
    return res
};

// get数组中的当前对象
util.getCurrentObj = function(arr,name,value){
    for(var i in arr){
        if (arr[i][name] == value) {
            return arr[i]
        }
    }
}

// 根据需要的key值处理数据
util.formatDataToKey = function (list,key,newKey,num){
    var newList = []
    for(var i in list){
        var newobj = {}
        for(var j in key){
            if(num && num==j){    //string转化为number
                newobj[newKey[j]] = parseFloat(list[i][key[j]])
            }else{
                newobj[newKey[j]] = list[i][key[j]]
            }
        }
        newList.push(newobj)
    }
    return newList
};

// 获取需要的时间格式
util.getFormatDate = function (time, format){
    var time    = time || '',
        format  = format || 'yyyy-MM-dd',
        t = new Date();
    if(time){ t = new Date(time) }
    function tf(i){return (i < 10 ? '0' : '') + i};  
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){  
        switch(a){  
            case 'yyyy':  
                return tf(t.getFullYear());
                break;  
            case 'MM':  
                return tf(t.getMonth() + 1);  
                break;  
            case 'mm':  
                return tf(t.getMinutes());
                break;  
            case 'dd':  
                return tf(t.getDate());  
                break;  
            case 'HH':  
                return tf(t.getHours());  
                break;  
            case 'ss':  
                return tf(t.getSeconds());  
                break;  
        }  
    })  
};

// 获取上个月的日期
util.getLastMonthData =  function (){
    var now = util.getFormatDate()
    var arr = now.split('-')
    arr[1] = arr[1] - 1
    if (arr[1] == 0) {
        arr[0] = arr[0]-1
        arr[1] = 12
    }
    if (arr[1]<10) {
        arr[1] = '0' + arr[1]
    }
    var last = arr.join('-')
    return last;
}

export default util;
