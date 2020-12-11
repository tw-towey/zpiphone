<template>
  <div class>
    <van-nav-bar :title="title" class="header" fixed left-arrow @click-left="onClickLeft"></van-nav-bar>
    <div class="layout_content">
      <van-cell v-if="echo" :title="obj.title" :is-link="obj.islink" :value="utils.getValueByKey(option, obj.type)" @click="show()" />
      <van-cell v-if="!echo" :title="obj.title" :is-link="obj.islink" :value="utils.getValueByKey(option, obj.type)" />
      <van-cell-group>
        <van-field v-if="obj.type== 1" v-model="obj.classicsName" :label="obj.field" :readonly="obj.readonly" :placeholder="obj.placeholder" :required="obj.required" />
        <van-field class="textarea" v-model="obj.message" label="学习心得" type="textarea" placeholder="请输入学习心得" rows="1" :required="obj.required" :readonly="obj.readonly" />
        <div :class="classImg"></div>
        <div>
          <van-cell title="附件" size="large" />
          <div class="file_box" v-if="echo">
            <div class="fileList" v-for="(file, index) in modeData.value" @click="show_file($event, file.path, index)">
              <img :src="file.path" v-if="isImg(file.path)">
              <div v-if="!isImg(file.path)" class="boxfile">
                <van-icon name="description" size="3rem" color="#e1e1e1" />
              </div>
            </div>
            <div class="uploadFile">
              <van-uploader :after-read="onRead" accept multiple>
                <van-icon name="plus" color="#e1e1e1" />
              </van-uploader>
            </div>
          </div>
          <div class="file_box" v-if="!echo">
            <div class="fileList" v-for="(file, index) in modeData.value" @click="show_fileLinst($event, file.path, index)">
              <img :src="file.path" v-if="isImgLinst(file.path)">
              <div v-if="!isImgLinst(file.path)" class="boxfile">
                <van-icon name="description" size="3rem" color="#e1e1e1" />
              </div>
            </div>
          </div>
        </div>
      </van-cell-group>
      <div v-if="remarkShow">
        <van-cell title="导师评语" size="large" />
        <van-field v-model="obj.remark" label="评语" type="textarea" rows="1" :readonly="true" />
      </div>
      <van-dialog v-model="shwoFile.flag" show-cancel-button cancel-button-text="删除" @cancel="delFile()" confirm-button-text="关闭">
        <div v-if="isImg(shwoFile.url)" style="max-height:35rem">
          <img v-if="isImg(shwoFile.url)" :src="shwoFile.url" width="100%" style="height:100%;">
        </div>
        <div class="fileImg" v-if="!isImg(shwoFile.url)">
          <van-icon name="description" />
        </div>
        <div class="title-file" v-if="!isImg(shwoFile.url)">该文件类型暂不支持查看</div>
      </van-dialog>
      <van-dialog v-model="shwoFiletea.flag">
        <div style="max-height:35rem" v-if="isImgLinst(shwoFiletea.url)">
          <img v-if="isImgLinst(shwoFiletea.url)" :src="shwoFiletea.url" width="100%" style="height:100%">
        </div>
        <div class="fileImg" v-if="!isImgLinst(shwoFiletea.url)">
          <van-icon name="description" />
        </div>
        <div class="title-file" v-if="!isImgLinst(shwoFiletea.url)">该文件类型暂不支持查看</div>
      </van-dialog>
      <van-picker v-if="obj.selectShow" :columns="typeColumns" show-toolbar @confirm="selectMajorConfirm" @cancel="cancel" />
      <div class="button" v-if="buttonshow">
        <p @click="clickLeft()">提交</p>
        <p @click="onClicksave()">保存</p>
      </div>
      <div class="withdraw" v-if="echoshow">
        <p @click="onClickRight">撤回</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddNotebook",
  components: {},
  data() {
    return {
      modeData: [],
      moduleData: "",
      isHasFile:{},
      title: "",
      classImg: "",
      buttonshow: true,
      obj: {
        type: 0,
        title: "记录类型",
        islink: true,
        classicsName: "",
        selectShow: false,
        placeholder: "请输入典籍名称",
        field: "典籍名称",
        readonly: false,
        required: true,
        message: "",
        remark: ""
      },
      remarkShow: false,
      typeColumns: [],
      typeDefaultIndex: 0,
      option: [
        { key: 0, value: "跟师心得体会" },
        { key: 1, value: "学习中医典籍体会" },
        // { key: 3, value: "跟师总结" },
        { key: 2, value: "其他" }
      ],
      modeData: {
        id: "filesVOs",
        value: []
      },
      shwoFile: {
        flag: false,
        url: "",
        flagLin: false
      },
      shwoFiletea: {
        flag: false,
        url: ""
      },
      repeal: false,
      echo: true,
      echoshow: false
    };
  },
  methods: {
    onClickLeft() {
      if (
        this.modeData.value.length > 0 ||
        this.obj.message !== "" ||
        this.obj.classicsName !== ""
      ) {
        this.Dialog.confirm({
          title: "提示",
          message: "是否确认退出?"
        })
          .then(() => {
            this.utils.goBack(this);
          })
          .catch(() => {});
      } else {
        this.utils.goBack(this);
      }
    },
    onClicksave() {
      // 保存
      var parms = {
        studyNotes: this.obj.message,
        noteType: this.obj.type,
        filesVOS: this.modeData.value
      };
      if (this.obj.message == "") {
        this.Toast("请输入学习心得");
        return;
      }
      if (this.$route.params.id) {
        parms.id = this.$route.params.id;
      }
      if (this.obj.type == 1) {
        parms.classicsName = this.obj.classicsName;
        if (this.obj.classicsName == "") {
          this.Toast("请输入典籍名称");
          return;
        }
      }
      this.utils.ajax({
        url: this.api.supervisorNoteSave,
        data: parms,
        method: "POST",
        success: data => {
          this.Toast("提交成功");
          setTimeout(() => {
            this.utils.goBack(this);
          }, 300);
        }
      });
    },
    onClickRight() {
      var parms = {
        id: this.$route.params.id
      };
      this.utils.ajax({
        url: this.api.supervisorNoteRevoke,
        data: parms,
        method: "POST",
        success: data => {
          this.Toast("撤回成功");
          setTimeout(() => {
            this.utils.goBack(this);
          }, 500);
        }
      });
    },
    addData() {
      if (this.$route.params.ConsiliaData == 0) {
        // 添加
        this.title = "跟师心得";
      }
      if (this.$route.params.ConsiliaData == 1) {
        // 草稿
        this.title = "笔记详情";
        this.echoShow();
      }
      if (this.$route.params.ConsiliaData == 2) {
        // 提交审核  可撤回
        this.title = "笔记详情";
        this.buttonshow = false;
        this.obj.readonly = true;
        this.echo = !this.echo;
        (this.echoshow = true), this.echoShow();
      }
      if (this.$route.params.ConsiliaData == 3) {
        // 审核通过
        this.title = "笔记详情";
        this.buttonshow = false;
        this.classImg = "img3";
        this.obj.readonly = true;
        this.obj.required = false;
        this.echo = false;
        this.remarkShow = true;
        this.echoShow();
      }
      if (this.$route.params.ConsiliaData == 4) {
        // 审核不通过
        this.title = "笔记详情";
        this.classImg = "img1";
        this.remarkShow = true;
        this.echoShow();
      }
    },
    init() {
      //活动类别选项
      this.option.forEach(item => {
        this.typeColumns.push({
          text: item.value,
          value: item.key
        });
      });
    },
    echoShow() {
      var parms = {
        id: this.$route.params.id
      };
      this.utils.ajax({
        url: this.api.supervisorNoteFind,
        data: parms,
        method: "POST",
        success: data => {
          this.modeData.value = data.filesVOS;
          this.obj.message = data.studyNotes;
          this.obj.classicsName = data.classicsName;
          this.obj.type = data.noteType;
        }
      });
    },
    selectMajorConfirm(val, i) {
      this.obj.value = val.text;
      this.obj.type = val.value;
      this.obj.selectShow = false;
    },
    show() {
      this.obj.selectShow = true;
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
            this.modeData.value.push({
                path: data.url,
                // md5: res.data.md5,
                name: data.name
            });
        });
      }
    },
    delFile() {
      Object.keys(this.isHasFile).forEach((item)=>{
          if(this.isHasFile[item] == this.shwoFile.url){
              delete this.isHasFile[item]
          }
      })
      this.modeData.value.splice(this.shwoFile.index, 1);
    },
    clickLeft() {
      // 提交
      var parms = {
        studyNotes: this.obj.message,
        noteType: this.obj.type,
        filesVOS: this.modeData.value
      };

      if (this.utils.trim(this.obj.message) == "") {
        this.Toast("请输入学习心得");
        return;
      }
      if (this.$route.params.id) {
        parms.id = this.$route.params.id;
      }
      if (this.obj.type == 1) {
        parms.classicsName = this.obj.classicsName;
        if (this.utils.trim(this.obj.classicsName) == "") {
          this.Toast("请输入典籍名称");
          return;
        }
      }
      this.utils.ajax({
        url: this.api.supervisorNotePageCommit,
        data: parms,
        method: "POST",
        success: data => {
          this.Toast("提交成功");
          setTimeout(() => {
            this.utils.goBack(this);
          }, 300);
        }
      });
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
    isImgLinst(str) {
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
    cancel() {
      this.obj.selectShow = false;
    }
  },
  created() {
    this.addData();
    this.init();
  }
};
</script>
<style  scoped>
.van_nav {
  color: black;
}
.van_nav .van-nav-bar__title {
  color: black;
  font-size: 1.1rem;
}

.van_nav .van-nav-bar__text {
  color: black;
  font-size: 1rem;
}
.van-picker {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 16rem;
  z-index: 10;
}
.uploadFile {
  position: relative;
  font-size: 3rem;
  border-radius: 0.5rem;
  border: 0.04rem solid #e1e1e1;
  width: 3rem;
  height: 3rem;
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
.file_box {
  padding: 0.5rem 1rem;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
.file_box > div {
  display: inline-block;
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
.withdraw {
  width: 100%;
  color: white;
  font-size: 0.9rem;
  text-align: center;
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
}
.withdraw p {
  background: #007acc;
  width: 100%;
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

.textarea {
  width: 75% !important;
}
.img1 {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_02.svg") no-repeat;
  padding: 0.2rem;
  position: absolute;
  top: 0;
  right: 1rem;
}
.img3 {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_01.svg") no-repeat;
  padding: 0.2rem;
  position: absolute;
  top: 0;
  right: 1rem;
}
</style>