<template>
  <div class="activity">
    <van-cell title="教学活动" value="查看全部" is-link to="TeachingActivities"/>
    <van-list
      v-model="loading"
      :finished="finished"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      :finished-text="finishedMsg"
      immediate-check
      :offset="50"
      @load="onLoad"
    >
      <div class="activityList">
        <ul>
          <li v-for="(activityItem,index) in activityList" @click="activityView(activityItem)" :key="index">
            <div class="activity_title">{{activityItem.title}}</div>
            <p class="activity_time">报名时间： {{activityItem.signInDate}}</p>
            <p class="activity_time">活动时间： {{activityItem.startTime}} 至 {{activityItem.endTime}}</p>
          </li>
        </ul>
      </div>
    </van-list>
  </div>
</template>

<script>
  /*首页->教学活动列表*/
  export default {
    name: "HomeActive",
    data() {
      return {
        loading: false,
        finished: false,
        error: false,
        currentPage: 0,
        finishedMsg: '没有更多了',
        activityList: [],
        activityPager: {},
        teaching: 'teaching_activity',
      };
    },
    methods: {
      onLoad() {
        // this.currentPage = this.activityPager.number ? this.activityPager.number - 0 + 1 : 1;
        this.currentPage = Math.ceil(this.activityList.length/5)+1;
        // 异步更新数据
        this.utils.ajax({
          method: "POST",
          url: this.api.homeActivity,
          data: {
            currentPage: this.currentPage,
            pageSize: 5,
            flagOfRelease: 2,
            isStart: 0,
            isSignUp:1,
            joinFlags:[0,2]
          },
          success: (data) => {
            this.finishedMsg = '没有更多了';
            this.activityPager = data;
            if(data.content.length) {
              data.content.forEach(item => {
                if(item.isSignUp === 1) {
                  let time = item.startTime.replace(/-/g,'/');
                  item.signInDate =  this.utils.formatDate(new Date(time).getTime() - (2 * 60 * 60 * 1000)) + ' 前';
                  item.signInDate =  this.utils.formatDate(new Date(time).getTime() ) + ' 前';
                }else{
                  item.signInDate = '无需报名';
                }
                item.startTime = this.utils.formatDate(item.startTime);
                item.endTime = this.utils.formatDate(item.endTime);
                this.activityList.push(item);
              });
            }else {
              this.finishedMsg = '暂无数据';
            }
            // 加载状态结束
            this.loading = false;
            // 数据全部加载完成
            if (this.currentPage >= this.activityPager.totalPages) {
              this.finished = true;
            }
          },
          error: (error) => {
            this.loading = false;
            this.error = true;
          }
        }, true);
      },
      activityView(list) {
        this.$store.state.activitiesDetailsObj = { id: list.id,condition:this.teaching,memberCaId:list.memberCaId }
        this.$router.push({ name: "ActivitiesDetails"});
        // this.$router.push({ path: "Test", query: { id: list.id } });

      }
    }
  };
</script>

<style scoped>
  .activity {
    border-bottom: .07rem solid #ddd;
  }

  .activity .van-cell__title span {
    font-size: 1rem;
  }

  .activityList {
    background: #fff;
    border-bottom: .07rem solid #ddd;
  }

  .activity .van-cell:not(:last-child)::after {
    /*border-bottom: none;*/
    border-bottom: .07rem solid #ddd;
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
    left: 0;
  }

  .activityList li {
    /*height: 4rem;*/
    border-bottom: .0625rem solid #ebedf0;
    padding: .5rem .9rem;
  }

  .activityList p {
    color: #999;
    font-size: .7rem;
    margin: 0;
    padding: .1rem 0;
  }

  .activityList div {
    height: 1.2rem;
    overflow: hidden;
    font-size: 1rem;
    padding: .2rem 0;
  }
</style>
