<template>
  <div class="module rotation">
    <van-cell title="我的轮转" is-link value="查看全部" @click="viewRotation" />
    <van-row>
      <van-col span="12" :class="$store.state.institutionId == 'fa5783c717ae46a28824a9d26add2c10' ? 'wid100' : ''">
        <div class="br rotation_detail">
          <div class="department">
            <span class="entry_label">{{rotationDetail.departmentName}}</span>
            <span class="entry_flag" :style="{background: bgColor(rotationDetail)}">{{rotationDetail.entryText}}</span>
          </div>
          <div class="entry_time van-ellipsis">{{rotationDetail.rotationTime}}</div>
          <div class="relative" style="margin-top: .5rem;">
            <span>{{daysText}}</span>
            <div class="days"><span>{{rotationDetail.outDepartment}}</span>天</div>
          </div>
          <p>
            <van-progress :show-pivot="showPivot" color="linear-gradient(to right, #1186ff, #50cc87)" :percentage="rotationDetail.entry" />
          </p>
          <div>带教老师：{{rotationDetail.teacherName}}</div>
<!--          <div style="padding-top: .5rem" @click="entryStudy">入科学习》</div>-->
        </div>
      </van-col>
      <van-col span="12" v-if="$store.state.institutionId != 'fa5783c717ae46a28824a9d26add2c10'">
        <div class="register_detail" @click="viewRegister">
          <div class="center">登记手册</div>
          <div style="margin-top: .5rem;" v-for="(item,index) in statisticsLIst" :key="index">
            <div class="pb2">{{utils.getValueByvalue(oneLevelType, item.oneLevelType)}}</div>
            <div>
              <van-progress :show-pivot="showPivot" color="linear-gradient(to right, #1186ff, #42afff)" :percentage="index==3?item.actualNum:item.finishedPercent" />
            </div>
          </div>
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
      },
      statisticsLIst: [
        { oneLevelType: 1,finishedPercent:0,actualNum:0},
        { oneLevelType: 2,finishedPercent:0,actualNum:0},
        { oneLevelType: 3,finishedPercent:0,actualNum:0},
        { oneLevelType: 4,finishedPercent:0,actualNum:0},
      ],
      oneLevelType: [
        {text: '病种', value: 1},
        {text: '技能', value: 2},
        {text: '手术', value: 4},
        {text: '其他', value: 3},
      ],
    };
  },
  methods: {
    getRotation() {
      // 登记手册
      let params = {};
      if (this.$store.state.curRotationDepartment) {
        params.schedulingId = this.$store.state.curRotationDepartment.id;
      }
      this.utils.ajax({
        method: "POST",
        url: this.api.queryPhoneMyCycleInfo,
        data: params, 
        success: data => {
          console.log(data)
          if(data === null){
              return ;
          }
        
          this.$store.state.scheduling = data;//保存轮转计划信息
          console.log(data);
          this.$store.state.scheduling.range = this.utils.formatDate(
              data.startTime,
              "yyyy-MM-dd",
              false
          ) + "~" + this.utils.formatDate(
              data.endTime ,
              "yyyy-MM-dd",
              false
          );
          console.log(this.utils.formatDate(
              data.endTime ,
              "yyyy-MM-dd",
              false
          ) );
          this.$store.state.currentDepartment = data;
          if (data) {
            this.complete(data);
            this.enrollmentStatistics = data;
            // this.$store.state.currentDepartment.normalDepartmentId = data.normalDepartmentId
            // this.$store.state.currentDepartment.departmentCaId = data.departmentCaId;
            // this.$store.state.currentDepartment.version = data.version;
            // this.$store.state.currentDepartment.multistandardId = data.multistandardId;
            let curData = data;
            let timestamp = this.utils.formatDate(
              this.$store.state.timestamp,
              "yyyy-MM-dd"
            );
            let oneDay = 24 * 60 * 60 * 1000;
            curData.startDate = this.utils.formatDate(
              curData.startTime,
              "yyyy-MM-dd"
            );
            curData.endDate = this.utils.formatDate(
              curData.endTime,
              "yyyy-MM-dd"
            );
            let future =
              this.utils.getTime(timestamp) <
              this.utils.getTime(curData.startTime); //未发生的轮转
            let pastTimes =
              this.utils.getTime(timestamp) >
              this.utils.getTime(curData.endTime); // 已入科的轮转
            if (future || pastTimes) {
              curData.outDepartment = Math.ceil(
                (this.utils.getTime(curData.endTime) -
                  this.utils.getTime(curData.startTime)) /
                  oneDay
              );
              if (future) {
                curData.entry = 0;
                curData.entryStatus = 0;
              } else {
                curData.entry = 100;
                curData.entryStatus = 2;
              }
              this.daysText = "轮转天数";
            } else {
              curData.totalDays =
                (this.utils.getTime(curData.endDate) -
                  this.utils.getTime(curData.startDate)) /
                oneDay; // 总天数
              curData.outDepartment =
                (this.utils.getTime(curData.endDate) -
                  this.utils.getTime(timestamp)) /
                oneDay; // 距离出科天数
              curData.entry =
                (
                  (curData.totalDays - curData.outDepartment) /
                  curData.totalDays *
                  100
                ).toFixed(2) - 0; // 已入科天数
              this.$store.state.outDepartment = curData.outDepartment;
              this.daysText = "距离出科";
            }
            if (curData.startTime) {
              curData.rotationTime = curData.startDate + "~" + curData.endDate;
            }
            curData.teacherName = curData.teacherName.split(",")[0];
            curData.entryText = curData.entryStatus
              ? curData.entryStatus === 1 ? "已入科" : "已出科"
              : "未入科";
            this.rotationDetail = curData;
          } else {
            this.rotationDetail = {
              departmentName: "",
              rotationTime: "",
              startTime: "",
              endTime: "",
              totalDays: 0,
              outDepartment: 0,
              entry: 0,
              teacherName: ""
            };
          }
        },
        error: data => {
          this.$store.state.currentDepartment = null;
          this.Toast(data.error);
        }
      });
    },
    viewRotation() {
    //  if(!this.$store.state.currentDepartment){
    //     this.Toast("当前没有轮转科室");
    //     return
    //   }
      this.$router.push({ name: "RotationPlan" });
    },
    viewRegister() {
      if(!this.$store.state.scheduling){
        this.Toast("当前没有轮转科室");
        return
      }
      let currentRtime = this.$store.state.scheduling;
      let rotationTime = this.$store.state.currentRotationTime;
      if (rotationTime.endTime) {
        if (
          this.utils.getTime(currentRtime.startTime) >
          this.utils.getTime(rotationTime.startTime)
        ) {
          this.Toast("轮转计划未开始，暂时无法查看");
          return;
        }
      }
      this.$router.push({ name: "RegistrationManual" });
    },
    entryStudy(){
      if(!this.$store.state.scheduling){
        this.Toast("当前没有轮转科室");
        return
      }

      this.$router.push({ name: "EntryStudy" });
    },
    bgColor(data) {
      return data.entryStatus === 0
        ? "#e44444"
        : data.entryStatus ? "#4ebc7f" : "";
    },
    complete(data) {
      this.utils.ajax({
        method: "POST",
        url: this.api.statisticsEnrollmentByOneLevelType,
        data: {
            normalDepartmentId: data.normalDepartmentId,
            version:data.version,
            // departmentCaId: data.departmentId,
            multistandardId:data.multistandardId,
        },
        success: data => {
           this.statisticsLIst = data;
        }
      });
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
  border-bottom: 0.07rem solid #ddd;
  -webkit-transform: scaleY(1);
  transform: scaleY(1);
  left: 0;
}

.rotation .rotation_detail,
.rotation .register_detail {
  padding: 0.5rem 0.9rem;
}

.rotation_detail .van-progress {
  height: 0.1rem;
}

.department {
  position: relative;
  padding: 0.2rem 0;
  font-size: 0.9rem;
  height: 1.3rem;
}

.department span {
  position: absolute;
  right: 0;
  font-size: 0.6rem;
  padding: 0.15rem 0.5rem;
  /*background: #4ebc7f;*/
  border-radius: 0.2rem;
  color: #fff;
}
.department .entry_label {
  position: absolute;
  left: 0;
  width: 6.5rem;
  font-size: 0.8rem;
  color: #000;
  padding: 0;
  border-radius: 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.entry_time {
  color: #969799;
  height: 1.5rem;
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
  padding-bottom: 0.2rem;
}
.wid100 {
  width: 100%;
}
</style>
