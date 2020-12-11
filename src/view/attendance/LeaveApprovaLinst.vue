<template>
  <div class="leaveWarp" :class="isAndroid?'autoInput':''">
    <van-nav-bar title="请假审批" class="header" fixed left-arrow @click-left="onClickLeft" />

    <div class="layout_content">
      <div class="tabulate">
        <div class="LeaveType">
          <div class="leave_type_list">
            <p>请假类型：</p>
            <p class="leave_font_list">{{manualAuditList[0].attendanceTypeName}}</p>
          </div>
          <div class="leave_type_list">
            <p>申请人：</p>
            <p class="leave_font_list">{{manualAuditList[0].name}}</p>
          </div>
          <div class="leave_type_list">
            <p>申请时间：</p>
            <p class="leave_font_list">{{manualAuditList[0].applyDate}}</p>
          </div>
          <div class="leave_type_list">
            <p>请假时间：</p>
            <p class="leave_font_list">{{manualAuditList[0].startDatee}}</p>
          </div>
          <div class="leave_type_list">
            <p>请假天数：</p>
            <p class="leave_font_list">{{manualAuditList[0].dayNum}}天</p>
          </div>
          <div class="leave_type_list">
            <p>请假原因：</p>
            <p class="leave_font_list reason">{{manualAuditList[0].reason}}</p>
          </div>
        </div>
        <div class="Leave_type_top">
          <div class="approval_opinion">
            <p>审批意见：</p>
            <van-field v-model="manualAuditList[0].auditOpinion" type="textarea" placeholder="请输入审批意见" class="textarea"
              maxlength="200" rows="1" />
          </div>
        </div>
      </div>
      <!-- <div class="button">
        <p class="pass" @click="pass()">审核通过</p>
        <p class="Nopass" @click="Nopass()">审核不通过</p>
      </div>
      <van-dialog v-model="dialogshow" show-cancel-button :before-close="beforeClose">
        <p class="cause">不通过原因</p>
        <van-field v-model="idea" type="textarea" placeholder="请输入文字" class="textarea" rows="1" autosize />
      </van-dialog>-->
      <!-- <PassAndNoPass @auditHandle="manualAudit" :list="manualAuditList"></PassAndNoPass> -->
    </div>
    <div class="button">
      <p class="pass" @click="pass()">审核通过</p>
      <p class="Nopass" @click="Nopass()">审核不通过</p>
    </div>
  </div>
</template>

<script>
/*登记手册*/
import PassAndNoPass from "@/components/PassAndNoPass";

export default {
  name: "LeaveApprovaLinst",
  components: {
    PassAndNoPass: PassAndNoPass
  },
  data() {
    return {
      show: false,
      dialogshow: false,
      isAndroid: false,
      applyTime: "",
      time: "",
      idea: "",
      startDate: "",
      auditOpinion: "",
      manualAuditList: [
        {
          name: "",
          attendanceTypeName: "",
          applyDate: "",
          startDatee: "",
          dayNum: "",
          reason: "",
          auditOpinion: "",
          selected: true
        }
      ],
      params: {
        flag: "",
        listVo: []
      }
    };
  },
  created() {
    this.isAndroid = this.isInAndroid();
    this.getParams();
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    isInAndroid() {
      let ua = navigator.userAgent;
      console.log(ua, "jjjj");

      return ua.indexOf("Android") > -1 || ua.indexOf("Adr") > -1;
    },
    onSelect() {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.show = false;
    },
    getParams: function () {
      let list = this.manualAuditList[0];
      list.name = this.$route.params.name;
      list.applyDate = this.$route.params.applyDate;
      list.startDatee = this.$route.params.startDatee;
      list.attendanceTypeName = this.$route.params.attendanceTypeName;
      list.dayNum = this.$route.params.dayNum;
      list.reason = this.$route.params.reason;
      list.id = this.$route.params.id;
    },
    checkedList(flag, tost) {
      this.params.flag = flag;
      this.params.listVo = this.manualAuditList[0];
      this.utils.ajax({
        url: this.api.saveAuditAttendance,
        data: this.params,
        method: "POST",
        success: data => {
          this.Toast(tost);
          setTimeout(() => {
            this.utils.goBack(this);
          }, 400);
        }
      });
    },
    pass() {
      // 通过
      this.checkedList(1, "审核通过");
    },
    Nopass() {
      // 不通过
      console.log("不通过");
      if (this.manualAuditList[0].auditOpinion == "") {
        this.Toast("请写审批意见");
      } else if (this.manualAuditList[0].auditOpinion.length > 200) {
        this.Toast("不能超过200字符");
      } else {
        this.checkedList(2, "审核不通过");
      }
    }
  }
};
</script>

<style scoped>
.leaveWarp {
  padding-bottom: 2.5rem;
}
.LeaveType {
  width: 100%;
  background: white;
}
.leave_type_list {
  background: white;
  font-size: 0.875rem;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f8f8f8;
  padding: 0rem 1rem;
}
.leave_font_list {
  text-align: right;
}
.Leave_type_top {
  margin-top: 0.7rem;
  background: white;
  padding: 1rem 0;
  margin-bottom: 1rem;
}
.approval_opinion p {
  font-size: 0.875rem;
  width: 89%;
  margin: 0 auto;
}
.textarea {
  margin-left: 0.3rem !important;
}
.button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  color: white;
  font-size: 0.875rem;
}
.button p {
  width: 50%;
  text-align: center;
  padding: 0.5rem 0;
  margin: 0;
}
.button .pass {
  background: #007acc;
}
.button .Nopass {
  background: #cd3333;
}
.van-cell {
  width: 98% !important;
}
.cause {
  text-align: center;
  padding: 0.2rem;
  border-bottom: 1px solid #f8f8f8;
}
.autoInput {
  min-height: 100vh;
}
.leave_type_list p:nth-of-type(1) {
  width: 4.5rem;
}
.leave_type_list p:nth-of-type(2) {
  width: 78%;
  word-wrap: break-word;
}
.reason {
  text-align: left;
}
</style>
