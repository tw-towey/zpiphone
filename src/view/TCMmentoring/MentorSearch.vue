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
          v-model="departmentName"
          placeholder="请输入导师姓名"
          shape="round"
          background
          @search="onSearch"
          @clear="clear"
        />
      </div>
      <div data-v-0f4718e4 class="van-nav-bar__right" @click="onSearch">搜索</div>
    </div>

    <div class="layout_content">
      <ViewList :listObj="listObj" :listData="listData"></ViewList>
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
      value: "",
      medicals: [],
      newList: [],
      searchDepartments: [],
      departmentName: "",
      listData: [],
      listObj: {
        list: [
          { field: "学院姓名：", name: "name", leftClass: "gray" },
          { field: "所属科室：", name: "startDate", leftClass: "gray" },
          { field: "技术职称：", name: "applyDate", leftClass: "gray" },
          { field: "导师资质：", name: "reason", leftClass: "gray" }
        ]
      }
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    onSearch(v) {
      console.log(1111);
      let departmentName = this.utils.trim(this.departmentName);
      if (departmentName) {
        this.listData = this.listData.filter(item => {
          return item.caId != 0 && item.name.indexOf(departmentName) > -1;
        });
      } else {
        this.tabclass();
      }
    },
    tabclass() {
      let params = {
        auditFlag: "0",
        currentPage:
          Math.ceil(this.listData.length / this.$store.state.pageSize) + 1,
        pageSize: this.$store.state.pageSize
      };
      this.utils.ajax({
        url: this.api.queryAuditList,
        method: "POST",
        data: params,
        success: data => {
          console.log("ssssggg", data);
          data.content = [
            {
              caId: 1,
              name: "张三",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管..."
            },
            {
              name: "李三",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管...",
              caId: 2
            },
            {
              name: "王二",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管...",
              caId: 3
            },
            {
              name: "张三",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管...",
              caId: 4
            },
            {
              name: "李三",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管..."
            },
            {
              name: "王二",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管..."
            },
            {
              name: "张三",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管..."
            },
            {
              name: "李三",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管..."
            },
            {
              name: "王二",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管..."
            },
            {
              name: "张三",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管..."
            },
            {
              name: "李三",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管..."
            },
            {
              name: "王二",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管..."
            },
            {
              name: "张三",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管..."
            },
            {
              name: "李三",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管..."
            },
            {
              name: "王二",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管..."
            },
            {
              name: "张三",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管..."
            },
            {
              name: "李三",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管..."
            },
            {
              name: "王二",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管..."
            },
            {
              name: "张三",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管..."
            },
            {
              name: "李三",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管..."
            },
            {
              name: "王二",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管..."
            },
            {
              name: "张三",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管..."
            },
            {
              name: "李三",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管..."
            },
            {
              name: "王二",
              startDate: "呼吸内科",
              applyDate: "呼吸内科",
              reason: "食管狭窄扩张术/内镜下食管..."
            }
          ];
          if (data.content.length) {
            const content = data.content.map(i => {
              const item = i;
              //   item.name = item.studentVO.name;
              //   item.startDatee = item.startDate + "-" + item.endDate;
              return item;
            });
            this.listData = content;
          }
        }
      });
      // }
    },
    clear() {
      this.tabclass();
    },
  },
  created() {
    this.tabclass();
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
  padding: 0.1rem;
}
</style>
