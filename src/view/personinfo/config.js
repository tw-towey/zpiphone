const isTrue = [
    { "key": "1", "value": "是" },
    { "key": "0", "value": "否" }];
const teacherTitle = [
    { 'key': '1', 'value': '教授' },
    { 'key': '2', 'value': '副教授' },
    { 'key': '3', 'value': '讲师' },
    { 'key': '4', 'value': '助教' }];
const  positionLevel = [
    { 'key': '1', 'value': "正高" },
    { 'key': '2', 'value': "副高" },
    { 'key': '3', 'value': "中级及以下" }
]
const yearPicker = ()=>{
    let year = [];
    for (let index = 1980; index < new Date().getFullYear()+1; index++) {
        year.push({ 'key':index,"value": index})
    }
    return year
}
export const baseInfo = [
    {
        id: "marital",
        name: "婚姻状况：",
        title: "婚姻状况",
        value: "",
        type: "picker",
        selectShow: false,
        issshow: true,
        placeholder: "请选择婚姻状况",
        option: [],
        key: ""
    },
    {
        id: "area",
        name: "国籍或地区：",
        title: "国籍或地区",
        value: "",
        issshow: true,
        type: "picker",
        selectShow: false,
        placeholder: "请选择",
        option: [],
        key: ""
    },
    {
        id: "nativePlace",
        name: "籍贯及地区：",
        title: "籍贯及地区",
        value: "",
        issshow: true,
        type: "text",
        selectShow: false,
        placeholder: "请输入",
        option: [],
        key: ""
    },
    {
        id: "politicsStatus",
        name: "政治面貌：",
        title: "政治面貌",
        value: "",
        issshow: true,
        type: "picker",
        selectShow: false,
        placeholder: "请选择",
        option: [],
        key: ""
    },
    {
        id: "medicalQualificationType",
        name: "医师资格类别：",
        title: "医师资格类别",
        value: "",
        issshow: true,
        selectShow: false,
        type: "picker",
        placeholder: "请选择",
        option: [],
        key: ""
    },
    {
        id: "certificateNum",
        name: "医师资格证书编码：",
        value: "",
        issshow: true,
        maxlength: 20,
        type: "number",
        placeholder: "请输入医师资格证书编码"
    },
    {
        id: "certificateUrl",
        name: "医师资格证书：",
        value: { md5: "" },
        issshow: true,
        type: "file",
        placeholder: ""
    },
    {
        id: "isHasTrainCertificate",
        name: "取得住院医师规范化培训合格证书：",
        title: "住院医师规范化培训合格证书",
        value: "",
        type: "switch",
        issshow: true,
        selectShow: false,
        switchChange: function (e, index) {
            hiddenFiled(baseInfo, index, index + 3,e);
        }
    },
    {
        id: "hasTrainCertificateDate",
        name: "培训合格证书发放日期：",
        title: "培训合格证书发放日期",
        value: "",
        type: "date",
        issshow: true,
        selectShow: false,
        placeholder: "培训合格证书发放日期",
    },
    {
        id: "trainCertificateArea",
        name: "住院医师规范化培训合格证书发证地区：",
        title: "住院医师规范化培训合格证书发证地区",
        value: "",
        type: "text",
        issshow: true,
        selectShow: false,
        placeholder: "请选择",
    },
    {
        id: "trainCertificateUrl",
        name: "住院医师规范化培训合格证书: ",
        issshow: true,
        value: { md5: "" },
        type: "file",
        placeholder: "请选择"
    },
    // {
    //     id: "isGeneralQualification",
    //     name: "是否全科师资: ",
    //     issshow: true,
    //     value: "",
    //     type: "switch",
    //     placeholder: "",
    //     switchChange:(e)=>{
    //     }
    // },
    {
        id: "workTime",
        name: "从事本专业临床工作年限: ",
        issshow: true,
        value: "",
        type: "number",
        placeholder: "请输入",
    },
    {
        id: "companyName",
        name: "单位名称：",
        value: "",
        issshow: true,
        selectShow: false,
        type: "text",
        placeholder: "请输入"
    },
    {
        id: "companyAddress",
        name: "单位地址：",
        value: "",
        issshow: true,
        selectShow: false,
        type: "text",
        placeholder: "请输入"
    },
    {
        id: "employmentDate",
        name: "职称聘用日期：",
        value: "",
        issshow: true,
        selectShow: false,
        type: "date",
        placeholder: "请选择"
    },
    {
        id: "workNumber",
        name: "工号：",
        value: "",
        selectShow: false,
        issshow: true,
        type: "number",
        placeholder: "请输入"
    },
    {
        id: "bankCardCode",
        name: "银行卡：",
        value: "",
        issshow: true,
        maxlength: 20,
        type: "picker",
        selectShow: false,
        placeholder: "请选择",
        option: []
    },
    {
        id: "bankCardNumber",
        name: "银行卡号：",
        value: "",
        maxlength: 20,
        issshow: true,
        type: "text",
        placeholder: "请输入"
    },
    {
        id: "beginDate",
        name: "工作开始时间：",
        value: "",
        selectShow: false,
        issshow: true,
        maxlength: 20,
        type: "date",
        placeholder: "请选择"
    },
    {
        id: "endDate",
        name: "工作结束时间：",
        value: "",
        issshow: true,
        selectShow: false,
        maxlength: 20,
        type: "date",
        placeholder: "请选择"
    },
    {
        id: "workYear",
        name: "工作年限：",
        value: "",
        issshow: true,
        selectShow: false,
        type: "number",
        placeholder: "请输入"
    },
    {
        id: "standardCode",
        name: "国家标准科室：",
        value: "",
        issshow: true,
        selectShow: false,
        type: "picker",
        placeholder: "请选择",
        option: []
    },
    {
        id: "resume",
        name: "个人简历：",
        value: "",
        issshow: true,
        selectShow: false,
        type: "autosize",
        placeholder: "请输入"
    },
    {
        id: "expertiseArea",
        name: "擅长领域：",
        issshow: true,
        value: "",
        selectShow: false,
        type: "autosize",
        placeholder: "请输入"
    },
];
export const teachLevel = [
    {
        id: "titleLevel",
        name: "当前职位级别：",
        title: "当前职位级别",
        value: "",
        type: "picker",
        issshow: true,
        selectShow: false,
        placeholder: "请选择",
        option: positionLevel,
        key: ""
    },
    {
        id: "promotionYear",
        name: "当前晋升职称年份：",
        title: "当前晋升职称年份",
        value: "",
        format: "year-month",
        type: "picker",
        selectShow: false,
        issshow: true,
        placeholder: "请选择",
        option: yearPicker(),
        key: ""
    },
    {
        id: "isTeachingZp",
        name: "是否带教住培：",
        title: "是否带教住培",
        value: "",
        type: "switch",
        selectShow: false,
        issshow: true,
        key: ""
    },
    {
        id: "teachingZpDate",
        name: "晋升带教年份：",
        title: "晋升带教年份",
        value: "",
        issshow: true,
        format: "year-month",
        selectShow: false,
        type: "picker",
        placeholder: "请选择",
        key: "",
        option:yearPicker(),
    },
    {
        id: "isManageZp",
        name: "是否管理住培：",
        value: "",
        issshow: true,
        maxlength: 20,
        type: "switch",
    },
    {
        id: "isZpTeachingsecretary",
        name: "是否曾担任住培秘书：",
        value: "",
        issshow: true,
        type: "switch",
        placeholder: "",
        switchChange: function (e, index) {
            hiddenFiled(teachLevel, index, index + 2 , e);
        }
    },
    {
        id: "zpTeachingsecretarySdate",
        name: "担任住培秘书开始日期：",
        value: "",
        type: "date",
        issshow: true,
        selectShow: false,
        placeholder: "请选择",
        key: ""
    },
    {
        id: "zpTeachingsecretaryEdate",
        name: "担任住培秘书结束日期：",
        value: "",
        type: "date",
        issshow: true,
        selectShow: false,
        placeholder: "请选择",
    },
    {
        id: "isDirectorZp",
        name: "曾担任住培主管或教学主任：",
        value: "",
        type: "switch",
        issshow: true,
        selectShow: false,
        placeholder: "请选择",
        switchChange: function (e, index) {
            hiddenFiled(teachLevel, index, index + 2 , e);
        }
    },
    {
        id: "directorZpSdate",
        name: "担任住培主管或教学主任开始年份: ",
        issshow: true,
        format: "year-month",
        type: "picker",
        selectShow: false,
        value: '',
        placeholder: "请选择",
        option:yearPicker(),
    },
    {
        id: "directorZpEdate",
        name: "担任住培主管或教学主任结束年份: ",
        issshow: true,
        value: '',
        selectShow: false,
        format: "year-month",
        type: "picker",
        placeholder: "请选择",
        option:yearPicker(),
    },
    {
        id: "isHasTeacherTitle",
        name: "是否有教师职称: ",
        issshow: true,
        value: '',
        type: "switch",
        switchChange: function (e, index) {
            hiddenFiled(teachLevel, index, index + 2 , e);
        }
    },
    {
        id: "teacherTitleType",
        name: "教师职称：",
        value: "",
        selectShow: false,
        issshow: true,
        type: "picker",
        placeholder: "请选择",
        option: teacherTitle
    },
    {
        id: "teacherTitleDate",
        name: "教师职称聘用日期：",
        issshow: true,
        value: "",
        selectShow: false,
        type: "date",
        placeholder: "请输入"
    },
    {
        id: "teachingQualification",
        name: "是否有教师资格：",
        value: "",
        selectShow: false,
        issshow: true,
        type: "switch",
        placeholder: "请选择"
    },
    {
        id: "tutorQualifications",
        name: "是否有导师资质：",
        issshow: true,
        value: "",
        maxlength: 20,
        type: "switch",
    },
    {
        id: "zpWorkPrizeInfo",
        name: "住培工作获奖情况：",
        value: "",
        issshow: true,
        maxlength: 20,
        type: "autosize",
        placeholder: "请输入"
    },
    {
        id: "zpTeachingContent",
        name: "教学教改项目和文章：",
        value: "",
        maxlength: 20,
        issshow: true,
        type: "autosize",
        placeholder: "请输入"
    },
];

export const teaExperience = [
    {
        id: "educationType",
        name: "最高学历：",
        title: "最高学历",
        issshow: true,
        value: "",
        type: "picker",
        selectShow: false,
        placeholder: "请选择",
        option: [],
        key: ""
    },
    {
        id: "graduationDate",
        issshow: true,
        name: "毕业时间：",
        title: "毕业时间",
        value: "",
        type: "date",
        selectShow: false,
        placeholder: "请选择",
        option: [],
        key: ""
    },
    {
        id: "graduationSpecialityType",
        name: "毕业专业：",
        title: "毕业专业",
        issshow: true,
        value: "",
        opt_type:"specialityType",
        type: "picker",
        placeholder: "请选择",
        selectShow: false,
        key: ""
    },
    {
        id: "otherGraduationSpeciality",
        name: "毕业专业（其他）：",
        title: "毕业专业",
        value: "",
        selectShow: false,
        issshow: true,
        type: "text",
        placeholder: "请输入",
        option: [],
        key: ""
    },
    {
        id: "graduationSchoolType",
        name: "毕业院校：",
        value: "",
        maxlength: 20,
        issshow: true,
        selectShow: false,
        placeholder: "请选择",
        type: "picker",
        opt_type: "school",
        option: []
    },
    {
        id: "otherGraduationSchool",
        name: "毕业院校（其他)：",
        value: "",
        type: "text",
        issshow: true,
        placeholder: "请输入",
        option: []
    },
    {
        id: "isGetGraduationCertificate",
        name: "获得毕业证书：",
        value: "",
        type: "switch",
        issshow: true,
        selectShow: false,
        switchChange: function (e, index) {
            hiddenFiled(teaExperience, index, index + 3 , e);
        }
    },
    {
        id: "graduationCertificateNum",
        name: "毕业证书编号：",
        value: "",
        type: "number",
        placeholder: "请输入",
        issshow: true,
        selectShow: false,
    },
    {
        id: "graduationCertificateDate",
        name: "取得学历证书时间",
        title: "取得学历证书时间：",
        value: "",
        type: "date",
        issshow: true,
        selectShow: false,
        placeholder: "请选择",
    },
    {
        id: "graduationCertificateUrl",
        name: "毕业证书：",
        title: "毕业证书",
        issshow: true,
        value: "",
        type: "file",
        selectShow: false,
        placeholder: "请选择",
    },
    {
        id: "isGetDiploma",
        name: "获得学位证书: ",
        issshow: true,
        value: '',
        type: "switch",
        placeholder: "请选择",
        switchChange: function (e, index) {
            hiddenFiled(teaExperience, index, index + 6 , e);
        }
    },
    {
        id: "degreeType",
        name: "学位类型: ",
        title: "学位类型",
        issshow: true,
        value: '',
        type: "picker",
        selectShow: false,
        opt_type:"degreeType",
        placeholder: "请选择",
        option: []
    },
    {
        id: "degree",
        name: "最高学位: ",
        title: "最高学位",
        issshow: true,
        value: '',
        selectShow: false,
        type: "picker",
        opt_type:"degree",
        placeholder: "请选择",
        option: []
    },
    {
        id: "diplomaNum",
        name: "最高学位证书编号：",
        title: "最高学位证书编号",
        value: "",
        issshow: true,
        selectShow: false,
        type: "text",
        placeholder: "请输入",
        option: []
    },
    {
        id: "diplomaDate",
        name: "取得最高学位证书时间：",
        value: "",
        issshow: true,
        selectShow: false,
        type: "date",
        placeholder: "请选择"
    },
    {
        id: "degreeGraduationSchool",
        name: "获得最高学位学校：",
        title: "获得最高学位学校",
        value: "",
        issshow: true,
        selectShow: false,
        opt_type: "school",
        type: "picker",
        placeholder: "请选择",
        opinion: []
    },
    {
        id: "diplomaUrl",
        name: "学位证书：",
        issshow: true,
        value: "",
        maxlength: 20,
        type: "file",
        placeholder: "上传证书",
    },
];
/**
 * 奖励情况
 */
export const rewards = [
    {
        id: "rewardDate",
        name: "时间：",
        required: true,
        value: "",
        issshow:true,
        type: "date",
        selectShow: false,
        placeholder: "请输入",
        option: [],
        key: ""
      },
      {
        id: "rewardType",
        name: "获奖类型",
        value: "",
        type: "text",
        required: true,
        issshow:true,
        selectShow: false,
        placeholder: "请选择",
      },
      {
        id: "rewardInstitution",
        name: "奖励机构",
        value: "",
        selectShow: false,
        required: true,
        type: "text",
        issshow:true,
        placeholder: "请选择"
      },
      {
        id: "rewardContent",
        name: "获奖内容",
        value: "",
        issshow:true,
        required: true,
        selectShow: false,
        placeholder: "请输入",
        type: "autosize",
      },
     
]
/**
 * 
 * 惩罚情况 
 */
export const punishment = [
    {
        id: "punishmentDate",
        name: "时间：",
        required: true,
        value: "",
        type: "date",
        issshow:true,
        selectShow: false,
        placeholder: "请输入",
        option: [],
        key: ""
      },
      {
        id: "punishmentType",
        name: "惩罚类型",
        value: "",
        type: "text",
        required: true,
        issshow:true,
        selectShow: false,
        placeholder: "请选择",
      },
      {
        id: "punishmentInstitution",
        name: "惩罚机构",
        value: "",
        selectShow: false,
        required: true,
        type: "text",
        issshow:true,
        placeholder: "请选择"
      },
      {
        id: "punishmentReason",
        name: "惩罚原因",
        value: "",
        issshow:true,
        required: true,
        selectShow: false,
        placeholder: "请输入",
        type: "autosize",
      },
      {
        id: "punishmentContent",
        name: "惩罚内容",
        value: "",
        issshow:true,
        required: true,
        selectShow: false,
        placeholder: "请输入",
        type: "autosize",
      },
]

const hiddenFiled = function (that, start, end,flag) {
    for (let i = start; i++, i <= end;) {
        that[i].issshow = flag;
    }
}