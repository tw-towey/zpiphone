<template>
  <div>
    <van-nav-bar
      title="教学活动"
      right-text="添加活动"
      class="header"
      fixed
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div class="layout_content">
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
        <Activity :activeList="activeList" ref="activeFn" @setActive="setActive"></Activity>

      </van-list>
    </div>
  </div>
</template>

<script>
  // 活动管理->教学活动
  import Activity from "@/view/activity/Activity";

  export default {
    name: "PublishingActivities",
    components: {
      Activity: Activity
    },
    data() {
      return {
        curPage: 1,
        activeList: [],
        finishedText: "",
        error: false,
        loading: false,
        finished: false
      };
    },
    methods: {
      onClickLeft() {
        this.utils.goBack(this);
        this.$store.state.inputtext = ""
      },
      onClickRight() {
        this.$store.state.inputtext = "添加"
        this.$store.state.DepartmentEcho = '';
        this.$router.push({ name: "AddActivities", params: { id: "" } });
      },
      getLeaveList(param) {
        param = param || {
          currentPage: this.curPage,
          pageSize: this.$store.state.pageSize
        };
        this.utils.ajax({
          url: this.api.teachingList,
          data: param,
          method: "POST",
          success: data => {
            if (data.content.length) {
              if (data.totalPages > this.curPage) {
                this.curPage++;
              } else {
                this.finished = true;
                this.finishedText = "没有更多了";
              }
            } else {
              this.finishedText = "";
              this.finished = true;
            }

            this.activeList = [...this.activeList, ...data.content];
            this.loading = false;
            this.setActive(this.activeList);
          },
          error: this.getError,
          catch: this.getError
        }, true);
      },
      getError(error) {
        this.loading = false;
        this.error = true;
      },
      setActive(data) {
        this.$nextTick(()=>{
           this.activeList = [...this.$refs.activeFn.setData(data)];
        })
      },
      onLoad() {
        this.getLeaveList();
      }
    },
    created() {
    }
  };
</script>

<style scoped>

</style>
