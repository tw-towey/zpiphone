<template>
  <div>
    
    <van-nav-bar title="待分配学员" class="header" fixed left-arrow @click-left="onClickLeft"/>
    <div class="layout_content">
      <van-row>
        <van-col span="12">
          <div class="serch">
            <van-icon name="search" class="left"/>
            <input type="text" @keyup="keyupSerch" @input="keyupSerch" @change="keyupSerch" placeholder="搜索带教老师" v-model="serchMode">
            <van-icon name="clear" class="right" @click="clearSerchMode"/>
          </div>
        </van-col>
        <van-col span="12" >
          <div class="col_right" @click="isShow">
             <!-- <span>  -->
               带教类别：{{title}}
               <van-icon name="arrow" />
               <!-- <select name="" id="" style="border: none;" @change="statu">
                 <option v-for="(item,index) in select" :value="item.key" :key="item.key">
                   {{item.value}}
                 </option>
               </select> -->
              
             <!-- </span> -->

          </div>
          
        </van-col>
      </van-row>
      <van-popup v-model="selectShow"
      position="bottom"
      :style="{ height: '40%' }"
      >
      <!-- onConfirm hideAllPiker(item) -->
       <van-picker
       show-toolbar
        :columns="select"
        value-key="value"
        @confirm="onConfirm"
        @cancel="selectShow=false"
      />
      </van-popup>
     
      <div class="studentInfo" v-if="studentObj">
        <div><span>学员</span><span class="both"></span><span>{{studentObj.humanName}}</span></div>
        <div><span>轮转科室</span><span class="both"></span><span>{{studentObj.departmentName}}</span></div>
        <div><span>轮转时间</span><span class="both"></span><span>{{getTime(studentObj)}}</span></div>
      </div>
      <div class="teacher">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <ul>
            <li v-for="(obj,index) in this.showData" :key="index" @click="showTeaher(obj)">
              <div><span class="inline-width">带教老师：</span><span>{{obj.teacherName}} </span><span v-if="obj.isGeneralQualification==1" class="isGeneralQualification ">全科</span></div>
              <div class="flexbox"><div class="flex-box"><span class="inline-width">所在科室：</span><span>{{obj.departmentName}}</span></div>
              <div class="box-icon">
                <van-icon class="color" name="arrow" />
              </div>
              </div>
              <div>
                <span class="inline-width">专业技术职务：</span><span>{{zdKey(obj.specialityTitleCode)}}</span>
              
              </div>
              <div class="inline-width" style="display: flex;width: 100%;">
                <span> 师资带教级别：</span>
                 
                <span v-if="obj.gradeofTeacherCode=='GradeofTeachers_01'">助教</span>
              
                <span v-if="obj.gradeofTeacherCode=='GradeofTeachers_02'">带教</span>
              </div>
              
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
        title:"全部",
        selectShow:false,
        serchMode: '',
        showData: [],
        status:"",
        select:[
          {key:"",value:"全部"},
          {key:"GradeofTeachers_02",value:"带教"},
          {key:"GradeofTeachers_01",value:"助教"},
          
          
        ],
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
      // statu(e){ 
      //   this.status=e.target.value?e.target.value:""
      //   // return console.log(this.status)
      //   this.params.currentPage=1
      //   this.teacher=[];
      //   this.finished = false;
      //   this.loadData()
      // },
      onConfirm(item){
          console.log(item)
          let {key,value}=item
          this.status=key?key:""
          this.params.currentPage=1
          this.teacher=[];
          this.finished = false;
          this.title=value
          this.selectShow=false
          this.loadData()

      },
      isShow(){
         this.selectShow=true
      },
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
          teacherId: obj.teacherId,
          schedulingId : this.studentObj.schedulingId,
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
        obj.endDate = this.studentObj.endDate;
        obj.name = this.studentObj.humanName;
        obj.normalDepartmentId = this.studentObj.normalDepartmentId;
        obj.startDate = this.studentObj.startDate;
        obj.studentId = this.studentObj.humanId;
        obj.selfDepartment = true;
       
        obj.gradeofTeacherCode=this.status
        this.loading = true;
        this.utils.ajax({
          url: this.api.pagingAllotTeacherList,
          method: "post",
          data: obj,
          success: res => {
            console.log("REWS",res)
            // debugger
            if (res.totalPages > obj.currentPage) {
              obj.currentPage++;
            }else{
              this.finished = true;
              this.finishedText = "没有更多了";
            }
            this.loading = false;
            res.content.forEach(item => {
              this.teacher.push(item);
            });
            this.showData = this.teacher;
            console.log("列表",this.showData)
            // this.params.currentPage++;
          }
        })
      },
      getTime(obj) {
        return this.utils.formatDate(obj.startDate,'yyyy-MM-dd') + "至" + this.utils.formatDate(obj.endDate,'yyyy-MM-dd');
      },
      zdKey(code) {
        let name = null;
        [
          { 'key': "017_SpecialityTitle", 'value': "无" },
          { 'key': "001_SpecialityTitle", 'value': '主任医师' },
          { 'key': '002_SpecialityTitle', 'value': '副主任医师' },
          { 'key': '003_SpecialityTitle', 'value': '主治医师' },
          { 'key': "004_SpecialityTitle", 'value': "医师、医士" },
          { 'key': "005_SpecialityTitle", 'value': "主任药师" },
          { 'key': '006_SpecialityTitle', 'value': "副主任药师" },
          { 'key': "007_SpecialityTitle", 'value': "主管药师" },
          { 'key': "008_SpecialityTitle", 'value': "药师、药士" },
          { 'key': "009_SpecialityTitle", 'value': "主任护师" },
          { 'key': "010_SpecialityTitle", 'value': "副主任护师" },
          { 'key': "011_SpecialityTitle", 'value': "主管护师" },
          { 'key': "012_SpecialityTitle", 'value': "护师、护士" },
          { 'key': "013_SpecialityTitle", 'value': "主任技师" },
          { 'key': "014_SpecialityTitle", 'value': "副主任技师" },
          { 'key': "015_SpecialityTitle", 'value': "主管技师" },
          { 'key': "016_SpecialityTitle", 'value': "技师、技士" }

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
    position: relative;
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
    right: .5rem;
    color: #c6c6c6;
    font-size: 1rem;
  }
  .col_right{
    padding:  1rem;

    display: flex;
    align-items: center;
    justify-content: flex-end;
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
  .isGeneralQualification{
    border: 1px solid  #80BEFD;
    color: #80BEFD;
    border-radius:5px;
    padding: 0.08rem;
    font-size: 0.6rem; 
    margin-left: 0.1rem;
  }
</style>
