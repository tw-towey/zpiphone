<template>
  <div>
    <van-nav-bar :title="title" class="header" fixed left-arrow @click-left="onClickLeft" />
    <div class="examBox">
      <div style="margin-top:2.5rem;">
        <van-list v-if="listData.length" v-model="loading" :finished="finished" :error.sync="error" error-text="请求失败，点击重新加载" :finished-text="finishedText"  :offset="50" @load="onLoad()">
          <div class="infoList" v-for="(item,index) in listData" :key="index">
            <div class="infoTile"> 
            <span style="
            width:60%; 
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;">{{item.assessName}} </span> <span v-if="item.assessTotalPoint">{{item.assessTotalPoint}}分</span>  </div> 
            <!-- <span v-if="item.assessStatus == 2" class="exambkspan">补考</span>  -->
            <ul class="infoListUl" @click="goRouterLink(item)">
              <li>
                <label class="wrem4now">考核类型：</label>
                <span class="wrem5now">{{item.assessTypeStandard == 1 ? "出科考-技能" : "出科考-理论" }} </span>
              </li>
              <li>
                <label class="wrem4now">考核项：</label>
                <span class="wrem5now">{{item.assessItemValue}}</span>
              </li>
              <li>
                <label for="">参考学员：</label>
                <span>{{item.assessHumanStudentCount}}</span>
              </li>
              <li>
                <label class="wrem4now">考核地点：</label>
                <span class="wrem5now">{{item.assessAddress}}</span>
              </li>
              <li style="width:100%">
                <label for="">考核时间：</label>
                <span>{{getTimeData(item.assessStartTime,item.assessEndTime)}}</span>
              </li>
              <li style="width:100%">
                <label for="">考官：</label>
                <span>
                  <span v-for="(kaoguan,index) in item.assessHumanTeacherList" :key="index">{{kaoguan.humanName}} {{index !== item.assessHumanTeacherList.length-1 ? ".":""}} </span>
                </span>
              </li>
            </ul>
            <div class="leftImg">
              <img v-if="item.assessStatus == 1" src="../../assets/images/page/img_03.png" alt="" >
              <img v-if="item.assessStatus == 2" src="../../assets/images/page/img_02.png" alt="" >
              <img v-if="item.assessStatus == 3" src="../../assets/images/page/img_01.png" alt="" >
            </div>
          </div>
        </van-list>
      </div>
        <div v-if="errorbox" class="tip-empty">
            <span class="icon-emptyface"></span>
            <span class="text-empty">没有相关信息</span>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ExamStudentList",
  components: {},
  data() {
    return {
      title:"",
      userInfocode: "",
      listData: [],
      errorbox:false,
      loading: true,
      finished: false,
      error: false,
      finishedText: "没有更多了",
      assessOpt: [], //考核项list
      assessStatus: "" //考核状态 1:待考核 2:考核中 3:考核结束 4:待补考 5:补考中 6:补考结束
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },

    getTimeData(start, end) {
      if(start && end){
          return (
            this.utils.formatDate(new Date(start.replace(/-/g, "/")).getTime(), "yyyy-MM-dd HH:mm") +
            "-" +
            this.utils.formatDate(new Date(end.replace(/-/g, "/")).getTime(), "HH:mm")
        );
      }
    },

    goRouterLink(item) {
      this.$store.state.AssessParams = item;
      if (this.userInfocode === "student") {
        this.$router.push({
          name: "Takeexam"
        });
      } else {
        this.$router.push({
          name: "ExamDetail"
        });
      }
    },
    onLoad() {
      setTimeout(()=>{
        this.getListData();
      },200)
    },
    getListData() {
      let param = {
        currentPage:
          Math.ceil(this.listData.length / this.$store.state.pageSize) + 1,
        pageSize: this.$store.state.pageSize,
      };
      this.utils.ajax({
        url: this.api.findAssessList,
        data: param,
        method: "POST",
        success: data => {
          console.log(data);
          if(data.content.length === 0){
            this.errorbox = true;
            this.finishedText = "暂无数据...";
            return;
          }else{
            // this.errorbox = false;
            this.errorbox = false;
            this.listData = [...this.listData, ...data.content];
          } 
          this.loading = false; //结束当前加载
          // debugger
          if (param.currentPage >= data.totalPages) {
            //最后一页、加载完成
            this.finished = true;
          }
        }
      });
    }
  },
  mounted() {
    this.userInfocode = this.$store.state.userInfo.currentRole.code;
    if(this.userInfocode === "student"){
      this.title = "技能考核";
    }else{
      this.title = "考务管理";
    }
    setTimeout(() => {
      this.getListData();
    }, 100);
    // this.getListData();
  },
  created() {}
};
</script>
<style scoped>
.examBox {
  overflow: auto;
  height: 100%;
}
.examBox .infoTile {
  color: #333333;
  font-size: 16px;
  display: flex;
  line-height: 2rem;
}
.examBox .infoTile > span{
  flex-grow: 1;
}
.infoList {
  padding: 0.5rem;
  background: #fff;
  position: relative;
  margin-bottom: 8px;
}
.infoList .infoListUl {
  overflow: auto;
  margin-bottom: 10px;
  background: #ffffff;
}
.infoList .infoListUl span{
  width: 2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.infoList .infoListUl .wrem6now{
  width: 60%;
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
  vertical-align: text-bottom;
  text-overflow: ellipsis;
}
.infoList .infoListUl .wrem4now {
  min-width: 4.5rem;
  width: 40%;
}
.infoList .infoListUl label {
  display: inline-block;
  text-align: right;
  min-width: 4.5rem;
}
.infoList .infoListUl li {
  width: 50%;
  float: left;
  white-space: nowrap;
  color: #8d8d8d;
  font-size: 14px;
}
.van-picker {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 16rem;
  z-index: 10;
}
.enterke::before {
  content: "*";
  position: absolute;
  left: 0.4375rem;
  font-size: 0.875rem;
  color: #f44;
}
.examBox .leftImg{
  position:absolute;
  right: 0;
  top: 5px;
}
.examBox .leftImg img{
  width: 3.5rem;
  height: 3.5rem;
}
.examBox .exambkspan{
  border:1px solid #007acc;
  border-radius: 20px;
  color:  #007acc;
  margin-left: 10px;
  padding: 0 .6rem;
}
</style>
