<template>
  <div>
    <van-nav-bar title="待分配学员" class="header" fixed left-arrow @click-left="onClickLeft"/>
    <div class="layout_content">
      <div class="serch">
        <van-icon name="search" class="left"/>
        <input type="text" @keyup="keyupSerch" @input="keyupSerch" @change="keyupSerch" placeholder="搜索带教老师" v-model="serchMode">
        <van-icon name="clear" class="right" @click="clearSerchMode"/>
      </div>
      <div class="studentInfo" v-if="studentObj">
        <div><span>学员</span><span class="both"></span><span>{{studentObj.humanName}}</span></div>
        <div><span>轮转科室</span><span class="both"></span><span>{{studentObj.departmentName}}</span></div>
        <div><span>轮转时间</span><span class="both"></span><span>{{getTime(studentObj)}}</span></div>
      </div>
      <div class="teacher">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <ul>
            <li v-for="obj in this.showData" @click="showTeaher(obj)">
              <div><span class="inline-width">带教老师：</span><span>{{obj.teacherName}}</span></div>
              <div class="flexbox"><div class="flex-box"><span class="inline-width">所在科室：</span><span>{{obj.departmentName}}</span></div>
              <div class="box-icon">
                <van-icon class="color" name="arrow" />
              </div>
              </div>
              <div><span class="inline-width">专业技术职务：</span><span>{{zdKey(obj.specialityTitleCode)}}</span></div>
            </li>
          </ul>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
  // 其他轮转
  export default {
    name: "ChooseTeacher",
    data() {
      return {
        teacher: [],
        serchMode: '',
        showData: [],
        loading: false,
        finished: false,
        studentObj: this.$store.state.studentObj,
        params: {
          pageSize: this.$store.state.pageSize,
          currentPage: 1
        }
      };
    },
    methods: {
      onClickLeft() {
        this.$store.state.studentObj = null;
        this.utils.goBack(this);
      },
      keyupSerch(e) {
        let reg = new RegExp(this.serchMode)
        let arr = [];
        console.log(this.serchMode)
        this.teacher.forEach(i => {
          if (reg.test(i.teacherName)) {
            arr.push(i);
          }
        });
        this.showData = arr;
      },
      clearSerchMode() {
        this.serchMode = '';
        this.showData = this.teacher;
      },
      showTeaher(obj) {
        let param = {
          cycleEndTime: this.studentObj.endDate,
          cycleStartTime: this.studentObj.startDate,
          departmentId: this.studentObj.departmentId,
          normalDepartmentId: this.studentObj.normalDepartmentId,
          studentId: this.studentObj.humanId,
          teacherId: obj.teacherId
        }
        this.$router.push({ name: "ShowTeacher", params: {params: param, teacherName: obj.teacherName} });
      },
      onLoad() {
        if (this.studentObj) {
          this.loadData();
        }
      },
      loadData() {
        let obj = this.params;
        obj.cycleDepartmentId = this.studentObj.departmentId;
        // obj.departmentId = this.studentObj.departmentId;
        obj.endDate = this.studentObj.endDate;
        obj.name = this.studentObj.humanName;
        obj.normalDepartmentId = this.studentObj.normalDepartmentId;
        obj.startDate = this.studentObj.startDate;
        obj.studentId = this.studentObj.humanId;
        obj.selfDepartment = true;
        this.loading = true;
        this.utils.ajax({
          url: this.api.pagingAllotTeacherList,
          method: "post",
          data: obj,
          success: res => {
            console.log(this)
            if (res.number >= res.totalPages) {
              this.finished = true;
            }
            res.content.forEach(item => {
              this.teacher.push(item);
            });
            this.showData = this.teacher;
            this.params.currentPage++;
            this.loading = false;
          }
        })
      },
      getTime(obj) {
        return this.utils.formatDate(obj.startDate,'yyyy-MM-dd') + "至" + this.utils.formatDate(obj.endDate,'yyyy-MM-dd');
      },
      zdKey(code) {
        let name = null;
        [
          { 'key': "017", 'value': "无" },
          { 'key': "001", 'value': '主任医师' },
          { 'key': '002', 'value': '副主任医师' },
          { 'key': '003', 'value': '主治医师' },
          { 'key': "004", 'value': "医师、医士" },
          { 'key': "005", 'value': "主任药师" },
          { 'key': '006', 'value': "副主任药师" },
          { 'key': "007", 'value': "主管药师" },
          { 'key': "008", 'value': "药师、药士" },
          { 'key': "009", 'value': "主任护师" },
          { 'key': "010", 'value': "副主任护师" },
          { 'key': "011", 'value': "主管护师" },
          { 'key': "012", 'value': "护师、护士" },
          { 'key': "013", 'value': "主任技师" },
          { 'key': "014", 'value': "副主任技师" },
          { 'key': "015", 'value': "主管技师" },
          { 'key': "016", 'value': "技师、技士" }

        ].forEach(item => {
          if(item.key == code) {
            name = item.value;
          }
        });
        if (name) {
          return name;
        } else {
          return "未知";
        }
      },
    },
    created() {
    }
  };
</script>

<style scoped>
  li {
    margin-bottom: 1px;
    background: #fff;
    padding: 0.5rem 1rem;
  }
  .inline-width {
    display: inline-block;
    width: 6.125rem;
    text-align: right;
    color: #8d8d8d;
  }
  .color {
    color: #8d8d8d;
  }
  .flexbox {
    display: flex;
    justify-content: space-between
  }
  .studentInfo {
    background: #fff;
    margin-bottom: 0.3rem;
    padding: 0.5rem 1rem;
  }
  .studentInfo>div {
    display: flex;
    justify-content: space-between;
    line-height: 1.5rem;
  }
  li>div {
    line-height: 1.5rem;
  }
  .both {
    flex: 1;
    border-bottom: 1px dashed #e5e5e5;
    margin-bottom: 0.7rem;
    margin: 0 1rem 0.7rem 1rem;
  }
  .serch {
    padding: 0.5rem 1rem;
  }
  .box-icon {
    color: #a6a6a6;
    font-size: 1.2rem;
    align-items: center;
    display: flex;
  }
  input {
    width: 90%;
    border: 1px solid #e1e1e1;
    border-radius: 2rem;
    height: 2rem;
    padding-left: 2rem; 
  }
  .left {
    position: absolute;
    top: 1.2rem;
    left: 2rem;
    font-size: 1rem;
  }
  .right {
    position: absolute;
    top: 1.2rem;
    right: 2rem;
    color: #c6c6c6;
    font-size: 1rem;
  }
  .flex-box {
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .flexbox {
    display: flex;
    justify-content: space-between;
  }
</style>
