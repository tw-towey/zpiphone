<template>
  <div class>
    <van-nav-bar title="导师申请" class="header" fixed left-arrow @click-left="onClickLeft">
      <div class="add-activity" slot="right" v-if="submit">
        <div @click="onClickRight">
          <p>提交</p>
        </div>
      </div>
      <div class="add-activity" slot="right" v-if="!submit">
        <div @click="onClickRightop">
          <p>撤销</p>
        </div>
      </div>
    </van-nav-bar>
    <div class="layout_content">
      <ViewList :listObj="listObj" :listData="listData"></ViewList>
      <div class="tutor_box">
        <ul>
          <li>
            <p>个人简历</p>
            <van-field v-model="resume" type="textarea" placeholder="请输个人简历" required/>
          </li>
        </ul>
      </div>
      <div class="button" @click="preserved()">保存</div>
    </div>
  </div>
</template>

<script>
import ViewList from "@/components/ViewList";

export default {
  name: "MentorApplication",
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
          { field: "学员姓名：", name: "name", leftClass: "gray" },
          { field: "培训专业：", name: "startDate", leftClass: "gray" },
          { field: "参加年份：", name: "applyDate", leftClass: "gray" },
          { field: "培训年限：", name: "reason", leftClass: "gray" }
        ]
      },
      resume: "",
      submit: true
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    onClickRight() {
      //  提交
      // let params = {};
      // let url = "";
      // this.ajaxp(params, url,'提交成功');
      this.submit = !this.submit;
    },
    onClickRightop() {
      // 撤销
      // let params = {};
      // let url = "";
      // this.ajaxp(params, url,'保存成功');
      this.submit = !this.submit;
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
            }
          ];

          if (data.content.length) {
            const content = data.content.map(i => {
              const item = i;
              console.log(i);
              item.years = item.years + "年";
              item.person = item.person + "人";
              return item;
            });
            this.listData = content;
          }
        }
      });
    },
    ajaxp(params, url, tost) {
      this.utils.ajax({
        url: url,
        data: params,
        method: "POST",
        success: data => {
          this.Toast(tost);
          setTimeout(() => {
            this.submit = !this.submit;
          }, 500);
        }
      });
    },
    preserved() {
      // 保存
      let url = "";
      let params = {};
      this.utils.ajax({
        url: url,
        data: params,
        method: "POST",
        success: data => {
          this.Toast("保存成功");
        }
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
  padding: 0.5rem 0;
  text-align: center;
  background: #007acc;
  position: fixed;
  bottom: 0;
  text-align: center;
}
.add-activity {
  color: #fff;
}
</style>
