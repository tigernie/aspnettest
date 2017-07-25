/// <reference path="progressBar/jquery-1.8.3.js" />

var intervalID = 0;//轮询函数ID 用于清除轮询
var IntervalTime = 1500;//轮询间隔时间

/////////////////////////////////////////////////////////////////////////////
////////////////////////以下是自动批阅部分的进度///////////////////////////
/////////////////////////////////////////////////////////////////////////////

function getObjJudgeProgress(examid) { //获取指定考试的客观题批阅进度

    $.ajax({
        async: true,
        url: "JudgeSetHandler.ashx",
        data: { "examid": examid, "method": "GetObjJudgePercent" },
        type: "post",
        dataType: "json",
        success: function (result) {
            loaded(result);
        }
    })
}




function RenderProgressBar(percentValue, prog) {
    //显示进度条
    $("#progressbar").progressbar({ value: parseFloat(percentValue) });

    //显示进度条下面的百分比文字
    if (parseFloat(percentValue) == 0) {
    
        $("#percent_tips").html("0%");
    }
    else if (parseInt(percentValue) == 100) {
        clearInterval(intervalID);//终止轮询
        $("#percent_tips").html("100%");
        $("#lbl_tip").html("完成");
        $("#ObjStartBtn").css("display", "");
        $("#ObjStartBtn").val("重新开启");
        $("#progressBarPanel").css("display", "none");
        $("#caozuoPanel").css("display", "");
    }
    else {
        var percent_str = parseFloat(percentValue).toFixed(2) + "%"; //字符串形式表示的百分比
        var auto_total = prog.auto_total;
        var auto_done = prog.auto_done;
        $("#percent_tips").html("共<span class='tips'>" + auto_total + "</span>道题，已批阅<span class='tips'>" + auto_done + "</span>道（<span class='tips_w'>" + percent_str + "</span>）");
    }
}

function RenderStartButton(prog) { //根据进度显示 开启自动批阅的 按钮
 
    if (prog.auto_total == "0") {//需要自动批阅的题目总数为0
        $("#ObjStartBtn").css("display", "none");
        $("#lbl_tip").html("无需操作");
    }
    else if (prog.auto_done == "0") {//总数不为0  完成数为0  是默认情况
        $("#ObjStartBtn").css("display", "");
    }
    else if (parseInt(prog.auto_done) < parseInt(prog.auto_total)) {//批阅中
        $("#ObjStartBtn").css("display", "none");
        $("#caozuoPanel").css("display", "none");
        $("#progressBarPanel").css("display", "");
        $("#lbl_tip").html("批阅中");
    }
    else if (prog.auto_done == prog.auto_total) {//批阅完成
   
        $("#ObjStartBtn").css("display", "");
        $("#ObjStartBtn").val("重新开启");
    }
}

function CalculatePercent(prog) {//根据计算的百分比 显示 进度条
    var examid = $("#EXAMID_HIDDENFIELD").val();
    if (!prog) {//循环调用

        $.ajax({
            async: true,
            url: "JudgeSetHandler.ashx",
            data: { "examid": examid, "method": "GetObjJudgePercent" },
            type: "post",
            dataType: "json",
            success: function (result) {
                if (result.auto_total == "0") {//自动批阅的总数为0 那么进度直接为100%
                    RenderProgressBar(100);
                }
                else {
                    RenderProgressBar(parseFloat(result.auto_done) / parseFloat(result.auto_total) * 100, result);
                }
            }
        })

    }
    else {//首次加载完时调用  
        if (prog.auto_total == "0") {//自动批阅的总数为0 那么进度直接为100%
            RenderProgressBar(100);
        }
        else {
            RenderProgressBar(parseFloat(prog.auto_done) / parseFloat(prog.auto_total) * 100, prog);
        }
    }
}

$(document).ready(function () {
    var examid = $("#EXAMID_HIDDENFIELD").val();
    getObjJudgeProgress(examid);


});


function loaded(prog) {
    RenderStartButton(prog); //显示操作按钮
    CalculatePercent(prog); //初次显示进度条

    if (prog.auto_total != "0" && prog.auto_done != prog.auto_total) {//批阅过程中
        intervalID = setInterval(CalculatePercent, IntervalTime); //定时显示进度条
    }
}

/////////////////////////////////////////////////////////////////////////////
////////////////////////以上是自动批阅部分的进度///////////////////////////
/////////////////////////////////////////////////////////////////////////////


function Judge_Open() { //开启自动批阅

    var sysVeriosn = $("#sysVersion").val();

    var isReJudge = false;
    if ($("#ObjStartBtn").val() == "重新开启") {
        isReJudge = true;
    }

    $("#caozuoPanel").css("display", "none");
    $("#progressBarPanel").css("display", "");
    $("#lbl_tip").html("批阅中");
    RenderProgressBar(0, null);

    if (MrqHasSelected) {//验证合法
        var examid = $("#EXAMID_HIDDENFIELD").val();

        //设置多选题不全对得分
        if (document.getElementById("ddl_MRQ") != null) {
            var selectedValue = $("#ddl_MRQ").find("option:selected").val();
            var analyseNotAllRightValue = $('#analyseNAR').val();

            $.ajax({

                type: "post",
                url: "JudgeSetHandler.ashx",
                data: { "examid": examid, "method": "MRQ_notfullright", "mrq_NFR_value": selectedValue,analyseNotAllRight:analyseNotAllRightValue, "isReJudge": isReJudge },
                success: function (result) {
                    intervalID = setInterval(CalculatePercent, IntervalTime); //定时显示进度条 
                },
                async: true
            });
        }
        else {

            $.ajax({
                type: "post",
                url: "JudgeSetHandler.ashx",
                data: { "examid": examid, "method": "MRQ_notfullright", "mrq_NFR_value": "", "isReJudge": isReJudge },
                success: function (result) {
                    intervalID = setInterval(CalculatePercent, IntervalTime); //定时显示进度条
                 },
                async: true
            });
        }

//        //开启自动评分
//        $.ajax({

//            type: "get",
//            url: "JudgeSetHandler.ashx",
//            data: { "examid": examid, "method": "JudgeObjectOpen" },
//            success: function (result) {
//                $("#ObjStartBtn").css("display", "none");
//                $("#lbl_tip").html("正在批阅");
//            },
//            async: true
//        });

    }
}

function MrqHasSelected() {//如果有多选题不全对得分选项，则必须选择。如果未选则返回false
    var res = true;
    if (document.getElementById("ddl_MRQ") != null) {
        var selectedValue = $("#ddl_MRQ").find("option:selected").val();
        if (selectedValue == undefined || selectedValue == " ") {//未选择，需要选择才能继续
            res = false;
            $("#ddl_MRQ_tips").html("请选择");
        }
    }
    return res;
}





function OpenJudgeObject(eid) {

    var AllowMaxDiffRate = $("#DropDownListAllowMaxDiffRate option:selected").val();

    if (AllowMaxDiffRate == "-1") {
        alert("请选择最大允许的差值");
        return false;
    }


    var loading = showLoding('正在分配阅卷任务，请稍候……');
    var method = "openJudgeObject";
    $.ajax({
        type: "post",
        url: "JudgeSetHandler.ashx",
        data: { "method": method, "examid": eid, "AllowMaxDiffRate": AllowMaxDiffRate },
        success: function (result) {
            loading.close();
            if (result == "ok") {
                $("#ObjStartBtn").css("display", "none")
                $("#openJudgeObjectTips").html("已开启");
                $("#openJudgeObject").css("display", "none");


               
                alert("手动阅卷已经成功开启");

                var sysVeriosn = $("#sysVersion").val();

                if (sysVeriosn == "1") {//中心版
                    reloadToState2(eid);
                }
            }
            else if (result == "HasUnAllocatedKP") {
                alert("还有知识点模块未分配到组");
            }
            else if (result = "HasNotProficient") {
                alert("已经设置了由专家参与，但是目前未选择任何老师作为专家");
            }
            else {
                $("#ThreSholdTips").html(result);
            }
        }
    });
}

function reloadToState2(eid) {

    var href = "/JudgeManageExamDetail.aspx?id=" + eid + "&state=2"
 
   window.location.replace(href);
}

function reloadToState3(eid) {

    showResult();
//    var href = "/JudgeManageExamDetail.aspx?id=" + eid + "&state=3"

//    window.location.replace(href);
}

function SelectJudgerTeacher() {
    var _j_mode = $("#Selected_Judgemode").attr("value");
    var _examid = $("#EXAMID_HIDDENFIELD").attr("value");
    parent.TeacherList(_j_mode, _examid);
}

function disable(sender) {
    $(sender).css("visibility", "hidden");
}


function DisplayCaozuo() {
    $("#ObjStartBtn").css("display","");
    $("#caozuoPanel").fadeIn(500).delay(2500).fadeOut(1500);
}