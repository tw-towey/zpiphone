<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view :class="homeRouter ? 'Router' : ''"></router-view>
    </transition>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      transitionName: "routerClass-right",
      homeRouter: false
    };
  },
  methods: {
    back() {
      if(this.$route.path == "/Home" || this.$route.path == "/" || this.$route.path == "/index.html"){
        this.webApp.WebCallApp("CmdGoBack");
      }else{
        this.$router.go(-1);
      }
    },
    keyboar(res) {
      // 监听安卓软键盘弹出收起
      if (typeof Elf.AppCallWeb != "undefined") {
        if (this.$store.state.keyBoardCode !== res) {
          this.$store.state.keyBoardCode = res;
          let layout_content = document.querySelector(".layout_content");
          if (res) {
            // 处理软键盘遮盖输入框文本问题
            layout_content.style.bottom = "16rem";
          } else {
            layout_content.style.bottom = "0";
          }
        }
      }
    }
  },
  watch: {
    $route(to, from) {
      if (to.path != "/Home") {
        this.homeRouter = true;
        this.webApp.WebCallApp("TabbarHiddent", {}, res => {});
      } else {
        this.webApp.WebCallApp("TabbarShow", {}, res => {});
      }
      let isBack = this.$router.isBack; //  监听路由变化时的状态为前进还是后退

      if (isBack) {
        this.transitionName = "routerClass-right";
      } else {
        this.transitionName = "routerClass-left";
      }
      this.$router.isBack = false;
    }
  },
  created() {
    window.onload = () => {
      this.$store.state.wonload = true;
      this.$store.state.firstLoad++;
    };
    this.WebBack.push(this.back);
    this.Keyboar.push(this.keyboar);
    
  },
  mounted() {
    let humanId = this.utils.getCookie("X-MVW-userID");
    /**
     * 线上 yth.mvwchina.com
     * 预发布 yfb.mvwchina.com
     * 测试 192.168.8.209:8400
     */
    let url = window.location.href;
    let reg = new RegExp("mvwchina");
    /**
     * 这里是根据url判断各种环境下 技能评分、360、Mini_cex 跳转路径设置;
     */
    setTimeout(() => {
        if (reg.test(url)) {
        if (url.indexOf("yth.mvwchina") != -1) {
            this.$store.state.jumpAdress["360"] = "https://yth.mvwchina.com/360app/#/?humanId=" + humanId;
            this.$store.state.jumpAdress["Mini_cex"] = "https://yth.mvwchina.com/miniCex-phone/";
            this.$store.state.jumpAdress["new360"] = "https://yth.mvwchina.com/360newapp/?userId=" + humanId + "&instituteId=" + this.$store.state.institutionId
            this.$store.state.jumpAdress["skillsTest"] = "https://yth.mvwchina.com/osceapp?instituteIds=" + this.$store.state.institutionId;
            if(!this.$store.state.institutionId){
                this.$store.state.jumpAdress["skillsTest"] = "http://testing.imed.org.cn/osceapp";
            }else{
                this.$store.state.jumpAdress["skillsTest"] = "http://testing.imed.org.cn/osceapp?instituteIds=" + this.$store.state.institutionId;
            }
        } else {
            this.$store.state.jumpAdress["360"] = "https://yfb.mvwchina.com/360app/#/?humanId=" + humanId;
            this.$store.state.jumpAdress["Mini_cex"] = "https://yfb.mvwchina.com/miniCex-phone/";
            this.$store.state.jumpAdress["new360"] = "https://yfb.mvwchina.com/360newapp/?userId=" + humanId + "&instituteId=" + this.$store.state.institutionId
            if(!this.$store.state.institutionId){
                this.$store.state.jumpAdress["skillsTest"] = "http://testing.imed.org.cn/osceapp";
            }else{
                this.$store.state.jumpAdress["skillsTest"] = "http://testing.imed.org.cn/osceapp?instituteIds=" + this.$store.state.institutionId;
            }
        }
        } else {
            // this.$store.state.jumpAdress['360'] = "http://testing.imed.org.cn/360de_uas_ui_v2.0/phone-uas/360Debug.html?token=" + this.utils.getCookie("previous-token");
            // 一体化3.0
            this.$store.state.jumpAdress["360"] = "http://testing.imed.org.cn/360app/#/?humanId=" + humanId;
            this.$store.state.jumpAdress["Mini_cex"] = "http://testing.imed.org.cn/cexPhone/";
            this.$store.state.jumpAdress["new360"] = "http://testing.imed.org.cn/360newapp/?userId=" + humanId + "&instituteId=" + this.$store.state.institutionId 
            if(!this.$store.state.institutionId){
                this.$store.state.jumpAdress["skillsTest"] = "http://testing.imed.org.cn/osceapp";
            }else{
                this.$store.state.jumpAdress["skillsTest"] = "http://testing.imed.org.cn/osceapp?instituteIds=" + this.$store.state.institutionId;
            }
        }
    },1000)
  }
};
</script>

<style>
html,
body {
  background: #f0f0f0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 0.875rem;
  margin-top: 2.5rem;
}

.Router {
  position: absolute;
  /* width: 100%; */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: all 0.3s ease;
}

.routerClass-left-enter,
.routerClass-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}

.routerClass-left-leave-active,
.routerClass-right-enter {
  opacity: 0;
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100% 0);
}
</style>
