<template>
  <div class>
    <van-nav-bar title="活动详情" class="header" @click-left="onClickLeft()" fixed left-arrow/>
    <div class="head layout_content">
      <div class="cont">
        <h3>{{activity.title}}</h3>
        <ul>
          <li>
            <p>活动时间：</p>
            <p class="activity-time">{{activity.startTime}} ~ {{activity.endTime}}</p>
          </li>
          <li>
            <p>主讲人：</p>
            <p>{{activity.speaker}}</p>
          </li>
          <li>
            <p>地点：</p>
            <p>{{activity.locationOfTeaching}}</p>
          </li>
          <li>
            <p>报名人数：</p>
            <p class="p1">{{activity.numOfSignUp}}</p>
          </li>
        </ul>
      </div>
      <div class="empty"></div>
      <div class="cont">
        <p>活动详情：</p>
        <p v-html="activity.detail"></p>
        <p>上传资料：</p>
        <div class="datum">
          <div class="img a" v-for="(item,index) in activity.attachmentList">
            <p @click="showAttachment(item,index)">{{item.name}}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="button">
      <p class="pass" @click="audit(1,'审核通过')">审核通过</p>
      <p class="noPass" @click="noPass()">审核不通过</p>
    </div>

    <van-dialog v-model="noPassShow" show-cancel-button :before-close="beforeClose">
      <p class="cause">审核意见</p>
      <van-field
        v-model="reason"
        type="textarea"
        placeholder="请输入审核意见"
        class="textarea"
        rows="1"
        autosize
      />
    </van-dialog>
  </div>
</template>

<script>
export default {
  name: "LookAttendance",
  data() {
    return {
      reason: "",
      noPassShow: false,
      imgList: [],
      imgIndexMap: new Map(),
      activity: {}
    };
  },
  //方法集合
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    queryActivityDetail() {
      //活动详情
      this.utils.ajax({
        url: this.api.auditActivityDetail,
        data: this.$route.params,
        method: "POST",
        success: data => {
          //获取所有图片、并且记录原始index和现有index对应关系
          data.attachmentList.forEach((item, index) => {
            if (this.utils.checkSuffix(item.name)) {
              this.imgList.push(item.path);
              this.imgIndexMap.set(index, this.imgList.length - 1);
            }
          });
          this.activity = data;
        }
      });
    },
    noPass() {
      //不通过
      this.noPassShow = true;
    },
    beforeClose(action, done) {
      if (action === "confirm") {
        //确定
        if (!this.reason) {
          this.Toast({ duration: 500, message: "请填写审核意见" });
          done(false);
          return;
        }

        if (this.reason.length > 100) {
          return;
        }

        this.audit(2, "审核不通过");
        done();
      } else {
        //取消
        this.reason = ""; //清空原因
        done();
      }
    },
    audit(auditFlag, reminder) {
      let params = {
        auditFlag: auditFlag,
        auditNote: this.reason,
        teachingIds: [this.$route.params.id]
      };

      this.utils.ajax({
        method: "post",
        data: params,
        url: this.api.saveTeachingAuditResult,
        success: data => {
          setTimeout(() => {
            this.Toast(reminder);
          }, 300);
          this.utils.goBack(this);
        }
      });
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
  created() {
    this.queryActivityDetail();
  }
};
</script>
<style scoped>
.head {
  background: white;
}

.cont {
  width: 90%;
  margin: 0 auto;
  padding: 0.5rem 0;
}

.head p,
h3 {
  padding: 0;
  margin: 0;
}

.cont ul li p {
  color: #9a9a9a;
}

.cont ul li p:nth-of-type(1) {
  width: 70px;
  text-align: right;
}

.activity-time {
  color: #facd8a !important;
  line-height: 1.3rem;
}

.p1 {
  line-height: 1.3rem;
}

.cont ul li {
  display: flex;
}

.head p {
  font-size: 0.815rem;
  padding: 0.2rem 0;
}

.look {
  display: flex;
  justify-content: space-between;
}

.datum {
  width: 100%;
  /*display: flex;*/
  /*justify-content: space-between;*/
}

.cause {
  text-align: center;
  padding: 0.2rem;
  border-bottom: 1px solid #f8f8f8;
}

.button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  color: white;
  font-size: 0.875rem;
}

.button p {
  width: 50%;
  text-align: center;
  padding: 0.5rem 0;
  margin: 0;
}

.button .pass {
  background: #007acc;
}

.button .noPass {
  background: #cd3333;
}

.empty {
  padding: 0.3rem 0;
  width: 100%;
  background: #f0f0f0;
}
</style>
