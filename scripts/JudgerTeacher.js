/// <reference path="jquery-1.7.min.js" />


function ValidateCheckBoxList(judgeMode) {
    //验证CheckBoxList1是否至少有一个已经选择
    //当 JudgeMode=1时，验证CheckBoxList2是否至少有一个已经选择
    //如果不符合上述添加返回 false

    var temp = false;
    //id为CheckBoxList1的table的所有checked的input元素
    if ($("table#CheckBoxList1 input:checked").length == 0) {
        if (judgeMode == 1) {
            tips("tips_span", "未选中任何“一阅、二阅老师”");
        }
        if (judgeMode == 2) {
            tips("tips_span", "未选中任何“阅卷老师”");
        }
    }
    else {
        if (judgeMode == 1 && $("table#CheckBoxList2 input:checked").length == 0) {
            tips("tips_span", "未选中任何“专家组老师”");
        }
        else {
            temp = true;
        }
    }
    if (temp) {//客户端验证合格

        var generalGroupJuderIDs = "";
        var expertGroupJudgerIDs = "";

        $("table#CheckBoxList1 input:checked").each(function (ele, i) {
            //alert($(this).parent().attr("class"));
            generalGroupJuderIDs += $(this).parent().attr("class") + ",";
        })

        $("table#CheckBoxList2 input:checked").each(function (ele, i) {

            expertGroupJudgerIDs += $(this).parent().attr("class") + ",";
        })
        var examid = $("#HiddenField_ExamID").val();
        var mode1Json = {
            "examid": examid,
            "method": "SaveJudgers",
            "JudeMode": judgeMode,
            "generalGroupJuderIDs": generalGroupJuderIDs,
            "expertGroupJudgerIDs": expertGroupJudgerIDs
        };
        var mode2Json = {
            "examid": examid,
            "method": "SaveJudgers",
            "JudeMode": judgeMode,
            "generalGroupJuderIDs": generalGroupJuderIDs
        };
       // var modejson = (judgeMode == 1) ? mode1Json : mode2Json;

        $.ajax({
            async: true,
            type: "get",
            url: "JudgeSetHandler.ashx",
            data: {
            "examid": examid,
            "method": "SaveJudgers",
            "JudeMode": judgeMode,
            "generalGroupJuderIDs": generalGroupJuderIDs,
            "expertGroupJudgerIDs": (expertGroupJudgerIDs == "" )? null : expertGroupJudgerIDs
        },
        //modejson,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("失败:" + "\n错误状态文本描述：" + textStatus + "\n详细错误：" + errorThrown + "\n服务器返回状态码：" + XMLHttpRequest.status + "\n异步状态码：" + XMLHttpRequest.readyState);
            },
            success: function (response, status, xhr) {
                if (response == "ok") {
                    parent.parent.SelectTeacherPopup.close();
                }
            }
        });
    }
}


function tips(id, msg) {
    $("#" + id).html("<font color='red'>（" + msg + "）</font>");
    $("#" + id).fadeIn(300).delay(1500).fadeOut(900);
}


function Save() {
    var judgeMode = $("#HIDDENFIELD_JUDGEMODE").val();
    ValidateCheckBoxList(judgeMode)
}
