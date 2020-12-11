<template>
  <div>
    <conmentHead :headList="headList" v-if="!$route.params.departmentId"></conmentHead>
    <van-nav-bar title="入科学习记录" class="header" fixed left-arrow @click-left="onClickLeft" v-else/>
    <div :class="$route.params.departmentId ? 'layout_content ct' : 'layout_content_tow ct'">
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
        <div class="van-cell-grid" center v-for="(item, index) in listData" :key="index" @click="detail(item)">
          <van-cell>
            <div class="list">
              <div class="list">
                <div class="left_radius">
                  <van-icon name="video-o" size="4rem" style="vertical-align: middle"/>
                </div>
                <div>
                  <div class="course-name">{{item.sectionName}}</div>
                  <div>{{item.packageName}}</div>
                  <div style="color: grey">{{item.createTime}}</div>
                </div>
              </div>
              <div class="rate">{{getRate(item)}}</div>
            </div>
          </van-cell>
        </div>
      </van-list>
    </div>

    <van-popup v-model="year.showPicker" position="bottom">
      <van-picker
        :default-index="year.defaultIndex"
        show-toolbar
        :columns="year.columns"
        @cancel="year.showPicker = false"
        @confirm="selectYear"
      />
    </van-popup>

    <van-popup v-model="department.showPicker" position="bottom">
      <van-picker
        :default-index="department.defaultIndex"
        show-toolbar
        value-key="departmentName"
        :columns="department.columns"
        @cancel="department.showPicker = false"
        @confirm="selectDepartment"
      />
    </van-popup>

  </div>
</template>

<script>
  import conmentHead from "@/components/conmentHead";

  export default {
    name: "EntryStudyRecord",
    components: {conmentHead},
    data() {
      return {
        loading: false,
        finished: false,
        error: false,
        finishedText: "",
        headList: {
          title: '入科学习记录',
          onClickLeft: () => {
            this.onClickLeft();
          },
          leftColor: 'white',
          rightColor: 'white',
          leftText: '全部年份',
          rightText: '全部科室',
          cellSelected: () => {

          },
          leftClick: () => {
            this.year.showPicker = true;
          },
          rightClick: () => {
            this.department.showPicker = true;
          }
        },
        year: {
          showPicker: false,
          columns: [],
          activeDate: new Date()
        },
        department: {
          showPicker: false,
          defaultIndex: 0,
          columns: [
            {departmentId: "", departmentName: "全部科室"}
          ],
        },
        listData: [],
        params: {
          year: "",
          departmentId: ""
        }
      }
    },
    methods: {
      onClickLeft() {
        this.utils.goBack(this);
      },
      onClickRight() {
        console.log("哈哈");
      },
      formatter(type, value) {
        return this.utils.pickerType(type, value);
      },
      selectYear(value) {
        this.params.year = value;
        this.headList.leftText = value;
        this.year.showPicker = false;
        this.getList(true);
      },
      selectDepartment(item) {
        this.params.departmentId = item.departmentId;
        this.headList.rightText = item.departmentName;
        this.department.showPicker = false;
        this.getList(true);
      },
      getRate(item) {
        if (item.fileTime == 0) {
          return "0%"
        }

        return Math.floor(item.watchTime / item.duration * 100) + "%"
      },
      onLoad() {
        this.getList(true);
      },
      getList(isRestPage) {
        if (isRestPage) {
          //重置page
          this.params.currentPage = 1;
          document.querySelector(".ct").scrollTop = 0;
        } else {
          this.params.currentPage = Math.ceil(this.listData.length / this.$store.state.pageSize) + 1;
        }

        if (this.$route.params.studentId) {
          this.params.studentId = this.$route.params.studentId;
        }

        if (this.$route.params.departmentId) {
          this.params.departmentId = this.$route.params.departmentId;
        }

        this.utils.ajax({
          url: this.api.intodeptcourseStudyrecordPageList,
          data: this.params,
          method: "POST",
          success: data => {
            if (isRestPage) {
              this.listData = data.content;
            } else {
              this.listData = [...this.listData, ...data.content];
            }

            this.loading = false;//结束当前加载
            if (this.params.currentPage >= data.totalPages) {//最后一页、加载完成
              this.finished = true;
              this.finishedText = '没有更多了';
            }else{
              this.finished = false;
            }
          }
        });
      },
      querySchedulingDepartmentDistinct() {
        let params = {
          finishedType: 4
        };
        if (this.$route.params.studentId) {
          params.caId = this.$route.params.studentId;
        }

        this.utils.ajax({
          url: this.api.querySchedulingDepartmentDistinct,
          data: params,
          method: "POST",
          success: data => {
            if (data) {
              this.department.columns = [...this.department.columns, ...data];

              if (this.$store.state.scheduling) {
                let departmentIndex = this.department.columns.findIndex(item => item.departmentId == this.$store.state.scheduling.departmentId);
                this.department.defaultIndex = departmentIndex;
              }
            }

          }
        });
      },
      detail(item) {
        if (this.$route.params.studentId) {
          return;
        }
        console.log("跳转医视在线页面");
        console.log(item);
        this.utils.ajax({
          url: this.api.toOnLineView,
          data: {
            departmentId: item.departmentId,
            coursewareId: item.coursewareId,
            sectionId: item.sectionId
          },
          method: "POST",
          success: data => {
            if (data) {
              let toOnLineViewUrl = data.toOnLineViewUrl;
              if (toOnLineViewUrl) {
                this.webApp.WebCallApp("CmdOpenUrl", {url: toOnLineViewUrl});
              }
            }
          }
        });
      }
    },
    created() {
      //设置当前年
      let date = new Date();
      let yearIndex = 0;
      for (let year = 1990; year <= 2099; year++) {
        this.year.columns.push(year);
        if (date.getFullYear() == year) {
          this.year.defaultIndex = yearIndex;
        }
        yearIndex++;
      }

      if (this.$store.state.scheduling) {
        this.params.departmentId = this.$store.state.scheduling.departmentId;
        this.headList.rightText = this.$store.state.scheduling.departmentName;
      }

      if (!this.$route.params.departmentId) {
        this.querySchedulingDepartmentDistinct();
      }
    }
  }
</script>

<style scoped>
  .list {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .img {
    width: 4rem;
    height: 4rem;
    vertical-align: middle;
  }

  .left_radius {
    margin-right: 0.5rem;
  }

  .course-name {
    font-size: 1rem;
  }

  .rate {
    font-size: 2rem;
  }
</style>
