<template>
  <div class>
    <van-nav-bar
      title="学员信息"
      class="header"
      fixed
      left-arrow
      right-text="学员详情"
      @click-right="onClickRight"
      @click-left="onClickLeft"
    />
    <div class="layout_content">
      <van-cell
        title="所属科室"
        is-link
        :value="rotate.name"
        @click="changeShowStatus('showType',true)"
      />
      <div class="conent">
        <van-cell title="科室情况" value size="large" />
        <ul class="boxul">
          <li>
            <p>
              <font color="#4E8EF7" style="font-sizi:">{{data.studentNum}}</font>
              <span>人</span>
            </p>
            <p>科室学员</p>
          </li>
          <li>
            <p>
              <font color="#4E8EF7" style="font-sizi:">{{data.thisMonthDepartmentOutNum}}</font>/
              <font color="#4E8EF7" style="font-sizi:">{{data.thisMonthShouldDepartmentOutNum}}</font>
              <span>人</span>
            </p>
            <p>本月出科</p>
          </li>
          <li>
            <p>
              <font color="#4E8EF7" style="font-sizi:">{{data.nextMonthDepartmentInNum}}</font>
              <span>人</span>
            </p>
            <p>下月入科</p>
          </li>
          <li>
            <p>
              <font color="#4E8EF7" style="font-sizi:">{{data.nextMonthShouldDepartmentOutNum}}</font>
              <span>人</span>
            </p>
            <p>下月出科</p>
          </li>
        </ul>
      </div>
      <div class="studentConent">
        <van-cell title="学员年及分布" value size="large" />
        <div class="studentbox">
          <ul>
            <li v-for="(item,index) in gradeDistribution" :key="index">
              <p style="width:18%;text-align: right;">{{item.name}}:</p>
              <p style="width:80%" class="progressp">
                <span class="progress">
                  <span
                    class="progressSpan"
                    style=" min-width:8%;  box-sizing: border-box; vertical-align: bottom;"
                    :style="item.widthh"
                  ></span>
                </span>
                <span
                  style="position: relative; width:45%; box-sizing: border-box; margin-left: 0.2rem;  text-align: right;"
                >{{item.value}}人（{{item.width}} %）</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div class="studentConent">
        <van-cell title="带教情况" value size="large" />
        <ul class="stuStyle">
          <li v-for="(item,index) in datalist" :key="index">
            <p :class="item.background"></p>
            <p>{{item.title}}</p>
          </li>
        </ul>
        <van-list
          v-model="loading"
          :finished="finished"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          :finished-text="finishedText"
          immediate-check
          :offset="50"
          @load="onLoad()"
        >
          <ul class="teachingtConent">
            <li style="width:100%" v-for="(item,index) in techData" :key="index" class="munLi">
              <p style="width:22%;margin-top: 0.5rem; " >{{item.name}}:</p>
              <div style="width:78%">
                <div class="div" style="width:100%">
                  <div
                    style="text-align: center;  font-size: 0.9rem;color: #767676;"
                    v-for="(i,int) in item.value"
                    :key="int"
                    class="numP"
                    :style="i.width"
                  >{{i.num}}人</div>
                </div>
                <div class="div" style="width:100%">
                  <div
                    style="text-align: center;"
                    v-for="(i,int) in item.value"
                    :key="int"
                    class="p"
                    :class="i.class"
                    :style="i.width"
                  ></div>
                </div>
              </div>
            </li>
          </ul>
        </van-list>
      </div>
    </div>

    <van-popup v-model="showType" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        title="轮转名称"
        :columns="typeColumns"
        :default-index="0"
        @confirm="confirmType"
        @cancel="changeShowStatus('showType',false)"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  //import引入的组件需要注入到对象中才能使用
  name: "information",
  components: {},
  data() {
    //这里存放数据
    return {
      loading: true,
      finished: false,
      error: false,
      finishedText: "没有更多了",
      typeColumns: [],
      showType: false,
      rotate: {
        name: "",
        id: ""
      },
      data: {
        // 科室情况
      },

      gradeDistribution: [],
      span: "",
      datalist: [
        {
          title: "其他",
          background: "back"
        },
        {
          title: "2017级",
          background: "back1"
        },
        {
          title: "2018级",
          background: "back2"
        },
        {
          title: "2019级",
          background: "back3"
        }
      ],
      techData: [],
      techData1: [],
      titletype: false,
      selectType: ""
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
      this.$store.state.informationSelect.value = '';
      this.$store.state.informationSelect.text = '';
    },
    onClickRight() {
      this.$router.push({ name: "studentScreen" });
    },
    changeShowStatus(name, status) {
      //更改弹出层状态
      this[name] = status;
    },
    depament() {
      this.utils.ajax({
        url: this.api.studentdepartment,
        method: "POST",
        success: data => {
          data.forEach(i => {
            this.typeColumns.push({
              text: i.name,
              value: i.caId
            });
          });
          if(this.$store.state.informationSelect.value == ""){
            this.rotate.name = this.typeColumns[0].text;
            this.rotate.id = this.typeColumns[0].value;
            this.checkAsk(this.typeColumns[0].value);
            this.studentByGrade(this.typeColumns[0].value);
            this.studentPage(this.typeColumns[0].value);
            this.selectType = this.typeColumns[0].value;
            this.$store.state.informationSelect.value = this.typeColumns[0].value;
            this.$store.state.informationSelect.text = this.typeColumns[0].text;
          }else{
            this.typeColumns.value = this.$store.state.informationSelect.value;
            this.typeColumns.text = this.$store.state.informationSelect.text;
            this.rotate.name = this.typeColumns.text;
            this.rotate.id = this.typeColumns.value;
            this.checkAsk(this.typeColumns.value);
            this.studentByGrade(this.typeColumns.value);
            this.studentPage(this.typeColumns.value);
            this.selectType = this.typeColumns.value;

          }
        }
      });
    },
    confirmType(data) {
      this.loading = true;
      this.finished = false;
      this.error = false;
      this.finishedText = "没有更多了";
      this.titletype = true;
      this.techData = [];
      this.selectType = data.value;
      this.rotate.name = data.text;
      this.rotate.id = data.value;
      this.checkAsk(data.value);
      this.studentByGrade(data.value);
      this.studentPage(data.value);
      this.changeShowStatus("showType", false);
      this.$store.state.informationSelect.value = data.value;
      this.$store.state.informationSelect.text = data.text;
    },
    checkAsk(data) {
      // 查询科室情况统计
      this.utils.ajax({
        data: {
          departmentId: data
        },
        url: this.api.statisticalCenter,
        method: "POST",
        success: data => {
          this.data = data;
        }
      });
    },
    studentByGrade(data) {
      console.log(this.api.studentByGrade, "dddddddddd");
      //查询学员年级分布
      this.utils.ajax({
        data: {
          departmentId: data
        },
        url: this.api.studentByGrade,
        method: "POST",
        success: data => {
          this.gradeDistribution = [];
          for (let key in data) {
            if (data.hasOwnProperty(key)) {
              this.gradeDistribution.push({
                value: data[key],
                name: key
              });
            }
          }
          let arr = 0;
          let att = 0;
          this.gradeDistribution.map(item => {
            arr += item.value;
          });
          this.gradeDistribution.forEach(item => {
            if (item.value == 0) {
              item["width"] = 0;
              item.widthh = { width: item["width"] + "%" };
            } else {
              item["width"] = (((item.value - 0) / (arr - 0)) * 100).toFixed(2);
              item.widthh = { width: item["width"] + "%" };
            }
          });
        }
      });
    },
    studentPage(data) {
      console.log(this.techData.length, "1546456", this.$store.state.pageSize);
      let params = {
        departmentId: data,
        currentPage: Math.ceil(this.techData.length / 6) + 1,
        pageSize: 6
      };
      this.utils.ajax({
        data: params,
        url: this.api.teachingStudentByGrade,
        method: "POST",
        success: data => {
          const content = [];
          if (data.content.length) {
            for (const key in data.content) {
              if (data.content.hasOwnProperty(key)) {
                for (const item in data.content[key]) {
                  content.push({
                    name: item,
                    value: data.content[key][item]
                  });
                }
              }
            }
            content.forEach(item => {
              let arr = 0;
              let arrData = [];
              for (const key in item.value) {
                arr += item.value[key];
                if (item.value.hasOwnProperty(key)) {
                }
                let classname = "";
                if (key == "其他年级") {
                  classname = "back";
                }
                if (key == "2017级") {
                  classname = "back1";
                }
                if (key == "2018级") {
                  classname = "back2";
                }
                if (key == "2019级") {
                  classname = "back3";
                }
                arrData.push({
                  width: "",
                  class: classname,
                  num: item.value[key]
                });
              }
              item.value = arrData.reverse();
              item.value.forEach(i => {
                if (i.num == 0) {
                  i.width = { width: 0 };
                } else {
                  i.width = { width: (i.num / arr) * 100 + "%" };
                }
              });
            });
            console.log(this.techData, 789);

            console.log(this.techData, "15687");
            this.techData = [...this.techData, ...content];
          } else {
            this.finishedText = "没有更多了";
          }
          this.loading = false; //结束当前加载
          if (params.currentPage >= data.totalPages) {
            //最后一页、加载完成
            console.log(555555);

            this.finished = true;
          }
        }
      });
    },
    onLoad() {
      this.studentPage(this.selectType);
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    console.log(2);
    this.depament();
  },

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style>
p {
  margin: 0;
  padding: 0;
}
.conent {
  margin-top: 0.5rem;
  background: white;
  padding-bottom: 1rem;
}
.boxul {
  width: 94%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.boxul li p {
  margin: 0;
  padding: 0;
}
.boxul li {
  text-align: center;
  width: 33%;
}
.boxul li p font {
  font-size: 1.3rem;
}
.studentConent {
  background: white;
  margin-top: 0.3rem;
  padding: 0.5rem 0;
}
.studentbox {
  width: 93%;
  margin: 0 auto;
}
.studentbox ul li {
  display: flex;
  padding: 0.4rem 0;
}

.studentbox ul li p span {
  display: inline-block;
}
.studentbox ul li p:nth-of-type(1) {
  width: 4rem;
}
.studentbox ul li p .progressSpan {
  height: 0.4rem;
  background-image: linear-gradient(to right, #178cf5, #4fcc86);
  border-radius: 10px;
  position: absolute;
}
.back {
  background: #c9c9c9;
}
.back1 {
  background: #f39501;
}
.back2 {
  background: #0fc270;
}
.back3 {
  background: #2887ea;
}
.stuStyle {
  width: 83%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.stuStyle li {
  display: flex;
  justify-content: space-between;
  text-align: right;
}
.stuStyle li p:nth-of-type(1) {
  width: 0.5rem;
  height: 0.5rem;
  margin-top: 0.3rem;
}
.stuStyle li p:nth-of-type(2) {
  margin-left: 0.3rem;
}
.teachingtConent {
  width: 93%;
  margin: 0 auto;
}
.teachingtConent li {
  display: flex;
  padding: 0.5rem 0;
}
.teachingtConent li .div {
  display: flex;
  margin-left: 0.2rem;
}
.teachingtConent li .p {
  min-width: 10%;
  height: 0.35rem;
  max-width: 60%;
  border-radius: 1px;
}
.progress {
  width: 55%;
  position: relative;
  height: 0.4rem;
  border-radius: 10px;
  background: #e8e8e8;
  top: 0.5rem;
}
.progressp {
  display: flex;
  justify-content: space-between;
}
.numP {
  min-width: 10%;
  max-width: 60%;
}
.munLi {

}
</style>