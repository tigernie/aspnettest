$(document).ready(
    function ()
{
    var DIDs = $("#HiddenField_DetailIdList").val();
    var Jmodes = $("#HiddenField_JudgeModeList").val();
    var JTimes = $("#HiddenField_JudgeTimesList").val();
    var jms = Jmodes.split(',');
    var jtms = JTimes.split(',');

    var ids = DIDs.split(',');


    for (var i = 0; i < ids.length; i++)
    {

        var H_JountID = "Hidden_JudgeStandardCount" + ids[i];
        var H_PscoreID = "Hidden_ProblemScore" + ids[i];

        var Jcount = $("#" + H_JountID).val();
        var PScore = $("#" + H_PscoreID).val();

        RenderJudgeBox(ids[i], PScore, Jcount);


        //注册保存按钮的 保存分数的事件
        //                    var H_JmodeID = "Hidden_JudgeMode" + ids[i]; //阅卷模式
        //                    var H_JtimesID = "Hidden_JudgeTimes" + ids[i]; //阅卷次数

        var Jmode = jms[i]// $("#" + H_JmodeID).val();//阅卷模式
        var JTimes = jtms[i]//$("#" + H_JtimesID).val();//阅卷次数

        var LastScoreID = "Hidden_Score" + ids[i]; //最后得分ID
        var LastScore = $("#" + LastScoreID).val();

        var SaveID = "save" + ids[i];

        // $("#" + SaveID).attr("onclick", "alert(\"题号：" + ids[i] + ",模式" + Jmode + ",次数" + JTimes + ",最后得分" + GetLastScore("#" + LastScoreID) + "\")")
        //                    $("#" + SaveID).delegate("#" + SaveID, "click",  function () {
        //                    alert("题号：" + ids[i] + ",模式" + Jmode + ",次数" + JTimes + ",最后得分" + GetLastScore("#" + LastScoreID))
        //                     });
        //                    var did = ids[i];
        $("#" + SaveID).attr("class", i);
        //                    $("#" + SaveID).click(function (did) {
        //                        alert("题号：" + parseInt( did) + ",模式" + Jmode + ",次数" + JTimes + ",最后得分" + GetLastScore("#" + LastScoreID))

        //                    })
    }

}
);

//            function GetLastScore(selector) {
//                return $(selector).attr("value");
//            }


//报错得分
function save(selector)
{
    var thisID = $(selector).attr("id")
    var did = thisID.toString().substring(4); //答题ID
    var index = $(selector).attr("class")

    var Jmodes = $("#HiddenField_JudgeModeList").val();
    var JTimes = $("#HiddenField_JudgeTimesList").val();
    var jms = Jmodes.split(',');
    var jtms = JTimes.split(',');

    var Jmode = jms[index]// $("#" + H_JmodeID).val();//阅卷模式
    var JTimes = jtms[index]//$("#" + H_JtimesID).val();//阅卷次数

    var LastScoreID = "Hidden_Score" + did; //最后得分ID
    var LastScore = $("#" + LastScoreID).val();

    if (LastScore == "") {
        $("#tips_" + did).html("请输入最终分数")
    }
    else {
        var version = $("#HiddenFieldJudgeVersion").val();
         
        if (version == '2') {//2013 06版本打分
          
            JudgeScore201306(parseFloat(LastScore));

        }
        else {//老版本打分
            JudgeSave(did, parseFloat(LastScore), parseInt(Jmode), parseInt(JTimes));
            //                    alert(did + "," + index + "," + "" + ",模式" + Jmode + ",次数" + JTimes + ",得分" + LastScore)
        }
    }
}


function JudgeScore201306(score) {

    var examid = $("#HiddenFieldExamID").val();
    var userid = $("#HiddenFieldUserID").val();
    var asdid = $("#HiddenFieldASDID").val();
    var judgerType = $("#HiddenFieldJudgerType").val();

    var iamarbiter='-1';
    var totalTimesOnRoeund1 = '-1';
    var ambiguousID = '-1';
    var judgedetailid = '-1';

    if (judgerType == '1') {//普通组员
        totalTimesOnRoeund1 = $("#HiddenFieldTotalTimesOnRound1").val();
        judgedetailid = $("#HiddenFieldJudgeDetailID").val();

    }
    else if (judgerType == '3') {//组长
        iamarbiter = $("#HiddenFieldIamArbiter").val();
        ambiguousID = $("#HiddenFieldAmbiguousID").val();
    }
    else if (judgerType == '2') {//专家
        ambiguousID = $("#HiddenFieldAmbiguousID").val();

    }


    $.ajax(
            {
                type: "post",
                url: "JudgeScoreHandler.ashx",
                data: { "examid": examid, "userid": userid, "asdid": asdid, "judgerType": judgerType,
                    "iamarbiter": iamarbiter, "totalTimesOnRoeund1": totalTimesOnRoeund1, "ambiguousID": ambiguousID, "judgedetailid": judgedetailid,
                 "Score": score,"isNewVersion":"true" },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    //                    alert("失败:" + "\n错误状态文本描述：" + textStatus
                    //                            + "\n详细错误：" + errorThrown +
                    //                            "\n服务器返回状态码：" + XMLHttpRequest.status +
                    //                            "\n异步状态码：" + XMLHttpRequest.readyState);

                    printTips(asdid, "服务器繁忙，请重试！");
                },
                success: function (result) {

                    if (result == "succed") {
                        printTips(asdid, "成功打了" + score + "分");
                        // $("#nextTips" + DetailID).html("ok");
                        $("#nextTips" + asdid).attr("ID", "OK")
                    }
                    else {
                        printTips(asdid, "服务器错误，保存失败，请联系管理员")
                    }
                }
            }
         );

}


//专业阅卷  输入框 打分时 验证

function JudgeSave(did, score, judgemode, judgetimes) {
    $.ajax(
            {
                type: "post",
                url: "JudgeScoreHandler.ashx",
                data: { "JudgeMode": judgemode, "JudgeTimes": judgetimes, "DetailID": did, "Score": score },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    //                    alert("失败:" + "\n错误状态文本描述：" + textStatus
                    //                            + "\n详细错误：" + errorThrown +
                    //                            "\n服务器返回状态码：" + XMLHttpRequest.status +
                    //                            "\n异步状态码：" + XMLHttpRequest.readyState);

                    printTips(did, "服务器繁忙，请重试！");
                },
                success: function (result) {

                    if (result == "succed") {
                        printTips(did, "成功打了" + score + "分");
                        // $("#nextTips" + DetailID).html("ok");
                        $("#nextTips" + did).attr("ID", "OK")
                    }
                    else {
                        printTips(did, "服务器错误，保存失败，请联系管理员")
                    }
                }
            }
         );
}

function printTips(DetailID, msg)
{
    $("#tips_" + DetailID).html("<font color='red'>" + msg + "</font>");
    $("#tips_" + DetailID).fadeIn(100).delay(3000).fadeOut(1500);

}


