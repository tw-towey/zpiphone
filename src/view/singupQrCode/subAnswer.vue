<template>
  <div class>
    <van-nav-bar
      title="活动评价"
      class="header"
      fixed
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="layout_content">
      <div class="back">
        <div class="hader" v-for="(i,index) in Dateread" :key="index">
          <p>{{index+1}}.{{i.title}}</p>
          <!-- *************************** 单选 **************************** -->
          <van-radio-group v-model="radioo[index]" v-if="i.typeOfQuestion == 1 || i.typeOfQuestion == 3">
            <van-radio
              v-for="(item,ind) in i.optionOfQuestionVOs"
              :key="ind"
              :name="item"
              :value="item.checked"
              :disabled="type === 'see' && item.checked === 0"
            >{{(i.typeOfQuestion == 1)?item.conten:item.code+'分'}}</van-radio>
          </van-radio-group>

          <!-- *************************** 多选 **************************** -->
          <van-checkbox-group v-model="result" v-if="i.typeOfQuestion == 2">
            <van-checkbox
              v-for="item in i.optionOfQuestionVOs"
              :key="item.id"
              :name="item"
              :value="item.checked"
              :disabled="type === 'see' && item.checked === 0"
            >{{ item.content }}</van-checkbox>
          </van-checkbox-group>
        </div>
      </div>
      <div class="kong"></div>
      <button class="preserved" v-if="type !== 'see'" @click="submit()">提交</button>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "subAnswer",
  components: {},
  data() {
    return {
      radioo: [],
      result: [],
      Dateread: "",
      memberId: "",
      type: ""
    };
  },
  methods: {
    /**
     * 返回上一级路由
     */
    onClickLeft() {
      this.utils.goBack(this);
    },

    /**
     * 界面初始化获取题目列表
     * @param activityId { number } 教学活动ID
     */
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
    seeListAnswer(){
        this.utils.ajax({
        url: this.api.teachingQuestion,
        data: {
            teachingId: this.$store.state.activitiesDetailsObj.id,
            memberId: this.$store.state.userInfoCaid
        },
        method: "POST",
        success: data => {
          if(data && data.questionOfOpinionVOs.length > 0){
            this.Dateread = data.questionOfOpinionVOs;
            this.Dateread.forEach((item,index) => {
                if(item.optionOfQuestionVOs && item.optionOfQuestionVOs.length > 0){
                    item.optionOfQuestionVOs.forEach((it)=>{
                        if(it.checked === 1){
                            this.radioo[index] = it;
                        }
                    })
                }
            })
          }
          
        }
      });
    },
    /**
     * 答题完成提交活动评价答案
     * 验证必填答案
     */
    submit() {
      let flag = true;
      this.Dateread.forEach((item,index) => {
        if (item.typeOfQuestion == 1 && this.radioo.length == 0) {
          flag = false;
        }
        if (item.typeOfQuestion == 3) {
           if(this.radioo.length-1 !== index) {
             flag = false;
           }else{
             flag = true;
           }
        }
        if (item.typeOfQuestion == 2 && this.result.length == 0) {
          flag = false;
        }
      });
      if (!flag) {
        this.Toast("答案不能为空");
        return;
      }
      this.keepp(2);
    },

    /**
     * 提交答案
     */
    keepp() {
      var paramss = {
        flag: 2,
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
      this.utils.ajax({
        url: this.api.saveAnswerOfOpinion,
        data: paramss,
        method: "POST",
        success: data => {
          this.$route.params.callback && this.$route.params.callback();
          this.onClickLeft();
        }
      });
    }
  },
  created() {
    this.type = this.$route.params.type;
    if( this.type === "see"){
          this.seeListAnswer();
    }else{
        this.getLeaveList(this.$route.params.evaluateId);
    }
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