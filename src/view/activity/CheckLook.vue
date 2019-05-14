<!--  -->
<template>
  <div class>
    <van-nav-bar title="接收对象" class="header" fixed left-arrow @click-left="onClickLeft"/>

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
  name: "CheckLook",
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
          { field: "姓名：", name: "name", leftClass: "gray" },
          { field: "手机号：", name: "cellphone", leftClass: "gray" },
          { field: "科室：", name: "roleNames", leftClass: "gray" }
        ]
      }
    };
  },
  //方法集合
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
      this.$store.state.ActiveLook = "Look";
      this.$store.state.DepartmentEcho = "Echo";
    },
    onLoad() {
      this.queryData();
    },
    // btnRequest() {
    //   let params = {
    //     teachingId: this.$route.params.id,
    //     currentPage:
    //       Math.ceil(currentTab.listData.length / this.$store.state.pageSize) +
    //       1,
    //     pageSize: this.$store.state.pageSize
    //   };
    //   this.utils.ajax({
    //     method: "POST",
    //     data: params,
    //     url: this.api.findTeachingReceiversByTeachingId,
    //     success: data => {
    //       console.log(data, "sssssssssssss");
    //       this.Look = data;
    //       //   data.map(i => {
    //       //     const item = i;
    //       //     console.log(item.memberVO, "ji");
    //       //     this.Look.name = item.memberVO.name;
    //       //     this.Look.phonenumber = item.memberVO.cellphone;
    //       //     this.Look.office = item.memberVO.roleNames;
    //       //     return item;
    //       //   });
    //     }
    //   });
    // },

    queryData() {
      let params = {
         teachingId: this.$store.state.paramsTeachingId,
        currentPage:
          Math.ceil(this.listData.length / this.$store.state.pageSize) + 1,
        pageSize: this.$store.state.pageSize
      };

      this.utils.ajax({
        url:  this.api.findTeachingReceiversByTeachingId,
        data: params,
        method: "POST",
        success: data => {
            console.log(data,'ssssss');
            
          if (data.content.length) {
            const content = data.content.map(i => {
              const item = i;
              item.name = item.memberVO.name;
              item.cellphone = item.memberVO.cellphone;
              item.roleNames = item.memberVO.roleNames;
              return item;
            });

            this.listData = [...this.listData, ...content];
            console.log(this.listData);
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
  created() {
  }
};
</script>
<style  scoped>
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