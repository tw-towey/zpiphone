<template>
    <div>
        <van-nav-bar :title="title" class="header" fixed left-arrow @click-left="onClickLeft"></van-nav-bar>
        <div v-if="show" class="layout_content">
            <div>
                <ul class="bigBox">
                    <li :class="item.id" v-for="(item,i) in config.slice(0,3)" :key=i>
                        <span v-if="i != 0">{{item.name}}：</span>
                        <span v-if="item.type == 'text'" v-html="dataList[item.id]"></span>
                        <span v-if="item.type == 'btn'" v-html="(dataList[item.id] || 0)+'人'" @click="goActivityNum(item.id)"></span>
                    </li>
                </ul>
                <div class="line"></div>
                <ul class="bigBox2">
                    <li :class="item.id" v-for="(item,i) in config.slice(3,7)" :key=i>
                        <span class="listLeft">{{item.name}}</span>
                        <span v-if="item.type == 'text'" class="listRight" v-html="dataList[item.id]"></span>
                        <span v-if="item.type == 'btn'" class="listRight btn" v-html="(dataList[item.id] || 0)+'人'" @click="goActivityNum(item.id)"></span>
                    </li>
                </ul>
                <div class="line"></div>
                <ul class="bigBox2">
                    <li :class="item.id" v-for="(item,i) in config.slice(7,10)" :key=i class="clearfix">
                        <span class="fl">{{item.name}}</span>
                        <span v-if="item.type == 'text'" class="fl" v-html="dataList[item.id]"></span>
                        <span v-if="item.type == 'btn'" class="fr btn" v-html="(dataList[item.id] || 0)+'人'" @click="goActivityNum(item.id)"></span>
                    </li>
                </ul>
                <div class="line"></div>
                <ul class="bigBox2">
                    <li v-for="(item,i) in config.slice(10,11)" :key=i>
                        <span>{{item.name}}</span>
                    </li>
                    <li class="detail">
                        <div v-html="dataList['detail']"></div>
                    </li>
                </ul>
                <div class="line"></div>
                <div class="back-box-info bigBox2" style="margin-bottom:.3rem" v-for="(item,index) in fileConfig" :key="index">
                    <div class="h3title">{{item.name}}</div>
                    <div style="padding:1rem;display:flex;">
                        <div class="fileImg" v-if="dataList[item.id] && dataList[item.id].length">
                            <div style="display:inline-block;" v-for="(img,index) in dataList[item.id]" :key="index">
                                <img v-if="isImg(img.path)" :src="img.path" alt="" @click="showfile(img.path,index)" />
                                <img v-else src="@/assets/images/page/wendangzhongxin.png" alt=""  @click="showfile(img.path)">
                                <van-icon  name="close" class="delete-icon" @click="deleteImg(img,index)"/>
                            </div>
                        </div>
                        <div class="uploadFile" @click="activeImgObj(index)">
                            <van-uploader :disabled="dataList.disabled" :after-read="onRead" accept multiple>
                            <van-icon name="plus" />
                            </van-uploader>
                        </div>
                    </div>
                </div>
                <!-- <ul class="bigBox2">
                    <li v-for="(item,i) in config.slice(11,15)" class="f0Bodeer" :key=i>
                        <span>{{item.name}}</span>
                    </li>
                    <li class="detail">
                        
                        <div v-html="dataList['detail1']"></div>
                    </li>
                </ul> -->
            </div>
        </div>
        <div v-if="!show" class="layout_content">
            <van-search v-if="!flag" v-model="value" placeholder="请输入搜索关键词" show-action shape="round" @search="onSearch">
                <div slot="action" @click="onSearch">搜索</div>
            </van-search>
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                <ul style="padding: 0">
                    <li class="popList" v-for="(item,i) in popleList" :key=i>
                        <div v-if="flag" class="clearfix">
                            <span style="">{{item.humanName||'无'}}</span>
                            <span>{{item.cellPhone||'无'}}</span>
                        </div>
                        <div v-if="!flag" class="clearfix">
                            <span>{{item.humanName||'无'}}</span>
                            <span>（</span>
                            <span>{{item.role}}</span>
                            <span>）</span>
                            <span>{{item.cellPhone||'无'}}</span>
                        </div>
                        <div v-if="flag">
                            <div class="message">
                                <span>{{item.role}}</span>
                            </div>
                        </div>
                        <div v-if="!flag">
                            <div class="message">
                                <span>签到时间：</span>
                                <span :class="item.timeStyle?'timeColor':''">{{item.dateTime}}</span>
                            </div>
                            <div class="message">
                                <span>参培年份：</span>
                                <span>{{item.traineeYear}}级</span>
                            </div>
                            <div class="message">
                                <span>专业：</span>
                                <span>{{item.majorCode}}</span>
                            </div>
                            <div class="message">
                                <span>科室：</span>
                                <span>{{item.departmentName || '无'}}</span>
                            </div>
                            <div class="message">
                                <span>身份类型：</span>
                                <span>{{item.idType}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </van-list>
        </div>
    </div>
</template>
<script>
export default {
  name: "ActivityMssage",
  data() {
    return {
      value: "",
      config: [
        { name: "活动标题", id: "title", type: "text" },
        { name: "发布时间", id: "timeOfRelease", type: "text" },
        { name: "活动时间", id: "activityTime", type: "text" },
        { name: "活动地点", id: "locationOfTeaching", type: "text" },
        { name: "活动级别", id: "teachingLevel", type: "text" },
        { name: "主讲人", id: "name", type: "text" },
        { name: "发布人", id: "humanName", type: "text" },
        { name: "活动接收人数", id: "receiverCount", type: "btn" },
        { name: "活动报名人数", id: "numOfSignUp", type: "btn" },
        { name: "活动签到人数", id: "numOfSignIn", type: "btn" },
        { name: "活动详情", id: "detail", type: "text" },
      ],
      fileConfig:[
        { name: "课件", id: "attachmentListType1", type: "text" },
        { name: "教案", id: "attachmentListType2", type: "text" },
        { name: "活动照片", id: "attachmentListType3", type: "text" },
        { name: "手册照片", id: "attachmentListType4", type: "text" },
      ],
      updataImgObj:{},
      fileType:1,
      dataList: {},
      title: "活动详情",
      show: true,
      popleList: [],
      currentPage: 1,
      loading: true,
      finished: false,
      numType: "",
      flag: true,
      endTime: '',
      startTime: ''
    };
  },
  methods: {
    onClickLeft() {
      if (this.title == "活动详情") {
        this.utils.goBack(this);
      } else {
        this.show = true;
        this.title = "活动详情";
      }
    },
    showfile(url) {
      if(url){
        this.utils.openMultiTypeFile(url);
      }
    },
    onRead(file) {
      let flag = true;
      let _this = this;
      this.utils.fileUploader(file, data => {
            console.log(this.updataImgObj, data);
            this.updataImgObj = {
                path: data.url,
                md5: "",
                name: data.name,
                type: this.fileType,
                pid: this.dataList.id
            };
            this.updateFile();
      });
    },
    deleteImg(img,index){
      this.Dialog.confirm({
        title: "提示",
        message: "是否删除该文件?"
      }).then(() => {
        let item = this.dataList['attachmentListType' + img.type].splice(index,1);
        this.deleteFile(item[0].id);
      }).catch(() => {});
    },
    activeImgObj(index) {
      this.fileType = index+1;
    },
    deleteFile(id){
        this.utils.ajax({
            url: this.api.delTeachingAttachment,
            data: { 
                id: id,
            },
            method: "POST",
            success: data => {
              this.getData(this.$route.params.id);
              setTimeout(() => {
                this.Toast("提交成功");
              }, 100);
            }
        });
    },
    updateFile(){
        this.dataList[ 'attachmentListType' + this.fileType].push(this.updataImgObj);
        this.utils.ajax({
            url: this.api.uploadAttachment,
            data: { 
                attachmentList: this.dataList[ 'attachmentListType' + this.fileType],
                teachingId:this.dataList.id
            },
            method: "POST",
            success: data => {
              this.getData(this.$route.params.id);
              setTimeout(() => {
                this.Toast("提交成功");
              }, 100);
            }
        });
    },
    isImg(str) {
      if (/.jpg/.test(str) || /.JPG/.test(str) || /.jpeg/.test(str) || /.JPEG/.test(str) || /.png/.test(str) || /.gif/.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    getData() {
      let params = {
        id: this.$route.params.id
      };
      this.utils.ajax({
        url: this.api.activityMssage,
        data: params,
        method: "POST",
        success: res => {
          console.log(res);
          this.endTime = res.endTime;
          this.startTime = res.createTime;
          res.startTime = this.utils.formatDate(res.startTime , "yyyy-MM-dd HH:mm");
          res.endTime = this.utils.formatDate(res.endTime , "yyyy-MM-dd HH:mm");
          let startTime = this.utils.formatDate(res.startTime); 
          res.startTime.split(" ");
          

          let endTime = res.endTime.split(" ");
          if (startTime[0] == endTime[0]) {
            res.activityTime = `${startTime[0]} ${startTime[1]}-${
              endTime[1]
            }`;
          } else {
            res.activityTime =  `${res.startTime} ~ ${res.endTime}`;
          }
          res.teachingLevel = this.utils.getValueByKey(this.$store.state.activitiesRank, res.teachingLevel);
          console.log(res);
          this.dataList = res;
        },
        error: err => {
          console.log(err);
        }
      });
    },
    /**
     * 加载获取活动人数页面
     */
    goActivityNum(v) {
      this.currentPage = 1;
      this.popleList = [];
      this.loading = true;
      this.finished = false;
      this.show = false;
      if (v == "receiverCount") {
        this.flag = true;
        this.title = "活动接收人";
        this.getActivityNum(1);
      }
      if (v == "numOfSignUp") {
        this.flag = true;
        this.title = "活动报名人";
        this.getActivityNum(2);
      }
      if (v == "numOfSignIn") {
        this.flag = false;
        this.title = "活动签到人";
        this.getActivityNum(3);
      }
    },
    /**
     * 获取活动人数
     */
    getActivityNum(type) {
      this.numType = type;
      let params = {
        teachingId: this.$route.params.id,
        humanType: type,
        pageSize: 30,
        currentPage: this.currentPage,
        humanName: this.value
      };
      this.utils.ajax({
        url: this.api.activityNum,
        data: params,
        method: "POST",
        success: res => {
          this.loading = false;
          res.content.forEach(item => {
            let timeA = new Date(this.endTime)
            let timeB = new Date(item.signOutDate)
            let timeC = new Date(this.startTime)
            let timeD = new Date(item.signInDate)
            console.log(timeB<timeA)
            let start = item.signInDate|| '';
            let end = item.signOutDate.split(" ")[1]|| '';
            item.dateTime = `${start} 至 ${end}`;
            item.timeStyle = false
            if (!start || !end || (timeB<timeA) || (timeC<timeD)) {
              item.timeStyle = true
            }
            console.log(item.role.length);
            if (type == 3) {
              if (item.role.length > 5) {
                item.role = item.role.substr(0, 5) + "...";
              }
            }
          });
          this.popleList = this.popleList.concat(res.content);
          console.log(res);
          if (res.content.length == 0 || res.number == res.totalPages) {
            this.finished = true;
          }
        },
        error: err => {
          console.log(err);
        }
      });
    },
    onLoad() {
      console.log(111);
      this.currentPage++;
      this.getActivityNum(this.numType);
    },
    onSearch() {
      this.popleList = [];
      this.currentPage = 1;
      this.getActivityNum(this.numType);
    }
  },
  created() {
    this.getData();
    console.log(this.$route.params);
  }
};
</script>
<style  scoped>
.line {
  height: 0.5rem;
  background: #f0f0f0;
}
.layout_content {
  background: #f0f0f0;
}
.back-box-info{
    background: #ffffff;
}
.listLeft {
  display: inline-block;
  width: 30%;
  /* text-align: right; */
  vertical-align: top;
}
.h3title{
    padding :1rem;
    border-bottom: 0.06rem solid #f0f0f0;
}
.listRight {
  display: inline-block;
  width: 60%;
}
li {
  /* margin-top: 1rem */
  font-size: 14px;
}
.bigBox li span:nth-child(2) {
  /* margin-left: 1rem; */
  vertical-align: bottom;
}
.bigBox li:nth-child(1) {
  font-size: 16px;
  margin-bottom: 0.2rem;
}
.bigBox li:nth-child(2),
.bigBox li:nth-child(3),
.popList .message {
  color: #a3a3a3;
  margin-bottom: 0.1rem;
}
.bigBox2 li span:nth-child(2) {
  text-align: right;
  width: 66%;
}
.bigBox2 li {
  padding: 1rem 1rem;
}
.bigBox2 li:nth-child(2),
.bigBox2 li:nth-child(1) {
  border-bottom: 0.06rem solid #f0f0f0;
}
.bigBox2 .f0Bodeer{
  border-bottom: 0.06rem solid #f0f0f0;
}
.bigBox2 {
  padding: 0;
}
.detail {
  font-size: 14px;
  padding: 0.6rem 1rem !important;
}
ul {
  /* margin-top: 1rem; */
  background: #fff;
  box-sizing: border-box;
  padding: 1rem;
}
.popList {
  margin-top: 0;
  box-sizing: border-box;
  padding: 1rem;
  border-bottom: 0.06rem solid #f2f2f2;
  background: #fff;
}
.popList > div:nth-child(2) {
  margin-top: 0.5rem;
}
.popList > div:nth-child(1) span {
  display: inline-block;
  box-sizing: border-box;
}
.popList > div:nth-child(1) span {
  float: left;
}
.popList > div:nth-child(1) span:last-child {
  float: right !important;
}
.van-cell__title{
    width:94%;
}
.clearfix:after {
  /*伪元素是行内元素 正常浏览器清除浮动方法*/
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.clearfix {
  *zoom: 1; /*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
}
.btn {
  color: #539fee;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.layout_content >>> p {
  margin: 0;
  padding: 0;
}
.timeColor {
  color: red;
}
.uploadFile{
  position: relative;
  display: inline-block;
  font-size: 3rem;
  height: 3rem;
  width: 3rem;
  border-radius: 0.5rem;
  border: 0.04rem solid #e1e1e1;
  vertical-align: middle;
  margin-right: 0.925rem;
  margin-left: 1rem;
}
.delete-icon{
    vertical-align: top;
    left: -11px;
    top: -7px;
    font-size: 1.2rem;
    color:gray;
}
.fileImg img {
  width: 3rem;
  height: 3rem;
  vertical-align: middle;
  margin-top: 5px;
}
</style>