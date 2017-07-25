/// <reference path="jquery-1.7.min.js" />
/// <reference path="console.js" />
/// <reference path="common.js" />
/// <reference path="Scripts/PopWindow/gzy.popup.js" />
/// <reference path="webForm_common.js" />
/// <reference path="My97DatePicker/WdatePicker.js" />

var isCreatMode; //是否为创建模式
var testMode;
var sluIdOrPaperIDs;
var SluIdAndNames;

function Add_Class(classId, className, gradeName) {
    var classes = $("#classes");
    var classIdsBox = $("#classIds");
    var existedIds = new Array();
    existedIds = classIdsBox.val().split('/');
    $("#noclass").css("display", "none");
    var existed = false;
    for (var i = 0; i < existedIds.length; i++)
        if (classId == existedIds[i])
            existed = true;
    if (existed == false) {
        classes.html(classes.html() + "<div id = 'class_" + classId + "'><label>" + gradeName + " - " + className + "</label>&nbsp;&nbsp;<label class=\"deleteBtn\" onclick=\"deleteClass(" + classId + ")\">删除</label></div>");
        classIdsBox.val(classIdsBox.val() + classId + "/");
    }
}

function Show_PaperIds(paperIdAndName) {
    sluIdOrPaperIDs = new Array();
    var paperIdsBox = $("#paperIdsBox");
    var id;
    var name;
    var i;
    SluIdAndNames = paperIdAndName;
    paperIdsBox.html('');
    $.each(paperIdAndName, function (index, data) {
        id = data.split('-')[0];
        name = "";
        for (i = id.length + 1; i < data.length; i++)
            name += data[i];
        sluIdOrPaperIDs.push(id);
        paperIdsBox.html(paperIdsBox.html() + "<div id = 'paper_" + id + "'><label>" + name + "</label>&nbsp;&nbsp;<label class=\"deleteBtn\" onclick=\"deletePaper(" + id + ")\">删除</label></div>");
    });
}

function Init_ExamPublish(examid) {

    $("#GradesList").click(function () {
        Init_ClassesList();
    });

    $("#randomPapers").change(function () {
        $("#SolutionID").val('').css("display", "none"); //方案置空
        $("#paperIdsBox").html('');
        sluIdOrPaperIDs = "";
        SluIdAndNames = new Array();
        if ($(this).attr("checked") == "checked") {
            $("#chooseTitle").html('选择方案：');
            $("#selSolution").val('单击选择方案');
            $("#isRandomOrderRow").css("display", "none");
        }
        else {
            $("#chooseTitle").html('选择试卷：');
            $("#selSolution").val('单击选择试卷');
            $("#isRandomOrderRow").css("display", "");
        }
    });

    $("#uniPapers").change(function () {
        $("#SolutionID").val('').css("display", "none"); //方案置空
        $("#paperIdsBox").html('');
        sluIdOrPaperIDs = "";
        SluIdAndNames = new Array();
        if ($(this).attr("checked") == "checked") {
            $("#chooseTitle").html('选择试卷：');
            $("#selSolution").val('单击选择试卷');
            $("#isRandomOrderRow").css("display", "");
        }
        else {
            $("#chooseTitle").html('选择方案：');
            $("#selSolution").val('单击选择方案');
            $("#isRandomOrderRow").css("display", "none");
        }
    });

    $("#addClass").click(function () {
        var classList = $("#ClassesList");
        var className = classList.find("option:selected").text();
        var gradeNmae = $("#GradesList").find("option:selected").text();
        var classId = classList.val();
        Add_Class(classId, className, gradeNmae);
    });

    $("#saveExam").click(function () {
        var saveBtn = $(this);
        var check = checkComplete();
        if (check == "ok") {
            var loading = showLoding('正在请求创建');
            $.post("ExamMgrAshx.ashx", {
                "method": "save",
                "examid": examid,
                "name": $("#ExamNameBox").val().replace(/ /g, '').replace(/	/g, ''),
                "solutionType": $("#randomPapers").attr("checked") == "checked" ? "2" : "1",
                "examMode": $("#ExamMode").attr("checked") == "checked" ? "1" : "2",
                "solutionId": sluIdOrPaperIDs.toString(),
                "ExamTime": $("#ExamTime").val(),
                "StartTime": $("#StartTime").val(),
                "EndTime": $("#EndTime").val(),
                "HandInMinTime": $("#HandInMinTime").val(),
                "classIds": $("#classIds").val(),
                "note": $("#note").val(),
                "LatestTime": $("#LatestTime").val(),
                "isRandomOrder": $("#isRandomOrder").attr("checked") == "checked" ? "true" : "false"
            },
                 function (data) {
                     loading.close();
                     if (data.result == '登录已失效') {
                         alert(data.result + " \n请重新登录");
                         location.replace('/login.htm');
                     }
                     else {
                         if (data.result.ok == "true") {
                             alert("系统正在后台进行完成本次请求，请稍候查看考试列表");
                             Win.close();
                         }
                         else
                             alert(data.result.msg);
                     }
                 }, "Json");
        }
        else
            alert(check);
    });

    $("#ExamMode").click(function () {
        $("#classtitle").css("display", "block");
        $('.popup_title label').text("添加考试");
    });

    $("#ExerciseMode").click(function () {
        $("#classtitle").css("display", "none");
        $('.popup_title label').text("添加练习");
    });

    var LatestTime = $("#LatestTime");
    var HandInMinTime = $("#HandInMinTime");

    var nb1 = new NumberBox(LatestTime, { "max": 40, "min": 0, "step": 5 });
    var nb2 = new NumberBox(HandInMinTime, { "max": 40, "min": 0, "step": 5 });

    $("#ExamTime").change(function () {
        nb1.setMax($(this).intVal());
        nb2.setMax($(this).intVal());
        if (parseInt(LatestTime.val()) > parseInt($(this).val()))
            LatestTime.val($(this).val());
        if (parseInt(HandInMinTime.val()) > parseInt($(this).val()))
            HandInMinTime.val($(this).val());
        if (testMode == 1)
            updateEndTime();
    });

    $("#SolutionID").css("display", "none");
    $("#selSolution").click(function () {
        var sluIDOrPaperIdsBox = $("#SolutionID");
        if ($("#randomPapers").attr("checked") == "checked") {
            getPaperParamSluId(function (idName) {
                if (idName != null && idName != "") {
                    sluIdOrPaperIDs = idName.split('-')[0];
                    sluIDOrPaperIdsBox.val(idName).css("display", "inline");
                    $("#selSolution").val('单击更换组卷方案');
                }
                else {
                    $("#selSolution").val('单击选择组卷方案');
                    sluIDOrPaperIdsBox.css("display", "none");
                }
            });
        }
        else {
            getPaperIds(function (idName) {
                sluIDOrPaperIdsBox.val(idName).css("display", "none");
                $("#selSolution").val('单击更换试卷');
                var names = "";
                Show_PaperIds(idName);
            }, SluIdAndNames);
        }
    });
    Init_AddExam(examid);
}

function deleteClass(classId) {
    $("#class_" + classId).remove();

    var classIds = new Array();
    var classIdsBox = $("#classIds");
    classIds = classIdsBox.val().split('/');
    var newClassids = "";
    for (var i = 0; i < classIds.length; i++)
        if (classId != classIds[i] && classIds[i] != "")
            newClassids += classIds[i] + "/";
    classIdsBox.val(newClassids);

    if (classIdsBox.val() == '') {
        $("#noclass").css("display", "block");
        classIdsBox.val('');
    }
}

function deletePaper(paperId) {
    $("#paper_" + paperId).remove();
    var newPaperIds = new Array();
    var newPaperIdAndNames = new Array();
    var paperIds = sluIdOrPaperIDs.toString().split(',');
    var paperfullNames = SluIdAndNames.toString().split(',');
    for (var i = 0; i < paperIds.length; i++) {
        if (paperId != paperIds[i] && paperIds[i] != "") {
            newPaperIds.push(paperIds[i]);
            newPaperIdAndNames.push(paperfullNames[i]);
        }
    }
    SluIdAndNames = newPaperIdAndNames;
    sluIdOrPaperIDs = newPaperIds;
}


function Init_AddExam(examid) {
    var ExamNameBox = $("#ExamNameBox");
    var EndTime = $("#EndTime");
    var StartTime = $("#StartTime");
    var ExamTime = $("#ExamTime");
    var MinHandInTime = $("#HandInMinTime");
    var AddExam_Content = $("#AddExam_Content");
    var SolutionBox = $("#SolutionID");
    var LatestTime = $("#LatestTime");
    AddExam_Content.addClass("popContent");
    var Note = $("#note");

    if (testMode == 1) {
        $("#noclass").show();
        $("#classtitle").show();
        $("#ExamMode").attr("checked", true);
        $("#examModeSel").css("display", "inline");
        $("#exerciseModeSel").hide();
        $('.popup_title label').text("添加考试");
        $("#latestEnterTimeRow").show();
    }
    else {
        $("#classtitle").hide();
        $('.popup_title label').text("添加练习");
        $("#ExerciseMode").attr("checked", true);
        $("#examModeSel").hide();
        $("#exerciseModeSel").css("display", "inline");
        $("#latestEnterTimeRow").hide();
        $("#LatestTime").val('0');
    }
    Init_GradesList();
    Note.css("width", 500).css("height", 150);
    ExamTime.numberBox({ "max": 999999, "min": 0, "step": 5 });
    SolutionBox.attr("disabled", "true");
    StartTime.val('').addClass('Wdate').click(function () {
        WdatePicker({
            readOnly: true,
            startDate: '%yy-%MM-%dd %HH:%mm:00', dateFmt: 'yyyy-M-d HH:mm', minDate: '%yy-%MM-%dd %HH:%mm:00', firstDayOfWeek: 1, isShowClear: false, errDealMode: 1,
            onpicked: function () {
                updateEndTime();
            }
        })
    });
    StartTime.change(function () { alert('ok'); updateEndTime(); });
    if (testMode == 2) {
        EndTime.val('').addClass('Wdate').focus(function () {
            WdatePicker({ dateFmt: 'yyyy-MM-dd HH:mm', minDate: '#F{$dp.$D(\'EndTime\')}', startDate: "#F{$dp.$D(\'StartDate\',{m:" + ExamTime.val() + "})}" });
        });
    }
    else
        EndTime.attr("readonly", "readonly");


    if (isCreatMode) {
        ExamNameBox.val('');
        SolutionBox.val('');
        $("#classes").html($("#noclass"));
        $("#classIds").val('');
        EndTime.val('');
        StartTime.val('');
        ExamTime.val('40');

        MinHandInTime.val('0');
        MinHandInTime.numberBox({ "max": ExamTime.val(), "min": 0, "step": 5 });
        LatestTime.val(ExamTime.val());
        LatestTime.numberBox({ "max": ExamTime.val(), "min": 0, "step": 5 });
        $("#randomPapers").attr("checked", "checked");

        Note.val('1、考试时必须携带身份证、准考证，两证不得缺一，以备监考人员检查。\n' +
'2、考生要按考试时间参加考试。考生迟到30分钟不得进入考场，开考30分钟之内不得离开考场。\n' +
'3、考生应提前15分钟进入考场，对号入座，将准考证和身份证放在桌左上角，接受监考人员查对。\n' +
'4、考生进入考场，不得携带任何参考资料、书籍、笔记、纸张、字典、呼机、手机、快译通等物品，如已带入以上物品，必须集中放在监考人员指定的位置（关闭呼机、手机）后，方可入座。\n' +
'5、考生在考试时，未经监考人员允许不得擅自离开考场或座位，不得传、借文具，如确有需要，须经由监考人员传递。考生对试题内容有疑问时，不得向监考人员询问，如发现试题印制、分发错误或字迹不清等有关问题可举手询问，请监考人员处理。\n' +
'6、考生必须独立答卷，严格遵守考场纪律。考试时不准看书，不准吸烟，不准交头接耳、偷看他人试卷、传递纸条、交换试卷、替考等。凡是违反上述规定的行为，都属考试违纪或作弊行为。\n' +
'7、考试结束时间一到，考生应立即停止答卷，将试卷翻放在桌面上，立即离开考场。考生不得将试卷、答题纸、草稿纸带出考场。\n' +
'8、考生要严格遵守考场纪律，严禁考试舞弊，如有违反者，当场取消考试资格，答卷作废。');

    }
    else {//考试修改
        $.post("ExamMgrAshx.ashx", { "method": "getExamInfo", "id": examid },
             function (data) {
                 var note;
                 if (data.result != "登录已失效") {
                     ExamNameBox.val(data.result.examName);
                     StartTime.val(data.result.startTime);
                     EndTime.val(data.result.endTime);
                     ExamTime.val(data.result.examLastTime);
                     MinHandInTime.val(data.result.minHandInTime);
                     MinHandInTime.numberBox({ "max": ExamTime.val(), "min": 0, "step": 5 });
                     LatestTime.val(data.result.latestEnterTime);
                     LatestTime.numberBox({ "max": ExamTime.val(), "min": 0, "step": 5 });
                     note = replace(data.result.note);
                     Note.val(note);
                     if (data.result.paperType == "随机卷") {
                         SolutionBox.val(data.result.sluId + "-" + data.result.sluName);
                         $("#randomPapers").attr("checked", "checked");
                     }
                     else {
                         $("#uniPapers").attr("checked", "checked");
                         sluIdOrPaperIDs = new Array();
                         $.each(data.result.paperInfo, function (index, content) {
                             sluIdOrPaperIDs.push(content.paperId + "-" + content.paperName);
                         });
                         Show_PaperIds(sluIdOrPaperIDs);
                     }
                     if (data.result.examMode == "班级考试") {
                         $.each(data.result.classInfo, function (index, content) {
                             Add_Class(content.class_id, content.className, content.gradeName);
                         });
                     }
                     else {
                         $("#classes").html($("#noclass"));
                         $("#classIds").val('');
                     }
                 }
                 else {
                     alert(data.result + " \n请重新登录");
                     window.open('/login.htm', '_top');
                 }
             }, "json");
    }
}

function replace(text) {
    var i;
    var newText = "";
    for (i = 0; i < text.length; i++)
        if (text.charAt(i) == '＼')
            newText += "\\";
    return newText;
}


function updateEndTime() {
    var x = $dp.$D('StartTime', { m: parseInt($("#ExamTime").val() || 40) });
    if (x.y != null)
        $("#EndTime").val(x.y + '-' + x.M + '-' + x.d + ' ' + x.H + ':' + x.m);
}


function Init_GradesList() {
    var GradesList = $("#GradesList");
    var options = "";
    //返回 data.ids,data.names
    $.post("ExamMgrAshx.ashx", { "method": "init_GradesList" },
             function (data) {
                 GradesList.empty();
                 var ids = new Array();
                 var names = new Array();

                 ids = data.result.ids.split('/');
                 names = data.result.names.split('/');

                 for (var i = 0; i < ids.length; i++) {
                     options += "<option value='" + ids[i] + "'>" + names[i] + "</option>";
                 }
                 GradesList.html(options);
                 GradesList.get(0).selectedIndex = 0; //index为索引值
                 Init_ClassesList();
             }, "json");
}

var hasStudents;
function Init_ClassesList() {
    var classesList = $("#ClassesList");
    var GradesList = $("#GradesList");
    var options = "";
    //返回 data.ids,data.names
    $.post("ExamMgrAshx.ashx", { "method": "init_ClassesList", "gradeId": GradesList.val() },
             function (data) {
                 classesList.empty();
                 var ids = new Array();
                 var names = new Array();

                 ids = data.result.ids.split('/');
                 names = data.result.names.split('/');
                 hasStudents = data.result.hasStudent.split('/');

                 for (var i = 0; i < ids.length; i++) {
                     options += "<option value='" + ids[i] + "' >" + names[i] + "</option>";
                 }
                 classesList.html(options);
                 classesList.change(function () {
                     showAddClass(this);
                 });
                 showAddClass(classesList, 0);

             }, "json");
}

function showAddClass(obj, index) {
    if (index == null)
        index = obj.selectedIndex;
    if (hasStudents[index].toLowerCase() == 'true') {
        $('#addClass').show();
        $('#showNoStudent').hide();
    }
    else {
        $('#addClass').hide();
        $('#showNoStudent').show();
    }
}


//检查必要数是否已经输入
function checkComplete() {

    debugger;
    var tmp = "";
    if (testMode == 1)
        tmp = "考试";
    else tmp = "练习";
    if ($("#ExamNameBox").val().replace(/ /g, '').replace(/	/g, '') == '')
        return "请输入" + tmp + "名称";
    if (sluIdOrPaperIDs == '') {
        if ($("#uniPapers").attr("checked") != "checked")
            return "请选择组卷方案";
        else
            return "请选择试卷";
    }
    if ($("#ExamTime").val() == '')
        return "请输入" + tmp + "时间";
    if ($("#StartTime").val() == '')
        return "请选择开放时间";
    if ($("#classIds").val() == '')
        return "请添加考试班级";
    return "ok";
}

function QueryString(name) {
    var AllVars = window.location.search.substring(1);
    var Vars = AllVars.split("&");
    for (i = 0; i < Vars.length; i++) {
        var Var = Vars[i].split("=");
        if (Var[0] == name) return Var[1];
    }
    return "";
}

var Win;
function InitAddExamShow(examId, testMode, callBackFunc) {

    if (examId == "")
        isCreatMode = true;
    else
        isCreatMode = false;

    this.testMode = testMode;
    var displayStr;
    var disabledStr;
    var testModeStr;
    sluIdOrPaperIDs = "";

    if (testMode == 1) {
        displayStr = "";
        testModeStr = "考试";
        disabledStr = " disabled =\"disabled\" ";
    }
    else {
        displayStr = " style=\"display:none\"";
        testModeStr = "练习";
        disabledStr = "";
    }

    var htmlStr = "<table class=\"list\"><tr><td class=\"title\">" + testModeStr + "名称：</td><td><input type=\"text\" style=\"width:320px\" maxlength=\"50\" id=\"ExamNameBox\" /></td></tr>" +
            "<tr><td class=\"title\">试卷类型：</td><td><label><input type=\"radio\" id=\"randomPapers\" name=\solution\" />随机卷</label>&nbsp;&nbsp;&nbsp;&nbsp;<label><input type=\"radio\" id=\"uniPapers\" name=\solution\" />统一卷</label></td></tr>" +
            "<tr><td class=\"title\"><label id=\"chooseTitle\">选择方案：</label></td><td><input type=\"text\" id=\"SolutionID\" /><div id=\"paperIdsBox\" style=\"display:inline;\"></div>&nbsp;<input type=\"button\" id=\"selSolution\" value=\"单击选择方案\" class=\"btn\" /></td></tr>" +
            "<tr id=\"isRandomOrderRow\"><td class=\"title\"><label>使用随机题序：</label></td><td><input type=\"checkbox\" id=\"isRandomOrder\"  /><label class=\"noticeLabel\">（该模式下每份试卷将采用随机题序）</label></td></tr>" +
            "<tr><td class=\"title\">" + testModeStr + "时长：</td><td><input type=\"text\" id=\"ExamTime\" /></td></tr>" +
            "<tr><td class=\"title\">" + testModeStr + "开放时间：</td><td><input type=\"text\" id=\"StartTime\" />至<input type=\"text\" id=\"EndTime\" /></td></tr>" +
            "<tr><td class=\"title\">交卷限制：</td><td><input type=\"text\" id=\"HandInMinTime\" /><label class=\"noticeLabel\">（如设定10分钟，那么考生在开始答题的10分钟内不能交卷）</label></td></tr>" +
            "<tr id=\"latestEnterTimeRow\"><td class=\"title\">最晚进入时间：</td><td><input type=\"text\" id=\"LatestTime\" /><label class=\"noticeLabel\">（超时此时间后，迟到考生将不允许进入考试）</label></td></tr>" +
            "<tr style=\"display:none\"><td class=\"title\" >考试类型：</td><td><span id=\"examModeSel\"><input type=\"radio\" id=\"ExamMode\" name=\"Mode\" />班级考试</span><span id=\"exerciseModeSel\"><input type=\"radio\" id=\"ExerciseMode\" name=\"Mode\" /><label>练习模式</label></span></td></tr>" +
            "<tr><td class=\"title\">选择班级：</td><td><select id=\"GradesList\"></select><select id=\"ClassesList\"></select>&nbsp;<input type=\"button\" id=\"addClass\" value=\"添加该班级\"  class=\"btn\" /><label id=\"showNoStudent\" style=\"display:none\">该班级没有学生</label></td></tr>" +
            "<tr><td class=\"title\">已添加的班级：</td><td><div id=\"classes\"><label id=\"noclass\">(尚未添加班级)</label></div><div><input type=\"text\" id=\"classIds\" style=\"display: none\" /></div></td></tr>" +
            "<tr><td class=\"title\">考生须知：</td><td><textarea rows=\"20\" cols=\"50\" id=\"note\"></textarea></td><tr></table>" +
            "<div style=\"text-align:center\"><br /><img alt=\"\" src=\"images/teacher.btn.save.jpg\" class=\"Btn\" id=\"saveExam\" /></div><br />";

    Win = new gzy.popup('', 650, 500, {
        html: htmlStr,
        onclose: callBackFunc
    });
    $("#isRandomOrderRow").css("display", "none");
    Init_ExamPublish(examId);
}
