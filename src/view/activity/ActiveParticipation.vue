
<template>
  <div>
    <van-nav-bar title="活动详情" class="header" fixed left-arrow @click-left="onClickLeft" />
    <div class="layout_content">
      <div>
        <div class="back-box">
            <div class="h3title">
                <h3>{{applyList.title}}</h3>
            </div>
            <van-cell-group>
                <van-cell title="活动时间：" :value="utils.formatDate(applyList.startTime,'yyyy-MM-dd HH:mm') + ' ~ ' +  utils.formatDate(applyList.endTime,'yyyy-MM-dd HH:mm') " />
                <!-- <van-cell title="主讲人：" :value="applyList.speaker" /> -->
                <div class="van-cell"><span> 主&nbsp;&nbsp;讲&nbsp;&nbsp;人：</span> <div class="van-cell__value">{{applyList.speaker}}</div> </div>
                <van-cell title="活动地点：" :value="applyList.locationOfTeaching" />
                <van-cell title="报名人数：" :value="applyList.numOfSignUp" />
                <van-cell title="签到时间" :value="applyList.signInDate" />
                <van-cell title="签退时间" :value="applyList.signOutDate" />
                <div class="van-cell" v-if="isNeedEvaluate"><span> 评价状态：</span> <div @click="goSubAnswer" class="van-cell__value"  v-html="isNeedEvaluate"></div> </div>
            </van-cell-group>
            <!-- <ul class="heade_top">
                <li>
                    <p>活动时间：</p>
                    <p class="p">{{ utils.formatDate(applyList.startTime,"yyyy-MM-dd") }} - {{ utils.formatDate(applyList.endTime,"yyyy-MM-dd")}}</p>
                </li>
                <li>
                    <p>主讲人：</p>
                    <p>{{applyList.speaker}}</p>
                </li>
                <li>
                    <p>活动地点：</p>
                    <p>{{applyList.locationOfTeaching}}</p>
                </li>
                <li>
                    <p>报名人数：</p>
                    <p>{{applyList.numOfSignUp}}</p>
                </li>
            </ul> -->
        </div>
        <div class="back-box">
          <div class="h3title">
              <h3>活动详情</h3>
          </div>
          <ul class="h3title">
            <li>
              <div v-html='applyList.detail'></div>
            </li>
            <!-- <li>
              <div class="pwith" v-for="(i,index) in applyList.attachmentList" :key="index">
                <p @click="showAttachment(i,index)">{{i.name}}</p>
              </div>
            </li> -->
          </ul>
        </div>
        <div class="back-box">
            <div class="h3title"><h3>课件</h3></div>
            <van-cell-group>
                <van-cell :title="img.name"  v-for="(img,index) in applyList.attachmentListType1" :key="index" is-link @click="showfile(img.path)"/>
            </van-cell-group>
        </div>
        <div class="back-box">
            <div class="h3title"><h3>教案</h3></div>
            <van-cell-group>
                <van-cell :title="img.name"  v-for="(img,index) in applyList.attachmentListType2" :key="index" is-link @click="showfile(img.path)"/>
            </van-cell-group>
        </div>
        <div class="back-box">
            <div class="h3title"><h3>活动照片</h3></div>
            <van-cell-group>
                <van-cell :title="img.name"  v-for="(img,index) in applyList.attachmentListType3" :key="index" is-link @click="showfile(img.path)"/>
            </van-cell-group>
        </div>
        <div class="back-box">
            <div class="h3title"><h3>手册照片</h3></div>
            <van-cell-group>
                <van-cell :title="img.name"  v-for="(img,index) in applyList.attachmentListType4" :key="index" is-link @click="showfile(img.path)"/>
            </van-cell-group>
        </div>
        <div class="back-box" style="margin-bottom:2rem">
            <div class="h3title"><h3>活动笔记</h3></div>
            <div style="padding:1rem;display:flex;">
                <div class="fileImg" v-if="applyList.attachmentListType5 && applyList.attachmentListType5.length">
                    <div style="display:inline-block;" v-for="(img,index) in applyList.attachmentListType5" :key="index">
                        <img v-if="isImg(img.path)" :src="img.path" alt="" @click="showfile(img.path,index)" />
                        <img v-else src="@/assets/images/page/wendangzhongxin.png" alt=""  @click="showfile(img.path)">
                        <van-icon  name="close" class="delete-icon" @click="deleteImg(index)"/>
                    </div>
                </div>
                <div class="uploadFile" @click="activeImgObj(applyList)">
                    <van-uploader :disabled="applyList.disabled" :after-read="onRead" accept multiple>
                    <van-icon name="plus" />
                    </van-uploader>
                </div>
            </div>
        </div>
        <div class="back-box">
          <van-cell-group>
          
            <van-cell title="实际学习" :value="classHour" />
          </van-cell-group>
        </div>
      </div>
      <van-dialog v-model="feedback" title="意见反馈" show-cancel-button confirm-button-text="提交"
        :before-close="beforeClose">
        <van-cell-group>
          <van-field v-model="message" type="textarea" :placeholder="placeholder" maxlength="500" rows="1" autosize />
        </van-cell-group>
      </van-dialog>
      <div class="bottom">
        <p @click="back()">意见反馈</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ActiveParticipation", // 我的活动 教学活动 - 已参加 活动详情
  components: {},
  data() {
    return {
      applyList: [],
      updataImgObj: {
          path:'',
      },
      isNeedEvaluate:"",
      isfala: false,
      indexpng: "",
      isHasFile:{},
      actual: "",
      feedback: false, // 意见反馈
      message: "",
      placeholder: "建议或意见，不得超过500字",
      classHour: "小时"
    };
  },
  created() {
    if(this.$store.state.activitiesDetailsObj.id){
        this.getLeaveList(this.$store.state.activitiesDetailsObj.id);
    }else{
        this.getLeaveList(this.$route.params.id);
    }
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
      this.$store.state.Activejoin = "join";
    },
    getLeaveList(activityId) {
      var param = {
        id: activityId,
        isPrceview: 1
      };
      this.utils.ajax({
        url: this.api.activityDetail,
        data: param,
        method: "POST",
        success: data => {
          this.applyList = data;
          //是否显示评价
          if(this.applyList.isNeedEvaluate && (this.applyList.signInDate || this.applyList.signOutDate)){
            this.isNeedEvaluate =  this.applyList.flagOfCommitOpinion == 1 ? '<span style="color:red">已评</span>'  : '<span style="color:#187fe8" > 未评 </span>' ;
          }
          this.applyList.detail = data.detail.substr(3).slice(0, length - 4);
          // this.classHour = this.applyList.classHour + "小时";
          if (
            (this.applyList.signInDate === "" &&
              this.applyList.signOutDate === "") ||
            (this.applyList.signInDate !== "" &&
              this.applyList.signOutDate === "") ||
            (this.applyList.signInDate === "" &&
              this.applyList.signOutDate !== "")
          ) {
            this.classHour = "0小时";
          } else {
            let signInDate = this.utils.getTime(this.applyList.signInDate); // 签到时间
            let signOutDate = this.utils.getTime(this.applyList.signOutDate); // 签退时间
            let classHour = signOutDate - signInDate;
            var h = classHour / 3600 / 1000;
            var hh = h.toFixed();
            this.classHour = hh + "小时";
          }
        }
      });
    },

    back() {
      // 意见反馈
      this.feedback = true;
    },
    showfile(url) {
      if(url){
        this.utils.openMultiTypeFile(url);
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
            _this.isHasFile[content] = data.url;
              console.log(this.updataImgObj, data);
              this.updataImgObj = {
                path: data.url,
                md5: "",
                name: data.name,
                type: 5,
                pid: this.applyList.id
             };
             this.updateFile();
        });
      }
    },
    deleteImg(index){
      this.Dialog.confirm({
        title: "提示",
        message: "是否删除活动笔记"
      }).then(() => {
        this.isHasFile = {};
        this.updataImgObj = {};
        let item = this.applyList.attachmentListType5.splice(index,1);
        this.deleteFile(item[0].id);
      }).catch(() => {});
    },
    activeImgObj(updataImgObj) {
      this.updataImgObj = updataImgObj;
    },
    deleteFile(id){
        this.utils.ajax({
            url: this.api.delTeachingAttachment,
            data: { 
                id: id,
            },
            method: "POST",
            success: data => {
              this.getLeaveList(this.$route.params.id);
              setTimeout(() => {
                this.Toast("提交成功");
              }, 100);
            }
        });
    },
    updateFile(){
        this.applyList.attachmentListType5.push(this.updataImgObj);
        this.utils.ajax({
            url: this.api.uploadAttachment,
            data: { 
                attachmentList: this.applyList.attachmentListType5,
                teachingId:this.applyList.id
            },
            method: "POST",
            success: data => {
              this.getLeaveList(this.$route.params.id);
              setTimeout(() => {
                this.Toast("提交成功");
              }, 100);
            }
        });
    },
    isImg(str) {
      if (/.jpg/.test(str) || /.JPG/.test(str) || /.jpeg/.test(str) || /.JPEG/.test(str) || /.png/.test(str) || /.gif/.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    beforeClose(action, done) {
      // 意见反馈
      if (action === "confirm") {
        // setTimeout(done, 1000);
        if (this.message == "") {
          this.Toast("内容不能为空!");
          done(false);
        } else if (this.message.length > 500) {
          this.Toast("内容不能超过500字!");
          done(false);
        } else {
          // 请求提交接口
          var params = {
            teachingId: this.$route.params.id,
            memberCaId: this.$store.state.userInfoCaid,
            content: this.message
          };
          this.utils.ajax({
            url: this.api.saveFeedBackForTeaching,
            data: params,
            method: "POST",
            success: data => {
              this.getLeaveList(this.$route.params.id);
              this.message = '';
              setTimeout(() => {
                this.Toast('提交成功');
              }, 100);

            }
          });
          done();
        }
      } else {
        this.message = '';
        done();
      }
    },
     /**
     * 补评价
     */
    goSubAnswer(){
        let sendXhr = () => {
            this.utils.goBack(this);
        }
        let callback = () => {
            sendXhr();
        }
        this.$store.state.activitiesDetailsObj = { id: this.applyList.id, evaluateId: this.applyList.evaluateId , condition: this.condition};
        if(this.applyList.flagOfCommitOpinion == 1){
            this.$store.state.activitiesDetailsObj.type = "see";
        }else{
            this.$store.state.activitiesDetailsObj.type = "add";
        }
        this.$router.push({name: 'subAnswer', params: this.$store.state.activitiesDetailsObj })
    },
    showAttachment(attachment, index) {
      if (this.utils.checkSuffix(attachment.name)) {
        //图片进行预览
        this.utils.imagePreview(this.imgList, this.imgIndexMap.get(index));
      } else {
        if (this.utils.isInAndroid() == false) {
          this.Toast("请通过电脑进行查看或下载");
        } else {
          console.log("调用app下载");
          var obj = {
            name: attachment.name,
            url: attachment.path
          };
          this.utils.downLoadFile(obj);
        }
      }
    }
  },
  mounted() { }
};
</script>
<style  scoped>
h3,
p,
ul,
li {
  margin: 0;
  padding: 0;
}
.heade_top li {
  display: flex;
}
.heade_top li p:nth-of-type(1) {
  width: 70px;
  text-align: right;
  white-space: nowrap;
}
.heade_top li {
  padding: 0.2rem 0;
}
.heade_top li p {
  color: #888888;
  font-size: 0.9rem;
  line-height: 16px;
}
.heade_top li .p {
  color: #f6ae48;
}
.back-box {
  background: white;
  margin-bottom: 0.4rem;
}
.h3title {
    padding: 0.625rem 0.9375rem;
    margin:0 auto;
}
.back-box ul {
  margin: 0 auto;
}
.back-box ul li {
  padding: 0.2rem 0;
}
.back-box ul li p {
  line-height: 1.5rem;
}
.back-box ul li div p {
  color: #187fe8;
}
.bottom {
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  text-align: center;
}
.bottom p {
  width: 100%;
  font-size: 1rem;
  border-top: 1px solid #ebb76d;
  border-bottom: 1px solid #ebb76d;
  background: #ffffff;
  padding: 0.6rem 0;
  color: #ebb76d;
}
.uploadFile{
  position: relative;
  display: inline-block;
  font-size: 3rem;
  height: 3rem;
  width: 3rem;
  border-radius: 0.5rem;
  border: 0.04rem solid #e1e1e1;
  vertical-align: middle;
  margin-right: 0.925rem;
  margin-left: 1rem;
}
.delete-icon{
    vertical-align: top;
    left: -11px;
    top: -7px;
    font-size: 1.2rem;
    color:gray;
}
.fileImg img {
  width: 3rem;
  height: 3rem;
  vertical-align: middle;
  margin-top: 5px;
}
.van-cell__value{
    flex: 3;
}
.van-cell__title{
  word-break: break-all;
}
</style>