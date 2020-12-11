<template>
  <div v-if="modules">
    <div class="module" v-for="(module, inx) in modules" :key="inx">
      <div class="module_title">{{ module.title }}</div>
      <div class="rowWarp">
        <div
          v-for="(rows, index) in module.columns"
          class="swipeList"
          :key="index"
          :style="{ left: leftFn(index) }"
          @click="href(rows)"
        >
          <p :class="rows.icon"></p>
          <span>{{ rows.name }}</span>
        </div>
      </div>
    </div>
    <van-dialog
      v-model="skillsTestModel"
      title="请选择机构"
      show-cancel-button
      @confirm="goSkillsTest(skillsTestModel)"
    >
      <div style="height:10rem;padding:.8rem">
        <van-radio-group v-model="institutionId">
          <van-radio
            v-for="(item, index) in $store.state.institutionId"
            :name="item.caId"
            :key="index"
            >{{ item.name }}
          </van-radio>
        </van-radio-group>
      </div>
    </van-dialog>
  </div>
</template>

<script>
/*首页导航菜单组件*/
export default {
  name: "HomeMenu",
  components: {},
  data() {
    return {
      skillsTestModel: false,
      institutionId: null
    };
  },
  methods: {
    href(hrefData) {
      console.log(hrefData);
      let type = hrefData.type;
      if (type === "inside") {
        this.$router.push({
          name: hrefData.path,
          query: hrefData.query,
          params: hrefData.params
        });
      } else if (type == "skillsTest") {
        if (
          this.utils.isArray(this.$store.state.institutionId) &&
          this.$store.state.institutionId.length > 0
        ) {
          this.institutionId = this.$store.state.institutionId[0].caId;
          this.skillsTestModel = true;
        } else {
          this.goSkillsTest();
        }
      } else if (type === "build") {
        this.Toast("模块正在建设中");
      } else if (type === "external") {
        //技能考试考试
        // 原来直接跳360，现在改成调用app方法直接新开一个页面放360
        this.goExternal(hrefData);
      } else if (type === "Mini-cex") {
        //Mini-cex
        this.goMiniCex(hrefData);
      } else if (type === "new360") {
        console.log(this.$store.state.jumpAdress[hrefData["path"]]);
        this.webApp.WebCallApp("CmdOpenUrl", {
          url: this.$store.state.jumpAdress[hrefData["path"]]
        });
      }
    },
    leftFn(i) {
      return i * 22 + "%";
    },
    goSkillsTest(institutionId) {
      let url = window.location.href;
      if (url.indexOf("yth") != -1) {
        this.webApp.WebCallApp("CmdOpenUrl", {
          url:
            "https://yth.mvwchina.com/osceapp?instituteIds=" +
            (this.institutionId || this.$store.state.institutionId)
        });
      } else {
        this.webApp.WebCallApp("CmdOpenUrl", {
          url:
            "http://testing.imed.org.cn/osceapp?instituteIds=" +
            (this.institutionId || this.$store.state.institutionId)
        });
      }
    },
    goExternal(hrefData) {
      this.utils.ajax({
        url: this.api.tag360,
        method: "GET",
        data: {
          userId: this.utils.getCookie("X-MVW-userID")
        },
        success: data => {
          if (data.success) {
            if (!data.body.auth) {
              this.Toast("您暂无360系统权限");
            } else {
              console.log(this.$store.state.jumpAdress[hrefData["path"]]);
              this.webApp.WebCallApp("CmdOpenUrl", {
                url: this.$store.state.jumpAdress[hrefData["path"]]
              });
            }
          } else {
            this.Toast(data.msg);
          }
        }
      });
    },

    goMiniCex(hrefData) {
      this.utils.ajax({
        url: this.api.Mini_cex,
        method: "GET",
        data: {
          userId: this.utils.getCookie("X-MVW-userID")
        },
        success: data => {
          console.log(data);
          if (data.success) {
            if (!data.data.auth) {
              this.Toast("您暂无Mini-cex/Dops系统权限");
            } else {
              this.webApp.WebCallApp("CmdOpenUrl", {
                url: this.$store.state.jumpAdress[hrefData["path"]]
              });
            }
          } else {
            this.Toast(data.msg);
          }
        }
      });
    }
  },
  created() {},
  props: ["modules"],
  mounted() {
    console.log(this.modules);
  }
};
</script>

<style scoped>
.module_title {
  font-size: 1rem;
  text-align: left;
  padding: 0.5rem 0.9rem;
  height: 1.5rem;
  line-height: 1.5rem;
  border-bottom: 0.07rem solid #ddd;
}

.rowWarp {
  padding: 0.4rem 0;
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
  margin-top: 0.4rem;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: center;
  white-space: nowrap;
}

.rowWarp::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}
</style>
