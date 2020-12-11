<template>
  <div class>
    <van-nav-bar :title="title" class="header" fixed left-arrow @click-left="onClickLeft"/>
      <div class="clinic_box">
        <div v-if="status=='3'?true:false" class="pass"></div>
        <div v-if="status=='4'?true:false" class="nopass"></div>
         <ul>
            <li v-for="(obj, index) in this.modeData" :key="index">
              <van-cell v-if="obj.type=='cell'" :title="obj.field" size="large" />
                <van-cell-group v-if="index == 2 && obj.noteType ==1" >
                <van-field
                  v-model="obj.value"
                  :label="obj.field"
                  :readonly="obj.readonly"
                  :placeholder="obj.placeholder"
                  :name="obj.id"
                  :required="obj.required"
                />
                </van-cell-group>
                <van-cell-group v-if="index != 2 && obj.type =='text'">
                <van-field
                  v-model="obj.value"
                  :label="obj.field"
                  :readonly="obj.readonly"
                  :placeholder="obj.placeholder"
                  :name="obj.id"
                  :required="obj.required"
                />
                </van-cell-group>
                <van-cell-group v-if="obj.type=='textarea'">
                  <van-field
                      v-model="obj.value"
                      :label="obj.field"
                      type="textarea"
                      :border='true'
                      :placeholder="obj.placeholder"
                      :name="obj.id"
                      :required="obj.required"
                      :readonly="obj.readonly"
                      maxlength="1000"
                      rows="3"
                  />
              </van-cell-group>
               <van-cell-group v-if="obj.type=='teacontent'">
                  <van-field
                      v-model="teacontent"
                      :label="obj.field"
                      type="textarea"
                      :border='true'
                      :name="obj.id"
                      :readonly="status>2?true:false"
                      maxlength="1000"
                      rows="3"
                  />
              </van-cell-group>
               <van-cell-group v-if="obj.type=='date'">
                  <van-field
                      :value="obj.value"
                      :label="obj.field"
                      :placeholder="obj.placeholder"
                      :name="obj.id"
                      :required="obj.required"
                      readonly="readonly"
                  />
             </van-cell-group>
              <div v-if="obj.type=='filesVOS'" class="filename">
                <label class="lable">{{obj.field}}</label>
                {{obj.attachmentList}}
                <div class="file_box">
                  <div
                    class="fileList"
                    :key="index"
                    v-for="(file, index) in obj.value"
                    @click="show_filetea($event, file.path, index)">
                    <img :src="file.path" v-if="isImgtea(file.path)">
                    <div v-if="!isImgtea(file.path)" class="boxfile">
                      <van-icon name="description"/>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        <van-dialog
          v-model="shwoFiletea.flag">
          <img v-if="isImgtea(shwoFiletea.url)" :src="shwoFiletea.url" width="100%">
          <div class="fileImg" v-if="!isImgtea(shwoFiletea.url)">
            <van-icon name="description"/>
          </div>
          <div class="title-file" v-if="!isImgtea(shwoFiletea.url)">该文件类型暂不支持查看</div>
        </van-dialog>
        <div class="bottombtn" v-if="type == 1?true:false">
          <p @click="onReturn()">退回</p>
          <p @click="onClickaudit()">通过</p>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: "LearningExperience",
  computed: {
  },
  components: {},
  data() {
    return {
      type:1,// 判断进入的页面字段 1.如果为1就是待审核进入  2.如果为2就是已审核进入
      id:null,
      title:"跟师心得",
      teacontent:"",//审核评语
      status:0,
      shwoFiletea:{
        flag:false,
        url:""
      },
      modeData :[
            {
              field: "学员姓名：",
              type: "text",
              required: false,
              readonly: true,
              name:"studentName",
              value:"",
              noteType:"",
            },
            {
              field: "记录日期：",
              type: "date",
              readonly: true,
              name:"createTime",
              value:"",
              required: false
            },
            {
              field: "典籍名称：",
              type: "text",
              readonly: true,
              noteType:"",
              value:"",
              name:"classicsName",
              required: false,
              placeholder: "典籍名称"
            },
            {
              field: "学习心得：",
              type: "textarea",
              readonly: true,
              border:true,
              name:"studyNotes",
              required: false,
              value: "",
            },
             {
              field: "附件：",
              type: "filesVOS",
              name:"filesVOS",
              readonly: true,
              value:"",
              required: false
            },
            {
              field: "导师评语",
              type: "cell",
            },
            {
              field: "导师评语：",
              type: "teacontent",
              border:true,
              name:"teacontent",
              required: true,
              value: "",
            },
          ]
    };
  },
  methods: {
    pageInit(){
        this.type = this.$route.params.pagetype;
        this.id  = this.$route.params.id;
        this.getNotesData();
    },
    getNotesData(){
        let params={
          id: this.id
        }
        this.utils.ajax({
          method: "post",
          data: params,
          url: this.api.findNoneById,
          success: data => {
              this.title = this.utils.getValueByKey(this.$store.state.noteType, data.noteType);
              this.teacontent = data.auditRemark;
              this.status = data.status;
              this.modeData.forEach((item,index)=>{
                  if(data.hasOwnProperty(item.name)){
                     item.value = data[item.name];
                     if(item.name = "classicsName"){
                        item.noteType = data.noteType;
                     }
                  }
              });
              console.log(this.modeData);
          }
        })
    },
    show_filetea(e, url, index) {
        e.stopImmediatePropagation();
        this.shwoFiletea.flag = true;
        this.shwoFiletea.url = url;
        this.shwoFiletea.index = index;
    },
    isImgtea(str) {
      if (/.jpg/.test(str) || /.JPG/.test(str) || /.jpeg/.test(str) || /.JPEG/.test(str) || /.png/.test(str) || /.gif/.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    onClickLeft(){
      this.utils.goBack(this);
    },
    onReturn(){
      this.teacharaudit(4);//不通过
    },
    onClickaudit(){
      this.teacharaudit(3);//通过
    },
    teacharaudit(num){
      if( this.utils.trim(this.teacontent) == ""){
        this.Toast('请输入导师评语');
      }else{
        //审核跟师心得
          let params = {
              id:this.id,
              auditRemark: this.teacontent,
              status:num
          }
          this.utils.ajax({
            method: "post",
            data: params,
            url: this.api.ReviewsupervisorNote,
            success: data => {
              this.utils.goBack(this);
            }
        })
      }
    },
  },
  created() {
     this.pageInit();
  }
};
</script>
<style  scoped>
.clinic_box {
  background: white;
  position: relative;
}
.nopass{
  position: absolute;
  width: 4rem;
  height: 4rem;
  top: .5rem;
  right: 1rem;
  z-index: 10000;
  background:url("../../assets/images/home/pic10_02.svg") no-repeat;
}
.pass{
  position: absolute;
  width: 4rem;
  height: 4rem;
  top: .5rem;
  right: 1rem;
  z-index: 10000;
  background:url("../../assets/images/home/pic10_01.svg") no-repeat;
}
.clinic_box ul{
  width: 100%;
}
.clinic_box >>>.van-uploader {
  font-size: 3rem;
  border-radius: 0.5rem;
  border: 0.04rem solid #e1e1e1;
  width: 3rem;
  height: 3rem;
}
.lable {
  display: block;
  padding: 0.5rem 1rem;
}
.clinic_box >>>ul .van-field--min-height .van-field__control{
  border: 0.04rem solid #e1e1e1;
}

.file_box {
  padding: 0.5rem 1rem;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
.file_box > div {
  display: inline-block;
}
.fileList{
  display: inline-block;
  position: relative;
  margin-right: 0.573rem;
  margin-bottom: 0.5rem;
  width: 3rem;
  height: 4rem;
}
.fileList>img{
   width: 100%;
   height: 100%;
   border-radius: 0.5rem;
}
.bottombtn {
  width: 100%;
  color: white;
  font-size: 0.9rem;
  text-align: center;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-between;
}
.bottombtn p:nth-of-type(1) {
  background: #007acc;
  width: 50%;
  padding: 0.5rem 0;
  margin: 0;
}
.bottombtn p:nth-of-type(2) {
  background: #009900;
  width: 50%;
  padding: 0.5rem 0;
  margin: 0;
}
.clinic_box .img {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_03.svg") no-repeat;
}
.clinic_box .img1 {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_02.svg") no-repeat;
}
.clinic_box .img3 {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_01.svg") no-repeat;
}
</style>