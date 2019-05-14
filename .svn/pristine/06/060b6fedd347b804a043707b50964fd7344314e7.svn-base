import axios from "axios";
import { Toast,ImagePreview } from "vant";
import {
  AppCallBacks,
  AppCommendBackHandlers,
  AppCommendKeyboardBounceUp,
  AppMsgHandlers
} from './AppMsgHandlers'

export default {
  /***********************************************************
   处理App发送的后退命令
  ***********************************************************/
  APPCommendBack() {
    if (AppCommendBackHandlers.length > 0) {
      if (typeof AppCommendBackHandlers[AppCommendBackHandlers.length - 1] == "function") {
        AppCommendBackHandlers[AppCommendBackHandlers.length - 1].call(window);
      }
    } else {
      if (this.isInApp()) {
        if (!this.isEmptyObject(AppCallBacks)) {
          //Elf.components.toast({text:""});
        } else {
          this.WebCallApp("CmdGoBack");
        }
      } else {
        history.back(-1);
      }
    }
  },
  WebCallApp(command,args,callback,context) {
    if (typeof Elf.AppCallWeb != "undefined") {
      context = context || window;//默认为window对象
      args = args || {};
      let  sn = null;
      //IOS调用相机--sn特殊处理
      if (command == "callCamera") {
        sn = "examCamera";
      } else {
        sn = this.getSerialNumber();//请求App统一加水单号
      }
      let params = {
        args: args,
        command: command
      };
      //绑定回调函数
      if (callback) {
        AppCallBacks[sn] = {
          callback: callback,
          context: context
        };
      }
      if (window.webkit && window.webkit.messageHandlers) {
        //IOS
        params.sn = sn;
        window.webkit.messageHandlers["WebCallApp"].postMessage(JSON.stringify(params));
      } else if (Elf.WebCallApp) {
        //Android
        params.sn = sn;
        Elf.WebCallApp(JSON.stringify(params));
      } else if (this.isInCef()) {
        params.sn = sn;
        Elf.WebCallCef(JSON.stringify(params));
      } else {
        //直连接口服务器
        // if (Config.services[command]) {
        //   args.token = User.token;
        //   if (command == "UserLogin") {
        //     args.token = -1;
        //   }
        //   var request = {
        //     terminalType: "A",
        //     deviceType: "1",
        //     serviceModule: Config.services[command].sm,
        //     serviceNumber: Config.services[command].sn,
        //     token: command == "UserLogin" ? "-1" : User.token,
        //     args: args
        //   };
        //   options.data = request;
        //   options.method = 'post';
        //   options.url = process.env.root;
        //   options.dataType = 'json';
        //   axios(options).then(res => {
        //     Elf.AppCallWeb(sn,data);
        //     Toast.clear();
        //   }).catch(
        //     error => {
        //       var errorData = { opFlag: false,errorMessage: "总线错误" };
        //       Elf.AppCallWeb(sn,JSON.stringify(errorData),"JSON");
        //     }
        //   );
        // }
      }
    }
  },
  AppCommendTostInfo(result){
    if(result.msg){
      Toast(result.msg);
    }
  },
  /***********************************************************
    App Call Web 入口方法，
    All of app to web use that
  ***********************************************************/
  isInApp() {
    if (typeof Elf.AppCallWeb != "undefined") {
      return !!((window.webkit && window.webkit.messageHandlers) || typeof Elf.WebCallApp == "function" || typeof Elf.WebCallCef == "function");
    }
  },
  isInIOS() {
    return window.webkit && window.webkit.messageHandlers;
  },
  isInAndroid() {
    if (typeof Elf.AppCallWeb != "undefined") {
      return typeof Elf.WebCallApp == "function";
    }
  },
  isInCef() {
    if (typeof Elf.AppCallWeb != "undefined") {
      return typeof Elf.WebCallCef == "function";
    }
  },
  isEmptyObject() {
    let name;
    for (name in obj) {
      return false;
    }
    return true;
  },
  UUID(len,radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],
      i;
    radix = radix || chars.length;
    if (len) {
      for (i = 0; i < len; i++) {
        uuid[i] = chars[0 | Math.random() * radix];
      }
    } else {
      var r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  },
  getSerialNumber() {
    var uuid = this.UUID(3,8);
    return new Date().format("yyyyMMddhhmmssS") + uuid;
  },
}
