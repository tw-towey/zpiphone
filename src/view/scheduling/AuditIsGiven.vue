<template>
  <div>
    <van-nav-bar title="审核出科" class="header" fixed left-arrow @click-left="onClickLeft"></van-nav-bar>

    <div class="layout_content" ref="layoutContent" @scroll="scroll()">
      <van-tabs
        v-model="active"
        :offset-top="40"
        sticky
        swipeable
        title-active-color="#1a7fe9"
        color="#5fa4ec"
        :line-height="2"
        @click="change"
        @change="change"
      >
        <div v-for="(item,index) in tabs">
          <van-tab :title="item.title">
            <van-list
              v-model="item.loading"
              :finished="item.finished"
              :error.sync="item.error"
              error-text="请求失败，点击重新加载"
              :finished-text="item.finishedText"
              immediate-check
              :offset="50"
              @load="onLoad()"
            >
              <div v-if="index == 1" class="auditDate">
                <van-cell title="审核日期" is-link :value="auditDate" @click="selectTime()"/>
              </div>

              <ViewList :listObj="item.listObj" :listData="item.listData"></ViewList>
            </van-list>
          </van-tab>
        </div>
      </van-tabs>
      <PassAndNoPass
        v-if="active == 0"
        @auditHandle="givenAudit"
        :error="error"
        :class="active == 0 ? 'mt' : ''"
        :list="tabs[0].listData"
      ></PassAndNoPass>

      <van-popup v-model="calendarShow" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="year-month"
          :formatter="formatter"
          @confirm="selectDate"
          @cancel="closePopup"
        />
      </van-popup>
    </div>
  </div>
</template>
<script>
import ViewList from "@/components/ViewList";
import PassAndNoPass from "@/components/PassAndNoPass";
import Retroactive from "@/view/attendance/Retroactive";

export default {
  name: "SubjectAppraise",
  components: {
    Retroactive: Retroactive,
    ViewList: ViewList,
    PassAndNoPass: PassAndNoPass
  },
  data() {
    return {
      error: "请选择待审核数据",
      active: 0,
      calendarShow: false,
      auditDate: new Date(),
      currentDate: new Date(),
      tabs: [
        {
          title: "待审核",
          loading: false,
          finished: false,
          error: false,
          selected: false,
          finishedText: "没有更多了",
          scrollTop: 0,
          listObj: {
            list: [
              {
                field: "姓名：",
                name: "name",
                leftClass: "gray",
                render: (data, key) => {
                  return data.student.name;
                }
              },
              {
                field: "轮转科室：",
                name: "departmentName",
                leftClass: "gray",
                render: (data, key) => {
                  return data.departmentName;
                }
              },
              { field: "申请日期：", name: "applyDate", leftClass: "gray" }
            ],
            click: this.viewAppraise
          },
          listData: []
        },
        {
          title: "已审核",
          loading: false,
          finished: false,
          error: false,
          finishedText: "没有更多了",
          scrollTop: 0,
          listObj: {
            list: [
              {
                field: "姓名：",
                name: "name",
                leftClass: "gray",
                render: (data, key) => {
                  return data.student.name;
                }
              },
              {
                field: "轮转科室：",
                name: "departmentName",
                leftClass: "gray"
              },
              { field: "申请人：", name: "memberName", leftClass: "gray" },
              {
                field: "审核状态：",
                name: "auditFlag",
                leftClass: "gray",
                render: (data, key) => {
                  if (data.auditFlag == 1) {
                    return `<span class="green">审核通过</span>`;
                  } else if (data.auditFlag == 2) {
                    return `<span class="red">审核不通过</span>`;
                  }
                }
              },
              { field: "审核意见：", name: "auditOpinion", leftClass: "gray" },
              { field: "审核日期：", name: "auditDate", leftClass: "gray" }
            ]
          },
          listData: []
        }
      ]
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    onLoad() {
      this.queryData();
    },
    change(index, title) {
      this.$nextTick(() => {
        this.$refs.layoutContent.scrollTop = this.tabs[this.active].scrollTop;
      });
    },
    scroll() {
      this.tabs[this.active].scrollTop = this.$refs.layoutContent.scrollTop; //记录滑动的scrollTop高度
    },
    selectTime() {
      this.calendarShow = true;
    },
    selectDate(v) {
      let year = v.getFullYear();
      let month = (v.getMonth() + 1).toString();
      month = month.length === 1 ? "0" + month : month;

      this.tabs[this.active].listData = [];
      this.auditDate = year + "-" + month;
      this.calendarShow = false;
      this.queryData();
    },
    closePopup() {
      this.calendarShow = false;
    },
    formatter(type, value) {
      return this.utils.pickerType(type, value);
    },
    queryData(currentPage) {
      let currentTab = this.tabs[this.active];
      let params = {
        currentPage:
          currentPage ||
          Math.ceil(currentTab.listData.length / this.$store.state.pageSize) +
            1,
        pageSize: this.$store.state.pageSize
      };

      switch (this.active) {
        case 0: //待审核tab页
          params.auditFlags = [0];
          break;
        case 1: //已审核tab页
          params.auditDate = this.auditDate;
          params.auditFlags = [1, 2];
          break;
        default:
          return;
      }

      this.utils.ajax({
        method: "post",
        data: params,
        url: this.api.getNotAlreadyAuditDepartmentOutApply,
        success: data => {
          if (data.content.length) {
            data.content.forEach(item => {
              item.selected = false;
            });
          } else {
            currentTab.finishedText = "";
          }
          currentTab.listData = currentPage
            ? data.content
            : [...currentTab.listData, ...data.content];
 
          currentTab.loading = false; //结束当前加载
          if (params.currentPage >= data.totalPages) {
            currentTab.finished = true;
          } else {
            currentTab.finished = false;
          }
          console.log(data.content);
          
        }
      });
    },
    viewAppraise(data) {
      //选中
      data.selected = !data.selected;
    },
    givenAudit(result) {
      //审核操作
      let ids = [];
      //获取选中的id集合
      let currentTab = this.tabs[this.active];
      currentTab.listData.forEach(item => {
        if (item.selected) {
          ids.push(item.id);
        }
      });
      var url = result.type == "pass" ? this.api.approval:this.api.reject;
      
      this.utils.ajax({
        method: "post",
        data: {
          auditOpinion: result.data,
          ids: ids
        },
        url: url,
        success: data => {
          if (result.type == "pass") {
            this.Toast("审核通过");
          } else {
            this.Toast("审核不通过");
          }
          setTimeout(() => {
            this.queryData(1);
          }, 500);
        },
        error: error => {
          currentTab.loading = false;
          currentTab.error = true;
        }
      });
    }
  },
  created() {
    //审核日期赋值
    this.auditDate = this.utils.formatDate(
      this.$store.state.timestamp || new Date().getTime(),
      "yyyy-MM"
    );
  }
};
</script>
<style scoped>
.auditDate {
  border-bottom: 1px solid #ddd;
  padding-left: 0.3rem;
  background: #fff;
}

.mt {
  margin-top: 2rem;
}
</style>



