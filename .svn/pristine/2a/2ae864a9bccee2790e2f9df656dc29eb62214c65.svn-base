<template>
  <div>
    <van-nav-bar title="请假审批列表" class="header" fixed left-arrow @click-left="onClickLeft"/>
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
    name: "LeaveApprova",
    components: {
      ViewList: ViewList
    },
    data() {
      return {
        loading: false,
        finished: false,
        error: false,
        finishedText: '没有更多了',
        listData: [],
        listObj: {
          list: [
            {field: "姓名：", name: "name", leftClass: "gray"},
            {field: "时间：", name: "startDate", leftClass: "gray"},
            {field: "申请时间：", name: "applyDate", leftClass: "gray"},
            {field: "请假原因：", name: "reason", leftClass: "gray"}
          ],
          click: (data, key) => {
            this.$router.push({
              name: "LeaveApprovaLinst",
              params: {
                reason: data.reason,
                name: data.name,
                applyDate: data.applyDate,
                startDatee: data.startDatee,
                attendanceTypeName: data.attendanceTypeName,
                dayNum: data.dayNum,
                id: data.applyCurrentSetpId
              }
            });
          }
        }
      };
    },
    methods: {
      onClickLeft() {
        this.utils.goBack(this);
      },
      onLoad(){
        this.queryData();
      },
      queryData() {
        let params = {
          auditFlag: '0',
          currentPage: Math.ceil(this.listData.length / this.$store.state.pageSize) + 1,
          pageSize: this.$store.state.pageSize
        }

        this.utils.ajax({
          url: this.api.queryAuditList,
          data: params,
          method: "POST",
          success: data => {
            if (data.content.length) {
              const content = data.content.map((i)=> {
                const item = i;
                item.name = item.studentVO.name;
                item.startDatee = item.startDate + "-" + item.endDate;
                return item;
              });

              this.listData = [...this.listData, ...content];
              console.log(this.listData);
            } else {
              this.finishedText = '';
            }

            this.loading = false;//结束当前加载
            if (params.currentPage >= data.totalPages) {//最后一页、加载完成
              this.finished = true;
            }
          }
        });
      }
    }
  };
</script>

<style scoped>
  .tabulate ul,
  .tabulate ul li,
  .tabulate ul li p {
    margin: 0;
    padding: 0;
  }

  .tabulate ul {
    width: 99.5%;
    padding-top: 0.5rem;
    background: white;
    border: 1px solid #f7f7f7;
  }

  .tabulate ul li {
    width: 89%;
    margin: 0 auto;
    display: flex;
    padding: 0.3rem 0;
  }

  .fontColor {
    color: #9c9c9c;
  }

  .left {
    /* margin-left: 1.6rem  !important; */
    text-align: right;
    width: 70px;
  }
</style>
