/// <reference path="../jquery-1.7.min.js" />
/// <reference path="../console.js" />
/// <reference path="../common.js" />
/// <reference path="../Scripts/PopWindow/gzy.popup.js" />
/// <reference path="../webForm_common.js" />
/// <reference path="../My97DatePicker/WdatePicker.js" />

var solutionWin;//方案弹出窗
var Win; //添加考试弹出窗
var mode;//1-考试模式，2-练习模式
var datePicker;
var refresh = false;
var refreshInterval;
function getRandom(n) { return Math.floor(Math.random() * n + 1) }


$(function () {

    $("#ExamsList").click(function () {
        showSearch(true);
    });

    $("#searchBtn").click(function () { $("#RefreshButton").click(); });

    $("#AddExam").click(function () {
        InitAddExamShow("", 1, function () { refresh = true; $("#RefreshButton").click(); });
    });

    $("#AddExercise").click(function () {
        InitAddExamShow("", 2, function () { refresh = true; $("#RefreshButton").click(); });
    });

});


function showDeleteExamConfirm(e) {
    var result = false;
    uic.confirm('删除后将无法再查看该考试的信息,你确定删除该考试吗？', function () {
        $.post("ExamMgrAshx.ashx", { "method": "delete", "id": e.attr("id") },
             function (data) {
                 alert(data.result);
                 $("#RefreshButton").click();
             }, "json");
    }, e.rect(), 150, true);

    return false;
}


function showErrMsg(examid) {
    $.post("ExamMgrAshx.ashx", { "method": "getErrMsg", "examid": examid },
            function (data) {
                alert(data.msg);
            }, "json");
}

function showExamCreateLoading() {
    refresh = true;
}


function ShowExamInfo(examId) {
    var htmlStr = "没有信息"; //title,content
    $.post("ExamMgrAshx.ashx", { "method": "getExamInfo", "id": examId },
             function (data) {
                 if (data.result != "登录已失效") {
                     var latetestTime = data.result.latestEnterTime + "分钟";
                     if (data.result.classInfo == "无固定班级") {
                         latetestTime = "无限制";
                     }
                     var showPaperType = data.result.paperType == "随机卷" ? "random" : "uni";
                     htmlStr = "<tr><td class=\"title\">考试名称：</td><td class=\"content\" colspan = \"4\">" + data.result.examName + "</td></tr>";
                     htmlStr += "<tr><td class=\"title\">考试时间：</td><td class=\"content\" colspan = \"4\">" + data.result.examTime + "</td></tr>";
                     htmlStr += "<tr><td class=\"title\">考试编号：</td><td class=\"content\">" + data.result.id + "</td><td class=\"title\">考试时长：</td><td class=\"content\">" + data.result.examLastTime + "分钟</td></tr>";
                     htmlStr += "<tr><td class=\"title\">考试类型：</td><td class=\"content\">" + data.result.examMode + "</td><td class=\"title\">试卷类型：</td><td class=\"content\">" + data.result.paperType + "</td></tr>";
                     if (data.result.paperType != "统一卷")
                         htmlStr += "<tr><td class=\"title\">方案名称：</td><td class=\"content\"><a href=\"javascript:showInfo('" + showPaperType + "'," + data.result.sluId + ");\" >" + data.result.sluName + "</a></td><td class=\"title\">方案类型：</td><td class=\"content\">" + data.result.sluType + "</td></tr>";
                     else {
                         htmlStr += "<tr><td class=\"title\">所含试卷：</td><td colspan = \"4\">";
                         $.each(data.result.paperInfo, function (index, content) {
                             htmlStr += "<a href = \"javascript:ShowPaperInfo(" + content.paperId + ");\" title=\"单击查看试卷信息\" >" + content.paperName + "</a><br />";
                         });
                     }
                     htmlStr += "<tr><td class=\"title\">交卷限制：</td><td class=\"content\">" + data.result.minHandInTime + "分钟</td><td class=\"title\">最晚进入时间：</td><td class=\"content\" >" + latetestTime + "</td></tr>";
                     htmlStr += "<tr><td class=\"title\">考试状态：</td><td class=\"content\">" + data.result.state + "</td><td class=\"title\">考试人数：</td><td class=\"content\">" + data.result.stuCount + "</td></tr>";
                     htmlStr += "<tr><td class=\"title\">创建者：</td><td class=\"content\">" + data.result.author + "</td></tr>";
                     htmlStr += "<tr><td class=\"title\">考生信息：</td><td class=\"content\" colspan = \"4\">";
                     if (data.result.classInfo == "无固定班级") {
                         htmlStr += "无固定班级";
                     }
                     else
                         $.each(data.result.classInfo, function (index, content) {
                             htmlStr += "<a href = \"javascript:showStudetnInfo('" + content.gradeName + content.className + "'," + content.class_id + ","+examId+");\" title=\"单击查看该班级学生信息\" >" + content.gradeName + " - " + content.className + "</a><br />";
                         });
                     htmlStr += "</td></tr>";

                     htmlStr = "<table class=\"list\">" + htmlStr + "</table>";
                     new gzy.popup('考试详细信息', 650, 380, {
                         html: htmlStr
                     });
                 }
                 else {
                     alert(data.result + " \n请重新登录");
                     window.open('/login.htm', '_self');
                 }
             }, "json");
}


function openExam(exam,open) {
    var id = exam.attr("id").split('-')[1];
    var mesg;
    var method;
    if (open == true) {
        mesg = "开启考试后考生将可以立即进入考试,\n你确定要立刻开启吗？";
        method = "open";
    }
    else {
        mesg = "结束考试后考生将不能再进行考试,\n你确定要立刻结束吗？";
        method = "close";
    }

    uic.confirm(mesg, function () {
        $.post("ExamMgrAshx.ashx", { "method": method, "id": id },
           function (data) {
               alert(data.result);
               $("#RefreshButton").click();
           }, "json");
    }, exam.rect(), 220, true);
}


function centerExamMode()
{
    $('#AddExercise').css('display', 'none');
    $('#AddExam').css('display', 'none');
    $('#searchArea').css('display', 'none');
}

var openExamWin;
function openBigExam(examRoomId,examid)
{
    //var htmlStr = '';
    //htmlStr += '<div style=" width:100%;">';
    //htmlStr += '<table class="list" style=" width:100%;">';
    //htmlStr += '<tbody><tr><td >请输入考试开启密码：</td><td><input type="password" id="exampsw" /></td></tr>';
    //htmlStr += '</tbody></table><div style="width:100%;text-align:center"><button class="blue" style="cursor:pointer;height:30px;width:100px" onclick="enterPsw(' + examid + ')">开启</button></div>';
    //htmlStr += "</div>";
    //openExamWin = new gzy.popup('开启考试', 360, 90, {
    //    html: htmlStr
    //});

    if (confirm('考试只能开启一次，确认要开启吗？'))
    {
        $.post("/centerExamview.ashx", { "method": "checkCanOpenExam", roomid: examRoomId },
            function (data) {
                if (data.result == 'yes') {
                    $.post("ExamMgrAshx.ashx", { "method": "openBigExam", "examid": examid, "psw": '' },
             function (data) {
                 alert(data.result);
                 if (data.result == '开启考试成功') {
                     $("#RefreshButton").click();
                     $.post("/centerExamview.ashx", { "method": "ensureOpenExam", roomid: examRoomId }, function (data) {
                     });
                 }
             }, "json");

                }
                else
                    alert('开启失败！' + data.msg);
            }, "json");
    }
    return false;
}

function enterPsw(examid)
{
    var psw = $('#exampsw').val();
    $.post("ExamMgrAshx.ashx", { "method": "openBigExam", "examid": examid, "psw": psw },
             function (data) {
                 alert(data.result);
                 if (data.result == '开启考试成功')
                     openExamWin.close();
                 $("#RefreshButton").click();
             }, "json");
}

$(function () {
    if(!refreshInterval)
    {
        refreshInterval = setInterval(function () {
            if (refresh) {
                $("#RefreshButton").click();
                if ($(".creating").length <= 0)
                    refresh = false;
            }
        }, 3000);
    }
});

      
