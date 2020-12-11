<template>
  <div>
    <van-nav-bar title="门诊笔记" class="header" fixed left-arrow @click-left="onClickLeft" :right-text="code ==='student' ? '保存' : ''" @click-right="saveData()"/>
    <div class="layout_content">
         <!-- <van-field
                v-for="(item,index) in listData"
                :value="item.value"
                :key="index"
                input-align="right"
                :label="item.name"
                disabled="false"
                type="text"
        /> -->
        <van-field
            v-model="studentInfo.note"
            rows="18"
            autosize
            :disabled="code !== 'student'"
            type="textarea"
            input-align="left"
            :placeholder="placeholder"
        />
        <div class="van-cell van-cell--borderless van-field">
              <span style="display:inline-block; min-width:95%">
               附件：
              </span>
              <div class="uploadFile" v-if="code === 'student'">
                <van-uploader :after-read="onRead" accept multiple>
                  <van-icon name="plus" size="large"/>
                </van-uploader>
              </div>
        </div>
        <div v-if="fileData && fileData.length > 0" class="filebox">
            <span v-for="(img,index) in fileData" :key="index" class="fileImg" >
                <img :src="img.url" alt="" @click="show_file($event, img.url)">
                <span style="color: rgb(26, 127, 233);" @click="deleteFile()">
                    删除
                </span>
            </span>
            
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DoorNotes",
  components: {},
  data() {
    return {
      code:"",
      studentInfo:{},
    //   listData: [
    //       {name: "就诊时间：",value: "12"},
    //       {name: "患者姓名：",value: "23"},
    //       {name: "性别：",value: "34"},
    //       {name: "年龄：",value: "34"},
    //   ],
      message:"",
      placeholder: "就诊时间:\n\n患者姓名：\n\n性别：\n\n年龄：\n\n中医主症:\n\n中医诊断：\n\n中医治则：\n\n中医处方：\n\n用法用量：",
      fileData:[]
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    onClickRight() {
      this.sood();
    },
    saveData(){
        var params = {
          id: this.studentInfo.id,
          attachmentUrl: this.fileData[0] ? this.fileData[0].url : undefined,
          note: this.studentInfo.note
        };
        if(!params.note){
            return this.Toast("门诊笔记不可为空")
        }
        this.utils.ajax({
          url: this.api.attendanceWithTeacherSave,
          method: "POST",
          data: params,
          success: data => {    
            this.Toast("保存成功");
          }
        });
    },
    onRead(file) {
      if(this.utils.checkSuffix(file.file.name)){
          if(this.fileData.length > 0){
            this.Dialog.confirm({
                title: "提示",
                message: "当前已有文件,是否替换？"
            })
            .then(() => {
                this.updataFile(file);
            })
            .catch(() => { });
          }else{
            this.updataFile(file);
          }
      }else{
        this.Toast("请选择bmp, jpg, jpeg, png, gif的格式图片");
        return false;
      }
    },
    show_file(e, url) {
      if(url){
        this.utils.openMultiTypeFile(url);
      }
    },
    deleteFile(){
        this.utils.ajax({
          url: this.api.attendanceWithTeacherSave,
          method: "POST",
          data: {
            id: this.studentInfo.id,
            attachmentUrl: "",
            note: this.studentInfo.note
          },
          success: data => {    
              this.fileData = [];
             this.Toast("删除成功");
          }
        });
    },
    updataFile(file) {
      let _this = this;  
      let flag = true;
      this.utils.fileUploader(file, data => {
            console.log(this.updataImgObj, data);
            _this.fileData = [data]; 
      });
    },
  },
  created() {
      this.code = this.$store.state.userInfo.currentRole.code;
      this.studentInfo = this.$route.params.item;
      if(this.studentInfo.attachmentUrl){
          this.fileData.push({ url: this.studentInfo.attachmentUrl })
      }
  }
};
</script>
<style  scoped>
.van-nav-bar__right {
  color: white;
}
.van-search {
  padding: 0.35rem;
  margin: 0;
}
.van-search .van-cell {
  padding: 0.1rem;
}
.dataLinst:nth-of-type(1) {
  margin-top: 0rem;
}
.dataLinst {
  margin-top: 0.5rem;
}
.homebody ul {
  display: flex;
  justify-content: space-between;
}
.homebody ul li {
  padding: 0.3rem 0;
  display: flex;
}
.homebody ul li span:nth-of-type(1) {
  color: #969799;
}
.span {
  width: 4.4rem;
  display: block;
}
.filebox{
    border-top: 1px solid #f2f2f2;
    background:#ffffff;
}
.fileImg img {
    padding: .4rem;
    width:4rem;
    vertical-align:middle;
    height: 4rem;
}
</style>
