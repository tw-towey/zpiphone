<template>
    <div>
        <!--  :right-text="flag?'提交':'重新测评'" -->
        <van-nav-bar :title="scheduling.departmentName"  @click-left="onClickLeft"   class="header headers">
            <van-icon name="arrow-left" slot="left"/>
            <span slot="right" @click="sumbitTO" v-if="flag" style="color: #ffffff;">提交</span>
            <span slot="right" @click="afresh" v-else   style="color: #ffffff;">重新测评</span>
        </van-nav-bar>
       
        <van-form>
            <div class="top">
                {{test.tableName}}
            </div>
            <van-row class="row">
                <van-col span="6">
                    <p class="btn" @click="Router">量表说明</p>
                </van-col>
                
                <van-col span="18" class="col">
                    <!-- {{test.createTime.split(" ")[0]}} -->
                    <p>填表日期:<span>{{Dates}}</span></p>
                    <!--  -->
                    <p>得分:<span>{{scheduling.selfScore>0?scheduling.selfScore:""}}</span></p>
                </van-col>    
            </van-row>
            <section>
               
                <div class="item" v-for="(item,index) in test.assessQuestionList" :key="item.id" >
                    <p style="margin:0"><span v-if="item.isRequired==1">*</span>{{index+1}}、{{item.questionName}}</p>
                    <!-- <label>
                        <input type="radio" />
                    </label> -->
                 
                    <div v-if="flag">
                        <label v-for="(i,ind) in item.assessOptionList" :key="i.id"  >
                            <!-- <input type="radio" checked v-if="i.isSelect==1"/> -->
                            <!-- :disabled="true" -->
                            <input type="radio" :name="i.questionId" :value="{id:i.id,isRequired:item.isRequired}" 
                         
                            v-model="checkedValue[index]" 
                            />
                            <!--  -->
                            <span>{{i.optionName}}</span>
                        </label>
                    </div>
                    <div v-else>
                        <label v-for="(i,ind) in item.assessOptionList">
                            <input type="radio" v-if="i.isSelect==1"  :disabled="true" :checked="true"/>
                            <input type="radio" v-else :disabled="true"/>
                            <span>{{i.optionName}}</span>
                        </label>
                    </div>
                </div>
            </section>
        </van-form>
    </div>
</template> 
<script> 
    export default{
        name:"Section",
        components:{

        },
        data(){
            return {
               checkedValue:[],
               test:{},
               scheduling:"",
               schedulingId:"",
               flag:""
             }
        },
        methods:{
            onClickLeft(){
                // this.$router.go(-1)
                this.utils.goBack(this);
            },
            //重新测评
            afresh(){
                console.log(this.test.assessTableId)
                let Graduate=this.$route.query.Graduatd
                if(Graduate) return this.Toast("您无权编辑")
                let auditFlag=this.$store.auditFlag
                if(auditFlag===1) return this.Toast("您已通过测评无法重复提交")
                this.utils.ajax({
                method:"POST",
                url:this.api.infoAssess,
                data:{id:this.test.assessTableId},
                success:res=>{
                    console.log(res)
                    this.test=res
                    this.flag=true
                 }
               })
            },
            //提交测评
            sumbitTO(){
                let Graduate=this.dentId=this.$route.query.id
                if(Graduate) return this.Toast("您无权编辑")
                
                this.refer()    
            },
            //保存测评答案
            refer(){
                let obj=this.$store.state.scheduling 
                this.$set(this.test,"schedulingId",obj.id)
                this.$set(this.test,"departmentId",obj.departmentId)
                let {assessQuestionList}=this.test
                let arr1=[]
                let arr2=[]
                assessQuestionList.forEach(item=>{
                     if(item.isRequired===1){
                         arr1.push(item)
                     }
                })
        
                this.checkedValue.forEach(item=>{
                    if(item.isRequired===1){
                        arr2.push(item)
                    }
                })
                if(arr1.length==arr2.length){
                    let arr=[]
                    assessQuestionList.forEach(item=>{
                      arr.push(item.assessOptionList)
                    })
                    // let arrs=arr.flat(Infinity)
                    let arrs=this.flatten(arr)
                    arrs.forEach(item=>{
                    this.checkedValue.forEach(items=>{
                         if(item.id==items.id){
                             this.$set(item,"isSelect",1)
                         }
                    })
                   })
                   this.utils.ajax({
                       method:"post",
                       url:this.api.TableQuestion,
                       data:this.test,
                       success:res=>{
                          // console.log(res);
                           this.Toast("提交成功")
                           this.flag=false
                           this.utils.goBack(this);
                       }
                   })
                }else{
                    this.Toast("带*号的为必选项")
                }
            },
            flatten(arr){
                  while (arr.some(item => Array.isArray(item))){
                  arr = [].concat(...arr); // 如果你明白展开运算符的作用，是不是很简单？
                 
                }
                return arr;
            },       
            keep(){
                let {assessQuestionList}=this.test
            },
            Router(){      
                this.$router.push("/SectionDetails")
            },
            backTop(){
                    document.getElementsByClassName('item')[0].scrollTop = 0
            },
        },
        created() {
            this.scheduling=this.$store.state.schedulings
            console.log(this.scheduling)
            this.flag=this.scheduling.isSelf===0?true:false
            this.test=this.$store.state.test
            console.log(this.test)
           
        },
        mounted() {
            let Graduate=this.$route.query.Graduatd
        },
        computed:{
            // times(){
            //     let 
            //     return 
            // }
            Dates:function(){
                let times="";
                if(!this.test){
                    return "";
                }
                times=this.test.createTime.split(" ")[0]
                return times
            }
        } 
      
    }
</script>
<style scoped>
.headers{
    position: fixed;
    top: 0;
    width: 100%;
}
.top{
    height: 1.5rem;
    width: 100%;
    text-align: center;
    line-height: 2rem;
    background:whitesmoke;
    font-size: .9rem;
    margin-top: 2.5rem;
}
.row{
    background:whitesmoke;
}
.bottom{
    display: flex;
}
.b_right{
    display:flex;
}
.van_button{
   margin-left: .1rem;
}
.col{
    display: flex;
}
.col p:nth-child(1){
    width: 60%;
}
.col span{
    margin-left: .6rem;
    border-bottom:0.01rem solid ;
    padding: 0 .5rem .3rem;
}
.col  span:nth-child(2){
    padding: 0 1rem .3rem;
}
.col p:nth-child(2){
    width: 40%;
}

.van-col{
    height: 2rem;
    display: flex;
    align-items: center;
}
section{
    background: white;
    padding:.3rem 0.8rem 0;
}
.item:nth-child(1){
    margin-top: 0;
}
.item{
    margin-top: .3rem;
}
.item label{
    display: block;
    display: flex;
    align-items: center;
    margin-left: 1rem;
    /* margin-top: .2rem; */
}
.item label input[type='radio']{
    display: block;
    color: gray;
}
.item label input[type='radio']:after{
    background: gray;
    color: gray;
}
.item label span{
    margin-top: .2rem;
}
.group{
    margin-left: 1.3rem;
}
.btn{
    border-radius: 0.05rem;
    border:0.01rem solid blue !important;
    padding: 0.1rem 0.4rem;
    /* font-size: .2rem; */
    border-radius: .3rem;
    margin-left: .5rem;
    color: blue!important;
    font-weight: 500;
   
}
.radio{
    background: red !important;
}
</style>