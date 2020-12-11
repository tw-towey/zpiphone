<template>
  <div class>
    <div
      data-v-0f4718e4
      class="header van-nav-bar van-nav-bar--fixed van-hairline--bottom"
      style="z-index: 1;"
    >
      <div data-v-0f4718e4 class="van-nav-bar__left" @click="onClickLeft">
        <i data-v-0f4718e4 class="van-icon van-icon-arrow-left van-nav-bar__arrow">
          <!---->
        </i>
      </div>
      <div data-v-0f4718e4 class="van-nav-bar__title van-ellipsis tosa">
        <van-search
          v-model="keywords"
          placeholder="请输入导师姓名"
          shape="round"
          background
        />
      </div>
      <div data-v-0f4718e4 class="van-nav-bar__right" @click="onSearch()">搜索</div>
    </div>
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
  name: "MentorSearch",
  components: {
    ViewList: ViewList
  },
  data() {
    return {
      listData: [],
      keywords: "",
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
          this.$store.state.mentorId = data.id
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
      this.utils.goBack(this);
    },
    onSearch() {
       this.queryData(true) 
    },
    onLoad() {
      this.queryData(false);
    },
    queryData(flag) {
      let params = {};
      if (flag) {
        params = {
          currentPage: 1,
          pageSize: this.$store.state.pageSize,
          mentorName : this.keywords
        };
      } else {
        params = {
          currentPage:
            Math.ceil(this.listData.length / this.$store.state.pageSize) + 1,
          pageSize: this.$store.state.pageSize,
        };
      }
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
            if (flag) {
              this.listData = content;
            } else {
              this.listData = this.listData.concat(content);
            }
            
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

  },
  created() {
  }
};
</script>
<style  scoped>
.van-nav-bar__right {
  color: white;
}
.van-search {
  padding: 0.35rem;
  margin: 0;
}
.van-search .van-cell {
  padding: 0rem;
}
</style>
