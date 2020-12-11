<template>
  <div class>
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
      <div class="attend">
        <div class="disola" v-for="(item,index) in applyListt" :key="index">
          <ul>
            <li @click="attendDetails(item)">
              <p class="peot">{{item.title}}</p>
              <div class="time">
                <p>活动时间：</p>
                <p>{{ utils.formatDate(item.startTime, "yyyy-MM-dd HH:mm") }} ~ {{ utils.formatDate(item.endTime, "yyyy-MM-dd HH:mm") }}</p>
              </div>
              <div class="time">
                <p>报名人数：</p>
                <p>{{item.numOfSignUp }}</p>
              </div>
              <div class="time">
                <p><span> 主&nbsp;&nbsp;讲&nbsp;&nbsp;人：</span></p>
                <p> {{item.speaker}} </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  name: "ActivityParticipated",
  data() {
    return {
      applyListt: [],
      loading: false,
      finished: false,
      error: false,
      finishedText: "没有更多了"
    };
  },
  methods: {
    getLeaveList(item) {
      //发布活动
      let param = {
        currentPage:
          Math.ceil(this.applyListt.length / this.$store.state.pageSize) + 1,
        pageSize: this.$store.state.pageSize,
        joined: 1,
        isMobile: 1,
        startDate: this.$store.state.timeStartDate
      };

      this.utils.ajax({
        url: this.api.queryOwnTeachingList,
        data: param,
        method: "POST",
        success: data => {
          if (item) {
            this.applyListt = data.content;
          } else {
            if (data.content.length) {
              this.applyListt = [...this.applyListt, ...data.content];
            } else {
              // this.finishedText = "没";
            }
          }
          this.loading = false; //结束当前加载
          if (param.currentPage >= data.totalPages) {
            //最后一页、加载完成
            this.finished = true;
          }
        }
      });
    },
    attendDetails(item) {
      // 已参加活动详情
      this.$router.push({
        name: "ActiveParticipation",
        params: {
          id: item.id,
          condition: "ToStayIn",
          memberCaId: item.memberCaId
        }
      });
    },
    onLoad() {
      this.getLeaveList();
    }
  },
  created() {},
  mounted() {}
};
</script>
<style  scoped>
.attend {
  background: white;
}
.attend ul,
.attend ul li,
.attend ul li p {
  margin: 0;
  padding: 0;
}
.attend ul {
  width: 90%;
  margin: 0 auto;
}
.attend ul li {
  padding: 0.5rem 0;
}
.attend ul li .peot {
  color: #000000;
}
.attend ul li p {
  color: #b5b5b5;
}
.time {
  display: flex;
  padding: 0.2rem 0;
}
.disola {
  padding: 0.05rem 0;
  border-bottom: 1px solid #f5f5f5;
}
</style>