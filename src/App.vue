<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "App",
    components: {},
    methods: {
      back() {
        // this.$router.go(-1);
      },
      keyboar(res) { // 监听安卓软键盘弹出收起
        if (typeof Elf.AppCallWeb != "undefined") {
          if (this.$store.state.keyBoardCode !== res) {
            this.$store.state.keyBoardCode = res;
            let layout_content = document.querySelector(".layout_content");
            if (res) { // 处理软键盘遮盖输入框文本问题
              layout_content.style.bottom = "16rem";
            } else {
              layout_content.style.bottom = "0";
            }
          }
        }
      }
    },
    watch:{
      // $route(to,from){
      //   if(to.path != '/Home') {
      //     debugger
      //     this.webApp.WebCallApp("TabbarHiddent", {}, (res) => {});
      //   } else {
      //     this.webApp.WebCallApp("TabbarShow", {}, (res) => {});
      //   }
      // }
    },
    created() {
      this.WebBack.push(this.back);
      this.Keyboar.push(this.keyboar);
      let humanId = this.utils.getCookie("X-MVW-userID");
      let url = window.location.href;
      let reg = new RegExp('https://newzp')
      if ( reg.test(url) ){
        this.$store.state.jumpAdress[360] = "https://360.mvwchina.com/phone-uas/360Debug.html?" + "token=" + this.utils.getCookie("previous-token");
      } else {
        this.$store.state.jumpAdress[360] = "http://192.168.8.183/360app/#/AssessContent?humanId=" + humanId;
      }
    }
  };
</script>

<style>
  html, body {
    background: #f0f0f0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: .875rem;
    margin-top: 2.5rem;
  }
</style>
