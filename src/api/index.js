let base = process.env.root;
let zp6 = process.env.zp6;
let file = process.env.file;
let tag360 = process.env.tag360;
let Mini_cex = process.env.Mini_cex;
let mock = '/mock'
const api = {
  // 子系统接口对接
  tag360: `${tag360}/base/user/auth`,
  Mini_cex: `${Mini_cex}/user/auth`,
  homeInit: `${base}/account/homeInit`, //初始化5.0-6.0权限接口
  appLogin: `${zp6}/appLogin.do`, // 跳转住陪6.0
  // 用户
  login: `${base}/test/testLogin`, // 登录
  userInfo: `${base}/account/getUserInfo`, // 用户信息
  changeRole: `${base}/home/common/change`, // 切换角色
  getUserInstitutes: `${base}/account/getUserInstitutes`,
  // 首页
  homeActivity: `${base}/phone/student/queryOwnTeachingList`, // 首页教学活动列表
  homeRotation: `${base}/phone/student/queryCurrentDeptInfosByStudent`, // 学员首页轮转计划、登记手册
  queryPhoneMyCycleInfo:`${base}/phone/student/queryPhoneMyCycleInfo`, //学员首页轮转计划、登记手册

  getUserInstitutes: `${base}/account/getUserInstitutes`, //机构信息
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
  opinionFindById: `${base}/opinion/findById`, // 问卷调查
  saveAnswerOfOpinion: `${base}/teachingQuestion/saveAnswerOfOpinion`, // 问卷调查——保存 提交
  queryAllDepartments: `${base}/department/queryDepartmentTree`, // 获取所有科室
  queryDepartments: `${base}/department/queryDepartmentsByRole`, // 科室名称
  editTeaching: `${base}/teaching/editTeaching`, // 活动管理 添加活动
  queryTeachingSpeaker: `${base}/teaching/queryTeachingSpeaker`, // 教学活动 添加活动--院内 院外 出现主讲人
  findTeachingReceiversByTeachingId: `${base}/teaching/findTeachingReceiversByTeachingId`, // 活动管理 -> 发布活动 ->查看 -> 接收对象 ->查看
  queryTeachingReceiverVO: `${base}/teaching/queryTeachingReceiverVO`, // 教学活动 -> 打卡详情
  findDisease: `${base}/teaching/findDisease`, // 教学活动 - 添加活动 - 查询病种
  findSurgery: `${base}/teaching/findSurgery`, // 教学活动 - 添加活动 - 查询技能
  findHuman: `${base}/teaching/findHuman`, // 教学活动 - 添加活动 - 接收人 -- 全院
  findTeachingReceiver: `${base}/teaching/findTeachingReceiver`, // 教学活动 - 添加活动 - 接收人 -- 回显
  studentdepartment: `${base}/department/queryDepartmentsByRole`, // 教学活动 - 添加活动 - 查科室 学员
  selectByType: `${base}/sysDict/selectByType`, // 教学活动类型
  editSpeaker:`${base}/teaching/editSpeaker`,//教学活动修改主讲人


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
  appAllDutyType: `${base}/phone/student/appAllDutyType`, // 考勤打卡 班次 同济
  saveTongJiSignIn: `${base}/phone/student/saveTongJiSignIn`, // 考勤打卡 班次 同济
  queryTongjiSignInDetails: `${base}/phone/student/queryTongjiSignInDetails`, // 考勤打卡 班次 同济 数据请求
  tongjiSignOutDetails: `${base}/phone/student/tongjiSignOutDetails`, // 考勤打卡 班次 同济 签退
  saveTongJiSignInNull: `${base}/phone/student/saveTongJiSignInNull`, // 考勤打卡 班次 同济 班次时间为空签到
  cancelLeaveApply:`${base}/attendanceManage/cancelLeaveApply`,// 考勤管理
  delLeaveApply: `${base}/attendanceManage/delLeaveApply`,//删除考勤
  //入科登记
  queryEntryRegisterList: `${base}/entryDepartment/pageEntryDepartment`, // 入科登记查询
  updateEntryDepartmentStatus: `${base}/entryDepartment/updateEntryDepartmentStatus`, //入科登记 已入科
  revokeEntry:`${base}/entryDepartment/revokeEntry`,

  //档案管理
  selectSimpleByStudentId: `${base}/studentInfo/selectSimpleByStudentId`, // 其他轮转查看列表
  updateHeadPortrait:`${base}/studentInfo/updateHeadPortrait`,//保存头像
  selectByStudentId:`${base}/studentInfo/selectByStudentId`,
  updateByStudentId:`${base}/studentInfo/updateByStudentId`,//保存
  teacherCertificate:`${base}/teacherCertificate/pageList`,//证书列表
  certificateSaveOrUpdate: `${base}/teacherCertificate/saveOrUpdate`, //保存/更新
  certificateDelete : `${base}/teacherCertificate/delete`,//删除证书
  teacherEngageList:`${base}/teacherEngage/pageList`, //聘任列表
  teacherEngageSaveOrUpdate: `${base}/teacherEngage/saveOrUpdate`, //聘任保存或者更新
  teacherEngageDelete:`${base}/teacherEngage/delete`, //聘任删除
  selectTeacherPositionByTeacherId: `${base}/teacherPosition/selectTeacherPositionByTeacherId`,//查看师资级别
  selectTeacherReward:`${base}/teacherRewardPunishment/selectTeacherReward`,//奖励
  saveTeacherRewardRequest: `${base}/teacherRewardPunishment/saveTeacherReward`,//保存奖励
  deleteTeacherReward: `${base}/teacherRewardPunishment/deleteTeacherReward`, //删除奖励情况
  selectTeacherPunishment:`${base}/teacherRewardPunishment/selectTeacherPunishment`,//惩罚
  saveTeacherPunishment:`${base}/teacherRewardPunishment/saveTeacherPunishment`,//保存惩罚,
  deleteTeacherPunishment: `${base}/teacherRewardPunishment/deleteTeacherPunishment`,//删除惩罚情况
  
  saveTeacherPosition: `${base}/teacherPosition/saveTeacherPosition`,//保存师资级别
  selectTeacherHighestEducationalByTeacherId: `${base}/teacherHighestEducational/selectTeacherHighestEducationalByTeacherId`, //基本信息-教育经历
  saveTeacherHighestEducational: `${base}/teacherHighestEducational/saveTeacherHighestEducational`,//保存教育经历,
  saveTeacherTrainExperience:`${base}/teacherHighestEducational/saveTeacherTrainExperience`, //培训进修
  selectTeacherTrainExperience:`${base}/teacherHighestEducational/selectTeacherTrainExperience`, //培训进修
  deleteTeacherTrainExperience:`${base}/teacherHighestEducational/deleteTeacherTrainExperience`,//删除进修培训
  selectTeacherWorkExperience: `${base}/teacherWork/selectTeacherWorkExperience`,//工作履历list
  saveTeacherWorkExperience: `${base}/teacherWork/saveTeacherWorkExperience`,//保存工作履历
  deleteTeacherWorkExperience: `${base}/teacherWork/deleteTeacherWorkExperience`,//删除工作履历
  saveStudentWorkNow:`${base}/studentWorkNow/saveStudentWorkNow`,//保存银行卡号码;
  teacherWork: `${base}/teacherWork/selectTeacherWorkNowByTeacherId`,
  saveTeacherWorkNow: `${base}/teacherWork/saveTeacherWorkNow`, //保存导员端银行卡号,
  selectList:`${base}studentWorkExperience/selectList`,//工作履历
  insert:`${base}/studentWorkExperience/insert`,//新增工作记录
  delete:`${base}/studentWorkExperience/delete`,
  // 轮转
  queryOtherRotation: `${base}/phone/student/queryEnrollmentsForTwoLevelType`, // 其他轮转查看列表
  registerManual: `${base}/phone/student/enrollmentForOutOfDepartment`, // 查看登记手册
  removeRegster: `${base}/phone/student/removeEnrollmentsByIds`, // 病种、技能轮转查看列表
  queryDiseaseList: `${base}/phone/student/queryEnrollmentsForDisease`, // 病种、技能轮转查看列表
  saveModifyEnrollment: `${base}/enrollment/modifyEnrollment`, // 保存编辑后-登记手册
  fixCasePatientInfoByCodeName:`${base}/casePatient/fixCasePatientInfoByCodeName`, //病例自动补全用户信息
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
  // registerIllList: `${base}/enrollment/queryDiseaseAndSurgeryEnrollmentNumInfo`, // 登记手册病种列表
  registerIllList: `${base}/phone/student/diseaseForOutOfDepartment`, // 登记手册病种列表
  registerSkillList: `${base}/phone/student/surgeryForOutOfDepartment`, // 登记手册技能列表
  otherList: `${base}/phone/student/otherForOutOfDepartment`, // 登记手册技能列表
  surgeryList: `${base}/phone/student/querySurgeryByNormalDepartmentAndConditions`, // 操作技能列表
  diseaseList: `${base}/phone/student/queryDiseaseByNormalDepartmentAndConditions`, // 主要诊断病种列表
  querySurgeryByNormalDepartmentId: `${base}/enrollment/querySurgeryByNormalDepartmentId`, // 根据标准科室获取技能、手术
  queryDiseaseByNormal: `${base}/enrollment/queryDiseaseByNormalDepartmentId`, // 根据标准科室获取技能、手术

  saveRegister: `${base}/phone/student/saveEnrollment`, // 保存登记手册
  /* 登记手册新  */
  statisticsEnrollmentByOneLevelType: `${base}/enrollment/statisticsEnrollmentByOneLevelType`, // 登记手册完成情况统计
  queryEnrollmentByCode: `${base}/enrollment/queryEnrollmentByCode`, // App-登记手册-某项病种详情
  queryEnrollmentByOneLevelType: `${base}/enrollment/queryEnrollmentByOneLevelType`, // App-登记手册-列表
  queryOneLevelTypeDetail: `${base}/enrollment/queryOneLevelTypeDetail`, // 登记手册-病种/技能/手术录入情况







  //活动管理
  auditActivityList: `${base}/teaching/queryTeachingAuditList`, // 审核活动
  auditActivityDetail: `${base}/teaching/findTeachingById`, // 审核活动
  saveTeachingAuditResult: `${base}/teaching/saveTeachingAuditResult`, // 审核活动通过&&不通过
  activityMssage: `${base}/teaching/findTeachingById`, // 活动管理活动详情
  activityNum: `${base}/teaching/findTeachingHuman`, // 活动管理活动详情->活动人数
  selectList: `${base}/opinion/selectList`, // 活动管理--添加活动->使用评价表
  teachingStop: `${base}/teaching/stop`, //停止教学活动
  teachingQuestion:`${base}/teachingQuestion/queryOpinionAnswerByEvaluateId`, //活动评价查看
  uploadAttachment:`${base}/teaching/uploadAttachment`,//添加活动附件  
  delTeachingAttachment: `${base}/teaching/delTeachingAttachment`,//删除活动笔记照片
  multistandard: `${base}/multistandard/findByApplySystem`,//获取标准
  // normalDepartment : `${base}/normalDepartment/findNormalDepartmentByMid`,//获取标准科室
  normalDepartment : `${base}/normalDepartment/findByMultiStandardId`,
  enrollment:`${base}/instituteDisease/list`, //获取病种
  querySurgery:`${base}/instituteSurgery/list`,//获取技能手术
  //分配带教
  getNotAllotTeacherStudentForMobile: `${base}/allotTeacher/getNotAllotTeacherStudentForMobile`, // 查看分配带教-待分配
  getAlreadyAllotTeacherStudentForMobile: `${base}/allotTeacher/getAlreadyAllotTeacherStudentForMobile`, // 查看分配带教-已分配
  pagingAllotTeacherList: `${base}/allotTeacher/pagingAllotTeacherList`, // 带教老师查询
  allotTeacher: `${base}/allotTeacher/allotTeacher`, // 分配带教时间
  // 附件上传
  fileUploder_oss: `${file}/oss/signature/getOssSignature`, // 获取阿里签名-阿里上传
  fileUploder: `${file}/upload/localfile/storage`, // 局域网上传
  fileMD5: `${file}/upload/localfile/md5`, // 文件md5签名
  addTeachingAttachment:`${base}/teaching/addTeachingAttachment`, // 活动管理上传附件

  // 师承导师
  getWithTeacherlist: `${base}/attendanceWithTeacher/list`, //跟师考勤列表
  getStudentInforlist: `${base}/studentMentorMatch/matchStudents`, //学员信息列表
  getStudentMentorMatch: `${base}/studentMentorMatch`, //学员信息列表>学员详情
  getStudentMentorMatchAudit: `${base}/studentMentorMatch/audit`, //学员信息列表>学员详情>申请拒绝/同意/撤销接口


  //师承管理
  clinicalRecordList: `${base}/clinicalRecord/pageForApp`, //临床医案
  teacherReview: `${base}/clinicalRecord/audit`, //导师审核
  attendanceWithTeacherList: `${base}/attendanceWithTeacher/list`, // 跟师考勤
  attendanceWithTeacherSave: `${base}/attendanceWithTeacher/save`, // 跟师考勤 -- 扫码
  //跟师心得
  supervisorNoteList: `${base}/supervisorNote/pageForApp`,
  ReviewsupervisorNote: `${base}/supervisorNote/audit`, //审核跟师心得
  findNoneById: `${base}/supervisorNote/find`,
  isLan: true,
  // 中医师承
  clinicalRecordCommit: `${base}/clinicalRecord/commit`, // 临床医案 提交
  clinicalRecordPageForApp: `${base}/clinicalRecord/pageForApp`, // 临床医案列表
  clinicalRecordRevoke: `${base}/clinicalRecord/revoke`, // 撤销临床医案
  clinicalRecordFind: `${base}/clinicalRecord/find`, // 查看临床医案
  clinicalRecordSave: `${base}/clinicalRecord/save`, // 保存临床医案 -- 草稿
  clinicalRecorddelete: `${base}/clinicalRecord/delete`, // 删除 -- 临床医案
  studentMentorMatchMentors: `${base}/studentMentorMatch/mentors`, // 导师信息
  studentMentorMatch: `${base}/studentMentorMatch`, // 导师详情
  studentMentorMatchApply: `${base}/studentMentorMatch/students/apply`, // 导师申请 -- 保存 -- 提交
  studentMentorMatchAudit: `${base}/studentMentorMatch/audit`, // 导师申请 ---- 撤销
  supervisorNotePageForApp: `${base}/supervisorNote/pageForApp`, // 跟师心得
  supervisorNotePageCommit: `${base}/supervisorNote/commit`, // 跟师心得 -- 添加提交
  supervisorNoteFind: `${base}/supervisorNote/find`, // 跟师心得 -- 回显
  supervisorNoteRevoke: `${base}/supervisorNote/revoke`, // 跟师心得 -- 撤销
  supervisorNoteSave: `${base}/supervisorNote/save`, // 跟师心得 -- 保存草稿
  supervisorNoteDelete: `${base}/supervisorNote/delete`, // 跟师心得 -- 删除
  appScan: `${base}/phone/student/appScan`, // 新扫码
  studentWorkNow:`${base}/studentWorkNow/selectStudentWorkNowById`,

  // 个人信息 档案
  selectByType: `${base}/sysDict/selectByType`, // 字典查询
  saveTeacherInfo: `${base}/teacherInfo/saveTeacherInfo`, // 师资档案保存
  selectTeacherInfoByTeacherId: `${base}/teacherInfo/selectTeacherInfoByTeacherId`, //
  selectTeacherById: `${base}/teacherInfo/selectTeacherById`, // 用户信息
  teacherupdateHeadPortrait: `${base}/teacherInfo/updateHeadPortrait`, // 保存头像
  // 科室管理员 学员信息
  statisticalCenter: `${base}/phone/department/statisticalCenter`, //
  studentByGrade: `${base}/phone/department/studentByGrade`, // 查询学员年级分布
  studentPage: `${base}/phone/department/studentPage`, // 查询学员列表
  teachingStudentByGrade: `${base}/phone/department/teachingStudentByGrade`, // 查询带教学员年级分布
  updateByApplyState:`${base}/schedulingTeacherRecord/updateByApplyState`,//撤销带教
  // 申请带教 学员
  nextDepartment: `${base}/scheduleResult/nextDepartment`, // 查询学员下个轮转科室
  findByManageDepartment: `${base}/allotTeacher/findByManageDepartment`, // 查询该科室的管理员下带教列表
  selectByTeacherId: `${base}/teacherInfo/app/selectByTeacherId`,//老师详情

  applyTeachingHistory: `${base}/allotTeacher/findApplyTeachingHistory`, // 查询申请带教记录列表
  schedulingTeacherRecord:`${base}/schedulingTeacherRecord`,
  //考务管理
  findAssessList:`${base}/outDepartmentAssessResult/app/findAssessList`,//技能考核列表
  getByAssessId:`${base}/outDepartmentAssessResult/app/getByAssessId`,//app-考务详情
  getAssessItemByAssessHumanId:`${base}/outDepartmentAssessResult/app/getAssessItemByAssessHumanId`,//app-继续考试/开始考试/查看结果详情接口
  AssessResultAdd:`${base}/outDepartmentAssessResult/app/add`,

  // 问卷调查
  selectById:`${base}/survey/selectById`, // 根据ID查询问卷接口
  selectSurveyHuman:`${base}/survey/selectSurveyHuman`, // 问卷完成情况-查询
  selectCompletionStatus:`${base}/survey/selectCompletionStatus`, // 问卷完成情况
  saveSurveyHuman:`${base}/survey/saveSurveyHuman`, // 问卷完成情况 保存

  queryEvaluate:`${base}/teaching/queryEvaluate`,
  findAuditList:`${base}/survey/findAuditList`, // 问卷-审核列表接口
  teacherList:`${base}/survey/teacherList`, // 问卷-查询带教老师列表接口
  batchAudit:`${base}/survey/batchAudit`, // 问卷-批量审核接口
  auditCount:`${base}/survey/auditCount`, // 问卷-已审核/未审核数量接口
  findInstitutionSurveyId:`${base}/survey/temp/findInstitutionSurveyId`, //
  getHumanInfoById:`${base}/survey/getHumanInfoById`, // 问卷调查 填写页面身份信息


  recallDepartmentOutApply:`${base}/identify/recallDepartmentOutApply`, // 出科申请撤回
  modifyDepartmentOutApply:`${base}/identify/modifyDepartmentOutApply`, // 出科申请修改
  queryEnrollmentTubeBedAndWrite:`${base}/enrollment/queryEnrollmentTubeBedAndWrite`, // 出科申请完成管床和大病例数

  listStudentCourse:`${base}/intodeptcourseDeptcourse/listStudentCourse`, // 入科学习
  listStudySituation:`${base}/intodeptcourseDeptcourse/listStudySituation`, // 入科学习情况
  queryDepartmentsByRole:`${base}/department/queryDepartmentsByRole`,
  querySchedulingDepartmentDistinct:`${base}/scheduleResult/querySchedulingDepartmentDistinct`,
  intodeptcourseStudyrecordPageList:`${base}/intodeptcourseStudyrecord/pageList`,
  toOnLineView:`${base}/onLine/toOnLineView`,

  Question:`${base}/assess/infoAssessTableRecordQuestion`,
  AssessTable:`${base}/assess/listStudentOutDepartmentAssessTable` ,//学员出科的测评表列表
  infoAssess:`${base}/assess/infoAssessTableQuestion`,//学员出科的测评问题表
  TableQuestion:`${base}/assess/saveAssessTableRecord`,//保存学员出科的测评表答案
  
  studentsysDict:`${base}/sysDict/selectByType`
  // '/sysDict/selectByType'


};
export default api;
