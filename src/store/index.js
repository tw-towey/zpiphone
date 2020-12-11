import Vue from "vue";
import Vuex from "vuex";
import { deanModules,teachingsecretaryModules,baseModules,subjectModules,departmentModules,teacherModules,mentorModules,tutorModules,studentModules,childModule} from "./menu.js"
Vue.use(Vuex);
const index = new Vuex.Store({
    state: {
        schedulingId:"",
        personInfo:{},
        scheduling:{},
        auditFlag:"",
        test:"",//心理测评信息
        schedulings:"",
        timestamp: "",
        isBack:false,
        loading: false,
        firstLoad: 0,
        showError: false,
        currentDepartment: {},
        activityIsShowSelect:false,
        activityParams:{},
        secretKey: "MVW@38=cttms50+*",
        //当前轮转时间
        currentRotationTime: {
            startTime: "",
            endTime: ""
        },
        AssessParams: {},
        roleList: [
            { "key": "dean", "value": "院长" },
            { "key": "base", "value": "住培管理员" },
            { "key": "subject", "value": "专业基地管理员" },
            { "key": "department", "value": "科室管理员" },
            { "key": "teachingsecretary", "value": "教学秘书" },
            { "key": "teacher", "value": "带教老师" },
            { "key": "mentor", "value": "师承导师" },
            // { 'key': 'tutor', 'value': '责任导师' },
            { "key": "student", "value": "住培生" },
        ],
        deanModules,
        baseModules,
        teachingsecretaryModules,
        subjectModules,
        departmentModules,
        teacherModules,
        mentorModules,
        tutorModules,
        studentModules,
        childModule,
        jumpAdress: {
            360: null,
            new360: null,
            skillsTest:null
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
            { key: 21, value: "指导记录" },
            { key: 27, value: "诊断报告" },
            { key: 28, value: "健康档案" },
            { key: 29, value: "健康教育" },
        ],
        twoLevelType: [
            { "key": 1, "value": "大病历" },
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
            { "key": 23, "value": "住院志" },
            { "key": 27, "value": "诊断报告" },
            { "key": 28, "value": "健康档案" },
            { "key": 29, "value": "健康教育" },
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
            { 'key': '3700', 'value': '重症医学科' },
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
            { "key": "3600", "value": "中医全科" }
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
        activitiesType: [],//活动类别],
        activitiesRank: [ //活动级别
            { "key": 1, "value": "全院" },
            { "key": 2, "value": "专业基地" },
            { "key": 3, "value": "科室" },
        ],
        extramural: [ //主讲人类型
            { "key": 0, "value": "院内" },
            { "key": 1, "value": "院外" }
        ],
        noteType: [
            { "key": 0, "value": "跟师心得体会" },
            { "key": 1, "value": "学习中医典籍体会" },
            { "key": 3, "value": "跟师总结" },
            { "key": 2, "value": "其它" },
        ],
        Training: [
            { "key": 0, "value": "不参与计算" },
            { "key": 1, "value": "参与病种计算" },
            { "key": 2, "value": "参与技能计算" },
            { "key": 3, "value": "参与手术计算" },
        ],
        Entity: [
            { "key": 1, "value": "慢性心力衰竭" },
            { "key": 2, "value": "高血压" },
            { "key": 3, "value": "心肌炎与心肌病" },
            { "key": 4, "value": "血脂异常" },
            { "key": 5, "value": "常见心脏病急症的诊断与处理" },
            { "key": 6, "value": "常见心律失常" },
            { "key": 7, "value": "心脏瓣膜病" },
            { "key": 8, "value": "冠心病，心绞痛" },
            { "key": 9, "value": "急性心肌梗死" },
        ],
        Andculture: [
            { "key": 1, "value": 2016 },
            { "key": 2, "value": 2017 },
            { "key": 3, "value": 2018 },
            { "key": 4, "value": 2019 },
        ],
        ObjectAccept: [
            { "key": 1, "value": "全院" },
            { "key": 2, "value": "指定专业" },
            { "key": 3, "value": "指定科室" },
        ],
        singUp: [
            { "key": 1, "value": "是" },
            { "key": 0, "value": "否" },
        ],
        isLimit: [
            { "key": 1, "value": "有" },
            { "key": 0, "value": "无" },
        ],
        tabTypeCodeList: [
            { 'key': '1_IdType', 'value': '本单位人' },
            { 'key': '2_IdType', 'value': '社会人' },
            { 'key': '4_IdType', 'value': '委培人员' },
            { 'key': '5_IdType', 'value': '并轨专硕' }
        ],
        seeQRcode: "http://www.imed.org.cn/chan.html",
        pageSize: 10,
        tabFlag: true,
        tabActive: 0,
        teacherTime1: null,
        teacherTime2: null,
        activitiesDetailsObj: null,
        wonload: false,
        institutionId: '',
        bzName:"",
        ruleData: null,
        institutionstatus: {
            institutions: null,
            roules: null,
        },
        keyBoardCode: 0, // 默认软键盘收起 -- 0 收起 1弹出
        informationSelect: { // 学员信息所属科室
            value: '',
            text: ''
        }
    },
    mutations: {
        showLoading(state) {
            state.loading = true;
        },
        hideLoading(state) {
            state.loading = false;
        }
    },
    outDepartment: '' // 距离出科天数
});
export default index;