<template>
  <div>
    <van-nav-bar v-if="mode!='other'" :title="title" right-text="新增" class="header" fixed left-arrow
                 @click-left="onClickLeft"
                 @click-right="onClickRight"/>
    <van-nav-bar v-if="mode=='other'" :title="title" class="header" fixed left-arrow @click-left="onClickLeft"
                 @click-right="onClickRight"/>
    <div class="layout_content">
      <div class="head">
        <span v-if="mode!='other'">{{title}}录入情况</span>
        <span v-if="mode!='other'">{{this.departmentName}}</span>
        <span v-if="mode!='other'">{{info.percent}}</span>
        <span v-if="mode=='other'">其他轮转信息录入情况 <span class="a">{{info.percent}}</span> 份</span>
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
          <li v-for="obj in listData" @click="showList(obj)" v-if="obj.name != 12">
            <span class="first" v-if="mode!='other'">{{obj.name}}</span>
            <span v-if="mode!='other'">{{obj.requestNum}}</span>
            <span v-if="mode!='other'">{{obj.submitNum}}</span>
            <span v-if="mode!='other'">{{obj.auditNum}}</span>
            <span class="first" v-if="mode=='other'">{{translate(obj.name)}}</span>
            <span v-if="mode=='other'">{{obj.submitNum}}</span>
            <span v-if="mode=='other'">{{obj.auditNum}}</span>
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
        departmentName: this.$store.state.regsterDepartmentName,
        info: {},
        listData: []
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
        let url = '';
        switch (this.mode) {
          case "disease" :
            this.title = "病种";
            url = this.api.registerIllList;
            break;
          case "skill" :
            this.title = "技能";
            url = this.api.registerSkillList;
            break;
          case "other" :
            this.title = "其他";
            url = this.api.otherList;
            break;
          default :
            return;
        }
        let that = this;
        console.log(this.$store.state.currentDepartment);
        this.utils.ajax({
          url: url,
          data: {
            currTime: this.$store.state.currentDepartment.startTime
          },
          method: "post",
          success: (res) => {
            switch (this.mode) {
              case "disease" :
                this.info = res.diseaseInfo;
                this.listData = res.diseaseInfo.data;
                break;
              case "skill" :
                this.info = res.surgeryInfo;
                this.listData = res.surgeryInfo.data;
                break;
              case "other" :
                this.info = res.otherInfo;
                this.listData = res.otherInfo.data;
                break;
              default :
                return;
            }
            
          }
        })
      },
      onClickRight() {
        this.$router.push({ name: "AddRegister" });
      },
      showList(obj) {
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
      }
    },
    created() {
      this.dataLoad();
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
