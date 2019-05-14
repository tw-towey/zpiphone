
<template>
  <div>
    <van-nav-bar title="活动详情" class="header" fixed left-arrow @click-left="onClickLeft"/>
    <div class="layout_content">
      <div>
        <div class="heade">
          <ul class="heade_top">
            <li>
              <h3>{{applyList.title}}</h3>
            </li>
            <li>
              <p>活动时间：</p>
              <p class="p">{{applyList.startTime}} - {{applyList.endTime}}</p>
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
          </ul>
        </div>
        <div class="background">
          <ul>
            <li>
              <h3>活动详情</h3>
            </li>
            <li>
              <p>{{applyList.detail}}</p>
            </li>
            <li>
              <div class="pwith" v-for="(i,index) in applyList.attachmentList">
                <p @click="showAttachment(i,index)">{{i.name}}</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="background">
          <van-cell-group>
            <van-cell title="签到时间" :value="applyList.signInDate"/>
            <van-cell title="签退时间" :value="applyList.signOutDate"/>
            <van-cell title="实际学习" :value="classHour"/>
          </van-cell-group>
        </div>
      </div>
      <van-dialog
        v-model="feedback"
        title="意见反馈"
        show-cancel-button
        confirm-button-text="提交"
        :before-close="beforeClose"
      >
        <van-cell-group>
          <van-field
            v-model="message"
            type="textarea"
            :placeholder="placeholder"
            maxlength="500"
            rows="1"
            autosize
          />
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
      src: [],
      isfala: false,
      indexpng: "",
      actual: "",
      feedback: false, // 意见反馈
      message: "",
      placeholder: "建议或意见，不得超过500字",
      classHour: "小时"
    };
  },
  created() {
    this.getLeaveList(this.$route.params.id);
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
            memberCaId: this.$route.params.memberCaId,
            content: this.message
          };
          this.utils.ajax({
            url: this.api.saveFeedBackForTeaching,
            data: params,
            method: "POST",
            success: data => {}
          });
          done();
        }
      } else {
        done();
      }
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
  mounted() {}
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
.heade {
  background: white;
}
.heade_top {
  width: 90%;
  margin: 0 auto;
  padding: 0.3rem 0;
}
.heade_top li {
  display: flex;
}
.heade_top li p:nth-of-type(1) {
  width: 70px;
  text-align: right;
}
.heade_top li {
  padding: 0.2rem 0;
}
.heade_top li p {
  color: #888888;
  font-size: 0.8rem;
}
.heade_top li .p {
  color: #f6ae48;
}
.background {
  background: white;
  margin-top: 0.8rem;
  padding: 0.3rem 0;
}
.background ul {
  width: 90%;
  margin: 0 auto;
}
.background ul li {
  padding: 0.2rem 0;
}
.background ul li p {
  line-height: 1.5rem;
}
.background ul li div p {
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
</style>