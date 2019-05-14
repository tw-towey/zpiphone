<template>
  <div>
    <van-nav-bar title="签到打卡" right-text="考勤月历" class="header" fixed left-arrow @click-left="onClickLeft"
                 @click-right="onClickRight"/>


    <div class="layout_content">
      <div class="sigin_head">
        <van-row>
          <van-col span="12" class="tl van-ellipsis">{{departmentName}}</van-col>
          <van-col span="12" class="tr">{{curTime}}</van-col>
        </van-row>
        <p>{{locationObj.locationDetail}}</p>
        <!--<span class="a" @click="location('res')">更新定位</span>-->
        <span class="a" @click="authority('res')">更新定位</span>
      </div>

      <div class="sigin_content">
        <ul v-if="signInList.length">
          <li v-for="signInLis in signInList">
            <van-row>
              <van-col span="4">
                <p class="sginTitle">{{signInLis.dutyTypeVO.dutyType}}</p>
              </van-col>
              <van-col span="10">
                <div class="singBtn" :class="signInLis.signInTime?'singBorder':'noSingBorder'"
                     @click="signInFn(signInLis)">
                  <div v-if="signInLis.signInTime">
                    <div class="semicircleTitle">签到</div>
                    <div class="semicircle">{{signInLis.signIn}}</div>
                  </div>
                  <div v-else class="wholeCircle">
                    <div class="wholeCircleTitle">签到</div>
                  </div>
                </div>
              </van-col>
              <van-col span="10">
                <div class="singBtn" :class="signInLis.signOutTime?'singBorder':'noSingBorder'"
                     @click="signOutFn(signInLis)">
                  <div v-if="signInLis.signOutTime">
                    <div class="semicircleTitle">签退</div>
                    <div class="semicircle">{{signInLis.signOut}}</div>
                  </div>
                  <div v-else class="wholeCircle">
                    <div class="wholeCircleTitle">签退</div>
                  </div>
                </div>
              </van-col>
            </van-row>
          </li>
        </ul>
        <div class="gray center" v-else>暂无值班安排</div>
      </div>
    </div>
  </div>
</template>

<script>
  /*签到打卡*/
  export default {
    name: "SignIn",
    data() {
      return {
        curTime: "",
        departmentName: "",
        locationObj: {
          locationDetail: "正在获取当前位置",
          latitudeAndLongitude: ""
        },
        signInList: []
      };
    },
    methods: {
      onClickLeft() {
        this.utils.goBack(this);
      },
      onClickRight() {
        this.$router.push({ name: "MonthlyCalendar" });
      },
      getSignInDetails() {
        this.curTime = this.$store.state.timestamp.split(" ")[0];
        this.utils.ajax({
          method: "POST",
          url: this.api.signInDetails,
          success: (data) => {
            this.departmentName = data.currentSchedulingResultNew.departmentName;
            data.schedulingResultNews.forEach(item => {
              item.signIn = item.signInTime ? this.utils.formatDate(item.signInTime, "HH:mm") : "";
              item.signOut = item.signOutTime ? this.utils.formatDate(item.signOutTime, "HH:mm") : "";
            });
            this.signInList = data.schedulingResultNews;
          }
        });
      },
      authority(det) {
        this.webApp.WebCallApp("positioningPoint", {}, (res) => {
          if (this.webApp.isInIOS()) {
            if (res.result.state) {
              this.location(det);
            }
          } else {
            if (res.result.args.state) {
              this.location(det);
            }
          }
        });
      },
      location(det) {
        if (det) {
          this.locationObj.locationDetail = "正在更新位置...";
        }
        AMap.plugin("AMap.Geolocation", () => {
          var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认：true
            timeout: 5000, // 设置定位超时时间，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 20) // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          });
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, "complete", (data) => {
            this.locationObj.locationDetail = data.formattedAddress;
            this.locationObj.latitudeAndLongitude = `${data.position.lat},${data.position.lng}`;
            this.locationObj.flage = true;
          });
          AMap.event.addListener(geolocation, "error", (err) => {
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
      signInFn(params) { // 签到
        if (params.signInTime) {
          this.Toast("已经签到");
          return;
        }
        let curData = Object.assign({}, { flag: 1, id: params.id }, this.locationObj);
        if (!this.locationObj.flage) {
          this.Dialog.confirm({
            title: '温馨提示',
            message: '定位未获取成功，是否继续'
          }).then(() => {
            curData.locationObj.locationDetail = '';
            this.utils.ajax({
              url: this.api.saveSign,
              data: curData,
              method: "POST",
              success: data => {
                this.Toast("签到成功");
                params.signInTime = data.signInTime;
                params.signIn = this.utils.formatDate(data.signInTime, "HH:mm");
              }
            });
          });
        }else {
          this.utils.ajax({
            url: this.api.saveSign,
            data: curData,
            method: "POST",
            success: data => {
              this.Toast("签到成功");
              params.signInTime = data.signInTime;
              params.signIn = this.utils.formatDate(data.signInTime, "HH:mm");
            }
          });
        }
      },
      signOutFn(params) { // 签退
        if (params.signInTime) {
          let curData = Object.assign({}, { flag: 2, id: params.id }, this.locationObj);
          if (!this.locationObj.flage) {
            this.Dialog.confirm({
              title: '温馨提示',
              message: '定位未获取成功，是否继续'
            }).then(() => {
              curData.locationObj.locationDetail = '';
              this.utils.ajax({
                url: this.api.saveSign,
                data: curData,
                method: "POST",
                success: data => {
                  console.log(data);
                  this.Toast("签退成功");
                  params.signOutTime = data.signOutTime;
                  params.signOut = this.utils.formatDate(data.signOutTime, "HH:mm");
                }
              });
            });
          }else {
            this.utils.ajax({
              url: this.api.saveSign,
              data: curData,
              method: "POST",
              success: data => {
                console.log(data);
                this.Toast("签退成功");
                params.signOutTime = data.signOutTime;
                params.signOut = this.utils.formatDate(data.signOutTime, "HH:mm");
              }
            });
          }
        } else {
          this.Toast("请先签到");
        }
      }
    },
    created() {
      this.authority();
      // this.location();
      this.getSignInDetails();
    }
  };
</script>

<style scoped>
  .sigin_head {
    padding: 1rem .9rem;
    background: #fff;
    margin-bottom: .5rem;
  }

  .sigin_head .tl {
    text-align: left;
    font-weight: 700;
    font-size: 1rem;
  }

  .sigin_head .tr {
    text-align: right;
  }

  .sigin_content ul li {
    background: #fff;
    padding: 1rem .9rem;
    margin-top: .5rem;
  }

  .sginTitle {
    font-weight: 700;
  }

  .singBtn {
    border: .5rem solid;
    border-radius: 50%;
    width: 5rem;
    height: 5rem;
    text-align: center;
    margin: 0 auto;
    color: #fff;
  }

  .noSingBorder {
    border-color: #e7f5ff;
  }

  .singBorder {
    border-color: #fff1cd;
  }

  .semicircle {
    width: 5rem;
    height: 2.5rem;
    line-height: 2.5rem;
    border-radius: 0 0 5rem 5rem;
    background: #e1951b;
  }

  .semicircleTitle {
    color: #000;
    height: 2.5rem;
    line-height: 2.5rem;
  }

  .wholeCircle {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    /*background: #0f6ae2;*/
    /*! autoprefixer: off */
    background: linear-gradient(top right, #0f6ae2, #33ccff);
    background: -moz-linear-gradient(top right, #0f6ae2, #33ccff);
    background: -webkit-gradient(linear, left top, right bottom, color-stop(#0f6ae2), color-stop(#33ccff));
    background: -webkit-linear-gradient(top right, #0f6ae2, #33ccff);
    background: -o-linear-gradient(top right, #0f6ae2, #33ccff);
    background: -ms-linear-gradient(top right, #0f6ae2, #33ccff);
    /* autoprefixer: on */
  }

  .wholeCircleTitle {
    font-size: 1.2rem;
    line-height: 5rem;
  }
</style>
