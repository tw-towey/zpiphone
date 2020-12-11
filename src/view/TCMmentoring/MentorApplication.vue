<template>
  <div class>
    <van-nav-bar title="导师申请" class="header" fixed left-arrow @click-left="onClickLeft">
      <!-- <div class="add-activity" slot="right" v-if="submit">
        <div @click="onClickRight">
          <p>提交</p>
        </div>
      </div>-->
      <div class="add-activity" slot="right" >
        <div >
          <p v-if="withdraw"  @click="onClickRightop()">撤销</p>
           <p v-if="submit" @click="onClickRight()">提交</p>
        </div>
      </div>
    </van-nav-bar>
    <div class="layout_content">
      <ViewList :listObj="listObj" :listData="listData"></ViewList>
      <div class="tutor_box">
        <ul>
          <li>
            <p>个人简历</p>
            <van-field
              v-model="resume"
              type="textarea"
              :placeholder="placeholder"
              :readonly="readonly"
              :required="required"
            />
          </li>
        </ul>
      </div>
      <!-- <div class="button" @click="preserved()" v-if="submit">保存</div> -->
      <!-- <div class="button" @click="onClickRight()" v-if="submit"><p>提交</p></div> -->
    </div>
  </div>
</template>

<script>
import ViewList from "@/components/ViewList";

export default {
  name: "MentorApplication",
  components: {
    ViewList: ViewList
  },
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      finishedText: "没有更多了",
      listData: [],
      listObj: {
        list: [
          { field: "学员姓名：", name: "studentName", leftClass: "gray" },
          { field: "培训专业：", name: "traineeMajorName", leftClass: "gray" },
          { field: "参加年份：", name: "traineeYear", leftClass: "gray" },
          { field: "培训年限：", name: "traineeLimit", leftClass: "gray" }
        ]
      },
      resume: "",
      submit: true,
      withdraw: true,
      id: "",
      required: true,
      readonly: false,
      placeholder: "请输入个人简历"
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    onClickRight() {
      //  提交
      if(this.utils.trim(this.resume) == ''){
        this.Toast('请填写个人简历');
        return
      }
      var obj = {};
      if (this.id) {
        obj = {
          id: this.id,
          teacherId: this.$store.state.mentorId,
          jobDescription: this.resume,
          status: 2
        };
      } else {
        obj = {
          teacherId: this.$store.state.mentorId,
          jobDescription: this.resume,
          status: 2
        };
      }
      // if (this.resume == "") {
      //   this.Toast("请填写个人简历");
      //   return;
      // }
      this.utils.ajax({
        url: this.api.studentMentorMatchApply,
        data: obj,
        method: "POST",
        success: data => {
          this.Toast("提交成功");
          this.$store.state.canApply = '';
          setTimeout(() => {
            this.resume = '';
            this.$router.go(-2);
          }, 500);
        }
      });
    },
    onClickRightop() {
      // 撤销
      var obj = {
        id: this.id,
        status: 6,
        teacherId: this.$store.state.mentorId
      };
      this.utils.ajax({
        url: this.api.studentMentorMatchAudit,
        data: obj,
        method: "POST",
        success: data => {
          this.Toast("撤销成功");
          this.$store.state.canApply = '';
          setTimeout(() => {
            this.resume = '';
            this.$router.go(-2);
          }, 500);
        }
      });
    },
    queryData() {
      var params = {
        studentId: this.$store.state.userInfo.human.caId, // 学员id
        teacherId: this.$store.state.mentorId
      };
      this.utils.ajax({
        url: this.api.studentMentorMatch,
        data: params,
        method: "POST",
        success: data => {
          // status 状态 申请状态：0删除，1草稿 ,2待处理，3通过，4退回，5超时未处理自动退回，6解除',
          if (data.status == 1) {
            this.withdraw = false;
            this.required = true;
            this.readonly = false;
          } else if (data.status == 2) {
            this.withdraw = true;
            this.readonly = true;
            this.required = false;
          } else {
            this.withdraw = false;
            this.readonly = true;
            this.required = false;
          }
          if (this.$store.state.canApply == true) {
            this.submit = true;
            this.readonly = false;
            this.required = true;
          } else {
            this.submit = false;
            // this.Toast('已有导师，不可重复申请')
          }
          this.listData.push(data);
          this.listData.map(i => {
            const item = i;
            if (i.traineeYear) {
              item.traineeYear = i.traineeYear + "级";
            }
            if (i.traineeLimit) {
              item.traineeLimit = i.traineeLimit + "年";
            }
            if (i.jobDescription) {
            } else {
              // this.placeholder = "";
            }
            this.id = item.id;
            this.resume = item.jobDescription;
            return item;
          });
        }
      });
    },
    // preserved() {
    //   // 保存
    //   var obj = {};
    //   if (this.id) {
    //     obj = {
    //       id: this.id,
    //       teacherId: this.$store.state.mentorId,
    //       jobDescription: this.resume,
    //       status: 1
    //     };
    //   } else {
    //     obj = {
    //       teacherId: this.$store.state.mentorId,
    //       jobDescription: this.resume,
    //       status: 2
    //     };
    //   }
    //   if (this.resume == "") {
    //     this.Toast("请填写个人简历");
    //     return;
    //   }
    //   this.utils.ajax({
    //     url: this.api.studentMentorMatchApply,
    //     data: obj,
    //     method: "POST",
    //     success: data => {
    //       this.Toast("保存成功");
    //       setTimeout(() => {
    //         this.utils.goBack(this);
    //       }, 500);
    //     }
    //   });
    // }
  },
  created() {
    this.queryData();
  }
};
</script>
<style  scoped>
p {
  margin: 0;
  padding: 0.3rem 0;
}
.tutor_box ul li {
  background: white;
  padding: 0.5rem 0.9rem;
  word-wrap: break-word;
  margin-top: 0.3rem;
}
.button {
  width: 100%;
  color: white;
  font-size: 0.9rem;
  background: #1A7FE9;
  padding: 0.7rem 0;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: center;
}
.button p{
  margin: 0;
  padding: 0;
}
.add-activity {
  color: #fff;
}
.add-activity p {
  margin: 0;
  padding: 0;
}
</style>
