<template>
  <div class="manualAudit">
    <van-nav-bar title="手册审核" class="header" fixed left-arrow @click-left="onClickLeft"/>
    <div class="layout_content">
        <van-tabs v-model="active" sticky  :offset-top="40"  swipeable title-active-color="#1a7fe9" color="#5fa4ec" :line-height="2" @change="change">
            <van-tab title="待审核">
              <ManualAuditList :tab="active"  :tabFlg ="tabFlag"  ref="mychild1"></ManualAuditList>
            </van-tab>
            <van-tab title="已审核">
              <ManualAuditList :tab="active" :tabFlg ="tabFlag"   ref="mychild2"></ManualAuditList>
            </van-tab>
        </van-tabs>
    </div>
  </div>
</template>

<script>
/*手册审核*/

import ManualAuditList from "@/components/ManualAuditList";
export default {
  name: "ManualAudit",
  components: {
    ManualAuditList: ManualAuditList
  },
  data() {
    return {
      active: 0,
      //firstLoad: false,
      tabFlag: true
    };
  },
  methods: {
    onClickLeft() {
      this.$store.state.tabActive = 0;
      this.utils.goBack(this);
    },
    change(index, title) {
      //console.log('change');
      document.querySelector(".layout_content").scrollTop = 0;
      this.active = index;
      this.$store.state.tabActive = this.active;
      // this.tabFlag = true;  //第一次页面加载的标志
      // //第一次切换tab 不加载
      // if (this.firstLoad) {
      //   if (index == 0) {
      //     this.$refs.mychild1.getData(1);
      //   } else {
      //     this.$refs.mychild2.getData(1);
      //   }
      // }
      // this.firstLoad = true;
    }
  },
  created() {
    this.active = this.$store.state.tabActive;
  }
};
</script>
<style scoped>
/* .footer {
      width: 100%;
      position: fixed;
      bottom: 0;
    }
    .foot {
      text-align: center;
    } */

.btnBox {
  display: flex;
  justify-content: space-around;
  margin: 0.5rem;
}
.auditNote {
  border: 1px solid #ddd;
}
.button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  color: white;
  font-size: 0.875rem;
}
.button p {
  width: 50%;
  text-align: center;
  padding: 0.5rem 0;
  margin: 0;
}

.button .pass {
  background: #007acc;
}

.button .notPass {
  background: #cd3333;
}
</style>