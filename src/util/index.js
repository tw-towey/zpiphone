import axios from "axios";
import { Toast, ImagePreview } from "vant";

import store from "@/store/index";
import x2js from "x2js";
import api from "@/api/index";
import { Dialog } from 'vant';
import webApp from '../webApp/index'
import { AES, MD5, mode, pad, enc } from 'crypto-js';
axios.interceptors.request.use(
    config => {
        console.log(config)
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        if(config["contentType"]) { //contentType == true的时候 我们需要采用fromData格式提交
            config.headers['content-type'] = 'application/x-www-form-urlencoded';
            if(Object.prototype.toString.call(config.data) != '[object FormData]'){
                const _fromData = new FormData();
                Object.keys(config.data).forEach(item => {
                    _fromData.append(item,config.data[item]);         
                });
                config.data = _fromData;
            }
        }else {
            config.headers['content-type'] = 'application/json;charset=UTF-8';
        }
        return config
    }
)
export default {
    getValueByKey(list, key) {
        if(list && list.length > 0){
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (item.key == key) {
                    return item.value;
                }
            }
        }
    },
    getValueByvalue(list, key) {
        // debugger
        if (list) {
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (item.value == key) {
                    return item.text;
                }
            }
        }
        return '';
    },
    deepCopy(obj) {
        var result = Array.isArray(obj) ? [] : {};
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object' && obj[key]!==null) {
              result[key] = this.deepCopy(obj[key]);   //递归复制
            } else {
              result[key] = obj[key];
            }
          }
        }
        return result;
    },
    getKeyByValue(list, key) {
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (item.value == key) {
                return item.key;
            }
        }
    },
    imagePreview(images, position, timer) {
        /**
         * 显示附件、图片进行预览，文件进行下载
         * @param images {array}
         * @param position
         * @param timer
         */
        const instance = ImagePreview({
            images,
            asyncClose: !!timer,
            startPosition: typeof position === "number" ? position : 0
        });

        if (timer) {
            setTimeout(() => {
                instance.close();
            }, timer);
        }
    },
    openMultiTypeFile(url) {
        var tempTypeIndex = url.lastIndexOf(".");
        var tempType = url.substring(tempTypeIndex).toLowerCase();
        console.log("当前文件格式", tempType);
        if (tempType == ".doc" || tempType == ".docx" || tempType == ".xls" || tempType == ".xlsx" || tempType == ".ppt" || tempType == ".pptx" || tempType == ".pdf" || tempType == ".txt") {
            // window.open(url);
            this.downLoadFile({url,name:new Date().getTime() + tempType});
            Toast("不支持" + tempType+"格式,请由PC端打开");
            // this.webApp.WebCallApp("CmdOpenUrl", {url: url});
        } else if (tempType == ".jpg" || tempType == ".jpeg" || tempType == ".png" || tempType == ".gif") {
            ImagePreview([url]);
        } else {

        }
    },
    isNumber(val){

            var regPos = /^\d+(\.\d+)?$/; //非负浮点数
            var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
            if(regPos.test(val) && regNeg.test(val)){
                return true;
            }else{
                return false;
            }

    },
    /*
     *   获取字典
    */
    getDictionaries(params,options,callback){
        this.ajax({
            url: api.selectByType,
            data: params,
            method: "POST",
            success: data => {
                if (data && data.length > 0 ) {
                    data.forEach(i => {
                        options.option.push({
                            key: i.key,
                            value: i.value
                        });
                    });
                }
                if(callback){
                    callback(data);
                }
                }
            },
            false
        );
    },
    /**
     * 
     * @param {*} that 
     */
    goBack(that) {
        /**
         * 返回上一页
         */
        // that.$route.meta.keepAlive = true; // 用于上一页缓存
        that.$router.isBack = true;
        that.$router.go(-1);
    },
    trim(text) {
        /**
         * 去除首位空格
         */
        return text == null ? "" : (text + "").replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    },
    encryptByEnMd5(signStr){
        let returnStr = MD5(signStr).toString();
        return returnStr;
    },
     /**
    * AES加密
     * @param data 
     */
    encryptByEnAES(data) {
        var key = enc.Utf8.parse(store.state.secretKey);
        let tmpAES = AES.encrypt(data, key, {
            mode: mode.ECB,
            padding: pad.Pkcs7
        });
        return tmpAES.toString();
    },
    /**
     * AES解密
     * @param data 
     */
    encryptByDeAES(data) {
        var key = enc.Utf8.parse(store.state.secretKey);
        let tmpDeAES = AES.decrypt(data, key, {
          mode: mode.ECB,
          padding: pad.Pkcs7
        });
        return tmpDeAES.toString(enc.Utf8);
    },
    nextFourYears() {
        var ary = [];
        var year = new Date().getFullYear() - 4;
        for (let i = 0; i < 6; i++) {
            var obj = {
                key: i,
                value: year + i
            };
            ary.push(obj);
        }
        return ary;
    },
    ajax(options, isFlag) {
        console.log(options)
        /**
         * options: 请求参数(和axios需要的参数一样)
         * isFlag: 请求数据时是否显示加载中(默认显示，传true不显示)
         */
        // store.state.loading = true;
        isFlag = isFlag || false;
        if (!isFlag) {
            Toast.loading({
                mask: true,
                message: "加载中...",
                duration: 5000
            });
        }
        if (options.method && (options.method == 'get' || options.method == 'GET')) {
            axios.get(options.url, {
                params: options.data
            }).then(response => {
                if(response.status == 401){
                    Dialog.alert({
                     title: '提示',
                     message: '登陆失效，请重新登陆'
                     }).then(() => {
                        webApp.WebCallApp("UserLogout",{},()=>{});
                    });
                    return;
                }
                if (!isFlag) {
                    Toast.clear();
                }
                options.success && options.success(response.data);
            }).catch(error => {
                if (!isFlag) {
                    Toast.clear();
                }
                if (options.catch) {
                    options.catch && options.catch(error);
                } else {
                    Toast(error.message);
                }
            })
        } else {
            options.data = options.data || {};
            options.data.institutionId = store.state.institutionId;
            axios(options).then(res => {
                console.log(res);
                if(res.status == 401){
                   Dialog.alert({
                    title: '提示',
                    message: '登陆失效，请重新登陆'
                    }).then(() => {
                       webApp.WebCallApp("UserLogout",{},()=>{});
                   });
                   return;
                }
                let result = null;
                if (!isFlag) {
                    Toast.clear();
                }
                if (res.data.serviceResult) {
                    result = JSON.parse(res.data.serviceResult);
                    if (result.flag === "true") {
                        store.state.timestamp = result.timestamp;
                        options.success && options.success(result.data);
                    } else {
                        if (options.error) {
                            options.error(result);
                        } else {
                            Toast(result.error);
                        }
                    }
                } else {
                    options.success && options.success(res.data);
                }
            }).catch(
                error => {
                    console.log(options);
                    console.log(error);
                    if(error.response && error.response.status == 401){
                        Dialog.alert({
                            title: '提示',
                            message: '登陆失效，请重新登陆'
                        }).then(() => {
                            webApp.WebCallApp("UserLogout",{},(res) => {});
                        });
                        return;
                    }
                    if(error.response && error.response.status == 400){
                        // Toast(JSON.stringify(options));
                        Dialog.alert({
                            title: '提示',
                            message: JSON.stringify(options)
                        }).then(() => {
                            
                        });
                        return;
                    }
                    if (options.catch) {
                        options.catch && options.catch(error.message);
                    } else {
                        Toast(error.message);
                    }
                }
            );
        }
    },
    // getCookie(name){
    //     var nameEQ = name + "=";
    //     var ca = document.cookie.split(';');
    //     for(var i = ca.length - 1 ;i < ca.length; i-- ) {
    //         var c = ca[i].trim();
    //         if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    //     }
    //     return null;
    // },
    getCookie(cookieVal) {
        /**
         * 获取cookie的值
         * cookieVal 参数是cookie中的key返回value
         * @type {string}
         */
        var curCookie = "";
        document.cookie.split(";").forEach((item) => {
          if (this.trim(item.split("=")[0]) === cookieVal) {
            curCookie = item.split("=")[1] || "";
          }
        });
        return curCookie;
    },
    formatDate(time, type, format) {
        /**
         * time 时间
         * type 类型（默认'yyyy-MM-dd HH:mm'）
         */
        if (!time) return time;
        var date = "";
        if (format) {
            date = time;
        } else {
            if (typeof time !== "number") {
                time = time.replace(/-/g, "/");
            }
            date = new Date(time);
        }
        type = type ? type : "yyyy-MM-dd HH:mm";
        var seperator1 = "-";
        var seperator2 = ":";
        var month = (date.getMonth() + 1).toString();
        var day = date.getDate().toString();
        var hours = date.getHours().toString();
        var minutes = date.getMinutes().toString();
        var seconds = date.getSeconds().toString();
        month = month.length === 1 ? ("0" + month) : month;
        day = day.length === 1 ? ("0" + day) : day;
        hours = hours.length === 1 ? ("0" + hours) : hours;
        minutes = minutes.length === 1 ? ("0" + minutes) : minutes;
        seconds = seconds.length === 1 ? ("0" + seconds) : seconds;
        if (type === "yyyy-MM-dd HH:mm:ss") {
            return date.getFullYear() + seperator1 + month + seperator1 + day + " " + hours + seperator2 + minutes + seperator2 + seconds;
        } else if (type === "yyyy-MM-dd HH:mm") {
            return date.getFullYear() + seperator1 + month + seperator1 + day + " " + hours + seperator2 + minutes;
        } else if (type === "yyyy-MM-dd") {
            return date.getFullYear() + seperator1 + month + seperator1 + day;
        } else if (type === "yyyy-MM") {
            return date.getFullYear() + seperator1 + month;
        } else if (type === "HH:mm") {
            return hours + seperator2 + minutes;
        }
    },
    getDoMain(str) {
        let domain = str.split("/");
        if (domain[2]) {
            domain = domain[2];
        } else {
            domain = "";
        }
        return domain;
    },
    formatSeconds(value) {
        let result = parseInt(value)
        let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
        let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
        let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
     
        let res = '';
        if(h !== '00') res += `${h}时`;
        if(m !== '00') res += `${m}分`;
        res += `${s}秒`;
        return res;
    },
    deepClone(obj, hash = new WeakMap()) {
        //先把特殊情况全部过滤掉 null undefined date reg
        if (obj == null) return obj;  //null 和 undefined 都不用处理
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof RegExp) return new RegExp(obj);
        if (typeof obj !== 'object') return obj;  // 普通常量直接返回
        
        //  防止对象中的循环引用爆栈，把拷贝过的对象直接返还即可
        if (hash.has(obj)) return hash.get(obj);
    
        // 不直接创建空对象的目的：克隆的结果和之前保持相同的所属类
        // 同时也兼容了数组的情况
        let newObj = new obj.constructor;
    
        hash.set(obj, newObj)  // 制作一个映射表
        
        //判断是否有 key 为 symbol 的属性
        let symKeys = Object.getOwnPropertySymbols(obj);
        if (symKeys.length) { 
            symKeys.forEach(symKey => {
                newObj[symKey] = this.deepClone(obj[symKey], hash);   
            });
        }
    
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {  // 不拷贝原型链上的属性
                newObj[key] = this.deepClone(obj[key], hash);  // 递归赋值
            }
        }
        return newObj;
    },
    downLoadFile(obj) {
        const a = document.createElement("a");
        const e = document.createEvent("MouseEvents");
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.download = obj.name || new Date();
        a.href = decodeURIComponent(obj.url || obj.path);
        a.dispatchEvent(e);
    },
    downLoad(data) {
        let obj = data;
        const domain1 = this.getDoMain(window.location.href);
        const domain2 = this.getDoMain(obj.url);
        let flag = false;
        if (/.jpg/.test(obj.url) || /.jpeg/.test(obj.url) || /.png/.test(obj.url) || /.gif/.test(obj.url)) {
            flag = true;
        }
        if (domain1 != domain2 && flag) {
            let that = this;
            let image = new Image();
            image.setAttribute("crossOrigin", 'Anonymous')
            image.onload = function() {
                let canvas = document.createElement('canvas')
                canvas.width = image.width;
                canvas.height = image.height;
                let context = canvas.getContext('2d');
                context.drawImage(image, 0, 0, image.width, image.height);
                let data = canvas.toDataURL('image/png'); // 得到图片的base64编码数据
                obj.url = data;
                that.downLoadFile(obj);
            }
            image.src = obj.url;
        } else {
            this.downLoadFile(obj);
        }
    },
    timeToHours(startDateTime, endDateTime) {
        /**
         * 计算时间差
         * @param startDateTime
         * @param endDateTime
         * @returns {string}
         * @constructor
         */
        let date3 = endDateTime - startDateTime;
        let hours = date3 / (3600 * 1000);
        return hours.toFixed(1);
    },
    getTime(time) {
        /**
         * 手机端兼容ios获取时间戳
         * @param time
         * @returns {number}
         */
        return new Date(time.replace(/-/g, "/")).getTime();
    },

    isArray(o){
        return Object.prototype.toString.call(o)== '[object Array]';
    },

    fastSort(arr, fn) {
        /**
         * 快速排序
         * @param arr
         * @param fn
         * @returns {*[]}
         */
        let center = arr[0];
        let len = arr.length;
        let left = [];
        let right = [];
        let i = 1;
        for (; i < arr.length; i++) {
            if (fn(center, arr[i])) {
                left.push(arr[i]);
            } else {
                right.push(arr[i]);
            }
        }
        if (left.length > 1) {
            left = this.fastSort(left, fn);
        }
        if (right.length > 1) {
            right = this.fastSort(right, fn);
        }
        return left.concat(center, right);
    },
    isEmpty(value) {
        /**
         * 判断字符串是不是空
         * @param value
         * @returns {boolean}
         */
        return value.trim().replace(/(^s*)|(s*$)/g, "").length == 0;
    },
    isInAndroid() {
        /**
         * 判断是不是安卓手机如果是返回ture，否则返回false
         * @param value
         * @returns {boolean}
         */
        let ua = navigator.userAgent;
        return ua.indexOf("Android") > -1 || ua.indexOf("Adr") > -1;
    },
    excludeSpecial(s) {  
        // 去掉转义字符  
        s = s.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');  
        // 去掉特殊字符  
        s = s.replace(/[\@\#\$\%\^\&\*\{\}\:\"\L\<\>\?]/);  
        return s;  
    },
    pickerType(type, value) {
        switch (type) {
            case "year":
                return `${value}年`;
            case "month":
                return `${value}月`;
            case "day":
                return `${value}日`;
            case "hour":
                return `${value}时`;
            case "minute":
                return `${value}分`;
        }
        return value;
    },
    /**
     * 附件上传
     * @param files
     * @returns {boolean}
     */
    fileUploader(files, callback) {
        let url = api.fileUploder_oss;
        if (!api.isLan) {
            url = api.fileUploder;
            this.upload(url, { file: files.file }, files.file.name, callback);
            return;
        }
        let obj = {
            bucketName: "mvw-develop",
            basePath: "kevintest",
            fileName: files.file.name
        };
        this.ajax({
            url: url,
            method: "post",
            data: obj,
            success: res => {
                console.log(res);
                let _formData = new FormData();
                _formData.append("OSSAccessKeyId", res["accessKeyId"]);
                _formData.append("policy", res["policy"]);
                _formData.append("Signature", res["signature"]);
                _formData.append("key", res["key"]);
                _formData.append("success_action_status", "201");
                _formData.append("file", files.file);
                this.upload(res.action, _formData, files.file.name, callback);
            }
        });
        // 文件上传
    },
    upload(url, obj, name, callback) {
        this.ajax({
            url: url,
            method: "post",
            processData: false,
            contentType: false,
            data: obj,
            success: (res) => {
                let a = new x2js().xml2js(res).PostResponse;
                console.log(a);
                let json = {
                    url: a.Location,
                    name: name,
                    ETag: a.ETag
                };
                callback(json);
            }
        });
    },
    imagePreview(images, position, timer) {
        /**
         * 显示附件、图片进行预览，文件进行下载
         * @param images {array}
         * @param position
         * @param timer
         */
        const instance = ImagePreview({
            images,
            asyncClose: !!timer,
            startPosition: typeof position === "number" ? position : 0
        });

        if (timer) {
            setTimeout(() => {
                instance.close();
            }, timer);
        }
    },
    checkSuffix(fileName) {
        /**
         * 检查是不是图片
         * @param fileName
         * @returns {boolean}
         */
        const imgSuffixs = ["bmp", "jpg", "jpeg", "png", "gif"];
        const index = fileName.lastIndexOf(".");
        const suffix = fileName.substr(index + 1).toLowerCase();

        if (!suffix) {
            return false;
        }
        return imgSuffixs.includes(suffix);
    },
    getPrams(url) {
        let objStr = url.split("?")[1];
        let objArr = objStr.split("&");
        let params = {};
        objArr.forEach(item => {
            let key = item.split("=")[0];
            let val = item.split("=")[1];
            if (!params.hasOwnProperty([key])) {
                params[key] = val;
            }
        });
        return params;
    }
};