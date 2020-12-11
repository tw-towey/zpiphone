<template>
  <div>
    <van-nav-bar title="入科学习" class="header" fixed left-arrow @click-left="onClickLeft" :right-text="rightText"
                 @click-right="onClickRight"/>
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
        <van-collapse v-model="activeName" accordion>
          <div v-for="(item, index) in listData" :key="index">
            <van-collapse-item :title="item.packageName" :name="index">
              <van-cell center v-for="(course, index) in item.coursewares" :key="index" @click="detail(item, course)">
                <template #right-icon v-if="course.studyrecordIsStudy == 1">
                  <van-icon name="success"/>
                </template>
                <div>{{course.sectionName}}</div>
                <div class="file-name">文件时长：{{ utils.formatSeconds(course.duration) }}</div>
              </van-cell>
            </van-collapse-item>
          </div>
        </van-collapse>
      </van-list>
    </div>

    <van-popup v-model="studyStatus.showPicker" position="bottom">
      <van-picker
        :default-index="studyStatus.defaultIndex"
        show-toolbar
        :columns="studyStatus.columns"
        @cancel="studyStatus.showPicker = false"
        @confirm="selectStudyStatus"
      />
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "EntryStudy",
    components: {},
    data() {
      return {
        rightText: "学习进度",
        activeName: 0,
        loading: false,
        finished: false,
        error: false,
        finishedText: "没有更多了",
        studyStatus: {
          showPicker: false,
          defaultIndex: 0,
          columns: [
            {
              text: "全部",
              value: ""
            },
            {
              text: "未学习",
              value: 0
            },
            {
              text: "已学习",
              value: 1
            },
          ],
        },
        listData: [],
        params: {
          departmentId: this.$store.state.currentDepartment.departmentId,
          isStudy: ""
        }
      };
    },
    methods: {
      onClickLeft() {
        this.utils.goBack(this);
      },
      onClickRight() {
        this.studyStatus.showPicker = true;
      },
      selectStudyStatus(item) {
        this.params.isStudy = item.value;
        this.rightText = item.text;
        this.studyStatus.showPicker = false;
        this.getList(true);
      },
      detail(item, course) {
        console.log("跳转医师在线页面");
        console.log(item);
        console.log(course);
        this.utils.ajax({
          url: this.api.toOnLineView,
          data: {
            departmentId: item.departmentId,
            coursewareId: course.id,
            sectionId: course.sectionId
          },
          method: "POST",
          success: data => {
            console.log(data);
            if (data) {
              let toOnLineViewUrl = data.toOnLineViewUrl;
              if (toOnLineViewUrl) {
                this.webApp.WebCallApp("CmdOpenUrl", {url: toOnLineViewUrl});
              }
            }
          }
        });
      },
      onLoad() {
        if (!this.$store.state.scheduling) {
          this.Toast("当前没有轮转科室");
          this.loading = false;
          this.finished = true;
          return;
        }

        this.getList(false);
      },
      getList(isRestPage) {
        this.utils.ajax({
          url: this.api.listStudentCourse,
          data: this.params,
          method: "POST",
          success: data => {
            if (isRestPage) {
              this.listData = [];
            }

            if (data.length) {
              this.listData = Object.assign(this.listData, [
                ...this.listData,
                ...data
              ]);
            } else {
              this.finishedText = "";
              this.finishedText = '没有更多了';
            }
            this.loading = false; //结束当前加载
            this.finished = true;
          }
        });
      }
    },
    created() {

    }
  }
</script>

<style scoped>
  .file-name {
    color: grey;
  }
</style>
