<template>
  <div class="leaveWarp" :class="isAndroid?'autoInput':''">
    <van-nav-bar title="请假申请" class="header" fixed left-arrow @click-left="onClickLeft"/>

    <div class="layout_content">
      <div class="module">
        <van-cell title="请假类型" is-link :value="leaveData.type" @click="selected('leaveType')"/>
      </div>

      <div class="module">
        <van-cell title="开始时间" is-link :value="leaveData.startDate" @click="selected('startDate')"/>
        <van-cell title="结束时间" is-link :value="leaveData.endDate" @click="selected('endDate')"/>
        <van-cell title="请假小时数" :value="leaveData.hours"/>
        <van-cell title="请假天数" :value="leaveData.dayNum"/>
        <van-cell title="获取定位" :value="locationObj.locationDetail" is-link @click="getMap()"/>
      </div>

      <div class="module">
        <van-cell title="请假原因"/>
        <textarea class="textarea" v-model="leaveData.reason" placeholder="请输入请假原因" :maxlength="maxLen"></textarea>
        <p class="leave_tips gray">不能超过{{maxLen}}字符</p>
      </div>
      <div>
        <van-cell title="附件上传"/>
        <div class="file_box">
          <div class="fileList" v-for="(file, i) in fileLit" :key="i" @click="show_file($event, file.url, i)">
            <img :src="file.url" v-if="isImg(file.url)">
            <div v-if="!isImg(file.url)" class="boxfile">
              <van-icon name="description"/>
            </div>
          </div>
          <div class="uploadFile">
            <van-uploader :after-read="onRead" accept="" multiple>
              <van-icon name="plus" />
            </van-uploader>
          </div>
        </div>
      </div>
      <div class="bottomBtn">
        <van-button type="info" @click="submit">提交申请</van-button>
      </div>
      <van-popup v-model="leaveShow" position="bottom">
        <van-picker
          show-toolbar
          title="请假类型"
          :columns="columns"
          @confirm="onConfirm"
          @cancel="hideMask"
        />
      </van-popup>

      <van-dialog v-model="shwoFile.flag" show-cancel-button cancel-button-text="删除" @cancel="delFile()" confirm-button-text="关闭">
        <div v-if="isImg(shwoFile.url)" style="height:20rem">
          <img v-if="isImg(shwoFile.url)" :src="shwoFile.url" width="100%" style="height:100%;">
        </div>
        <div class="fileImg" v-if="!isImg(shwoFile.url)">
          <van-icon name="description" />
        </div>
        <div class="title-file" v-if="!isImg(shwoFile.url)">该文件类型暂不支持查看</div>
      </van-dialog>

      <van-popup v-model="timeShow" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          :title="timeTitle"
          type="datetime"
          @confirm="timeConfirm"
          @cancel="hideMask"
          :formatter="formatter"
        />
      </van-popup>
    </div>

  </div>
</template>

<script>
  // 请假
  export default {
    name: "Leave",
    data() {
      return {
        leaveShow: false,
        timeShow: false,
        isAndroid: false,
        isHasFile: {},
        leaveData: {
          attendanceTypeId: "",
          reason: "",
          type: "请选择",
          startDate: "请选择",
          endDate: "请选择",
          hours: "请选择",
          dayNum: "请选择",
          filePath: ""
        },
        locationObj:{
          locationDetail:"获取定位",
          latitudeAndLongitude:"",
          flage:false
        },
        shwoFile:{
          flag: false,
          url: "",
          flagLin: false
        },
        fileLit:[],
        currentDate: new Date(this.$store.state.timestamp.replace(/-/g, "/")),
        type: "",
        maxLen: 200,
        timeTitle: "",
        columns: []
      };
    },
    methods: {
      onClickLeft() {
        this.utils.goBack(this);
      },
      onConfirm(value) {
        // 选择请假类型
        this.leaveData.type = value.name;
        this.leaveData.attendanceTypeId = value.id;
        this.hideMask();
      },
      selected(type) {
        this.type = type;

        if (type === "leaveType") {
          this.leaveShow = true;
        } else {
          this.timeShow = true;
          this.timeTitle = type === "startDate" ? "开始时间" : "结束时间";
        }
      },
      timeConfirm(value) {
        // 选择开始时间或者结束时间
        this.leaveData[this.type] = this.utils.formatDate(value.getTime());
        let startDate = this.leaveData.startDate;
        let endDate = this.leaveData.endDate;
        if (startDate !== "请选择" && endDate !== "请选择") {
          this.leaveData.hours = this.utils.timeToHours(new Date(startDate.replace(/-/g, "/")), new Date(endDate.replace(/-/g, "/")));
          let endTime = endDate.split(" ")[1];
          let startTime = startDate.split(" ")[1];
          let endDay = new Date(this.utils.formatDate(endDate.split(" ")[0] + " " + startDate.split(" ")[1]).replace(/-/g, "/")).getTime();
          let startDay = new Date(startDate.replace(/-/g, "/")).getTime();
          let date = (endDay - startDay) / 24 / 3600 / 1000;
          let hours = endTime.split(":")[0];
          let minute = endTime.split(":")[1];
          let startThours = startTime.split(":")[0];
          if (startThours < 12) {
            date += 0.5;
          }
          if (hours > 12 || hours == 12 && minute > 0) {
            date += 0.5;
          }
          if (hours == 0 && minute == 0) {
            date -= 0.5;
          }

          this.leaveData.dayNum = date;
        }
        this.hideMask();
      },
      hideMask() {
        this.timeShow = this.leaveShow = false;
      },
      isImg(str) {
      if (
        /.jpg/.test(str) ||
        /.jpeg/.test(str) ||
        /.png/.test(str) ||
        /.gif/.test(str)
      ) {
        return true;
      } else {
        return false;
      }
    },
      formatter(type, value) {
        return this.utils.pickerType(type, value);
      },
      getLeaveType() {
        this.utils.ajax({
          method: "POST",
          data: { flag: 1 },
          url: this.api.queryAttendanceType,
          success: data => {
            data.forEach(item => {
              item.text = item.name;
            });
            this.columns = data;
          }
        });
      },
      onRead(file) {
        let flag = true;
        let _this = this;
        let content = this.utils.encryptByEnMd5(file.content);
        if(content && this.isHasFile.hasOwnProperty(content)) {
            this.Toast("该文件已存在，请选择其他文件");
            return;
        }else{
            this.utils.fileUploader(file, data => {
                _this.isHasFile[content] = data.url;
                this.fileLit =  [data];
                this.leaveData.filePath = data.url;
            });
        }
      }, 
      getMap(det, flag) {
        if (!flag) {
          this.Toast.loading({
            mask: true,
            message: "定位中...",
            duration: 0
          });
        }
        this.webApp.WebCallApp("positioningPoint", {}, res => {
          console.log(res);
          if (!flag) {
            setTimeout(() => {
              this.Toast.clear();
            }, 500);
          }
          if (this.webApp.isInIOS()) {
            if (res.result.state) {
              this.locationObj.locationDetail = "位置信息获取失败";
              this.locationObj.latitudeAndLongitude = "";
              // this.location(det);
            } else {
              if (res.result.code === 0) {
                this.locationObj.locationDetail = res.result.address;
                this.locationObj.latitudeAndLongitude =
                  res.result.longitude + "," + res.result.latitude;
                this.locationObj.flage = true;
              } else {
                this.locationObj.locationDetail = "位置信息获取失败";
                this.Toast("定位失败");
                this.locationObj.latitudeAndLongitude = "";
                this.locationObj.flage = false;
              }
            }
          } else {
            if (res.result.args) {
              this.locationObj.locationDetail = "位置信息获取失败";
              this.locationObj.latitudeAndLongitude = "";
              if (res.result.args.state) {
                // this.location(det);
              } else {
                this.Toast("定位失败");
              }
            } else {
              if (res.result.code === 0) {
                this.locationObj.locationDetail = res.result.address;
                this.locationObj.latitudeAndLongitude =
                  res.result.longitude + "," + res.result.latitude;
                this.locationObj.flage = true;
              } else {
                this.locationObj.locationDetail = "位置信息获取失败";
                this.locationObj.latitudeAndLongitude = "";
                this.Toast("定位失败");
                this.locationObj.flage = false;
              }
            }
          }
      });
    },
      submit() {
        if (!this.leaveData.attendanceTypeId) {
          this.Toast("请选择请假类型");
          return;
        }
        if (this.leaveData.startDate === "请选择") {
          this.Toast("请选择开始时间");
          return;
        }
        if (this.leaveData.endDate === "请选择") {
          this.Toast("请选择结束时间");
          return;
        }
        if (this.leaveData.hours < 0.4) {
          this.Toast("开始时间必须小于结束时间");
          return;
        }
        if (!this.leaveData.reason) {
          this.Toast("请填写请假原因");
          return;
        }
        this.leaveData.latitudeLongitude = this.locationObj.latitudeAndLongitude;
        this.leaveData.locationDetail  = this.locationObj.locationDetail;
        console.log(this.leaveData);
        
        this.utils.ajax({
          method: "POST",
          data: this.leaveData,
          url: this.api.saveLeave,
          success: data => {
            this.utils.goBack(this);
          }
        });
      } ,
      delFile(){
        Object.keys(this.isHasFile).forEach((item)=>{
          if(this.isHasFile[item] == this.leaveData.filePath){
              delete this.isHasFile[item]
          }
        })
        this.leaveData.filePath = "";
        this.fileLit = [];
      },
      show_file(e, url, index) {
          e.stopImmediatePropagation();
          this.shwoFile.flag = true;
          this.shwoFile.url = url;
          this.shwoFile.index = index;
      },
    },
    created() {
      this.isAndroid = this.utils.isInAndroid();
      this.getLeaveType();
    }
  };
</script>

<style scoped>
  .layout_content{
    padding-bottom: 35px;
  }
  .leaveWarp {
    padding-bottom: 2.5rem;
  }

  .autoInput {
    min-height: 100vh;
  }

  .bottomBtn button {
    width: 100%;
  }

  .van-picker__title {
    font-size: .85rem;
  }

  .van-picker {
    z-index: 10;
  }

  .textarea {
    width: 100%;
    min-height: 5rem;
    padding: .5rem .9rem;
    border: none;
    resize: none;
    box-sizing: border-box;
  }

  .leave_tips {
    text-align: right;
    padding: .5rem .9rem;
    margin: 0;
  }
  .file_box > div {
    display: inline-block;
  }
  .file_box{
    padding: 0.625rem 1rem;
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
  .uploadFile {
    position: relative;
    background: #ffffff;
    font-size: 4rem;
    border-radius: 0.5rem;
    border: 0.04rem solid #e1e1e1;
    width: 4rem !important;
    text-align: center;
    height: 4rem !important;
    line-height: 3.5rem !important;
  }
</style>
