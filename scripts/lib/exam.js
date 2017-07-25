/// <reference path="../common.js" />

(function (base) {
    exam = {
        getMyInfo: function (success) {
            return base('GetMyInfo', success);
        },
        getExamList: function (success) {
            return base('GetExamList', { }, success);
        },
        enterExam: function (esid, success) {
            return base('EnterExam', { esid: esid }, success);
        },
        startExam: function (success) {
            return base('StartExam', success);
        },
        getProblem: function (pid, success) {
            return base('GetProblem', { index: pid + 1 }, success);
        },
        getLeftTime: function (success) {
            return base('GetLeftTime', success);
        },
        keepState: function (success) {
            return base('KeepState', success);
        },
        submit: function (index, answer, success) {
            return base('Submit', { index: index+1, answer: answer }, success);
        },
        handIn: function (isManul, success) {
            return base('HandIn', { isManul: isManul }, success);
        },
        getAllowSubmitEndTime: function (exid, success) {
            return base('GetAllowSubmitEndTime', { exid: exid }, success);
        },
        setAllowSubmitState: function (exid, endTime, success) {
            return base('SetAllowSubmitState', { exid: exid, submitEndTime: endTime }, success);
        },
        savefile: './attachment.save.ashx',
        getfile: './attachment.get.ashx'
    }
})(function (method, data, callback) {
    return jQuery.service('exam.asmx/' + method, data, callback);
});
