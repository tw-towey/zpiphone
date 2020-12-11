<template>
  <div class="warp manualAuditDetail">
    <van-nav-bar title="手册详情" class="header" fixed left-arrow @click-left="onClickLeft">
      <!-- <span v-if="tab == 0" class="cancleBtn" slot="right" @click="cancle()">撤销审核</span> -->
    </van-nav-bar>
    <div class="">
      <div class="manualAuditTable">
        <h3 class="title">基本信息</h3>
        <ul class="list">
          <li v-for="item in moduleManual" :class="{'file':item.name=='filesVOs'}">
            <div v-if="item.name=='filesVOs'">
              <div class="fileUp">文件上传</div>
              <div class="fileBox">
                <div v-for="(item,index) in metailDetail['filesVOs']"
                  class="fileItem"
                  @click="showAttachment(item,index)"
                >
                  <div
                    class="imgIcon"
                    v-if="item.type=='jpg'||item.type=='jpeg'||item.type=='gif'||item.type=='png' "
                  >
                    <img :src="item.path" :alt="item.name">
                  </div>
                  <div class="imgIcon" v-else>
                    <i>
                      <van-icon name="records"/>
                    </i>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div v-if="item.type == 'textarea'" class="contentitem">
                <div v-html="item['field']" class="first_field"></div>
                <textarea class="textarea" rows="3" disabled>{{metailDetail[item['name']]}}</textarea>
              </div>
              <div v-else class="item">
                <div class="left">
                  <span v-html="item['field']"></span>
                  <strong class="red" v-if="item['required']">*</strong>
                </div>
                <div class="right">
                  <div v-html="metailDetail[item['name']]"></div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <PassAndNoPass
        @auditHandle="manualAudit"
        :list="manualAuditList"
        :error="error"
        v-if="tab == 0"
      ></PassAndNoPass>
    </div>
    <!-- cancel-button-text="下载"
          show-cancel-button
    @cancel="donloadFile()"-->
    <van-dialog v-model="shwoFile.flag" confirm-button-text="关闭">
      <div class="maxheightbox">
        <img v-if="isImg(shwoFile.url)" :src="shwoFile.url" width="100%">
        <div class="fileImg" v-if="!isImg(shwoFile.url)">
          <van-icon name="description"/>
        </div>
        <div class="title-file" v-if="!isImg(shwoFile.url)">该文件类型暂不支持查看</div>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import PassAndNoPass from "@/components/PassAndNoPass";
export default {
  name: "ManualAuditDetail",
  components: {
    PassAndNoPass: PassAndNoPass
  },
  data() {
    return {
      tab: 0,
      error: "请选择待审核的登记手册",
      imgIndexMap: new Map(),
      imgList: [],
      shwoFile: {
        flag: false
      },
      moduleManual: [],
      metailDetail: {},
      manualAuditList: []
    };
  },
  created() {
    var params = this.$route.params;
    this.tab = params.tab;
    console.log(params)
    var oneLevelType = params.oneLevelType;
    var twoLevelType = params.twoLevelType;

    this.moduleManualDetail(twoLevelType);

    this.metailDetail = params.item;
    this.metailDetail.oneLevelTypeText = this.utils.getValueByKey(
      this.$store.state.oneLevelType,
      oneLevelType
    );
    this.metailDetail.twoLevelTypeText = this.utils.getValueByKey(
      this.$store.state.twoLevelType,
      twoLevelType
    );
    //管床
    this.metailDetail.isTubeBedText = this.utils.getValueByKey(
      this.$store.state.trueOrFalse,
      params.item.isTubeBed
    );
    //书写大病历
    this.metailDetail.isWriteBigCaseText = this.utils.getValueByKey(
      this.$store.state.trueOrFalse,
      params.item.isWriteBigCase
    );
    // 就诊类型
    this.metailDetail.visitTypeText = this.utils.getValueByKey(
      this.$store.state.visitType,
      params.item.visitType
    );
    // 指导方式 guideWay
    this.metailDetail.guideWay = this.utils.getValueByKey(
      [
        {value: '座谈', key: 1},
        {value: '工作汇报', key: 2},
        {value: '读书报告', key: 3},
        {value: '科研论文指导', key: 4},
        {value: '病案讨论', key: 5},
        {value: '临床技能指导', key: 6},
        {value: '人文指导', key: 7},
        {value: '其他', key: 8},
      ],
      this.metailDetail.guideWay
    );
    // 科研角色 joinRole 参与角色 joinRole
    let arr_joinRole = [
      {value: '术者', key: 1},
      {value: '一助', key: 2},
      {value: '二助', key: 3},
      {value: '三助', key: 4},
      {value: '观看', key: 5}
    ];
    if (twoLevelType == 19) {
      arr_joinRole = [
        {value: '第一研究员', key: 6},
        {value: '第二研究员', key: 7},
        {value: '第三研究员', key: 8},
        {value: '第四研究员', key: 9},
        {value: '第五研究员', key: 10},
        {value: '第六研究员', key: 11}
      ];
    }
    this.metailDetail.joinRole = this.utils.getValueByKey(
      arr_joinRole,
      this.metailDetail.joinRole
    );
    // 论文类型 thesisType
    this.metailDetail.thesisType = this.utils.getValueByKey(
      [
        {value: '专题', key: 1},
        {value: '辩论', key: 2},
        {value: '综述', key: 3},
        {value: '综合', key: 4}
      ],
      this.metailDetail.thesisType
    );
    // 类型 type
    this.metailDetail.type = this.utils.getValueByKey(
      [
        {value: '专业期刊发表的文章', key: 1},
        {value: '学术会议交流文章', key: 2},
        {value: '院（所）学术会议交流文章', key: 3},
        {value: '提交文章', key: 4}
      ],
      this.metailDetail.type
    );
    //时间
    this.metailDetail.date = this.metailDetail.date
      ? this.utils
          .formatDate(this.metailDetail.date, "yyyy-MM-dd")
          .replace(/-/g, "/")
      : "";
    //console.log('matailDetail-->--', this.metailDetail.filesVOs);
    var filesVOs = this.metailDetail.filesVOs;
    let arr = [
      "content",
      "lapseToCondition",
      "patientInfo",
      "finalDiagnosis",
      "fourWaysDiagnosis",
      "assistInspect",
      "prescription",
      "doctorAdvice",
      "doctorAdvice"
    ];
    this.moduleManual.forEach(i => {
      arr.forEach(name => {
        if (i.name == name) {
          i.type = "textarea";
        }
      });
    });
    if (filesVOs.length) {
      filesVOs.forEach((ele, index) => {
        var path = ele.path;
        var name = ele.name;
        var fileType = name.substr(name.lastIndexOf(".") + 1);
        ele.type = fileType;

        if (this.utils.checkSuffix(ele.name)) {
          this.imgList.push(ele.path);
          this.imgIndexMap.set(index, this.imgList.length - 1);
        }
      });
    }
    this.manualAuditList.push(this.metailDetail);
  },
  methods: {
    onClickLeft() {
      //this.tab = params.tab;
      this.$store.state.tabActive = this.tab;
      this.utils.goBack(this);
    },
    showAttachment(attachment, index) {
      this.shwoFile.url = attachment.path;
      this.shwoFile.name = attachment.name;
      this.shwoFile.flag = true;
      // if (this.utils.checkSuffix(attachment.name)) {//图片进行预览
      //   this.utils.imagePreview(this.imgList, this.imgIndexMap.get(index));
      // } else {
      //   console.log("调用app下载");
      // }
    },
    donloadFile() {
      console.log(this.shwoFile.url);
      this.utils.downLoad(this.shwoFile);
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
    manualAudit(auditObj) {
      console.log("auditObj--->--", auditObj);
      var type = auditObj.type;
      if (type == "pass") {
        this.btnType = 1;
      } else if (type == "unPass") {
        this.btnType = 0;
      }
      this.auditNote = auditObj.data || "";
      this.auditAjax();
    },
    getParams() {
      // var checkedList = this.checkedList();
      var params = {};
      var ids = [];
      var url = "";
      // checkedList.forEach(( ele, index )=>{
      //   console.log('--ele-->',ele);
      //   console.log('--index--',index);
      //   ids.push( ele.id );
      // });
      var id = this.$route.params.item.id;
      console.log("--id--->--", id);
      ids.push(id);
      params.ids = ids;

      if (this.btnType == 1) {
        // 审核通过 按钮
        params.auditNote = "";
      } else if (this.btnType == 0) {
        // 审核不通过
        params.auditNote = this.auditNote;
      }
      //console.log('params-->--', params);
      return params;
    },
    auditAjax() {
      var url = "";
      var _this = this;
      if (this.btnType == 0) {
        url = this.api.manualReject;
      } else if (this.btnType == 1) {
        url = this.api.manualApproval;
      }
      var params = this.getParams(this.btnType);
      this.utils.ajax(
        {
          url: url,
          data: params,
          method: "POST",
          success: data => {
            setTimeout(() => {
              if (_this.btnType == 0) {
                _this.Toast("审核不通过成功");
              } else if (_this.btnType == 1) {
                _this.Toast("审核通过成功");
              }
            }, 200);

            this.utils.goBack(this);
          },
          error: error => {
            console.log("error-->--", error);
            this.Toast(error.error);
          }
        },
        true
      );
    },
    moduleManualDetail(value) {
      var moduleManual = [];
      switch (+value) {
        case 1: // 病例(大病历)
          moduleManual = [
            {
              field: "轮转科室",
              name: "departmentName",
              required: true
            },
            {
              field: "分类",
              name: "oneLevelTypeText",
              required: false
            },
            {
              field: "手册类型",
              name: "twoLevelTypeText",
              required: false
            },
            {
              field: "病人姓名",
              name: "patientName",
              required: false
            },
            {
              field: "住院号",
              name: "admissionNumber",
              required: false
            },
            {
              field: "主要诊断",
              name: "mainDiagnosis",
              required: true
            },
            {
              field: "时间",
              name: "date",
              required: false
            },
            {
              field: "床号",
              name: "bedNo",
              required: false
            },
            {
              field: "管床",
              name: "isTubeBedText",
              required: true
            },
            {
              field: "病历内容",
              name: "content",
              required: false
            },
            {
              field: "附件上传",
              name: "filesVOs",
              required: false
            }
          ];
          break;
        case 2: //病种
          moduleManual = [
            {
              field: "轮转科室",
              name: "departmentName",
              required: true
            },
            {
              field: "分类",
              name: "oneLevelTypeText",
              required: false
            },
            {
              field: "手册类型",
              name: "twoLevelTypeText",
              required: false
            },
            {
              field: "病人姓名",
              name: "patientName",
              required: false
            },
            {
              field: "住院号",
              name: "admissionNumber",
              required: false
            },
            {
              field: "主要诊断",
              name: "mainDiagnosis",
              required: true
            },
            {
              field: "次要诊断",
              name: "secondaryDiagnosis",
              required: false
            },
            {
              field: "时间",
              name: "date",
              required: false
            },
            {
              field: "床号",
              name: "bedNo",
              required: false
            },
            {
              field: "书写大病历",
              name: "isWriteBigCaseText",
              required: true
            },
            {
              field: "管床",
              name: "isTubeBedText",
              required: true
            },
            {
              field: "就诊类型",
              name: "visitTypeText",
              required: false
            },
            {
              field: "技能操作",
              name: "skill",
              required: false
            },
            {
              field: "参与角色",
              name: "joinRole",
              required: false
            },
            {
              field: "内容",
              name: "content",
              required: false
            },
            {
              field: "附件",
              name: "filesVOs",
              required: false
            }
          ];
          break;
        case 3: //门诊诊治
        case 4: //急诊诊治
          moduleManual = [
            {
              field: "轮转科室",
              name: "departmentName",
              required: true
            },
            {
              field: "分类",
              name: "oneLevelTypeText",
              required: false
            },
            {
              field: "手册类型",
              name: "twoLevelTypeText",
              required: false
            },
            {
              field: "病人姓名",
              name: "patientName",
              required: false
            },
            {
              field: "就诊号",
              name: "visitNumber",
              required: false
            },
            {
              field: "时间",
              name: "date",
              required: false
            },
            {
              field: "主要诊断",
              name: "mainDiagnosis",
              required: true
            },
            {
              field: "诊治内容",
              name: "content",
              required: false
            },
            {
              field: "附件",
              name: "filesVOs",
              required: false
            }
          ];
          break;
        case 5: // 操作记录
          moduleManual = [
            {
              field: "轮转科室",
              name: "departmentName",
              required: true
            },
            {
              field: "分类",
              name: "oneLevelTypeText",
              required: false
            },
            {
              field: "手册类型",
              name: "twoLevelTypeText",
              required: false
            },
            {
              field: "病人姓名",
              name: "patientName",
              required: false
            },
            {
              field: "住院号",
              name: "admissionNumber",
              required: false
            },
            {
              field: "时间",
              name: "date",
              required: false
            },
            {
              field: "操作名称",
              name: "skill",
              required: true
            },
            {
              field: "操作内容",
              name: "content",
              required: false
            },
            {
              field: "附件上传",
              name: "filesVOs",
              required: false
            }
          ];
          break;
        case 6: //手术记录
          moduleManual = [
            {
              field: "轮转科室",
              name: "departmentName",
              required: true
            },
            {
              field: "分类",
              name: "oneLevelTypeText",
              required: false
            },
            {
              field: "手册类型",
              name: "twoLevelTypeText",
              required: false
            },
            {
              field: "病人姓名",
              name: "patientName",
              required: false
            },
            {
              field: "住院号",
              name: "admissionNumber",
              required: false
            },
            {
              field: "时间",
              name: "date",
              required: false
            },
            {
              field: "手术名称",
              name: "skill",
              required: true
            },
            {
              field: "参与角色",
              name: "joinRole",
              required: false
            },
            {
              field: "手术内容",
              name: "content",
              required: false
            },
            {
              field: "附件上传",
              name: "filesVOs",
              required: false
            }
          ];
          break;
        case 7: //门诊操作
          moduleManual = [
            {
              field: "轮转科室",
              name: "departmentName",
              required: true
            },
            {
              field: "分类",
              name: "oneLevelTypeText",
              required: false
            },
            {
              field: "手册类型",
              name: "twoLevelTypeText",
              required: false
            },
            {
              field: "病人姓名",
              name: "patientName",
              required: false
            },
            {
              field: "就诊号",
              name: "visitNumber",
              required: false
            },
            {
              field: "时间",
              name: "date",
              required: false
            },
            {
              field: "主要诊断",
              name: "mainDiagnosis",
              required: false
            },
            {
              field: "操作名称",
              name: "skill",
              required: true
            },
            {
              field: "操作内容",
              name: "content",
              required: false
            },
            {
              field: "附件",
              name: "filesVOs",
              required: false
            }
          ];
          break;
        case 8: //门诊手术
          moduleManual = [
            {
              field: "轮转科室",
              name: "departmentName",
              required: true
            },
            {
              field: "分类",
              name: "oneLevelTypeText",
              required: false
            },
            {
              field: "手册类型",
              name: "twoLevelTypeText",
              required: false
            },
            {
              field: "病人姓名",
              name: "patientName",
              required: false
            },
            {
              field: "就诊号",
              name: "visitNumber",
              required: false
            },
            {
              field: "时间",
              name: "date",
              required: false
            },
            {
              field: "主要诊断",
              name: "mainDiagnosis",
              required: false
            },
            {
              field: "手术名称",
              name: "skill",
              required: true
            },
            {
              field: "参与角色",
              name: "joinRole",
              required: false
            },
            {
              field: "手术内容",
              name: "content",
              required: false
            },
            {
              field: "附件",
              name: "filesVOs",
              required: false
            }
          ];
          break;
        case 9: //医技报告
          moduleManual = [
            {
              field: "轮转科室",
              name: "departmentName",
              required: true
            },
            {
              field: "分类",
              name: "oneLevelTypeText",
              required: false
            },
            {
              field: "手册类型",
              name: "twoLevelTypeText",
              required: false
            },
            {
              field: "病人姓名",
              name: "patientName",
              required: false
            },
            {
              field: "就诊号",
              name: "visitNumber",
              required: false
            },
            {
              field: "时间",
              name: "date",
              required: false
            },
            {
              field: "主要诊断",
              name: "mainDiagnosis",
              required: false
            },
            {
              field: "操作名称",
              name: "skill",
              required: true
            },
            {
              field: "检查内容",
              name: "content",
              required: false
            },
            {
              field: "附件",
              name: "filesVOs",
              required: false
            }
          ];
          break;
        case 10: //抢救记录
          moduleManual = [
            {
              field: "轮转科室",
              name: "departmentName",
              required: true
            },
            {
              field: "分类",
              name: "oneLevelTypeText",
              required: false
            },
            {
              field: "手册类型",
              name: "twoLevelTypeText",
              required: false
            },
            {
              field: "病人姓名",
              name: "patientName",
              required: false
            },
            {
              field: "就诊号",
              name: "visitNumber",
              required: false
            },
            {
              field: "时间",
              name: "date",
              required: false
            },
            {
              field: "主要诊断",
              name: "mainDiagnosis",
              required: false
            },
            {
              field: "操作名称",
              name: "skill",
              required: true
            },
            {
              field: "抢救内容",
              name: "content",
              required: false
            },
            {
              field: "转归情况",
              name: "lapseToCondition",
              required: false
            },
            {
              field: "附件",
              name: "filesVOs",
              required: false
            }
          ];
          break;
        case 11: //教学查房
          moduleManual = [
            {
              field: "轮转科室",
              name: "departmentName",
              required: true
            },
            {
              field: "分类",
              name: "oneLevelTypeText",
              required: false
            },
            {
              field: "手册类型",
              name: "twoLevelTypeText",
              required: false
            },
            {
              field: "查房名称",
              name: "heading",
              required: false
            },
            {
              field: "时长",
              name: "burningTime",
              required: false
            },
            {
              field: "主讲人",
              name: "speaker",
              required: false
            },
            {
              field: "附件",
              name: "filesVOs",
              required: false
            }
          ];
          break;
        case 13: //课外学习
          moduleManual = [
            {
              field: "轮转科室",
              name: "departmentName",
              required: true
            },
            {
              field: "分类",
              name: "oneLevelTypeText",
              required: false
            },
            {
              field: "手册类型",
              name: "twoLevelTypeText",
              required: false
            },
            {
              field: "时间",
              name: "date",
              required: false
            },
            {
              field: "地点",
              name: "location",
              required: false
            },
            {
              field: "学习内容",
              name: "content",
              required: false
            },
            {
              field: "附件",
              name: "filesVOs",
              required: false
            }
          ];
          break;
        case 14: //获奖情况
          moduleManual = [
            {
              field: "轮转科室",
              name: "departmentName",
              required: true
            },
            {
              field: "分类",
              name: "oneLevelTypeText",
              required: false
            },
            {
              field: "手册类型",
              name: "twoLevelTypeText",
              required: false
            },
            {
              field: "时间",
              name: "date",
              required: false
            },
            {
              field: "奖励内容",
              name: "content",
              required: false
            },
            {
              field: "奖励部门",
              name: "awardDepartment",
              required: false
            },
            {
              field: "附件",
              name: "filesVOs",
              required: false
            }
          ];
          break;
        case 15: //讲座
          moduleManual = [
            {
              field: "轮转科室",
              name: "departmentName",
              required: true
            },
            {
              field: "分类",
              name: "oneLevelTypeText",
              required: false
            },
            {
              field: "手册类型",
              name: "twoLevelTypeText",
              required: false
            },
            {
              field: "讲座名称",
              name: "heading",
              required: false
            },
            {
              field: "时间",
              name: "date",
              required: false
            },
            {
              field: "地点",
              name: "location",
              required: false
            },
            {
              field: "讲座内容",
              name: "content",
              required: false
            },
            {
              field: "时长",
              name: "burningTime",
              required: false
            },
            {
              field: "主讲人",
              name: "speaker",
              required: false
            },
            {
              field: "附件",
              name: "filesVOs",
              required: false
            }
          ];
          break;
        case 16: //疑难病例讨论记录
          moduleManual = [
            {
              field: "轮转科室",
              name: "departmentName",
              required: true
            },
            {
              field: "分类",
              name: "oneLevelTypeText",
              required: false
            },
            {
              field: "手册类型",
              name: "twoLevelTypeText",
              required: false
            },
            {
              field: "讨论主题",
              name: "heading",
              required: false
            },
            {
              field: "时间",
              name: "date",
              required: false
            },
            {
              field: "地点",
              name: "location",
              required: false
            },
            {
              field: "病人信息",
              name: "patientInfo",
              required: false
            },
            {
              field: "讨论内容",
              name: "content",
              required: false
            },
            {
              field: "时长",
              name: "burningTime",
              required: false
            },
            {
              field: "主持人",
              name: "speaker",
              required: false
            },
            {
              field: "附件",
              name: "filesVOs",
              required: false
            }
          ];
          break;
        case 17: //死亡病例讨论记录
          moduleManual = [
            {
              field: "轮转科室",
              name: "departmentName",
              required: true
            },
            {
              field: "分类",
              name: "oneLevelTypeText",
              required: false
            },
            {
              field: "手册类型",
              name: "twoLevelTypeText",
              required: false
            },
            {
              field: "讨论主题",
              name: "heading",
              required: false
            },
            {
              field: "时间",
              name: "date",
              required: false
            },
            {
              field: "地点",
              name: "location",
              required: false
            },
            {
              field: "病人信息",
              name: "patientInfo",
              required: false
            },
            {
              field: "入院时间",
              name: "admissionDate",
              required: false
            },
            {
              field: "死亡时间",
              name: "demiseDate",
              required: false
            },
            {
              field: "最后诊断",
              name: "finalDiagnosis",
              required: false
            },
            {
              field: "讨论内容",
              name: "content",
              required: false
            },
            {
              field: "时长",
              name: "burningTime",
              required: false
            },
            {
              field: "主持人",
              name: "speaker",
              required: false
            },
            {
              field: "附件",
              name: "filesVOs",
              required: false
            }
          ];
          break;
        case 18: //会诊记录
          moduleManual = [
            {
              field: "轮转科室",
              name: "departmentName",
              required: true
            },
            {
              field: "分类",
              name: "oneLevelTypeText",
              required: false
            },
            {
              field: "手册类型",
              name: "twoLevelTypeText",
              required: false
            },
            {
              field: "会诊名称",
              name: "heading",
              required: false
            },
            {
              field: "时间",
              name: "date",
              required: false
            },
            {
              field: "地点",
              name: "location",
              required: false
            },
            {
              field: "病人信息",
              name: "patientInfo",
              required: false
            },
            {
              field: "主要诊断",
              name: "mainDiagnosis",
              required: true
            },
            {
              field: "会诊内容",
              name: "content",
              required: false
            },
            {
              field: "附件",
              name: "filesVOs",
              required: false
            }
          ];
          break;
        case 19: //科研
          moduleManual = [
            {
              field: "轮转科室",
              name: "departmentName",
              required: true
            },
            {
              field: "分类",
              name: "oneLevelTypeText",
              required: false
            },
            {
              field: "手册类型",
              name: "twoLevelTypeText",
              required: false
            },
            {
              field: "科研名称",
              name: "heading",
              required: false
            },
            {
              field: "科研内容",
              name: "content",
              required: false
            },
            {
              field: "带头人",
              name: "principal",
              required: false
            },
            {
              field: "科研角色",
              name: "joinRole",
              required: false
            },
            {
              field: "附件",
              name: "filesVOs",
              required: false
            }
          ];
          break;
        case 20: //论文
          moduleManual = [
            {
              field: "轮转科室",
              name: "departmentName",
              required: true
            },
            {
              field: "分类",
              name: "oneLevelTypeText",
              required: false
            },
            {
              field: "手册类型",
              name: "twoLevelTypeText",
              required: false
            },
            {
              field: "论文名称",
              name: "heading",
              required: false
            },
            {
              field: "发表时间",
              name: "date",
              required: false
            },
            {
              field: "发表刊物",
              name: "publications",
              required: false
            },
            {
              field: "类型",
              name: "type"
            },
            {
              field: "论文类型",
              name: "thesisType",
              required: false
            },
            {
              field: "附件",
              name: "filesVOs",
              required: false
            }
          ];
          break;
        case 21: //指导记录
          moduleManual = [
            {
              field: "轮转科室",
              name: "departmentName",
              required: true
            },
            {
              field: "分类",
              name: "oneLevelTypeText",
              required: false
            },
            {
              field: "手册类型",
              name: "twoLevelTypeText",
              required: false
            },
            {
              field: "时间",
              name: "date",
              required: false
            },
            {
              field: "指导方式",
              name: "guideWay",
              required: false
            },
            {
              field: "指导内容",
              name: "content",
              required: false
            },
            {
              field: "附件",
              name: "filesVOs",
              required: false
            }
          ];
          break;
        case 22: //门诊病案
          moduleManual = [
            {
              field: "轮转科室",
              name: "departmentName",
              required: true
            },
            {
              field: "分类",
              name: "oneLevelTypeText",
              required: false
            },
            {
              field: "手册类型",
              name: "twoLevelTypeText",
              required: false
            },
            {
              field: "病人姓名",
              name: "patientName",
              required: false
            },
            {
              field: "就诊号",
              name: "visitNumber",
              required: false
            },
            {
              field: "时间",
              name: "date",
              required: false
            },
            {
              field: "主要诊断",
              name: "mainDiagnosis",
              required: true
            },
            {
              field: "望闻问切",
              name: "fourWaysDiagnosis",
              required: false
            },
            {
              field: "辅助检查",
              name: "assistInspect",
              required: false
            },
            {
              field: "诊治内容",
              name: "content",
              required: false
            },
            {
              field: "处方",
              name: "prescription",
              required: false
            },
            {
              field: "医嘱",
              name: "doctorAdvice",
              required: false
            },
            {
              field: "附件",
              name: "filesVOs",
              required: false
            }
          ];
          break;
        case 23: //住院志
          moduleManual = [
            {
              field: "轮转科室",
              name: "departmentName",
              required: true
            },
            {
              field: "分类",
              name: "oneLevelTypeText",
              required: false
            },
            {
              field: "手册类型",
              name: "twoLevelTypeText",
              required: false
            },
            {
              field: "病人姓名",
              name: "patientName",
              required: false
            },
            {
              field: "住院号",
              name: "admissionNumber",
              required: false
            },
            {
              field: "主要诊断",
              name: "mainDiagnosis",
              required: true
            },
            {
              field: "时间",
              name: "date",
              required: false
            },
            {
              field: "床号",
              name: "bedNo",
              required: false
            },
            {
              field: "住院志内容",
              name: "content",
              required: false
            },
            {
              field: "附件",
              name: "filesVOs",
              required: false
            }
          ];
          break;
      }
      this.moduleManual = moduleManual;
    }
  }
};
</script>


<style scoped>
.manualAuditTable {
  margin-bottom: 2.2rem;
}
.cancleBtn {
  color: #fff;
  font-size: 1rem;
}
.van-cell {
  background: #fff;
}
.manualAuditTable .title {
  height: 2.4rem;
  line-height: 2.4rem;
  padding-left: 1rem;
  font-weight: normal;
  margin: 0;
  font-size: 0.875rem;
}

.fileUp {
  line-height: 2.2rem;
  border-bottom: 0.0625rem solid #dddddd;
  padding-left: 1.1rem;
}

.list li .item {
  height: 2.25rem;
  line-height: 2.25rem;
  /* border-bottom: 1px solid #e6e4e4; */
  background: #fff;
  padding: 0 1rem;
  display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
  display: -moz-box; /* Firefox 17- */
  display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
  display: -moz-flex; /* Firefox 18+ */
  display: -ms-flexbox; /* IE 10 */
  display: flex;
  border-bottom: 1px solid #dddddd;
}
.contentitem {
  background: #fff;
  padding: 0 1rem;
  border-bottom: 1px solid #dddddd;
}
.first_field {
  padding: 0.5rem 0;
}
.two_content {
  margin-bottom: 0.5rem;
  border: 1px solid #ebebeb;
  height: 3rem;
  background: #f6f6f6;
  border-radius: 0.25rem;
}
.list li.cont {
  height: auto;
}
.list li.file {
  height: auto;
  line-height: inherit;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  background: #fff;
}
.imgIcon {
  text-align: center;
}

.imgIcon i {
  font-size: 3rem;
  color: #7a7a7a;
}
.list .left {
  float: left;
  flex: 1;
}
.left {
  min-width: 4rem;
}
.list .right {
  float: right;
  color: #8f8888;
  flex: 3;
  text-align: right;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.list .right .text {
  text-align: left;
}

.button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  color: white;
  font-size: 0.875rem;
}
.button p {
  width: 50%;
  text-align: center;
  padding: 0.5rem 0;
  margin: 0;
}
.fileImg {
  font-size: 10rem;
  padding: 2rem;
  display: flex;
  justify-content: center;
}
.title-file {
  text-align: center;
  color: #5a595b;
  margin-bottom: 0.5rem;
}
.button .pass {
  background: #007acc;
}

.button .notPass {
  background: #cd3333;
}
.fileBox {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 0.5rem 1rem;
}
.fileBox > div {
  width: 3rem;
  /* height: 3rem; */
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
.fileBox img {
  width: 100%;
  border-radius: 0.5rem;
}
.fileItem a {
  color: #0066cc;
  line-height: 2.6rem;
}
.textarea {
  width: 100%;
  background: #f4f4f4;
  margin-bottom: 0.5rem;
  border-radius: 0.25rem;
  height: 8rem;
  resize: none;
}
.fileItem img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
.maxheightbox {
  max-height: 25rem;
  overflow-y: scroll;
}
</style>

