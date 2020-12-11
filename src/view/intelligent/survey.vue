<template>
  <div class>
    <van-nav-bar title="问卷调查" class="header" fixed left-arrow @click-left="onClickLeft" />
    <div class="layout_content">
      <img class="img" src="../../assets/images/page/pic01.jpg" alt />
      <div class="fotor">
        <div v-if="list.length > 0" class="survey_centent">
          <div v-for="(item,index) in list" :key="index">
            <div v-if="item.isShow">
              <p class="survey_title">{{item.surveyName}}</p>
              <p class="survey_parti">{{item.intro}}</p>
              <div class="survey_source">
                <p>
                  <span>发起人：</span>
                  <span>{{item.createUserName}}</span>
                </p>
                <p>
                  <span>填写时间：</span>
                  <span>{{item.fillInTime}}</span>
                </p>
              </div>
              <ul class="finish">
                <li></li>
                <li>完成情况</li>
                <li></li>
              </ul>
              <div class="survey_box">
                <div
                  class="survey_time"
                  v-for="(i,ind) in item.completionStatusDetailVOs"
                  :key="ind"
                >
                  <div v-if="i.isToday == 1" @click="surveyTime(i,item,'1')">
                    <div class="survey_date">
                      <p v-if="i.completionStatus	 == 1" class="survey_tick">
                        <van-icon name="success" size="10px" color="white" />
                      </p>
                      <p v-if="i.completionStatus	 == 0" class="survey_tick1">
                        <van-icon name="success" size="10px" color="white" />
                      </p>
                      <p class="cond_time1">今天</p>
                    </div>
                    <p class="cond_week">{{i.weekName}}</p>
                  </div>
                  <div v-if="i.isToday != 1" @click="surveyTime(i,item,'')">
                    <div class="survey_date">
                      <p v-if="i.completionStatus	 == 1" class="survey_tick">
                        <van-icon name="success" size="10px" color="white" />
                      </p>
                      <p v-if="i.completionStatus	 == 0" class="survey_tick1">
                        <van-icon name="success" size="10px" color="white" />
                      </p>
                      <div class="cond">
                        <p class="cond_time">{{i.monthName}}</p>
                        <p class="cond_time" style="font-weight: 600;">{{i.dayName}}</p>
                      </div>
                    </div>
                    <p class="cond_week">{{i.weekName}}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="list.length == 1 && item.isShow==false" class="tip-empty">
              <span class="icon-emptyface"></span>
              <span class="text-empty">没有相关信息</span>
            </div>
          </div>
        </div>
        <div v-if="list.length == 0" class="tip-empty">
          <span class="icon-emptyface"></span>
          <span class="text-empty">没有相关信息</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "survey",
  components: {},
  data() {
    return {
      list: []
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    surveyTime(item, i, inm) {
      this.$router.push({
        name: "fillin",
        params: {
          id: i.surveyId,
          date: item.date,
          completionStatus: item.completionStatus,
          item: item,
          i: i,
          inm: inm
        }
      });
    },
    init() {
      this.utils.ajax({
        url: this.api.selectCompletionStatus,
        method: "POST",
        success: data => {
          this.list = data.map(item => {
            const i = item;
            if (
              item.type == 1 &&
              this.$store.state.userInfo.currentRole.code == "teacher"
            ) {
              item.isShow = false;
            } else {
              item.isShow = true;
            }
            return i;
          });
        }
      });
    }
  },
  created() {
    this.init();
  }
};
</script>
<style scoped>
.img {
  padding: 0;
  width: 100%;
  margin: 0;
}
p {
  margin: 0;
  padding: 0;
}
.survey_parti {
  width: 100%;
  word-wrap: break-word;
}
.layout_content .survey_centent:nth-of-type(1) {
  margin-top: 0 !important;
}

.survey_centent {
  background: white;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
}

.survey_title {
  color: #000000;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.5rem 0;
}

.survey_source {
  color: #818181;
  padding: 0.5rem 0;
}

.finish {
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: #818181;
}

.finish li:nth-of-type(1),
.finish li:nth-of-type(3) {
  width: 39%;
  height: 0.1rem;
  background: #eaeaea;
  margin-top: 0.6rem;
}

.survey_box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 0.5rem 0;
}

.survey_time {
  width: 20%;
}

.survey_date {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 80%;
  border: 2px solid #f6f6f6;
  position: relative;
  margin-top: 0.5rem;
}

.survey_tick {
  position: absolute;
  top: 0rem;
  right: 0;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: #14bd84;
  text-align: center;
}

.survey_tick1 {
  position: absolute;
  top: 0rem;
  right: 0;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: #ccc;
  text-align: center;
}

.cond_time {
  text-align: center;
}

.cond_week {
  text-align: center;
  color: #818181;
  width: 89%;
}

.cond {
  margin-top: 0.8rem;
}

.cond_time1 {
  text-align: center;
  font-size: 1rem;
  line-height: 3.5rem;
}
</style>