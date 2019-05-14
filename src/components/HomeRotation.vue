<template>
  <div class="module rotation">
    <van-cell title="我的轮转" is-link value="查看全部" @click="viewRotation"/>
    <van-row>
      <van-col span="12">
        <div class="br rotation_detail">
          <div class="department">{{rotationDetail.departmentName}}
            <span class="entry_flag" :style="{background: bgColor(rotationDetail)}">{{rotationDetail.entryText}}</span>
          </div>
          <div class="entry_time van-ellipsis">{{rotationDetail.rotationTime}}</div>
          <div class="relative">
            <p>
              <span>{{daysText}}</span>
            <div class="days"><span>{{rotationDetail.outDepartment}}</span>天</div>
            </p>
          </div>

          <p>
            <van-progress :show-pivot="showPivot" color="linear-gradient(to right, #1186ff, #50cc87)"
                          :percentage="rotationDetail.entry"/>
          </p>
          <div>带教老师：{{rotationDetail.teacherName}}</div>
        </div>
      </van-col>
      <van-col span="12">
        <div class="register_detail" @click="viewRegister">
          <div class="center">登记手册</div>
          <p>
          <div class="pb2">病种</div>
          <div>
            <van-progress :show-pivot="showPivot" color="linear-gradient(to right, #1186ff, #42afff)"
                          :percentage="enrollmentStatistics.percentageDiseases"/>
          </div>
          </p>
          <p>
          <div class="pb2">技能</div>
          <div>
            <van-progress :show-pivot="showPivot" color="linear-gradient(to right, #1186ff, #42afff)"
                          :percentage="enrollmentStatistics.percentageSkill"/>
          </div>
          </p>
          <div class="relative other">其他录入 <span>{{enrollmentStatistics.otherNum}}份</span></div>
        </div>
      </van-col>
    </van-row>
  </div>
</template>

<script>
  /*学员首页-->轮转计划*/
  export default {
    name: "HomeRotation",
    data() {
      return {
        showPivot: false,
        rotationDetail: {
          departmentName: "",
          rotationTime: "",
          startTime: "",
          endTime: "",
          totalDays: 0,
          outDepartment: 0,
          entry: 0,
          teacherName: ""
        },
        daysText: "距离出科",
        enrollmentStatistics: {
          otherNum: 0,
          percentageDiseases: 0,
          percentageSkill: 0
        }
      };
    },
    methods: {
      getRotation() {
        // 登记手册
        let params = {
          studentId: this.$store.state.userInfo.human.caId
        };
        if (this.$store.state.curDepartmentTime) {
          params.currTime = this.$store.state.curDepartmentTime.endDate;
        }
        this.utils.ajax({
          method: "POST",
          url: this.api.homeRotation,
          data: params,
          success: (data) => {
            this.$store.state.currentDepartment = data.phoneMyCycleInfo;
            if (data.enrollmentStatistics) { // 登记手册
              this.enrollmentStatistics = data.enrollmentStatistics;
              this.$store.state.currentDepartment.normalDepartmentId = data.enrollmentStatistics.normalDepartmentId;
              this.$store.state.currentDepartment.departmentCaId = data.enrollmentStatistics.departmentCaId;
            }
            if (data.phoneMyCycleInfo) {
              let curData = data.phoneMyCycleInfo;
              let timestamp = this.utils.formatDate(this.$store.state.timestamp, "yyyy-MM-dd");
              let oneDay = 24 * 60 * 60 * 1000;
              curData.startDate = this.utils.formatDate(curData.startTime, "yyyy-MM-dd");
              curData.endDate = this.utils.formatDate(curData.endTime, "yyyy-MM-dd");
              let future = this.utils.getTime(timestamp) <= this.utils.getTime(curData.startTime);//未发生的轮转
              let pastTimes = this.utils.getTime(timestamp) >= this.utils.getTime(curData.endTime);// 已入科的轮转
              if (future || pastTimes) {
                curData.outDepartment = Math.ceil((this.utils.getTime(curData.endTime) - this.utils.getTime(curData.startTime)) / oneDay);
                if (future) {
                  curData.entry = 0;
                  curData.entryStatus = 0;
                } else {
                  curData.entry = 100;
                  curData.entryStatus = 2;
                }
                this.daysText = "轮转天数";
              } else {
                curData.totalDays = (this.utils.getTime(curData.endDate) - this.utils.getTime(curData.startDate)) / oneDay; // 总天数
                curData.outDepartment = (this.utils.getTime(curData.endDate) - this.utils.getTime(timestamp)) / oneDay; // 距离出科天数
                curData.entry = ((curData.totalDays - curData.outDepartment) / curData.totalDays * 100).toFixed(2) - 0; // 已入科天数
                this.daysText = "距离出科";
              }
              if (curData.startTime) {
                curData.rotationTime = curData.startDate + "~" + curData.endDate;
              }
              curData.teacherName = curData.teacherName.split(",")[0];
              curData.entryText = curData.entryStatus ? (curData.entryStatus === 1 ? "已入科" : "已出科") : "未入科";
              this.rotationDetail = curData;
            }
          },
          error: (data) => {
            this.$store.state.currentDepartment = null;
            this.Toast(data.error);
          }
        });
      },
      viewRotation() {
        this.$router.push({ name: "RotationPlan" });
      },
      viewRegister() {
        this.$router.push({ name: "RegistrationManual" });
      },
      bgColor(data) {
        return data.entryStatus === 0 ? "#e44444" : (data.entryStatus ? "#4ebc7f" : "");
      }
    },
    created() {
      this.getRotation();
    }
  };
</script>

<style scoped>
  .rotation .van-cell__title span {
    font-size: 1rem;
  }

  .rotation .van-cell:not(:last-child)::after {
    border-bottom: .07rem solid #ddd;
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
    left: 0;
  }

  .rotation .rotation_detail, .rotation .register_detail {
    padding: .5rem .9rem;
  }

  .rotation_detail .van-progress {
    height: .1rem;
  }

  .department {
    position: relative;
    padding: .2rem 0;
    font-size: .9rem;
    height: 1.3rem;
  }

  .department span {
    position: absolute;
    right: 0;
    font-size: .6rem;
    padding: .15rem .5rem;
    /*background: #4ebc7f;*/
    border-radius: .2rem;
    color: #fff;
  }

  .entry_time {
    color: #969799;
    height: 1rem;
  }

  .days {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .days span {
    font-size: 1.5rem;
  }

  .other span {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .pb2 {
    padding-bottom: .2rem;
  }
</style>
