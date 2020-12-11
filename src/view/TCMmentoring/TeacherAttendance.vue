<template>
  <div class>
    <div
      data-v-0f4718e4
      class="header van-nav-bar van-nav-bar--fixed van-hairline--bottom"
      style="z-index: 1;"
    >
      <div data-v-0f4718e4 class="van-nav-bar__left" @click="onClickLeft">
        <i data-v-0f4718e4 class="van-icon van-icon-arrow-left van-nav-bar__arrow">
          <!---->
        </i>
      </div>
      <div data-v-0f4718e4 class="van-nav-bar__title van-ellipsis tosa">跟师考勤</div>
      <div data-v-0f4718e4 class="van-nav-bar__right" @click="onClickRight">
        <van-icon name="scan" size="1.8em"/>
      </div>
    </div>

    <div class="layout_content">
      <van-list
        v-model="loading"
        :finished="finished"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        :finished-text="finishedText"
        immediate-check
        :offset="50"
        @load="onLoad()"
      >
        <div class="dataLinst" v-for="(item,index) in listData" :key="index">
          <div class="homebody" style="background: white;padding: 0.5rem 0.8rem;">
            <ul>
              <li>
                <span class="span">导师姓名：</span>
                <span>{{item.teacherName}}</span>
              </li>
              <li>{{item.time}}</li>
            </ul>
            <ul>
              <li>
                <span class="span">手机号：</span>
                <span>{{item.teacherCellphone}}</span>
              </li>
            </ul>
            <ul>
              <li>
                <span class="span">门诊笔记：</span>
                <span @click="editNotes(item)" style="color:#1a7fe9">编辑</span>
              </li>
            </ul>
            <ul>
              <li>
                <span class="span">签到时间：</span>
                <span>{{item.signInTime}}{{item.forentime}}</span>
              </li>
            </ul>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
export default {
  name: "TeacherAttendance",
  components: {},
  data() {
    return {
      listData: [],
      loading: false,
      finished: false,
      error: false,
      finishedText: "没有更多了"
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    onClickRight() {
      this.sood();
    },
    sood() {
      this.webApp.WebCallApp("CmdScanQrCode", {}, res => {
        let obj = this.utils.getPrams(res);
        if (!obj.signInTime) {
          return this.Toast("无效二维码");
        }
        var params = {
          teacherId: obj.teacherId,
          signInTime: obj.signInTime + ':00',
          studentId: this.$store.state.userInfo.human.caId
        };
        this.utils.ajax({
          url: this.api.attendanceWithTeacherSave,
          method: "POST",
          data: params,
          success: data => {
            this.Toast("扫码成功");
            setTimeout(() => {
              this.tabclass(false);
            }, 1000);
          }
        });
      });
    },
    onLoad() {
      this.tabclass(true);
    },
    editNotes(item){
        this.$router.push({ name:"DoorNotes",params: {item}})
    },
    tabclass(flage) {
      let params = {};
      if (flage) {
        params = {
          currentPage:
            Math.ceil(this.listData.length / this.$store.state.pageSize) + 1,
          pageSize: this.$store.state.pageSize
        };
      } else {
        params = {
          currentPage: 1,
          pageSize: this.$store.state.pageSize
        };
      }
      this.utils.ajax({
        url: this.api.attendanceWithTeacherList,
        method: "POST",
        data: params,
        success: data => {
          if (data.content.length) {
            const content = data.content.map(i => {
              const item = i;
              item.timeshow = this.utils.getTime(i.signInTime);
              var dateTime = new Date(item.timeshow);
              var hour = dateTime.getHours();
              var mm = dateTime.getMinutes();
              item.signIn = i.signInTime;
              item.time = item.signIn.substr(10, 6);
              item.dataTime = i.signInTime;
              item.signInTime = item.dataTime.substr(0, 10);
              item.forentime = hour < 12 ? "上午" : "下午";
              if(hour == 12 && mm == 0){
                  item.forentime = '上午'
              }else if(hour == 12 && mm != 0){
                  item.forentime = '下午'
              }
              return item;
            });
            if (flage) {
              this.listData = [...this.listData, ...content];
            } else {
              this.listData = content;
            }
          } else {
            this.finishedText = "";
          }
          this.loading = false; //结束当前加载
          if (params.currentPage >= data.totalPages) {
            //最后一页、加载完成
            this.finished = true;
          }
        }
      });
    }
  },
  created() {}
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
</style>
