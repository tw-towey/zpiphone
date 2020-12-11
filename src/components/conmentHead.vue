<template>
  <div>
    <div v-if="headList.leftText == null" class="only-box-top">
      <van-nav-bar :title="headList.title" :right-text="headList.rightTitle"
                   class="header" fixed left-arrow @click-left="onClickLeft"/>
    </div>
    <div v-else class="more-box-top">
      <van-nav-bar :title="headList.title" :right-text="headList.rightTitle"
                   class="header" fixed left-arrow @click-left="onClickLeft"
                   @click-right="headList.cellSelected ? headList.cellSelected() : ()=>{} "/>
      <div v-if="!headList.CommonShow">
        <div class="zpHeadContent">
          <div class="headContent-box">
            <div v-if="headList.leftClick" @click="headList.leftClick()" :class="headList.leftColor">
              {{headList.leftText}}
            </div>
            <div v-if="headList.rightClick" @click="headList.rightClick()" :class="headList.rightColor">
              {{headList.rightText}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  /*首页*/
  export default {
    props: ['headList'],
    name: "homePage",
    components: {},
    data() {
      return {};
    },
    methods: {
      onClickLeft() {
        this.headList.onClickLeft();
      }
    },
    mounted() {
    },
    created() {
    }
  };
</script>

<style scoped>
  .i-right .van-nav-bar__right {
    font-size: 1.5rem !important;
  }

  .only-box-top {
    height: 2.5rem;
  }

  .more-box-top {
    height: 5rem;
    background: #1a7fe9;
  }

  /* .zpHead {
  } */
  .zpHeadContent {
    position: absolute;
    width: 100%;
    margin: 0 auto;
    top: 0rem;
  }

  .zpHeadCon {
    width: 92%;
    background: white;
    height: 6rem;
    margin: 0 auto;
    border-radius: 10px;
  }

  .meuw {
    margin-top: 2.5rem;
  }

  .zpHeadConHead {
    width: 100%;
    height: 0.5rem;
    background: #fea831;
    border-radius: 5px 5px 0 0;
  }

  .van-hairline--bottom::after {
    border-bottom-width: 0rem !important;
  }

  .headContent-box {
    margin-top: 2.5rem;
    padding: 0rem 1rem;
    height: 100%;
    line-height: 2.5rem;
    display: flex;
    justify-content: space-between;
  }

  .white {
    color: white;
  }
</style>
