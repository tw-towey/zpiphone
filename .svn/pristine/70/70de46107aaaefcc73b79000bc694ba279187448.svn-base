
<template>
  <div class="layout_content">
    <van-nav-bar left-arrow :title="title" fixed border @click-left="onClickLeft" class="header"></van-nav-bar>
    <div class="heade">
      <div class="head">
        <ul v-for="medical in applyList">
          <li v-for="item in temple">
            <template v-if="item.type !== 'show'">
              <p>{{item.field}}</p>
              <p>{{medical[item['name']]}}</p>
            </template>
            <div v-if="item.type == 'show'">
              <p>{{item.field}}</p>
              <p>{{medical[item['name']]}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Management",
  components: {},
  data() {
    return {
      title: "",
      applyList: [],
      temple: [
        { field: "活动类别：", name: "type", leftClass: "gray" },
        { field: "活动标题：", name: "classes", leftClass: "gray" },
        { field: "主讲人：", name: "speaker", leftClass: "gray" },
        { field: "手机号：", name: "cellnumber", leftClass: "gray" },
        { field: "是否报名：", name: "issign", leftClass: "gray" },
        { field: "人数限制：", name: "restrictions", leftClass: "gray" },
        {
          field: "活动摘要：",
          name: "digest",
          leftClass: "gray",
          type: "show"
        },
        {
          field: "活动详情：",
          name: "Details",
          leftClass: "gray",
          type: "show"
        },
        { field: "开始时间：", name: "startTime", leftClass: "gray" },
        { field: "结束时间：", name: "endTime", leftClass: "gray" },
        { field: "时长：", name: "duration", leftClass: "gray" },
        { field: "接收对象：", name: "object", leftClass: "gray" },
        { field: "科室名称：", name: "department", leftClass: "gray" }
      ]
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    getLeaveList(param) {
      //发布活动
      this.utils.ajax({
        url: this.api.queryApplyList,
        data: param,
        method: "POST",
        success: data => {
          console.log(data);
          data = [
            {
              type: "2019骨科中青年医师病例大赛 关节骨科全国总决赛",
              startTime: "2019/01/28 17:00",
              endTime: "2019/01/31 17:00",
              state: 1,
              classes: "入科教育",
              speaker: "张三",
              Thecourt: "院外",
              cellnumber: "13260411677",
              issign: "是",
              restrictions: "10",
              digest:
                "爱上朗朗上口的打卡爱丽丝的撒娇大数据的喀什觉得卡索拉的绿卡岁的卢卡斯的",
              Details:
                "看我今年第哦啊实打实的卡送监督卡圣诞节卡时间的撒开了多久",
              duration: "0.5",
              object: "带教",
              department: "消化二科"
            }
          ];
          this.applyList = data;
        }
      });
    }
  },
  created() {
    this.title = this.$route.params.id.type;
    this.getLeaveList();
  }
};
</script>
<style  scoped>
.heade {
  background: white;
}
.head {
  width: 95%;
  margin: 0 auto;
}
p {
  padding: 0;
  margin: 0;
}
.head ul li {
  display: flex;
  padding: 0.3rem 0;
  border-bottom: 1px solid #f0f0f0;
}
.head ul li p:nth-of-type(1) {
  width: 4.7rem;
  text-align: right;
  font-size: 0.8rem;
  color: #afafaf;
}
.head ul li p:nth-of-type(2) {
  font-size: 0.7rem;
  line-height: 1.4rem;
}
.head ul li div p:nth-of-type(2) {
  margin-top: 0.5rem;
  text-indent: 2em;
  line-height: 1.5rem;
  padding: 0 1rem;
}
</style>