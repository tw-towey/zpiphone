
<template>
  <div class>
    <van-nav-bar title="签到审核" class="header" fixed left-arrow @click-left="onClickLeft"/>
    <div class="layout_content">
      <van-tabs
        v-model="active"
        swipeable sticky :offset-top="40"
        title-active-color="#1a7fe9"
        color="#5fa4ec"
        :line-height="2"
        @click="change"
        @change="change"
      >
        <div v-for="(item,index) in tabs">
            <van-tab :title="item.title"  >
              <van-list
                   v-model="item.loading"
                  :finished="item.finished"
                  :error.sync="item.error"
                  error-text="请求失败，点击重新加载"
                  :finished-text="item.finishedText"
                  :offset="50"
                  @load="onLoad()"
                >
                  <div v-if="index == 1" class="audited">
                      <van-cell title="审核日期" is-link :value="dateTimeShow" @click="dateClick()"/>
                  </div>
                  <div v-if="index == 2" class="audited">
                    <van-cell title="值班日期" is-link :value="dateTime1" @click="showTimer()"/>
                  </div>
                  <div v-if="index == 2">
                    <Retroactive :retroactive="item.listData" ref="mychild" @queryData="getData"></Retroactive>
                  </div>
                  <div v-else>
                    <ViewList :listObj="item.listObj" :listData="item.listData"></ViewList>
                  </div>
              </van-list>
            </van-tab>
        </div>
      </van-tabs>
      <PassAndNoPass v-if="active == 0"  @auditHandle="signInAudit" :error="errorTip" :list="tabs[0].listData"    @click-left="left()"></PassAndNoPass>
      <van-popup v-model="showTimerFlag" position="bottom" :overlay="true">
        <van-datetime-picker v-model="currentDate1" type="date" @confirm="confirmTimer" @cancel="cancel" :formatter = "formatter"/>
      </van-popup>
      <van-popup v-model="show" position="bottom" :overlay="true">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          @confirm="confirm"
          @cancel="cancel"
          :formatter = "formatter"
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
  name: "SignInToReview",
  components: {
    Retroactive: Retroactive,
    ViewList: ViewList,
    PassAndNoPass: PassAndNoPass
  },
  data() {
    var dateTime1 = this.utils.formatDate(new Date().getTime(),'yyyy-MM-dd').replace(/-/g, "/");
    var dateTime = this.utils.formatDate(new Date().getTime(),'yyyy-MM-dd');
    var dateTimeShow = this.utils.formatDate(new Date().getTime(),'yyyy-MM-dd').replace(/-/g, "/");
    return {
      active: 0,
      errorTip:'请选择需要审核的签到',
      tabs:[
        {
          title:"待审核",
          loading: false,
          finished: false,
          error: false,
          finishedText:'没有更多了',
          listObj: {
            list: [
              { field: "姓名：", name: "studentName", leftClass: "gray" },
              { field: "班次：", name: "dutyTypeName", leftClass: "gray" },
              {
                field: "值班日期：", name: "signDate", leftClass: "gray",
                render: (data, key) => {
                  return data[key].split(' ')[0];
                }
              },
              { field: "轮转科室：", name: "departmentName", leftClass: "gray" },
              { field: "签到时间：", name: "signInTimeText", leftClass: "gray" },
              { field: "签退时间：", name: "signOutTimeText", leftClass: "gray" }
            ],
            click: this.viewAppraise
          },
          listData:[]
        },
        {
          title:"已审核",
          loading: false,
          finished: false,
          error: false,
          finishedText:'没有更多了',
          listObj: {
            list: [
                { field: "姓名：", name: "studentName", leftClass: "gray" },
                { field: "班次：", name: "dutyTypeName", leftClass: "gray" },
                { field: "轮转科室：", name: "departmentName", leftClass: "gray" },
                { field: "签到时间：", name: "signInTimeText", leftClass: "gray" },
                { field: "签退时间：", name: "signOutTimeText", leftClass: "gray" },
                { field: "审核状态：", name: "auditFlag", leftClass: "gray",
                 render: (data, key) => {
                    if (data.auditFlag == 1) {
                      return `<span class="green">审核通过</span>`;
                    } else if (data.auditFlag == 2) {
                      return `<span class="red">审核不通过</span>`;
                    }
                  }
                },

                { field: "审核意见：", name: "auditOpinion", leftClass: "gray" }
            ]
            //,
            //click: this.viewAppraise
          },
          listData:[]
        },
        {
          title:"补签",
          loading: false,
          finished: false,
          error: false,
          finishedText:'没有更多了',
          listData:[]
        }
      ],
      dateTime: dateTime,
      dateTime1: dateTime1,
      dateTimeShow:dateTimeShow,
      currentDate: new Date(),
      currentDate1: new Date(),
      show: false,
      showTimerFlag: false,
      currentPage: 1,
      auditNote:''
    };
  },
  created() {
    //this.getData();
     this.active = this.$store.state.tabActive;
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    showTimer() {
      this.showTimerFlag = true;
    },
    confirmTimer(value) {
      this.showTimerFlag = false;
      this.dateTime1 = this.utils.formatDate(value.getTime(),'yyyy-MM-dd').replace(/-/g, "/");
      this.getData(1);
    },
    onLoad() {
      console.log('load');
      this.getData();
    },
    change(index) {
      document.querySelector(".layout_content").scrollTop = 0;
      this.active = index;
      this.$store.state.tabActive = this.active;
    },
    getParams () {
      var index = this.active;
      var params = {};
      var url = '';
      switch (+index) {
        case 0:  //待审核
          params.auditFlags = ['0'];
          url =  this.api.pageDutyAuditList;
          break;
        case 1:  // 已审核
          params.auditFlags = ['1', '2'];
          params.signTime = this.dateTime;
          url =  this.api.pageDutyAuditList;
          break;
        case 2:
          params.signTime = this.dateTime1.replace(/\//g, "-");
          url = this.api.pageBackDailySign;
          break;
      }
      return { params:params, url:url }
    },
    transformData(dataResult) {
       //console.log('111',this.$store.state.auditStatus);
       dataResult.forEach( element => {
          element.selected = false;
          element.signInTimeText = element.signInTime ? this.utils.formatDate(element.signInTime,'yyyy-MM-dd HH:mm').replace(/-/g , "/"):'';
          element.signOutTimeText = element.signOutTime ? this.utils.formatDate(element.signOutTime,'yyyy-MM-dd HH:mm').replace(/-/g , "/"):'';
          element.auditFlagText =  this.utils.getValueByKey(this.$store.state.auditStatus, element.auditFlag)||'';

       });
       return dataResult;
    },
    getData(value) {
      var _this = this;
      var currentTab = this.tabs[this.active];
      var params = this.getParams().params;
      this.currentPage = Math.ceil(currentTab.listData.length /  this.$store.state.pageSize);
      this.currentPage = this.currentPage + 1;

      if(value) {
          this.currentPage = 1;
      }

      params.currentPage = this.currentPage;
      params.pageSize = this.$store.state.pageSize;
      var url = this.getParams().url;
      this.utils.ajax(
      {
        url: url,
        data: params,
        method: "POST",
        success: data => {
          console.log('data--->',data);
          _this.totalPages = data.totalPages;
          if( params.currentPage == 1) {
              currentTab.listData = _this.transformData(data.content);
          } else {
              currentTab.listData = currentTab.listData.concat(_this.transformData(data.content));
          }

          if (data.content.length == 0) {
             currentTab.finishedText = '';
          }else {
             currentTab.finishedText = "没有更多了";
          }
          currentTab.loading = false;
          if(_this.currentPage >= _this.totalPages) {
            currentTab.finished = true;
          } else {
            currentTab.finished = false;
          }
        }
      },true);

    },
    viewAppraise(data) {
      data.selected = !data.selected;
    },
    checkedList() {
      var currentTab = this.tabs[this.active];
      var checkedList = currentTab.listData.filter( (ele) => {
          return ele.selected == true;
      });
      //console.log('checkedList--->--', checkedList);
      return checkedList;
    },
    signInAudit(auditObj) {
      var type = auditObj.type;
      // if(type == 'pass') {
      //   console.log('pass');
      // } else if( type == 'unPass' ) {
      //   console.log('unPass');
      // }
      this.auditNote = auditObj.data||'';
      this.auditAjax(type);
    },
    getAuditParams( type) {
        var params = {};
        var checkedList = this.checkedList();
        var ids = [];
        checkedList.forEach((ele)=> {
          var id = ele.dailyId;
          ids.push(id);
        });
        params.ids = ids;
        if( type == 'pass' ) {
          params.auditFlag = '1';
          params.auditOpinion = "";
        }
        else if( type == 'unPass') {
          params.auditFlag = '2';
          params.auditOpinion = this.auditNote;
        }
        return params;
    },
    auditAjax(type) {
      var _this = this;
      var params = this.getAuditParams(type);
      console.log('params-->--', params);
      this.utils.ajax({
          url:  this.api.auditDuty,
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
    formatter(type, value) {
      return this.utils.pickerType( type, value );
    },

    confirm(value) {
      // 日期确定
      this.show = false;
      this.dateTime = this.utils.formatDate(value.getTime(),'yyyy-MM-dd');
      this.dateTimeShow = this.dateTime.replace(/-/g, "/");
      this.getData(1);
    },
    cancel() {
      // 日期取消
      this.show = false;
    },
    dateClick() {
      this.show = true;
    }
  }
};
</script>
<style  scoped>
.audited {
  border-bottom:.07rem solid #ddd;
  width: 100%;
}
</style>
