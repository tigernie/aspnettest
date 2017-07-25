/// <reference path="../common.js" />
/// <reference path="../common.js" />
/// <reference path="../jquery-1.7.1-vsdoc.js" />

var user = {
    $: function (index) {
        /// <summary>检查用户权限</summary>
        /// <param name="index" type="Number">权限序号</param>
        return user.access.charAt(index-1) === '1'
    }
};

(function (base) {
    teacher = {
        logining: false,
        login: function (uname, upass, center, restore, centerUrl) {
            debugger;
            if (center) {
                var loading = showLoding('正在验证访问权限，请稍候...');
                return $.post("centerExamview.ashx", { "method": "login", "username": uname, "password": upass, centerUrl: centerUrl }, function (data) {
                    loading.close();
                    if (data.result == "ok") location.replace('ExamMgr.aspx');
                    else if (data.result == "-redirect")
                    {
                        if (confirm('考点管理员需要在中心网站登录，您是否立即前往中心登录？'))
                            location.replace(data.msg + '?username=' + uname + '&password=' + upass);
                        else
                            $('#msg').fadeIn(100).text('验证失败：考点管理员请在中心网站登录').delay(3000).fadeOut('slow');
                    }
                    else
                        $('#msg').fadeIn(100).text('验证失败：' + data.msg).delay(3000).fadeOut('slow');
                }, "json");
            }
            this.logining = true;
            return base('TeacherLogin', { name: uname, password: upass, mode: restore ? 'restore' : 'normal' }, function (d) {
                teacher.logining = false;
                if (d.ok)
                    location.replace('/teacher.htm');
                else $('#msg').fadeIn(100).text(d.msg).delay(3000).fadeOut('slow');
            });
        },
        logout: function () {
            return base('Logout', { xx: '' }, function () {
                location = '/login.htm';
            });
        },
        getMyInfo: function (init) {
            $('a.exit').click(function () { if (this.href == 'javascript:;') { teacher.logout(); return false; } else return true; });
            $('a.setting').click(function () {
                if (user.userType == 'Teacher' || user.version >= 1)
                    location.replace('userplat/');
                return false;
            });
            return base('GetInfo', function (d) {
                if (!d.id) return teacher.logout();
                $.extend(user, d);
                if (user.school) $.gf('<label style="position:absolute;color:white;margin:6px 0 0 20px">{1}</label>',
                    location.pathname == '/teacher.htm' ? user.school : user.product).prependTo('div.body');
                $('a.user').text(user.realname);
                if (!user.$(28)) $('a.setting').remove();
                init && init();
            });
        },
        changePassword: function (passA, passB, success) {
            return base('ChangePassword', { passA: passA, passB: passB }, success);
        },
        checkPassWord: function (password, success) {
            return base('CheckPassWord', { password: password}, success);
        }
    };
})(function (method, data, callback) {
    return jQuery.service('user.asmx/' + method, data, callback);
});