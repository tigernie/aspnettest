/// <reference path="PopWindow/gzy.popup.js" />
/// <reference path="jquery-1.7.min.js" />
/// <reference path="lib/problib.js" />
/// <reference path="lib/scheme.js" />
/// <reference path="TabSet/gzy.tabset.v3.js" />
/// <reference path="lib/teacher.js" />

var main;
$.readyH(function (h, x) {

    if ($('.slu_List').length > 0) {
        teacher.getMyInfo(function () {

            if (!user.$(23)) $('.mtabs li:eq(0),#for_slution').disable();
            if (!user.$(24)) $('.mtabs li:eq(1),#for_papers').disable();

            main = $('.mtabs li:not(.disabled)').tabset('#mpanels>div:not(.disabled)', {
                defaultTab: x.tab || 0,
                changed: function (c) {
                    h.set({ tab: c.index });

                    switch (c.tab.attr('xml:lang')) {
                        case 'params':
                            if (!c.init) c.init = RandomPaperTab_Click();
                            c.init.load();
                            break;
                        case 'papers':
                            if (!c.init) c.init = PaperMgr_Click();
                            c.init.load();
                            break;
                    }
                }
            });

            function RandomPaperTab_Click() {
                var mygrid;
                return mygrid = new DataGrid({
                    columns: [
                        { text: '序号', width: 60 },
                        { text: '方案名称' },
                        { text: '出卷类型', width: 100 },
                        { text: '出卷人', width: 100 },
                        { text: '创建时间', width: 150 },
                        { text: '使用次数', width: 60 },
                        { text: '操作', width: 100 }
                    ],
                    table: '#slutions',
                    cells: [
                        '{id}',
                        new DataGrid.Button({
                            text: '{name}',
                            click: function (e) {
                                showInfo('random', e.data.id);
                            }
                        }),
                        '{type.name}',
                        '{creator}',
                        '{time}',
                        '{used}',
                        [new DataGrid.Button({
                            disabled: function (data) { return !(user.$(13) || user.id === this.createrId) },
                            cls: 'icon edit',
                            icon: 'images/blank.gif',
                            click: function (e) { params.edit(e.data.id, e.data.type.id) }
                        }), new DataGrid.Button({
                            disabled: function (data) { return !(user.$(13) || user.id === this.createrId) },
                            cls: 'icon delete',
                            icon: 'images/blank.gif',
                            click: function showConfirm(e) {
                                uic.confirm('你确定删除吗？', function () {
                                    scheme.remove('param', e.data.id, function (d) {
                                        if (d.ok) mygrid.deleteRow(e.row);
                                        else d.msg && alert(d.msg);
                                    });
                                }, e.src.rect(), 150, true);
                            }
                        })]
                    ],
                    source: scheme.getSchemeList,
                    params: { pagesize: 15, type: '', keyword: '', pageindex: 1 },
                    pagerMsg: '共有 {total} 个方案'
                });
            }

            function PaperMgr_Click() {
                var mygrid;
                return mygrid = new DataGrid({
                    table: '#papers',
                    columns: [
                        { text: '序号', width: 60 },
                        '试卷名称',
                        { text: '试卷类型', width: 100 },
                        { text: '出卷人', width: 100 },
                        { text: '创建时间', width: 150 },
                        { text: '使用次数', width: 60 },
                        { text: '操作', width: 100 }
                    ],
                    cells: [
                        '{id}',
                        new DataGrid.Button({
                            text: '{name}',
                            click: function (e) {
                                ShowPaperInfo(e.data.id);
                            }
                        }),
                        '{type.name}',
                        '{creator}',
                        '{time}',
                        '{used}',
                        [new DataGrid.Button({
                            disabled: function (data) { return !(user.$(15) || user.id === this.createrId) },
                            cls: 'icon preview',
                            icon: 'images/blank.gif',
                            click: function (e) { GetPaperProblems(e.data.id, e.data.type.id == 2, new Function) }
                        }), new DataGrid.Button({
                            disabled: function (data) { return !(user.$(15) || user.id === this.createrId) },
                            cls: 'icon download',
                            icon: 'images/blank.gif',
                            click: function (e) { download(e.data.id) }
                        }), new DataGrid.Button({
                            disabled: function (data) { return !(user.$(15) || user.id === this.createrId) },
                            cls: 'icon delete',
                            icon: 'images/blank.gif',
                            click: function showConfirm(e) {
                                uic.confirm('你确定删除吗？', function () {
                                    scheme.remove(e.data.type.id == 2 ? 'paper' : 'uni', e.data.id, function (d) {
                                        if (d.ok) mygrid.deleteRow(e.row);
                                        else d.msg && alert(d.msg);
                                    });
                                }, e.src.rect(), 150, true);
                            }
                        })]
                    ],
                    source: scheme.getPaperList,
                    params: { pagesize: 15, type: '', keyword: '', pageindex: 1 },
                    pagerMsg: '共有 {total} 份试卷'
                });
            }

            $("#s_b1,#s_b2").change(function () {
                main.current.init.load({ type: this.value, pageindex: 1 });
            });

            $("#b1,#b2").click(function () {
                main.current.init.load({ type: $("#s_" + this.id).val(), keyword: $('#k_' + this.id).val(), pageindex: 1 });
                return false;
            });

            $('#add_pro').click(function () { params.edit(0, 1) });
            $("#add_normal").click(function () { params.edit(0, 2) });
            $("#add_quick").click(function () { params.edit(0, 3) });
            $("#addnew").click(function () { addPaper('') });
        }
        );
    }
});

function showBtn(tabIndex) {
    if (tabIndex == 1) {
        $('#cmd1').show();
        $('#cmd3').hide();
    }
    else if (tabIndex == 2) {
    }
    else if (tabIndex == 3) {
        $('#cmd1').hide();
        $('#cmd3').show();
    }
}

function addPaper(id) {
    if (id == '')
        createPaper(function () {
            $("#RefreshButton").click();
        
        });
}


function download(id)
{
    var type=2, printType=2;
    var html = '<div id="downloadType"><span class="downloadTitle">试卷类别:</span><span><input type="radio" value="2" checked="checked" name="type" />学生卷</span><span><input type="radio" value="4" name="type" />教师卷</span><span><input type="radio" value="5" name="type" />带编辑格式的试卷</span><br/>\
                <span class="downloadTitle">打印方式:</span><span><input type="radio" value="1"  name="printType" id = "sprint" />单面打印</span><span><input id="dprint" type="radio" value="2" checked="checked" name="printType" />双面打印</span>\
                </div><div style="width:100%;text-align:center;" id="downloadArea"><a class="btn" target="_blank" id="download" href=""><img src=\"/images/down.png\" title=\"下载\" />下载</a></div>';
    var downloadWin = new gzy.popup('下载试卷', 460, 140, {
        html: html
    });
    //$('#download').attr('href', '?action=download&id=' + id + '&type=2&printType=2');
    $('#downloadType input[type=radio]').change(function () {
        if ($(this).attr("checked") == "checked") {
            if ($(this).attr("name") == "type") {
                type = $(this).val();
                if (type != 2) {
                    $('#sprint').attr("checked", "checked");
                    $('input[name=printType]').attr("disabled", true);
                }
                else {
                    $('input[name=printType]').attr("disabled", false);
                    $('#dprint').attr("checked", "checked");
                }
            }
            else
                printType = $(this).val();
        }
        $('#download').attr('href', 'scheme.ashx?action=download&id=' + id + '&type=' + type + '&printType=' + printType);
    }).change();
}


function Init_Select(type) {
    if (type == 1)//随机卷
        $("#PaperTypeSelect").html("<option value=\"\">所有类型</option><option value=\"0\">快速组卷</option><option value=\"1\">专业组卷</option><option value=\"2\">常规组卷</option>");
    else
        $("#PaperTypeSelect").html("<option value=\"\">所有类型</option><option value=\"1\">套卷</option><option value=\"2\">生成卷</option>");
    //$("#SelectIndex").val('');
}


    function showConfirm(e) {
        var result = false;
        uic.confirm('你确定删除吗？', function () {
            $.post("ExamSlu.ashx", { "method": "delete", "id": e.data.id },
             function (data) {
                 alert(data.result);
                 $("#RefreshButton").click();
             }, "json");
        }, e.src.rect(), 150, true);
        return false;
    }

    function ShowPaperInfo(id) {
        $.post("ExamSlu.ashx", { "method": "showPaper", "id": id },
             function (data) {
                 if (data.result != "登录已失效") {
                     var htmlStr = "";
                     htmlStr = "<tr><td class=\"title\">试卷名称：</td><td  colspan = \"3\">" + data.result.name + "</td></tr>";
                     htmlStr += "<tr><td class=\"title\">创建时间：</td><td>" + data.result.CreatedTime + "</td><td class=\"title\">使用次数：</td><td >" + data.result.UsedTimes + "次</td></tr>";
                     htmlStr += "<tr><td class=\"title\">试卷编号：</td><td >" + id + "</td><td class=\"title\">出卷人：</td><td >" + data.result.AuthorName + "</td></tr>";
                     htmlStr += "<tr><td class=\"title\">试卷类型：</td><td >" + data.result.PaperType + "</td><td class=\"title\">试卷总分：</td><td >" + data.result.PaperScore + "分</td></tr>";
                     htmlStr += "<tr>";
                     if (data.result.PaperType == "生成卷")
                         htmlStr += "<td class=\"title\">所用组卷方案：</td><td ><a href=\"javascript:showInfo('random'," + data.result.PaperParamSluId + ")\">" + data.result.PaperParamSluName + "</a></td>";
                     htmlStr += "<td class=\"title\">试题：</td><td><a href=\"javascript:GetPaperProblems(" + id + ",false,function(){});\" >查看试题</a></td>";
                     htmlStr = "<table class=\"list\">" + htmlStr + "</table>";
                     new gzy.popup('试卷详细信息', 600, 350, {
                         html: htmlStr
                     });

                 }
                 else {
                     alert(data.result + " \n请重新登录");
                     window.open('/login.htm', '_self');
                 }

             }, "Json");
    }

    function showInfo(paperType, id) {
        var width, height;
        $.post("ExamSlu.ashx", { "method": "show", "id": id, "papertype": paperType },
             function (data) {
                 if (data.result != "登录已失效") {
                     if (paperType == "random") {
                         htmlStr = "<tr><td class=\"title\">方案名称：</td><td  colspan = \"3\">" + data.result.SolutionName + "</td></tr>";
                         htmlStr += "<tr><td class=\"title\">创建时间：</td><td>" + data.result.CreatedTime + "</td><td class=\"title\">使用次数：</td><td >" + data.result.UsedTimes + "次</td></tr>";
                         htmlStr += "<tr><td class=\"title\">方案生成的试卷总分：</td><td >" + data.result.PaperScore + "</td><td class=\"title\">创建者：</td><td >" + data.result.AuthorName + "</td></tr>";
                         htmlStr += "<tr><td class=\"title\">方案类型：</td><td colspan=\"3\" >" + data.result.ParamType + "</td></tr>";
                         if (data.result.ParamType == "常规组卷") {
                             htmlStr += "<tr><td class=\"title\">知识点范围：</td><td colspan=\"3\">" + data.result.kps + "</td></tr><tr><td class=\"title\">题型</td><td colspan=\"3\"><table style=\"width:100%\">";
                             htmlStr += "<tr><td class=\"centerTitle\">题型分布</td><td class=\"centerTitle\">难题</td><td  class=\"centerTitle\">中等题</td><td  class=\"centerTitle\">容易题</td><td class=\"centerTitle\">分值</td></tr>";
                             $.each(data.result.problmeTypeAndDiff, function (index, content) {
                                 htmlStr += "<tr><td>" + content.probTypeName + "</td><td>" + content.hard + "</td><td>" + content.general + "</td><td>" + content.easy + "</td><td>" + content.value + "</td></tr>";

                             });
                             htmlStr += "</table></td>";
                         }
                         else if (data.result.ParamType == "快速组卷") {
                             htmlStr += "<tr><td class=\"title\">知识点范围：</td><td colspan=\"3\">" + data.result.kps + "</td></tr>";
                             htmlStr += "<tr><td class=\"title\">难度比例：</td><td colspan=\"3\">难题：" + data.result.hard + "%,中等题：" + data.result.general + "%,容易题：" + data.result.easy + "</td></tr>";
                             htmlStr += "<tr><td class=\"title\">题型分布：</td><td colspan = \"3\"><table style=\"width:100%\"><tr><td class=\"centerTitle\">题型</td><td class=\"centerTitle\">数量</td><td class=\"centerTitle\">单题分值</td></tr>";
                             $.each(data.result.probType, function (index, content) {
                                 htmlStr += "<tr><td >" + content.probTypeName + "</td>";
                                 htmlStr += "<td >" + content.count + "</td>";
                                 htmlStr += "<td >" + content.value + "</td></tr>";
                             });
                             htmlStr += "</table></td>";
                         }
                         else {

                             htmlStr += "<tr><td class=\"title\">题分误差：</td><td >" + data.result.Accuracy + "分</td></tr>";
                             // UsedTimesAccuracy
                             htmlStr += "<tr><td class=\"title\">难度比例：</td><td >难：" + data.result.Hard + "</td><td >中：" + data.result.General + "</td><td >易：" + data.result.Easy;
                             htmlStr += "<tr><td class=\"title\">题型分布：</td><td  colspan = \"3\">" + data.result.probtypeCountValue + "</td></tr>";
                             htmlStr += "<tr><td class=\"title\">知识点范围：</td><td colspan = \"3\"><table style=\"width:100%\"><tr><td class=\"centerTitle\">知识点</td><td class=\"centerTitle\">题型</td><td class=\"centerTitle\">分值比例</td></tr>";

                             $.each(data.result.kpAndProbType, function (index, content) {
                                 htmlStr += "<tr><td >" + content.kpName + "</td>";
                                 htmlStr += "<td >" + content.protypes + "</td>";
                                 htmlStr += "<td >" + content.penctg + "</td></tr>";
                             });
                             htmlStr += "</table></td>";

                         }
                         width = 650;
                         height = 550;
                     }
                     else {
                         htmlStr = "<tr><td class=\"title\">方案名称：</td><td  colspan = \"3\">" + data.result.SolutionName + "</td></tr>";
                         htmlStr += "<tr><td class=\"title\">创建时间：</td><td >" + data.result.CreatedTime + "</td><td class=\"title\">使用次数：</td><td>" + data.result.UsedTimes + "</td></tr>";
                         htmlStr += "<tr><td class=\"title\">所用试卷类型：</td><td >" + data.result.UniPaperType + "</td><td class=\"title\">出卷人：</td><td >" + data.result.AuthorName + "</td></tr>";

                         var isRandomOrder
                         //if (data.result.IsRandomOrder.toString() == 'True')
                         //    isRandomOrder = "是";
                         //else
                             isRandomOrder = "否";

                         htmlStr += "<tr><td class=\"title\">是否采用随机题序：</td><td >" + isRandomOrder + "</td><td class=\"title\">试卷份数：</td><td >" + data.result.PapersCount + "</td></tr>";
                         htmlStr += "<tr><td class=\"title\">所含试卷：</td><td colspan=\"3\">";

                         $.each(data.result.papersCollection, function (index, content) {
                             htmlStr += "<a href=\"javascript:ShowPaperInfo(" + content.paperid + ");\" >" + content.papername + "</a><br />";
                         });
                         htmlStr += "</td><tr>";
                         width = 550;
                         height = 280;
                     }

                     htmlStr = "<table class=\"list\">" + htmlStr + "</table>";
                     new gzy.popup('方案详细信息', width, height, {
                         html: htmlStr
                     });
                 }
                 else {
                     alert(data.result + " \n请重新登录");
                     window.open('/login.htm', '_self');
                 }

             }, "json");

    }


    var Win;
//id为空串时表示添加方法
    function addUniSlu(id) {
        CreateUniSlu(id, function () {
            Refresh();

        }
        );
    }

    function Refresh() {
        $("#RefreshButton").click();
    
    }





function checkNumValue(input, fv) {
    var v = input.value.replace(/^\s*|\s*$/g, '');
    input.value = v ? isNaN(v) ? fv : parseInt(v) : '';
};

//type: 1=专业组卷
params = {
    samples: [null, {
        id: 0,
        name: "专业组卷方案",
        type: 1,
        data: {
            accuracy: 3,
            difficulty: [70, 20, 10],
            kppriority: true,
            typeRange: [],
            kpRange: [/*[66, [0, 1], 100]*/],
            wrong: false
        }
    }, {
        id: 0,
        name: '常规组卷方案',
        type: 2,
        data: {
            kpids: [/*66, 67*/],
            typeRange: [/*[0, 2, 2, 1, 10], [1, 2, 2, 1, 10]*/],
            wrong: false
        }
    }, {
        id: 0,
        name: '快速组卷方案',
        type: 3,
        data: {
            score: 100,
            kpids: [/*66, 67*/],
            difficulty: [70, 20, 10],
            vague: true,
            wrongPrior: true,
            typeRange: [[0, 20, 2], [1, 10, 2], [2, 4, 10]],
            wrong: false
        }
    }],
    stepTip: [
        ['第一步：设置题型与难度', '第二步：选择知识点范围及题数', '第三步：设置试卷属性 '],
        ['第一步：选择考试范围', '第二步：设置题型及题分', '第三步：设置试卷属性 '],
        ['第一步：选择考试范围', '第二步：设置题型及题分', '第三步：设置试卷属性 ']
    ],
    entity: null,
    edit: function (id, type) {
        //if (!$.browser.msie) return !!alert('该功能目前仅支持IE浏览器使用');

        var step = 1;

        var win = new gzy.popup('组卷方案', 720, 400, {
            html: '<div id="step1"></div><div id="step2"></div><div id="step3"></div>',
            buttons: [
                { label: '', id: 'tip' },
                { text: '上一步', id: 'prev', click: function () { load_ui(step--) } },
                { text: '下一步', id: 'next', click: function () { if (save_data() !== false) load_ui(step++) } },
                { text: '完成', id: 'done', click: function () { if (save_data() !== false) submit_data() }},
                { text: '取消', isCancel: true }
            ],
            onload: function () {
                id ? scheme.getScheme(id, function (d) { params.entity = d.data; load_ui(type = d.data.type) })
                   : load_ui(params.entity = $.extend({}, params.samples[type]))
            }
        });
        
        function load_ui() {
            win.buttons['prev'][0].disabled = step == 1;
            win.buttons['next'][0].disabled = step == 3;
            win.buttons['done'][0].disabled = step != 3;

            win.buttons['tip'].html(params.stepTip[type - 1][step - 1]);
            win.setTitle(['专业组卷', '常规组卷', '快速组卷'][type - 1] + '：' + (id ? params.entity.name : '新建方案'));

            $('#step1,#step2,#step3').hide();
            var div = $('#step' + step).show();
            if (div.html()) load_data(); else div.load('scripts/slices/' + type + '/' + step + '.htm', load_data);
        };
        var tree;
        function load_data() {
            switch (type) {
                case 3: //快速
                    switch (step) {
                        case 1:
                            if (!$.trim($('#kpids').html())) {
                                //$.service(kpoint.getTree, function (x) {
                                //    tree = new gzy.tree({ items: x, multi: true }).renderTo('#kpids').expand(0).pick(params.entity.data.kpids);
                                //});

                                var subjectSelector = $('#subject');
                                subjectSelector.empty();

                                subject.getAllSubjects(function (subjects) {
                                    $.each(subjects, function (i, item) {
                                        subjectSelector.append('<option id="' + item.Id + '">' + item.SubjectName + '</option>');
                                    });
                                    subjectSelector.change(function (selectedSubject) {
                                        var subjectId = subjectSelector.find('option:selected').attr('id');
                                        $('#kpids').empty();
                                        kpoint.getTree(subjectId, function (x) {
                                            tree = new gzy.tree({ items: x, multi: true }).renderTo('#kpids').expand(0).pick(params.entity.data.kpids);
                                        });
                                    });
                                    subjectSelector.change();

                                });

                            }
                                $('#PaperScore').val(params.entity.data.score).numberBox({ max: 100, min: 0, step: 5 });
                                $($.map(params.entity.data.kpids, function (item) { return '#selkp_' + item; }).join(',')).attr('checked', true);
                                $('#txtEasy,#txtMiddle,#txtDiff').each(function (i, box) { box.value = params.entity.data.difficulty[i] }).numberBox({ max: 100, min: 0, step: 5 });
                                $('#vague').attr('checked', params.entity.data.vague);
                                $('#wrongPrior').attr('checked', params.entity.data.wrongPrior);
                            //kpoint.getNodes(function (d) {
                            //    if (d) {
                            //        var kpids = $('#kpids').empty();
                            //        $.each(d.data.rows, function (i, item) {
                            //            kpids.append(String.$('<label><input type="checkbox" name="selkp" id="selkp_{id}" value="{id}"  />{text}</label><br />', item));
                            //        });
                                    
                            //    }
                            //});
                            break;
                        case 2:
                            problem.getTypesAndCountInKps(params.entity.data.kpids, function (d) {
                                if (d) {
                                    var fark = $('#scoreSet').empty();
                                    $.each(d.data.rows, function (i, item) {
                                        fark.append(String.$('<tr><td width="200"><label><input style="margin-top:0" type="checkbox" name="probID" id="probID_{id}" value="{id}" />{name}（共有 {count} 道）</label></td><td id="CL_{id}" disabled="disabled">数量：<input disabled id="probNum_{id}" name="probNum" type="text" value="" size="2" maxlength="2" /> × 题分：<input disabled name="probScore" id="probScore_{id}" value="" type="text" size="2" maxlength="2" /> = 共：<span class="numshow" id="numshow_{id}">--</span> 分</td></tr>', item));
                                    });
                                    $.each(params.entity.data.typeRange, function (i, item) {
                                        $('#probID_' + item[0]).attr('checked', true);
                                        $('#CL_' + item[0]).enable();
                                        $('#probNum_' + item[0]).val(item[1]);
                                        $('#probScore_' + item[0]).val(item[2]);
                                        $('#numshow_' + item[0]).text(item[1] * item[2]);
                                    });
                                    fark.find('input[name=probNum]').change(calc).numberBox({ max: 100, min: 1, step: 1 });
                                    fark.find('input[name=probScore]').change(calc).numberBox({ max: 50, min: 1, step: 1 });
                                    fark.find('input[name=probID]').click(switchEnable);
                                }
                            });
                            break;
                        case 3:
                            $('#paperName').val(params.entity.name);
                            break;
                    }
                    break;
                case 2:
                    switch (step) {
                        case 1:
                              var subjectSelector = $('#subject');
                            subjectSelector.empty();

                            subject.getAllSubjects(function (subjects) {
                                $.each(subjects, function (i, item) {
                                    subjectSelector.append('<option id="' + item.Id + '">' + item.SubjectName + '</option>');
                                });
                                subjectSelector.change(function (selectedSubject) {
                                    var subjectId = subjectSelector.find('option:selected').attr('id');
                                    $('#kpids').empty();
                                    kpoint.getTree(subjectId, function (x) {
                                        tree = new gzy.tree({ items: x, multi: true }).renderTo('#kpids').expand(0).pick(params.entity.data.kpids);
                                    });
                                });
                                subjectSelector.change();

                            });





                                    //$($.map(params.entity.data.kpids, function (item) { return '#selkp_' + item; }).join(',')).attr('checked', true);
                                    $('#step-2-1').setValues({ wrong: [params.entity.data.wrong.toString()] });
                            //kpoint.getNodes(function (d) {
                            //    if (d) {
                            //        var kpids = $('#kpids').empty();
                            //        $.each(d.data.rows, function (i, item) {
                            //            kpids.append(String.$('<label><input type="checkbox" name="selkp" id="selkp_{id}" value="{id}"  />{text}</label><br />', item));
                            //        });
                            //    }
                            //});
                            break;
                        case 2:
                            problem.getDifficultCount(params.entity.data.kpids, function (d) {
                                if (d) {
                                    var fark = $('#fark').empty();
                                    $.each(d.data.rows, function (i, item) {
                                        var row = $(String.$('<tr><td>{2}</td><td>题量:{3}</td><td><select id="easy_{1}"></select></td><td>题量:{4}</td><td><select id="normal_{1}"></select></td><td>题量:{5}</td><td><select id="diffic_{1}"></select></td><td><input type="text" size="2" maxlength="2" id="score_{1}"/>', item)).appendTo(fark);

                                        var ss = $.gf('#easy_{1},#normal_{1},#diffic_{1}', item);
                                        for (var i = 0; i <= Math.min(100, item[2]); i++) ss[0].options.add(new Option(i, i));
                                        for (var i = 0; i <= Math.min(100, item[3]); i++) ss[1].options.add(new Option(i, i));
                                        for (var i = 0; i <= Math.min(100, item[4]); i++) ss[2].options.add(new Option(i, i));
                                    });
                                    
                                    $.each(params.entity.data.typeRange, function (k, item) {
                                        var ss = $.gf('#easy_{1},#normal_{1},#diffic_{1},#score_{1}', item[0]);
                                        for (var i = 0; i < 4; i++) ss[i].value = item[i + 1];
                                    });

                                    fark.find('select,input').change(calc);
                                }
                            });
                            break;
                        case 3:
                            $('#paperName').val(params.entity.name);
                            break;
                    }
                    break;
                case 1:
                    switch (step) {
                        case 1:
                            var mmlist = $('#mmlist').empty();
                            problem.getTypesAndCount(function (d) {
                                $.each(d.data.rows, function (i, item) {
                                    mmlist.append(String.$('<tr>\
                                        <td width="150" class="left" id="ts_td_{id}"><label><input style="margin-top:0" onclick="calc(this);var c=$(\'td:gt(0)\',this.parentNode.parentNode.parentNode);if(this.checked)c.enable();else c.disable()" type="checkbox" name="probType" value="{id}" id="probType_{id}" />{name}（{count}道）</label></td>\
                                        <td class="left disabled" id="pt_td_{id}">题数：<input disabled onblur="checkNumValue(this)" name="probNum" id="probNum_{id}" value="1" type="text" size="2" maxlength="2" onchange="calc(this)" /> × 题分：<input disabled onblur="checkNumValue(this)" name="probScore" id="probScore_{id}" onchange="calc(this)" value="1" type="text" size="2" maxlength="2" /> = 共 <span class="numshow" id="totalScore_{id}">1</span> 分</td>\
                                    </tr>', item));
                                    if (item.count == 0) $('#ts_td_' + item.id).disable();
                                });
                                $('#txtEasy').val(params.entity.data.difficulty[0]).numberBox({max:100,min:0,step:5});
                                $('#txtMiddle').val(params.entity.data.difficulty[1]).numberBox({max:100,min:0,step:5});
                                $('#txtDiff').val(params.entity.data.difficulty[2]).numberBox({max:100,min:0,step:5});
                                $('#accuracy').val(params.entity.data.accuracy).numberBox({ max: 5, min: 0, step: 1 });
                                $('#step-1-1').setValues({ wrong: [params.entity.data.wrong.toString()] } );
                                $.each(params.entity.data.typeRange, function (i, item) {
                                    $('#probType_' + item[0]).attr('checked', true);
                                    $('#probNum_' + item[0]).val(item[1]);
                                    $('#probScore_' + item[0]).val(item[2]);
                                    $('#totalScore_' + item[0]).text(item[1] * item[2]);
                                    $('#pt_td_' + item[0]).enable();
                                });
                                $('input[name=prior]')[params.entity.data.kppriority ? 0 : 1].checked = true;
                                mmlist.find('input[name=probNum]').numberBox({ max: 100, min: 0, step: 1 });
                                mmlist.find('input[name=probScore]').numberBox({ max: 50, min: 0, step: 1 });
                            });
                            
                            break;
                        case 2:
                            //$('#np_3_2_select').click(function () {
                            //    click1($('#fark'), params.entity.data);
                            //});
                            problem.getProblemCountInKP(function (d) {
                                $.each(d.data.rows, function () { hash[this.id] = this });
                                table.empty();
                                if (params.entity.data.kpRange.length == 0) click1();
                                else refresh();
                            });
                            break;
                        case 3:
                            var paperName = $('#paperName').val(params.entity.name);
                            if (params.entity.id > 0) {
                                $('#o_makenew').show();
                                $('#makeNew').click(function () {
                                    if (this.checked) {
                                        paperName.val(params.entity.name.replace(/\d{14}/, '') + new Date().toString('yyyyMMddHHmmss')).select();
                                    } else {
                                        paperName.val(params.entity.name);
                                    }
                                });
                            }
                            break;
                    }
                    break;
            }
        };
        function save_data() {
            switch (type) {
                case 3:
                    switch (step) {
                        case 1:
                            if (tree.checkedAll.length == 0) return !!alert('至少选择一个知识点');
                            params.entity.data.score = $('#PaperScore').intVal();
                            params.entity.data.vague = $('#vague')[0].checked;
                            params.entity.data.wrong = $('#wrong')[0].checked;
                            params.entity.data.difficulty = [$('#txtEasy').intVal(), $('#txtMiddle').intVal(), $('#txtDiff').intVal()];
                            params.entity.data.kpids = tree.checkedAll;// $('#kpids input:checked').map(function (i, x) { return $(x).intVal() }).toArray();
                            break;
                        case 2:
                            params.entity.data.typeRange = $('#scoreSet input:checked').map(function (i, x) {
                                var id = parseInt(x.id.split('_')[1], 10), ss = $.gf('#probNum_{1},#probScore_{1}', id);;
                                return [[id, ss.eq(0).intVal(), ss.eq(1).intVal()]];
                            }).toArray();
                            break;
                        case 3:
                            params.entity.name = $.trim($('#paperName').val());
                            if (!params.entity.name) return !!alert('必须输入方案名');
                            break;
                    }
                    break;
                case 2:
                    switch (step) {
                        case 1:
                            var d = $('#step-2-1').getValues();
                            debugger;
                            if (tree.checkedAll.length == 0) return !!alert('至少选择一个知识点');
                            params.entity.data.kpids = tree.checkedAll;//$('#kpids input:checked').map(function (i, x) { return $(x).intVal() }).toArray();
                            params.entity.data.wrong = d.wrong;
                            break;
                        case 2:
                            params.entity.data.typeRange = $('#fark').find('input[value!=""]').map(function (i, x) {
                                var id = parseInt(x.id.split('_')[1], 10), ss = $.gf('#easy_{1},#normal_{1},#diffic_{1},#score_{1}', id);;
                                return [[id, ss.eq(0).intVal(), ss.eq(1).intVal(), ss.eq(2).intVal(), ss.eq(3).intVal()]];
                            }).toArray();
                            if ($('#TotalScore').text() == '0') return !!alert('方案总分不能为 0');
                            break;
                        case 3:
                            params.entity.name = $.trim($('#paperName').val());
                            if (!params.entity.name) return !!alert('必须输入方案名');
                            break;
                    }
                    break;
                case 1:
                    switch (step) {
                        case 1:
                            var d = $('#step-1-1').getValues();
                            params.entity.data.accuracy = parseInt(d.accuracy);
                            params.entity.data.difficulty = [parseInt(d.txtEasy), parseInt(d.txtMiddle), parseInt(d.txtDiff)];
                            params.entity.data.typeRange = $('input[name=probType]:checked').map(function (i, box) {
                                return [[$(box).intVal(), $('#probNum_' + box.value).intVal(), $('#probScore_' + box.value).intVal()]];
                            }).toArray();
                            params.entity.data.kppriority = d.prior;
                            params.entity.data.wrong = d.wrong;

                            if (params.entity.data.difficulty[0] + params.entity.data.difficulty[1] + params.entity.data.difficulty[2] != 100)
                                return !!alert('难度比例总和应为100');
                            for (var i = 0; i < params.entity.data.typeRange.length; i++) {
                                var range = params.entity.data.typeRange[i];
                                if (isNaN(range[1]) || isNaN(range[2]) || range[1] * range[2] == 0)
                                    return !!alert('有题型被选中但题数或题分为0');
                            }
                            break;
                        case 2:
                            params.entity.data.kpRange = $('input[name=pointId]').map(function (i, box) {
                                return [[$(box).intVal(), $('input[name=sType_' + box.value + ']:checked').map(function (i, sb) {
                                    return [$(sb).intVal()];
                                }).toArray(), $('#typeNum_' + box.value).intVal()]];
                            }).toArray();
                            return check();
                            break;
                        case 3:
                            params.entity.name = $.trim($('#paperName').val());
                            if (!params.entity.name) return !!alert('必须输入方案名');
                            params.entity.id = $('#makeNew').attr('checked') ? -Math.abs(params.entity.id) : Math.abs(params.entity.id);
                            break;
                    }
            }
        };
        function submit_data() {
            var temp = $.extend({}, params.entity);
            var data = temp.data;
            delete temp.data;

            if (data.kpids && data.kpids[0] === 0) data.kpids.shift();
            var loading = showLoding('正在保存方案，请耐心等待');
            scheme.update(temp, data, function (d) {
                if (d.ok) {
                    loading.close();
                    win.close();
                    main.current.init.load({ pageindex: 1 });
                } else {
                    if (d.msg) alert(d.msg);
                    loading.close();
                }
            });
        };
    }
};