<template>
  <div>
    <div class="calendarHeader">
      <span v-for="(week,index) in weeks" :key="index">{{week}}</span>
    </div>
    <div class="calendarContent slide" ref='slide' @touchstart='touchStart' @touchend='touchEnd'>
      <div class="bt" v-for="(dayList,inx) in dayLists" :key="inx" @click="getDay(dayLists, dayList)"
           :class="{disabled:dayList.isDisabled}">
        <span :class="{active:dayList.isActive}">{{dayList.num}}</span>
        <p :style="{background: dayList.flagBg}"></p>
      </div>
    </div>
  </div>
</template>

<script>
  // 日历
  export default {
    name: "Calendar",
    data() {
      return {
        weeks: ["日", "一", "二", "三", "四", "五", "六"],
        dayLists: [],
        selectedYearAndMonth: "",
        selectedData: {},
        startX: 0, //开始触摸的位置
        lastX: 0, //滑动时的位置
        endX: 0, //结束触摸的位置
        disX: 0 //移动距离
      };
    },
    methods: {
      isLeapYear(year) {
        // 判断是否闰年
        if (((year % 4) === 0) && ((year % 100) !== 0) || ((year % 400) === 0)) {
          return true;
        } else {
          return false;
        }
      },
      getCountDays(days) {
        // 判断传入时间一共天数
        let curDate = new Date(days);
        let curMonth = curDate.getMonth();
        curDate.setMonth(curMonth + 1);
        curDate.setDate(0);
        return curDate.getDate();
      },
      curMonthDays(curYM) {
        this.selectedYearAndMonth = curYM;
        let prevYM = this.getPrevMonth(curYM);
        let lastYM = this.getLastMonth(curYM);
        let days = this.getCountDays(curYM);
        let prevDays = this.getCountDays(prevYM);
        let lastDays = this.getCountDays(lastYM);
        let curDayLists = this.getDayList(this.selectedYearAndMonth, days, this.calendarData.list);

        if (curDayLists[0]["week"] !== 0) {
          let prevDayLists = this.getDayList(prevYM, prevDays);
          let curPrevLis = prevDayLists.slice(prevDayLists.length - curDayLists[0]["week"]);
          curDayLists = curPrevLis.concat(curDayLists);
        }
        if (curDayLists[curDayLists.length - 1]["week"] !== 6) {
          let lastDayLists = this.getDayList(lastYM, lastDays);
          let curLastLis = lastDayLists.slice(0, 6 - curDayLists[curDayLists.length - 1]["week"]);
          curDayLists = curDayLists.concat(curLastLis);
        }
        this.dayLists = curDayLists;
      },
      getDay(allLists, selectedDay) {
        if (!selectedDay.isDisabled) {
          allLists.forEach(item => {
            item.isActive = false;
          });
          selectedDay.isActive = true;
          this.$emit("activeTime", selectedDay);
        }
      },
      getDayList(yearAndMonth, days, data) {
        let list = [];
        var timesTamp = this.$store.state.timestamp.split(" ")[0];
        var timesTampMonth = timesTamp.split("-")[1];
        for (let i = 1; i <= days; i++) {
          let curDate = yearAndMonth + "-" + (i < 10 ? "0" + i : i);
          let obj = {
            num: i,
            date: curDate,
            week: new Date(curDate).getDay(),
            isActive: false,
            flagBg: "",
            isDisabled: true
          };

          if (data && data[curDate]) { // 通过后台给的状态数据显示不同颜色，data参数有数据就是当月的数字就不置灰否则置灰
            // obj.flagBg = data[curDate]["exceptionType"] ? "#F39502" : "#62AFFF";
            obj.flagBg = data[curDate]["flagBg"];
            obj.isDisabled = false;
            obj.data = data[curDate];
          } else {
            obj.flagBg = "";
            if (data) {
              obj.isDisabled = false;
              obj.data = data[curDate];
            } else {
              obj.isDisabled = true;
            }
          }
          obj.data = obj.data ? obj.data : {};
          obj.data["date"] = obj.date;

          let curMonth = curDate.split("-")[1];
          if (timesTamp === curDate && !obj.isDisabled) {
            obj.isActive = true;
            this.$emit("activeTime", obj);
          }
          if (timesTampMonth !== curMonth && i === 1 && !obj.isDisabled) {
            obj.isActive = true;
            this.$emit("activeTime", obj);
          }
          list.push(obj);
        }
        return list;
      },
      getPrevMonth(curYM) {
        let year = curYM.split("-")[0];
        let month = curYM.split("-")[1];
        if (month == 1) {
          month = 12;
          year = year - 1;
        } else {
          month = month - 1;
        }
        month = month < 10 ? "0" + month : month;
        return year + "-" + month;
      },
      getLastMonth(curYM) {
        let year = curYM.split("-")[0];
        let month = curYM.split("-")[1];
        if (month == 12) {
          month = 1;
          year = year - 0 + 1;
        } else {
          month = month - 0 + 1;
        }
        month = month < 10 ? "0" + month : month;
        return year + "-" + month;
      },


      touchStart: function(ev) {
        ev = ev || event;
        if (ev.touches.length === 1) { //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
          this.startX = ev.touches[0].clientX; // 记录开始位置
        }
      },
      touchEnd: function(ev) {
        ev = ev || event;
        let slideWidth = this.$refs.slide.offsetWidth;
        if (ev.changedTouches.length === 1) {
          let endX = ev.changedTouches[0].clientX;
          this.disX = endX - this.startX;
          // 只有滑动大于四分之一距离才触发
          if (Math.abs(this.disX) > (slideWidth / 4)) {
            if (this.disX < 0) {
              // 左滑
              this.selectedYearAndMonth = this.getLastMonth(this.selectedYearAndMonth);
              this.$emit("modifyDate", new Date(this.selectedYearAndMonth));
            } else if (this.disX > 0) {
              // 右滑
              this.selectedYearAndMonth = this.getPrevMonth(this.selectedYearAndMonth);
              this.$emit("modifyDate", new Date(this.selectedYearAndMonth));
            }
          }
        }
      }
    },
    created() {
      // console.log(1);
      // this.curMonthDays(this.calendarData.activeDate);
    },
    props: ["calendarData"]
  };
</script>

<style scoped>
  .disabled {
    color: #969799;
    background: #fff;
  }

  .active {
    border-radius: 50%;
    background: #62AFFF;
    color: #fff;
  }

  .calendarHeader {
    margin: 0 auto;
    line-height: 2.6rem;
  }

  .calendarHeader span {
    width: 14.285%;
    display: inline-block;
    text-align: center;
    font-size: 1rem;
  }

  .calendarContent {
    margin: 0 auto;
    background: #fff;
  }

  .calendarContent div {
    width: 14.285%;
    display: inline-block;
    text-align: center;
    font-size: 1rem;
    height: 2.8rem;
    margin: 0;
    padding: .2rem 0;
  }

  .calendarContent div span {
    width: 1.8rem;
    display: inline-block;
    line-height: 1.8rem;
    margin: .3rem 0 .3rem;
  }

  .calendarContent div p {
    width: 3px;
    height: 3px;
    margin: 0 auto;
    border-radius: 50%;
  }

  .normal {
    background: #62AFFF;
  }

  .abnormal {
    background: #F39502;
  }
</style>
