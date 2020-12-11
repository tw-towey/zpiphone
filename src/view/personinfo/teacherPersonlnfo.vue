<template>
  <div>
    <van-nav-bar title="基本信息" class="header" fixed left-arrow @click-left="onClickLeft" right-text="保存"
      @click-right="saveDate" />
    <div class="teach-person-box">
      <div>
        <van-tabs v-model="active" @change="changeTab">
          <van-tab title="基础信息">
            <TeachList ref="child1" :templateData="templateData" />
          </van-tab>
          <van-tab title="师资级别">
            <TeachList ref="child2" :templateData="templateData" />
          </van-tab>
          <van-tab title="教育经历">
            <TeachList ref="child3" :templateData="templateData" />
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import TeachList from "./TeachList"
import { baseInfo, teachLevel, teaExperience } from './config.js';
export default {
  name: "teacherPersonlnfo",
  components: { TeachList },
  data() {
    return {
      active: 0,
      templateData: [],
      idint: "",
      resParms: "",
      dataAtt: "",
      viewApi: null,
      saveApi: null,
    };
  },
  methods: {
    onClickLeft() {
      if (JSON.stringify(this.templateData) !== JSON.stringify(this.resParms)) {
        this.onClickLeftlt();
      } else {
        this.utils.goBack(this);
      }
    },
    onClickLeftlt() {
      this.Dialog.confirm({
        title: "提示",
        message: "当前已有内容修改是否退出？"
      })
        .then(() => {
          this.utils.goBack(this);
        })
        .catch(() => { });
    },
    changeCode(code, opts) {
      let codeVal;
      if (!opts) {
        return;
      }
      opts.forEach(item => {
        if (code == item.key) {
          codeVal = item.value;
        }
      });
      return codeVal;
    },
    /****
     * 切换方法
     */
    changeTab() {
      let TypeArr = [];
      let TypeArrPro = [];
      if (this.active === 0) {
        this.templateData = baseInfo;
        this.viewApi = this.api.selectTeacherInfoByTeacherId;
        this.saveApi = this.api.saveTeacherInfo;
        TypeArr = ["area", "marital", "medicalQualificationType", "politicsStatus", "standardCode", "bankCardCode"];
      } else if (this.active === 1) {
        this.templateData = teachLevel;
        this.viewApi = this.api.selectTeacherPositionByTeacherId;
        this.saveApi = this.api.saveTeacherPosition;
        TypeArr = [];
      } else if (this.active === 2) {
        this.templateData = teaExperience;
        this.viewApi = this.api.selectTeacherHighestEducationalByTeacherId;
        this.saveApi = this.api.saveTeacherHighestEducational;
        TypeArr = ['educationType', 'specialityType', 'school', 'degreeType', 'degree'];
      }
      TypeArr.forEach((item, index) => {
        item = { type: item }
        item = new Promise((resolve, reject) => {
          this.getByZdList(item, () => { resolve(); });
        });
        TypeArrPro.push(item);
      });
      Promise.all(TypeArrPro).then(() => {
        this.viewModel();
      });
    },
    /****
     * 处理回显值
     * */
    viewVlaueBykey(res, item, index) {
      if (res.hasOwnProperty(item.id)) {
        if (item.type == "file") {
          item.value = {
            path: res[item.id] ? res[item.id] : ''
          }
        } else if (item.type == "date") {
          item.value = res[item.id].split(" ")[0];
        } else if (item.type == "picker") {
          item.value = this.changeCode(res[item.id], item.option);
          item.key = res[item.id];
        } else if (item.type == "switch") {
          item.value = res[item.id] * 1 ? true : false;
          if (item.switchChange) {
            item.switchChange(item.value, index);
          }
        } else {
          item.value = res[item.id];
        }
      }
    },
    /*****
     * 
     * 回显
     */
    viewModel() {
      let _this = this;
      this.utils.ajax({
        url: this.viewApi,
        data: {},
        method: "POST",
        success: res => {
          this.dataAtt = res;
          if (res) {
            this.dataAtt.teacherId = this.$store.state.userInfo.human.caId;
            _this.idint = res.id;
            _this.templateData.forEach((item, index) => {
              this.viewVlaueBykey(res, item, index);
            });
          }
        }
      }, true
      );
      if (this.active === 0 || this.active === 1) {
        this.viewBankNumber();
      }
    },
    /****
     * 查询银行卡号
     */
    viewBankNumber() {
      this.utils.ajax({
        url: this.api.teacherWork,
        method: "post",
        data: {},
        success: res => {
          if (res) {
            res.standardCode = res.normalCode;
            this.templateData.forEach(item => {
              this.viewVlaueBykey(res, item);
            });
            this.resParms = this.utils.deepCopy(this.templateData);
          }
        }
      });
    },
    /****
     * 保存银行卡号
     */
    saveBankNumber(parms) {
      parms.normalCode = parms.standardCode;
      parms.teacherTitleDate = "2014"
      this.utils.ajax({
        url: this.api.saveTeacherWorkNow,
        method: "post",
        data: parms,
        success: (res) => { }
      }, true)
    },
    /*****
     * 保存
     */
    saveDate() {
      let obj = {
        id: this.idint ? this.idint : ""
      };
      this.templateData.forEach(item => {
        if (item.issshow) {
          if (item.type == "file") {
            obj[item.id] = item.value.path;
          } else if (item.type == "picker") {
            obj[item.id] = item.key;
          } else if (item.type == "switch") {
            obj[item.id] = item.value * 1 ? 1 : 0;

          } else {
            obj[item.id] = item.value;
          }
        }
      });
      const parms = Object.assign({}, this.dataAtt, obj);
      this.resParms = this.utils.deepCopy(this.templateData);
      this.utils.ajax(
        {
          url: this.saveApi,
          data: parms,
          method: "POST",
          success: data => {
            this.Toast("保存成功！");
          }
        }, false
      );
      if (this.active === 0 || this.active === 1) {
        this.saveBankNumber(parms);
      }
    },
    /*****
     * 获取字典
     */
    getByZdList(params, callback) {
      let _this = this;
      this.utils.ajax({
        url: _this.api.selectByType,
        data: params,
        method: "POST",
        success: data => {
          if (data && data.length > 0) {
            _this.templateData.forEach(item => {
              if (item.id == params.type || item.opt_type == params.type) {
                item.option = [];
                data.forEach(i => {
                  if (!item.option) {
                    item.option = [];
                  }
                  item.option.push({
                    key: i.key,
                    value: i.value
                  });
                });
              }
            });
          }
          callback();
        }
      },
        false
      );
    },
  },
  mounted() {
  },
  created() {
    this.changeTab();
  }
};
</script>
<style>
.teach-person-box {
  margin-top: 2.5rem;
}
.teach-person-box .van-cell__title {
  white-space: nowrap;
}
.teach-person-box .van-cell {
  justify-content: space-between;
}
/* .teach-person-box >>> .van-picker {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 16rem;
  z-index: 10;
} */
.teach-person-box .van-field__control {
  text-align: right;
}
.teach-person-box .van-field__label {
  min-width: 10rem;
}
.teach-person-box .uploadFile {
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
.fgBorder {
  height: 10px;
  width: 100%;
  background: #f2f2f2;
  border-bottom: 0.2rem;
}
.teach-person-box .van-field__body textarea {
  text-align: left;
  height: 6rem !important;
  border: 1px solid #ccc;
  padding: 0 0.2rem;
}
.teach-person-box .fileImg img {
  width: 2rem;
  height: 2rem;
  vertical-align: middle;
}
.teach-person-box .van-cell__value {
  width: 100% !important;
}
</style>

