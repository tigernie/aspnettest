/// <reference path="../jquery-1.7.min.js" />
/// <reference path="teacher.js" />
/// <reference path="student.js" />

$.readyH(function (h, x) {
    /// <param name="h" type="HashManager"></param>
    var uname = $('#uname').focus(),
        upass = $('#upass'),
        restore = $('#restore'),
        center = $('#center'),
        centerUrl = $('#centerUrlBox');

    $('form.tl').bind('submit', function () {
        if (restore.attr('checked') && !confirm('确定登录并切换到中心对接模式？')) return restore.attr('checked', false), false;
        return teacher.login(uname.val(), upass.val(), (restore[0].checked ? false : ($('#centerUrl').css('display') == 'none' ? false : center[0].checked)), restore[0].checked, centerUrl.val()), false;
    });

    $('#msg').fadeOut();

    if (QueryString('username')) {
        uname.val(QueryString('username'));
        upass.val(QueryString('password')).focus();
    }
});
