<template>
  <div>
    <div v-show="bodyshow">
      <van-nav-bar :title="title" class="header" fixed left-arrow @click-left="onClickLeft()"/>
      <div class="layout_content">
        <van-cell title="活动类型" is-link :value="activityType.value" @click="activity()"/>
        <van-field
          v-model="activityType.panel"
          type="text"
          label="活动标题"
          placeholder="请填写"
          input-align="right"
        />
        <div class="radioAdd">
          <van-radio-group v-model="checked1" class="radioname">
            <van-radio :name="activityType.radioname" @click="radioinp(this)">
              <img
                slot="icon"
                slot-scope="props"
                :src="props.checked ? icon.active : icon.normal"
                class="dadioimg"
                @click="radioinp(this)"
              >
              <span>院内</span>
            </van-radio>
            <van-radio :name="activityType.radioname2" @click="radioinp_tow(this)">
              <img
                slot="icon"
                slot-scope="props"
                :src="props.checked ? icon.active : icon.normal"
                class="dadioimg"
                @click="radioinp_tow(this)"
              >
              <span>院外</span>
            </van-radio>
          </van-radio-group>
        </div>
        <van-field
          v-model="activityType.Ontype"
          label="主讲人类型"
          placeholder="请填写"
          input-align="right"
        />
        <van-field
          v-model="activityType.keynote"
          type="number"
          label="手机号"
          placeholder="请填写"
          input-align="right"
        />
        <van-cell title="是否报名" is-link :value="activityType.sign" @click="whether()"/>
        <van-field
          v-model="activityType.impose"
          type="number"
          label="人数限制"
          placeholder="选填项"
          input-align="right"
        />
        <div class="abstract">
          <span>活动摘要</span>
          <van-field
            v-model="activityType.abstract"
            type="textarea"
            placeholder="请输入活动摘要信息,选填项"
            autosize
          />
        </div>
        <div class="abstract">
          <span>活动详情</span>
          <van-field
            v-model="activityType.details"
            type="textarea"
            placeholder="请输入活动详情信息"
            autosize
          />
        </div>
        <van-cell
          title="开始时间"
          is-link
          :value="activityType.startTime"
          @click="begin_time('begin')"
        />
        <van-cell title="结束时间" is-link :value="activityType.endTime" @click="begin_time('over')"/>
        <van-field
          v-model="activityType.periods"
          type="number"
          label="学时"
          placeholder="选填项"
          input-align="right"
        />
        <van-cell title="接收对象" is-link :value="activityType.accept" @click="begin_time('accept')"/>
        <van-cell
          title="科室名称"
          is-link
          :value="activityType.department"
          @click="begin_time('department')"
        />
        <div class="save">保存</div>
        <!-- 活动类型 -->
        <van-popup v-model="showtype" position="bottom" :overlay="false">
          <van-picker
            show-toolbar
            title
            :columns="actions"
            @confirm="onConfirm"
            @cancel="hideMask"
          />
        </van-popup>
        <!-- 是否报名 -->
        <van-dialog v-model="Isapply" show-cancel-button :before-close="beforeClose" title="是否报名">
          <van-radio-group v-model="activityType.radio_list" class="apply">
            <van-cell-group>
              <van-cell title="是" clickable @click="radio = '1'">
                <van-radio :name="activityType.yesname">
                  <img
                    slot="icon"
                    slot-scope="props"
                    :src="props.checked ? icon.active : icon.normal"
                    class="dadioimg"
                  >
                </van-radio>
              </van-cell>
              <van-cell title="否" clickable @click="radio = '2'">
                <van-radio :name="activityType.yesname2">
                  <img
                    slot="icon"
                    slot-scope="props"
                    :src="props.checked ? icon.active : icon.normal"
                    class="dadioimg"
                  >
                </van-radio>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </van-dialog>
        <!-- 开始时间 -->
        <van-popup v-model="showdate" position="bottom" :overlay="true">
          <van-datetime-picker
            v-model="currentDate"
            type="datetime"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm="confirm_time"
            @cancel="hideMask_time"
          />
        </van-popup>
        <!-- 结束时间 -->
        <van-popup v-model="showover" position="bottom" :overlay="true">
          <van-datetime-picker
            v-model="currentDateOver"
            type="datetime"
            :min-date="minDateOver"
            :max-date="maxDateOver"
            @confirm="confirm_timeOver"
            @cancel="hideMask_timeOver"
          />
        </van-popup>
        <!-- 接收对象 -->
        <van-dialog v-model="accept" show-cancel-button :before-close="beforeObject" title="接收对象">
          <van-checkbox-group v-model="activityType.result" class="apply">
            <van-cell-group>
              <van-cell title="带教" clickable>
                <van-checkbox :name="activityType.teacher">
                  <img
                    slot="icon"
                    slot-scope="props"
                    :src="props.checked ? iconimg.active : iconimg.normal"
                    class="dadioimg"
                  >
                </van-checkbox>
              </van-cell>
              <van-cell title="学习" clickable>
                <van-checkbox :name="activityType.learn">
                  <img
                    slot="icon"
                    slot-scope="props"
                    :src="props.checked ? iconimg.active : iconimg.normal"
                    class="dadioimg"
                  >
                </van-checkbox>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </van-dialog>
      </div>
    </div>

    <!-- 科室名称 -->

    <DepartmentName v-show="nameoffice"></DepartmentName>
  </div>
</template>

<script>
import DepartmentName from "@/view/activity/DepartmentName";

export default {
  components: {
    DepartmentName: DepartmentName
  },
  name: "RedactLinst",
  data() {
    return {
      showtype: false, // 活动类型
      Isapply: false, // 是否报名
      showdate: false, // 开始时间
      showover: false, // 结束时间
      accept: false, // 接收对象
      nameoffice: false, // 科室名称
      bodyshow: true,
      title: '',
      activityType: {
        value: "请选择", // 活动类型
        panel: "", // 活动标题
        radioname: "1", // 院内
        radioname2: "2", //院外
        Ontype: "", //主讲类型
        sign: "请选择", // 是否报名
        impose: "", // 人数限制
        abstract: "", // 活动摘要
        details: "", // 活动详情
        startTime: "请选择", // 开始时间
        endTime: "请选择", // 结束时间
        periods: "", // 学时
        accept: "请选择", // 接收对象
        department: "选填项", // 科室名称
        Id: "",
        radio_list: "", // 是否报名
        yesname: "是",
        yesname2: "否",
        learn: "学习", // 接收报名
        teacher: "带教",
        result: []
      },
      checked: true,
      checked1: "1",
      icon: {
        normal: require("../../assets/images/home/pic_ses-01.svg"),
        active: require("../../assets/images/home/pic_ses-02.svg")
      },
      iconimg: {
        normal: require("../../assets/images/home/pic_cks-01.svg"),
        active: require("../../assets/images/home/pic_cks-02.svg")
      },
      actions: [],
      minDate: new Date(),
      maxDate: new Date(2019, 11, 31),
      currentDate: new Date(),
      minDateOver: new Date(),
      maxDateOver: new Date(2019, 11, 31),
      currentDateOver: new Date()
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    radioinp() {
      // 院内
      console.log("2123", this.activityType.radioname);
    },
    radioinp_tow() {
      // 院外
      console.log("2123", this.activityType.radioname2);
    },
    getLeaveList(param) {
      this.utils.ajax({
        url: this.api.queryApplyList,
        data: param,
        method: "POST",
        success: data => {
          console.log(data);
          data = ["入科教育", "小讲课", "教学查房", "技能训练", "大讲课"];
          this.actions = data;
        }
      });
    },

    activity() {
      this.showtype = true;
    },
    // onCancel() {
    //     console.log('1231231')
    //     this.showtype = false;
    // }
    onConfirm(value) {
      // 选择请假类型
      this.activityType.value = value;

      // this.activityType.Id = value.id;
      this.hideMask();
      console.log("1865", value);
    },
    hideMask() {
      this.showtype = this.showtype = false;
    },
    beforeClose(action, done) {
      // 是否报名
      if (action === "confirm") {
        // 确定
        console.log(this.activityType.radio_list, "1215");
        setTimeout(done, 1000);
        this.activityType.sign = this.activityType.radio_list;
      } else {
        // 取消
        done();
      }
    },
    whether() {
      // 是否报名
      this.Isapply = true;
    },
    begin_time(time) {
      if (time == "begin") {
        // 开始时间
        this.showdate = true;
        console.log("ss");
      }
      if (time == "over") {
        // 结束时间
        this.showover = true;
        console.log("ss");
      }
      if (time == "accept") {
        // 接收时间
        //   this.result = [];
        this.accept = true;
        //   console.log('ss')
      }
      if (time == "department") {
        // 科室名称
        //   this.$router.push({ name: "DepartmentName"});
        this.nameoffice = true;
        this.bodyshow = false;
      }
    },
    hideMask_time() {
      // 开始时间
      this.showdate = this.showdate = false;
    },
    confirm_time(value) {
      //开始时间
      this.hideMask_time();
      this.activityType.startTime = this.utils.formatDate(value.getTime());
      this.minDateOver = value;
      console.log(this.utils.formatDate(value.getTime()), "111");
    },
    hideMask_timeOver() {
      // 结束时间
      this.showover = this.showover = false;
    },
    confirm_timeOver(value) {
      //结束时间
      this.hideMask_timeOver();
      this.activityType.endTime = this.utils.formatDate(value.getTime());
    },
    beforeObject(action, done) {
      // 接收对象
      if (action === "confirm") {
        // 确定
        console.log(this.activityType.result, "1215");
        setTimeout(done, 1000);
        this.activityType.accept = this.activityType.result.join("-");
      } else {
        // 取消
        done();
      }
    }
  },
  created() {
    this.getLeaveList();
     this.title = this.$route.params.id.type;
  },
  mounted() {}
};
</script>
<style scoped>
.radioAdd {
  background: white;
  padding: 0.5rem 0;
  border: 1px solid #fafafa;
}
.dadioimg {
  width: 1.125rem;
  height: 1.125rem;
}
.radioname {
  width: 40%;
  display: flex;
  margin: 0 auto;
  justify-content: space-between;
}
.radioname span {
  font-size: 0.9rem;
}
.abstract {
  margin-top: 0.5rem;
  background: white;
  padding-top: 0.5rem;
}
.abstract span {
  font-size: 0.9rem;
  margin-left: 0.9rem;
}
.save {
  width: 95.6%;
  padding: 0.5rem;
  background: #187fe8;
  text-align: center;
  color: white;
  font-size: 1rem;
  line-height: 1rem;
}
.apply {
  padding: 0.5rem 0;
}
.van-dialog__header {
  padding: 0.5625rem !important;
}
.van-cell__value {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>