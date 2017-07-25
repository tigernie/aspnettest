/// <reference path="../jquery-1.7.min.js" />
/// <reference path="../common.js" />

(function (base) {
    judge = {
        getJudgers: function (exid, jtype, success) {
            return base('GetSelectingJudger', { exid: exid, jtype: jtype }, success);
        },
        setJudgers: function (exid, tids, jtype, success) {
            return base('SetJudger', { exid: exid, tids: tids, jtype: jtype }, success);
        },
        reJudge: function (examId, success) {
            return base('Rejudge', { examId:examId}, success);
        }
    }
})(function (method, data, callback) {
    return jQuery.service('judge.asmx/' + method, data, callback);
});
