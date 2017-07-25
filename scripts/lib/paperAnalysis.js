/// <reference path="../jquery-1.7.min.js" />
/// <reference path="../common.js" />

(function (base) {
    paperAnalysis = {
        getPaperDifficulties: function (params, success) {
            return base('GetPaperDifficulties', params, success);
        },
        //GetSchoolStandardDeviation
        getSchoolScoreInfo: function (params, success) {
            return base('GetSchoolStandardDeviation', params, success);
        },
        getSchoolRank: function (params, success) {
            return base('GetSchoolRank', params, success);
        },
        getScoreDistribution: function (exid, schoolid, success) {
            return base('GetScoreDistribution', { examId: exid, schoolId: schoolid }, success);
        },
        getPaperProblemDifficulty: function (params, success) {
            return base('GetPaperProblemDifficulty', params, success);
        },
        getExamKP: function (params, success) {
            return base('GetExamKp', params, success);
        },
        getTopTenSchools: function (exid, success) {
            return base('GetTopTenSchools', { examId: exid }, success)
        },
        getAdminType: function (exid, success) {
            return base('GetAdminType', { examId: exid }, success)
        },
        exportExamAnalysis: function (exid, callback) { return base('ExportExamAnalysis', { examId: exid }, callback) }

    }
})(function (method, data, callback) {
    return jQuery.service('paperAnalysis.asmx/' + method, data, callback);
});