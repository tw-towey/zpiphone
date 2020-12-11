<template>
  <div>
    <div class="module" v-if="leaves.length">
      <div class="bt center leaveTemp" v-for="(leave,index) in leaves" :key="index">
        <van-row >
          <van-col @click="viewDetail(leave)" span="6" class="van-ellipsis p2"> <span @click="viewDetail(leave)"> {{leave.attendanceTypeName}} </span></van-col>
          <van-col  :span="(leave.auditFlag == 0 || leave.auditFlag == 4 ) ? '14' : '18'" class="van-ellipsis p2"><span @click="viewDetail(leave)">{{leave.startDate}} ~ {{leave.endDate}}</span> </van-col>
          <van-col v-if="leave.auditFlag == 0 || leave.auditFlag == 4" span="4" class="van-ellipsis p2"><span   @click="stopApply(leave)" v-if="leave.auditFlag == 0" class=""> 撤销 </span> <span v-if="leave.auditFlag == 4" class="grey"> 撤销 </span></van-col>
        </van-row>
      </div>
    </div>
    <div v-else class="tip-empty"><span class="icon-emptyface"></span><span class="text-empty">没有相关考勤信息</span></div>
  </div>
</template>

<script>
  // 请假列表公共组件（申请中、已完成）
  export default {
    name: "LeaveList",
    data() {
      return {};
    },
    methods: {
      viewDetail(item) {
        this.$router.push({ name: "LeaveDetail", params: { id: item.id } });
      },
      stopApply(item){
        this.utils.ajax({
          method: "POST",
          url: this.api.cancelLeaveApply,
          data: {
            ids:[item.id]
          },
          success: data => {
            this.Toast("撤销成功")
          }
        })
      }
    },
    created() {

    },
    props: ["leaves"]
  };
</script>

<style scoped>
  .tip-empty {
    padding-top: 50%;
    text-align: center;
  }

  .icon-emptyface {
    height: 2rem;
    line-height: 2rem;
    display: inline-block;
    background-repeat: no-repeat;
    padding-left: 2.5rem;
    color: #d3d3d3;
  }

  .text-empty {
    color: gray;
    line-height: 2rem;
    vertical-align: text-bottom;
  }

  .leaveTemp {
    height: 3rem;
    line-height: 3rem;
    padding: 0 .9rem;
  }
</style>
