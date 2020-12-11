<template>
  <div>
    <van-nav-bar :title="type?'出科小结':'出科申请'" :right-text="flags?'':'出科记录'" class="header" fixed left-arrow
                 @click-left="onClickLeft"
                 @click-right="onClickRight"/>

    <div class="layout_content" v-if="dataList.tubeBedInfo">
      <div v-if="!type&&scheduling.length" class="module">
        <van-row>
          <van-col :span="12">
            <div class="br rotation_detail">
              <div class="department">{{scheduling[0].departmentName}}
              </div>
              <div class="times" style="color: gray;">
                    {{scheduling[0].rangeDate}}
              </div>
              <div class="relative"> 
                <p>
                  <span>{{allData.differenceDays===''?" 已出科":"距离出科"}}</span>
                 
                  <div class="days"><span>{{allData.differenceDays===''?'':allData.differenceDays}}</span>
                    <b v-if="allData.differenceDays!==''">天</b>
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
        <!-- <van-cell title="带教老师" is-link :value="selectedObj.info"
                  @click="changeTeachers"/> -->

        <div class="summaryWarp">
          <p class="aTitle van-ellipsis font1"> 一、在本科室的管床数</p>
          <div >本科室要求完成管床数：
            {{count.tubeBedInfo && count.tubeBedInfo.requireTubeBedTebNum}}例，已完成管床数：{{count.tubeBedInfo && count.tubeBedInfo.completeTubeBedTebNum}}例。完成率
            {{count.tubeBedInfo && count.tubeBedInfo.completePercent}}
          </div>
          <p class="aTitle van-ellipsis font1"> 二、在本科室书写大病历数</p>
          <div>
            本科室要求完成书写大病历数：{{count.tubeBedInfo && count.writeRecordInfo.requireWriteRecordNum}}例，已完成书写大病历数：{{count.tubeBedInfo && count.writeRecordInfo.completeWriteRecordNum}}例。完成率
            {{ count.tubeBedInfo && count.writeRecordInfo.completePercent}}
          </div>
          <p class="aTitle van-ellipsis font1"> 三、疾病完成情况（含门诊）(完成率:{{statistd}}%)</p>
          <div class="tableWarp">
            <table class="table" width="0">
              <colgroup>
                <col v-for="(item,index) in column.disease" :width="item.width" :key="index">
              </colgroup>
              <thead>
              <tr>
                <td v-for="(item,index) in column.disease" :key="index">{{item.field}}</td>
              </tr>
              </thead>

              <tbody v-if="dataLIn.length">
              <tr v-for="(lis,index) in dataLIn" :key="index">
                <td v-for="(item,key) in column.disease" :key="key">{{item.name === ""?index+1:lis[item["name"]]}}</td>
              </tr>
              </tbody>
              <tbody v-else>
              <tr class="center">
                <td :colspan="column.disease.length"><span style="font-size: .8rem;">暂无数据</span></td>
              </tr>
              </tbody>

            </table>
          </div>
        
          <p class="aTitle van-ellipsis font1">四、技能操作完成情况(含门诊) (完成率:{{statis}}%)</p>
          <div class="tableWarp">
            <table class="table" width="0">
              <colgroup>
                <col v-for="(item,index) in column.skill" :width="item.width" :key="index">
              </colgroup>
              <thead>
              <tr>
                <td v-for="(item,index) in column.skill" :key="index">{{item.field}}</td>
              </tr>
              </thead>

              <tbody v-if="dataLInstObj.length">
              <tr v-for="(lis,index) in dataLInstObj" :key="index">
                    <td v-for="(item,ind) in column.skill" :key="ind">{{item.name === ""?index+1:lis[item["name"]]}}</td>
              </tr>
              </tbody>
              <tbody v-else>
              <tr class="center">
                <td :colspan="column.disease.length">暂无数据</td>
              </tr>
              </tbody>
            </table>
          </div>  
          <p class="aTitle van-ellipsis font1">五、手术完成情况 (完成率:{{statisLinst}}%)</p>
          <div class="tableWarp">
            <table class="table" width="0">
              <colgroup>
                <col v-for="(item,index) in column.skillqe" :width="item.width" :key="index">
              </colgroup>
              <thead>
              <tr>
                <td v-for="(item,index) in column.skillqe" :key="index">{{item.field}}</td>
              </tr>
              </thead>

              <tbody v-if="dataLinst.length">
              <tr v-for="(lis,index) in dataLinst" :key="index">
                <td v-for="(item, ind) in column.skillqe" :key="ind">{{item.name === ""?index+1:lis[item["name"]]}}</td>
              </tr>
              </tbody>
              <tbody v-else>
              <tr class="center">
                <td :colspan="column.skillqe.length">暂无数据</td>
              </tr>
              </tbody>
            </table>
          </div>
          <p class="aTitle van-ellipsis font1">六、出科考试成绩</p>
          <div class="scorebox">
            <span>
              理论成绩：{{score.scoreTheoretical}}{{isNaN(score.scoreTheoretical) ? "":"分"}}
            </span>
            <span>
              技能成绩：{{score.scoreSkill}}{{isNaN(score.scoreSkill) ? "": "分" }}
            </span>
            <span>
              体格检查：{{score.scoreHealthCheckup}}{{  isNaN(score.scoreHealthCheckup)? score.scoreHealthCheckup?'': "分":"分"}}
            </span>
            <span>
              病史采集：{{score.scoreMedicalHistory}}{{isNaN(score.scoreMedicalHistory)? score.scoreHealthCheckup?'': "分":"分"}}
            </span>
            <span>
              病例分析：{{score.scoreCaseAnalysis}}{{isNaN(score.scoreCaseAnalysis)? score.scoreHealthCheckup?'': "分":"分"}}
            </span>
            <span>
              心电图平片判读：{{score.scoreEcg}}{{isNaN(score.scoreEcg)? score.scoreHealthCheckup?'': "分":"分"}}
            </span>
            <span>
              其他成绩：{{score.scoreOther}}{{isNaN(score.scoreOther)?"":"分"}}
            </span>
          </div>
          <p class="aTitle van-ellipsis font1">七、在本科室的出勤情况</p>
          <div>
            请假天数{{dataList.attendanceInfo.applyDayNum}}天，正常{{allData.totalDays-dataList.attendanceInfo.applyDayNum}}天
          </div>
          <p class="aTitle van-ellipsis font1" @click="showPopup">八、心理自评：{{scheduling[0].selfScore>0?scheduling[0].selfScore:"填写"}}</p>
        </div>
        <!-- http://localhost:666/api/enrollment/queryEnrollmentTubeBedAndWrite -->
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
        van-picker show-toolbar title="标题" :columns="columns" :default-index="0" />
      </van-popup>
    </div>
    <!-- <van-cell  @click="showPopup">展示弹出层</van-cell> -->
    <van-popup v-model="show" position="bottom">
      <van-picker
        :default-index="0"
        show-toolbar
        :columns="columns"
        value-key="tableName"
        @cancel="show = false"
        @confirm="selectStudyStatus"
      />
    </van-popup>
  </div>
</template>

<script>
  /*出科申请、出科小结通过配置显示页面不同*/
  export default {
    name: "GraduateSummary",
    data() {
      return {
        obj:{},
        objs:{},
        isAndroid: false,
        show:false,
        flags:false,
        columns: [],
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
        count:'',
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
            { field: "操作名称", name: "name", width: "200px" },
            { field: "要求例数", name: "requestNum", width: "80px" },
            { field: "已提交数", name: "submitNum", width: "80px" },
            { field: "已审核数", name: "auditNum", width: "80px" },
            { field: "完成率", name: "percent", width: "80px" }
          ],
          skillqe: [
            { field: "序号", name: "", width: "50px" },
            { field: "手术名称", name: "name", width: "200px" },
            { field: "要求例数", name: "requestNum", width: "80px" },
            { field: "已提交数", name: "submitNum", width: "80px" },
            { field: "已审核数", name: "auditNum", width: "80px" },
            { field: "完成率", name: "percent", width: "80px" }
          ]
        },
        dataList: {},
        dataLinst: [],
        dataLInstObj: [],
        dataLIn: [],
        statis: '',
        statisLinst: '',
        statistd: '',
        auditFlag:'',
        auditFlagId:'',
      };
    },
    methods: {
      //跳转心理自评页面
      Router(){
        // this.show=true
        this.$store.state.schedulings=this.scheduling[0]
        let Grad=this.$route.query.id
        console.log(Grad)
        this.$router.push({path:"/Section",query:{Graduatd:Grad}})
      },
      //是否自评
      showPopup(){
        let {isSelf,departmentId,assessTableRecordId}=this.scheduling[0]
        let Graduate=this.$route.query.id
        if(Graduate){
           if(isSelf===0) return this.Toast('学员未自评无法查看')
           this.test()
        }else{
          if(isSelf===0){
            this.utils.ajax({
                method:"post",
                url:this.api.AssessTable,
                data:{departmentId:departmentId,type:1},
                success:res=>{
                    console.log(res)
                    this.columns=res
                }
             })
            this.show=true
          }else{
             this.test()
          }
        }
      },
      selectStudyStatus(item){
          // console.log(item)
          
          this.utils.ajax({
                method:"POST",
                url:this.api.infoAssess,
                data:{id:item.id},
                success:res=>{
                    console.log(res)
                    this.$store.state.test=res;
                    this.show=false
                    this.Router()
                }
          })
      },
      test(){
          let {assessTableRecordId}=this.scheduling[0]
          this.utils.ajax({
              method:"post",
              url:this.api.Question,
              data:{id:assessTableRecordId},
              success:res=>{
                console.log(res)
                this.$store.state.test=res;
                this.Router()
              }
            })
      },
      onClickLeft() {
        this.utils.goBack(this);
        this.$store.state.outDepartment = '';
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
        let paramData = this.allData.schedulingOfStudentForOutOfDepartment[0];
        console.log("allDATA",this.allData)
        var urlt =  this.api.saveDepartmentOutApply;
        var params = {
        //   normalDepartmentId: paramData.normalDepartmentId,
        //   departmentId: paramData.departmentId,
        //   endDate: paramData.endDate,
          id: this.$store.state.scheduling.id,
        //   startDate: paramData.startDate,
          outSummary: this.allData.summary,
        //   teacherId: this.selectedObj.teacherId
        };
        if (!this.allData.summary) {
          this.Toast("请填写出科小结");
          return;
        }
        // if(!this.selectedObj.teacherId){
        //   this.Toast("未分配带教");
        //   return false;
        // }
        if(this.auditFlag == 3) {
          params = {
            outSummary: this.allData.summary,
            id: this.auditFlagId,
            outAuditFlag: 0
          };
          urlt = this.api.modifyDepartmentOutApply
        }
        this.utils.ajax({
          url: urlt,
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
            // console.log("审核",data.departmentOutApply)
            this.$store.auditFlag=data.departmentOutApply?data.departmentOutApply.auditFlag:""
            this.$store.state.schedulingId=data.achievementDetailVO.schedulingId
            data.differenceDays = this.$store.state.outDepartment;
            data.departmentOutPercent < 0 ? data.departmentOutPercent = 0 : '';
            data.departmentOutPercent > 100 ? data.departmentOutPercent = 100 : '';
            this.allData = data;
             console.log("轮转信息",this.allData)
             this.dataList = data.departmentOutStatistics;
            this.score = data.achievementDetailVO;
            this.scheduling = data.schedulingOfStudentForOutOfDepartment;
            console.log("科室信息",data.schedulingOfStudentForOutOfDepartment)
            let {auditFlag}=data.schedulingOfStudentForOutOfDepartment
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
              this.auditFlag = data.departmentOutApply.auditFlag;
              this.auditFlagId = data.departmentOutApply.id;
              if(data.departmentOutApply.auditFlag === 2 || data.departmentOutApply.auditFlag === 3 ){
                 this.allData.isSubmit = true;
              }else{
                this.allData.isSubmit = false;
              }
              this.allData.identifyContent = data.departmentOutApply.departmentOutIdentify.identifyContent || "";
              this.allData.summary = data.departmentOutApply.summary || "";
            } else {
              this.allData.isSubmit = true;
              this.allData.identifyContent = "";
              this.allData.summary = "";
            }
          }
        });
      },
      AndWrite(){
         this.utils.ajax({
          method: "POST",
          url: this.api.queryEnrollmentTubeBedAndWrite,
          data: { 
              version: this.$store.state.scheduling.version,
              multistandardId: this.$store.state.scheduling.multistandardId,
           },
          success: data => {
            console.log("ANDWE",data)
            this.count = data;
          }
        });
      },
      queryOneLevel(type){
       
        let params = {
           normalDepartmentId:this.$store.state.scheduling.normalDepartmentId,
           oneLevelType: type, 
           version: this.$store.state.scheduling.version,
           multistandardId: this.$store.state.scheduling.multistandardId,
           humanCaId: this.$route.query.id
        //    departmentCaId: this.$store.state.scheduling.departmentId
        }
        console.log("queryOneLevel",params)
        this.utils.ajax({
          url: this.api.queryOneLevelTypeDetail,
          data: params,
          method: "POST",
          success: data => {
            console.log("querysO",data)
            if(type == 4) {
              this.dataLinst = data;
            }
            if(type == 2) {
              this.dataLInstObj = data;
            }
            if(type == 1) {
              this.dataLIn = data;
            }
          }
        });
      },
      complete() {
        let _this = this;
        console.log("humanCaId",this.$route.query.id)
        this.utils.ajax({
          method: "POST",
          url: this.api.statisticsEnrollmentByOneLevelType,
          data: { 
                normalDepartmentId: this.$store.state.scheduling.normalDepartmentId,
                version:this.$store.state.scheduling.version,
                multistandardId:this.$store.state.scheduling.multistandardId,
                humanCaId:this.$route.query.id
            },
          success: data => {
            console.log("completa",data)
            data.forEach((item,index) =>{
               if(index == 1) {
                   _this.statis = item.finishedPercent;
               }
               if(index == 3) {
                   _this.statisLinst = item.finishedPercent;
               }
               if(index == 0) {
                   _this.statistd = item.finishedPercent;
               }
            })
          }
        });
    },

    },
    created() {
      
        this.dentId=this.$route.query.id
        console.log(this.dentId)
        // console.log(id)

        if( this.$store.state.scheduling  === undefined ){
            this.$dialog.alert({
                title: "提示",
                message: "学员无轮转计划",
            }).then(()=>{
                this.utils.goBack(this);
            })
            return;
        }
      this.AndWrite();
      this.isAndroid = this.utils.isInAndroid();
      this.type = this.$route.params.type === "summary" ? true : false;
      var obj={}
      var obj={studentId:this.dentId}
      if (this.$store.state.scheduling) {
        obj.schedulingId = this.$store.state.scheduling.id;
      }
     console.log("obj",obj)
      this.getData(obj);
      this.complete();
      this.queryOneLevel(1);
      this.queryOneLevel(2);
      this.queryOneLevel(4);
     
    },
    mounted(){
      let Graduate=this.$route.query.id
      Graduate?this.flags=true:this.flags=false
    
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
  .scorebox{
    display: flex;
    flex-wrap: wrap;
  }
  .scorebox span{
    flex-grow: 1;
    width: 50%;
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
