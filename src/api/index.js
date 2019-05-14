let base = process.env.root;
let file = process.env.file;
const api = {
  // 用户
  login: `${base}/test/testLogin`, // 登录
  userInfo: `${base}/account/getUserInfo`, // 用户信息
  changeRole: `${base}/home/common/change`, // 切换角色

  // 首页
  homeActivity: `${base}/phone/student/queryOwnTeachingList`, // 首页教学活动列表
  homeRotation: `${base}/phone/student/queryCurrentDeptInfosByStudent`, // 学员首页轮转计划、登记手册

  // 教学活动模块
  activityDetail: `${base}/phone/student/findTeachingById`, // 活动详情
  queryOwnTeachingList: `${base}/teaching/queryOwnTeachingList`, // 教学活动，待参加，已参加
  upOrCancelSignTeaching: `${base}/teaching/upOrCancelSignTeaching`, // 立即报名，取消报名
  teachingList: `${base}/teaching/queryTeachingList`, // 查看活动列表
  editReleaseStatus: `${base}/teaching/editReleaseStatus`, // 发布与取消发布活动
  delTeaching: `${base}/teaching/delTeaching`, // 删除教学活动
  saveFeedBackForTeaching: `${base}/teaching/saveFeedBackForTeaching`, // 教学活动意见反馈
  queryTeachingQR: `${base}/teaching/queryTeachingQR`, // 查看二维码
  saveQrSignInOrSignOut: `${base}/phone/student/saveQrSignInOrSignOut`, // 活动打卡
  queryOpinionByTeachingId: `${base}/teachingQuestion/queryOpinionByTeachingId`, // 问卷调查
  saveAnswerOfOpinion: `${base}/teachingQuestion/saveAnswerOfOpinion`, // 问卷调查——保存 提交
  queryAllDepartments: `${base}/department/queryDepartmentTree`, // 获取所有科室
  queryDepartments: `${base}/department/queryDepartmentsByRole`, // 科室名称
  editTeaching: `${base}/teaching/editTeaching`, // 活动管理 添加活动
  queryTeachingSpeaker: `${base}/teaching/queryTeachingSpeaker`, // 教学活动 添加活动--院内 院外 出现主讲人
  findTeachingReceiversByTeachingId: `${base}/teaching/findTeachingReceiversByTeachingId`, // 活动管理 -> 发布活动 ->查看 -> 接收对象 ->查看
  queryTeachingReceiverVO: `${base}/teaching/queryTeachingReceiverVO`, // 教学活动 -> 打卡详情

  // 考勤管理
  signInDetails: `${base}/phone/student/querySignInDetails`, // 签到打卡
  queryApplyList: `${base}/phone/student/queryApplyList`, // 请假申请
  queryAttendanceType: `${base}/attendanceManage/queryAttendanceType`, // 获取请假类型
  saveLeave: `${base}/attendanceManage/applyAttendance`, // 提交请假申请
  queryApplyById: `${base}/phone/student/queryApplyById`, // 查看请假详情
  removeEnrollments: `${base}/phone/student/removeEnrollmentsByIds`, // 查看请假详情
  queryAuditList: `${base}/attendanceManage/queryAuditList`, // 请假审批列表
  saveAuditAttendance: `${base}/attendanceManage/saveAuditAttendance`, // 请假审批通过不通过
  saveSign: `${base}/phone/student/saveStudentSignIn`, // 考勤打卡
  monthlyCalendar: `${base}/phone/student/selectDailySignScheduling`, // 考勤打卡


  //入科登记
  queryEntryRegisterList: `${base}/entryDepartment/pageEntryDepartment`, // 入科登记查询
  updateEntryDepartmentStatus: `${base}/entryDepartment/updateEntryDepartmentStatus`, //入科登记 已入科


  // 轮转
  queryOtherRotation: `${base}/phone/student/queryEnrollmentsForTwoLevelType`, // 其他轮转查看列表
  registerManual: `${base}/phone/student/enrollmentForOutOfDepartment`, // 查看登记手册
  removeRegster: `${base}/phone/student/removeEnrollmentsByIds`, // 病种、技能轮转查看列表
  queryDiseaseList: `${base}/phone/student/queryEnrollmentsForDisease`, // 病种、技能轮转查看列表
  saveModifyEnrollment: `${base}/enrollment/modifyEnrollment`, // 保存编辑后-登记手册
  departmentOut: `${base}/phone/teacher/getDepartmentOutIdentifyByApplyId`, // 查看出科鉴定
  departmentOutIdentify: `${base}/phone/teacher/modifyDepartmentOutIdentify`, // 鉴定出科鉴定
  departmentList: `${base}/phone/student/listForOutOfDepartment`, // 查看轮转计划
  getNotAlreadyAuditDepartmentOutApply: `${base}/identify/getNotAlreadyAuditDepartmentOutApply`, // 审核出科
  approval: `${base}/identify/approval`, // 批量审核通过
  reject: `${base}/identify/reject`, // 批量审核不通过
  viewTeachers: `${base}/phone/student/listTeacherByStudentId`, // 查看带教老师
  outApplyRecord: `${base}/phone/student/queryOutOfDepartmentWithApplyByStudentId`, // 出科记录
  departmentOutApply: `${base}/phone/student/getDepartmentOutApplyById`, // 出科申请
  saveDepartmentOutApply: `${base}/identify/saveDepartmentOutApply`, // 提交出科申请
  teachingSituationNum: `${base}/allotTeacher/getClinicalStudentNumStatisticsForTeacher`, // 带教情况
  teachingSituationInfo: `${base}/allotTeacher/getClinicalStudentInfoStatisticsForTeacher`, // 带教情况详情
  identifyDepartmentOutApply: `${base}/identify/queryIdentifyDepartmentOutApplyForTeacher`, // 出科鉴定
  pageDutyAuditList: `${base}/dutyPlan/pageDutyAuditList`, // 审核签到列表
  auditDuty: `${base}/dutyPlan/auditDuty`, // 审核签到
  pageBackDailySign: `${base}/dailySign/pageBackDailySign`, // 补签列表
  backDailySign: `${base}/dailySign/backDailySign`, // 补签
  // 登记手册
  pagingEnrollmentAuditList: `${base}/enrollment/pagingEnrollmentAuditList`, // 登记手册审核列表
  manualApproval: `${base}/enrollment/approval`, // 登记手册审核通过
  manualReject: `${base}/enrollment/reject`, // 登记手册审核不通过
  registerIllList: `${base}/phone/student/diseaseForOutOfDepartment`, // 登记手册病种列表
  registerSkillList: `${base}/phone/student/surgeryForOutOfDepartment`, // 登记手册技能列表
  otherList: `${base}/phone/student/otherForOutOfDepartment`, // 登记手册技能列表
  surgeryList: `${base}/phone/student/querySurgeryByNormalDepartmentAndConditions`, // 操作技能列表
  diseaseList: `${base}/phone/student/queryDiseaseByNormalDepartmentAndConditions`, // 主要诊断病种列表
  saveRegister: `${base}/phone/student/saveEnrollment`, // 保存登记手册

  //活动管理
  auditActivityList: `${base}/teaching/queryTeachingAuditList`, // 审核活动
  auditActivityDetail: `${base}/teaching/findTeachingById`, // 审核活动
  saveTeachingAuditResult: `${base}/teaching/saveTeachingAuditResult`, // 审核活动通过&&不通过

  //分配带教
  getNotAllotTeacherStudentForMobile: `${base}/allotTeacher/getNotAllotTeacherStudentForMobile`, // 查看分配带教-待分配
  getAlreadyAllotTeacherStudentForMobile: `${base}/allotTeacher/getAlreadyAllotTeacherStudentForMobile`, // 查看分配带教-已分配
  pagingAllotTeacherList: `${base}/allotTeacher/pagingAllotTeacherList`, // 带教老师查询
  allotTeacher: `${base}/allotTeacher/allotTeacher`, // 分配带教时间
  // 附件上传
  fileUploder_oss: `${file}/oss/signature/getOssSignature`, // 获取阿里签名-阿里上传
  fileUploder: `${file}/upload/localfile/storage`, // 局域网上传
  fileMD5: `${file}/upload/localfile/md5`, // 文件md5签名
  isLan: true
};
export default api;
