<template>
  <div>
    <div v-if="activeList.length">
      <div class="activity_warp" v-for="(item,index) in activeList" :key="index">
        <div class="activty_content">
          <p class="van-ellipsis activeTitle">{{item.title}}</p>
          <p class="grey">发布时间:{{item.timeOfRelease}}</p>
          <p class="grey">活动时间:{{ utils.formatDate(item.startTime,"yyyy-MM-dd HH:mm")}} ~ {{ utils.formatDate(item.endTime,"yyyy-MM-dd HH:mm")}}</p>
          <!-- <div v-for="(i,ind) in item.attachmentList" :key="ind">
            <div class="imgTxt" v-if="!isImg(i.path)" @click="Toast('该文件类型暂不支持查看')">
              <p>{{i.name}}</p>
              <van-icon name="arrow" />
            </div>
            <div class="imgTxt" v-if="isImg(i.path)" @click="imgClick(i.path)">
              <p>{{i.name}}</p>
              <van-icon name="arrow" />
            </div>
          </div>
          <div class="img" :class="item.img"></div> -->
        </div>
        <div class="btnList">
          <button v-if="!item.release" :class="item.release?'disabled':''" @click="operation(item,'release',index)"
            :disabled="item.release">发布活动</button>
          <button v-if="!item.cancelRelease" :class="item.cancelRelease?'disabled':''"
            @click="operation(item,'cancelRelease',index)" :disabled="item.cancelRelease">取消发布</button>
          <button v-if="item.endingActivity" @click="operation(item,'releaseTime',index)">结束活动</button>
          <button v-if="item.isEdit" @click="operation(item,'edit')">编辑</button>
          <button @click="operation(item,'see')">查看详情</button>
          <!-- <button v-if="!item.isEdit" @click="operation(item,'see')">查看</button> -->
          <button @click="operation(item,'del',index)">删除</button>
          <button v-if="item.qr" @click="operation(item,'qr')">二维码</button>
          <button v-if="item.retroactive" @click="operation(item,'retroactive')">补签扫码</button>
          <!-- <button v-if="item.accessory" id="addFile" @click="operation(item,'accessory', index)">
            <van-uploader :disabled="item.disabled" :after-read="onRead" accept multiple>上传附件</van-uploader>
          </button> -->
          <button v-if="item.endingActivity || (item.flagOfRelease == 2 && new Date(item.endTime).getTime()) > new Date().getTime()" @click="operEditPerson(item)">修改主讲人</button>
        </div>
      </div>
    </div>

    <div v-else class="tip-empty">
      <span class="icon-emptyface"></span>
      <span class="text-empty">没有相关信息</span>
    </div>

    <van-dialog v-model="showImg" show-cancel-button :before-close="showQRcode" confirm-button-text="更新二维码">
      <p class="nameCode">{{activeData.title}}</p>
      <div class="towqrcode">
        <div class="qrcode" id="qrcode"></div>
      </div>
    </van-dialog>
    <van-dialog v-model="showText" show-cancel-button :before-close="showTextde">
      <p class="nameText">活动架构发生变化，原先的活动只能查看，请通过电脑端进行编辑。</p>
    </van-dialog>
    <van-dialog use-slot :show="showList" v-model="showList" show-cancel-button style="text-align: center;"
      confirm-button-text="关闭">
      <div style="padding: 1.5rem  0 0 0; ">
        <img :src="srcc" alt class="imgClss" />
      </div>
    </van-dialog>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";

export default {
  name: "Activity",
  data() {
    return {
      showImg: false,
      activeData: {},
      isHasFile: {},
      showText: false,
      obj: {
        type: ""
      },
      qrretroactive: "",
      file: "",
      modeData: {
        id: "filesVOs",
        value: []
      },
      shwoFile: {
        flag: false,
        url: "",
        flagLin: false
      },
      shwoFiletea: {
        flag: false,
        url: ""
      },
      showList: false,
      srcc: "",
      btnOptId: ""
    };
  },
  methods: {
    upLoad(item, index) {
      let file = document.createElement("input");
      file.type = "file";
      file.onchange = e => {
        this.operation(item, "accessory", index, e);
      };
      file.click();
    },
    operEditPerson(item){
        this.$router.push({
          name: "EditActivityPerson",
          params: item
        });
    },
    onRead(file) {
      let flag = true;
      var _this = this;
      let content = this.utils.encryptByEnMd5(file.content); 
      if(content && this.isHasFile.hasOwnProperty(content)) {
        this.Toast("该文件已存在，请选择其他文件");
        return;
      }else{
        let p1 = new Promise((resolve, reject) => {
            this.utils.fileUploader(file, data => {
                _this.isHasFile[content] = true;
                if (!this.utils.checkSuffix(data.name)) {
                    _this.modeData.value.push({
                        path: data.url,
                        name: data.name,
                        type: 1
                    });
                } else {
                    _this.modeData.value.push({
                        path: data.url,
                        name: data.name,
                        type: 3
                    });
                }
                resolve()
            });
        });
        p1.then(() => {
            this.uplodeAjax(() => {});
        });
      }
    },
    isImg(str) {
      if (/.jpg/.test(str) || /.JPG/.test(str) || /.jpeg/.test(str) || /.JPEG/.test(str) || /.png/.test(str) || /.gif/.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    imgClick(item) {
      console.log(item, "1515454");

      this.srcc = item;
      console.log(this.srcc, "ahjah");
      this.showList = true;
    },
    getUserInfo(event) {
      console.log(event.detail);
    },
    editPerson(event) {

    },
    onClose() {
      this.setData({ close: false });
    },
    show_file(e, url, index) {
      e.stopImmediatePropagation();
      this.shwoFile.flag = true;
      this.shwoFile.url = url;
      this.shwoFile.index = index;
    },
    show_fileLinst(e, url, index) {
      e.stopImmediatePropagation();
      this.shwoFiletea.flag = true;
      this.shwoFiletea.url = url;
      this.shwoFiletea.index = index;
    },
    setData(data) {
      data.forEach(item => {
        item.accessory = true;
        item.startTime = this.utils.formatDate(item.startTime);
        item.endTime = this.utils.formatDate(item.endTime);
        item.timeOfRelease = item.timeOfRelease
          ? this.utils.formatDate(item.timeOfRelease)
          : "";
        let isCancel =
          this.utils.getTime(item.startTime) >
          this.utils.getTime(this.$store.state.timestamp);
        item.timestamp = this.utils.getTime(this.$store.state.timestamp);
        item.startActive = this.utils.getTime(item.startTime);
        item.entActive = this.utils.getTime(item.endTime);
        item.endingActivity = false;
        if (item.auditFlag == 2) {
          item.img = "img_fail";
        } else {
          if (item.flagOfRelease == 0) {
            item.img = "img_notsubmit";
          } else if (item.flagOfRelease == 1) {
            item.img = "img_submit";
          } else if (item.flagOfRelease == 2) {
            item.img = "img_finish";
          } else if (item.flagOfRelease == 3) {
            item.img = "img_unfinish";
          }
        }
        // 是否删除活动
        item.del = item.flagOfRelease == 0 || item.flagOfRelease == 3;
        console.log("del:" + item.del);
        //  取消发布
        if (
          item.timestamp < item.startActive && (item.flagOfRelease == 1 || item.flagOfRelease == 2)

        ) {
          item.cancelRelease = false;
        } else {
          item.cancelRelease = true;
        }
        // 结束发布
        if (
          item.timestamp > item.startActive &&
          item.timestamp < item.entActive &&
          item.flagOfRelease == 2 &&
          item.isStop != 1
        ) {
          item.endingActivity = true;
        }
        // 发布活动
        // item.timestamp < (item.startActive - 7200000) &&
        if (item.flagOfRelease != 1 && item.flagOfRelease != 2) {
          //
          item.release = false;
        } else {
          item.release = true;
        }
        // 编辑活动
        if (item.flagOfRelease != 1 && item.flagOfRelease != 2) {
          item.isEdit = true;
        } else {
          item.isEdit = false;
        }
        item.flagOfRelease == 2;
        // 二维码
        if (
          item.timeOfRelease !== "" &&
          item.flagOfRelease == 2 &&
          item.entActive + 7200000 > item.timestamp
        ) {
          item.qr = true;
        }
        //   上传附件
        // if (item.entActive < item.timestamp && item.flagOfRelease == 2) {
        //   item.accessory = true;
        // }
        // 补签扫码
        if (
          item.entActive + 7200000 < item.timestamp &&
          item.flagOfRelease == 2
        ) {
          item.qr = false;
          item.retroactive = true;
        }
      });
      return data;
    },
    operation(btnOpt, type, index, e) {
      var params = { ids: btnOpt.id };
      var option = {
        url: "",
        msg: "",
        index: index
      };
      if (type === "release" || type === "cancelRelease") {
        params.flag = type === "release" ? "1" : "3";
        option.msg = type === "release" ? "发布成功" : "取消发布成功";
        option.url = this.api.editReleaseStatus;
        option.cb = opt => {
          this.activeList[option.index] = opt.data.teaching;
          this.$emit("setActive", this.activeList);
        };
        this.btnRequest(params, option, type);
      }
      if (type === "edit") {
        this.$store.state.paramsTeachingId = btnOpt.id;
        this.$store.state.Csoes = type;
        this.$router.push({
          name: "AddActivities",
          params: { id: btnOpt.id, type: type }
        });
        this.$store.state.inputtext = "";
        this.$store.state.seeAdd = "";
        return;
      }
      if (type === "see") {
        this.$router.push({
          name: "ActivityMssage",
          params: { id: btnOpt.id }
        });
        return;
      }
      if (type === "qr") {
        this.showImg = true;
        this.activeData = btnOpt;
        this.updateQRcode("", "1");
        this.qrretroactive = "1";
        return;
      }
      if (type === "retroactive") {
        this.showImg = true;
        this.activeData = btnOpt;
        this.updateQRcode("", "2");
        this.qrretroactive = "2";
        return;
      }
      if (type === "del") {
        option.url = this.api.delTeaching;
        option.msg = "删除成功";
        // option.cb = opt => {
        //   this.activeList.splice(opt.index, 1);
        // };
        this.Dialog.confirm({
          title: "提示",
          message: "是否确定删除教学活动"
        }).then(() => {
          this.utils.ajax({
            method: "POST",
            data: params,
            url: this.api.delTeaching,
            success: data => {
              this.Toast("活动删除成功");
              this.utils.ajax(
                {
                  url: this.api.teachingList,
                  data: params,
                  method: "POST",
                  success: data => {
                    this.$emit("setActive", data.content);
                  }
                },
                true
              );
            }
          });
          // this.btnRequest(params, option, "");
        });
        return;
      }
      if (type == "releaseTime") {
        this.utils.ajax({
          method: "POST",
          data: {
            id: btnOpt.id
          },
          url: this.api.teachingStop,
          success: data => {
            let params = {
              currentPage: 1,
              pageSize: this.$store.state.pageSize
            };
            this.Toast("活动结束成功");
            this.utils.ajax(
              {
                url: this.api.teachingList,
                data: params,
                method: "POST",
                success: data => {
                  this.$emit("setActive", data.content);
                }
              },
              true
            );
          }
        });
        return;
      }
      if (type == "accessory") {
        this.btnOptId = btnOpt.id;
        return;
      }
    },
    uplodeAjax(callback) {
      this.utils.ajax({
        method: "POST",
        data: {
          files: this.modeData.value,
          teachingId: this.btnOptId
        },
        url: this.api.addTeachingAttachment,
        success: data => {
          this.Toast("上传文件成功");
          let params = {
            currentPage: 1,
            pageSize: this.$store.state.pageSize
          };
          this.modeData.value = [];
          this.utils.ajax(
            {
              url: this.api.teachingList,
              data: params,
              method: "POST",
              success: data => {
                this.$emit("setActive", data.content);
                callback();
              }
            },
            true
          );
        }
      });
    },

    getPublishingActivityList() {
      //发布活动
      let currentTab = this.tabs[this.active];
    },

    btnRequest(params, option, type) {
      // 不同按钮ajax传参不同
      this.utils.ajax({
        method: "POST",
        data: params,
        url: option.url,
        success: data => {
          option.data = data;
          if (data.failureCount == 0) {
            this.Toast("发布成功");
          } else if (data.successCount == 0) {
            this.Toast("发布失败，请检查请检查是否有接受人");
          } else {
            this.Toast.showToast(
              data.successCount +
              "个发布成功，" +
              data.failureCount +
              "个发布失败，请检查是否有接受人"
            );
          }
          if (type == "cancelRelease") {
            this.Toast(option.msg);
          }
          option.cb(option);
        }
      });
    },

    updateQRcode(cb, type) {
      // 获取二维码信息更新
      this.utils.ajax({
        method: "POST",
        data: { id: this.activeData.id, type: type },
        url: this.api.queryTeachingQR,
        success: data => {
          let obj = {
            effectTime: data.effectTime,
            onlyMark: data.onlyMark,
            teachingId: data.teachingId.id,
            type: "1"
          };
          let canvas = this.$el.querySelector("#qrcode");
          canvas.innerHTML = "";
          var result =
            this.$store.state.seeQRcode + "?" + this.object2requestSting(obj);
          new QRCode("qrcode", {
            width: 200,
            height: 200,
            text: result,
            correctLevel: QRCode.CorrectLevel.L,
            typeNumber: 5
          });
          cb && cb(false);
        }
      });
    },
    iterate(obj, callback) {
      for (let key in obj) {
        if (
          key.toString() != "length" &&
          Object.prototype.hasOwnProperty.call(obj, key)
        ) {
          callback.call(obj, key, obj[key]);
        }
      }
    },
    object2requestSting(obj) {
      var _s = "";
      this.iterate(obj, function (key, value) {
        _s += (_s && _s.length > 0 ? "&" : "") + key.toString() + "=" + value;
      });
      return _s;
    },
    showQRcode(action, done) {
      // 显示二维码的盒子
      if (action === "confirm") {
        this.updateQRcode(done, this.qrretroactive);
      } else {
        done();
      }
    },
    showTextde(action, done) {
      if (action === "confirm") {
        this.$router.push({
          name: "AddActivities",
          params: {
            id: this.$store.state.paramsTeachingId,
            type: this.obj.type
          }
        });
      } else {
        done();
      }
    }
  },
  props: ["activeList"]
};
</script>
<style scoped>
.activity_warp {
  background: white;
  padding: 0.5rem 0.9rem;
  border-bottom: 1px solid #f5f5f5;
}

.activty_content {
  position: relative;
}

.activeTitle {
  margin: 0.5rem 0;
  width: 90%;
  height: 1.5rem;
  line-height: 1.5rem;
  /* border-bottom: 0.06rem solid #f0f0f0; */
}

.img {
  position: absolute;
  top: 0;
  right: 0;
  height: 60px;
  width: 60px;
  transform: rotate(50deg);
}

.img_finish {
  background: url("../../assets/images/page/picfqw01.svg") no-repeat;
}

.img_unfinish {
  background: url("../../assets/images/page/picfqw02.svg") no-repeat;
}

.img_notsubmit {
  background: url("../../assets/images/page/picfqw03.svg") no-repeat;
}

.img_submit {
  background: url("../../assets/images/page/picfqw04.svg") no-repeat;
}

.img_fail {
  background: url("../../assets/images/page/picfqw05.svg") no-repeat;
}

.btnList {
  padding: 0.5rem 0;
}

.btnList button {
  font-size: 0.68rem;
  text-align: center;
  padding: 0.2rem 0.4rem;
  border-radius: 3.125rem;
  background: #eef7fe;
  color: #187fe8;
  margin-right: 0.3rem;
  border: 0;
  margin-bottom: 4px;
}

.btnList .disabled {
  background: #f3f3f3;
  color: #c4c4c4;
}

.nameCode {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 80%;
  margin: 0 auto;
  text-align: center;
  padding-top: 1rem;
}
.nameText {
  padding: 1.5rem;
}
#qrcode {
  display: inline-block;
}

#qrcode img {
  width: 132px;
  height: 132px;
  background-color: #fff;
  padding: 6px;
}

.towqrcode {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 1rem 0;
}
.fileStyle {
  opacity: 0;
  width: 3rem;
  position: absolute;
}
.imgTxt {
  color: #187fe8;
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.imgTxt p {
  width: 90%;
  height: 1.1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.imgTxt i {
  margin-top: 1rem;
}
.imgClss {
  width: 100%;
  max-height: 35rem;
}
</style>
