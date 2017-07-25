/// <reference path="PopWindow/gzy.popup.js" />
/// <reference path="jquery-1.7.min.js" />
/// <reference path="ExamSlu.js" />

var selectSolutionListWin;
var callBack;

var selectSlu_rowsPerPage = 10;
var selectSlu_curPageNum = 1;
var selectSlu_maxPage;

///<param name="callback" type="">回调函数，带参数ID+Name</param>
function getPaperParamSluId(callback) {
    callBack = callback;

    selectSolutionListWin = new gzy.popup('选择组卷方案', 750,430, {
        html: "<div id=\"sluList\"></div><div id=\"selecSluList_Pager\"></div><script type=\"text/javascript\" src=\"/scripts/webFormPager/gzyPager.js\"></script>"
    });
    showList();
}

function showList() {
    var dataObj;
    var paperType;
    $.post("ExamSlu.ashx", { "method": "showPaperParamList", "rowsPerPage": selectSlu_rowsPerPage, "pageNum": selectSlu_curPageNum },
        function (data) {
            if (data.result != "登录已失效") {
                paperType = "random";
                dataObj = data.result.paramList;
                var str = "";
                str += "<table class=\"list\"><thead><tr><th>选择</th><th>序号</th><th>名称</th><th>类型</th><th>出卷人</th><th>创建时间</th><tr></thead>";
                $.each(dataObj, function (index, content) {
                    str += "<tr><td><input id=\"" + content.id + "-" + content.name + "\" type =\"radio\" onclick=\"getId($(this))\" name = \"sel\"/></td><td>" + (index + selectSlu_rowsPerPage * (selectSlu_curPageNum - 1) + 1) + "</td><td><a title=\"单击查看详细信息\" href=\"javascript:showInfo('" + paperType + "'," + content.id + ");\">" + content.name + "</a></td><td>" + content.type + "</td><td>" + content.authorName + "</td><td>" + content.createdTime + "</td><tr>";
                });
                str += "</table>";
                $("#sluList").html(str);
                selectSlu_maxPage = data.result.totalpages;
                gzyPager(selectSlu_maxPage, selectSlu_curPageNum, selectSlu_rowsPerPage, function (pageNum) {
                    selectSlu_curPageNum = pageNum;
                    showList();
                }, function (currentPageNum, rowsPerPage) {
                    selectSlu_curPageNum = currentPageNum;
                    selectSlu_rowsPerPage = rowsPerPage;
                }, $("#selecSluList_Pager"), true);
            }
            else {
                alert(data.result + " \n请重新登录");
                window.open('/login.htm', '_top');
            }
        }, "json");
    //
}

 function getId(obj) {
     selectSolutionListWin.close();
    // alert(obj.attr("id"));
     callBack(obj.attr("id"));
 }