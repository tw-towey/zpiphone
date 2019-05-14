<template>
  <div>
    <van-nav-bar title="请假申请" right-text="请假" class="header" fixed left-arrow @click-left="onClickLeft"
                 @click-right="onClickRight"/>
    <div class="layout_content">
      <van-tabs v-model="active" swipeable sticky title-active-color="#1a7fe9" color="#5fa4ec" :line-height="2"
                :offset-top="40" @change="change">
        <van-tab title="申请中">
          <LeaveList :leaves="applyList"></LeaveList>
        </van-tab>
        <van-tab title="已完成">
          <LeaveList :leaves="applyList"></LeaveList>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
  /*请假申请*/
  import LeaveList from "@/view/attendance/LeaveList";

  export default {
    name: "ApplicationLeave",
    components: {
      "LeaveList": LeaveList
    },
    data() {
      return {
        active: 0,
        applyList: []
      };
    },
    methods: {
      onClickLeft() {
        this.utils.goBack(this);
      },
      onClickRight() {
        this.$router.push({ name: "Leave", params: {} });
      },
      change(index) {
        // console.log(this.$store.state);
        this.$store.state.leaveActive = index;
        let obj = {
          auditFlags: [],
          departmentId: this.$store.state.departmentId
        };
        if (index === 0) {
          // 申请中
          obj.auditFlags = [0, 4];
        } else if (index === 1) {
          // 已完成（已通过的申请、未通过的申请）
          obj.auditFlags = [1, 2];
        }
        this.getLeaveList(obj);
      },
      getLeaveList(param) {
        this.utils.ajax({
          url: this.api.queryApplyList,
          data: param,
          method: "POST",
          success: data => {
            data.forEach(item => {
              item.applyDate = this.utils.formatDate(item.applyDate);
              item.startDate = this.utils.formatDate(item.startDate);
              item.endDate = this.utils.formatDate(item.endDate);
            });
            this.applyList = data;
          }
        });
      }
    },
    created() {
      this.active = this.$store.state.leaveActive === undefined ? 0:this.$store.state.leaveActive;
      this.change(this.active);
    }
  };
</script>

<style scoped>

</style>
