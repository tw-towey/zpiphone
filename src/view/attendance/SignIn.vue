<template>
  <div>
    <van-nav-bar
      title="签到打卡"
      right-text="考勤月历"
      class="header"
      fixed
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />

    <div class="layout_content">
      <Gaudetmap
        :locationObj="locationObj.latitudeAndLongitude"
        :latitudeObj="latitudeObj"
        v-on:childByValue="childByValue"
        ref="gaudetmap"
      ></Gaudetmap>
      <div class="sigin_head">
        <van-row>
          <van-col span="12" class="tl van-ellipsis">{{departmentName}}</van-col>
          <van-col span="12" class="tr">{{curTime}}</van-col>
        </van-row>
        <p>{{locationObj.locationDetail}}</p>
        <span class="a" @click="authority('res')">更新定位</span>
      </div>
     <!-- <div class="sigin_content" v-if='institutionId !=="bb716ea2d8034b5badfb83efd9a11f60"'> -->
       <div class="sigin_content" v-if='institutionId !=="e5826aa4499f406bae1792075d670b42" && institutionId !=="2a951a3ea72b4be6b983464d8ee47034"'>
        <ul v-if="signInList.length">
          <li v-for="(item,ke) in signInList" :key="ke">
            <div class="sginTitle">{{item.title}}</div>
            <div v-for="(signInLis,inde) in item.list" :key="inde">
              <van-row style="padding:0.5rem">
                <van-col span="4" style="line-height: 4rem">
                  <p class="classTime">{{signInLis.dutyTypeVO.dutyType}}</p>
                </van-col>
                <van-col span="10">
                  <div
                    class="singBtn"
                    :class="signInLis.signInTime?'singBorder':'noSingBorder'"
                    @click="signInFn(signInLis)"
                  >
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
                  <div
                    class="singBtn"
                    :class="signInLis.signOutTime?'singBorder':'noSingBorder'"
                    @click="signOutFn(signInLis)"
                  >
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
            </div>
          </li>
        </ul>
        <div class="gray center" v-else>暂无值班安排</div>
      </div>
      <!-- 同济 -->
      <div v-else class="sigin_content">
        <ul>
          <li>
            <div class="sginTitle" v-for="i in classesSging1">{{i.dutyName}} ({{i.startTime}}) - ({{i.endTime}})</div>
            <div>
              <van-row style="padding:0.5rem">
                <van-col span="12">
                  <div class="singBtn noSingBorder" @click="signOutFntt(1)">
                    <div class="wholeCircle">
                      <div class="wholeCircleTitle">签到</div>
                    </div>
                  </div>
                </van-col>
                <van-col span="12">
                  <div class="singBtn noSingBorder" @click="signOutFntt1(2)">
                    <div class="wholeCircle">
                      <div class="wholeCircleTitle">签退</div>
                    </div>
                  </div>
                </van-col>
              </van-row>
            </div>
          </li>
        </ul>
      </div>

      <van-dialog
        v-model="feedbackk"
        title="请选择班次"
        show-cancel-button
        confirm-button-text="确定"
        :before-close="beforeClose"
      >
        <div class="classes" v-if="singinData.length">
          <div class="classes1" v-for="(item,index) in singinData" :key="index">
            <div v-for="(i,inx) in item.dutyTypeExtList" :key="inx">
              <div
                :class="i.checked?'gred':''"
                class="circle"
                @click="circleClick(i,item)"
              >{{i.dutyName}} ({{i.startTime}}) - ({{i.endTime}})</div>
            </div>
          </div>
        </div>
        <div class="gray center" v-else>暂无班次，无法签到</div>
      </van-dialog>
    </div>
  </div>
</template>

<script>
/*签到打卡*/
import Gaudetmap from "./Gaudetmap";
export default {
  components: { Gaudetmap: Gaudetmap },
  name: "SignIn",
  data() {
    return {
      curTime: "",
      feedbackk: false,
      departmentName: "",
      locationObj: {
        locationDetail: "正在获取当前位置",
        latitudeAndLongitude: ""
      },
      signInList: [],
      latitudeObj: {
        latitude: "",
        distance: ""
      },
      minName: "",
      singinData: "",
      ids: "",
      siginId: "",
      activeType: "",
      flagesing: false,
      singTj: false,
      classesSging:{},
      classesSging1:[],
      institutionId: this.$store.state.userInfo.human.institutionId,
      singBtnStartTime:'',
      singBtnEndTime:'',
      singId:'',
      singingFlage:'',

    };
  },
  methods: {
    childByValue: function(childValue) {
      this.minName = childValue;
      if (this.minName !== "") {
        this.locationObj.locationDetail = this.minName;
      }
    },
    onClickLeft() {
      this.utils.goBack(this);
    },
    onClickRight() {
      this.$router.push({ name: "MonthlyCalendar" });
    },
    getSignInDetails(callback) {
      this.curTime = this.$store.state.timestamp.split(" ")[0];
      this.utils.ajax({
        method: "POST",
        url: this.api.signInDetails,
        success: data => {
          if (
            data.attendanceLocations !== "" ||
            data.attendanceLocations.length !== 0
          ) {
            this.latitudeObj.latitude = data.attendanceLocations;
          }
          if (data.currentSchedulingResultNew) {
            this.departmentName =
              data.currentSchedulingResultNew.departmentName;
          } else {
            this.Toast("无轮转排班");
          }
          data.schedulingResultNews.forEach(item => {
            item.signIn = item.signInTime
              ? this.utils.formatDate(item.signInTime, "HH:mm")
              : "";
            item.signOut = item.signOutTime
              ? this.utils.formatDate(item.signOutTime, "HH:mm")
              : "";
          });
          console.log(data.schedulingResultNews);
          let obj = {};
          data.schedulingResultNews.forEach(i => {
            console.log(obj.hasOwnProperty(i.dutyTypeId));
            if (obj.hasOwnProperty(i.dutyTypeId)) {
              obj[i.dutyTypeId].push(i);
            } else {
              obj[i.dutyTypeId] = [i];
            }
          });
          let arr = [];
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              const i = obj[key];
              arr.push({
                title: i[0].dutyName,
                list: i
              });
            }
          }
          this.signInList = arr;
          callback();
        }
      });
    },
    authority(det, flag) {
      if (!flag) {
        this.Toast.loading({
          mask: true,
          message: "定位中...",
          duration: 0
        });
      }
      this.webApp.WebCallApp("positioningPoint", {}, res => {
        if (!flag) {
          setTimeout(() => {
            this.Toast.clear();
          }, 500);
        }
        if (this.webApp.isInIOS()) {
          if (res.result.state) {
            this.locationObj.locationDetail = "位置信息获取失败";
            this.locationObj.latitudeAndLongitude = "";
            this.location(det);
          } else {
            if (res.result.code === 0) {
              this.locationObj.locationDetail = res.result.address;
              this.locationObj.latitudeAndLongitude =
                res.result.longitude + "," + res.result.latitude;
              this.locationObj.flage = true;
            } else {
              this.locationObj.locationDetail = "位置信息获取失败";
              this.Toast("定位失败");
              this.locationObj.latitudeAndLongitude = "";
              this.locationObj.flage = false;
            }
          }
        } else {
          console.log(res.result);
          if (res.result.args) {
            this.locationObj.locationDetail = "位置信息获取失败";
            this.locationObj.latitudeAndLongitude = "";
            if (res.result.args.state) {
              this.location(det);
            } else {
              this.Toast("定位失败");
            }
          } else {
            if (res.result.code === 0) {
              this.locationObj.locationDetail = res.result.address;
              this.locationObj.latitudeAndLongitude =
                res.result.longitude + "," + res.result.latitude;
              this.locationObj.flage = true;
            } else {
              this.locationObj.locationDetail = "位置信息获取失败";
              this.locationObj.latitudeAndLongitude = "";
              this.Toast("定位失败");
              this.locationObj.flage = false;
            }
          }
        }
        setTimeout(() => {
          this.$refs.gaudetmap.init();
        }, 0);
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
          this.locationObj.latitudeAndLongitude = "123,123";
          if (err.message === "Geolocation permission denied.") {
            this.Toast("请开启定位权限");
            this.locationObj.locationDetail = "请开启定位权限";
          }
          this.locationObj.flage = false;
        });
      });
    },
    signInFn(params) {
      // 签到
      if (params.signInTime) {
        this.Toast("已经签到");
        return;
      }
      let curData = Object.assign(
        {},
        { flag: 1, id: params.id },
        this.locationObj
      );
      if (!curData.flage) {
        this.Dialog.confirm({
          title: "温馨提示",
          message: "未获取到位置信息，可能是以下原因\n(1) 请用本机使用高德地图查看位置是否显示正常\n(2) 请检查APP是否获取‘位置’权限。\n(3) 网络状态不佳。\n是否仍然签到？",
          messageAlign:"left" 
        }).then(() => {
          curData.locationDetail = "";
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
      } else {
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
    signOutFn(params) {
      // 签退
      if (params.signInTime) {
        let curData = Object.assign(
          {},
          { flag: 2, id: params.id },
          this.locationObj
        );
        if (!curData.flage) {
          this.Dialog.confirm({
            title: "温馨提示",
            message: "未获取到位置信息，可能是以下原因\n(1) 请用本机使用高德地图查看位置是否显示正常\n(2) 请检查APP是否获取‘位置’权限。\n(3) 网络状态不佳。\n是否仍然签到？",
            messageAlign:"left" 
          }).then(() => {
            curData.locationDetail = "";
            this.utils.ajax({
              url: this.api.saveSign,
              data: curData,
              method: "POST",
              success: data => {
                this.Toast("签退成功");
                params.signOutTime = data.signOutTime;
                params.signOut = this.utils.formatDate(
                  data.signOutTime,
                  "HH:mm"
                );
              }
            });
          });
        } else {
          this.utils.ajax({
            url: this.api.saveSign,
            data: curData,
            method: "POST",
            success: data => {
              this.Toast("签退成功");
              params.signOutTime = data.signOutTime;
              params.signOut = this.utils.formatDate(data.signOutTime, "HH:mm");
            }
          });
        }
      } else {
        this.Toast("请先签到");
      }
    },
    mapClick() {
      this.$router.push({
        name: "Gaudetmap",
        params: { locationObj: this.locationObj }
      });
    },
    signOutFntt(i) {
      // 同济
      if(this.singingFlage == ""){
        this.Toast("请先签退");
        return
      }
      this.activeType = i;
      this.feedbackk = true;
      this.flagesing = false;
      this.utils.ajax({
        url: this.api.appAllDutyType,
        data: {},
        method: "POST",
        success: data => {
          data.forEach(item => {
            item.dutyTypeExtList.forEach(i => {
              i.checked = false;
              i.ids = item.id;
            });
          });
          this.singinData = data;
        }
      });
    },
    signOutFntt1(i){ // 同济签退
        if(this.singId == ''){
          this.Toast('请依据各自考勤时间选择班次');
          return
        }
        let curData = Object.assign({},{ flag: 1, id: this.singId, dutyTypeId: this.ids },this.locationObj);
        if(!curData.flage){
          this.Dialog.confirm({
            title: "温馨提示",
            message: "未获取到位置信息，可能是以下原因\n(1) 请用本机使用高德地图查看位置是否显示正常\n(2) 请检查APP是否获取‘位置’权限。\n(3) 网络状态不佳。\n是否仍然签到？",
            messageAlign:"left"   
         }).then(() => {
            curData.locationDetail = "";
            this.utils.ajax({
            url: this.api.tongjiSignOutDetails,
            data: {
                id:this.singId, 
                locationDetail: curData.locationDetail == "正在获取当前位置" ? '' : curData.locationDetail,
                latitudeAndLongitude: curData.latitudeAndLongitude
            },
            method: "POST",
            success: data => {
              // singBtnEndTime
              this.singBtnEndTime = this.utils.formatDate(data.signOutTime, "HH:mm");
              this.singingFlage = "1";
              this.Toast("签退成功("+ this.singBtnEndTime +")");
              setTimeout(() => {
               this.utils.goBack(this);
               }, 500);
             }
           });
          });
        }else{
            this.utils.ajax({
            url: this.api.tongjiSignOutDetails,
            data: {
                id:this.singId, 
                locationDetail: curData.locationDetail == "正在获取当前位置" ? '' : curData.locationDetail,
                latitudeAndLongitude: curData.latitudeAndLongitude
            },
            method: "POST",
            success: data => {
              // singBtnEndTime
              this.singBtnEndTime = this.utils.formatDate(data.signOutTime, "HH:mm");
              this.singingFlage = "1";
              this.Toast("签退成功("+ this.singBtnEndTime +")");
              setTimeout(() => {
              this.utils.goBack(this);
              }, 500);
            }
          });
        }
    },
    beforeClose(action, done) {
      // 同济
      if (action === "confirm") {
        if (this.flagesing) {
          let curData = Object.assign(
            {},
            { flag: 1, id: this.siginId, dutyTypeId: this.ids },
            this.locationObj
          );
          if (!curData.flage) {
            this.Dialog.confirm({
              title: "温馨提示",
              message: "未获取到位置信息，可能是以下原因\n(1) 请用本机使用高德地图查看位置是否显示正常\n(2) 请检查APP是否获取‘位置’权限。\n(3) 网络状态不佳。\n是否仍然签到？",
              messageAlign:"left"         
            }).then(() => {
              curData.locationDetail = "";
              this.utils.ajax({
                url: this.api.saveTongJiSignIn,
                data: curData,
                method: "POST",
                success: data => {
                  this.classesSging1 = [];
                  this.singBtnStartTime = this.utils.formatDate(data.signInTime, "HH:mm");
                  this.singId = data.id;
                  this.Toast("签到成功("+ this.singBtnStartTime +")");
                   console.log(data,'1225555');
                  this.classesSging1.push(this.classesSging);
                  this.singingFlage = "";
                }
              });
            });
          } else {
            this.classesSging1 = [];
            this.utils.ajax({
              url: this.api.saveTongJiSignIn,
              data: curData,
              method: "POST",
              success: data => {
                console.log(data,'1225555');
                this.singBtnStartTime = this.utils.formatDate(data.signInTime, "HH:mm");
                this.singId = data.id;
                this.Toast("签到成功("+ this.singBtnStartTime +")");
                this.classesSging1.push(this.classesSging);
                this.singingFlage = "";
              }
            });
          }
          // 请求提交接口
          done();
        } else {
          this.Toast("请选择班次");
          done();
        }
      } else {
        done();
      }
    },
    circleClick(item) {
      this.singinData.forEach(itemm => {
        itemm.dutyTypeExtList.forEach(i => {
          i.checked = false;
        });
      });
      this.siginId = item.id;
      this.ids = item.ids;
      item.checked = !item.checked;
      if (item.checked) {
        this.flagesing = item.checked;
      } else {
        this.flagesing = item.checked;
      }
      this.classesSging = item;
    },
    sgingCreate(){
      this.utils.ajax({
        url: this.api.queryTongjiSignInDetails,
        data: {},
        method: "POST",
        success: data => {
          if(data == null){
            this.singingFlage = '1'
          }else{
            console.log(data,'15151');
            this.singingFlage = data.signOutTime;
            this.classesSging1.push(data);
            this.singId = data.id;
            this.singBtnStartTime = this.utils.formatDate(data.signInTime, "HH:mm");
          }
        }
      });
    }
  },

  created() {
    if(this.institutionId == "e5826aa4499f406bae1792075d670b42" || this.institutionId =="2a951a3ea72b4be6b983464d8ee47034"){
      // if(this.institutionId == "bb716ea2d8034b5badfb83efd9a11f60"){
      this.sgingCreate();
    }
    this.getSignInDetails(() => {
      this.authority("", true);
    });

    // this.location();
  }
};
</script>

<style scoped>
.sigin_head {
  padding: 1rem 0.9rem;
  background: #fff;
  margin-bottom: 0.5rem;
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
  padding: 1rem 0.9rem;
  margin-top: 0.5rem;
}

.sginTitle {
  font-weight: 700;
}

.singBtn {
  border: 0.5rem solid;
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
  background: -webkit-gradient(
    linear,
    left top,
    right bottom,
    color-stop(#0f6ae2),
    color-stop(#33ccff)
  );
  background: -webkit-linear-gradient(top right, #0f6ae2, #33ccff);
  background: -o-linear-gradient(top right, #0f6ae2, #33ccff);
  background: -ms-linear-gradient(top right, #0f6ae2, #33ccff);
  /* autoprefixer: on */
}

.wholeCircleTitle {
  font-size: 1.2rem;
  line-height: 5rem;
}
.classTime {
  width: 5rem;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
}
.classes {
  height: 15rem;
  overflow-y: auto;
  padding: 0.5rem 1rem;
}
.circle {
  width: 95%;
  padding: 0.5rem;
  border: 1px solid #333;
  border-radius: 20px;
  margin-top: 0.5rem;
  text-align: center;
}
.gred {
  background: #24a3f3;
  color: white;
  border: 0;
 
}
</style>
