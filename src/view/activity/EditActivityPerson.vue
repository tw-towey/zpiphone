<!--  -->
<template>
  <div class>
    <van-nav-bar title="修改主讲人" class="header" fixed left-arrow @click-left="onClickLeft" right-text="保存"
      @click-right="saveDate" />
    <div class="layout_content">
      <van-cell-group>
        <van-radio-group v-model="detailActivity.isExtramural">
          <van-cell-group>
            <van-cell title="主讲人：" clickable>
              <template #right-icon>
                <van-radio name="0">院内</van-radio>
                <van-radio style="margin-left:10px" name="1">院外</van-radio>
                <input type="" v-model="detailActivity.speaker" style="border:none;width:80px;text-align: right;" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
        <van-cell-group>
          <van-field v-model="detailActivity.speakerJobNumber" input-align="right" label="工号：" />
          <van-field v-model="detailActivity.speakerCellphone" input-align="right" label="手机号：" />
          <van-field v-model="detailActivity.bankCardNum" input-align="right" label="银行卡号：" />
        </van-cell-group>
      </van-cell-group>
    </div>
  </div>
</template>

<script>

export default {
  name: "EditActivityPerson",
  components: {
  },
  data() {
    return {
      detailActivity: {},
    };
  },
  //方法集合
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    saveDate() {
      this.utils.ajax({
        url: this.api.editSpeaker,
        data: {
          teachingId: this.detailActivity.id,
          isExtramural: this.detailActivity.isExtramural * 1,
          bankCardNum: this.detailActivity.bankCardNum,
          mobile: this.detailActivity.speakerCellphone,
          jobNumber: this.detailActivity.speakerJobNumber,
          name: this.detailActivity.speaker
        },
        method: "POST",
        success: data => {
          this.Toast("保存成功");
        }
      });
    },
  },
  created() {
    this.detailActivity = this.$route.params;
    this.detailActivity.isExtramural = this.detailActivity.isExtramural + '';
  }
};
</script>
<style  scoped>
</style>