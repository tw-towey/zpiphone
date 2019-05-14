<template>
  <div class>
    <div
      data-v-0f4718e4
      class="header van-nav-bar van-nav-bar--fixed van-hairline--bottom"
      style="z-index: 1;"
    >
      <div data-v-0f4718e4 class="van-nav-bar__left" @click="onClickLeft">
        <i data-v-0f4718e4 class="van-icon van-icon-arrow-left van-nav-bar__arrow">
          <!---->
        </i>
      </div>
      <div data-v-0f4718e4 class="van-nav-bar__title van-ellipsis tosa">跟师考勤</div>
      <div data-v-0f4718e4 class="van-nav-bar__right " @click="onClickRight"><van-icon name="scan" size="1.8em" /></div>
    </div>

    <div class="layout_content">
      <ViewList :listObj="listObj" :listData="listData"></ViewList>
    </div>
  </div>
</template>

<script>
import ViewList from "@/components/ViewList";

export default {
  name: "TeacherAttendance",
  components: {
    ViewList: ViewList
  },
  data() {
    return {
      listData: [],
      listObj: {
        list: [
          { field: "导师姓名：", name: "name", leftClass: "gray" },
          { field: "签到时间：", name: "signInTime", leftClass: "gray" }
        ]
      },
      locationObj: {
        locationDetail: "正在获取当前位置",
        latitudeAndLongitude: ""
      }
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    onClickRight(v) {
      console.log(1111);
      this.location();
    },
    location() {
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
          this.sood();
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
        console.log(this.locationObj.latitudeAndLongitude, "555555555555555");
        console.log(this.locationObj.locationDetail, "464646464");
        var params = {
          qrCodeInfoJson: JSON.stringify(obj),
          memberCaId: this.$store.state.userInfo.human.caId,
          teachingId: this.applyList.teachingId, //签到/签退经纬度
          latitudeLongitude: this.locationObj.latitudeAndLongitude,
          locationDetail: this.locationObj.locationDetail //  签到/签退地点详情
          // latitudeLongitude: "39.982597,116.436353",
          // locationDetail: "北京市朝阳区太阳宫镇文学院路40煤炭信息研究院"
        };
        console.log(params, "ajsd");
        this.utils.ajax({
          url: this.api.saveQrSignInOrSignOut,
          method: "POST",
          data: params,
          success: data => {
            this.Toast("打卡成功");
            setTimeout(() => {
              this.tabclass();
            }, 1000);
          }
        });
      });
    },
    tabclass() {
      let params = {
        auditFlag: "0",
        currentPage:
          Math.ceil(this.listData.length / this.$store.state.pageSize) + 1,
        pageSize: this.$store.state.pageSize
      };
      this.utils.ajax({
        url: this.api.queryAuditList,
        method: "POST",
        data: params,
        success: data => {
          console.log("ssssggg", data);
          data.content = [
            {
              name: "张三",
              signInTime: "2019-05-09 上午"
            }
          ];
          if (data.content.length) {
            const content = data.content.map(i => {
              const item = i;
              //   item.name = item.studentVO.name;
              //   item.startDatee = item.startDate + "-" + item.endDate;
              return item;
            });
            this.listData = content;
          }
        }
      });
      // }
    }
  },
  created() {
    this.tabclass();
  }
};
</script>
<style  scoped>
.van-nav-bar__right {
  color: white;
}
.van-search {
  padding: 0.35rem;
  margin: 0;
}
.van-search .van-cell {
  padding: 0.1rem;
}
</style>
