/// <reference path="../jquery-1.7.min.js" />

//为一道题根据评分点个数 生成输入框
function RenderJudgeBox(DetailID, ProbScore, judgeCount) {
    judgeCount = parseInt(judgeCount);
    ProbScore = parseFloat(ProbScore);
    var judgeBoxs = "";

    if (judgeCount >= 2) {//多余1个得分点 则自动生成客户端控件
        judgeBoxs = "（提示：您可直接输入总分）";
        judgeBoxs += "<table border='0' style='margin-top:4px;' cellpadding=0 cellspace=0 class='tablebox'>"

        judgeBoxs += "<tr>";
        judgeBoxs += RenderTextHead(judgeCount);
        judgeBoxs += "</tr>";

        judgeBoxs += "<tr>";
        judgeBoxs += RenderTextInput(DetailID, judgeCount, ProbScore);
        judgeBoxs += "</tr>";
        judgeBoxs += "</table>";
    }
    else {
        judgeBoxs = "打" + GetBox2(DetailID, ProbScore) + "分<br />";
    }

    judgeBoxs += "<span>&nbsp;</span><span id=\"tips_" + DetailID + "\" style=\" color:red; height:23px; width:50px;\"></span>";
    $("#jb_" + DetailID).append(judgeBoxs)


}

//呈现一组输入框上面的小头部
function RenderTextHead(judgeCount) {
    var res = "";
    for (var i = 0; i < judgeCount + 1; i++) {
        if (i <= judgeCount - 1) {
            res += "<th style='font-size:10px;'>评分项" + (i + 1) + "</th>";
        }
        else {
            res += "<th class='total'>总分</th>";
        }
    }
    return res;
}

//呈现一组输入框中的单个输入框
function RenderTextInput(did, judgeCount, ProbScore) {
    var tmpJudgeBoxs = "";
    for (var i = 0; i < judgeCount + 1; i++) {
        var box = GetBox(did, i, judgeCount, ProbScore);
        tmpJudgeBoxs += "<td>" + box + "</td>";
        if (i <= judgeCount - 2) {
            tmpJudgeBoxs += "";
        }
        else if (i == (judgeCount - 1)) {
            tmpJudgeBoxs += "";
        }
    }
    return tmpJudgeBoxs;
}

//答题ID ,得分点索引（从0开始） ,总分输入框所在索引,该题分值
function GetBox(did, index, TotalIndex, ProbScore) {
    return "<input id=\"box_p" + did + "_i" + index + "\" name=\"nm_p" + did + (index != TotalIndex ? "" : TotalIndex) + "\" onkeyup=\"checkValue(" + did + "," + (index + 1) + "," + TotalIndex + "," + ProbScore + ")\" style=\"  width:26px;  height:23px;\" type=\"text\" />";
}

//答题ID ,  得分点序号(从1开始),总分输入框所在索引,该题分值
function checkValue(DetailID, Seq, TotalIndex, ProbScore) {
    var TipsId = "tips_" + DetailID;
    $("#" + TipsId).html(""); //清空上次提示
    var BluringTextBoxId = "box_p" + DetailID + "_i" + (Seq - 1); //刚失去焦点的输入框ID
    var BluringTextBoxName = "nm_p" + DetailID + ((Seq - 1) != TotalIndex ? "" : TotalIndex);
    var BluringTextBoxValue = $("#" + BluringTextBoxId).attr("value")
    var TotalScoreBoxId = "box_p" + DetailID + "_i" + TotalIndex;

    $("#" + TotalScoreBoxId).parent().addClass('total');

    var BoxesName = "nm_p" + DetailID; //各得分点的name属性

    var LastScoreID = "Hidden_Score" + DetailID;

    if (BluringTextBoxId != TotalScoreBoxId) {//如果总分框 不是收到输入的，则验证前先清空总分框
        $("#" + TotalScoreBoxId).attr("value", "");
    }

    var tmpTotalScore = 0;
    $("[name=" + BoxesName + "]").each(function (_index) {
        var thisValue = $(this).attr("value")
        if (thisValue != "") {
            if (thisValue == parseFloat(thisValue)) {  //验证当前题目的所有输入框 是否合法 （包括得分点和总分）
                tmpTotalScore += parseFloat(thisValue);
            }
            else {

                $(this).attr("value", thisValue.substring(0, thisValue.length - 1));
                $("#" + TipsId).html("第<b>" + (_index + 1) + "</b>个得分点只能是整数或者以“.5”结尾的数");
                return false;
            }
        }
    });

    //区分总分是否已经输入  来显示总分输入框
    var TotalScoreBoxValue = $("#" + TotalScoreBoxId).attr("value");
    if (TotalScoreBoxValue == "") {//没有手动输入该框
        if (tmpTotalScore <= ProbScore) {//分值内
            if (parseFloat(tmpTotalScore) < 0) {
                $("#" + TipsId).html("给的总分不能小于0");
                $("#" + TotalScoreBoxId).attr("value", 0);
            }
            else//基本合法
            {
                //是否满足 整数 或者.5结尾的要求
                if (ScoreIsValid(tmpTotalScore))//满足
                {
                    $("#" + TotalScoreBoxId).attr("value", tmpTotalScore);
                }
                else//不满足
                {
                    //将其设置为小于等于分值的 最接近的合法值
                    var validScore = ConvertScoreToValid(tmpTotalScore, ProbScore);
                    $("#" + TotalScoreBoxId).attr("value", validScore);
                    printTips2("#" + TipsId, "只能是以“.5”结尾的小数");
                }
            }
        }
        else {//超过分值
            $("#" + TipsId).html("给的总分不能超过该题分值");
            $("#" + TotalScoreBoxId).attr("value", ProbScore);
        }
    }
    else {//是手动输入该框  则验证是否合法
        if (TotalScoreBoxValue == parseFloat(TotalScoreBoxValue)) {//字符合法
            if (parseFloat(TotalScoreBoxValue) <= ProbScore) {//在分值内

                if (parseFloat(TotalScoreBoxValue) < 0) {
                    $("#" + TipsId).html("给的总分不能小于0");
                    $("#" + TotalScoreBoxId).attr("value", 0);
                }
                else//基本合法
                {
                    //是否满足 整数 或者.5结尾的要求
                    if (!ScoreIsValid(TotalScoreBoxValue))//不满足
                    {
                        //将其设置为小于等于分值的 最接近的合法值

                        var validScore = ConvertScoreToValid(TotalScoreBoxValue, ProbScore);
                        $("#" + TotalScoreBoxId).attr("value", validScore);
                        printTips2("#" + TipsId, "只能是以“.5”结尾的小数");
                    }
                    else {

                    }
                }

            }
            else {//不在分值内

                $("#" + TipsId).html("给的总分不能超过该题分值");
                $("#" + TotalScoreBoxId).attr("value", ProbScore);
            }
        }
        else {//字符不合法
            $("#" + TotalScoreBoxId).attr("value", TotalScoreBoxValue.substring(0, TotalScoreBoxValue.length - 1));
        }
    }
    //    $("#save" + DetailID).focus();
    document.onkeyup = function () {//
        if (event.keyCode == 13 || event.keyCode == 108) {
            $("#save" + DetailID).click(); //按回车键保存给分
        }
    }

    $("#" + LastScoreID).attr("value", $("#" + TotalScoreBoxId).attr("value"));

}




//只有一个得分点的情况
function GetBox2(did, ProbScore) {
    return "<input class='singleJudgePointInput' id=\"box_p" + did + "\"  onkeyup=\"checkValue2(" + did + "," + ProbScore + ")\" style=\"  width:26px;  height:23px;\" type=\"text\" />";
}
//只有一个得分点时 验证输入
function checkValue2(DetailID, ProbScore) {

    var LastScoreID = "Hidden_Score" + DetailID;


    var tipsID = "tips_" + DetailID;

    printTips2("#" + tipsID, ""); //清空提示

    var boxID = "box_p" + DetailID;
    var boxValue = $("#" + boxID).attr("value");
    if (boxValue != "") {
        if (boxValue == parseFloat(boxValue)) {
            if (parseFloat(boxValue) > ProbScore) {
                $("#" + boxID).attr("value", ProbScore);
                printTips2("#" + tipsID, "给分不能超过分值");
            }
            else if (parseFloat(boxValue) < 0) {
                $("#" + boxID).attr("value", 0);
                printTips2("#" + tipsID, "给分不能小于0");
            }
            else//基本合法
            {
                //是否满足 整数 或者.5结尾的要求
                if (!ScoreIsValid(boxValue))//不满足
                {
                    //将其设置为小于等于分值的 最接近的合法值

                    var validScore = ConvertScoreToValid(boxValue, ProbScore);
                    $("#" + boxID).attr("value", validScore);
                    printTips2("#" + tipsID, "只能是以“.5”结尾的小数");
                }
            }
        }
        else {
            $("#" + boxID).attr("value", boxValue.substring(0, boxValue.length - 1));
            printTips2("#" + tipsID, "只能是整数或者以.5结尾的在0到分值之间的数");
        }
    }

    $("#" + LastScoreID).attr("value", $("#" + boxID).attr("value"));
}

//向浏览器输出提示
function printTips2(selector, msg) {
    $(selector).html(msg);
}

//验证输入的分数是否有效
function ScoreIsValid(score) {
    return score != "" ? ((score == parseInt(score) || score.toString().substring(score.length - 2) == ".5") ? true : false) : true;
}

//将给的最后得分转换为 符合要求的值 并返回
function ConvertScoreToValid(Score, TotalScore)//进这个函数的数 都是 0到满分之间的非0.5结尾的小数
{
    var res = TotalScore / 2;
    var _score = parseFloat(Score);
    var _TScore = parseInt(TotalScore);
    //只要不是0的小数  小于0.5转换为0.5  大于0.6转换为1   是0.5<=A<0.6转为0.5    即小于0.6 转换为0.5  大于等于0.6转换为1

    //小于总分的数   如满分10分   即在1到10之间的小数 A  如果A小于9.5 转换为9分，如果大于9.6转换为10分，如果9.5<=A<9.6转为9.5

    if (_score < 1) {
        if (_score < 0.6) {
            res = 0.5;
        }
        else {
            res = 1;
        }

    }
    else {
        var temp = Score.toString().split('.');
        var partInt = parseInt(temp[0]);
        var PartPoint = parseInt(temp[1]);

        if (PartPoint < 5)//小数部分 小于0.5
        {
            res = partInt
        }
        else if (PartPoint >= 5 && PartPoint < 6) //小数部分 大于等于0.5 小于0.6
        {
            res = partInt + 0.5;
        }
        else//小数部分大于等于0.6
        {
            res = partInt + 1;

        }

        if (res > _TScore)//为了保险
        {
            res = _TScore;
        }


    }

    return parseFloat(res);

}

        