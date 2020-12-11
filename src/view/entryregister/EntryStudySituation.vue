<template>
  <div>
    <conmentHead :headList="headList"></conmentHead>

    <div class="layout_content_tow">
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
        <div class="van-cell-grid" v-for="(item, index) in listData" :key="index">
          <van-cell center @click="detail(item)">
            <div class="list">
              <div>
                <div class="name">{{item.studentName}}({{item.traineeYear}})</div>
                <div>{{item.startTime}}~{{item.endTime}}</div>
                <div>
                  <span style="margin-right: 2rem">已学：{{item.learnedNum}}</span>
                  <span>总计：{{item.shouldLearnNum}}</span>
                </div>
              </div>
              <div class="rate">{{getRate(item)}}</div>
            </div>
          </van-cell>
        </div>
      </van-list>
    </div>

    <van-popup v-model="yearMonth.showPicker" position="bottom">
      <van-datetime-picker
        type="year-month"
        :formatter="formatter"
        @confirm="selectYearMonth"
        @cancel="yearMonth.showPicker = false"
        :value="yearMonth.activeDate"
      />
    </van-popup>

    <van-popup v-model="department.showPicker" position="bottom">
      <van-picker
        :default-index="department.defaultIndex"
        show-toolbar
        value-key="name"
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
    name: "EntryStudySituation",
    components: {conmentHead},
    data() {
      return {
        loading: false,
        finished: false,
        error: false,
        finishedText: "",
        headList: {
          title: '入科学习情况',
          onClickLeft: () => {
            this.onClickLeft();
          },
          leftColor: 'white',
          rightColor: 'white',
          leftText: this.utils.formatDate(new Date().getTime(), "yyyy-MM"),
          rightText: '全部科室',
          cellSelected: () => {

          },
          leftClick: () => {
            this.yearMonth.showPicker = true;
          },
          rightClick: () => {
            this.department.showPicker = true;
          }
        },
        yearMonth: {
          showPicker: false,
          activeDate: new Date()
        },
        department: {
          showPicker: false,
          defaultIndex: 0,
          columns: [
            {caId: "", name: "全部科室"}
          ],
        },
        listData: [],
        params: {
          yearMonth: this.utils.formatDate(new Date().getTime(), "yyyy-MM"),
          departmentId: "",
          pageSize: this.$store.state.pageSize
        }
      }
    },
    methods: {
      onClickLeft() {
        this.$store.state.studySituationState = "";
        this.utils.goBack(this);
      },
      onClickRight() {
        console.log("哈哈");
      },
      formatter(type, value) {
        return this.utils.pickerType(type, value);
      },
      selectYearMonth(value) {
        let yearMonth = this.utils.formatDate(value.getTime(), "yyyy-MM");
        this.params.yearMonth = yearMonth;
        this.headList.leftText = yearMonth;
        this.yearMonth.showPicker = false;
        this.getList(true);
      },
      selectDepartment(item) {
        this.params.departmentId = item.caId;
        this.headList.rightText = item.name;
        this.department.showPicker = false;
        this.getList(true);
      },
      getRate(item) {
        if (item.shouldLearnNum == 0) {
          return "0%"
        }

        return Math.floor(item.learnedNum / item.shouldLearnNum * 100) + "%"
      },
      onLoad() {
        this.getList(false);
      },
      getList(isRestPage) {
        if (isRestPage) {
          //重置page
          this.params.currentPage = 1;
          document.querySelector(".layout_content_tow").scrollTop = 0;
        } else {
          this.params.currentPage = Math.ceil(this.listData.length / this.$store.state.pageSize) + 1;
        }

        this.utils.ajax({
          url: this.api.listStudySituation,
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
      queryDepartmentsByRole() {
        this.utils.ajax({
          url: this.api.queryDepartmentsByRole,
          data: {},
          method: "POST",
          success: data => {
            console.log(data);
            this.department.columns = [...this.department.columns, ...data];
          }
        });
      },
      detail(item) {
        console.log(item);
        this.$store.state.studySituationState = this.$data;
        this.$router.push({
          name: "EntryStudyRecord",
          params: {studentId: item.studentId, departmentId: item.departmentId}
        });
      }
    },
    created() {
      let studySituationState = this.$store.state.studySituationState;
      if (studySituationState) {
        this.params.yearMonth = studySituationState.params.yearMonth;
        this.params.departmentId = studySituationState.params.departmentId;
        this.headList.leftText = studySituationState.headList.leftText;
        this.headList.rightText = studySituationState.headList.rightText;
        this.department.defaultIndex = studySituationState.department.defaultIndex;
      }

      this.queryDepartmentsByRole();
    }
  }
</script>

<style scoped>
  .list {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .name {
    font-size: 1rem;
  }

  .rate {
    font-size: 1.5rem;
  }
</style>
