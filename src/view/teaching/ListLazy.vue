<template>
  <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
    <ul>
      <li v-for="obj in data" @click="chooseTeacher(obj)">
        <div>
          <div><span>姓名:</span>{{obj.humanName}}</div>
          <div><span>专业:</span>{{majorName(obj.traineeMajorCode)}}</div>
          <div class="flex-box">
            <div><span>身份类型:</span>{{idType(obj.idTypeCode)}}</div>
            <div class="box-icon"><van-icon name="arrow"/></div>
          </div>
          <div><span>轮转科室:</span>{{obj.departmentName}}</div>
          <div><span>轮转时间:</span>{{getTime(obj)}}</div>
        </div>
      </li>
    </ul>
  </van-list>
</template>

<script>
// 其他轮转
export default {
  name: "ListLazy",
  data() {
    return {
      loading: false,
      finished: false,
      data: [],
      params: {
        pageSize: this.$store.state.pageSize,
        currentPage: 1
      }
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    onLoad() {
      this.getData();
    },
    getData(timeChange) {
      let url = this.api.getNotAllotTeacherStudentForMobile;
      let obj = this.params;
      if (this.mode == "2") {
        url = this.api.getAlreadyAllotTeacherStudentForMobile;
      }
      obj.yearMonth = this.time;
      if (timeChange) {
        obj.currentPage = 1;
        obj.yearMonth = timeChange;
      }
      this.loading = true;
      this.utils.ajax({
        url: url,
        data: obj,
        method: "post",
        success: res => {
          if (res.number >= res.totalPages) {
            this.finished = true;
          } else {
            this.finished = false;
            this.params.currentPage++;
          }
          if (timeChange) {
            this.data = res.content;
            this.loading = false;
            return;
          }
          res.content.forEach(item => {
            this.data.push(item);
          });
          this.loading = false;
        }
      }, true);
    },
    chooseTeacher(obj) {
      if(this.mode == '1') {
        this.$store.state.studentObj = obj;
        this.$router.push({ name: "ChooseTeacher" });
      } else {
        let param = {
          endDate: obj.endDate,
          startDate: obj.startDate,
          // departmentId: obj.departmentId,
          cycleDepartmentId: obj.departmentId,
          normalDepartmentId: obj.normalDepartmentId,
          name: obj.humanName,
          studentId: obj.humanId
        }
        this.$router.push({
          name: "ShowTeacherDetil",
          params: {params: param}
        });
      }
    },
    getTime(obj) {
      return this.utils.formatDate(obj.startDate,'yyyy-MM-dd') + "至" + this.utils.formatDate(obj.endDate,'yyyy-MM-dd');
    },
    idType(type) {
      let name = null;
      [
        { 'key': '1', 'value': '本单位人' },
        { 'key': '2', 'value': '社会人' },
        { 'key': '3', 'value': '研究生' },
        { 'key': '4', 'value': '委培人员' },
        { 'key': '5', 'value': '并轨专硕' }
      ].forEach(item => {
        if (type == item.key) {
          name = item.value;
        }
      });
      return name;
    },
    majorName(majorCode) {
      let name = null;
      [
        { 'key': '0100', 'value': '内科' },
        { 'key': '0200', 'value': '儿科' },
        { 'key': '0300', 'value': '急诊科' },
        { 'key': '0400', 'value': '皮肤科' },
        { 'key': '0500', 'value': '精神科' },
        { 'key': '0600', 'value': '神经内科' },
        { 'key': '0700', 'value': '全科' },
        { 'key': '0800', 'value': '康复医学科' },
        { 'key': '0900', 'value': '外科' },
        { 'key': '1000', 'value': '外科（神经外科方向）' },
        { 'key': '1100', 'value': '外科（胸心外科方向）' },
        { 'key': '1200', 'value': '外科（泌尿外科方向）' },
        { 'key': '1300', 'value': '外科（整形外科方向）' },
        { 'key': '1400', 'value': '骨科' },
        { 'key': '1500', 'value': '儿外科' },
        { 'key': '1600', 'value': '妇产科' },
        { 'key': '1700', 'value': '眼科' },
        { 'key': '1800', 'value': '耳鼻咽喉科' },
        { 'key': '1900', 'value': '麻醉科' },
        { 'key': '2000', 'value': '临床病理科' },
        { 'key': '2100', 'value': '检验医学科' },
        { 'key': '2200', 'value': '放射科' },
        { 'key': '2300', 'value': '超声医学科' },
        { 'key': '2400', 'value': '核医学科' },
        { 'key': '2500', 'value': '放射肿瘤科' },
        { 'key': '2600', 'value': '医学遗传科' },
        { 'key': '2700', 'value': '预防医学科' },
        { 'key': '2800', 'value': '口腔全科' },
        { 'key': '2900', 'value': '口腔内科' },
        { 'key': '3000', 'value': '口腔颌面外科' },
        { 'key': '3100', 'value': '口腔修复科' },
        { 'key': '3200', 'value': '口腔正畸科' },
        { 'key': '3300', 'value': '口腔病理科' },
        { 'key': '3400', 'value': '口腔颌面影像科' },
        { 'key': '4100', 'value': '中医内科' },
        { 'key': '4200', 'value': '中医外科' },
        { 'key': '4300', 'value': '中医妇科' },
        { 'key': '4400', 'value': '中医儿科' },
        { 'key': '4500', 'value': '针灸科' },
        { 'key': '4600', 'value': '推拿科' },
        { 'key': '4700', 'value': '中医康复科' },
        { 'key': '4800', 'value': '中医骨伤科' },
        { 'key': '4900', 'value': '中医耳鼻喉科' },
        { 'key': '5000', 'value': '中医眼科' },
        { 'key': '5100', 'value': '中医全科' }
      ].forEach(item => {
        if (majorCode == item.key) {
          name = item.value;
        }
      });
      return name;
    }
  },
  created() {
  },
  props: ["mode", "time"]
};
</script>

<style scoped>
.bottom16rem {
  bottom: 16rem;
}
li {
  padding: 0.5rem 1rem;
  background: #fff;
  color: #333333;
  margin-bottom: 1px;
}
li span {
  color: #8d8d8d;
  display: inline-block;
  width: 4.1rem;
  text-align: right;
  margin-right: 0.5rem;
}
li > div > div {
  line-height: 1.5rem;
}
.flex-box {
  display: flex;
  justify-content: space-between;
}
.box-icon {
  color: #a6a6a6;
  font-size: 1.2rem;
}
.van-icon {
  vertical-align: middle;
  font-size: 1.05rem;
}
</style>
