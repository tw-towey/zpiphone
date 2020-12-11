<template>
  <div>
    <div v-if="!isJump">
      <van-nav-bar title="教学管理" fixed border class="header i-right" @click-right="onClickRight" @click-left="enterHandleClick()">
        <van-icon name="scan" slot="right" v-if="showModel" />
        <van-icon name="manager-o" slot="left" v-if="showRole" />
        <van-icon name="replay" slot="left" v-if="errorObj.isShow" />
      </van-nav-bar>
      <img v-if="isTourist" class="tourist" @click="Toast('游客无权限，请登录')" src="../assets/images/home/pic20190424.jpg" />

      <div v-else class="layout_content">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <div class="homeWarp">
            <div v-if="chooseRole" class="module roles">
              <van-cell v-if="showModel" :title="show?'身份信息':'身份信息 :'" is-link :arrow-direction="show?'down':''" :value="show?'':currentName" @click="showChangeList" />
              <InfoModule ref="Inforole" :cgroles="cgroles" :show="show" @showChangeList="cancelSelect" @changeRole="changeRole" :cgrolesstatus="cgrolesstatus"></InfoModule>

              <!-- <ul v-if="show" class="rolesUl">
                <li class="rolesList" v-for="lis in columns" v-model="lis.key" @click="changeRole(lis.key)">{{lis.text}}
                </li>
              </ul>-->
            </div>

            <HomeMenu :modules="modules"></HomeMenu>
            <HomeRotation v-if="!stuRolesShow" ref="reload1"></HomeRotation>
            <HomeActive v-if="showModel" ref="reload2"></HomeActive>
          </div>
          <div v-if="refreshText" class="refreshWarp">加载失败请下拉刷新</div>
          <div v-if="show" class="van-overlay" @click="hideMask"></div>
        </van-pull-refresh>
      </div>
      <!-- <div v-if="$store.state.showError" class="errorBox">
        <p style="overflow:auto"><van-button type="default" style="float:right" @click="()=>$store.state.showError=false" size="small">关闭</van-button></p>
        {{this.errorObj}}
      </div> -->
      <Modal :showQrCode="showQrCode" @signinKQ="signinKQ"></Modal>
    </div>
  </div>

</template>

<script>

import HomeMenu from "@/components/HomeMenu";
import HomeRotation from "@/components/HomeRotation";
import InfoModule from "@/components/InfoModule";
import HomeActive from "@/components/HomeActive";
import Modal from "@/view/singupQrCode/modal";
/*首页*/
// import Vconsole from 'vconsole'
// new Vconsole()
export default {
  name: "Home",
  components: {
    HomeMenu: HomeMenu,
    HomeRotation: HomeRotation,
    HomeActive: HomeActive,
    Modal: Modal,
    InfoModule: InfoModule
  },
  data() {
    return {
      showQrCode: {
        show: false,
        data: {},
        type: 2,
        paramsDate:''
      },
      errorObj: {
        isShow: false
      },
      currentName: "",
      timer:0,
      isJump: false,
      userInfo: {},
      show: false,
      isTourist: false,
      stuRolesShow: true,
      chooseRole: false,
      showModel: false,
      isLoading: false,
      refreshText: false,
      showRole: false,
      columns: [],
      modules: [],
      ruleData: [],
      cgroles: [],
      firstLoad: true,
      cgrolesstatus: {
        jgindex: 0,
        rgindex: 0
      },
      paramsData: ''
    };
  },
  methods: {
    enterHandleClick() {
      let url = window.location.href;
      if (this.errorObj.isShow && process.env.NODE_ENV === "production") {
        this.login();
        // if( url.indexOf("&timestamp=") !== -1){
        //   window.location.href = url.split("&timestamp=")[0] + '&timestamp=' + new Date().getTime();
        // }else{
        //   window.location.href = url + '&timestamp=' + new Date().getTime();
        // }
      } else {
        let userInfo = this.$store.state.userInfo.currentRole.code;
        if (
          userInfo == "student" ||
          userInfo == "teacher" ||
          userInfo == "mentor"
        ) {
          this.$router.push({ name: "PersonInfo" });
        }
      }
    },
    /**
     * 新增扫码功能
     *
     */
    onClickRight() {
      // this.$store.state.activitiesDetailsObj = obj;
      if (!this.showModel) {
        return;
      }
      this.webApp.WebCallApp("CmdScanQrCode", {}, res => {
        let obj = this.utils.getPrams(res);
        let params = null;

        if (obj.type == "3") {
          if (!obj.signInTime) {
            this.Toast("无效二维码");
            return;
          }
          params = {
            teacherId: obj.teacherId,
            signInTime: obj.signInTime + ":00",
            studentId: this.$store.state.userInfo.human.caId,
            type: "3"
          };
          this.signinKQ(params);
        } else if (obj.type == "2") {
          params = {
            qrCodeInfoJson: JSON.stringify(obj),
            teachingId: obj.teachingId,
            type: "2"
          };
           this.signinKQ(params);
        } else if (obj.type == "1") {
          params = {
            qrCodeInfoJson: JSON.stringify(obj),
            teachingId: obj.teachingId,
            type: "1"
          };

          this.showQrCode.paramsDate = params;
          this.utils.ajax({
            url: this.api.queryEvaluate,
            method: "post",
            data: {
              teachingId: obj.teachingId
            },
            success: res => {
              if (res.isSignOut == 1) {
                if (res.isNeedEvaluate == 1) {
                  this.$store.state.activitiesDetailsObj = { id:res.teachingId, evaluateId: res.evaluateId };
                  let callback = () => {
                    this.signinKQ(params);
                  }
                  this.showQrCode.data = res;
                  this.showQrCode.show = true;
                  this.showQrCode.callback = callback;
                } else {
                  this.signinKQ(params);
                }
              } else {
                this.signinKQ(params);
              }
            }
          });
        }
      });
    },
    signinKQ(params) {
      if (!params) {
          this.Toast("无效二维码");
          return;
      }
      this.utils.ajax({
        url: this.api.appScan,
        method: "POST",
        data: params,
        success: data => {
          switch (params.type) {
            case "1":
              this.Toast("打卡成功");
              break;
            case "2":
              this.Toast("补签成功");
              break;
            case "3":
              this.Toast("签到成功");
              break;
            default:
              break;
          }
        }
      });
    },
    /**
     * 获取机构列表
     */
    getmechanismInfo() {
      let mechanismInfo = new Promise((resole, reject) => {
        this.utils.ajax(
          {
            method: "post",
            url: this.api.getUserInstitutes,
            success: data => {
              if (this.utils.isArray(data) && data.length > 0) {
                let ruleData = [];
                let falg = false;
                data.forEach((item, index) => {
                  if (item.roles.length > 0) {
                    if (!this.$store.state.institutionId) {
                       this.$store.state.institutionId = item.caId;
                    }
                    falg = true;
                    ruleData.push(item);
                  }
                });
                if (!falg) {
                  this.onload_jump(null);
                  this.$store.state.institutionId = data;
                  this.Toast("当前用户没有角色");
                }
                this.$store.state.ruleData = ruleData;
                resole(data);
              } else {
                this.onload_jump(null);
                this.Toast("当前用户没有所属机构");
              }
            }
          },
          true
        );
      });
      return mechanismInfo;
    },
    /**
     * 判断之后展示5.0首页方法
     */
    showPageHome(data){
       this.getmechanismInfo().then(()=>{
         this.getUserInfo();
        });
    },
   /**
     * 登陆6.0
    */
    appLogin6(userInstitutes) {
      return new Promise((resole,reject)=>{
          let ids = [];
          userInstitutes.forEach((item)=>{
            if(item.caId){
              ids.push(item.caId);
            }
          });
          this.utils.ajax({
            url: this.api.appLogin,
            data:{instituteIds:ids},
            method: "post",
            institution: false,
            contentType: true,
            success: data => {
              resole(data);
            },
            catch:()=>{
              this.showPageHome();
            },
            error:()=>{
              this.showPageHome();
            }
          });
        })
    },
    /**
     * 校验5.0-6.0权限
     */
    getHomeInit(){
      var _self = this;
      this.utils.ajax({
        method: "post",
        data:{},
        url: this.api.getUserInstitutes,
        success: (res) => {
          if(res.length > 0 ){ //长度大于 0 就跳转6.0系统 不然就继续渲染5.0接口
            _self.appLogin6(res).then((res)=>{
              if(res.code === 1 && process.env.NODE_ENV === "production"){
                // window.location.href = window.location.origin + "/homepage";
                window.location.href = window.location.origin + "/ui/zp6_phone/index.html";
                // this.showPageHome();
              }else{
                this.showPageHome();
              }
            });
          }else{
              this.showPageHome();
          }
        },
      });
    },
    /**
     * 登陆接口
     */
    login() {
      let url = window.location.href.split("?")[1];
      //isBack 判断是否是6.0返回5.0 方法
      let isBack = false;
      if(url){
        isBack = url.split("=")[1]*1;
      }
      if (process.env.NODE_ENV === "production") {
        this.webApp.WebCallApp("GetAPPVersion", {}, result => {
          if (result.result.touristsState == "0") {
            if(isBack){
              this.showPageHome();
            }else{
              this.getHomeInit();
            }
          } else {
            this.isTourist = true;
          }
        });
      } else {
        this.utils.ajax(
          {
            //url: this.api.login + "?usn=zyyk123",
            // url: this.api.login + "?usn=18234046459",
            //url: this.api.login + "?usn=13855554448",
            //url: this.api.login + "?usn=18500010005",
            // url: this.api.login + "?usn=13200000222",
            // url: this.api.login + "?usn=18146501744",
            // url: this.api.login + "?usn=15200001212",
            // url: this.api.login + "?usn=医视界中医医院", //李带教
            // url: this.api.login + "?usn=ldh12345",
            url: this.api.login + "?usn=zpzhang",
            // url: this.api.login + "?usn=18222596113",
            // url: this.api.login + "?usn=13200000074", // 学员d
            // url: this.api.login + "?usn=13234461234", // xiaoba
            // url: this.api.login + "?usn=15173651821",
            // url: this.api.login + "?usn=13500001122",
            // url: this.api.login + "?usn=15800000000", // zp6老师1
            // url: this.api.login + "?usn=13269767473",
            // url: this.api.login + "?usn=15935626030",
            // url: this.api.login + "?usn=13011110074", // zp6老师1
            // url: this.api.login + "?usn=13132454326",
            
            success: () => {
              this.isLoading = false;
              this.showPageHome();
              // if(isBack){
              //   this.showPageHome();
              // }else{
              //   this.getHomeInit();
              // }
            },
            error: this.onError,
            catch: this.onError
          },
          true
        );
      }
      this.selectByType();
      if (!this.$store.state.departmentList) {
        this.getDepartmentList();
      }
    },

    /**
     * 获取用户信息
     */
    getUserInfo() {
      var _self = this;
      this.utils.ajax(
        {
          method: "post",
          url: this.api.userInfo,
          success: data => {
            this.$store.state.userInfoCaid = data.human.caId;
            this.ruleData = this.$store.state.ruleData;
            this.$store.state.userInfo = data;
            this.userInfo = data;
            this.isLoading = false;
            this.columns = [];
            let roleCodes = []; //获取本地映射的角色信息
            if (data.roleVOs.length > 0) {
              data.roleVOs.forEach(code => roleCodes.push(code.code));
            } else {
              this.Toast("当前用户没有住培角色");
              return;
            }
            this.ruleData.forEach((msm, index) => {
              _self.$store.state.roleList.forEach((item, dex) => {
                msm.roles.forEach((m, i) => {
                  if (m == item.key) {
                    let obj = {
                      key: item.key,
                      text: item.value
                    };
                    msm.roles[i] = obj;
                  }
                });
              });
            });
            _self.cgroles = _self.ruleData;
            _self.currentName = _self.utils.getValueByKey(
              this.$store.state.roleList,
              _self.userInfo.currentRole.code
            );

            _self.cgroles[0].roles.forEach((ietm, index) => {
              if (ietm.key == _self.userInfo.currentRole.code) {
                _self.cgrolesstatus.rgindex = index;
              }
            });

            this.modules = this.$store.state[
              this.userInfo.currentRole.code + "Modules"
            ];
            if(this.modules){
                this.modules = this.modules.concat(this.$store.state.childModule);
            }else{
                this.Toast("当前用户没有角色菜单");
                return;
            }
            /**
             * *******************************************************************************
             * 西南医科大学附属中医医院教学培训系统 机构id => fa5783c717ae46a28824a9d26add2c10
             * 如果是西南医科大学，对首页部分模块进行隐藏
             * 如果$store.state中的module下title字段发生改变下面逻辑中需作出相应的调整
             * *******************************************************************************
             */
            if (
              this.$store.state.institutionId ==
              "fa5783c717ae46a28824a9d26add2c10"
            ) {
              let index = null;
              let modules_temp = [...this.modules];
              modules_temp.forEach(i => {
                if (i.title == "过程管理") {
                  this.modules = [i];
                  i.columns.forEach((item, i) => {
                    if (item.name == "登记手册") {
                      index = i;
                    }
                  });
                }
              });
              if (index) {
                this.modules[0].columns.splice(index, 1);
              }
            }
            _self.stuRolesShow =
              this.userInfo.currentRole.code === "student" ? false : true;
            let userInfoCode = this.userInfo.currentRole.code;
            if (
              userInfoCode == "teacher" ||
              userInfoCode == "mentor" ||
              userInfoCode == "student"
            ) {
              this.showRole = true;
            } else {
              this.showRole = false;
            }
            if (!_self.firstLoad) {
              setTimeout(() => {
                if (!_self.stuRolesShow) {
                  _self.$refs.reload1.getRotation();
                }
                _self.$refs.reload2.onLoad();
              }, 0);
            }
            if (
              _self.ruleData.length > 1 ||
              this.userInfo.currentRole.code !== "student"
            ) {
              this.chooseRole = true;
            }
            this.showModel = true;
            this.refreshText = false;
            this.Toast.clear();
          },
          error: this.onload_jump
        },
        true
      );
    },
    changeRole(curRole) {
      this.show = false;
      this.Toast.loading({
        mask: true,
        message: "加载中...",
        duration: 0
      });
      this.utils.ajax(
        {
          method: "post",
          url: this.api.changeRole,
          data: { roleCode: curRole },
          success: data => {
            this.firstLoad = false;
            this.isLoading = false;
            this.getUserInfo();
          }
        },
        true
      );
    },
    cancelSelect() {
      this.show = !this.show;
    },
    showChangeList() {
      this.$refs.Inforole.init();
      this.show = !this.show;
    },
    hideMask() {
      this.show = false;
    },
    onRefresh() {
      this.login();
    },
    onError(err) {
      this.errorObj.isShow = true;
      this.isLoading = false;
      this.refreshText = true;
      err.error = err.error || "网络异常";
      this.Toast(err.error);
    },
    onload_jump(err) {
      this.errorObj.isShow = true;
      // this.showRole = true;
      this.errorObj.err = err;
      this.modules = [this.$store.state.childModule];
      this.isLoading = false;
      // if (this.$store.state.wonload) {
      //   this.jumpAdress();
      //   return;
      // }
      // setTimeout(() => {
      //   this.onload_jump(err);
      // }, 30);
    },
    jumpAdress(err) {
      this.isJump = true;
      // 原来直接跳360，现在改成调用app方法直接新开一个页面放360
      this.Toast.loading({
        mask: true,
        message: "加载中...",
        duration: 0
      });
      window.location.href = this.$store.state.jumpAdress[360] + "&onlyYou=1";
      // setTimeout(() => {
      //   this.Toast.clear();
      //   window.location.href = this.$store.state.jumpAdress[360] + "&onlyYou=1";
      // },1500);
      // this.webApp.WebCallApp("CmdOpenUrl", {url: this.$store.state.jumpAdress[360] + "?token=" + this.utils.getCookie("previous-token")});
    },
    refresh() {
      this.login();
    },
    getDepartmentList() {
      this.utils.ajax(
        {
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
        },
        true
      );
    },
    selectByType() {
      this.utils.ajax(
        {
          method: "POST",
          data:{
            type:"teachingType"
          },
          url: this.api.selectByType,
          success: data => {
            if (data) {
              data.forEach(item => {
                item.key = item.key;
                item.value = item.value;
              });
              this.$store.state.activitiesType = data;
            }
          }
        },
        true
      );
    },
    goLogin() {
      if (this.$store.state.wonload) {
        this.login();
      } else {
        setTimeout(() => {
          this.goLogin();
        }, 100);
      }
    }
  },
  mounted() {},
  created() {
     this.goLogin();
  }
};
</script>

<style scoped>
.homeWarp {
  min-height: 94vh;
}
.i-right .van-nav-bar__left {
  font-size: 1.5rem !important;
}
.i-right .van-nav-bar__right {
  font-size: 1.5rem !important;
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
  border-top: 0.07rem solid #ddd;
}

.activity .van-cell__title span,
.roles .van-cell__title span {
  font-size: 1rem;
}
.errorBox {
  position: absolute;
  padding: 0.5rem;
  z-index: 15515111;
  background: #fff;
  height: 91%;
  overflow: auto;
}
.refreshWarp {
  width: 100%;
  margin: 0 auto;
  text-align: center;
  padding: 50% 0;
}
</style>
