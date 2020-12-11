<template>
  <div>
    <van-nav-bar title="医案详情" class="header" fixed left-arrow @click-left="onClickLeft"/>
    <div class="layout_content">
        <Consilia :ConsiliaData='ConsiliaData' :clickLinstA='this.$route.params.item'></Consilia>
    </div>
  </div>
</template>

<script>
import Consilia from '@/components/Consilia'

export default {
  name: "Notpass",
  components: {
    Consilia:Consilia
  },
  data() {
    return {
       ConsiliaData:2 
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    }
  },
  created() {}
};
</script>
<style  scoped>
</style>