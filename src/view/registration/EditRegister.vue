<template>
  <div @click="domClick">
    <van-nav-bar :title="title" class="header" :right-text="rightText" fixed left-arrow @click-left="onClickLeft" @click-right="onClickRight"/>
    <div class="layout_content" :class="showClass ? 'bottom16rem' : ''">
      <div class="head">基本信息</div>
      <ul>
        <li v-for="(obj, index) in this.modeData">
          <van-cell-group v-if="obj.type=='text'">
            <van-field
              v-model="obj.id=='normalDepartmentId' ? departmentName : obj.value"
              :label="obj.field"
              :readonly="obj.readonly"
              :placeholder="obj.placeholder"
              :name="obj.id"
              :required="obj.required"
            />
          </van-cell-group>
          <div v-if="obj.type=='file'">
            <label class="lable">{{obj.field}}</label>
            <div class="file_box">
              <div class="fileList" v-for="(file, index) in obj.value" @click="show_file($event, file.path, index)">
                <img :src="file.path" v-if="isImg(file.path)">
                <div v-if="!isImg(file.path)" class="boxfile">
                  <van-icon name="description"/>
                </div>
              </div>
              <div class="uploadFile">
                <van-uploader :disabled="obj.disabled" :after-read="onRead" accept="" multiple>
                  <van-icon name="plus" />
                </van-uploader>
              </div>
            </div>
          </div>
          <van-cell-group v-if="obj.type=='textarea'">
            <label class="lable">{{obj.field}}</label>
            <textarea 
              v-model="obj.value"
              :placeholder="obj.placeholder" 
              :name="obj.id"
              :readonly="obj.readonly"
              :required="obj.required"
              maxlength="1000"
              cols="50" rows="5">
            </textarea>
          </van-cell-group>
          <van-cell-group v-if="obj.type=='select'">
            <van-field
              :value="obj.value"
              :label="obj.field"
              readonly="readonly"
              :name="obj.id"
              :required="obj.required"
              :placeholder="obj.placeholder"
              @click="show(obj)"
            />
          </van-cell-group>
          <van-cell-group v-if="obj.type=='date'">
            <van-field
              :value="obj.value"
              :label="obj.field"
              placeholder="请选择时间"
              :name="obj.id"
              :required="obj.required"
              readonly='readonly'
              @click="show(obj)"
            />
          </van-cell-group>
        </li>
      </ul>
    </div>
    <van-picker v-if="moduleData.selectShow && !moduleData.disabled" 
      :columns="moduleData.option" 
      show-toolbar
      :title="moduleData.placeholder"
      @confirm='selectMajorConfirm'
      @cancel='cancel'
    />
    <van-datetime-picker v-if="moduleData.dateShow && !moduleData.disabled"
      v-model="currentDate"
      type="date"
      @confirm='dateConfirm'
      @cancel='cancel'
    />
    <van-dialog
      v-model="shwoFile.flag"
      show-cancel-button
      cancel-button-text="删除"
      @cancel="delFile()"
      confirm-button-text="关闭">
      <img v-if="isImg(shwoFile.url)" :src="shwoFile.url" width="100%">
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
/*出科鉴定*/
export default {
  name: "EditRegister",
  data() {
    return {
      title: '',
      rightText: '保存',
      modeData: [],
      currentDate: new Date(),
      moduleData: '',
      showClass: false,
      shwoFile: {
        flag: false,
        url: ""
      },
      endDate: this.$store.state.currentDepartment.endTime,
      startDate: this.$store.state.currentDepartment.startTime,
      departmentName: this.$store.state.currentDepartment.departmentName,
      norDePartmentId: this.$store.state.currentDepartment.normalDepartmentId,
      departmentCaId: this.$store.state.currentDepartment.departmentCaId
    };
  },
  created() {
    if (this.$store.state.EditRegisterNum) {
      this.$store.state.twoLevelType.forEach(i => {
        if (i.key == this.$store.state.EditRegisterNum) {
          this.title = i.value;
          return;
        }
      });
      this.chooseTemp(this.$store.state.EditRegisterNum);
      this.editRegister_temp_data();
      this.getSkills();
      this.getMainDiagnosis();
    }
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
      this.$store.state.EditRegisterObj = null;
    },
    onClickRight() {
      if (!this.$store.state.EditRegisterObj || !this.$store.state.EditRegisterObj.auditFlag) {
        this.saveRegister();
      }
    },
    editRegister_temp_data() {
      if (this.$store.state.EditRegisterObj) {
        console.log(this.$store.state.EditRegisterObj)
        this.modeData.forEach(item => {
          if (this.$store.state.EditRegisterObj.auditFlag) {
            item.disabled = true;
            item.readonly = 'readonly';
            this.rightText = null;
          }
          for (const key in this.$store.state.EditRegisterObj) {
            if (this.$store.state.EditRegisterObj.hasOwnProperty(key)) {
              if (item.id == key && key != "twoLevelType" && key != "oneLevelType") {
                item.value = this.$store.state.EditRegisterObj[key];
                if (item.type == "select") {
                  item.option.forEach(option => {
                    if (
                    option.text == this.$store.state.EditRegisterObj[key] 
                    || option.id == this.$store.state.EditRegisterObj[key]
                    || option.key == this.$store.state.EditRegisterObj[key]
                    ) {
                      option.selected = true;
                      item.value = option.text;
                    }
                  });
                }
              }
            }
          }
        });
        this.modeData[this.modeData.length - 1].value = this.$store.state.EditRegisterObj.filesVOs;
      } else {
        this.modeData[this.modeData.length - 1].value = [];
      }
    },
    saveRegister() {
      let obj = {
        departmentCaId: this.departmentCaId,
        departmentName: this.departmentName,
        normalDepartmentId: this.norDePartmentId,
        endDate: this.endDate,
        startDate: this.startDate,
        oneLevelType: "",
        twoLevelType: this.$store.state.EditRegisterNum
      };
      switch (this.$store.state.regsterMode) {
          case "disease" :
            obj.oneLevelType = '1';
            break;
          case "skill" :
            obj.oneLevelType = '2';
            break;
          case "other" :
            obj.oneLevelType = '3';
            break;
          default :
            return;
        }
      let flag = true;
      this.modeData.forEach((i) => {
        if (i.id == "normalDepartmentId" || i.id == "oneLevelType" || i.id == "twoLevelType") {
        } else {
          if (i.type == "select") {
            i.option.forEach(item => {
              if(item.selected) {
                obj[i.id] = item.key;
                if (i.id =="mainDiagnosis") {
                  obj.mainDiagnosis = item.text;
                  obj.mainDiagnosisCode = item.id;
                }
                if (i.id =="secondaryDiagnosis") {
                  obj.secondaryDiagnosis = item.text;
                  obj.secondaryDiagnosisCode = item.id;
                }
                if (i.id =="skill") {
                  obj.skill = item.text;
                  obj.skillCode = item.id;
                }
              }
            });
          } else {
            obj[i.id] = i.value || "";
          }
          if (!obj[i.id] && i.required && flag) {
            this.Toast(i.placeholder);
            flag = false;
          }
        }
      });
      if (flag) {
        let url = this.api.saveRegister
        if (this.$store.state.EditRegisterObj) {
          url = this.api.saveModifyEnrollment;
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              this.$store.state.EditRegisterObj[key] = obj[key];
            }
          }
          obj = this.$store.state.EditRegisterObj;
        }
        console.log(obj)
        this.utils.ajax({
          url: url,
          method: "post",
          data: obj,
          success: res => {
            this.utils.goBack(this);
            this.$store.state.EditRegisterObj = null;
          }
        });
      }
    },
    onRead(file) {
      let flag = true;
      let _formData = new FormData();
      _formData.append("file", file.file);
      this.utils.ajax({
        url: this.api.fileMD5,
        method: 'post',
        processData: false,
        contentType: false,
        data: _formData,
        success: (res) => {
          let flag = true;
          this.modeData[this.modeData.length - 1].value.forEach(item => {
            if (item.md5 == res.data.md5) {
              flag = false;
            }
          });
          if (flag) {
              this.utils.fileUploader(file, (data) => {
                this.modeData[this.modeData.length - 1].value.push({path: data.url, md5: res.data.md5, name: data.name})
              })
          } else {
            this.Toast("该文件已存在，请选择其他文件");
          }
        }
      })
    },
    isImg(str) {
      if (/.jpg/.test(str) || /.jpeg/.test(str) || /.png/.test(str) || /.gif/.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    show_file(e, url, index) {
      e.stopImmediatePropagation();
      this.shwoFile.flag = true;
      this.shwoFile.url = url;
      this.shwoFile.index = index;
    },
    delFile() {
      this.modeData[this.modeData.length - 1].value.splice(this.shwoFile.index, 1);
    },
    domClick(e) {
      if (this.moduleData) {
        if (e.target.name != this.moduleData.id) {
          this.hideAllPiker();
        }
      }
    },
    hideAllPiker() {
      this.showClass = false;
      this.moduleData.selectShow = false;
      this.moduleData.dateShow = false;
    },
    show(obj) {
      this.moduleData = obj;
      if (!obj.readonly) {
        this.hideAllPiker();
        if (obj.type == "date") {
          this.moduleData.dateShow = true;
        } else {
          this.moduleData.selectShow = true;
        }
        if (!this.webApp.isInIOS()) {
          this.showClass = true;
        }
        setTimeout(() => {
          let picker = document.querySelector('.van-picker');
          picker.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
          }
        }, 0);
      }
    },
    selectMajorConfirm(val, i) {
      this.moduleData.option[i].selected = true;
      this.moduleData.value = val.text;
      this.cancel();
    },
    cancel() {
      this.hideAllPiker();
      this.moduleData = "";
    },
    dateConfirm(val) {
      this.moduleData.value = val.getFullYear() + "-" + this.timeRule(val.getMonth(), 'month') + "-" + this.timeRule(val.getDate());
      this.cancel();
    },
    timeRule(num, mode) {
      if (mode == 'month') {
        num++;
      }
      if (num > 9) {
        return num;
      } else {
        return '0' + num;
      }
    },
    getSkills() {
      this.utils.ajax({
        url: this.api.surgeryList,
        method: "post",
        data: {
          normalDepartmentId: this.norDePartmentId
        },
        success: (res) => {
          if (res.length > 0) {
            res.forEach(item => {
              item.text = item.nameOfSurgery
              if (this.$store.state.EditRegisterObj) {
                if (item.text == this.$store.state.EditRegisterObj["skill"]) {
                  item.selected = true;
                }
              }
            });
          }
          this.modeData.forEach(item => {
            if (item.id == 'skill') {
              item.option = res;
            }
          });
        }
      })
    },
    getMainDiagnosis() {
      this.utils.ajax({
        url: this.api.diseaseList,
        method: "post",
        data: {
          normalDepartmentId: this.norDePartmentId
        },
        success: (res) => {
          console.log(res)
          if (res.length > 0) {
            res.forEach(item => {
              item.text = item.nameOfDisease
            });
          }
          this.modeData.forEach(item => {
            if (item.id == 'mainDiagnosis' || item.id == 'secondaryDiagnosis') {
              if (this.$store.state.EditRegisterObj) {
                res.forEach(i => {
                  if (i.text == this.$store.state.EditRegisterObj[item.id]) {
                    i.selected = true;
                  }
                });
              }
              item.option = res;
            }
          });
        }
      })
    },
    chooseTemp(num) {
      let modeArr = [];
      switch (num) {
        case "1":
          modeArr = [
            {
              field: "轮转科室",
              id: "normalDepartmentId",
              type: "text",
              readonly: true,
              required: true,
              placeholder: "请选择轮转科室"
            },
            {
              field: "分类",
              id: "oneLevelType",
              type: "text",
              value: "病种",
              readonly: true
            },
            {
              field: "手册类型",
              id: "twoLevelType",
              type: "text",
              value: this.title,
              readonly: true
            },
            {
              field: "病人姓名",
              id: "patientName",
              type: "text",
              placeholder: "请填写病人姓名"
            },
            {
              field: "住院号",
              id: "admissionNumber",
              type: "text",
              placeholder: "请填写住院号"
            },
            {
              field: "主要诊断",
              id: "mainDiagnosis",
              type: "select",
              required: true,
              selectShow: false, dateShow: false,
              placeholder: "请选择主要诊断",
              option: []
            },
            {
              field: "时间",
              id: "date",
              type: "date",
              selectShow: false, dateShow: false,
            },
            {
              field: "床号",
              id: "bedNo",
              type: "text",
              placeholder: "请填写床号"
            },
            {
              field: "管床",
              id: "isTubeBed",
              type: "select",
              required: true,
              selectShow: false, dateShow: false,
              placeholder: "请选择管床",
              option: [
                { key: "1", text: "是" },
                { key: "0", text: "否" }
              ]
            },
            {
              field: "病历内容",
              id: "content",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            { field: "附件上传", id: "filesVOs", value: "", type: "file" }
          ];
          break;
        case "2":
          modeArr = [
            {
              field: "轮转科室",
              id: "normalDepartmentId",
              type: "text",
              readonly: true,
              required: true,
              placeholder: "请选择轮转科室",
              selectShow: false, dateShow: false,
              option: []
            },
            {
              field: "分类",
              id: "oneLevelType",
              type: "text",
              value: "病种",
              readonly: true
            },
            {
              field: "手册类型",
              id: "twoLevelType",
              type: "text",
              value: this.title,
              readonly: true
            },
            {
              field: "病人姓名",
              id: "patientName",
              type: "text",
              placeholder: "请填写病人姓名"
            },
            {
              field: "住院号",
              id: "admissionNumber",
              type: "text",
              placeholder: "请填写住院号"
            },
            {
              field: "主要诊断",
              id: "mainDiagnosis",
              type: "select",
              required: true,
              selectShow: false, dateShow: false,
              placeholder: "请选择主要诊断",
              option: []
            },
            {
              field: "次要诊断",
              id: "secondaryDiagnosis",
              type: "select",
              selectShow: false, dateShow: false,
              placeholder: "请选择次要诊断",
              option: []
            },
            {
              field: "时间",
              id: "date",
              type: "date",
              selectShow: false, dateShow: false,
            },
            {
              field: "床号",
              id: "bedNo",
              type: "text",
              placeholder: "请填写床号"
            },
            {
              field: "书写大病历",
              id: "isWriteBigCase",
              type: "select",
              required: true,
              selectShow: false, dateShow: false,
              placeholder: "请选择书写大病历",
              option: [
                { key: "1", text: "是" },
                { key: "0", text: "否" }
              ]
            },
            {
              field: "管床",
              id: "isTubeBed",
              type: "select",
              required: true,
              selectShow: false, dateShow: false,
              placeholder: "请选择管床",
              option: [
                { key: "1", text: "是" },
                { key: "0", text: "否" }
              ]
            },
            {
              field: "就诊类型",
              id: "visitType",
              type: "select",
              selectShow: false, dateShow: false,
              placeholder: "请选择就诊类型",
              option: [
                {text: '首诊', key: 1},
                {text: '复诊', key: 2},
                {text: '入院', key: 3},
                {text: '出院', key: 4},
                {text: '手术', key: 5},
                {text: '影像', key: 6},
                {text: '化验', key: 7},
                {text: '体征', key: 8}
              ]
            },
            {
              field: "技能操作",
              id: "skill",
              type: "select",
              selectShow: false, dateShow: false,
              placeholder: "请选择技能操作",
              option: []
            },
            {
              field: "参与角色",
              id: "joinRole",
              type: "select",
              selectShow: false, dateShow: false,
              placeholder: "请选择参与角色",
              option: [
                {text: '术者', key: 1},
                {text: '一助', key: 2},
                {text: '二助', key: 3},
                {text: '三助', key: 4},
                {text: '观看', key: 5}
              ]
            },
            {
              field: "内容",
              id: "content",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            { field: "附件上传", id: "filesVOs", value: "", type: "file" }
          ];
          break;
        case "3":
        case "4":
          modeArr = [
            {
              field: "轮转科室",
              id: "normalDepartmentId",
              type: "text",
              readonly: true,
              required: true,
              placeholder: "请选择轮转科室",
              selectShow: false, dateShow: false,
              option: []
            },
            {
              field: "分类",
              id: "oneLevelType",
              type: "text",
              value: "病种",
              readonly: true
            },
            {
              field: "手册类型",
              id: "twoLevelType",
              type: "text",
              value: this.title,
              readonly: true
            },
            {
              field: "病人姓名",
              id: "patientName",
              type: "text",
              placeholder: "请填写病人姓名"
            },
            {
              field: "就诊号",
              id: "visitNumber",
              type: "text",
              placeholder: "请填写就诊号"
            },
            {
              field: "时间",
              id: "date",
              type: "date",
              selectShow: false, dateShow: false,
            },
            {
              field: "主要诊断",
              id: "mainDiagnosis",
              type: "select",
              required: true,
              selectShow: false, dateShow: false,
              placeholder: "请选择主要诊断",
              option: []
            },
            {
              field: "诊治内容",
              id: "content",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            { field: "附件上传", id: "filesVOs", value: "", type: "file" }
          ];
          break;
        case "5":
          modeArr = [
            {
              field: "轮转科室",
              id: "normalDepartmentId",
              type: "text",
              readonly: true,
              required: true,
              placeholder: "请选择轮转科室",
              selectShow: false, dateShow: false,
              option: []
            },
            {
              field: "分类",
              id: "oneLevelType",
              type: "text",
              value: "技能",
              readonly: true
            },
            {
              field: "手册类型",
              id: "twoLevelType",
              type: "text",
              value: this.title,
              readonly: true
            },
            {
              field: "病人姓名",
              id: "patientName",
              type: "text",
              placeholder: "请填写病人姓名"
            },
            {
              field: "住院号",
              id: "admissionNumber",
              type: "text",
              placeholder: "请填写住院号"
            },
            {
              field: "时间",
              id: "date",
              type: "date",
              selectShow: false, dateShow: false,
            },
            {
              field: "操作名称",
              id: "skill",
              type: "select",
              selectShow: false, dateShow: false,
              required: true,
              placeholder: "请选择操作名称",
              option: []
            },
            {
              field: "操作内容",
              id: "content",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            { field: "附件上传", id: "filesVOs", value: "", type: "file" }
          ];
          break;
        case "6":
          modeArr = [
            {
              field: "轮转科室",
              id: "normalDepartmentId",
              type: "text",
              readonly: true,
              required: true,
              placeholder: "请选择轮转科室",
              selectShow: false, dateShow: false,
              option: []
            },
            {
              field: "分类",
              id: "oneLevelType",
              type: "text",
              value: "技能",
              readonly: true
            },
            {
              field: "手册类型",
              id: "twoLevelType",
              type: "text",
              value: this.title,
              readonly: true
            },
            {
              field: "病人姓名",
              id: "patientName",
              type: "text",
              placeholder: "请填写病人姓名"
            },
            {
              field: "住院号",
              id: "admissionNumber",
              type: "text",
              placeholder: "请填写住院号"
            },
            {
              field: "时间",
              id: "date",
              type: "date",
              selectShow: false, dateShow: false,
            },
            {
              field: "手术名称",
              id: "skill",
              type: "select",
              selectShow: false, dateShow: false,
              required: true,
              placeholder: "请选择手术名称",
              option: []
            },
            {
              field: "参与角色",
              id: "joinRole",
              type: "select",
              selectShow: false, dateShow: false,
              placeholder: "请选择参与角色",
              option: [
                {text: '术者', key: 1},
                {text: '一助', key: 2},
                {text: '二助', key: 3},
                {text: '三助', key: 4},
                {text: '观看', key: 5}
              ]
            },
            {
              field: "手术内容",
              id: "content",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            { field: "附件上传", id: "filesVOs", value: "", type: "file" }
          ];
          break;
        case "7":
          modeArr = [
            {
              field: "轮转科室",
              id: "normalDepartmentId",
              type: "text",
              readonly: true,
              required: true,
              placeholder: "请选择轮转科室",
              selectShow: false, dateShow: false,
              option: []
            },
            {
              field: "分类",
              id: "oneLevelType",
              type: "text",
              value: "技能",
              readonly: true
            },
            {
              field: "手册类型",
              id: "twoLevelType",
              type: "text",
              value: this.title,
              readonly: true
            },
            {
              field: "病人姓名",
              id: "patientName",
              type: "text",
              placeholder: "请填写病人姓名"
            },
            {
              field: "就诊号",
              id: "visitNumber",
              type: "text",
              placeholder: "请填写就诊号"
            },
            {
              field: "时间",
              id: "date",
              type: "date",
              selectShow: false, dateShow: false,
            },
            {
              field: "主要诊断",
              id: "mainDiagnosis",
              type: "select",
              selectShow: false, dateShow: false,
              placeholder: "请选择主要诊断",
              option: []
            },
            {
              field: "操作名称",
              id: "skill",
              type: "select",
              selectShow: false, dateShow: false,
              required: true,
              placeholder: "请选择操作名称",
              option: []
            },
            {
              field: "操作内容",
              id: "content",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            { field: "附件上传", id: "filesVOs", value: "", type: "file" }
          ];
          break;
        case "8":
          modeArr = [
            {
              field: "轮转科室",
              id: "normalDepartmentId",
              type: "text",
              readonly: true,
              required: true,
              placeholder: "请选择轮转科室",
              selectShow: false, dateShow: false,
              option: []
            },
            {
              field: "分类",
              id: "oneLevelType",
              type: "text",
              value: "技能",
              readonly: true
            },
            {
              field: "手册类型",
              id: "twoLevelType",
              type: "text",
              value: this.title,
              readonly: true
            },
            {
              field: "病人姓名",
              id: "patientName",
              type: "text",
              placeholder: "请填写病人姓名"
            },
            {
              field: "就诊号",
              id: "visitNumber",
              type: "text",
              placeholder: "请填写就诊号"
            },
            {
              field: "时间",
              id: "date",
              type: "date",
              selectShow: false, dateShow: false,
            },
            {
              field: "主要诊断",
              id: "mainDiagnosis",
              type: "select",
              selectShow: false, dateShow: false,
              placeholder: "请选择主要诊断",
              option: []
            },
            {
              field: "手术名称",
              id: "skill",
              type: "select",
              selectShow: false, dateShow: false,
              required: true,
              placeholder: "请选择手术名称",
              option: []
            },
            {
              field: "参与角色",
              id: "joinRole",
              type: "select",
              selectShow: false, dateShow: false,
              placeholder: "请选择参与角色",
              option: [
                {text: '术者', key: 1},
                {text: '一助', key: 2},
                {text: '二助', key: 3},
                {text: '三助', key: 4},
                {text: '观看', key: 5}
              ]
            },
            {
              field: "手术内容",
              id: "content",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            { field: "附件上传", id: "filesVOs", value: "", type: "file" }
          ];
          break;
        case "9":
          modeArr = [
            {
              field: "轮转科室",
              id: "normalDepartmentId",
              type: "text",
              readonly: true,
              required: true,
              placeholder: "请选择轮转科室",
              selectShow: false, dateShow: false,
              option: []
            },
            {
              field: "分类",
              id: "oneLevelType",
              type: "text",
              value: "技能",
              readonly: true
            },
            {
              field: "手册类型",
              id: "twoLevelType",
              type: "text",
              value: this.title,
              readonly: true
            },
            {
              field: "病人姓名",
              id: "patientName",
              type: "text",
              placeholder: "请填写病人姓名"
            },
            {
              field: "就诊号",
              id: "visitNumber",
              type: "text",
              placeholder: "请填写就诊号"
            },
            {
              field: "时间",
              id: "date",
              type: "date",
              selectShow: false, dateShow: false,
            },
            {
              field: "主要诊断",
              id: "mainDiagnosis",
              type: "select",
              selectShow: false, dateShow: false,
              placeholder: "请选择主要诊断",
              option: []
            },
            {
              field: "操作名称",
              id: "skill",
              type: "select",
              selectShow: false, dateShow: false,
              required: true,
              placeholder: "请选择操作名称",
              option: []
            },
            {
              field: "检查内容",
              id: "content",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            { field: "附件上传", id: "filesVOs", value: "", type: "file" }
          ];
          break;
        case "10":
          modeArr = [
            {
              field: "轮转科室",
              id: "normalDepartmentId",
              type: "text",
              readonly: true,
              required: true,
              placeholder: "请选择轮转科室",
              selectShow: false, dateShow: false,
              option: []
            },
            {
              field: "分类",
              id: "oneLevelType",
              type: "text",
              value: "技能",
              readonly: true
            },
            {
              field: "手册类型",
              id: "twoLevelType",
              type: "text",
              value: this.title,
              readonly: true
            },
            {
              field: "病人姓名",
              id: "patientName",
              type: "text",
              placeholder: "请填写病人姓名"
            },
            {
              field: "就诊号",
              id: "visitNumber",
              type: "text",
              placeholder: "请填写就诊号"
            },
            {
              field: "时间",
              id: "date",
              type: "date",
              selectShow: false, dateShow: false,
            },
            {
              field: "主要诊断",
              id: "mainDiagnosis",
              type: "select",
              selectShow: false, dateShow: false,
              placeholder: "请选择主要诊断",
              option: []
            },
            {
              field: "操作名称",
              id: "skill",
              type: "select",
              selectShow: false, dateShow: false,
              required: true,
              placeholder: "请选择操作名称",
              option: []
            },
            {
              field: "抢救内容",
              id: "content",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            {
              field: "转归情况",
              id: "lapseToCondition",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            { field: "附件上传", id: "filesVOs", value: "", type: "file" }
          ];
          break;
        case "11":
          modeArr = [
            {
              field: "轮转科室",
              id: "normalDepartmentId",
              type: "text",
              readonly: true,
              required: true,
              placeholder: "请选择轮转科室",
              selectShow: false, dateShow: false,
              option: []
            },
            {
              field: "分类",
              id: "oneLevelType",
              type: "text",
              value: "其他",
              readonly: true
            },
            {
              field: "手册类型",
              id: "twoLevelType",
              type: "text",
              value: this.title,
              readonly: true
            },
            {
              field: "查房名称",
              id: "heading",
              type: "text",
              placeholder: "请填写查房名称"
            },
            {
              field: "时间",
              id: "date",
              type: "date",
              selectShow: false, dateShow: false,
            },
            {
              field: "查房内容",
              id: "content",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            {
              field: "时长",
              id: "burningTime",
              type: "select",
              selectShow: false, dateShow: false,
              placeholder: "请选择时长",
              option: [
                {text: '0.5', key: 0.5},
                {text: '1', key: 1},
                {text: '1.5', key: 1.5},
                {text: '2', key: 2},
                {text: '2.5', key: 2.5},
                {text: '3', key: 3},
                {text: '3.5', key: 3.5},
                {text: '4', key: 4},
                {text: '4.5', key: 4.5},
                {text: '5', key: 5},
              ]
            },
            {
              field: "主讲人",
              id: "speaker",
              type: "text",
              placeholder: "请填写主讲人"
            },
            { field: "附件上传", id: "filesVOs", value: "", type: "file" }
          ];
          break;
        case "13":
          modeArr = [
            {
              field: "轮转科室",
              id: "normalDepartmentId",
              type: "text",
              readonly: true,
              required: true,
              placeholder: "请选择轮转科室",
              selectShow: false, dateShow: false,
              option: []
            },
            {
              field: "分类",
              id: "oneLevelType",
              type: "text",
              value: "其他",
              readonly: true
            },
            {
              field: "手册类型",
              id: "twoLevelType",
              type: "text",
              value: this.title,
              readonly: true
            },
            {
              field: "时间",
              id: "date",
              type: "date",
              selectShow: false, dateShow: false,
            },
            {
              field: "地点",
              id: "location",
              required: true,
              type: "text",
              placeholder: "请填写地点"
            },
            {
              field: "学习内容",
              id: "content",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            { field: "附件上传", id: "filesVOs", value: "", type: "file" }
          ];
          break;
        case "14":
          modeArr = [
            {
              field: "轮转科室",
              id: "normalDepartmentId",
              type: "text",
              readonly: true,
              required: true,
              placeholder: "请选择轮转科室",
              selectShow: false, dateShow: false,
              option: []
            },
            {
              field: "分类",
              id: "oneLevelType",
              type: "text",
              value: "其他",
              readonly: true
            },
            {
              field: "手册类型",
              id: "twoLevelType",
              type: "text",
              value: this.title,
              readonly: true
            },
            {
              field: "时间",
              id: "date",
              type: "date",
              selectShow: false, dateShow: false,
            },
            {
              field: "奖励内容",
              id: "content",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            {
              field: "奖励部门",
              id: "awardDepartment",
              type: "text",
              placeholder: "请填写颁奖部门"
            },
            { field: "附件上传", id: "filesVOs", value: "", type: "file" }
          ];
          break;
        case "15":
          modeArr = [
            {
              field: "轮转科室",
              id: "normalDepartmentId",
              type: "text",
              readonly: true,
              required: true,
              placeholder: "请选择轮转科室",
              selectShow: false, dateShow: false,
              option: []
            },
            {
              field: "分类",
              id: "oneLevelType",
              type: "text",
              value: "其他",
              readonly: true
            },
            {
              field: "手册类型",
              id: "twoLevelType",
              type: "text",
              value: this.title,
              readonly: true
            },
            {
              field: "讲座名称",
              id: "heading",
              type: "text",
              placeholder: "请填写讲桌名称"
            },
            {
              field: "时间",
              id: "date",
              type: "date",
              selectShow: false, dateShow: false,
            },
            {
              field: "地点",
              id: "location",
              required: true,
              type: "text",
              placeholder: "请填写地址"
            },
            {
              field: "讲座内容",
              id: "content",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            {
              field: "时长",
              id: "burningTime",
              type: "select",
              selectShow: false, dateShow: false,
              placeholder: "请选择时长",
              option: [
                {text: '0.5', key: 0.5},
                {text: '1', key: 1},
                {text: '1.5', key: 1.5},
                {text: '2', key: 2},
                {text: '2.5', key: 2.5},
                {text: '3', key: 3},
                {text: '3.5', key: 3.5},
                {text: '4', key: 4},
                {text: '4.5', key: 4.5},
                {text: '5', key: 5},
              ]
            },
            {
              field: "主讲人",
              id: "speaker",
              type: "text",
              placeholder: "请填写主讲人"
            },
            { field: "附件上传", id: "filesVOs", value: "", type: "file" }
          ];
          break;
        case "16":
          modeArr = [
            {
              field: "轮转科室",
              id: "normalDepartmentId",
              type: "text",
              readonly: true,
              required: true,
              placeholder: "请选择轮转科室",
              selectShow: false, dateShow: false,
              option: []
            },
            {
              field: "分类",
              id: "oneLevelType",
              type: "text",
              value: "其他",
              readonly: true
            },
            {
              field: "手册类型",
              id: "twoLevelType",
              type: "text",
              value: this.title,
              readonly: true
            },
            {
              field: "讨论主题",
              id: "heading",
              type: "text",
              placeholder: "请填写讨论主题"
            },
            {
              field: "时间",
              id: "date",
              type: "date",
              selectShow: false, dateShow: false,
            },
            {
              field: "地点",
              id: "location",
              required: true,
              type: "text",
              placeholder: "请填写地点"
            },
            {
              field: "病人信息",
              id: "patientInfo",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            {
              field: "讨论内容",
              id: "content",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            {
              field: "时长",
              id: "burningTime",
              type: "select",
              selectShow: false, dateShow: false,
              placeholder: "请选择时长",
              option: [
                {text: '0.5', key: 0.5},
                {text: '1', key: 1},
                {text: '1.5', key: 1.5},
                {text: '2', key: 2},
                {text: '2.5', key: 2.5},
                {text: '3', key: 3},
                {text: '3.5', key: 3.5},
                {text: '4', key: 4},
                {text: '4.5', key: 4.5},
                {text: '5', key: 5},
              ]
            },
            {
              field: "主持人",
              id: "speaker",
              type: "text",
              placeholder: "请主持人"
            },
            { field: "附件上传", id: "filesVOs", value: "", type: "file" }
          ];
          break;
        case "17":
          modeArr = [
            {
              field: "轮转科室",
              id: "normalDepartmentId",
              type: "text",
              readonly: true,
              required: true,
              placeholder: "请选择轮转科室",
              selectShow: false, dateShow: false,
              option: []
            },
            {
              field: "分类",
              id: "oneLevelType",
              type: "text",
              value: "其他",
              readonly: true
            },
            {
              field: "手册类型",
              id: "twoLevelType",
              type: "text",
              value: this.title,
              readonly: true
            },
            {
              field: "讨论主题",
              id: "heading",
              type: "text",
              placeholder: "请填写讨论主题"
            },
            {
              field: "时间",
              id: "date",
              type: "date",
              selectShow: false, dateShow: false,
            },
            {
              field: "地点",
              id: "location",
              required: true,
              type: "text",
              placeholder: "请填写地点"
            },
            {
              field: "病人信息",
              id: "patientInfo",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            {
              field: "入院时间",
              id: "admissionDate",
              type: "date",
              placeholder: "请选择入院时间",
            },
            {
              field: "死亡时间",
              id: "demiseDate",
              type: "date",
              placeholder: "请选择死亡时间",
            },
            {
              field: "最后诊断",
              id: "finalDiagnosis",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            {
              field: "讨论内容",
              id: "content",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            {
              field: "时长",
              id: "burningTime",
              type: "select",
              selectShow: false, dateShow: false,
              placeholder: "请选择时长",
              option: [
                {text: '0.5', key: 0.5},
                {text: '1', key: 1},
                {text: '1.5', key: 1.5},
                {text: '2', key: 2},
                {text: '2.5', key: 2.5},
                {text: '3', key: 3},
                {text: '3.5', key: 3.5},
                {text: '4', key: 4},
                {text: '4.5', key: 4.5},
                {text: '5', key: 5},
              ]
            },
            {
              field: "主持人",
              id: "speaker",
              type: "text",
              placeholder: "请填写主持人"
            },
            { field: "附件上传", id: "filesVOs", value: "", type: "file" }
          ];
          break;
        case "18":
          modeArr = [
            {
              field: "轮转科室",
              id: "normalDepartmentId",
              type: "text",
              readonly: true,
              required: true,
              placeholder: "请选择轮转科室",
              selectShow: false, dateShow: false,
              option: []
            },
            {
              field: "分类",
              id: "oneLevelType",
              type: "text",
              value: "其他",
              readonly: true
            },
            {
              field: "手册类型",
              id: "twoLevelType",
              type: "text",
              value: this.title,
              readonly: true
            },
            {
              field: "会诊名称",
              id: "heading",
              type: "text",
              placeholder: "请填写会诊名称"
            },
            {
              field: "时间",
              id: "date",
              type: "date",
              selectShow: false, dateShow: false,
            },
            {
              field: "地点",
              id: "location",
              required: true,
              type: "text",
              placeholder: "请填写地点"
            },
            {
              field: "病人信息",
              id: "patientInfo",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            {
              field: "主要诊断",
              id: "mainDiagnosis",
              type: "select",
              selectShow: false, dateShow: false,
              required: true,
              placeholder: "请选择主要诊断",
              option: []
            },
            {
              field: "会诊内容",
              id: "content",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            { field: "附件上传", id: "filesVOs", value: "", type: "file" }
          ];
          break;
        case "19":
          modeArr = [
            {
              field: "轮转科室",
              id: "normalDepartmentId",
              type: "text",
              readonly: true,
              required: true,
              placeholder: "请选择轮转科室",
              selectShow: false, dateShow: false,
              option: []
            },
            {
              field: "分类",
              id: "oneLevelType",
              type: "text",
              value: "其他",
              readonly: true
            },
            {
              field: "手册类型",
              id: "twoLevelType",
              type: "text",
              value: this.title,
              readonly: true
            },
            {
              field: "科研名称",
              id: "heading",
              type: "text",
              placeholder: "请填写科研名称"
            },
            {
              field: "科研内容",
              id: "content",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            {
              field: "带头人",
              id: "principal",
              type: "text",
              placeholder: "请填写带头人"
            },
            {
              field: "科研角色",
              id: "joinRole",
              type: "select",
              selectShow: false, dateShow: false,
              placeholder: "请选择科研角色",
              option: [
                {text: '第一研究员', key: 6},
                {text: '第二研究员', key: 7},
                {text: '第三研究员', key: 8},
                {text: '第四研究员', key: 9},
                {text: '第五研究员', key: 10},
                {text: '第六研究员', key: 11}
              ]
            },
            { field: "附件上传", id: "filesVOs", value: "", type: "file" }
          ];
          break;
        case "20":
          modeArr = [
            {
              field: "轮转科室",
              id: "normalDepartmentId",
              type: "text",
              readonly: true,
              required: true,
              placeholder: "请选择轮转科室",
              selectShow: false, dateShow: false,
              option: []
            },
            {
              field: "分类",
              id: "oneLevelType",
              type: "text",
              value: "其他",
              readonly: true
            },
            {
              field: "手册类型",
              id: "twoLevelType",
              type: "text",
              value: this.title,
              readonly: true
            },
            {
              field: "论文名称",
              id: "heading",
              type: "text",
              placeholder: "请填写论文名称"
            },
            {
              field: "发表时间",
              id: "date",
              type: "date",
              selectShow: false, dateShow: false,
            },
            {
              field: "发表刊物",
              id: "publications",
              type: "text",
              placeholder: "请填写发表刊物"
            },
            {
              field: "类型",
              id: "type",
              type: "select",
              selectShow: false, dateShow: false,
              placeholder: "请选择类型",
              option: [
                {text: '专业期刊发表的文章', key: 1},
                {text: '学术会议交流文章', key: 2},
                {text: '院（所）学术会议交流文章', key: 3},
                {text: '提交文章', key: 4}
              ]
            },
            {
              field: "论文类型",
              id: "thesisType",
              type: "select",
              selectShow: false, dateShow: false,
              placeholder: "请选择论文类型",
              option: [
                {text: '专题', key: 1},
                {text: '辩论', key: 2},
                {text: '综述', key: 3},
                {text: '综合', key: 4}
              ]
            },
            { field: "附件上传", id: "filesVOs", value: "", type: "file" }
          ];
          break;
        case "21":
          modeArr = [
            {
              field: "轮转科室",
              id: "normalDepartmentId",
              type: "text",
              readonly: true,
              required: true,
              placeholder: "请选择轮转科室",
              selectShow: false, dateShow: false,
              option: []
            },
            {
              field: "分类",
              id: "oneLevelType",
              type: "text",
              value: "其他",
              readonly: true
            },
            {
              field: "手册类型",
              id: "twoLevelType",
              type: "text",
              value: this.title,
              readonly: true
            },
            {
              field: "时间",
              id: "date",
              type: "date",
              selectShow: false, dateShow: false,
            },
            {
              field: "指导方式",
              id: "guideWay",
              type: "select",
              selectShow: false, dateShow: false,
              placeholder: "请选择指导方式",
              option: [
                {text: '座谈', key: 1},
                {text: '工作汇报', key: 2},
                {text: '读书报告', key: 3},
                {text: '科研论文指导', key: 4},
                {text: '病案讨论', key: 5},
                {text: '临床技能指导', key: 6},
                {text: '人文指导', key: 7},
                {text: '其他', key: 8},
              ]
            },
            {
              field: "指导内容",
              id: "content",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            { field: "附件上传", id: "filesVOs", value: "", type: "file" }
          ];
          break;
        case "22":
          modeArr = [
            {
              field: "轮转科室",
              id: "normalDepartmentId",
              type: "text",
              readonly: true,
              required: true,
              placeholder: "请选择轮转科室",
              selectShow: false, dateShow: false,
              option: []
            },
            {
              field: "分类",
              id: "oneLevelType",
              type: "text",
              value: "病种",
              readonly: true
            },
            {
              field: "手册类型",
              id: "twoLevelType",
              type: "text",
              value: this.title,
              readonly: true
            },
            {
              field: "病人姓名",
              id: "patientName",
              type: "text",
              placeholder: "请填写病人姓名"
            },
            {
              field: "就诊号",
              id: "visitNumber",
              type: "text",
              placeholder: "请填写就诊号"
            },
            {
              field: "时间",
              id: "date",
              type: "date",
              selectShow: false, dateShow: false,
            },
            {
              field: "主要诊断",
              id: "mainDiagnosis",
              type: "select",
              selectShow: false, dateShow: false,
              required: true,
              placeholder: "请选择主要诊断",
              option: []
            },
            {
              field: "望闻问切",
              id: "fourWaysDiagnosis",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            {
              field: "辅助检查",
              id: "assistInspect",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            {
              field: "诊治内容",
              id: "content",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            {
              field: "处方",
              id: "prescription",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            {
              field: "医嘱",
              id: "doctorAdvice",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            { field: "附件上传", id: "filesVOs", value: "", type: "file" }
          ];
          break;
        case "23":
          modeArr = [
            {
              field: "轮转科室",
              id: "normalDepartmentId",
              type: "text",
              readonly: true,
              required: true,
              placeholder: "请选择轮转科室",
              selectShow: false, dateShow: false,
              option: []
            },
            {
              field: "分类",
              id: "oneLevelType",
              type: "text",
              value: "病种",
              readonly: true
            },
            {
              field: "手册类型",
              id: "twoLevelType",
              type: "text",
              value: this.title,
              readonly: true
            },
            {
              field: "病人姓名",
              id: "patientName",
              type: "text",
              placeholder: "请填写病人姓名"
            },
            {
              field: "住院号",
              id: "admissionNumber",
              type: "text",
              placeholder: "请填写住院号"
            },
            {
              field: "主要诊断",
              id: "mainDiagnosis",
              type: "select",
              selectShow: false, dateShow: false,
              required: true,
              placeholder: "请选择轮转科室",
              option: []
            },
            {
              field: "时间",
              id: "date",
              type: "date",
              selectShow: false, dateShow: false,
            },
            {
              field: "床号",
              id: "bedNo",
              type: "text",
              placeholder: "请填写床号"
            },
            {
              field: "住院志内容",
              id: "doctorAdvice",
              type: "textarea",
              value: "",
              placeholder: "最多可输入1000字"
            },
            { field: "附件上传", id: "filesVOs", value: "", type: "file" }
          ];
          break;
      }
      this.modeData = modeArr;
    }
  }
};
</script>

<style scoped>
  .layout_content {
    background: #fff;
    padding-bottom: 200px;
  }
  .clear {
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
    font-size: 1.5rem;
    color: red;
    height: 1.5rem;
    width: 1.5rem;
  }
  .bottom16rem{
  }
  .head {
    background: #f0f0f0;
    padding: 0.5rem 0.8rem;
    font-size: 0.95rem;
  }
  .last-li [class*=van-hairline]::after {
    border: none;
  }
  [class*=van-hairline]::after {
    border: none;
    border-bottom: 0.01rem solid #e1e1e1;
  }
  .lable {
    display: block;
    padding: 0.5rem 1rem;
  }
  textarea {
    border-radius: 0.5rem;
    border: 0.04rem solid #e1e1e1;
    width: 90%;
    margin-left: 1rem;
    margin-bottom: 0.5rem;
  }
  .van-icon-plus {
    font-size: 3rem;
    color: #cfcbcb;
  }
  .van-uploader {
    font-size: 3rem;
    border-radius: 0.5rem;
    border: 0.04rem solid #e1e1e1;
    width: 3rem;
    height: 3rem;
  }
  .van-picker{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 16rem;
    z-index: 10;
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
  .fileList{
    width: 3rem;
    /* height: 3rem; */
    position: relative;
    margin-right: 0.573rem;
    margin-bottom: 0.5rem;
  }
  .fileList img {
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
  }
  input:disabled {
    color: #333333 !important;
  }
  .boxfile {
    font-size: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #7a7a7a;
  }
  .van-uploader__input {
    z-index: 1;
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
</style>
