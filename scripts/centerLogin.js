/// <reference path="PopWindow/gzy.popup.js" />
/// <reference path="common.js" />
/// <reference path="md5.js" />


var centerLoginWin;
function centerLogin() {
    var htmlStr = '';
    htmlStr += '<div style=" width:100%;">';
    htmlStr += '<table class="list" style=" width:100%;">';
    htmlStr += '<thead><th colspan="4" style="text-align:center">中心端身份验证</th></thead>';
    htmlStr += '<tbody><tr><td>用户名：</td><td><input type="text" id="username" /></td></tr>';
    htmlStr += '<tr><td>密码：</td><td><input type="password" class="loginpsw" id="password" /></td></tr>';
    htmlStr += '</tbody></table><div style="width:100%;text-align:center"><button class="blue" onclick="login()">登录</button></div>';
    htmlStr += "</div>";


    centerLoginWin = new gzy.popup(null, 260, 140, {
        html: htmlStr,
    });

}

function login() {
    var username = $('#username').val();
    var password = security.md5($('#password').val());
    if (username == '')
        alert('请填空用户名');
    else {
        var loading = showLoding('正在验证，请稍候');
        $.post("../centerExamview.ashx", { "method": "login", "username": username, "password": password },
                 function (data) {
                     loading.close();
                     //alert(data);
                     if (data.result == "ok") {
                         alert('身份验证成功!');
                         teacher.getMyInfo();
                         location.replace('/exammgr.aspx');
                     }
                     else
                         alert('身份验证失败!\n失败原因：' + data.msg);
                 }, "json");
    }
}


$(function () {
    centerLogin();

});

