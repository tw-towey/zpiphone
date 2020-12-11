<template>
  <div>
    <van-nav-bar title="基本信息" class="header" fixed left-arrow
      @click-left="callBackHandle"
      right-text="保存"
      @click-right="onClickRight"/>
    <div  class="stu-person-box">
      <van-cell-group style="margin-top: 2.6rem;">
        <template v-for="(item,index) in templateData">
          <!--&& item.isShow -->
          <template v-if="item.type == 'text' ">
            <van-field
                :value="item.value"
                :key="index"
                :label="item.name"
                :maxlength="item.maxlength?item.maxlength:30"
                :placeholder="item.placeholder"
                :border="false"
                
                @input="fieldChange"
                @focus="fieldFocus(item)"
                v-if="item.isShow"
              />
          </template>
          <template v-if="item.type == 'number'  ">
            <van-field
                :value="item.value"
                @input="fieldChange"
                :key="index"
                @focus="fieldFocus(item)"
                :label="item.name"
                type="number"
                :maxlength="item.maxlength"
                :placeholder="item.placeholder"
                :border="false"
                v-if="item.isShow"
              />
          </template>
          <template v-if="item.type == 'fgBorder'">
            <div class="fgBorder" :key="index"></div>
          </template>
          <template v-if="item.type == 'autosize' && item.isShow">
            <!-- <van-cell :title="item.name" :value="item.value" /> -->
            <van-field
                :value="item.value"
                :key="index"
                :label="item.name"
                type="textarea"
                :placeholder="item.placeholder"
                :border="false"
               
                @input="fieldChange"
                @focus="fieldFocus(item)"
                 v-if="item.isShow"
              />
          </template>
          <template v-if="item.type == 'picker' ">
            <van-field
                :value="item.value"
                :label="item.name"
                :key="index"
                readonly
                v-if="item.isShow"
                :placeholder="item.placeholder"
                :border="false"
                @click="showAllPiker(item)"
              />
            <van-picker
                v-if="item.selectShow"
                :columns="item.option"
                :key="index"
                show-toolbar
                :title="item.title"
                value-key="value"
                @confirm="onConfirm"
                @cancel="hideAllPiker(item)"
              />
          </template>
          <div v-if="item.type == 'date' " :key="index" ref="date">
                    <van-field
                    :value="item.value"
                    clearable
                    readonly
                    :label="item.name"
                    :placeholder="item.placeholder"
                    :border="false"
                    @click="showAllPiker(item)"
                    v-if="item.isShow"
                />
                <van-datetime-picker
                    v-if="item.selectShow"
                    type="date"
                    :title="item.title"
                    
                    @confirm="dateConfirmtime"
                    @cancel="hideAllPiker(item)"
                    :value="item.value ? new Date(item.value) : new Date()"
                />
          </div>
          <template v-if="item.type == 'file'">
            <div class="van-cell van-cell--borderless van-field" :key="index"  v-if="item.isShow">
              <span style="display:inline-block; min-width:14rem">
                {{item.name}}
              </span>
              <span class="fileImg" v-if="item.value.path" @click="show_file($event, item)">
                <img :src="item.value.path" alt="">
              </span>
              <div class="uploadFile" @click="activeImgObj(item)">
                <!--  -->
                <van-uploader :after-read="onRead" accept  :disabled="item.disabled">
                  <van-icon name="plus" />
                </van-uploader>
              </div>
            </div>
          </template>
           
          <template v-if="item.type=='switch'">
            <van-cell center :title="item.name"  v-if="item.isShow">
              <template #right-icon>
                <van-switch v-model="item.Shows" size="30" @input="onInput(item)"/>
              </template>
            </van-cell>
          </template>

        </template>
      </van-cell-group>
        <van-dialog
            v-model="shwoFile.flag"
            show-cancel-button
            cancel-button-text="删除"
            @cancel="delFile()"
            confirm-button-text="关闭"
          >
          <div style="max-height:35rem" v-if="isImg(shwoFile.url)">
            <img v-if="isImg(shwoFile.url)" :src="shwoFile.url" width="100%" />
          </div>
          <div class="fileImg" v-if="!isImg(shwoFile.url)">
            <van-icon name="description" />
          </div>
          <div class="title-file" v-if="!isImg(shwoFile.url)">该文件类型暂不支持查看</div>
      </van-dialog>
    </div>
    <div v-if="showModel" class="van-overlay"></div>
  </div>
</template>
<script>
export default {
  name: "StudentPersonlnfo",
  components: {
    
  },
  data() {
    return {
      m:"",
      flag:false,
      option:[],
      checked:"",
      value:"",
      select: {},
      updataImgObj: {},
      resParms:{},
      isHasFile:{},
      showModel:false,
      allUpdateObj:{},
      whetheropt: [{ key: "1", value: "是" }, { key: "0", value: "否" }],
      submitparms:{},
      shwoFile: {
        flag: false,
        url: ""
      },
      templateData: [
        //个人基本信息
       {
          id: "marital",
          name: "婚姻状况：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "picker",
          placeholder: "请选择",
          option: [
            // { key: "1", value: "已婚" },
            // { key: "2", value: "未婚" }
          ]
        },
        {
          id: "politicsStatus",
          name: "政治面貌：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "picker",
          placeholder: "请选择",
          option: [
            // { key: "1", value: "群众" },
            // { key: "2", value: "党员" }
          ]
        },
        {
          id: "isMatchSupport",
          name: "对口支援计划住院医师：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "switch",
          placeholder: "",
          Shows:false
        },
        {
          id: "matchSupportCompany",
          name: "送出单位：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "text",
          placeholder: "请输入",
        },
        {
          id: "studentLevel",
          name: "学员所属类型：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "picker",
          placeholder: "请选择",
          option: [
            { key: "1", value: "国家级" },
            { key: "2", value: "省级" },
            { key: "3", value: "院级" }
          ]
        },
        {
          id: "area",
          name: "国籍或地区：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "picker",
          placeholder: "请选择",
          option:[]
        },
        
        {
          id: "medicalQualificationType",
          name: "医师资格类别：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "picker",
          placeholder: "请选择",
          option:[
            // {key:1,value:"临床"},
            // {key:2,value:"口腔"},
            // {key:3,value:"公共卫生"},
            // {key:4,value:"中医"},

          ]
        },
        {
          id: "isCoordinationTrain",
          name: "协同单位轮转：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "switch",
          placeholder: "",
          Shows:false
        },
        {
          id: "coordinationCompanyName",
          name: "协同单位名称：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "text",
          placeholder: "请输入"
        },
        {
          id: "currentDuty",
          name: "班级职务：",//false
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "picker",
          placeholder: "请选择",
          option: [
            { key: "1", value: "班长" },
            { key: "2", value: "班组长" },
            { key: "3", value: "组长" },
            { key: "4", value: "助理" },
            { key: "5", value: "组员" },
          ]
        },
        

        {
          id: "recruitExamNum",
          name: "招录准考证号：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "number",
          placeholder: "招录准考证号"
        },
        {
          id: "recruitRegisterSubject",
          name: "招录报考学科：",
          index:1,
          isShow:true,
          value: "",
          type: "picker",
          title:'招录报考学科',
          placeholder: "招录报考学科",
          option: this.$store.state.majors
        },
        {
          id: "recruitSubject",
          name: "招录学科：",
          index:2,
          isShow:true,
          value: "",
          type: "picker",
          selectShow: false,
          placeholder: "招录学科",
          title:'招录学科',
          option: this.$store.state.majors
        },
        {
          id: "recruitAreaCompany",
          name: "来源地及单位：",
          index:3,
          isShow:true,
          value: "",
          type: "text",
          placeholder: "招录来源地及单位"
        },
        {
          id: "isDubboCertificateAll",
          name: "双证齐全：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "switch",
          placeholder: "",
          Shows:false
        },
        {
          id: "isPassExam",
          name: "通过医师资格考试：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "switch",
          placeholder: "",
          Shows:false,
        },
        {
          id: "passExamDate",
          isShow:false,
          index:12,
          name: "通过医师资格考试时间：",
          value: "",
          title:'通过医师资格考试时间',
          type: "date",
          selectShow: false,
          placeholder: "通过医师资格考试时间",
          flag:""
        },
        {
          id: "physicianExamAchievement",
          name: "医师资格考试成绩：",
          value: "",
          isShow:false,
          maxlength: 20,
          index:0,
          type: "text",
          placeholder: "请输入",
          flag:""
        },
        {
          id: "medicalQualificationLevel",
          name: "医师资格级别：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "picker",
          placeholder: "请选择",
          option:[
            // {key:1,value:"执业医师"},
            // {key:2,value:"执业助理医师"},
          ],
          flag:""
        },
        {
          id: "isHasCertificate",
          name: "获得医师资格证书：",
          value: "",
          isShow:false,
          maxlength: 20,
          index:0,
          type: "switch",
          placeholder: "请选择",
          Shows:false,
          flag:""
        },
        {
          id: "isDoctorRegistrationCertificate",
          name: "医师执业证：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "switch",
          placeholder: "请选择",
          Shows:false
        },
        {
          id: "doctorRegistrationCertificateDate",
          name: "医师执业证书时间：",
          value: "",
          isShow:false,
          maxlength: 20,
          index:0,
          type: "date",
          placeholder: "请选择",
          flags:""
        },
        {
          id: "doctorRegistrationCertificateNo",
          name: "医师执业证书编号：",
          value: "",
          isShow:false,
          maxlength: 20,
          index:0,
          type: "text",
          placeholder: "请输入",
          flags:""
        },
        // {
        //   id: "recruitExamNum",
        //   name: "医师执业证书编号：",
        //   value: "",
        //   isShow:true,
        //   maxlength: 20,
        //   index:0,
        //   type: "text",
        //   placeholder: "请输入"
        // },
        {
          id: "isUnitRegister",
          name: "本单位注册：",
          value: "",
          isShow:false,
          maxlength: 20,
          index:0,
          type: "switch",
          placeholder: "请输入",
          Shows:false,
          flags:""
        },
        {
          id: "doctorRegistrationCertificateCompany",
          name: "执业证书注册单位：",
          value: "",
          isShow:false,
          maxlength: 20,
          index:0,
          type: "text",
          placeholder: "请输入",
          flags:""
        },
        {
          id: "diagnosticReportCertificate",
          name: "医师处方权/诊断报告权：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "switch",
          placeholder: "请输入",
          Shows:false
        },
        {
          id: "diagnosticReportCertificateTime",
          name: "获得医师处方权/诊断报告权时间：",
          value: "",
          isShow:false,
          maxlength: 20,
          index:0,
          type: "date",
          placeholder: "请选择",
          // option:[]
        },
        {
          id: "dormitoryInformation",
          name: "宿舍信息：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "text",
          placeholder: "请输入"
        },
        {
          id: "dormitoryBeginDate",
          name: "入宿日期：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "date",
          placeholder: "请选择"
        },
        {
          id: "dormitoryEndDate",
          name: "退宿日期：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "date",
          placeholder: "请选择"
        },

        //工作经历
        {
          experience:"",
          id: "companyName",
          name: "单位名称：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "text",
          placeholder: "请输入当前单位"
        },
        {
          experience:"",
          id: "companyAddress",
          name: "单位地址：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "text",
          placeholder: "请输入当前单位地址"
        }, 
        {
          experience:"",
          id: "positionName",
          name: "职位名称：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "text",
          placeholder: "请输入当前职位名称"
        },
        {
          experience:"",
          id: "departmentName",
          name: "所在部门：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "text",
          placeholder: "请输入当前所在部门"
        },
        {  
          experience:"",
          id: "contacts",
          name: "联系人：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "text",
          placeholder: "请输入联系人"
        },
        {
          experience:"",
          id: "contactNumber",
          name: "联系人电话：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "text",
          placeholder: "请输入联系电话"
        },
        {
          experience:"",
          id: "beginDate",
          name: "工作开始时间：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "date",
          placeholder: "请选择"
        },
        {
          experience:"",
          id: "endDate",
          name: "工作结束时间：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "date",
          placeholder: "请选择"
        },
        {
          experience:"",
          id: "workTime",
          name: "工作时长：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "text",
          placeholder: "请输入"
        },
        {
          experience:"",
          id: "bankCardCode",
          name: "银行卡：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "picker",
          placeholder: "请选择开户行",
          option: [
            // { key: "1", value: "国家开发银行" },
            // { key: "2", value: "中国工商银行" },
            // { key: "3", value: "中国农业银行" },
            // { key: "4", value: "国家开发银行" },
            // { key: "5", value: "中国银行" },
            // { key: "6", value: "中国建设银行" },
            // { key: "7", value: "国家邮政储蓄银行" },
            // { key: "8", value: "中国交通银行" },
            // { key: "9", value: "中国招商银行" },
            // { key: "10", value: "兴业银行" },
            // { key: "11", value: "华夏银行" },
            // { key: "12", value: "其他" }
          ]
        },
        {
          experience:"",
          id: "bankCardNumber",
          name: "银行卡号：",
          value: "",
          isShow:true,
          maxlength: 20,
          index:0,
          type: "text",
          placeholder: "请输入"
        },
        {
          // experience:"",
          id: "idcardUrl",
          name: "身份证扫描件：",
          value: {path:""},
          isShow:true,
          maxlength: 20,
          index:0,
          type: "file",
          placeholder: "请上传"
        },
        {
          // experience:"",
          id: "certificateUrl",
          name: "医师资格证：",
          value: {path:""},
          isShow:true,
          maxlength: 20,
          index:0,
          type: "file",
          placeholder: "请上传"
        },
        {
          // experience:"",
          id: "doctorRegistrationCertificateUrl",
          name: "医师执业证：",
          value: {path:""},
          isShow:true,
          maxlength: 20,
          index:0,
          type: "file",
          placeholder: "请上传"
        },

       
        // {
        //   type: "fgBorder",
        //   index:4,
        //   isShow:true,
        // },
        



        // {
        //   id: "studentLevel",
        //   name: "学员所属类型：",
        //   isShow:true,
        //   index:5,
        //   value: "",
        //   selectShow: false,
        //   type: "picker",
        //   title:'学员所属类型',
        //   placeholder: "学员所属类型",
        //   option: [
        //     { key: "1", value: "国家级" },
        //     { key: "2", value: "省级" },
        //     { key: "3", value: "院级" }
        //   ]
        // },
        // {
        //   id: "trainBeginDate",
        //   name: "培训开始时间：",
        //   index:6,
        //   value: "",
        //   isShow:true,
        //   type: "date",
        //   title:'参培开始时间',
        //   selectShow: false,
        //   placeholder: "参培开始时间"
        // },
        // {
        //   id: "trainEndDate",
        //   index:7,
        //   name: "培训结束时间：",
        //   value: "2019-01-01",
        //   isShow:true,
        //   type: "date",
        //   title:'参培结束时间',
        //   selectShow: false,
        //   placeholder: "参培结束时间"
        // },
        // {
        //   id: "trainingYears",
        //   name: "培训年限：",
        //   index:8,
        //   isShow:true,
        //   value: "",
        //   type: "picker",
        //   maxlength: 2,
        //   placeholder: "培训时长",
        //   option: [
        //     {key: "12", value: "12月"},
        //     {key: "24", value: "24月"},
        //     {key: "33", value: "33月"},
        //     {key: "36", value: "36月"}
        //   ]
        // },
        // {
        //   id: "bankCardNumber",
        //   name: "银行卡号：",
        //   value: "",
        //   isShow: true,
        //   index: 9,
        //   maxlength: 22,
        //   type: "text",
        //   placeholder: "请输入银行卡号"
        // },
        {
          type: "fgBorder",
          index:10,
          isShow:true,
        },
        // {
        //   id: "isPassExam",
        //   index:11,
        //   name: "是否通过医师资格考试：",
        //   value: "",
        //   isShow:true,
        //   type: "picker",
        //   title:'是否通过医师资格考试',
        //   selectShow: false,
        //   placeholder: "是/否",
        //   option: this.$store.state.trueOrFalse
        // },
       
       
        // {
        //   id: "physicianExamAchievement",
        //   name: "医师资格考试成绩：",
        //   isShow:true,
        //   index:13,
        //   value: "",
        //   type: "text",
        //   maxlength: 5,
        //   placeholder: "医师资格考试成绩"
        // },
        // {
        //   id: "isHasCertificate",
        //   name: "是否获得医师资格证书：",
        //   value: "",
        //   index:14,
        //   isShow:true,
        //   type: "picker",
        //   title:'是否获得医师资格证书',
        //   selectShow: false,
        //   placeholder: "是/否",
        //   option: this.$store.state.trueOrFalse
        // },
        // {
        //   id: "certificateUrl",
        //   name: "医师资格证书：",
        //   isShow:true,
        //   index:15,
        //   value: {
        //     md5: ""
        //   },
        //   type: "file",
        //   placeholder: "医师资格证书"
        // },
        // {
        //   id: "isDoctorRegistrationCertificate",
        //   name: "有无医师注册证：",
        //   value: "",
        //   index:16,
        //   type: "picker",
        //   isShow:true,
        //   title:'医师资格证书',
        //   selectShow: false,
        //   placeholder: "医师资格证书",
        //   option: [{ key: "1", value: "有" }, { key: "0", value: "无" }]
        // },
        // {
        //   id: "doctorRegistrationCertificateDate",
        //   name: "医师注册证书时间：",
        //   value: "",
        //   index:17,
        //   isShow:true,
        //   title:'医师资格证书时间',
        //   type: "date",
        //   selectShow: false,
        //   placeholder: "医师资格证书时间"
        // },
        // {
        //   id: "doctorRegistrationCertificateUrl",
        //   name: "医师注册证书：",
        //   isShow:true,
        //   index:18,
        //   value: {
        //     md5: ""
        //   },
        //   type: "file",
        //   placeholder: ""
        // },
        // {
        //   type: "fgBorder",
        //   index:19,
        //   isShow:true,
        // },
        // {
        //   id: "isCoordinationTrain",
        //   name: "是否在协同单位轮转：",
        //   isShow:true,
        //   index:20,
        //   value: "",
        //   type: "picker",
        //   title:'是否在协同单位轮转',
        //   selectShow: false,
        //   placeholder: "是/否",
        //   option: this.$store.state.trueOrFalse
        // },
        // {
        //   id: "coordinationCompanyName",
        //   name: "协同单位名称：",
        //   index:21,
        //   value: "",
        //   isShow:true,
        //   type: "text",
        //   placeholder: "协同单位名称"
        // }
      ],
      list:[ 
     
      ],
      id:""
    };
  },
  methods: {
    onInput(item){
       console.log(item)
       if(item.id==='isMatchSupport'){
        //matchSupportCompany
           this.show("matchSupportCompany",item.Shows)
       }else if(item.id==="isPassExam"){
           let arr=this.templateData.filter(items=>items.hasOwnProperty('flag'))
           console.log(arr)
           arr.forEach(items=>{
             items.isShow=item.Shows
           })
       }else if(item.id==="isDoctorRegistrationCertificate"){
           let arr=this.templateData.filter(items=>items.hasOwnProperty('flags'))
           arr.forEach(items=>{
             items.isShow=item.Shows
           })
       }else if(item.id=='isUnitRegister'){
           this.show("doctorRegistrationCertificateCompany",item.Shows)
       }else if(item.id==='diagnosticReportCertificate'){
           this.show("diagnosticReportCertificateTime",item.Shows)
          //  this.templateData.forEach(items=>{
         
          //     if(items.id==='diagnosticReportCertificateTime'){
          //        items.isShow=item.Shows
          //     }
          //  })
       }
    },
    show(id,Shows){
       this.templateData.forEach(item=>{
            if(item.id===id){
              // item.isShow=Shows
              item.isShow=Shows
              //Shows?item.isShow=false:item.isShow=true
            }
       })
    },
    onClickLeft() {
      this.Dialog.confirm({
        title: "提示",
        message: "当前已有内容修改是否退出？"
      }).then(() => {
        this.utils.goBack(this);
      }).catch(() => {});
    },
    changeIshow(activeItem,key){
      if( activeItem.id == "isPassExam" && key == '0'){
        let index = activeItem.index;
        this.templateData[index+1].isShow = false;
        this.templateData[index+2].isShow = false;
        this.templateData[index+3].isShow = false;
        this.templateData[index+4].isShow = false;
      }
      if(activeItem.id == "isPassExam" && key == '1'){
        let index = activeItem.index;
        this.templateData[index+1].isShow = true;
        this.templateData[index+2].isShow = true;
        this.templateData[index+3].isShow = true;
        let isTrue = this.changeValue(this.templateData[index+3].value,this.templateData[index+3].option);
        if(isTrue != '0'){
          this.templateData[index+4].isShow = true;
        }
      }
      if(activeItem.id == "isHasCertificate" && activeItem.isShow && key == '0'){
        let index = activeItem.index;
        this.templateData[index+1].isShow = false;
      }
      if(activeItem.id == "isHasCertificate" && activeItem.isShow && key == '1'){
        let index = activeItem.index;
        this.templateData[index+1].isShow = true;
      }
      if(activeItem.id == "isDoctorRegistrationCertificate" && key == '0'){
        let index = activeItem.index;
        this.templateData[index+1].isShow = false;
        this.templateData[index+2].isShow = false;
      }
      if(activeItem.id == "isDoctorRegistrationCertificate" && key == '1'){
        let index = activeItem.index;
        this.templateData[index+1].isShow = true;
        this.templateData[index+2].isShow = true;
      }
      if(activeItem.id == "isCoordinationTrain" && key == '1'){
        let index = activeItem.index ;
        this.templateData[index+1].isShow = true;
      }
      if(activeItem.id == "isCoordinationTrain" && key == '0'){
        let index = activeItem.index;
        this.templateData[index+1].isShow = false;
      }
    },
    onConfirm(event) {
      console.log(event.value)
      this.select.value = event.value;
      this.changeIshow(this.select,event.key);
      this.hideAllPiker();
    },

    hideAllPiker(item) {
      this.hideMask();
      this.templateData.forEach(item => {
        if (item.hasOwnProperty("selectShow")) {
          item.selectShow = false;
        }
      });
    },

    hideMask() {
      this.showModel = false;
    },

    openMask(){
      this.showModel = true;
    },

    showAllPiker(item) {
      this.hideAllPiker();
      this.openMask();
      this.select = item;
      item.selectShow = true;
    },

    fieldChange(val){
      if(this.select.id == 'trainingYears' && val*1 > 10){
        this.select.value = 10
      }else{
        this.select.value = val
      }
    },

    fieldFocus(item){
      this.select = item;
    },

    dateConfirmtime(val) {
      this.select.value = this.utils.formatDate(val, "yyyy-MM-dd", true);
      console.log(this.select)
      this.hideAllPiker();
    },
    delFile() {
      Object.keys(this.isHasFile).forEach((item)=>{
          if(this.isHasFile[item] == this.select.value.path){
              delete this.isHasFile[item]
          }
      })
      this.select.value.path = "";
      this.select.value.md5 = "";
    },
    isImg(str) {
      if (
        /.jpg/.test(str) ||
        /.jpeg/.test(str) ||
        /.png/.test(str) ||
        /.gif/.test(str)
      ) {
        return true;
      } else {
        return false;
      }
    },
    onRead(file) {
      // console.log("文件2",file)
      if(this.utils.checkSuffix(file.file.name)){
        this.updataFile(file);
      }else{
        this.Toast("请选择bmp, jpg, jpeg, png, gif的格式图片");
        return false;
      }
    },
    updataFile(file) {
      let _this = this;  
      let flag = true;
      this.utils.fileUploader(file, data => {
        console.log(this.updataImgObj, data);
        // debugger
        this.updataImgObj.value = {
          path: data.url,
          md5: "",
          name: data.name
        };
      });
    },

    activeImgObj(updataImgObj) {
      this.updataImgObj = updataImgObj;
    },

    show_file(e, item, index) {
      e.stopImmediatePropagation();
      this.select = item;
      this.shwoFile.flag = true;
      this.shwoFile.url = item.value.path;
      this.shwoFile.index = index;
    },

    callBackHandle(){
      this.utils.goBack(this);
      // if(JSON.stringify(this.templateData) != JSON.stringify(this.resParms)){
      //   this.onClickLeft();
      // }else{
      //   this.utils.goBack(this);
      // }
    },

    onClickRight() {
      // this.utils.ajax({
      //   url: this.api.saveStudentWorkNow,
      //   method: "post",
      //   data: {
      //       bankCardNumber: this.templateData[9].value,
      //   },
      //   success:(res)=>{

      //   }
      // },false)
      this.Mynews()
      this.Undergo()
    },
    Mynews(){
      let arr=this.templateData.filter(item=>!item.hasOwnProperty("experience"))
      this.update(arr,this.api.updateByStudentId)
    },
    Undergo(){
      let arr=this.templateData.filter(item=>item.hasOwnProperty("experience"))
      this.update(arr,this.api.saveStudentWorkNow)
    },
    update(arr,url){
      arr.forEach(item => {
         if(item.type == "file" && item.isShow){
           this.submitparms[item.id] = item.value.path
         }else if(item.type == "picker" && item.isShow){
           this.submitparms[item.id] = this.changeValue(item.value,item.option)
         }else if(item.type == "text" || item.type == "number" || item.type == "date" &&  item.isShow){
           this.submitparms[item.id] = item.value;
         }else if(item.type=='switch'){
            if(item.Shows==true){
              this.submitparms[item.id]=1
            }else{
              this.submitparms[item.id]=0
            }
          //  this.submitparms[item.id]=item.Shows?1:0
         }else{
           if(item.id){
             this.submitparms[item.id] = '';
           }
         }
      });
      this.resParms = this.utils.deepCopy(this.templateData);
      const parms = Object.assign({},this.allUpdateObj,this.submitparms);
      console.log("参数",this.submitparms)
      parms.id=this.id
      this.utils.ajax({
        url: url,
        method: "post",
        data:parms,
        success:(res)=>{
          console.log("保存信息",res)
          this.Toast("保存成功！");
        }
      });
    },
    changeValue(val,opts){
      let codeVal;
      if(!opts){
          return true;
      }
      opts.forEach(item => {
        if(val == item.value){
          codeVal = item.key;
        }
      });
      return codeVal;
    },

    changeCode(code,opts){
      let codeVal;
      opts.forEach(item => {
        if(code == item.key){
          codeVal = item.value;
        }
      });
      // console.log("剑指",codeVal)
      return codeVal;
    },

    isImgtea(str) {
      if (
        /.jpg/.test(str) ||
        /.jpeg/.test(str) ||
        /.png/.test(str) ||
        /.gif/.test(str)
      ) {
        return true;
      } else {
        return false;
      }
    },

    initData(url,table) {
      this.utils.ajax({
        url: url,
        method: "post",
        data: {},
        success: res => {
           if(table){
             this.id=res.id
            //  console.log("信息id",this.id)
           }
           
          this.allUpdateObj = res;
        
          this.templateData.forEach(item => {
            if (res.hasOwnProperty(item.id)){
              if (item.type == "file") {
                console.log("文件",res[item.id])
                item.value.path=res[item.id]
                // item.value={path:res[item.id]};
              } else if (item.type == "date") {
                item.value = res[item.id].split(" ")[0];
              }else if(item.type == "picker"){
                this.changeIshow(item,res[item.id]);
                item.value = this.changeCode(res[item.id],item.option)
              }else if(item.type == "switch"){
                    res[item.id]==1?item.Shows=true:item.Shows=false
                    
                    if(item.id==='isMatchSupport'){
                      this.show("matchSupportCompany",item.Shows)
                    }else if(item.id=="isPassExam"){
                      let arr=this.templateData.filter(items=>items.hasOwnProperty('flag'))
                      arr.forEach(items=>{
                        items.isShow=item.Shows
                      })
                    }else if(item.id=="isDoctorRegistrationCertificate"){
                      let arr=this.templateData.filter(items=>items.hasOwnProperty('flags'))
                      arr.forEach(items=>{
                        items.isShow=item.Shows
                      })
                    }else if(item.id==='isUnitRegister'){
                      this.show("doctorRegistrationCertificateCompany",item.Shows)
                    }else if(item.id==='diagnosticReportCertificate'){
                      this.show("diagnosticReportCertificateTime",item.Shows)
                      // this.templateData.forEach(items=>{
                      //   if(items.id==='diagnosticReportCertificateTime'){
                      //       items.isShow=item.Shows
                      //    }
                      // })
                      
                    }
              }else if(item.type == "text"|| item.type == "number"){
                  item.value=res[item.id]
                  // console.log("文本内容",res)
                  //  item.value = res[dormitoryInformatio"];
                  //  console.log("宿舍信息",res["dormitoryInformatio"])
                   
              }
            }
          });
          this.resParms = this.utils.deepCopy(this.templateData);
        }
      });
      this.utils.ajax({
        url: this.api.studentWorkNow,
        method: "post",
        data: {
            studentId: this.$store.state.userInfo.human.caId,
        },
        success: res => {
            if(res || res.bankCardNumber){
                this.templateData[9].value = res.bankCardNumber;
            }
        }
      });
    },
    plick(type,callback){
      let arr=[]

       this.utils.ajax({
         url: this.api.studentsysDict,
         method: "post",
         data:type,
         success:res=>{
            res.forEach(item=>{
              this.templateData.forEach(items=>{
                 if(type.type==items.id){
                   items.option.push({
                      key:item.key,
                      value:item.value
                   })
                 }
              })
            })
            callback && callback();
         }
       })
    }

  },
  mounted() {
   
  },
  created() {
    let area={type:'area'};
    let marital={type:"marital"}
    let medicalQualificationLevel={type:"medicalQualificationLevel"}
    let politicsStatus={type:"politicsStatus"}
    let medicalQualificationType={type:"medicalQualificationType"}
    let bankCardCode={type:"bankCardCode"}
    let p1 = new Promise((resolve,reject)=>{
      this.plick(area,()=>{
        resolve();
      })
    });
    let p2 = new Promise((resolve,reject)=>{
      this.plick(marital,()=>{
        resolve();
      })
    });
    let p3 = new Promise((resolve,reject)=>{
      this.plick(medicalQualificationLevel,()=>{
        resolve();
      })
    });
    let p4 = new Promise((resolve,reject)=>{
      this.plick(politicsStatus,()=>{
        resolve();
      })
    });
    let p5 = new Promise((resolve,reject)=>{
      this.plick(medicalQualificationType,()=>{
        resolve();
      })
    });
    let p6 = new Promise((resolve,reject)=>{
      this.plick(bankCardCode,()=>{
        resolve();
      })
    });
    Promise.all([p1,p2,p3,p4,p5,p6]).then(() => {
      this.initData(this.api.selectByStudentId,true);
      this.initData(this.api.studentWorkNow,false)
      // if(res){
        
      // }
     
    })
    // let diagnosticReportCertificateTime={type:"diagnosticReportCertificateTime"}
    // this.plick(diagnosticReportCertificateTime)

    
  }
};
</script>
<style scoped>
.stu-person-box >>> .van-cell{
  background: #ffffff;
}
.stu-person-box >>> .van-cell__title {
  white-space: nowrap;
}
.stu-person-box >>> .van-cell {
  justify-content: space-between;
}
.stu-person-box >>> .van-picker {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 16rem;
  z-index: 10;
}
.stu-person-box >>> .van-field__control {
  text-align: right;
}
.stu-person-box >>> .van-field__label {
  min-width: 10rem;
}
.fgBorder{
  height: 5px;
  width: 100%;
  background: #f2f2f2;
  border-bottom: 0.2rem;
}
.stu-person-box .uploadFile {
  position: relative;
  display: inline-block;
  font-size: 2rem;
  height: 2rem;
  width: 2rem;
  border-radius: 0.5rem;
  border: 0.04rem solid #e1e1e1;
  vertical-align: middle;
  margin-right: 0.925rem;
  margin-left: 1rem;
}
.stu-person-box .van-field__body textarea{
  text-align: left;
}
.stu-person-box .fileImg img {
  width: 2rem;
  height: 2rem;
  vertical-align: middle;
}
</style>

