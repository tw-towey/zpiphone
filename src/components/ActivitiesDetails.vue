<template>
  <div>
    <van-nav-bar title="活动详情" class="header" fixed left-arrow @click-left="onClickLeft"/>

    <div class="layout_content">
      <div>
        <div class="heade">
          <ul class="heade_top">
            <li>
              <h3>{{applyList.title}}</h3>
            </li>
            <li>
              <p>活动时间：</p>
              <p class="p">{{applyList.startTime}} - {{applyList.endTime}}</p>
            </li>
            <li>
              <p>主讲人：</p>
              <p>{{applyList.speaker}}</p>
            </li>
            <li>
              <p>活动地点：</p>
              <p>{{applyList.locationOfTeaching}}</p>
            </li>
            <li>
              <p>报名人数：</p>
              <p>{{applyList.numOfSignUp}}</p>
            </li>
          </ul>
        </div>
        <div class="background">
          <ul>
            <li>
              <h3>活动详情</h3>
            </li>
            <li>
              <p v-html="applyList.detail"></p>
            </li>
            <li>
              <div class="pwith" v-for="(i,index) in applyList.attachmentList">
                <p @click="showAttachment(i,index)">{{i.name}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="bottom" v-if="buttonShow">
        <button :class="pbotton" :disabled="questionnaire" @click="questionnaireSurvey()">问卷调查</button>
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
          <button class="Sign_up" v-if="applying" @click="applyClick()" :disabled="disabled">立即报名</button>
          <button class="cancel" v-if="!applying" @click="cancelClick()" :disabled="disabled">取消报名</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*活动详情*/
export default {
  name: "ActivitiesDetails",
  data() {
    return {
      applyList: [],
      src: [],
      buttonShow: false,
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
      }
    };
  },
  methods: {
    onClickLeft() {
      this.$store.state.activitiesDetailsObj = null;
      this.utils.goBack(this);
    },
    clickToSign() { // 扫码打卡
      this.sood();
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
          // latitudeLongitude: this.locationObj.latitudeAndLongitude,
          // locationDetail: this.locationObj.locationDetail //  定位这个版本不需要

        };
 
        this.utils.ajax({
          url: this.api.saveQrSignInOrSignOut,
          method: "POST",
          data: params,
          success: data => {
            this.Toast("打卡成功");
            console.log("打卡成功");
          }
        });
      });
    },
    location() { // 定位这个版本不需要
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
          this.locationObj.flage = true;
          // this.sood();
        });
        AMap.event.addListener(geolocation, "error", err => {
          // this.Toast("定位失败");
          // console.log(err);
          this.locationObj.locationDetail = "定位失败，请重新获取定位";
          if (err.message === "Geolocation permission denied.") {
            this.Toast("请开启定位权限");
            this.locationObj.locationDetail = "请开启定位权限";
          }
          this.locationObj.flage = false;
        });
      });
    },
    pageDisplay() {
      // 根据不同页面显示不同的按钮
      if (
        this.$store.state.activitiesDetailsObj.condition === "teaching_activity"
      ) {
        console.log("1");

        this.buttonShow = false;
        this.Dontsignup = true;
        this.getLeaveList(this.$store.state.activitiesDetailsObj.id);
      } else if (
        this.$store.state.activitiesDetailsObj.condition === "ToStayIn"
      ) {
        console.log("12");
        this.buttonShow = true;
        this.Dontsignup = false;
        this.getLeaveList(this.$store.state.activitiesDetailsObj.id);
      }
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
          console.log(data, "5555555555555");
          data.attachmentList.forEach((item, index) => {
            if (this.utils.checkSuffix(item.name)) {
              this.imgList.push(item.path);
              this.imgIndexMap.set(index, this.imgList.length - 1);
            }
          });
          // title = data.title;
          this.applyList = data;
          let startTime = new Date(this.applyList.startTime).getTime(); // 活动开始
          let timestamp = new Date(this.$store.state.timestamp).getTime(); // 服务器时间
          var sd = 7200000;
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
              console.log("需要报名");
            }
            if (this.applyList.joinFlag === 1) {
              this.applying = false;
            }
            if (this.applyList.joinFlag === 2) {
              this.applying = true;
            }
            console.log(timestamp, "服务器时间");
            console.log(startTime, "活动开始");
            console.log(hours, "小时");
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
          console.log(
            this.applyList.joinFlag,
            "oooooooooothis.applyList.joinFlag",
            this.applyList.isSignUp,
            "ssssssss"
          );
          if (this.applyList.isHaveOpinion == 0) {
            this.pbotton = "pbotton";
            this.questionnaire = true;
          } else if (this.applyList.isHaveOpinion == 1) {
            this.pbotton = "pbotton1";
            this.questionnaire = false;
          }
          if (startTime < timestamp) {
            console.log("ksajdlas");

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
          console.log("调用app下载");
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
          console.log(data, "pqpwpqpw");
        }
      });
    },
    applyClick() {
      // 立即报名
      this.applying = !this.applying;
      console.log(111);
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
        console.log(this.message.length, "12315555555");
        if (this.message == "") {
          this.Toast("内容不能为空!");
          done(false);
        } else if (this.message.length > 500) {
          this.Toast("内容不能超过500字!");
          done(false);
        } else {
          // 请求提交接口
          var params = {
            teachingId: this.$store.state.activitiesDetailsObj.id,
            memberCaId: this.$store.state.activitiesDetailsObj.memberCaId,
            content: this.message
          };
          this.utils.ajax({
            url: this.api.saveFeedBackForTeaching,
            data: params,
            method: "POST",
            success: data => {}
          });
          done();
        }
      } else {
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
    console.log("ididididi", this.$store.state.activitiesDetailsObj.memberCaId);
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
</style>
