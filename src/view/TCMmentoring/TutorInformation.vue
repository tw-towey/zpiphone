<template>
  <div class>
    <van-nav-bar title="导师信息" class="header" fixed left-arrow @click-left="onClickLeft">
      <div class="add-activity" slot="right">
        <div @click="onClickRight">
          <van-icon name="search" size="1.5rem"/>
        </div>
      </div>
    </van-nav-bar>
    <div class="layout_content">
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
  </div>
</template>

<script>
import ViewList from "@/components/ViewList";

export default {
  name: "TutorInformation",
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
          { field: "导师姓名：", name: "mentorName", leftClass: "gray" },
          { field: "所属科室：", name: "departmentName", leftClass: "gray" },
          { field: "技术职称：", name: "specialityTitle", leftClass: "gray" },
          { field: "擅长领域：", name: "skillInArea", leftClass: "gray" },
        ],
        click: (data, key) => {
          this.$store.state.mentorId =data.id;
          this.$store.state.canApply = data.canApply;
          this.$router.push({
            name: "TutorForDetails",
            params: {}
          });
        }
      }
    };
  },
  methods: {
    onClickLeft() {
      this.$store.state.mentorId = '';
      this.$store.state.canApply = "";
      this.utils.goBack(this);
    },
    onClickRight() {
      this.$router.push({
        name: "MentorSearch",
        params: {}
      });
    },
    onLoad() {
      this.queryData();
    },
    queryData() {
      let params = {
        currentPage:
          Math.ceil(this.listData.length / this.$store.state.pageSize) + 1,
        pageSize: this.$store.state.pageSize
      };

      this.utils.ajax({
        url: this.api.studentMentorMatchMentors,
        data: params,
        method: "POST",
        success: data => {
          if (data.content.length) {
            const content = data.content.map(i => {
              const item = i;
              return item;
            });
            this.listData = [...this.listData, ...content];
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
    }
  },
  created() {}
};
</script>
<style  scoped>
.add-activity {
  color: #fff;
}
</style>
