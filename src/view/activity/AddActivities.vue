<template>
  <div>
    <van-nav-bar title="添加活动" class="header" fixed left-arrow @click-left="onClickLeft()" />
    <div class="layout_content">
      <div class="bottomBox">
        <van-cell
          title="活动类别"
          is-link
          required
          :value="utils.getValueByKey($store.state.activitiesType, activity.type)"
          @click="flag && changeShowStatus('showType',true)"
        />
        <van-cell
          title="活动级别"
          is-link
          required
          :value="utils.getValueByKey($store.state.activitiesRank, activity.Rank)"
          @click="flag && changeShowStatus('showRank',true)"
        />
        <van-cell
          title="归属科室"
          is-link
          required
          :value="utils.getValueByvalue(partOfDepartmentOpt, activity.partOfDepartmentId) || '请选择'"
          @click="flag && changeShowStatus('showpartOfDepartment',true)"
        />
        <van-cell
          v-if="activity.Rank==2"
          title="专业基地"
          is-link
          :value="activity.professional ? activity.professional:'请选择'"
          @click="flag && changeShowStatus('showSpecialty',true)"
          class="headerBox"
        />
        <div class="readonly">
          <!-- <span style="color:red;" v-if="asterisk" class="span">*</span> -->
          <van-field
            v-model="activity.title"
            type="text"
            label="活动标题"
            required
            placeholder="请填写"
            input-align="right"
            :readonly="!flag"
          />
        </div>
        <van-cell
          title="登记手册"
          is-link
          :value="activity.isJoinEnrollment ? activity.isJoinEnrollment:'请选择'"
          @click="flag && changeShowStatus('register',true)"
          class="headerBox"
        />
        <van-cell
          title="选择标准"
          is-link
          v-if="isSelectShow"
          :value="activity.joinEnrollmentStandard?activity.joinEnrollmentStandard:'请选择'"
          @click="flag && changeShowStatus('standard',true)"
          class="headerBox"
        />
        <van-cell
          title="选择专业"
          is-link
          v-if="isSelectShow"
          :value="activity.joinEnrollmentSubjectCodeName ? activity.joinEnrollmentSubjectCodeName : '请选择'"
          @click="flag && changeShowStatus('majors',true)"
          class="headerBox"
        />
        <van-cell
          title="选择标准科室"
          is-link
          v-if="isSelectShow"
          :value="activity.joinEnrollmentNormalDepartment ? activity.joinEnrollmentNormalDepartment:'请选择'"
          @click="flag && changeShowStatus('normalDepartment',true)"
          class="headerBox"
        />  
        <van-cell
          title="选择病种技能"
          is-link
          v-if="isSelectShow"
          :value="activity.joinEnrollmentCode ? activity.joinEnrollmentCode:'请选择'"
          @click="flag && changeShowStatus('bjEnrollment',true)"
          class="headerBox"
        /> 
        <div class="readonly">
          <!-- <span style="color:red;" v-if="asterisk" class="span">*</span> -->
          <div class="acceptStyle van-cell ">
            <div style="width:30%" class="required">
                <span style="color:#323233">主&nbsp;讲&nbsp;人</span> 
            </div>
            <div style="width:40%">
              <van-radio-group v-model="activity.isExtramural" class="radioname">
              <div v-for="(item,index) in $store.state.extramural" :key="index">
                <van-radio :name="item.key" :disabled="!flag">
                  <img
                    slot="icon"
                    slot-scope="props"
                    :src="props.checked ? icon.active : icon.normal"
                    class="dadioimg"
                  />
                  <span style="display:block">{{item.value}}</span>
                </van-radio>
              </div>
            </van-radio-group>
            </div>
            <div style="width:30%;">  <input style="border:none;text-align:right;width:5rem;float:right;color:#323233" type="text" placeholder="请填写" v-model="activity.speaker"></div>
          </div>
        </div>
        <div class="readonly">
          <!-- <span style="color:red;" v-if="asterisk" class="span">*</span> -->
          <van-field
            v-model="activity.mobile"
            type="number"
            label="手机号码"
            required
            placeholder="请填写"
            input-align="right"
            :readonly="!flag"
          />
        </div>

        <div class="readonly">
          <!-- <span style="color:red;" v-if="asterisk" class="span">*</span> -->
          <van-field
            v-model="activity.bankCardNum"
            type="number"
            label="银行卡"
            placeholder="请填写"
            input-align="right"
            :readonly="!flag"
          />
        </div>
        <van-cell
          title="是否报名"
          is-link
          :value="utils.getValueByKey($store.state.singUp, activity.signUp)"
          @click="flag && changeShowStatus('signUpshow',true)"
          class="headerBox"
         />
        <van-cell
          title="需要评价"
          is-link
          :value="utils.getValueByKey($store.state.singUp, activity.isNeedEvaluate)"
          @click="flag && changeShowStatus('isNeedEShow',true)"
          class="headerBox"
          />
        <van-cell
          v-if="activity.isNeedEvaluate == 1"
          title="使用评价表"
          is-link
          :value="utils.getValueByKey(evaluateForm1, activity.evaluateId)"
          @click="flag && changeShowStatus('evaluateShow',true)"
          class="headerBox"
          />
        
        <van-cell
          v-if="activity.isNeedEvaluate == 1"
          title="是否必须评价"
          is-link
          :value="utils.getValueByKey($store.state.singUp, activity.isMustEvaluate)"
          @click="flag && changeShowStatus('Evaluate',true)"
          class="headerBox"
        />
       <p style="margin: 0; padding: 0 0.7rem;" v-if="activity.isNeedEvaluate == 1">(不强制要求学员评价)  (必须评价后才能正常签退)</p>
        <div>
          <van-cell title="课件" size="large" />
          <div class="file_box van-cell" v-if="echo">
            <div v-for="(file, index) in activity.modeData.value" :key="index" @click="show_file($event, file.path, index)">
              <div  class="fileList" v-if="file.type==1">
                <img :src="file.path" v-if="isImg(file.path)">
                <div v-if="!isImg(file.path)" class="boxfile">
                  <van-icon name="description" size="3rem" color="#e1e1e1" />
                </div>
              </div>
            </div>
            <div class="uploadFile">
              <van-uploader :after-read="onRead" accept multiple>
                <van-icon name="plus" color="#e1e1e1" />
              </van-uploader>
            </div>
          </div>
          <div class="file_box van-cell" v-if="!echo">
            <div v-for="(file, index) in activity.modeData.value" :key="index" @click="show_fileLinst($event, file.path, index)">
              
              <div  class="fileList"  v-if="file.type==1">
                <img :src="file.path" v-if="isImgLinst(file.path)">
                <div v-if="!isImgLinst(file.path)" class="boxfile">
                  <van-icon name="description" size="3rem" color="#e1e1e1" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
        <van-cell title="教案" size="large" />
          <div class="file_box van-cell" v-if="echo">
            <div v-for="(file, index) in activity.modeData.value" :key="index" @click="show_file($event, file.path, index)">
              <div  class="fileList" v-if="file.type==2">
                <img :src="file.path" v-if="isImg(file.path)">
                <div v-if="!isImg(file.path)" class="boxfile">
                  <van-icon name="description" size="3rem" color="#e1e1e1" />
                </div>
              </div>
            </div>
            <div class="uploadFile">
              <van-uploader :after-read="onRead1" accept multiple>
                <van-icon name="plus" color="#e1e1e1" />
              </van-uploader>
            </div>
          </div>
          <div class="file_box van-cell" v-if="!echo">
            <div v-for="(file, index) in activity.modeData.value" :key="index" @click="show_fileLinst($event, file.path, index)">
              
              <div  class="fileList" v-if="file.type==2">
                <img :src="file.path" v-if="isImgLinst(file.path)">
                <div v-if="!isImgLinst(file.path)" class="boxfile">
                  <van-icon name="description" size="3rem" color="#e1e1e1" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="readonly" v-if="activity.signUp==1">
          <van-field
            v-model="activity.numOfLimit"
            type="number"
            label="人数限制"
            placeholder="请填写(默认无限制)"
            input-align="right"
            :readonly="!flag"
          />
        </div>
        <div class="readonly">
          <van-cell
            class="top"
            title="开始时间"
            is-link
            required
            :value="activity.startTime"
            @click="flag && changeShowStatus('showStartTime', true)"
          />
        </div>
        <div class="readonly">
          <van-cell
            title="结束时间"
            is-link
            required
            :value="activity.endTime"
            @click="flag && changeShowStatus('showEndTime', true)"
          />
        </div>
        <!-- <van-field
          v-model="activity.classHour"
          type="text"
          label="活动时长"
          readonly
          input-align="right"
        /> -->


       <div class="readonly classHourStyle" >
          <van-field
            v-model="activity.classHour"
            type="number"
            label="活动时长(小时)"
            required
            placeholder="请填写(小时)"
            input-align="right"
            :readonly="!flag"
          />
          <!-- <span v-if="activity.classHour" style="white-space: nowrap;">()</span> -->
        </div>



        <div class="readonly">
          <van-field
            v-model="activity.classRoomName"
            label="活动地点"
            required
            placeholder="请填写"
            input-align="right"
            :readonly="!flag"
          />
        </div>
        <div class="readonly">
          <!-- <span style="color:red;" v-if="asterisk" class="span">*</span> -->
          <div class="acceptStyle-box van-cell">
            <div class="required">
                <span style="color:#323233">接收人(<span style="color:gray">共{{recipients?recipients:0}}人</span>) </span> 
            </div>
            <div><span style="color:#00b0f0" @click="Receive()"> {{compile}}</span></div>
          </div>
        </div>
        <van-field
          v-if="activity.type == 2 || activity.type == 3"
          v-model="activity.specialName"
          type="text"
          label="患者姓名"
          placeholder="输入患者姓名"
          input-align="right"
          :readonly="!flag"
        />
        <van-field
          v-if="activity.type == 2 || activity.type == 3"
          v-model="activity.specialPatientId"
          type="text"
          label="患者ID"
          placeholder="输入患者ID"
          input-align="right"
          :readonly="!flag"
        />
        <div class="van-cell">
            <span>活动详情</span>
        </div>
        <div>
          <div class="abstract">
            <van-field
              v-if="textareaShow"
              v-model="detail.activity"
              type="textarea"
              rows="8"
              style="border-bottom:1px solid #f2f2f2"
              :placeholder="placeholder"
              :readonly="!flag"
            />
            <p
              class="textareaaP"
              v-html="detail.activity"
              @click="asfss && textaClick()"
              v-if="!textareaShow"
            ></p>
          </div>
        </div>
        <div class="placeholders"></div>
        <div style="height:6rem"></div>
      </div>
      <div v-show="nameActy" class="save" @click="conserve()">保存</div>

      <!-- 活动类型 -->
      <van-popup v-model="showType" position="bottom" :overlay="true">
        <van-picker
          show-toolbar
          title="活动类别"
          :columns="typeColumns"
          :default-index="typeDefaultIndex || 0"
          @confirm="confirmType"
          @cancel="flag && changeShowStatus('showType',false)"
        />
      </van-popup>
      <!-- 活动级别 -->
      <van-popup v-model="showRank" position="bottom" :overlay="true">
        <van-picker
          show-toolbar
          title="活动级别"
          :columns="RankColumns"
          :default-index="typeDefaultIndex || 0"
          @confirm="confirmRank"
          @cancel="flag && changeShowStatus('showRank',false)"
        />
      </van-popup>
      <!-- 登记手册 -->  
      <van-popup v-model="register" position="bottom" :overlay="true">
        <van-picker
          show-toolbar
          title="登记手册"
          :columns="RegisterColumns"
          :default-index="typeDefaultIndex || 0"
          @confirm="confirmRegister"
          @cancel="flag && changeShowStatus('register',false)"
        />
      </van-popup>
      <!-- 选择标准 -->  
      <van-popup v-model="standard" position="bottom" :overlay="true">
        <van-picker
          show-toolbar
          title="选择标准"
          :columns="StandardColumns"
          :default-index="typeDefaultIndex || 0"
          @confirm="confirmStandard"
          @cancel="flag && changeShowStatus('standard',false)"
        />
      </van-popup>
       <!-- 专业 -->  
      <van-popup v-model="majors" position="bottom" :overlay="true">
        <van-picker
          show-toolbar
          title="选择专业"
          value-key="value"
          :columns="$store.state.majors"
          :default-index="typeDefaultIndex || 0"
          @confirm="confirmMajors"
          @cancel="flag && changeShowStatus('majors',false)"
        />
      </van-popup>
       <!-- 选择标准科室 -->  
      <van-popup v-model="normalDepartment" position="bottom" :overlay="true">
        <van-picker
          show-toolbar
          title="选择标准科室"
          :columns="normalColumns"
          :default-index="typeDefaultIndex || 0"
          @confirm="confirmNormal"
          @cancel="flag && changeShowStatus('normalDepartment',false)"
        />
      </van-popup>
      <!-- 病种技能手术 -->  
      <van-popup v-model="bjEnrollment" position="bottom" :overlay="true">
        <van-picker
          show-toolbar
          title=""
          :columns="bjEnrollmentColumns"
          :default-index="typeDefaultIndex || 0"
          @confirm="confirmEnrollment"
          @cancel="flag && changeShowStatus('bjEnrollment',false)"
        />
      </van-popup>
      <!-- 是否报名 -->
      <van-popup v-model="signUpshow" position="bottom" :overlay="true">
        <van-picker
          show-toolbar
          title="是否报名"
          :columns="signUpColumns"
          :default-index="typeDefaultIndex || 0"
          @confirm="confirmsignUp"
          @cancel="flag && changeShowStatus('signUpshow',false)"
        />
      </van-popup>
    <!-- 是否需要评价 -->
      <van-popup v-model="isNeedEShow" position="bottom" :overlay="true">
        <van-picker
          show-toolbar
          title="是否需要评价"
          :columns="signUpColumns"
          :default-index="typeDefaultIndex || 0"
          @confirm="confirmNeed"
          @cancel="flag && changeShowStatus('isNeedEShow',false)"
        />
      </van-popup>
      <!-- 使用评价表 -->
      <van-popup v-model="evaluateShow" position="bottom" :overlay="true">
        <van-picker
          show-toolbar
          title="使用评价表"
          :columns="evaluateForm"
          :default-index="typeDefaultIndex || 0"
          @confirm="confirmEvaluate"
          @cancel="flag && changeShowStatus('evaluateShow',false)"
        />
      </van-popup>
      <van-popup v-model="Evaluate" position="bottom" :overlay="true">
        <van-picker
          show-toolbar
          title="是否必须评价"
          :columns="signUpColumns"
          :default-index="typeDefaultIndex || 0"
          @confirm="confirmEvaluat"
          @cancel="flag && changeShowStatus('Evaluate',false)"
        />
      </van-popup>
      <van-popup v-model="isLimitshow" position="bottom" :overlay="true">
        <van-picker
          show-toolbar
          title="是否有人数限制"
          :columns="isLimitColumns"
          :default-index="typeDefaultIndex || 0"
          @confirm="confirmisLimit"
          @cancel="flag && changeShowStatus('signUpshow',false)"
        />
      </van-popup>

      <!-- 归属科室 -->
      <van-popup v-model="showpartOfDepartment" position="bottom" :overlay="true">
        <van-picker
          show-toolbar
          title="选择归属科室"
          :columns="partOfDepartmentOpt"
          :default-index="typeDefaultIndex || 0"
          @confirm="confirmDepartment"
          @cancel="flag && changeShowStatus('showpartOfDepartment',false)"
        />
      </van-popup>

      <!-- 专业基地 -->
      <van-dialog
        v-model="showSpecialty"
        title="专业基地"
        @confirm="confirmSpecialty"
        show-cancel-button
        >
        <div class="majorin">
          <van-checkbox-group v-model="activity.majorsObj">
            <div
              v-for="(item,index) in majorsCheckName"
              :key="index"
              @click="flag && specialty(item,index)"
            >
              <van-cell :title="item" clickable>
                <van-checkbox :name="item" :disabled="!flag" ref="specialty">
                  <img
                    slot="icon"
                    slot-scope="props"
                    :src="props.checked ? icon2.active : icon2.normal"
                    class="dadioimg"
                  />
                </van-checkbox>
              </van-cell>
            </div>
          </van-checkbox-group>
        </div>
      </van-dialog>
      <!-- 开始时间 -->
      <van-popup v-model="showStartTime" position="bottom" :overlay="true">
        <van-datetime-picker
          v-model="currentDate"
          type="datetime"
          :formatter="formatter"
          @confirm="confirmTime"
          @cancel="flag && changeShowStatus('showStartTime', false)"
        />
      </van-popup>
      <!-- 教案 -->
      <van-dialog v-model="shwoFile.flag" show-cancel-button cancel-button-text="删除" @cancel="delFile()" confirm-button-text="关闭">
        <div v-if="isImg(shwoFile.url)" style="max-height:35rem">
          <img v-if="isImg(shwoFile.url)" :src="shwoFile.url" width="100%" style="height:100%;">
        </div>
        <div class="fileImg" v-if="!isImg(shwoFile.url)">
          <van-icon name="description" />
        </div>
        <div class="title-file" v-if="!isImg(shwoFile.url)">该文件类型暂不支持查看</div>
      </van-dialog>
      <!-- 结束时间 -->
      <van-popup v-model="showEndTime" position="bottom" :overlay="true">
        <van-datetime-picker
          v-model="currentDate"
          type="datetime"
          :formatter="formatter"
          @confirm="confirmTimet"
          @cancel="flag && changeShowStatus('showEndTime', false)"
        />
      </van-popup>
      <van-dialog v-model="texshow" show-cancel-button title="提示" @confirm="confirmText">
        <p class="titleClassp">请通过电脑端编辑内容，如果直接编辑将丢弃文本格式。是否继续？</p>
      </van-dialog>
    </div>
  </div>
</template>

<script>
import DepartmentName from "@/view/activity/DepartmentName";
export default {
  components: {
    DepartmentName: DepartmentName
  },
  name: "AddActivities",
  data() {
    return {
      showType: false, // 活动类型弹层
      showTraining: false, // 培训参与技能计算弹层
      isHasFile:{},
      isHasFile1:{},
      showEntity: false, // 培训参与病种计算弹层
      showRank: false, // 活动级别弹层
      showSignUp: false, // 是否报名弹层
      showStartTime: false, // 开始时间弹层
      showEndTime: false, // 结束时间弹层
      showDepartment: false, //科室名称弹层
      register:false,//登记手册弹层
      standard:false, //选择标准
      majors:false,//专业
      normalDepartment: false ,// 标准科室
      bjEnrollment:false,
      params:{},
      signUpColumns: [], // 是否报名
      isLimitColumns: [],
      typeColumns: [], // 活动类型
      RankColumns: [], // 活动级别
      majorsCheckName: [], // 专业基地
      SpecialtyColumns: [],
      TrainingColumns: [], //培训 -- 参与技能计算
      confirmEntity: [], // 培训 --参与病种计算
      RegisterColumns:[],
      StandardColumns:[],//标准
      normalColumns : [], // 标准科室
      partOfDepartmentOpt:[],//归属科室
      bjEnrollmentColumns:[], 
      isSelectShow:false,//是否选择标准及标准科室
      typeDefaultIndex: 0,
      currentDate: new Date(),
      placeholder: "请输入活动摘要信息,选填项",
      placeholderr: "请输入活动详情信息",
      disable: true,
      TrainingTitle: "",
      majorsObj: "",
      flag: true,
      flage: true,
      showSpecialty: false,
      showpartOfDepartment:false,//归属科室
      isLimitshow: false,
      compile: "点击编辑",
      shwoFile: {
        flag: false,
        url: "",
        flagLin: false
      },
      shwoFiletea: {
        flag: false,
        url: ""
      },
      activity: {
        id: "",
        type: 1, // 活动类别
        Rank: 1, // 活动级别
        professional: "", // 专业基地
        signUp: 0, // 是否报名
        Training: 0, // 培训
        title: "", // 活动标题
        isExtramural: 0, //主讲人类型：院内-0、院外-1
        speaker: "", //主讲人姓名
        mobile: "", //讲人手机号
        startTime: "请选择", // 开始时间
        endTime: "请选择", // 结束时间
        detail: "", // 活动详情
        classHour: "",
        classHour: "",
        classRoomName: "", // 活动地点
        object_y: "",
        TrainingActivity: "",
        Entity: "",
        specialName: "",
        specialPatientId: "",
        bankCardNum: "",
        isSignUp: "",
        restriction: 1,
        numOfLimit: "",
        majorsObj: [],
        isNeedEvaluate: '',
        evaluateId:'',
        isMustEvaluate:0,
        modeData: {
          id: "filesVOs",
          value: []
      },
      },
      recipients: "",
      detail: {
        placeholder: "请输入活动详情信息",
        activity: ""
      },
      departmentCaId: "",
      icon: {
        // 单选框
        normal: require("../../assets/images/home/pic_ses-01.svg"),
        active: require("../../assets/images/home/pic_ses-02.svg")
      },
      icon2: {
        // 复选框
        normal: require("../../assets/images/home/pic_cks-01.svg"),
        active: require("../../assets/images/home/pic_cks-02.svg")
      },
      startTimee: "",
      endTimee: "",
      boardData: {
        id: [],
        name: []
      },
      receivingnum: "",
      receiverType: "请选择",
      nameActy: true,
      bjog: "",
      asterisk: true,
      Technical: [], // 参与病种计算
      stateEntity: [], // 参与技能计算
      Notechical: true,
      NoEntity: true,
      computer: [],
      selectIndex: 0,
      scrollText: [],
      scrollEntity: [],
      textareaShow: true,
      texshow: false,
      asfss: true,
      signUpshow: false,
      linstObjID: [],
      isNeedEShow: false,
      evaluateShow: false,
      evaluateForm: [],
      evaluateForm1:[],
      estimate: false,
      Evaluate: false,
      echo: true,
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
      // this.$store.state.activityAdd = "";
      this.$store.state.ActiveLook = "";
      // 清空接收对象
      this.$store.state.depar = "";
      this.$store.state.acceptObject = "";
      this.$store.state.TrainingName = "";
      this.$store.state.traineeYearType = "";
      this.$store.state.receiverType = "";
      this.$store.state.receiverCodesId = "";
      this.$store.state.paramsTeachingId = "";
      this.$store.state.Csoes = "";
      this.$store.state.keepEcho = "";
      this.$store.state.objectArry = "";
      this.$store.state.linstObjArr = "";
      this.$store.state.recipients = "";
    },
     //归属科室
    queryDepartmentsByRole() {
        this.utils.ajax({
          url: this.api.queryDepartmentsByRole,
          data: {},
          method: "POST",
          success: data => {
            this.partOfDepartmentOpt = data.map(department =>{
                return {
                    value: department.caId,
                    text: department.name
                }
            });
            console.log(this.partOfDepartmentOpt);
          }
        });
    },
    init() {
      //活动类别选项
      this.$store.state.activitiesType.forEach(item => {
        this.typeColumns.push({
          text: item.value,
          value: item.key
        });
      });
      // 专业基地
      this.$store.state.majors.forEach(i => {
        this.majorsCheckName.push(i.value);
      });
      this.$store.state.activitiesRank.forEach(item => {
        this.RankColumns.push({
          text: item.value,
          value: item.key
        });
      });
      //登记手册
       this.$store.state.Training.forEach(item => {
        this.RegisterColumns.push({
          text: item.value,
          value: item.key
        });
      });
      // 是否报名
      this.$store.state.singUp.forEach(item => {
        this.signUpColumns.push({
          text: item.value,
          value: item.key
        });
      });
      this.$store.state.isLimit.forEach(item => {
        this.isLimitColumns.push({
          text: item.value,
          value: item.key
        });
      });
      //归属科室
      this.queryDepartmentsByRole();
      // this.$store.state.Technical.forEach(item => {
      //   this.TrainingColumns.push({
      //     text: item.value,
      //     value: item.key
      //   });
      // });
      this.utils.ajax(
        {
          // 参与病种计算
          url: this.api.findDisease,
          method: "POST",
          success: data => {
            if (data.length < 1) {
              this.Notechical = false;
            } else {
              data.forEach(item => {
                this.Technical.push({
                  key: item.id,
                  value: item.nameOfDisease
                });
              });
              this.Technical.forEach(item => {
                this.TrainingColumns.push({
                  text: item.value,
                  value: item.key
                });
              });
              this.scrollText.value = this.Technical[0].key;
            }
          }
        },
        200
      );
      this.utils.ajax(
        {
          // 参与技能计算
          url: this.api.findSurgery,
          method: "POST",
          success: data => {
            // this.Technical = data;
            if (data.length < 1) {
              this.NoEntity = false;
            } else {
              data.forEach(item => {
                this.stateEntity.push({
                  key: item.id,
                  value: item.nameOfSurgery
                });
              });
              this.stateEntity.forEach(item => {
                this.confirmEntity.push({
                  text: item.value,
                  value: item.key
                });
              });
              this.scrollEntity.value = this.stateEntity[0].key;
            }
          }
        },
        200
      );
      this.utils.ajax(
        {
          url: this.api.selectList,
          data:{
            currentPage:1,
            pageSize:5000
          },
          method: "POST",
          success: data => {
            if(data.content.length > 0 ){
              data.content.forEach(item => {
              this.evaluateForm1.push({
                value:item.title,
                key:item.id
              })
              });
              this.evaluateForm1.forEach(item => {
                this.evaluateForm.push({
                  text: item.value,
                  value: item.key
                })
              });
              this.activity.evaluateId = this.evaluateForm1[0].key;
            }
          }
        },
        0
      );
    },
    /**
     * 获取标准
     */
    getStandard(){
      this.utils.ajax(
        {
          url: this.api.multistandard,
          data:{  },
          method: "POST",
          success: data => {
            if(data && data.length > 0){
              data.forEach((item,index)=>{
                this.StandardColumns.push({
                  text:item.name,
                  id:item.id,
                  value:item.id,
                });
            });
            if(this.$store.state.Csoes == "edit" && this.params.isJoinEnrollment == 1){
               this.getNormalDepartment(this.params.joinEnrollmentStandard,this.activity.joinEnrollmentSubjectCode);
            } 
            }
          }
        },
        0
      );
    },
    /**
     * 获取标准科室
     */
    getNormalDepartment(multiStandardId,subjectCode){
      this.normalColumns = [];
      if(!multiStandardId  || !subjectCode){
        return;
      }
      this.utils.ajax(
        {
          url: this.api.normalDepartment,
          data:{
            multiStandardId:multiStandardId,
            subjectCode,
          },
          method: "POST",
          success: data => {
            if(data && data.length > 0){
              data.forEach((item,index)=>{
                this.normalColumns.push({
                  text:item.name,
                  id:item.normalDepartmentId,
                  value:item.normalDepartmentId,
                });
              });
              if(this.$store.state.Csoes == "edit"){
                if(this.params.isJoinEnrollment == 1) {
                    this.getEnrollment(this.params.joinEnrollmentNormalDepartment);
                }else{
                    this.getQuerySurgery(this.params.joinEnrollmentNormalDepartment);
                }
              }else{
                if(this.params.isJoinEnrollment == 1) {
                    this.getEnrollment(this.normalColumns[0].id );
                }else{
                    this.getQuerySurgery(this.normalColumns[0].id );
                }
              }
            }
          }
        },
        0
      );
    },
    /**
     * 获取病种
     */
    getEnrollment(normalDepartmentId){
      this.bjEnrollmentColumns = [];
      this.utils.ajax(
        {
          url: this.api.enrollment,
          data:{
            multistandardId:this.params.joinEnrollmentStandard,
            normalDepartmentId: normalDepartmentId,
            currentPage: 1,
            pageSize: 1000,
          },
          method: "POST",
          success: data => {
            if(data && data.content.length > 0){
              data.content.forEach((item,index)=>{
                if(this.$store.state.Csoes == "edit" && this.params.joinEnrollmentCode == item.codeOfDisease){
                  this.activity.joinEnrollmentCode = item.nameOfDisease;
                } 
                this.bjEnrollmentColumns.push({
                  text:item.nameOfDisease,
                  id:item.codeOfDisease,
                  value:item.codeOfDisease,
                });
              })
            }
          }
        },
        0
      );
    },
    /**
     * 获取技能、手术
     */
    getQuerySurgery(normalDepartmentId){
      this.bjEnrollmentColumns = [];
      this.utils.ajax(
        {
          url: this.api.querySurgery,
          data:{
            multistandardId: this.params.joinEnrollmentStandard,
            normalDepartmentId : normalDepartmentId,
            type: this.params.isJoinEnrollment == 2 ?  1  : 2 ,
            currentPage: 1,
            pageSize: 1000, 
          },
          method: "POST",
          success: data => {
            if(data && data.content.length > 0){
              data.content.forEach((item,index)=>{
                console.log(this.params.joinEnrollmentCode);
                if(this.$store.state.Csoes == "edit" && this.params.joinEnrollmentCode == item.codeOfSurgery){
                  this.activity.joinEnrollmentCode = item.nameOfSurgery;
                } 
                this.bjEnrollmentColumns.push({
                  text:item.nameOfSurgery,
                  id:item.codeOfSurgery,
                  value:item.codeOfSurgery,
                });
              })
            }
          }
        },
        0
      );
    },
   
    confirmType(data) {
      //填充活动类别数据
      this.activityTypeName = data.text;
      this.activity.type = data.value;
      this.changeShowStatus("showType", false);
    },
    confirmRank(data) {
      this.activity.Rank = data.value;
      this.changeShowStatus("showRank", false);
    },
    confirmRegister(data){
      switch(data.value){
        case 0:
          this.isSelectShow = false;
          break;
        case 1:
          this.isSelectShow = true;
          break;
        case 2:
          this.isSelectShow = true;
          break;
        case 3:
          this.isSelectShow = true;
          break;
        default:
          break;
      }
      this.changeShowStatus("register", false);
      this.activity.isJoinEnrollment = data.text;
      this.params.isJoinEnrollment = data.value;
      this.bjEnrollmentColumns = [];
      this.params.joinEnrollmentCode = "";
      this.activity.joinEnrollmentCode = "";
    },
    confirmStandard(data){
      this.activity.joinEnrollmentStandard = data.text;
      this.params.joinEnrollmentStandard = data.value;
      this.activity.joinEnrollmentNormalDepartment = "";
      this.params.joinEnrollmentNormalDepartment = "";
      this.activity.joinEnrollmentCode = "";
      this.params.joinEnrollmentCode = "";
      this.activity.joinEnrollmentSubjectCodeName = "";
      this.changeShowStatus("standard", false);
      this.getNormalDepartment(data.value);

    },
    confirmNormal(data){
      if(data == undefined){
        return;
      }
      this.activity.joinEnrollmentNormalDepartment = data.text;
      this.params.joinEnrollmentNormalDepartment = data.value;
      this.activity.joinEnrollmentCode = "";
      this.params.joinEnrollmentCode = "";
      this.changeShowStatus("normalDepartment", false);
      if(this.params.isJoinEnrollment == 1) {
        this.getEnrollment(data.value);
      }else{
        this.getQuerySurgery(data.value);
      }
    },
    confirmEnrollment(data){
      this.activity.joinEnrollmentCode = data.text;
      this.params.joinEnrollmentCode = data.value;
      this.changeShowStatus("bjEnrollment", false);

    },
    confirmsignUp(data) {
      this.activity.signUp = data.value;
      this.changeShowStatus("signUpshow", false);
    },
    confirmNeed(data) {
      this.activity.isNeedEvaluate = data.value;
      console.log(data);
      this.changeShowStatus("isNeedEShow", false);
    },
    confirmEvaluate(data) {
      this.activity.evaluateId = data.value;
      this.changeShowStatus("evaluateShow", false);
    },
    confirmEvaluat(data) {
      this.activity.isMustEvaluate = data.value;
      // ****
      this.changeShowStatus("Evaluate", false);
    },
    confirmisLimit(data) {
      this.activity.restriction = data.value;
      this.changeShowStatus("isLimitshow", false);
    },
    //归属科室
    confirmDepartment(data) {
      this.activity.partOfDepartmentId = data.value;
      this.changeShowStatus("showpartOfDepartment", false);
    },
    confirmSpecialty(data) {
      //指定专业弹出关闭之前
      this.getReceivingObjNames();
      this.changeShowStatus("showSpecialty", false);
    },
    getReceivingObjNames() {
      //获取接收对象姓名 指定专业
      this.activity.professional = this.activity.majorsObj.toString();
      return this.activity.majorsObj.toString();
    },
    confirmMajors(data) {
      if(this.params.joinEnrollmentStandard == null){
        this.Toast("请先选择标准");
        this.changeShowStatus("majors", false);
        return;
      }
      this.activity.joinEnrollmentSubjectCode = data.key;
      this.activity.joinEnrollmentSubjectCodeName = data.value;
      this.getNormalDepartment(this.params.joinEnrollmentStandard,data.key);
      this.activity.joinEnrollmentNormalDepartment = null;
      this.params.joinEnrollmentNormalDepartment = null;
      this.activity.joinEnrollmentCode = null;
      this.params.joinEnrollmentCode = null;
      this.changeShowStatus("majors", false);
    },
    // confirmEntityy(data) {
    //   this.activity.TrainingActivity = this.scrollEntity.value;
    //   this.changeShowStatus("showEntity", false);
    //   this.activity.Entity = "";
    // },
    // confirmTraining(data) {
    //   this.activity.Entity = data.value;
    //   this.activity.TrainingActivity = "";
    //   this.changeShowStatus("showTraining", false);
    // },
    confirmTime(value) {
      //时间确定
      this.showStartTime = false;
      this.activity.startTime = this.utils.formatDate(
        value,
        "yyyy-MM-dd HH:mm",
        true
      );
      this.startTimee = this.utils.getTime(this.activity.startTime);
      // this.learn(this.endTimee, this.startTimee);
    },
    confirmTimet(value) {
      //时间确定
      this.showEndTime = false;
      this.activity.endTime = this.utils.formatDate(
        value,
        "yyyy-MM-dd HH:mm",
        true
      );
      var endTime = this.utils.getTime(this.activity.endTime);
      this.endTimee = endTime;
      // this.learn(endTime, this.startTimee);
    },
     Receive() {
      // 接收人
      if (this.activity.startTime == "请选择") {
        this.Toast("开始时间不能为空");
        return;
      }
      this.indexOf(this.detail.activity);
      this.activity.detail = this.detail.activity;
      this.$store.state.activityAdd = this.activity;
      this.$store.state.activityAdd.mobile = this.activity.mobile;
      this.$store.state.acceptObject = 1;
      this.$store.state.recipients = this.recipients;
      this.$store.state.linstObjArr = this.linstObjID;
      this.$store.state.activityIsShowSelect = this.isSelectShow;
      this.$store.state.activityParams = this.params;
      this.$router.push({ name: "DepartmentName", params: {} });

    },
    changeShowStatus(name, status) {
      //更改弹出层状态
      this[name] = status;
    },
    // learn(endTime, startTimee) {
    //   // 学时
    //   if (endTime !== "" && !startTimee == "") {
    //     var period = endTime - startTimee;
    //     var h = period / 3600 / 1000;
    //     var hh = h.toFixed(2);
    //     this.activity.classHour = hh + "小时";
    //     this.activity.classHour = hh;
    //   } else {
    //   }
    // },
    formatter(type, value) {
      return this.utils.pickerType(type, value);
    },
    toggle(index, key) {
      this.$refs.checkboxes[index].toggle();
    },
    conserve() {
     this.Toast.loading({
        mask: true,
        message: "加载中...",
        duration:0
      });
      var receiverIds = [];
      var subjectCode = [];
      if (this.activity.Rank == 2) {
        this.$store.state.majors.forEach(item => {
          this.activity.majorsObj.forEach(i => {
            if (i == item.value) {
              subjectCode.push(item.key);
            }
          });
        });
      }
      this.activity.detail = this.detail.activity;
      if (this.activity.title == "") {
        this.Toast("请填写活动标题");
        return;
      }
      if (this.activity.speaker == "") {
        this.Toast("请填写主讲人");
        return;
      }
      if (this.activity.mobile == "") {
        this.Toast("手机号不能为空");
        return;
      }
      if (this.activity.mobile !== "") {
        var reg = /^1[3456789]\d{9}$/;
        if (!reg.test(this.activity.mobile)) {
          this.Toast("请输入有效的手机号码");
          return;
        }
      }
      if (
        this.activity.startTime == "请选择" ||
        this.activity.startTime == ""
      ) {
        this.Toast("开始时间不能为空");
        return;
      }
      if (this.activity.endTime == "请选择" || this.activity.endTime == "") {
        this.Toast("结束时间不能为空");
        return;
      }
      if (this.activity.classHour == "") {
        this.Toast("活动时长不能为空");
        return;
      }
      if (this.activity.classHour < 0) {
        this.Toast("活动时长不能为负数");
        return;
      }
      if (this.activity.classRoomName == "") {
        this.Toast("活动地点不能为空");
        return;
      }
      if(this.isSelectShow && !this.params.joinEnrollmentStandard){
        this.Toast("请选择标准");
        return;
      }
      if(this.isSelectShow &&  !this.params.joinEnrollmentNormalDepartment){
        this.Toast("请选择标准科室");
        return;
      }
      if( this.isSelectShow &&  !this.params.joinEnrollmentCode){
        this.Toast("请选择技能或者病种、手术");
        return;
      }
      if (this.recipients == "") {
        this.Toast("请选择接收人");
        return;
      }
      if (this.$store.state.linstObjArr) {
        this.$store.state.linstObjArr.forEach(item => {
          receiverIds.push(item.humanId);
        });
      }

      var params = {
        classRoomName: this.activity.classRoomName,
        startTime: this.activity.startTime,
        endTime: this.activity.endTime,
        classHour: this.activity.classHour,
        type: this.activity.type,
        title: this.activity.title,
        id: this.$store.state.paramsTeachingId
          ? this.$store.state.paramsTeachingId
          : "",
        isExtramural: this.activity.isExtramural,
        speaker: this.activity.speaker,
        mobile: this.activity.mobile,
        detail: this.activity.detail,
        joinEnrollmentSubjectCode:this.activity.joinEnrollmentSubjectCode,
        isJoinEnrollment: this.params.isJoinEnrollment,
        joinEnrollmentStandard : this.params.joinEnrollmentStandard, // 标准
        joinEnrollmentNormalDepartment : this.params.joinEnrollmentNormalDepartment, //标准科室
        joinEnrollmentCode : this.params.joinEnrollmentCode, //病种
        teachingLevel: this.activity.Rank, // 活动级别：1全院；2专业基地；3科室
        bankCardNum: this.activity.bankCardNum,
        isSignUp: this.activity.signUp,
        receiverIds: receiverIds,
        isNeedEvaluate: this.activity.isNeedEvaluate,
        attachmentList: this.activity.modeData.value,
        partOfDepartmentId: this.activity.partOfDepartmentId
      };
      if (this.activity.signUp == 1) {
        params.numOfLimit = this.activity.numOfLimit;
      }
      if (this.activity.numOfLimit == "") {
        params.isLimit = 0;
      } else {
        params.isLimit = 1;
      }
    //   if (this.activity.Training == 1) {
    //     params.joinEnrollmentCode = this.activity.Entity;
    //   }
    //   if (this.activity.Training == 2) {
    //     params.joinEnrollmentCode = this.activity.TrainingActivity;
    //   }
      if (this.activity.type == 2 || this.activity.type == 3) {
        params.content = JSON.stringify({
          specialName: this.activity.specialName,
          specialPatientId: this.activity.specialPatientId
        });
      }
      if (this.activity.Rank == 2) {
        params.subjectCode = subjectCode;
      }
      if (params.id) {
        params.startTime = this.activity.startTime;
        params.endTime = this.activity.endTime;
      }
      if(this.activity.isNeedEvaluate == 1) {
        params.evaluateId = this.activity.evaluateId;
        params.isMustEvaluate = this.activity.isMustEvaluate;
      }
      this.utils.ajax({
        url: this.api.editTeaching,
        data: params,
        method: "POST",
        success: data => {
          this.$store.state.ActiveLook = "";
          // 清空接收对象
          this.$store.state.depar = "";
          this.$store.state.acceptObject = "";
          this.$store.state.TrainingName = "";
          this.$store.state.traineeYearType = "";
          this.$store.state.receiverType = "";
          this.$store.state.receiverCodesId = "";
          this.$store.state.paramsTeachingId = "";
          this.$store.state.Csoes = "";
          this.$store.state.keepEcho = "";
          this.$store.state.objectArry = "";
          this.$store.state.linstObjArr = "";
          this.$store.state.recipients = "";
          setTimeout(() => {
            this.Toast("保存成功");
          }, 300);
          this.utils.goBack(this);
          this.Toast.clear();
        }
      },1);
    },
    loding() {

    },
    seeData() {
      //查看
      if (this.$store.state.Csoes == "see") {
        if (this.$store.state.acceptObject) {
        } else {
          this.seeEdit();
          this.asterisk = false;
        }
        this.nameActy = false;
        this.flag = false;
        this.asfss = false;
        return ;
      }
      if (this.$store.state.Csoes == "edit") {
        this.nameActy = true;

        if (this.$store.state.acceptObject) {
        } else {
          this.seeEdit();
          this.asterisk = true;
        }
        return
      }
      this.getStandard();
    },
    isImg(str) {
      if (/.jpg/.test(str) || /.JPG/.test(str) || /.jpeg/.test(str) || /.JPEG/.test(str) || /.png/.test(str) || /.gif/.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    isImgLinst(str) {
      if (/.jpg/.test(str) || /.JPG/.test(str) || /.jpeg/.test(str) || /.JPEG/.test(str) || /.png/.test(str) || /.gif/.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    onRead(file) {
      let flag = true;
      let _this = this;
      let content = this.utils.encryptByEnMd5(file.content);
      if(content && this.isHasFile.hasOwnProperty(content)) {
        this.Toast("该文件已存在，请选择其他文件");
        return;
      }else{
        this.utils.fileUploader(file, data => {
            this.isHasFile[content] = data.url;
            this.activity.modeData.value.push({
                path: data.url,
                name: data.name,
                type: 1
            });
        });
      }
    },
    onRead1(file) {
      let flag = true;
      let _this = this;
      let content = this.utils.encryptByEnMd5(file.content);
      if(content && this.isHasFile1.hasOwnProperty(content)) {
        this.Toast("该文件已存在，请选择其他文件");
        return;
      }else{
          this.utils.fileUploader(file, data => {
              _this.isHasFile1[content] = data.url;
             this.activity.modeData.value.push({
                path: data.url,
                name: data.name,
                type: 2
             });
        });
      }
    },
    show_file(e, url, index) {
      e.stopImmediatePropagation();
      this.shwoFile.flag = true;
      this.shwoFile.url = url;
      this.shwoFile.index = index;
    },
    show_fileLinst(e, url, index) {
      e.stopImmediatePropagation();
      this.shwoFiletea.flag = true;
      this.shwoFiletea.url = url;
      this.shwoFiletea.index = index;
    },
    delFile() {
      Object.keys(this.isHasFile).forEach((item)=>{
          if(this.isHasFile[item] == this.shwoFile.url){
              delete this.isHasFile[item];
          }
      })
      Object.keys(this.isHasFile1).forEach((item)=>{
          if(this.isHasFile1[item] == this.shwoFile.url){
              delete this.isHasFile1[item];
          }
      })    
      this.activity.modeData.value.splice(this.shwoFile.index, 1);
    },
    // Professional() {
    //   // 专业基地
    //   this.utils.ajax({
    //     url: this.api.auditActivityDetail
    //   });
    // },
    seeEdit() {
      var params = {
        id: this.$store.state.paramsTeachingId,
        isPreview: 1
      };
      let _this = this;
      this.utils.ajax(
        {
          url: this.api.auditActivityDetail,
          data: params,
          method: "POST",
          success: data => {
            this.indexOf(data.detail);
            this.activity.type = data.type;
            this.activity.title = data.title;
            this.activity.isExtramural = data.isExtramural;
            this.activity.speaker = data.speaker;
            this.activity.mobile = data.mobile;
            this.detail.activity = data.detail;
            this.activity.startTime = data.startTime.substring(0, 16);
            this.activity.endTime = data.endTime.substring(0, 16);
            this.activity.classHour = data.classHour;
            this.activity.classHour = data.classHour;
            this.activity.classRoomName = data.classRoomName;
            this.activity.Training = data.isJoinEnrollment; //登记手册
            this.params.isJoinEnrollment = data.isJoinEnrollment; //登记手册
            this.activity.joinEnrollmentSubjectCodeName = data.joinEnrollmentSubjectCodeName;
            this.activity.joinEnrollmentSubjectCode = data.joinEnrollmentSubjectCode;
            this.isSelectShow = true;
            if(this.params.isJoinEnrollment == 0){
              this.isSelectShow = false;
              this.activity.isJoinEnrollment = "不参与计算"
            }
            if(this.params.isJoinEnrollment == 1){
              this.activity.isJoinEnrollment = "参与病种计算"
            }
            if(this.params.isJoinEnrollment == 2){
              this.activity.isJoinEnrollment = "参与技能计算"
            }
            if(this.params.isJoinEnrollment == 3){
              this.activity.isJoinEnrollment = "参与手术计算"
            }
            this.activity.joinEnrollmentStandard = data.joinEnrollmentStandardName; // 标准

            this.params.joinEnrollmentStandard = data.joinEnrollmentStandard; //登记手册

            this.params.joinEnrollmentNormalDepartment = data.joinEnrollmentNormalDepartment; //标准科室
            this.activity.joinEnrollmentNormalDepartment = data.joinEnrollmentNormalDepartmentName; //标准科室

            this.params.joinEnrollmentCode = data.joinEnrollmentCode;//病种
            this.activity.joinEnrollmentCode = data.joinEnrollmentCodeName; //
            this.activity.specialName = data.specialName;
            this.activity.specialPatientId = data.specialPatientId;
            this.activity.bankCardNum = data.bankCardNum;
            this.activity.numOfLimit = data.numOfLimit;
            this.activity.Rank = data.teachingLevel;
            this.activity.partOfDepartmentId = data.partOfDepartmentId;
            this.activity.signUp = data.isSignUp;
            this.activity.isNeedEvaluate = data.isNeedEvaluate;
            this.activity.evaluateId = data.evaluateId;
            this.activity.isMustEvaluate = data.isMustEvaluate;
            this.activity.modeData.value = data.attachmentList
            if (data.isJoinEnrollment == 1) {
              _this.activity.Entity = data.joinEnrollmentCode;
            }
            if (data.isJoinEnrollment == 2) {
              _this.activity.TrainingActivity = data.joinEnrollmentCode;
            }
            _this.$store.state.majors.forEach(item => {
              data.subjectCode.forEach(idd => {
                if (idd == item.key) {
                  _this.activity.majorsObj.push(item.value);
                  _this.getReceivingObjNames();
                }
              });
            });
            this.getStandard();
          }
        },
        200
      );
      var obj = {
        teachingId: this.$store.state.paramsTeachingId
      };
      this.utils.ajax(
        {
          url: this.api.findTeachingReceiver,
          data: obj,
          method: "POST",
          success: data => {
            this.recipients = data.content.length;
            this.linstObjID = data.content;
            this.$store.state.linstObjArr = data.content;
          }
        },
        200
      );
    },
    specialty(item, index) {
      this.$refs.specialty[index].toggle();
    },
    indexOf(str2) {
      var str1 = "<";
      var s = str2.indexOf(str1);
      if (s === -1) {
        this.textareaShow = true;
      } else {
        this.textareaShow = false;
      }
      return s;
    },
    checkLook() {
      this.activity.detail = this.detail.activity;
      this.$store.state.activityAdd = "";
      this.$store.state.activityAdd = this.activity;
      this.$router.push({
        name: "CheckLook",
        params: {}
      });
    },
    dataActivedd() {
      // 点击接收对象 后退把值带回来
      if (this.$store.state.acceptObject) {
        this.activity = this.$store.state.activityAdd;
        this.detail.activity = this.activity.detail;
        this.recipients = this.$store.state.recipients;
        this.linstObjID = this.$store.state.linstObjArr;
        this.isSelectShow = this.$store.state.activityIsShowSelect;
        this.params = this.$store.state.activityParams;
      } else {
      }
    },
    scroll(e) {
      this.selectIndex = e.target.scrollTop / 32;
      setTimeout(() => {
        var x = e.target.scrollTop % 32;
        if (x > 16) {
          e.target.scrollTop = e.target.scrollTop + (32 - x);
        }
        if (x < 16) {
          e.target.scrollTop = e.target.scrollTop - x;
        }
      }, 300);
      if (this.TrainingTitle == "参与病种计算") {
        this.scrollText = this.TrainingColumns[this.selectIndex];
      }

      if (this.TrainingTitle == "参与技能计算") {
        this.scrollEntity = this.confirmEntity[this.selectIndex];
      }
    },
    Trainingclick(item) {
      if (item.key == 0) {
        this.activity.Entity = "";
        this.activity.TrainingActivity = "";
      }
      if (item.key == 1) {
        if (this.Notechical) {
          this.showTraining = true;
        } else {
          this.Toast("无参与病种计算");
        }

        this.TrainingTitle = "参与病种计算";
      }
      if (item.key == 2) {
        if (this.Notechical) {
          this.showEntity = true;
        } else {
          this.Toast("无参与技能计算");
        }
        this.TrainingTitle = "参与技能计算";
      }
    },
    textaClick() {
      this.texshow = true;
    },
    confirmText() {
      this.texshow = false;
      this.textareaShow = true;
      this.detail.activity = this.detail.activity.replace(/<[^>]+>/g, "");
    },
  },
  created() {
    this.init();
    this.dataActivedd();
    this.seeData();
    if (this.$store.state.ActiveLook == "Look") {
      this.nameActy = false;
    }
    if (this.$store.state.linstObjArr) {
      this.recipients = this.$store.state.linstObjArr.length;
    }
    this.indexOf(this.activity.detail);
  }
};
</script>
<style scoped>
.radioAdd {
  background: white;
  padding: 0.5rem 0;
  border: 1px solid #fafafa;
}

.dadioimg {
  width: 1.125rem;
  height: 1.125rem;
}
.van-cell:not(:last-child)::after{
    border-bottom:none;
}
.van-cell{
    border-bottom:0.0625rem solid #ebedf0;
}
.radioname {
  /* width: 40%; */
  display: flex;
  margin: 0 auto;
  justify-content: space-between;
}

.radioname span {
  font-size: 0.9rem;
}

.abstract {
  background: white;
  padding-top: 0.1rem;
}

.abstract span {
  font-size: 0.9rem;
  margin-left: 1rem;
  color: #323233;
}
.save {
  width: 95.6%;
  padding: 0.5rem;
  background: #187fe8;
  text-align: center;
  color: white;
  font-size: 1rem;
  line-height: 1rem;
  position: fixed;
  bottom: 0;
  z-index: 2;
  height: 1.3rem;
  /* line-height: 1.3rem; */
  line-height: 1.3rem;
}

.top {
  margin-top: 0.5rem;
}

.demo-popup .van-popup--right {
  width: 100%;
  height: 100%;
}

.reception {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: white;
}
.reception p {
  padding: 0;
  margin: 0;
}
.reception .seek {
  color: #187fe8;
  z-index: 22222;
}
.adminis {
  background: white;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.9rem;
}
.adminis p {
  margin: 0;
  padding: 0;
}
.adminis p:nth-of-type(1) {
  width: 5rem;
  color: #323233;
}
.adminis p:nth-of-type(2) {
  text-align: right;
  color: #969799;
  width: 90%;
}
.placeholders {
  background: white;
  padding: 1.2rem 0.8rem;
  height: 1.5rem;
}
.ActivityTraining {
  display: flex;
  justify-content: space-between;
}
.cultivate {
  padding: 0.5rem 0.8rem;
  background: white;
}
.train {
  padding: 0.5rem 0.8rem;
  background: white;
  display: flex;
  justify-content: space-between;
}
.train p {
  font-size: 0.9rem;
  margin: 0;
}
.train p:nth-of-type(1) {
  width: 5rem;
}
.train p:nth-of-type(2) {
  color: #969799;
  overflow: hidden;
  word-break: keep-all;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.headerBox {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.readonly {
  background: white;
}
>>> .van-field__label{
    white-space: nowrap;
}
.readonly .span {
  position: relative;
  top: 2rem;
  z-index: 2;
  left: 0.3rem;
}
.selectBox {
  height: 17rem;
}
.selectBox ul {
  width: 98%;
  display: flex;
  justify-content: space-between;
  padding: 0.2rem;
}
.seleccolorp {
  color: #71b6fc;
}
.selectContent {
  height: 14rem;
  overflow-y: scroll;
  text-align: center;
}
.selectContent p {
  padding: 0;
  margin: 0;
  line-height: 2rem;
  color: grey;
}
.seletstyle {
  position: relative;
  width: 100%;
}
.seletstyle p {
  overflow: hidden;
  word-break: keep-all;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.seletstyle span {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: #f3f3f3;
}
.selectedStyle {
  /* background: black; */
  color: black !important;
  font-weight: 700;
  font-size: 15px;
}
.stelectpadding {
  padding: 6rem 0;
}
.selectP {
  color: black;
  font-weight: 600;
}
.bottomBox {
  background: white;
}
.textareaaP {
  margin-left: 1rem;
  padding: 0;
  border: 1px solid #f2f2f2;
}
.titleClassp {
  padding: 1rem;
}
.majorin {
  height: 30rem;
  overflow: auto;
}
.acceptStyle-box {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
}
.file_box {
  padding: 0.5rem 1rem;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
.file_box > div {
  display: inline-block;
}
.fileList img {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
}
.title-file {
  text-align: center;
  color: #5a595b;
  margin-bottom: 0.5rem;
}
.fileList {
  /* width: 3rem; */
  /* height: 3rem; */
  position: relative;
  margin-right: 0.573rem;
  margin-bottom: 0.5rem;
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
.classHourStyle{
  display: flex;
}
.required::before{
    content: '*';
    position: absolute;
    left: 0.4375rem;
    font-size: 0.875rem;
    color: #f44;
}
/* .classHourStyle span:nth-of-type(1){
  margin-top: -0.8rem;
} */
/* .classHourStyle span:nth-of-type(2){
  width: 13%;
  margin-top: 0.8rem;
} */
</style>
