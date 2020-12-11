<template>
  <div>
    <van-nav-bar title="医案记录" class="header" fixed left-arrow @click-left="onClickLeft"/>
    <div class="layout_content">
        <Consilia :ConsiliaData="4" :clickLinstA='$route.params.id'></Consilia>
    </div>
  </div>
</template>

<script>
import Consilia from '@/components/Consilia'

export default {
  name: "BasisRecord",
  components: {
    Consilia:Consilia
  },
  data() {
    return {
       ConsiliaData:4,
       echoitem:{},
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    }
  },
  created() {
    this.echoitem = this.$route.params.item;
  }
};
</script>
<style  scoped>
</style>