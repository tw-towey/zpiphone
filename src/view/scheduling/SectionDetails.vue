<template>
    <div class="box">
        <van-nav-bar :title="scheduling.departmentName"  @click-left="onClickLeft"  class="header headers">
            <van-icon name="arrow-left" slot="left"/>
        </van-nav-bar>
        <div class="top">
            {{test.tableName}}
        </div>
        <div class="text">
            <section v-html="test.remark">
            </section>
        </div>
        
    </div>
</template>
<script>
    export default{
        name:"SectionDetails",
        components:{},
        data(){
            return {
              test:{},
              scheduling:""
            }
        },
        methods:{
            onClickLeft(){
                this.utils.goBack(this);
            }
        },
        mounted() {
            this.scheduling=this.$store.state.schedulings
            this.test=this.$store.state.test
        },
    }
</script>
<style scoped>
.box{
   display: flex;
   flex-direction: column;
    
}    
.headers{
    position: fixed;
    top: 0;
    width: 100%;
}
.text{
    width: 100%;
    height: 100%;
    background: #f2f2f2;
    padding: 0 .6rem;
    box-sizing:border-box;
}
.top{
    height:2rem;
    text-align: center;
    line-height: 2rem;
    font-size: .9rem;
    margin-top: 2.5rem;
}
section{
    width: 100%;
    height: 100%;
    background: #ffffff;
    border: .01rem solid #d7d7d7;
}
</style>