<template>
    <div>
        <van-nav-bar
        title="新增工作记录"
        left-arrow
        @click-left="onClickLeft"
        class="header"
      />
      <div class="content">
          <label style="margin-top: 0rem;">
              <span>单位名称:</span>
              <input type="text" v-model="inp" placeholder="请输入"/>
          </label>
          <label @click="showPopup">
            <span>起始时间:</span>
            <p>
                <input type="text" v-model="inp" placeholder="请选择"/>
                <van-icon name="arrow" />
            </p>
         </label>
         <label>
            <span>结束时间:</span>
            <p>
                <input type="text" v-model="inp" placeholder="请选择"/>
                <van-icon name="arrow" />
            </p>
            
        </label>
        <label>
          <span>部门:</span>
          <input type="text" v-model="inp" placeholder="请输入"/>
       </label>
        <label>
           <span>职位:</span>
          <input type="text" v-model="inp" placeholder="请输入"/>
        </label>
        <label>
          <span>联系人:</span>
          <input type="text" v-model="inp" placeholder="请输入"/>
        </label>
        <label>
          <span>联系电话:</span>
          <input type="text" v-model="inp" placeholder="请输入"/>
        </label>
      </div>
      <van-popup v-model="show" position="bottom" :style="{ height: '30%' }"
         value-key="tableName"
         @cancel="show = false"
         @confirm="selectStudyStatus"
        >
          内容
      </van-popup>
    </div>
</template>
<script>
    export default{
        name:"Take",
        data(){
            return{
               show:false,
               tableName:"123"
            }
        },
        methods:{
            onClickLeft(){
                this.utils.goBack(this);
            },
            showPopup(){
                console.log("show")
                this.show=true
            }
        }
    }
</script>
<style scoped>
    p{
        padding: 0;
        margin: 0;
    }
    .content{
        padding: .8rem;
        box-sizing: border-box;
    }
    .content label{
         display: flex;
         justify-content: space-between;
         border-bottom:.01rem solid gray;
         margin-top: 1rem;
    }
    .content input{
        border: none;
        background: none;
        text-align: right;
    }
    .content label p{
        display: flex;
        align-items: center;
    }
</style>