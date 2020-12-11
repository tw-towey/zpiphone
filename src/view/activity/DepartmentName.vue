<template>
  <div>
    <van-nav-bar title="接收人" class="header" fixed left-arrow @click-left="onClickLeft" />
    <div class="layout_content">
      <div class="headBox">
        <div class="headBoxTop">
          <div @click="flage && pressFloor()">
            <p>+</p>
            <p>全院</p>
          </div>
          <div @click="flage && pressMajor()">
            <p>+</p>
            <p>指定专业</p>
          </div>
          <div @click="flage && pressOffice()">
            <p>+</p>
            <p>指定科室</p>
          </div>
          <div @click="flage && pressAdd()">
            <p>+</p>
            <p>指定人员</p>
          </div>
        </div>
      </div>
      <van-search
        v-model="activity.Search"
        placeholder="请输入姓名、手机号、人员类型"
        show-action
        shape="round"
        @search="onSearch"
        :label="activity.talents==''? '共0人' : '共'+activity.talents+'人'"
      >
        <div slot="action" @click="onSearch">搜索</div>
      </van-search>
      <div class="centreBox">
        <ul class="ulBOx">
          <li>
            <p>姓名</p>
          </li>
          <li>
            <p>手机号</p>
          </li>
          <li>
            <p>人员类型</p>
          </li>
          <li class="empty" @click="flage && emptycli()">
            <p>清除</p>
          </li>
        </ul>
      </div>
      <div class="content">
        <div class="Nostyle" v-if="Nostyle">暂无数据......</div>
        <ul>
          <li v-for="(item,index) in linstObj" :key="index">
            <p>{{item.humanName}}</p>
            <p>{{item.cellPhone}}</p>
            <p>{{item.role}}</p>
            <p @click="flage && removeCLick(index,item)">删除</p>
          </li>
        </ul>
      </div>

      <div class="kong"></div>
      <div class="button" @click="preserved()" v-if="flage">
        <p>确定</p>
      </div>
      <div class="dialogStyle" v-if="career">
        <div class="specialtyStyle" @click="SpecifyClick()">
          <p style="width:4rem;">指定专业</p>
          <p>{{activity.value?activity.value:'请选择'}}</p>
        </div>
        <div class="student">
          <!-- 参培年份 -->
          <div class="border" @click="toggleArrStudent()">
            <span>学生</span>
            <span>全选（全不选）</span>
          </div>
          <div class="grade">
            <van-checkbox-group v-model="activity.years" class="ActivityTraining">
              <span class="spanClass">参培年份：</span>
              <div v-for="(item,index) in utils.nextFourYears()" :key="index">
                <van-cell :title="item.name" clickable>
                  <van-checkbox :name="item.value" class="ActivityTraining" ref="checkboxesAnd">
                    <img
                      slot="icon"
                      slot-scope="props"
                      :src="props.checked ? iconimg.active : iconimg.normal"
                      class="dadioimg"
                    />
                    <span>{{item.value}}</span>
                  </van-checkbox>
                </van-cell>
              </div>
            </van-checkbox-group>
          </div>
          <!-- 人员类型 -->
          <div class="grade">
            <van-checkbox-group v-model="activity.Personnel" class="ActivityTraining">
              <span class="spanClass">人员类型:</span>
              <div v-for="(item,index) in $store.state.tabTypeCodeList" :key="index">
                <van-cell :title="item.name" clickable>
                  <van-checkbox :name="item.value" class="ActivityTraining" ref="checkboxesAct">
                    <img
                      slot="icon"
                      slot-scope="props"
                      :src="props.checked ? iconimg.active : iconimg.normal"
                      class="dadioimg"
                    />
                    <span>{{item.value}}</span>
                  </van-checkbox>
                </van-cell>
              </div>
            </van-checkbox-group>
          </div>
        </div>

        <div class="specialtyStyle" @click="changeShowStatus('signYearsshow',true)">
          <p style="width:4rem;">培训年限</p>
          <p>{{activity.trainingYears?activity.trainingYears:'请选择'}}</p>
        </div>

        <div class="student">
          <!-- 参培年份 -->
          <div class="border" @click="toggle()">
            <span>老师</span>
            <span>全选（全不选）</span>
          </div>
          <div class="grade">
            <van-checkbox-group v-model="activity.casting" class="ActivityTraining">
              <span class="spanClass">角色类型：</span>
              <div v-for="(item,index) in roleType" :key="index">
                <van-cell :title="item.name" clickable>
                  <van-checkbox :name="item.value" class="ActivityTraining" ref="checkTeacher">
                    <img
                      slot="icon"
                      slot-scope="props"
                      :src="props.checked ? iconimg.active : iconimg.normal"
                      class="dadioimg"
                    />
                    <span>{{item.value}}</span>
                  </van-checkbox>
                </van-cell>
              </div>
            </van-checkbox-group>
          </div>
        </div>
        <div class="buttonClick">
          <p @click="buttonConfirm('career')">确定</p>
          <p @click="buttonOff()">取消</p>
        </div>
        <van-popup v-model="showTraining" position="bottom" :overlay="true">
          <div class="selectBox">
            <ul>
              <li>
                <p @click="selectcancel()" class="seleccolorp">取消</p>
              </li>
              <li>
                <p class="selectP">{{textHtml}}</p>
              </li>
              <li @click="confirmEntityy()">
                <p class="seleccolorp">确定</p>
              </li>
            </ul>
            <div class="selectContent">
              <div class="stelectpadding">
                <div
                  v-for="(item, index) in majorsCheckName"
                  class="seletstyle"
                  :key="index"
                  @click="selectClick(item,index)"
                >
                  <p :class="item.checked? 'selectedStyle':''">{{item.value}}</p>
                  <van-icon v-if="item.checked" name="success" />
                </div>
              </div>
            </div>
          </div>
        </van-popup>
      </div>
      <!-- 分割线 -------------------- -->
      <div class="dialogStyle" v-if="officeShow">
        <div class="specialtyStyle" @click="officeClick()">
          <p style="width:4rem;">指定科室</p>
          <p>{{activity.office?activity.office:'请选择'}}</p>
        </div>
        <div class="student">
          <!-- 参培年份 -->
          <div class="border" @click="toggleArr()">
            <span>学生</span>
            <span>全选（全不选）</span>
          </div>
          <div class="grade">
            <van-checkbox-group v-model="activity.years" class="ActivityTraining">
              <span class="spanClass">参培年份：</span>
              <div v-for="(item,index) in utils.nextFourYears()" :key="index">
                <van-cell :title="item.name" clickable>
                  <van-checkbox :name="item.value" class="ActivityTraining" ref="checkboxesAnd">
                    <img
                      slot="icon"
                      slot-scope="props"
                      :src="props.checked ? iconimg.active : iconimg.normal"
                      class="dadioimg"
                    />
                    <span>{{item.value}}</span>
                  </van-checkbox>
                </van-cell>
              </div>
            </van-checkbox-group>
          </div>
          <!-- 人员类型 -->
          <div class="grade">
            <van-checkbox-group v-model="activity.Personnel" class="ActivityTraining">
              <span class="spanClass">人员类型:</span>
              <div v-for="(item,index) in $store.state.tabTypeCodeList" :key="index">
                <van-cell :title="item.name" clickable>
                  <van-checkbox :name="item.value" class="ActivityTraining" ref="checkboxesAct">
                    <img
                      slot="icon"
                      slot-scope="props"
                      :src="props.checked ? iconimg.active : iconimg.normal"
                      class="dadioimg"
                    />
                    <span>{{item.value}}</span>
                  </van-checkbox>
                </van-cell>
              </div>
            </van-checkbox-group>
          </div>
        </div>
        <div class="specialtyStyle" @click="changeShowStatus('signYearsshow',true)">
          <p style="width:4rem;">培训年限</p>
          <p>{{activity.trainingYears?activity.trainingYears:'请选择'}}</p>
        </div>
        <div class="student">
          <!-- 参培年份 -->
          <div class="border" @click="toggleopu()">
            <span>老师</span>
            <span>全选（全不选）</span>
          </div>
          <div class="grade">
            <van-checkbox-group v-model="activity.casting" class="ActivityTraining">
              <span class="spanClass">角色类型：</span>
              <div v-for="(item,index) in roleType" :key="index">
                <van-cell :title="item.name" clickable>
                  <van-checkbox :name="item.value" class="ActivityTraining" ref="checkTeacher">
                    <img
                      slot="icon"
                      slot-scope="props"
                      :src="props.checked ? iconimg.active : iconimg.normal"
                      class="dadioimg"
                    />
                    <span>{{item.value}}</span>
                  </van-checkbox>
                </van-cell>
              </div>
            </van-checkbox-group>
          </div>
        </div>
        <div class="buttonClick">
          <p @click="buttonConfirm('officeShow')">确定</p>
          <p @click="buttonOfficeOff()">取消</p>
        </div>
        <van-popup v-model="showEntity" position="bottom" :overlay="true">
          <div class="selectBox">
            <ul>
              <li>
                <p @click="selectcancel()" class="seleccolorp">取消</p>
              </li>
              <li>
                <p class="selectP">{{textHtml}}</p>
              </li>
              <li @click="confirmEntit()">
                <p class="seleccolorp">确定</p>
              </li>
            </ul>
            <div class="selectContent">
              <div class="stelectpadding">
                <div
                  v-for="(item, index) in officeCheck"
                  :key="index"
                  class="seletstyle"
                  @click="selectClick(item,index)"
                >
                  <p :class="item.checked? 'selectedStyle':''">{{item.value}}</p>
                  <van-icon v-if="item.checked" name="success" />
                </div>
              </div>
            </div>
          </div>
        </van-popup>
      </div>

      <!-- 分割 指定人员 -->
      <div class="dialogStyle" v-if="officeType">
        <div class="officeSearch">
          <van-search
            v-model="activity.officeSearch"
            placeholder="请输入姓名、手机号、人员类型"
            show-action
            shape="round"
            @search="onSearchoffice"
          >
            <div slot="action" @click="onSearchoffice">搜索</div>
          </van-search>
          <div class="conentO">
            <ul>
              <li v-for="(item,index) in OfficeObj" :key="index">
                <p class="p">{{item.humanName}}</p>
                <p class="p">{{item.cellPhone}}</p>
                <p class="p">{{item.role}}</p>
                <div>
                  <p v-if="item.checked">已选</p>
                  <p v-if="!item.checked" class="addOf" @click="AddCLick(index,item)">+</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="buttonClick">
          <p @click="OfficeConfirm()">确定</p>
          <p @click="OfficeOff()">取消</p>
        </div>
      </div>
    </div>
      <van-popup v-model="signYearsshow" position="bottom" :overlay="true">
        <van-picker
          show-toolbar
          title="培训年限"
          :columns="trainingYears"
          :default-index="typeDefaultIndex || 0"
          @confirm="confirmsignUp"
          @cancel="changeShowStatus('signYearsshow',false)"
        />
          </van-popup>
    <!-- 分割 指定人员 -->
  </div>
</template>

<script>
export default {
  name: "DepartmentName",
  components: {},
  data() {
    return {
      activity: {
        talents: "",
        Search: "",
        value: "",
        key: "",
        office: "",
        officeIds: "",
        Training: [],
        Personnel: [],
        casting: [],
        student: [],
        years: [],
        officeSearch: "",
        trainingYears:'',
      },
      signYearsshow: false,
      typeDefaultIndex: 0,
      trainingYears:[
        { text: "", value: "全部" },
        { text: "12月", value: "12" },
        { text: "24月", value: "24" },
        { text: "33月", value: "33" },
        { text: "36月", value: "36" }
      ],
      listArr: [{ key: 1, value: "学生" }],
      list: [{ key: 2, value: "老师" }],
      icon: {
        normal: require("../../assets/images/home/pic_ses-01.svg"),
        active: require("../../assets/images/home/pic_ses-02.svg")
      },
      iconimg: {
        normal: require("../../assets/images/home/pic_cks-01.svg"),
        active: require("../../assets/images/home/pic_cks-02.svg")
      },
      recipients: [
        { key: 1, value: "指定专业" },
        { key: 2, value: "指定科室" }
      ],
      roleType: [
        { key: "mentor", value: "师承导师" },
        { key: "teacher", value: "带教老师" },
        { key: "tutor", value: "责任导师" }
      ],
      ObjectArr: {
        personnel: ""
      },
      sacedata: [],
      linstObj: [],
      dataObj: [],
      OfficeObj: [],
      SearchObj: [],
      OfficeObjLinst: [],
      career: false,
      textHtml: "",
      majorsCheckName: [],
      officeCheck: [],
      showTraining: false, // 指定专业
      showEntity: false, // 指定科室
      searchDepartments: "",
      isStudent: false,
      checkedStudent: false,
      teacherCheck: false,
      officeShow: false,
      officeType: false,
      Nostyle: false,
      departmentIdsList: [],
      flage: true,
      majorsObjLinst: ""
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    deepCopy(obj) {
      var result = Array.isArray(obj) ? [] : {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === "object" && obj[key] !== null) {
            result[key] = this.deepCopy(obj[key]); //递归复制
          } else {
            result[key] = obj[key];
          }
        }
      }
      return result;
    },
    preserved() {
      let arr = [];
      this.dataObj.forEach((item, index) => {
        if (!item.isremove) {
          arr.push(item);
        }
      });
      this.dataObj = arr;
      this.$store.state.linstObjArr = arr;
      this.utils.goBack(this);
    },
    press() {
      if (this.$store.state.linstObjArr) {
        this.dataObj = this.deepCopy(this.$store.state.linstObjArr);
        this.activity.talents = this.$store.state.linstObjArr.length;
        this.linstObj = this.deepCopy(this.dataObj);
        this.activity.talents = this.linstObj.length;
        if (this.linstObj.length) {
          this.Nostyle = false;
        } else {
          this.Nostyle = true;
        }
      }
    },
    pressMajor() {
      console.log(4444444);
      this.career = true;
      this.activity.years = [];
      this.activity.student = [];
      this.activity.Personnel = [];
      this.activity.casting = [];
      this.activity.teacher = [];
      this.activity.value = "";
      this.activity.trainingYears = "";
      this.majorsCheckName.forEach(item => {
        item.checked = false;
      });
    },
    pressAdd() {
      this.officeType = true;
    },
    onSearch() {
      var Rex = RegExp(this.activity.Search);
      let arrsea = [];
      this.dataObj.forEach((item, index) => {
        if (!item.isremove) {
          arrsea.push(item);
        }
      });
      this.dataObj = arrsea;
      if (this.utils.isEmpty(this.activity.Search)) {
        this.linstObj = this.deepCopy(this.dataObj);
        this.activity.talents = this.linstObj.length;
      } else {
        var arr = [];
        this.dataObj.forEach(item => {
          if (
            Rex.test(item.humanName) ||
            Rex.test(item.role) ||
            Rex.test(item.cellPhone)
          ) {
            arr.push({
              cellPhone: item.cellPhone,
              checked: item.checked,
              humanId: item.humanId,
              role: item.idType ? item.idType : item.role,
              humanName: item.humanName
            });
          }
        });
        this.linstObj = [...arr];
        this.activity.talents = this.linstObj.length;
      }
    },
    pressFloor() {
      this.utils.ajax({
        url: this.api.findHuman,
        data: {
          // selectTypes: [1, 2, 3]
        },
        method: "POST",
        success: data => {
          if (data.content) {
            let arr = [];
            data.content.forEach(item => {
              arr.push({
                cellPhone: item.cellPhone,
                checked: item.checked,
                humanId: item.humanId,
                role: item.idType ? item.idType : item.role,
                humanName: item.humanName
              });
            });
            let dataObj = [...this.dataObj, ...arr];
            let linstObj = [...this.linstObj, ...arr];
            this.dataObj = this.uniq(dataObj);
            this.linstObj = this.uniq(linstObj);
            this.activity.talents = this.linstObj.length;
            if (this.linstObj.length) {
              this.Nostyle = false;
            } else {
              this.Nostyle = true;
            }
          }
        }
      });
    },
    confirmsignUp(data) {
      this.activity.trainingYears = data.value;
      this.changeShowStatus('signYearsshow',false)
    },
    changeShowStatus(name, status) {
      //更改弹出层状态
      this[name] = status;
    },
    removeCLick(index, i) {
      this.linstObj.splice(index, 1);
      this.dataObj.forEach(item => {
        if (i.humanId == item.humanId) {
          item.isremove = true;
        }
      });
      this.activity.talents = this.linstObj.length;
    },
    SpecifyClick() {
      this.showTraining = true;
      this.textHtml = "指定专业";
    },
    selectcancel() {
      if (this.textHtml == "指定专业") {
        this.changeShowStatus("showTraining", false);
      }
      if (this.textHtml == "指定科室") {
        this.changeShowStatus("showEntity", false);
      }
    },
    confirmEntityy(data) {
      let arr = [];
      let arrkey = [];
      let majors = "";
      this.activity.value = [];
      this.majorsCheckName.forEach(item => {
        if (item.checked == true) {
          arr.push(item.value);
          arrkey.push(item.key);
        }
      });
      this.activity.value = arr.join(",");
      this.activity.key = arrkey.join(",");
      this.changeShowStatus("showTraining", false);
    },
    confirmEntit() {
      let arr = [];
      let arrkey = [];
      let majors = "";
      this.activity.office = [];
      this.officeCheck.forEach(item => {
        if (item.checked == true) {
          arr.push(item.value);
          arrkey.push(item.key);
        }
      });
      this.activity.office = arr.join(",");
      this.activity.officeIds = arrkey.join(",");
      this.changeShowStatus("showEntity", false);
    },
    changeShowStatus(name, status) {
      //更改弹出层状态
      this[name] = status;
    },
    selectClick(item, index) {
      item.checked = !item.checked;
    },
    buttonOff() {
      this.changeShowStatus("career", false);
    },
    buttonConfirm(ame) {
      let idTypes = [];
      let roleTypes = [];
      let _this = this;
      _this.activity.Personnel.forEach(i => {
        this.$store.state.tabTypeCodeList.forEach(item => {
          if (item.value == i) {
            idTypes.push(item.key);
          }
        });
      });
      this.activity.casting.forEach(i => {
        this.roleType.forEach(item => {
          if (item.value == i) {
            roleTypes.push(item.key);
          }
        });
      });
      let obj = {
        traineeYears: this.activity.years,
        idTypes: idTypes,
        roleTypes: roleTypes,
        trainingYears: this.activity.trainingYears
      };
      if (ame == "career") {
        if (this.activity.key == "") {
          _this.Toast("请选择专业");
          return;
        }
        obj.traineeMajorCodes = this.activity.key.split(",");
      }
      if (ame == "officeShow") {
        if (_this.activity.officeIds == "") {
          _this.Toast("请选择科室");
          return;
        }
        obj.departmentIds = this.activity.officeIds.split(",");
        obj.teachingTime = this.$store.state.activityAdd.startTime;
      }
      if (
        this.activity.years.length ||
        this.activity.Personnel.length ||
        this.activity.casting.length
      ) {
      } else {
        this.Toast("请选择学生或老师");
        return;
      }
      if (this.isStudent == true) {
        obj.selectTypes = [1];
      }
      if (this.teacherCheck == true) {
        obj.selectTypes = [2];
      }
      if (this.teacherCheck == true && this.isStudent == true) {
        obj.selectTypes = [1, 2];
      }
      this.utils.ajax({
        url: this.api.findHuman,
        data: obj,
        method: "POST",
        success: data => {
          if (data.content.length) {
            let arr = [];
            data.content.forEach(item => {
              arr.push({
                cellPhone: item.cellPhone,
                checked: item.checked,
                humanId: item.humanId,
                role: item.idType ? item.idType : item.role,
                humanName: item.humanName
              });
            });
            let dataObj = [...this.dataObj, ...arr];
            let linstObj = [...this.linstObj, ...arr];
            this.dataObj = this.uniq(dataObj);
            this.linstObj = this.uniq(linstObj);
            this.activity.talents = this.linstObj.length;
            if (this.linstObj.length) {
              this.Nostyle = false;
            } else {
              this.Nostyle = true;
            }
          } else {
          }
          if (ame == "officeShow") {
            this.officeShow = false;
          }
          if (ame == "career") {
            this.career = false;
          }
        }
      });
    },
    toggle(index) {
      if (!this.teacherCheck == true) {
        this.activity.teacher = ["老师"];
        this.activity.casting = ["师承导师", "带教老师", "责任导师"];
      } else {
        this.activity.casting = [];
        this.activity.teacher = [];
      }
      this.teacherCheck = !this.teacherCheck;
    },
    toggleopu(index) {
      if (!this.teacherCheck == true) {
        this.activity.teacher = ["老师"];
        this.activity.casting = ["师承导师", "带教老师", "责任导师"];
      } else {
        this.activity.casting = [];
        this.activity.teacher = [];
      }
      this.teacherCheck = !this.teacherCheck;
    },
    toggleArr(index) {
      if (!this.isStudent == true) {
        this.activity.student = ["学生"];
        this.activity.years = this.utils.nextFourYears().map((item,index)=>{
            return item.value * 1
        });
        this.activity.Personnel = [
          "本单位人",
          "社会人",
          "研究生",
          "委培人员",
          "并轨专硕"
        ];
      } else {
        this.activity.years = [];
        this.activity.Personnel = [];
        this.activity.student = [];
      }
      this.isStudent = !this.isStudent;
    },
    toggleArrStudent() {
      if (!this.isStudent == true) {
        this.activity.student = ["学生"];
        this.activity.years = this.utils.nextFourYears().map((item,index)=>{
            return item.value * 1
        });
        this.activity.Personnel = [
          "本单位人",
          "社会人",
          "研究生",
          "委培人员",
          "并轨专硕"
        ];
      } else {
        this.activity.years = [];
        this.activity.Personnel = [];
        this.activity.student = [];
      }
      this.isStudent = !this.isStudent;
    },
    pressOffice() {
      this.officeShow = true;
      this.activity.years = [];
      this.activity.student = [];
      this.activity.Personnel = [];
      this.activity.casting = [];
      this.activity.teacher = [];
      this.activity.office = "";
      this.officeCheck.forEach(item => {
        item.checked = false;
      });
    },
    officeClick() {
      this.showEntity = true;
      this.textHtml = "指定科室";
    },
    buttonOfficeOff() {
      this.officeShow = false;
    },
    AddCLick(index) {
      this.OfficeObj.forEach((item, key) => {
        if (index == key) {
          item.checked = true;
        }
      });
    },

    uniq(array) {
      // 去重
      var result = [];
      var obj = {};
      for (var i = 0; i < array.length; i++) {
        if (!obj[array[i].humanId]) {
          result.push(array[i]);
          obj[array[i].humanId] = true;
        }
      }
      return result;
    },
    OfficeConfirm() {
      let obj = [];
      this.OfficeObj.forEach(item => {
        if (item.checked) {
          obj.push(item);
        }
      });
      let dataObj = [...this.dataObj, ...obj];
      let linstObj = [...this.linstObj, ...obj];
      this.dataObj = this.uniq(dataObj);
      this.linstObj = this.uniq(linstObj);
      this.activity.talents = this.linstObj.length;
      if (this.linstObj.length) {
        this.Nostyle = false;
      } else {
        this.Nostyle = true;
      }
      this.officeType = false;
      this.activity.officeSearch = "";
    },
    OfficeOff() {
      this.officeType = false;
      this.activity.officeSearch = "";
    },
    onSearchoffice() {
      let obj = {
        humanName: this.activity.officeSearch
      };
      this.utils.ajax({
        url: this.api.findHuman,
        data: obj,
        method: "POST",
        success: data => {
          if (data.content) {
            this.OfficeObjLinst = [];
            data.content.forEach(item => {
              this.OfficeObjLinst.push({
                cellPhone: item.cellPhone,
                humanId: item.humanId,
                humanName: item.humanName,
                role: item.idType ? item.idType : item.role,
                checked: false
              });
            });
            this.OfficeObjLinst.forEach((item, index) => {
              this.linstObj.forEach((i, k) => {
                if (item.humanId == i.humanId) {
                  item.checked = true;
                }
              });
            });
            this.OfficeObj = this.OfficeObjLinst;
          }
        }
      });
    },
    emptycli() {
      this.linstObj = [];
      this.dataObj = [];
      this.activity.talents = this.linstObj.length;
      this.dataObj.forEach(item => {
        item.isremove = true;
      });
    },
    init() {
      this.utils.ajax({
          url: this.api.studentdepartment,
          method: "POST",
          success: data => {
            this.searchDepartments = data;
            this.searchDepartments.forEach(i => {
              this.officeCheck.push({
                key: i.caId,
                value: i.name,
                checked: false
              });
            });
          }
        });
      if (this.$store.state.userInfo.currentRole.code == "student") {
        // 学生科室
        this.majorsCheckName = []; // 学生专业
        this.utils.ajax({
          url: this.api.userInfo,
          method: "POST",
          success: data => {
            this.majorsObjLinst = data.human;
            this.majorsCheckName.push({
              key: this.majorsObjLinst.traineeMajorCode,
              value: this.majorsObjLinst.traineeMajorName,
              checked: false
            });
          }
        });
      } else {
        this.majorsObjLinst = this.$store.state.majors;
        this.majorsCheckName = [];
        this.majorsObjLinst.forEach(i => {
          this.majorsCheckName.push({
            key: i.key,
            value: i.value,
            checked: false
          });
        });
      }
    }
  },
  created() {
    this.init();
    this.press();
    if (this.$store.state.Csoes == "see") {
      this.flage = false;
    }
  }
};
</script>
<style scoped>
p {
  margin: 0;
  padding: 0;
}
.headBox {
  background: white;
  padding: 0.5rem 0.9rem;
}
.headBoxTop {
  display: flex;
  justify-content: space-between;
}
.headBoxTop div {
  display: flex;
}
.headBoxTop div p:nth-of-type(1) {
  background: #1a7fe9;
  border-radius: 50%;
  width: 1.2rem;
  height: 1.2rem;
  text-align: center;
  color: white;
  font-size: 1.4rem;
  line-height: 1.2rem;
}
.addOf {
  background: #1a7fe9;
  border-radius: 50%;
  width: 1.2rem;
  height: 1.2rem;
  text-align: center;
  color: white;
  font-size: 1.4rem;
  line-height: 1.2rem;
  margin-left: 2rem;
}
.headBoxTop div p:nth-of-type(2) {
  margin-left: 0.5rem;
}
.headBoxbotton {
  display: flex;
  width: 98%;
}
.button {
  width: 100%;
  color: white;
  font-size: 0.9rem;
  text-align: center;
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
}
.button p {
  background: #1a7fe9;
  width: 100%;
  padding: 0.5rem 0;
  margin: 0;
  font-size: 1rem;
}
.centreBox {
  padding: 0.5rem 0.9rem;
  background: white;
  margin-top: 0.2rem;
}
.ulBOx {
  display: flex;
  justify-content: space-between;
}
.centreBox li:nth-last-of-type(1) {
  width: 2.5rem;
}
.ulBOx li {
  width: 7rem;
  text-align: center;
}
.content {
  margin-top: 0.2rem;
  background: white;
  height: 32rem;
  overflow-y: auto;
}

.content li {
  padding: 0.5rem 0.9rem;
  display: flex;
  justify-content: space-between;
  border-bottom: 0.01rem solid #ccc;
}
.content li p {
  width: 7rem;
  text-align: center;
}
.content li p:nth-last-of-type(1) {
  background: red;
  color: white;
  height: 1.4rem;
  width: 2.5rem;
  text-align: center;
}
.conentO {
  margin-top: 0.2rem;
  background: white;
  height: 36rem;
  overflow-y: auto;
}
.conentO li {
  padding: 0.5rem 0.9rem;
  display: flex;
  text-align: center;
}
.conentO li .p {
  width: 7rem;
}
.conentO li div {
  width: 6rem;
}

.dialogStyle {
  width: 100%;
  height: 100%;
  background: white;
  position: absolute;
  top: 0;
}
.radioAdd {
  background: white;
  padding: 0.5rem 0.8rem;
  display: flex;
}
.radioname {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.dadioimg {
  width: 1.125rem;
  height: 1.125rem;
}
.specialtyStyle {
  padding: 0.5rem 0.9rem;
  display: flex;
}
.Nostyle {
  text-align: center;
}
.specialtyStyle p:nth-of-type(2) {
  margin-left: 1rem;
  color: #969799;
  word-wrap: break-word;
  width: 80%;
  text-align: right;
}
.selectBox {
  height: 17rem;
}
.seleccolorp {
  color: #71b6fc;
}
.kong {
  height: 2rem;
  width: 100%;
}
.selectContent {
  height: 14rem;
  overflow-y: scroll;
  text-align: center;
}
.seletstyle {
  padding: 0.5rem 0.9rem;
  display: flex;
  justify-content: space-between;
}
.selectBox ul {
  width: 98%;
  display: flex;
  justify-content: space-between;
  padding: 0.2rem;
}
.selectedStyle {
  /* background: black; */
  color: black !important;
  font-weight: 700;
  font-size: 15px;
}
.dadioimg {
  width: 1.125rem;
  height: 1.125rem;
}
.grade {
  padding: 0rem 0.8rem;
  background: white;
}
.ActivityTraining {
  display: flex;
  flex-wrap: wrap;
}
.spanClass {
  margin-top: 0.5rem;
}
.student >>> .van-cell {
  padding: 0.6rem 0.5rem;
}
.buttonClick {
  display: flex;
  width: 100%;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  background: white;
}
.buttonClick p {
  text-align: center;
  background: #1a7fe9;
  width: 49.7%;
  font-size: 1rem;
  color: white;
  padding: 0.5rem 0;
}
.empty {
  color: white;
  background: red;
}
.border {
  background: #2e8ff4;
  padding: 0.5rem 0.9rem;
  display: flex;
  justify-content: space-between;
  color: white;
}
/* 
}
.grade {
  padding: 0.5rem 0.8rem;
  background: white;
}
.ActivityTraining {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

 */
</style>
