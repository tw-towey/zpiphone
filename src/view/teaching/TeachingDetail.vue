<template>
  <div class="teachingDetail">
    <van-nav-bar title="带教详情" class="header" fixed left-arrow @click-left="onClickLeft"/>
    <div class="layout_content">
      <van-list v-model="loading" :finished="finished" :error.sync="error" error-text="请求失败，点击重新加载"
                :finished-text="finishedText" immediate-check :offset="50" @load="onLoad()">
        <ViewList :listObj="listObj" :listData="listData"></ViewList>
      </van-list>
    </div>
  </div>
</template>
<script>
  import ViewList from "@/components/ViewList";

  export default {
    name: "TeachingDetail",
    components: {
      "ViewList": ViewList
    },
    data() {
      return {
        loading: false,
        finished: true,
        error: false,
        finishedText: "没有更多了",
        listObj: {
          list: [
            {field: "学员姓名：", name: "studentName", leftClass: "gray"},
            {field: "手机号码：", name: "cellphone", leftClass: "gray"},
            {
              field: "参培专业：", name: "traineeMajorCode", leftClass: "gray", render: (data, key) => {
              return this.utils.getValueByKey(this.$store.state.majors, data[key]);
            }
            },
            {field: "轮转科室：", name: "departmentName", leftClass: "gray"},
            {
              field: "开始时间：", name: "startTime", leftClass: "gray", render: (data, key) => {
              return this.utils.formatDate(data[key], "yyyy-MM-dd HH:mm");
            }
            },
            {
              field: "结束时间：", name: "endTime", leftClass: "gray", render: (data, key) => {
              return this.utils.formatDate(data[key], "yyyy-MM-dd HH:mm");
            }
            }
          ],
          click: this.viewAppraise
        },
        listData: []
      };
    },
    methods: {
      onClickLeft() {
        this.utils.goBack(this);
      },
      onLoad() {

      },
      queryData(){
        this.utils.ajax({
          method: "post",
          data: this.$route.params,
          url: this.api.teachingSituationInfo,
          success: (data) => {
            if (!data.length) {
              this.finishedText = '';
            }

            this.listData = data;
          }
        });
      }
    },
    created() {
      this.queryData();
    }
  }
</script>

<style scoped>
  .teachingList {
    background: #fff;
  }

  .teachingList li {
    padding: 15px;
  }

  .teachingList li .item {
    line-height: 32px;
  }

  .teachingList li .item .title {
    display: inline-block;
    width: 70px;
    text-align: right;
    margin-right: 5px;
  }

  .van-row {
    position: relative;
  }

  .van-col--4 {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    top: 40%;
    text-align: right;
  }

</style>


