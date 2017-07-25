/// <reference path="../common.js" />
(function (base) {
    usermgr = {
        getInfo: function () {
            return base('GetInfo', function (d) {
                if (d === null) location.replace('default.htm');
                else alert(d.userName);
            });
        },
        getList: function (params, grid) {
            /// <param name="grid" type="DataGrid"></param>
            return base('GetUserList', params, function (d) {
                grid.fill(d, params);
            });
        }
    };
})(function (method, data, callback) {
    return jQuery.service('user.asmx/' + method, data, callback);
});