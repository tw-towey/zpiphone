<template>
  <div>
    <van-nav-bar title="轮转计划" class="header" fixed left-arrow @click-left="onClickLeft"/>

    <div class="layout_content">
      <div class="module">
        <div class="bt list" v-for="rotationItem in rotationList" @click="viewRotation($event,rotationItem)">
          <van-row>
            <van-col span="16" class="h4">
              <div class="van-ellipsis">标准科室: {{rotationItem.normalDepartmentName}}</div>
              <div class="curdepartment">
                <span class="van-ellipsis" :class="rotationItem.iscur?'maxW':''">{{rotationItem.departmentName}} </span>
                <span class="red curDep" v-if="rotationItem.iscur"> 【当前科室】</span>
              </div>
              <div class="gray">{{rotationItem.dateRange}}</div>
            </van-col>
            <van-col span="8" class="textR">
              <p class="a rightBtn viewTeacher">查看带教老师</p>
            </van-col>
          </van-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /*轮转计划*/
  export default {
    name: "RotationPlan",
    data() {
      return {
        rotationList: []
      };
    },
    methods: {
      onClickLeft() {
        this.utils.goBack(this);
      },
      viewRotation(e, item) {
        if (e.target.className.indexOf("viewTeacher") > -1) {
          this.$router.push({ name: "MyTeacher", params: item });
        } else {
          this.$store.state.curDepartmentTime = item;
          this.$router.push({ name: "Home" });
        }
      },
      getData() {
        this.utils.ajax({
          url: this.api.departmentList,
          method: "POST",
          success: data => {
            let nowTimeStamp = this.utils.getTime(this.$store.state.timestamp);
            data.forEach(item => {
              item.dateRange = `${this.utils.formatDate(item.startDate, "yyyy-MM-dd")} ~ ${this.utils.formatDate(item.endDate, "yyyy-MM-dd")}`;
              item.iscur = this.utils.getTime(item.startDate) <= nowTimeStamp && nowTimeStamp <= this.utils.getTime(item.endDate);
            });
            this.rotationList = data;
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
  .list {
    padding: .5rem .9rem;
    margin: 0;
    height: 4rem;
  }

  .curdepartment {
    padding: .3rem 0;
    display: flex;
  }

  .curdepartment span {
    display: inline-block;
  }

  .maxW {
    max-width: 60%;
  }

  .curDep {
    width: 40%;
  }

  .h4 {
    height: 4rem;
  }

  .rightBtn {
    height: 4rem;
    line-height: 4rem;
    margin: 0;
  }
</style>
