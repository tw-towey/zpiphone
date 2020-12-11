<template>
  <div>
    <van-nav-bar v-if="mode!='other' && isShowt" :title="title" right-text="新增" class="header" fixed left-arrow
                 @click-left="onClickLeft"
                 @click-right="onClickRight"/>
    <van-nav-bar v-else :title="title"  class="header" fixed left-arrow  @click-left="onClickLeft"/>             
    <van-nav-bar v-if="mode=='other'" :title="title" class="header" fixed left-arrow @click-left="onClickLeft"
                 @click-right="onClickRight"/>
    <div class="layout_content">
      <div class="head">
        <span v-if="mode!='other'">{{title}}录入情况</span>
        <span v-if="mode!='other'">{{this.departmentName}}</span>
        <span v-if="mode!='other'">{{$store.state.regsterList.finishedPercent}}%</span>
        <span v-if="$store.state.regsterList.actualNum"><span v-if="mode=='other'">其他轮转信息录入情况 <span class="a">{{$store.state.regsterList.actualNum}}</span> 份</span></span>
        
      </div>
      <div class="content">
        <ul>
          <li class="list_head">
            <span class="first" v-if="mode!='other'">{{title}}名称</span>
            <span v-if="mode!='other'">要求</span>
            <span v-if="mode!='other'">完成</span>
            <span v-if="mode!='other'">审核</span>
            <span class="first" v-if="mode=='other'">分类</span>
            <span v-if="mode=='other'">已录</span>
            <span v-if="mode=='other'">带教已审</span>
          </li>
          <li v-for="(obj,index) in listData" :key="index" @click="showList(obj)" >
              <template v-if="obj.name != 12">
                   <span class="first" v-if="mode!='other'">{{obj.name}}</span>
                    <span v-if="mode!='other'">{{obj.requestNum}}</span>
                    <span v-if="mode!='other'">{{obj.submitNum}}</span>
                    <span v-if="mode!='other'">{{obj.auditNum}}</span>
                    <span class="first" v-if="mode=='other'">{{translate(obj.name)}}</span>
                    <span v-if="mode=='other'">{{obj.submitNum}}</span>
                    <span v-if="mode=='other'">{{obj.auditNum}}</span>
              </template>
          </li>
        </ul>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: "ModeRegister",
    data() {
      return {
        mode: "",
        title: "",
        departmentName: this.$store.state.scheduling.departmentName,
        listData: [],
        isShowt: true,
      };
    },
    methods: {
      onClickLeft() {
        this.utils.goBack(this);
      },
      translate(code) {
        return this.utils.getValueByKey(this.$store.state.other, code);
      },
      dataLoad() {
        this.mode = this.$store.state.regsterMode;
        let url = this.api.queryOneLevelTypeDetail;
        let promis = '';
        switch (this.mode) {
          case "disease" :
            this.title = "病种";
            promis = {
              oneLevelType : 1,
              normalDepartmentId: this.$store.state.scheduling.normalDepartmentId,
              version: this.$store.state.scheduling.version,
              multistandardId : this.$store.state.scheduling.multistandardId,
            //   departmentCaId: this.$store.state.scheduling.departmentId
            }
            break;
          case "skill" :
            this.title = "技能";
            promis = {
              oneLevelType : 2,
              normalDepartmentId: this.$store.state.scheduling.normalDepartmentId,
              version: this.$store.state.scheduling.version,
              multistandardId : this.$store.state.scheduling.multistandardId,
            //   departmentCaId: this.$store.state.scheduling.departmentId
            }
            break;
          case "other" :
            this.title = "其他";
            promis = {
              oneLevelType : 3,
              normalDepartmentId: this.$store.state.scheduling.normalDepartmentId,
              version: this.$store.state.scheduling.version,
              multistandardId : this.$store.state.scheduling.multistandardId,
            //   departmentCaId: this.$store.state.scheduling.departmentId
            }
            break;
           case "surgery" :
            this.title = "手术";
            promis = {
              oneLevelType : 4,
              normalDepartmentId: this.$store.state.scheduling.normalDepartmentId,
              version: this.$store.state.scheduling.version,
              multistandardId : this.$store.state.scheduling.multistandardId,
            //   departmentCaId: this.$store.state.scheduling.departmentId
            }  
            break;
          default :
            return;
        }
        let that = this;
        this.utils.ajax({
          url: url,
          data:promis,
          method: "post",
          success: (res) => {
            this.listData = res;
          }
        })
      },
      onClickRight() {
        // this.$router.push({ name: "AddRegister" });
        this.$router.push({ name: "RegistrationHand" });
      },
      showList(obj) {
        if (!obj.code) {
          obj.code = null;
        }
        this.$store.state.bzName = obj.name;
        if (this.$store.state.regsterMode === "other") {
          this.$router.push({ name: "OtherRotation", params: obj, query: {type: obj.name} });
        } else {
          this.$router.push({ name: "OtherRotation", params: obj, query: {type: this.mode} });
        }
      },
      rightBtn() {
        if (this.mode != "other") {
          return "新增";
        } else {
          return "";
        }
      },
      isShow() {
        var date = new Date().getTime();
        if(this.$store.state.startTimeDate){
          if( date < this.utils.getTime(this.$store.state.startTimeDate)){
              this.isShowt = false;
            return;
          }
        }  
    }
    },
    created() {
      this.dataLoad();
      this.isShow();
    }
  };
</script>

<style scoped>
  .head {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    font-size: 0.97rem;
  }

  .layout_content {
    background: #fff;
    color: #333;
  }

  .list_head {
    background: #f2efef;
    border: none;
    color: #8c8c8c;
  }

  li {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #ebebeb;
  }

  .first {
    width: 40%;
    display: inline-block;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  li > span {
    display: inline-block;
    width: 5rem;
    text-align: center;
  }
</style>
