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
          { field: "导师姓名：", name: "name", leftClass: "gray" },
          { field: "所属科室：", name: "startDate", leftClass: "gray" },
          { field: "技术职称：", name: "applyDate", leftClass: "gray" },
          { field: "擅长领域：", name: "reason", leftClass: "gray" }
        ],
        click: (data, key) => {
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
    onClickRight() {
      console.log(5555);
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
        auditFlag: "0",
        currentPage:
          Math.ceil(this.listData.length / this.$store.state.pageSize) + 1,
        pageSize: this.$store.state.pageSize
      };

      this.utils.ajax({
        url: this.api.queryAuditList,
        data: params,
        method: "POST",
        success: data => {
          data.content = [
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
