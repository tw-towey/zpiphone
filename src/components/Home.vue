<template>
  <div v-if="!isJump">
    <van-nav-bar title="教学管理" fixed border class="header"></van-nav-bar>

    <img v-if="isTourist" class="tourist" @click="Toast('无权限')" src="../assets/images/home/pic20190424.jpg">

    <div v-else class="layout_content">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div v-if="showModel" class="homeWarp">
          <div v-if="rolesShow" class="module roles">
            <van-cell :title="show?'选择角色':'当前角色 :'" is-link :arrow-direction="show?'down':''"
                      :value="show?'':currentName"
                      @click="showChangeList"/>

            <ul v-if="show" class="rolesUl">
              <li class="rolesList" v-for="lis in columns" v-model="lis.key" @click="changeRole(lis.key)">{{lis.text}}
              </li>
            </ul>
          </div>

          <HomeMenu :modules="modules"></HomeMenu>

          <HomeRotation v-if="!rolesShow"></HomeRotation>

          <HomeActive></HomeActive>
        </div>
        <div v-if="refreshText" class="refreshWarp">加载失败请下拉刷新</div>
        <div v-if="show" class="van-overlay" @click="hideMask"></div>

      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
  import HomeMenu from "@/components/HomeMenu";
  import HomeRotation from "@/components/HomeRotation";
  import HomeActive from "@/components/HomeActive";

  /*首页*/
  export default {
    name: "Home",
    components: {
      "HomeMenu": HomeMenu,
      "HomeRotation": HomeRotation,
      "HomeActive": HomeActive
    },
    data() {
      return {
        currentName: "",
        isJump: false,
        userInfo: {},
        show: false,
        isTourist: false,
        rolesShow: false,
        showModel: false,
        isLoading: false,
        refreshText: false,
        columns: [],
        modules: []
      };
    },
    methods: {
      login() {
        if (process.env.NODE_ENV === "production") {
          this.webApp.WebCallApp("GetAPPVersion", {}, (result) => {
            if (result.result.touristsState == "1") {
              this.isTourist = true;
            } else {
              this.getUserInfo();
            }
          });
        } else {
          this.utils.ajax({
            // url: this.api.login + "?usn=zyyk123",
            // url: this.api.login + "?usn=13200000165",
            //  url: this.api.login + "?usn=13200000222",
            // url: this.api.login + "?usn=13921109806",
            // url: this.api.login + "?usn=ldh12345",
            // url: this.api.login + "?usn=zpzhang",
            url: this.api.login + "?usn=17777777771", // 学员
            success: () => {
              this.isLoading = false;
              this.getUserInfo();
            },
            error: this.onError,
            catch: this.onError
          }, true);
        }
        if (!this.$store.state.departmentList) {
          this.getDepartmentList();
        }
      },
      getUserInfo() {
        this.utils.ajax({
          method: "post",
          url: this.api.userInfo,
          success: (data) => {
            console.log(data,'aaaaa');
            
            this.$store.state.userInfo = data;
            this.userInfo = data;
            this.columns = [];
            let roleCodes = [];
            data.roleVOs.forEach(code => roleCodes.push(code.code));
            this.$store.state.roleList.forEach(item => {
              if (roleCodes.indexOf(item.key) > -1) {
                let obj = {
                  key: item.key,
                  text: item.value
                };
                this.columns.push(obj);
              }
            });
            console.log(this.userInfo.currentRole.code,'oooo');
            
            this.currentName = this.utils.getValueByKey(this.$store.state.roleList, this.userInfo.currentRole.code);
            this.modules = this.$store.state[this.userInfo.currentRole.code + "Modules"];
            this.rolesShow = this.userInfo.currentRole.code === "student" ? false : true;
            this.showModel = true;
            this.isLoading = false;
            this.refreshText = false;
          },
          error: this.jumpAdress,
          catch: this.onError
        }, true);
      },
      changeRole(curRole) {
        this.show = false;
        this.utils.ajax({
          method: "post",
          url: this.api.changeRole,
          data: { roleCode: curRole },
          success: (data) => {
            this.getUserInfo();
          }
        }, true);
      },
      showChangeList() {
        this.show = !this.show;
      },
      hideMask() {
        this.show = false;
      },
      onRefresh() {
        this.login();
      },
      onError(err) {
        this.isLoading = false;
        this.refreshText = true;
        err.error = err.error || "网络异常";
        this.Toast(err.error);
      },
      jumpAdress(err) {
        this.isJump = true;
        // 原来直接跳360，现在改成调用app方法直接新开一个页面放360

        this.Toast.loading({
          mask: true,
          message: "加载中...",
          duration: 0
        });
        setTimeout(() => {
          this.Toast.clear();
          window.location.href = this.$store.state.jumpAdress[360] + "?token=" + this.utils.getCookie("previous-token") + "&onlyYou=1";
        },1500);
        // this.webApp.WebCallApp("CmdOpenUrl", {url: this.$store.state.jumpAdress[360] + "?token=" + this.utils.getCookie("previous-token")});
      },
      refresh() {
        this.login();
      },
      getDepartmentList() {
        this.utils.ajax({
          method: "POST",
          url: this.api.queryAllDepartments,
          success: data => {
            if (data) {
              data.forEach(item => {
                item.key = item.caId;
                item.value = item.name;
              });
              this.$store.state.departmentList = data;
            }
          }
        }, true);
      }
    },
    created() {
      this.login();
    }
  };
</script>

<style scoped>
  .homeWarp {
    min-height: 94vh;
  }

  .tourist {
    width: 100%;
    height: 100%;
  }

  .rolesList {
    text-align: center;
    line-height: 2.5rem;
  }

  .roles .van-cell--clickable:active {
    background: #fff;
  }

  .roles {
    z-index: 1000;
  }

  .roles {
    position: relative;
  }

  .rolesUl {
    width: 100%;
    position: absolute;
    top: 2.7rem;
    background: #fff;
  }

  .rolesUl li {
    border-top: .07rem solid #ddd;
  }

  .activity .van-cell__title span, .roles .van-cell__title span {
    font-size: 1rem;
  }

  .refreshWarp {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    padding: 50% 0;
  }
</style>
