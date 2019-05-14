<template>
  <div>
    <div v-if="activityList.length" class="head">
      <div class="cont bt" v-for="item in activityList">
        <h3>{{item.title}}</h3>
        <p class="p">活动类型： {{utils.getValueByKey($store.state.activitiesType, item.type)}}</p>
        <p class="p">开始时间： {{item.startTime}}</p>
        <p class="p">结束时间： {{item.endTime}}</p>
        <p class="p">活动时长： {{item.classHour}}</p>
        <div class="look">
          <p class="p">发布时间： {{item.timeOfRelease}}</p>
          <p class="check a" @click="look(item)">查看</p>
        </div>
      </div>
    </div>

    <div v-else class="tip-empty"><span class="icon-emptyface"></span><span class="text-empty">没有相关信息</span></div>
  </div>
</template>

<script>

  export default {
    //import引入的组件需要注入到对象中才能使用
    name: "AuditActivitiesLinst",
    props: ['activityList'],
    components: {},
    data() {
      return {};
    },
    methods: {
      look(item){
        this.$router.push({name: "LookAttendance", params: {id: item.id, isPreview: 1}});
      },
    },
    created() {
    },
  };
</script>
<style scoped>
  .head {
    background: white;
  }

  .cont {
    padding: 0.5rem 1rem;
  }

  .head p, h3 {
    padding: 0;
    margin: 0;
  }

  .cont h3 {
    font-size: 0.93rem;
  }

  .head .p {
    color: #9A9A9A;
    padding: 0.2rem 0;
    font-size: 0.8rem;
  }

  .head p:nth-of-type(1) {
    margin-top: 0.4rem;
  }

  .look {
    display: flex;
    justify-content: space-between;
  }

  .check {

    line-height: 2rem;
  }
</style>
