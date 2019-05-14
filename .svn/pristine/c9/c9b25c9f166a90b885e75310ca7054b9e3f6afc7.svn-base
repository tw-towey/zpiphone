<template>
  <div class>
    <van-nav-bar title="导师详情" class="header" fixed left-arrow @click-left="onClickLeft"/>
    <div class="layout_content">
      <ViewList :listObj="listObj" :listData="listData"></ViewList>
      <div class="tutor_box" v-for="item in listData">
        <ul>
          <li>
            <p>擅长领域</p>
            <p>{{item.territory}}</p>
          </li>
          <li>
            <p>个人简介</p>
            <p>{{item.brief}}</p>
          </li>
        </ul>
      </div>
      <div class="button" @click="ApplyFor()">导师申请</div>
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
      finishedText: "没有更多了",
      listData: [],
      listObj: {
        list: [
          { field: "学院姓名：", name: "name", leftClass: "gray" },
          { field: "所属科室：", name: "startDate", leftClass: "gray" },
          { field: "技术职称：", name: "applyDate", leftClass: "gray" },
          { field: "导师资质：", name: "reason", leftClass: "gray" },
          { field: "从业年限：", name: "years", leftClass: "gray" },
          { field: "累计带教：", name: "person", leftClass: "gray" }
        ]
      }
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
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
              reason: "食管狭窄扩张术/内镜下食管...",
              years: "11",
              person: "200",
              territory:
                "adklhaskdwjdhjsacbasbchabshcbahbschbashbhabschbahsbchbashcbascbahsbchabscba",
              brief: "sasdasdascascascascascascascascascascascascasc"
            }
          ];

          if (data.content.length) {
            const content = data.content.map(i => {
              const item = i;
              item.years = item.years + "年";
              item.person = item.person + "人";
              //   item.name = item.studentVO.name;
              //   item.startDatee = item.startDate + "-" + item.endDate;
              return item;
            });

            this.listData = content;
          }
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
  font-size: 0.875rem;
  background: #007acc;
  text-align: center;
  padding: 0.5rem 0;
  position: fixed;
  bottom: 0;
}
</style>
