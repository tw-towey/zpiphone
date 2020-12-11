<template>
  <div @click="domClick">
    <van-nav-bar title="分配带教" class="header" fixed left-arrow @click-left="onClickLeft" />
    <div class="layout_content" :class="chooseTimeShow ? 'bottom16rem' : ''" @scroll="scroll">
      <van-tabs v-model="tabMode" swipeable sticky title-active-color="#1a7fe9" color="#5fa4ec" :line-height="2"
        :offset-top="40" @change="change">
        <van-tab title="待分配">
          <div class="head-time" data-name="time" @click="chooseTime">
            <span data-name="time">入科时间</span>
            <span data-name="time" class="time">
              {{time1 ? time1 : '请选择时间'}}
              <van-icon data-name="time" name="arrow" />
            </span>
          </div>
          <ListLazy :mode="1" :time="time1" ref="mychild1"></ListLazy>
        </van-tab>
        <van-tab title="已分配">
          <div class="head-time" data-name="time" @click="chooseTime">
            <span data-name="time">入科时间</span>
            <span data-name="time" class="time">
              {{time2 ? time2 : '请选择时间'}}
              <van-icon data-name="time" name="arrow" />
            </span>
          </div>
          <ListLazy :mode="2" :time="time2" ref="mychild"></ListLazy>
        </van-tab>
      </van-tabs>
    </div>
    <van-datetime-picker v-if="chooseTimeShow" v-model="currentDate" type="year-month" @confirm="dateConfirm"
      @cancel="cancel" />
  </div>
</template>

<script>
// 其他轮转
import ListLazy from "./ListLazy";
export default {
  name: "AllocationTeacher",
  components: {
    "ListLazy": ListLazy
  },
  data() {
    return {
      time: "",
      time1: "",
      time2: "",
      loading: false,
      finished: false,
      currentDate: new Date(),
      chooseTimeShow: false,
      scrollTop0: 0,
      scrollTop1: 0,
      tabMode: 0,
      mode: 1,
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
      this.$store.state.teacherTime1 = "";
      this.$store.state.teacherTime2 = "";
      this.$store.state.tabActive = 0;
    },
    domClick(e) {
      if (this.chooseTimeShow) {
        if (e.target.getAttribute("data-name") != "time") {
          this.cancel();
        }
      }
    },
    scroll() {
      if (this.tabMode) {
        this.scrollTop1 = document.querySelector('.layout_content').scrollTop;
      } else {
        this.scrollTop0 = document.querySelector('.layout_content').scrollTop;
      }
    },
    chooseTime() {
      if (!this.chooseTimeShow) {
        this.chooseTimeShow = true;
        setTimeout(() => {
          let picker = document.querySelector(".van-picker");
          picker.onclick = e => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
          };
        }, 0);
      }
    },
    dateConfirm(val) {
      this.time = val.getFullYear() + "-" + Number(val.getMonth() + 1);
      // this.Toast.loading({
      //   mask: true,
      //   message: "加载中...",
      //   duration: 0
      // });
      if (this.tabMode) {
        this.$store.state.teacherTime2 = this.time;
        this.time2 = this.time;
        this.$refs.mychild.getData(this.time);
      } else {
        this.$store.state.teacherTime1 = this.time;
        this.time1 = this.time;
        this.$refs.mychild1.getData(this.time);
      }

      this.cancel();
    },
    cancel() {
      this.chooseTimeShow = false;
    },
    change(index, title) {
      var that = this;
      if (index) {
        this.tabMode = 1;
        this.mode = 2;
        this.$store.state.tabActive = 1;
      } else {
        this.mode = 1;
        this.$store.state.tabActive = 0;
        this.tabMode = 0;
      }
      setTimeout(() => {
        if (index) {
          document.querySelector('.layout_content').scrollTop = that.scrollTop1;
        } else {
          document.querySelector('.layout_content').scrollTop = that.scrollTop0;
        }
      }, 100);
    },
    onloadData() {
      if (this.$store.state.teacherTime1) {
        this.time1 = this.$store.state.teacherTime1;
      } else {
        this.time1 = this.utils.formatDate(new Date().getTime(), 'yyyy-MM');
      }
      if (this.$store.state.teacherTime2) {
        this.time2 = this.$store.state.teacherTime2;
      } else {
        this.time2 = this.utils.formatDate(new Date().getTime(), 'yyyy-MM');
      }
    }
  },
  created() {
    if (this.$store.state.tabActive) {
      this.tabMode = 1;
    } else {
      this.tabMode = 0;
    }
    this.onloadData();
  }
};
</script>

<style scoped>
.layout_content {
  background: #e8e8e8;
}
.bottom16rem {
  bottom: 16rem;
}
li {
  padding: 0.5rem 1rem;
  background: #fff;
  color: #333333;
  margin-bottom: 1px;
}
li span {
  color: #8d8d8d;
  display: inline-block;
  width: 4.1rem;
  text-align: right;
  margin-right: 0.5rem;
}
li > div > div {
  line-height: 1.5rem;
}
.flex-box {
  display: flex;
  justify-content: space-between;
}
.box-icon {
  color: #a6a6a6;
  font-size: 1.2rem;
}
.head-time {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem 0.5rem 1.3rem;
  margin-bottom: 1px;
  background: #fff;
}
.time {
  color: #999999;
}
.van-icon {
  vertical-align: middle;
  font-size: 1.05rem;
}
.van-picker {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 16rem;
  z-index: 10;
}
</style>
