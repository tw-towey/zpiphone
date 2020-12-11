export const deanModules = [{ // 院长
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
    ]
 },
 {
    title: '智能填报',
    columns:[
        {
            type: "inside",
            name: "问卷调查",
            icon: "pictp_26",
            path: "survey"
        },

    ]
}
];
export const baseModules = [{ // 住培管理员
    title: "过程管理",
    columns: [
      {
        type: "inside",
        name: "学习情况",
        icon: "pictp_30",
        path: "EntryStudySituation"
      },
      {
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
    }
    ]
 },
 {
    title: '智能填报',
    columns:[
        {
            type: "inside",
            name: "问卷调查",
            icon: "pictp_26",
            path: "survey"
        },

    ]
}
]
export const subjectModules = [{ // 专业基地管理员
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
        type: "inside",
        name: "活动管理",
        icon: "pictp_07",
        path: "PublishingActivities"
    },
    ]
},
{
    title: '智能填报',
    columns:[
        {
            type: "inside",
            name: "问卷调查",
            icon: "pictp_26",
            path: "survey"
        },
        {
            type: "inside",
            name: "问卷审批",
            icon: "pictp_27",
            path: "review"
        },

    ]
}

]
export const departmentModules = [{ // 科室管理员
    title: "过程管理",
    columns: [
      {
        type: "inside",
        name: "学习情况",
        icon: "pictp_30",
        path: "EntryStudySituation"
      },
    {
        type: "inside",
        name: "入科登记",
        icon: "pictp_01",
        path: "EntryRegister"
    },
    {
        type: "inside",
        // type: "build",
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
        name: "考务管理",
        icon: "pictp_32",
        path: "ExamStudentList"
    },
    {
        type: "inside",
        name: "活动管理",
        icon: "pictp_07",
        path: "ActivityManage"
    },
    {
        type: "inside",
        name: "学员信息",
        icon: "pictp_24",
        path: "information"
    }
    ]
},
{
    title: '智能填报',
    columns:[
        {
            type: "inside",
            name: "问卷调查",
            icon: "pictp_26",
            path: "survey"
        },

    ]
}
]
export const teachingsecretaryModules = [{ // 科室管理员
    title: "过程管理",
    columns: [{
        type: "inside",
        name: "入科登记",
        icon: "pictp_01",
        path: "EntryRegister"
    },
    {
        type: "inside",
        // type: "build",
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
        name: "考务管理",
        icon: "pictp_28",
        path: "ExamStudentList"
    },
    {
        type: "inside",
        name: "活动管理",
        icon: "pictp_07",
        path: "ActivityManage"
    },
    {
        type: "inside",
        name: "学员信息",
        icon: "pictp_24",
        path: "information"
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
    title: '智能填报',
    columns:[
        {
            type: "inside",
            name: "问卷调查",
            icon: "pictp_26",
            path: "survey"
        },

    ]
}
]
export const teacherModules = [ // 带教老师
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
        // {
        //     type: "inside",
        //     name: "签到审核",
        //     icon: "pictp_15",
        //     path: "SignInToReview"
        // },
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
            type: "inside",
            name: "考务管理",
            icon: "pictp_32",
            path: "ExamStudentList"
        },
        {
            // type: "inside",
            type: "inside",
            name: "活动管理",
            icon: "pictp_07",
            path: "ActivityManage"
        },
        ]
    },
    {
        title: '智能填报',
        columns:[
            {
                type: "inside",
                name: "问卷调查",
                icon: "pictp_26",
                path: "survey"
            },
            {
                type: "inside",
                name: "问卷审批",
                icon: "pictp_27",
                path: "review"
            },
        ]
    }
]
export const mentorModules = [{ // 师承导师
    title: "师承管理",
    columns: [{
        type: "inside",
        name: "学员信息",
        icon: "pictp_20",
        path: "StudentInformation"
    },
    {
        type: "inside",
        name: "跟师考勤",
        icon: "pictp_23",
        path: "WithTeacherAttendance"
    },
    {
        type: "inside",
        name: "医案审核",
        icon: "pictp_21",
        path: "MedicalReview"
    },
    {
        type: "inside",
        name: "跟师心得",
        icon: "pictp_22",
        path: "ExperienceReview"
    },
    ]
},
{
    title: '智能填报',
    columns:[
        {
            type: "inside",
            name: "问卷调查",
            icon: "pictp_26",
            path: "survey"
        },

    ]
}
]
export const tutorModules = [ // 责任导师
]
export const studentModules = [{ // 学生
    title: "过程管理",
    columns: [
    {
      type: "inside",
      name: "入科学习",
      icon: "pictp_28",
      path: "EntryStudy"
    },
      {
        type: "inside",
        name: "学习记录",
        icon: "pictp_29",
        path: "EntryStudyRecord"
      },
    {
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
        type: "inside",
        name: "技能考核",
        icon: "pictp_32",
        path: "ExamStudentList"
    },
    {
        // type: "inside",
        type: "inside",
        name: "活动管理",
        icon: "pictp_07",
        path: "PublishingActivities"
    },
    {
        // type: "inside",
        type: "inside",
        name: "申请带教",
        icon: "pictp_25",
        path: "stateTeaching"
    },
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
        type: "inside",
        name: "跟师心得",
        icon: "pictp_08",
        path: 'TcmMinute'
    }

    ]
},
{
    title: '智能填报',
    columns:[
        {
            type: "inside",
            name: "问卷调查",
            icon: "pictp_26",
            path: "survey"
        },

    ]
}

]
export const childModule = {
    title: '形成性评价',
    columns: [
        {
            type: "external",
            name: "360评估",
            icon: "pictp_09",
            path: "360"
        },
        {
            type: "Mini-cex",
            name: "Mini-cex/Dops",
            icon: "Mini-CEXDOPS",
            path: "Mini_cex"
        },
        {
            type: "skillsTest",
            name: "技能评分",
            icon: "pic_zp-200617",
            path: "skillsTest"
        },
        {
            type: "new360",
            name: "360(4.0)",
            icon: "new360",
            path: "new360"
        },
    ]
}
