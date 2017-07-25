/// <reference path="jquery-1.7.min.js" />
/// <reference path="Scripts/PopWindow/gzy.popup.js" />
/// <reference path="webForm_common.js" />
/// <reference path="ExamSlu.js" />


var callBackFuc;
var selectPaperIdsWin;
var selectPaper_rowsPerPage=10;
var selectPaper_curPageNum = 1;
var selectPaper_maxPage;

var selectPaperIds;

///
function addPaper(checkObj) {
    var id = checkObj.attr("id");
    var exist = false;
    var newPaperIds = new Array();
    if (selectPaperIds == null||selectPaperIds =="")
        selectPaperIds = new Array();
    $.each(selectPaperIds.toString().split(','), function (i, content) {
        if (content == id)
            exist = true;
        else
            newPaperIds.push(content);
    });

    if (exist == false) {
        selectPaperIds.push(id);
    }
    else
        selectPaperIds = newPaperIds;
}

///callBack参数为用户选择的试卷编号Array
function getPaperIds(callBack, existedIds) {
    selectPaper_curPageNum = 1;
    callBackFuc = callBack;
    selectPaperIds = existedIds;
    selectPaperIdsWin = new gzy.popup('选择试卷', 850, 420, {
        html: "<div id=\"paperList\"></div><div id=\"minPager\"></div><script type=\"text/javascript\" src=\"/scripts/webFormPager/gzyPager.js\"></script>",
        buttons: [{
            text: '确定', id: 'doneBtn', click: function () {
                selectPaperIdsWin.close();
                callBackFuc(selectPaperIds);
            }
        }]
    });
    selectPaperIds = existedIds;
    GetPapers();
}

function GetPapers() {
    var htmlStr = "";
    $.post("ExamSlu.ashx", { "method": "showPapers", "type": -1, "rowsPerPage": selectPaper_rowsPerPage, "pageNum": selectPaper_curPageNum },
        function (data) {
            if (data.result != "登录已失效") {
                htmlStr = showPapersList(data.result, selectPaperIds);
                $("#paperList").html(htmlStr);
                gzyPager(selectPaper_maxPage, selectPaper_curPageNum, selectPaper_rowsPerPage, function (pageNum) {
                    selectPaper_curPageNum = pageNum;
                    GetPapers();
                }, function (currentPageNum, rowsPerPage) {
                    selectPaper_curPageNum = currentPageNum;
                    selectPaper_rowsPerPage = rowsPerPage;
                }, $("#minPager"), true);
            }
            else {
                alert("登录已失效");
                window.open("/t", "_top");
            }
        }, "json");
}

function showPapersList(data, existedIds) {
    var str = "";
    var checkStr_True = "checked = \"checked\"";
    var checkStr = "";
    str += "<table class=\"list\"><thead><tr><th>选择</th><th>序号</th><th>名称</th><th>类型</th><th>总分</th><th>出卷人</th><th>创建时间</th><tr></thead>";
    $.each(data.papersList, function (index, content) {
        if (checkExisted(existedIds, content.id+"-"+content.name))
            checkStr = checkStr_True;
        else
            checkStr = "";
        str += "<tr><td class='selectArea'><input class=\"selPapersClass\" id=\"" + content.id + "-" + content.name + "\" " + checkStr + " onchange=\"addPaper($(this))\" type =\"checkbox\"  /></td><td>" + (index + selectPaper_rowsPerPage * (selectPaper_curPageNum - 1) + 1) + "</td><td><a title=\"单击查看详细信息\" href=\"javascript:;ShowPaperInfo(" + content.id + ");\">" + content.name + "</a></td><td>" + content.paperType + "</td><td>" + content.PaperScore + "</td><td>" + content.author + "</td><td>" + content.createdTime + "</td></tr>";
    });
    str += "</table>";
    paperIds = new Array();
    selectPaper_maxPage = data.totalpages;
    return str;
}

function checkExisted(existedIds, idAndName) {
    var result = false;
    $.each(existedIds, function (index, item) {
        if (item == idAndName.toString()) {
            result = true;
            return result;
        }
    });
    return result;
}

function getpaperId(obj) {
    obj.parent.parent.toggleClass("selectedRow");
}