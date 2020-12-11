<template>
  <div class>
    <van-nav-bar title="申请记录" class="header" fixed left-arrow @click-left="onClickLeft" />
    <div class="layout_content">
      <van-list v-model="loading" :finished="finished" :error.sync="error" error-text="请求失败，点击重新加载" :finished-text="finishedText" immediate-check :offset="50" @load="onLoad()">
        <div class="concent" v-for="(item,index) in dataList" :key="index">
          <div @click="record(item,index)" @click.stop="record(item,index)">
            <div class="concent1" v-for="(lis,ind) in list" :key="ind">
              <ul>
                <li style="overflow:auto">
                  <span class="titleStyle textR" :class="lis['leftClass']" v-html="lis['field']"></span>
                  <span v-if="lis.render" v-html="lis.render(item,lis['name'])"></span>
                  <span v-else v-html="returnHtml(item[lis['name']])"></span>
                  <span v-if="ind === list.length - 1 && item.status == 2" class="right-item-span" @click="revoke(item)" @click.stop="revoke(item)">撤销</span>
                </li>
              </ul>
            </div>
            <div :class="item.img"></div>
          </div>
        </div>
      </van-list>
      <van-dialog use-slot title="申请记录" v-model="show" show-cancel-button :showConfirmButton="false" cancelButtonText="返回" style="width:90%;">
        <ul style="padding: 0.5rem;" class="ulLL">
          <li>
            <span class="gray">申请导师：</span>
            <span class="spanStyle">{{returLinst.teacherName}}</span>
          </li>
          <li>
            <span class="gray">轮转科室：</span>
            <span class="spanStyle">{{returLinst.departmentName}}</span>
          </li>
          <li>
            <span class="gray">轮转时间：</span>
            <span class="spanStyle">{{utils.formatDate(returLinst.cycleStartTime, "yyyy-MM-dd")}} ~ {{utils.formatDate(returLinst.cycleEndTime, "yyyy-MM-dd")}}</span>
          </li>
          <!-- <li>
            <span class="gray">是否接受调配：</span>
            <span class="spanStyle">{{utils.getValueByKey($store.state.trueOrFalse, returLinst.isDeploy)}}</span>
          </li> -->
          <li v-if="returLinst.status == 2">
            <p class="styleP p">申请中...</p>
            <p>导师申请中，请耐心等待......</p>
          </li>
          <li v-if="returLinst.status == 1">
            <p class="styleP1 p">申请成功...</p>
            <p>导师申请成功，请按时到科室报道...</p>
          </li>
          <!-- <li v-if="returLinst.status == 3">
            <p class="styleP2 backgr p">已调配...</p>
            <div v-for="(item,index) in returLinst.allotTimes" :key="index" class="backgr">
              <p>
                <span>分配老师：</span>
                <span>{{item.allotTeacherName}}</span>
              </p>
              <p>
                <span>带教时间：</span>
                <span>{{utils.formatDate(item.startTime, "yyyy-MM-dd")}} ~ {{utils.formatDate(item.endTime, "yyyy-MM-dd")}}</span>
              </p>
            </div>
            <p class="pading">非常遗憾，您申请的导师学员已满，我们为您分配了其他优秀导师，请按时到科室报道...</p>
          </li> -->
          <li v-if="returLinst.status == 4">
            <p class="styleP3 p">申请失败...</p>
            <p>非常遗憾，您申请的导师学员已满，请重新申请其他导师...</p>
          </li>
        </ul>
      </van-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "application",
  components: {},
  data() {
    return {
      loading: true,
      finished: false,
      error: false,
      finishedText: "没有更多了",
      dataList: {},
      dataObj: [],
      list: [
        {
          field: "申请时间：",
          name: "applyTime",
          leftClass: "gray"
        },
        {
          field: "申请带教：",
          name: "teacherName",
          leftClass: "gray"
        },
        {
          field: "轮转科室：",
          name: "departmentName",
          leftClass: "gray"
        },
        {
          field: "轮转时间：",
          name: "cycleStartTime",
          leftClass: "gray",
          render: (data, key) => {
            return (
              this.utils.formatDate(data.cycleStartTime, "yyyy-MM-dd") +
              "~" +
              this.utils.formatDate(data.cycleEndTime, "yyyy-MM-dd")
            );
          }
        }
      ],
      show: false,
      returLinst: ""
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    returnHtml(str) {
      return str || "----";
    },
    revoke(item){
        this.utils.ajax({
        url: this.api.updateByApplyState,
        method: "POST",
        data:{
            id:item.id,
            applyState:5
        },
        success: data => {
            this.dataList = [];
            this.teaching();
        }
      });
    },
    teaching() {
      let params = {
        currentPage: Math.ceil(this.dataObj.length /this.$store.state.pageSize) + 1,
        pageSize: this.$store.state.pageSize
      };
      this.utils.ajax({
        url: this.api.applyTeachingHistory,
        method: "POST",
        success: data => {
          data.content.forEach(item => {
            if (item.status == 1) {
              item.img = "img1";
              console.log(item.status,'55',item.img);
            }
            if (item.status == 2) {
              item.img = "img";
            }
            if (item.status == 3) {
              item.img = "img2";
            }
            if (item.status == 4) {
              item.img = "img3";
            }
            if (item.status == 5) {
              item.img = "img4";
            }
          });
          if (data.content.length) {
            const content = data.content;
            this.dataList = [...this.dataList, ...content];
          } else {
            this.finishedText = "暂无数据...";
          }
          this.loading = false; //结束当前加载
          if (params.currentPage >= data.totalPages) {
            //最后一页、加载完成
            this.finished = true;
          }
          //   this.dataList = data.data;
        }
      });
    },
    onLoad() {
      setTimeout(() => {
        this.teaching(false);
      }, 0);
    },
    record(item) {
      this.show = true;
      this.returLinst = item;
    }
  },
  created() {
    this.teaching();
  }
};
</script>
<style scoped>
p {
  margin: 0;
  padding: 0;
}
.img {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_03.svg") no-repeat;
  position: absolute;
  top: 15%;
  right: 3%;
  transform: rotate(20deg);
}
.img1 {
  width: 4rem;
  height: 4rem;
  background: url(data:image/svg+xml;base64,PHN2ZyBpZD0i5Zu+5bGCXzEiIGRhdGEtbmFtZT0i5Zu+5bGCIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDk2IDg0LjQ4Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzM2Y2M5Njt9LmNscy0ye2ZpbGw6IzE2YTU2ZTt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPnNxaWxQaWMwMTwvdGl0bGU+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNODIsMzkuMTFjMC0uMTYsMC0uMzMsMC0uNDlsMS0uMDljMCwuMTcsMCwuMzMsMCwuNVoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik04MS44MiwzNy41OGMtLjEzLTEtLjMxLTIuMDktLjU0LTMuMTFsMS0uMjJjLjIzLDEuMDUuNDIsMi4xMy41NiwzLjJabS0uNjYtMy42M3EtLjEyLS41MS0uMjYtMWwxLS4yNnEuMTQuNTIuMjcsMS4wNVoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik03OS45MywyOS45MmwtLjE5LS40OS45Mi0uMzcuMi41MVptLS41OS0xLjQ3Yy0uNDEtMS0uODgtMS45Mi0xLjM4LTIuODRsLjg3LS40N2MuNTIuOTUsMSwxLjkzLDEuNDIsMi45M1ptLTEuNjMtMy4zcS0uMjYtLjQ2LS41My0uOTFsLjg1LS41MXEuMjguNDYuNTUuOTRaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNzUuNDIsMjEuNjFsLS4yOS0uMzkuNzktLjYuMy40WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTMyLjU5LDQzLjc4VjUySDMwLjg3di0uNjdIMjcuNzh2My41NkgyNlY1MS4zNUgyM3YuNzRIMjEuMzZWNDMuNzhIMjZWNDEuOTFoMS43NHYxLjg3Wk0yMyw0NS4zN3YxLjQxaDNWNDUuMzdabTMsNC40VjQ4LjI5SDIzdjEuNDdabTEuNzQtNC40djEuNDFoMy4wOVY0NS4zN1ptMy4wOSw0LjRWNDguMjlIMjcuNzh2MS40N1oiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0zOC44OCw1MC42OGE3LjU0LDcuNTQsMCwwLDAsLjU0LDEuNDNjLTIuNTMsMi0zLDIuMzUtMy4yMSwyLjY5YTUuNTEsNS41MSwwLDAsMC0uODEtMS4zOSwxLjY4LDEuNjgsMCwwLDAsLjctMS4zMnYtNC4zSDM0LjRWNDYuMmgzLjI4djUuNFptLTEuNjctNS4zYTE3LjY5LDE3LjY5LDAsMCwwLTIuMTYtMi4yNGwxLjA2LTFhMTguMzcsMTguMzcsMCwwLDEsMi4yNCwyLjA5Wm0xMC4xMi45NXYxLjE4aC04LjZWNDYuMzNoMy40NHYtLjZIMzkuNTJWNDQuNjFoMi42NHYtLjU2aC0zVjQyLjg4aDN2LS45NWgxLjY0di45NWgzLjF2MS4xOGgtMy4xdi41NmgyLjY3djEuMTFINDMuODF2LjZabS0uOTUsN2MwLC43Mi0uMTQsMS4xMS0uNjUsMS4zNGE1LDUsMCwwLDEtMi4xMy4yNCw2LjExLDYuMTEsMCwwLDAtLjQ2LTEuNDFjLjU3LDAsMS4yNCwwLDEuNDIsMHMuMjUtLjA2LjI1LS4yMnYtLjRINDEuMnYySDM5LjY2VjQ4aDYuNzJaTTQxLjIsNDkuMjVWNTBoMy42di0uNzFabTMuNiwyLjU2VjUxSDQxLjJ2Ljc5WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTYwLjM5LDQ2Ljc3QTE2LjE3LDE2LjE3LDAsMCwxLDU4LDUxLjU0Yy40LDEsLjg1LDEuNTksMS4yOSwxLjU5cy41LS43LjU3LTIuNDRhNC40OSw0LjQ5LDAsMCwwLDEuNDEuOTNjLS4yNiwyLjU3LS44MiwzLjE5LTIuMTEsMy4xOS0xLDAtMS43NC0uNy0yLjM1LTEuODRhMTEuOCwxMS44LDAsMCwxLTIuMzUsMS44OSwxMC44MiwxMC44MiwwLDAsMC0xLjItMS4zNiwxMC42NCwxMC42NCwwLDAsMCwyLjg0LTIuMjUsMjguNzEsMjguNzEsMCwwLDEtMS01LjYxaC00djEuNDloMy40NHMwLC40MywwLC42M2MwLDIuOTItLjEzLDQuMTYtLjQ1LDQuNTZhMS4zLDEuMywwLDAsMS0xLC41NiwxMC43NywxMC43NywwLDAsMS0xLjYsMCwzLjc0LDMuNzQsMCwwLDAtLjQ2LTEuNTRjLjUsMCwxLC4wNiwxLjIuMDZhLjQ1LjQ1LDAsMCwwLC40Mi0uMTcsNy44Niw3Ljg2LDAsMCwwLC4yNC0yLjYySDUxLjFjLS4wNiwyLS4zNSw0Ljc1LTEuNDksNi40NEE3LjIzLDcuMjMsMCwwLDAsNDguMiw1NGMxLjA2LTEuNjcsMS4xNS00LjA5LDEuMTUtNS45VjQ0SDU1YzAtLjY4LS4wNi0xLjM2LS4wNi0yLjA2aDEuNzRjMCwuNywwLDEuMzgsMCwyLjA2aDIuMTNhMTcuMywxNy4zLDAsMCwwLTEuNzgtMS4yMWwxLTFhMTEuNjIsMTEuNjIsMCwwLDEsMi4yNywxLjQ5TDU5LjcsNDRoMS40NXYxLjY0aC00LjNhMzIuOTIsMzIuOTIsMCwwLDAsLjU2LDMuODEsMTQuMSwxNC4xLDAsMCwwLDEuMzQtMy4wOVoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik02Ny44OSw1MS4wNmMtMS44NC41NC0zLjg0LDEuMS01LjM3LDEuNTJsLS40LTEuNzFjLjU3LS4xMywxLjI3LS4yOCwyLS40N1Y0NUg2Mi4zMVY0My40M2g1LjIzVjQ1SDY1Ljc2djVsMS45Mi0uNVptNi45My02LjE4czAsLjU2LDAsLjc1Yy0uMTcsNS42NC0uMzIsNy42Ny0uODIsOC4zNGExLjU5LDEuNTksMCwwLDEtMS4yMi43NCwxMi44LDEyLjgsMCwwLDEtMiwwLDQsNCwwLDAsMC0uNS0xLjYzYy43Mi4wNiwxLjQxLjA2LDEuNzMuMDZhLjU4LjU4LDAsMCwwLC41NC0uMjRjLjM1LS4zOC41LTIuMTMuNjMtNi40N0g3MS4yOWMtLjI0LDMuNzItMSw2LjY1LTQuMDksOC40N0E1LjM0LDUuMzQsMCwwLDAsNjYsNTMuNmMyLjctMS41MywzLjQxLTQsMy41OS03LjE0SDY3Ljc0VjQ0Ljg4aDEuOTVjMC0uODUsMC0xLjc3LDAtMi43MWgxLjY4YzAsLjkzLDAsMS44NSwwLDIuNzFaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNi44OSwzOC44NmwtMS0uMDhhNDIuMjQsNDIuMjQsMCwwLDEsODQuMiwwbC0xLC4wOGE0MS4yNSw0MS4yNSwwLDAsMC04Mi4yMiwwWiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTEzLjg5LDM5LjExbC0xLS4wOGMwLS4xNywwLS4zMywwLS41bDEsLjA5QzEzLjkyLDM4Ljc5LDEzLjkxLDM4Ljk1LDEzLjg5LDM5LjExWiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTE0LjA1LDM3LjU4bC0xLS4xM2MuMTQtMS4wNy4zMi0yLjE1LjU2LTMuMmwxLC4yMkMxNC4zNywzNS40OSwxNC4xOSwzNi41NCwxNC4wNSwzNy41OFptLjY2LTMuNjMtMS0uMjNxLjEzLS41My4yNy0xLjA1bDEsLjI2UTE0Ljg0LDMzLjQ0LDE0LjcxLDMzLjk1WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTE1Ljk0LDI5LjkyLDE1LDI5LjU3bC4yLS41MS45Mi4zN1ptLjU5LTEuNDctLjkxLS4zOWMuNDMtMSwuOS0yLDEuNDItMi45M2wuODcuNDdDMTcuNDEsMjYuNTMsMTYuOTUsMjcuNDksMTYuNTMsMjguNDVabTEuNjMtMy4zLS44Ny0uNDlxLjI3LS40Ny41NS0uOTRsLjg1LjUxUTE4LjQzLDI0LjY5LDE4LjE3LDI1LjE1WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTIwLjQ2LDIxLjYxbC0uOC0uNTkuMy0uNC43OS42WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQ4LDg0LjQ4QTQyLjM3LDQyLjM3LDAsMCwxLDkuNTYsNTkuNzlsLjktLjQxYTQxLjI3LDQxLjI3LDAsMCwwLDc1LjA3LDBsLjkuNDFBNDIuMzcsNDIuMzcsMCwwLDEsNDgsODQuNDhaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNzkuODgsNTkuNThhMzYuMDgsMzYuMDgsMCwwLDEtNTAuNTEsMTQsMzUuODUsMzUuODUsMCwwLDEtMTMuMjQtMTRBMzcuMDgsMzcuMDgsMCwwLDAsMjkuNTYsNzMuMjZhMzYuMiwzNi4yLDAsMCwwLDE4LjQ0LDVBMzYuMzMsMzYuMzMsMCwwLDAsNTcuNTUsNzcsMzYuNTgsMzYuNTgsMCwwLDAsNzQsNjcuMzEsMzYuMzEsMzYuMzEsMCwwLDAsNzkuODgsNTkuNThaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjAuMzEsMzguNDRhMjYuOTMsMjYuOTMsMCwwLDEsMi40NC0xMCwyNy44OSwyNy44OSwwLDAsMSw1MC41LDAsMjYuOTMsMjYuOTMsMCwwLDEsMi40NCwxMGgtLjFhMjcuNzIsMjcuNzIsMCwwLDAtNTUuMTksMFoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik05Niw2MC4wN0gwTDUuMjEsNDkuMiwwLDM4LjMySDk2TDkwLjc5LDQ5LjJabS05NC40Mi0xSDk0LjQyTDg5LjY5LDQ5LjJsNC43My05Ljg4SDEuNThMNi4zMSw0OS4yWiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTU0LjM2LDM2LjQxbC0uMiwwTDQwLjc4LDMyLjZhLjc1Ljc1LDAsMCwxLS41NC0uNzksNy43LDcuNywwLDAsMSwuMjUtMS4zOGMuNzktMi44LDEuNzItMywzLjQyLTMuMjRhMTIuODEsMTIuODEsMCwwLDAsMS43MS0uMjksNi44Nyw2Ljg3LDAsMCwxLC43NS0uMTQsMS40MSwxLjQxLDAsMCwwLC43Mi0uMjEsMSwxLDAsMCwwLC4wOS0xLjM1LDQuNDksNC40OSwwLDAsMS0uNTQtNC41MUE0LjU1LDQuNTUsMCwwLDEsNTEuNTMsMThsLjA4LDAsLjk0LjI3LjA4LDBhNC41NSw0LjU1LDAsMCwxLDIuNzUsNC44Myw0LjQ5LDQuNDksMCwwLDEtMi44MiwzLjU2LDEsMSwwLDAsMC0uNjMsMS4yYy4wOC4yLjIxLjMxLjUuNTVBNi43NCw2Ljc0LDAsMCwxLDUzLDI5YTEyLjg4LDEyLjg4LDAsMCwwLDEuMywxLjE0YzEuMzUsMS4wNiwyLDEuNzUsMS4yMiw0LjU1QTcuNzEsNy43MSwwLDAsMSw1NSwzNiwuNzUuNzUsMCwwLDEsNTQuMzYsMzYuNDFaTTQxLjgxLDMxLjM0bDEyLjEyLDMuNDNjLjA2LS4xNi4xMi0uMzMuMTYtLjQ5LjU2LTIsLjM0LTIuMTUtLjcxLTNBMTQuMiwxNC4yLDAsMCwxLDUxLjk1LDMwYTUuNSw1LjUsMCwwLDAtLjQ1LS40LDIuNzcsMi43NywwLDAsMS0uOTUtMS4xN0EyLjQ2LDIuNDYsMCwwLDEsNTIsMjUuMzVhMywzLDAsMCwwLC4wOS01LjYxbC0uODYtLjI0QTMuMDUsMy4wNSwwLDAsMCw0OCwyMS4yOWEzLDMsMCwwLDAsLjM2LDNBMi40NiwyLjQ2LDAsMCwxLDQ4LDI3Ljc1YTIuNzcsMi43NywwLDAsMS0xLjQyLjUsNS41NCw1LjU0LDAsMCwwLS42LjExLDE0LjI0LDE0LjI0LDAsMCwxLTEuODkuMzJjLTEuMzMuMTUtMS42LjE5LTIuMTYsMi4xNkM0MS44OCwzMSw0MS44NCwzMS4xNyw0MS44MSwzMS4zNFoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00OS44NywzMi44OWEuNzQuNzQsMCwwLDEtLjIsMGwtOC0yLjI1YS43NS43NSwwLDAsMSwuNDEtMS40M2w4LDIuMjVhLjc1Ljc1LDAsMCwxLS4yLDEuNDZaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNTQuNzEsMzQuMjdhLjc0Ljc0LDAsMCwxLS4yLDBsLTMuNDYtMWEuNzUuNzUsMCwwLDEsLjQxLTEuNDNsMy40NiwxYS43NS43NSwwLDAsMS0uMiwxLjQ2WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQ4Ljk0LDcyLjZhLjUuNSwwLDAsMS0uMzEtLjExbC0zLjctMi45MmEuNS41LDAsMSwxLC42Mi0uNzhsMy4zNiwyLjY1LDcuNjYtNy42MWEuNS41LDAsMCwxLC43LjdsLTgsNy45MkEuNS41LDAsMCwxLDQ4Ljk0LDcyLjZaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMzguNDIsNzIuNmEuNS41LDAsMCwxLS4zMS0uMTFsLTEuNzktMS40MWEuNS41LDAsMSwxLC42Mi0uNzhsMS40NCwxLjE0LDMuNTQtMy41MmEuNS41LDAsMCwxLC43LjdsLTMuODUsMy44M0EuNS41LDAsMCwxLDM4LjQyLDcyLjZaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNTYuNyw3Mi42YS41LjUsMCwwLDEtLjMxLS4xMWwtMS43OS0xLjQxYS41LjUsMCwwLDEsLjYyLS43OGwxLjQ0LDEuMTQsMy41NC0zLjUyYS41LjUsMCwwLDEsLjcuN2wtMy44NSwzLjgzQS41LjUsMCwwLDEsNTYuNyw3Mi42WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTIzLjM0LDIwLjE2bC4xOS0uMjhhMS40MSwxLjQxLDAsMCwwLC43Mi4xOS42Ny42NywwLDAsMCwuNDktLjNsMC0uMDUsMC0uMDZhLjc5Ljc5LDAsMCwwLC4wNy0uNDguNzcuNzcsMCwwLDAtLjMyLS41bC0uMTMtLjFhLjQ3LjQ3LDAsMCwwLS40MiwwLDIuMjksMi4yOSwwLDAsMC0uNDYuMjNsLS4xLjA3LS4xMS4wN2EyLjcsMi43LDAsMCwxLS42OC4zLjkyLjkyLDAsMCwxLS43OS0uMThsMCwwLDAsMGgwbDAsMCwwLDBhLjc0Ljc0LDAsMCwxLS4yOS0uNjMsMS4yOCwxLjI4LDAsMCwxLC4yNC0uNjhoMGwwLS4wNSwwLDBhMS4zMiwxLjMyLDAsMCwxLC42NS0uNDEuODQuODQsMCwwLDEsLjc1LjE1bC0uMjUuMzFhLjU5LjU5LDAsMCwwLS41LS4xMS44OS44OSwwLDAsMC0uNDcuMjVsMCwwLDAsMGEuNjguNjgsMCwwLDAtLjEzLjQ0LjY2LjY2LDAsMCwwLC4yOC40OGwwLDAsMCwwLDAsMCwwLDBhLjYxLjYxLDAsMCwwLC42MS4xLDMuNzgsMy43OCwwLDAsMCwuNi0uMzJsMCwwLDAsMGEyLjg4LDIuODgsMCwwLDEsLjY1LS4zLjc2Ljc2LDAsMCwxLC43LjE3bDAsMGExLjExLDEuMTEsMCwwLDEsLjQ3Ljc5LDEuMjUsMS4yNSwwLDAsMS0uMTcuNzdsMCwwLDAsMGgwYTEuMTQsMS4xNCwwLDAsMS0xLjYyLjE5aDB2MGgwWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTIzLjM2LDE1LjQ4bDIuMTcsMS44OGExLjE5LDEuMTksMCwwLDAsLjYxLjMzLjY0LjY0LDAsMCwwLC41MS0uMjcuOC44LDAsMCwwLC4yMy0uNS44OC44OCwwLDAsMC0uMzUtLjZsLTIuMTEtMiwuMjgtLjI5LDIuMiwyLjE1YS45MS45MSwwLDAsMSwuMzUuNzgsMS4zNiwxLjM2LDAsMCwxLS4zNi43bC0uMDcuMDdhLjg5Ljg5LDAsMCwxLS42OC4zMywxLjM5LDEuMzksMCwwLDEtLjg2LS40TDIzLjEsMTUuOFoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0yOS40MiwxNC43NWExLjA2LDEuMDYsMCwwLDEtLjI1LjdsMCwwLDAsMGEuNzcuNzcsMCwwLDEtLjc1LjE3LDIuNDksMi40OSwwLDAsMS0uNzctLjM4LDQuMTUsNC4xNSwwLDAsMS0uNDEtLjM0bC0uMy0uMywwLDAsMC0uMDUtLjIzLS4yN2EzLjIxLDMuMjEsMCwwLDEtLjIzLS4zMUEyLjA4LDIuMDgsMCwwLDEsMjYsMTMuMmEuODguODgsMCwwLDEsLjM2LS44MiwxLjE2LDEuMTYsMCwwLDEsLjgzLS4zNSwxLjI4LDEuMjgsMCwwLDEsLjgzLjQ5bC0uMy4yNGExLjE2LDEuMTYsMCwwLDAtLjU3LS4zNS42Ni42NiwwLDAsMC0uNTkuMi42My42MywwLDAsMC0uMTEuODMsNS4xNyw1LjE3LDAsMCwwLC44MiwxLjFsLjIyLjIyLjI2LjI0YTIsMiwwLDAsMCwuNjIuMzUuNTguNTgsMCwwLDAsLjYxLS4xNC40OS40OSwwLDAsMCwuMTYtLjUxLDEuODIsMS44MiwwLDAsMC0uMjQtLjU5TDI4Ljc4LDE0bC0uMDktLjEyLjI3LS4yNEEyLDIsMCwwLDEsMjkuNDIsMTQuNzVaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMzEuODUsMTIuOTFhMSwxLDAsMCwxLS4zMi42NmwwLDAsMCwwYS43NS43NSwwLDAsMS0uNzUuMDgsMi41MiwyLjUyLDAsMCwxLS43Mi0uNDYsNC4yMiw0LjIyLDAsMCwxLS4zNy0uMzlsLS4yNy0uMzMsMC0uMDUsMC0uMDYtLjItLjI5YTMuMjcsMy4yNywwLDAsMS0uMi0uMzMsMi4xLDIuMSwwLDAsMS0uMjUtLjgyLjg2Ljg2LDAsMCwxLC40My0uNzcsMS4xNCwxLjE0LDAsMCwxLC44NS0uMjYsMS4yOSwxLjI5LDAsMCwxLC43Ny41OGwtLjMyLjJhMS4xOCwxLjE4LDAsMCwwLS41My0uNDEuNjUuNjUsMCwwLDAtLjYuMTMuNjIuNjIsMCwwLDAtLjE5LjgxLDUuMjYsNS4yNiwwLDAsMCwuNywxLjE4bC4xOS4yNC4yMy4yNmEyLDIsMCwwLDAsLjU4LjQxLjU3LjU3LDAsMCwwLC42MS0uMDcuNDguNDgsMCwwLDAsLjIxLS40OCwxLjg0LDEuODQsMCwwLDAtLjE4LS42MWwtLjA4LS4xM0wzMS4yMSwxMmwuMjktLjJBMiwyLDAsMCwxLDMxLjg1LDEyLjkxWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTMyLjU1LDguMDhsLjE4LjMzYy0uNTEuMjctLjc2LjQyLTEuMjYuNzJsLjY3LDEuMTJjLjQyLS4yNS42NC0uMzgsMS4wNy0uNjFsLjE4LjMzYy0uNDIuMjMtLjY0LjM1LTEuMDUuNmwuODEsMS4zNGMuNDUtLjI3LjY3LS40LDEuMTMtLjY0bC4xOC4zM2MtLjU4LjMxLS44Ny40OC0xLjQzLjgzTDMwLjkxLDlDMzEuNTYsOC42MywzMS44OCw4LjQ0LDMyLjU1LDguMDhaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMzQuNDQsMTAuMjhsLjI4LS4xNGExLjUsMS41LDAsMCwwLC41My41Mi41OS41OSwwLDAsMCwuNTQsMGwuMDUsMCwwLDBhLjcuNywwLDAsMCwuMjYtLjM3LjgxLjgxLDAsMCwwLS4wNi0uNTlMMzYsOS40OGEuNDguNDgsMCwwLDAtLjMzLS4yNSwyLjA3LDIuMDcsMCwwLDAtLjQ5LDBIMzVhMi40MSwyLjQxLDAsMCwxLS43LS4wOCwxLDEsMCwwLDEtLjU5LS41NWwwLDB2MGgwbDAsMCwwLDBhLjc2Ljc2LDAsMCwxLDAtLjY4LDEuMSwxLjEsMCwwLDEsLjQ4LS40NmgwbC4wNSwwLC4wNiwwYTEuMTcsMS4xNywwLDAsMSwuNzIsMCwuODcuODcsMCwwLDEsLjU2LjVsLS4zNC4xNGEuNjEuNjEsMCwwLDAtLjM3LS4zNC44LjgsMCwwLDAtLjUsMGwwLDAsMCwwYS41OS41OSwwLDAsMC0uMjkuMzEuNjkuNjksMCwwLDAsMCwuNTV2LjExYS42NC42NCwwLDAsMCwuNDcuMzksMy4yOSwzLjI5LDAsMCwwLC42MywwaC4wOGEyLjYzLDIuNjMsMCwwLDEsLjY3LjA2Ljc5Ljc5LDAsMCwxLC41Mi40OXYwYTEuMTYsMS4xNiwwLDAsMSwuMDYuOTEsMS4xLDEuMSwwLDAsMS0uNDcuNTdsMCwwLDAsMGgwYTEsMSwwLDAsMS0uNzQsMCwxLjIyLDEuMjIsMCwwLDEtLjY5LS42N2gwYTAsMCwwLDAsMSwwLDBoMFoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0zNi45MSw5LjE1LDM3LjIsOWExLjUxLDEuNTEsMCwwLDAsLjQ4LjU3LjU4LjU4LDAsMCwwLC41MywwbC4wNSwwLC4wNSwwYS43LjcsMCwwLDAsLjI5LS4zNS44MS44MSwwLDAsMCwwLS41OWwtLjA1LS4xNmEuNDguNDgsMCwwLDAtLjMxLS4yOCwyLjA1LDIuMDUsMCwwLDAtLjQ4LS4wOGgtLjIzQTIuNCwyLjQsMCwwLDEsMzYuODMsOGExLDEsMCwwLDEtLjUzLS42VjcuMjloMGEwLDAsMCwwLDEsMCwwVjcuMTlhLjc2Ljc2LDAsMCwxLC4wOC0uNjcsMS4wOCwxLjA4LDAsMCwxLC41Mi0uNDFoMGwuMDUsMEgzN2ExLjE2LDEuMTYsMCwwLDEsLjcxLDAsLjg3Ljg3LDAsMCwxLC41Mi41NWwtLjM1LjExYS42Mi42MiwwLDAsMC0uMzQtLjM3QS43OS43OSwwLDAsMCwzNyw2LjMzaDBsMCwwYS41OC41OCwwLDAsMC0uMzEuMjguNjkuNjksMCwwLDAsMCwuNTV2LjExYS42NC42NCwwLDAsMCwuNDMuNDMsMy4yNiwzLjI2LDAsMCwwLC42Mi4wOWguMDhhMi42NSwyLjY1LDAsMCwxLC42Ni4xMy43OS43OSwwLDAsMSwuNDcuNTR2MGExLjE2LDEuMTYsMCwwLDEsMCwuOTEsMS4wOSwxLjA5LDAsMCwxLS41MS41MmgtLjA5YTEsMSwwLDAsMS0uNzMsMCwxLjIzLDEuMjMsMCwwLDEtLjYzLS43M2gwYS4wNS4wNSwwLDAsMSwwLDBoMFoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0zOC43NSw1LjUxYy43My0uMjIsMS4wOS0uMzEsMS44My0uNDlsLjA4LjMzYy0uNTcuMTMtLjg1LjIxLTEuNDEuMzdsLjM5LDEuMzRjLjQ5LS4xNC43NC0uMjEsMS4yNC0uMzNsLjA4LjMzYy0uNDkuMTItLjc0LjE4LTEuMjMuMzJsLjU0LDEuODYtLjM1LjFaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNDEuODEsNC43NWwuNTYsMi44MWExLjI3LDEuMjcsMCwwLDAsLjI3LjY0LjU3LjU3LDAsMCwwLC41My4xMS43MS43MSwwLDAsMCwuNDUtLjI1LjkyLjkyLDAsMCwwLC4wOC0uNjlMNDMuMjYsNC41bC4zNy0uMDUuNDMsM2EuOTMuOTMsMCwwLDEtLjE4LjgzLDEuMTksMS4xOSwwLDAsMS0uNjYuMzNsLS4wOSwwYS43OS43OSwwLDAsMS0uNjgtLjE3QTEuNDgsMS40OCwwLDAsMSw0Miw3LjY0bC0uNi0yLjgxWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTQ0LjcsNC4zMWwuMzcsMCwuMzYsMy42NWMuNTItLjA1Ljc4LS4wNywxLjMtLjFsMCwuMzRjLS42NSwwLTEsLjA2LTEuNjEuMTNaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNTEuNTksNC4yOGMuMjcsMS42My4zOCwyLjQ1LjU0LDQuMDlsLS4zMywwYzAtLjUxLS4wNi0uNzctLjExLTEuMjhsLTEuMDgtLjFjLS4xNi40OS0uMjQuNzQtLjM5LDEuMjNsLS4zMiwwYy40Ny0xLjU4LjczLTIuMzYsMS4zLTMuOTJabS0uODcsMi4zMy45My4wOWMtLjExLS44My0uMTgtMS4yNC0uMzItMi4wNkM1MS4wOCw1LjQzLDUxLDUuODIsNTAuNzMsNi42MVoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik01NC4zMyw0LjY3YTEuMTUsMS4xNSwwLDAsMSwuODMuNDksMSwxLDAsMCwxLC4xMi43NFY2bDAsMGExLjMsMS4zLDAsMCwxLS41LjY1LDEuMDksMS4wOSwwLDAsMS0uODcuMTdsLS40Ni0uMDgtLjMsMS43OC0uMzMtLjA1LjYyLTRaTTUzLjQ3LDYuNGwuNTUuMWEuNjcuNjcsMCwwLDAsLjU4LS4xMi45LjksMCwwLDAsLjMxLS40NnYtLjFhLjgzLjgzLDAsMCwwLS4xLS41MkEuNjYuNjYsMCwwLDAsNTQuMzUsNWwtLjYyLS4xMloiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik01Ny4xOSw1LjMyYTEuMTUsMS4xNSwwLDAsMSwuNzguNTYsMSwxLDAsMCwxLC4wNi43NWwwLC4wNiwwLDBhMS4zLDEuMywwLDAsMS0uNTUuNiwxLjEsMS4xLDAsMCwxLS44OS4wOWwtLjQ2LS4xMkw1NS42NCw5LDU1LjMyLDlsMS0zLjg4Wk01Ni4xOCw3bC41NS4xNWEuNjguNjgsMCwwLDAsLjYtLjA3LjkuOSwwLDAsMCwuMzUtLjQzVjYuNTNBLjgzLjgzLDAsMCwwLDU3LjY1LDZhLjY2LjY2LDAsMCwwLS40Ni0uMzdsLS42MS0uMTdaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNTkuMDcsNS45MWwuMzUuMTJMNTguMTksOS40OGMuNS4xOC43NC4yNywxLjIzLjQ3bC0uMTMuMzFjLS42MS0uMjUtLjkxLS4zNi0xLjUzLS41N1oiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik02Miw3LjA2bC0xLjY2LDMuNjRMNjAsMTAuNTdsMS42Mi0zLjY2WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTYyLjg1LDExLjcyYTEsMSwwLDAsMS0uNzMsMGwtLjA1LDAtLjA1LDBhLjc0Ljc0LDAsMCwxLS4zOS0uNjQsMi41MywyLjUzLDAsMCwxLC4xMS0uODUsNC4zNiw0LjM2LDAsMCwxLC4xOS0uNWwuMTgtLjM5LDAtLjA2LDAtLjA2LjE3LS4zYTMuMTksMy4xOSwwLDAsMSwuMjEtLjMyQTIuMTQsMi4xNCwwLDAsMSw2My4xNyw4LC44My44MywwLDAsMSw2NCw4YTEuMTIsMS4xMiwwLDAsMSwuNTkuNjUsMS4zLDEuMywwLDAsMS0uMTguOTRsLS4zMi0uMTlhMS4yMSwxLjIxLDAsMCwwLC4xNC0uNjYuNjMuNjMsMCwwLDAtLjM3LS40Ny42MS42MSwwLDAsMC0uOC4xOSw1LjM5LDUuMzksMCwwLDAtLjc1LDEuMTVsLS4xNC4yOGMwLC4xMS0uMDkuMjEtLjEzLjMzYTIuMDUsMi4wNSwwLDAsMC0uMTIuNy41Ni41NiwwLDAsMCwuMzIuNTIuNDguNDgsMCwwLDAsLjUyLDAsMS44NiwxLjg2LDAsMCwwLC40Ni0uNDNsLjA5LS4xMy4wOC0uMTMuMzEuMTdBMiwyLDAsMCwxLDYyLjg1LDExLjcyWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTY2Ljk0LDkuODVjLS41MywxLjU3LS44MywyLjM1LTEuNDYsMy44OGwtLjI4LS4yYy4yMS0uNDcuMzEtLjcxLjUxLTEuMTgtLjM3LS4yNi0uNTUtLjM4LS45My0uNjNsLS45NC44OS0uMjgtLjE4YzEuMTctMS4xNiwxLjc4LTEuNzIsMy0yLjhaTTY1LDExLjQ3bC44LjU0Yy4yOS0uNzguNDMtMS4xOC43LTJDNjUuOTMsMTAuNiw2NS42MywxMC44OSw2NSwxMS40N1oiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik03MCwxMi4xOWwtLjI1LjI5TDY5LDExLjg2bC0yLjMsMi44LS4yNy0uMjIsMi4yNi0yLjgzTDY3Ljk0LDExbC4yMy0uM0M2OC45LDExLjI5LDY5LjI2LDExLjU4LDcwLDEyLjE5WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTcwLjkzLDEzLjA3LDY4LjE4LDE2bC0uMjYtLjI0LDIuNzEtMi45NVoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik03Mi42MiwxNC43MmExLjA2LDEuMDYsMCwwLDEsLjI0LDEuMTUsMy41NywzLjU3LDAsMCwxLTEsMS4xM2wtLjI5LjI0LS4zMy4yNWEyLjM5LDIuMzksMCwwLDEtLjg4LjM2LjkuOSwwLDAsMS0uODYtLjM1LjgyLjgyLDAsMCwxLS4yMy0uODcsMi43LDIuNywwLDAsMSwuNDgtLjg1bC4yOC0uMy4yNi0uMjYsMCwwLDAtLjA1LjA1LS4wNi4wNi0uMDYuMjEtLjJMNzEsMTQuNmExLjYzLDEuNjMsMCwwLDEsLjc1LS4yNywxLjA3LDEuMDcsMCwwLDEsLjg2LjRabS0uMjIuMjFhLjY5LjY5LDAsMCwwLS44Ny0uMTksNCw0LDAsMCwwLTEsLjc0bC0uMjMuMjQtLjI0LjI4YTIuNDgsMi40OCwwLDAsMC0uMzkuNjcuNjEuNjEsMCwwLDAsLjEuNjR2MGEuNTcuNTcsMCwwLDAsLjYyLjIsMi4yMSwyLjIxLDAsMCwwLC42OC0uMzFsLjI1LS4xOS4yMi0uMTkuMjMtLjIuMjItLjIxYTIuOTIsMi45MiwwLDAsMCwuMjQtLjI2LDEuNjYsMS42NiwwLDAsMCwuMzEtLjU5LjczLjczLDAsMCwwLS4xNi0uNjZaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNzQuMTEsMTYuNTVsLjMxLjRjLS4zNy43Ni0uNTcsMS4xMy0xLDEuODctLjM1LjU1LS41Mi44My0uODksMS4zN2wyLjgtMiwuMjQuMzUtMy4zMSwyLjI1LS4yMy0uMzRhMzYuODgsMzYuODgsMCwwLDAsMS44OC0zLjI4bC0yLjczLDIuMTJMNzEsMTlaIi8+PC9zdmc+
) no-repeat;
  background-size:100%; 
  position: absolute;
  top: 15%;
  right: 3%;
  transform: rotate(20deg);
}
.img2 {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/sqilPic02.svg") no-repeat;
  position: absolute;
  top: 15%;
  right: 3%;
  transform: rotate(20deg);
}
.img3 {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/sqilPic03.svg") no-repeat;
  position: absolute;
  top: 15%;
  right: 3%;
  transform: rotate(20deg);
}
.img4 {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/sqilPic04.svg") no-repeat;
  position: absolute;
  top: 15%;
  right: 3%;
  transform: rotate(20deg);
}
.right-item-span{
    color: blue;
    float: right;
    border-radius: 12%;
    padding: .2rem;
}
.concent {
  background: white;
  border-bottom: 1px solid #ccc;
  position: relative;
}
.concent1 {
  width: 92%;
  padding: 0.5rem 0;
  margin: 0 auto;
}
.ulLL li {
  padding: 0.3rem 0;
  font-size: 0.9rem;
}
.styleP {
  font-size: 1.5rem;
  color: #5da4ee;
  padding: 0.3rem 0;
}
.styleP1 {
  font-size: 1.5rem;
  color: #18a56f;
  padding: 0.3rem 0;
}
.styleP2 {
  font-size: 1.5rem;
  padding: 0.3rem 0;
}
.styleP3 {
  font-size: 1.5rem;
  color: #9d1612;
  padding: 0.3rem 0;
}
.backgr {
  color: #de7c2e;
}
.spanStyle {
  font-size: 0.9rem;
}
.pading {
  padding: 0.5rem 0;
}
</style>