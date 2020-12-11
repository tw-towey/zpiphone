<template>
    <div>
        <van-nav-bar
        title="工作履历"
        right-text="新增"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
        class="header"
      />
      <div class="section">
          <section>
              <div class="left">
                  <p>单位名称：单位100</p>
                  <p>起始时间：2017-05-11</p>
              </div>
              <van-icon name="arrow"  size="40px"/>
          </section>
      </div>
    </div>
</template>
<script>
    export default{
        name:"Record",
        data(){
            return {

            }
        },
        methods:{
            onClickLeft(){
                this.utils.goBack(this);
            },
            onClickRight(){
                this.$router.push("/Take")
            }
        }
    }
</script>
<style scoped>
p{
    margin: 0;
}    
.section{
    background: #ffffff;
    box-sizing: border-box;
    padding: .5rem .8rem;
    
}
.section section{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: .01rem solid gray;
    padding: .8rem  .5rem .5rem 2rem;
    box-sizing: border-box;
    border-radius: 1rem;
}
</style>