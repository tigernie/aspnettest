/// <reference path="../common.js" />

(function (base) {
    center = {
        //获取考试信息预览
        getExamPreview: function (exid, callback) { return base('GetExamPreview', { exid: exid }, callback) },
        //获取考试列表
        getExamList: function (params, callback) { return base('GetExamList', params, callback) },
        //获取考试基本信息
        getBaseinfo: function (exid, callback) { return base('GetBaseinfo', { exid: exid }, callback) },
        //保存考试基本信息
        saveBaseinfo: function (entity, callback) { return base('SaveBaseinfo', { entity: entity }, callback) },
        //获取考卷方案/试卷列表
        getParamList: function (params, callback) { return base('GetPaperParamList', params, callback) },
        //删除考试
        deleteExam: function (exid, callback) { return base('DeleteExam', { exid: exid }, callback) },

        //获取考务数据包
        getDataList: function (params, callback) { return base('GetDataList', params, callback) },
        //删除考务数据包
        deletePackage: function (params, callback) { return base('DeletePackage', params, callback) },
        //重新开放考场
        reopenExamRoom: function (params, callback) { return base('ReopenExamRoom', params, callback) },
        //设置开放下载时间
        setPackageDownLoadTime: function (values, callback) { return base('SetPackageDownLoadTime', values, callback); },
        //设置开放上传时间
        setPackageUpLoadTime: function (values, callback) { return base('SetPackageUpLoadTime', values, callback); },
        //获取开放下载时间
        getPackageDownLoadTime: function (params, callback) { return base('GetPackageDownLoadTime', params, callback); },
        //生成所有考务数据包
        generateExamAllPackages: function (params, callback) { return base('GenerateExamAllPackages', params, callback); },
        //生成单个考务数据包
        generateRoomPackages: function (params, callback) { return base('GenerateRoomPackages', params, callback); },
        //获取结果数据包
        getResultList: function (params, callback) { return base('GetResultList', params, callback) },
        //导入所有结果包
        importResultPackages: function (params, callback) { return base('ImportAllResltPackages', params, callback) },
        //导入单个结果包
        importRoomPackage: function (params, callback) { return base('ImportRoomPackage', params, callback) },
        //区域的数据
        getAreas: function (params, callback) { return base('GetExSchoolTree', params, callback) },

        //获取考试日志
        getExamLog: function (params, callback) { return base('GetExamLog', params, callback) },

        //
        //导出管理员
        exportAdmins: function (params, callback) { return base('exportAdmins', params, callback) },
        //导出所有考点的考场管理员、监考及学生帐号信息
        exportAllExamInfo: function (params, callback) { return base('exportAllExamInfo', params, callback) },

        //导出所有考试密码
        exportAllExamPassword: function (params, callback) { return base('ExportAllExamPassword', params, callback) },


        //考生统计树:模块0
        getStudentTree: base.call('GetStudentTree'),
        //考点统计树:模块1
        getExSchoolTree: base.call('GetExSchoolTree'),
        //绑定统计树:模块3
        getBinderTree: base.call('GetBinderTree'),
        //编排统计树:模块5
        getRoomsetTree: base.call('GetRoomsetTree'),



        //区域的数据接口
        getAreaTree: base.call('GetAreaTree'),
        //学校区域的数据接口
        getSchoolTree: base.call('GetSchoolTree'),
        //获取某学校的考生列表
        getStudents: function (params, callback) { return base('GetStudents', params, callback) },
        //删除考生
        deleteExaminee: function (exid, ids, callback) { return base('DeleteExaminee', { exid: exid, ids: ids }, callback) },
        //清除一个学校的考生
        clearExaminee: function (exid, schoolId, callback) { return base('ClearExaminee', { exid: exid, schoolId: schoolId }, callback) },
        //获取某学校的班级列表
        getClasses: function (schoolId, callback) { return base('GetClassList', { schoolId: schoolId }, callback) },
        //获取某学校的考场
        getExRoomList: function (params, callback) { return base('GetExRoomList', params, callback) },
        //未添加为考点的学校
        getUnusedSchool: function (area, exid, callback) { return base('GetUnusedSchool', { id: area, exid: exid }, callback) },

        //获取考点列表
        getExSchoolList: function (params, callback) { return base('GetExSchoolList', params, callback) },
        //保存考点信息
        saveExSchool: function (params, callback) { return base('CreateExSchool', params, callback) },
        //修改考点信息
        updateExSchool: function (params, callback) { return base('UpdateExSchool', { entity: params }, callback) },
        //删除考点
        deleteExschool: function (ids, callback) { return base('DeleteExschool', { ids: ids }, callback) },

        //获取考生考点绑定列表
        getBinderList: function (params, callback) { return base('GetBinderList', params, callback) },
        //绑定考生到考点
        bindToSchool: function (params, callback) { return base('BindToSchool', params, callback) },
        //未绑定的考生
        getUnbindExaminee: function (exid, area, callback) { return base('GetUnbindExaminee', { exid: exid, area: area }, callback) },
        //自动绑定本考点的考生
        autoBind: function (exid, callback) { return base('AutoBind', { exid: exid }, callback) },
        exportAuditInfo: function (exid, callback) { return base('exportAuditInfo', { exid: exid }, callback) },
        //获取场次时间
        getExTimeset: function (params, callback) { return base('GetExTimeset', params, callback) },
        //保存场次时间
        saveExTimeset: function (exid, params, callback) { return base('SaveExTimeset', { exid: exid, timeset: params }, callback) },
        //删除场次时间
        deleteExTimeset: function (etid, callback) { return base('DeleteExTimeset', { etid: etid }, callback) },
        //快速添加场次时间
        quickAddTimeSet: function (exid, params, callback) { return base('QuickAddTimeSet', { exid: exid, timeset: params }, callback) },

        //考生自动编排
        autoArrange: function (params, callback) { return base('AutoArrangeStudents', params, callback) },
        //获取考生场次编排
        getExRoomset: function (params, callback) { return base('GetExRoomset', params, callback) },
        //获取学校的学生编排
        getSchoolset: function (params, callback) { return base('GetSchoolset', params, callback) },

        //获取考务安排
        getSchedules: function (params, callback) { return base('GetScheduleList', params, callback) },

        //改变考试状态
        changeExState: function (exid, callback) { return base('ChangeExState', { exid: exid }, callback) },

        //综合信息
        getOverViewInfo: function (exid, callback) { return base('GetOverViewInfo', { examId: exid }, callback) },
        getStuExamInfo: function (params, callback) { return base('GetStuExamInfo', params, callback) },
        getExamCenters: function (params, callback) { return base('GetExamCenters', params, callback) },
        exportStuExamInfo: function (examId, examCenterId, onlyAbsent, keyWords, examState, handInState, callback) { return base('ExportStuExamInfo', { examId: examId, examCenterId: examCenterId, onlyAbsent: onlyAbsent, keyWords: keyWords, examState: examState, handInState: handInState }, callback) },

        //获取考试管理员
        getExamAdmins: function (exid, callback) { return base('GetExamAdmins', { examId: exid }, callback) },
        //设置考试管员
        setExamAdmins: function (exid, userIds, callback) { return base('SetExamAdmins', { examId: exid, userIdsString: userIds }, callback) },
        //发送考点考务信息
        sendExamInfo: function (params, callback) { return base('sendExamInfo', params, callback) },

        sendStudentCards: function (params, callback) { return base('SendStudentTestCards', params, callback) },
        getOrgSubmitInfo: function (params, callback) { return base('GetOrgSubmitInfo', params, callback) },
        getSubScoreSubmitInfo: function (params, callback) { return base('GetSubScoreSubmitInfo', params, callback) },
        
        auditOrgSubmit: function (id, pass, callback) { return base('AuditOrgSubmit', { id: id, pass: pass }, callback) }
    


    }
})(function (method, data, callback) {
    return jQuery.service.call(this, 'center.asmx/' + method, data, callback);
});