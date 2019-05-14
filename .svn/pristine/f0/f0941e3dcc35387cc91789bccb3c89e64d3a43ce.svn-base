import webApp from './index'
/*
 *
 * app对接
 * 移动端种植Elf对象
 * window => Elf
 * 
 */
(function () {
  if (!window.applicationCache&&typeof(Worker)=='undefined') {
    alert("E001-检测到您的环境不支持HTML5，程序终止运行！");//不支持HTML5
    return;
  }
  
  var global = window;//create a pointer to the window root
  if (typeof Elf === 'undefined') {
      global.Elf = {};//create elf root if not existed
  }
  Elf.global = global;//add a pointer to window
})();

Date.prototype.format = function(format) {
  var o = {
      "M+": this.getMonth() + 1, //month 
      "d+": this.getDate(), //day 
      "h+": this.getHours(), //hour 
      "m+": this.getMinutes(), //minute 
      "s+": this.getSeconds(), //second 
      "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
      "S": this.getMilliseconds() //millisecond 
  };
  if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
  }
  return format;
};
var AppCallBacks = {},//动态数据流水列表
    AppCommendBackHandlers = [],//APP后退监听事件列表
    APPCommendBookStateHandlers = [],//下载状态监听事件列表
    AppCommendRefreshHandlers = [],//刷新监听事件列表
    APPCommendAddToBookShelfHandlers = [],//添加到书架监听事件列表
    APPCommendAddToObtainedBookHandlers = [],//添加到已获得图书列表监听
    APPCommendReBackHandlers = [],//监听重新回到页面通知
    AppCommendNetworkHandlers = [],//监听网络链接状态
    AppCommendAppStartingHandlers = [],//监听APP进入后台运行
    AppCommendAppReactivateHandlers = [],//监听APP重新进入前台运行
    AppCommendScreenShotss = [],//监听手机截屏
    AppCommendKeyboardBounceUp = [];//监听移动端软键盘事件
var AppMsgHandlers = {
  //页面加载完成（TODO plan）
  //"MsgOnReady":function(msg){},
  //图书状态通知(Realized)
  "MsgUpdateBookState": function (data) {
    if (APPCommendBookStateHandlers.length > 0) {
      APPCommendBookStateHandlers.forEach(item => {
        item.call(window,data);
      });
    }
  },
  // 移动端软键盘事件触发
  "MsgSoftKeyboardBounceUp": function (data) {
    if (AppCommendKeyboardBounceUp.length > 0) {
      AppCommendKeyboardBounceUp.forEach(item => {
        item.call(window,data);
      });
    }
  },
  //刷新数据通知(Realized)
  "MsgRefresh": function (data) {
    //data.type 0 刷新书架和已获得，1只刷新书架，2,只刷新已获得
    if (AppCommendRefreshHandlers.length > 0) {
      AppCommendRefreshHandlers.forEach(item => {
        item.call(window,data);
      });
    }
  },
  //添加到已购列表(Realized)
  "MsgAddToObtainedBook": function (data) {
    if (APPCommendAddToObtainedBookHandlers.length > 0) {
      APPCommendAddToObtainedBookHandlers.forEach(item => {
        item.call(window,data);
      });
    }
  },
  //添加到书架(Realized)
  "MsgAddToBookShelf": function (data) {
    if (APPCommendAddToBookShelfHandlers.length > 0) {
      APPCommendAddToBookShelfHandlers.forEach(item => {
        item.call(window,data);
      });
    }
  },
  //后退事件(Realized)
  "MsgGoBack": function (data) {
    webApp.APPCommendBack(data);
  },
  //重新返回到界面(Realized)
  "MsgReBack": function () {
    if (APPCommendReBackHandlers && APPCommendReBackHandlers.length > 0) {
      APPCommendReBackHandlers.forEach(item => {
        item.call(this);
      });
    }
  },
  //App 提示消息(TODO plan)
  "MsgToastInfo": function (result) {
    webApp.AppCommendTostInfo(result);
  },
  //
  "MsgNetworkState": function (result) {
    if (AppCommendNetworkHandlers && AppCommendNetworkHandlers.length > 0) {
      AppCommendNetworkHandlers.forEach(item => {
        item.call(this, result);
      });
    }
  },
  //App 后台运行
  "MsgAppStarting": function (result) {
    if (AppCommendAppStartingHandlers && AppCommendAppStartingHandlers.length > 0) {
      AppCommendAppStartingHandlers.forEach(item => {
        item.call(this, result);
      });
    }
  },
  //App重新激活
  "MsgAppReactivate": function (result) {
    if (AppCommendAppReactivateHandlers && AppCommendAppReactivateHandlers.length > 0) {
      AppCommendAppReactivateHandlers.forEach(item => {
        item.call(this, result);
      });
    }
  },
  //App截屏捕获
  "MsgAppScreenShots": function (result) {
    if (AppCommendScreenShotss && AppCommendScreenShotss.length > 0) {
      AppCommendScreenShotss.forEach(item => {
        item.call(this, result);
      });
    }
  }
};
if (typeof Elf != "undefined") {
  Elf.AppCallWeb = (sn,result) => {
    if (result && typeof result == "string") {
      result = decodeURIComponent(result.replace(/\+/g,'%20'));
      try {
        result = JSON.parse(result);//解决空格变成+的问题
      } catch (error) {
        AppCallBacks[sn].callback.call(AppCallBacks[sn].context,result);
        return;
      }
      if (result.sn) {
        AppCallBacks[sn].callback.call(AppCallBacks[sn].context,result.QrCode);
        return;
      }
    }
    if (AppCallBacks[sn]) {
      if (JSON.parse(result.opFlag)) {
        //执行对应回调
        AppCallBacks[sn].callback.call(AppCallBacks[sn].context,(typeof result.serviceResult == "string") ? JSON.parse(result.serviceResult) : result.serviceResult);
      } else {
        //接口调用返回失败信息，统一处理错误消息
        Toast(result.errorMessage ? result.errorMessage : "服务器异常！");
      }
      //调用完成删除对象
      delete AppCallBacks[sn];
    } else if (AppMsgHandlers[sn] && typeof AppMsgHandlers[sn] == "function") {
      //处理消息通知
      AppMsgHandlers[sn].call(window,result);
    }
  };
}
export {
  AppCallBacks,
  AppCommendBackHandlers,
  AppCommendKeyboardBounceUp,
  AppMsgHandlers
}

