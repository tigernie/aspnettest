service = {
    //获取用户登录状态
    getUserState: '../user.asmx/GetInfo',
    //获取用户列表(未分类)
    getUserList: '../user.asmx/GetUserList',
    //获取学生列表
    getStudentList: '../user.asmx/GetStudentList',
    //获取教师列表
    getTeacherList: '../user.asmx/GetTeacherList',
    //获取教师列表(无组织机构的)
    getInorganizedTeacherList: '../user.asmx/GetInorganizedTeacherList',
    //获取单个教师信息
    getUserInfo: '../user.asmx/GetUserInfo',
    getTeacherInfo: '../user.asmx/GetTeacherInfo',
    getStudentInfo: '../user.asmx/GetStudentInfo',
    //保存单个教师信息
    saveTeacherInfo: '../user.asmx/SaveUserInfo',
    //保存单个教师详细信息
    saveTeacherDetail: '../user.asmx/SaveTeacherDetail',
    //(批量)删除教师
    deleteTeachers: '../user.asmx/DeleteUser',
    //（批量）基本学生用户里的 删除学生
    DeleteStudentInfoFromSystem: '../user.asmx/DeleteStudentInfoFromSystem',
    //（批量）从班级管理中 删除学生
    DeleteStudentFromClass: '../user.asmx/DeleteStudentFromClass',
    //(批量)更改教师状态
    setTeacherStatus: '../user.asmx/SetTeacherStatus',
    //调入用户
    transferIn: '../user.asmx/TransferIn',
    //调出用户
    transferOut: '../user.asmx/TransferOut',
    //设置区域管理员
    setAreaAdmin: '../user.asmx/SetAreaAdmin',
    //获取有管理权限的机构列表
    getControldAreas: '../user.asmx/GetControldAreas',
    //获取机构管理员
    getOrgAdmins: '../user.asmx/GetOrgAdmins',
    //导入用户
    importUsers: '../importUsers.ashx',
    //清除学生用户
    clearStudents: '../user.asmx/ClearStudents',

    //学习简历
    getStudies: '../user.asmx/GetStudies',
    saveStudy: '../user.asmx/SaveStudy',
    deleteStudies: '../user.asmx/DeleteStudies',
    //工作简历
    getWorks: '../user.asmx/GetWorks',
    saveWork: '../user.asmx/SaveWork',
    deleteWorks: '../user.asmx/DeleteWorks',
    //学籍数据
    getXuejiList: '../user.asmx/GetXuejiList',
    saveXueji: '../user.asmx/SaveXueji',
    deleteXueji: '../user.asmx/DeleteXuejis',

    //获取组织机构目录树
    getOrganizeTree: '../user.asmx/GetOrganizeTree',
    //获取区域目录树
    getAreaTree: '../user.asmx/GetAreaTree',
    //获取混合区域树,需在d.data里传回子区域列表和机构列表
    getMixedAreaTree: '../user.asmx/GetMixedAreaTree',

    //获取组织机构列表
    getOrganizeList: '../user.asmx/GetOrganizeList',
    //保存学校信息
    saveSchoolInfo: '../user.asmx/SaveSchoolInfo',
    //保存机构信息
    saveOrganizeInfo: '../user.asmx/SaveOrganizeInfo',
    //获取学校信息
    getSchoolInfo: '../user.asmx/GetSchoolInfo',
    //获取机构信息
    getOrganizeInfo: '../user.asmx/GetOrganizeInfo',
    //删除组织机构
    deleteOrganize: '../user.asmx/DeleteOrganizeInfo',
    //设置管理员
    setAdministrator: '../user.asmx/SetOrganizeAdministrator',
    //获取分校校区列表
    getSchoolBranches: '../user.asmx/GetSchoolBranches',
    //获取学校年级列表
    getSchoolGrades: '../user.asmx/GetSchoolGrades',
    //获取内部部门列表
    getDepartmentsList: '../user.asmx/GetDepartmentsList',
    //获取班级列表
    getClassList: '../user.asmx/GetClassList',
    //获取班级列表, 用于学校版的班级管理
    getGradeAndClassList: '../user.asmx/GetGradeAndClassList',
    deleteGradeClass: '../user.asmx/DeleteGradeClass',
    saveGradeClass: '../user.asmx/SaveGradeClass',
    upgradeGradeClass: '../user.asmx/UpgradeGradeClass',
    //保存班级信息
    saveClassInfo: '../user.asmx/SaveClassInfo',
    //删除班级
    deleteClasses: '../user.asmx/DeleteClasses',
    //保存部门信息
    saveDepartmentInfo: '../user.asmx/SaveDepartmentInfo',
    deleteDepartments: '../user.asmx/DeleteDepartments',
    //保存分校校区信息
    saveSchoolBranche: '../user.asmx/SaveSchoolBranche',
    //删除分校校区
    deleteSchoolBranches: '../user.asmx/DeleteSchoolBranches',
    //保存年级信息
    saveSchoolGrade: '../user.asmx/SaveSchoolGrade',
    //删除年级
    deleteSchoolGrades: '../user.asmx/DeleteSchoolGrades',

    getGradesBySchoolId: '../user.asmx/GetGradesBySchoolId',

    //获取字典数据
    getDictionary: '../user.asmx/GetDictionary',

    //获取日志列表
    getLogList: '../system.asmx/GetLogList',
    //删除日志
    deleteLogs: '../system.asmx/DeleteLogs',
    //清空日志
    clearLogs: '../system.asmx/ClearLogs',

    //获取考场列表
    getRoomList: '../system.asmx/GetRoomList',
    //删除考场
    deleteRoom: '../system.asmx/DeleteRoom',
    //保存考场信息
    saveRoom: '../system.asmx/SaveRoom',

    //获取配置集
    getSettings: '../system.asmx/GetSettings',
    //保存配置集
    saveSettings: '../system.asmx/SaveSettings',
    //获取系统模式设置
    getModeSetting: '../system.asmx/GetModeSetting',
    //保存系统模式设置
    saveModeSetting: '../system.asmx/SaveModeSetting',
    //恢复上次使用的模式
    restoreMode: '../system.asmx/RestoreLastCenterExamMode',

    //获取角色列表
    getRoleList: '../user.asmx/GetRoleList',
    //保存角色
    saveRoleInfo: '../user.asmx/SaveRoleInfo',
    //保存用户角色
    saveUserRole: '../user.asmx/SaveUserRole',
    //获取用户角色
    getUserRole: '../user.asmx/GetUserRole',
    //删除角色
    deleteRole: '../user.asmx/DeleteRole',
    //获取权限列表
    getPermissionList: '../user.asmx/GetPermissionList',

    //保存备份设置
    saveBackupSetting: '../system.asmx/SaveBackupSetting',
    //获取备份设置
    getBackupSetting: '../system.asmx/GetBackupSetting',
    //执行手动备份
    doBackup: '../system.asmx/DoBackup',
    //获取备份档列表
    getBackupList: '../system.asmx/GetBackupList',
    //删除备份档
    deleteBackups: '../system.asmx/DeleteBackups',
    //从备份档恢复
    restoreBackup: '../system.asmx/RestoreBackup',
    logout: '../user.asmx/Logout',

    //获取基本学生信息列表
    GetStudentBaseInfo:'../user.asmx/GetStudentBaseInfo',
    //从系统中删除学生
    DeleteStudentInfoFromSystem:'../user.asmx/DeleteStudentInfoFromSystem',
    //学生异动
    ChangeStudentStatus:'../user.asmx/ChangeStudentStatus',

    //查询指定班级的学生
    getContainHistoryStudent:'../user.asmx/getContainHistoryStudent',
    FetchStudentFromClass:'../user.asmx/FetchStudentFromClass',
    FetchStudentFromStudentInfoLib:'../user.asmx/FetchStudentFromStudentInfoLib',
    DeleteStudentFromClass:'../user.asmx/DeleteStudentFromClass',
    CountStudentByClassID: '../user.asmx/CountStudentByClassID',

    //历届学生一览
    RetrieveContainHistoryStudent:'../user.asmx/RetrieveContainHistoryStudent',

    GetInfo: '../user.asmx/GetInfo',
    ResetPassword: '../user.asmx/ResetPassWord',
    SaveNote: '/system.asmx/SaveNote',
    GetNote: '/system.asmx/GetNote',
    //获取日志列表
    getNoteList: '../system.asmx/GetNoteList',
    //删除日志
    deleteNote: '../system.asmx/DeleteNotes',
    //清空日志
    topNote: '../system.asmx/TopNote'

};

//常量定义
constant = {
    usertype: {
        TEACHER: 2,
        STUDENT: 3,
        ALL: -1
    },
    message: {
        AJAX_FAILURE: '处理数据时发生了错误,请重试.<br/><br/>如果错误仍然出现,请联系那个管理员...'
    }
};

functionMap = {
    ext: '../extjs/',
    root: 'scripts/',
    items: [{
        text: '用户管理',
        cls: 'usermgr',
        id: 'modules-user',
        children: [
          /*{
            text: '所有用户',
            id: 'users',
            leaf: true
        },  //中心版和学校版屏蔽此功能 yyj 2012-9-24*/
         {
            text: '教师信息',
            id: 'users:teacher',
            leaf: true
         },
        //{
        //    text: '考生基本信息',
        //    id: 'student',
        //    leaf: true
        //}, 
        /*
        {
            text: '历届学生一览',
            id: 'studentall',
            leaf: true
        },
        */
        {
            text: '角色与权限',
            id: 'rolemgr',
            leaf: true
        }]
    }, {
        text: '组织机构管理',
        cls: 'organization',
        id: 'modules-orgs',
        children: [{
            text: '组织机构管理',
            id: 'organizations',
            leaf: true
        }]
    }, {
        text: '系统设置',
        cls: 'syssetting',
        id: 'modules-sys',
        children: [{
            text: '系统参数设置',
            id: 'settings',
            leaf: true
        }, {
            text: '考场管理',
            id: 'examroom',
            leaf: true
        }, {
            text: '系统模式设置',
            id: 'switchmode',
            leaf: true
        }, {
            text: '日志管理',
            id: 'logmgr',
            leaf: true
        }, {
            text: '数据备份管理',
            id: 'dbmgr',
            leaf: true
        }, {
            text: '添加公告',
            id: 'noteMgr',
            leaf: true
        },
        {
            text: '公告管理',
            id: 'addNewNote',
            leaf: true
        }
        ]
    }]
}