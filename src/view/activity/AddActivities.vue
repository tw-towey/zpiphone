<template>
  <div>
    <van-nav-bar title="添加活动" class="header" fixed left-arrow @click-left="onClickLeft()"/>
    <div class="layout_content">
      <van-cell
        title="活动类别"
        is-link
        :value="utils.getValueByKey($store.state.activitiesType, activity.type)"
        @click="changeShowStatus('showType',true)"
      />

      <van-field
        v-model="activity.title"
        type="text"
        label="活动标题"
        placeholder="请填写"
        input-align="right"
      />

      <div class="radioAdd">
        <van-radio-group v-model="activity.isExtramural" class="radioname">
          <div v-for="item in $store.state.extramural">
            <van-radio :name="item.key">
              <img
                slot="icon"
                slot-scope="props"
                :src="props.checked ? icon.active : icon.normal"
                class="dadioimg"
              >
              <span>{{item.value}}</span>
            </van-radio>
          </div>
        </van-radio-group>
      </div>

      <van-field v-model="activity.speaker" label="主讲人" placeholder="请填写" input-align="right"/>

      <van-field
        v-model="activity.mobile"
        type="number"
        label="手机号"
        placeholder="请填写"
        input-align="right"
      />

      <van-cell
        title="是否报名"
        is-link
        :value="utils.getValueByKey($store.state.isSignUps, activity.isSignUp) || '请选择' "
        @click="changeShowStatus('showSignUp',true)"
      />

      <van-field
        v-model="activity.numOfLimit"
        type="number"
        label="人数限制"
        placeholder="选填项"
        input-align="right"
      />

      <!--入科教育、大讲课、技能训练-->
      <div v-if="activity.type == 1 || activity.type == 5 || activity.type == 6">
        <div class="abstract">
          <span>活动摘要</span>
          <!-- <van-field
            v-model="activity.summary"
            type="textarea"
            placeholder="请输入活动摘要信息,选填项"
          />-->
          <InputField :textareaa="summary" :placeholder="placeholder"></InputField>
        </div>

        <div class="abstract">
          <span>活动详情</span>
          <!-- <van-field v-model="activity.detail" type="textarea" placeholder="请输入活动详情信息" autosize/> -->
          <InputField :textareaa="detail" :placeholder="placeholderr"></InputField>
        </div>
      </div>

      <!--教学查房-->
      <div v-if="activity.type == 2">
        <div class="abstract">
          <span>学员汇报病史、体格检查、诊疗计划要点</span>
          <!-- <van-field
            v-model="activity.specialText1"
            type="textarea"
            placeholder="请输入学员汇报病史、体格检查、诊疗计划要点要信息,选填项"
            autosize
          />-->
          <InputField :textareaa="specialText1" :placeholder="placeholderr"></InputField>
        </div>

        <div class="abstract">
          <span>对学员点评及病例诊治讲解要点</span>
          <!-- <van-field
            v-model="activity.specialText2"
            type="textarea"
            placeholder="请输入对学员点评及病例诊治讲解要点信息,选填项"
            autosize
          />-->
          <InputField :textareaa="specialText2" :placeholder="placeholderr"></InputField>
        </div>

        <div class="abstract">
          <span>教学查房小结</span>
          <!-- <van-field
            v-model="activity.specialText3"
            type="textarea"
            placeholder="请输入教学查房小结信息,选填项"
            autosize
          />-->
          <InputField :textareaa="specialText3" :placeholder="placeholderr"></InputField>
        </div>
      </div>

      <!--病例讨论-->
      <div v-if="activity.type == 3">
        <div class="abstract">
          <span>主要病例特点</span>
          <!-- <van-field
            v-model="activity.specialText1"
            type="textarea"
            placeholder="请输入主要病例特点信息,选填项"
            autosize
          />-->
          <InputField :textareaa="specialText13" :placeholder="placeholderr"></InputField>
        </div>

        <div class="abstract">
          <span>各级医生发言要点</span>
          <!-- <van-field
            v-model="activity.specialText2"
            type="textarea"
            placeholder="请输入各级医生发言要点信息,选填项"
            autosize
          />-->
          <InputField :textareaa="specialText23" :placeholder="placeholderr"></InputField>
        </div>

        <div class="abstract">
          <span>主持人总结要点</span>
          <!-- <van-field
            v-model="activity.specialText3"
            type="textarea"
            placeholder="请输入主持人总结要点信息,选填项"
            autosize
          />-->
          <InputField :textareaa="specialText33" :placeholder="placeholderr"></InputField>
        </div>
      </div>

      <!-- 小讲课 -->
      <div v-if="activity.type == 4 ">
        <van-field
          v-model="activity.specialTitle"
          label="讲课题目"
          placeholder="请填写"
          input-align="right"
        />

        <div class="abstract">
          <span>主要内容</span>
          <!-- <van-field
            v-model="activity.specialText1"
            type="textarea"
            placeholder="请输入主要内容信息,选填项"
            autosize
          />-->
          <InputField :textareaa="specialText14" :placeholder="placeholderr"></InputField>
        </div>

        <div class="abstract">
          <span>讲课小结</span>
          <!-- <van-field
            v-model="activity.specialText2"
            type="textarea"
            placeholder="请输入讲课小结信息,选填项"
            autosize
          />-->
          <InputField :textareaa="specialText24" :placeholder="placeholderr"></InputField>
        </div>
      </div>

      <van-cell
        class="top"
        title="开始时间"
        is-link
        :value="activity.startTime"
        @click="changeShowStatus('showStartTime', true)"
      />

      <van-cell
        title="结束时间"
        is-link
        :value="activity.endTime"
        @click="changeShowStatus('showEndTime', true)"
      />

      <van-field v-model="activity.classHour" type="text" label="学时" readonly input-align="right"/>

      <van-field
        v-model="activity.classRoomName"
        label="活动地点"
        placeholder="请填写"
        input-align="right"
      />
      <van-cell
        title="接收对象"
        is-link
        :value="getReceivingObjNames() || '请选择'"
        @click="changeShowStatus('showReceivingObj', true)"
        v-show="nameActy"
      />
      <div class="reception" v-show="!nameActy">
        <p>接收对象</p>
        <p class="seek" @click="checkLook()">查看</p>
      </div>
      <!-- <van-cell
          title="科室名称"
          is-link
          :value="activityType.departmentt"
          @click="changeShowStatus('showDepartment', true)"
      />-->
      <!-- <van-cell
        v-show="nameActy"
        title="科室名称"
        is-link
        :value="activityType.departmentt"
        @click="administrative()"
      /> -->
      <div class="adminis" v-show="nameActy">
        <p>科室名称</p>
        <p  @click="administrative()">{{activityType.departmentt}}</p>
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
          @cancel="changeShowStatus('showType',false)"
        />
      </van-popup>

      <!-- 是否报名 -->
      <van-dialog
        v-model="showSignUp"
        show-cancel-button
        :before-close="beforeCloseSignUp"
        title="是否报名"
      >
        <van-radio-group v-model="tempSignUp">
          <van-cell-group>
            <div v-for="item in $store.state.isSignUps">
              <van-cell :title="item.value" clickable @click="tempSignUp = item.key">
                <van-radio :name="item.key">
                  <img
                    slot="icon"
                    slot-scope="props"
                    :src="props.checked ? icon.active : icon.normal"
                    class="dadioimg"
                  >
                </van-radio>
              </van-cell>
            </div>
          </van-cell-group>
        </van-radio-group>
      </van-dialog>

      <!-- 开始时间 -->
      <van-popup v-model="showStartTime" position="bottom" :overlay="true">
        <van-datetime-picker
          v-model="currentDate"
          type="datetime"
          :formatter="formatter"
          @confirm="confirmTime"
          @cancel="changeShowStatus('showStartTime', false)"
        />
      </van-popup>

      <!-- 结束时间 -->
      <van-popup v-model="showEndTime" position="bottom" :overlay="true">
        <van-datetime-picker
          v-model="currentDate"
          type="datetime"
          :formatter="formatter"
          @confirm="confirmTimet"
          @cancel="changeShowStatus('showEndTime', false)"
        />
      </van-popup>

      <!-- 接收对象 -->
      <van-dialog
        v-model="showReceivingObj"
        show-cancel-button
        :before-close="beforeCloseReceivingObj"
        title="接收对象"
      >
        <van-checkbox-group v-model="tempReceivingObj">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in $store.state.receivingObjs"
              clickable
              :key="item.key"
              :title="item.value"
              @click="toggle(index,item)"
            >
              <van-checkbox :name="item.key" ref="checkboxes">
                <img
                  slot="icon"
                  slot-scope="props"
                  :src="props.checked ? icon2.active : icon2.normal"
                  class="dadioimg"
                >
              </van-checkbox>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </van-dialog>

      <!-- 科室名称 -->
      <!-- <div class="demo-popup">
        <van-popup v-model="showDepartment" position="right" :overlay="false">
          <DepartmentName @changeShowStatus="changeShowStatus('showDepartment', false)"></DepartmentName>
        </van-popup>
      </div>-->
      <div :class="shade"></div>
    </div>
  </div>
</template>

<script>
import DepartmentName from "@/view/activity/DepartmentName";
import InputField from "@/components/InputField";
export default {
  components: {
    DepartmentName: DepartmentName,
    InputField: InputField
  },
  name: "AddActivities",
  data() {
    return {
      activityId: "",
      showType: false, // 活动类型弹层
      showSignUp: false, // 是否报名弹层
      showStartTime: false, // 开始时间弹层
      showEndTime: false, // 结束时间弹层
      showReceivingObj: false, // 接收对象弹层
      showDepartment: false, //科室名称弹层
      typeColumns: [], // 活动类型
      typeDefaultIndex: 0,
      tempSignUp: "", //临时存储是否报名
      tempReceivingObj: [], //临时存储接收对象
      currentDate: new Date(),
      placeholder: "请输入活动摘要信息,选填项",
      placeholderr: "请输入活动详情信息",
      disable: true,
      activity: {
        id: "",
        type: 1, // 活动类别
        title: "", // 活动标题
        isExtramural: 1, //主讲人类型：院内-0、院外-1
        speaker: "", //主讲人姓名
        mobile: "", //讲人手机号
        isSignUp: "请选择", // 是否报名
        startTime: "请选择", // 开始时间
        endTime: "请选择", // 结束时间
        summary: "", // 活动摘要
        detail: "", // 活动详情
        receivingObj: [],
        classHour: "",
        classRoomName: "", // 活动地点
        specialText1: "",
        specialText2: "",
        specialText3: "",
        specialTitle: ""
      },
      summary: {
        placeholder: "请输入活动摘要信息,选填项",
        activity: ""
      },
      detail: {
        placeholder: "请输入活动详情信息",
        activity: ""
      },

      specialText1: {
        placeholder: "请输入学员汇报病史、体格检查、诊疗计划要点要信息,选填项",
        activity: ""
      },
      specialText2: {
        placeholder: "请输入对学员点评及病例诊治讲解要点信息,选填项",
        activity: ""
      },
      specialText3: {
        placeholder: "请输入教学查房小结信息,选填项",
        activity: ""
      },

      specialText13: {
        placeholder: "请输入主要病例特点信息,选填项 ",
        activity: ""
      },
      specialText23: {
        placeholder: "请输入各级医生发言要点信息,选填项",
        activity: ""
      },
      specialText33: {
        placeholder: "请输入主持人总结要点信息,选填项",
        activity: ""
      },
      specialText14: {
        placeholder: "请输入主要内容信息,选填项",
        activity: ""
      },
      specialText24: {
        placeholder: "请输入对学员点评及病例诊治讲解要点信息,选填项",
        activity: ""
      },
      shade: "",
      departmentCaId: "",
      activityType: {
        department: "",
        departmentt: "请选择"
      },
      icon: {
        normal: require("../../assets/images/home/pic_ses-01.svg"),
        active: require("../../assets/images/home/pic_ses-02.svg")
      },
      icon2: {
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
      nameActy: true
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
      this.activityType.departmentt = "请选择";
      this.$store.state.departmentt = "";
      // this.$store.state.activityAdd = "";
      this.$store.state.departmenty = "";
      this.$store.state.Nodepartment = "";
      this.$store.state.seeAdd = "";
      this.$store.state.inputtext = "";
      this.$store.state.ActiveLook = "";
    },
    init() {
      //活动类别选项
      this.$store.state.activitiesType.forEach(item => {
        this.typeColumns.push({
          text: item.value,
          value: item.key
        });
      });
    },
    changeShowStatus(name, status) {
      //更改弹出层状态
      this.activityType.department = "";
      this[name] = status;
    },
    confirmType(data) {
      //填充活动类别数据
      this.activityTypeName = data.text;
      this.activity.type = data.value;
      this.changeShowStatus("showType", false);
    },
    confirmTime(value) {
      //时间确定
      this.showStartTime = false;
      this.activity.startTime = this.utils.formatDate(
        value,
        "yyyy-MM-dd HH:mm:ss",
        true
      );
      this.startTimee = this.utils.getTime(this.activity.startTime);
      this.learn(this.endTimee, this.startTimee);
    },
    confirmTimet(value) {
      //时间确定
      this.showEndTime = false;
      this.activity.endTime = this.utils.formatDate(
        value,
        "yyyy-MM-dd HH:mm:ss",
        true
      );
      var endTime = this.utils.getTime(this.activity.endTime);
      this.endTimee = endTime;
      this.learn(endTime, this.startTimee);
    },
    learn(endTime, startTimee) {
      // 学时
      if (endTime !== "" && !startTimee == "") {
        var period = endTime - startTimee;
        var h = period / 3600 / 1000;
        var hh = h.toFixed();
        this.activity.classHour = hh + "小时";
      } else {
      }
    },
    formatter(type, value) {
      return this.utils.pickerType(type, value);
    },
    beforeCloseSignUp(action, done) {
      //是否报名弹层关闭之前
      if (action == "confirm") {
        this.activity.isSignUp = this.tempSignUp;
      } else {
        this.tempSignUp = this.activity.isSignUp;
      }
      done();
    },
    beforeCloseReceivingObj(action, done) {
      //接收对象弹出关闭之前
      if (this.tempReceivingObj.length) {
        if (action == "confirm") {
          this.activity.receivingObj = this.tempReceivingObj;
        } else {
          this.tempReceivingObj = this.activity.receivingObj;
        }
      }
      done();
    },
    administrative() {
      // 科室名称
      this.activity.summary = this.summary.activity;
      this.activity.detail = this.detail.activity;
      if (this.activity.type == 2) {
        this.activity.specialText1 = this.specialText1.activity;
        this.activity.specialText2 = this.specialText2.activity;
        this.activity.specialText3 = this.specialText3.activity;
      }
      if (this.activity.type == 3) {
        this.activity.specialText1 = this.specialText13.activity;
        this.activity.specialText2 = this.specialText23.activity;
        this.activity.specialText3 = this.specialText33.activity;
      }
      if (this.activity.type == 4) {
        this.activity.specialText1 = this.activity.specialTitle;
        this.activity.specialText2 = this.specialText14.activity;
        this.activity.specialText3 = this.specialText24.activity;
      }
      this.$store.state.activityAdd = "";
      this.$store.state.activityAdd = this.activity;

      // console.log(this.$store.state.activityAdd.detail,'ooo');

      this.$router.push({ name: "DepartmentName", params: {} });
    },
    getReceivingObjNames() {
      //获取接收对象姓名
      let names = "";
      this.activity.receivingObj.forEach(item => {
        names =
          names +
          this.utils.getValueByKey(this.$store.state.receivingObjs, item) +
          "、";
      });
      return names.slice(0, names.length - 1);
    },
    toggle(index, key) {
      this.$refs.checkboxes[index].toggle();
    },
    conserve() {
      if (this.activity.type == 2) {
        this.activity.specialText1 = this.specialText1.activity;
        this.activity.specialText2 = this.specialText2.activity;
        this.activity.specialText3 = this.specialText3.activity;
      }
      if (this.activity.type == 3) {
        this.activity.specialText1 = this.specialText13.activity;
        this.activity.specialText2 = this.specialText23.activity;
        this.activity.specialText3 = this.specialText33.activity;
      }
      if (this.activity.type == 4) {
        this.activity.specialText1 = this.activity.specialTitle;
        this.activity.specialText2 = this.specialText14.activity;
        this.activity.specialText3 = this.specialText24.activity;
      }
      this.activity.summary = this.summary.activity;
      this.activity.detail = this.detail.activity;
      if (this.activity.specialText1) {
      } else {
        this.activity.specialText1 = "";
      }
      if (this.activity.specialText2) {
      } else {
        this.activity.specialText2 = "";
      }
      if (this.activity.specialText3) {
      } else {
        this.activity.specialText3 = "";
      }
      var arr = this.activity.receivingObj.join("");
      if (arr == "1") {
        this.receivingnum = 1;
      }
      if (arr == "2") {
        this.receivingnum = 2;
      }
      if (arr == "12" || arr == "21") {
        this.receivingnum = 3;
      }
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
      if (this.activity.isSignUp == "请选择") {
        this.Toast("请选择是否报名");
        return;
      }
      if (
        (this.activity.detail == "" && this.activity.type == 1) ||
        (this.activity.detail == "" && this.activity.type == 5) ||
        (this.activity.detail == "" && this.activity.type == 6)
      ) {
        this.Toast("活动详情不能为空");
        return;
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
      if (this.activity.classRoomName == "") {
        this.Toast("活动地点不能为空");
        return;
      }
      ////////////////////////////////////////////
      if (this.receivingnum == "") {
        this.Toast("请选择接收对象");
        return;
      }
      if (
        this.activityType.departmentt == "请选择" &&
        this.$store.state.Nodepartment !== "No"
      ) {
        this.Toast("请选择科室名称");
        return;
      }
      if (
        this.$store.state.Nodepartment === "No" &&
        this.activityType.departmentt == "请选择"
      ) {
        this.Toast("当前老师没有所在科室");
        return;
      }

      var isLimit = "";
      if (this.activity.numOfLimit == "") {
        isLimit = 0;
      } else {
        isLimit = 1;
      }

      var params = {
        classRoomName: this.activity.classRoomName,
        activityTime:
          "[{'startTime':'" +
          this.activity.startTime +
          "','endTime':'" +
          this.activity.endTime +
          "','classHour':'" +
          this.activity.classHour.slice(0, 1) +
          "'}]",
        type: this.activity.type, //this.activityTypeName
        title: this.activity.title,
        id: this.$route.params.id,
        isExtramural: this.activity.isExtramural,
        speaker: this.activity.speaker,
        mobile: this.activity.mobile,
        isSignUp: this.activity.isSignUp,
        isLimit: isLimit,
        numOfLimit: this.activity.numOfLimit,
        summary: this.activity.summary,
        detail: this.activity.detail,
        receiverType: this.receivingnum, // 有问题
        departmentCaId: this.$store.state.departmenty,
        content: JSON.stringify({
          specialText1: "" + this.activity.specialText1 + "",
          specialText2: "" + this.activity.specialText2 + "",
          specialText3: "" + this.activity.specialText3 + ""
        })
        // content:'{"specialText1": "'+this.activity.specialText1 +'","specialText2":"'+this.activity.specialText2+'","specialText3":"'+this.activity.specialText3+'"}'
      };
      if (params.id) {
        params.startTime = this.activity.startTime;
        params.endTime = this.activity.endTime;
      }
      this.utils.ajax({
        url: this.api.editTeaching,
        data: params,
        method: "POST",
        success: data => {
          setTimeout(() => {
            this.Toast("保存成功");
          }, 300);
          this.utils.goBack(this);
        }
      });
    },
    seeData() {
      //查看
      if (this.$route.params.type == "see") {
        this.shade = "shade";
        this.$store.state.seeAdd = "look";
        this.seeEdit();
        this.nameActy = false;
      }
      if (this.$route.params.type == "edit") {
        this.nameActy = true;
        this.seeEdit();
      }
    },
    seeEdit() {
      var params = {
        id: this.$route.params.id,
        isPreview: 1
      };
      this.utils.ajax({
        url: this.api.auditActivityDetail,
        data: params,
        method: "POST",
        success: data => {
          this.activity.type = data.type;
          this.activity.title = data.title;
          this.activity.isExtramural = data.isExtramural;
          this.activity.speaker = data.speaker;
          this.activity.mobile = data.mobile;
          this.activity.isSignUp = data.isSignUp;
          this.activity.numOfLimit = data.numOfLimit;
          this.summary.activity = data.summary;
          this.detail.activity = data.detail;
          this.activity.startTime = data.startTime;
          this.activity.endTime = data.endTime;
          this.activity.classHour = data.classHour + "小时";
          this.activity.classRoomName = data.classRoomName;
          this.receiverType = data.receiverType;
          // if (this.receiverType == 0) {
          //   this.nameActy = false;
          // }
          // if (this.receiverType == 1) {
          //   this.activity.receivingObj = [1];
          // }
          // if (this.receiverType == 2) {
          //   this.activity.receivingObj = [2];
          // }
          // if (this.receiverType == 3) {
          //   this.activity.receivingObj = [1, 2];
          // }
          // var departmentName = this.utils.getValueByKey(
          //   this.$store.state.departmentList,
          //   data.departmentCaId
          // );
          // this.activityType.departmentt = departmentName;
          if (this.activity.type == 2) {
            this.specialText1.activity = data.content.specialText1;
            this.specialText2.activity = data.content.specialText2;
            this.specialText3.activity = data.content.specialText3;
          }
          if (this.activity.type == 3) {
            this.specialText13.activity = data.content.specialText1;
            this.specialText23.activity = data.content.specialText2;
            this.specialText33.activity = data.content.specialText3;
          }
          if (this.activity.type == 4) {
            this.activity.specialTitle = data.content.specialText1;
            this.specialText14.activity = data.content.specialText2;
            this.specialText24.activity = data.content.specialText3;
          }
        }
      });
    },
    dataActivedd() {
      if (this.$store.state.departmentt) {
        this.activityType.departmentt = this.$store.state.departmentt;
      } else {
        this.activityType.departmentt = "请选择";
      }
      if (this.$store.state.DepartmentEcho == "Echo") {
        this.activity.type = this.$store.state.activityAdd.type;
        this.activity.title = this.$store.state.activityAdd.title;
        this.activity.isExtramural = this.$store.state.activityAdd.isExtramural;
        this.activity.speaker = this.$store.state.activityAdd.speaker;
        this.activity.mobile = this.$store.state.activityAdd.mobile;
        this.activity.isSignUp = this.$store.state.activityAdd.isSignUp;
        this.activity.numOfLimit = this.$store.state.activityAdd.numOfLimit;
        this.summary.activity = this.$store.state.activityAdd.summary;
        this.detail.activity = this.$store.state.activityAdd.detail;
        this.activity.startTime = this.$store.state.activityAdd.startTime;
        this.activity.endTime = this.$store.state.activityAdd.endTime;
        this.activity.classHour = this.$store.state.activityAdd.classHour;
        this.activity.classRoomName = this.$store.state.activityAdd.classRoomName;
        this.activity.receivingObj = this.$store.state.activityAdd.receivingObj;
        if (this.activity.type == 2) {
          this.specialText1.activity = this.$store.state.activityAdd.specialText1;
          this.specialText2.activity = this.$store.state.activityAdd.specialText2;
          this.specialText3.activity = this.$store.state.activityAdd.specialText3;
        }
        if (this.activity.type == 3) {
          this.specialText13.activity = this.$store.state.activityAdd.specialText1;
          this.specialText23.activity = this.$store.state.activityAdd.specialText2;
          this.specialText33.activity = this.$store.state.activityAdd.specialText3;
        }
        if (this.activity.type == 4) {
          this.specialText14.activity = this.$store.state.activityAdd.specialText1;
          this.specialText24.activity = this.$store.state.activityAdd.specialText2;
          this.specialText34.activity = this.$store.state.activityAdd.specialText3;
        }
      } else {
        this.$store.state.DepartmentEcho == "";
      }
    },
    checkLook() {
      this.activity.summary = this.summary.activity;
      this.activity.detail = this.detail.activity;
      if (this.activity.type == 2) {
        this.activity.specialText1 = this.specialText1.activity;
        this.activity.specialText2 = this.specialText2.activity;
        this.activity.specialText3 = this.specialText3.activity;
      }
      if (this.activity.type == 3) {
        this.activity.specialText1 = this.specialText13.activity;
        this.activity.specialText2 = this.specialText23.activity;
        this.activity.specialText3 = this.specialText33.activity;
      }
      if (this.activity.type == 4) {
        this.activity.specialText1 = this.activity.specialTitle;
        this.activity.specialText2 = this.specialText14.activity;
        this.activity.specialText3 = this.specialText24.activity;
      }
      this.$store.state.activityAdd = "";
      this.$store.state.activityAdd = this.activity;
      this.$router.push({
        name: "CheckLook",
        params: { }
      });
    }
  },
  created() {
    this.init();
    this.seeData();
    this.dataActivedd();
    if (this.$store.state.ActiveLook == "Look") {
      this.nameActy = false;
      this.shade = "shade";
    }
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

.radioname {
  width: 40%;
  display: flex;
  margin: 0 auto;
  justify-content: space-between;
}

.radioname span {
  font-size: 0.9rem;
}

.abstract {
  margin-top: 0.5rem;
  background: white;
  padding-top: 0.5rem;
}

.abstract span {
  font-size: 0.9rem;
  margin-left: 0.9rem;
}

.save {
  width: 95.6%;
  padding: 0.5rem;
  background: #187fe8;
  text-align: center;
  color: white;
  font-size: 1rem;
  line-height: 1rem;
}

.top {
  margin-top: 0.5rem;
}

.demo-popup .van-popup--right {
  width: 100%;
  height: 100%;
}
.shade {
  width: 100%;
  height: 112vh;
  background: rgba(255, 255, 255, 0);
  z-index: 1000;
  position: absolute;
  top: 0%;
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
.adminis{
  background: white;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.9rem;
}
.adminis p{
  margin: 0;
  padding: 0;
}
.adminis p:nth-of-type(1){
  width: 5rem;
  color:  #323233;
}
.adminis p:nth-of-type(2){
  text-align: right;
  color: #969799;
  width: 90%;
}
</style>
