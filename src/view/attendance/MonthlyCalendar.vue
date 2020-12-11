<template>
  <div>
    <van-nav-bar :title="title" class="header" fixed left-arrow @click-left="onClickLeft" />

    <div class="layout_content">

      <div class="rationMonth">
        <van-nav-bar left-text="轮转月份">
          <div @click="selectTime" slot="right">{{calendarData.activeDate}} <img src="../../assets/images/page/calendar.png"></div>
        </van-nav-bar>
      </div>

      <Calendar :calendarData="calendarData" ref="viewCalendar" @modifyDate="selectDate" @activeTime="activeTime"></Calendar>

      <div class="canedarDetail" v-if="$route.name==='ViewClasses'">
        <div class="bt">
          <ul>
            <li>
              <span class="nav1">日期:</span>{{selectData.date}}</li>
            <li>
              <span class="nav1">轮转科室:</span>{{selectData.departmentName||"暂无科室"}}</li>
          </ul>
        </div>

        <div>
          <div style="padding:0.2rem">
            <template v-for="(item,index) in temObj" >
              <span class="classTime" :key="index">
                {{item.title}}
              </span>
              <ul :key="index">
                <li v-for="(dutyVo,ke) in item.list" :key="ke">
                  <span class="nav2">{{dutyVo.dutyName}}
                    <template v-if="dutyVo.dutyName">:</template>
                  </span>
                  <span>{{dutyVo.startTime}}-{{dutyVo.endTime}}</span>
                </li>
              </ul>
            </template>
          </div>
        </div>
      </div>

      <div class="canedarDetail" v-if="$route.name==='MonthlyCalendar' && selectData.isShowDepartment">
        <div class="bt">
          <ul>
            <li>
              <span class="nav1">日期:</span>{{selectData.date}}</li>
            <li>
              <span class="nav1">轮转科室:</span>{{selectData.departmentName||"暂无科室"}}</li>
          </ul>
        </div>
        <div class="mt09" v-for="(item,inx) in temObj" :key="inx">
          <div class="sginTitle classTime">{{item.title}}</div>
          <div v-for="(dutyVo,ind) in item.list" :key="ind">
            <van-row>
              <van-col span="8">
                <p class="m0 center nav2">{{dutyVo.dutyName}}</p>
              </van-col>
              <van-col span="10">
                <p class="m0">
                  <span class="gray">签到时间：</span>{{dutyVo.signInDate}}</p>
                <p class="m0">
                  <span class="gray">签退时间：</span>{{dutyVo.signOutDate}}
                  <span>{{dutyVo.signOutTimee > dutyVo.signInTimee?"次日":""}}</span>
                </p>
              </van-col>
              <van-col span="6" v-html="auditTranslate(dutyVo.auditFlag)"></van-col>
            </van-row>
          </div>
        </div>
      </div>

      <van-popup v-model="show" position="bottom">
        <van-datetime-picker v-model="currentDate" type="year-month" :formatter="formatter" @confirm="selectDate" @cancel="closePopup" />
      </van-popup>
    </div>

  </div>
</template>

<script>
/*考勤月历、查看班次*/
import Calendar from "@/components/Calendar";

export default {
  name: "MonthlyCalendar",
  components: {
    Calendar: Calendar
  },
  data() {
    return {
      currentDate: new Date(this.$store.state.timestamp.replace(/-/g, "/")),
      title: "",
      show: false,
      temObj: [],
      calendarData: {
        list: [],
        activeDate: ""
      },
      selectData: {},
      signInDate: "",
      signOutDate: ""
    };
  },
  mounted() {},
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    selectTime() {
      this.show = true;
    },
    selectDate(v) {
      let year = v.getFullYear();
      let month = (v.getMonth() + 1).toString();
      month = month.length === 1 ? "0" + month : month;
      this.calendarData.activeDate = year + "-" + month;
      console.log(this.utils.formatDate(v, "yyyy-MM-dd HH:mm:ss", true));
      this.getData({
        currDate: this.utils.formatDate(v, "yyyy-MM-dd HH:mm:ss", true)
      });
      this.show = false;
    },
    closePopup() {
      this.show = false;
    },
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      }
      return value;
    },
    activeTime(data) {
      if (data.data.dutyTypeVos) {
        data.data.dutyTypeVos.forEach(item => {
          item.signInDate = this.utils.formatDate(item.signInTime, "HH:mm");
          item.signOutDate = this.utils.formatDate(item.signOutTime, "HH:mm");
        });
      } else {
        data.data.dutyTypeVos = [];
      }
      console.log(data.data.dutyTypeVos, "1589");

      this.selectData = data.data;
      this.temObj = [];
      let temObj = {};
      data.data.dutyTypeVos.forEach(i => {
        i.signOutTimee = new Date(
          this.utils.formatDate(i.signOutTime, "yyyy-MM-dd")
        ).getTime();
        i.signInTimee = new Date(
          this.utils.formatDate(i.signInTime, "yyyy-MM-dd")
        ).getTime();
        console.log(i.signInTimee, "1111");

        if (temObj.hasOwnProperty(i.id)) {
          temObj[i.id].push(i);
        } else {
          temObj[i.id] = [i];
        }
      });
      for (const key in temObj) {
        if (temObj.hasOwnProperty(key)) {
          const i = temObj[key];
          this.temObj.push({
            title: i[0].dutyType,
            list: i
          });
        }
      }
      console.log(this.temObj, "1555555");

      this.selectData.isShowDepartment =
        this.utils.getTime(data.date) <=
        this.utils.getTime(this.$store.state.timestamp.split(" ")[0]);
    },
    auditTranslate(code) {
      let obj = {
        class: "",
        text: ""
      };
      if (code === 1) {
        obj.text = "审核通过";
        obj.class = "green";
      } else if (code === 2) {
        obj.text = "审核不通过";
        obj.class = "red";
      } else if (code === 3) {
        obj.text = "未审核";
        // 计划中，现在改为不显示
      } else {
        obj.text = "未审核";
      }
      return `<p class="m0 ${obj.class}">${obj.text}</p>`;
    },
    getData(params) {
      if (params) {
        let isCurMonth =
          params.currDate.split("-")[1] ===
            this.$store.state.timestamp.split("-")[1] &&
          params.currDate.split("-")[0] ===
            this.$store.state.timestamp.split("-")[0];
        if (isCurMonth) {
          params.currDate = this.$store.state.timestamp;
        }
      }
      params = params || { currDate: this.$store.state.timestamp };
      params.dataType = this.$route.name === "MonthlyCalendar" ? 1 : 2;
      this.utils.ajax({
        method: "POST",
        url: this.api.monthlyCalendar,
        data: params,
        success: data => {
          // console.log(data);
          // 2019.04.17 之前 需求 考勤月历和查看班次一样显示点（蓝色点或灰色点）都是用来标识考勤是否异常，没有班则不显示点；
          // 2019.04.17 下午 修改需求，考勤月历：改成签到签退并且是未审核或者审核通过显示正常（蓝色点），如果缺卡或审核不通过都是异常（黄色点），查看班次改为只要有班次就显示（灰色点），所以把颜色判断放到外面做判断，防止以后加其他颜色组件内判断太多，放到外面根据需求自定义
          for (var key in data) {
            if (data[key]["dutyTypeVos"].length) {
              if (this.$route.name === "MonthlyCalendar") {
                  console.log(this.$store.state.timestamp);
                if (
                  this.utils.getTime(key) <=
                  this.utils.getTime(this.$store.state.timestamp.split(" ")[0])
                ) {
                  data[key].flagBg = data[key]["exceptionType"]
                    ? "#F39502"
                    : "#62AFFF";
                }
              } else {
                data[key].flagBg = "#8d8d8d";
              }
            }
          }

          this.calendarData.list = data;
          this.$refs.viewCalendar.curMonthDays(this.calendarData.activeDate);
        }
      });
    }
  },
  created() {
    this.title = this.$route.name === "ViewClasses" ? "查看班次" : "考勤月历";
    this.calendarData.activeDate = this.utils.formatDate(
      this.$store.state.timestamp,
      "yyyy-MM"
    );
    this.getData();
  }
};
</script>

<style scoped>
.rationMonth .van-nav-bar__text {
  color: #000;
}

.rationMonth img {
  width: 1rem;
  height: 1rem;
  display: inline-block;
  vertical-align: sub;
}

.nav1,
.nav2 {
  width: 4rem;
  text-align: right;
  display: inline-block;
  color: #969799;
}

.nav1 {
  margin: 0 0.5rem 0.5rem 0;
}

.nav2 {
  margin: 0.5rem 0.5rem 0 0;
  width: 6rem;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.canedarDetail {
  background: #fff;
  padding: 0.9rem 0;
  margin-top: 0.5rem;
}

.canedarDetail ul {
  padding: 0 0.5rem;
  padding-left: 2rem;
}

.mt09 {
  margin-top: 0.9rem;
}
.classTime {
  width: 30%;
  padding: 0 1rem;
  line-height: 1.5rem;
  display: inline-block;
  height: 1.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
}
</style>
