<template>
  <div>
    <van-nav-bar title="出科鉴定" :right-text="isSet?'保存':''" class="header" fixed left-arrow @click-left="onClickLeft"
                 @click-right="onClickRight"/>
    <div class="layout_content">

      <div class="bgWhite p9 titleWarp">
        <van-row>
          <van-col span="6">
            <img class="img" src="../assets/images/icons/portrait.svg">
          </van-col>
          <van-col span="18">
            <p class="teacher">{{setData.memberName}} <span class="gray">{{outData.departmentName}}</span></p>
            <p class="gray time">{{outData.times}}</p>
          </van-col>
        </van-row>
      </div>

      <div class="p9">
        <p class="grey">{{comment["title"]}}</p>
        <van-row>
          <div v-for="(item,index) in comment.appraisalGrade">
            <van-col span="6">
              <div v-if="isSet" :class="['select', index==setData[comment['name']]?'selected':'', index==0?'left':'']"
                   @click="setting(comment.appraisalGrade,comment,index)">
                {{item.title}}
              </div>
              <div v-else
                   :class="['select', index==setData[comment['name']]?'selected':'none']">
                {{item.title}}
              </div>
            </van-col>
          </div>
        </van-row>
        <p class="grey">出科评语</p>
      </div>

      <div class="p9 bgWhite">
        <textarea class="text" v-model="setData.identifyContent" :readonly="!isSet"></textarea>
      </div>
      <p class="textR p9 grey m0">请输入2-150个字符</p>

      <div v-for="obj in configObj">
        <p class="p9 grey">{{obj.title}}</p>
        <div class="bgWhite selectWarp">
          <div v-for="val in obj.list">
            <p class="selectTitle">{{val.title}}</p>
            <van-row>
              <div v-for="(item,index) in val.appraisalGrade">
                <van-col span="6">
                  <div v-if="isSet" :class="['select', index==setData[val['name']]?'selected':'',index==0?'left':'']"
                       @click="setting(val.appraisalGrade,val,index)">
                    {{item.title}}
                  </div>
                  <div v-else
                       :class="['select', index==setData[val['name']]?'selected':'none']">
                    {{item.title}}
                  </div>
                </van-col>
              </div>
            </van-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // 出科鉴定
  export default {
    name: "GraduateAppraisal",
    data() {
      return {
        comment: {
          name: "compositeRating", title: "综合评定",
          appraisalGrade: [
            { title: "优秀", selected: false, val: 0 },
            { title: "良好", selected: false, val: 1 },
            { title: "合格", selected: false, val: 2 },
            { title: "不合格", selected: false, val: 3 }
          ]
        },
        configObj: [
          {
            title: "医德医风",
            list: [
              { name: "serviceAttitude", title: "服务态度、医患关系" },
              { name: "workDuty", title: "工作责任心、无差错" },
              { name: "medicalStyle", title: "医疗作风、廉洁行医" },
              { name: "teamWork", title: "团队协作、遵守制度" }
            ]
          },
          {
            title: "日常工作考核",
            list: [
              { name: "dealAbility", title: "处理一般病人能力" },
              { name: "rescueAbility", title: "抢救危重病人能力" },
              { name: "cureAbility", title: "诊治疑难病人能力" },
              { name: "clinicalAbility", title: "临床思维能力" },
              { name: "teachingAbility", title: "教学能力" }
            ]
          },
          {
            title: "临床能力考核",
            list: [
              { name: "medicalRecordsQuality", title: "病历完成质量" },
              { name: "cureQuality", title: "接诊病人完成质量" },
              { name: "recipeQuality", title: "门诊处方、病房医嘱完成质量" }
            ]
          }
        ],
        outData: {},
        setData: {
          compositeRating: 0,
          clinicalAbility: 0,
          cureAbility: 0,
          cureQuality: 0,
          dealAbility: 0,
          medicalRecordsQuality: 0,
          medicalStyle: 0,
          recipeQuality: 0,
          rescueAbility: 0,
          serviceAttitude: 0,
          teachingAbility: 0,
          teamWork: 0,
          workDuty: 0,
          identifyContent: ""
        },
        isSet: false
      };
    },
    methods: {
      onClickLeft() {
        this.utils.goBack(this);
      },
      onClickRight() {
        if (this.isSet) {
          let identifyContent = this.setData.identifyContent;
          if (this.utils.isEmpty(identifyContent)) {
            this.Toast("出科评语不能为空");
            return;
          } else if (identifyContent.length < 2) {
            this.Toast("出科评语不能小于2个字");
            return;
          } else if (identifyContent.length > 150) {
            this.Toast("出科评语不能超过150字");
            return;
          }
          this.utils.ajax({
            method: "POST",
            url: this.api.departmentOutIdentify,
            data: this.setData,
            success: data => {
              this.Toast("鉴定成功");
              this.onClickLeft();
            }
          });
        }
      },
      getData() {
        this.utils.ajax({
          method: "POST",
          url: this.api.departmentOut,
          data: this.$route.query,
          success: data => {
            this.setData.memberName = data.memberName;
            this.setData.rcpFkDepartmentOutApply = data.id;
            this.setData.memberId = this.$store.state.userInfo.human.caId;
            this.setData.id = data.id;
            if (!this.isSet) {
              for (var key in this.setData) {
                this.setData[key] = data[key];
              }
            }
            this.$forceUpdate();
          }
        });
      },
      setting(data, config, index) {
        data.forEach(item => {
          item.selected = false;
        });
        data[index].selected = true;
        this.setData[config["name"]] = index;
        this.$forceUpdate();
      },
      init() {
        this.configObj.forEach(item => {
          item.list.forEach(val => {
            val.appraisalGrade = [
              { title: "优秀", selected: false, val: 0 },
              { title: "良好", selected: false, val: 1 },
              { title: "合格", selected: false, val: 2 },
              { title: "不合格", selected: false, val: 3 }
            ];
          });
        });

        if (Object.keys(this.$route.params).length) {
          this.outData = this.$route.params;
          this.outData.times = this.outData.startDate.split(" ")[0] + " ~ " + this.outData.endDate.split(" ")[0];
        }

        if (this.$route.query.id) {
          if (!this.$route.params.identifyFlag) {
            this.isSet = true;
          }
          this.getData();
        } else {
          this.setData = this.$route.params.departmentOutIdentify;
        }
      }
    },
    created() {
      this.init();
    }
  };
</script>

<style scoped>
  .titleWarp {
    height: 5rem;
  }

  .img {
    width: 4rem;
    height: 4rem;
    margin-top: .5rem;
  }

  .teacher {
    font-size: 1rem;
    margin-bottom: 0;
  }

  .time {
    margin-bottom: 0;
  }

  .selectWarp {
    padding: 0 .9rem .9rem;
  }

  .select {
    border: 1px solid #d3d3d3;
    background: #fff;
    border-left: none;
    height: 2.5rem;
    text-align: center;
    line-height: 2.5rem;
  }

  .left {
    border-left: 1px solid #d3d3d3;
  }

  .text {
    width: 100%;
    height: 4rem;
    border: none;
    padding: .9rem 0;
  }

  .selected {
    border: 1px solid #1e8cff;
    background: #eef9ff;
  }

  .selectTitle {
    margin: 0;
    height: 3rem;
    line-height: 3rem;
  }

  .none {
    display: none;
  }
</style>
