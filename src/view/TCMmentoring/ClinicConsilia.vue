<template>
  <div>
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

    <div class="layout_content" @click="body()">
      <div class="position" v-show="leftAdd">
        <van-icon name="arrow-up" class="inca" size="1.3rem" color="#ccc"/>
        <div class="rightClickbut">
          <p @click="addClick()">新增医案</p>
          <p @click="inquire()">查询医案</p>
        </div>
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
                    <span>
                    患者姓名：
                    </span>
                    <span>{{item.patientName}}</span>
                  </p>
                  <p>
                    <span>
                    中医诊断：

                    </span>
                    <span>{{item.tcmDiagnosis}}</span>
                  </p>
                  <p>
                    <span>
                      记录时间：
                    </span>
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
  </div>
</template>

<script>
export default {
  name: "ClinicConsilia",
  components: {},
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      finishedText: "没有更多了",
      listData: [],
      clickLinstA: 1,
      leftAdd: false
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    onClickRight(v) {
      this.leftAdd = !this.leftAdd;
    },
    onLoad() {
      this.queryData();
    },
    body() {
      this.leftAdd = false;
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
          this.Toast('删除成功');
          setTimeout(() => {
            this.queryData();
          }, 500);
        }
      });
    },
    addClick() {
      this.$router.push({ name: "BasisRecord", params: {} });
    },
    inquire() {
      this.$router.push({ name: "QueryConsilia", params: {} });
    },
    queryData() {
      let params = {
        currentPage:
          Math.ceil(this.listData.length / this.$store.state.pageSize) + 1,
        pageSize: this.$store.state.pageSize
      };

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
            this.listData = Object.assign(this.listData, [
              ...this.listData,
              ...content
            ]);
            // this.listData = [...this.listData, ...content];
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
  padding: 0;
  font-size: 0.9rem;
}
span{
  font-size: 0.9rem;
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
  position: fixed;
  top: 2.9rem;
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
  position: absolute;
  right: 0;
  top: 15px;
}
.img1 {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_02.svg") no-repeat;
  position: absolute;
  right: 0;
  top: 15px;
}
.img3 {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_01.svg") no-repeat;
  position: absolute;
  right: 0;
  top: 15px;
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
  display: flex;
}
.content_box div p span:nth-child(1) {
  width: 26%;
}
.content_box div p span:nth-child(2) {
  /* width: 200px; */
  /* width: 13.3rem; */
  width: 70%;
  display: inline-block;
  word-wrap: break-word;
  white-space: pre-wrap;
}
/* .content_box div p span {
  color: #000000;
  display: inline-block;
  word-wrap: break-word;
  white-space: normal;
  width: calc(100% - 150px);
} */
.content_box {
  /* display: flex;
  justify-content: space-between; */
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
  background: #ff4444;
  color: white;
}
.layout_content>>> .van-swipe-cell__right {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
