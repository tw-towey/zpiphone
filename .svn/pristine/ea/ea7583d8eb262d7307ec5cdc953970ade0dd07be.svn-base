<template>
  <div class="manualAuditCont">
    <div class="auditTime">
      <van-cell :title="title" is-link :value="startTimeShow" @click="timeSelected"/>
    </div>
    <van-list
      v-model="loading"
      :finished="finished"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      finished-text="没有更多了"
      :offset="50"
      @load="onLoad"
    >
        <div class = "manualAuditList">
           <ul>
             <li v-for="(manualAuditItem,index) in manualAuditList" :class="{'active': manualAuditItem.selected}"  @click="manualAuditClick(manualAuditItem)">
                <div class = "item">
                     <span class="title">学员 :</span><span class="text">{{manualAuditItem.studentName}}</span>
                </div>

                <div class = "item" v-if="tab == 0">
                     <span class="title">专业 :</span><span class="text">{{manualAuditItem.traineeMajorCodeText}}</span>
                </div>

                <div class = "item" v-if="tab == 0">
                     <span class="title">轮转科室 :</span><span class="text">{{manualAuditItem.departmentName}}</span>
                </div>

                <div class = "item">
                     <span class="title">手册类型 :</span><span class="text">{{manualAuditItem.twoLevelTypeText}}</span>
                </div>

                <div class = "item" v-if="tab == 1">
                     <span class="title">审核人 :</span><span class="text">{{manualAuditItem.auditHumanName}}</span>
                </div>
                <div class = "item" v-if="tab == 1">
                    <span class="title">审核状态 :</span>
                    <span class="text" :class="{'green':manualAuditItem.auditFlag == 1,'red':manualAuditItem.auditFlag == 2,'blue':manualAuditItem.auditFlag == 0||manualAuditItem.auditFlag==3 }">{{manualAuditItem.auditFlagText}}</span>
                </div>

                <div class = "item last" >
                  <div v-if="tab==0">
                      <span class="title">提交时间 :</span><span class="text">{{manualAuditItem.createDateText}}</span>
                  </div>
                  <div v-if="tab==1">
                      <span class="title">审核时间 :</span><span class="text">{{manualAuditItem.auditDateText}}</span>
                  </div>
                  <div class="button-box">
                      <span class="a" @click="viewManualDetail($event, manualAuditItem )">查看</span>
                  </div>
                </div>
             </li>
           </ul>
        </div>
    </van-list>
      <PassAndNoPass v-if="tab==0" :class="tab == 0 ? 'mt' : ''"   @auditHandle="manualAudit" :error="errorTip" :list="manualAuditList" ></PassAndNoPass>
      <van-popup v-model="timeShow" position="bottom">
          <van-datetime-picker
            v-model="currentDate"
            type="year-month"
            @confirm="conformDate"
            @cancel="cancleDate"
            :formatter = "formatter"
          />
      </van-popup>
  </div>

</template>

<script>
import PassAndNoPass from "@/components/PassAndNoPass";
export default {
  name: "ManualAuditList",
  components: {
    "PassAndNoPass": PassAndNoPass
  },
  data() {

    var startTime = this.utils.formatDate(new Date().getTime(), "yyyy-MM");
    var startTimeShow = this.utils.formatDate(new Date().getTime(), "yyyy-MM").replace(/-/g,"/");
    //var startDate = this.utils.formatDate(new Date().getTime(), "yyyy-MM-dd");
    return {
      errorTip: "请选择待审核的登记手册",
      loading: false,
      finished: false,
      error: false,
      title: "审核时间",
      currentPage: 1,
      startTime: startTime,
      startTimeShow: startTimeShow,
      //startDate: startDate,
      currentDate: new Date(this.$store.state.timestamp.replace(/-/g,"/")),
      timeShow: false,
      //auditShow: false, // 审核弹出框
      auditNote: "", // 审核意见
      manualAuditList: [],
      currentIndex: this.tab,
      tabPageFlag : this.tabFlg
    };
  },
  methods: {
    onLoad() {
      //console.log('onload-->--');
      //console.log('this.tabPageFlag-->',this.tabPageFlag);
      // if(this.tabPageFlag) {
      //    this.currentPage = 1;
      //    this.tabPageFlag = false;
      // }
      this.getData();
    },
    getData(value) {  //value 代表当前页。
      var _this = this;
      this.currentPage = Math.ceil(this.manualAuditList.length /  this.$store.state.pageSize);
      this.currentPage = this.currentPage + 1;
      if( value ) {
         this.currentPage = 1 ;
      }
      var params = {
        currentPage: value || this.currentPage,
        pageSize: this.$store.state.pageSize,
      };

      if( this.currentIndex == 0 ) {
        params.auditFlags = ['0'];
      } else if( this.currentIndex == 1) {
        params.auditFlags = ['1','2'];
      }
      params.auditDate = this.startTime;
      this.utils.ajax({
        url: this.api.pagingEnrollmentAuditList,
        data: params,
        method: "POST",
        success: data => {

          _this.manualAuditList = params.currentPage ==1 ?_this.transformData(data.content): _this.manualAuditList.concat(_this.transformData(data.content));
          //console.log('_this.manualAuditList',_this.manualAuditList);

          // _this.manualAuditList.forEach((ele,index)=>{
          //     if(ele.filesVOs.length) {
          //          console.log('index--->---', index);
          //     }
          // });
          _this.totalElements = data.totalElements;
          _this.totalPages = data.totalPages;
          // 加载状态结束
          _this.loading = false;
          if(params.currentPage >= _this.totalPages) {
            _this.finished = true;
          }else {
            _this.finished = false;
          }
        }
      },true);
    },
    transformData(dataResult) {
      dataResult.forEach( element => {
          element.selected = false;
          //手册类型
          element.twoLevelTypeText = this.utils.getValueByKey(this.$store.state.twoLevelType, element.twoLevelType);
          //专业
          element.traineeMajorCodeText = this.utils.getValueByKey(this.$store.state.majors, element.traineeMajorCode);
          //提交时间
          element.createDateText = element.createDate? this.utils.formatDate(element.createDate).replace(/-/g,"/"):'';
          //审核时间
          element.auditDateText = element.auditDate? this.utils.formatDate(element.auditDate).replace(/-/g,"/"):'';
          //审核状态
          element.auditFlagText = this.utils.getValueByKey(this.$store.state.auditStatus, element.auditFlag)||'';
      });
      return dataResult;
    },
    formatter(type, value) {
      return this.utils.pickerType(type, value);
    },
    getParams() {
      var checkedList = this.checkedList();
      var params = {};
      var ids = [];
      var url = "";
      checkedList.forEach(( ele, index )=>{
        //console.log('--ele-->',ele);
        //console.log('--index--',index);
        ids.push( ele.id );
      });
      params.ids = ids;
      if( this.btnType == 1 ) { // 审核通过 按钮
          params.auditNote = "";
      } else if (this.btnType == 0 ) { // 审核不通过
          params.auditNote = this.auditNote;
      }
      return params;
    },
    auditAjax() {
      var _this = this;
      var url = '';
      if( this.btnType == 0) {
          url = this.api.manualReject;
      }else if( this.btnType == 1 ) {
          url = this.api.manualApproval;
      }
      var params = this.getParams(this.btnType);
      this.utils.ajax({
          url:  url,
          data: params,
          method: "POST",
          success: data => {
             setTimeout(() => {
                _this.Toast('审核成功');
             }, 100);
             _this.getData(1);
          },
          error: error => {
             console.log('error-->--',error);
             _this.Toast(error.error);
          }
        },true);
    },
    //获取选中的数据
    checkedList() {
      var checkedList = this.manualAuditList.filter( (ele) => {
          return ele.selected == true;
      });
      //console.log('checkedList--->--', checkedList);
      return checkedList;
    },
    manualAudit(auditObj) {
      //console.log('auditObj--->--',auditObj);
      var type = auditObj.type;
      if(type == 'pass') {
        this.btnType = 1;
        var checkedList = this.checkedList();
        if(checkedList.length == 0) {
          this.Toast(this.error);
          return;
        }
      } else if( type == 'unPass' ) {
        this.btnType = 0;
      }
      this.auditNote = auditObj.data||'';
      this.auditAjax();
    },
    timeSelected() {
      this.timeShow = true;

    },
    conformDate(value) {
      this.startTime = this.utils.formatDate(value.getTime(),'yyyy-MM');
      //this.startDate = this.utils.formatDate(value.getTime(),'yyyy-MM-dd');
      this.startTimeShow = this.startTime.replace(/-/g, "/");
      console.log("xxxxxx")
      this.getData(1);
      this.cancleDate();
    },
    cancleDate() {
      //alert('时间取消');
      this.timeShow = false;
    },
    manualAuditClick(item) {
      if(this.tab == 0 ) {
        item.selected = !item.selected;
      }
    },

    viewManualDetail(e, item) {
      e.stopPropagation();
      this.manualAuditList.forEach(i => {
        i.selected = false;
      });
      item.selected = true;
      this.$router.push({ name: "ManualAuditDetail", params: { oneLevelType: item.oneLevelType, twoLevelType:item.twoLevelType,tab: this.tab, item: item } });
      //this.$store.state.EditRegisterNum = item.twoLevelType+'';
      //this.$router.push({ name: "EditRegister",params: { id: item.id}});
    }
  },
  created() {
    if (this.tab) {
      this.title = "审核时间";
    } else {
      this.title = "提交时间";
    }
  },
  props: ["tab","tabFlg"]
};
</script>

<style scoped>
/* .manualAuditCont {
  margin-bottom: 1.6rem;
} */
.manualAuditList {
  background: #fff;
}

.auditTime {
  border-bottom: 1px solid #ddd;
  padding-left: 0.3rem;
  background: #fff;
}
.auditBox {
  margin: 0 0.8rem;
}
.manualAuditList li {
  padding: 0.9375rem;
  position: relative;
  border-bottom: 1px solid #ddd;
}

.manualAuditList li.active {
  background: #eef9ff;
}

.manualAuditList li.active:before {
  content: "";
  width: 0;
  height: 0;
  border-width: 1.8rem 1.8rem 0 0;
  border-style: solid;
  border-color: #62afff transparent transparent transparent;
  position: absolute;
  top: 0;
  left: 0;
}

.manualAuditList li .item {
  line-height: 2rem;
}

.manualAuditList li .item .title {
  display: inline-block;
  width: 4.375rem;
  text-align: right;
  margin-right: 5px;
  color: #969799;
}

.manualAuditList li .item.last {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;
}
.button-box {
  text-align: center;
}
.mt {
   margin-top: 2rem;
}
</style>

