<template>
  <div>
    <van-nav-bar title="个人信息" class="header" fixed left-arrow @click-left="onClickLeft" />
    <div class="layout_content">
      <div class="personInfo" v-if="isShow">
        <div class="personAvter">
          <van-uploader :after-read="onRead" accept multiple>
            <!-- <van-icon name="plus" /> -->
            <img class="img_peron" v-if="userInfo.headPortraitUrl" :src="userInfo.headPortraitUrl" alt="用户头像" />
            <img class="img_peron" v-if="!userInfo.headPortraitUrl" src="../../assets/images/icons/txPic.svg" alt="用户头像" />
          </van-uploader>
        </div>
        <div class="personRight">
          <van-cell-group>
            <van-cell title="姓名：" :value="userInfo.studentName" />
            <van-cell title="参培年份：" :value="userInfo.traineeYear" />
            <van-cell title="参培专业：" :value="tabTypeCodeList(userInfo.traineeMajorCode)" />
            <van-cell title="手机号：" :value="userInfo.cellphone" />
            <!-- <van-cell title="身份类型：" value="社会人" /> -->
          </van-cell-group>
        </div>
      </div>

      <div class="personInfo" v-if="!isShow">
        <div class="personAvter">
          <van-uploader :after-read="onRead" accept multiple>
            <img class="img_peron" v-if="userInfo.headPortraitUrl" :src="userInfo.headPortraitUrl" alt="用户头像" />
            <img class="img_peron" v-if="!userInfo.headPortraitUrl" src="../../assets/images/icons/txPic.svg" alt="用户头像" />
          </van-uploader>
        </div>
        <div class="personRight">
          <van-cell-group v-for="(item,index) in dataLInst" :key="index">
            <van-cell :title="item.title" :value="userInfo[item.id]" />
          </van-cell-group>
        </div>
      </div>
      <div class="personBox" v-if="this.code !== 'student' ">
        <van-cell title="基本信息" is-link @click="enterUrlHandle()" :value="valueData" />
        <van-cell title="教师聘任" v-if="this.code !== 'student' " is-link @click="enterAppointment()" :value="userInfo.teacherEngageCount" />
        <van-cell title="培训进修" v-if="this.code !== 'student' " is-link @click="enterRefreshertraining()" :value="userInfo.teacherTrainExperienceCount" />
        <van-cell title="工作履历" v-if="this.code !== 'student' " is-link @click="enterResume()" :value="userInfo.teacherWorkExperienceCount" />
        <van-cell title="证书管理" v-if="this.code !== 'student' " is-link @click="enterCertificateManager()" :value="userInfo.teacherCertificateCount" />
        <van-cell title="奖惩情况" v-if="this.code !== 'student' " is-link @click="enterRewardsPun()" :value="userInfo.teacherRewardCount*1 + userInfo.teacherPunishmentCount*1" />
      </div>
      <div class="personBox"  v-if="this.code == 'student' ">
        <van-cell title="基本信息"  is-link  is-link @click="enterUrlHandle()"/>
        <!-- <van-cell title="培训经历"  is-link  />
        <van-cell title="教育经历"  is-link  />
        <van-cell title="工作履历"  is-link  to="/Record"/>
        <van-cell title="奖惩情况"  is-link  />
        <van-cell title="科研论文"  is-link  />
        <van-cell title="心理压力"  is-link  />
        <van-cell title="团队合作"  is-link  />
        <van-cell title="自学内容"  is-link  /> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PersonInfo",
  components: {},
  data() {
    return {
      isShowCamera: false,
      isHasFile:{},
      code:'',
      enterUrl: "",
      userInfo: {
        headPortraitUrl: "",
        studentName: ""
      },
      valueData: "",
      isShow: true,
      dataLInst: [
        { title: "姓名：", value: "", id: "name" },
        { title: "所在科室：", value: "", id: "departmentName" },
        { title: "技术职务：", value: "", id: "specialityTitle" },
        { title: "手机号：", value: "", id: "cellPhone" }
      ],
      
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    tabTypeCodeList(code) {
      let codeVal;
      this.$store.state.majors.forEach(item => {
        if (code == item.key) {
          codeVal = item.value;
        }
      });
      return codeVal;
    },
    identificationType() {},
    getInfoData() {
      this.utils.ajax({
        url: this.api.selectSimpleByStudentId,
        method: "post",
        data: {},
        success: res => {
          this.userInfo = res;
          console.log(res, 121321321);
          console.log("个人信息",this.userInfo)
        }
      });
    },
    enterCertificateManager() {
        this.$router.push({ name: "CertificateManager" });
    },
    enterRefreshertraining() {
        this.$router.push({ name: "Refreshertraining" });
    },
    enterResume(){
        this.$router.push({ name: "Resume" });
    },
    enterAppointment() {
        this.$router.push({ name: "Appointment" });
    }, 
    enterRewardsPun() {
        this.$router.push({ name: "RewardsPun" });
    },
    teachInfoData() {
      this.utils.ajax({
        url: this.api.selectTeacherById,
        method: "post",
        data: {
          teacherId: this.$store.state.userInfo.human.caId
        },
        success: res => {
          if(res !== null){
           this.userInfo = res;
           console.log("个人",this.userInfo)
          }
        }
      });
    },
    showPopup() {
      this.setData({ show: true });
    },

    onClose() {
      this.setData({ show: false });
    },
    goEditInfo() {
      this.$router.push({ name: "" });
    },

    updateHeadPortrait(url) {
      this.utils.ajax({
        url: this.api.updateHeadPortrait,
        method: "post",
        data: {
          headPortraitUrl: url
        },
        success: res => {
          this.userInfo.headPortraitUrl = url;
        }
      });
    },
    teacherupdateHeadPortrait(url) {
      let _this = this;
      this.utils.ajax({
        url: this.api.teacherupdateHeadPortrait,
        method: "post",
        data: {
          headPortraitUrl: url,
          teacherId: this.$store.state.userInfo.human.caId
        },
        success: res => {
          _this.userInfo.headPortraitUrl = url;
        }
      });
    },
    enterUrlHandle() {
      let code = this.code;
      if (code === "student") {
        this.$router.push({ name: "StudentPersonlnfo" });
      } else if (code === "teacher" || code == "tutor" || code == "mentor") {
        this.$router.push({ name: "teacherPersonlnfo" });
      }
    },
    updataFile(file) {
      let _this = this;  
      let flag = true;
      let content = this.utils.encryptByEnMd5(file.content);
      if(content && this.isHasFile.hasOwnProperty(content)) {
        this.Toast("该文件已存在，请选择其他文件");
        return;
      }else{
          this.utils.fileUploader(file, data => {
              this.isHasFile[content] = data.url;
              let code = this.code;
              if (code === "student") {
                this.updateHeadPortrait(data.url);
              } else if (
                code === "teacher" ||
                code == "tutor" ||
                code == "mentor"
              ) {
                this.teacherupdateHeadPortrait(data.url);
              }
            });
      }
    },
    onRead(file) {
      if (this.utils.checkSuffix(file.file.name)) {
        if (this.userInfo.headPortraitUrl) {
          this.Dialog.confirm({
            title: "提示",
            message: "当前已有文件,是否替换？"
          })
            .then(() => {
              this.updataFile(file);
            })
            .catch(() => {});
        } else {
          this.updataFile(file);
        }
      } else {
        this.Toast("请选择bmp, jpg, jpeg, png, gif的格式图片");
        return false;
      }
    },
    onClickRight() {
      // 保存
    }
  },
  created() {
    if(this.$store.state.userInfo){
        this.code = this.$store.state.userInfo.currentRole.code;
    }
    if (this.code === "student") {
      this.getInfoData();
      this.valueData = "招录信息/参培信息/医师资格信息";
      this.isShow = true;
    } else if (this.code === "teacher" || this.code == "tutor" || this.code == "mentor") {
      this.teachInfoData();
      this.isShow = false;
    }
  },
  mounted() {
   
  }
};
</script>
<style>
.personInfo {
  display: flex;
  padding: 0.525rem 0;
}

.personInfo .personAvter .van-uploader img {
  width: 6.1rem;
  height: 7.3rem;
}
.img_peron {
  width: 6.1rem;
  height: 6rem !important;
}
.personInfo .personRight {
  flex: 1;
}
.personInfo .personRight .van-cell {
  line-height: 0.875rem;
  padding: 0.3rem !important;
}
.personInfo .van-cell__title {
  flex: inherit;
  display: inline-block;
  width: 5rem;
}
.personInfo .van-cell__value {
  flex: inherit;
  text-align: left !important;
}
.personBox .van-cell__value {
  flex: inherit;
}
</style>

