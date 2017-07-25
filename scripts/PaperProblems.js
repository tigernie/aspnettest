/// <reference path="PopWindow/gzy.popup.js" />
/// <reference path="jquery-1.7.min.js" />
/// <reference path="common.js" />
/// <reference path="lib/problib.js" />
/// <reference path="problembrowser.js" />

var __paperId;
function GetPaperProblems(paperId, canChange, callBackFunc) {
    var win = new gzy.popup('试卷详细信息', 700, 540, {
        html: '<div style="text-align:center;padding-top:6px;font-size:12px;margin-top:200px;">正在加载试题列表...<br /><img src="/images/ajax-loader.gif"/></div>',
        onload: function () {
            $.post("showPaperProbems.ashx", { "method": "ShowAllProblems", "paperId": __paperId = paperId },
                function (data) {
                    var htmlStr = "";
                    var visible;
                    if (canChange)
                        visible = "visible";
                    else
                        visible = "hidden";
                    $.each(data.data, function (index, content) {
                        htmlStr += "<thead><tr id='tr_" + (index + 1) + "'><th>" + (index + 1) + "</th><th>难度：" + content.difficulty + "&nbsp;&nbsp;&nbsp;题型:" + content.type
                            + "&nbsp;&nbsp;&nbsp;所在知识点:<label title='" + content.kpath + "'>" + (content.kpath.length>20?content.kpath.substr(0, 20)+"...":content.kpath) + "</label>"
                            + "</th><th><a id='changeProb' href=\"javascript:changeProb(" + content.innerindex + "," + content.kpids.split(',')[0] + "," + content.typeId + ",'" + content.difficulty + "');\" style=\"visibility:" + visible + "\" >换题</a> <a style='display:none' id='restore_" + content.innerindex + "' href='javascript:;' onclick='restore(" + content.innerindex + "," + content.id + ")'>撤消</a></th></tr></thead><tr><td colspan=\"3\" id='content_" + (index + 1) + "'>" + replace(content.content) + "</td></tr><tr><td colspan=\"3\" ><label style=\"visibility:hidden\">2</label></td></tr>";
                    });
                    htmlStr = "<table class=\"list\" style=\"width:100%\">" + htmlStr + "</table>";
                    win.body.html(htmlStr);

                }, "Json");
        },
        onclose: function () {
            callBackFunc();
        }
    });
}

function changeProb(id, kpids, probTypeid, diff) {
    var b = new ProblemBrowser('浏览试题');
    //b.difficulty = diff;
    b.kp = kpids;
    b.type = probTypeid;
    //b.pid = id;
    b.onselect = function (data) {
        paper.replaceProblem(__paperId, id, data.id, function (d) {
            if (d.ok) {
                $('#tr_' + id).find('th:eq(1)').html(String.$('难度：{1} &nbsp; 题型:{2} &nbsp; 所在知识点:{3}', d.data.difficulty, d.data.type, d.data.kfullpath));
                $('#content_' + id).html(d.data.content);
                //$('#restore_' + id).show();
                alert('换题成功');
                b.close();
                __paperId = d.msg;
            } else {
                alert(d.msg);
            }
        });
        return false;
    }
    b.show();
}
function restore(id, probid) {
    paper.replaceProblem(__paperId, id, probid, function (d) {
        $('#tr_' + id).find('th:eq(1)').html(String.$('难度：{1} &nbsp; 题型:{2} &nbsp; 所在知识点:{3}', { 0.5: '一般', 0.8: '容易', 0.3: '难题' }[d.data.difficulty], d.data.type, d.data.kfullpath));
        $('#content_' + id).html(d.data.content);
        $('#restore_' + id).hide();
    });
}



function replace(text) {
    var i;
    var newText = "";
    for (i = 0; i < text.length; i++)
        if (text.charAt(i) == '＂')
            newText += "\"";
        else if (text.charAt(i) == '＼')
            newText += "\n";
        else if (text.charAt(i) == '＇')
            newText += "'";
        else
            newText += text.charAt(i);
    return newText;

}



// function selectProblems(kpid