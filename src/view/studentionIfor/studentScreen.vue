<template>
  <div class>
    <van-nav-bar title="学员信息" fixed left-arrow class="header" @click-left="onClickLeft" />
    <div class="layout_content">
      <van-cell
        title="所属科室"
        is-link
        :value="rotate.name"
        @click="changeShowStatus('showType',true)"
      />
      <div class="selechName">
        <van-field
          v-model="keywords"
          placeholder="请输入学员姓名或手机号"
          bind:change="onChange"
          style="width:83%"
          @keyup.enter.native="onSearch"
        />
        <div @click="onSearch">
          <van-icon name="search" size="30px" color="#D9D9D9" style=" margin-top:0.3rem; " />
        </div>
      </div>
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
        <ViewList :listObj="listObj" :listData="listData"></ViewList>
      </van-list>
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
import ViewList from "@/components/ViewList";

export default {
  //import引入的组件需要注入到对象中才能使用

  name: "studentScreen",
  components: {
    ViewList: ViewList
  },
  data() {
    //这里存放数据
    return {
      loading: true,
      finished: false,
      error: false,
      finishedText: "没有更多了",
      rotate: {
        name: "",
        id: ""
      },
      showType: false,
      typeColumns: [],
      selectType: "",
      listData: [],
      listObj: {
        list: [
          { field: "学员姓名：", name: "studentName", leftClass: "gray" },
          { field: "手机号：", name: "phone", leftClass: "gray" },
          { field: "参培年份：", name: "grade", leftClass: "gray" },
          {
            field: "所在专业：",
            name: "majorCode",
            leftClass: "gray",
            render: (data, key) => {
              return this.utils.getValueByKey(
                this.$store.state.majors,
                data.majorCode
              );
            }
          },
          { field: "带教老师：", name: "teacherName", leftClass: "gray" },
          {
            field: "轮转时间：",
            name: "startDate",
            leftClass: "gray",
            render: (data, key) => {
              return data[key] + " " + "到" + " " + data.endDate;
            }
          }
        ]
      },
      keywords: ""
    };
  },
  //方法集合
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    onLoad() {
      if (this.keywords == "") {
        this.listDatat(this.selectType, false);
      } else {
        this.listDatat(this.selectType, true);
      }
    },
    onSearch() {
      this.listData = [];
      this.loading = true;
      this.finished = false;
      this.error = false;
      this.listDatat(this.selectType, true);
    },
    listDatat(data, flag) {
      let params = {
          currentPage:  Math.ceil(this.listData.length / this.$store.state.pageSize) + 1,
          pageSize: this.$store.state.pageSize,
          departmentId: data,
      };
      if (flag) {
        params['studentNameOrPhone'] = this.keywords
      } 
      this.utils.ajax({
        data: params,
        url: this.api.studentPage,
        method: "POST",
        success: data => {
          if (data.content.length) {
            const content = data.content.map(i => {
              const item = i;
              return item;
            });
              this.listData = this.listData.concat(content);
          } else {
            this.finishedText = "";
          }
          this.loading = false; //结束当前加载
          if (params.currentPage >= data.totalPages) {
            //最后一页、加载完成
            this.finished = true;
          }
        }
      });
    },
    confirmType(data) {
      this.listData = [];
      this.loading = true;
      this.finished = false;
      this.error = false;
      this.finishedText = "没有更多了";
      this.selectType = data.value;
      this.rotate.name = data.text;
      this.rotate.id = data.value;
      this.listDatat(data.value, true);
      this.changeShowStatus("showType", false);
      this.$store.state.informationSelect.value = data.value;
      this.$store.state.informationSelect.text = data.text;
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
        //   this.rotate.name = this.typeColumns[0].text;
        //   this.selectType = this.typeColumns[0].value;
        //   this.listDatat(this.typeColumns[0].value, true);
          this.selectType = this.$store.state.informationSelect.value;
          this.rotate.name = this.$store.state.informationSelect.text; 
          this.listDatat(this.$store.state.informationSelect.value, true);
        }
      });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.depament();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style>
.selechName {
  display: flex;
  width: 100%;
  background: white;
}
</style>
