<template>
    <div>
        <van-nav-bar :title="teacherName" class="header" right-text="保存" @click-right="onClickRight" fixed left-arrow @click-left="onClickLeft"/>
        <div class="layout_content">
          <div class="headTime">带教时间</div>
          <ul>
            <li v-for="(obj, i) in timeData">
              <van-swipe-cell :right-width="130" v-if="!obj.edit">
                <van-cell-group>
                  <van-cell :title="obj.str" />
                </van-cell-group>
                <span slot="right" @click="edit(obj)" class="btn btn-edit">编辑</span>
                <span slot="right" @click="del(i)" class="btn btn-del">删除</span>
              </van-swipe-cell>
              <div v-if="obj.edit" class="edit">
                <div>
                  <input type="text" readonly @click="chooseDateStart(obj, 'start', i)" :value="obj.start" placeholder="请选择开始时间">
                  <span>至</span>
                  <input type="text" readonly @click="chooseDateStart(obj, 'end', i)" :value="obj.end" placeholder="请选结束始时间">
                </div>
                <span @click="suerTime(obj)" class="btn-suer">确认</span>
              </div>
            </li>
          </ul>
          <div class="addTime" @click="addDate"><van-icon name="add" class="add" />添加带教时间</div>
        </div>
        <van-popup v-model="showTimer" position="bottom" :overlay="true">
          <van-datetime-picker
            v-model="currentDate"
            type="date"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm='confirm'
            @cancel='cancel'
          />
        </van-popup>
    </div>
</template>

<script>
  // 其他轮转
  export default {
    name: "ShowTeacher",
    data() {
      return {
        teacherName: '',
        timeData: [],
        showTimer: false,
        timeMode: '',
        editIndex: '',
        minDate: '',
        maxDate: '',
        currentDate: new Date(),
        params: null
      };
    },
    methods: {
      onClickLeft() {
        this.utils.goBack(this);
      },
      onClickRight() {
        console.log('save')
        console.log(this.timeData)
        let arr = [];
        this.timeData.forEach(item => {
          if(!item.edit) {
            let obj = {
              endDate: item.end,
              startDate: item.start
            }
            arr.push(obj);
          }
        });
        if(arr.length > 0) {
          let obj = {
            allotTeachers: []
          }
          let params = this.params;
          params.allotTimes = arr;
          obj.allotTeachers.push(params);
          this.utils.ajax({
            url: this.api.allotTeacher,
            method: "post",
            data: obj,
            success: res => {
              console.log(res);
              this.Toast("保存成功");
              this.$router.go(-2);
            }
          })
        } else {
          this.Toast("请选择带教时间");
        }
      },
      chooseDateStart(obj, mode, i) {
        if (!this.showTimer) {
          this.showTimer = true;
          this.timeMode = mode;
          this.editIndex = i;
          console.log(this.params.cycleStartTime)
          console.log(this.params.cycleEndTime)
          console.log(obj)
          if (mode == 'start') {
            this.currentDate = new Date(this.params.cycleStartTime.replace(/-/g,'/'));
            this.minDate = new Date(this.params.cycleStartTime.replace(/-/g,'/'));
            if (obj.end) {
              this.maxDate = new Date(obj.end.replace(/-/g,'/'));
            } else {
              this.maxDate = new Date(this.params.cycleEndTime.replace(/-/g,'/'));
            }
          } else {
            this.currentDate = new Date(this.params.cycleEndTime.replace(/-/g,'/'));
            this.maxDate = new Date(this.params.cycleEndTime.replace(/-/g,'/'));
            if (obj.start) {
              this.minDate = new Date(obj.start.replace(/-/g,'/'));
            } else {
              this.minDate = new Date(this.params.cycleStartTime.replace(/-/g,'/'));
            }
          }
        }
      },
      confirm(val) {
        let time = val.getFullYear() + "-" + this.timeRule(val.getMonth(), 'month') + "-" + this.timeRule(val.getDate());
        let flag = true;
        let _time = new Date(time.replace(/-/g,'/'));
        this.timeData.forEach((item, i) => {
          let t1,t2;
          if(item.start && item.end && this.editIndex != i && !item.edit) {
            t1 = new Date(item.start.replace(/-/g,'/')).getTime();
            t2 = new Date(item.end.replace(/-/g,'/')).getTime();
            if (_time >= t1 && _time <= t2) {
              flag = false;
            }
          }
        });
        if (!flag) {
          this.Toast('该时间区间已被选取');
          return;
        }
        this.timeData[this.editIndex][this.timeMode] = time;
        this.showTimer = false;
      },
      timeRule(num, mode) {
        if (mode == 'month') {
          num++;
        }
        if (num > 9) {
          return num;
        } else {
          return '0' + num;
        }
      },
      cancel() {
        this.showTimer = false;
      },
      suerTime(obj) {
        if (!obj.start) {
          this.Toast('请选择开始时间');
          return ;
        }
        if (!obj.end) {
          this.Toast('请选择结束时间');
          return ;
        }
        obj.str = obj.start + "至" + obj.end;
        obj.edit = false;
      },
      edit(obj) {
        obj.edit = true;
      },
      del(i) {
        let arr = [];
        this.timeData.forEach((obj, index) => {
          if (i != index) {
            arr.push(obj);
          }
        });
        this.timeData = arr;
      },
      addDate() {
        if (this.timeData.length == 0) {
          this.timeData.push({edit: true});
          return;
        }
        if(this.timeData[this.timeData.length - 1].start && this.timeData[this.timeData.length - 1].end) {
          this.timeData.push({edit: true});
        }
      },
      loadData() {
        this.params = this.$route.params.params;
        this.minDate = new Date(this.params.cycleStartTime.replace(/-/g,'/'));
        this.maxDate = new Date(this.params.cycleEndTime.replace(/-/g,'/'));
        this.teacherName = this.$route.params.teacherName;
        this.timeData = [];
      }
    },
    created() {
      if (this.$route.params.teacherName) {
        this.loadData()
      }
    }
  };
</script>

<style scoped>
  .headTime {
    padding: 0.5rem 1rem;
  }
  .addTime {
    color: #197fe8;
    padding: 0.5rem 1rem;
    background: #fff;
    margin-top: 0.5rem;
  }
  .add {
    color: #62afff;
    font-size: 1.1rem;
    vertical-align: bottom;
    margin-right: 0.5rem;
  }
  .btn {
    color: #fff;
    display: inline-block;
    width: 65px;
    height: 2.7rem;
    line-height: 2.7rem;
    text-align: center;
  }
  .btn-edit {
    background: #169aff;
    margin-right: 1px;
  }
  .btn-del {
    background: #ff3a30;
  }
  .edit {
    background: #fff;
    margin-bottom: 1px;
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    position: relative;
  }
  .edit input {
    width: 6.35rem;
    border: none;
    text-align: center;
  }
  .btn-suer {
    color: #fff;
    display: inline-block;
    width: 4.0625rem;
    text-align: center;
    background: #169aff;
    display: inline-block;
    position: absolute;
    height: 2.6rem;
    right: 1rem;
    top: 0;
    line-height: 2.6rem;
  }
</style>
