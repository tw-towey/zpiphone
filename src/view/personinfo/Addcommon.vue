<template>
  <div>
    <van-nav-bar :title="headerModel.title" class="header" fixed left-arrow @click-left="headerModel.onClickLeft" :right-text="headerModel.text"
      @click-right="headerModel.onClickRight" />
    <div style="margin-top:2.5rem;" class="personBox">
      <div style="margin-top:2.5rem;">
        <van-cell-group>
          <template v-for="(item,index) in templateData">
            <template v-if="item.type == 'text'">
              <van-field :required="item.required" v-model="item.value" :key="index" :label="item.name" :placeholder="item.placeholder"
                :border="false" :maxlength="item.maxlength" />
            </template>
            <template v-if="item.type == 'number'">
              <van-field :required="item.required" v-model="item.value" :key="index"
                :label="item.name" type="number" :maxlength="item.maxlength" :placeholder="item.placeholder"
                :border="false" />
            </template>
            <template v-if="item.type == 'autosize'">
              <van-cell :title="item.name" :key="index" :required="item.required"/>
              <van-field v-model="item.value" :key="index" type="textarea" :placeholder="item.placeholder"
                :border="false" />
            </template>
            <template v-if="item.type == 'fgBorder'">
              <div class="fgBorder" :key="index"></div>
            </template>
            <template v-if="item.type == 'switch'">
              <div :key="index" class="van-swict" v-if="item.issshow">
                <div :class="item.required ? 'van-field__label van-cell--required' : 'van-field__label' "> <span class="van-cell__title"> {{item.name}} </span></div>
                <van-switch v-model="item.value" size="20" @change="item.switchChange ? item.switchChange($event,index) : null"/>
              </div>
            </template>
            <template v-if="item.type == 'picker'">
              <van-field readonly 
                :value="item.value"
                :label="item.name" 
                :required="item.required"
                :key="index + 11"
                :placeholder="item.placeholder"
                :border="false" 
                @click="showAllPiker(item)" />
               <!-- <van-picker :title="item.title" v-if="item.selectShow" :columns="item.option" :key="index" show-toolbar
                value-key="value" @confirm="onConfirm" @cancel="hideAllPiker(item)" /> -->
            </template>
            <template v-if="item.type == 'date'">
              <div v-if="item.issshow" :key="index">
                <van-field readonly :value="item.value" :required="item.required" :label="item.name" :placeholder="item.placeholder"
                  :border="false" @click="showAllPiker(item)" />
                <!-- <van-datetime-picker v-if="item.selectShow" 
                  :title="item.title" 
                  type="date" 
                  :minDate="minDate"
                  @confirm="dateConfirmtime"
                  @cancel="hideAllPiker(item)" 
                  :value="item.value" /> -->
              </div>
            </template>
            <template v-if="item.type == 'file'">
              <div :class="item.required ? 'van-cell van-cell--borderless van-field van-cell--required' : 'van-cell van-cell--borderless van-field' " v-if="item.issshow" :key="index">
                <span style="display:inline-block; min-width:14rem">{{item.name}}</span>
                <span class="fileImg" v-if="item.value" @click="show_file($event, item)">
                  <img :src="item.value.path" v-if="item.value" alt />
                </span>
                <div class="uploadFile" @click="activeImgObj(item)">
                  <van-uploader :disabled="item.disabled" :after-read="onRead" accept multiple>
                    <van-icon name="plus" />
                  </van-uploader>
                </div>
              </div>
            </template>
          </template>
        </van-cell-group>
        <van-dialog v-model="shwoFile.flag" show-cancel-button cancel-button-text="删除" @cancel="delFile()"
          confirm-button-text="关闭">
          <div style="max-height:35rem" v-if="isImg(shwoFile.url)">
            <img v-if="isImg(shwoFile.url)" :src="shwoFile.url" width="100%" />
          </div>
          <div class="fileImg" v-if="!isImg(shwoFile.url)">
            <van-icon name="description" />
          </div>
          <div class="title-file" v-if="!isImg(shwoFile.url)">该文件类型暂不支持查看</div>
        </van-dialog>
      </div>
    </div>
    <!-- <div v-if="showModel" class="van-overlay"></div> -->
    <van-popup v-model="select.selectShow" position="bottom" :close-on-click-overlay="false" :style="{ width:'100%' }">
        <template v-if="select.type == 'picker'">
            <van-picker 
                v-if="select.selectShow && select.type == 'picker'"
                :title="select.title"
                :columns="select.option" 
                show-toolbar
                :default-index="select.defaultIndex"
                value-key="value" 
                @confirm="onConfirm" 
                @cancel="hideAllPiker(select)" />
        </template>
        <template v-if="(select.type == 'date' || select.type == 'date-month') && select.selectShow">
           <van-datetime-picker 
                :minDate="minDate" 
                :title="select.title"
                :type=" select.format ? select.format : 'date'" 
                @confirm="dateConfirmtime"
                @cancel="hideAllPiker(select)" 
                v-model="select.value" /> 
        </template>
   </van-popup>  
  </div>
</template>
<script>
export default {
  name: "Addcommon",
  components: {},
  data() {
    return {
      minDate:new Date(1980,0,1),
      select: {},
      temSelect:{},
      isHasFile:{},
      updataImgObj: {},
      shwoFile: {
        flag: false,
        url: ""
      },
      showModel: false,
      idint: "",
      resParms: "",
      dataAtt: "",
    };
  },
  props: ["templateData",'headerModel','editModel','itemDetail'],
  methods: {
    onConfirm(event) {
      this.select.key = event.key;
      this.select.value = event.value;
      this.hideAllPiker();
    },
    hideAllPiker(item) {
      this.select.selectShow = false;
      this.templateData.forEach(item => {
        if (item.hasOwnProperty("selectShow")) {
          item.selectShow = false;
          this.showModel = false;
        }
      });
    },
    showAllPiker(item) {
      if(item.type == "date" || item.type == "date-month"){
        this.temSelect = item;
        this.select = this.utils.deepClone(item);
        this.select.value = this.select.value ? new Date(this.select.value) : new Date();
      }else{
        this.select = item; 
        this.changeIndex(item.value,item.option)
      }
      this.select.selectShow = true;
    },
    changeIndex(code, opts) {
      if (!opts) {
        return;
      }
      for (let i = 0; i < opts.length; i++) {
          let item = opts[i];
          if(code == item.value){
              this.select.defaultIndex = i;
              return
          }
      }
      return;
    },
    dateConfirmtime(val) {
      if(this.select.format){
        this.select.value = this.utils.formatDate(val, "yyyy-MM", true);
        this.temSelect.value = this.utils.formatDate(val, "yyyy-MM", true);
      }else{
        this.select.value = this.utils.formatDate(val, "yyyy-MM-dd", true);
        this.temSelect.value = this.utils.formatDate(val, "yyyy-MM-dd", true);
      }
      this.hideAllPiker();
    },
    delFile() {
      Object.keys(this.isHasFile).forEach((item)=>{
          if(this.isHasFile[item] == this.select.value.path){
              delete this.isHasFile[item]
          }
      })
      this.select.value = "";
    },
    isImg(str) {
      if (
        /.jpg/.test(str) ||
        /.jpeg/.test(str) ||
        /.png/.test(str) ||
        /.gif/.test(str)
      ) {
        return true;
      } else {
        return false;
      }
    },
    onRead(file) {
      let flag = true;
      if (this.utils.checkSuffix(file.file.name)) {
        if (this.updataImgObj.value.path) {
          this.Dialog.confirm({
            title: "提示",
            message: "当前已有文件,是否替换？"
          })
          .then(() => {
            this.updataFile(file);
          })
          .catch(() => { });
        } else {
          this.updataFile(file);
        }
      } else {
        this.Toast("请选择bmp, jpg, jpeg, png, gif的格式图片");
        return false;
      }
    },
    onBefore(file) {
      console.log(file);
      return false;
    },
    updataFile(file) {
      let _this = this;  
      let flag = true;
      let content = this.utils.encryptByEnMd5(file.content);
      if(content && this.isHasFile.hasOwnProperty(content)) {
        this.Toast("该文件已存在，请选择其他文件");
        return;
      }else{
          this.utils.fileUploader(file, data => {
              _this.isHasFile[content] = true;
              console.log(this.updataImgObj, data);
              this.updataImgObj.value = {
                path: data.url,
                // md5: res.data.md5,
                name: data.name
              };
            });
       }
    },

    activeImgObj(updataImgObj) {
      this.updataImgObj = updataImgObj;
    },

    show_file(e, item, index) {
      e.stopImmediatePropagation();
      this.select = item;
      this.shwoFile.flag = true;
      this.shwoFile.url = item.value.path;
      this.shwoFile.index = index;
    },
    changeCode(code, opts) {
      let codeVal;
      opts.forEach(item => {
        if (code == item.key) {
          codeVal = item.value;
        }
      });
      return codeVal;
    },

    isImgtea(str) {
      if (
        /.jpg/.test(str) ||
        /.jpeg/.test(str) ||
        /.png/.test(str) ||
        /.gif/.test(str)
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    
  },
  created() {
  }
};
</script>
<style scoped>
.personBox .van-cell__title {
  white-space: nowrap;
}
.personBox .van-cell {
  justify-content: space-between;
}
.personBox .van-picker {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 16rem;
  z-index: 10;
}
.personBox .van-field__control {
  text-align: right;
}
.personBox .van-field__label {
  min-width: 10rem;
}
.personBox .van-cell__title {
  white-space: nowrap;
}
.personBox .van-swict {
    justify-content: space-between;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding: 0.625rem 0.9375rem;
}
.van-switch__node{
    z-index: 0;
}
.uploadFile {
  position: relative;
  display: inline-block;
  font-size: 2rem;
  height: 2rem;
  width: 2rem;
  border-radius: 0.5rem;
  border: 0.04rem solid #e1e1e1;
  vertical-align: middle;
  margin-right: 0.925rem;
  margin-left: 1rem;
}
.van-switch__node{
    z-index: 0;
}
.fgBorder {
  height: 10px;
  width: 100%;
  background: #f2f2f2;
  border-bottom: 0.2rem;
}
.personBox .van-field__body textarea {
  text-align: left;
  height: 6rem !important;
  border: 1px solid #ccc;
  padding: 0 0.2rem;
}
.fileImg img {
  width: 2rem;
  height: 2rem;
  vertical-align: middle;
}
.personBox .van-cell__value {
  width: 100% !important;
}
.personBox .van-cell--required::before{
    content: '*';
    position: absolute;
    left: 0.4375rem;
    font-size: 0.875rem;
    color: #f44;
}
</style>

