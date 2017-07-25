/// <reference path="jquery-1.7.min.js" />
/// <reference path="console.js" />
/// <reference path="common.js" />
/// <reference path="Scripts/PopWindow/gzy.popup.js" />
/// <reference path="webForm_common.js" />
/// <reference path="ExamSlu.js" />


//检查必要数是否已经输入
function checkComplete() {
    if ($("#UniPaperSluNameBox").val() == '')
        return "请输入考试名称";
    if ($("#PapersCount").html() == '0份')
        return "请选择试卷";
    return "ok";
}




function CreateUniSlu(id, callBackFunc) {
    var title = "新建统一卷";
    if(id!='')
        title = "修改统一卷";
    var papersIds = new Array();
    var htmlStr = "<table class=\"list\" style=\"width： 100%\"><tr><td class=\"title\"><label>统一卷方案名称：</label></td><td><input type=\"text\" id=\"UniPaperSluNameBox\" /></td></tr>" +
        "<tr><td class=\"title\"><label>所用试卷类型：</label></td><td><input type=\"radio\" id=\"byCreatedPaper\" name=\"paperTypeSel\" checked=\"checked\"/>生成卷&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"radio\" id=\"byFixedPaper\"  name=\"paperTypeSel\" disabled=\"disabled\" />套卷</td></tr>" +
        "<tr><td class=\"title\">试卷列表：<input type=\"button\"  id=\"selPapers\" value=\"选择试卷\" class=\"btn\" /></td><td><label id=\"papersContainer\"></label></td></tr>" +
        "<tr><td class=\"title\"><label>试卷份数：</label></td><td><label id =\"PapersCount\">0份</label></td></tr>" +
        "<tr><td class=\"title\"><label>使用随机题序：</label></td><td><input type=\"checkbox\" id=\"isRandomOrder\"  /></td></tr></table>" +
        "<div style=\"text-align:center\"><br /><br /><br /><img alt=\"\" src=\"images/teacher.btn.save.jpg\" class=\"Btn\" id=\"saveSlu\" /></div>";

    var win = new gzy.popup(title, 450, 350, {
        html: htmlStr
    });
    var container = $("#papersContainer");
    $("#selPapers").click(function () {
        var htmlStr = "";
        var name = new Array();
        var uniPaperType = $("#byCreatedPaper").attr("checked") == "checked" ? 2 : 1;
        getPaperIds(uniPaperType, function (ids) {
            papersIds = new Array();
            $.each(ids, function (index, item) {
                name = item.split('-');
                htmlStr += "<label>" + item + "</label><br />";
                papersIds.push(name[0]);

            });
            if (papersIds.toString() != "")
                $("#PapersCount").html(papersIds.length + "份");
            else
                $("#PapersCount").html("0份");
            container.html(htmlStr);

        }, papersIds);


    });


    $("#saveSlu").click(function () {
        var saveBtn = $(this);
        var check = checkComplete();
        if (check == "ok") {
            showLoding();
            var method;
            if (id == '')
                method = "create";
            else
                method = "update";
            $.post("ExamSlu.ashx", {
                "method": method,
                "name": $("#UniPaperSluNameBox").val(),
                "uniPaperType": $("#byPaperParam").attr("checked") == "checked" ? "1" : "2",
                "IsRandomOrder": $("#isRandomOrder").attr("checked") == "checked" ? "true" : "false",
                "currentSluId": id,
                "paperIds": papersIds.toString()
            },

                         function (data) {
                             closeLoding();
                             alert(data.result); //显示返回结果
                             callBackFunc();
                             win.close();

                         }, "json");
        }
        else
            alert(check);

    });


    if (id != '') {
        $.post("ExamSlu.ashx", { "method": "show", "id": id, "papertype": "uni" }, function (data) {
            if (data.result != "登录已失效") {
                $("#UniPaperSluNameBox").val(data.result.SolutionName);
                if (data.result.UniPaperType == "生成卷")
                    $("#byPaperParam").attr("checked", "checked");
                else
                    $("#byFixedPaper").attr("checked", "checked");
                $("#PapersCount").html(data.result.PapersCount + "份");
                if (data.result.IsRandomOrder == "True")
                    $("#isRandomOrder").attr("checked", "checked");
                var htmlStr = "";
                $.each(data.result.papersCollection, function (index, paper) {
                    papersIds.push(paper.paperid);
                    htmlStr += "<label>" + paper.paperid + " - " + paper.papername + "</label><br />";
                });
                $("#papersContainer").html(htmlStr);
            }
            else {
                alert(data.result + " \n请重新登录");
                window.open('/login.htm', '_top');
            }



        }, "json");
    }



}