export default [

    /*---  中医师承 -- 中医师承 --住院医师 ----*/
    {
        path: "/TutorInformation",
        name: "TutorInformation", // 导师信息
        component: resolve => require(["@/view/TCMmentoring/TutorInformation"], resolve)
    },
    {
        path: "/TutorForDetails",
        name: "TutorForDetails", // 导师信息
        component: resolve => require(["@/view/TCMmentoring/TutorForDetails"], resolve)
    },
    {
        path: "/MentorApplication",
        name: "MentorApplication", // 导师申请
        component: resolve => require(["@/view/TCMmentoring/MentorApplication"], resolve)
    },
    {
        path: "/MentorSearch",
        name: "MentorSearch", // 导师姓名搜索
        component: resolve => require(["@/view/TCMmentoring/MentorSearch"], resolve)
    },
    {
        path: "/TeacherAttendance",
        name: "TeacherAttendance", // 跟师考勤
        component: resolve => require(["@/view/TCMmentoring/TeacherAttendance"], resolve)
    },
    {
        path: "/DoorNotes",
        name: "DoorNotes", // 跟师考勤
        component: resolve => require(["@/view/TCMmentoring/doorNotes"], resolve)
    },
    {
        path: "/ClinicConsilia",
        name: "ClinicConsilia", // 临床医案
        component: resolve => require(["@/view/TCMmentoring/ClinicConsilia"], resolve)
    },
    {
        path: "/BasisRecord",
        name: "BasisRecord", // 临床医案
        component: resolve => require(["@/view/TCMmentoring/BasisRecord"], resolve)
    },
    {
        path: "/BasisRecordLinst",
        name: "BasisRecordLinst", // 临床医案 申请中
        component: resolve => require(["@/view/TCMmentoring/BasisRecordLinst"], resolve)
    },
    {
        path: "/Notpass",
        name: "Notpass", // 医案记录
        component: resolve => require(["@/view/TCMmentoring/Notpass"], resolve)
    },
    {
        path: "/Consiliadetails",
        name: "Consiliadetails", // 医案记录 -- 通过
        component: resolve => require(["@/view/TCMmentoring/Consiliadetails"], resolve)
    },
    {
        path: "/QueryConsilia",
        name: "QueryConsilia", // 临床医案 -- 查询
        component: resolve => require(["@/view/TCMmentoring/QueryConsilia"], resolve)
    },
    {
        path: "/TcmMinute",
        name: "TcmMinute", // 跟师心得
        component: resolve => require(["@/view/TCMmentoring/TcmMinute"], resolve)
    },
    {
        path: "/AddNotebook",
        name: "AddNotebook", // 跟师心得 -- 新增
        component: resolve => require(["@/view/TCMmentoring/AddNotebook"], resolve)
    },
    {
        path: "/TeacherSumup",
        name: "TeacherSumup", // 跟师心得 -- 新增
        component: resolve => require(["@/view/TCMmentoring/TeacherSumup"], resolve)
    },
    {
        path: "/Manuscript",
        name: "Manuscript", // 跟师心得 -- 草稿
        component: resolve => require(["@/view/TCMmentoring/Manuscript"], resolve)
    },

    /*---  中医师承 -- 师承导师   ----*/
    {
        path: "/StudentInformation",
        name: "StudentInformation", // 学员信息
        component: resolve => require(["@/view/MasterManagement/StudentInformation"], resolve)
    },
    {
        path: "/WithTeacherAttendance",
        name: "WithTeacherAttendance", // 学员信息
        component: resolve => require(["@/view/MasterManagement/WithTeacherAttendance"], resolve)
    },
    {
        path: "/MedicalReview",
        name: "MedicalReview", // 医案审核
        component: resolve => require(["@/view/MasterManagement/MedicalReview"], resolve)
    },
    {
        path: "/ExperienceReview",
        name: "ExperienceReview", // 心得审核
        component: resolve => require(["@/view/MasterManagement/ExperienceReview"], resolve)
    },
    {
        path: "/LearningExperience",
        name: "LearningExperience", // 学习中医典籍体会
        component: resolve => require(["@/view/MasterManagement/LearningExperience"], resolve)
    },
    {
        path: "/BasisRecordList",
        name: "BasisRecordList", // 学习中医典籍体会
        component: resolve => require(["@/view/MasterManagement/BasisRecord"], resolve)
    },
    {
        path: "/Entrymodel",
        name: "Entrymodel", // 学习中医典籍体会
        component: resolve => require(["@/view/entryregister/Entrymodel"], resolve)
    },
    {
        path: "/information",
        name: "information", // 科室管理员 学员信息
        component: resolve => require(["@/view/studentionIfor/information"], resolve)
    },
    {
        path: "/studentScreen",
        name: "studentScreen", // 科室管理员 学员信息筛选
        component: resolve => require(["@/view/studentionIfor/studentScreen"], resolve)
    },
    {
        path: "/ExamStudentList",
        name: "ExamStudentList", // 考务列表
        component: resolve => require(["@/view/examManagement/ExamStudentList"], resolve)
    },
    {
        path: "/ExamDetail",
        name: "ExamDetail", // 考务詳情
        component: resolve => require(["@/view/examManagement/ExamDetail"], resolve)
    },
    {
        path: "/Takeexam",
        name: "Takeexam", // 考务詳情
        component: resolve => require(["@/view/examManagement/Takeexam"], resolve)
    },
    {
        path: "/subAnswer",
        name: "subAnswer", // 考务詳情
        component: resolve => require(["@/view/singupQrCode/subAnswer"], resolve)
    },
]