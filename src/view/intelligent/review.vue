<template>
  <div class>
    <van-nav-bar title="审核情况" class="header" fixed left-arrow @click-left="onClickLeft" />
    <div class="layout_content">
      <div class="peview_top">
        <div class="peview_top_content">
          <dl @click="getLeaveList(activt=0, false)">
            <dt>
              <img src="../../assets/images/home/pic0318_02.svg" alt />
            </dt>
            <dd>
              <p>{{auditCount.uncheckedCount}}</p>
              <p>待审核</p>
            </dd>
          </dl>
          <dl>
            <dt @click="getLeaveList(activt=1, false)">
              <img src="../../assets/images/home/pic0318_03.svg" alt />
            </dt>
            <dd>
              <p>{{auditCount.checkedCount}}</p>
              <p>已审核</p>
            </dd>
          </dl>
        </div>
      </div>

      <div class="peview_content">
        <van-list
          v-model="loading"
          :finished="finished"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          :finished-text="finishedText"
          immediate-check
          :offset="50"
          @load="onLoad()"
        >
          <div class="submit_date" v-for="(item,index) in listObj" :key="index">
            <div class="submit_top">
              <div class="submit_top1">
                <div class="submit_top_data"  style="font-size:0.6rem">
                  <img src="../../assets/images/home/dateTime.png" alt />
                  <span>提交时间：</span>
                  <span>{{item.createTime}}</span>
                </div>
                <div  style="font-size:0.6rem" v-if="isShow" class="submit_top_success" @click="changeShowStatus(true,item)">
                  <p>
                    <van-icon name="success" />
                  </p>
                  <p>审核</p>
                </div>
              </div>
            </div>

            <ul class="peview_table">
              <li>
                <p>培训基地意见：</p>
                <p
                  :class="item.trainOpinion==0?'red':item.trainOpinion>3?'red':'green'"
                >{{utils.getValueByKey(signUpColumns, item.trainOpinion)}}</p>
              </li>
              <li>
                <p>专业基地意见：</p>
                <p
                  :class="item.subjectOpinion==0?'red':item.subjectOpinion>3?'red':'green'"
                >{{utils.getValueByKey(signUpColumns, item.subjectOpinion)}}</p>
              </li>
              <li>
                <p>带教老师意见：</p>
                <p
                  :class="item.teacherOpinion==0?'red':item.teacherOpinion>3?'red':'green'"
                >{{utils.getValueByKey(signUpColumns, item.teacherOpinion)}}</p>
              </li>
              <li>
                <p>学员名称：</p>
                <p>{{item.name}}</p>
              </li>
              <li>
                <p>学员照片：</p>
                <p>
                  <img :src="item.avatar" @click="imgClick(item)" />
                </p>
              </li>
              <li>
                <p>参培年月：</p>
                <p>
                  {{item.traineeYear}}
                  <span v-if="item.traineeYear==''?false:true">年</span>
                </p>
              </li>
              <li>
                <p>承担防控任务时间：</p>
                <p>{{item.startDate}}</p>
              </li>
              <li>
                <p>防控任务类型：</p>
                <p>{{utils.getValueByKey(item.taskTypeOption, item.taskType)}}</p>
              </li>
              <li>
                <p>自我评价：</p>
                <p class="blue" @click="evaluation(item.selfcaTion)">点击查看</p>
              </li>
            </ul>
          </div>
        </van-list>
      </div>

      <van-dialog
        use-slot
        :title="modust.title"
        v-model="modust.show"
        show-cancel-button
        confirm-button-open-type="getUserInfo"
        bind:close="onClose"
        :showConfirmButton="false"
        bind:getuserinfo="getUserInfo"
        cancelButtonText="关闭"
      >
        <div class="imgText" v-if="modust.flage">
          <img class="imgDialog" :src="modust.src" />
        </div>
        <div v-else class="domDialo">
          <p>{{modust.value}}</p>
        </div>
      </van-dialog>
      <van-popup v-model="isPopup.isNeedEShow" position="bottom" :overlay="true">
        <van-picker
          show-toolbar
          title="审核意见"
          :columns="isPopup.signUpColumns"
          @confirm="confirmNeed"
          @cancel="changeShowStatus(false)"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
export default {
  name: "review",
  components: {},
  data() {
    //这里存放数据
    return {
      loading: true,
      finished: false,
      error: false,
      finishedText: "没有更多了",
      surveyId: "",
      listObj: [],
      modust: {
        show: false,
        src: "",
        flage: false,
        title: ""
      },
      isShow: true,
      signUpColumns: [
        { value: "未审核", key: 0 },
        { value: "优秀", key: 1 },
        { value: "良好", key: 2 },
        { value: "一般", key: 3 },
      ],
      isPopup: {
        isNeedEShow: false,
        signUpColumns: [
          { text: "优秀", value: 1 },
          { text: "良好", value: 2 },
          { text: "一般", value: 3 },
        ],
        item: ""
      },
      auditCount: {
        checkedCount: "",
        uncheckedCount: ""
      },
      activt: 0,

    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    onLoad() {
      console.log('sss');
      setTimeout(() => {
         this.getLeaveList(this.activt, true);
      }, 100);
     
    },
    imgClick(item) {
      console.log(item);
      this.modust.flage = true;
      this.modust.show = true;
      this.modust.src = item.avatar;
      this.modust.title = "学员照片";
    },
    evaluation(item) {
      this.modust.flage = false;
      this.modust.show = true;
      this.modust.title = "自我评价";
      this.modust.value = item;
    },
    getUserInfo(event) {
      console.log(event.detail);
    },
    reviewSubmit(item) {},
    changeShowStatus(status, item) {
      //更改弹出层状态
      this.isPopup.isNeedEShow = status;
      this.isPopup.item = item;
    },
    confirmNeed(e) {
      // 审核
      let obj = {
        surveyHumanIdList: [this.isPopup.item.id],
        auditOpinion: e.value
      };
      this.isPopup.isNeedEShow = false;
      this.utils.ajax({
        url: this.api.batchAudit,
        data: obj,
        method: "POST",
        success: data => {
          this.Toast("已审核");
          this.survey();
        }
      });
    },
    isReview(surveyId) {
      // 已审核未审核
      let obj = {
        id: surveyId
      };
      this.utils.ajax({
        url: this.api.auditCount,
        data: obj,
        method: "POST",
        success: data => {
          this.auditCount = data;
        }
      });
    },
    getLeaveList(Audit, update) {
      let _this = this;
      if(!update){
          this.loading = true,
          this.finished = false,
          this.error = false,
          this.finishedText = '没有更多了',
          this.listObj = [];
      }
      var obj = {
        currentPage: Math.ceil(this.listObj.length / 2) + 1,
        pageSize: 2,
        isAudit: Audit,
        id: this.surveyId.surveyId
      };
      this.utils.ajax({
        url: this.api.findAuditList,
        data: obj,
        method: "POST",
        success: data => {
          if (Audit == 1) {
            this.isShow = false;
          } else {
            this.isShow = true;
          }
          let content = data.content;
          if (data.content.length) {
            content = data.content.map(item => {
              const i = item;
              let startDate = "";
              let endDate = "";
              i.answer.map(e => {
                const m = e;
                if (e.id == "avatar") {
                  i.avatar = e.value[0].path;
                }
                if (e.id == "startDate") {
                  startDate = e.value;
                }
                if (e.id == "endDate") {
                  endDate = e.value;
                }
                if (e.id == "name") {
                  item.name = e.value;
                }
                i.startDate = startDate + "~" + endDate;
                if (e.id == "taskType") {
                  i.taskType = e.value;
                  i.taskTypeOption = [];
                  e.optionList.forEach(k => {
                    i.taskTypeOption.push({
                      key: k.value,
                      value: k.label
                    });
                  });
                }
                if (e.id == "content") {
                  i.content = e.value;
                }
                if (e.id == "selfcaTion") {
                  i.selfcaTion = e.value;
                }
                return m;
              });
              return i;
            });
            if (update) {
              this.listObj = [...this.listObj, ...content];
            } else {
              this.listObj = content;
            }
          } else {
            this.finishedText = "暂无数据...";
            this.listObj = [];
          }
          _this.loading = false; //结束当前加载
          if (obj.currentPage >= data.totalPages) {
            //最后一页、加载完成
            _this.finished = true;
          }
        }
      });
    },
    survey() {
      this.utils.ajax({
        url: this.api.findInstitutionSurveyId,
        method: "POST",
        success: data => {
          this.surveyId = data;
          this.isReview(data.surveyId);
          this.getLeaveList(0, true);
        }
      });
    }
  },
  created() {
    this.survey();
  }
};
</script>
<style scoped>
p,
dl,
dt,
dd {
  margin: 0;
  padding: 0;
}
.peview_top {
  background: white;
}
.peview_top_content {
  width: 70%;
  padding: 2rem;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.peview_top_content img {
  width: 3.5rem;
  height: 3.5rem;
}
.peview_top_content dl {
  display: flex;
  width: 40%;
  justify-content: space-between;
}
.peview_top_content dd p:nth-last-of-type(2) {
  font-size: 1.5rem;
}
.peview_top_content dd p:nth-last-of-type(1) {
  color: #333;
}
.peview_top_content dd {
  margin-top: 0.3rem;
}
.peview_content {
  width: 95%;
  margin: 0 auto;
  height: 31rem;
  overflow-y: auto;
}
.submit_date {
  width: 100%;
  margin-top: 0.5rem;
}
.submit_top {
  width: 99.8%;
  background: #666666;
  padding: 0.5rem 0;
  color: white;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
}
.submit_top_success {
  display: flex;
  padding: 0.2rem 0.5rem;
  background: #2ecc71;
  justify-content: space-between;
  width: 15%;
  border-radius: 6px;
}
.submit_top1 {
  width: 88%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.submit_top_success p:nth-last-of-type(2) {
  width: 0.7rem;
  height: 0.7rem;
  border: 1px solid white;
  margin-top: 0.1rem;
}
.submit_top_data {
  display: flex;
  margin-top: 0.3rem;
  line-height: 1rem;
  width: 70%;
}
.submit_top_data img {
  width: 0.9rem;
  height: 0.9rem;
}
.peview_table {
  width: 99%;
  background: white;
  border: 1px solid #ccc;
  margin-top: 0.1rem;
  font-size: 0.6rem;
}
.peview_table li {
  display: flex;
}
.peview_table li p {
  padding: 0.3rem 1rem;
  border-bottom: 1px solid #ccc;
}
.peview_table li p:nth-last-of-type(2) {
  width: 38%;
  border-right: 1px solid #ccc;
}
.peview_table li img {
  width: 1.3rem;
  height: 1.3rem;
}
.peview_table li p:nth-last-of-type(1) {
  width: 46%;
}
.colorRed {
  color: red;
}
.colorGrin {
  color: #2ecc71;
}
.imgDialog {
  width: 15rem;
  height: 15rem;
}
.imgText {
  text-align: center;
}
.domDialo {
  width: 18rem;
  max-height: 15rem;
  overflow-y: auto;
  margin: 0 auto;
  padding: 0.5rem;
}
.van-dialog{
  border-radius: 1.25rem !important;
}

</style>