
<template>
  <div>
    <div class="activity_content">
      <div class="activty_left_content">
        <van-list
          v-model="loading"
          :error.sync="error"
          immediate-check
          error-text="请求失败，点击重新加载"
          :finished="finished"
          :finished-text="finishedText"
          :offset="50"
          @load="onLoad"
        >
          <div v-for="(item,index) in applyList">
            <p @click="switchover(item)">{{item.title}}</p>
            <p @click="switchover(item)">活动时间: {{item.startTime }} - {{item.endTime }}</p>
            <p @click="switchover(item)">发布时间: {{item.timeOfRelease }}</p>
            <div class="people">
              <p @click="switchover(item)">报名人数：{{item.numOfSignUp }}</p>
              <p :class="item.havenot">{{item.started}}</p>
            </div>
            <div class="font_color">
              <button
                :class="item.clasState"
                @click="cancel(item)"
                :disabled="item.disabledCall"
              >取消报名</button>
              <button class="but_cancel" @click="tabclass(item)">打卡详情</button>
            </div>
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ActivitiesAttended",
  components: {},
  data() {
    return {
      applyList: [],
      loading: false,
      finished: false,
      finishedText: "",
      error: false,
      params: {
        currentPage: 1,
        pageSize: this.$store.state.pageSize,
        isStart: 1,
        isMobile: 1
      }
    };
  },
  methods: {
    onLoad() {
      this.getLeaveList();
    },
    switchover(item) {
      // 待参加详情
      console.log("itemmmmm", item);
      this.$store.state.activitiesDetailsObj = {
        id: item.id,
        condition: "ToStayIn",
        memberCaId: item.memberCaId
      };
      this.$router.push({
        name: "ActivitiesDetails"
      });
    },
    tabclass(item) {
      // 打卡详情
      this.$router.push({
        name: "PunchCards",
        params: {
          id: item.id,
          condition: "ToStayIn",
          memberCaId: item.memberCaId,
          startTime: item.startTime,
          endTime: item.endTime
        }
      });
    },
    cancel(item) {
      console.log(item, "ppoiooo");
      this.applyingY(2, item.memberCaId, item.id);
      // 取消报名
    },
    applyingY(flag, memberId, teachingId) {
      // 取消报名
      var _this = this;
      var params = {
        flag: flag,
        memberId: memberId,
        teachingId: teachingId
      };
      this.utils.ajax({
        url: this.api.upOrCancelSignTeaching,
        data: params,
        method: "POST",
        success: data => {
          console.log(data, "pqpwpqpwp");
          setTimeout(() => {
            this.Toast("取消报名成功");
          }, 300);
          this.getLeaveList(1);
        }
      });
    },
    getLeaveList(update) {
      //发布活动
      console.log(this.$store.state.pageSize);

      var obj = {
        currentPage: 1,
        pageSize: this.$store.state.pageSize,
        isMobile: 1,
        waitingJoin: 1
      };
      this.utils.ajax({
        url: this.api.queryOwnTeachingList,
        data: obj,
        method: "POST",
        success: data => {
          if (data.content.length) {
            if (data.totalPages > this.params.currentPage) {
              this.params.currentPage++;
            } else {
              this.finished = true;
              this.finishedText = "没有更多了";
            }
          } else {
            this.finishedText = "";
            this.finished = true;
          }
          this.loading = false;
          data.content.map(i => {
            const item = i;
            let startTime = this.utils.getTime(item.startTime); // 活动开始
            let endTime = this.utils.getTime(item.endTime); // 活动结束
            let timestamp = this.utils.getTime(this.$store.state.timestamp); // 服务器时间
            var sd = 7200000;
            var hours = parseInt(
              (sd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            if (timestamp < startTime) {
              item.started = "未开始";
            }
            if (timestamp > startTime && timestamp < endTime) {
              item.started = "进行中";
            }
            item.havenot =
              item.started == "未开始"
                ? "havenot"
                : item.started == "进行中"
                  ? "havenotSt"
                  : "havenot";
            // if (item.isSignUp == 1 && startTime > timestamp && item.joinFlag === 1) {
            //   //是否需要报名 1是0否
            //   // 如果是1且开始时间大于现在时间可以取消报名
            //   //  取消报名
            //   item.state = 1;
            //   item.clasState = "but_cancel";
            // } else if (item.isSignUp !== 1 && startTime < timestamp) {
            //   item.state = 2;
            //   item.clasState = "but_issue";
            // } else {
            //   item.state = 2;
            //   item.clasState = "but_issue";
            // }

            if (item.isSignUp == 1 && startTime > timestamp && item.joinFlag === 1) {
              //是否需要报名 1是0否
              // 如果是1且开始时间大于现在时间可以取消报名
              //  取消报名
              item.state = 1;
              item.clasState = "but_cancel";
            }else{
              item.state = 2;
              item.clasState = "but_issue";
            }
            // if (item.joinFlag === 1) {
            //   //  0否 1是 2取消
            //   item.clasState = "but_cancel";
            // } else {
            //   item.clasState = "but_issue";
            // }
            item.classIssue =
              item.state === 1
                ? "but_issue"
                : item.state === 2
                  ? "but_cancel"
                  : "but_cancel";

            item.classDelete =
              item.state === 1
                ? "but_issue"
                : item.state === 2
                  ? "but_cancel"
                  : "but_cancel";
            item.disabled = item.classIssue === "but_issue" ? true : false;
            item.disabledRem = item.classDelete === "but_issue" ? true : false;
            item.disabledCall = item.clasState === "but_issue" ? true : false;
            return item;
          });
          console.log(data.content.started, "ywywyywy");
          if (update) {
            this.applyList = data.content;
            return;
          }
          this.applyList = [...this.applyList, ...data.content];
          console.log(this.applyList, "kkkkkkkkksk");
        }
      });
    }
  },
  created() {}
};
</script>
<style scoped>
.activity_content {
  width: 100%;
  background: white;
  border-bottom: 1px solid #f5f5f5;
  padding-bottom: 0.5rem;
}
.activty_left_content {
  width: 90%;
  margin: 0 auto;
}
.activty_left_content p:nth-of-type(2),
.activty_left_content p:nth-of-type(3) {
  color: #afafaf;
  font-size: 0.68rem;
  padding: 0;
  margin: 0;
}
.activty_left_content p:nth-of-type(1) {
  padding: 0.3rem 0;
  margin: 0;
}
.font_color {
  font-size: 0.68rem;
  padding: 0.5rem 0;
  width: 100%;
  justify-content: space-between;
}
.font_color button {
  border: 0;
}
.but_cancel {
  padding: 0.2rem 0.7rem;
  border-radius: 50px;
  background: #eef7fe;
  color: #187fe8;
}
.but_issue {
  padding: 0.2rem 0.7rem;
  border-radius: 50px;
  background: #e5e5e5;
  color: #c4c4c4;
}
.people {
  display: flex;
  justify-content: space-between;
}
.people p:nth-of-type(1) {
  color: #afafaf;
  font-size: 0.68rem;
  padding: 0;
  margin: 0;
}
.havenot {
  border: 1px solid #f9c97e;
  color: #f9c97e !important;
  padding: 0.1rem 0.5rem !important;
  border-radius: 10px;
}
.havenotSt {
  border: 1px solid #b7e4cb;
  color: #b7e4cb !important;
  padding: 0.1rem 0.5rem !important;
  border-radius: 10px;
}
</style>