<template>
  <div class>
    <van-nav-bar title="填写问卷" class="header" fixed left-arrow @click-left="onClickLeft" />
    <div class="layout_content">
      <div class="content_box">
        <div>
          <img class="img" v-if="imgShow" :src="headImg" alt />
          <img class="img" v-else src="../../assets/images/page/pic02.jpg" alt />
        </div>
        <div class="write">
          <p>{{$route.params.i.surveyName}}</p>
          <p>{{$route.params.i.intro}}</p>
          <p>
            <span>日期：{{$route.params.item.monthName + '' + $route.params.item.dayName + '' + $route.params.item.weekName}}</span>
            <span></span>
          </p>
          <p>
            <span>发起人：{{$route.params.i.createUserName}}</span>
            <span></span>
          </p>
        </div>
        <div class="survey" v-for="(item,index) in list" :key="index">
          <div v-if="item.questionType ==4 && item.flag==true" class="survey_address">
            <ul class="survey_content" v-if="disabled">
              <li class="survey_positoning">
                <p>
                  <font v-if="item.isOptional" color="red"></font>
                  {{index+1}}.{{item.question}}
                </p>
                <p @click="authority('res')">获取定位</p>
              </li>
              <li class="survey_location">
                <span>{{locationObj.locationDetail}}</span>
                <span @click="authority('res')" class="a">更新定位</span>
              </li>
            </ul>

            <ul class="survey_content" v-if="!disabled">
              <li class="survey_positoning">
                <p>
                  <font v-if="item.isOptional" color="red">*</font>
                  {{index+1}}.{{item.question}}
                </p>
              </li>
              <li class="survey_location">
                <span>{{item.value}}</span>
              </li>
            </ul>
          </div>
          <div v-if="item.questionType ==1" class="single">
            <ul class="survey_content">
              <li class="survey_positoning">
                <p class="single_p">
                  <span>
                    <font v-if="item.isOptional" color="red">*</font>
                    {{index+1}}.{{item.question}}
                  </span>
                  <span>单选</span>
                </p>
              </li>
              <li class="survey_location">
                <van-radio-group v-model="item.value" :disabled="!disabled">
                  <div v-for="(i,ind) in item.optionList" :key="ind" class="optistyle">
                    <van-radio :name="i.value">
                      <img slot="icon" slot-scope="props" :src="props.checked ? icon.active : icon.normal"
                        class="dadioimg" />
                      <p>{{i.label}}</p>
                    </van-radio>
                    <van-icon name="question-o" @click="promptClick(i,ind,index)" v-if="i.promptFlag"
                      class="optistyleabslut" />
                    <p v-if="i.promptDefault" class="pSize">{{i.prompt}}</p>
                  </div>
                </van-radio-group>
              </li>
            </ul>
          </div>
          <div v-if="item.questionType ==2" class="single">
            <ul class="survey_content">
              <li class="survey_positoning">
                <p class="single_p">
                  <span>
                    <font v-if="item.isOptional" color="red">*</font>
                    {{index+1}}.{{item.question}}
                  </span>
                  <span>多选</span>
                </p>
              </li>
              <li class="survey_location">
                <van-checkbox-group v-model="item.value" :disabled="!disabled">
                  <div v-for="(i,ind) in item.optionList" :key="ind" class="optistyle">
                    <van-checkbox :name="i.value">
                      <van-icon name="question-o" v-if="item.promptFlag" />
                      <img slot="icon" slot-scope="props" :src="props.checked ? iconimg.active : iconimg.normal"
                        class="dadioimg" />
                      <p>{{i.label}}</p>
                    </van-checkbox>
                    <van-icon name="question-o" @click="promptClick(i,ind,index)" v-if="i.promptFlag"
                      class="optistyleabslut" />
                    <p v-if="i.promptDefault" class="pSize">{{i.prompt}}</p>
                  </div>
                </van-checkbox-group>
              </li>
            </ul>
          </div>

          <div v-if="item.questionType ==3 && item.id !='teacharName'" class="single">
            <ul class="survey_content">
              <li class="survey_positoning">
                <p class="single_p">
                  <span>
                    <font v-if="item.isOptional" color="red">*</font>
                    {{index+1}}.{{item.question}}
                  </span>
                  <span>问答</span>
                </p>
              </li>
              <li class="survey_location1">
                <van-field v-if="(item.maxLength*1 > 50)?false:true" v-model="item.value" type="textarea"
                  :placeholder="item.placeholder" :disabled="!disabled" :maxlength="item.maxLength" />
                <div v-else :class="item.value==''?'colortext':'textHtml'"
                  @click="disabled && textareaclick(true,item)">
                  {{item.value}}
                </div>
              </li>
            </ul>
          </div>

          <div v-if="item.questionType ==3 && item.id =='teacharName'" class="single">
            <ul class="survey_content">
              <li class="survey_positoning">
                <p class="single_p">
                  <span>
                    <font v-if="item.isOptional" color="red">*</font>
                    {{index+1}}.{{item.question}}
                  </span>
                  <span>问答</span>
                </p>
              </li>
              <li class="survey_location1">
                <van-field @click="disabled && teacharclick(true,item)" v-model="item.value" type="textarea"
                  :placeholder="item.placeholder" :disabled="!disabled" :maxlength="item.maxLength" />
              </li>
            </ul>
          </div>

          <!-- <div v-if="item.questionType ==5" class="single">
            <ul class="survey_content">
              <li class="survey_positoning">
                <p class="single_p">
                  <span>
                    <font v-if="item.isOptional" color="red">*</font>
                    {{index+1}}.{{item.question}}
                  </span>
                  <span>简述</span>
                </p>
              </li>
              <li class="survey_location1">
                <van-field
                  @click="textareaclick(true,item)"
                  v-model="item.value"
                  type="textarea"
                  :placeholder="item.placeholder"
                  :disabled="!disabled"
                />
              </li>
            </ul>
          </div> -->
          <div v-if="item.questionType ==6" class="single">
            <ul class="survey_content">
              <li class="survey_positoning">
                <p class="single_p">
                  <span>
                    <font v-if="item.isOptional" color="red">*</font>
                    {{index+1}}.{{item.question}}
                  </span>
                  <span>日期</span>
                </p>
              </li>
              <li class="survey_location1">
                <!-- <div class="dataStyle" @click="disabled && changeShowStatus('showEndTime', true,item)">
                   <img src="../../assets/images/home/pic_zp-27.png" alt="">
                   <p>{{item.value}}</p>
                </div>-->
                <van-cell title="选择日期" :value="item.value" is-link
                  @click="disabled && changeShowStatus('showEndTime', true,item)" />
              </li>
            </ul>
          </div>
          <div v-if="item.questionType ==7" class="single">
            <ul class="survey_content">
              <li class="survey_positoning">
                <p class="single_p">
                  <span>
                    <font v-if="item.isOptional" color="red">*</font>
                    {{index+1}}.{{item.question}}
                    <font color="red">(JPG、JPEG格式，两寸白底彩色免冠证件照片，分辨率不大于413*626，大小不超过300K)</font>
                  </span>
                  <span>上传</span>
                </p>
              </li>
              <li class="survey_location1">
                <div class="file_box">
                  <div class="fileList" v-for="(file, ind) in item.value" :key="ind">
                    <div class="imgCli" v-if="isImg(file.path)">
                      <img :src="file.path" @click="disabled && show_file($event, file.path, index)" />
                      <div class="boxfile" @click="disabled && show_file($event, file.path, index)">
                        <van-icon v-if="!isImg(file.path)" name="description" />
                      </div>
                      <div class="imgpositi" v-if="disabled" @click="delFile()">x</div>
                    </div>
                  </div>
                  <div class="uploadFile" v-if="!item.flag">
                    <van-uploader :after-read="onRead" accept multiple>
                      <van-icon name="plus" />
                    </van-uploader>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div style="height: 3rem;"></div>
        <p v-if="disabled" class="submit" @click="submit()">提交</p>
      </div>
      <van-popup v-model="showEndTime.show" position="bottom" :overlay="true">
        <van-datetime-picker v-if="showEndTime.show" :value="currentTime" :type="showEndTime.data.type"
          :min-date="currentDate" :formatter="formatter" @confirm="confirmTimet"
          @cancel="changeShowStatus('showEndTime', false)" />
      </van-popup>
      <van-dialog v-model="shwoFile.flag" show-cancel-button cancel-button-text="删除" @cancel="delFile()"
        confirm-button-text="关闭">
        <img class="image" v-if="isImg(shwoFile.url)" :src="shwoFile.url" width="100%" />
        <div class="fileImg" v-if="!isImg(shwoFile.url)">
          <van-icon name="description" />
        </div>
        <div class="title-file" v-if="!isImg(shwoFile.url)">该文件类型暂不支持查看</div>
      </van-dialog>
    </div>
    <div v-if="textareaShow.show" class="delog">
      <van-nav-bar :title="textareaShow.data.question" class="header" fixed left-arrow @click-left="ondelogLeft" />
      <div class="layout_content">
        <div class="textareadelog">
          <textarea name id cols :maxlength="textareaShow.data.maxLength" v-model="textareaShow.value"
            :placeholder="textareaShow.data.placeholder" :disabled="!disabled" rows="33"
            @buiur="buiurclick()"></textarea>
        </div>
        <p class="submit" @click="textareaclick(false,'')">完成编辑</p>
      </div>
    </div>
    <div v-if="teachShow.show" class="delog">
      <van-nav-bar title="带教老师查询" class="header" fixed left-arrow @click-left="teachLeft" />
      <div class="layout_content">
        <van-search v-model="teachShow.value" placeholder="请输入带教老师姓名，手机号" show-action shape="round" @search="onSearch"
          label>
          <div slot="action" @click="onSearch(teachShow.value)">搜索</div>
        </van-search>
        <div class="searchTable">
          <div class="search_top">
            <ul class="search_head">
              <li class="search_headli">姓名</li>
              <li class="search_headli1">手机号</li>
              <li class="search_headli2">科室</li>
            </ul>
            <div class="search_content">
              <van-list v-model="loading" :finished="finished" :error.sync="error" error-text="请求失败，点击重新加载"
                :finished-text="finishedText" immediate-check :offset="50" @load="onLoad()">
                <div v-for="(item,index) in searchList" :key="index">
                  <ul :class="item.checked?'search_headgren':'search_head'" @click="seachClick(item)">
                    <li class="search_headli">{{item.name}}</li>
                    <li class="search_headli1">{{item.cellphone}}</li>
                    <li class="search_headli2">
                      <span v-for="(i,ind) in item.humanDepartmentVOList" :key="ind">
                        <span>{{i.departmentName}}</span>
                        <span v-if="item.humanDepartmentVOList.length!=(ind+1)">，</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </van-list>
            </div>
          </div>
        </div>
        <p class="submit" @click="teacharclick(false,'')">保存</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "fillin",
  components: {},
  data () {
    return {
      loading: false,
      finished: false,
      error: false,
      finishedText: "没有更多了",
      list: "",
      listDate: {
        placeholder: ""
      },
      locationObj: {
        locationDetail: "正在获取当前位置",
        latitudeAndLongitude: ""
      },
      currentTime: new Date(),
      latitudeObj: {
        latitude: "",
        distance: ""
      },
      headImg: "",
      imgShow: true,
      minName: "",
      radio: [],
      result: [],
      id: "",
      disabled: true,
      icon: {
        normal: require("../../assets/images/home/pic_ses-01.svg"),
        active: require("../../assets/images/home/pic_ses-02.svg")
      },
      iconimg: {
        normal: require("../../assets/images/home/pic_cks-01.svg"),
        active: require("../../assets/images/home/pic_cks-02.svg")
      },
      currentDate: new Date(2019, 0, 1),
      showEndTime: {
        show: false,
        data: {
          value: "",
          type: "date"
        }
      },
      shwoFile: {
        flag: false,
        url: ""
      },
      textareaShow: {
        show: false,
        value: "",
        data: {}
      },
      teachShow: {
        show: false,
        value: "",
        data: {}
      },
      searchList: []
    };
  },
  methods: {
    onClickLeft () {
      this.utils.goBack(this);
    },
    onLoad () {
      setTimeout(() => {
        this.teachsach("", true);
      }, 100);
    },
    save () {
      let _this = this;
      this.utils.ajax({
        url: this.api.selectSurveyHuman,
        data: {
          surveyId: this.$route.params.id,
          date: this.$route.params.date
        },
        method: "POST",
        success: data => {
          if (data.surveyHuman == "" || data.surveyHuman == null) {
            data.survey.question.forEach((item, index) => {
              if (this.disabled) {
                item.placeholder = "请输入" + item.question;
              } else {
                item.placeholder = "";
              }
              if (item.questionType == 4 && item.flag != true) {
                data.survey.question.splice(index, 1);
              }
            }); 
            this.list = data.survey.question;
            _this.authority("", true);
            _this.getHumanInfoById();
          } else {
            if (data.surveyHuman.answer == "") {
              data.survey.question.forEach((item, index) => {
                if (this.disabled) {
                  item.placeholder = "请输入" + item.question;
                } else {
                  item.placeholder = "";
                }
                if (item.questionType == 4 && item.flag != true) {
                  data.survey.question.splice(index, 1);
                }
              });
              this.id = data.surveyHuman.id;
              this.list = data.survey.question;
              this.authority("", true);
              _this.getHumanInfoById();
            } else {
              data.surveyHuman.answer.forEach((item, index) => {
                if (this.disabled) {
                  item.placeholder = "请输入" + item.question;
                } else {
                  item.placeholder = "";
                }
                if (item.questionType == 4 && item.flag == true) {
                  this.locationObj.locationDetail = item.value;
                }
                if (item.questionType == 4 && item.flag != true) {
                  data.survey.question.splice(index, 1);
                }
                if (item.id == "idNumber") {
                  if (item.value != "") {
                    item.value = this.utils.encryptByDeAES(item.value);
                  }
                }
              });
              this.list = data.surveyHuman.answer;
              this.id = data.surveyHuman.id;
            }
          }
          _this.headImg = data.survey.headImg;
          if (_this.headImg == "") {
            _this.imgShow = false;
          }
        }
      });
    },
    changeShowStatus (name, status, item) {
      console.log(item, "5464564");
      if (item) {
        if (item.id == "startDate" || item.id == "endDate") {
          this.currentDate = new Date(2019, 0, 20);
        } else {
          this.currentDate = new Date(2014, 0, 1);
        }
      }
      //更改弹出层状态
      this.showEndTime.show = status;
      this.showEndTime.data = item;
    },
    teacharclick (status, item) {
      this.teachShow.show = status;
      if (status) {
        this.teachsach("");
        this.teachShow.data = item;
      } else {
        // this.teachShow.data.value =
        this.searchList.forEach(i => {
          if (i.checked) {
            this.teachShow.data.value = i.name;
            this.teachShow.data.teacherId = i.caid;
          }
        });
      }
    },
    textareaclick (status, item) {
      if (status) {
        this.textareaShow.data = item;
        this.textareaShow.value = this.textareaShow.data.value;
        this.buiurclick();
      } else {
        this.textareaShow.data.value = this.textareaShow.value;
      }

      this.textareaShow.show = status;
    },
    ondelogLeft () {
      this.textareaShow.show = false;
    },
    teachLeft () {
      this.teachShow.show = false;
    },
    formatter (type, value) {
      return this.utils.pickerType(type, value);
    },
    confirmTimet (value) {
      //时间确定
      if (
        this.showEndTime.data.id == "startDate" ||
        this.showEndTime.data.id == "endDate"
      ) {
        let startDate = new Date(value).getTime();
        let dateTime = new Date().getTime();
        if (startDate > dateTime) {
          this.Toast(this.showEndTime.data.question);
          this.showEndTime.show = false;
          return;
        }
      }
      this.showEndTime.show = false;
      this.showEndTime.data.value = this.utils
        .formatDate(value, "yyyy-MM-dd", true)
        .replace(/-/g, "/");
    },
    onRead (file) {
      // 上传
      let size = file.file.size / 1024 < 300;
      if (!size) {
        this.Toast("图片大小不得超过300k,请重新上传");
        return;
      }
      let _this = this;
      let flag = true;
      let _formData = new FormData();
      _formData.append("file", file.file);
      this.utils.ajax({
        url: this.api.fileMD5,
        method: "post",
        processData: false,
        contentType: false,
        data: _formData,
        success: res => {
          let flag = true;
          _this.list.forEach(item => {
            if (item.questionType == 7) {
              item.value.forEach(i => {
                if (i.md5 == res.data.md5) {
                  flag = false;
                }
              });
              if (item.value.length > 0) {
                item.flag = true;
              }
            }
          });
          if (flag) {
            _this.utils.fileUploader(file, data => {

              _this.list.forEach(item => {
                if (item.questionType == 7) {
                  if (!_this.utils.checkSuffix(data.name)) {
                    this.Toast('图片格式错误，请上传格式为"jpg"的照片');
                    return;
                  }
                  this.imgSizeLimit(413,626,data.url).then(()=>{
                        item.value.push({
                            path: data.url,
                            md5: res.data.md5,
                            name: data.name
                        });
                        if (item.value.length > 0) {
                            item.flag = true;
                        }
                  },()=>{
                    _this.Toast("请上传尺寸小于413（宽）*626（高）的图片");
                  });
                }
              });
            });
          } else {
            _this.Toast("该文件已存在，请选择其他文件");
          }
        }
      });
    },
    imgSizeLimit(w,h,url){
        var _this = this;
        var img = new Image();  
        img.src = url;
        return new Promise((resole,reject)=>{
            img.onload = function () {
                console.log("img is loaded");
                if(img.width >= w || img.height > h){
                    reject();
                }else{
                    resole();
                }
            };  
            img.onerror = function () {
                this.Toast("error");
            };  
        })
    },
    onSearch (name) {
      // 搜索
      this.searchList = [];
      this.teachsach(name);
    },
    delFile () {
      this.list.forEach(item => {
        if (item.questionType == 7) {
          item.value = [];
          item.flag = false;
        }
      });
      // this.modeData[this.modeData.length - 1].value.splice(this.shwoFile.index, 1);
    },
    teachsach (name, flage) {
      // 查询搜索带教老师
      let params = {
        currentPage:
          Math.ceil(this.searchList.length / this.$store.state.pageSize) + 1,
        pageSize: this.$store.state.pageSize,
        teacherNameOrPhone: name
      };
      this.utils.ajax({
        url: this.api.teacherList,
        data: params,
        method: "POST",
        success: data => {
          if (data.content.length) {
            const content = data.content.map(item => {
              const i = item;
              i.checked = false;
              return i;
            });
            if (flage) {
              this.searchList = [...this.searchList, ...content];
            } else {
              this.searchList = content;
            }
            this.searchList.forEach(item => {
              if (item.caid == this.teachShow.data.teacherId) {
                item.checked = true;
              }
            });
          } else {
            this.finishedText = "暂无数据...";
          }
          this.loading = false; //结束当前加载
          if (params.currentPage >= data.totalPages) {
            //最后一页、加载完成
            this.finished = true;
          }
        }
      });
    },
    show_file (e, url, index) {
      e.stopImmediatePropagation();
      this.shwoFile.flag = true;
      this.shwoFile.url = url;
      this.shwoFile.index = index;
    },
    checkSuffix (fileName) {
      /**
       * 检查是不是图片
       * @param fileName
       * @returns {boolean}
       */
      const imgSuffixs = ["jpg"];
      const index = fileName.lastIndexOf(".");
      const suffix = fileName.substr(index + 1).toLowerCase();

      if (!suffix) {
        return false;
      }
      return imgSuffixs.includes(suffix);
    },
    isImg (str) {
      if (/.jpg/.test(str) || /.JPG/.test(str) || /.jpeg/.test(str) || /.JPEG/.test(str) || /.png/.test(str) || /.gif/.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    authority (det, flag) {
      if (!flag) {
        this.Toast.loading({
          mask: true,
          message: "定位中...",
          duration: 0
        });
      }
      this.webApp.WebCallApp("positioningPoint", {}, res => {
        if (!flag) {
          setTimeout(() => {
            this.Toast.clear();
          }, 500);
        }
        if (this.webApp.isInIOS()) {
          if (res.result.state) {
            this.locationObj.locationDetail = "位置信息获取失败";
            this.locationObj.latitudeAndLongitude = "";
            this.location(det);
          } else {
            if (res.result.code === 0) {
              this.locationObj.locationDetail = res.result.address;
              this.locationObj.latitudeAndLongitude =
                res.result.longitude + "," + res.result.latitude;
              this.locationObj.flage = true;
            } else {
              this.locationObj.locationDetail = "位置信息获取失败";
              this.Toast("定位失败");
              this.locationObj.latitudeAndLongitude = "";
              this.locationObj.flage = false;
            }
          }
        } else {
          if (res.result.args) {
            this.locationObj.locationDetail = "位置信息获取失败";
            this.locationObj.latitudeAndLongitude = "";
            if (res.result.args.state) {
              this.location(det);
            } else {
              this.Toast("定位失败");
            }
          } else {
            if (res.result.code === 0) {
              this.locationObj.locationDetail = res.result.address;
              this.locationObj.latitudeAndLongitude =
                res.result.longitude + "," + res.result.latitude;
              this.locationObj.flage = true;
            } else {
              this.locationObj.locationDetail = "位置信息获取失败";
              this.locationObj.latitudeAndLongitude = "";
              this.Toast("定位失败");
              this.locationObj.flage = false;
            }
          }
        }
      });
    },
    location (det) {
      if (det) {
        this.locationObj.locationDetail = "正在更新位置...";
      }
      AMap.plugin("AMap.Geolocation", () => {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认：true
          timeout: 5000, // 设置定位超时时间，默认：无穷大
          buttonOffset: new AMap.Pixel(10, 20) // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
        });
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", data => {
          this.locationObj.locationDetail = data.formattedAddress;
          this.locationObj.latitudeAndLongitude = `${data.position.lat},${
            data.position.lng
            }`;
          this.locationObj.flage = true;
        });
        AMap.event.addListener(geolocation, "error", err => {
          // this.Toast("定位失败");
          // console.log(err);
          this.locationObj.locationDetail = "定位失败，请重新获取定位";
          this.locationObj.latitudeAndLongitude = "123,123";
          if (err.message === "Geolocation permission denied.") {
            this.Toast("请开启定位权限");
            this.locationObj.locationDetail = "请开启定位权限";
          }
          this.locationObj.flage = false;
        });
      });
    },
    submit () {
      let flage = true;
      let flag = false;
      let Acindex = null;
      this.list.forEach((item,index) => {
        if (item.questionType == 4 && item.flag == true) {
          item.value = this.locationObj.locationDetail;
          flag = true;
        }
        if (item.questionType != 4 && item.isOptional) {
          if (
            item.value == "" ||
            item.value == null ||
            item.value.length == 0
          ) {
            this.Toast("请填写完整的答案");
            flage = false;
            return
          }
        }
        if (item.id == "idNumber") {
            Acindex = index
        }
      });
      if(flage){
        if(Acindex !== null){
            this.list[Acindex].value  = this.utils.encryptByEnAES(this.list[Acindex].value);
        }
      }else{
          return;
      }
      if (
        (this.locationObj.locationDetail == "正在获取当前位置" && flag) ||
        (this.locationObj.locationDetail == "位置信息获取失败" && flag) ||
        (this.locationObj.locationDetail == "" && flag)
      ) {
        this.Dialog.confirm({
          title: "温馨提示",
          message:
            "未获取到位置信息，可能是以下原因\n(1) 请用本机使用高德地图查看位置是否显示正常\n(2) 请检查APP是否获取‘位置’权限。\n(3) 网络状态不佳。\n提交问卷后可通过修改问卷补充地址信息\n是否继续提交？",
          messageAlign: "left"
        }).then(() => {
          if (flage) {
            this.utils.ajax({
              url: this.api.saveSurveyHuman,
              data: {
                id: this.id,
                surveyId: this.$route.params.id,
                answer: JSON.stringify(this.list),
                teacherId: this.teachShow.data.teacherId
              },
              method: "POST",
              success: data => {
                this.Toast("提交成功");
                setTimeout(() => {
                  this.utils.goBack(this);
                }, 300);
              }
            });
          }
        });
      } else {
        if (flage) {
          this.utils.ajax({
            url: this.api.saveSurveyHuman,
            data: {
              id: this.id,
              surveyId: this.$route.params.id,
              answer: JSON.stringify(this.list),
              teacherId: this.teachShow.data.teacherId
            },
            method: "POST",
            success: data => {
              this.Toast("提交成功");
              setTimeout(() => {
                this.utils.goBack(this);
              }, 300);
            }
          });
        }
      }
    },
    seachClick (item) {
      if (item.checked) {
        item.checked = false;
        return;
      }
      this.searchList.forEach(i => {
        if (i.caid == item.caid) {
          i.checked = true;
        } else {
          i.checked = false;
        }
      });
    },
    getHumanInfoById () {
      this.utils.ajax({
        url: this.api.getHumanInfoById,
        method: "POST",
        success: data => {
          this.list.forEach(item => {
            if (item.id == "name") {
              item.value = data.studentName;
            }
            if (item.id == "gender") {
              if (data.genderCode == "1_Gender") {
                item.value = "1";
              }
            }
            if (item.id == "idType") {
              if (data.identificationTypeCode != "") {
                item.value = data.identificationTypeCode;
              }
            }
            // if (item.id == "idNumber") {
            //   if (data.identificationNumber != "") {
            //     item.value = this.utils.encryptByDeAES(
            //       data.identificationNumber
            //     );
            //   }
            // }
          });
        }
      });
    },
    promptClick (i, ind, index) {
      i.promptDefault = !i.promptDefault;
    },
    buiurclick () {
      const u = navigator.userAgent;
      if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
        // 安卓手机
      } else {
        // ios
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollTop + 1);
          document.body.scrollTop >= 1 &&
            window.scrollTo(0, document.body.scrollTop - 1);
        }, 50);
      }
    }
  },
  created () {
    if (this.$route.params.i.type == '1') {
      this.disabled = this.$route.params.item.editStatus;
    } else {
      let date = new Date(
        this.$store.state.timestamp.replace(/-/g, "/")
      ).getTime();
      let dateTime = this.utils.formatDate(date, "yyyy-MM-dd").replace(/-/g, "/");
      let end = this.utils
        .formatDate(this.$route.params.i.endTime, "yyyy-MM-dd")
        .replace(/-/g, "/");
      let star = this.utils
        .formatDate(this.$route.params.i.startTime, "yyyy-MM-dd")
        .replace(/-/g, "/");
      let endTime = this.utils.getTime(end);
      let date1 = this.utils.getTime(dateTime);
      let startTime = this.utils.getTime(star);
      if (
        ((this.$route.params.inm == "1" && endTime > date1) ||
          (this.$route.params.inm == "1" && endTime == date1)) &&
        ((this.$route.params.inm == "1" && startTime < date1) ||
          (this.$route.params.inm == "1" && startTime == date1))
      ) {
        // if (this.$route.params.inm == "1") {
        this.disabled = true;
      } else {
        this.disabled = false;
      }

    }
    this.save();
  }
};
</script>
<style scoped>
p,
.img {
  padding: 0;
  margin: 0;
}
.img {
  width: 100%;
}
.write {
  background: white;
  padding: 0 0.5rem 0.6rem 1rem;
}

.write p:nth-of-type(1) {
  font-weight: 600;
  font-size: 1.1rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid #eaeaea;
}

.dadioimg {
  width: 1.125rem;
  height: 1.125rem;
}

.write p:nth-of-type(2) {
  padding: 0.3rem 0;
}

.write p:nth-of-type(3),
.write p:nth-of-type(4) {
  color: #818181;
}

.write p:nth-of-type(4) {
  margin-top: 0.3rem;
}

.img_filin {
  margin: 0;
  padding: 0;
}

.survey {
  font-size: 0.9rem;
}

.survey_address {
  background: white;
  padding: 0.3rem 0.9rem 0.8rem 0.9rem;
}

.survey_positoning {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.survey_positoning p:nth-of-type(2) {
  color: #1a7fe9;
}

.single {
  background: white;
  width: 96.5%;
  padding-left: 0.8rem;
  padding-bottom: 0.3rem;
  padding-top: 0.3rem;
  margin-top: 0.5rem;
  overflow: hidden;
}

.single_p {
  display: flex;
  width: 100%;
  padding-right: 0.5rem;
}

.single_p span:nth-of-type(1) {
  width: 89%;
}

.single_p span:nth-of-type(2) {
  font-size: 0.6rem !important;
  width: 2rem;
  height: 1.2rem;
  text-align: center;
  line-height: 1.3rem;
  color: #8cc1e4;
  border: 1px solid #8cc1e4;
  border-radius: 10px;
  margin-left: 0.3rem;
}

.survey_location {
  margin-top: 0.3rem;
  color: #818181;
}

.survey_location >>> .van-radio__label,
.survey_location >>> .van-checkbox__label {
  width: 85% !important;
}

.survey_location1 >>> .van-field__control {
  border: 1px solid #ccc;
  padding: 0.5rem;
}

.survey_location1 >>> .van-cell {
  padding: 0;
  padding-right: 0.5rem;
  padding-top: 0.2rem;
  padding-bottom: 0.5rem;
}

.van-radio,
.van-checkbox {
  padding-bottom: 0.3rem !important;
}

.submit {
  width: 100%;
  height: 2.5rem;
  font-size: 1.2rem;
  line-height: 2.5rem;
  color: white;
  text-align: center;
  position: fixed;
  bottom: 0;
  background: #0079fe;
}
.dataStyle {
  display: flex;
  height: 1rem;
  border: 1px solid #ccc;
  color: #333;
  width: 43%;
  padding: 0.3rem;
  margin-top: 0.5rem;
}
.dataStyle img {
  width: 1.2rem;
  height: 1rem;
}
.dataStyle p {
  margin-left: 0.2rem;
  margin-top: 0.1rem;
}
.file_box {
  padding: 0.5rem 0rem;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
.file_box > div {
  display: inline-block;
}
.fileList {
  width: 3rem;
  /* height: 3rem; */
  position: relative;
  margin-right: 0.573rem;
  margin-bottom: 0.5rem;
}
.fileList img {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.5rem;
}
.boxfile {
  font-size: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #7a7a7a;
}
.uploadFile {
  position: relative;
  font-size: 2.5rem;
  border-radius: 0.5rem;
  border: 0.04rem solid #e1e1e1;
  width: 3rem;
  height: 3rem;
  text-align: center;
  line-height: 3.5rem;
}
.promptStyle {
  position: relative;
}
.position {
  margin-top: 1rem;
}
.pSize {
  font-size: 0.6rem;
  padding-bottom: 0.3rem;
}
.delog {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 99999999;
  background: #ccc;
}
.textareadelog {
  width: 95%;
  margin: 0 auto;
  padding: 0.8rem 0;
}
.textareadelog textarea {
  width: 97%;
  border-radius: 8px;
  border: 0;
  padding: 0.3rem;
}
/* textarea{
    height: 50rem;
  } */
.searchTable {
  margin-top: 0.3rem;
  background: white;
  width: 100%;
  height: 84%;
}
.search_top {
  padding: 0.5rem 0;
  margin: 0 auto;
}
.search_head {
  width: 100%;
  padding: 0.4rem 0;
  border-bottom: 1px solid #ccc;
  text-align: center;
  display: flex;
}
.search_headgren {
  width: 100%;
  padding: 0.4rem 0;
  border-bottom: 1px solid #ccc;
  text-align: center;
  display: flex;
  background: #65b8bc;
  color: white;
}
.search_headli {
  width: 24%;
}
.search_headli2 {
  width: 49%;
}
.search_headli1 {
  width: 26%;
}
.search_content {
  width: 100%;
  height: 30.5rem;
  overflow-y: auto;
  overflow-y: auto;
}
.imgCli {
  position: relative;
}
.imgpositi {
  position: absolute;
  top: -6px;
  right: -12px;
  border-radius: 0.625rem;
  width: 0.8rem;
  height: 0.8rem;
  border: 0.0625rem solid #f30f63;
  color: #f30f63;
  font-size: 0.8px;
  text-align: center;
  line-height: 13.8px;
  background: white;
}
.optistyle {
  position: relative;
}
.optistyleabslut {
  position: absolute;
  top: 0;
  right: 1rem;
}
.image {
  height: 25rem;
}
.textHtml {
  border: 1px solid #ccc;
  width: 93%;
  padding: 0.7rem 0.6rem;
  height: 3rem;
  overflow-y: auto;
}
.colortext {
  color: #a5a6a7;
  border: 1px solid #ccc;
  width: 93%;
  padding: 0.7rem 0.6rem;
  height: 3rem;
  overflow-y: auto;
}
</style>