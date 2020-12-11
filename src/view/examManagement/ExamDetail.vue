<template>
  <div>
    <van-nav-bar :title="params.assessName" class="header" fixed left-arrow @click-left="onClickLeft" />
    <div class="examBox" style="margin-top:2.5rem;">
      <div v-for="(item,index) in 1" class="infoList" :key="index">
        <ul class="infoListUl">
          <li>
            <label for="">考试名称：</label>
            <span>{{params.assessName}}</span>
          </li>
          <li>
            <label for="">考试时间：</label>
            <span>{{getTimeData(params.assessStartTime,params.assessEndTime)}}</span>
          </li>
          <li>
            <label for="">考试地点：</label>
            <span>{{params.assessAddress}}</span>
          </li>
          <li>
            <label for="">考官：</label>
            <span v-for="(kaoguan,index) in params.assessHumanTeacherList" :key="index">{{kaoguan.humanName}} {{index !== params.assessHumanTeacherList.length-1 ? "、":""}} </span>
          </li>
          <li>
            <label for="">考试项：</label>
            <span>{{params.assessItemValue}}</span>
          </li>
          <li>
            <label for="">评分表：</label>
            <span>{{params.assessGradeName}}</span>
          </li>
        </ul>
        <div class="addPerson">
          考试人员
        </div>
        <div class="infoListUl" v-for="(item,index) of listData" :key="index">
          <div>
            <ul>
              <li>
                <label for="">考生姓名：</label>
                <span>{{item.humanName}}</span>
                <img class="iconImg" v-if="item.assessStatus == 1" src="../../assets/images/page/img_05.png" alt="" >
                <img class="iconImg" v-if="item.assessStatus == 2" src="../../assets/images/page/img_04.png" alt="" >
                <img class="iconImg" v-if="item.assessStatus == 3" src="../../assets/images/page/img_06.png" alt="" >
              </li>
              <li>
                <label for="">轮转科室：</label>
                <span>{{params.departmentName}}</span>
              </li>
              <li>
                <label for="">轮转时间：</label>
                <span>{{utils.formatDate(new Date(item.startTime.replace(/-/g, "/")).getTime(), "yyyy-MM-dd")  }} -  {{utils.formatDate(new Date(item.endTime.replace(/-/g, "/")).getTime(), "yyyy-MM-dd")}} </span>
              </li>
              <li>
                <label for="">参培年份：</label>
                <span>{{item.traineeYear}}</span>
              </li>
              <li>
                <label for="">专业：</label>
                <span>{{ fnMajorCode(item.traineeMajorCode)}}</span>
              </li>
            </ul>
          </div>
          <div class="infoListUlFooter">
            <p :class="index === 2 ? 'grepBtn': 'successBtn' " @click="goRouterLink(item)">{{item.assessStatus == 1 ? '开始考试' : (item.assessStatus == 2 ? '继续考试' : '查看结果' )}} </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ExamDetail",
  components: {},
  data() {
    var startTime = this.utils.formatDate(new Date().getTime(), "yyyy-MM");
    return {
      userInfocode: "",
      params: {},
      listData: []
    };
  },
  ///
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },

    goRouterLink(item) {
      this.$router.push({
        name: "Takeexam",
        params: item
      });
    },

    fnMajorCode(traineeMajorCode) {
      return this.utils.getValueByKey(
        this.$store.state.majors,
        traineeMajorCode
      );
    },

    getTimeData(start, end) {
        if(start && end){
            return (
                this.utils.formatDate(new Date(start.replace(/-/g, "/")).getTime(), "yyyy-MM-dd HH:mm") +
                "-" +
                this.utils.formatDate(new Date(end.replace(/-/g, "/")).getTime(), "HH:mm")
            );
        }
    },

    getAssessData() {
      this.utils.ajax({
        url: this.api.getByAssessId,
        data: {
          assessId: this.params.id
        },
        method: "POST",
        success: data => {
          this.listData = data;
        }
      });
    }
  },
  mounted() {
    this.userInfocode = this.$store.state.userInfo.currentRole.code;
    this.params = this.$store.state.AssessParams;
    this.getAssessData();
  },
  created() {}
};
</script>
<style>
.examBox {
  overflow: auto;
}
.examBox .infoTile {
  color: #333333;
  font-size: 16px;
  line-height: 2rem;
}
.infoList {
  margin-bottom: 8px;
}
.infoList .infoListUl {
  overflow: auto;
  margin-bottom: 10px;
  background: #fff;
  padding: 0.8rem;
}
.infoList .infoListUl label {
  display: inline-block;
  text-align: right;
  width: 4.5rem;
  color: #8d8d8d;
}
.infoList .infoListUl .iconImg{
  width: 3rem;
  height: 1.5rem;
  float: right;
}
.addPerson {
  height: 40px;
  margin-top: 8px;
  padding-left: 0.8rem;
  border-bottom: 1px solid #ddd;
  line-height: 40px;
  background: #fff;
  color: #000;
}
.infoList .infoListUl li {
  font-size: 14px;
}
.van-picker {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 16rem;
  z-index: 10;
}
.enterke::before {
  content: "*";
  position: absolute;
  left: 0.4375rem;
  font-size: 0.875rem;
  color: #f44;
}
.infoListUlFooter p {
  background: #197fe8;
  line-height: 2rem;
  color: #fff;
  border-radius: 10px;
  text-align: center;
}
</style>
