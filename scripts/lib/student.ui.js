/// <reference path="../jquery-1.7.min.js" />
/// <reference path="student.js" />
/// <reference path="exam.js" />

$.readyH(function (h, x) {
    /// <param name="h" type="HashManager"></param>
    $('form.sl').bind('submit', function () {
        var me = this, uname = $.trim($('#uname').val()), upass = $.trim($('#upass').val()), idCard = $.trim($('#idCard').val());

        if ($('tr[loginType="2"]').css('display') == 'none' && (!uname || !upass)) return msg('姓名和考号不能为空');
        if ($('tr[loginType="1"]').css('display') == 'none' && (!idCard)) return msg('身份证号不能为空');

        var loading = showLoding('正在登录系统...');
        return student.login(uname, upass, function (d) {
            loading.close();
            if (d.ok) {
                exam.getExamList(displayExams);
                $('div>table').animate({ marginLeft: '-315px' }, function () {
                    me.reset();
                });
            } else {
                msg(d.msg);
            }
        }, idCard), false;
    });
    $('#msg').fadeOut();

    $('a.exit').click(function () {
        student.logout(function () {
            $('div>table').animate({ marginLeft: 0 });
        });
    });
    $('a.view').click(function () {
        new gzy.popup('查看成绩', 600, 400, { url: 'StudentResult.aspx' });
    });
    $('button').keydown(function (e) { return 9 !== e.keyCode });

    function msg(text) {
        $('#msg').fadeIn(100).text(text).delay(3000).fadeOut('slow');
    };
    function displayExams(d) {
        var ul = $('#exlist ul').empty().show(), nd = $('#exlist .null').hide();
        if (d.data.rows.length) {
            for (var i = 0, ex; ex = d.data.rows[i++];) {
                var text = '';
                if (ex.over)
                    text = '(已结束)';

                ul.append($(String.$('<li class="{type}"><a href="javascript:\/\/{id};" isover="' + (ex.over ? '1' : '0') + '">{name}' + text + '</a><br />{date} &nbsp; {time}</li>', ex)).click(function (e) {
                    if (e.target.tagName == 'A' && $(e.target).attr('isover') == '0')
                        enterExam(parseInt(e.target.href.split('\/\/')[1]));
                }));
            }
        } else {
            ul.hide();
            nd.show();
        }
    };
    function enterExam(esid) {
        exam.enterExam(esid, function (d) {
            cookie.set('ex_qid', null);
            cookie.set('ex_type', null);

            if (d.ok) location.replace('./exam.htm');
            else alert(d.msg);
        });
    };

    var loading = showLoding();
    student.getMyInfo(function (d) {
        loading.close();
        if (d.userType == null || d.userType == 'Student') {
            if (d.id) {
                $('div>table').fadeOut('fast').animate({ marginLeft: '-315px' }).fadeIn('fast');
                exam.getExamList(displayExams);
            }
            if (d.mode != 'SchoolMode') {
                $('#chaxun').remove();
            }
            if (d.mode == 'CenterTestMode') {
                $('#lb_name').text('考号：');
                $('#lb_pass').text('密码：');
                $('#upass').replaceWith('<input type="password" name="upass" id="upass"/>');
            }
        } else {
            location.replace('/teacher.htm');
        }
    });
});