<template>
  <div>
    <van-nav-bar title="我的带教" class="header" fixed left-arrow @click-left="onClickLeft"/>

    <div class="layout_content">
      <div class="myRotation">{{departmentName}}（{{normalDepartmentName}}）</div>
      <div v-if="isErrMsg" class="tip-empty"><span class="icon-emptyface"></span><span class="text-empty">未分配带教老师，请联系轮转教秘</span></div>
      <div v-else class="teacherList">
        <ul>
          <li class="bt" v-for="(teacher,index) in list" :key="index">
            <div>带教老师：{{teacher.teacherName}}</div>
            <span class="gray">带教时间：{{teacher.startTime}} ~ {{teacher.endTime}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  // 我的带教
  export default {
    name: "MyTeacher",
    data() {
      return {
        isErrMsg: false,
        departmentName: "",
        normalDepartmentName: "",
        list: []
      };
    },
    methods: {
      onClickLeft() {
        this.utils.goBack(this);
      },
      getData() {
        let obj = this.$route.params;
        let params = {
          departmentId: obj.departmentId,
          endDate: obj.endDate,
          startDate: obj.startDate,
          studentId: this.$store.state.userInfo.human.caId,
          schedulingId: obj.id
        };
        this.departmentName = obj.departmentName;
        this.normalDepartmentName = obj.normalDepartmentName;
        this.utils.ajax({
          url: this.api.viewTeachers,
          method: "POST",
          data: params,
          success: data => {
            if (data.length) {
              data.forEach(item => {
                item.startTime = this.utils.formatDate(item.startTime, "yyyy-MM-dd");
                item.endTime = this.utils.formatDate(item.endTime, "yyyy-MM-dd");
              });
            } else {
              this.isErrMsg = true;
            }
            this.list = data;
          }
        });
      }
    },
    created() {
      this.getData();
    }
  };
</script>

<style scoped>
  .myRotation {
    padding: 0 .5rem;
    line-height: 3rem;
  }

  .teacherList {
    background: #fff;
  }

  .teacherList li {
    padding: .5rem;
  }

  .teacherList div {
    font-size: .9rem;
    margin-bottom: .2rem;
  }
</style>
