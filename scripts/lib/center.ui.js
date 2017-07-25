/// <reference path="center.js" />
/// <reference path="teacher.js" />
/// <reference path="../jquery-1.7.min.js" />
/// <reference path="../common.js" />
/// <reference path="../Tree/gzy.tree.js" />
/// <reference path="../TabSet/gzy.tabset.v3.js" />
/// <reference path="../PopWindow/gzy.popup.js" />
/// <reference path="../My97DatePicker/WdatePicker.js" />

var editable, ex;
$.readyH(function (h, x) {
    /// <param name="h" type="HashManager"></param>
    var ts, grid;
    teacher.getMyInfo(function () {
        document.body.className = document.documentElement.className = '';
        if (user.version == 0 && user.mode == "") {
            if (user.userType == 'RandAccount') {
                $('.setting').hide();
            }
        }

        ts = $('#left a').tabset(null, {
            defaultTab: false,
            changed: function (c) {
                var page;
                var model = page = c.tab.attr('href').split('\/\/')[1];
                if (model == 'resultdata') page = 'dataforuse';
                if (model == 'centermonitor' || model == 'areaStudents')
                    window.open('/scripts/boxes/' + model + '.htm?examId='+x.exid, '_blank');
                else {
                    $('#center').load('/scripts/boxes/' + page + '.htm', function (text, status) {
                        if (status == 'success') eval($.camelCase('init-' + model) + '(x)');
                        else alert('未能加载页面模板');
                    });
                    h.set({ model: c.index });
                }
            },
            changing: function (c) {
                if (c.tab.is('.disabled')) return !!alert('在考试发布之前，该功能不可用。');
            },
            allowReRun: false
        });

        $('#return-link').click(function () { h.set({ exid: null, model: null }, true) });
        
        h.watch('exid', change);

        grid = new DataGrid({
            columns: ['考试名称', '创建者', '开始日期', '结束日期', '考试类型', '试卷类型', '考生数', '考试状态', '操作'],
            table: '#exlist',
            cells: [
                new DataGrid.Button({
                    text: '{name}', click: function (e) {
                        if (user.userType == 'Teacher')
                            h.set({ exid: e.data.id }, true);
                        else
                            location.replace('/centerExamView.aspx?examid=' + e.data.id);
                    }
                }),
                '{creator}', '{start}', '{end}', '{exType}', '{paperType}', '{studentCount}', '{status}',
                [new DataGrid.Button({
                    visible: 'showSetAdmin',
                    text: '设置管理员', click: function (e) {
                        setAdmin(e.data.id);
                    }
                }), new DataGrid.Button({
                    visible: 'user.userType=="Teacher"',
                    text: '删除', click: function (e) {
                        uic.confirm('确定要删除这个考试？', function () {
                            center.deleteExam(e.data.id, function (d) {
                                if (d.ok) 
                                    grid.deleteRow(e.row, function () { if (grid.pageCount > 1) grid.load() });
                            });
                        }, e.src.rect(), 200);
                    }
                }), new DataGrid.Button({
                    visible: 'status=="已发布"&&user.userType!="Teacher"',
                    text: '下载考务信息', click: function (e) {
                        location.replace('/centerExamView.aspx?examid=' + e.data.id);
                    }
                })]
            ],
            source: center.getExamList,
            params: { exType: -1, order: 2, paperType: -1, status: -1, skey: '', pagesize: 10, pageindex: 1 }
        });

        change(x.exid);

        $('#main-filter').submit(function () {
            grid.load($(this).getValues());
        });

        $('#main-filter select').change(function () {
            $('#main-filter').submit();
        });

        if (user.userType != 'Teacher') {
            $('#addnew').toggle(false);
        }
        else {
            $('#addnew').click(function () {
                var win = new gzy.popup('添加考试', 640, 450, {
                    afterclose: function () {
                        grid.load();
                        for (var i in gzy.popup.instance) return;
                        $(document.documentElement).addClass('x-border-box');
                    },
                    onload: function () {
                        $(document.documentElement).removeClass('x-border-box');
                        win.body.load('/scripts/boxes/baseinfo.htm', function () {
                            $('#attachment_iframe').attr('src', 'scripts/boxes/baseinfo-upload.aspx?exid=' + x.exid);
                            NumberBox($('input[name="length"]'), { max: 10000, min: 0, step: 10 });
                            NumberBox($('input[name="handin"]'), { max: 10000, min: 0, step: 10 });
                            NumberBox($('input[name="late"]'), { max: 10000, min: 0, step: 10 });

                            var btn = win.body.find('button.common').click(function () {
                                displaySelector(win.body.find('form'));
                            });
                            $('#dl-submit,#dt-submit').hide();
                            $('#radio_group_schemeType').click(function (event) {
                                if (event.target.tagName == "INPUT") {
                                    $('#disorder').toggle(event.target.value == 1);
                                    $('#form').setValues({ schemeName: '', schemeId: '' });
                                    if (event.target.value == 1) btn.text('选取试卷');
                                }
                            });

                            var examInfo = $.cookie('examInfo');
                            if (examInfo) {

                                var examInfoObj = JSON.parse(examInfo);
                                $('#form').setValues(examInfoObj);

                            }


                            $('[name="arrange"]').change(function () {
                                var lateLimit = $('#lateLimit');
                                var late = $('input[name="late"]');
                                if ($(this).val() == "3") {
                                    lateLimit.hide();
                                    late.val('525600');
                                }
                                else {
                                    lateLimit.show();
                                    late.val('');
                                }
                            });
                        });
                    },
                    buttons: [{
                        text: '确定',
                        click: function () {

                            win.body.find('form').valid(
                                ['name', 'start', 'end', { length: /\d+/ }, { handin: /\d+/ }, { late: /\d+/ }, 'schemeId'],
                                function (values) {
                                    values.id = 0;
                                    center.saveBaseinfo(values, function (d) {
                                        $.cookie('examInfo', JSON.stringify(values));
                                        if (d.ok) {
                                            alert('已保存');
                                            grid.load();
                                            win.close();
                                        } else {
                                            alert(d.msg);
                                        }
                                    });
                                },
                                function (field, value, all) {
                                    alert({
                                        name: '考试名称不能为空',
                                        start: '考试开始日期不能为空',
                                        end: '考试结束日期不能为空',
                                        length: '考试时长为数字且不能为空',
                                        handin: '提前交卷限制为数字且不能为空',
                                        late: '迟到时间限制为数字且不能为空',
                                        schemeId: '考卷方案不能为空',
                                    }[field]);
                                }
                            );
                        }
                    }]
                });
            });
        }
    });
    function change(v) {
        if (v) {
            var loading = showLoding();
            center.getExamPreview(v, function (d) {
                loading.close();
                if (d.ok) {
                    ex = d.data;
                    editable = d.data.status == "创建中" || d.data.status == "已编排" ;

                    $('#ex-date').text(d.data.start == d.data.end ? d.data.end : [d.data.start, d.data.end].join(' 至 '));
                    $('#ex-name,#ex-type,#ex-schools,#ex-students,#ex-status').each(function (i, x) {
                        x.innerHTML = d.data[x.id.split('-')[1]];
                    });
                    var action = { 已编排: '发布考试', 已发布: '结束考试', 创建失败: '发布考试' }[d.data.status];
                    if (action) $('<button class="submit">' + action + '</button>').click(function () {
                        uic.confirm('确定要' + action + '？', function () {
                            if (action == '结束考试') {
                                $.messager.prompt('身份验证', '请输入管理员密码:', function (r) {
                                    if (r) {
                                        teacher.checkPassWord(r, function (result) {
                                            if (result.ok && result.data) {
                                                center.changeExState(x.exid, function (d) {
                                                    if (d.ok) location.reload();
                                                });
                                            }
                                            else
                                                alert('密码错误');

                                        });
                                    }
                                },true);
                            }
                            else {
                                center.changeExState(x.exid, function (d) {
                                    if (d.ok) location.reload();
                                });
                            }

                        }, $(this).rect(), 180);
                    }).appendTo($('#ex-control').empty());
                    $('#grid').hide();
                    $('#examinfo,#main').show();
                    ts && ts.show('model' in x ? x.model : 2);
                    if (editable) $('#left a:gt(6)').addClass('disabled');
                } else {
                    h.set({ exid: null }, true)
                }
            });
        } else {
            grid.load();
            $('#grid').show();
            $('#examinfo,#main').hide();
        }
    }

});
function displaySelector(form) {
    var type = form.find('input[name=schemeType]:checked').val();
    var sel = new gzy.popup('选择' + (type == 1 ? '方案' : '试卷'), 500, 390, {
        html: '<form style="display:none;overflow:hidden;"/><table width="100%" cellpadding="0" cellspacing="0" border="0" class="list"/>',
        afterclose: function () {
            for (var i in gzy.popup.instance) return;
            $(document.documentElement).addClass('x-border-box');
        },
        onload: function () {
            $(document.documentElement).removeClass('x-border-box');
            var data = form.getValues(), div = sel.body.find('form'), map = {};

            new DataGrid({
                columns: ['&nbsp;', (type == 1 ? '方案' : '试卷') + '名称', { text: '类型', width: 60 }, { text: '出卷人', width: 80 }, { text: '创建时间', width: 80 }],
                table: sel.body.find('table.list'),
                cells: [
                    function (data) {
                        return type != 1 ? $('<input type="radio" name="mm_id"/>').click(function () {
                            form.setValues({ schemeName: data.name, schemeId: data.id });
                            sel.close();
                        }) :
                            $('<input type="checkbox" name="mm_id" value="' + data.id + '"/>').click(function () {
                                if (this.checked) map[this.value] = data.name;
                                else delete map[this.value];
                                gogo();
                            });
                    },
                    '{name}', '{type}', '{author}', '{created}'
                ],
                source: center.getParamList,
                params: { type: type, pagesize: 5 },
                onload: function () {
                    this.table.find('input:checkbox').each(function () {
                        this.checked = this.value in map;
                    });
                }
            }).load({ pageindex: 1 });

            if (data.schemeType == '1') {
                div.show();
                var ids = data.schemeId.split(','), names = data.schemeName.split(',');
                for (var i = 0; i < ids.length; i++) if (ids[i]) map[ids[i]] = names[i];
                gogo();
            }
            function gogo() {
                if ($.isEmptyObject(map)) return div.html('请选择至少一份试卷。');
                div.empty();
                for (var x in map)
                    div.append($.gf(' <label style="margin-right:1em;float:left"><input type="checkbox" checked="checked" value="{1}"/>{2}</label>', x, map[x]));
            }


        },
        buttons: type == 1 ? [{
            text: '确定',
            click: function () {
                var xs = sel.body.find('form input:checked'), ids=[], names=[];
                if (!xs.length) return alert('需要至少一份试卷');
                for (var i = 0, box; box = xs[i++];) ids.push(box.value), names.push(box.parentNode.innerText);
                form.setValues({ schemeName: names.join(','), schemeId: ids.join(',') });
                sel.close();
            }
        }] : []
    });
};
function initBaseinfo(x) {
    debugger;
    $('#attachment_iframe').attr('src', 'scripts/boxes/baseinfo-upload.aspx?exid=' + x.exid);




    center.getBaseinfo(x.exid, function (d) {
        var form = $('#form').submit(function () {
            if (!editable) return;

            form.valid(['name', 'start', 'end', { length: /\d+/ }, { handin: /\d+/ }, { late: /\d+/ }, 'schemeId'],
                function (values) {
                    values.id = d.data.id;
                    var loading = showLoding();
                    center.saveBaseinfo(values, function (d) {
                        loading.close();
                        if (d.ok) {
                            alert('已保存');
                            location.reload();
                        } else {
                            alert(d.msg);
                        }
                    });
                },
                function (field, value, all) {
                    alert({
                        name: '考试名称不能为空',
                        start: '考试开始日期不能为空',
                        end: '考试结束日期不能为空',
                        length: '考试时长为数字且不能为空',
                        handin: '提前交卷限制为数字且不能为空',
                        late: '迟到时间限制为数字且不能为空',
                        schemeId: '考卷方案不能为空',
                    }[field]);
                }
            );
        }).setValues(d.data);
        form.find('button.common').click(function () {
            displaySelector(form);
        });
        $('#radio_group_schemeType').click(function (event) {
            if (event.target.tagName == "INPUT") {
                form.setValues({ schemeName: '', schemeId: 0 });
                $('#disorder').toggle(event.target.value == 1);
            }
        });
        $('#disorder').toggle(d.data.schemeType == 1);
        if (!d.data.disorder) {
            $('#disorder-id-trigger').click();
            $('#disorder-id').val('false');
        }
        if (!d.data.registerIsOpen) {
            $('#registerIsOpen-trigger').click();
            $('#registerIsOpen').val('false');
        }

        if (!d.data.randomArrange) {
            $('#randomArrange-trigger').click();
            $('#randomArrange').val('false');
        }

        if (d.data.schemeType == 1) form.find('button.common').text('选取试卷');
        if (!editable) form.find('button').attr('disabled', true).addClass('disabled'), form.find('input,textarea').attr('disabled', true);

        //$('[name="arrange"]').val()
        $('input[name="arrange"]').change(function () {

            var lateLimit = $('#lateLimit');
            var late = $('input[name="late"]');
            if ($(this).val()=="3") {
                lateLimit.hide();
                late.val('525600');
            }
            else {
                lateLimit.show();
                late.val('');
            }
        });


        if ($('input[name="arrange"][value="3"]').attr("checked") == "checked")
            $('#lateLimit').hide();

    });
};
function initDataforuse(x) {
    dataPackage(1, x);
};

//x:1-考务数据包,2-结果数据包
function dataPackage(type, x) {
    var schoolId;
    var areaCode;
    var transState=0;
    var pageIndex;
    var opBtnText = "";
    var columns;
    var openState = -1;
    var statesList = $('#packageState');

    if (type == 1) {
        columns = [{ text: '考场名称', width: 120 }, { text: '考点名称', width: 160 }, { text: '所在区县', width: 80 }, { text: '场次数', width: 50 }, { text: '考务包状态', width: 80 }, { text: '下载状态', width: 80 }, {text:'开启状态',width:60}, { text: '操作' }];
        $('.export').show();
    }
    else {
        columns = [{ text: '考场名称', width: 120 }, { text: '考点名称', width: 160 }, { text: '所在区县', width: 80 }, { text: '场次数', width: 50 }, { text: '结果包状态', width: 80 }, { text: '导入状态', width: 80 }, { text: '开启状态', width: 60 }, { text: '操作' }];
        $('.export').hide();
    }
    var grid = new DataGrid({
        columns: columns,
        table: '#datalist',
        cells: ['{roomName}', '{centerName}', '{district}', '{sessionsCount}', function (data) {
            if (type == 1) {
                var examPackageStateText = data.examPackageCreated;
                if (examPackageStateText == '已生成' || examPackageStateText == '未生成')
                    examPackageStateText = examPackageStateText.fontcolor('black');
                else
                    examPackageStateText = examPackageStateText.fontcolor('red');
                return $(examPackageStateText);
            }
            else
                return data.ResultPackageUploaded;
        }, function (data) {
            // alert(data);
            if (type == 1) {
                return data.downLoadstate;
            }
            else
                return data.importeState;

        }, function (data) {
            var text = data.isOpen ? '<a href="javascript:;" title="单击再次开启" class="reopen" >已开启</a>' : '<label>未开启</label>';

            return $(text).click(
                    Function.overLoad(function () {
                        return this.className;
                    }, {
                        'reopen': function () {

                            $.messager.prompt('重新开启需要身份验证', '请输入管理员密码:', function (r) {
                                if (r) {
                                    teacher.checkPassWord(r, function (result) {
                                        if (result.ok && result.data) {
                                            var changeMachine = false;
                                            if (confirm('重新开启考试的同时需要允许更换服务器吗？'))
                                                changeMachine = true;

                                            var loading = showLoding();
                                            center.reopenExamRoom({ examRoomId: data.roomId, changeMachine: changeMachine }, function (d) {
                                                loading.close();
                                                if (d.ok) {
                                                    alert('重新开启成功');
                                                    grid.load({ pageindex: pageIndex, areaCode: areaCode, schoolId: schoolId });
                                                }
                                                else
                                                    alert('重新开启失败');
                                            });
                                        }
                                        else
                                            alert('密码错误');

                                    });
                                }
                            }, true);



                        }
                    })
                );

        },
            function (data) {
                var generateText;
                if (type == 1)
                    if (data.examPackageCreated == '未生成')
                        generateText = '<a href="javascript:;" class="regenerate" title="为【' + data.centerName + data.roomName + '】生成考务数据包">生成</a>';
                    else
                        generateText = '<a href="javascript:;" class="regenerate" title="重新生成【' + data.centerName + data.roomName + '】的考务数据包">重新生成</a>';

                if (type == 2)
                    if (data.ResultPackageUploaded == '已上传' && (data.importeState != '已导入' && data.importeState != '导入中'))
                        generateText += '&nbsp;&nbsp;<a href="javascript:;" class="import" title ="将【' + data.centerName + data.roomName + '】上传的考试结果数据包导入数据库">导入</a>';
                    else
                        generateText = "";

                return $(generateText).click(
                    Function.overLoad(function () {
                        return this.className;
                    }, {
                        regenerate: function () {
                            if (confirm('生成数据包将导致已生成的包密钥被更换，是否确定要生成数据包')) {
                                center.generateRoomPackages({ exid: data.examId, roomId: data.roomId }, function (d) {
                                    if (!d.ok)
                                        alert('生成失败！\n失败原因：' + d.msg);
                                    grid.load();
                                });
                            }
                        },
                        'delete': function () {
                            uic.confirm('你确定删除该考务数据包吗？', function () {
                                var loading = showLoding();
                                center.deletePackage({ packageID: data.id }, function (d) {
                                    loading.close();
                                    if (d.ok) {
                                        alert('删除成功');
                                        grid.load({ pageindex: pageIndex, areaCode: areaCode, schoolId: schoolId });
                                    }
                                    else
                                        alert('删除失败');
                                });

                            }, $(this).rect(), 150, true);
                        },
                        'import': function () {
                            center.importRoomPackage({ exid: x.exid, roomid: data.roomId }, function (d) {
                                grid.load();//刷新
                                if (!d.ok)
                                    alert('导入失败！\n失败原因：' + d.msg);

                            });
                        }
                    })
                );
            }
        ],
        source: center.getDataList,
        pageSize: 15,
        params: { exid: x.exid, transState: 0 },
        onload: function () {
            //if ($('#isPackagePage').length != 0)
            //    grid.load();
        }
    }).load({ pageindex: 1, areaCode: null, schoolId: 0, openState: -1 });

    center.getAreas({ exid: x.exid, id: 0, noschool: false, showAllCanBeExSchoolNum: false, flag: false }, function (d) {
        var selectArea, selectSchool;
        var areasList = $('#areasList');
        var schoolsList = $('#schoolsList');
        areasList.empty();
        areasList.append('<option value="' + d.id + '">不限</option>');
        $.each(d.items, function (i, area) {
            if (area.extra != '(0)')
                areasList.append('<option value="' + area.id + '">' + area.text + '</option>');
        });
        areasList.change(function () {
            var areaid = $(this).find("option:selected").val();
            selectArea = areaid;
            center.getExSchoolList({ exid: x.exid, area: areaid, pagesize: null, pageindex: null }, function (schools) {
                schoolsList.empty();
                schoolsList.append('<option value="">不限</option>');
                $.each(schools.data.rows, function (i, school) {
                    schoolsList.append('<option value="' + school.id + '">' + school.name + '</option>');
                });
            });
            grid.load({ pageindex: 1, areaCode: selectArea, schoolId: 0, transState: transState, openState: openState });
        });
        schoolsList.change(function () {
            schoolId = $(this).find("option:selected").val();
            var areatmp;
            if (schoolId >0) {
                areatmp = null;
            }
            else {
                areatmp = selectArea;
                schoolId = 0;
            }
            grid.load({ pageindex: 1, areaCode: areatmp, schoolId: schoolId, transState: transState, openState: openState });
        });
        statesList.empty();
        statesList.append('<option value="0">不限</option>');
        if (type == 1) {
            statesList.append('<option value="1">未下载</option>');
            statesList.append('<option value="2">下载中</option>');
            statesList.append('<option value="3">已下载</option>');
        }
        else {
            statesList.append('<option value="4">未上传</option>');
            statesList.append('<option value="5">上传中</option>');
            statesList.append('<option value="6">已上传</option>');
        }
        statesList.change(function () {
            var areatmp;
            if (schoolId > 0) {
                areatmp = null;
            }
            else {
                areatmp = selectArea;
                schoolid = 0;
            }
            transState= $(this).find("option:selected").val();
            grid.load({ pageindex: 1, areaCode: areatmp, schoolId: schoolId, transState: transState, openState: openState });
        });
        $('#examOpenState').change(function () {
            var areatmp;
            if (schoolId > 0) {
                areatmp = null;
            }
            else {
                areatmp = selectArea;
                schoolid = 0;
            }
            openState = $(this).find("option:selected").val();
            grid.load({ pageindex: 1, areaCode: areatmp, schoolId: schoolId, transState: transState, openState: openState });
        })


    });

    var form = $('#form').submit(function () {

        var values = form.getValues({ exid: x.exid });
        if (values.openTime == '') return alert('开始时间不能为空');
        if (values.endTime == '') return alert('结束时间不能为空');
        if (type == 1)
            center.setPackageDownLoadTime(values, function (d) { if (d.ok) alert('时间设定成功'); else alert('时间设定失败'); });
        else//下面设置上传时间
            center.setPackageUpLoadTime(values, function (d) { if (d.ok) alert('时间设定成功'); else alert('时间设定失败'); });
    });
    $('#generate').click(function () {
        if (type == 1) {

            if (confirm('生成数据包将导致已生成的包密钥被更换，是否确定要生成所有数据包')) {
                center.generateExamAllPackages(x, function (d) {
                    //  alert('系统正在后台生成数据包，您可以稍候到此页面查看生成结果');
                    if (!d.ok)
                        alert('生成失败！\n失败原因：' + d.msg);
                    grid.load();
                });
            }
        }
        else {
            if (confirm('你确定要导入结果数据包吗？')) {
                center.importResultPackages(x, function (d) {
                    //   alert('系统正在后台导入，您可以稍候到此页面查看导入结果');
                    if (!d.ok)
                        alert('导入失败！\n失败原因：' + d.msg);
                    grid.load();
                });
            }
        }
    });

    $('#downloadAdmin').click(function () {
        var lodaing = showLoding('正在导出，请稍候');
        center.exportAdmins(x, function (d) {
            lodaing.close();
            if (d.ok) {
                $('#iframe-download')[0].contentWindow.location = d.data.filename.replace('\\', '/');
                
            }
            else
                alert('导出失败！失败原因：' + d.msg);
        });
    });

    $('#downloadAllExamInfo').click(function () {
        var lodaing = showLoding('正在导出，请稍候');
        center.exportAllExamInfo({ exid: x.exid, needPassword: true }, function (d) {
            lodaing.close();
            if (d.ok) {
                $('#iframe-download')[0].contentWindow.location = d.data.filename.replace('\\', '/');
            }
            else
                alert('导出失败！失败原因：' + d.msg);
        });
    });

    $('#sendExamInfo').click(function () {
        var lodaing = showLoding('正在发送，请稍候');
        center.sendExamInfo(x, function (d) {
            lodaing.close();
            if (d.ok) {
               alert('正在后台发送')
            }
            else
                alert('发送失败！失败原因：' + d.msg);
        });
    });

    $('#sendStudentsInfo').click(function () {
        var lodaing = showLoding('正在发送，请稍候');
        center.sendStudentCards(x, function (d) {
            lodaing.close();
            if (d.ok) {
                alert('正在后台发送')
            }
            else
                alert('发送失败！失败原因：' + d.msg);
        });
    });

    


    $('#downloadAllStartPassword').click(function () {
        var lodaing = showLoding('正在导出，请稍候');
        center.exportAllExamPassword(x, function (d) {
            lodaing.close();
            if (d.ok) {
                $('#iframe-download')[0].contentWindow.location =d.data.filename.replace('\\', '/');
            }
            else
                alert('导出失败！失败原因：' + d.msg);
        });
    });


    if (type == 1)//获取时间
    {
        $('#dataTitle').html('考务数据包管理');
        $('#generate').html('生成所有考务数据包').attr('title', '为当前考试的所有考场生成各自的考务数据包');
        $('#timeTitle').html('考务数据包开放下载时间');
        center.getPackageDownLoadTime({ exid: x.exid, getDownloadTime: true }, function (d) {
            $('#openTime').val(d.data.startTime);
            $('#endTime').val(d.data.endTime);
        });
    }
    else {
        $('#dataTitle').html('结果数据包管理');
        $('#generate').html('导入所有结果数据包').attr('title', '将当前考试的所有已上传并且未导入的结果数据包导入');
        $('#timeTitle').html('结果数据包开放上传时间');
        center.getPackageDownLoadTime({ exid: x.exid, getDownloadTime: false }, function (d) {
            $('#openTime').val(d.data.startTime);
            $('#endTime').val(d.data.endTime);
        });
    }
    if (typeof timer != 'undefined') clearInterval(timer);
    timer = setInterval(function () {
        if ($('#isPackagePage').length == 0)
            return clearInterval(timer);
        else grid.load();
    }, 3000);

    hasTimer = 'true';

    $('#titleBar').click(function () {
        $('#form').slideToggle(300, function () {
            if ($('#form').css('display') != 'none')
                $('#titleBar').attr('title', '点击收起');
            else
                $('#titleBar').attr('title', '点击展开');
        });
    }).attr('title', '点击收起').css('cursor','pointer');

};


function initStudents(x) {
    var view_all = false;

    var grid = new DataGrid({
        columns: ['准考证号', '姓名', '身份证号', '照片'],
        table: '#list-student',
        selectKey: 'id',
        cells: ['{kaohao}', '{name}', '{uname}', view],
        params: { schoolId: -1, exid: x.exid, query: '', pagesize: 10 },
        source: center.getStudents
    }).showBodyMsg('<--请从左侧选择一个单位以显示来自该单位的考生'), form = $('#form'), lb_count = $('#ex-students'), upload = $('#upload');

    function view(data) {
        if (data.pic)
            return $('<a href="' + data.pic + '" target="_blank">查看照片</a>');
        else
            return $('<label style="color:red">没有照片</label>');
    };

    form.submit(function () { grid.load($.extend($(this).getValues(), { pageindex: 1 })) });

    var tree = new gzy.tree({
        sourceType: 'json',
        connector: {
            url: center.getStudentTree,
            params: { exid: x.exid },
            onload: function () { this.select('0'); },
            loading: function (data) {
                if (!view_all)
                    data.items = $.grep(data.items, function (item) { return !!item.extra });
            }
        },
        onselect: function (item) {
            form[0].reset();
            grid.load(form.getValues(item.leaf ? { schoolId: item.id, pageindex: 1, area: -1 } : { area: item.id, pageindex: 1, schoolId: -1 }));
            upload.setValues({ schoolId: item.id });
        }
    }).renderTo('#s-tree');

    if (editable) {
        upload.setValues(x);
        $('#import-student').click(function () {
            return editable;
        });
        $('#upframe').load(function (d) {
            var res = $.trim(this.contentWindow.document.body.innerHTML);
            if (!res) return;

            upload[0].reset();
            res = $.parseJSON(res);
            if (res.ok) {
                grid.load();
                lb_count.text(parseInt(lb_count.text()) + res.data);
                var selectedPath = tree.selectedPath;
                tree.reload(tree.findId(0), function () {
                    tree.select(selectedPath);
                });
            }
            alert(res.msg);
        });
        $('#delete-student').click(function () {
            //if (editable) {
            if (tree.selectedItem.leaf && tree.selectedItem.id > 0) {
                if (confirm('确定清空这个单位的所有考生数据？')) {
                    center.clearExaminee(x.exid, tree.selectedItem.id, function (d) {
                        if (d.ok) {
                            grid.load();
                        } else {
                            d.msg && alert(d.msg);
                        }
                    })
                }
            } else {
                alert('请先选择一个单位');
            }
                //if (!grid. selectedValues.length) return alert('没有选择要删除的行');
                //center.deleteExaminee(x.exid, grid.selectedValues, function (d) {
                //    if (d.ok) {
                //        lb_count.text(parseInt(lb_count.text()) - d.data);
                //        grid.deleteRow(true, function () {
                //            var selectedPath = tree.selectedPath;
                //            tree.reload(tree.findId(0), function () {
                //                tree.select(selectedPath);
                //            });
                //        });
                //    } else {
                //        alert(d.msg);
                //    }
                //});
            //}
        });
    } else {
        $('#import-student,#delete-student').disable();
        $('#important-student-container').css('backgroundImage', 'url(/images/center/upload-disabled.jpg)');
    }

    $('#view_all').click(function () {
        var me = this;
        view_all = me.innerHTML == '查看所有单位';
        tree.reload(tree.findId(0), function () {
            me.innerHTML = view_all ? '只显示有考生的单位' : '查看所有单位';
        });
    });
};
function initSchools(x) {
    var grid = new DataGrid({
        columns: ['考点名称', '考场数','绑定单位数','绑定人数', '绑定详情'],
        table: '#list-school',
        selectKey: 'id',
        cells: ['{name}', '{rooms}', '{compayAttachCount}', '{studentsAttachCount}', view],
        params: { area: '', exid: x.exid, pagesize: 10 },
        source: center.getExSchoolList
    }).showBodyMsg('<--请从左侧选择一个行政区来查看该区的考点'), lb_count = $('#ex-schools');

    function view(data) {
        return $('<a href="javascript:;">查看</a>').click(function () {
            
            var bindInfos = data.binder;
            var win = new gzy.popup('查看考点绑定详情', 600, 450, {
                onload: function () {
                    var t = $('<table class="property_grid" cellspacing="1" cellpadding="0" width="100%"/>').appendTo(win.body),
                        add = function (name, value) { $.gf('<thead><th style="text-align:center;font-weight:bold;boder-right:1px solid black;">单位名称</th><th style="text-align:center;font-weight:bold">绑定人数</th></thead><tr><th valign="top" style="width:450px;">{1}</th><td valign="top" style="text-align:center;">{2}</td></tr>', name, value).appendTo(t) };
                    
                    $.each(bindInfos, function (i, bind) {
                        add(bind.name, bind.count);
                    })

                }
            });







        });
    }
    function config(data) {
        return $('<a href="javascript:;">配置</a>').click(function () {
            var form = new DataForm({
                items: [{
                    label: '考点名称', key: 'name', nullable: false
                }, {
                    label: '考点编码', key: 'code', nullable: false
                }]
            });
            form.form.setValues(data);

            var win = new gzy.popup('修改考点信息', 330, 110, {
                element: form.form,
                afterclose: function () {
                    for (var i in gzy.popup.instance) return;
                    $(document.documentElement).addClass('x-border-box');
                },
                onload: function () {
                    $(document.documentElement).removeClass('x-border-box');
                },
                buttons: [{
                    text: '保存',
                    click: function () {
                        var values = form.form.getValues({ id: data.id });
                        if ($.trim(values.name) && $.trim(values.code)) {
                            center.updateExSchool(values, function (d) {
                                if (d.ok) {
                                    win.close();
                                    grid.load();
                                } else {
                                    alert(d.msg);
                                }
                            });
                        }
                    }
                }]
            });
        });
    }

    var tree = new gzy.tree({
        sourceType: 'json',
        connector: {
            url: center.getExSchoolTree,
            params: { exid: x.exid, noschool: true, flag: true },
            onload: function () { this.select('0') },
            loading: function (data) {
                data.items = $.grep(data.items, function (item) { return !!item.extra });
            }
        },
        onselect: function (item) {
            grid.load({ area: item.id, pageindex: 1 });
        }
    }).renderTo('#s-tree');

    $('#add-exschool').click(function () {
        if (!editable) return;

        var s = tree.selectedItem;
        if (!s) return alert('请先选择一个行政区');

        var res = s.extra.match(/\((\d+)\/(\d+)\)/);
        if (!res) return alert(s.text + '没有可以被添加为考点的单位');
        if (res[1] == res[2]) return alert(s.text + '所有可以作为考点的单位都已经添加了');
        
        var win = new gzy.popup('添加考点', 500, 310, {
            afterclose: function () {
                for (var i in gzy.popup.instance) return;
                $(document.documentElement).addClass('x-border-box');
            },
            onload: function () {
                $(document.documentElement).removeClass('x-border-box');
                win.body.load('/scripts/boxes/addexschool.htm', function () {
                    center.getUnusedSchool(s.id, x.exid, function (d) {
                        var form = win.body.find('form'), select = form.find('select')[0];
                        select.length = 0;
                        $.each(d, function (i, item) {
                            select.options.add(new Option(item.text, item.id));
                        });

                        select.onchange = function () {
                            form.setValues({ Name: this.options[this.selectedIndex].text });
                            rooms.load({ schoolId: this.value });
                        };
                        select.onchange();
                    });

                    var rooms = new DataGrid({//
                        columns: ['考场名称', '位置信息', '考生机位'],
                        table: '#list-rooms',
                        cells: ['{name}', '{location}', '{count}'],
                        source: center.getExRoomList,
                        emptyMsg: '没有设置考场'
                    });
                });
            },
            buttons: [{
                text: '确定',
                click: function () {
                    var values = win.body.find('form').getValues({ ExamId: x.exid });
                    if (!$.trim(values.Code)) return alert('考点编号不能为空');

                    center.saveExSchool({ entity: values }, function (d) {
                        if (d.ok) {
                            lb_count.text(parseInt(lb_count.text()) + 1);
                            var res = tree.selectedItem.extra.match(/\((\d+)\/(\d+)\)/);
                            res && tree.selectedItem.setExtra('(' + (parseInt(res[1]) + 1) + '/' + res[2] + ')');
                            tree.selectedItem.parent().setExtra('(' + lb_count.text() + '个考点)');
                            win.close();
                            grid.load();
                        } else {
                            alert(d.msg);
                        }
                    });
                }
            }, {
                text: '取消', click: function () { win.close() }
            }]
        });
    });
    $('#delete-exschool').click(function () {
        if (!editable) return;
        if (!grid.selectedValues || !grid.selectedValues.length) return alert('没有选择要删除的行');
        center.deleteExschool(grid.selectedValues, function () {
            lb_count.text(parseInt(lb_count.text()) - grid.selectedValues.length);
            var res = tree.selectedItem.extra.match(/\((\d+)\/(\d+)\)/);
            tree.selectedItem.setExtra('(' + (parseInt(res[1]) - grid.selectedValues.length) + '/' + res[2] + ')');
            tree.selectedItem.parent().setExtra('(' + lb_count.text() + '个考点)');
            grid.load();
        });
    });

    if (!editable) $('#add-exschool,#delete-exschool').addClass('disabled');
};
function initBinder(x) {
    var grid = new DataGrid({
        columns: ['考点编码', '考点名称', '考场/机位', '考生人数', '考点绑定信息', '操作'],
        cells: ['{code}', '{name}', '{rooms}/{computersCount}', count, binder, config],
        table: '#list-school',
        params: { area: '', exid: x.exid, pagesize: 10 },
        source: center.getBinderList,
        emptyMsg: '请先添加该区域的考点, 然后才能绑定考生',
        onload: function (grid, d) { $('#binder-tips').text(d.msg ? '未分配考点的考生共有：' + d.msg + '人' : '所有考生都已分配到考点'); }
    }).showBodyMsg('<--请从左侧选择一个行政区来查看该区的考点');




    function count(data) {
        return eval($.map(data.binder, function (item, i) { return item.count }).join('+'));
    }
    function binder(data) {
        return $.map(data.binder, function (item, i) { return item.school + '(' + item.count + ')' }).join('<br/>');
    }
    function status(data) {
        return data.binder.length ? '' : '未绑定'.fontcolor('red');
    }
    function config(data) {
        var cmd = $('<a href="javascript:;">绑定设置</a>').click(function () {
            if (!editable || ex.arrange == 2 || ex.arrange == 3) return;
            var values = { exid: x.exid, ecid: data.id, binder: {} };
            var destMap = {}, sourceMap = {};
            var win = new gzy.popup('考生绑定 -- ' + data.name, 500, 300, {
                afterclose: function () {
                    for (var i in gzy.popup.instance) return;
                    $(document.documentElement).addClass('x-border-box');
                },
                onload: function () {
                    $(document.documentElement).removeClass('x-border-box');
                    var loading = showLoding('正在加载数据...');
                    win.body.load('/scripts/boxes/binder-setting.htm', function () {
                        var operate = new DataGrid.Button({
                            text: '删除',
                            click: function (e) {
                                bgrid.deleteRow(e.row, function () {
                                    //var k = e.data.schoolId.toString();
                                    //delete values.binder[k];

                                    //if (k in ds) ds[k][1] += e.data.count; else ds[k] = [e.row.find('td:first').text(), e.data.count];
                                    //bind_select();
                                    delete destMap[e.data.schoolId];
                                    sourceMap[e.data.schoolId].count += e.data.count;

                                    refreshPanel(areas.val());
                                });
                            }
                        }), bgrid = new DataGrid({
                            columns: ['来源单位', { text: '考生数', width: 100 }, { text: '&nbsp;', width: 100 }],
                            cells: ['{school}', '{count}', operate],
                            table: '#binder-setting-list'
                        }),
                        form = win.body.find('form'),
                        input = form.find('input:text'),
                        area = tree.selectedItem.id.toString(),
                        areas = $('#areas').empty().change(function () { change.call(this, this.value) }),
                        select = $('#schoolId').change(function () { input.val(this.length ? ds[this.value][1] : '') }),
                        ds = {},
                        odata;

                        center.getUnbindExaminee(x.exid, tree.selectedItem.id, function (d) {
                            loading.close();
                            odata = d.data.rows
                                //.filter(function (x) { return x.count > 0 })
                                .sort(function (x) { return x.schoolId == data.schoolId ? -1 : 1 });

                            $.each(d.data.rows, function () { sourceMap[this.schoolId] = this });
                            $.each(data.binder, function () { destMap[this.schoolId] = this });

                            refreshPanel(tree.selectedItem.id);
                        });

                        form.submit(function () {
                            var d = form.getValues(), school = sourceMap[d.schoolId].school, count = parseInt(d.count);

                            sourceMap[d.schoolId].count -= count;

                            if (d.schoolId in destMap) {
                                destMap[d.schoolId].count += count;
                            } else {
                                destMap[d.schoolId] = { schoolId: d.schoolId, school: school, count: count }
                            }

                            refreshPanel(areas.val());
                        });

                        function change(area) {
                            ds = {};
                            $.each(odata, function (i, item) {
                                if (item.area == area && item.count > 0)
                                    ds[item.schoolId.toString()] = [item.school, item.count];
                            });
                            bind_select();
                        }
                        function bind_select() {
                            select.empty();
                            $.each(ds, function (id, data) { $.gf('<option value="{1}">{2}({3})</option>', id, data[0], data[1]).appendTo(select) });
                            if (select.html()) {
                                form.find('span').show(); form.find('label').hide();
                                select.change();
                            } else {
                                form.find('span').hide(); form.find('label').show();
                            }
                        }
                        function refreshPanel(area) {
                            //区域及统计未绑定数
                            areas.empty();
                            $.each(ord, function (i, item) {
                                var sum = 0;
                                for (var i in sourceMap) if (sourceMap[i].area == item.id) sum += sourceMap[i].count;
                                if (sum) areas[0].options.add(new Option(item.text + (sum ? '(' + sum + ')' : ''), item.id));
                            });
                            areas.val(area).change();

                            bgrid.clear();
                            $.each(destMap, function (schoolId, item) {
                                values.binder[schoolId] = item.count;
                                bgrid.addRow(item);
                            });
                        }
                    });
                },
                buttons: [{
                    text: '确定',
                    click: function () {
                        values.binder = {};
                        for (var i in destMap) values.binder[i] = destMap[i].count;
                        center.bindToSchool(values, function (d) {
                            win.close();
                            grid.load();
                        });
                    }
                }]
            });
        });
        if (!editable || ex.arrange == 2 || ex.arrange == 3) {
            cmd.attr('disabled', true).addClass('disabled');
            if (ex.arrange == 2 || ex.arrange == 3)
                cmd.attr('title', '按班级编排模式下学生只能分配到自己的考点。\n绑定请使用“绑定学生至本校考点”');
        }
        return cmd;
    };
    var ord;
    var tree = new gzy.tree({
        sourceType: 'json',
        connector: {
            url: center.getBinderTree,
            params: { exid: x.exid },
            onload: function () { this.select('0') },
            loading: function (data) {
                ord = $.extend({}, data.items);
                data.items = $.grep(data.items, function (item) { return !!item.extra });
            }
        },
        onselect: function (item) { grid.load({ area: item.id, pageindex: 1 }) }
    }).renderTo('#s-tree');

    $('#auto-bind').click(function () {
        if (!editable) return false;
        if (confirm('该操作将清空所有已绑定的数据，确定要执行自动绑定？')) center.autoBind(x.exid, function (d) {
            if (d.ok) {
                alert('自动绑定成功，所有考点本校的学生都已绑定到本校。');
                location.reload();
            }
        });
    }).attr('disabled', !editable);


};
function initEnroll(x) {
    exam.getAllowSubmitEndTime(x.exid, function (result) {
        $('#auditEndTime').val(result.endTime);
    });
  
    $('#auditEndTimeBtn').click(function () {
        var endTime = $('#auditEndTime').val();
        exam.setAllowSubmitState(x.exid, endTime, function (result) {
            if (result.ok)
                alert('保存成功！');
            else
                alert('保存失败!' + result.msg);
        });

    });

};
function initTimeset(x) {
    var remove = new DataGrid.Button({
        text: '删除',
        click: function (e) {
            center.deleteExTimeset(e.data.id, function (data) {
                if (data.ok)
                    grid.deleteRow(e.row, function () { grid.load() });
                else
                    alert(data.msg);
            });
        },
        disabled: !editable
    }),
    grid = new DataGrid({
        columns: ['序号',  '场次开始时间', '场次结束时间', '&nbsp;'],
        cells: ['{#rowindex}',  '{start}', '{end}', remove],
        table: '#list-timeset',
        source: center.getExTimeset,
        onload: function (params, data) {
            initTimeset.exlength = data.msg[0];
            $('#msg-timeset').text(data.msg[1]);
        },
        trans: {
            rowindex: function (record, i) { return i + 1 }
        }
    }).load({ exid: x.exid });

    var btn = $('#add-timeset');
    if (editable) {
        btn.click(function () {
            if (!editable) return;
            var win = new gzy.popup('添加场次时间', 360, 145, {
                afterclose: function () {
                    for (var i in gzy.popup.instance) return;
                    $(document.documentElement).addClass('x-border-box');
                },
                onload: function () {
                    $(document.documentElement).removeClass('x-border-box');
                    win.body.load('/scripts/boxes/timeset-add.htm', function () {
                        $('#closeTime').show();
                        $('#intervalTime').hide();
                    });
                },
                buttons: [{
                    text: '保存',
                    click: function () {
                        var values = win.body.find('form').getValues();
                        if (values.start == '' || values.date == '')
                            alert('请填写完整后再试');
                        else
                        center.saveExTimeset(x.exid, values, function (d) {
                            win.close();
                            if (d.ok)
                                grid.load();
                            else
                                alert(d.msg);

                        });
                    }
                }]
            });
        });
    } else {
        btn.addClass('disabled').attr('disabled', true);
    }

    btn = $('#quick-add');
    if (editable) {
        btn.click(function () {
            if (!editable) return;
            var loading;
            var win = new gzy.popup('快速添加场次时间', 360, 145, {
                afterclose: function () {
                    for (var i in gzy.popup.instance) return;
                    $(document.documentElement).addClass('x-border-box');
                },
                onload: function () {
                    $(document.documentElement).removeClass('x-border-box');
                    win.body.load('/scripts/boxes/timeset-add.htm', function () {
                        $('#closeTime').hide();
                        $('#intervalTime').show();
                        $('#interval').numberBox({ "max": 10000, "min": 1, "step": 10 })
                    });
                },
                buttons: [{
                    text: '确定',
                    click: function () {
                        var values = win.body.find('form').getValues();
                        if (values.start == '' || values.date == '' || values.interval == '')
                            alert('请填写完整后再试');
                        else {
                            loading = showLoding('请稍候...');
                            center.quickAddTimeSet(x.exid, values, function (d) {
                                loading.close();
                                win.close();
                                if (d.ok)
                                    grid.load();
                                else
                                    alert(d.msg);

                            });
                        }
                    }
                }]
            });
        });
    } else {
        btn.addClass('disabled').attr('disabled', true);
    }
};

function initSubScoreInfo(x) {
    $('input[name="exid"]').val(x.exid);
    var grid = new DataGrid({
        columns: ['人行名称', '导入状态','已导入/总数'],
        cells: ['{orgName}', '{importState}', new DataGrid.Button({
            text: function (data) {
                return '<label>' + data.importedCount + '/' + data.studentsCount + '</label>';
            }
            
        })
        ],
        table: '#subScorelist-orgs',
        params: { exid: x.exid, state: 0 },
        source: center.getSubScoreSubmitInfo
    }).showBodyMsg('没有人行信息');
    grid.load({ exid: x.exid, state: 0 });

    $('#subScoreImportStateSelector').change(function () {
        grid.load({ exid: x.exid, state: $(this).val() });
    });

};

function initOrgAudit(x) {

    $('input[name="exid"]').val(x.exid);

    var grid = new DataGrid({
        columns: ['人行名称', '报考人数', '缴费标志', '审核'],
        cells: ['{orgName}', '{studentsCount}',
            new DataGrid.Button({
                text: function (data) {
                    if (data.payed) {
                        return '已缴费';
                    }
                    else {
                        return '未缴费'
                    }
                }
            }),
            new DataGrid.Button({
                text: function (data) {
                    if (data.passed == 1) {
                        return '已审核入库';
                    }
                    else if (data.passed == 2) {
                        return '已退回'
                    }
                    else {
                        return '<a submitInfoId="' + data.id + '" pass="true" name="orgAuditInfo" href="javascript:;">通过</a>&nbsp;&nbsp;&nbsp;<a submitInfoId="' + data.id + '" href="javascript:;" pass="false" name="orgAuditInfo">退回</a>'
                    }
                }
            })
        ],
        table: '#list-orgs',
        params: { exid: x.exid },
        source: center.getOrgSubmitInfo
    }).showBodyMsg('没有人行提交报名信息');

    refreshOrgSubmitInfos(grid, x.exid);

    $('#paySelector,#passSelector').change(function () {
        refreshOrgSubmitInfos(grid, x.exid);
    });

    $('#list-orgs').on('click', 'a[name="orgAuditInfo"]', function () {
        var id = $(this).attr('submitInfoId');
        var pass = $(this).attr('pass') == 'true';
        if (!pass || confirm('审核通过后该人行将不能再进行修改，确定要通过审核吗？')) {
            var loading = showLoding('正在审核并导入数据,请稍候');
            center.auditOrgSubmit(id, pass, function (result) {
                loading.close();
                if (result.ok) {
                    refreshOrgSubmitInfos(grid, x.exid);
                }
                else
                    alert(result.msg);
            });
        }
    });

    $('#upframe').load(function (d) {
        var res = $.trim(this.contentWindow.document.body.innerHTML);
        if (!res) return;
        res = $.parseJSON(res);
        if (res.ok) {
            grid.load();
        }
        alert(res.msg);
        var obj = document.getElementById('import-fee');
        obj.outerHTML = obj.outerHTML;
    });

    $('#exportAuditInfo').click(function () {
        center.exportAuditInfo(x.exid, function (d) {
            $('#upframe').attr('src', d.data.filename);
        });
    });
};

function refreshOrgSubmitInfos(grid,exid) {
    var payed = $('#paySelector').val();
    if (payed == "")
        payed = null;
    else if (payed == "1") {
        payed = true;

    }
    else
        payed = false;

    var passed = $('#passSelector').val();
    if (passed == "")
        passed = null;

    grid.load({exid:exid, payed: payed, passed: passed });
};



function initRoomset(x) {
    var grid = new DataGrid({
        columns: ['准考证号', '姓名', '身份证号', '单位', '考点', '考场', '场次安排'],
        cells: ['{kaohao}', '{name}', '{pn}', '{name}', '{school}', '{point}', '{room}', '{round}'],
        table: '#list-roomset',
        params: { exid: x.exid, schoolId: 0, pagesize: 10 }
    }).showBodyMsg('<--请从左侧选择一个考点来查看安排在该考点的考生');

    $('#autoArrange').click(function () {
        if (editable)
            center.autoArrange(x, function (d) {
                if (d.ok) {
                    location.reload();
                } else {
                    alert(d.msg);
                }
            });
    });

    $('#arrangementToExcel').click(function () {
        if (editable) {
            var lodaing = showLoding('正在导出，请稍候');
            center.exportAllExamInfo({ exid: x.exid, needPassword: false }, function (d) {
                lodaing.close();
                if (d.ok) {
                    $('#iframe-download')[0].contentWindow.location = d.data.filename.replace('\\', '/');
                }
                else
                    alert('导出失败！失败原因：' + d.msg);
            });

        }
    });
    

    var tree = new gzy.tree({
        sourceType: 'json',
        //connector: { url: center.getExSchoolTree, params: { exid: x.exid, noschool: false, flag: false } },
        onselect: function (item) {
            grid.load(item.leaf ? { schoolId: item.id, pageindex: 1 } : { area: item.id, pageindex: 1 });
        }
    });//.renderTo('#s-tree');

    if (!editable) $('button.common').attr('disabled', true).addClass('disabled');

    $('#switch-source a').tabset(null, {
        changed: function (c) {
            tree.connector = {
                url: c.index ? center.getExSchoolTree : center.getSchoolTree,
                params: { exid: x.exid, noschool: false, flag: false },
                loading: function (data) {
                    //if (c.index == 0)
                        data.items = $.grep(data.items, function (item) { return !!item.extra || (c.index && item.leaf)});
                    //if (c.index == 1)
                    //    data.items = $.grep(data.items, function (item) { return !!item.extra || item.leaf });
                }
            };
            tree.renderTo($('#s-tree').empty());
            grid.source = c.index ? center.getExRoomset : center.getSchoolset;
            grid.load({ pageindex: 1 });
        }
    });
};
function initSearch(x) {
    var grid = new DataGrid({
        columns: ['场次编号', '考场', '日期', '开始', '结束', '人数'],
        cells: ['{id}', '{room}', '{date}', '{start}', '{end}', '{count}'],
        table: '#list-schedule',
        params: { exid: x.exid, pagesize: 10 },
        source: center.getSchedules
    }).showBodyMsg('<--请从左侧选择一个考点来查看该考点内的考务安排');

    var tree = new gzy.tree({
        sourceType: 'json',
        connector: {
            url: center.getExSchoolTree,
            params: { exid: x.exid, noschool: false, flag: false },
            loading: function (data) {
                data.items = $.grep(data.items, function (item) { return !!item.extra || item.leaf });
            }
        },
        onselect: function (item) { grid.load({ schoolId: item.id, pageindex: 1 }) }
    }).renderTo('#s-tree');
};
function initResultdata(x) {
    dataPackage(2, x);
};

function initOverView(x) {
    $('#infoTable').toggle(false);
    var grid = new DataGrid({
        columns: ['身份证号', '姓名', '考点', '考场', '场次', '备注'],
        cells: ['<a href="javascript:;" title="单击查看{name}的操作日志" onclick="showLog(' + x.exid + ',{id})" >{pn}</a>', '{name}', '{point}', '{room}', '{round}', '{Remarks}'],
        table: '#stuResult',
        params: { pagesize: 10, pageindex: 1, examId: x.exid },
        source: center.getStuExamInfo
    });

    center.getExamCenters({ examId: x.exid }, function (data) {
        $('#exCenterSel').empty();
        $('<option value="-1">所有考点</option>').appendTo('#exCenterSel');
        $.each(data, function (i, item) {
            $('<option value="' + item.Key + '">' + item.Value + '</option>').appendTo('#exCenterSel');
        });
    });
    center.getOverViewInfo(x.exid, function (data) {
        $('#centerCount').html(data.centerCount);
        $('#roomCount').html(data.examRoomCount);
        $('#sessionCount').html(data.sessionTimeCount);
        $('#sessionTimeCount').html(data.examRoomCount);
        $('#studentCount').html(data.examstudentCount);
        $('#downloadedCount').html(data.downloadedCount);
        $('#generatedCount').html(data.generatedCount);
        $('#uploadedCount').html(data.uploadedCount);
        $('#importedCount').html(data.importedCount);
        $('#absentCount').html(data.absentCount);
        $('#cheatCount').html(data.cheatCount);
        $('#manualSubmitCount').html(data.manualSubmitCount);
        $('#autoSubmitCount').html(data.autoSubmit);
        $('#delayCount').html(data.delayCount);
        $('#overView_loading').toggle(false);
        $('#infoTable').slideDown(1500);
    });
    $('#infoContainer').click(function () {
        $('#infoTable').slideToggle(300, function () {
            if ($('#infoTable').css('display') != 'none')
                $('#infoContainer').attr('title', '点击收起');
            else
                $('#infoContainer').attr('title', '点击展开');
        });
    }).attr('title', '点击收起');

    $('#absentCount').click(function () {
        var loading = showLoding('正在导出，请稍候...');
        center.exportStuExamInfo(x.exid, -1, true, '', 0, 0, function (result) {
            loading.close();
            if (result.ok)
                location.replace('/temp/' + result.data);
            else
                alert('导出失败\n' + result.msg);
        });
    });


    grid.load({ examCenterId: -1, keyWords: null, examState: $('#examState').val(), handInState: $('#handInState').val() });

    $('.overView_resultInfo select').change(function () {
        refreshExamLog(grid);
    });
    $('#keywords').keyup(function () {
        refreshExamLog(grid);
    });

};

function refreshExamLog(grid) {
    grid.load({ examCenterId: $('#exCenterSel').val(), keyWords: $('#keywords').val(), examState: $('#examState').val(), handInState: $('#handInState').val() });
};

function showLog(examId, userId) {
    var win = new gzy.popup('查看操作日志', 600, 450, {
        html: '<table id="showlogs" class="list" cellpadding="0" cellspacing="0"></table>',
        afterclose: function () {
            for (var i in gzy.popup.instance) return;
            $(document.documentElement).addClass('x-border-box');
        },
        onload: function () {
            $(document.documentElement).removeClass('x-border-box');
            var grid = new DataGrid({
                columns: [{ text: '时间', width: 150 }, { text: '操作', width: 80 }, '内容'],
                cells: ['{time}', '{type}', '{content}'],
                table: '#showlogs',
                params: { examId: examId, userId: userId },
                source: center.getExamLog
            });
            grid.load();
        }
    });
};