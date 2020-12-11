<template>
  <div>
    <van-nav-bar title="临床医案" class="header" fixed left-arrow @click-left="onClickLeft"></van-nav-bar>
    <div class="layout_content" ref="layoutContent" @scroll="scroll()">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
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
              <!-- <ViewList :listObj="item.listObj" :listData="item.listData"> </ViewList> -->
              <Commonality :listData="item.listData" :listObj="item.listObj" :isclinical="true"></Commonality>
            </van-list>
          </van-tab>
        </div>
      </van-tabs>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
// import ViewList from "@/components/ViewList";
import Commonality from "./Commonality";
import Retroactive from "@/view/attendance/Retroactive";
export default {
  name: "MedicalReview",
  components: {
    Retroactive: Retroactive,
    // ViewList: ViewList,
    Commonality:Commonality,
  },
  data() {
    return {
      error: "请选择待审核数据",
      givenAudit:'',
      active: 0,
      calendarShow: false,
      currentDate: new Date(),
      isLoading:false,
      tabs: [
        {
          title: "待审核",
          loading: false,
          finished: false,
          error: false,
          selected: false,
          isclinical:true,
          finishedText: "没有更多了",
          scrollTop: 0,
          listObj: {
            list: [
              {
                field: "学员姓名：",
                name: "studentName",
                leftClass: "gray",
                render: (data, key) => {
                  return data.studentName;
                }
              },
              {
                field: "参培专业：",
                name: "traineeMajorCodeText",
                leftClass: "gray",
                render: (data, key) => {
                  return data.traineeMajorCodeText;
                }
              },
              { field: "提交时间：", name: "commitTime", leftClass: "gray" },
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
          isclinical:true,
          finishedText: "没有更多了",
          scrollTop: 0,
          listObj: {
            list: [
              {
                field: "学员姓名：",
                name: "studentName",
                leftClass: "gray",
                render: (data, key) => {
                  return data.studentName;
                }
              },
              {
                field: "参培专业：",
                name: "traineeMajorCodeText",
                leftClass: "gray"
              },
              { field: "审核时间：", name: "auditTime", leftClass: "gray" }
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
    closePopup() {
      this.calendarShow = false;
    },
    formatter(type, value) {
      return this.utils.pickerType(type, value);
    },
    onRefresh() {
      this.tabs[this.active].listData = [];
      this.queryData();
    },
    queryData(currentPage) {
      this.isLoading = true;
      var url;
      let currentTab = this.tabs[this.active];
      let params = {
        currentPage:currentPage ||
                    Math.ceil(currentTab.listData.length / this.$store.state.pageSize)
                    + 1,
            pageSize: this.$store.state.pageSize
      };
      switch (this.active) {
        case 0: //待审核tab页
          params.statusList = [2];
          break;
        case 1: //已审核tab页
          params.statusList = [3,4];
          break;
        default:
          return;
      }
      this.utils.ajax({
        method: "post",
        data: params,
        url: this.api.clinicalRecordList,
        success: data => {
          this.isLoading = false;
          if (data.content.length) {
            data.content.forEach(item => {
              item.traineeMajorCodeText = this.utils.getValueByKey(this.$store.state.majors, item.traineeMajorCode);
              // item.selected = false;
            });
          } else {
              currentTab.finishedText = "";
          }
          currentTab.listData = currentPage ? data.content : [...currentTab.listData, ...data.content];
          currentTab.loading = false;//结束当前加载
          if (params.currentPage >= data.totalPages) {//最后一页、加载完成
              currentTab.finished = true;
           }else{
              currentTab.finished = false;
          }
        }
      });
    },
    viewAppraise(data) {
          data.selected = !data.selected;
    },
  },
  mounted() {
  },
  created() {
  }
};
</script>
<style scoped>
.van-pull-refresh{
   height:100%;
   overflow: auto;
 }
.mt {
  margin-top: 2rem;
}
.img1 {
  width: 4rem;
  height: 4rem;
  background:url("../../assets/images/home/pic10_02.svg") no-repeat;
}
.img3 {
  width: 4rem;
  height: 4rem;
  background:url("../../assets/images/home/pic10_01.svg") no-repeat;
}
</style>



