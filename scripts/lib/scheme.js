/// <reference path="../common.js" />

(function (base) {
    scheme = {
        getSchemeList: function (params, success) {
            return base('GetSchemeList', params, success);
        },
        getPaperList:function (params, success) {
            return base('GetPaperList', params, success);
        },
        getScheme: function (id, success) {
            return base('GetScheme', { id: id }, success);
        },
        remove: function (type, id, success) {
            return base('DeleteItem', { type: type, id: id }, success);
        },
        update: function (param, data, success) {
            return base('UpdateScheme_' + ['PRO', 'NORMAL', 'QUICK'][param.type - 1], { param: param, data: data }, success);
        },
        createPaper: function (params, success) {
            return base('CreatePaper', params, success);
        }
    }
})(function (method, data, callback) {
    return jQuery.service('scheme.asmx/' + method, data, callback);
});




