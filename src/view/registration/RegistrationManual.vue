<template>
  <div>
    <van-nav-bar
      title="登记手册"
      right-text="新增"
      class="header"
      fixed
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
      v-if="isShowt"
    />
    <van-nav-bar
      title="登记手册"
      class="header"
      fixed
      left-arrow
      @click-left="onClickLeft"
      v-else
    />
    <div class="layout_content">
      <div class="module">
      <div class="content_disease" v-if="$store.state.scheduling">
         <ul class="ul" @click="deparClick()">
           <li><span>标准科室：</span><span>{{$store.state.scheduling.normalDepartmentName}}</span>  </li>
           <li><span>轮转科室：</span><span>{{$store.state.scheduling.departmentName}}</span><van-icon class="van-icon1" name="arrow" /></li>
           <li><span>轮转时间：</span><span class="timeRange">{{$store.state.scheduling.range}}</span></li>
         </ul> 
      </div>
      <div class="content_disease">
        <div class="disease_box">
            <div class="disease" v-for="(item,index) in statisticsLIst" :key="index">
              <div  @click="disease(item)">
                <p style="text-align: center;">{{utils.getValueByvalue(oneLevelType, item.oneLevelType)}}</p>
                <ul class="disease_ul ">
                   <li class="disease_li">
                      <p><span><font color="#3939FF">{{item.actualNum}}</font></span><span v-if="item.demandNum !=''"><font style="font-size:1.3rem">/ </font> {{item.demandNum}}</span></p>
                      <p>录入例数</p>
                   </li>
                    <li class="disease_li" v-if="index==3?false:true">
                      <p><span><font color="#3939FF">{{item.finishedPercent}}%</font></span></p>
                      <p>要求完成率</p>
                   </li>
                </ul>
              </div>

            </div>
        </div>
      </div>
      </div>

      <div class="manualTitle">
        <van-row>
          <van-col span="18">病历信息</van-col>
          <van-col span="6"><span style="float: right;" @click="show(true)">{{utils.getValueByvalue(moduleData.data.option, caseInformation)}}</span></van-col>
          <!-- <van-col span="4">
            <div class="textR" @click="orderFn">
              <span class="timeOrder timeText">时间</span>
              <img class="timeOrder timeImg" :src="order?icon.positiveOrder:icon.reverseOrder" />
            </div>
          </van-col> -->
        </van-row>
      </div>
         
      <div>
        <ViewList :listObj="listObj" :listData="newList"></ViewList>
      </div>
      <van-popup v-model="moduleData.selectShow" position="bottom" >
        <van-picker
          v-if="moduleData.selectShow"
          show-toolbar
          :title="moduleData.data.placeholder"
          :columns="moduleData.data.option"
          @confirm="selectMajorConfirm"
          @cancel="show(false)"
        />
      </van-popup>
      <div class="popup">
        <van-popup v-model="dialog">
          <ul class="ulDialog" v-for="(item,index) in dialogLinst" :key="index">
          <li v-if='index!=3' class="li" @click="ulDialog(item)">{{item.title}}</li>
          <li v-else class="liBorder" @click="ulDialog(item)">{{item.title}}</li>
        </ul>
        </van-popup>
      </div>

    </div>
  </div>
</template>

<script>
/*登记手册*/
import ViewList from "@/components/ViewList";

export default {
  name: "RegistrationManual",
  components: {
    ViewList: ViewList
  },
  data() {
    return {
      moduleData:{ // select 下拉框
        selectShow: false,
        data:{
          option:[
            { value:'', text:'全部' },
            { value: 1, text:'病种' },
            { value: 2, text:'临床操作技能' },
            { value: 4, text:'手术' },
            { value: 3, text:'其他录入' },
          ]
        }
      },
      isShowt: true,
      oneLevelType: [
        {text: '病种完成情况', value: 1},
        {text: '临床操作技能完成情况', value: 2},
        {text: '其他录入情况', value: 3},
        {text: '手术完成情况', value: 4},
      ],
      statisticsLIst: [],
      caseInformation:'',
      seacherVal: "",
      action: false,
      order: true,
      identifyFlag: true,
      data: {},
      icon: {
        positiveOrder: require("@/assets/images/icons/positiveOrder.svg"),
        reverseOrder: require("@/assets/images/icons/reverseOrder.svg")
      },
      medicals: [],
      newList: [],
      listObj: {
        list: [
          { field: "病人姓名：", name: "patientName", leftClass: "gray" },
          {
            field: "就诊编号：",
            name: "visitNumber",
            leftClass: "gray",
            render: (data, key) => {
              return data["visitNumber"] || data["admissionNumber"];
            }
          },
          { field: "主要诊断：", name: "mainDiagnosis", leftClass: "gray" },
          { field: "技能操作：", name: "skill", leftClass: "gray" },
          { field: "登记时间：", name: "createDate", leftClass: "gray" },
          {
            field: "审核状态：",
            name: "auditFlag",
            leftClass: "gray",
            render: (data, key) => {
                if(data[key] == 0){
                    return "未审核"
                }else if(data[key] == 1){
                    return "审核通过"
                }else if(data[key] == 2){
                    return "审核不通过"
                }
            }
          },
          {
            field: "编辑时间：",
            name: "createDate",
            leftClass: "gray",
            render: (data, key) => {
              return this.utils.formatDate(data[key], "yyyy-MM-dd HH:mm");
            }
          },
        ],
        click: data => {
          if (data.twoLevelType) {
            this.$store.state.paramsDepartmentName = {
              title:'',
              key:''
            }
            if(data.oneLevelType !=3) {
               if(data.oneLevelType == 1) {
                 this.$store.state.paramsDepartmentName['title'] = '病种';
                 this.$store.state.paramsDepartmentName.key = 'disease';
               }
               if(data.oneLevelType == 2) {
                 this.$store.state.paramsDepartmentName['title'] = '临床操作技能';
                 this.$store.state.paramsDepartmentName.key = 'skill';
               }
               if(data.oneLevelType == 4) {
                 this.$store.state.paramsDepartmentName['title'] = '手术';
                 this.$store.state.paramsDepartmentName.key = 'surgery';
               }
               this.$router.push({ name: "RegistrationHand",params:{item:data} });
            }else{
              this.$store.state.EditRegisterNum = "" + data.twoLevelType;
              this.$store.state.EditRegisterObj = data;
              this.$router.push({ name: "EditRegister" });
            }
          }
        }
      },
      enrollmentStatistics: {},
      departmentOutApply: {},
      dialog:false,
      dialogLinst:[
        { title: '病种',key:'disease'},
        { title: '临床操作技能',key:'skill'},
        { title: '手术',key:'surgery'},
        { title: '其他录入',key:'other'},
      ]
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    onClickRight() {
      // this.$router.push({ name: "RemoveManual", params: this.medicals });
      this.dialog = true;
    },
    ulDialog(item){
      if(item.key == 'other'){
        this.$store.state.regsterList = {
          departmentName: this.enrollmentStatistics.departmentName
        }
        this.$store.state.regsterMode = item.key;
        this.$router.push({ name: "ModeRegister" });
      }else{
        this.$router.push({ name: "RegistrationHand"});
        this.$store.state.paramsDepartmentName = item;
      }
    },
    deparClick(){
      this.$router.push({ name: "RotationPlan"});
      console.log(this.$store.state.scheduling.endDate,'77777');
      
    },
    show(status) {
      this.moduleData.selectShow = status;
    },
    selectMajorConfirm(val, i) {
      this.moduleData.selectShow = false;
      this.caseInformation = val.value;
      this.getData(val.value);
    },
    disease(item) {
      let att = '';
      this.$store.state.paramsDepartmentName = {
        title:'',
        key:''
      }
      if(item.oneLevelType == 1){
        att = 'disease'; 
        this.$store.state.paramsDepartmentName['title'] = '病种'
      }
      if(item.oneLevelType == 2){
        att = 'skill'; 
        this.$store.state.paramsDepartmentName['title'] = '临床操作技能'
      }
      if(item.oneLevelType == 3){
        att = 'other'; 
        this.$store.state.paramsDepartmentName['title'] = '其他录入'
      }
      if(item.oneLevelType == 4){
        att = 'surgery'; 
        this.$store.state.paramsDepartmentName['title'] = '手术'
      }
      this.$store.state.paramsDepartmentName['key'] = att;
      this.$store.state.regsterMode = att;
      this.$store.state.regsterList = item;
      this.$router.push({ name: "ModeRegister"});
    },
    onSearch(v) {
      let val = this.utils.trim(this.seacherVal);
      if (val) {
        this.newList = [];
        this.medicals.forEach(item => {
          if (
            item.patientName.indexOf(val) > -1 ||
            item.visitNumber.indexOf(val) > -1 ||
            item.mainDiagnosis.indexOf(val) > -1
          ) {
            this.newList.push(item);
          }
        });
        this.order = true;
      } else {
        this.newList = this.medicals;
        this.order = true;
      }
    },
    summary() {
      this.$router.push({
        name: "GraduateSummary",
        params: { type: "summary" }
      });
    },
    viewAppraisal() {
      if (this.identifyFlag == 1) {
        this.$router.push({ name: "GraduateAppraisal", params: this.data });
      } else {
        this.Toast("科室老师暂未对学员做出科鉴定！");
      }
    },
    orderFn() {
      this.order = !this.order;
      if(this.newList.length !==0) {
        this.newList = this.utils.fastSort(this.newList, (a, b) => {
          let first = this.utils.getTime(a.createDate);
          let second = this.utils.getTime(b.createDate);
          if (this.order) {
            return first > second;
          } else {
            return first < second;
          }
        });
      }
    },
    getData(oneLevelType) {
      this.utils.ajax({
        method: "POST",
        url: this.api.queryEnrollmentByOneLevelType,
        data: { 
            normalDepartmentId: this.$store.state.scheduling.normalDepartmentId,
            oneLevelType: oneLevelType,
            // departmentCaId:this.$store.state.scheduling.departmentId
        },
        success: data => {
          this.newList = data;
        }
      });
    },
    complete(data) {
      this.utils.ajax({
        method: "POST",
        url: this.api.statisticsEnrollmentByOneLevelType,
        data: { 
                normalDepartmentId: data.normalDepartmentId,
                version:data.version,
                // departmentCaId: data.departmentId,
                multistandardId:data.multistandardId
             },
        success: data => {
           console.log(12354,data);
           this.statisticsLIst = data;
        }
      });
    },
    isShow() {
        var date = new Date().getTime();
        if(this.$store.state.startTimeDate){
          if( date < this.utils.getTime(this.$store.state.startTimeDate)){
              this.isShowt = false;
            return;
          }
        }  
    }
  },
  mounted(){
    if(this.$store.state.scheduling){
        this.complete(this.$store.state.scheduling);
        this.getData('');
        this.isShow();
    }
  },

  created() {
    if( this.$store.state.scheduling  === undefined ){
        this.$dialog.alert({
            title: "提示",
            message: "学员无轮转计划",
        }).then(()=>{
            this.utils.goBack(this);
        })
        return;
    }
  }
};
</script>

<style scoped>
p{
  margin: 0.2rem;
  padding: 0;
}
.top {
  top: 6.3rem;
}

.seach {
  position: fixed;
  top: 2.5rem;
  width: 100%;
  height: 3rem;
  z-index: 10;
  
}

.cellWarp {
  padding: 0.5rem 0.9rem 0;
  color: #323233;
}

.cellMsg {
  line-height: 2rem;
  border-bottom: 1px solid #ebedf0;
  display: flex;
  flex-wrap: wrap;
  webkit-flex-wrap: wrap;
  justify-content: space-between;
  -webkit-justify-content: space-between;
}

.selectType {
  padding: 0.9rem 0;
}

.everyType {
  border: 1px solid #50a8ff;
  color: #50a8ff;
  background: #eef9ff;
  text-align: center;
  height: 2rem;
  line-height: 2rem;
}

.manualTitle {
  padding: 0.3rem 0.9rem;
}

.timeText {
  width: 2rem;
}

.timeImg {
  width: 1rem;
  vertical-align: sub;
}
.van-icon1{
    float: right;
}
.timeOrder {
  height: 1rem;
  display: inline-block;
}

.popup .van-popup{
  width: 80%;
  border-radius: 10px; 
}
.ulDialog .li {
  width: 90%;
  margin: 0 auto;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ccc;
}
.liBorder {
  width: 90%;
  margin: 0 auto;
  padding: 0.5rem 0;
}
.content_disease{
  background: white;
}

.content_disease .ul{
  padding: 0.3rem 0.9rem;
  border-bottom: 1px solid #ccc; 
}
.content_disease .ul li{
  margin-top: 0.1rem;
}
.timeRange{
  font-size: 0.76rem;

}

/* .ul li:nth-of-type(1) span:nth-of-type(2){
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
} */
.disease_box {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0.8rem 0;
  width: 100%;
}
.disease  {
  width: 49.8%;
  padding: 0.3rem 0;
  border-bottom: 1px solid #ccc; 
}
.disease:nth-child(odd){
  border-right: 1px solid #ccc !important;
}
.disease_ul {
  width: 100%;
  display: flex;
}
.disease_li{
  width: 45%;
  text-align: center;
  margin: 0 auto;
 
}
.disease_li p{
  font-size: 0.8rem;
}
.disease_li p span:nth-of-type(1){
  font-size: 1.3rem;
}
</style>
