<template>
  <div>
    <van-nav-bar title="跟师考勤" class="header" fixed left-arrow @click-left="onClickLeft">
      <van-icon name="weapp-nav" slot="right" @click="queryOrCode()" color="#fff"/>
    </van-nav-bar>
    <div class="layout_content" @click="closeShowSelect()">
      <!-- 右侧查询or二维码 -->
      <div v-if="showSelect" class="rightSelect">
        <van-icon name="arrow-up" class="rightIcon"/>
        <div class="content">
          <div @click="search()">查询</div>
          <div @click="CodeSign()">二维码</div>
        </div>
      </div>
      <!-- 右侧查询or二维码end -->
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <!-- 获取数据列表 -->
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :offset="50"
          v-if="this.listData"
        >
          <div class="particulars-top" v-for="(v1,index) in this.listData" :key="index">
            <div class="inblock">
              <div v-for="(value,index) in listObj.list" :key="index">
                <span>{{value.field}}</span>
              </div>
            </div>
            <div class="inblock signInTime">
              <div v-for="(v,index) in v1" :key="index">
                <span v-if="index !== 'item'" v-html="v" @click="editNotes(v1.item)"></span>
              </div>
            </div>
            <!-- <div class="signInTime"></div> -->
          </div>
        </van-list>
      </van-pull-refresh>
      <!-- 获取数据end -->
      <!-- 搜索学员 -->
      <div v-if="searchStu">
        <div class="navBar">
          <van-row>
            <van-col span="3">
              <van-icon
                name="arrow-left"
                size="1rem"
                class="backIcon"
                color="white"
                @click="closeSearch()"
              />
            </van-col>
            <van-col span="17">
              <input type="text" v-model="searchStutend" placeholder="输入学员名字">
            </van-col>
            <van-col span="4">
              <span class="searchBut" @click="affirmSearch()">搜索</span>
            </van-col>
          </van-row>
        </div>
        <van-popup v-model="searchStu" class="searchPopup" position="right" :overlay="false">
          <div class="studentSea">
            <div class="particulars-top" v-for="(v1,index) in this.searchlistData" :key="index">
              <div class="inblock">
                <div v-for="(value,index) in listObj.list" :key="index">
                  <span>{{value.field}}</span>
                </div>
              </div>
              <div class="inblock signInTime">
                <div v-for="(v,index) in v1" :key="index">
                  <span>{{v}}</span>
                </div>
              </div>
              <!-- <div class="signInTime"></div> -->
            </div>
          </div>
        </van-popup>
      </div>
      <!-- 扫码签到 -->
      <van-popup v-model="scanCodeSign" position="right" class="codeqd" :overlay="false">
        <van-nav-bar title="扫码签到" left-arrow @click-left="closeQuery"/>
        <div class="qrcodeBox">
          <p>手机扫一扫，完成签到</p>
          <div id="qrcode" ref="qrcode"></div>
          <div class="dateTime">
            <div class="CallsTime">
              <span>出诊日期：</span>
              <span>{{this.CallsDate}}</span>
            </div>
            <div>
              <span>出诊时间：</span>
              <span>{{this.CallsTime}}</span>
            </div>
            <div @click="setDateTime()">设置日期时间</div>
          </div>
        </div>
      </van-popup>
      <!-- 设置日期时间 -->
      <van-popup v-model="dateShow" position="bottom" :overlay="false" class="timeBox">
        <van-datetime-picker
          v-model="currentDate"
          type="datetime"
          :min-date="minDate"
          @cancel="closeDateList()"
          @confirm="sureDateList()"
          @change="getDateTime($event)"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import ViewList from "@/components/ViewList";
export default {
  name: "WithTeacherAttendance",
  components: {
    ViewList: ViewList
  },
  data() {
    return {
      finished: false,
      loading: true,
      minDate: new Date(2017, 12, 1),
      currentDate: new Date(),
      dateShow: false,
      CallsDate: this.timeFormData(new Date(), "YYYY-MM-DD"),
      CallsTime: this.timeFormData(new Date(), "", true),
      scanCodeSign: false,
      searchlistData: [],
      searchStutend: "",
      searchStu: false,
      showSelect: false,
      isLoading: false,
      listData: [],
      listObj: {
        list: [
          { field: "学员姓名：", name: "name", leftClass: "gray" },
          { field: "培训专业：", name: "major", leftClass: "gray" },
          { field: "参培年份：", name: "years", leftClass: "gray" },
          { field: "手机号：", name: "cellphone", leftClass: "gray" },
          { field: "门诊笔记：", name: "note", leftClass: "gray" },
          { field: "签到时间：", name: "signTime", leftClass: "gray" }
        ]
      },
      codeTime: this.timeFormData(new Date(), "YYYY-MM-DD hh:mm"),
      teacherId: this.$store.state.userInfo.human.caId
    };
  },
  methods: {
    timeFormData(time, str, falg) {
      let y = time.getFullYear();
      let MM = time.getMonth() + 1;
      let dd = time.getDate();
      let hh = time.getHours();
      let mm = time.getMinutes();
      if (falg) {
        let stime = hh <= 12 ? "上午" : "下午";
        // if (hh = 12 && mm == 0) {
        //   stime = "上午";
        // }else {
        //   stime = "下午";
        // }
        return stime;
      }
      if (MM < 10) {
        MM = "0" + MM;
      }
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (hh < 10) {
        hh = "0" + hh;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      if (/ /.test(str)) {
        return y + "-" + MM + "-" + dd + " " + hh + ":" + mm;
      } else {
        return y + "-" + MM + "-" + dd;
      }
    },
    editNotes(item){
        this.$router.push({ name:"DoorNotes",params: {item}})
    },
    onLoad() {
      // console.log(1);
      this.getListData(false, false);
    },
    getDateTime(v) {
      // console.log(v.getValues());
      let tttime = v.getValues()[3] - 0 <= 12 ? "上午" : "下午";
      if (v.getValues()[3] == 12) {
        if (v.getValues()[4] - 0 == 0) {
          tttime = "上午";
        } else {
          tttime = "下午";
        }
      }
      this.CallsTime = tttime;
      this.CallsDate = v
        .getValues()
        .slice(0, 3)
        .join("-");
      // console.log(v.getValues().slice(0, 3).join("-"));
      // console.log(v.getValues().splice(3, 2).join(":"));
      this.codeTime =
        v
          .getValues()
          .slice(0, 3)
          .join("-") +
        " " +
        v
          .getValues()
          .splice(3, 2)
          .join(":");
      // console.log(this.codeTime);
    },
    sureDateList() {
      this.$refs.qrcode.innerHTML = "";
      this.createQrcode();
      this.dateShow = false;
    },
    closeDateList() {
      this.dateShow = false;
      // this.CallsDate = "";
      // this.CallsTime = "";
    },
    setDateTime() {
      this.dateShow = !this.dateShow;
    },
    createQrcode() {
      new QRCode("qrcode", {
        width: 200,
        height: 200,
        text: "?teacherId=" + this.teacherId + "&signInTime=" + this.codeTime + "&type=3", //签到时间,
        correctLevel: QRCode.CorrectLevel.L,
        typeNumber: 5
      });
    },
    CodeSign() {
      this.scanCodeSign = !this.scanCodeSign;
      this.showSelect = false;
      setTimeout(() => {
        this.createQrcode();
      }, 100);
    },
    affirmSearch() {
      this.getListData(true);
    },
    closeSearch() {
      this.searchStu = false;
      this.scanCodeSign = false;
      this.searchlistData = [];
      this.searchStutend = "";
      // this.getListData(false);
    },
    closeQuery() {
      this.scanCodeSign = false;
      this.$refs.qrcode.innerHTML = "";
      this.dateShow = false;
    },
    search() {
      this.searchStu = true;
      this.showSelect = false;
    },
    closeShowSelect() {
      this.showSelect = false;
    },
    queryOrCode() {
      this.showSelect = !this.showSelect;
    },
    onClickLeft() {
      this.utils.goBack(this);
      this.listData = [];
    },
    getListData(flag, Page) {
      // console.log(flag, Page);
      let params = {};
      if (flag) {
        params = {
          currentPage: 1,
          pageSize: 10,
          nameOrCellphone: this.searchStutend
        };
        // console.log(1);
      } else {
        let page;
        if (Page) {
          page = 1;
        } else {
          page =
            Math.ceil(this.listData.length / this.$store.state.pageSize) + 1;
        }
        //  console.log(page);
        params = {
          currentPage: page,
          pageSize: 10
        };
      }

      this.utils.ajax({
        url: this.api.getWithTeacherlist,
        data: params,
        method: "POST",
        success: data => {
          // console.log(data);
          if (data.content) {
            if (params.currentPage >= data.totalPages) {
              this.finished = true;
            } else {
              this.finished = false;
            }
            const num = data.content.map(item => {
              let doubleTime = item.signInTime.split(" ");
              let traineeMajor = this.utils.getValueByKey(
                this.$store.state.majors,
                item.traineeMajorCode
              );
              let day = doubleTime[1].split(":")[0] - 0 <= 12 ? "上午" : "下午";
              if (doubleTime[1].split(":")[0] == 12) {
                if (doubleTime[1].split(":")[1] == "00") {
                  day = "上午";
                } else {
                  day = "下午";
                }
              }
              return {
                time: doubleTime[1],
                studentName: item.studentName,
                traineeMajor: traineeMajor,
                year: item.traineeYear + "年",
                cellphone:item.cellphone,
                note: "<a style='color:#1a7fe9'>查看 </a>",
                signInTime: doubleTime[0] + day,
                item:item
              };
            });
            if (flag) {
              this.searchlistData = num;
              this.isLoading = false;
            } else {
              if (Page) {
                this.listData = num;
                this.isLoading = false;
              } else {
                this.listData = [...this.listData, ...num];
                this.isLoading = false;
              }
            }
            this.loading = false;
          }
        }
      });
    },
    onRefresh() {
      this.getListData(false, true);
      // this.finished = false;
    }
  },
  created() {
    this.getListData(false, false);
  }
};
</script>

<style scoped>
.studentSea {
  margin-top: 2.5rem;
}
.searchPopup {
  /* position: fixed; */
  transition: none;
}
.codeqd {
  overflow: hidden;
}
.timeBox {
  height: auto !important;
}
.listData {
  font-size: 0.75rem;
}
.rightIcon {
  position: absolute !important;
}
.van-icon {
  font-size: 1rem;
}
.content {
  position: absolute;
  text-align: center;
  width: 4.5rem;
  border: 1px solid #666;
  top: 0.7rem;
  right: 0;
  border-radius: 0.2rem;
  background-color: #fff;
}
.content div {
  padding: 0.2rem 0.2rem;
}
.content div:nth-child(1) {
  border-bottom: 1px solid #666;
}
.rightSelect {
  position: fixed;
  right: 0.93rem;
  top: 2.5rem;
  width: 1rem;
  z-index: 200000 !important;
}
.van-col {
  text-align: center;
}
.van-col input {
  border: 0 none;
}
.searchBut {
  color: #fff;
}
.backIcon {
  top: 0.22rem;
}
.van-popup {
  width: 100%;
  height: 100%;
  background: #f6f6f6;
}
.navBar {
  position: fixed;
  top: 0;
  height: 2.5rem;
  width: 100%;
  line-height: 2.5rem;
  background-color: #1a7fe9;
  z-index: 2500 !important;
}
.navBar input {
  height: 1rem;
  width: 100%;
}
.van-nav-bar {
  height: 2.5rem;
  line-height: 2.5rem;
  background-color: #1a7fe9;
}
.van-nav-bar__title {
  color: #fff;
  font-size: 1.1rem;
}
.qrcodeBox {
  background-color: #fff;
  box-sizing: border-box;
  height: 100%;
  margin: 1rem 1rem 5rem;
}
.qrcodeBox p {
  text-align: center;
  padding: 1.5rem 0;
  margin: 0;
}
#qrcode,
.dateTime {
  margin-left: 50%;
  transform: translate(-100px);
}
.dateTime {
  margin-top: 2rem;
}
.dateTime div {
  margin-top: 1rem;
}
.dateTime div:nth-child(3) {
  color: #1a7fe9;
}
.van-pull-refresh {
  height: 100%;
  overflow: scroll;
}
.particulars-top {
  position: relative;
  padding: 0.5rem 0 1rem 1rem;
  font-size: 0.8rem;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
}
.inblock {
  display: inline-block;
}
.inblock span {
  display: inline-block;
  padding: 0.2rem 0;
}
.signInTime div:nth-child(1) {
  position: absolute;
  right: 1rem;
}
</style>
 