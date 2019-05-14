<template>
  <div>
    <van-nav-bar title="临床医案" class="header" fixed left-arrow @click-left="onClickLeft"/>
    <div class="layout_content">
        <Consilia :ConsiliaData='ConsiliaData'></Consilia>
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
       ConsiliaData:'add' 
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