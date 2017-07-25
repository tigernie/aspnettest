/// <reference path="../jquery-1.7.min.js" />
/// <reference path="../common.js" />
/// <reference path="../PopWindow/gzy.popup.js" />
/// <reference path="../TabSet/gzy.tabset.v3.js" />
/// <reference path="exam.js" />

var leftTime, lTime, minTime, tTime,
    studentName,
    studentId,
    totalScore,
    totalTime,
    exDesc,
    exName,
    exType,
    qbox,
    types,
    typehelp,
    typeshow,
    questions,
    typeControl,
    question,
    typefield,
    answer,
    viewall,
    qlist,
    nextprev,
    btn_submit,
    cache,
    cats,
    nextcat,
    nextpage,
    pages,
    starter,
    responsed,
    ninfo,
    kTimer;//心跳计时器

$(function () {
    initMyInfo();
});


var enterExamLoding;
function initMyInfo() {

    if (!enterExamLoding)
        enterExamLoding = showLoding('正在加载考试信息...');
    exam.getMyInfo(function (d) {
        if (!d.ok) {
            setTimeout(initMyInfo, 1000);
            return;
        }
        enterExamLoding.close();
        studentId = $('#studentId').text(d.data.studentId);
        studentName = $('#studentName').text(d.data.studentName);
        totalScore = $('#totalScore').text('--');
        totalTime = $('#totalTime').text(d.data.totalTime);
        exDesc = $('#exDesc').html(d.data.exDesc.replace(/\n/g, '<br/>'));
        exName = $('#exName').text('考试名称：' + (document.title = d.data.exName));
        exType = d.data.exType;
        responsed = d.data.responsed;
        minTime = d.data.minTime;
        tTime = d.data.totalTime * 60;

        leftTime = $('#leftTime');
        qbox = $('#qbox');
        questions = $('#questions').empty();
        typeControl = $('#type-control');
        typeshow = $('#typeshow');
        typehelp = $('#typehelp');
        types = $('#types');
        question = $('#question');
        typefield = $('#typefield');
        answer = $('#answer');
        viewall = $('#viewall');
        qlist = $('#qlist');
        nextprev = $('#nextprev');
        btn_submit = $('#btn_submit');
        cache = $('#cache');
        nextcat = $('#nextcat');
        nextpage = $('#nextpage');
        pages = $('#pages');
        starter = $('#starter');

        $('.uinfo').addClass(d.data.isCenterMode + '').fadeIn();

        if (d.data.isCenterMode) {
            $('#b_code').text(d.data.studentId);
            $('#b_name').text(d.data.studentName);
            $('#b_sex').text(d.data.studentSex);
            $('#b_school').text(d.data.studentFrom);
            $('#biginfo').slideDown();
        }

        pages.click(function (e) {
            $(this).find('a').removeClass('current');
            $(e.target).addClass('current');
        });

        $('#return').click(function () {
            location.replace('./');
        });

        $('#frameUp').bind('load', function () {
            try {
                var d = $.parseJSON(this.contentWindow.document.body.innerHTML);
                if (!d.ok) throw d.msg;
                $('#q_' + d.data).addClass('done');
                qdb[d.data].answer = ['true'];
                responsed[d.data] = d.ok ? 1 : 0;
                $('#sman' + d.data + ',#alup' + d.data).toggle();
            } catch (e) {
                alert('提交文件失败\n'+e.message);
            }
        });
        if (d.data.wait > 0) {
            starter.find('span').show();
            (function () {
                d.data.wait--;
                if (!d.data.wait) {
                    starter.find('span,a:first').toggle();
                    lTime = d.data.totalTime * 60;
                    //if (exType) startTimer(minTime);
                } else {
                    starter.find('span>b').text(d.data.wait);
                    setTimeout(arguments.callee, 1000);
                }
            })();
        } else {
            starter.find('a').show();
            lTime = d.data.totalTime * 60 + d.data.wait;
            //debugger;
            //if (exType) startTimer(minTime);
            if (cookie.get('ex_qid')) {
                startExam();
            }
        }
    });
    //}, 1000, showLoding('正在初始化答题界面...'));

    ninfo = $('#ninfo');

};









var started = false;
function startExam() {
    if (!started) loadCategory();
};
function startTimer(mt) { //minTime, totalTime
    var c, t = setInterval(function () {
        //console.log(lTime);
        lTime--;
        leftTime.add('#tLeftTime').html((Math.floor(lTime / 60) + '分').replace(/^0分$/, '') + (lTime < 600 ? ((lTime % 60) + '秒') : '钟'));
        if (lTime < Math.min(1200, parseInt(tTime * .5))) c = 'orange';
        if (lTime < Math.min(600, parseInt(tTime * .25))) c = 'red';
        if (c) leftTime.add('#tLeftTime').css('color', c);
        if (tTime - lTime > mt) btn_submit.css('filter', '');
        if (lTime <= 0) clearInterval(t), submitPaper(1);
    }, 1000);
};
var cs, refresh = true;
function loadCategory() {
    exam.startExam(function (d) {
        if (!d.ok) {
            return alert(d.data);
        }

        started = true;
        //$('#biginfo').slideUp();

        keepState(function () {
            startTimer(minTime);
        });
        kTimer = setInterval(keepState, 10000);

        totalScore.text(d.data[2]);
        responsed = d.data[1];
        cats = d.data[0];

        var start = 0;

        $('#header').animate({ height: '+=35px' }, function () {
            $('#starter,#paper').toggle();
            types.css('visibility', 'visible');
            btn_submit.show();

            $.each(cats, function (i, type) {
                $("<a href=\"javascript:;\">" + type.name + "<span>（共" + type.count + "题，" + type.score + "分）</span></a>").data('range', { type: type.id, start: start, count: type.count }).appendTo($('<li/>').appendTo(types));
                start += type.count;
            });
            cs = $('a', types).tabset(null, {
                manual: function () {
                    //localStorage.removeItem('ex_qid');
                    cookie.set('ex_qid', null);
                },
                changed: function (c) {
                    var type = c.tab.data('range');
                    typeshow.html(c.tab.html());

                    //localStorage.setItem('ex_type', c.index);
                    cookie.set('ex_type', c.index);

                    if (type.type == 6) {
                        typehelp.empty();
                        questions.add(question).add(nextprev).hide();
                        typeControl.add(typefield).show();
                        loadTypeContent(type);
                    } else {
                        typehelp.html('点击下面的题号可切换小题');
                        questions.add(question).add(nextprev).show();
                        typeControl.add(typefield).hide();
                        loadQuestions(type);
                    }
                },
                //defaultTab: localStorage.getItem('ex_type') || 0
                defaultTab: cookie.get('ex_type') || 0
            });
        });
    });
};
var has_unhanded_typed = false, confirm_unhanded_typed = true;
function loadTypeContent(type) {
    cType = type;
    $.service('/exam.asmx/Sample', {index:type.start+1}, function (d) {
        /// <summary>
        /// 传入的数据
        /// &#10;d.seconds:完成时限(秒);0=已提交;
        /// &#10;d.content:提供的题面内容
        /// </summary>
        qdb[type.start] = { answer: null };
        d = d.data;

        if (d.seconds > 0) {
            var span = typeControl.find('span').text(d.seconds);
            typeControl.find('input').click(function (e) {
                has_unhanded_typed = true;
                typer.set(d.content, '');
                var timer = setInterval(function () {
                    span.text(d.seconds--);
                    if (d.seconds < 0) {
                        clearInterval(timer);
                        alert('打字时间到，结果已提交。'), submitTyper(0);
                    }
                }, 1000);
                $(this).unbind(e.type, arguments.callee).val('结束打字').click(function (e) {
                    if (confirm_unhanded_typed && confirm('确定提交打字题？')) {
                        submitTyper(d.seconds);
                    }
                });
            });
        };
        if (responsed[type.start + 1] == 1) {
            typeControl.find('input,span,p').hide();
            typeControl.find('p:last').show();
            typer.set(d.content, d.answer);
            typer.disable();
            typer.check();
        }
    });
};
function submitTyper(seconds, onsubmit) {
    /// <summary>
    /// 提交的数据
    /// &#10;d.seconds:剩余时间(秒)
    /// &#10;d.content:提交打字的结果
    /// </summary>
    //alert(qIndex);
    //alert(typer.get() + seconds);
    submitAnswer({ questionId: { value: cType.start }, seconds: seconds, content: typer.get() }, function () {
        typeControl.find('input,span,p').hide();
        typeControl.find('p:last').show();
        typer.disable();
        onsubmit && onsubmit();
        has_unhanded_typed = false;
    });
};

var startedIndex,
    ts,
    cType;

function loadQuestions(type) {
    questions.empty();
    cType = type;
    startedIndex = type.start;
    for (var i = 0; i < type.count; i++) {
        questions.append($('<li><a id="q_' + (i + cType.start) + '" class="' + (responsed[i + cType.start] ? 'done' : '') + '" href="javascript:;">' + (i + cType.start + 1) + '</a></li>'));
    }
    answer.hide();
    qlist.hide();
    nextprev.show();
    nextprev.find('span').empty();
    dLeft = true;
    ts = $('a', questions).tabset(null, {
        //defaultTab: 'ex_qid' in localStorage ? localStorage.getItem('ex_qid') - startedIndex : 0,
        defaultTab: cookie.get('ex_qid') ? cookie.get('ex_qid') - startedIndex : 0,
        allowReRun: true,
        currentCss: 'doing',
        changed: selectProblem
    });
    nextpage.show();
    //loadMore();
};

var currentQId,
    dLeft = true,
    qdb = [],
    cfirst = true;

function loadQuestion(qIndex, t) {
    var H = $(window).height() - 260 - 90; // 顶部保留，底部保留

    qdb[qIndex] ? displayQuestion() : exam.getProblem(qIndex, displayQuestion);

    function displayQuestion(d) {
        var data = qdb[qIndex] || (qdb[qIndex] = d.data); //本地缓存数据

        var box = qbox.clone(true).removeAttr('id').appendTo(cache.empty()).click(function () {
            $('.qbox.current').removeClass('current');
            this.className = 'qbox current';
            currentQId = parseInt($(this).find('var').text());
            //localStorage.setItem('ex_qid', currentQId - 1);
            cookie.set('ex_qid', currentQId - 1);
        }), dt = box.find('dt');
        box.find('input:hidden').val(qIndex);
        dt.html('<var>' + (qIndex + 1) + '</var>' + unescape(data.content));
        var answer = box.show().find('form');
        if (cType.type !== 5) answer.append('答题：');

        switch (cType.type) {
            case 0:
                $.each(['A', 'B', 'C', 'D', 'E', 'F'].slice(0, data.count), function (i, a) {
                    answer.append('<label for="' + qIndex + '_' + a + '"><input id="' + qIndex + '_' + a + '" type="radio" onclick="form.fireEvent(\'onsubmit\')" name="answer" value="' + a + '"' + (a == data.answer ? ' checked' : '') + '/> ' + a + '</label> ');
                });
                break;

            case 1:
            case 7:
                if (data.answer == null) data.answer = [];
                $.each(['A', 'B', 'C', 'D', 'E', 'F','G','H'].slice(0, data.count), function (i, a) {
                    answer.append('<label for="' + qIndex + '_' + a + '"><input id="' + qIndex + '_' + a + '" type="checkbox" onclick="form.fireEvent(\'onsubmit\')" name="answer" value="' + a + '"' + (data.answer.indexOf(a) > -1 ? ' checked' : '') + '/> ' + a + '</label> ');
                });
                break;

            case 4:
                if (!(data.answer != null&&data.answer instanceof Array)) data.answer = [data.answer];
                //answer.append('<input type="text" style="width:360px;border:solid silver;border-width:0 0 1px" name="answer" onchange="form.fireEvent(\'onsubmit\')" value="' + (data.answer || '') + '" />');
                //break;

            case 5:
                if (data.answer == null) data.answer = [];
                $.each(['一', '二', '三', '四', '五', '六'].slice(0, data.count), function (i, a) {
                    answer.append('<label>第' + a + '空：<input type="text" style="width:360px;border:solid silver;border-width:0 0 1px;margin:4px 0;"  name="answer" onchange="form.fireEvent(\'onsubmit\')" value="' + (data.answer[i] || '') + '"/></label><br/>');
                });
                break;

            case 3:
                answer.append('<label><input type="radio" name="answer" value="1" onclick="form.fireEvent(\'onsubmit\')"' + (data.answer == "1" ? 'checked' : '') + ' />正确</label> ');
                answer.append('<label><input type="radio" name="answer" value="0" onclick="form.fireEvent(\'onsubmit\')"' + (data.answer == "0" ? 'checked' : '') + ' />错误</label> ');
                break;

            case 2:
                if (is_office(data.attach[1]) && is_office(data.attach[2]) && true === data.attach[3]) { // ## 1
                    //上传下载均为同一个OFFICE文件
                    //已添加修改答案
                    answer.html('<div id="sman' + qIndex + '">点文件名开始答题：<a onclick="return openOfficeFile.call(this,false,false,\'' + data.attach[1] + '\',' + qIndex + ')" href="' + exam.getfile + '?index=' + (qIndex + 1) + '" target="_blank">' + data.attach[0].toLowerCase().split(/[\/\\]/).reverse()[0] + '</a></div>\
                        <div id="alup' + qIndex + '"><img src="../images/done-16x16.gif" style="vertical-align:middle;margin-top:-4px"/> 已上传，<a href="javascript:;" onclick="$(\'#alup' + qIndex + ',#sman' + qIndex + '\').toggle()">重新答题</a>，或 <a href="' + exam.getfile + '?arxd=true&index=' + (qIndex + 1) + '" onclick="return openOfficeFile.call(this,false,false,\'' + data.attach[2] + '\',' + qIndex + ')">修改答案</a>。</div>');//
                    $((responsed[qIndex] ? '#sman' : '#alup') + qIndex).hide();
                } else if (is_office(data.attach[1]) && is_office(data.attach[2]) && false === data.attach[3]) { // ## 2
                    //下载OFFICE提交另一个OFFICE文件
                    //已添加修改答案
                    box.find('dd').hide();
                    dt.append('<div class="file"><a href="' + exam.getfile + '?index=' + (qIndex + 1) + '" target="_blank">' + data.attach[0].toLowerCase().split(/[\/\\]/).reverse()[0] + '</a></div>');
                    answer.empty().appendTo(dt).addClass('file').attr('action', 'javascript:;')
                        .append('<div id="sman' + qIndex + '"><a href="javascript:;" onclick="openOfficeFile.call(this,false,true,\'' + data.attach[2] + '\',' + qIndex + ')">答题</a></div>\
                        <div id="alup' + qIndex + '"><img src="../images/done-16x16.gif" style="vertical-align:middle;margin-top:-4px"/> 已上传，<a href="javascript:;" onclick="$(\'#alup' + qIndex + ',#sman' + qIndex + '\').toggle()">重新上传</a>，或 <a href="' + exam.getfile + '?arxd=true&index=' + (qIndex + 1) + '" onclick="return openOfficeFile.call(this,false,false,\'' + data.attach[2] + '\',' + qIndex + ')">修改答案</a>。</div>');
                    $((responsed[qIndex] ? '#sman' : '#alup') + qIndex).hide();
                } else if (is_office(data.attach[1]) && !is_office(data.attach[2]) && false === data.attach[3]) { // ## 3
                    //下载OFFICE提交非OFFICE文件
                    box.find('dd').hide();
                    dt.append('<div class="file"><a onclick="return openOfficeFile.call(this,false,false,\'' + data.attach[1] + '\',' + qIndex + ')" href="' + exam.getfile + '?index=' + (qIndex + 1) + '" target="_blank">' + data.attach[0].toLowerCase().split(/[\/\\]/).reverse()[0] + '</a></div>');
                    answer.empty().appendTo(dt).addClass('file').attr('action', exam.savefile)
                        .append('<div id="sman' + qIndex + '">\
                        <input type="hidden" name="ext" value="' + data.attach[2] + '"/>\
                        <input type="file" name="answer" style="vertical-align:middle;height:23px;border:1px solid silver;margin-top:-4px;width:250px" />\
                        <input type="hidden" name="index" value="' + (qIndex + 1) + '" />\
                        <input type="image" src="../images/exam.upload.gif" style="vertical-align:middle;margin-top:-4px" /></div>\
                        <div id="alup' + qIndex + '"><img src="../images/done-16x16.gif" style="vertical-align:middle;margin-top:-4px"/> 已上传，如需修改请 <a href="javascript:;" onclick="$(\'#alup' + qIndex + ',#sman' + qIndex + '\').toggle()">重新上传</a>。</div>');
                    answer.after('<div style="font-size:12px;margin:15px 0 -15px;color:gray;text-align:center">上传文件的大小不能超过<b>25M</b>，本题要求上传类型为<b>' + data.attach[2].toUpperCase() + '</b>的文件</div>');
                    $((responsed[qIndex] ? '#sman' : '#alup') + qIndex).hide();
                } else if (!data.attach[0] && is_office(data.attach[2]) && false === data.attach[3]) { // ## 4
                    //无下载, 新建OFFICE上传
                    //已添加修改答案
                    answer//.empty().appendTo(dt).addClass('file').attr('action', 'javascript:;')
                        .html('<div id="sman' + qIndex + '"><a href="javascript:;" onclick="openOfficeFile.call(this,false,true,\'' + data.attach[2] + '\',' + qIndex + ')">点这里开始答题</a></div>\
                        <div id="alup' + qIndex + '"><img src="../images/done-16x16.gif" style="vertical-align:middle;margin-top:-4px"/> 已上传，如需修改请 <a href="javascript:;" onclick="$(\'#alup' + qIndex + ',#sman' + qIndex + '\').toggle()">重新答题</a>，或 <a href="' + exam.getfile + '?arxd=true&index=' + (qIndex + 1) + '" onclick="return openOfficeFile.call(this,false,false,\'' + data.attach[2] + '\',' + qIndex + ')">修改答案</a>。</div>');
                    $((responsed[qIndex] ? '#sman' : '#alup') + qIndex).hide();
                } else if (!data.attach[0] && !is_office(data.attach[2]) && false === data.attach[3]) { // ## 5
                    //无下载, 上传其他文件
                    box.find('dd').hide();
                    answer.empty().appendTo(dt).addClass('file single').attr('action', exam.savefile)
                        .append('<div id="sman' + qIndex + '">\
                        <input type="hidden" name="ext" value="' + data.attach[2] + '"/>\
                        <input type="file" name="answer" style="vertical-align:middle;height:23px;border:1px solid silver;margin-top:-4px;width:250px" />\
                        <input type="hidden" name="index" value="' + (qIndex + 1) + '" />\
                        <input type="image" src="../images/exam.upload.gif" style="vertical-align:middle;margin-top:-4px" /></div>\
                        <div id="alup' + qIndex + '"><img src="../images/done-16x16.gif" style="vertical-align:middle;margin-top:-4px"/> 已上传，如需修改请 <a href="javascript:;" onclick="$(\'#alup' + qIndex + ',#sman' + qIndex + '\').toggle()">重新上传</a>。</div>');
                    answer.after('<div style="font-size:12px;margin:15px 0 -15px;color:gray;text-align:center">上传文件的大小不能超过<b>25M</b>，本题要求上传类型为<b>' + data.attach[2].toUpperCase() + '</b>的文件</div>');
                    $((responsed[qIndex] ? '#sman' : '#alup') + qIndex).hide();
                } else if (!is_office(data.attach[1]) && is_office(data.attach[2]) && false === data.attach[3]) { // ## 6
                    //下载非OFFICE, 提交OFFICE文件
                    //已添加修改答案
                    box.find('dd').hide();
                    dt.append('<div class="file"><a href="' + exam.getfile + '?index=' + (qIndex + 1) + '" target="_blank">' + data.attach[0].toLowerCase().split(/[\/\\]/).reverse()[0] + '</a></div>');
                    answer.empty().appendTo(dt).addClass('file').attr('action', 'javascript:;')
                        .append('<div id="sman' + qIndex + '"><a href="javascript:;" onclick="openOfficeFile.call(this,true,true,\'' + data.attach[2] + '\',' + qIndex + ')">答题</a></div>\
                        <div id="alup' + qIndex + '"><img src="../images/done-16x16.gif" style="vertical-align:middle;margin-top:-4px"/> 已上传，<a href="javascript:;" onclick="$(\'#alup' + qIndex + ',#sman' + qIndex + '\').toggle()">重新答题</a>，或 <a href="' + exam.getfile + '?arxd=true&index=' + (qIndex + 1) + '" onclick="return openOfficeFile.call(this,false,false,\'' + data.attach[2] + '\',' + qIndex + ')">修改答案</a>。</div>');
                    $((responsed[qIndex] ? '#sman' : '#alup') + qIndex).hide();
                } else if (!is_office(data.attach[1]) && !is_office(data.attach[2])) { // ## 7
                    //上传和下载均非OFFICE
                    box.find('dd').hide();
                    data.attach[0] && dt.append('<div class="file"><a href="' + exam.getfile + '?index=' + (qIndex + 1) + '" target="_blank">' + data.attach[0].toLowerCase().split(/[\/\\]/).reverse()[0] + '</a></div>');
                    answer.empty().appendTo(dt).addClass('file').attr('action', exam.savefile)
                        .append('<div id="sman' + qIndex + '">\
                        <input type="hidden" name="ext" value="' + data.attach[2] + '"/>\
                        <input type="file" name="answer" style="vertical-align:middle;height:23px;border:1px solid silver;margin-top:-4px;width:250px" />\
                        <input type="hidden" name="index" value="' + (qIndex + 1) + '" />\
                        <input type="image" src="../images/exam.upload.gif" style="vertical-align:middle;margin-top:-4px" /></div>\
                        <div id="alup' + qIndex + '"><img src="../images/done-16x16.gif" style="vertical-align:middle;margin-top:-4px"/> 已上传，如需修改请 <a href="javascript:;" onclick="$(\'#alup' + qIndex + ',#sman' + qIndex + '\').toggle()">重新上传</a>。</div>');
                    answer.after('<div style="font-size:12px;margin:15px 0 -15px;color:gray;text-align:center">上传文件的大小不能超过<b>25M</b>，本题要求上传类型为<b>' + data.attach[2].toUpperCase() + '</b>的文件</div>');
                    $((responsed[qIndex] ? '#sman' : '#alup') + qIndex).hide();
                }
                break;
        }

        var td, bh = box.height();
        if (dLeft) { //如果放到左列
            td = question.find('td[align=left] > div'); //指定左列容器
            if (!!$.trim(td.html()) && td.height() + bh > H) dLeft = false; //如果左侧不为空并且高度将超过，则放到右列
        }
        if (!dLeft) { //如果放到右列
            td = question.find('td[align=right] > div'); //指定右列容器
            if (!!$.trim(td.html()) && td.height() + bh > H) dLeft = null; //如果右侧不为空并且高度将超过，则终止显示题目
        }
        if (dLeft === null) { //如果本页终止
            if (qIndex - 1 !== cType.count + cType.start) { //如果没有达到最后一题则需要显示翻页
                var fnd = nextprev.find('a[href^="javascript:\/\/' + (startedIndex + 1) + '-"]');
                if (fnd.length) {
                    pages.click(), fnd.addClass('current');
                } else if (t === undefined) {
                    pages.click().append('<a class="current" onclick="loadMore(startedIndex=' + startedIndex + ')" href="javascript:\/\/' + (startedIndex + 1) + '-' + qIndex + '">第 ' + (startedIndex + 1) + '-' + qIndex + ' 题</a>');
                }
                startedIndex = qIndex;
                nextcat.hide();
                nextpage.show();
            }
            loadEnd();
        }
        else {
            td.append(box); //显示题目
            if (qIndex + 1 < cType.count + cType.start) { //如果没有达到最后一题则需要继续加载题目
                loadQuestion(qIndex + 1, t); //加载下一题
            } else { //已经达到最后一题，隐藏“下一页”
                var fnd = nextprev.find('a[href^="javascript:\/\/' + (startedIndex + 1) + '-"]');
                if (fnd.length) {
                    pages.click(), fnd.addClass('current');
                } else if (t === undefined) {
                    pages.click().append('<a class="current" onclick="loadMore(startedIndex=' + startedIndex + ')" href="javascript:\/\/' + (startedIndex + 1) + '-' + (qIndex + 1) + '">第 ' + (startedIndex == qIndex ? qIndex + 1 : ((startedIndex + 1) + '-' + (qIndex + 1))) + ' 题</a>');
                }
                nextpage.hide();
                if (cs.current.index + 1 < cs.tabs.length) nextcat.show(); else nextcat.hide();
                loadEnd();
            }
        }
    }
};

function initOffice() {
   // alert('ok');
    try {
        //  document.all.office.DocType = 11;
       // if (document.all.office.Is2007 != 1) {
        document.all.office.LoadOriginalFile('', 'doc');
        office.CloseDoc(0);
    //    }
       // document.all.office.CloseDoc(2);
      //  document.all.office.Close();
    }
    catch (e) { }
};
function is_office(ext) {
    if (ext) {
        ext = ext.toLowerCase();
        if (ext.indexOf('doc') > -1) return 11;
        if (ext.indexOf('xls') > -1) return 12;
        if (ext.indexOf('ppt') > -1) return 13;
    }
    return 0;
};
var no_confirm_close, current_ext, has_unhanded_office = false;
function openOfficeFile(toolbar, cannew, ext, index) {
    var url = cannew === true ? '' : this.href,
        doctype,
        ext = ext.split(',')[0];

    current_ext = ext;

    if (doctype = is_office(ext)) {
        var pp = new gzy.popup('OFFICE答题窗口 --**如果没有出现OFFICE窗口, 请关闭此小窗口再重新打开.**--', 800, 600, {
            element: office,
            onload: function () {
                has_unhanded_office = true;

                office.style.display = 'none';
                no_confirm_close = false;
                try {
                    office.CloseDoc(0);
                    office.DocType = doctype;
                }
                catch (e) {
                }
                office.SetSecurity(0x01);
                //office.OptionFlag |= 0x0400;
                //office.OptionFlag |= 0x0080;
                office.ShowToolBar = toolbar !== false;
                
                office.HideMenuItem(0x01);//隐藏新建
                //office.HideMenuItem(0x02);//隐藏打开
                office.HideMenuItem(0x04);//隐藏保存
                office.HideMenuItem(0x10);//隐藏打印
                office.HideMenuItem(0x20);//隐藏打印预览
                office.HideMenuItem(0x1000);//隐藏"全屏"
                office.HideMenuItem(0x4000);//隐藏"显示/隐藏菜单"

                $.delay(function (loading) {
                    office.LoadOriginalFile(url, ext);
                    pp.setRect({ width: '+=' + (screen.width > 1024 ? 300 : 200), left: '-=' + (screen.width > 1024 ? 150 : 100) }, function () {
                        $('<div class="ocxLeft ' + (screen.width > 1024 ? 'wide' : 'narrow') + '" style="">'
                            + '<div id="ocxLeft"><button onclick="saveAndSubmit()"></button></div>'
                            + '剩余时间：<span id="tLeftTime"/>'
                            + '</div>')
                            .prependTo(pp.body).append('<fieldset><legend>做题要求</legend><div>' + qdb[index].content + '</div></fieldset>');
                        loading.close();
                        office.style.display = '';
                    });
                }, 100, showLoding('正在启动程序，请稍候...'));
            },
            onclose: function () {
                if (no_confirm_close || confirm('确定关闭试题窗口？\n\n如果还没有提交答案，请点“取消”，然后点上面的“保存并提交答案”按钮提交答案。')) {
                    office.CloseDoc(0);
                    office.Close();
                    has_unhanded_office = false;
                } else return false;
            }
        });
        return false;
    }
};
function saveAndSubmit() {
    NotifyToolBarClick.call(office, 32772);
};
function NotifyToolBarClick(cmd) {
    if (cmd == 32772) {
        this.HttpInit();
        this.HttpAddPostString('index', currentQId);
        this.HttpAddPostCurrFile("answer", "answer");
        try {
            var d = $.parseJSON(this.HttpPost(exam.savefile));
            qdb[d.data].answer = ['true'];
            responsed[d.data] = d.ok ? 1 : 0;
            no_confirm_close = true;
            gzy.popup.close();
            $.delay(function (i) {
                $('#q_' + i).addClass('done');
                $('#sman' + i).hide();
                $('#alup' + i).show();
            }, 500, d.data);
        } catch (e) {
            alert('提交失败，请关闭重试或刷新重做。如果仍然遇到问题，请申请换机继续做题。');
        }
        this.lEventRet = 0;
    }
};
function loadEnd() {

};
function loadMore(t) {
    question.show().find('td').html('<div/>');
    dLeft = true;
    loadQuestion(startedIndex, t);
};
function loadNextCat() {
    cookie.set('ex_type', cs.current.index + 1);
    cookie.set('ex_qid', null);
    cs.show(cs.current.index + 1);
};

function selectProblem(ox) {
    if (nextprev.find('a').filter(function (i, a) {
        var r = a.href.match(/(\d+)-(\d+)/);
        if (r && r[1] <= (ts.current.index + 1 + cType.start) && (ts.current.index + 1 + cType.start) <= r[2]) return true;
    }).click().length == 0) {
        loadEnd = function () { setTimeout(function () { selectProblem(ox) }, 200) };
        loadMore(), questions.find('a').removeClass('doing');
    }
    else {
        loadEnd = function () { };
        shake(ox.index + cType.start);
    }
};
function shake(index) {
    //localStorage.setItem('ex_qid', index);
    cookie.set('ex_qid', index);
    var i = 1, b = question.find('var').filter(function (i, x) { return $(x).text() == index + 1 });
    if (b.length) {
        b = b.parents('.qbox');
        (function () {
            b[i % 2 ? 'addClass' : 'removeClass']('current');
            if (i++ < 5) setTimeout(arguments.callee, 200);
            else questions.find('a').removeClass('doing').blur();
        })();
    }
};
function submitAnswer(f,s) {
    var answer = [];
    switch (cType.type) {
        case 2: //操作题
            if (f.answer.value == '') return !!alert('你必须先选择你的答案文件再上传。');
            if ((',' + f.ext.value.toLowerCase() + ',').indexOf(',' + f.answer.value.split('.').reverse()[0].toLowerCase() + ',') == -1)
                return !!alert('本题需要上传的文件类型是“' + f.ext.value + '”。');
            return true;

        case 4: //填空题
        case 5: //多项填空
            $.each(f.answer, function (i, x) { answer.push(x.value) });
            break;

        case 6: //打字题
            answer = [f.content, f.seconds];
            break;

        default: //多选、单选、判断题
            $.each(f.answer, function (i, x) { if (x.checked) answer.push(x.value) });
            break;
    }
    var qIndex = parseInt(f.questionId.value), q_ = $('#q_' + qIndex).addClass('submitting');
    submit();

    function submit() {
        exam.submit(qIndex, answer, function (d) {
            if (d.ok) {
                q_.removeClass('submitting')[!!d.data.join('') ? 'addClass' : 'removeClass']('done');
                qdb[qIndex].answer = d.data;
                responsed[qIndex] = !!d.data.join('') ? 1 : 0;
                s && s();
            } else {
                //submit();
                alert(d.msg);
            }
        });
    };
    return false;
};
function submitPaper(tover) {//tover  1：卷面时间到；2：考场时间到；无参数：考生主动交卷
    var isManul = false;
    if (tover === 1) {
        clearInterval(kTimer);
        alert('考试时间到，系统将自动收卷。');
    } else if (tover === 2) {
        clearInterval(kTimer);
        alert('本场考试结束，系统将自动收卷。');
    } else {
        if (!confirm('确定交卷？')) return;
        isManul = true;
    }

    if (has_unhanded_office) {
        //自动提交操作题
        NotifyToolBarClick.call(office, 32772);
    }

    if (has_unhanded_typed) {
        //自动提交打字题
        submitTyper(0, submit);
    } else {
        submit();
    }

    function submit() {
        exam.handIn(isManul, function (d) {
            if (d.ok) {
                alert('交卷成功');
                location.replace('./');
                //localStorage.clear();
                cookie.set('ex_qid', null);
                cookie.set('ex_type', null);
            } else {
                alert('交卷失败\n' + d.msg);
            }
        });
    }
};
function showSubmit() {
    if (btn_submit.hasClass('gray')) return alert('考试刚才开始，您还不能交卷，请继续做题或检查!');
    new gzy.popup("交卷确认", 400, 300, {
        html: '<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr>\
        <td height="60" align="center" id="resn"></td></tr><tr><td height="180" align="center" valign="top" ><table id="resi" cellpadding="0" cellspacing="5"></table></td></tr><tr><td align="center">\
        <a href="javascript:\/\/检查" onclick="gzy.popup.close()"><img src="../images/student.exam.return.jpg"/></a>\
        <a href="javascript:\/\/交卷" onclick="submitPaper()"><img src="../images/student.exam.submit.jpg"/></a></td></tr></table>', onload: function () {
            $('#resn').text(studentName.text() + "（" + studentId.text() + "），你确认交卷？");
            var start = 0, r, resi = $('#resi').empty();
            $.each(cats, function (i, cat) {
                r = responsed.slice(start, start + cat.count).join('');
                resi.append(String.$('<tr><td>{1}</td><td align="left">一共 {2} 题</td><td align="left">，{3} 个已答</td><td align="left">{4}</td></tr>', cat.name, cat.count, r.replace(/0/g, '').length, r.indexOf('0') > -1 ? "，" + (r.replace(/1/g, '').length + " 个未答").fontcolor('red') : ""));
                start += (cat.count);
            });
        }
    });
};
var prom = false;
function keepState(success) {
    exam.keepState(function (d) {
        if (d.ok) {
            lTime = d.data.lTime;
            if (lTime < 120 && !prom) {
                if (has_unhanded_office || has_unhanded_typed) {
                    alert('考试剩余时间已经不足2分钟，请尽快提交未完成的试题！');
                    prom = true;
                }
            }
            switch (d.data.state) {
                case "over":
                //    alert('考试已结束。');
                    location.replace('./');
                    break;
                case "forbidden":
                //    alert('你被老师执行了禁考操作。');
                    location.replace('./');
                    break;
                case "cheat":
                    //    alert('你已被标记为作弊');
                    break;
            }
            if (success) success();
        }
    });
};

$(function () {
    window.onresize = function (e) {
        resize();
    };
    resize();

    function resize() {
        var win = $(window);
        if (win.innerWidth() < 1000 || win.innerHeight() < 600) {
            ninfo.slideDown();
        } else {
            ninfo.slideUp();
        }
    }

    ninfo.click(function () {
        ninfo.slideUp();
    });
});