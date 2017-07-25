/// <reference path="../common.js" />

var user = { name: "", id: 0, access: "" };

(function (base) {
    student = {
        logining: false,
        login: function (uname, upass, success,idCard) {
            this.logining = true;
            return base('StudentLogin', { name: uname, password: upass, idCard: idCard }, success);
        },
        logout: function (success) {
            return base('Logout', { }, success);
        },
        getMyInfo: function (init) {
            return base('GetInfo', init);
        }
    };
})(function (method, data, callback) {
    return jQuery.service('user.asmx/' + method, data, callback);
});