<template>
  <div>
    <van-nav-bar title="教学活动" class="header" fixed left-arrow @click-left="onClickLeft" />
    <div class="layout_content">

      <div class="title_heten">
        <p
          @click="show(datastartTime,true)"
        >{{moduleData.data.name || '全部'}}</p>
      </div>
      <div class="title_heten_k">
        
      </div>
      <van-tabs
        v-model="active"
        swipeable
        title-active-color="#1a7fe9"
        color="#5fa4ec"
        :line-height="2"
        @change="change"
      >
        <van-tab title="待参加">
          <ActivitiesAttended ref="onLoad"></ActivitiesAttended>
        </van-tab>
        <van-tab title="已参加">
          <div class="attend">
            <ActivityParticipated ref="onLoad"></ActivityParticipated>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <van-popup v-model="moduleData.show" position="bottom">
        <van-datetime-picker
          v-if="moduleData.show"
          :value="currentTime"
          type="year-month"
          :min-date="currentDate"
          :formatter="formatter"
          @confirm="selectMajorConfirm"
          @cancel="show('', false)"
        />
    </van-popup>
  </div>
</template>

<script>
import ActivitiesAttended from "@/components/ActivitiesAttended";
import ActivityParticipated from "@/components/ActivityParticipated";

/*教学活动*/
export default {
  name: "TeachingActivities",
  components: {
    ActivitiesAttended: ActivitiesAttended,
    ActivityParticipated: ActivityParticipated
  },
  data() {
    return {
      applyList: [],
      applyListt: [],
      active: 0,
      startTime: "",
      department: "",
      timeShow: false,
      deprtemShow: false,
      moduleData: {
        show: false,
        data: {}
      },
      currentDate: new Date(2015,1,1),
      startTimekey: "",
      currentTime: new Date(),
      datastartTime: {
        name: "",
        type: "startDate",
        show: false,
        id: "",
        title: "请选择月份",
        option: [
        ]
      }
    };
  },
  created() {
    this.$store.state.activitiesDetailsObj = {};
    this.$store.state.timeStartDate = "";
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    change() {
      document.querySelector(".layout_content").scrollTop = 0;
    },
    formatter(type, value) {
      return this.utils.pickerType(type, value);
    },
    selectMajorConfirm(val, i) {
      this.moduleData.show = false;
      this.moduleData.data.name = this.utils.formatDate(val, "yyyy-MM", true).replace(/-/g, "/");
      this.$store.state.timeStartDate = this.utils.formatDate(val, "yyyy-MM", true).replace(/-/g, "-");
      this.$refs.onLoad.getLeaveList('1');
    },
    show(item, staus) {
      this.moduleData.show = staus;
      this.moduleData.data = item;
      this.$store.state.timeStartDate = '';
      this.$refs.onLoad.getLeaveList('1');
    },
    getValueByvalue(list, key) {
      if (list) {
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          if (item.value == key) {
            return item.text;
          }
        }
      }
      return "";
    }
  }
};
</script>

<style scoped>
/* 已参加 */
.title_heten {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.8rem;
  background: white;
  border-bottom: 1px solid #cccc;
    position: fixed;
    width: 100%;
  top: 2.5rem;
  z-index: 1111;
}
.title_heten p {
  margin: 0;
  padding: 0;

}
.title_heten_k{
  height: 2rem;
}
</style>
