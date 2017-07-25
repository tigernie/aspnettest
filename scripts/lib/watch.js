/// <reference path="../common.js" />

(function (base) {
    watch = {
        getEsList: function (success) {
            return base('GetExamSessionList', {}, success);
        },
        getEsInfo: function (esid, success) {
            return base('GetSessionInfo', { esid: esid }, success);
        },
        updateInfo: function (esid, classId, success) {
            return base('GetExamSessionInfo', { esid: esid, classId: classId }, success);
        },
        delay: function (asid, minute, success) {
            return base('DelayStudent', { asid: asid, second: minute }, success);
        },
        delayAll: function (esid, minute, success) {
            return base('DelaySession', { esid: esid, minute: minute }, success);
        },
        warn: function (asid,cancel, success) {
            return base('Warning', { asid: asid,cancel:cancel }, success);
        },
        change: function (asid, success) {
            return base('ChangeMachine', { asid: asid }, success);
        },
        handIn: function (asid, success) {
            return base('HandIn', { asid: asid }, success);
        },
        handInAll: function (success) {
            return base('HandInAll', {}, success);
        },
        forbid: function (asid, success) {
            return base('Forbid', { asid: asid }, success);
        },
        getOne: function (asid, success) {
            return base('GetStudentsSubmitInfo', { answerSheetId: asid }, success);
        },
        clearState: function (userId, success) {
            return base('ClearStudentLoginState', { studentUserId: userId }, success);
        },
        getAllTeachers: function (exid,success) {
            return base('GetAllTeachers', {examId:exid}, success);
        },
        saveMonitors: function (exid,monitorIds, success) {
            return base('SetMonitors', { examId: exid, monitorIds: monitorIds }, success);
        },
        openClassExam: function (esid, classId, success) {
            return base('OpenClassExam', { examSessionId: esid, classId: classId }, success);
        },
        reOpenExam: function (asid, success) {
            return base('ReOpenExam', { asid: asid, }, success);
        }
        
    }
})(function (method, data, callback) {
    return jQuery.service('watch.asmx/' + method, data, callback);
});