<template>
  <div>
    <van-nav-bar :title="title" class="header" fixed left-arrow @click-left="onClickLeft" />
    <div class="examBox">
      <div style="margin-top:2.5rem;">
        <div class="tw_txc home_title" style="padding-top:10px">{{params.assessName}}</div>
        <div class="tw_txc fenNum">总分：{{assessTotalPoint}}</div>
        <ul class="infoListUl" v-if="userInfocode === 'student'">
          <li>
            <label for="">出科考核科室：</label>
            <span>{{params.departmentName}}</span>
          </li>
          <li>
            <label for="">轮转时间：</label>
            <span>{{formatFn(params.startTime,params.endTime)}} </span>
          </li>
          <li>
            <label for="">考试时间：</label>
            <span>{{getTimeData(params.assessStartTime,params.assessEndTime)}}</span>
          </li>
          <li>
            <label for="">考试地点：</label>
            <span>{{params.assessAddress}}</span>
          </li>
        </ul>
        <ul class="infoListUl" v-if="userInfocode !== 'student'">
          <li>
            <label for="">考生姓名：</label>
            <span>{{studentInfo.humanName}}</span>
          </li>
          <li>
            <label for="">轮转科室：</label>
            <span>{{params.departmentName}}</span>
          </li>
          <li>
            <label for="">轮转时间：</label>
            <span>{{formatFn(studentInfo.startTime,studentInfo.endTime)}} </span>
          </li>
          <li>
            <label for="">参培年份：</label>
            <span>{{studentInfo.traineeYear}}</span>
          </li>
          <li>
            <label for="">专业：</label>
            <span>{{ fnMajorCode(studentInfo.traineeMajorCode)}}</span>
            <!-- <span>{{studentInfo.traineeMajorCode}}</span> -->
          </li>
        </ul>
        <div class="listTab" v-if="!isStudent && userInfocode === 'student'">
          <template v-for="(btn,index) in assessHumanTeacherList">
             <button v-if="btn.assessTotalPoint != ''" :key="index" :class="index == listTabActive ? 'listTabBtn listTabBtnActive' : 'listTabBtn'"  @click="changeActive(index,btn)"> {{btn.humanName}}</button>
          </template>
        </div>
        <div v-for="(item,index) in listData" :key="index">
          <div class="examTitle" style="padding-left:0.8rem;margin-top:10px;font-weight: bold;font-size: .9rem">{{item.gradeName}}({{item.gradeAllScore}})</div>
          <ul class="infoListUl" v-for="(obj,ind) in item.assessResultList" :key="ind">
            <li>
              <div class="examTitle" style="text-indent:1em">{{obj.gradeStandard}}（{{obj.gradeScore}}）</div>
              <template v-if="!isStudent">
                <div style="padding:0.5rem 0;display:flex">
                  <button :class=" index == obj.deductMarks ? 'gradeBtnActive gradeBtn':'gradeBtn'" v-for="(btn,index) in btnList" :disabled="disabled" :key="index" @click="deleteScore(obj,index)">{{btn.label}}</button>
                </div>
                <div style="display:flex" v-if="obj.gradeScore > 5">
                  <div>
                    <button :disabled="disabled" style="margin-top:.3rem" @click="deleteScore(obj,6)" :class="(obj.activedeductMarks == 6 || formatfs(obj))? 'gradeBtnActive gradeBtn':'gradeBtn'" >其他分值</button>
                  </div>
                  <div style="flex-grow:1">
                    <van-cell-group>
                      <van-cell title="" :disabled="disabled || obj.activedeductMarks == 6" :value="formatfs(obj) ? obj.deductMarks : obj.otherdeductMarks" is-link @click="showAllPiker(obj)"/>
                    </van-cell-group>
                  </div>
                  <van-picker  
                      v-if="selectShow" 
                      :columns="selectShowOpt"
                      :defaultIndex="6"
                      show-toolbar 
                      title="其他扣分值" 
                      @cancel="onCancel" 
                      @confirm="onConfirm" />
                </div>
                <div v-if="obj.deductMarks != 0 && obj.deductMarks != ''">
                  <van-cell-group>
                    <van-field v-model="obj.deductMarksReason" @blur="updateData(obj,0)" rows="1" autosize label="扣分理由" type="textarea" maxlength="50" :disabled="disabled" placeholder="请输入扣分理由" show-word-limit />
                  </van-cell-group>
                </div>
              </template>
            </li>
          </ul>
        </div>
        <div v-if="userInfocode !== 'student'">
          <div style="text-align:right;padding-right:1rem;background:#fff;line-height:2.5rem">
            <span>考生：</span> {{studentInfo.humanName}}
            <span>得分：</span> {{gradeAllScore}}</div>
        </div>
        <div class="infoListUlFooter" v-if="userInfocode !== 'student' && studentInfo.assessStatus < 3 ">
          <!-- {{params}} -->
          <p class="successBtn " @click="confirmtion() ">提交</p>
        </div>
      </div>
    </div>
    <van-dialog v-if="userInfocode !=='student' " v-model="shwoModel " title="确认提交 " show-cancel-button confirm-button-text="提交 " @confirm="saveAdd(1)">
      <div class="shwoModelBox ">
        考生{{studentInfo.humanName}}，考试最终得分{{gradeAllScore}}，是否确认提交
      </div>
    </van-dialog>
    <div v-if="showModel" class="van-overlay"></div>
  </div>
</template>
<script>
export default {
  name: "Takeexam",
  components: {},
  data() {
    return {
      title:"",
      btnList: [
        {
          label: "满分",
          active: false
        },
        {
          label: "扣1分",
          active: false
        },
        {
          label: "扣2分",
          active: false
        },
        {
          label: "扣3分",
          active: false
        },
        {
          label: "扣4分",
          active: false
        },
        {
          label: "扣5分",
          active: false
        }
      ],
      showModel: false,
      selectShow: false, //其它分值状态
      selectShowOpt: [{
          text:"",
          value:""
        }],
      studentInfo: {},
      listTabActive: 0, //考官切换状态
      assessHumanTeacherList:[],//考官tab
      shwoModel: false,
      message: "",
      userInfocode: "",
      isStudent: false,
      activeBtn: "", //扣分按钮
      disabled: false, //是否禁用，
      listData: [],
      gradeAllScore: 0,
      assessTotalPoint: "", //总分
      empamnull: 1,
      activeObj: {},
      params: {} //考核状态 1:待考核 2:考核中 3:考核结束 4:待补考 5:补考中 6:补考结束
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    formatFn(startTime, endTime) {
      if(startTime && endTime){
          return (
            this.utils.formatDate(new Date(startTime.replace(/-/g, "/")).getTime(), "yyyy-MM-dd") +
            "-" +
            this.utils.formatDate(new Date(endTime.replace(/-/g, "/")).getTime(), "yyyy-MM-dd")
        );
      }
    },
    formatfs(obj){
      if((obj.deductMarks+'').indexOf("扣") === -1 ){
        return obj.deductMarks > 5
      }else{
        return obj.deductMarks.replace('扣','').replace('分','') > 5;
      }
    },
    /**
     * 确定按钮 val选择值
     */
    onConfirm(val) {
      this.activeObj.otherdeductMarks = "扣" + val.key + "分";
      this.activeObj.deductMarks = -1;
      this.showModel = false;
      this.selectShow = false;
      this.updateData(this.activeObj);
    },
    getTimeData(start, end) {
      return (
        this.utils.formatDate(new Date(start.replace(/-/g, "/")).getTime(), "yyyy-MM-dd HH:mm") +
        "-" +
        this.utils.formatDate(new Date(end.replace(/-/g, "/")).getTime(), "HH:mm")
      );
    },
    /*
     * 取消
    */
    onCancel() {
      this.selectShow = false;
      this.showModel = false;
    },
    /**
     *弹出显示扣分项
     */
    showAllPiker(obj) {
      if(obj.activedeductMarks !== 6){
        return;
      }
      this.showModel = true;
      this.selectShow = true;
      this.activeObj = obj;
      let arr = [];
      let totol = obj.gradeScore * 1;
      for (let i = 6; i <= totol; i++) {
        arr.push({
          text:"扣" + i + "分",
          key:i
        });
      }
      this.selectShowOpt = arr;
      // item.columns =
    },
    /**
     * 获取详情接口
     */
    getTakeexamData(tid) {
      let parms;
      if (this.userInfocode === "student") {
        this.title = "详情";
        if (this.params.assessHumanTeacherList.length <= 0) {
          this.Toast("暂无数据");
          return;
        }
        parms = {
          teacherId: tid || this.params.assessHumanTeacherList[0].humanId,
          assessHumanId: this.params.assessHumanId,
          assessStatus: this.params.assessStatus
        };
      } else {
        this.title = this.params.assessItemValue + "-" + this.studentInfo.humanName;
        parms = {
          assessHumanId: this.studentInfo.id,
          assessStatus: this.studentInfo.assessStatus
        };
      }
      this.utils.ajax({
        url: this.api.getAssessItemByAssessHumanId,
        data: parms,
        method: "POST",
        success: data => {
          data.forEach((item,index)=>{
            item.assessResultList.forEach((it)=>{
              if(it.deductMarks*1 > 5){
                it.deductMarks = "扣" + it.deductMarks + "分";
              }
            })
          })
          this.listData = data;
          this.caleScore();
        }
      });
    },
    /**
     * 切换考官方法
     */
    changeActive(index, teaobj) {
      if(this.assessHumanTeacherList.length === 1){
        return;
      }
      this.listTabActive = index;
      this.getTakeexamData(teaobj.humanId);
    },
    /**
     * 点击扣分项
     */
    deleteScore(obj, index) {
      obj.otherdeductMarks = '';
      //点击其他分分值的时候不走跟新方法
      if(index == 6){
        obj.deductMarks = -1;
        obj.activedeductMarks = 6;
        obj.otherdeductMarks = "扣" + 6 + "分";
        this.activeObj = obj;
        this.onConfirm({key: 6});
        this.updateData(obj);
        return;
      }else{
        obj.deductMarks = index;
        obj.activedeductMarks = null;
      }
      this.updateData(obj);
    },
    //解析专业码
    fnMajorCode(traineeMajorCode) {
      return this.utils.getValueByKey(
        this.$store.state.majors,
        traineeMajorCode
      );
    },
    /**
     * 失焦事件
     */
    fieldBlur(obj) {
      obj.deductMarks = null;
      this.updateData(obj);
      console.log(obj.deductMarks);
      // item.deductMarks = this.empamnull;
    },
    /**
     * 跟新方法
     * type 0 表示扣分理由
     */
    updateData(obj,type) {
      this.caleScore();
      let deductMarksReason = obj.deductMarksReason;
      let deductMarks;
      if(obj && type && !type){
        if(obj.deductMarksReason == ""){
          return ;
        }
      }
      //扣分理由为空不能填写扣分理由
      if(obj.deductMarks == 0 && obj.otherdeductMarks == 0){
        deductMarksReason = '';
      }
      //选中其他分值
      if(obj.deductMarks == -1){
        deductMarks = obj.otherdeductMarks.replace("扣","").replace("分","");
      }else{
        deductMarks = obj.deductMarks;
      }
      const parms = {
        timeVersion: new Date().getTime(),
        assessResultList: [
          {
            id: obj.id,
            deductMarksReason: deductMarksReason,
            deductMarks: deductMarks 
          }
        ]
      };
      this.utils.ajax({
        url: this.api.AssessResultAdd,
        data: parms,
        method: "POST",
        success: data => {
          console.log(data);
        }
      });
    },
    /**
     * 提交的方法
     */
    confirmtion() {
      this.shwoModel = true;
    },
    /**
     * 该页面显示为学生及老师端 所以进行初始化判断针对不同参数显示不通内容
     */
    getpageType() {
      this.userInfocode = this.$store.state.userInfo.currentRole.code;
      this.params = this.$store.state.AssessParams;
      this.assessHumanTeacherList = [];
      this.params.assessHumanTeacherList.forEach((item,index)=>{
        if(item.assessTotalPoint !== ""){
            this.assessHumanTeacherList.push(item);
        }
      })
      //如果是学生及考核状态为 1,2 的时候 disabled 为true
      if (this.userInfocode === "student") {
          this.disabled = true;
      }
      //isStudent判断考官tab切换是否显示  assessTotalPoint有总分及显示考官的切换项
      if (this.userInfocode === "student" && this.params.assessTotalPoint == "") {
         this.isStudent = true;
      } else {
        //学员轮转信息 头部显示
        this.studentInfo = this.$route.params;
        //已经提交成绩 不能进行编辑
        if (this.studentInfo.assessStatus == 3) {
          this.disabled = true;
        }
      }
    },
    /**
     * 结算总分扣分方法
     */
    caleScore() {
      this.gradeAllScore = 0;
      this.assessTotalPoint = 0;
      let deductMarks;
      this.listData.forEach((item, index) => {
        this.gradeAllScore += item.gradeAllScore * 1;
        this.assessTotalPoint += item.gradeAllScore * 1;
        item.assessResultList.forEach((element, index) => {
          if (element.deductMarks == -1) {
            deductMarks = element.otherdeductMarks.replace("扣","").replace("分","");
          } else {
             if((element.deductMarks+'').indexOf("扣") === -1 ){
                deductMarks = element.deductMarks;
             }else{  
                deductMarks = element.deductMarks.replace("扣","").replace("分","");
             }
          }
          this.gradeAllScore = this.gradeAllScore - deductMarks * 1;
        });
      });
    },
    /**
     * 提交成绩的方法
     */
    saveAdd(type) {
      let assessResultList = [];
      this.listData.forEach((item, index) => {
        // this.gradeAllScore += item.gradeAllScore * 1;
        if (item.assessResultList.length > 0) {
          item.assessResultList.forEach((element, index) => {
            let obj = {
              id: element.id,
              deductMarksReason: element.deductMarksReason
            };
            if (element.deductMarks == -1) {
              obj.deductMarks = element.otherdeductMarks;
            }else{
              obj.deductMarks = element.deductMarks;
            }
            assessResultList.push(obj);
          });
        }
      });
      const parms = {
        timeVersion: new Date().getTime(),
        assessResultList: assessResultList
      };
      if (type) {
        parms.assessTotalPoint = this.gradeAllScore;
      }
      this.utils.ajax({
        url: this.api.AssessResultAdd,
        data: parms,
        method: "POST",
        success: data => {
          this.Toast("操作成功！");
          this.onClickLeft();
        }
      });
    }
  },
  ///outDepartmentAssessResult/app/getByAssessId
  mounted() {
    this.getpageType();
    this.getTakeexamData();
  },

  created() {
    console.log(this.$route.params);
  }
};
</script>
<style scoped>
.home_title {
  color: #333;
  line-height: 2.5rem;
  font-weight: bold;
}
.fenNum {
  color: #8d8d8d;
}
.tw_txc {
  text-align: center;
  line-height: 1.5rem;
  background: #fff;
}
.examBox {
  overflow: auto;
}
.examBox >>> .van-cell__value--alone{
  text-align: right
}
.examBox >>> .van-cell{
  padding: 0.625rem 0.2rem;
}
.examTitle {
  line-height: 2.5rem;
  background: #fff;
}
.shwoModelBox {
  padding: 1rem;
}
.examBox .infoTile {
  padding-left: 0.5rem;
  line-height: 2rem;
}
.infoListUl {
  padding: 0 0.8rem;
  overflow: auto;
  background: #fff;
}
.infoListUl label {
  display: inline-block;
  width: 5.8rem;
  color: #adadad;
  white-space:nowrap;
  text-align: right;
}
.infoListUl li {
  line-height: 1.5rem;
}
.van-iconedit{
  font-size:1.4rem!important;
  position:absolute;
  right:.6rem;
}
.van-picker {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 16rem;
  z-index: 10;
}
.listTab {
  text-align: center;
  display: flex;
  flex: 1;
  margin-top: 6px;
  border-bottom: 1px solid #adadad;
}
.listTabBtn {
  color: #000;
  flex-grow: 1;
  color: #adadad;
  background: #fff;
  border: none;
  padding: 0.5rem;
}
.listTab button:nth-child(1) {
  border-right: 1px solid #adadad;
}
.listTab button:nth-child(2) {
  border-right: 1px solid #adadad;
}
.listTabBtnActive {
  background: #197fe8;
  color: #fff;
}
.enterke::before {
  content: "*";
  position: absolute;
  left: 0.4375rem;
  font-size: 0.875rem;
  color: #f44;
}

.infoListUlFooter {
  text-align: center;
  width: 100%;
  padding: 1rem 0; 
  background: #fff;
  /* color: white;
  font-size: 0.9rem;
  text-align: center;
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0; */
}
.examBox >>> .van-field__control {
  text-align: right;
}
.infoListUlFooter .successBtn {
  background: #007acc;
  text-align: center;
  color: #ffffff;
  border-radius: 5px;
  line-height: 2rem;
  display: inline-block;
  width: 80%;
}
.examBox >>> .van-field__label {
  width: 4.625rem;
}
.gradeBtn {
  border: 1px solid #c7e3ff;
  border-radius: 15px;
  padding: 0.1rem 0.25rem;
  margin: 0 0.1rem;
  background: #eff7ff;
  flex-grow:1;
  color: #197fe8;
}
.gradeBtnActive {
  border: 1px solid #197fe8;
  flex-grow:1;
  border-radius: 15px;
  padding: 0.1rem 0.25rem;
  margin: 0 0.2rem;
  background: #197fe8;
  color: #ffffff;
}
</style>
