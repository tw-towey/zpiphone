<template>
  <div>
    <van-nav-bar title="详情" class="header" fixed left-arrow @click-left="onClickLeft" right-text="删除" @click-right="onClickright"/>

    <div class="layout_content">
      <div class="detail" v-if="detailData.studentVO">
        <van-cell :title="detailData.studentVO.name" :value="detailData.applyDate"/>
        <ul class="leaveUl">
          <li v-for="(de,index) in desc" :key="index">
            <span class="gray leftTitle">{{de.type}}</span>
            <span class="rightTitle" v-if="de.lis">{{detailData[de.start]}} ~ {{detailData[de.end]}}</span>
            <span class="rightTitle" v-else>{{detailData[de.name]}}{{de.ending}}</span>
          </li>
        </ul>

        <p class="gray p9 step">进度</p>

        <ul class="leaveSteps">
          <li>
            <div class="stepWarp audited">
              <div class="firstStep"></div>
              <p class="m0 stepNum"></p>
              <p class="gray stepTime">{{detailData.applyDate}}</p>
              <div class="relative">
                <div class="leftTriangle"></div>
                <div class="stepContent">
                  <van-row>
                    <van-col :span="18" class="lh2">{{detailData.studentVO.name}}</van-col>
                    <van-col :span="6" class="gray textR lh2">发起申请</van-col>
                  </van-row>
                </div>
              </div>
            </div>
          </li>

          <li v-for="(auditStep, index) in detailData.leaveAuditSteps">
            <div class="stepWarp" :class="auditStep.auditFlag?'audited':''">
              <p class="m0 stepNum">{{index-0+1}}</p>
              <p class="gray stepTime">{{auditStep.auditDate}}</p>
              <div class="relative">
                <div class="leftTriangle"></div>
                <div class="stepContent">
                  <div class="lh2">{{auditStep.auditFlag?"处理人":"等待处理人"}}：{{auditStep.roleName}} {{auditStep.memberName}}
                  </div>
                  <div class="gray"><span :class="auditStep.auditColor">{{auditStep.auditTitle}}</span>
                    {{auditStep.auditOpinion}}
                  </div>
                </div>
              </div>
            </div>
          </li>

          <li>
            <div class="stepWarp endAudit" :class="detailData.auditFlag == 1?'audited':''">
              <p class="m0 endStepNum"></p>
              <div>审批结束</div>
            </div>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
  // 请假详情
  export default {
    name: "LeaveDetail",
    data() {
      return {
        detailData: {},
        desc: [
          {
            type: "请假类型：",
            name: "attendanceTypeName"
          },
          {
            type: "请假时间：",
            start: "startDate",
            end: "endDate",
            lis: "more"
          },
          {
            type: "请假天数：",
            name: "dayNum",
            ending: " 天"
          },
          {
            type: "请假原因：",
            name: "reason"
          }
        ]
      };
    },
    methods: {
      onClickLeft() {
        this.utils.goBack(this);
      },
      onClickright(){
        this.Dialog.confirm({
          title: "提示",
          message: "是否确定删除该记录吗"
        }).then(() => {
          this.utils.ajax({
            method: "POST",
            data: {
                 ids:[this.$route.params.id]
            },
            url: this.api.delLeaveApply,
            success: data => {
              this.Toast("删除成功");
              this.$router.go(-1);
            }
          });
        });
      },
      getLeaveDetail(params) {
        this.utils.ajax({
          method: "POST",
          url: this.api.queryApplyById,
          data: params,
          success: data => {
            data.applyDate = this.utils.formatDate(data.applyDate, "yyyy-MM-dd HH:mm");
            data.startDate = this.utils.formatDate(data.startDate, "yyyy-MM-dd HH:mm");
            data.endDate = this.utils.formatDate(data.endDate, "yyyy-MM-dd HH:mm");
            data.leaveAuditSteps.forEach(item => {
              item.roleName = this.utils.getValueByKey(this.$store.state.roleList, item.memberRole);
              item.auditTitle = item.auditFlag ? (item.auditFlag == 1 ? "审核通过" : "审核不通过") : "未审核";
              item.auditColor = item.auditFlag ? (item.auditFlag == 1 ? "green" : "red") : "";
            });
            this.detailData = data;
          }
        });
      }
    },
    created() {
      this.getLeaveDetail({ id: this.$route.params.id });
    }
  };
</script>

<style scoped>
  .detail .van-cell {
    background: #cce1f7;
    color: #000000;
  }

  .detail .van-cell__value {
    color: #000000;
  }

  .leaveUl {
    padding: .5rem .9rem;
    background: #fff;
  }

  .leaveUl li {
    padding: .2rem 0;
  }

  .step {
    font-size: 1rem;
    margin: .5rem 0 0;
  }

  .leaveSteps {
    padding-bottom: 3rem;
  }

  .leaveSteps li {
    padding: 0 .9rem;
  }

  .stepWarp {
    padding: .8rem 0 .8rem 1.6rem;
    border-left: 1px solid #ccc;
    position: relative;
    margin-left: .8rem;
  }

  .audited {
    border-color: #419efd;
  }

  .firstStep {
    position: absolute;
    top: 0;
    left: -1px;
    width: 1px;
    height: 50%;
    z-index: 11;
    background-color: #f0f0f0;
  }

  .stepNum {
    top: 50%;
  }

  .stepTime {
    text-align: right;
    margin: 0;
    height: 1rem;
  }

  .stepNum, .endStepNum {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: #ccc;
    position: absolute;
    left: -.5rem;
    color: #fff;
    line-height: 1rem;
    text-align: center;
    font-size: .6rem;
  }

  .endAudit {
    padding: 0 0 0 1.6rem;
  }

  .endStepNum {
    bottom: 0;
  }

  .audited .stepNum, .audited .endStepNum {
    background: #419efd;
  }

  .leftTriangle {
    position: absolute;
    top: 50%;
    left: -.4rem;
    margin-top: -.5rem;
    width: 0;
    height: 0;
    border-top: .5rem solid transparent;
    border-bottom: .5rem solid transparent;
    border-right: .5rem solid #fff;
  }

  .stepContent {
    background: #fff;
    width: 100%;
    min-height: 3rem;
    padding: 0.5rem;
    box-sizing: border-box;
    border-radius: .5rem;
  }

  .endAudit div {
    padding: 0 0 0 .5rem;
  }

  .leftTitle {
    width: 22%;
    display: inline-block;
    vertical-align: top;
  }

  .rightTitle {
    word-wrap: break-word;
    width: 75%;
    display: inline-block;
  }
</style>
