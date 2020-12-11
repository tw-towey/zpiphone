<template>
  <div>
    <van-nav-bar title="医案记录" class="header" fixed left-arrow @click-left="onClickLeft"/>
    <div class="layout_content">
        <Consilia :ConsiliaData='ConsiliaData' :clickLinstA='this.$route.params.item'></Consilia>
    </div>
  </div>
</template>

<script>
import Consilia from '@/components/Consilia'

export default {
  name: "BasisRecordLinst",
  components: {
    Consilia:Consilia
  },
  data() {
    return {
       ConsiliaData: 5
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    }
  },
  created() {
    this.$route.params.item;
  }
};
</script>
<style  scoped>
</style>