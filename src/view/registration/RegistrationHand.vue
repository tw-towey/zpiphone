<template>
  <div class>
    <van-nav-bar :title="title" class="header" :right-text="rightText" fixed left-arrow @click-left="onClickLeft" @click-right="onClickRight"/>
    <div class="layout_content top">
      <div class="content">
        <ul class="padding ulStyle">
          <li>
            <span>轮转科室：</span>
            <span>{{$store.state.scheduling.departmentName}}</span>
          </li>
          <li>{{$store.state.scheduling.range}}</li>
        </ul>
        <div v-for="(item,index) in listObj" :key="index">
          <div v-if="item.type=='radio'">
            <div class="botomo" >
              <div class="padding">
                <div class="radioStyle">
                  <span><font v-if="item.required" color="red">*</font>
                  <span style="display:inline-block;min-width:3.625rem">{{item.title}}</span></span>
                  <van-radio-group v-model="item.value" class="radioname"> 
                    <div v-for="(i,inde) in item.option" :key="inde" @click="disabled && radioClick(item.value,item.id)" class="radiovan">
                      <van-radio :name="i.key" :disabled="item.disabled">
                        <img
                          slot="icon"
                          slot-scope="props"
                          :src="props.checked ? icon.active : icon.normal"
                          class="dadioimg"
                        />
                        <span>{{i.value}}</span>
                      </van-radio>
                    </div>
                  </van-radio-group>
                </div>
              </div>
            </div>
          </div>
          <div v-if="item.type=='text'" class="botomo">
              <van-field
                 v-model="item.value"
                 :label="item.title"
                 :placeholder="item.placeholder"
                 input-align="right"
                 @blur="item.blur ? item.blur(item.value) : null"
                 :disabled="item.disabled"
                 :required="item.required"
                 :maxlength='item.maxlength'
               />
          </div>
          <div v-if="item.type=='select'" class="botomo">
               <van-cell
                :title="item.title"
                is-link
                :required="item.required"
                :value="item.value?utils.getValueByvalue(item.option, item.value):item.placeholder"
                @click="!item.disabled && show(item,true)"
                />
          </div> 
          <div v-if="item.type=='selectText'" class="botomo">
            <div class="seleText" @click="!item.disabled && show(item,true)">
               <van-field
                 v-if="item.iocn && !item.edit"
                 v-model="item.name"
                 :label="item.title"
                 :placeholder="item.placeholder"
                 input-align="right"
                 :disabled="item.disabled"
                 :required="item.required"
                 :maxlength='item.maxlength'
               />   
               <van-cell
               v-if="item.iocn && item.edit"
                :title="item.title"
                :required="item.required"
                :value="item.value?utils.getValueByvalue(item.option, item.value):item.placeholder"
                @click="!item.disabled && show(item,true)"
                /> 
             <span class="edit_icon" v-if="item.iocn && !item.edit">
              <van-icon name="edit" @click="!item.disabled && edit_ipt(item)"/>
            </span>
            <span class="edit_icon" v-if="item.iocn && item.edit">
              <van-icon name="arrow" @click="!item.disabled && edit_ipt(item)"/>
            </span> 
            </div>

          </div>
          <div v-if="item.type=='date'" class="botomo"> 
               <van-cell
                :title="item.title"
                is-link
                :required="item.required"
                :value="item.value?item.value:item.placeholder"
                @click="!item.disabled && cancel1(item,true)"
                />
          </div>
          <div v-if="item.type=='textarea'" class="botomo">
             <div style="padding:0 0.9rem;">
                <span><font color="red" v-if="item.required">*</font>{{item.title}}</span>
            </div>  
             <van-field
                 v-model="item.value"
                 type="textarea"
                 :rows="6"
                 :placeholder="item.placeholder"
                 :disabled="item.disabled"
                 :required="item.required"
                 :border="true"
                 :maxlength='item.maxlength'
                 show-word-limit
              />
          </div>

          <div v-if="item.type=='file'">
            <label class="lable">{{item.field}} <span style="color:#969799;font-size:12px">(长按可删除)</span> </label>
            <div class="file_box">
              <div class="fileList" @touchstart="getTouchStart($event,file.path, i)" @touchend="getTouchEnd()" v-for="(file, i) in item.value" :key="i" @click="!item.disabled && show_file($event, file.path, i)">
                <img :src="file.path" v-if="isImg(file.path)">
                <div v-if="!isImg(file.path)" class="boxfile">
                  <van-icon name="description"/>
                </div>
              </div>
              <div class="uploadFile">
                <van-uploader :disabled="item.disabled" :after-read="onRead" accept="" multiple>
                  <van-icon name="plus" />
                </van-uploader>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="height:6rem"></div>
    </div>
      <van-popup v-model="moduleData1.dateShow" position="bottom" :overlay="true">
        <van-datetime-picker
          v-if="moduleData1.dateShow"
          :value="data"
          type="date"
          :min-date="currentDate"
          @confirm="dateConfirm"
          @cancel="cancel1('', false)"
        />
      </van-popup>
      <van-popup v-model="moduleData.selectShow" position="bottom" >
        <van-picker
          v-if="moduleData.selectShow"
          show-toolbar
          :title="moduleData.data.placeholder"
          :columns="moduleData.data.option"
          @confirm="selectMajorConfirm"
          @cancel="show('',false)"
        />
      </van-popup>

      <van-dialog
        v-model="shwoFile.flag"
        show-cancel-button
        cancel-button-text="删除"
        @cancel="delFile()"
        confirm-button-text="关闭">
            <img v-if="isImg(shwoFile.url)" class="dailogImg" :src="shwoFile.url" width="100%;">
            <div class="fileImg" v-if="!isImg(shwoFile.url)">
                <van-icon name="description"/>
            </div>
            <div class="title-file" v-if="!isImg(shwoFile.url)">
                该文件类型暂不支持查看
            </div>
    </van-dialog>
  </div>
</template>

<script>
export default {
  name: "RegistrationHand",
  components: {},
  data() {
    return {
      title: "",
      rightText:'提交',
      eventLoop:null,
      listObj: [],
      isHasFile: {},
      diseaseLIst: [  // 病种 类型
        {
          title: "类型",
          type: "radio",
          required: false,
          disabled: false,
          option: [ // 
            { key: 3, value: "门诊" },
            { key: 4, value: "急诊" },
            { key: 23, value: "住院" },
            { key: 22, value: "门诊病案" },
            { key: 1, value: "大病历" }
          ],
          id: "twoLevelType",
          value: 3,
        },
      ],
      timer:null,
      normalDepartmentId:this.$store.state.scheduling.normalDepartmentId,
      skill: [  // 技能 类型
        {
          title: "类型",
          type: "radio",
          required: false,
          disabled: false,
          option: [ // 
            { key: 7, value: "门诊操作" },
            { key: 5, value: "操作记录" },
            { key: 9, value: "医技报告" },
          ],
          id: "twoLevelType",
          value: 7,
        },
      ],
      surgery: [  // 手术类型
        {
          title: "手术类型",
          type: "radio",
          required: false,
          disabled: false,
          option: [ // 
            { key: 24, value: "门诊" },
            { key: 25, value: "急诊" },
            { key: 26, value: "住院" },
          ],
          id: "twoLevelType",
          value: 24,
        },     
      ],
      data: new Date(),
      currentDate: new Date(2015,0,1),
      moduleData:{ // select 下拉框
          selectShow: false,
          data:{
              value:''
          }
      }, // 弹出层
      moduleData1: { // 时间
         dateShow: false,
         data: {
             value: ''
         }
      },
      shwoFile: { // 附件
        flag: false,
        url: ""
      },
      type: 0, // 类型 门诊 急诊 住院 病案
      skilltype: 0, //类型 门诊操作 操作技能 医技报告
      disabled: true, // 类型是否可点击 true 可点击，false不可点击
      public: [ // 公共
        { title:'病历号', type:'text', required:true, disabled:false, id:'visitNumber', value:'', placeholder:'请输入病历号/就诊号/住院号',maxlength:'-1',blur:(number)=>{
          if(this.timer ){
            clearTimeout(this.timer);
          }
          if(number){
            this.timer = setTimeout(()=>{
              this.getDataByName('',number, this.public);
            },200)
          }
        }},
        { title:'病人姓名', type:'text', required:true, disabled:false, id:'patientName', value:'', placeholder:'请输入病人姓名',maxlength:'-1'}
      ],
      publicContent: [ // 公共 内容
        { title:'内容', type:'textarea', required:false, disabled:false, id:'content', value:'', placeholder:'诊治内容最多可输入2000字',maxlength:'2000'},
      ],
      publichelp: [ // 公共 是否请救
        { title:'抢救内容', type:'textarea', required:false, disabled:false, id:'salvageContent', value:'', placeholder:'诊治最多可输入1000字',maxlength:'-1'},
        { title:'转归情况', type:'textarea', required:false, disabled:false, id:'lapseToCondition', value:'', placeholder:'诊治最多可输入1000字',maxlength:'-1'},
      ],
      outpatient: [ // 门诊 急诊
        { title:'就诊时间', type:'date', required:true, disabled:false, id:'date', value:'', placeholder:'请选择时间'},
        { title:'主要诊断', type:'selectText', required:true, disabled:false, id:'mainDiagnosisCode',edit: false,iocn: true, idName:'mainDiagnosis', name:'', value:'', placeholder:'请选择或输入主要诊断',option:[]},
        { title:'次要诊断', type:'selectText', required:false, disabled:false, id:'secondaryDiagnosisCode',edit: false,iocn: true,idName:'secondaryDiagnosis', name:'', value:'', placeholder:'请选择或输入次要诊断',selectShow: false,option:[]},
        { title:'是否抢救', type:'radio', required:false, disabled:false, id:'salvage', value: 0, option: [
            { key: 1, value: "是" },
            { key: 0, value: "否" },
          ],},
        { title:'就诊类型', type:'select', required:false, disabled:false, id:'visitType', value:'', placeholder:'请选择就诊类型',  option: [
            {text: '首诊', value: 1},
            {text: '复诊', value: 2},
            {text: '入院', value: 3},
            {text: '出院', value: 4},
            {text: '手术', value: 5},
            {text: '影像', value: 6},
            {text: '化验', value: 7},
            {text: '体征', value: 8}
          ]},
        { title:'技能操作', type:'select', required:false, disabled:false, id:'skillCode',idName:'skill', name:'', value:'', placeholder:'请选择技能操作',option:[]},
        { title:'参与角色', type:'select', required:false, disabled:false, id:'joinRole', value: '', placeholder:'请选择参与角色',name:'',
          option: [
            {text: '术者', value: 1},
            {text: '一助', value: 2},
            {text: '二助', value: 3},
            {text: '三助', value: 4},
            {text: '观看', value: 5}
        ]}, 
      ],
      hospitalized: [ // 住院 
        { title:'床号', type:'text', required:false, disabled:false, id:'bedNo', value:'', placeholder:'请输入床号',maxlength:'-1'},
        { title:'就诊时间', type:'date', required:false, disabled:false, id:'date', value:'', placeholder:'请选择时间'},
        { title:'入院时间', type:'date', required:true, disabled:false, id:'inHospitalTime', value:'', placeholder:'请选择时间'},
        { title:'出院时间', type:'date', required:false, disabled:false, id:'outHospitalTime', value:'', placeholder:'请选择时间'},
        { title:'主要诊断', type:'selectText', required:true, disabled:false, id:'mainDiagnosisCode',edit: false,iocn: true,idName:'mainDiagnosis', name:'', value:'', placeholder:'请选择或输入主要诊断',maxlength:'-1'},
        { title:'次要诊断', type:'selectText', required:false, disabled:false, id:'secondaryDiagnosisCode',edit: false,iocn: true,idName:'secondaryDiagnosis', name:'', value:'', placeholder:'请选择或输入次要诊断',maxlength:'-1'},
        // { title:'书写大病历', type:'radio', required:false, disabled:false, id:'isWriteBigCase', value: 0, option: [
        //     { key: 1, value: "是" },
        //     { key: 0, value: "否" },
        // ],},
        { title:'是否抢救', type:'radio', required:false, disabled:false, id:'salvage', value: 0, option: [
            { key: 1, value: "是" },
            { key: 0, value: "否" },
        ],},
        { title:'是否肛肠专科住院志', type:'radio', required:false, disabled:false, id:'isLiver', value: 0, option: [
            { key: 1, value: "是" },
            { key: 0, value: "否" },
        ],},
        { title:'就诊类型', type:'select', required:false, disabled:false, id:'visitType', value:'', placeholder:'请选择就诊类型',option: [
            {text: '首诊', value: 1},
            {text: '复诊', value: 2},
            {text: '入院', value: 3},
            {text: '出院', value: 4},
            {text: '手术', value: 5},
            {text: '影像', value: 6},
            {text: '化验', value: 7},
            {text: '体征', value: 8}
          ]},
        { title:'技能操作', type:'select', required:false, disabled:false, id:'skillCode',idName:'skill',name:'', value:'', placeholder:'请选择技能操作',option:[]}, 
        { title:'参与角色', type:'select', required:false, disabled:false, id:'joinRole', placeholder:'请选择参与角色',name:'',
          option: [
            {text: '术者', value: 1},
            {text: '一助', value: 2},
            {text: '二助', value: 3},
            {text: '三助', value: 4},
            {text: '观看', value: 5}
        ]},
      ],
      physician: [
        { title:'医师类型', type:'radio', required:false, disabled:false, id:'physicianType',value: '',value: 1, option: [
            { key: 1, value: "首诊医师" },
            { key: 2, value: "管床医师" },
        ],},
      ],
      manage: [
         { title:'是否全程管理', type:'radio', required:false, disabled:false, id:'isTubeBed', value: 0, option: [
            { key: 1, value: "是" },
            { key: 0, value: "否" },
          ],}, 
      ],
      manageTitme: [
          { title:'管床接手时间', type:'date', required:true, disabled:false, id:'admissionDate', value:'', placeholder:'请选择时间'},
      ],
      /* 病案 */
      medical: [
        { title:'就诊时间', type:'date', required:true, disabled:false, id:'date', value:'', placeholder:'请选择时间'},
        { title:'主要诊断', type:'selectText', required:true, disabled:false, id:'mainDiagnosisCode',edit: false,iocn: true,idName:'mainDiagnosis', name:'', value:'', placeholder:'请选择或输入主要诊断',maxlength:'-1'},
        { title:'次要诊断', type:'selectText', required:false, disabled:false, id:'secondaryDiagnosisCode',edit: false,iocn: true, idName:'secondaryDiagnosis', name:'',value:'', placeholder:'请选择或输入次要诊断',maxlength:'-1'},
        { title:'是否抢救', type:'radio', required:false, disabled:false, id:'salvage', value: 0, option: [
            { key: 1, value: "是" },
            { key: 0, value: "否" },
        ],},
        { title:'就诊类型', type:'select', required:false, disabled:false, id:'visitTypeCode', value:'', placeholder:'请选择就诊类型',option: [
            {text: '首诊', value: 1},
            {text: '复诊', value: 2},
            {text: '入院', value: 3},
            {text: '出院', value: 4},
            {text: '手术', value: 5},
            {text: '影像', value: 6},
            {text: '化验', value: 7},
            {text: '体征', value: 8}
          ]},
        { title:'技能操作', type:'select', required:false, disabled:false,id:'skillCode',idName:'skill', value:'', placeholder:'请选择技能操作',option:[]}, 
        { title:'参与角色', type:'select', required:false, disabled:false, id:'joinRole', value: '',placeholder:'请选择参与角色', name:'',
          option: [
            {text: '术者', value: 1},
            {text: '一助', value: 2},
            {text: '二助', value: 3},
            {text: '三助', value: 4},
            {text: '观看', value: 5}
        ]},
        { title:'望闻问切', type:'textarea', required:false, disabled:false, id:'fourWaysDiagnosis', value:'', placeholder:'诊治最多可输入1000字',maxlength:'1000'},
        { title:'辅助检查', type:'textarea', required:false, disabled:false, id:'assistInspect', value:'', placeholder:'诊治最多可输入1000字',maxlength:'1000'},
        { title:'诊治内容', type:'textarea', required:false, disabled:false, id:'content', value:'', placeholder:'诊治最多可输入1000字',maxlength:'1000'},
        { title:'处方', type:'textarea', required:false, disabled:false, id:'prescription', value:'', placeholder:'诊治最多可输入1000字',maxlength:'1000'},
        { title:'医嘱', type:'textarea', required:false, disabled:false, id:'doctorAdvice', value:'', placeholder:'诊治最多可输入1000字',maxlength:'1000'},
      ],
      fileList: [ // 附件
        { field: "附件上传",type: "file", id: "filesVOs", value: [],required:false, disabled:false,  },
      ],
      skillObj: [  // 技能操作--门诊操作
        { title:'操作时间', type:'date', required:true, disabled:false, id:'date', value:'', placeholder:'请选择时间'},
        { title:'主要诊断', type:'selectText', required:true, disabled:false, id:'mainDiagnosisCode',edit: false,iocn: true,idName:'mainDiagnosis', name:'', value:'', placeholder:'请选择或输入主要诊断',option:[]},
        { title:'技能操作', type:'select', required:true, disabled:false, id:'skillCode',idName:'skill', value:'',placeholder:'请选择技能操作',selectShow: false,option:[]},  
        { title:'是否抢救', type:'radio', required:false, disabled:false, id:'salvage', value: 0, option: [
            { key: 1, value: "是" },
            { key: 0, value: "否" },
        ],}, 
      ],
      reportObj: [  // 技能操作--操作记录 -- 医技报告
        { title:'操作时间', type:'date', required:true, disabled:false, id:'date', value:'', placeholder:'请选择时间'},
        { title:'技能操作', type:'select', required:true, disabled:false,id:'skillCode',idName:'skill',  value:'', placeholder:'请选择技能操作',selectShow: false,option:[]},  
        { title:'是否抢救', type:'radio', required:false, disabled:false, id:'salvage', value: 0, option: [
            { key: 1, value: "是" },
            { key: 0, value: "否" },
        ],},
        
      ], 
      reportContent: [ //-- 医技报告
        { title:'检查内容', type:'textarea', required:false, disabled:false, id:'content', value:'', placeholder:'诊治最多可输入1000字',maxlength:'1000'},
      ],
      surgeryObj: [ //   手术
        { title:'角色', type:'radio', required:true, disabled:false, id:'operativeRole', value: 2, option: [
            { key: 1, value: "主刀" },
            { key: 2, value: "助手" },
        ],},
        { title:'手术时间', type:'date', required:true, disabled:false, id:'date', value:'', placeholder:'请选择时间'},
        { title:'主要诊断', type:'selectText', required:true, disabled:false, id:'mainDiagnosisCode',edit: false,iocn: true,idName:'mainDiagnosis', name:'',  value:'', placeholder:'请选择或输入主要诊断',option:[]},
        { title:'手术名称', type:'selectText', required:true, disabled:false, id:'skillCode',idName:'skill', edit: false,iocn: true, value:'', placeholder:'请选择手术名称',option:[]},
        { title:'是否抢救', type:'radio', required:false, disabled:false, id:'salvage', value: 0, option: [
            { key: 1, value: "是" },
            { key: 0, value: "否" },
        ],},
        { title:'参与角色', type:'select', required:false, disabled:false, id:'joinRole', value: '', placeholder:'请选择参与角色',name:'',
          option: [
            {text: '术者', value: 1},
            {text: '一助', value: 2},
            {text: '二助', value: 3},
            {text: '三助', value: 4},
            {text: '观看', value: 5}
        ],},       
      ],
      icon: {
        // 单选框
        normal: require("../../assets/images/home/pic_ses-01.svg"),
        active: require("../../assets/images/home/pic_ses-02.svg")
      },
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    onClickRight() { // 提交
     this.saveRegister();
    },
    init() {
      this.getMainDiagnosis();
      this.queryDiseaseByNormal();
      // this.title = this.$route.params.item.title;
      this.title = this.$store.state.paramsDepartmentName.title;
      if (this.$store.state.paramsDepartmentName.key == "disease") {
            this.listObj = this.diseaseLIst;
            this.listObj = [...this.listObj,...this.public,...this.outpatient,...this.publicContent,...this.fileList];
            this.type = this.diseaseLIst[0].value;
        }
        if (this.$store.state.paramsDepartmentName.key == "skill") {
            this.listObj = [...this.listObj,...this.skill,...this.public,...this.skillObj,...this.publicContent,...this.fileList];
            this.type = this.skill[0].value;
        }
        if (this.$store.state.paramsDepartmentName.key == "surgery") {
            this.listObj = [...this.listObj,...this.surgery,...this.public,...this.surgeryObj,...this.publicContent,...this.fileList];
            this.type = this.surgery[0].value;  
        }
    },
    getDataByName(patientName,visitNumber,public1){
      this.utils.ajax({
        url: this.api.fixCasePatientInfoByCodeName,
        method: "post",
        data: {
          patientName,
          visitNumber
        },
        success: res => {
          if(res){
            public1[1].value = res.patientName;
          }
        }
      })
    },
    /**
     * 数据回填
     */
    setItem(item) {
      let _this = this;
      let appt = [];
      let p_item = this.$route.params.item || item;
      if(p_item) {
         if(p_item.physicianType == 2){
          if(p_item.twoLevelType == 2) {
             p_item.twoLevelType = 23
          }
          if(p_item.twoLevelType == 6 || p_item.twoLevelType == 8 || p_item.twoLevelType == 10) {
             p_item.twoLevelType = 24
          } 
           this.type = p_item.twoLevelType;
           this.radioClick(p_item.physicianType, 'physicianType');
           this.listObj.forEach(item =>{
            if (item.id) {
              item.value = p_item[item.id];
              if(item.type == 'date'){
                item.value = this.utils.formatDate(item.value,"yyyy-MM-dd", false)
              }
            }
            if (item.idName) {
              item.name = p_item[item.idName];
            }
            
            if(item.id == 'skillCode') {
              item.option.forEach((e) =>{
                if(e.text == p_item.skill && p_item.skillCode) {
                    e.value = p_item.skillCode
                }
              })
            }
          });
         }else{
          if(p_item.twoLevelType == 2) {
             p_item.twoLevelType = 23
          }
          if(p_item.twoLevelType == 6 || p_item.twoLevelType == 8 || p_item.twoLevelType == 10) {
             p_item.twoLevelType = 24
          }
          this.type = p_item.twoLevelType;
          p_item.date = this.utils.formatDate(p_item.date,"yyyy-MM-dd", false);
          this.radioClick(p_item.salvage, 'salvage');
          this.listObj.forEach(item =>{
            if (item.id) {
              item.value = p_item[item.id];
            }
            if (item.idName) {
              item.name = p_item[item.idName];
            }
            
            if(item.id == 'skillCode') {
              item.option.forEach((e) =>{
                if(e.text == p_item.skill && p_item.skillCode) {
                    e.value = p_item.skillCode
                } 
              })
            }
          });
         }
         if(p_item.auditFlag == 1) {
          this.disabled = false;
          this.rightText = ''
          this.listObj.forEach(item =>{
            item.disabled = true;
          })
        }
      }
    },
    radioClick(value,id) {  // 不同类型出现不同list
       if(id == 'twoLevelType'){ // 病种类型切换
         this.type = value;
         this.listObj = [];
         this.outpatient[3].value = 0;
         this.skillObj[3].value = 0;
         this.surgeryObj[4].value = 0;
         /** 病种 */
         if(value == 3 || value == 4) {
           this.listObj = [...this.listObj,...this.diseaseLIst,...this.public,...this.outpatient,...this.publicContent,...this.fileList];
         }
         if(value == 23 || value == 1){
           this.listObj = [...this.listObj,...this.diseaseLIst,...this.physician,...this.manage,...this.public,...this.hospitalized,...this.publicContent,...this.fileList];
         }
         
         if(value == 22){
           this.listObj = [...this.listObj,...this.diseaseLIst,...this.public,...this.medical,...this.fileList];
         }
        /* 技能 */  
         if(value == 7) {
           this.listObj = [...this.listObj,...this.skill,...this.public,...this.skillObj,...this.publicContent,...this.fileList];
         }
         if(value == 5) {
           this.listObj = [...this.listObj,...this.skill,...this.public,...this.reportObj,...this.publicContent,...this.fileList];
         }
         if(value == 9) {
           this.listObj = [...this.listObj,...this.skill,...this.public,...this.reportObj,...this.reportContent,...this.fileList];
         }
         /* 手术 */
         if(value == 24 || value == 25 || value == 26) {
           this.listObj = [...this.listObj,...this.surgery,...this.public,...this.surgeryObj,...this.publicContent,...this.fileList];
         }
       }
       if(id == 'salvage') {
         // 是否请救
         this.listObj = []; 
         if(this.type == 3 || this.type == 4) { //病种 门诊 急诊
            if(value == 0) {
            this.listObj = [...this.listObj,...this.diseaseLIst,...this.public,...this.outpatient,...this.publicContent,...this.fileList]; 
            } 
            if(value == 1) {
            this.listObj = [...this.listObj,...this.diseaseLIst,...this.public,...this.outpatient,...this.publicContent,...this.publichelp,...this.fileList]; 
            }
         }
         if(this.type == 23 || this.type == 1) { // 住院
           if(value ==0) {
             this.listObj = [...this.listObj,...this.diseaseLIst,...this.physician,...this.manage,...this.public,...this.hospitalized,...this.publicContent,...this.fileList];
           }
           if(value ==1) {
             this.listObj = [...this.listObj,...this.diseaseLIst,...this.physician,...this.manage,...this.public,...this.hospitalized,...this.publicContent,...this.publichelp,...this.fileList];
           }
         }
         if(this.type == 22) { // 病案
           if(value ==0) {
             this.listObj = this.listObj = [...this.listObj,...this.diseaseLIst,...this.public,...this.medical,...this.fileList];
           }
           if(value ==1) {
             this.listObj = this.listObj = [...this.listObj,...this.diseaseLIst,...this.public,...this.medical,...this.publichelp,...this.fileList];
           }
         } 
         if(this.type == 7) { // 技能 门诊
           if(value ==0) {
             this.listObj = [...this.listObj,...this.skill,...this.public,...this.skillObj,...this.publicContent,...this.fileList];
           }
           if(value ==1) {
             this.listObj = [...this.listObj,...this.skill,...this.public,...this.skillObj,...this.publichelp,...this.publicContent,...this.fileList];
           }
         } 
         if(this.type == 5) { // 技能 操作记录 
           if(value ==0) {
             this.listObj = [...this.listObj,...this.skill,...this.public,...this.reportObj,...this.publicContent,...this.fileList];
           }
           if(value ==1) {
             this.listObj = [...this.listObj,...this.skill,...this.public,...this.reportObj,...this.publichelp,...this.publicContent,...this.fileList];
           }
         } 
         if(this.type == 9) { // 技能 医技报告
           if(value ==0) {
             this.listObj = [...this.listObj,...this.skill,...this.public,...this.reportObj,...this.reportContent,...this.fileList];
           }
           if(value ==1) {
            this.listObj = [...this.listObj,...this.skill,...this.public,...this.reportObj,...this.reportContent,...this.publichelp,...this.fileList];
           }
         } 
        
         if(this.type == 24 || this.type == 25 || this.type == 26) { // 手术
           if(value ==0) {
             this.listObj = [...this.listObj,...this.surgery,...this.public,...this.surgeryObj,...this.publicContent,...this.fileList];
           }
           if(value ==1) {
             this.listObj = [...this.listObj,...this.surgery,...this.public,...this.surgeryObj,...this.publichelp,...this.publicContent,...this.fileList];  
           }
         } 
       }
       if(id == 'physicianType'){ // 医师类型
          this.listObj = [];
          if(this.type == 23 || this.type == 1) {
            if(value ==2) {
              this.listObj = [...this.listObj,...this.diseaseLIst,...this.physician,...this.manageTitme,...this.public,...this.hospitalized,...this.publicContent,...this.fileList];
            }
            if(value ==1) {
              this.listObj = [...this.listObj,...this.diseaseLIst,...this.physician,...this.manage,...this.public,...this.hospitalized,...this.publicContent,...this.fileList];
            }
          }
       }
    },
    show(item,status) {
      console.log(item,'asa');
      if(item.type == 'selectText' && item.edit == true) {
         this.moduleData.selectShow = status;
         this.moduleData.data = item;
         return
      }
      if(item.type == 'select') {
         this.moduleData.selectShow = status;
         this.moduleData.data = item;
         return
      }
      if(item == ''){
        this.moduleData.selectShow = status;
        this.moduleData.data = item;
      }
    },
    selectMajorConfirm(val, i) {
      this.moduleData.selectShow = false;
      this.moduleData.data.value = val.value;
      this.moduleData.data.name = val.text;
    },
    dateConfirm(val){
      this.moduleData1.data.value = this.utils.formatDate(val,"yyyy-MM-dd", true);
      this.cancel1('',false);
    },

    cancel1(item,status) {
      console.log(item,'564564564');
      this.moduleData1.dateShow = status;
      this.moduleData1.data = item;
    },
    isImg(str) {
      if (/.jpg/.test(str) || /.JPG/.test(str) || /.jpeg/.test(str) || /.JPEG/.test(str) || /.png/.test(str) || /.gif/.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    edit_ipt(i) {
      i.edit = !i.edit;
      i.value = '';
    },
    onRead(file) {
      let _this = this;  
      let flag = true;
    //   let content = this.utils.encryptByEnMd5(file.content);
    //   if(content && this.isHasFile.hasOwnProperty(content)) {
    //     this.Toast("该文件已存在，请选择其他文件");
    //     return;
    //   }else{
        _this.utils.fileUploader(file, data => {
            // _this.isHasFile[content] = data.url;
            _this.listObj[_this.listObj.length - 1].value.push({ path: data.url,ETag: data.ETag, name: data.name})
        });
    //   }
    }, 
    show_file(e, url, index) {
      e.stopImmediatePropagation();
      this.shwoFile.flag = true;
      this.shwoFile.url = url;
      this.shwoFile.index = index;
    },
    delFile() {
      this.listObj[this.listObj.length - 1].value.splice(this.shwoFile.index, 1);
    },
    saveRegister(){
     let flag = true; 
     let url = this.api.saveRegister;
     let tost = '保存成功'
     let obj = {
       departmentCaId: this.$store.state.scheduling.departmentId,
       departmentName: this.$store.state.scheduling.departmentName,
       startDate: this.$store.state.scheduling.startTime,
       endDate: this.$store.state.scheduling.endTime,
       multistandardId:this.$store.state.scheduling.multistandardId,
       version:this.$store.state.scheduling.version,
       schedulingId:this.$store.state.scheduling.id,
       normalDepartmentId: this.$store.state.scheduling.normalDepartmentId,
       oneLevelType: ''
     };
     if(this.$route.params.item){
       obj.id = this.$route.params.item.id;
       url = this.api.saveModifyEnrollment;
       tost = '修改成功'
     }
     if( this.$store.state.paramsDepartmentName.key == 'disease') {
        obj.oneLevelType = 1
     }
     if( this.$store.state.paramsDepartmentName.key == 'skill') {
        obj.oneLevelType = 2
     }
     if( this.$store.state.paramsDepartmentName.key == 'surgery') {
        obj.oneLevelType = 4
     }
     if( this.$store.state.paramsDepartmentName.key == 'other') {
        obj.oneLevelType = 3
     }
     this.listObj.forEach((item) =>{
       
       if(item.type == 'selectText'){
         if(item.required == true && item.name === ''){
           this.Toast('请选择或请输入' + item.title);
           flag = false;
         }
         obj[item.id] = item.value;
         if(item.idName){
            obj[item.idName] = item.name;
         }
       }
       if(item.type != 'selectText'){
         if(item.required == true && item.value === ''){
           if(item.type == 'text'){
             this.Toast('请输入' + item.title);
             flag = false;
           }
           if(item.type == 'date' || item.type == 'select'){
             this.Toast('请选择' + item.title);
             flag = false;
           }
         }else{
           if(item.type == 'select' && item.idName){
                obj[item.idName] = item.name;
           }
           obj[item.id] = item.value;
         }
       }
     })
     if(flag){
       this.utils.ajax({
        url: url,
        method: "post",
        data: obj,
        success: res => {
          this.Toast(tost);
          this.utils.goBack(this);
        }
      });
       
     }
   },
   getTouchStart(e,url,index){
    //    this.shwoFile.url = url;
    //    this.shwoFile.index = index;
       clearTimeout(this.eventLoop);
	   this.eventLoop = setTimeout(()=>{
           this.Dialog.confirm({
            title: "提示",
            message: "是否删除附件",
            }).then(() => {
                this.delFile()
            });
	   },1000);
   },
   getTouchEnd() {
       clearTimeout(this.eventLoop);
   },
    getMainDiagnosis() {  // 技能操作
       let arr = [];
       let oneLevelType = '';
       if(this.$store.state.paramsDepartmentName.key == 'surgery' ) {
         oneLevelType = 4
       }
       if(this.$store.state.paramsDepartmentName.key == 'skill' ) {
         oneLevelType = 2
       }
       if(this.$store.state.paramsDepartmentName.key == 'disease' ) {
         oneLevelType = 2
       }
       this.utils.ajax({
        url: this.api.querySurgeryByNormalDepartmentId,
        method: "post",
        data: {
          normalDepartmentId: this.$store.state.scheduling.normalDepartmentId,
          oneLevelType: oneLevelType,
          version:this.$store.state.scheduling.version,
          multistandardId:this.$store.state.scheduling.multistandardId,
        },
        success: (res) => {
          res.forEach(item => {
            arr.push({
              text: item.nameOfSurgery,
              value: item.instituteSurgeryId,
            })
          })
              console.log(arr,'4566546546');
              
           this.outpatient[5].option = arr;
           this.hospitalized[9].option = arr;
           this.medical[5].option = arr;
           this.skillObj[2].option = arr;          
           this.reportObj[1].option = arr;
           this.surgeryObj[3].option = arr;

            
           this.setItem();
        }
      })
    }, 
    queryDiseaseByNormal() {  // 主要诊断 次要诊断
       let arr = [];
       this.utils.ajax({
        url: this.api.queryDiseaseByNormal,
        method: "post",
        data: {
          normalDepartmentId: this.$store.state.scheduling.normalDepartmentId,
          version: this.$store.state.scheduling.version,
          multistandardId : this.$store.state.scheduling.multistandardId
        },
        success: (res) => {
          res.forEach(item => {
            arr.push({
              text: item.nameOfDisease,
              value: item.instituteDiseaseId
            })
          })
          console.log(arr,'45645');
          
           this.outpatient[1].option = arr;
           this.outpatient[2].option = arr;
           this.hospitalized[4].option = arr;
           this.hospitalized[5].option = arr;
           this.medical[1].option = arr;
           this.medical[2].option = arr;
           this.skillObj[1].option = arr;
           this.surgeryObj [2].option = arr;
           this.setItem();
        }
      })
    }, 

  },


  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.init();
  }
};
</script>
<style  scoped>
.content {
  background: white;
}
.content ul {
  display: flex;
  justify-content: space-between;
}
.padding {
  padding: 0.8rem 0.5rem;
}
.botomo {
  width: 100%;
  border-bottom: 1px solid #ccc;
}
.radioname{
    display: flex;
    flex-wrap: wrap;
}
.dadioimg {
  width: 1.125rem;
  height: 1.125rem;
}
.radioStyle{
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.radiovan{
   padding: 0 0.3rem;
}
textarea{
    border: 1px solid #ccc !important;
    width: 100%;
}
.lable {
    display: block;
    padding: 0.5rem 1rem;
  }
.file_box {
    padding: 0.5rem 1rem;
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
}
.file_box>div {
    display: inline-block;

}
.dailogImg{
    max-height: 35rem;
}
.layout_content {
    background: #fff;
    padding-bottom: 100px;
}
.fileList{
    width: 3rem;
    /* height: 3rem; */
    position: relative;
    margin-right: 0.573rem;
    margin-bottom: 0.5rem;
}
.fileList img {
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
} 
.boxfile {
    font-size: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #7a7a7a;
}  
.uploadFile {
    position: relative;
    font-size: 3rem;
    border-radius: 0.5rem;
    border: 0.04rem solid #e1e1e1;
    width: 3rem;
    height: 3rem;
}  
.fileImg {
    font-size: 10rem;
    padding: 2rem;
    display: flex;
    justify-content: center;
  }
 .title-file {
    text-align: center;
    color: #5a595b;
    margin-bottom: 0.5rem;
  } 
 .botomo >>> .van-cell .van-cell__value{
   width: 49%;
   overflow: hidden;
   text-overflow:ellipsis;
   white-space: nowrap;
 }
 .ulStyle li{
   width: 49%;
   overflow: hidden;
   text-overflow:ellipsis;
   white-space: nowrap;
 }
  .edit_icon {
    font-size: 1.3rem;
    color: #0079fc;
    position: absolute;
    right: 0.9rem;
    top: 0.2rem;
    /* width: 3rem; */
    height: 2.7rem;
    line-height: 2.7rem;
    text-align: right;
    font-size: 1rem;
  }
  .seleText{
    position: relative;
  }
 .seleText .van-cell {
   width: 95% !important;
 }
</style>