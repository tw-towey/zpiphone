<template>
  <div class="teacher">
    <van-nav-bar title="导师信息" class="header" fixed left-arrow right-text="申请" @click-right="onClickRight" @click-left="onClickLeft" />
    <div class="teacherBox" v-if="paramsData">
      <div class="teacherLeft">
        <img v-if="paramsData.headPortraitUrl" :src="paramsData.headPortraitUrl" alt="">
        <img v-else src="../../assets/images/icons/txPic.svg" />
      </div>
      <div v-if="detaileData" class="teacherRight">
        <ul class="teacherRight_ul">
          <li v-for="(item,index) of listData" :key="index">
            <label for="">{{item.label}}</label>
            <span v-if="item.type == 'text'">
              {{detaileData[item.id]}}
            </span>
            <span v-if="item.type == 'select'">
              {{ utils.getValueByKey(item.option,detaileData[item.id])}}
            </span>
            <span v-if="item.type == 'transfer'">
              {{paramsData[item.id]}}
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="paramsData" class="teacherBoxBottom">
      <div class="teacherBoxBottomTop">
        <div style="line-height:2rem">获奖情况：无</div>
        <div style="line-height:2rem">培训信息：无</div>
      </div>
      <div class="teacherBoxBottomBot">
        <p class="p_first">
          <span>
            <label for="">当前学员数量：</label>{{paramsData.currTeaching}}人
          </span>
          <span>
            <label for="">可带学员数量：</label>{{paramsData.teachingCapacity}}人
          </span>
        </p>
        <p>
          <span>
            <label for="">历史学员数量：</label>{{paramsData.historyTeaching}}人 </span>
        </p>
      </div>
    </div>
    <van-dialog use-slot title="申请记录" v-model="showModel" show-cancel-button @confirm="confirmFn" cancelButtonText="取消" style="width:90%;">
      <ul style="padding: 0.5rem;" class="ulLL">
        <li>
          <span class="gray">申请导师：</span>
          <span class="spanStyle"> {{paramsData.name}} </span>
        </li>
        <li>
          <span class="gray">轮转科室：</span>
          <span class="spanStyle">{{paramsData.departmentName}}</span>
        </li>
        <li>
          <span class="gray">轮转时间：</span>
          <span class="spanStyle">{{utils.formatDate(paramsData.startDate, "yyyy-MM-dd")}} ~ {{utils.formatDate(paramsData.endDate, "yyyy-MM-dd")}}</span>
          <p class="te_red" style="padding-left:70px">(该时段可能由该老师和其他老师共同完成带教)</p>
        </li>
        <!-- <li style="padding-left:70px">
          <van-checkbox shape="square" v-model="isDeploy">接收调配</van-checkbox>
          <p class="te_red">(若申请导师学员已满，接受科室分配其他导师)</p>
          <span class="spanStyle">{{utils.getValueByKey($store.state.trueOrFalse, returLinst.isDeploy)}}</span>
        </li> -->
      </ul>
      <div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
export default {
  name: "TeacherInfo",
  data() {
    return {
      listData: [
        {
          label: "姓名：",
          type: "text",
          id: "name",
          value: ""
        },
        {
          label: "性别：",
          type: "select",
          id: "genderCode",
          value: "",
          option: [
            { key: "1_Gender", value: "男" },
            { key: "2_Gender", value: "女" }
          ]
        },
        {
          label: "联系方式：",
          type: "text",
          id: "cellPhone",
          value: ""
        },
        {
          label: "技术职称：",
          type: "text",
          id: "teacherTitle",
          value: ""
        },
        {
          label: "导师资质：",
          type: "text",
          id: "tutorQualifications",
          value: ""
        },
        {
          label: "带教资质：",
          type: "text",
          id: "teachingQualification",
          value: ""
        },
        {
          label: "从业年限：",
          type: "transfer",
          id: "workTime",
          value: ""
        },
        {
          label: "带教年限：",
          type: "transfer",
          id: "teachingYear",
          value: ""
        },
        {
          label: "所在科室：",
          type: "transfer",
          id: "departments",
          value: ""
        },
        {
          label: "毕业院校：",
          id: "graduationCollege",
          type: "text",
          value: ""
        },
        {
          label: "学历：",
          type: "text",
          id: "educationType",
          value: ""
        }
      ],
      showModel: false,
      paramsData: false,
      detaileData: null,
      isDeploy: 0
    };
  },
  ///teacherInfo/app/selectByTeacherId
  mounted() {
    this.paramsData = this.$route.params;
    this.getInfoTea();
  },
  methods: {
    getInfoTea() {
      this.utils.ajax({
        data: { teacherId: this.paramsData.teacherId },
        url: this.api.selectByTeacherId,
        method: "POST",
        success: data => {
          this.detaileData = data;
          console.log(data);
        }
      });
    },

    onClickLeft() {
      this.utils.goBack(this);
    },

    onClickRight() {
      if(this.paramsData.currTeaching  >= this.paramsData.teachingCapacity){
          this.Dialog.alert({
            title: "提示",
            message: this.paramsData.name + "当前带教人数超过最大带教"
          })
      }else{
        this.showModel = true;
      }
    },

    confirmFn() {
      if (this.paramsData.isApply) {
        this.Toast("重复提交申请，不能再申请");
        return;
      }
      if (this.paramsData.currTeaching >= this.paramsData.teachingCapacity) {
        this.Toast("当前申请人数大于可带教人数");
        return;
      }
      if (this.isDeploy) {
        this.isDeploy = 1;
      } else {
        this.isDeploy = 0;
      }
      this.utils.ajax({
        data: {
          teacherId: this.paramsData.teacherId,
          departmentId: this.paramsData.departmentId,
          isDeploy: this.isDeploy,
          schedulingId: this.paramsData.schedulingId
        },
        url: this.api.schedulingTeacherRecord,
        method: "POST",
        success: data => {
          this.Toast("申请成功！");
        }
      });
    }
  }
};
</script>

<style>
.teacher {
  background: #ffffff;
}
.teacherBox {
  display: flex;
  margin-top: 40px;
}
.teacherBox .teacherLeft {
  width: 50%;
  padding: 0.5rem;
}

.teacherBoxBottomTop {
  height: 4rem;
  padding: 0.8rem;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}
.teacherBoxBottomBot {
  padding: 0.8rem;
}
.teacherBoxBottomBot .p_first {
  display: flex;
}
.teacherBoxBottomBot .p_first span {
  width: 50%;
  line-height: 2.5rem;
}
.teacherBoxBottomBot .p_first span:nth-child(2) {
  text-align: right;
}
.teacherBox .teacherLeft img {
  width: 100%;
  height: 15rem;
}
.teacherBox .teacherRight {
  width: 50%;
  padding: 0.5rem;
}
.teacherBox .teacherRight .teacherRight_ul li {
  line-height: 1.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.concent {
  background: white;
  border-bottom: 1px solid #ccc;
  position: relative;
}
.concent1 {
  width: 92%;
  padding: 0.5rem 0;
  margin: 0 auto;
}
.ulLL li {
  padding: 0.3rem 0;
}
.styleP {
  font-size: 1.5rem;
  color: #5da4ee;
  padding: 0.3rem 0;
}
.styleP1 {
  font-size: 1.5rem;
  color: #18a56f;
  padding: 0.3rem 0;
}
.styleP2 {
  font-size: 1.5rem;
  padding: 0.3rem 0;
}
.styleP3 {
  font-size: 1.5rem;
  color: #9d1612;
  padding: 0.3rem 0;
}
.backgr {
  color: #de7c2e;
}
.gray {
  color: #666666;
}
.p {
  width: 100%;
  text-align: center;
}
.spanStyle {
  font-size: 0.9rem;
}
.pading {
  padding: 0.5rem 0;
}
.te_red {
  color: red;
  font-size: 0.6rem;
}
</style>
