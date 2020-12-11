<template>
  <div>
    <van-nav-bar title="活动管理" class="header" fixed left-arrow @click-left="onClickLeft">
      <div class="add-activity" slot="right" v-show="rightShow">
        <div @click="onClickRight">添加活动</div>
      </div>
    </van-nav-bar>

    <div class="layout_content" ref="layoutContent" @scroll="scroll()">
      <van-tabs v-model="active" :offset-top="40" sticky swipeable title-active-color="#1a7fe9" color="#5fa4ec"
                :line-height="2"
                @click="change" @change="change">

        <van-tab title="审核活动">
          <van-list v-model="tabs[0].loading" :finished="tabs[0].finished" :error.sync="tabs[0].error"
                    error-text="请求失败，点击重新加载" :finished-text="tabs[0].finishedText"
                    immediate-check :offset="50" @load="onLoad()">
            <AuditActivitiesLinst :activityList="tabs[0].listData"></AuditActivitiesLinst>
          </van-list>
        </van-tab>

        <van-tab title="发布活动">
          <van-list v-model="tabs[1].loading" :finished="tabs[1].finished" :error.sync="tabs[1].error"
                    error-text="请求失败，点击重新加载" :finished-text="tabs[1].finishedText"
                    immediate-check :offset="50" @load="onLoad()">
            <Activity :activeList="tabs[1].listData" ref="activeFn" @setActive="setActive"></Activity>
          </van-list>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
  import AuditActivitiesLinst from "@/view/activity/AuditActivitiesLinst";//审核活动
  import Activity from "@/view/activity/Activity";//发布活动

  export default {
    name: "ActivityManage",
    components: {
      AuditActivitiesLinst: AuditActivitiesLinst,
      Activity: Activity
    },
    data() {
      return {
        active: 0,
        rightShow: false,
        tabs: [
          {
            loading: false,
            finished: false,
            error: false,
            finishedText: '没有更多了',
            scrollTop: 0,
            listData: []
          },
          {
            loading: false,
            finished: false,
            error: false,
            finishedText: '没有更多了',
            scrollTop: 0,
            listData: []
          }
        ]
      };
    },
    methods: {
      onClickLeft() {
        this.$store.state.tabActive = 0;//返回时，置为第一个tab页
        this.utils.goBack(this);
        this.$store.state.inputtext = '';
        this.$store.state.paramsTeachingId = ''
        this.$store.state.Csoes = ''
      },
      onClickRight() {
        this.$store.state.DepartmentEcho = '';
        this.$router.push({name: "AddActivities", params: {}});
        this.$store.state.inputtext = '添加';
      },
      onLoad(){
        if (this.active == 0) {//审核活动
          this.getAuditActivityList();
          this.$store.state.Csoes = '' 
        } else {//发布活动
          this.getPublishingActivityList();
        }
      },
      change(index, title) {
        this.$nextTick(() => {
          this.$refs.layoutContent.scrollTop = this.tabs[this.active].scrollTop;
        });

        this.$store.state.tabActive = this.active;
        this.active == 1 ? this.rightShow = true : this.rightShow = false;
      },
      scroll(){
        this.tabs[this.active].scrollTop = this.$refs.layoutContent.scrollTop;//记录滑动的scrollTop高度
      },
      getAuditActivityList() {//审核活动列表
        let currentTab = this.tabs[this.active];
        let params = {
          auditFlag: '0',
          currentPage: Math.ceil(currentTab.listData.length / this.$store.state.pageSize) + 1,
          pageSize: this.$store.state.pageSize
        };

        this.utils.ajax({
          url: this.api.auditActivityList,
          data: params,
          method: "POST",
          success: data => {
            if (data.content.length) {
              currentTab.listData = [...currentTab.listData, ...data.content];
            } else {
              currentTab.finishedText = '';
            }

            currentTab.loading = false;//结束当前加载
            if (params.currentPage >= data.totalPages) {//最后一页、加载完成
              currentTab.finished = true;
            }
          },
          error: (error) => {
            currentTab.loading = false;
            currentTab.error = true;
          }
        }, true);
      },
      getPublishingActivityList() {//发布活动
        let currentTab = this.tabs[this.active];
        let params = {
          currentPage: Math.ceil(currentTab.listData.length / this.$store.state.pageSize) + 1,
          pageSize: this.$store.state.pageSize
        };
        this.utils.ajax({
          url: this.api.teachingList,
          data: params,
          method: "POST",
          success: data => {
            if (data.content.length) {
              currentTab.listData = [...currentTab.listData, ...data.content];
            } else {
              currentTab.finishedText = '';
            }
            currentTab.loading = false;//结束当前加载
            if (params.currentPage >= data.totalPages) {//最后一页、加载完成
              currentTab.finished = true;
            }
            this.setActive(currentTab.listData);
          },
          error: (error) => {
            currentTab.loading = false;
            currentTab.error = true;
          }
        }, true);
      },
      setActive(data) {
        let currentTab = this.tabs[this.active];
        this.$nextTick(()=>{
            currentTab.listData = [...this.$refs.activeFn.setData(data)];
        })
      },
    },
    created() {
      //通过详情返回后，定位到上次点击的tab页位置
      this.active = this.$store.state.tabActive;
      this.active == 1 ? this.rightShow = true : this.rightShow = false;
    }
  };
</script>

<style scoped>
  .add-activity {
    color: #fff;
  }
</style>
