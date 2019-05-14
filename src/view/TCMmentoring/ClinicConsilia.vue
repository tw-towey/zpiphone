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
      <div data-v-0f4718e4 class="van-nav-bar__title van-ellipsis tosa">临床医案</div>
      <div data-v-0f4718e4 class="van-nav-bar__right" @click="onClickRight">
        <van-icon name="ellipsis" size="1.8em"/>
      </div>
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
        <div v-for="item in listData">
          <div class="clinic_box" @click="click(item)">
            <ul>
              <li>
                <span class="gray">患者姓名：</span>
                <span>{{item.name}}</span>
              </li>
              <li>
                <span class="gray">中医诊断：</span>
                <span>{{item.startDate}}</span>
              </li>
              <li>
                <span class="gray">记录时间：</span>
                <span>{{item.writeTime}}</span>
              </li>
            </ul>
            <div :class="item.img"></div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import ViewList from "@/components/ViewList";

export default {
  name: "ClinicConsilia",
  components: {
    ViewList: ViewList
  },
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      finishedText: "没有更多了",
      listData: []
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    onClickRight(v) {
      console.log(1111);
    },
    onLoad() {
      this.queryData();
    },
    click(item) {
      console.log(item.isSignUp);
      if (item.isSignUp == 1) {
        console.log("正常");
        this.$router.push({ name: "BasisRecord", params: {} });
      }
      if (item.isSignUp == 2) {
        console.log("通过");
      }
      if (item.isSignUp == 3) {
        console.log("不通过");
      }
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
              writeTime: "2019-03-12 18:00",
              isSignUp: 1
            },
            {
              name: "李三",
              startDate: "呼吸内科",
              writeTime: "2019-03-12 18:00",
              isSignUp: 2
            },
            {
              name: "王二",
              startDate: "呼吸内科",
              writeTime: "2019-03-12 18:00",
              isSignUp: 3
            }
          ];

          if (data.content.length) {
            const content = data.content.map(i => {
              const item = i;
              //   item.name = item.studentVO.name;
              //   item.startDatee = item.startDate + "-" + item.endDate;
              if (item.isSignUp == 1) {
                item.img = "img";
              }
              if (item.isSignUp == 2) {
                item.img = "img1";
              }
              if (item.isSignUp == 3) {
                item.img = "img3";
              }
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
p {
  margin: 0;
  padding: 0.2rem;
}
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
.clinic_box {
  background: white;
  padding: 0.5rem 0.9rem;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
}
.clinic_box .img {
  width: 4rem;
  height: 4rem;
  background:url("../../assets/images/home/pic10_03.svg") no-repeat;
}
.clinic_box .img1 {
  width: 4rem;
  height: 4rem;
  background:url("../../assets/images/home/pic10_02.svg") no-repeat;
}
.clinic_box .img3 {
  width: 4rem;
  height: 4rem;
  background:url("../../assets/images/home/pic10_01.svg") no-repeat;
}
</style>
