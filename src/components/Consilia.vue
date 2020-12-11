<template>
  <div>
    <div class>
      <ul>
        <li v-for="(obj, index) in this.modeData" @click="showObj(obj)">
          <van-cell v-if="obj.type=='cell'" :title="obj.field" size="large" />
          <div :class="obj.imgname" v-if="obj.type=='img'"></div>
          <van-cell-group v-if="obj.type=='select'" @click="show(obj)">
            <van-field
              :value="obj.value"
              :label="obj.field"
              readonly="readonly"
              disabled="disabled"
              :name="obj.id"
              :required="obj.required"
              :placeholder="obj.placeholder"
            />
          </van-cell-group>
          <van-cell-group v-if="obj.type=='selected'">
            <van-field
              :value="obj.value"
              :label="obj.field"
              readonly="readonly"
              :name="obj.id"
              :required="obj.required"
              :placeholder="obj.placeholder"
            />
          </van-cell-group>
          <div class="radioAdd" v-if="obj.type=='textt'">
            <van-cell :title="obj.field" :required="obj.required" class="about" />
            <van-radio-group v-model="obj.isExtramural" class="radioname">
              <div v-for="item in obj.option" @click="click(obj)">
                <van-radio :name="item.key" :disabled="obj.disabled">
                  <img
                    slot="icon"
                    slot-scope="props"
                    :src="props.checked ? icon.active : icon.normal"
                    class="dadioimg"
                  />
                  <span>{{item.value}}</span>
                </van-radio>
              </div>
            </van-radio-group>
            <div class="inp" v-show="inpShow">
              <input type="number" :disabled="obj.disabled" v-model="treatmentNum" />
              <span>次</span>
            </div>
          </div>
          <div class="radioAdd" v-if="obj.type=='textType'">
            <van-cell :title="obj.field" :required="obj.required" class="about" />
            <van-radio-group v-model="obj.isExtramural" class="radioname">
              <div v-for="item in obj.option">
                <van-radio :name="item.key" :disabled="obj.disabled">
                  <img
                    slot="icon"
                    slot-scope="props"
                    :src="props.checked ? icon.active : icon.normal"
                    class="dadioimg"
                  />
                  <span>{{item.value}}</span>
                </van-radio>
              </div>
            </van-radio-group>
            <div class="inp" v-show="inpShow">
              <input type="number" :disabled="obj.disabled" v-model="treatmentNum" />
              <span>次</span>
            </div>
          </div>

          <div :class="obj.class" v-if="obj.type=='img'"></div>
          <div class="radioAdd" v-if="obj.type=='radio'">
            <van-cell :title="obj.field" :required="obj.required" class="about" />
            <van-radio-group v-model="obj.isExtramural" class="radioname">
              <div v-for="item in obj.extramural">
                <van-radio :name="item.key" :disabled="obj.disabled">
                  <img
                    slot="icon"
                    slot-scope="props"
                    :src="props.checked ? icon.active : icon.normal"
                    class="dadioimg"
                  />
                  <span>{{item.value}}</span>
                </van-radio>
              </div>
            </van-radio-group>
            <div class="inp" v-show="inpShow">
              <input type="text" :disabled="obj.disabled" v-model="treatmentNum" />
              <span>次</span>
            </div>
          </div>
          <van-cell-group v-if="obj.type=='text'">
            <van-field
              v-model="obj.id=='normalDepartmentId' ? departmentName : obj.value"
              :label="obj.field"
              :readonly="obj.readonly"
              :placeholder="obj.placeholder"
              :name="obj.id"
              :required="obj.required"
              :maxlength="obj.maxlength?obj.maxlength:''"
            />
          </van-cell-group>
          <div v-if="obj.type=='file'" class="filename">
            <label class="lable">{{obj.field}}</label>
            {{obj.attachmentList}}
            <div class="file_box">
              <div
                class="fileList"
                v-for="(file, index) in obj.value"
                @click="show_file($event, file.path, index)"
              >
                <img :src="file.path" v-if="isImg(file.path)" />
                <div v-if="!isImg(file.path)" class="boxfile">
                  <van-icon name="description" />
                </div>
              </div>
              <div class="uploadFile">
                <van-uploader :disabled="obj.disabled" :after-read="onRead" accept multiple>
                  <van-icon name="plus" />
                </van-uploader>
              </div>
            </div>
          </div>
          <div v-if="obj.type=='filevs'" class="filename">
            <label class="lable">{{obj.field}}</label>
            {{obj.attachmentList}}
            <div class="file_box">
              <div
                class="fileList"
                v-for="(file, index) in obj.value"
                @click="show_filetea($event, file.path, index)"
              >
                <img :src="file.path" v-if="isImgtea(file.path)" />
                <div v-if="!isImgtea(file.path)" class="boxfile">
                  <van-icon name="description" />
                </div>
              </div>
            </div>
          </div>

          <van-cell-group v-if="obj.type=='textarea'">



            <label class="lable">
              <span style="color:red;" v-if="obj.required">*</span>
              {{obj.field}}
            </label>
            <div class="tawee" >
           <van-field
              type="textarea"
              v-model="obj.value"
              :placeholder="obj.placeholder"
              :name="obj.id"
              :readonly="obj.readonly"
              :required="obj.required"
              :maxlength="obj.maxlength"
              cols="50"
              :rows="obj.rows?obj.rows:5"
            />
            </div>
            


            <!-- <textarea
              v-model="obj.value"
              :placeholder="obj.placeholder"
              :name="obj.id"
              :readonly="obj.readonly"
              :required="obj.required"
              :maxlength="obj.maxlength"
              cols="50"
              rows="5"
            ></textarea> -->
          </van-cell-group>
          <van-cell-group v-if="obj.type=='textareaRemark'">
            <label class="lable">{{obj.field}}</label>
            <textarea
              v-model="dataSystem.auditRemark"
              :placeholder="obj.placeholder"
              :name="obj.id"
              :readonly="dataSystem.status>2?true:false"
              :required="obj.required"
              :maxlength="obj.maxlength"
              cols="50"
              rows="5"
            ></textarea>
          </van-cell-group>
          <!-- <van-cell-group v-if="obj.type=='date'" @click="show(obj)">
            <van-field
              :value="obj.value"
              :label="obj.field"
              :placeholder="obj.placeholder"
              :name="obj.id"
              :required="obj.required"
              readonly="readonly"
              disabled="disabled"
            />
          </van-cell-group>-->
          <van-cell-group v-if="obj.type=='dateText'">
            <van-field
              v-model="obj.value"
              :required="obj.required"
              clearable
              :label="obj.field"
              :name="obj.id"
              :placeholder="obj.placeholder"
              :disabled="obj.disabled"
              :readonly="obj.readonly"
            />
          </van-cell-group>
          <van-cell-group v-if="obj.type=='dateobj'" @click="showg(obj)">
            <van-field
              :value="obj.value"
              :label="obj.field"
              :placeholder="obj.placeholder"
              :name="obj.id"
              :required="obj.required"
              readonly="readonly"
              disabled="disabled"
            />
          </van-cell-group>
          <van-cell-group v-if="obj.type=='datetime'">
            <van-field
              :value="obj.value"
              :label="obj.field"
              :placeholder="obj.placeholder"
              :name="obj.id"
              :required="obj.required"
              readonly="readonly"
            />
          </van-cell-group>
          <div class="button" v-if="obj.type=='button'">
            <p @click="clickLeft(obj.click)">{{obj.submit}}</p>
            <p @click="onClickRight(obj.click)">{{obj.save}}</p>
          </div>
          <div class="button" v-if="obj.type=='buttonLinst'">
            <template v-if="dataSystem.status>2?false:true">
              <p @click="clickLeft(obj.click)">{{obj.submit}}</p>
              <p @click="onClickRight(obj.click)">{{obj.save}}</p>
            </template>
          </div>
          <div class="btn" v-if="obj.type=='btn'">
            <p @click="clickLeft(obj.click)">{{obj.submit}}</p>
          </div>
          <div class="shade" v-if="obj.type=='shade'"></div>
        </li>
      </ul>
    </div>
    <van-datetime-picker
      v-if="moduleData.datetimeShow && !moduleData.disabled"
      v-model="currentDateobj"
      type="datetime"
      :title="moduleData.placeholder"
      @confirm="dateConfirm"
      @cancel="cancel"
      :min-date="minDate"
    />
    <van-datetime-picker
      v-if="moduleData.dateShow && !moduleData.disabled"
      v-model="currentDate"
      type="date"
      :title="moduleData.placeholder"
      @confirm="dateConfirmtime"
      @cancel="cancel"
      :min-date="minDate"
    />
    <van-picker
      v-if="moduleData.selectShow && !moduleData.disabled"
      :columns="moduleData.option"
      show-toolbar
      :title="moduleData.placeholder"
      @confirm="selectMajorConfirm"
      @cancel="cancel"
    />
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
    <van-dialog v-model="shwoFiletea.flag">
      <div style="height:20rem" v-if="isImgtea(shwoFiletea.url)">
        <img v-if="isImgtea(shwoFiletea.url)" :src="shwoFiletea.url" width="100%" />
      </div>
      <div class="fileImg" v-if="!isImgtea(shwoFiletea.url)">
        <van-icon name="description" />
      </div>
      <div class="title-file" v-if="!isImgtea(shwoFiletea.url)">该文件类型暂不支持查看</div>
    </van-dialog>
  </div>
</template>

<script>
/*出科鉴定*/
export default {
  name: "EditRegister",
  props: ["ConsiliaData", "clickLinstA"],
  data() {
    return {
      title: "",
      modeData: [],
      currentDate: new Date(),
      isHasFile:{},
      currentDateobj: new Date(),
      minDate: new Date(1960, 0, 1),
      moduleData: "",
      shwoFile: {
        flag: false,
        url: ""
      },
      defaultr: "",
      shwoFiletea: {
        flag: false,
        url: ""
      },
      system: {},
      icon: {
        normal: require("../assets/images/home/pic_ses-01.svg"),
        active: require("../assets/images/home/pic_ses-02.svg")
      },
      inpShow: false,
      dataSystem: "",
      attachmentList: "",
      treatmentNum: "",
      textareaRemark: ""
    };
  },
  created() {
    this.addData();
  },
  methods: {
    click(obj) {
      console.log(obj, "ssss");

      if (obj.isExtramural == 2) {
        this.inpShow = true;
        obj.value = "";
      } else {
        this.inpShow = false;
      }
    },
    addData() {
      if (this.ConsiliaData == 1) {
        // 添加
        this.chooseTemp(this.ConsiliaData);
      }
      if (this.ConsiliaData == 5) {
        //   撤销
        this.editors(this.clickLinstA.id);
      }
      if (this.ConsiliaData == 6) {
        //   草稿
        this.editors(this.clickLinstA.id);
      }
      if (this.ConsiliaData == 2) {
        // 不通过
        this.editors(this.clickLinstA.id);
      }
      if (this.ConsiliaData == 3) {
        // 通过
        this.editors(this.clickLinstA.id);
      }
      if (this.ConsiliaData == 4) {
        this.editors(this.clickLinstA);
      }
    },
    editors(id) {
      // 编辑  // 回显
      let params = {
        id: id
      };
      this.utils.ajax({
        url: this.api.clinicalRecordFind,
        data: params,
        method: "POST",
        success: data => {
          data.birthday.substr(0, 10);
          this.dataSystem = data;
          this.dataSystem.birthday = data.birthday.substr(0, 10);
          if (data.treatmentType == 2) {
            this.inpShow = true;
            this.treatmentNum = data.treatmentNum;
          } else {
            this.inpShow = false;
          }
          if (this.ConsiliaData == 4) {
            // this.dataSystem.auditRemark = ""; //审核的时候清空掉老师评语
          }
          setTimeout(() => {
            this.chooseTemp(this.ConsiliaData);
          }, 300);
        }
      });
    },
    onClickRight(obj) {
      if (obj == "submit") {
        // 保存
        this.preserved();
      }
      if (obj == "sendBack") {
        //导师通过
        this.TeacherReview(3);
      }
    },
    clickLeft(obj) {
      if (obj == "submit") {
        // 提交
        this.saveRegister();
      }
      if (obj == "repeals") {
        // 撤销
        this.repealsClick();
      }
      if (obj == "sendBack") {
        //导师退回
        this.TeacherReview(4);
      }
    },
    TeacherReview(status) {
      if (this.utils.trim(this.dataSystem.auditRemark) == "") {
        this.Toast("请输入导师评语");
      } else {
        let params = {
          auditRemark: this.dataSystem.auditRemark,
          id: this.clickLinstA,
          status: status
        };
        this.utils.ajax({
          url: this.api.teacherReview,
          method: "post",
          data: params,
          success: res => {
            this.utils.goBack(this);
          }
        });
      }
    },
    repealsClick() {
      // 撤销
      var obj = {
        id: this.clickLinstA.id
      };
      let url = this.api.clinicalRecordRevoke;
      this.utils.ajax({
        url: url,
        method: "post",
        data: obj,
        success: res => {
          this.Toast("撤销成功");
          setTimeout(() => {
            this.utils.goBack(this);
          }, 500);
        }
      });
    },
    preserved() {
      // 保存草稿
      var obj = {};
      if (!this.clickLinstA) {
        obj = {
          treatmentNum: this.treatmentNum
        };
      } else {
        obj = {
          treatmentNum: this.treatmentNum,
          id: this.clickLinstA.id
        };
      }
      let flag = true;
      this.modeData.forEach(i => {
        if (i.type == "select") {
          if (this.dataSystem) {
            if (i.id == "gender") {
              obj[i.id] = this.dataSystem.gender;
            }
            if (i.id == "solarTerms") {
              obj[i.id] = this.dataSystem.solarTerms;
            }
          } else {
          }
          i.option.forEach(item => {
            if (item.selected) {
              obj[i.id] = item.key;
            }
          });
        } else {
          obj[i.id] = i.value || "";
        }

        if (i.type == "textt") {
          obj[i.id] = i.isExtramural;
        }

        if (!obj[i.id] && i.required && flag) {
          this.Toast(i.placeholder);
          flag = false;
        }
        if (i.id == "birthday") {
          if (i.value == "") {
          } else {
            if (!this.RQcheck(i.value)) {
              this.Toast("请输入正确的日期，请按 1988-01-01 格式录入");
              flag = false;
            }
          }
        }
        if (i.id == "treatmentType") {
          if (i.isExtramural == 2 && this.treatmentNum == "") {
            this.Toast("请输入复诊次数");
            flag = false;
          }
        }
      });
      if (flag) {
        let url = this.api.clinicalRecordSave;
        this.utils.ajax({
          url: url,
          method: "post",
          data: obj,
          success: res => {
            this.Toast("保存成功");
            setTimeout(() => {
              this.utils.goBack(this);
            }, 500);
          }
        });
      }
    },
    RQcheck(RQ) {
      var date = RQ;
      var result = date.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
      if (result == null) return false;
      var d = new Date(result[1], result[3] - 1, result[4]);
      return (
        d.getFullYear() == result[1] &&
        d.getMonth() + 1 == result[3] &&
        d.getDate() == result[4]
      );
    },
    saveRegister() {
      // 提交
      var obj = {};
      if (!this.clickLinstA) {
        obj = {
          treatmentNum: this.treatmentNum
        };
      } else {
        obj = {
          treatmentNum: this.treatmentNum,
          id: this.clickLinstA.id
        };
      }
      let flag = true;
      this.modeData.forEach(i => {
        if (i.type == "select") {
          if (this.dataSystem) {
            if (i.id == "gender") {
              obj[i.id] = this.dataSystem.gender;
            }
            if (i.id == "solarTerms") {
              obj[i.id] = this.dataSystem.solarTerms;
            }
          } else {
          }
          i.option.forEach(item => {
            if (item.selected) {
              obj[i.id] = item.key;
            }
          });
        } else {
          obj[i.id] = i.value || "";
        }
        if (i.type == "textt") {
          obj[i.id] = i.isExtramural;
        }
        if (!obj[i.id] && i.required && flag) {
          this.Toast(i.placeholder);
          flag = false;
        }
        if (i.id == "birthday") {
          if (i.value == "") {
          } else {
            if (!this.RQcheck(i.value)) {
              this.Toast("请输入正确的日期，请按 1988-01-01 格式录入");
              flag = false;
            }
          }
        }
        if (i.id == "treatmentType") {
          if (i.isExtramural == 2 && this.treatmentNum == "") {
            this.Toast("请输入复诊次数");
            flag = false;
          }
        }
      });
      if (flag) {
        let url = this.api.clinicalRecordCommit;
        this.utils.ajax({
          url: url,
          method: "post",
          data: obj,
          success: res => {
            this.Toast("提交成功");
            setTimeout(() => {
              this.utils.goBack(this);
            }, 500);
          }
        });
      }
    },
    selectMajorConfirm(val, i) {
      this.moduleData.option.forEach(item => {
        item.selected = false;
      });

      this.moduleData.option[i].selected = true;
      this.moduleData.value = val.text;
      this.cancel();
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
              _this.isHasFile[content] = data.url;
              this.modeData[this.modeData.length - 1].value.push({
                path: data.url,
                // md5: res.data.md5,
                name: data.name
              });
            });
      }
    },
    isImg(str) {
      if (/.jpg/.test(str) || /.JPG/.test(str) || /.jpeg/.test(str) || /.JPEG/.test(str) || /.png/.test(str) || /.gif/.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    isImgtea(str) {
      if (/.jpg/.test(str) || /.JPG/.test(str) || /.jpeg/.test(str) || /.JPEG/.test(str) || /.png/.test(str) || /.gif/.test(str)) {
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
    show_filetea(e, url, index) {
      e.stopImmediatePropagation();
      this.shwoFiletea.flag = true;
      this.shwoFiletea.url = url;
      this.shwoFiletea.index = index;
    },
    delFile() {
      Object.keys(this.isHasFile).forEach((item)=>{
          if(this.isHasFile[item] == this.shwoFile.url){
              delete this.isHasFile[item]
          }
      })
      this.modeData[this.modeData.length - 1].value.splice(
        this.shwoFile.index,
        1
      );
    },
    domClick(e) {
      if (this.moduleData) {
        if (e.target.name != this.moduleData.id) {
          this.hideAllPiker();
        }
      }
    },
    hideAllPiker() {
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
        setTimeout(() => {
          let picker = document.querySelector(".van-picker");
          picker.onclick = e => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
          };
        }, 0);
      }
    },
    showObj(obj) {
      this.moduleData = obj;
    },
    showg(obj) {
      this.moduleData = obj;
      if (!obj.readonly) {
        this.hideAllPiker();
        if (obj.type == "dateobj") {
          this.moduleData.datetimeShow = true;
        } else {
          this.moduleData.selectShow = true;
        }
      }
    },
    cancel() {
      this.hideAllPiker();
      this.moduleData = "";
    },
    dateConfirm(val) {
      this.moduleData.value = this.utils.formatDate(
        val,
        "yyyy-MM-dd HH:mm:ss",
        true
      );
      this.cancel();
    },
    dateConfirmtime(val) {
      this.moduleData.value = this.utils.formatDate(val, "yyyy-MM-dd", true);
      this.cancel();
    },
    chooseTemp(num) {
      let modeArr = [];
      this.system = this.dataSystem;
      modeArr = [
        {
          field: "患者信息",
          type: "cell",
          id: ""
        },
        {
          field: "患者姓名：",
          id: "patientName", //
          type: "text",
          readonly: false,
          required: true,
          placeholder: "请填写患者姓名",
          value: ""
        },
        {
          field: "性别",
          id: "gender", //
          type: "select",
          selectShow: false,
          dateShow: false,
          placeholder: "请选择性别",
          required: true,
          option: [{ key: 1, text: "男" }, { key: 2, text: "女" }]
        },
        {
          field: "出生日期",
          id: "birthday", //
          type: "dateText",
          required: true,
          placeholder: "请输入出生日期 列：1988-01-01",
          readonly: false,
          value: ""
        },
        {
          field: "就诊类型",
          id: "treatmentType", //
          type: "textt",
          option: [
            //就诊类型
            { key: 1, value: "初诊" },
            { key: 2, value: "复诊" }
          ],
          placeholder: "请选择就诊类型",
          disabled: false,
          isExtramural: "",
          required: true
        },
        {
          field: "就诊卡号：",
          id: "treatmentCard", //
          type: "text",
          readonly: false,
          required: true,
          placeholder: "请填写卡号"
        },
        {
          field: "就诊时间",
          id: "treatmentTime", //
          type: "dateobj",
          selectShow: false,
          datetimeShow: false,
          required: true,
          placeholder: "请选择时间"
        },
        {
          field: "节气",
          id: "solarTerms", //
          type: "select",
          selectShow: false,
          dateShow: false,
          placeholder: "请选择节气",
          required: true,
          option: [
            { key: 1, text: "立春" },
            { key: 2, text: "雨水" },
            { key: 3, text: "惊蛰" },
            { key: 4, text: "春分" },
            { key: 5, text: "清明" },
            { key: 6, text: "谷雨" },
            { key: 7, text: "立夏" },
            { key: 8, text: "小满" },
            { key: 9, text: "芒种" },
            { key: 10, text: "夏至" },
            { key: 11, text: "小暑" },
            { key: 12, text: "大暑" },
            { key: 13, text: "立秋" },
            { key: 14, text: "处暑" },
            { key: 15, text: "白露" },
            { key: 16, text: "秋分" },
            { key: 17, text: "寒露" },
            { key: 18, text: "霜降" },
            { key: 19, text: "立冬" },
            { key: 20, text: "小雪" },
            { key: 21, text: "大雪" },
            { key: 22, text: "冬至" },
            { key: 23, text: "小寒" },
            { key: 24, text: "大寒" }
          ]
        },
        {
          field: "就诊记录",
          type: "cell",
          required: false,
          id: ""
        },
        {
          field: "主诉：",
          id: "chiefComplaint", //
          type: "text",
          readonly: false,
          required: true,
          placeholder: "请填写主诉",
          maxlength: "50"
        },
        {
          field: "现病史：",
          id: "currentHistory", //
          type: "textarea",
          readonly: false,
          required: false,
          value: "",
          placeholder: "请输入现病史最多可输入500字",
          maxlength: "500",
          rows:10
        },
        {
          field: "既往史：",
          id: "pastHistory", //
          type: "textarea",
          readonly: false,
          required: false,
          value: "",
          placeholder: "请输入既往史最多可输入300字",
          maxlength: "300"
        },
        {
          field: "过敏史：",
          id: "allergiesHistory", //
          type: "textarea",
          readonly: false,
          required: false,
          value: "",
          placeholder: "请输入过敏史最多可输入300字",
          maxlength: "300"
        },
        {
          field: "刻下症：",
          id: "inscribed", //
          type: "textarea",
          readonly: false,
          required: false,
          value: "",
          placeholder: "请输入刻下症最多可输入200字",
          maxlength: "200"
        },
        {
          field: "体格检查：",
          id: "physicalExamination", //
          type: "textarea",
          readonly: false,
          required: false,
          value: "",
          placeholder: "请输入体格检查最多可输入150字",
          maxlength: "150"
        },
        {
          field: "辅助检查：",
          id: "auxiliaryInspection", //
          type: "textarea",
          readonly: false,
          required: false,
          value: "",
          placeholder: "请输入辅助检查最多可输入150字",
          maxlength: "150"
        },
        {
          field: "中医诊断：",
          id: "tcmDiagnosis", //
          type: "textarea",
          readonly: false,
          required: true,
          value: "",
          placeholder: "请输入中医诊断最多可输入150字",
          maxlength: "150"
        },
        {
          field: "西医诊断：",
          id: "wmDiagnosis", //
          type: "textarea",
          readonly: false,
          required: false,
          value: "",
          placeholder: "请输入西医诊断最多可输入150字",
          maxlength: "150"
        },
        {
          field: "治法：",
          id: "therapy", //
          type: "textarea",
          value: "",
          placeholder: "请输入治法最多可输入300字",
          maxlength: "300"
        },
        {
          field: "处方：",
          id: "prescription", //
          type: "textarea",
          value: "",
          required: true,
          placeholder: "请输入处方最多可输入300字",
          maxlength: "300",
          rows:10
        },
        {
          field: "医案总结",
          type: "cell",
          id: ""
        },
        {
          field: "按语：",
          id: "note", //
          type: "textarea",
          value: "",
          required: true,
          placeholder: "请输入按语最多可输入500字",
          maxlength: "500",
          rows:10
        },
        {
          id: "", //
          type: "button",
          submit: "提交",
          save: "保存",
          click: "submit"
        },
        { field: "附件上传", id: "filesVOS", value: [], type: "file" }
      ];
      this.modeData = modeArr;
      if (num == 2) {
        //  未通过
        var clas = {
          class: "nopass",
          type: "img",
          id: ""
        };
        var textareaRemark = {
          field: "评语：",
          id: "auditRemark",
          type: "textarea",
          value: this.system.auditRemark,
          readonly: true,
          rows:10
        };
        this.modeData.splice(1, 0, clas);
        this.modeData.splice(23, 0, textareaRemark);
      }
      if (num == 3) {
        //  通过
        var clas = {
          class: "pass1",
          type: "img",
          id: ""
        };
        var textareaRemark = {
          field: "评语：",
          id: "auditRemark",
          type: "textarea",
          value: this.system.auditRemark,
          readonly: true,
          rows:10
        };
        this.modeData.splice(1, 0, clas);
        this.modeData.splice(23, 0, textareaRemark);
        this.modeData.splice(24, 1);
        this.modeData.forEach(item => {
          item.readonly = true;
          item.disabled = true;
          if (item.id == "treatmentType") {
            item.type = "textType";
          }
          if (item.id == "filesVOS") {
            item.type = "filevs";
          }
        });
      }
      if (num == 4) {
        //  老师审批
        var clas = {
          type: "img",
          id: ""
        };
        if (this.dataSystem.status == 3) {
          clas.class = "pass1";
        } else if (this.dataSystem.status == 4) {
          clas.class = "nopass";
        }
        var buttonCli = {
          id: "", //
          type: "buttonLinst",
          cancel: "返回",
          confirm: "确认",
          submit: "退回",
          save: "通过",
          click: "sendBack"
        };
        var textareaRemark = {
          field: "评语：",
          id: "auditRemark",
          type: "textareaRemark",
          value: this.system.auditRemark,
          placeholder: "输入写评语",
          rows:10
        };
        this.modeData.splice(1, 0, clas);
        this.modeData.splice(23, 0, textareaRemark);
        this.modeData.splice(24, 1);
        this.modeData.splice(25, 0, buttonCli);
        this.modeData.forEach(item => {
          item.readonly = true;
          item.disabled = true;
          if (item.id == "treatmentType") {
            item.type = "textType";
          }
          if (item.id == "filesVOS") {
            item.type = "filevs";
          }
        });
      }
      if (num == 5) {
        //  撤回
        var repeals = {
          id: "", //
          type: "btn",
          submit: "撤销",
          click: "repeals"
        };
        this.modeData.splice(22, 1);
        this.modeData.splice(22, 0, repeals);
        this.modeData.forEach(item => {
          item.readonly = true;
          item.disabled = true;
          if (item.id == "treatmentType") {
            item.type = "textType";
          }
          if (item.id == "filesVOS") {
            item.type = "filevs";
          }
        });
      }
      if (num !== 1) {
        this.modeData.forEach(item => {
          item.required = false;
          if (item.id == "patientName") {
            item.value = this.system.patientName;
          }
          if (item.id == "gender") {
            item.value = this.system.gender;
          }
          if (item.id == "birthday") {
            item.value = this.system.birthday;
          }
          if (item.id == "treatmentType") {
            item.isExtramural = this.system.treatmentType;
          }
          if (item.id == "treatmentCard") {
            item.value = this.system.treatmentCard;
          }
          if (item.id == "treatmentTime") {
            item.value = this.system.treatmentTime;
          }
          if (item.id == "solarTerms") {
            item.value = this.system.solarTerms;
          }
          if (item.id == "chiefComplaint") {
            item.value = this.system.chiefComplaint;
          }
          if (item.id == "currentHistory") {
            item.value = this.system.currentHistory;
          }
          if (item.id == "pastHistory") {
            item.value = this.system.pastHistory;
          }
          if (item.id == "allergiesHistory") {
            item.value = this.system.allergiesHistory;
          }
          if (item.id == "inscribed") {
            item.value = this.system.inscribed;
          }
          if (item.id == "physicalExamination") {
            item.value = this.system.physicalExamination;
          }
          if (item.id == "auxiliaryInspection") {
            item.value = this.system.auxiliaryInspection;
          }
          if (item.id == "tcmDiagnosis") {
            item.value = this.system.tcmDiagnosis;
          }
          if (item.id == "wmDiagnosis") {
            item.value = this.system.wmDiagnosis;
          }
          if (item.id == "therapy") {
            item.value = this.system.therapy;
          }
          if (item.id == "prescription") {
            item.value = this.system.prescription;
          }
          if (item.id == "note") {
            item.value = this.system.note;
          }
          if (item.id == "auditRemark") {
            item.value = this.system.auditRemark;
          }
          if (item.id == "filesVOS") {
            item.value = this.system.filesVOS;
          }
          if (item.type == "select" || item.type == "selected") {
            item.option.forEach(i => {
              if (i.key == item.value) {
                item.value = i.text;
              }
            });
          }
        });
        if (num === 6) {
          this.modeData.forEach(item => {
            if (item.id == "patientName") {
              item.required = true;
            }
            if (item.id == "gender") {
              item.required = true;
            }
            if (item.id == "birthday") {
              item.required = true;
            }
            if (item.id == "treatmentType") {
              item.required = true;
            }
            if (item.id == "treatmentCard") {
              item.required = true;
            }
            if (item.id == "treatmentTime") {
              item.required = true;
            }
            if (item.id == "solarTerms") {
              item.required = true;
            }
            if (item.id == "chiefComplaint") {
              item.required = true;
            }
            if (item.id == "tcmDiagnosis") {
              item.required = true;
            }
            if (item.id == "prescription") {
              item.required = true;
            }
            if (item.id == "note") {
              item.required = true;
            }
          });
        }
      }
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
.head {
  background: #f0f0f0;
  padding: 0.5rem 0.8rem;
  font-size: 0.95rem;
}
.last-li [class*="van-hairline"]::after {
  border: none;
}
[class*="van-hairline"]::after {
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
.van-picker {
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
  padding-bottom: 20rem;
}
.file_box > div {
  display: inline-block;
}
.fileList {
  width: 3rem;
  /* height: 3rem; */
  position: relative;
  margin-right: 0.573rem;
  margin-bottom: 0.5rem;
}
.fileList img {
  width: 100%;
  height: 3rem;
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
.radioAdd {
  background: white;
  padding: 0.5rem 0;
  border: 1px solid #fafafa;
  display: flex;
}
.about {
  width: 28%;
}
.radioname {
  display: flex;
  margin-top: 0.8rem;
  width: 10rem;
  width: 50%;
  justify-content: space-between;
}
.dadioimg {
  width: 1.125rem;
  height: 1.125rem;
}
.inp input {
  width: 2rem;
  margin-top: 0.8rem;
  margin-left: 1rem;
  border: 1px solid #323233;
}
.inp {
  width: 40%;
}
.button {
  width: 100%;
  color: white;
  font-size: 0.9rem;
  text-align: center;
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0px;
  z-index: 1;
}
.btn {
  background: #007acc;
  width: 100%;
  color: white;
  font-size: 0.9rem;
  text-align: center;
  position: fixed;
  bottom: 0;
  z-index: 20000;
}
.btn p:nth-of-type(1) {
  padding: 0.5rem 0;
  margin: 0;
}
.button p:nth-of-type(1) {
  background: #007acc;
  width: 50%;
  padding: 0.5rem 0;
  margin: 0;
}
.button p:nth-of-type(2) {
  background: #009900;
  width: 50%;
  padding: 0.5rem 0;
  margin: 0;
}
.filename {
  background: white;
}
.nopass {
  width: 4rem;
  height: 4rem;
  background: url("../assets/images/home/pic10_02.svg") no-repeat;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10000;
}
.pass {
  width: 4rem;
  height: 4rem;
  background: url("../assets/images/home/pic10_03.svg") no-repeat;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10000;
}
.pass1 {
  width: 4rem;
  height: 4rem;
  background: url("../assets/images/home/pic10_01.svg") no-repeat;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10000;
}
.displaya {
  display: flex;
  margin-top: 1rem;
}
.displaya p:nth-of-type(1) {
  margin: 0;
  padding: 0;
}
.displaya p:nth-of-type(2) {
  padding: 0;
  margin: 0;
  margin-left: 1rem;
  width: 1rem;
  height: 1rem;
  color: white;
  background: red;
  border-radius: 10px;
  text-align: center;
}
.crossname {
  margin-top: 0.1rem;
}
.shade {
  width: 100%;
  height: 340vh;
  background: rgba(255, 255, 255, 0);
  position: absolute;
  top: 0;
  z-index: 20000;
}
.tawee {
 /* border: 0.04rem solid #e1e1e1; */
 border: 1px solid #e1e1e1;
  width:90%; 
  margin: 0 auto;
}
</style>
