/// <reference path="teacher.js" />
/// <reference path="../PopWindow/gzy.popup.js" />
/// <reference path="../common.js" />

$.readyH(function (h, x) {
    /// <param name="h" type="HashManager"></param>
    teacher.getMyInfo(function (d) {
        if (user.version == 1 && user.mode == "CenterVisitMode" && location.href.indexOf('teacher.htm') && user.userType=='Teacher')
            location.replace('/login.htm');

        if (user.userType == null || user.userType == 'Teacher' || user.userType == 'CompanyAdmin' || user.userType == 'OrgnizationAdmin' || user.userType == 'RandAccount' || QueryString('ignoreStu') == 'true') {
            if (user.version == 0 && user.mode == "") {
                $('a.t3').disable();
                if (user.userType == 'RandAccount') {
                    $('a.t6,a.t1,a.t4').disable().attr('href', 'javascript:;');
                    $('.setting').hide();
                }
            }
            $('a.t2').attr('href', user.version == 1 ? 'ExamMgr.aspx' : 'center.htm');
            if (user.version == 1 && user.mode != "SchoolMode" && user.mode != "0") {
                $('a.t1,a.t4,a.t6').addClass('disabled').attr('href', 'javascript:;');
                if (user.mode == "CenterTestMode") {
                    $('a.setting').hide();
                    if (user.randomType == '2')//考场管理员
                        $('a.t3').addClass('disabled').attr('href', 'javascript:;');
                    else if (user.randomType == '3') {//中心监考
                        $('a.t2').addClass('disabled').attr('href', 'javascript:;');
                       
                    }
                }
                else
                    $('a.t3').addClass('disabled').attr('href', 'javascript:;');
                if (user.mode == 'CenterVisitMode') {
                    $('.setting').hide();
                   
                }
            }
            if (user.userType == 'CompanyAdmin' || user.userType == 'OrgnizationAdmin') {
                $('a.t3').enable().removeClass('disabled').css('background-image', 'url(/images/t3_1.jpg)');
                $('a.t3 img').css('background-image', 'url(/images/t3_1.jpg)');
                if (user.code == '12000000') {
                    $('a.t3').attr('href', '/centerMgr.html');
                }
                else if (user.code == '55555555') {
                    $('a.t3').attr('href', '/examFeeMgr.html');
                }
                else if (user.userType == 'OrgnizationAdmin')
                    $('a.t3').attr('href', '/OrgMgr.html');
                else
                    $('a.t3').attr('href', '/CompanyMgr.html');
            }
            else {
                jQuery.service.call(this, 'watch.asmx/CheckWatchPermission', {}, function (result) {
                    if (!result.result)
                        $('a.t3').disable();
                });
            }

            if (!user.$(25)) $('a.t1').disable();
            if (!user.$(26)) $('a.t6').disable();
            if (!user.$(27)) $('a.t2').disable();
            if (!user.$(29)) $('a.t4').disable();
           

            $('div.board a:not(.disabled)')
                .bind('contextmenu', function () { return false })
                .focus(function () { this.blur() })
                .filter(function () { return this.className.indexOf(' g') == -1 })
                .hover(function () { $('img', this).fadeIn(200) }, function () { $('img', this).fadeOut(200) });
            $('div.board a.disabled')
                .click(function () { return false })
                .attr('href', 'javascript:;');

            if (user.mode != 'CenterVisitMode') {
                $('a.user').click(function () {
                    var form = new DataForm({
                        items: [{
                            key: 'password1', label: '现在的密码', type: 'password', nullable: false
                        }, {
                            key: 'password2', label: '新密码', type: 'password', nullable: false
                        }, {
                            key: 'password3', label: '重复新密码', type: 'password', nullable: false
                        }]
                    }), win = new gzy.popup('修改我的密码', 350, 150, {
                        element: form.form,
                        buttons: [{
                            text: '确定',
                            click: function () {
                                with (form.form.getValues()) {
                                    if (!$.trim(password1)) return alert('请输入原密码'), form.items.password1.el.focus();
                                    if (!$.trim(password2)) return alert('请输入新密码'), form.items.password2.el.focus();
                                    if (!$.trim(password3)) return alert('请重复输入新密码'), form.items.password3.el.focus();
                                    if (password2 !== password3) return alert('两次输入的新密码不一致，请重新输入。'), form.items.password3.el.select();

                                    teacher.changePassword(password1, password2, function (d) {
                                        if (d.ok) alert('密码修改成功'), win.close();
                                        else alert(d.msg);
                                    });
                                }
                            }
                        }]
                    });
                });
            }
        }
        else
            location.replace('/login.htm');
    }
        );
    $('div.board a img').fadeOut(0);
});
