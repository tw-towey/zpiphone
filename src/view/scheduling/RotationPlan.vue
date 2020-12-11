<template>
  <div>
    <van-nav-bar title="轮转计划" class="header" fixed left-arrow @click-left="onClickLeft"/>

    <div class="layout_content" ref="content1">
      <div class="module">
        <div  v-for="(rotationItem,index) in rotationList" @click="viewRotation($event,rotationItem)" :key="index" :class="index < active || 0 ? 'bt list bggray' : 'bt list' ">
          <van-row>
            <van-col span="16" class="h4">
              <div class="gray">轮转周期: {{rotationItem.dateRange}}</div>
              <div class="van-ellipsis">标准科室: {{rotationItem.normalDepartmentName}}</div>
              <div class="curdepartment">
                <span class="van-ellipsis" :class="rotationItem.iscur?'maxW':''"> 轮转科室: {{rotationItem.departmentName}} </span>
                <span class="red curDep" v-if="rotationItem.iscur"> 【当前科室】</span>
              </div>
              <div>
                <span class="a viewTeacher">查看带教老师</span> 
              </div>
            </van-col>
            <van-col span="8" class="textR">
              <div style="height:5rem;line-height:7rem;">
                    <van-icon name="arrow" style="font-size:24px;font-weight:blod"/>
              </div>
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
        rotationList: [],
        active:0,
      };
    },
    methods: {
      onClickLeft() {
        this.utils.goBack(this);
      },
      /**
       * 切换轮转科室
       */
      viewRotation(e, item) {
          if (e.target.className.indexOf("viewTeacher") > -1) {
            this.$router.push({ name: "MyTeacher", params: item });
          } else {
            this.$store.state.curRotationDepartment = item;
            if(this.$store.state.scheduling){
                this.$store.state.scheduling.departmentName = item.departmentName;
                this.$store.state.scheduling.range = item.dateRange;
                this.$store.state.scheduling.id = item.id;
                this.$store.state.scheduling.normalDepartmentId = item.normalDepartmentId;
                this.$store.state.scheduling.version = item.version;
                this.$store.state.scheduling.multistandardId = item.multistandardId;
                this.$store.state.scheduling.normalDepartmentName = item.normalDepartmentName;
            }else{
                this.$store.state.scheduling = {
                    departmentName:'',
                    range:'',
                    normalDepartmentId:'',
                    version:'',
                    id:'',
                    multistandardId:'',
                    normalDepartmentName:''
                };
                this.$store.state.scheduling.normalDepartmentName = item.normalDepartmentName;
                this.$store.state.scheduling.version = item.version;
                this.$store.state.scheduling.id = item.id;
                this.$store.state.scheduling.multistandardId = item.multistandardId;
                this.$store.state.scheduling.departmentName = item.departmentName;
                this.$store.state.scheduling.range = item.dateRange;
                this.$store.state.scheduling.normalDepartmentId = item.normalDepartmentId;
          }
          this.$store.state.startTimeDate = item.startDate;
            setTimeout(() => {
                this.utils.goBack(this);
            }, 0);
        }
      },
      getData() {
        this.utils.ajax({
          url: this.api.departmentList,
          method: "POST",
          success: data => {
            let nowTimeStamp = this.utils.getTime(this.$store.state.timestamp);
            data.forEach((item,index) => {
              item.dateRange = `${this.utils.formatDate(item.startDate, "yyyy-MM-dd")} ~ ${this.utils.formatDate(item.endDate, "yyyy-MM-dd")}`;
              item.iscur = this.utils.getTime(item.startDate) <= nowTimeStamp && nowTimeStamp <= this.utils.getTime(item.endDate);
              if(item.iscur){
                this.active = index;
                this.$store.state.currentRotationTime.startTime = this.utils.formatDate(item.startDate, "yyyy-MM-dd");
                this.$store.state.currentRotationTime.endTime = this.utils.formatDate(item.endDate, "yyyy-MM-dd");
              }
            });
            this.rotationList = data;
            this.scrTop();
          }
        });
      },
      scrTop(){
           this.$nextTick(()=>{
            setTimeout(()=>{
                this.$refs.content1.scrollTop = this.active * 6 * 16 + this.active;
            },0)
        })
      }
    },
    mounted(){
       
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
    min-height: 5rem;
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
  .bggray{
    background: #f9f9f9;
  }
  .curDep {
    width: 45%;
  }

  .h4 {
    min-height: 5rem;
  }

  .rightBtn {
    height: 100%;
    margin: 0;
  }
</style>
