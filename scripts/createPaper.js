/// <reference path="PopWindow/gzy.popup.js" />
/// <reference path="jquery-1.7.min.js" />
/// <reference path="lib/scheme.js" />


function createPaper(oncloseFunc) {
    var createPaper_htmlStr = "<table class=\"list\" style=\"width: 100%\"><tr><td class=\"title\"><label>试卷名称：</label></td><td><input type=\"text\" id=\"PaperNameBox\")\" /></td>" +
        "</tr><tr></tr><tr><td class=\"title\"><label>选择创建试卷的方案：</label></td><td><input type=\"text\" disabled=\"disabled\" id=\"SolutionID\" />&nbsp;<input type=\"button\" id=\"selSolution\"" +
        " value=\"选择方案\" class=\"btn\" onclick=\"getPaperParamSluId(function(SolutionName){setId(SolutionName);})\" /></td></tr><tr><td class=\"title\"><label>试卷份数：</label></td><td><input type=\"text\" id=\"PapersCount\" />" +
            "</td></tr></table><br /><div style=\"width:100%;text-align:center;\"><img class=\"Btn\" id=\"savePaper\" src=\"images/teacher.btn.save.jpg\"></img></div>";

    var win = new gzy.popup('新建试卷', 600, 200, {
        html: createPaper_htmlStr
    });
    $("#PapersCount").val('1').numberBox({ "max": 100, "min": 1, "step": 1 });
    $("#savePaper").click(function () {
        if (checkCreatePaper()) {
            var loading = showLoding('正在生成，请稍候');
            scheme.createPaper({ name: $("#PaperNameBox").val(), paramId: $("#SolutionID").val().split('-')[0], count: $("#PapersCount").val() }, function (d) {
                if (d.ok) {
                    main.current.init.load();
                    win.close();
                } else {
                    d.msg && alert(d.msg);
                }
                loading.close();
            })
            //$.post("ExamSlu.ashx", { "method": "createPaper", "name": $("#PaperNameBox").val(), "sluId": $("#SolutionID").val().split('-')[0], "papersCount": $("#PapersCount").val() },
            //    function (data) {
            //        loading.close();
            //        alert(data.result); //显示返回结果
            //        win.close();
            //        oncloseFunc();
            //    }, "json");
        }
    });
}

function setId(SolutionName) {
    $("#SolutionID").val(SolutionName);
}


function checkCreatePaper() {
    var result = false;
    if ($("#PaperNameBox").val() == '')
        alert('请填写试卷名称');
    else if ($("#SolutionID").val() == "")
        alert("请选择试卷方案");
    else result = true;
    return result;
}