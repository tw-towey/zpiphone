<template>
  <div>
    <van-nav-bar :title="type?'出科小结':'出科申请'" :right-text="type?'':'出科记录'" class="header" fixed left-arrow
                 @click-left="onClickLeft"
                 @click-right="onClickRight"/>

    <div class="layout_content" v-if="dataList.tubeBedInfo">

      <div v-if="!type&&scheduling.length" class="module">
        <van-row>
          <van-col :span="12">
            <div class="br rotation_detail">
              <div class="department">{{scheduling[0].departmentName}}
              </div>
              <div class="entry_time van-ellipsis">{{scheduling[0].rangeDate}}</div>
              <div class="relative">
                <p>
                  <span>{{allData.differenceDays?"距离出科":"已出科"}}</span>
                <div class="days"><span>{{allData.differenceDays?allData.differenceDays:allData.totalDays}}</span>天
                </div>
                </p>
              </div>

              <van-progress :show-pivot="false" color="linear-gradient(to right, #1186ff, #50cc87)"
                            :percentage="allData.departmentOutPercent"/>
            </div>
          </van-col>
          <van-col :span="12">
            <p class="a next">下一轮转科室</p>
            <div class="van-ellipsis center">{{scheduling[1]?scheduling[1].departmentName:""}}</div>
          </van-col>
        </van-row>
      </div>

      <div class="module">
        <van-cell title="带教老师" is-link :value="selectedObj.info"
                  @click="changeTeachers"/>

        <div class="summaryWarp">
          <p class="aTitle van-ellipsis font1"> 一、在本科室的管床数</p>
          <div>本科室要求完成管床数：
            {{dataList.tubeBedInfo.requireTubeBedTebNum}}例，已完成管床数：{{dataList.tubeBedInfo.completeTubeBedTebNum}}例。完成率
            {{dataList.tubeBedInfo.completePercent}}
          </div>
          <p class="aTitle van-ellipsis font1"> 二、在本科室书写大病历数</p>
          <div>
            本科室要求完成书写大病历数：{{dataList.writeRecordInfo.requireWriteRecordNum}}例，已完成书写大病历数：{{dataList.writeRecordInfo.completeWriteRecordNum}}例。完成率
            {{dataList.writeRecordInfo.completePercent}}
          </div>
          <p class="aTitle van-ellipsis font1"> 三、疾病完成情况（含门诊）(完成率:{{dataList.diseaseInfo.percent}})</p>
          <div class="tableWarp">
            <table class="table" width="0">
              <colgroup>
                <col v-for="item in column.disease" :width="item.width">
              </colgroup>
              <thead>
              <tr>
                <td v-for="item in column.disease">{{item.field}}</td>
              </tr>
              </thead>

              <tbody v-if="dataList.diseaseInfo.data.length">
              <tr v-for="(lis,index) in dataList.diseaseInfo.data">
                <td v-for="item in column.disease">{{item.name === ""?index+1:lis[item["name"]]}}</td>
              </tr>
              </tbody>
              <tbody v-else>
              <tr class="center">
                <td :colspan="column.disease.length"><span style="font-size: .8rem;">暂无数据</span></td>
              </tr>
              </tbody>

            </table>
          </div>
          <p class="aTitle van-ellipsis font1">四、技能操作(手术)完成情况(含门诊) (完成率:{{dataList.surgeryInfo.percent}})</p>
          <div class="tableWarp">
            <table class="table" width="0">
              <colgroup>
                <col v-for="item in column.skill" :width="item.width">
              </colgroup>
              <thead>
              <tr>
                <td v-for="item in column.skill">{{item.field}}</td>
              </tr>
              </thead>

              <tbody v-if="dataList.surgeryInfo.data.length">
              <tr v-for="(lis,index) in dataList.surgeryInfo.data">
                <td v-for="item in column.skill">{{item.name === ""?index+1:lis[item["name"]]}}</td>
              </tr>
              </tbody>
              <tbody v-else>
              <tr class="center">
                <td :colspan="column.disease.length">暂无数据</td>
              </tr>
              </tbody>
            </table>
          </div>
          <p class="aTitle van-ellipsis font1">五、出科考试成绩</p>
          <div>
            理论成绩：{{score.scoreTheoretical}}{{isNaN(score.scoreTheoretical)?"":"分"}}，技能成绩：{{score.scoreSkill}}{{isNaN(score.scoreSkill)?"":"分"}}，其他成绩：{{score.scoreOther}}{{isNaN(score.scoreOther)?"":"分"}}；
          </div>
          <p class="aTitle van-ellipsis font1">六、在本科室的出勤情况</p>
          <div>
            请假天数{{dataList.attendanceInfo.applyDayNum}}天，正常{{allData.totalDays-dataList.attendanceInfo.applyDayNum}}天
          </div>
        </div>
      </div>

      <div class="module">
        <van-cell title="出科小结："/>
        <textarea class="textarea" v-model="allData.summary" placeholder="请您输入信息内容"
                  :readonly="!allData.isSubmit" :maxlength="maxLen"></textarea>
        <p v-if="allData.isSubmit" class="leave_tips gray">不能超过{{maxLen}}字符</p>
      </div>

      <div v-if="!type" class="bgWhite">
        <van-cell title="出科评语："/>
        <textarea class="textarea" v-model="allData.identifyContent" readonly="true"></textarea>
        <!--<p v-if="!isReadonly" class="leave_tips gray">不能超过{{maxLen}}字符</p>-->
      </div>

      <div v-if="allData.isSubmit" class="btns" :class="isAndroid?'mt140':''">
        <van-button type="info" @click="submit">提交</van-button>
      </div>
      <van-popup v-model="showTeachers" position="bottom">
        <van-picker
          show-toolbar
          title="带教老师"
          :columns="teachers"
          @confirm="onConfirm"
          @cancel="hideMask"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
  /*出科申请、出科小结通过配置显示页面不同*/
  export default {
    name: "GraduateSummary",
    data() {
      return {
        isAndroid: false,
        showTeachers: false,
        maxLen: 800,
        type: false,
        disabled: true,
        isReadonly: true,
        allData: {
          summary: "",
          isSubmit: true
        },
        score: {},
        teachers: [],
        selectedObj: {},
        scheduling: [],
        column: {
          disease:
            [
              { field: "序号", name: "", width: "50px" },
              { field: "疾病名称", name: "name", width: "200px" },
              { field: "要求例数", name: "requestNum", width: "80px" },
              { field: "已提交数", name: "submitNum", width: "80px" },
              { field: "已审核数", name: "auditNum", width: "80px" },
              { field: "完成率", name: "percent", width: "80px" }
            ],
          skill: [
            { field: "序号", name: "", width: "50px" },
            { field: "操作（手术名称）", name: "name", width: "200px" },
            { field: "要求例数", name: "requestNum", width: "80px" },
            { field: "已提交数", name: "submitNum", width: "80px" },
            { field: "已审核数", name: "auditNum", width: "80px" },
            { field: "完成率", name: "percent", width: "80px" }
          ]
        },
        dataList: {}
      };
    },
    methods: {
      onClickLeft() {
        this.utils.goBack(this);
      },
      onClickRight() {
        if (this.type) return;
        let obj = {
          data: "出科记录"
        };
        this.$router.push({ name: "RecordEntry", params: obj });
      },
      changeTeachers() {
        if (this.teachers.length > 1) {
          this.showTeachers = true;
        }
      },
      hideMask() {
        this.showTeachers = false;
      },
      onConfirm(value) {
        this.selectedObj = value;
        this.showTeachers = false;
      },
      submit() {
        if (!this.allData.summary) {
          this.Toast("请填写出科小结");
          return;
        }
        let paramData = this.allData.schedulingOfStudentForOutOfDepartment[0];
        var params = {
          normalDepartmentId: paramData.normalDepartmentId,
          departmentId: paramData.departmentId,
          endDate: paramData.endDate,
          startDate: paramData.startDate,
          summary: this.allData.summary,
          teacherId: this.selectedObj.teacherId
        };
        this.utils.ajax({
          url: this.api.saveDepartmentOutApply,
          data: params,
          method: "POST",
          success: data => {
            this.onClickLeft();
          }
        });
      },
      getData(obj) {
        this.utils.ajax({
          method: "POST",
          url: this.api.departmentOutApply,
          data: obj,
          success: data => {
            this.allData = data;
            this.dataList = data.departmentOutStatistics;
            this.score = data.achievementDetailVO;
            this.scheduling = data.schedulingOfStudentForOutOfDepartment;
            this.teachers = data.teachers;
            data.teachers.forEach(teacher => {
              teacher.text = teacher.teacherName;
              teacher.info = teacher.teacherName + " " + teacher.teacherMobile;
            });
            this.selectedObj = data.teachers.length ? data.teachers[0] : { info: "请选择" };
            if (this.scheduling.length) {
              this.scheduling.forEach(departmentList => {
                departmentList.rangeDate = this.utils.formatDate(departmentList.startDate, "yyyy-MM-dd") + "~" + this.utils.formatDate(departmentList.endDate, "yyyy-MM-dd");
              });
            }
            if (data.departmentOutApply) {
              this.allData.isSubmit = data.departmentOutApply.auditFlag === 2 ? true : false;
              this.allData.identifyContent = data.departmentOutApply.departmentOutIdentify.identifyContent || "";
              this.allData.summary = data.departmentOutApply.summary || "";
            } else {
              this.allData.isSubmit = true;
              this.allData.identifyContent = "";
              this.allData.summary = "";
            }
          }
        });
      }
    },
    created() {
      this.isAndroid = this.utils.isInAndroid();
      this.type = this.$route.params.type === "summary" ? true : false;

      var obj = {};
      if (this.$store.state.curDepartmentTime) {
        obj.currTime = this.$store.state.curDepartmentTime.endDate;
      }
      this.getData(obj);
    }
  };
</script>

<style scoped>
  .rotation_detail, .register_detail {
    padding: 0 .9rem;
  }

  .rotation_detail .van-progress {
    height: .1rem;
  }

  .days {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .days span {
    font-size: 1.5rem;
  }

  .department {
    padding: .2rem 0;
    font-size: .9rem;
    height: 1.3rem;
  }

  .department span {
    position: absolute;
    right: 0;
    font-size: .6rem;
    padding: .15rem .5rem;
    border-radius: .2rem;
    color: #fff;
  }

  .summaryWarp {
    padding: 0 .9rem .9rem;
  }

  .entry_time {
    color: #969799;
    height: 1rem;
    font-size: .75rem;
  }

  .font1 {
    font-size: .9rem;
  }

  .textarea {
    width: 100%;
    min-height: 5rem;
    padding: .5rem .9rem;
    border: none;
    resize: none;
    box-sizing: border-box;
  }

  .leave_tips {
    text-align: right;
    padding: .5rem .9rem;
    margin: 0;
  }

  .aTitle {
    color: #034486;
  }

  .tableWarp {
    overflow: auto;
  }

  .table {
    border-right: .07rem solid #b1daf6;
    border-top: .07rem solid #b1daf6;
    min-width: 100%;
    table-layout: fixed;
    border-spacing: 0;
  }

  .table thead {
    background: #eef9ff;
  }

  .table td {
    text-align: center;
    border-left: .07rem solid #b1daf6;
    border-bottom: .07rem solid #b1daf6;
    line-height: 1.5rem;
  }

  .uploadIcon {
    color: #64affe;
  }

  .uploadIcon span {
    display: inline-block;
    height: 1.5rem;
    line-height: 1.5rem;
    vertical-align: bottom;
  }

  .uploadIcon .icons {
    color: #fff;
    background: #64affe;
    width: 1.5rem;
    border-radius: 50%;
    text-align: center;
    font-size: 1.5rem;
    margin: 0 .5rem;
  }

  .filesList .van-cell__title {
    height: 2rem;
    line-height: 2rem;
    overflow: hidden;
  }

  .btns button {
    width: 100%;
  }

  .next {
    text-align: center;
    background: #eef9ff;
    height: 2rem;
    line-height: 2rem;
  }

  .mt140{
    margin-top: 140px;
  }
</style>
