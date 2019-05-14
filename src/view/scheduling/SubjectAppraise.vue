<template>
  <div>
    <van-nav-bar title="出科鉴定" class="header" fixed left-arrow @click-left="onClickLeft"></van-nav-bar>

    <div class="layout_content" ref="layoutContent" @scroll="scroll()">
      <van-tabs v-model="active" :offset-top="40" sticky swipeable title-active-color="#1a7fe9" color="#5fa4ec"
                :line-height="2"
                @click="change"
                @change="change">
        <div v-for="(item,index) in tabs">
          <van-tab :title="item.title">
            <van-list
              v-model="item.loading"
              :finished="item.finished"
              :error.sync="item.error"
              error-text="请求失败，点击重新加载"
              :finished-text="item.finishedText"
              immediate-check
              :offset="50"
              @load="onLoad()"
            >
              <div v-if="index == 1" class="identifyUpdateDate">
                <van-cell title="鉴定时间" is-link :value="identifyUpdateDate" @click="selectTime()"/>
              </div>
              <ViewList :listObj="item.listObj" :listData="item.listData"></ViewList>
            </van-list>
          </van-tab>
        </div>
      </van-tabs>

      <van-popup v-model="calendarShow" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="year-month"
          :formatter="formatter"
          @confirm="selectDate"
          @cancel="closePopup"
        />
      </van-popup>
    </div>
  </div>
</template>
<script>
  import ViewList from "@/components/ViewList";

  export default {
    name: "SubjectAppraise",
    components: {
      "ViewList": ViewList
    },
    data() {
      return {
        active: 0,
        calendarShow: false,
        identifyUpdateDate: new Date(),
        currentDate: new Date(),

        tabs: [
          {
            title: "待鉴定",
            loading: false,
            finished: false,
            error: false,
            finishedText: '没有更多了',
            scrollTop: 0,
            listObj: {
              list: [
                {
                  field: "姓名：", name: "student", leftClass: "gray", render: (data, key) => {
                  return data[key].name;
                }
                },
                {
                  field: "专业：", name: "subjectCode", leftClass: "gray", render: (data, key) => {
                  return this.utils.getValueByKey(this.$store.state.majors, data[key]);
                }
                },
                {field: "轮转科室：", name: "departmentName", leftClass: "gray"},
                {
                  field: "出科小结：", name: "", leftClass: "gray", render: (data, key) => {
                  return `<span class="a">查看</span>`;
                }, click: (data, key) => {
                  this.$dialog.alert({
                    title: "出科小结",
                    message: data.summary
                  });
                }
                },
                {
                  field: "提交时间：", name: "applyDate", leftClass: "gray", render: (data, key) => {
                  if (!data[key]) {
                    return "";
                  }
                  return this.utils.formatDate(data[key], "yyyy-MM-dd HH:mm");
                }
                }
              ],
              click: this.viewAppraise
            },
            listData: []
          },
          {
            title: "已鉴定",
            loading: false,
            finished: false,
            error: false,
            finishedText: '没有更多了',
            scrollTop: 0,
            listObj: {
              list: [
                {
                  field: "姓名：", name: "student", leftClass: "gray", render: (data, key) => {
                  return data[key].name;
                }
                },
                {
                  field: "专业：", name: "subjectCode", leftClass: "gray", render: (data, key) => {
                  return this.utils.getValueByKey(this.$store.state.majors, data[key]);
                }
                },
                {field: "轮转科室：", name: "departmentName", leftClass: "gray"},
                {
                  field: "出科小结：", name: "", leftClass: "gray", render: (data, key) => {
                  return `<span class="a">查看</span>`;
                }, click: (data, key) => {
                  this.$dialog.alert({
                    title: "出科小结",
                    message: data.summary
                  });
                }
                },
                {
                  field: "鉴定结果：", name: "departmentOutIdentify", leftClass: "gray", render: (data, key) => {
                  return this.utils.getValueByKey(this.$store.state.appraisalGrade, data[key].compositeRating);
                }
                },
                {
                  field: "鉴定时间：", name: "departmentOutIdentify", leftClass: "gray", render: (data, key) => {
                  const updateDate = data[key].updateDate;

                  if (!updateDate) {
                    return "";
                  }
                  return this.utils.formatDate(updateDate, "yyyy-MM-dd HH:mm");
                }
                }
              ],
              click: this.viewAppraise
            },
            listData: []
          }
        ]
      };
    },
    methods: {
      onClickLeft() {
        this.$store.state.tabActive = 0;//返回时，置为第一个tab页
        this.utils.goBack(this);
      },
      onLoad() {
        this.queryData();
      },
      change(index, title) {
        this.$nextTick(() => {
          this.$refs.layoutContent.scrollTop = this.tabs[this.active].scrollTop;
        });

        this.$store.state.tabActive = this.active;
      },
      scroll(){
        this.tabs[this.active].scrollTop = this.$refs.layoutContent.scrollTop;//记录滑动的scrollTop高度
      },
      selectTime() {
        this.calendarShow = true;
      },
      selectDate(v) {
        let year = v.getFullYear();
        let month = (v.getMonth() + 1).toString();
        month = month.length === 1 ? ("0" + month) : month;

        this.tabs[this.active].listData = [];
        this.identifyUpdateDate = year + "-" + month;
        this.calendarShow = false;
        this.queryData();
      },
      closePopup() {
        this.calendarShow = false;
      },
      formatter(type, value) {
        return this.utils.pickerType(type, value);
      },
      queryData(){
        let currentTab = this.tabs[this.active];
        let params = {
          identifyFlag: this.active,//待鉴定：0 已鉴定：1、目前tab的index正好和参数一致
          currentPage: Math.ceil(currentTab.listData.length / this.$store.state.pageSize) + 1,
          pageSize: this.$store.state.pageSize
        };

        //如果是已鉴定tab页，增加鉴定时间参数
        if (this.active == 1) {
          params.identifyUpdateDate = this.identifyUpdateDate
        }

        this.utils.ajax({
          method: "post",
          data: params,
          url: this.api.identifyDepartmentOutApply,
          success: data => {
            console.log(data);
            if (data.content.length) {
              currentTab.listData = [...currentTab.listData, ...data.content];
            } else {
              currentTab.finishedText = '';
            }

            currentTab.loading = false;//结束当前加载
            if (params.currentPage >= data.totalPages) {
              currentTab.finished = true;
            }
          },
          error: (error) => {
            currentTab.loading = false;
            currentTab.error = true;
          }
        }, true);
      },
      viewAppraise(data) {
        this.$router.push({name: "GraduateAppraisal", query: {id: data.id}, params: data});
      }
    },
    created() {
      //鉴定日期赋值
      this.identifyUpdateDate = this.utils.formatDate(this.$store.state.timestamp || new Date().getTime(), "yyyy-MM");
      //通过详情返回后，定位到上次点击的tab页位置
      this.active = this.$store.state.tabActive;
    }
  };

</script>
<style scoped>
  .identifyUpdateDate {
    border-bottom: 1px solid #ddd;
    padding-left: 0.3rem;
    background: #fff;
  }
</style>



