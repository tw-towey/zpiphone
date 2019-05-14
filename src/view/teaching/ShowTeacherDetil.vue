<template>
  <div>
    <van-nav-bar :title="title" class="header" right-text="保存" @click-right="onClickRight" fixed left-arrow @click-left="onClickLeft"/>
    <div class="layout_content">
      <ul>
        <li v-for="(obj, i) in showData">
          <van-swipe-cell :right-width="130" v-if="!obj.edit && obj.disEdit">
            <van-cell-group>
              <div><span>带教老师：</span><span>{{obj.teacherName}}</span></div>
              <div class="font-color"><span>带教时间：</span><span>{{obj.str}}</span></div>
            </van-cell-group>
            <span slot="right" @click="edit(obj)" class="btn btn-edit">编辑</span>
            <span slot="right" @click="del(i)" class="btn btn-del">删除</span>
          </van-swipe-cell>
          <van-cell-group v-if="!obj.disEdit">
            <div><span>带教老师：</span><span>{{obj.teacherName}}</span></div>
            <div class="font-color"><span>带教时间：</span><span>{{obj.str}}</span></div>
          </van-cell-group>
          <div v-if="obj.edit" class="edit">
            <div>
              <div>
                <span>带教老师：</span><span @click="chooseTeacher(i)" :class="!obj.teacherName ? 'colorGrey' : '' ">{{returnHTML(obj)}}</span>
              </div>
              <div>
                <input type="text" readonly @click="chooseDateStart(obj, 'startDate', i)" :value="obj.startDate" placeholder="请选择开始时间">
                <span>至</span>
                <input type="text" readonly @click="chooseDateStart(obj, 'endDate', i)" :value="obj.endDate" placeholder="请选结束始时间">
              </div>
            </div>
            <span @click="suerTime(obj)" class="btn-suer">确认</span>
          </div>
        </li>
      </ul>
      <div class="addTime" @click="addDate"><van-icon name="add" class="add" />添加带教老师</div>
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
    <van-popup v-model="showTeacher" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        title="选择带教老师"
        :columns="teacherList"
        @cancel="cancel"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
  // 其他轮转
  export default {
    name: "ShowTeacherDetil",
    data() {
      return {
        title: '',
        showTimer: false,
        showTeacher: false,
        timeMode: '',
        currentDate: new Date(),
        editIndex: '',
        minDate: '',
        maxDate: '',
        showData: [],
        teacherList: [],
        tempData: [],
        first: true,
        ajaxDataConcat: ""
      };
    },
    methods: {
      onClickLeft() {
        this.utils.goBack(this);
      },
      onClickRight() {
        this.tempData.forEach(obj => {
          obj.allotTimes = [];
        });
        this.showData.forEach(i => {
          if (!i.edit) {
            this.tempData.forEach(obj => {
              if (obj.teacherId == i.teacherId) {
                obj.allotTimes.push({
                  endDate: i.endDate,
                  startDate: i.startDate
                })
              }
            });
          }
        });
        let arr = [];
        this.tempData.forEach(item => {
          if (item.allotTimes.length > 0) {
            arr.push(item);
          }
        });
        
        if (arr.length <= 0) {
          this.Toast('请至少添加一条带教时间');
        } else {
          let data = [];
          this.ajaxDataConcat.forEach(i => {
            let flag = true;
            arr.forEach(k => {
              if (i.teacherId == k.teacherId) {
                flag = false;
              }
            });
            if (flag) {
              let obj = {
                allotTimes: [],
                cycleEndTime: arr[0].cycleEndTime,
                cycleStartTime: arr[0].cycleStartTime,
                departmentId: arr[0].departmentId,
                normalDepartmentId: arr[0].normalDepartmentId,
                studentId: arr[0].studentId,
                teacherId: i.teacherId
              }
              data.push(obj);
            }
          });
          arr = arr.concat(data);
          this.utils.ajax({
            url: this.api.allotTeacher,
            data: {
              allotTeachers: arr
            },
            method: "post",
            success: res => {
              this.onClickLeft();
            }
          })
        }
      },
      returnHTML(obj) {
        return obj.teacherName ? obj.teacherName : "请选择带教老师";
      },
      chooseDateStart(obj, mode, i) {
        if (!this.showTimer) {
          this.showTimer = true;
          this.timeMode = mode;
          this.editIndex = i;
          let params = this.$route.params.params
          if (mode == 'startDate') {
            this.currentDate = new Date(params.startDate.replace(/-/g,'/'));
            this.minDate = new Date(params.startDate.replace(/-/g,'/'));
            if (obj.endDate) {
              this.maxDate = new Date(obj.endDate.replace(/-/g,'/'));
            } else {
              this.maxDate = new Date(params.endDate.replace(/-/g,'/'));
            }
          } else {
            this.currentDate = new Date(params.endDate.replace(/-/g,'/'));
            this.maxDate = new Date(params.endDate.replace(/-/g,'/'));
            if (obj.startDate) {
              this.minDate = new Date(obj.startDate.replace(/-/g,'/'));
            } else {
              this.minDate = new Date(params.startDate.replace(/-/g,'/'));
            }
          }
        }
      },
      confirm(val) {
        let time = val.getFullYear() + "-" + this.timeRule(val.getMonth(), 'month') + "-" + this.timeRule(val.getDate());
        let _time = new Date(time.replace(/-/g,'/'));
        let flag = true;
        this.showData.forEach((item, i) => {
          let t1,t2;
          if(item.startDate && item.endDate && this.editIndex != i && !item.edit) {
            t1 = new Date(item.startDate.replace(/-/g,'/')).getTime();
            t2 = new Date(item.endDate.replace(/-/g,'/')).getTime();
            if (_time >= t1 && _time <= t2) {
              flag = false;
            }
          }
        });
        if (!flag) {
          this.Toast('该时间区间已被选取');
          return;
        }
        this.showData[this.editIndex][this.timeMode] = time;
        this.showTimer = false;
      },
      chooseTeacher(i) {
        this.showTeacher = true;
        this.editIndex = i;
      },
      onConfirm(value, index) {
        this.showData[this.editIndex].teacherName = value.text;
        this.showData[this.editIndex].teacherId = value.teacherId;
        this.showTeacher = false;
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
        this.showTeacher = false;
      },
      edit(obj) {
        obj.edit = true;
      },
      del(i) {
        let arr = [];
        this.showData.forEach((obj, index) => {
          if (i != index) {
            arr.push(obj);
          }
        });
        this.showData = arr;
      },
      suerTime(obj) {
        if (!obj.teacherName) {
          this.Toast('请选择带教老师');
          return ;
        }
        if (!obj.startDate) {
          this.Toast('请选择开始时间');
          return ;
        }
        if (!obj.endDate) {
          this.Toast('请选择结束时间');
          return ;
        }
        obj.str = this.timeFormat(new Date(obj.startDate.replace(/-/g,'/'))) + "至" + this.timeFormat(new Date(obj.endDate.replace(/-/g,'/'))),
        obj.edit = false;
      },
      addDate() {
        let flag = true;
        this.showData.forEach(i => {
          if (i.edit) {
            flag = false;
          }
        });
        if(flag) {
          this.showData.push({
            endDate: "",
            startDate: "",
            str: "",
            teacherId: "",
            teacherName: "",
            edit: true,
            disEdit: true
          });
        } else {
          this.Toast('请您先确认已设置带教');
        }
      },
      loadData(flag1) {
        this.title = this.$route.params.params.name;
        let obj = this.$route.params.params
        obj.currentPage = 1;
        obj.pageSize = 100;
        obj.selfDepartment = flag1;
        this.utils.ajax({
          url: this.api.pagingAllotTeacherList,
          data: obj,
          method: "post",
          success: res => {
            if (this.first) {
              this.first = false;
              this.loadData(true);
            }
            let arr1 = [];
            let arr2 = [];
            res.content.forEach((item) => {
              if (flag1) {
                this._data.tempData.push({
                  studentId: obj.studentId,
                  cycleEndTime: obj.endDate,
                  cycleStartTime: obj.startDate,
                  normalDepartmentId: obj.normalDepartmentId,
                  departmentId: obj.cycleDepartmentId,
                  teacherId: item.teacherId,
                });
                this._data.teacherList.push({
                  text: item.teacherName,
                  teacherId: item.teacherId
                })
              } else {
                if (item.allotTimes.length > 0) {
                  item.allotTimes.forEach(i => {
                    this._data.showData.push({
                      teacherName: item.teacherName,
                      teacherId: item.teacherId,
                      str: this.timeFormat(new Date(i.startDate.replace(/-/g,'/'))) + "至" + this.timeFormat(new Date(i.endDate.replace(/-/g,'/'))),
                      endDate: this.timeFormat(new Date(i.endDate.replace(/-/g,'/'))),
                      startDate: this.timeFormat(new Date(i.startDate.replace(/-/g,'/'))),
                      edit: false,
                      disEdit: item.selfDepartment
                    })
                  });
                }
              }
            });
            this._data.ajaxDataConcat = this._data.showData;
          }
        });
      },
      timeFormat(val) {
        return val.getFullYear() + "-" + this.timeRule(val.getMonth(), 'month') + "-" + this.timeRule(val.getDate());
      }
    },
    created() {
      if (this.$route.params.params) {
        this.loadData(false);
      }
    }
  };
</script>

<style scoped>
  ul {
    margin-top: 0.25rem;
  }
  .btn {
    color: #fff;
    display: inline-block;
    width: 65px;
    height: 4rem;
    line-height: 4rem;
    text-align: center;
  }
  .colorGrey {
    color: grey;
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
  .btn-edit {
    background: #169aff;
    margin-right: 1px;
  }
  .btn-del {
    background: #ff3a30;
  }
  li {
    padding: 0 1rem;
    background: #fff;
  }
  li div {
    line-height: 2rem;
  }
  .font-color {
    color: gray;
    font-size: 0.6rem;
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
    top: 1.5rem;
    line-height: 2.6rem;
  }
</style>
