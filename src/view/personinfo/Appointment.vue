<template>
  <div>
    <van-nav-bar title="教师聘任" class="header" fixed left-arrow @click-left="onClickLeft" right-text="新增" @click-right="addCert"/>
    <div style="margin-top:2.5rem;">
      <div style="color:#969799;font-size:12px;padding:.4rem">(长按可删除)</div>
      <van-popup v-model="isShowModel" position="top" :style="{ width:'100%', height: '100%' }">
        <Addcommon v-if="isShowModel" :templateData = "commonList" :headerModel="headerModel" :editModel="editModel"></Addcommon>
      </van-popup>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="getData">
        <div
          class="fcolor_grey fsize_mini"
          v-for="(item,index) in list"
          :key="index"
          @touchstart="getTouchStart($event,item, index)" @touchend="getTouchEnd()"
          @click="detailItem(item,index)"
        >
          <van-cell>
            <div class="box">
              <div class="left_text">
                <div class="fsize_l filename">{{item.name}}</div>
                <div class="fsize_s fcolor_grey filename">聘任类型：{{ utils.getValueByKey(commonList[0].option ,item.type) }}</div>
                <div class="fsize_s fcolor_grey filename">聘任时间：{{ utils.formatDate(item.engageTime,'yyyy-MM-dd') }}    </div>
              </div>
              <img src="@/assets/images/page/wendangzhongxin.png" alt @click.stop="showfile(item)"/>
              <div class="right-icon tw-fright"></div>
            </div>
          </van-cell>
        </div>
      </van-list>
    </div>
  </div>
</template>
<script>
import Addcommon from "./Addcommon"
export default {
  name: "Appointment",
  components: {},
  data() {
    return {
      levelShow: false,
      searchstr: "",
      deptShow: false,
      loading: true,
      finished: false,
      eventLoop:null,
      editModel: false,
      list: [],
      isShowModel:false,
      page:1,
      itemDetail:null,
      headerModel:{
          title: "新增",
          text: "提交",
          onClickLeft:()=>{
              this.isShowModel = false;
          },
          onClickRight:()=>{
              this.save();
              this.isShowModel = true;
          }
      },
      commonList:[
        {
          id: "type",
          name: "聘任类型",
          required: true,
          value: "",
          type: "picker",
          selectShow: false,
          placeholder: "聘任类型",
          option: [],
          key: ""
        },
        {
          id: "name",
          name: "聘任名称",
          value: "",
          type: "text",
          required: true,
          selectShow: false,
          placeholder: "聘任名称",
          key: ""
        },
        {
          id: "engageTime",
          name: "聘任时间：",
          value: "",
          selectShow: false,
          required: true,
          type: "date",
          issshow:true,
          placeholder: "聘任时间"
        },
        {
          id:'',
          type: "fgBorder",
          index: 4,
          isShow: true
        },
        {
          id: "filesVOList",
          name: "聘任证书：",
          value: "",
          issshow:true,
          required: false,
          selectShow: false,
          placeholder: "附件",
          type: "file",
        },
      ],
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },

    addCert() {
        this.editModel = false;
        this.commonList.forEach((item, index) => {
            item.value = '';
        })
        this.isShowModel = true;
    },
    detailItem(item,index){
        this.itemDetail = item;
        this.editModel = true;
        this.isShowModel = true;
        this.commonList.forEach(it => {
            if( item.hasOwnProperty(it.id)){
                if(it.type == 'picker'){
                    it.value = this.utils.getValueByKey(it.option,item[it.id]);
                    it.key = item[it.id];
                }else if(it.type == "date"){
                    it.value = this.utils.formatDate(item[it.id],"yyyy-MM-dd");
                }else if(it.type == "file"){
                    it.value = item[it.id][0] || "";
                }else if(it.id){
                    it.value = item[it.id];
                }
            }
        })
    },
    save(){
      let obj = {};
      let flage = false;
      this.commonList.forEach(item => {
            if((item.value == '' || item.value == null) && item.required ){
                this.Toast( '请输入' + item.placeholder)
                flage = true;
            }
            if (item.type == "file") {
                if(item.value == ""){
                    obj[item.id] = [];
                }else{
                    obj[item.id] = [item.value];
                }
            } else if (item.type == "picker") {
                obj[item.id] = item.key;
            } else {
                obj[item.id] = item.value;
            }
      });
      if(flage){
          return;
      }
      if(this.editModel){
           obj.id = this.itemDetail.id;
      }
      this.utils.ajax({
          url: this.api.teacherEngageSaveOrUpdate,
          data: obj,
          method: "POST",
          success: data => {
            this.Toast("保存成功！");
            this.isShowModel = false;
            this.getData(true)
          }
        },
        false
      );
    },
    showfile(item) {
      if(item.filesVOList.length > 0) {
        this.utils.openMultiTypeFile(item.filesVOList[0].path);
      }else{
          this.Toast("暂无附件")
      }
    },
    getData(isRestPage) {
     this.editModel = false;
     if (isRestPage) {
        //重置page
        this.page = 1;
      } else {
        this.page = Math.ceil(this.list.length / 20) + 1;
      }
      this.utils.ajax({
        url: this.api.teacherEngageList,
        method: "POST",
        data: {
            teacherId : this.$store.state.userInfoCaid
        },
        institution: true,
        success: data => {
          if (data.length === 0) {
            this.finished = true;
            this.loading = false;
            return;
          }
          if (isRestPage) {
            this.list = data.content;
          } else {
            this.list = this.list.concat(data.content);
          }
          console.info(this.list.content);
          // 加载状态结束
          this.loading = false;
          // 数据全部加载完成
          if (!data.length || data.length <= this.$store.state.pageSize) {
            this.finished = true;
          }
        }
      });
    },
    delItem(id) {
        this.utils.ajax({
        url: this.api.teacherEngageDelete,
        method: "post",
        data: {id},
        success: res => {
          this.Toast("删除成功！");
          this.getData(true);
        }
      });
    },
    getTouchStart(e,item,index){
       clearTimeout(this.eventLoop);
	   this.eventLoop = setTimeout(()=>{
           this.Dialog.confirm({
            title: "提示",
            message: "删除不可恢复,是否删除?",
            }).then(() => {
                this.delItem(item.id);
            });
	   },1000);
    },

    getTouchEnd() {
       clearTimeout(this.eventLoop);
    },
    
    enterCertificateManager() {
        this.$router.push({ name: "teacherPersonlnfo" });
    },
    teachInfoData() {
      this.utils.ajax({
        url: this.api.selectTeacherById,
        method: "post",
        data: {
          teacherId: this.$store.state.userInfo.human.caId
        },
        success: res => {
          if(res !== null){
           this.userInfo = res;
          }
        }
      });
    },
  },
  components: {
      Addcommon
  },
  created() {
    this.utils.getDictionaries({ 
        type: "teacherEngageType"
    },this.commonList[0],(data)=>{
    });
  },
  mounted() {
    this.getData(true);
  }
};
</script>
<style scoped>
.left_text {
  padding-left: 60px;
  width: calc(100% - 80px);
}
.filename {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tw-fleft {
  float: left;
}
.tw-fright {
  float: right;
}

.box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.box img {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 40px;
}
.title {
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.navbar_margin-top-m {
  margin-top: 70px;
}
.navbar_margin-top-l {
  margin-top: 120px;
}
.tw_grey {
  background-color: gray;
}
.tw_FF9900 {
  background-color: #ff9900;
}
.cell-db-status {
  vertical-align: middle;
}
.cell-db-status_done {
  background-color: red;
}
.cell-db-status_do {
  background-color: #ff9900;
}
.fcolor_grey{
    color: gray;
}
.info {
  vertical-align: middle;
}
.info_chou {
  background-color: grey;
  color: white;
}
.info_jing {
  background-color: #0bb20c;
}
.loadmore_padding {
  padding-bottom: 115px;
}
.list-item-type {
  display: inline-block;
  width: 14.625rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  vertical-align: middle;
}
.right-icon {
  padding-right: 14px;
  position: relative;
}
.right-icon:after {
  content: " ";
  display: inline-block;
  height: 6px;
  width: 6px;
  border-width: 2px 2px 0 0;
  border-color: #c8c8cd;
  border-style: solid;
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
}
</style>

