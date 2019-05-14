export default [

    /*---  中医师承 -- 中医师承  ----*/
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
        path: "/ClinicConsilia",
        name: "ClinicConsilia", // 临床医案
        component: resolve => require(["@/view/TCMmentoring/ClinicConsilia"], resolve)
    },
    {
        path: "/BasisRecord",
        name: "BasisRecord", // 临床医案
        component: resolve => require(["@/view/TCMmentoring/BasisRecord"], resolve)
    },

]