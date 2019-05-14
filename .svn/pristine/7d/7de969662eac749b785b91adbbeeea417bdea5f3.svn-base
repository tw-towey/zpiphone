import axios from "axios";
import { Toast, ImagePreview } from "vant";
import store from "@/store/index";
import x2js from "x2js";
import api from "@/api/index";

export default {
  getValueByKey(list, key) {
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      if (item.key == key) {
        return item.value;
      }
    }
  },
  getKeyByValue(list, key) {
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      if (item.value == key) {
        return item.key;
      }
    }
  },
  goBack(that) {
    /**
     * 返回上一页
     */
    // that.$route.meta.keepAlive = true; // 用于上一页缓存
    that.$router.go(-1);
  },
  trim(text) {
    /**
     * 去除首位空格
     */
    return text == null ? "" : (text + "").replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  },
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
  ajax(options, isFlag) {
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
        duration: 0
      });
    }
    options.data = options.data || {};
    axios(options).then(res => {
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
        if (options.catch) {
          options.catch && options.catch(error);
        } else {
          Toast(error.message);
        }
      }
    );
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
  downLoadFile(obj) {
    const a = document.createElement("a");
    const e = document.createEvent("MouseEvents");
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.download = obj.name || new Date();
    a.href = decodeURIComponent(obj.url);
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
      image.setAttribute("crossOrigin",'Anonymous')
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
      success: res => {
        let a = new x2js().xml2js(res).PostResponse;
        console.log(a);
        let json = {
          url: a.Location,
          name: name
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
