<template>
  <div>
    <van-nav-bar title="教学活动" class="header" fixed left-arrow @click-left="onClickLeft"/>
    <div class="layout_content">
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
            <ActivityParticipated></ActivityParticipated>
          </div>
        </van-tab>
      </van-tabs>
    </div>
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
    };
  },
  created() {
    // this.getLeaveList();
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    change() {
      document.querySelector(".layout_content").scrollTop = 0;
    },
  }
};
</script>

<style scoped>

/* 已参加 */

</style>
