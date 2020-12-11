export default [
  /*---------公共start--------*/
  {
    path: "/",
    redirect: {name: "Home"}
  },
  {
    path: "/index.html",
    redirect: {name: "Home"}
  },
  {
    path: "/Home",
    name: "Home", // 首页
    component: resolve => require(["@/components/Home"], resolve)
  },
  {
    path: "/ActivitiesDetails",
    name: "ActivitiesDetails", // 活动详情   教学活动 - 待参加 - 活动详情
    component: resolve => require(["@/components/ActivitiesDetails"], resolve)
  },
  {
    path: "/ManualAudit",
    name: "ManualAudit", // 手册审核
    component: resolve => require(["@/components/ManualAudit"], resolve)
  },
  {
    path: "/ManualAuditDetail",
    name: "ManualAuditDetail", // 手册审核
    component: resolve => require(["@/components/ManualAuditDetail"], resolve)
  },
  {
    path: "/TeachingActivities",
    name: "TeachingActivities", // 教学活动
    component: resolve => require(["@/components/TeachingActivities"], resolve)
  },
  {
    path: "/GraduateAppraisal",
    name: "GraduateAppraisal", // 出科鉴定
    component: resolve => require(["@/components/GraduateAppraisal"], resolve)
  },

  /*---------公共end--------*/


  /*---------登记手册start--------*/
  {
    path: "/RegistrationManual",
    name: "RegistrationManual", // 登记手册
    component: resolve => require(["@/view/registration/RegistrationManual"], resolve)
  },
  {
    path: "/RegistrationHand",
    name: "RegistrationHand", // 登记手册提交
    component: resolve => require(["@/view/registration/RegistrationHand"], resolve)
  },
  {
    path: "/RemoveManual",
    name: "RemoveManual", // 删除登记手册列表
    component: resolve => require(["@/view/registration/RemoveManual"], resolve)
  },
  {
    path: "/ModeRegister",
    name: "ModeRegister", // 病种 技能 其他，列表详情
    component: resolve => require(["@/view/registration/ModeRegister"], resolve)
  },
  {
    path: "/AddRegister",
    name: "AddRegister", // 病种 技能 其他，列表详情
    component: resolve => require(["@/view/registration/AddRegister"], resolve)
  },
  {
    path: "/EditRegister",
    name: "EditRegister", // 病种 技能 其他，新增编辑表单
    component: resolve => require(["@/view/registration/EditRegister"], resolve)
  },
  {
    path: "/OtherRotation",
    name: "OtherRotation", // 其他轮转列表
    component: resolve => require(["@/view/registration/OtherRotation"], resolve)
  },
  /*---------登记手册end--------*/


  /*---------考勤管理start--------*/
  {
    path: "/ApplicationLeave",
    name: "ApplicationLeave", // 请假申请
    component: resolve => require(["@/view/attendance/ApplicationLeave"], resolve)
  },
  {
    path: "/SignIn",
    name: "SignIn", // 签到打卡
    component: resolve => require(["@/view/attendance/SignIn"], resolve)
  },
  {
    path: "/ViewClasses",
    name: "ViewClasses", // 查看班次
    component: resolve => require(["@/view/attendance/MonthlyCalendar"], resolve)
  },
  {
    path: "/MonthlyCalendar",
    name: "MonthlyCalendar", // 考勤月历
    component: resolve => require(["@/view/attendance/MonthlyCalendar"], resolve)
  },
  {
    path: "/Leave",
    name: "Leave", // 请假
    component: resolve => require(["@/view/attendance/Leave"], resolve)
  },
  {
    path: "/LeaveDetail",
    name: "LeaveDetail", // 请假详情
    component: resolve => require(["@/view/attendance/LeaveDetail"], resolve)
  },
  {
    path: "/LeaveApprova",
    name: "LeaveApprova", // 请假审批列表
    component: resolve => require(["@/view/attendance/LeaveApprova"], resolve)
  },
  {
    path: "/LeaveApprovaLinst",
    name: "LeaveApprovaLinst", // 请假审批
    component: resolve => require(["@/view/attendance/LeaveApprovaLinst"], resolve)
  },
  {
    path: "/SignInToReview",
    name: "SignInToReview", // 签到审核
    component: resolve => require(["@/view/attendance/SignInToReview"], resolve)
  },
  /*---------考勤管理end--------*/

  /*---------活动管理start--------*/
  {
    path: "/ActivityManage",
    name: "ActivityManage", // 活动管理
    component: resolve => require(["@/view/activity/ActivityManage"], resolve)
  },
  {
    path: "/AddActivities",
    name: "AddActivities", // 添加活动
    component: resolve => require(["@/view/activity/AddActivities"], resolve)
  },
  {
    path: "/LookAttendance",
    name: "LookAttendance", // 查看审核活动
    component: resolve => require(["@/view/activity/LookAttendance"], resolve)
  },
  {
    path: "/ActivityMssage",
    name: "ActivityMssage", // 查看活动详情
    component: resolve => require(["@/view/activity/ActivityMssage"], resolve)
  },
  {
    path: "/PublishingActivities",
    name: "PublishingActivities", // 带教老师活动管理
    component: resolve => require(["@/view/activity/PublishingActivities"], resolve)
  },
  {
    path: "/Management",
    name: "Management", // 发布活动查看
    component: resolve => require(["@/view/activity/Management"], resolve)
  },
  {
    path: "/RedactLinst",
    name: "RedactLinst", // 发布活动查看
    component: resolve => require(["@/view/activity/RedactLinst"], resolve)
  },
  {
    path: "/PunchCards",
    name: "PunchCards", // 教学活动 - 打卡详情
    component: resolve => require(["@/view/activity/PunchCards"], resolve)
  },
  {
    path: "/questionnaire",
    name: "questionnaire", // 教学活动 - 问卷调查
    component: resolve => require(["@/view/activity/questionnaire"], resolve)
  },
  {
    path: "/DepartmentName",
    name: "DepartmentName", // 科室名称
    component: resolve => require(["@/view/activity/DepartmentName"], resolve)
  },
  {
    path: "/ActiveParticipation",
    name: "ActiveParticipation", // 教学活动 - 已参加 - 活动详情
    component: resolve => require(["@/view/activity/ActiveParticipation"], resolve)
  },
  {
    path: "/CheckLook",
    name: "CheckLook", // 活动管理 - 发布活动 - 查看 - 接收对象 - 查看
    component: resolve => require(["@/view/activity/CheckLook"], resolve)
  },
  {
    path: "/EditActivityPerson",
    name: "EditActivityPerson", // 查看活动详情
    component: resolve => require(["@/view/activity/EditActivityPerson"], resolve)
  },
  /*---------活动管理end--------*/
  {
    path: "/RotationPlan",
    name: "RotationPlan", // 轮转计划
    component: resolve => require(["@/view/scheduling/RotationPlan"], resolve)
  },
  {
    path: "/GraduateSummary",
    name: "GraduateSummary", // 出科申请、出科小结
    component: resolve => require(["@/view/scheduling/GraduateSummary"], resolve)
  },
  {
    path: "/Section",
    name: "Section", // 心理自评
    component: resolve => require(["@/view/scheduling/Section"], resolve)
  },
  {
    path: "/SectionDetails",
    name: "SectionDetails", // 科室
    component: resolve => require(["@/view/scheduling/SectionDetails"], resolve)
  },
  {
    path: "/MyTeacher",
    name: "MyTeacher", // 我的带教
    component: resolve => require(["@/view/scheduling/MyTeacher"], resolve)
  },
  {
    path: "/RecordEntry",
    name: "RecordEntry", // 出科记录
    component: resolve => require(["@/view/scheduling/RecordEntry"], resolve)
  },
  {
    path: "/SubjectAppraise",
    name: "SubjectAppraise", // 出科鉴定审核
    component: resolve => require(["@/view/scheduling/SubjectAppraise"], resolve)
  },
  {
    path: "/AuditIsGiven",
    name: "AuditIsGiven", // 审核出科
    component: resolve => require(["@/view/scheduling/AuditIsGiven"], resolve)
  },
  /*---------轮转end--------*/

  /*---------分配带教start--------*/
  {
    path: "/TeachingSituation",
    name: "TeachingSituation", // 带教情况
    component: resolve => require(["@/view/teaching/TeachingSituation"], resolve)
  },
  {
    path: "/TeachingDetail",
    name: "TeachingDetail", // 带教详情
    component: resolve => require(["@/view/teaching/TeachingDetail"], resolve)
  },
  {
    path: "/AllocationTeacher",
    name: "AllocationTeacher", // 分配带教
    component: resolve => require(["@/view/teaching/AllocationTeacher"], resolve)
  },
  {
    path: "/ChooseTeacher",
    name: "ChooseTeacher", // 选择带教老师
    component: resolve => require(["@/view/teaching/ChooseTeacher"], resolve)
  },
  {
    path: "/ShowTeacherDetil",
    name: "ShowTeacherDetil", // 选择带教老师
    component: resolve => require(["@/view/teaching/ShowTeacherDetil"], resolve)
  },
  {
    path: "/ShowTeacher",
    name: "ShowTeacher", // 带教详情
    component: resolve => require(["@/view/teaching/ShowTeacher"], resolve)
  },
  /*---------分配带教end--------*/
  /*---------个人信息start------*/
  {
    path: "/PersonInfo",
    name: "PersonInfo", // 个人信息
    component: resolve => require(["@/view/personinfo/personInfoIndex.vue"], resolve)
  },
  {
    path: "/teacherPersonlnfo",
    name: "teacherPersonlnfo", // 个人信息 -- 基本信息 老师
    component: resolve => require(["@/view/personinfo/teacherPersonlnfo"], resolve)
  },
  {
    path: "/Record",
    name: "Record", // 工作履历
    component: resolve => require(["@/view/personinfo/Record"], resolve)
  },
  {
    path: "/Take",
    name: "Take", // 新增工作纪录
    component: resolve => require(["@/view/personinfo/Take"], resolve)
  },
  // {
  //   path: "/Update",
  //   name: "Update", // 编辑工作记录
  //   component: resolve => require(["@/view/personinfo/Update"], resolve)
  // },
  {
    path: "/StudentPersonlnfo",
    name: "StudentPersonlnfo", // 个人信息 -- 基本信息 老师
    component: resolve => require(["@/view/personinfo/studentPersonlnfo"], resolve)
  },
  /** --- 证书管理 ---- */
  {
    path: "/CertificateManager",
    name: "CertificateManager", // 个人信息 -- 证书管理 老师
    component: resolve => require(["@/view/personinfo/CertificateManager"], resolve)
  },
  /** --- 证书管理 ---- */
  {
    path: "/Appointment",
    name: "Appointment", // 个人信息 -- 证书管理 老师
    component: resolve => require(["@/view/personinfo/Appointment"], resolve)
  },
  /** --- 进修培训 ---- */
  {
    path: "/Refreshertraining",
    name: "Refreshertraining", // 个人信息
    component: resolve => require(["@/view/personinfo/Refreshertraining"], resolve)
  },
  /** --- 工作履历 ---- */
  {
    path: "/Resume",
    name: "Resume", // 个人信息
    component: resolve => require(["@/view/personinfo/Resume"], resolve)
  },
  /** --- 奖惩情况 ---- */
  {
    path: "/RewardsPun",
    name: "RewardsPun", // 个人信息
    component: resolve => require(["@/view/personinfo/RewardsPun"], resolve)
  },
  /*---  入科登记  ----*/
  {
    path: "/EntryRegister",
    name: "EntryRegister", // 出科鉴定审核
    component: resolve => require(["@/view/entryregister/EntryRegister"], resolve)
  },
  /*---  申请带教  ----*/
  {
    path: "/stateTeaching",
    name: "stateTeaching", // 申请带教
    component: resolve => require(["@/view/applyTeaching/stateTeaching"], resolve)
  },
  /*---  申请记录  ----*/
  {
    path: "/application",
    name: "application", // 申请带教
    component: resolve => require(["@/view/applyTeaching/application"], resolve)
  },
  
  /*---  老师详情  ----*/
  {
    path: "/TeacherInfo",
    name: "TeacherInfo", // 申请带教
    component: resolve => require(["@/view/applyTeaching/teacherInfo"], resolve)
  },
  // TeacherInfo
  /*----   智能填报  ---- */
  //
  {
    path: "/survey",
    name: "survey", // 问卷调查
    component: resolve => require(["@/view/intelligent/survey"], resolve)
  },
  {
    path: "/fillin",
    name: "fillin", // 填写问卷
    component: resolve => require(["@/view/intelligent/fillin"], resolve)
  },
  {
    path: "/review",
    name: "review", // 审核情况
    component: resolve => require(["@/view/intelligent/review"], resolve)
  },
  {
    path: "/EntryStudy",
    name: "EntryStudy", // 入科学习
    component: resolve => require(["@/view/entryregister/EntryStudy"], resolve)
  },
  {
    path: "/EntryStudyRecord",
    name: "EntryStudyRecord", // 入科学习记录
    component: resolve => require(["@/view/entryregister/EntryStudyRecord"], resolve)
  },
  {
    path: "/EntryStudySituation",
    name: "EntryStudySituation", // 入科学习情况
    component: resolve => require(["@/view/entryregister/EntryStudySituation"], resolve)
  }
]
