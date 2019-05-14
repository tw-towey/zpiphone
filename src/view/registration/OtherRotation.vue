<template>
  <div>
    <van-nav-bar :title="title" :right-text="rightText" class="header" fixed left-arrow @click-left="onClickLeft"
                 @click-right="cellSelected"/>
    <div class="layout_content bgWhite">
      <div>
        <p class="title" v-if="!notOther">{{table.title}} <span class="a">{{table.data.length}}</span> 条活动</p>
        <p class="title-disease-skill" v-if="notOther"><span>{{table.title}}</span><span>{{name}}</span><span></span>
        </p>
      </div>
      <div class="thead">
        <van-row>
          <div v-for="tab in table.theader">
            <p v-if="tab.type != 'checkedbox'" class="van-ellipsis center taboy">{{tab.value}}</p>
            <p v-if="tab.type == 'checkedbox'" class="van-ellipsis center taboy">请选择</p>
          </div>
        </van-row>
      </div>
      <div>
        <!--<van-row>-->
          <div v-for="item in table.theader" class="w25">
            <div v-for="curData in table.data">
              <p v-if="item.type != 'checkedbox'" class="van-ellipsis center taboy" @click="cellSelected(curData)">
                {{returnInnerHtml(curData, item["name"], item)}}</p>
              <p v-if="item.type == 'checkedbox'" class="van-ellipsis center taboy">
                <van-icon name="checked" class="icon" :color="curData.checked ? '#397de8' : '#cdcdcd'"
                          @click="clickCheckbox(curData)"/>
              </p>
            </div>
          </div>
        <!--</van-row>-->
      </div>
    </div>
  </div>
</template>

<script>
  // 其他轮转
  export default {
    name: "OtherRotation",
    data() {
      return {
        otherField: {
          11: [
            { name: "departmentName", value: "轮转科室" },
            { name: "date", value: "日期" },
            { name: "heading", value: "查房名称" },
            { name: "speaker", value: "主讲人" }
          ],
          13: [
            { name: "departmentName", value: "轮转科室" },
            { name: "date", value: "日期" },
            { name: "location", value: "学习地点" },
            { name: "content", value: "课外学习" }
          ],
          14: [
            { name: "departmentName", value: "轮转科室" },
            { name: "date", value: "日期" },
            { name: "content", value: "获奖内容" },
            { name: "awardDepartment", value: "奖励部门" }
          ],
          15: [
            { name: "departmentName", value: "轮转科室" },
            { name: "date", value: "日期" },
            { name: "heading", value: "讲座名称" },
            { name: "location", value: "地点" }
          ],
          16: [
            { name: "departmentName", value: "轮转科室" },
            { name: "date", value: "日期" },
            { name: "heading", value: "讨论主题" },
            { name: "location", value: "地点" }
          ],
          17: [
            { name: "departmentName", value: "轮转科室" },
            { name: "date", value: "日期" },
            { name: "heading", value: "讨论主题" },
            { name: "location", value: "地点" }
          ],
          18: [
            { name: "departmentName", value: "轮转科室" },
            { name: "date", value: "日期" },
            { name: "heading", value: "会诊名称" },
            { name: "location", value: "地点" }
          ],
          19: [
            { name: "departmentName", value: "轮转科室" },
            { name: "heading", value: "科研名称" },
            { name: "principal", value: "带头人" },
            { name: "joinRoleName", value: "参与角色" }
          ],
          20: [
            { name: "departmentName", value: "轮转科室" },
            { name: "date", value: "日期" },
            { name: "heading", value: "论文名称" },
            { name: "publications", value: "发表刊物" }
          ],
          21: [
            { name: "departmentName", value: "轮转科室" },
            { name: "date", value: "日期" },
            { name: "guideWayName", value: "指导方式" },
            { name: "content", value: "指导内容" }
          ],
          diseaseAndSkill: [
            { name: "patientName", value: "病人姓名" },
            { name: "admissionNumber", value: "编号" },
            { name: "isTubeBed", value: "是否管床", type: "select" },
            { name: "auditFlag", value: "审核状态", type: "select" }
          ]
        },
        table: {
          title: "",
          theader: [],
          data: []
        },
        notOther: false,
        name: "",
        title: "",
        color: "#cdcdcd",
        rightText: "新增"
      };
    },
    methods: {
      onClickLeft() {
        if (this.rightText == "管理" || this.rightText == "新增") {
          this.utils.goBack(this);
        } else if (this.rightText == "删除") {
          this.rightText = "管理";
          this.table.theader = this.table.theader.splice(1, 4);
        }
      },
      returnInnerHtml(obj, key, item) {
        if (item.type == "select") {
          if (obj[key] == "1") {
            return "是";
          } else {
            return "否";
          }
        } else {
          return obj[key];
        }
      },
      getData(type) {
        this.table.theader = this.otherField[type];
        this.table.title = this.utils.getValueByKey(this.$store.state.other, type);
        this.title = "其他轮转";
        let url = this.api.queryOtherRotation;
        let obj = { twoLevelType: type, currTime: this.$store.state.currentDepartment.endDate };
        if (type == "disease" || type == "skill") {
          let code = "";
          if (this.$route.params.code) {
            code = this.$route.params.code;
            this.$store.state.registerCode = code;
          } else {
            code = this.$store.state.registerCode;
          }
          url = this.api.queryDiseaseList;
          this.notOther = true;
          this.name = this.$route.params.name;
          obj = {
            currTime: this.$store.state.currentDepartment.endDate,
            diseaseCode: code
          };
          this.rightText = "管理";
          if (type == "disease") {
            this.title = "病种";
            this.table.title = "病种名称";
            obj.type = "1";
          } else {
            this.title = "技能";
            this.table.title = "技能名称";
            obj.type = "2";
          }
          this.table.theader = this.otherField["diseaseAndSkill"];
        }


        var joinRole = [
            { value: "第一研究员", key: 6 },
            { value: "第二研究员", key: 7 },
            { value: "第三研究员", key: 8 },
            { value: "第四研究员", key: 9 },
            { value: "第五研究员", key: 10 },
            { value: "第六研究员", key: 11 }
            ];
        var guideWayList = [
            { value: "座谈", key: 1 },
            { value: "工作汇报", key: 2 },
            { value: "读书报告", key: 3 },
            { value: "科研论文指导", key: 4 },
            { value: "病案讨论", key: 5 },
            { value: "临床技能指导", key: 6 },
            { value: "人文指导", key: 7 },
            { value: "其他", key: 8 }
            ];
        var that = this;
        this.utils.ajax({
          url: url,
          data: obj,
          method: "POST",
          success: (data) => {
            data.forEach(item => {
              item.date = item.date.split(" ")[0];
              item.checked = false;
              if (type == 19) {
                item.joinRoleName = that.utils.getValueByKey(joinRole,item.joinRole);
              } else if (type == 21) {
                item.guideWayName = that.utils.getValueByKey(guideWayList,item.guideWay);
              }
            });
            this.table.data = data;
          }
        });
      },
      clickCheckbox(obj) {
        obj.checked = !obj.checked;
      },
      cellSelected(obj) {
        if (obj.twoLevelType) {
          this.$store.state.EditRegisterNum = "" + obj.twoLevelType;
          this.$store.state.EditRegisterObj = obj;
          this.$router.push({ name: "EditRegister" });
          return;
        }
        if (this.rightText == "新增") {
          if (this.$route.params.name) {
            this.$store.state.EditRegisterNum = "" + this.$route.params.name;
          }
          this.$router.push({ name: "EditRegister" });
        } else if (this.rightText == "管理") {
          this.rightText = "删除";
          let obj = [{ type: "checkedbox" }];
          this.table.theader = obj.concat(this.table.theader);
        } else if (this.rightText == "删除") {
          let arr = [];
          this.table.data.forEach(i => {
            if (i.checked) {
              arr.push(i.id);
            }
          });
          if (arr.length > 0) {
            this.Dialog.confirm({
              title: "提示",
              message: "删除后病历信息将不存在,确认删除？"
            }).then(() => {
              this.utils.ajax({
                url: this.api.removeRegster,
                method: "post",
                data: {
                  ids: arr
                },
                success: res => {
                  this.Toast("删除成功");
                  this.utils.goBack(this);
                }
              });
            }).catch(() => {
            });
          } else {
            this.Toast("请选择数据");
          }
        }
      }
    },
    created() {
      this.getData(this.$route.query.type);
    }
  };
</script>

<style scoped>
  .title {
    margin: 0;
    padding: .8rem .9rem;
    font-size: 1rem;
  }

  .thead {
    background: #f2efef;
  }

  .tbody {
    position: absolute;
    top: 5rem;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .taboy {
    margin: 0;
    height: 1rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid #ebebeb;
  }

  .icon {
    font-size: 1.3rem;
  }

  .bgWhite > div {
    display: flex;
    justify-content: space-between;
  }

  .thead > div {
    display: flex;
    justify-content: space-between;
  }

  .bgWhite > div > div {
    flex: 1;
  }

  .thead > div > div {
    flex: 1;
  }

  .van-row {
    display: flex;
    justify-content: space-between;
  }

  .van-row > div {
    flex: 1;
  }

  .title-disease-skill {
    display: flex;
    justify-content: space-between;
    margin: 0;
    padding: .8rem .9rem;
    font-size: 1rem;
  }

  .w25{
    width: 25%;
  }
</style>
