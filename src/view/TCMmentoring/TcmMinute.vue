<template>
  <div>
    <van-nav-bar title="跟师心得" class="header" fixed left-arrow @click-left="onClickLeft">
      <div class="add-activity" slot="right">
        <div @click="onClickRight" class="add">新增</div>
      </div>
    </van-nav-bar>
    <div class="layout_content">
      <van-list v-model="loading" :finished="finished" :error.sync="error" error-text="请求失败，点击重新加载" :finished-text="finishedText" immediate-check :offset="50" @load="onLoad()">
        <ul class="content">
          <li v-for="(item,index) in listData" @click="onClick(item)" :id="item.id" :key="index">
            <van-swipe-cell :right-width="item.right">
              <div class="content_box">
                <div>
                  <p>
                    记录类型：
                    <span>{{item.noteType}}</span>
                  </p>
                  <p>
                    记录时间：
                    <span>{{item.createTime}}</span>
                  </p>
                </div>
                <div :class="item.class"></div>
              </div>
              <div slot="right" v-if="item.show" class="right_swipe">
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
  name: "TcmMinute",
  components: {},
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
    onClickRight() {
      this.$router.push({ name: "AddNotebook", params: { ConsiliaData: 0 } });
    },

    onClick(item) {
      if (item.noteType == "跟师总结") {
        this.$router.push({
          name: "TeacherSumup",
          params: { item: item, type: 1 }
        });
        return;
      }
      if (item.status == 1) {
        this.$router.push({
          name: "AddNotebook",
          params: { ConsiliaData: 1, id: item.id }
        });
      }
      if (item.status == 2) {
        this.$router.push({
          name: "AddNotebook",
          params: { ConsiliaData: 2, id: item.id }
        });
      }
      if (item.status == 3) {
        this.$router.push({
          name: "AddNotebook",
          params: { ConsiliaData: 3, id: item.id }
        });
      }
      if (item.status == 4) {
        this.$router.push({
          name: "AddNotebook",
          params: { ConsiliaData: 4, id: item.id }
        });
      }
    },
    onLoad() {
      this.tabclass();
    },
    Deleteclick(item, index) {
      // 删除
      var parms = {
        id: item.id
      };
      this.utils.ajax({
        url: this.api.supervisorNoteDelete,
        data: parms,
        method: "POST",
        success: data => {
          this.Toast("删除成功");
          setTimeout(() => {
            this.listData.splice(index, 1);
            this.tabclass();
          }, 500);
        }
      });
    },
    tabclass() {
      let params = {
        currentPage:
          Math.ceil(this.listData.length / this.$store.state.pageSize) + 1,
        pageSize: this.$store.state.pageSize
      };
      this.utils.ajax({
        url: this.api.supervisorNotePageForApp,
        method: "POST",
        data: params,
        success: data => {
          //状态（0删除、1草稿、2提交审核、3审核通过、4审核退回）
          if (data.content.length) {
            const content = data.content.map(i => {
              const item = i;
              if (item.status == 1) {
                item.show = true;
                item.right = 60;
              }
              if (item.status == 2) {
                item.class = "img";
              }
              if (item.status == 3) {
                item.class = "img3";
              }
              if (item.status == 4) {
                item.class = "img1";
              }
              if (item.noteType == 0) {
                item.noteType = "跟师心得体会";
              }
              if (item.noteType == 1) {
                item.noteType = "学习中医典籍体会";
              }
              if (item.noteType == 2) {
                item.noteType = "其他";
              }
              if (item.noteType == 3) {
                item.noteType = "跟师总结";
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
.add {
  color: white;
}
.content li {
  background: white;
  padding: 0.5rem 0.8rem;
  margin-top: 0.3rem;
}
.content li:nth-of-type(1) {
  margin-top: 0rem !important;
}
.img {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_03.svg") no-repeat;
  padding: 0.2rem;
}
.img1 {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_02.svg") no-repeat;
  padding: 0.2rem;
}
.img3 {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_01.svg") no-repeat;
  padding: 0.2rem;
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
}

.right_swipe span {
  background: #ff4444;
  color: white;
}
.content_box div p {
  color: #969799;
  padding: 0.5rem 0.3rem;
  margin: 0;
}
.content_box div p span {
  color: #000000;
}
</style>