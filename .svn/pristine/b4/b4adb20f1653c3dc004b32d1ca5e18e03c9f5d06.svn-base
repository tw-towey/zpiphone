
<template>
  <div>
    <van-nav-bar title="打卡详情" class="header" fixed left-arrow @click-left="onClickLeft"/>
    <div class="layout_content">
      <div>
        <div class="clock">
          <div class="phase">
            <ul>
              <li>
                <p class="p">开始时间</p>
                <p>{{startTime}}</p>
              </li>
              <li class="lio" v-if="showTime">
                <p>签到时间</p>
                <p>{{applyList.signInDate}}</p>
              </li>
              <li class="li">
                <div class="img" :id="src"></div>
                <p>{{name}}</p>
              </li>
            </ul>
          </div>
          <div class="phase">
            <ul>
              <li>
                <p class="p">结束时间</p>
                <p>{{endTimee}}</p>
              </li>
              <li class="lio" v-if="showOutTime">
                <p>签退时间</p>
                <p>{{applyList.signOutDate}}</p>
              </li>
              <li class="li">
                <div class="img" :id="drawing"></div>
                <p>{{signin}}</p>
              </li>
            </ul>
          </div>
        </div>
        <ul class="study">
          <li>
            <p>实际学习</p>
            <p>
              <span>{{classHour}}</span> 小时
            </p>
          </li>
        </ul>
      </div>
      <div class="punch" @click="scan()">扫码打卡</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PunchCards",
  data() {
    return {
      applyList: [],
      startTime: "",
      endTimee: "",
      name: "",
      endTime: "",
      drawing: "",
      signin: "",
      src: "",
      showTime: false,
      showOutTime: false,
      locationObj: {
        locationDetail: "正在获取当前位置",
        latitudeAndLongitude: ""
      },
      dimensionCode: "",
      classHour:0,
    };
  },
  created() {
    this.getLeaveList(this.$route.params.id);
    // this.location();
    this.$store.state.dimensionCode = "";
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    getLeaveList(activityId) {
      //发布活动
      var param = {
        humanId: this.$store.state.userInfo.human.caId,
        teachingId: activityId
      };
      this.utils.ajax({
        url: this.api.queryTeachingReceiverVO,
        data: param,
        method: "POST",
        success: data => {
          this.applyList = data;
         if (data.signInDate == '' || data.signOutDate == '') {
            this.classHour = "0";
          } else {
            let signInDate = this.utils.getTime(this.applyList.signInDate); // 签到时间
            let signOutDate = this.utils.getTime(this.applyList.signOutDate); // 签退时间
            let classHour = signOutDate - signInDate;
            var h = classHour / 3600 / 1000;
            var hh = h.toFixed();
            this.classHour = hh;
          }
          this.startTime = this.$route.params.startTime;
          this.endTimee = this.$route.params.endTime;
          let startTime = this.utils.getTime(this.$route.params.startTime); // 开始时间
          let endTime = this.utils.getTime(this.$route.params.endTime); // 结束时间
          let timee = endTime - startTime;
          let nowTime = new Date(this.$store.state.timestamp).getTime(); // 服务器时间
          if (this.applyList.signInDate == "") {
            //签到
            this.name = "未签到";
            this.src = "drawingg";
            this.showTime = false;
          } else {
            this.showTime = true;
            let signInDate = this.utils.getTime(this.applyList.signInDate); // 签到时间
            if (startTime > signInDate) {
              // 开始时间大于签到时间 正常
              this.name = "正常";
              this.src = "img1";
            } else if (startTime < signInDate) {
              // 开始时间大于签到时间 迟到
              this.name = "迟到";
              this.src = "img";
            }
            if (this.applyList.signInDate == "" && nowTime > startTime) {
              this.name = "迟到";
              this.src = "img";
            }
          }
          if (this.applyList.signOutDate == "") {
            // 签退
            this.signin = "未签退";
            this.drawing = "drawingg";
            this.showOutTime = false;
          } else {
            this.showOutTime = true;
            let signOutDate = this.utils.getTime(this.applyList.signOutDate); // 签退时间
            if (endTime > signOutDate) {
              // 结束时间大于签签退时间 正常
              this.signin = "早退";
              this.drawing = "img";
            }
            if (endTime < signOutDate) {
              // 结束时间大于签到时间 迟到
              this.signin = "正常";
              this.drawing = "img1";
            }
          }
          if (this.applyList.signOutDate == "") {
            this.signin = "未签退";
            this.drawing = "drawingg";
          }
        }
      });
    },
    scan() {
      // 扫码打卡
      // this.location();
      this.sood();
    },
    location() {  // 定位这个版本先不需要
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
    sood() {
      var dsMins =
        (this.utils.getTime(this.$store.state.timestamp) -
          this.utils.getTime(this.$route.params.startTime)) /
        3600000;
      if (dsMins < -2) {
        this.Toast("请在活动开始前两小时内打卡");
        return;
      }
      let appCallData = {
        Command: "CmdScanQrCode",
        Args: {
          from: "activeDetail",
          teachingId: this.applyList.teachingId
        }
      };
      this.webApp.WebCallApp("CmdScanQrCode", {}, res => {
        let obj = this.utils.getPrams(res);
        if (this.applyList.teachingId != obj.teachingId) {
          return this.Toast("无效二维码");
        }
        var params = {
          qrCodeInfoJson: JSON.stringify(obj),
          memberCaId: this.$store.state.userInfo.human.caId,
          teachingId: this.applyList.teachingId, //签到/签退经纬度
          // latitudeLongitude: this.locationObj.latitudeAndLongitude,
          // locationDetail: this.locationObj.locationDetail // 定位这个版本不需要
        };
        this.utils.ajax({
          url: this.api.saveQrSignInOrSignOut,
          method: "POST",
          data: params,
          success: data => {
            this.Toast("打卡成功");
            setTimeout(() => {
              this.getLeaveList(this.$route.params.id);
            }, 1000);
          }
        });
      });
    }
  }
};
</script>
<style scoped>
ul,
li,
p {
  margin: 0;
  padding: 0;
}
.img {
  width: 2rem;
  height: 2rem;
  margin-left: 0.5rem;
}
.clock {
  width: 100%;
  background: white;
  margin-top: 0.8rem;
  padding-top: 0.5rem;
}
.clock ul {
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  color: #525252;
}
.clock ul li {
  width: 9rem;
}
.clock ul li p:nth-of-type(2) {
  font-size: 0.9rem;
  line-height: 2rem;
}
.clock ul li .p {
  line-height: 2rem;
}
.clock ul .li {
  text-align: center;
  width: 13%;
}
.clock ul .li p {
  margin-top: 0.5rem;
}
.phase {
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8f8f8;
  margin-top: 0.5rem;
}
.study {
  margin-top: 0.5rem;
  background: white;
}
.study li {
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 0;
  color: #525252;
}
.study li p span {
  font-size: 1.3rem;
}
.study li p:nth-of-type(2) {
  font-size: 0.8rem;
  line-height: 0.6rem;
}
.punch {
  width: 100%;
  padding: 0.5rem;
  background: #197fe8;
  text-align: center;
  color: white;
  font-size: 1.1rem;
  position: fixed;
  bottom: 0;
}
#img {
  background: url(../../assets/images/home/punchCard-02.svg) no-repeat center;
  background-size: 100%;
}
#img1 {
  background: url(../../assets/images/home/punchCard-03.svg) no-repeat center;
  background-size: 100%;
}
#drawingg {
  background: url(../../assets/images/home/punchCard-01.svg) no-repeat center;
  background-size: 100%;
}
.lio {
  line-height: 1.9rem;
}
</style>