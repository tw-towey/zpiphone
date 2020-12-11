<template>
  <div>
    <van-nav-bar title="奖惩情况" class="header" fixed left-arrow @click-left="onClickLeft" right-text="新增" @click-right="addCert"/>
    <div style="margin-top:2.5rem;">
      <van-popup v-model="isShowModel" position="top" :style="{ width:'100%', height: '100%' }">
        <Addcommon v-if="isShowModel" :templateData = "commonList" :headerModel="headerModel" :editModel="editModel"></Addcommon>
      </van-popup>
       <van-tabs v-model="active" @change="changeTab">
            <div style="color:#969799;font-size:12px;padding:.4rem">(长按可删除)</div>
            <van-tab title="奖励情况">
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
                                <div class="fsize_l filename">获奖类型：<span> {{  item.rewardType }} </span> </div>
                                <div class="fsize_s fcolor_grey filename">获奖机构： <span> {{item.rewardInstitution}}  </span> </div>
                                <div class="fsize_s fcolor_grey filename">获奖时间：<span> {{ utils.formatDate(item.rewardDate,'yyyy-MM-dd') }} </span>     </div>
                            </div>
                            <div class="right-icon tw-fright"></div>
                        </div>
                    </van-cell>
                    </div>
                </van-list>
            </van-tab>
             <van-tab title="惩罚情况">
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
                                <div class="fsize_l filename">惩罚类型：<span> {{item.punishmentType}} </span> </div>
                                <div class="fsize_s fcolor_grey filename">惩罚机构：<span> {{ item.punishmentInstitution  }} </span> </div>
                                <div class="fsize_s fcolor_grey filename">惩罚时间：<span> {{ utils.formatDate(item.punishmentDate,'yyyy-MM-dd') }} </span>     </div>
                            </div>
                            <div class="right-icon tw-fright"></div>
                        </div>
                    </van-cell>
                    </div>
                </van-list>
            </van-tab>
        </van-tabs>
      
    </div>
  </div>
</template>
<script>
import Addcommon from "./Addcommon"
import { rewards , punishment} from './config.js';

export default {
  name: "RewardsPun",
  components: {},
  data() {
    return {
      levelShow: false,
      searchstr: "",
      deptShow: false,
      active:0,
      loading: true,
      finished: false,
      viewApi:null,
      saveApi:null,
      deleteApi:null,
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
                    if(it.value){
                        it.value = {
                            path: item[it.id] || ""
                        }
                    }
                }else if(it.id){
                    it.value = item[it.id];
                }
            }
        })
    },
    changeTab(){
         if(this.active === 0){
            this.commonList = rewards;
            this.viewApi = this.api.selectTeacherReward;
            this.saveApi = this.api.saveTeacherRewardRequest;
            this.deleteApi = this.api.deleteTeacherReward;
         }else if(this.active === 1){
            this.commonList = punishment;
            this.viewApi = this.api.selectTeacherPunishment;
            this.saveApi = this.api.saveTeacherPunishment;
            this.deleteApi = this.api.deleteTeacherPunishment;
         }
        this.getData(true);
    },
    save(){
      let obj = {};
      let flage = false;
      this.commonList.forEach(item => {
            if((item.value == '' || item.value == null) && item.required ){
                this.Toast('请输入必填项')
                flage = true;
            }
            if (item.type == "file") {
                if(item.value == ""){
                    obj[item.id] = [];
                }else{
                    obj[item.id] = item.value.path;
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
          url: this.saveApi,
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
      this.utils.openMultiTypeFile(item.filesVOList[0].path);
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
        url: this.viewApi,
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
        url: this.deleteApi,
        method: "post",
        data: {
            id,
            isDelete:1
        },
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

  },
  components: {
      Addcommon
  },
  created() {
    this.changeTab();
  },
  mounted() {
  }
};
</script>
<style>
/* .left_text {
  width: calc(100% - 80px);
} */
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

