import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const index = new Vuex.Store({
  state: {
    timestamp: "",
    loading: false,
    currentDepartment: {},
    roleList: [
      { "key": "base", "value": "住培管理员" },
      { "key": "subject", "value": "专业基地管理员" },
      { "key": "department", "value": "科室管理员" },
      { "key": "teacher", "value": "带教老师" },
      { "key": "tutor", "value": "师承导师" },
      // {'key': 'tutor', 'value': '责任导师'},
      { "key": "student", "value": "住培生" },

    ],
    baseModules: [{ // 住培管理员
      title: "过程管理",
      columns: [{
        type: "inside",
        name: "请假审批",
        path: "LeaveApprova",
        icon: "pictp_13"
      },
      {
        type: "inside",
        name: "活动管理",
        icon: "pictp_07",
        path: "ActivityManage"
      },
      {
        type: "external",
        name: "360评估",
        icon: "pictp_09",
        path: "360"
      }
      ]
    },
    ],
    subjectModules: [{ // 专业基地管理员
      title: "过程管理",
      columns: [{
        type: "inside",
        name: "请假审批",
        icon: "pictp_13",
        path: "LeaveApprova"
      },
      {
        type: "inside",
        name: "审核出科",
        icon: "pictp_05",
        path: "AuditIsGiven"
      },
      {
        // type: "inside",
        type: "build",
        name: "活动管理",
        icon: "pictp_07",
        path: "PublishingActivities"
      },
      {
        type: "external",
        name: "360评估",
        icon: "pictp_09",
        path: "360"
      }
      ]
    },

    ],
    departmentModules: [{ // 科室管理员
      title: "过程管理",
      columns: [{
        type: "inside",
        name: "入科登记",
        icon: "pictp_01",
        path: "EntryRegister"
      },
      {
        // type: "inside",
        type: "build",
        name: "分配带教",
        icon: "pictp_14",
        path: "AllocationTeacher"
      },
      {
        type: "inside",
        name: "签到审核",
        icon: "pictp_15",
        path: "SignInToReview"
      },
      {
        type: "inside",
        name: "手册审核",
        icon: "pictp_10",
        path: "ManualAudit"
      },
      {
        type: "inside",
        name: "请假审批",
        icon: "pictp_13",
        path: "LeaveApprova"
      },
      {
        type: "inside",
        name: "审核出科",
        icon: "pictp_05",
        path: "AuditIsGiven"
      },
      {
        type: "inside",
        name: "活动管理",
        icon: "pictp_07",
        path: "ActivityManage"
      },
      {
        type: "build",
        name: "师承管理",
        icon: "pictp_06"
      },
      {
        type: "build",
        name: "师承笔记",
        icon: "pictp_08"
      },
      {
        type: "external",
        name: "360评估",
        icon: "pictp_09",
        path: "360"
      }
      ]
    },
    // 中医师承-- 师承导师
    {
      title: "师承管理",
      columns: [{
        type: "build",
        name: "学员信息",
        icon: "pictp_20",
        // path: "ActivityManage"
      },
      {
        type: "build",
        name: "跟师考勤",
        icon: "pictp_23"
      },
      {
        type: "build",
        name: "医案审核",
        icon: "pictp_21"
      },
      {
        type: "build",
        name: "心得审核",
        icon: "pictp_22",
        path: "360"
      }
      ]
    }
    ],
    teacherModules: [ // 带教老师
      {
        title: "过程管理",
        columns: [{
          type: "inside",
          name: "手册审核",
          icon: "pictp_10",
          path: "ManualAudit"
        },
        {
          type: "inside",
          name: "带教情况",
          icon: "pictp_11",
          path: "TeachingSituation"
        },
        {
          type: "inside",
          name: "出科鉴定",
          icon: "pictp_12",
          path: "SubjectAppraise"
        },
        {
          type: "inside",
          name: "请假审批",
          icon: "pictp_13",
          path: "LeaveApprova"
        },
        {
          // type: "inside",
          type: "build",
          name: "活动管理",
          icon: "pictp_07",
          path: "PublishingActivities"
        },
        {
          type: "external",
          name: "360评估",
          icon: "pictp_09",
          path: "360"
        }
        ]
      },
    ],
    tutorModules: [{ // 师承导师
      title: "过程管理",
      columns: [
        {
          type: "inside",
          name: "手册审核",
          icon: "pictp_10",
          path: "ManualAudit"
        },
        {
          type: "inside",
          name: "带教情况",
          icon: "pictp_11",
          path: "TeachingSituation"
        },
        {
          type: "inside",
          name: "出科鉴定",
          icon: "pictp_12",
          path: "SubjectAppraise"
        },
        {
          type: "inside",
          name: "请假审批",
          icon: "pictp_13",
          path: "LeaveApprova"
        },
        {
          // type: "inside",
          type: "build",
          name: "活动管理",
          icon: "pictp_07",
          path: "PublishingActivities"
        },
      ]
    },
    // 中医师承-- 师承导师
    {
      title: "师承管理",
      columns: [{
        type: "build",
        name: "学员信息",
        icon: "pictp_20",
        // path: "ActivityManage"
      },
      {
        type: "build",
        name: "跟师考勤",
        icon: "pictp_23"
      },
      {
        type: "build",
        name: "医案审核",
        icon: "pictp_21"
      },
      {
        type: "build",
        name: "心得审核",
        icon: "pictp_22",
        path: "360"
      }
      ]
    }],
    studentModules: [{ // 学生
      title: "过程管理",
      columns: [{
        type: "inside",
        name: "查看班次",
        icon: "pictp_16",
        path: "ViewClasses"
      },
      {
        type: "inside",
        name: "登记手册",
        icon: "pictp_02",
        path: "RegistrationManual"
      },
      {
        type: "inside",
        name: "出科申请",
        icon: "pictp_03",
        path: "GraduateSummary"
      },
      {
        type: "inside",
        name: "签到打卡",
        icon: "pictp_04",
        path: "SignIn"
      },
      {
        type: "inside",
        name: "请假申请",
        icon: "pictp_17",
        path: "ApplicationLeave"
      },
      {
        type: "external",
        name: "360评估",
        icon: "pictp_09",
        path: "360"
      }
      ]
    },
    {
      //  中医师承 -- 住院医师
      title: "师承管理",
      columns: [{
        type: "inside",
        name: "导师信息",
        icon: "pictp_18",
        path: 'TutorInformation'
      },
      {
        type: "inside",
        name: "跟师考勤",
        icon: "pictp_23",
        path: 'TeacherAttendance'
      },
      {
        type: "inside",
        name: "临床医案",
        icon: "pictp_19",
        path: "ClinicConsilia"
      },
      {
        type: "build",
        name: "跟师笔记",
        icon: "pictp_08",
      }

      ]
    }
    ],
    jumpAdress: {
      360: null
    },
    regsterMode: "disease",
    EditRegisterNum: "",
    EditRegisterObj: null,
    registerCode: "",
    studentObj: null,
    other: [
      { key: 11, value: "教学查房" },
      { key: 13, value: "课外学习" },
      { key: 14, value: "获奖情况" },
      { key: 15, value: "讲座" },
      { key: 16, value: "疑难病例讨论记录" },
      { key: 17, value: "死亡病例讨论记录" },
      { key: 18, value: "会诊记录" },
      { key: 19, value: "科研记录" },
      { key: 20, value: "论文" },
      { key: 21, value: "指导记录" }
    ],
    twoLevelType: [
      { "key": 1, "value": "病例（大病历）" },
      { "key": 2, "value": "病种" },
      { "key": 3, "value": "门诊诊治" },
      { "key": 4, "value": "急诊诊治" },
      { "key": 5, "value": "操作记录" },
      { "key": 6, "value": "手术记录" },
      { "key": 7, "value": "门诊操作" },
      { "key": 8, "value": "门诊手术" },
      { "key": 9, "value": "医技报告" },
      { "key": 10, "value": "抢救记录" },
      { "key": 11, "value": "教学查房" },
      { "key": 13, "value": "课外学习" },
      { "key": 14, "value": "获奖情况" },
      { "key": 15, "value": "讲座" },
      { "key": 16, "value": "疑难病例讨论记录" },
      { "key": 17, "value": "死亡病例讨论记录" },
      { "key": 18, "value": "会诊记录" },
      { "key": 19, "value": "科研记录" },
      { "key": 20, "value": "论文" },
      { "key": 21, "value": "指导记录" },
      { "key": 22, "value": "门诊病案" },
      { "key": 23, "value": "住院志" }
    ],
    oneLevelType: [ // 分类
      { "key": 1, "value": "病种" },
      { "key": 2, "value": "技能" },
      { "key": 3, "value": "其他" }
    ],
    trueOrFalse: [
      { "key": "1", "value": "是" },
      { "key": "0", "value": "否" }
    ],
    visitType: [ //手册类型
      { "key": 1, "value": "首诊" },
      { "key": 2, "value": "复诊" },
      { "key": 3, "value": "入院" },
      { "key": 4, "value": "出院" },
      { "key": 5, "value": "手术" },
      { "key": 6, "value": "影像" },
      { "key": 7, "value": "化验" },
      { "key": 8, "value": "体征" }
    ],
    majors: [ //所在专业
      { "key": "0100", "value": "内科" },
      { "key": "0200", "value": "儿科" },
      { "key": "0300", "value": "急诊科" },
      { "key": "0400", "value": "皮肤科" },
      { "key": "0500", "value": "精神科" },
      { "key": "0600", "value": "神经内科" },
      { "key": "0700", "value": "全科" },
      { "key": "0800", "value": "康复医学科" },
      { "key": "0900", "value": "外科" },
      { "key": "1000", "value": "外科（神经外科方向）" },
      { "key": "1100", "value": "外科（胸心外科方向）" },
      { "key": "1200", "value": "外科（泌尿外科方向）" },
      { "key": "1300", "value": "外科（整形外科方向）" },
      { "key": "1400", "value": "骨科" },
      { "key": "1500", "value": "儿外科" },
      { "key": "1600", "value": "妇产科" },
      { "key": "1700", "value": "眼科" },
      { "key": "1800", "value": "耳鼻咽喉科" },
      { "key": "1900", "value": "麻醉科" },
      { "key": "2000", "value": "临床病理科" },
      { "key": "2100", "value": "检验医学科" },
      { "key": "2200", "value": "放射科" },
      { "key": "2300", "value": "超声医学科" },
      { "key": "2400", "value": "核医学科" },
      { "key": "2500", "value": "放射肿瘤科" },
      { "key": "2600", "value": "医学遗传科" },
      { "key": "2700", "value": "预防医学科" },
      { "key": "2800", "value": "口腔全科" },
      { "key": "2900", "value": "口腔内科" },
      { "key": "3000", "value": "口腔颌面外科" },
      { "key": "3100", "value": "口腔修复科" },
      { "key": "3200", "value": "口腔正畸科" },
      { "key": "3300", "value": "口腔病理科" },
      { "key": "3400", "value": "口腔颌面影像科" },
      { "key": "4100", "value": "中医内科" },
      { "key": "4200", "value": "中医外科" },
      { "key": "4300", "value": "中医妇科" },
      { "key": "4400", "value": "中医儿科" },
      { "key": "4500", "value": "针灸科" },
      { "key": "4600", "value": "推拿科" },
      { "key": "4700", "value": "中医康复科" },
      { "key": "4800", "value": "中医骨伤科" },
      { "key": "4900", "value": "中医耳鼻喉科" },
      { "key": "5000", "value": "中医眼科" },
      { "key": "5100", "value": "中医全科" }
    ],
    appraisalGrade: [ //鉴定结果
      { "key": 0, "value": "优秀" },
      { "key": 1, "value": "良好" },
      { "key": 2, "value": "合格" },
      { "key": 3, "value": "不合格" }
    ],
    auditStatus: [ //审核状态
      { "key": 0, "value": "未审核" },
      { "key": 1, "value": "审核通过" },
      { "key": 2, "value": "审核不通过" },
      { "key": 3, "value": "计划中" }
    ],
    activitiesType: [//活动类别
      { "key": 1, "value": "入科教育" },
      { "key": 2, "value": "教学查房" },
      { "key": 3, "value": "病例讨论" },
      { "key": 4, "value": "小讲课" },
      { "key": 5, "value": "大讲课" },
      { "key": 6, "value": "技能训练" }
    ],
    extramural: [//主讲人类型
      { "key": 0, "value": "院内" },
      { "key": 1, "value": "院外" }
    ],
    isSignUps: [//是否报名
      { "key": 0, "value": "否" },
      { "key": 1, "value": "是" }
    ],
    receivingObjs: [
      { "key": 1, "value": "带教" },
      { "key": 2, "value": "学生" }
    ],
    seeQRcode: "http://www.imed.org.cn/chan.html",
    pageSize: 10,
    tabFlag: true,
    tabActive: 0,
    teacherTime1: null,
    teacherTime2: null,
    activitiesDetailsObj: null,
    keyBoardCode: 0 // 默认软键盘收起 -- 0 收起 1弹出
  },
  mutations: {
    showLoading(state) {
      state.loading = true;
    },
    hideLoading(state) {
      state.loading = false;
    }
  }
});
export default index;
