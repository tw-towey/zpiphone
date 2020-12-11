<template>
   <div class="entryRegister">
        <van-nav-bar title="入科登记" class="header" fixed left-arrow @click-left="onClickLeft"/>
        <div class="layout_content">
            <van-tabs v-model="active" sticky  :offset-top="40"  swipeable title-active-color="#1a7fe9" color="#5fa4ec" :line-height="2" @change="change">
                <div v-for="(item, index) in tabs" :key="index">
                    <van-tab :title="item.title">
                        <div class="entryTime" v-if="index == 0">
                          <van-cell title="入科时间" is-link :value="entryTimeShow" @click="timeSelected"/>
                        </div>
                        <div class="entryTime" v-if="index == 1">
                          <van-cell title="入科时间" is-link :value="startTimeShow" @click="timeSelected"/>
                        </div>
                        <div class="entryRegisterCont">
                            <van-list
                                v-model="item.loading"
                                :finished="item.finished"
                                :error.sync="item.error"
                                error-text="请求失败，点击重新加载"
                                :finished-text="item.finishedText"
                                :offset="50"
                                @load="onLoad()"
                              >
                              <div class="entryRegisterList">
                                  <ViewList :listObj="item.listObj" :listData="item.newList"></ViewList>
                              </div>
                            </van-list>
                        </div>
                        <footer v-if="index == 0" class="mt">
                          <div class="button">
                              <!-- <p class="entry" @click="entryType(1)">已入科</p>
                              <p class="notEntry" @click="entryType(0)">未入科</p> -->
                              <p class="entry" style="width:100%" @click="entryType(1)">登记</p>
                          </div>
                        </footer>
                    </van-tab>
                </div>
            </van-tabs>

          <!-- <van-popup v-model="timeShow" position="bottom">
              <van-datetime-picker
                v-model="checkInTime"
                type="datetime"
                @confirm="conformDate"
                @cancel="cancleDate"
                :formatter = "formatter"
              />
          </van-popup> -->
          <van-popup v-model="checkedTimeShow" position="bottom">
              <van-datetime-picker
                v-model="currentDate"
                type="year-month"
                @confirm="conformCheckedTime"
                @cancel="cancleCheckedDate"
                 :formatter="formatter"
              />
          </van-popup>
          <van-popup v-model="entrycheckedTimeShow" position="bottom">
              <van-datetime-picker
                v-model="currentDate0"
                type="year-month"
                @confirm="conformCheckedTime"
                @cancel="cancleCheckedDate"
                 :formatter="formatter"
              />
          </van-popup>
          <!-- <van-popup v-model="descriptShow" position="bottom"> -->
            <van-dialog v-model="descriptShow" show-cancel-button :before-close="beforeClose">
              <p class="title"><strong class="red"> *</strong>未入科说明:</p>
              <div class="descript">
                  <van-field
                      v-model.trim ="remark"
                      type="textarea"
                      placeholder="未入科说明"
                      autosize
                  />
              </div>
              <!-- <div class="btnBox">
                <van-button type="default" size="small" @click="cancle()">取消</van-button>
                <van-button type="info" size="small" @click="confirm()">确定</van-button>
              </div> -->
            </van-dialog>
          <!-- </van-popup> -->
        </div>

   </div>

</template>
<script>
import ViewList from "@/components/ViewList";
export default {
  name: "EntryRegister",
  components: {
    ViewList: ViewList
  },
  data() {
    var startTime = this.utils.formatDate(new Date().getTime(), "yyyy-MM");
    var startTimeShow = this.utils
      .formatDate(new Date().getTime(), "yyyy-MM")
      .replace(/-/g, "/");
    return {
      //firstLoad:true,
      active: 0,
      timeShow: false,
      descriptShow: false,
      entrycheckedTimeShow: false,
      checkedTimeShow: false,
      remark: "",
      checkInTime: new Date(),
      startTime: startTime,
      startTime0: startTime,
      entryTimeShow: startTimeShow,
      startTimeShow: startTimeShow,
      currentDate: new Date(),
      currentDate0: new Date(),
      activeType: "",
      currentPage: 1,
      tabs: [
        {
          title: "待登记",
          loading: false,
          finished: false,
          error: false,
          finishedText: "没有更多了",
          listObj: {
            list: [
              { field: "姓名：", name: "studentName", leftClass: "gray" },
              { field: "参培年份：", name: "traineeYear", leftClass: "gray" },
              { field: "专业：", name: "traineeMajorText", leftClass: "gray" },

              {
                field: "轮转科室：",
                name: "departmentName",
                leftClass: "gray"
              },
              {
                field: "入科时间：",
                name: "startTime",
                leftClass: "gray",
                render: (data, key) => {
                  return data[key]
                    ? this.utils
                        .formatDate(data[key], "yyyy-MM-dd")
                        .replace(/-/g, "/")
                    : "";
                }
              }
            ],
            click: data => {
              if (this.active == 0) {
                data.selected = !data.selected;
              }
            }
          },
          newList: []
        },
        {
          title: "已登记",
          loading: false,
          finished: false,
          error: false,
          finishedText: "没有更多了",
          listObj: {
            list: [
              { field: "姓名：", name: "studentName", leftClass: "gray" },
              { field: "参培年份：", name: "traineeYear", leftClass: "gray" },
              { field: "专业：", name: "traineeMajorText", leftClass: "gray" },

              {
                field: "轮转科室：",
                name: "departmentName",
                leftClass: "gray"
              },
              {
                field: "入科时间：",
                name: "startTime",
                leftClass: "gray",
                render: (data, key) => {
                  return data[key]
                    ? this.utils
                        .formatDate(data[key], "yyyy-MM-dd")
                        .replace(/-/g, "/")
                    : "";
                }
              },
              { field: "备注：", name: "remark", leftClass: "gray" }
            ],
            click: data => {
              if (this.active == 0) {
                data.selected = !data.selected;
              }
            }
          },
          newList: []
        }
      ]
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    onLoad: function() {
      console.log("load--->");
      this.getData();
    },
    change(index, title) {
      document.querySelector(".layout_content").scrollTop = 0;
      this.active = index;
      this.$store.state.tabActive = this.active;
      // if( index == 0 ) {
      //     this.currentPage = 1;
      //     this.getEntryRegisterList(0); //待登记
      // } else if( index == 1 ) {
      //     this.currentPage = 1;
      //     this.getEntryRegisterList(1);  //已登记
      // }
    },
    formatter(type, value) {
      return this.utils.pickerType(type, value);
    },
    revokeEntryClick(item) {
      this.Dialog.confirm({
        title: "提示",
        message: "可能会造成登记手册数据丢失，是否继续？"
      })
        .then(() => {
          this.utils.ajax(
            {
              url: this.api.revokeEntry,
              data: { id: item.id },
              method: "POST",
              success: data => {
                this.Toast("撤销成功");
                this.getData(1);
              }
            },
            true
          );
        })
        .catch(() => {});
    },
    transformData(dataResult) {
      dataResult.forEach(element => {
        element.selected = false;
        if (element.status == 4 || element.status == 3) {
          element.revokeEntry = true;
          element.revokeEntryClick = item => {
            this.revokeEntryClick(item);
          };
        }
        element.traineeMajorText = this.utils.getValueByKey(
          this.$store.state.majors,
          element.traineeMajorCode
        );
      });
      return dataResult;
    },
    formatDate(str) {
      let arr = str.split("-");
      let m = Number(arr[1]);
      if (m == 2) {
        if (arr[0] % 4 === 0 && arr[0] % 100 === 0 && arr[0] % 400 === 0) {
          return "-29";
        } else {
          return "-28";
        }
      }
      if (
        m == 1 ||
        m == 3 ||
        m == 5 ||
        m == 7 ||
        m == 8 ||
        m == 10 ||
        m == 12
      ) {
        return "-31";
      } else {
        return "-30";
      }
    },
    getData(value) {
      var _this = this;
      var currentTab = this.tabs[this.active];
      this.currentPage = Math.ceil(
        currentTab.newList.length / this.$store.state.pageSize
      );
      this.currentPage = this.currentPage + 1;
      if (value) {
        //第一页
        this.currentPage = 1;
      }
      // if( this.firstLoad) {
      //     this.currentPage = 1;
      //     this.firstLoad = false;
      // }
      var params = {
        currentPage: this.currentPage,
        pageSize: this.$store.state.pageSize
      };

      if (this.active == 0) {
        //待登记
        params.status = 2;
        params.startTime = this.startTime0 + "-01";
        params.endTime = this.startTime0 + this.formatDate(this.startTime0);
      } else if (this.active == 1) {
        //已登记
        params.statusList = ["3", "4"];
        // params.startTime = this.startTime;
        // params.endTime =  this.startTime;
        params.startTime = this.startTime + "-01";
        params.endTime = this.startTime + this.formatDate(this.startTime);
      }

      this.utils.ajax(
        {
          url: this.api.queryEntryRegisterList,
          data: params,
          method: "POST",
          success: data => {
            if (_this.currentPage == 1) {
              currentTab.newList = _this.transformData(data.content);
            } else {
              currentTab.newList = currentTab.newList.concat(
                _this.transformData(data.content)
              );
            }

            if (data.content.length == 0) {
              currentTab.finishedText = "";
            } else {
              currentTab.finishedText = "没有更多了";
            }
            _this.totalElements = data.totalElements;
            _this.totalPages = data.totalPages;
            // 加载状态结束
            currentTab.loading = false;
            if (_this.currentPage >= _this.totalPages) {
              currentTab.finished = true;
            } else {
              currentTab.finished = false;
            }
          }
        },
        true
      );
    },

    //获取选中的数据
    checkedList() {
      var checkedList = this.tabs[this.active].newList.filter(ele => {
        return ele.selected == true;
      });
      //console.log('checkedList--->--', checkedList);
      return checkedList;
    },
    entryType(value) {
      var checkedList = this.checkedList();
      if (checkedList.length == 1) {
        this.$router.push({
          name: "Entrymodel",
          params: { type: 0, data: checkedList }
        });
      } else if (checkedList.length > 1) {
        this.$router.push({
          name: "Entrymodel",
          params: { type: 1, data: checkedList }
        });
      } else {
        this.Toast("请选择待登记的进行入科登记");
      }

      // var checkedList = this.checkedList();
      //  if(value == 1) { //已入科
      //     this.status = '4'; //已报到的
      //     if(checkedList.length == 0) {
      //       this.Toast("请选择待登记的进行入科登记");
      //       return;
      //     }
      //     this.ajaxUpdateEntryDepartmentStatus();
      //  }else if(value == 0) {  //未入科
      //     this.status = '3';  //未报到的
      //     if(checkedList.length == 0) {
      //       this.Toast("请选择待登记的进行未入科说明");
      //       return;
      //     }
      //     this.descriptShow = true;
      //  }
    },

    // 入科登记 已入科接口
    ajaxUpdateEntryDepartmentStatus() {
      var _this = this;
      var params = {};
      var ids = [];
      let obj = {
        status: this.status,
        datas: []
      };
      var checkedList = this.checkedList();
      checkedList.forEach((ele, index) => {
        obj.datas.push({ id: ele.id, checkInTime: ele.startTime });
      });
      // if(this.status == 4) {
      //   params.checkInTime = this.utils.formatDate(this.checkInTime.getTime(),'yyyy-MM-dd HH:mm');
      // }
      // else if( this.status == 3 ) {
      //     params.remark = this.remark;
      // }
      params.remark = this.remark || "";
      this.utils.ajax({
        url: this.api.updateEntryDepartmentStatus,
        data: obj,
        method: "POST",
        success: data => {
          _this.getData(1);
        }
      });
    },

    conformDate(value) {
      //this.checkInTime = this.utils.formatDate(value.getTime(),'yyyy-MM-dd');
      this.checkInTime = value;
      if (!this.checkInTime) {
        this.Toast("请选择报到时间");
      }
      this.ajaxUpdateEntryDepartmentStatus();
      this.cancleDate();
    },
    cancleDate() {
      this.timeShow = false;
      //this.checkInTime = this.utils.formatDate(value.getTime(),'yyyy-MM-dd');
    },
    beforeClose(action, done) {
      //console.log('action-->--', action);
      if (action == "confirm") {
        if (!this.remark) {
          this.Toast("请输入未入科说明");
          done(false);
          return;
        } else {
          if (this.remark.length > 255) {
            this.Toast("未入科说明不能超过255个字符");
            done(false);
            return;
          }
        }
        this.ajaxUpdateEntryDepartmentStatus();
        this.descriptShow = false;
      } else if (action == "cancel") {
        this.descriptShow = false;
        this.remark = "";
      }
      done();
    },

    timeSelected() {
      if (this.active) {
        this.entrycheckedTimeShow = true;
      } else {
        this.checkedTimeShow = true;
      }
    },
    conformCheckedTime(value) {
      if (this.active) {
        this.startTime = this.utils.formatDate(value.getTime(), "yyyy-MM");
        this.startTimeShow = this.startTime.replace(/-/g, "/");
      } else {
        this.startTime0 = this.utils.formatDate(value.getTime(), "yyyy-MM");
        this.entryTimeShow = this.startTime0.replace(/-/g, "/");
        // this.currentDate0 = this.entryTimeShow;
      }
      this.getData(1);
      this.cancleCheckedDate();
    },

    cancleCheckedDate() {
      if (this.active) {
        this.entrycheckedTimeShow = false;
      } else {
        this.checkedTimeShow = false;
      }
    }
  },
  created() {
    this.active = this.$store.state.tabActive;
  }
};
</script>
<style>
/* .entryRegisterList {
      background:#fff;
  } */
/* .entryRegisterCont {
    margin-bottom: 1.6rem;
  } */
.button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  color: white;
  font-size: 0.875rem;
}
.button p {
  width: 50%;
  text-align: center;
  padding: 0.5rem 0;
  margin: 0;
}
.button .entry {
  background: #007acc;
}
.button .notEntry {
  background: #cd3333;
}

.title {
  height: 2rem;
  line-height: 2rem;
  margin: 0;
  padding: 0 0.9rem;
}
.descript {
  margin: 0 0.8rem 0.8rem;
  border: 1px solid #ccc;
}
.btnBox {
  text-align: center;
  margin-bottom: 0.8rem;
}
.btnBox .van-button {
  margin: 0 0.8rem;
}
.entryTime {
  padding: 0 0.8rem;
  border-bottom: 1px solid#ddd;
  background: #fff;
}
.mt {
  margin-top: 2rem;
}
.van-popup--bottom {
  height: 264px;
}
</style>

