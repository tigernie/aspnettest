/// <reference path="watch.js" />
/// <reference path="../jquery-1.7.min.js" />
/// <reference path="watch.js" />
/// <reference path="../TabSet/gzy.tabset.v3.js" />
/// <reference path="../Menu/gzy.menu.js" />

$.readyH(function (h, x) {
    /// <param name="h" type="HashManager"></param>
    teacher.getMyInfo(function () {
        var timer, interval = 5;
        if (!user.deny) $('.setting').remove();
        var _exname = $('#_exname'), _exstart = $('#_exstart'), _exend = $('#_exend'), _exleft = $('#_exleft'),
            _exclass = $('#_exclass'), _exall = $('#_exall'), _exreal = $('#_exreal'), _exdone = $('#_exdone'),
            _stlist = $('#_stlist'), _openBtn = $('#open');
        var wait = false;

        if (user.randomType == '3') {//中心监考
            $('a.setting').hide();
        }

        var tabs = new gzy.tabset('ul.mtabs li', 'div.mpanel', {
            defaultTab: x.tab || 0,
            changing: function (c) {
                if (c.index == 1) {
                    if (!x.es) {
                        alert('请选择要监考的考试');
                        return false;
                    }
                }
            },
            changed: function (c) {
                if (c.index == 0) {
                    clearTimeout(timer);
                    h.set({ es: null, c: null });
                }
                if (c.index == 1) {
                    var loading = showLoding('正在获取考场数据...');
                    watch.getEsInfo(x.es, function (d) {
                        displayInfo(d.data);
                        loading.close();
                    });
                }
                h.set({ tab: c.index });
            }
        });

        function displayInfo(watched) {
            _exname.text(watched.name);
            
            if (watched.classes.length) {
                if (user.mode != "SchoolMode") {
                    _exleft.text('--');
                    var s = $('<select></select>');
                    s.appendTo(_exclass.empty()).change(function () {
                    watched.classid = parseInt(this.value);
                    clearTimeout(timer);
                    update(x.es, parseInt(this.value));
                });

                    for (var i = 0, c; c = watched.classes[i++];) {
                        s[0].options.add(new Option(c.name, c.id));
                    }
                s.append(new Option('显示全部', -1));
                s.change();
                }
                else {
                    _exclass.empty();
                    for (var i = 0, c; c = watched.classes[i++];) {
                        _exclass.append('<span>'+c.name+'</span><br/>');
                    }
                    update(x.es, -1);
                }
                
            } else {
                update(x.es, -1);
            }

        }

        $('#_interval').click(function () {
            interval = $(this).find('input:checked').intVal();
        });
        
        new gzy.menu({
            target: '#delayAll',
            method: 'click'
        }, [{
            text: '全部延时 1 分钟',
            command: function (e) { watch.delayAll(x.es, 1, function (d) { if (d.ok) alert('延时成功'); else d.msg && alert(d.msg) }); }
        }, {
            text: '全部延时 3 分钟',
            command: function (e) { watch.delayAll(x.es, 3, function (d) { if (d.ok) alert('延时成功'); else d.msg && alert(d.msg) }); }
        }, {
            text: '全部延时 5 分钟',
            command: function (e) { watch.delayAll(x.es, 5, function (d) { if (d.ok) alert('延时成功'); else d.msg && alert(d.msg) }); }
        }]);

        function update(esid, classid) {
            var loading = showLoding();
            watch.updateInfo(esid, classid, function (d) {
                _exreal.text(d.data.examed); //更新实到人数
                _exdone.text(d.data.handed); //更新已交卷人数
                _exleft.text(d.data.left > 0 ? Math.floor(d.data.left / 60) + '分' + d.data.left % 60 + '秒' : '0:0'); //更新剩余时间
                _exstart.text(d.data.exstart); //开始时间
                _exend.text(d.data.exend); //结束时间
                _exall.text(d.data.count);
                if (d.data.exstart == '-' && user.mode != "SchoolMode") {
                    $('.openClassExam').show();
                    _openBtn.unbind('click').click(function () {
                        if(confirm('开启考试后，系统将对本班所有考生开始计时！\n您确定要开启考试吗？')){
                            watch.openClassExam(esid, classid, function (returnValue) {
                                if (returnValue.ok) {
                                    alert('开启成功！学生可以进入考试答题!');
                                    $('.openClassExam').hide();
                                }
                                else
                                    alert('开启失败!\n失败原因：' + returnValue.msg);
                            });
                        }
                    });
                }
                else {
                    $('.openClassExam').hide();
                }

                _stlist.empty();
                $.each(d.data.students, function (i, x) {
                    $.gf('<a title="单击查看{name}的详细信息" class="status_{status} online_{online} cheat_{cheat} delay_{delay}" href="javascript:;" ><i/><u>+{delay}</u><em/>{sn}<br>{name}</a>', x).data('d', x).appendTo($('<li/>').appendTo(_stlist));
                });
                loading.close();
            });
            timer = setTimeout(function () { update(esid, classid) }, interval * 1000);
        };

        $('.centerpanel').click(function (e) {
            var a = e.target;
            if (a.tagName == 'EM' || a.tagName == 'I' || a.tagName == 'U') a = a.parentNode;
            if (a.tagName == 'A') displayOne($(a).data('d'));
        });

        var view = null;
        function displayOne(data) {
            view = data;

            var buttons = [];
                    //{ text: '关闭', isCancel: true }
           
            if (data.status.toString().toLowerCase() == 'over' && !data.isManualHandin) {
                buttons.push({ text: '恢复考试', click: reExam, enable: true });
            }
            else {
                buttons = [
                  { text: view.cheat ? '取消警告' : '警告', click: view.cheat  ? disWarn : warn, enable: view.status == 'testing' || view.status == 'cheat' },
                  { text: '换机', click: change, enable: view.status == 'testing' || view.status == 'testpreparing' },
                  { text: '延时', id: 'btn_delay', enable: view.status == 'testing' || view.status == 'cheat' }];
            }
            buttons.push({ text: '关闭', isCancel: true });

            var p = new gzy.popup('查看考生信息', 400, 280, {
                buttons: buttons,
                cls: 'one_info',
                onclose: function () { view = null },
                onload: function () {
                    data._online = data.online ? '在线' : '离线';
                    data._status = {
                        unstart: '未登录',
                        testing: '正在答题中',
                        testpreparing: '准备进入答题',
                        over: '已交卷',
                        forbidden: '被禁考',
                        encrypted: '未开启'
                    }[data.status];
                    $.gf('<table border="0" cellspacing="1"><tbody>\
<tr><th>姓　　名：</th><td>{name}'+ getSexString(data.sex, data.sexString) + '</td><th>考　　号：</th><td>{sn}</td></tr>\
<tr><th>单　　位：</th><td colspan="3">{schoolName}</td></tr>\
<tr><th>座位号：</th><td>{index}</td><th>答题状态：</th><td>{_status}</td></tr>\
<tr><th>作弊警告：</th><td>{cheat?"是":"否"}</td><th>延　　时：</th><td>{delay?delay+"分钟":"未延时"}</td></tr>\
<tr><th>在线状态：</th><td>{_online}</td><th>登录地址：</th><td>{ip}</td></tr>\
<tr><th valign="top">答题情况<br>(已答/总数)</th><td colspan="3" valign="top" class="wd_list"></td></tr>\
</tbody></table>', data).appendTo(p.body);
                    watch.getOne(view.asid, function (d) {
                        var wd_list = p.body.find('.wd_list');
                        $.each(d.data, function (i, x) {
                            $.gf('<div>{name}<span>{indexes.length+"/"+total}</span></div>', x).appendTo(wd_list);
                        });
                    });
                }
            });
        };

        function getSexString(sex,sexString) {
            if (sex != 0)
                return "(" + sexString + ")";
            else
                return "";
        };



        new gzy.menu({
            target: '#btn_delay',
            method: 'click'
        }, [{
            text: '延时 1 分钟',
            command: function (e) { watch.delay(view.asid, 1, function (d) { if (d.ok) alert('延时成功'); else d.msg && alert(d.msg) }); }
        }, {
            text: '延时 3 分钟',
            command: function (e) { watch.delay(view.asid, 3, function (d) { if (d.ok) alert('延时成功'); else d.msg && alert(d.msg) }); }
        }, {
            text: '延时 5 分钟',
            command: function (e) { watch.delay(view.asid, 5, function (d) { if (d.ok) alert('延时成功'); else d.msg && alert(d.msg) }); }
        }]);

        

        function warn() {
            watch.warn(view.asid,false, function (d) {
                if (d.ok) {
                    alert('警告操作成功');
                } else {
                    alert('警告操作失败！\n原因：' + d.msg);
                }
            });
        }

        function disWarn() {
            watch.warn(view.asid, true, function (d) {
                if (d.ok) {
                    alert('取消警告操作成功');
                } else {
                    alert('取消警告操作失败！\n原因：' + d.msg);
                }
            });
        }

        function change() {
            watch.change(view.asid, function (d) {
                if (d.ok) {
                    alert(view.name + ' 可以更换机器了');
                } else {
                    alert('换机失败！\n原因:' + d.msg);
                }
            });
        }

        function reExam() {
            watch.reOpenExam(view.asid, function (d) {
                if (d.ok)
                    alert('恢复' + view.name + '考试成功');
                else
                    alert('恢复考试失败！\n原因：' + d.msg);
            });


        }

        watch.getEsList(function (d) {
            new DataGrid({
                columns: [{ text: '考试名称' }, { text: '考试日期', width: 150 }, { text: '开始-结束时间', width: 150 }, { text: '操作', width: 160 }],
                table: '#eslist',
                cells: [
                    '{name}',
                    '{date}',
                    '{time}', [
                    new DataGrid.Button({
                        text: '开始监考',
                        click: function (e) {
                            h.set({ es: e.data.id });
                            tabs.show(1);
                        }
                    }),
                    new DataGrid.Button({
                        visible: 'isAdmin',
                        text: '设置监考老师',
                        click: function (e) {
                            showTeacherSelector(e.data.examId);
                        }
                    }),
                    ]
                ]
            }).fill(d, {});
        });
    });
});



function showTeacherSelector(exid) {
    var html = '<div ><div class="teacherSelector" style="float:left;"><div id="teacherList"></div></div><div class="teacherSelector" style="float:left;"><div id="selectedTeacherList"></div></div></div>';

    var win = new gzy.popup('指定监考老师', 385, 355, {
        html: html,
        buttons: [{
            text: '确定', click: function () {
                saveMonitors(exid, 'selectedTeacherList', function (result) {
                    if (result.ok) {
                        alert('保存成功');
                        win.close();
                    }
                    else
                        alert('保存失败' + result.msg);
                });

            }
        }, {
            text: '取消', click: function () {
                win.close();
            }
        }],
        onload: function (data) {
            watch.getAllTeachers(exid, function (data) {
                getLiArea(data, 'teacherList', 'selectedTeacherList');
            });
        }





    });
};


function move(data, objId, teacherListId, selectedTeacherListId) {
    var newData = new Array();
    $.each(data, function (i, teacher) {
        if (teacher.id == objId) {
            teacher.selected = !teacher.selected;
        }
        newData.push(teacher);
    });
    getLiArea(newData, teacherListId, selectedTeacherListId);
};

function getLiArea(data, teacherListId, selectedTeacherListId) {
    var teacherList = $('#' + teacherListId);
    var selectedTeacherList = $('#' + selectedTeacherListId);
    var html = '<div class="teacherSelectorTitle">可选的监考老师(<label id="avaliableTeachersCount"></label>人)</div><ul>';
    var html2 = '<div class="teacherSelectorTitle">已选的监考老师(<label id="selectedTeachersCount"></label>人)</div><ul>';
    var avaliable = 0, selected = 0;
    data.sort(function (a, b) {
        return a.name > b.name ? 1 : -1;
    });
    var note = '',css;
    $.each(data, function (i, teacher) {
        if (teacher.isManager) {
            note = '(管理员)';
            css = 'class="ismanager"';
        }
        else {
             note = '(监考员)';
             css = 'class="isnotmanager"';
        }
        if (teacher.selected) {
            selected++;
            html2 += '<li ' + css + ' name ="' + teacher.id + '" >' + teacher.name + note + '</li>';
        }
        else {
            avaliable++;
            html += '<li ' + css + ' name ="' + teacher.id + '" >' + teacher.name + '</li>';
        }
    });
    html2 += '</ul>';
    html += '</ul>';
    teacherList.html(html);
    selectedTeacherList.html(html2);
    $('#avaliableTeachersCount').html(avaliable);
    $('#selectedTeachersCount').html(selected);
    $('#' + teacherListId + ' ul li,#' + selectedTeacherListId + ' ul li').click(function () {
        if ($(this).attr('class') == 'isnotmanager')
            move(data, $(this).attr('name'), teacherListId, selectedTeacherListId);
        else
            alert('不能在此移除管理员的监考权限');
    });
};

function saveMonitors(exid,selectedTeacherListId,callBack) {
    var monitors = new Array();
    var selectedTeacherLis = $('#' + selectedTeacherListId + ' li.isnotmanager');
    $.each(selectedTeacherLis, function (i, monitorLi) {
        monitors.push($(monitorLi).attr('name'));
    });
    watch.saveMonitors(exid, monitors.toString(), function (result) {
        callBack(result);
    });
};
