
<template>
  <div class>
    <div v-for="(item,index) in retroactive">
      <div class="bottom">
        <div class="surface">
          <ul>
            <li>
              <p>姓名：</p>
              <p>{{item.studentName}}</p>
            </li>
            <li>
              <p>班次：</p>
              <p>{{item.typeName}}</p>
            </li>
            <li>
              <p>轮转科室：</p>
              <p>{{item.departmentName}}</p>
            </li>
          </ul>
        </div>
        <div class="SignInButton">
          <ul class="timeButton">
            <li>
              <div class="signText" >
                <p class="p"  v-bind:class="{gray:item.signInTime }"  @click="signindate(index,'sign',item)" >签到时间</p>
                <p>{{item.signInTime}}</p>
              </div>
            </li>
            <li>
              <div class="signText">
                <p class="p" v-bind:class="{gray:item.signOutTime }"  @click="signindate(index,'signOut',item)" >签退时间</p>
                <p>{{item.signOutTime}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <van-popup v-model="showSignIn" position="bottom" :overlay="true">
      <van-datetime-picker v-model="currentSignInDate" type="datetime" @confirm="confirm" @cancel="cancel" :formatter = "formatter"/>
    </van-popup>
    <van-popup v-model="showSignOut" position="bottom" :overlay="true">
      <van-datetime-picker v-model="currentSignOutDate" type="datetime" @confirm="confirm" @cancel="cancel" :formatter = "formatter"/>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "Retroactive", // 补签
  components: {},
  props: ["retroactive"],
  data() {
    var dateTime = this.utils.formatDate(new Date().getTime(),'yyyy-MM-dd').replace(/-/g, "/");
    var signTime = this.utils.formatDate(dateTime,'yyyy-MM-dd');
    return {
      listData:this.retroactive,
      currentSignInDate: new Date(),
      currentSignOutDate: new Date(),
      dateTime: dateTime,
      showSignIn: false,
      showSignOut: false,
      type: "",
      signTime:signTime,
      signInTime:"",
      signInTimeText:"",
      signOutTime:"",
      signOutTimeText:"",
      currentId:"",
      index: 0
    };
  },
  created() {
    //this.isDate();
  },
  methods: {
    dateClick() { //显示时间
      this.show = true;
      this.type = 1;
    },
    isDate(date) {
      let time = new Date(date);
      let getMonth = time.getMonth() + 1;
      this.dateTime
        ? ""
        : (this.dateTime =
            time.getFullYear() + "/" + getMonth + "/" + time.getDay());
    },

    confirm(value) {
      var _this = this;
      // 日期确定
      var dateShow = this.utils.formatDate(value.getTime(),'yyyy-MM-dd').replace(/-/g, "/");
      var dateText = this.utils.formatDate(value.getTime());
      var dateTextShow = this.utils.formatDate(value.getTime()).replace(/-/g,"/");
      if (this.type == 2) {
        if (this.retroactive[this.index].signOutTime) {
          let flag = this.valiteSign(dateText, this.retroactive[this.index].signOutTime);
          if (!flag) {
            return;
          }
        }
        this.showSignIn = false;
        this.retroactive[this.index].signInTime = dateText;
        this.retroactive[this.index].signInTimeText = dateTextShow;
        this.confirmBackDailySign();
      } else if (this.type == 3) {
        if (this.retroactive[this.index].signInTime) {
          let flag = this.valiteSign(this.retroactive[this.index].signInTime, dateText);
          if (!flag) {
            return;
          }
        }
        this.showSignOut = false;
        this.retroactive[this.index].signOutTime = dateText;
        this.retroactive[this.index].signOutTimeText = dateTextShow;
        this.confirmBackDailySign();
      }
    },
    confirmBackDailySign() {
        let obj = null;
        let that = this;
        this.retroactive.forEach((i, index) => {
          if (i.signInTime && i.signOutTime) {
            if( this.utils.getTime(i.signInTime) < this.utils.getTime(i.signOutTime)) {
              obj = i;
              that.index = index;
            }
          }
        });
        if (obj) {
          var id = obj.id;
          var signInTime = obj.signInTime;
          var signOutTime = obj.signOutTime;
          var params = {
            ids:[id],
            signInTime:  signInTime,
            signOutTime: signOutTime
          }
          this.backDailySign(params);
        }
    },
    valiteSign(signIn, signOut) {
      var flag = true;
      if( signIn >= signOut) {
        this.Toast('签到时间不能大于签退时间');
        flag = false;
        return flag;
      }
      return flag;
    },
    backDailySign(params) {
        var _this = this;
        this.utils.ajax(
        {
          url: this.api.backDailySign,
          data: params,
          method: "POST",
          success: data => {
            _this.retroactive.splice(_this.index, 1);
            _this.Toast('补签成功');
            // _this.signInTime = "";
            // _this.signInTimeText = "";
            // _this.signOutTime = "";
            // _this.signOutTimeText = "";
            // _this.$emit('queryData',1);
          }
        }, false);

    },
    formatter(type, value) {
      return this.utils.pickerType( type, value );
    },
    cancel() {
      // 日期取消
      if( this.type == 1) {
        this.show = false;
      } else if( this.type == 2 ) {
        this.showSignIn = false;
      } else if( this.type == 3) {
         this.showSignOut = false;
      }
    },
    signindate(index, value, item) {
      this.index = index;
      if (value === "sign") {
        // 签到时间
        this.showSignIn = true;
        this.type = 2;
        this.currentId = item.id;
      }
      if (value === "signOut") {
        // 签退时间
        this.showSignOut = true;
        this.type = 3;
        this.currentId = item.id;
      }
    }
  }
};
</script>
<style  scoped>
.surface p,
.SignInButton p {
  margin: 0;
  padding: 0;
}
.surface {
  width: 100%;
  background: white;
  border-bottom: 1px solid #f7f7f7;
}
.surface ul {
  width: 90%;
  margin: 0 auto;
}
.surface ul li p:nth-of-type(1) {
  color: #b5b5b5;
  width: 70px;
  text-align: right;
}
.surface ul li {
  display: flex;
}
.SignInButton {
  background: white;
}
.SignInButton .timeButton {
  width: 90%;
  margin: 0 auto;
  display: flex;
}
.timeButton p {
  color: #ebb86e;
}
.timeButton li {
  padding: 0.5rem 0;
}
.timeButton li {
  width: 100%;
}
.surface {
  padding: 0.2rem 0;
}
.surface ul li {
  padding: 0.3rem 0;
}
.bottom {
  border-bottom: 0.5rem solid #f0f0f0;
}

.signText p {
  color:#ebb86e;
}
.signText p.gray {
  color: #bdbdbd;
}
/* .signText p:nth-of-type(1) {
  color: #bdbdbd;
} */
.signText p:nth-of-type(2) {
  color: #767676;
  font-size: 1rem;
}
.p{
  margin-top: 0.7rem !important;
}
</style>