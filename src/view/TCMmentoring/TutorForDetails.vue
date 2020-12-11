<template>
  <div class>
    <van-nav-bar title="导师详情" class="header" fixed left-arrow @click-left="onClickLeft"/>
    <div class="layout_content">
      <ViewList :listObj="listObj" :listData="listData"></ViewList>
      <div class="tutor_box" v-for="item in listData">
        <ul>
          <li>
            <p>擅长领域</p>
            <p>{{item.specialityTitle}}</p>
          </li>
          <li>
            <p>个人简介</p>
            <p>{{item.info}}</p>
          </li>
        </ul>
      </div>
      <!-- <div class="button" @click="ApplyFor()" v-if="canApply">导师申请</div> -->
      <div class="button" @click="ApplyFor()" ><p style="text-align: center;">导师申请</p></div>
    </div>
  </div>
</template>

<script>
import ViewList from "@/components/ViewList";

export default {
  name: "TutorForDetails",
  components: {
    ViewList: ViewList
  },
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      // canApply:false,
      finishedText: "没有更多了",
      listData: [],
      listObj: {
        list: [
          { field: "导师姓名：", name: "name", leftClass: "gray" },
          { field: "所属科室：", name: "departmentName", leftClass: "gray" },
          { field: "技术职称：", name: "specialityTitle", leftClass: "gray" },
          { field: "导师资质：", name: "mentorQualification", leftClass: "gray" },
          { field: "从业年限：", name: "years", leftClass: "gray" },
          { field: "累计带教：", name: "totalCapacity", leftClass: "gray" }
        ]
      }
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
      this.$store.state.canApply = '';
    },
    queryData() {
      
      // if(this.$store.state.canApply == true ){
      //   this.canApply = true;
      // }else{
      //   this.canApply = false;
      // }
      let params = {
        teacherId:this.$store.state.mentorId
      };
      this.utils.ajax({
        url: this.api.studentMentorMatch, 
        data: params,
        method: "POST",
        success: data => {
          this.listData.push(data);
        }
      });
    },
    ApplyFor() {
      this.$router.push({
        name: "MentorApplication",
        params: {}
      });
    }
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
  padding: 0;
  margin: 0;
};
</style>
