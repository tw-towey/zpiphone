<template>
  <div class="teachersumup">
    <van-nav-bar title="跟师总结" class="header" fixed left-arrow @click-left="onClickLeft"></van-nav-bar>
    <div class="layout_content" :style="{'padding-bottom':!isStudent ? '2.5rem':'0'}">
      <van-field class="textarea" v-model="title" label="记录类型" type="text" placeholder="" rows="1" readonly />
      <div class="disabledInfo" v-if="this.$route.params.type !== 2">
        请前往电脑端进行修改
      </div>
      <van-field v-if="resObj.status > 2" v-model="resObj.auditRemark" label="导师评语" type="textarea" placeholder="" rows="1" :readonly="isStudent" />
      <!-- <div :class="classImg"></div> -->
      <van-cell title="附件" />
      <div class="file_box" v-if="resObj.filesVOS && resObj.filesVOS.length > 0">
        <div class="fileList" v-for="(file, index) in resObj.filesVOS" @click="show_file($event, file.path, index)" :key="index">
          <img :src="file.path" v-if="isImg(file.path)">
          <div v-if="!isImg(file.path)" class="boxfile">
            <van-icon name="description" size="3rem" color="#e1e1e1" />
          </div>
        </div>
      </div>
      <!-- <van-field v-model="resObj.classicsName" label="发表论文名称" type="text" placeholder="" rows="1" readonly />
      <van-field v-model="resObj.writingsTitle" label="阅读著作名称" type="text" placeholder="" rows="1" readonly /> -->
      <!-- <van-field class="textarea" v-model="" label="论文标题:" type="text" placeholder="请输入学习心得" rows="1" readonly /> -->
      <!-- treatiseTitle  -->
      <div class="van-cell" style="background:#fff;padding:0">
        <p style="padding:0 0.9375rem;width:100%">总结论文
        </p>
      </div>
      <div class="messageTitle" style="justify-content: space-between;">
        <span style="color:red;font-size:9px">注：要求理论联系实际、有分析。3000字以上</span>
        <span style="float:right;font-size:9px"> 字数 ： {{caleLenth(resObj.studyNotes)}}</span>
      </div>
      <div class="nodesTitlle" style="text-align:center" v-html="resObj.treatiseTitle">
      </div>
      <div v-html="resObj.studyNotes" class="studyNotes" readonly>
      </div>
      <van-dialog v-model="shwoFile.flag" show-cancel-button confirm-button-text="关闭">
        <div v-if="isImg(shwoFile.url)" style="max-height:35rem">
          <img v-if="isImg(shwoFile.url)" :src="shwoFile.url" width="100%" style="height:100%;">
        </div>
        <div class="fileImg" v-if="!isImg(shwoFile.url)">
          <van-icon name="description" />
        </div>
        <div class="title-file" v-if="!isImg(shwoFile.url)">该文件类型暂不支持查看</div>
      </van-dialog>
      <van-dialog v-model="shwoFiletea.flag">
        <div style="height:20rem" v-if="isImgLinst(shwoFiletea.url)">
          <img v-if="isImgLinst(shwoFiletea.url)" :src="shwoFiletea.url" width="100%" style="height:100%">
        </div>
        <div class="fileImg" v-if="!isImgLinst(shwoFiletea.url)">
          <van-icon name="description" />
        </div>
        <div class="title-file" v-if="!isImgLinst(shwoFiletea.url)">该文件类型暂不支持查看</div>
      </van-dialog>
      <!-- <van-picker v-if="obj.selectShow" :columns="typeColumns" show-toolbar @confirm="selectMajorConfirm" @cancel="cancel" />
      <div class="button" v-if="buttonshow">
        <p @click="clickLeft()">提交</p>
        <p @click="onClicksave()">保存</p>
      </div>
      <div class="withdraw" v-if="echoshow">
        <p @click="onClickRight">撤回</p>
      </div> -->
      <van-dialog v-model="teaReview" title="导师评语" show-cancel-button confirm-button-text="确定" @confirm="teacharaudit()">
        <van-cell-group>
          <van-field style="height:10rem;overflow:auto" v-model="resObj.auditRemark" rows="2" autosize type="textarea" placeholder="请输入评语" />
        </van-cell-group>
      </van-dialog>
      <div class="button" v-if="!isStudent">
        <p @click="onReturn()">退回</p>
        <p @click="onClickaudit()">通过</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TeacherSumup",
  components: {},
  data() {
    return {
      resObj: {},
      repeal: false,
      title: "跟师总结",
      isHasFile:{},
      classImg: "",
      remarkShow: "1231313123",
      isStudent: true,
      teaReview: false,
      teaReviewStatus: 3,
      shwoFile: {
        flag: false,
        url: "",
        flagLin: false
      },
      shwoFiletea: {
        flag: false,
        url: ""
      }
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    onRead(file) {
      let _this = this;  
      let flag = true;
      let content = this.utils.encryptByEnMd5(file.content);
      if(content && this.isHasFile.hasOwnProperty(content)) {
        this.Toast("该文件已存在，请选择其他文件");
        return;
      }else{
        _this.utils.fileUploader(file, data => {
            _this.isHasFile[content] = data.url;
            this.utils.fileUploader(file, data => {
              this.modeData.value.push({
                path: data.url,
                md5: "",
                name: data.name
              });
            });
        });
      }
    },
    onClicksave() {},
    onReturn() {
      this.teaReview = true;
      this.resObj.auditRemark = "";
      this.teaReviewStatus = 4; //退回
    },
    onClickaudit() {
      this.teaReview = true;
      this.resObj.auditRemark = "";
      this.teaReviewStatus = 3; //通过
    },
    caleLenth(file) {
      let aStr = file.replace(/<[^>]+>/g, "");
      aStr = aStr.replace(/(^\s*)|(\s*$)/g, "");
      aStr = aStr.replace(/&nbsp;/gi, "");
      return aStr.length;
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
    initData() {
      console.log(this.$route.params.item);
      this.resObj = this.$route.params.item;
    },

    isImgLinst(str) {
      if (/.jpg/.test(str) || /.JPG/.test(str) || /.jpeg/.test(str) || /.JPEG/.test(str) || /.png/.test(str) || /.gif/.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    closeDialog(active, done) {
      if (this.utils.trim(this.resObj.auditRemark) == "") {
        this.Toast("请输入导师评语");
        done();
      }
    },
    teacharaudit() {
      if (this.utils.trim(this.resObj.auditRemark) == "") {
        this.Toast("请输入导师评语");
        return true;
      } else {
        //审核跟师心得
        let params = {
          id: this.resObj.id,
          auditRemark: this.resObj.auditRemark,
          status: this.teaReviewStatus
        };
        this.utils.ajax({
          method: "post",
          data: params,
          url: this.api.ReviewsupervisorNote,
          success: data => {
            this.utils.goBack(this);
          }
        });
      }
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
    echoShow() {
      if (this.$route.params.type == 2 && this.$route.params.item.status == 2) {
        this.isStudent = false;
      } else {
        this.isStudent = true;
      }
      var parms = {
        id: this.$route.params.item.id
      };
      this.utils.ajax({
        url: this.api.supervisorNoteFind,
        data: parms,
        method: "POST",
        success: data => {
          this.resObj = data;
          if (this.resObj.status === 3) {
            this.classImg = "img3";
          } else if (this.resObj.status === 4) {
            this.classImg = "img1";
          }
        }
      });
    }
  },

  created() {
    this.initData();
    this.echoShow();
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
.teachersumup >>> .van-field__label {
  min-width: 7.625rem;
}
.van_nav .van-nav-bar__text {
  color: black;
  font-size: 1rem;
}
.nodesTitlle {
  width: 100%;
  overflow: hidden;
  font-weight: bold;
  box-sizing: border-box;
  color: #323233;
  font-size: 0.875rem;
  line-height: 1.5rem;
  background-color: #fff;
  padding: 0.625rem 0.9375rem;
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
}
.fileList img {
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
}
.file_box {
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  background: #fff;
  border-bottom: 0.0125rem solid #f4f4f4;
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
.messageTitle {
  line-height: 1.5rem;
  padding: 0.225rem 0.9375rem;
  display: flex;
  background: #fff;
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
.textarea >>> .van-field__control {
  text-align: right;
}
.button p:nth-of-type(1) {
  background: #007acc;
  width: 50%;
  padding: 0.5rem 0;
  margin: 0;
}

.disabledInfo {
  background: #f0f0f0;
  color: #f39500;
  line-height: 2.54rem;
  padding-left: 0.9375rem;
}
.button p:nth-of-type(2) {
  background: #009900;
  width: 50%;
  padding: 0.5rem 0;
  margin: 0;
}

.studyNotes {
  background: #fff;
  box-sizing: border-box;
  padding: 0.5rem;
  font-size: 12px;
  word-wrap: break-word;
}
.img1 {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_02.svg") no-repeat;
  padding: 0.2rem;
  position: absolute;
  top: -2rem;
  right: 1rem;
  z-index: 10000;
}
.img3 {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_01.svg") no-repeat;
  padding: 0.2rem;
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  z-index: 10000;
}
.bottombtn {
  width: 100%;
  color: white;
  font-size: 0.9rem;
  text-align: center;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-between;
}
.bottombtn p:nth-of-type(1) {
  background: rgb(26, 167, 232);
  width: 50%;
  padding: 0.5rem 0;
  margin: 0;
}
.bottombtn p:nth-of-type(2) {
  background: rgb(205, 51, 51);
  width: 50%;
  padding: 0.5rem 0;
  margin: 0;
}
</style>