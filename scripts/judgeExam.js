/// <reference path="lib/judge.js" />
/// <reference path="../jquery-1.7.min.js" />
/// <reference path="../console.js" />
/// <reference path="../common.js" />
/// <reference path="../Scripts/PopWindow/gzy.popup.js" />
/// <reference path="../webForm_common.js" />
/// <reference path="../My97DatePicker/WdatePicker.js" />


function RefreshJudgeSetPopup() {
    $("#ButtonSelectJudgers").click()
}



//确定是否结束阅卷
function confirmEndJudge(sender) {
    //首先确认是否结束，
    //确认后判断是否可以结束


    var res = false;
    if (confirm('确定结束阅卷？确定结束阅卷后需要等待大概5分钟才能查看统计数据。')) {
        $.post("StopJudgeHandler.ashx", { "method": "stop", "examid": sender.attr("class") },

             function (data) {
                
                 if (data == "1") {
                     alert("普通组阅卷未完成，请稍后重试！");
                 }
                 else if (data == "2") {
                     alert("专家组阅卷未完成，请稍后重试！");
                 }
                 else if (data == "0") {
                     alert("回话已经失效，请重新登录！");
                 }
                 else if (data == "100") {
                     res = true;
                     $("#RefreshButton").click();
                 }
             }, "json");

        //                $.ajax(
        //                {
        //                    type: 'post',
        //                    url: 'StopJudgeHandler.ashx',
        //                    data: { "method": "stop", "examid": sender.attr("class") },
        //                    succes: function (data) {
        //                        alert(1);
        //                        alert(data == "100");
        //                        alert(data === "100");
        //                        if (data == "1") {
        //                            alert("阅卷未完成，请稍后重试！");
        //                        }
        //                        else if (data == "0") {
        //                            alert("回话已经失效，请重新登录！");
        //                        }
        //                        else if (data == "100") {
        //                            res = true;
        //                            $("#RefreshButton").click();
        //                        }

        //                        $("#RefreshButton").click();
        //                    },
        //                    datatype: 'json'
        //                });

    }
    return res;
}



////专业阅卷  输入框 打分时 验证

//function JudgeSave(did,score,judgemode,judgetimes) {
//    //验证输入
//    var DetailID = did; //题号

////    var otherParams = $("#DetailID" + DetailID + "OTHERPARAMS").attr("class");

////    var tmpOP = otherParams.split(",");

//    var Judgemode = judgemode;//  tmpOP[0];
//    var JudgeTimes = judgetimes;// tmpOP[1];

//    var JudgeStandardCount = $("#DetailID" + DetailID + "JUDGESTANDARDCOUNT_HIDDENFIELD").attr("value");

//    var TotalCount = $("#DetailID" + DetailID + "TOTALSCORE_HIDDENFIELD").attr("value");

//    //先验证每一项是否是小数或整数，并小于等于总分
//    //再验证加起来是否小于等于总分
//    var tmpScore = 0; //该题最终得分
//    var tmpRes = true;
//    //   $(":contains('DetailID" + DetailID + "')")
//    $(".DetailID" + DetailID + "itemBox").each(function (index, element) {
//        var itemScore = $(this).attr("value")//每一个打分点 老师打的分
//        if (CheckItemScore(index, DetailID, itemScore, TotalCount) == true) {
//            tmpScore = tmpScore + parseFloat(itemScore);
//        }
//        else {
//            tmpRes = false;
//            return false;
//        }
//    });

//    if (tmpScore > TotalCount) {
//        printTips("最后得分超过该题分值！")
//        return false;
//    }
//    else if (tmpRes) { //获取分数
//    //验证通过，执行后续操作

//    $.ajax(
//    {
//        type: "post",
//        url: "JudgeScoreHandler.ashx",
//        data: { "JudgeMode": Judgemode, "JudgeTimes": JudgeTimes, "DetailID": DetailID, "Score": tmpScore },
//        error: function (XMLHttpRequest, textStatus, errorThrown) {
//            alert("失败:" + "\n错误状态文本描述：" + textStatus
//                    + "\n详细错误：" + errorThrown +
//                    "\n服务器返回状态码：" + XMLHttpRequest.status +
//                    "\n异步状态码：" + XMLHttpRequest.readyState);
//        },
//        success: function (result) {

//            if (result == "succed") {
//                printTips(DetailID, "成功打了" + tmpScore + "分");
//                // $("#nextTips" + DetailID).html("ok");
//                $("#nextTips" + DetailID).attr("ID","OK")
//            }
//            else {
//                printTips(DetailID, "服务器错误，保存失败，请联系管理员")
//            }
//        }
//    }
//    );


//    }

//}



//function printTips(DetailID, msg) {

//    $("#tips" + DetailID).html("<font color='red'>" + msg + "</font>");
//    $("#tips" + DetailID).fadeIn(100).delay(1500).fadeOut(900);
// 
//}


function setRejudge(examid) {
    if (confirm('重置阅卷状态后，当前考试已有的成绩及阅卷记录将丢失，确定要重置阅卷状态吗？')) {
        judge.reJudge(examid, function (result) {
            if (result.ok) {
                alert('重新开启阅卷成功');
                location.reload();
            }
            else
                alert('重新开启阅卷失败！\n失败原因:' + result.msg);
        });
        return true;
    }
    else
        return false;
};

function CheckItemScore(index, DetailID, itemScore, TotalCount) {

    if (itemScore == parseFloat(itemScore)) {
        if (parseFloat(itemScore) <= TotalCount) {
            return true;
        }
        else {
            printTips(DetailID,"第"+(index+1)+"个得分点得分超过总分！")
            return false;
        }
    }
    else {
        printTips(DetailID,"第" + (index + 1) + "个得分点出错，请填写数字！")
        return false;
    }

}



//阅卷设置
//设置阀值

function SetThreshold(eid, threshold) {

//    var threshold = $(sender).attr("value");

    //验证是否是1到100之间的数字
    var method = "threshold";

    if (parseFloat(threshold) == threshold && threshold >= 1 && threshold <= 99) {
        $.ajax(

        {
            type: "post",
            url: "JudgeSetHandler.ashx",
            data: { "method": method, "examid": eid, "thresholdValue": threshold },
            success: function (result) {
                if (result == "ok") {
                    $("#ThreSholdTips").html("成功");
                } else if (result == "fail") {
                    $("#ThreSholdTips").html("失败");
                }
              

            }
        }
        );

    }
    else {
        $("#ThreSholdTips").html("请填写1到99之间的数字");
    }


}





