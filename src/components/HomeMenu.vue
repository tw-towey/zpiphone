<template>
  <div v-if="modules">
    <div class="module" v-for="module in modules">
      <div class="module_title">{{module.title}}</div>
      <div class="rowWarp">
        <div v-for="(rows, index) in module.columns" class="swipeList" :style="{left: leftFn(index)}"
             @click="href(rows)">
          <p :class="rows.icon"></p>
          <span>{{rows.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /*首页导航菜单组件*/
  export default {
    name: "HomeMenu",
    components: {},
    data() {
      return {};
    },
    methods: {
      href(hrefData) {
        let type = hrefData.type;
        if (type === "inside") {
          this.$router.push({ name: hrefData.path, query: hrefData.query, params: hrefData.params });
        } else if (type === "build") {
          this.Toast("模块正在建设中");
        } else if (type === "external") {
          // 原来直接跳360，现在改成调用app方法直接新开一个页面放360
          // window.location.href = this.$store.state.jumpAdress[hrefData["path"]] + "?token=" + this.utils.getCookie("previous-token");
          this.webApp.WebCallApp("CmdOpenUrl", {url: this.$store.state.jumpAdress[hrefData["path"]] + "?token=" + this.utils.getCookie("previous-token")});
        }
      },
      leftFn(i) {
        return i * 22 + "%";
      }
    },
    created() {

    },
    props: ["modules"]
  };
</script>

<style scoped>
  .module_title {
    font-size: 1rem;
    text-align: left;
    padding: .5rem .9rem;
    height: 1.5rem;
    line-height: 1.5rem;
    border-bottom: .07rem solid #ddd;
  }

  .rowWarp {
    padding: .4rem 0;
    overflow-x: auto;
    height: 4.6rem;
    position: relative;
    -webkit-overflow-scrolling: touch;
  }

  .swipeList {
    display: inline-block;
    position: absolute;
    width: 22%;
    /*height: 3.9rem;*/
  }

  .swipeList p {
    width: 3rem;
    height: 3rem;
    margin: 0 auto;
  }

  .swipeList span {
    display: inline-block;
    width: 100%;
    margin-top: .4rem;
    text-align: center;
  }

  .rowWarp::-webkit-scrollbar { /*隐藏滚轮*/
    display: none;
  }
</style>
