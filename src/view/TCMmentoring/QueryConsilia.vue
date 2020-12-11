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
        <van-search v-model="keywords" placeholder="输入中医诊断" shape="round" background/>
      </div>
      <div data-v-0f4718e4 class="van-nav-bar__right" @click="onSearch">搜索</div>
    </div>
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
      <ul class="content">
        <li v-for="(item,index) in listData" @click="click(item)" :id="item.id">
          <van-swipe-cell :right-width="item.right">
            <div class="content_box">
              <div>
                <p>
                  患者姓名：
                  <span>{{item.patientName}}</span>
                </p>
                <p>
                  中医诊断：
                  <span>{{item.tcmDiagnosis}}</span>
                </p>
                <p>
                  记录时间：
                  <span>{{item.createTime}}</span>
                </p>
              </div>
              <div :class="item.img"></div>
            </div>
            <div slot="right" class="right_swipe">
              <span @click="Deleteclick(item,index)">删除</span>
            </div>
          </van-swipe-cell>
        </li>
      </ul>
    </van-list>
  </div>
</template>

<script>
export default {
  name: "QueryConsilia",
  components: {},
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      finishedText: "没有更多了",
      value: "",
      medicals: [],
      newList: [],
      searchDepartments: [],
      departmentName: "",
      listData: [],
      keywords: ""
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    onSearch() {
      this.queryData(true);
    },
    onLoad() {
      this.queryData(false);
    },
    click(item) {
      if (item.status == 1) {
        this.$router.push({ name: "Manuscript", params: { item: item } });
      }
      if (item.status == 2) {
        this.$router.push({ name: "BasisRecordLinst", params: { item: item } });
      }
      if (item.status == 4) {
        this.$router.push({ name: "Notpass", params: { item: item } });
      }
      if (item.status == 3) {
        this.$router.push({ name: "Consiliadetails", params: { item: item } });
      }
    },
    Deleteclick(item, index) {
      //  删除
      this.listData.splice(index, 1);
      var params = {
        id: item.id
      };
      this.utils.ajax({
        url: this.api.clinicalRecorddelete,
        data: params,
        method: "POST",
        success: data => {
          this.queryData();
        }
      });
    },
    queryData(flag) {
      let params = {};
      if (flag) {
        params = {
          currentPage: 1,
          pageSize: this.$store.state.pageSize,
          tcmDiagnosis: this.keywords
        };
      } else {
        params = {
          currentPage:
            Math.ceil(this.listData.length / this.$store.state.pageSize) + 1,
          pageSize: this.$store.state.pageSize,
        };
      }
      this.utils.ajax({
        url: this.api.clinicalRecordPageForApp,
        data: params,
        method: "POST",
        success: data => {
          if (data.content.length) {
            const content = data.content.map(i => {
              const item = i;
              if (item.status == 2) {
                //状态（0删除、1草稿、2提交审核、3审核通过、4审核退回）
                item.img = "img";
              }
              if (item.status == 1) {
                item.img = "";
                item.right = 60;
              }
              if (item.status == 4) {
                item.img = "img1";
              }
              if (item.status == 3) {
                item.img = "img3";
              }
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
    clear() {}
  },
  created() {}
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
p {
  margin: 0;
  padding: 0;
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
.position {
  z-index: 20000;
  position: absolute;
  top: 0.5rem;
  right: 1.3rem;
}
.rightClickbut p {
  padding: 0.5rem 0.8rem;
  border: 1px solid #ccc;
  background: white;
}
.inca {
  position: absolute;
  right: -0.17rem;
  top: -0.8rem;
}
.img {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_03.svg") no-repeat;
}
.img1 {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_02.svg") no-repeat;
}
.img3 {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_01.svg") no-repeat;
}
.content li {
  background: white;
  padding: 0.5rem 0.8rem;
  margin-top: 0.3rem;
}
.content li:nth-of-type(1) {
  margin-top: 0rem !important;
}
.content_box div p {
  color: #969799;
  padding: 0.5rem 0.3rem;
  margin: 0;
}
.content_box div p span {
  color: #000000;
}
.content_box {
  display: flex;
  justify-content: space-between;
}
.right_swipe {
  display: flex;
  justify-content: space-between;
}
.right_swipe span {
  width: 3rem;
  height: 2rem;
  margin-left: 0.5rem;
  display: block;
  text-align: center;
  line-height: 2rem;
  margin-top: 1.5rem;
  background: #ff4444;
  color: white;
}
</style>
