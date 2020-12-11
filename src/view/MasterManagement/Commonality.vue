<template>
  <div class>
    <div v-for="item in listData">
      <div class="clinic_box">
        <ul>
          <li v-for="(field,index) in listObj.list" @click="enterdetail(item)">
            <span class="gray">{{field.field}}</span>
            <span>{{item[field.name]}}</span>
          </li>
        </ul>
        <div :class="item.status == 3?'img3':item.status==4?'img1':''"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Commonality",
  props: ["listData", "listObj", "isclinical", "active"],
  //isclinical 参数判读是临床医案进入还是跟师心得
  //active 判断是待审核还是已审核；
  components: {},
  data() {
    //这里存放数据
    return {};
  },
  methods: {
    getinfodata(id) {
      let params = {
        id
      };
      this.utils.ajax({
        method: "post",
        data: params,
        url: url,
        success: data => {}
      });
    },
    enterdetail(item) {
      console.log(item);
      if (this.isclinical) {
        //临床医案详情
        this.$router.push({ name: "BasisRecordList", params: { id: item.id } });
      } else {
        if (item.noteType == "跟师总结") {
          this.$router.push({
            name: "TeacherSumup",
            params: { item: item, type: 2 } // type == 2 代表老师进入页面
          });
          return;
        }
        //学习中医典籍体会
        if (this.active == 0) {
          this.$router.push({
            name: "LearningExperience",
            params: { pagetype: 1, id: item.id }
          });
        } else if (this.active == 1) {
          this.$router.push({
            name: "LearningExperience",
            params: { pagetype: 2, id: item.id }
          });
        }
      }
    }
  },
  created() {}
};
</script>
<style  scoped>
.clinic_box {
  background: white;
  padding: 0.5rem 0.9rem;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
}
.clinic_box .img {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_03.svg") no-repeat;
}
.clinic_box .img1 {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_02.svg") no-repeat;
}
.clinic_box .img3 {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_01.svg") no-repeat;
}
</style>