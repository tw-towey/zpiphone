<template>
  <div>
    <van-nav-bar title="活动详情" class="header" fixed left-arrow @click-left="onClickLeft" />
    <div class="layout_content">
      <div>
        <div class="heade back-box">
          <van-cell-group>
            <van-cell title="活动名称：" :value="applyList.title" />
            <van-cell title="活动时间：" :value="utils.formatDate(applyList.startTime,'yyyy-MM-dd HH:mm') + ' ~ ' +  utils.formatDate(applyList.endTime,'yyyy-MM-dd HH:mm') " />
            <!-- <van-cell title="'主讲人：'" :value="applyList.speaker" /> -->
            <div class="van-cell"><span> 主&nbsp;&nbsp;讲&nbsp;&nbsp;人：</span> <div class="van-cell__value">{{applyList.speaker}}</div> </div>
            <van-cell title="活动地点：" :value="applyList.locationOfTeaching" />
            <van-cell title="报名人数：" :value="applyList.numOfSignUp" />
            <van-cell title="签到时间" :value="applyList.signInDate" />
            <van-cell title="签退时间" :value="applyList.signOutDate" />
            <div class="van-cell" v-if="isNeedEvaluate"><span> 评价状态：</span> <div @click="goSubAnswer" class="van-cell__value"  v-html="isNeedEvaluate"></div> </div>
          </van-cell-group>
        </div>
        <div class="back-box">
          <div class="h3title">
              <h3>活动详情</h3>
          </div>
          <ul class="h3title">
            <li>
              <div v-html='applyList.detail'></div>
            </li>
            <!-- <li>
              <div class="pwith" v-for="(i,index) in applyList.attachmentList" :key="index">
                <p @click="showAttachment(i,index)">{{i.name}}</p>
              </div>
            </li> -->
          </ul>
        </div>
        <div class="back-box">
            <div class="h3title"><h3>课件</h3></div>
            <van-cell-group>
                <van-cell :title="img.name"  v-for="(img,index) in applyList.attachmentListType1" :key="index" is-link @click="showfile(img.path)"/>
            </van-cell-group>
        </div>
        <div class="back-box">
            <div class="h3title"><h3>教案</h3></div>
            <van-cell-group>
                <van-cell :title="img.name"  v-for="(img,index) in applyList.attachmentListType2" :key="index" is-link @click="showfile(img.path)"/>
            </van-cell-group>
        </div>
        <div class="back-box">
            <div class="h3title"><h3>活动照片</h3></div>
            <van-cell-group>
                <van-cell :title="img.name"  v-for="(img,index) in applyList.attachmentListType3" :key="index" is-link @click="showfile(img.path)"/>
            </van-cell-group>
        </div>
        <div class="back-box">
            <div class="h3title"><h3>手册照片</h3></div>
            <van-cell-group>
                <van-cell :title="img.name"  v-for="(img,index) in applyList.attachmentListType4" :key="index" is-link @click="showfile(img.path)"/>
            </van-cell-group>
        </div>
        <div class="back-box" style="margin-bottom:2rem">
            <div class="h3title"><h3>活动笔记</h3></div>
            <div style="padding:1rem;display:flex;">
                <div class="fileImg" v-if="applyList.attachmentListType5 && applyList.attachmentListType5.length">
                    <div style="display:inline-block;" v-for="(img,index) in applyList.attachmentListType5" :key="index">
                        <img v-if="isImg(img.path)" :src="img.path" alt="" @click="showfile(img.path,index)" />
                        <img v-else src="@/assets/images/page/wendangzhongxin.png" alt="" @click="showfile(img.path)">
                        <van-icon  name="close" class="delete-icon" @click="deleteImg(index)"/>
                    </div>
                </div>
                <div class="uploadFile" @click="activeImgObj(applyList)">
                    <van-uploader :disabled="applyList.disabled" :after-read="onRead" accept multiple>
                    <van-icon name="plus" />
                    </van-uploader>
                </div>
            </div>
        </div>
        <!-- <div class="background">
          <ul>
            <li>
              <h3>活动详情</h3>
            </li>
            <li>
              <p v-html="applyList.detail"></p>
            </li>
            <li>
              <div class="pwith" v-for="(i,index) in applyList.attachmentList" :key="index">
                <p @click="showAttachment(i,index)">{{i.name}}</p>
              </div>
            </li>
          </ul>
        </div> -->
      </div>
      <div class="bottom" v-if="buttonShow">
        <!-- <button :class="pbotton" :disabled="questionnaire" @click="questionnaireSurvey()">问卷调查</button> -->
        <button class="pbotton1" @click="clickToSign">扫码打卡</button>
        <button :class="pbotton2" :disabled="questionnaire2" @click="feedback()">意见反馈</button>
      </div>
      <van-dialog
        v-model="feedbackk"
        title="意见反馈"
        show-cancel-button
        confirm-button-text="提交"
        :before-close="beforeClose"
      >
        <van-cell-group>
          <van-field
            v-model="message"
            type="textarea"
            :placeholder="placeholder"
            maxlength="500"
            rows="1"
            autosize
          />
        </van-cell-group>
      </van-dialog>
      <div v-if="Dontsignup">
        <div class="bottom">
          <!-- <button class="Sign_up" v-if="applying" @click="applyClick()" :disabled="disabled">立即报名</button> -->
          <button class="Sign_up"  @click="applyClick()" :disabled="disabled">立即报名</button>
          <!-- <button class="cancel" v-if="!applying" @click="cancelClick()" :disabled="disabled">取消报名</button> -->
        </div>
      </div>
    </div>
    <!-- 活动评价模块 -->
    <Modal :showQrCode="showQrCode"></Modal>
  </div>
</template>

<script>


import Modal from "@/view/singupQrCode/modal";
/*活动详情*/
export default {
  name: "ActivitiesDetails",
  components: {
    Modal: Modal
  },
  data() {
    return {
      applyList: [],
      paramsDate:{},
      src: [],
      condition:"",
      buttonShow: false,
      showQrCode: {
        show: false,
        data: {}
      },
      updataImgObj: {
          path:'',
      },
      isHasFile:{},
      promptly: "",
      Sign_up: "",
      timestamp: "", // 服务器时间
      applying: false,
      disabled: false,
      disabledCancel: false,
      Dontsignup: false,
      // isshow: true,
      // isshoww: false,
      pbotton: "",
      pbotton1: "",
      pbotton2: "",
      questionnaire: false,
      questionnaire1: false,
      questionnaire2: false,
      feedbackk: false, // 意见反馈
      placeholder: "建议或意见，不得超过500字",
      message: "",
      imgList: [],
      imgIndexMap: new Map(),
      locationObj: {
        locationDetail: "正在获取当前位置",
        latitudeAndLongitude: ""
      },
      showQrCode: {
        show: false,
        data: {},
        type: 1
      },
      isNeedEvaluate:"",
    };
  },
  methods: {
    onClickLeft() {
      this.$store.state.activitiesDetailsObj = null;
      this.utils.goBack(this);
    },
    clickToSign() {
      // 扫码打卡
      //  this.location()
      this.webApp.WebCallApp("positioningPoint", {}, res => {
        if (this.webApp.isInIOS()) {
          if (res.result.state) {
            this.location();
          } else {
            if (res.result.code === 0) {
              this.locationObj.locationDetail = res.result.address;
              this.locationObj.latitudeAndLongitude =
                res.result.longitude + "," + res.result.latitude;
              this.sood();
            } else {
              this.Toast("定位失败");
              this.sood();
            }
          }
        } else {
          if (res.result.args) {
            if (res.result.args.state) {
              this.location();
            } else {
              this.Toast("定位失败");
              this.sood();
            }
          } else {
            if (res.result.code === 0) {
              this.locationObj.locationDetail = res.result.address;
              this.locationObj.latitudeAndLongitude =
                res.result.longitude + "," + res.result.latitude;
              this.sood();
            } else {
              this.Toast("定位失败");
              this.sood();
            }
          }
        }
      });
    },
    saveQrSignInOrSignOut(params){
         this.pageDisplay();
    },
    sood() {
      var dsMins =
        (this.utils.getTime(this.$store.state.timestamp) -
          this.utils.getTime(this.applyList.startTime)) /
        3600000;
      if (dsMins < -2) {
        this.Toast("请在活动开始前两小时内打卡");
        return;
      }

      let appCallData = {
        Command: "CmdScanQrCode",
        Args: {
          from: "activeDetail",
          teachingId: this.applyList.id
        }
      };
      this.webApp.WebCallApp("CmdScanQrCode", {}, res => {
        let obj = this.utils.getPrams(res);
        if (this.applyList.id != obj.teachingId) {
          return this.Toast("无效二维码");
        }
        var params = {
          qrCodeInfoJson: JSON.stringify(obj),
          memberCaId: this.$store.state.userInfo.human.caId,
          teachingId: this.applyList.id, //签到/签退经纬度
          latitudeLongitude: this.locationObj.latitudeAndLongitude
            ? this.locationObj.latitudeAndLongitude
            : "假的",
          locationDetail: this.locationObj.locationDetail
            ? this.locationObj.locationDetail
            : "123" //  定位这个版本不需要
        };
        this.paramsDate = params;
        let sendXhr = () => {
            console.log(111);
          this.utils.ajax({
            url: this.api.saveQrSignInOrSignOut,
            method: "POST",
            data: params,
            success: data => {
              this.Toast("打卡成功");
              setTimeout(() => {
                this.getLeaveList(this.applyList.id);
              }, 1000);
            }
          });
        }
        this.utils.ajax({
          url: this.api.queryEvaluate,
          method: "post",
          data: {
            teachingId: params.teachingId
          },
          success: res => {
            if (res.isSignOut == 1) {
              if (res.isNeedEvaluate == 1 && this.applyList.flagOfCommitOpinion != 1) {
                this.$store.state.activitiesDetailsObj = { id: params.teachingId, evaluateId: res.evaluateId ,condition: this.condition};
                let callback = () => {
                  sendXhr();
                };
                this.showQrCode.data = res;
                this.showQrCode.show = true;
                this.showQrCode.callback = callback;
              } else {
                sendXhr();
              }
            } else {
              sendXhr();
            }
          }
        });
      });
    },
    location() {
      // 定位这个版本不需要
      AMap.plugin("AMap.Geolocation", () => {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认：true
          timeout: 5000, // 设置定位超时时间，默认：无穷大
          buttonOffset: new AMap.Pixel(10, 20) // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
        });
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", data => {
          this.locationObj.locationDetail = data.formattedAddress;
          this.locationObj.latitudeAndLongitude = `${data.position.lat},${
            data.position.lng
          }`;
          // this.locationObj.flage = true;
          this.sood();
        });
        AMap.event.addListener(geolocation, "error", err => {
          // this.Toast("定位失败");
          // console.log(err);
          // this.locationObj.locationDetail = "定位失败，请重新获取定位";
          // if (err.message === "Geolocation permission denied.") {
          //   this.Toast("请开启定位权限");
          //   this.locationObj.locationDetail = "请开启定位权限";
          // }
          // this.locationObj.flage = false;
          this.sood();
        });
      });
    },
    showfile(url) {
      if(url){
        this.utils.openMultiTypeFile(url);
      }
    },
    onRead(file) {
      let flag = true;
      let _this = this;
      let content = this.utils.encryptByEnMd5(file.content);
      if(content && this.isHasFile.hasOwnProperty(content)) {
        this.Toast("该文件已存在，请选择其他文件");
        return;
      }else{
        this.utils.fileUploader(file, data => {
            _this.isHasFile[content] = data.url;
              console.log(this.updataImgObj, data);
              this.updataImgObj = {
                path: data.url,
                md5: "",
                name: data.name,
                type: 5,
                pid: this.applyList.id
             };
             this.applyList.attachmentListType5.push(this.updataImgObj);
             this.updateFile();
        });
      }
    },
    isImg(str) {
      if (/.jpg/.test(str) || /.JPG/.test(str) || /.jpeg/.test(str) || /.JPEG/.test(str) || /.png/.test(str) || /.gif/.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    deleteImg(index){
      this.Dialog.confirm({
        title: "提示",
        message: "是否删除活动笔记"
      }).then(() => {
        this.isHasFile = {};
        let item = this.applyList.attachmentListType5.splice(index,1);
        this.deleteFile(item[0].id);
      }).catch(() => {});
    },
    activeImgObj(updataImgObj) {
      this.updataImgObj = updataImgObj;
    },
    deleteFile(id){
        this.utils.ajax({
            url: this.api.delTeachingAttachment,
            data: { 
                id: id,
            },
            method: "POST",
            success: data => {
              this.pageDisplay();
              setTimeout(() => {
                this.Toast("提交成功");
              }, 100);
            }
        });
    },
    updateFile(){
        this.utils.ajax({
            url: this.api.uploadAttachment,
            data: { 
                attachmentList: this.applyList.attachmentListType5,
                teachingId:this.applyList.id
            },
            method: "POST",
            success: data => {
              this.pageDisplay();
              setTimeout(() => {
                this.Toast("提交成功");
              }, 100);
            }
        });
    },
    pageDisplay() {
      // 根据不同页面显示不同的按钮
      if (
        this.$store.state.activitiesDetailsObj.condition === "teaching_activity"   
      ) {
        this.condition = "teaching_activity"
        this.buttonShow = false;
        this.Dontsignup = true;
        this.getLeaveList(this.$store.state.activitiesDetailsObj.id);
      } else if (
        this.$store.state.activitiesDetailsObj.condition === "ToStayIn" 
      ) {
        this.condition = "ToStayIn"
        this.buttonShow = true;
        this.Dontsignup = false;
        this.getLeaveList(this.$store.state.activitiesDetailsObj.id);
      }
    },
    /**
     * 补评价
     */
    goSubAnswer(){
        let sendXhr = () => {
            this.utils.goBack(this);
        }
        let callback = () => {
            sendXhr();
        }
        this.$store.state.activitiesDetailsObj = { id: this.applyList.id, evaluateId: this.applyList.evaluateId , condition: this.condition};
        if(this.applyList.flagOfCommitOpinion == 1){
            this.$store.state.activitiesDetailsObj.type = "see";
        }else{
            this.$store.state.activitiesDetailsObj.type = "add";
        }
        this.$router.push({name: 'subAnswer', params: this.$store.state.activitiesDetailsObj })
    },
    /*******************************下次再说ß */
   saveQrSignInOrSignOut(params){
          console.log(params);
          this.utils.ajax({
            url: this.api.saveQrSignInOrSignOut,
            method: "POST",
            data: params,
            success: data => {
              this.Toast("打卡成功");
              setTimeout(() => {
                this.getLeaveList(this.$store.state.routeParamsid.id);
              }, 1000);
            }
          });
    },
    getLeaveList(activityId) {
      //发布活动
      var param = {
        id: activityId,
        isPrceview: 1
      };
      this.utils.ajax({
        url: this.api.activityDetail,
        data: param,
        method: "POST",
        success: data => {
          data.attachmentList.forEach((item, index) => {
            if (this.utils.checkSuffix(item.name)) {
              this.imgList.push(item.path);
              this.imgIndexMap.set(index, this.imgList.length - 1);
            }
          });
          // title = data.title;
          this.applyList = data;
          //是否显示评价
          if(this.applyList.isNeedEvaluate && (this.applyList.signInDate || this.applyList.signOutDate)){
            this.isNeedEvaluate =  this.applyList.flagOfCommitOpinion == 1 ? '<span style="color:red">已评</span>'  : '<span style="color:#187fe8" > 未评 </span>' ;
          }
          let startTime = ''; // 活动开始
          let timestamp = ''; // 服务器时间
          var ua = window.navigator.userAgent.toLowerCase();
          var u = navigator.userAgent,
            app = navigator.appVersion;
          var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
          var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
          if (isAndroid) {
            //这个是安卓操作系统
            startTime = new Date(this.applyList.startTime.replace(/-/g, "/")).getTime(); // 活动开始
            timestamp = new Date(this.$store.state.timestamp.replace(/-/g, "/")).getTime(); // 服务器时间
          }
          if (isIOS) {
            //这个是ios操作系统
            startTime = new Date(this.applyList.startTime.replace(/-/g, "/")).getTime(); // 活动开始
            timestamp = new Date(this.$store.state.timestamp.replace(/-/g, "/")).getTime(); // 服务器时间
          }
          // var sd = 7200000;
          var sd = 0;
          var hours = parseInt((sd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          if (this.$store.state.activitiesDetailsObj.condition === "ToStayIn") {
          } else {
            if (this.applyList.isSignUp === 0) {
              // 如果为0是'否'不需要报名
              this.Dontsignup = false;
            }
            if (this.applyList.isSignUp === 1) {
              // 如果为1是'是'需要报名
              this.Dontsignup = true;
            }
            if (this.applyList.joinFlag === 0) {
              //  报名状态: 0否 1是 2取消
              //  是否报名，0否 1是 2取消
              this.applying = true;
            }
            if (this.applyList.joinFlag === 1) {
              this.applying = false;
            }
            if (this.applyList.joinFlag === 2) {
              this.applying = true;
            }
            if (timestamp + sd < startTime && this.applyList.isSignUp === 1) {
              //  活动开始前两小时可以报名
              this.Dontsignup = true;
            }
            if (timestamp + sd < startTime && this.applyList.isSignUp === 0) {
              this.Dontsignup = false;
            }
            if (timestamp + sd > startTime) {
              this.Dontsignup = false;
            }
          }
          if (this.applyList.isHaveOpinion == 0) {
            this.pbotton = "pbotton";
            this.questionnaire = true;
          } else if (this.applyList.isHaveOpinion == 1) {
            this.pbotton = "pbotton1";
            this.questionnaire = false;
          }
          if (startTime < timestamp) {
            this.pbotton2 = "pbotton1";
            this.questionnaire2 = false;
          }
          if (startTime > timestamp) {
            this.pbotton2 = "pbotton";
            this.questionnaire2 = true;
          }
        }
      });
    },
    showAttachment(attachment, index) {
      if (this.utils.checkSuffix(attachment.name)) {
        //图片进行预览
        this.utils.imagePreview(this.imgList, this.imgIndexMap.get(index));
      } else {
        if (this.utils.isInAndroid() == false) {
          this.Toast("请通过电脑进行查看或下载");
        } else {
          var obj = {
            name: attachment.name,
            url: attachment.path
          };
          this.utils.downLoadFile(obj);
        }
      }
    },
    applyingY(flag, memberId, teachingId) {
      var params = {
        flag: flag,
        memberId: memberId,
        teachingId: teachingId
      };
      this.utils.ajax({
        url: this.api.upOrCancelSignTeaching,
        data: params,
        method: "POST",
        success: data => {
          if (flag == 1) {
            this.Toast("报名成功");
          }
          if (flag == 2) {
            this.Toast("取消报名成功");
          }
          setTimeout(() => {
            this.utils.goBack(this);
          }, 300);
        }
      });
    },
    applyClick() {
      // 立即报名
      this.applying = !this.applying;
      this.applyingY(
        1,
        this.$store.state.activitiesDetailsObj.memberCaId,
        this.$store.state.activitiesDetailsObj.id
      );
    },
    cancelClick() {
      // 取消报名
      this.applying = !this.applying;
      this.applyingY(
        2,
        this.$store.state.activitiesDetailsObj.memberCaId,
        this.$store.state.activitiesDetailsObj.id
      );
    },
    feedback() {
      // 意见反馈
      this.feedbackk = true;
    },
    beforeClose(action, done) {
      // 意见反馈
      if (action === "confirm") {
        // setTimeout(done, 1000);
        if (this.message == "") {
          this.Toast("内容不能为空!");
          done(false);
        } else if (this.message.length > 500) {
          this.Toast("内容不能超过500字!");
          done(false);
        } else {
          // 请求提交接口
          console.log(
            this.$store.state.activitiesDetailsObj.memberCaId,
            "544454"
          );
          var params = {
            teachingId: this.$store.state.activitiesDetailsObj.id,
            memberCaId: this.$store.state.userInfoCaid,
            content: this.message
          };
          this.utils.ajax({
            url: this.api.saveFeedBackForTeaching,
            data: params,
            method: "POST",
            success: data => {
              this.pageDisplay();
              this.message = "";
              setTimeout(() => {
                this.Toast("提交成功");
              }, 100);
            }
          });
          done();
        }
      } else {
        this.message = "";
        done();
      }
    },
    questionnaireSurvey() {
      // 问卷调查
      this.$router.push({
        name: "questionnaire",
        params: { id: this.$store.state.activitiesDetailsObj.id }
      });
    }
  },

  created() {
    this.pageDisplay();
  }
};
</script>

<style scoped>
h3,
p,
ul,
li {
  margin: 0;
  padding: 0;
}

.heade {
  background: white;
}
.van-cell__value{
    flex: 3;
}
.heade_top {
  width: 90%;
  margin: 0 auto;
  padding: 0.3rem 0;
}

.heade_top li {
  display: flex;
}

.heade_top li p:nth-of-type(1) {
  width: 70px;
  text-align: right;
}

.heade_top li {
  padding: 0.2rem 0;
}

.heade_top li p {
  color: #888888;
  font-size: 0.8rem;
}

.heade_top li .p {
  color: #f6ae48;
}
.back-box {
  background: white;
  margin-bottom: 0.4rem;
}
.h3title {
    padding: 0.625rem 0.9375rem;
    margin:0 auto;
}
.van-cell__title{
    width:94%;
}
.background {
  background: white;
  margin-top: 0.8rem;
  padding: 0.3rem 0;
  height: 29.5rem;
}

.background ul {
  width: 90%;
  margin: 0 auto;
}

.background ul li {
  padding: 0.2rem 0;
}

.background ul li p {
  line-height: 1.5rem;
}

.background ul li div p {
  color: #187fe8;
}

.print {
  width: 100%;
  text-align: center;
  padding: 0.5rem;
}

.saving {
  padding: 1rem;
}

.bottom {
  width: 100%;
  display: flex;
  justify-content: space-between;

  position: fixed;
  bottom: 0;

  text-align: center;
}

.bottom button {
  width: 100%;
  font-size: 1rem;
  border: none;
}

.bottom .pbotton {
  background: #ffffff;
  padding: 0.5rem 0;
  border-top: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
  color: #d3d3d3;
}

.bottom .pbotton1 {
  background: #1a7fe9;
  padding: 0.5rem 0;
  border-left: 1px solid #eeeeee;
  color: white;
}

.Sign_up {
  background: #1a7fe9 !important;
  color: white !important;
}

.cancel {
  background: #e1951b !important;
  color: white !important;
}

.bottom button {
  padding: 0.5rem 0;
  width: 100%;
  font-size: 1rem;
  border: none;
}

.pwith {
  word-wrap: break-word;
}
.uploadFile{
  position: relative;
  display: inline-block;
  font-size: 3rem;
  height: 3rem;
  width: 3rem;
  border-radius: 0.5rem;
  border: 0.04rem solid #e1e1e1;
  vertical-align: middle;
  margin-right: 0.925rem;
  margin-left: 1rem;
}
.delete-icon{
    vertical-align: top;
    left: -11px;
    top: -7px;
    font-size: 1.2rem;
    color:gray;
}
.fileImg img {
  width: 3rem;
  margin-right: .4rem; 
  height: 3rem;
  vertical-align: middle;
  margin-top: 5px;
}
</style>
