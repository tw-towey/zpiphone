<template>
   <div>
      <van-nav-bar title="入科登记" class="header" fixed left-arrow @click-left="onClickLeft"/>
       <div style="margin-top:2.5rem;" class="personBox">
      <div style="margin-top:2.5rem;">
        <van-cell-group>
          <template v-for="(item,index) in templateData">
            <template v-if="item.type == 'text' && item.isShow">
              <!-- <van-cell :title="item.name" :value="item.value" /> -->
              <van-field
                :key="index"
                :value="item.value"
                :label="item.name"
                :placeholder="item.placeholder"
                :border="false"
                :disabled="item.disabled"
                @input="fieldChange"
                @focus="fieldFocus(item)"
                :maxlength="item.maxlength"
              />
            </template>
            <template v-if="item.type == 'radio'">
              <div style="display:flex;line-height:1.5rem;padding: 0.625rem 0.9375rem" :key="index">
                <div class="van-field__label van-cell__title enterke" ><span >入科：</span></div>
                <van-radio-group v-model="item.value" style="display:flex;" >
                  <van-radio name="4" checked-color="#07c160" @click="radioClick(item)">已报到</van-radio>
                  <van-radio name="3" style="margin-left:1rem" @click="radioClick(item)" checked-color="#07c160">未报到</van-radio>
                </van-radio-group>
              </div>
            </template>
            <template v-if="item.type == 'autosize'">
              <van-cell :title="item.name" :required="item.required" :key="index"/>
              <van-field
                :value="item.value"
                type="textarea"
                :maxlength="200"
                :key="index"
                :placeholder="item.placeholder"
                :border="false"
                @input="fieldChange"
                @focus="fieldFocus(item)"
              />
            </template>

            <template v-if="item.type == 'picker' && item.isShow">
              <van-field
                :key="index"
                readonly
                :value="item.value"
                :label="item.name"
                :placeholder="item.placeholder"
                :border="false"
                @click="showAllPiker(item)"
              />
              <van-picker
                :title="item.name"
                v-if="item.selectShow"
                :columns="item.option"
                :key="index"
                show-toolbar
                value-key="name"
                @confirm="onConfirm"
                @cancel="hideAllPiker(item)"
              />
            </template>
            <template v-if="item.type == 'date' && item.isShow">
              <div v-if="item.isShow" :key="index">
                <van-field
                  readonly
                  :value="item.value"
                  :label="item.name"
                  :placeholder="item.placeholder"
                  :border="false"
                  @click="showAllPiker(item)"
                />
                <van-datetime-picker
                  v-if="item.selectShow"
                  :title="item.title"
                  v-model="currentDate"
                  type="date"
                  @confirm="dateConfirmtime"
                  @cancel="hideAllPiker(item)"
                  :value="item.value"
                />
              </div>
            </template>
          </template>
        </van-cell-group>
      </div>
    </div>
    <footer>
        <div class="button">
          <p class="entry" style="width:100%" @click="entryType()">提交</p>
        </div>
    </footer>
     <div v-if="showModel" class="van-overlay"></div>
   </div>
</template>
<script>

export default {
  name:"Entrymodel",
  components:{
  },
  data() {
    var startTime = this.utils.formatDate(new Date().getTime(),'yyyy-MM');
    return {
      select: {},
      showModel:false,
      departments:[],
      currentDate:new Date(),
      templateData: [],
      showModel: false,
      idint: "",
      params:'',
      resParms: {},
      dataAtt:"",
    }
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    radioClick(item){
      if(this.$route.params.type == 0){
        if(item.value == 3){ //未报到
          this.templateData[1].isShow = false;
          this.templateData[2].isShow = false;
          this.templateData[3].isShow = false;
          this.templateData[this.templateData.length-1].required = true;
        }else{ //已报到 4
          this.templateData[1].isShow = true;
          this.templateData[2].isShow = true;
          this.templateData[3].isShow = true;
          this.templateData[this.templateData.length-1].required = false;
        }
      }else{
        if(item.value == 3){
          this.templateData[1].isShow = false;
          this.templateData[2].required = true;
        }else{
          this.templateData[1].isShow = true;
          this.templateData[2].required = false;
        }
      }
    },
    onConfirm(event) {
      this.select.key = event.caId;
      this.select.value = event.name;
      this.hideAllPiker();
    },
    hideAllPiker(item) {
      this.templateData.forEach(item => {
        if (item.hasOwnProperty("selectShow")) {
          item.selectShow = false;
          this.showModel = false;
        }
      });
    },
    showAllPiker(item) {
      this.select = item;
      this.hideAllPiker();
      item.selectShow = true;
      this.showModel = true;
    },
    fieldChange(val) {
      if (this.select.id == "workTime" && val * 1 > 50) {
        this.select.value = 50;
      } else {
        this.select.value = val;
      }
    },
    fieldFocus(item) {
      this.select = item;
    },
    /**
     * 获取科室
     */
    getQueryDepartments(){
      this.utils.ajax(
        {
          url: this.api.queryDepartments,
          data: {},
          method: "POST",
          success: res => {
             this.departments = res;
             this.initLInst();
          }
      });
    },
    dateConfirmtime(val) {
      this.select.value = this.utils.formatDate(val, "yyyy-MM-dd", true);
      this.hideAllPiker();
    },
    queryModel(obj) {
      // 回显
      let _this = this;
      this.utils.ajax(
        {
          url: this.api.selectTeacherInfoByTeacherId,
          data: obj,
          method: "POST",
          success: res => {

          }
      });
    },

    changeCode(code, opts) {
     let codeVal;
      opts.forEach(item => {
        if(code == item.key){
          codeVal = item.value;
        }
      });
      return codeVal;
    },

    initLInst() {
      if(this.$route.params.type == 0){
        this.templateData = [
            {
              id: "status",
              name: "入科",
              title: "入科",
              isShow:true,
              value: "",
              type: "radio",
              selectShow: false,
              placeholder: "请选择入科",
              option: [],
              key: ""
            },
            {
              id: "checkInTime",
              name: "报到日期",
              title: "报到日期：",
              value: this.utils.formatDate(new Date(), "yyyy-MM-dd", true ),
              selectShow:false,
              isShow: true,
              type: "date",
              placeholder: "请选择报到日期",
              key: ""
            },
            {
              id: "departmentName",
              name: "轮转科室：",
              title: "轮转科室",
              value: "",
              type: "text",
              disabled:true,
              isShow: true,
              selectShow: false,
              placeholder: "请输入轮转科室",
              key: ""
            },
            // {
            //   id: "modifyDepartmentId",
            //   name: "报到科室",
            //   title: "报到科室",
            //   value: "",
            //   isShow: true,
            //   type: "picker",
            //   selectShow: false,
            //   placeholder: "请选择报到科室",
            //   option: this.departments,
            //   key: ""
            // },
            {
              id: "remark",
              name: "备注：",
              value: "",
              selectShow: false,
              type: "autosize",
              placeholder: "请输入备注"
            }
          ];
        this.templateData[2].value = this.params[0].departmentName;
        // this.templateData[3].value = this.params[0].departmentName;
        this.departments.forEach(element => {
          if(element.name == this.params[0].departmentName){
            this.templateData[3].key = element.caId
          }
        });

      }else{
        this.templateData = [
            {
              id: "status",
              name: "入科",
              title: "入科",
              isShow:true,
              value: "",
              type: "radio",
              selectShow: false,
              placeholder: "请选择入科",
              option: [],
              key: ""
            },
            {
              id: "checkInTime",
              name: "报到日期",
              title: "报到日期：",
              value: this.utils.formatDate(new Date(), "yyyy-MM-dd", true ),
              selectShow:false,
              isShow: true,
              type: "date",
              placeholder: "请选择报到日期",
              key: ""
            },
            {
              id: "remark",
              name: "备注：",
              value: "",
              selectShow: false,
              type: "autosize",
              placeholder: "请输入备注"
            }
          ];
      }
    },

    getParms(){
      let flag = false;
      let parmsObj = {};
      this.templateData.forEach(element => {
          if(element.value.length>0){
          if(element.id == "modifyDepartmentId"){
             parmsObj[element.id] = element.key;
          }else{
            parmsObj[element.id] = element.value;
          }
          }else if(element.required){
            this.Toast("请填写备注");
            flag = true;
          }else if(element.id == 'status'){
            this.Toast("请选择入科状态");
            flag = true;
          }
      });
      if(flag){
        return false;
      }else{
        return  parmsObj;
      }
    },

    entryType(){
        let parmsObj = this.getParms();
        if(!parmsObj){
          return false;
        }
        this.resParms.datas = [];
      //  if(parmsObj.status === 4){
        this.resParms.checkInTime =  parmsObj.checkInTime;
        this.resParms.remark = parmsObj.remark;
        this.resParms.status = parmsObj.status;
        let checkInTime;
        if(this.$route.params.type === 0){
          if(parmsObj.checkInTime){
            checkInTime = parmsObj.checkInTime;
          }else{
            checkInTime = this.params[0].startTime;
          }
          this.resParms.datas.push(
              {
                registrationTime:  checkInTime,
                departmentId:  this.params[0].departmentId,
                id: this.params[0].id,
                registrationRemark: parmsObj.remark,
                registrationStatus: parmsObj.status,
                // modifyDepartmentId: parmsObj.modifyDepartmentId,
                // studentId: this.params[0].studentId
              }
           )
        }else{
          this.params.forEach(element => {
            if(parmsObj.checkInTime){
              checkInTime = parmsObj.checkInTime;
            }else{
              checkInTime = element.startTime;
            }
            this.resParms.datas.push(
                {
                  registrationTime:  checkInTime,
                //   departmentId:  element.departmentId,
                  id: element.id,
                  registrationRemark: parmsObj.remark,
                  registrationStatus: parmsObj.status,
                //   modifyDepartmentId: element.departmentId,
                //   studentId: element.studentId
                }
              )
          });
        }
        this.ajaxUpdateEntryDepartmentStatus(this.resParms.datas);
      },
     ajaxUpdateEntryDepartmentStatus (obj) {
        this.utils.ajax({
          url: this.api.updateEntryDepartmentStatus,
          data: obj,
          method: "POST",
          success: data => {
            this.onClickLeft();
          }
        });
    },
  },
  mounted() {
    this.params =  this.$route.params.data;
    this.getQueryDepartments();
  },
  created() {
  }
}
</script>
<style>
.van-picker {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 16rem;
  z-index: 10;
}
.enterke::before{
  content: '*';
  position: absolute;
  left: 0.4375rem;
  font-size: 0.875rem;
  color: #f44;
}
</style>
