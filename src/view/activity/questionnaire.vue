<template>
  <div class>
    <van-nav-bar
      title="问卷调查"
      class="header"
      right-text="提交"
      fixed
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div class="layout_content">
      <div class="back">
        <div class="hader" v-for="(i,index) in Dateread">
          <p>{{index+1}}.{{i.title}}</p>
          <van-radio-group v-model="radioo[index]" v-if="i.typeOfQuestion == 1">
            <van-radio
              v-for="(item,ind) in i.optionOfQuestionVOs"
              :key="ind"
              :name="item"
            >{{item.content}}</van-radio>
          </van-radio-group>

          <van-checkbox-group v-model="result" v-if="i.typeOfQuestion == 2">
            <van-checkbox
              v-for="item in i.optionOfQuestionVOs"
              :key="item.id"
              :name="item"
            >{{ item.content }}</van-checkbox>
          </van-checkbox-group>
        </div>
      </div>
      <div class="kong"></div>
      <button class="preserved" @click="keep()">保存</button>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "questionnaire",
  components: {},
  data() {
    return {
      radioo: [],
      result: [],
      Dateread: "",
      memberId: ""
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },

    getLeaveList(activityId) {
      var params = {
        id: activityId
      };
      this.utils.ajax({
        url: this.api.opinionFindById,
        data: params,
        method: "POST",
        success: data => {
          this.Dateread = data.questionOfOpinionVOs;
          this.memberId = data.id;
        }
      });
    },
    onClickRight() {
      this.Dateread.forEach(item => {
        if (item.typeOfQuestion == 1) {
          if (this.radioo.length !== 0) {
            this.keepp(2);
          } else {
            this.Toast("答案不能为空");
          }
        }
        if (item.typeOfQuestion == 2) {
          if (this.result.length !== 0) {
            this.keepp(2);
          } else {
            this.Toast("答案不能为空");
          }
        }
      });
    },
    keep() {
      this.radioo.map(i => {});
      this.Dateread.forEach(item => {
        if (item.typeOfQuestion == 1) {
          if (this.radioo.length !== 0) {
            this.keepp(1);
          } else {
            this.Toast("答案不能为空");
          }
        }
        if (item.typeOfQuestion == 2) {
          if (this.result.length !== 0) {
            this.keepp(1);
          } else {
            this.Toast("答案不能为空");
          }
        }
      });
      console.log(this.radioo.length, "158", this.result);
    },
    keepp(flag) {
      var paramss = {
        flag: flag,
        teachingId: this.$store.state.activitiesDetailsObj.id,
        answers: []
      };
      this.Dateread.forEach(item => {
        let obj = {
          optionOfQuestionId: "",
          questionOfOpinionId: "",
          opinionId: item.rcpFkOpinion
        };
        this.result.forEach((i, index) => {
          console.log(item, "kkkksksksksksk");
          if (item.id == i.rcpFkQuestionOfOpinion) {
            obj.questionOfOpinionId = item.id;
            if (index == this.result.length - 1) {
              obj.optionOfQuestionId += i.id;
            } else {
              obj.optionOfQuestionId += i.id + ",";
            }
          }
        });
        this.radioo.forEach(i => {
          if (item.id == i.rcpFkQuestionOfOpinion) {
            obj.questionOfOpinionId = item.id;
            obj.optionOfQuestionId = i.id;
          }
        });
        paramss.answers.push(obj);
      });
      console.log(paramss.answers);
      this.utils.ajax({
        url: this.api.saveAnswerOfOpinion,
        data: paramss,
        method: "POST",
        success: data => {
          if(flag == 1){
            this.Toast('保存成功');
          }
          if(flag == 2){
            this.Toast('提交成功');
          }
        }
      });
    }
  },
  created() {
    this.getLeaveList(this.$route.params.evaluateId);
  }
};
</script>
<style  scoped>
p {
  padding: 0.5rem;
  margin: 0;
}
.back {
  background: white;
}
.hader {
  padding: 0.5rem 1rem;
}
.hader > div {
  padding-left: 1rem;
}
.van-radio,
.van-checkbox {
  padding: 0.5rem 0;
}
.preserved {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 0.35rem 0;
  border: none;
  background: #1a7fe9;
  text-align: center;
  color: white;
  font-size: 1.2rem;
}
.add-activity {
  color: #fff;
}
.kong {
  padding: 1rem 0;
}
</style>