<template>
  <div>
    <div v-if="activeList.length">
      <div class="activity_warp" v-for="(item,index) in activeList">
        <div class="activty_content">
          <p class="van-ellipsis activeTitle">{{item.title}}</p>
          <p class="grey">发布时间:{{item.timeOfRelease}}</p>
          <p class="grey">活动时间:{{item.startTime}}~{{item.endTime}}</p>
          <div class="img" :class="item.img"></div>
        </div>
        <div class="btnList">
          <button :class="item.release?'disabled':''" @click="operation(item,'release',index)" :disabled="item.release">
            发布活动
          </button>
          <button :class="item.cancelRelease?'disabled':''" @click="operation(item,'cancelRelease',index)"
                  :disabled="item.cancelRelease">取消发布
          </button>
          <!-- <button v-if="item.isEdit" @click="operation(item,'edit')">编辑</button>
          <button v-else @click="operation(item,'see')">查看</button> -->
           <button v-if="!item.isEdit" @click="operation(item,'see')">查看</button>
          <button :class="item.del?'disabled':''" @click="operation(item,'del',index)" :disabled="item.del">删除</button>
          <button @click="operation(item,'qr')">二维码</button>
        </div>
      </div>
    </div>

    <div v-else class="tip-empty"><span class="icon-emptyface"></span><span class="text-empty">没有相关信息</span></div>

    <van-dialog
      v-model="showImg"
      show-cancel-button
      :before-close="showQRcode"
      confirm-button-text="更新二维码"
    >
      <p class="nameCode">{{activeData.title}}</p>
      <div class="towqrcode">
        <div class="qrcode" id="qrcode"></div>
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
        activeData: {}
      };
    },
    methods: {
      setData(data) {
        data.forEach(item => {
          item.startTime = this.utils.formatDate(item.startTime);
          item.endTime = this.utils.formatDate(item.endTime);
          item.timeOfRelease = item.timeOfRelease ? this.utils.formatDate(item.timeOfRelease) : "";

          item.release = (item.flagOfRelease == 0 || item.flagOfRelease == 3) ? false : true;
          item.isEdit = (item.flagOfRelease == 0 || item.flagOfRelease == 3 || item.auditFlag == 2) ? true : false;
          item.del = (item.flagOfRelease !== 0 && item.auditFlag !== 2) ? true : false;
          let isCancel = this.utils.getTime(item.startTime) > this.utils.getTime(this.$store.state.timestamp);
          if (item.flagOfRelease == 2 && !item.auditFlag && isCancel) {
            item.cancelRelease = false;
          } else if(item.flagOfRelease == 1 && item.auditFlag == 2){
            item.cancelRelease = true;
            item.del = true;
          }else{
            item.cancelRelease = (item.flagOfRelease == 0 || item.flagOfRelease == 2 || item.flagOfRelease == 3) ? true : false;
          }

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
        });
        return data;
      },
      operation(btnOpt, type, index) {
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
          option.cb = (opt) => {
            this.activeList[option.index] = opt.data;
            this.$emit("setActive", this.activeList);
          };
          this.btnRequest(params, option);
        }

        if (type === "edit" || type === "see") {
          this.$store.state.paramsTeachingId = btnOpt.id;
          this.$router.push({ name: "AddActivities", params: { id: btnOpt.id, type: type } });
          this.$store.state.inputtext = '';
          this.$store.state.seeAdd = '';
          return;
        }

        if (type === "qr") {
          this.showImg = true;
          this.activeData = btnOpt;
          this.updateQRcode();
          return;
        }

        if (type === "del") {
          option.url = this.api.delTeaching;
          option.msg = "删除成功";
          option.cb = (opt) => {
            this.activeList.splice(opt.index, 1);
          };
          this.Dialog.confirm({
            title: "提示",
            message: "是否确定删除教学活动"
          }).then(() => {
            this.btnRequest(params, option);
          });
        }
      },
      btnRequest(params, option) {
        // 不同按钮ajax传参不同
        this.utils.ajax({
          method: "POST",
          data: params,
          url: option.url,
          success: (data) => {
            option.data = data;
            this.Toast(option.msg);
            option.cb(option);
          }
        });
      },

      updateQRcode(cb) {
        // 获取二维码信息更新
        this.utils.ajax({
          method: "POST",
          data: { id: this.activeData.id },
          url: this.api.queryTeachingQR,
          success: data => {
            let obj = {
              effectTime: data.effectTime,
              onlyMark: data.onlyMark,
              teachingId: data.teachingId.id
            };
            let canvas = this.$el.querySelector("#qrcode");
            canvas.innerHTML = "";
            var result = this.$store.state.seeQRcode + "?" + this.object2requestSting(obj);

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
          if (key.toString() != "length" && Object.prototype.hasOwnProperty.call(obj, key)) {
            callback.call(obj, key, obj[key]);
          }
        }
      },
      object2requestSting(obj) {
        var _s = "";
        this.iterate(obj, function(key, value) {
          _s += (_s && _s.length > 0 ? "&" : "") + key.toString() + "=" + value;
        });
        return _s;
      },
      showQRcode(action, done) {
        // 显示二维码的盒子
        if (action === "confirm") {
          this.updateQRcode(done);
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
    padding: .5rem .9rem;
    border-bottom: 1px solid #f5f5f5;
  }

  .activty_content {
    position: relative;
  }

  .activeTitle {
    font-size: 1rem;
    margin: .5rem 0;
    width: 80%;
    height: 1.5rem;
    line-height: 1.5rem;
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
    margin-right: .3rem;
    border: 0;
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
</style>
