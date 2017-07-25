//使用说明：
//1. 需要在UpdatePanel中间放置一个TextBox(id为PageBox,需要静态ID)，后台从该处读取需要显示的页码与每页显示行数,如（pageNum/rowsPerPage）
//2. 需要在UpdatePanel中放置一个Button（id为RefreshButton,需要静态ID),并在该控件的后台Click事件中按PageBox的值刷新UpdatePanel
//3. 分页放在id为gzyPager的div中
//4. 在页面后台刷新有关的方法中写ScriptManager.RegisterStartupScript(UpdatePanel1, this.GetType(), "refresh", ShowPager(填写最大页数，当前页数), true);



var isFirst = true;
var goPageMode = 1;


/// <param name="maxPageNum" type="int">最大页数</param>
/// <param name="curPageNum" type="int">当前页数</param>
///<param name="curPageNum" type="int">每页行数</param>
///<param name="gzyjump" type="func">转转方法，含有一个参数，参数为将要跳转到的页</param>
///<param name="callBackFunc" type="func">回调方法，含有两个参数，第一个参数为当前页号，第二个参数为每页显示行数</param>
///<param name="pagerObj" >用于显示pager的div的Jquery对象</param>
function gzyPager(maxPageNum, curPageNum, rowsPerPage, gzyjump, callBackFunc, pagerObj) {

    //默认显示10
    var pageHtml = "";
    jump = gzyjump;
    var reduced = arguments[6] ? arguments[6] : false;
    var hidden = "";
    if (reduced)
        hidden = " style=\"display:none\"";

    //  alert(maxPageNum);
    if (maxPageNum != 0) {
        pageHtml = "<div id=\"gzyPager_pager\" class=\"gzypager\">";
        if (curPageNum != 1)
            pageHtml += "<a href=\"javascript:jump(" + (curPageNum - 1).toString() + ");\">&lt; 上一页</a>";

        if (!reduced) {
            var startPage = maxPageNum - curPageNum < 6 ? maxPageNum - 9 : (curPageNum - 3 > 0 ? curPageNum - 3 : 1);
            startPage = startPage > 0 ? startPage : 1;
            var i;
            for (i = startPage; i <= startPage + 6 && i <= maxPageNum; i++) {
                if (i == curPageNum)
                    pageHtml += "<span class=\"current\">" + addBlank(i) + "</span>";
                else
                    pageHtml += "<a href=\"javascript:jump(" + i + ");\">" + addBlank(i) + "</a>";
            }

            if (maxPageNum > i + 2) {
                pageHtml += "&nbsp;...&nbsp;";
                i = maxPageNum - 1;
            }
            for (; i <= maxPageNum; i++) {
                if (i == curPageNum)
                    pageHtml += "<span class=\"current\">" + addBlank(i) + "</span>";
                else
                    pageHtml += "<a href=\"javascript:jump(" + i + ");\">" + addBlank(i) + "</a>";
            }
        }
        if (curPageNum != maxPageNum)
            pageHtml += "<a href=\"javascript:jump(" + (curPageNum + 1).toString() + ");\">下一页 &gt;</a>";
        else {
            if (!reduced)
                pageHtml += "<a href=\"javascript:jump(" + (curPageNum + 1).toString() + ");\" style=\"display:none\">下一页 &gt;</a>";
            else
                pageHtml += "<a href=\"javascript:jump(" + (curPageNum + 1).toString() + ");\" style=\"display:none\">下一页 &gt;</a>";
        }
        if (reduced)
            pageHtml += "&nbsp;<label>共" + maxPageNum + "页</label>";
        if (maxPageNum != 1)
            pageHtml += "&nbsp;&nbsp;<label>到第</label>";
        if (goPageMode == 1) {
            if (maxPageNum != 1)
                pageHtml += "<input id=\"gzyPager_pageNum\" type=\"text\"  onkeyup=\"pageNumCheck($(this),"+maxPageNum+");\" /><label>页</label>&nbsp;";
            if (maxPageNum != 1)
                pageHtml += "<a id=\"gotoPage\" href=\"javascript:jump(1);\" >GO</a>";
        }
        pageHtml += "&nbsp;&nbsp;&nbsp;<label " + hidden + ">每页显示</label><select id=\"gzyPaper_select\" onchange = \"jump('1')\"" + hidden + ">";
            var rowsArr = new Array(10, 15, 20, 50, 100);
            for (i = 0; i < rowsArr.length; i++) {
                pageHtml += "<option value=\"" + rowsArr[i] + "\"";
                if (rowsPerPage == rowsArr[i]) {
                    pageHtml += " selected = \"selected\"";
                    // alert(rowsPerPage + "," + rowsArr[i]);
                }
                pageHtml += ">" + rowsArr[i] + "</option>";
            }
            pageHtml += "</select><label" + hidden + ">行</label>";
        if (goPageMode == 2)
            pageHtml += "<a href=\"javascript:showGoTo();\" title = \"跳转到指定一页\">跳转</a>";
        pageHtml += "</div>";
        callBackFunc(curPageNum, rowsPerPage);
    }
    addCss(pagerObj);
    pagerObj.html(pageHtml);

}

    function jump() { }


    function showGoTo() {
        var panel = "<div style=\"position:relative;top:-30px;background-color:red;height:54px;width:130px;\" >ok</div>";
        pagerObj.append(panel);
    }

    function addBlank(i) {
        return i.toString();
    }

    function addCss(pagerObj) {
        pagerObj.css("display", "block").attr("class", "gzy_pager").css("width", "97%");
    }



function ShowPager(maxPageNum, curPageNum, rowsPerPage) {
    if (arguments[3] != null)
        gzyPager(maxPageNum, curPageNum, rowsPerPage, jumpFuc, function (curPageNum, rosPerPage) { $("#PageBox").val(curPageNum + "/" + rowsPerPage + ""); }, $("#gzyPager"), arguments[3]);
    else
        gzyPager(maxPageNum, curPageNum, rowsPerPage, jumpFuc, function (curPageNum, rosPerPage) { $("#PageBox").val(curPageNum + "/" + rowsPerPage + ""); }, $("#gzyPager"));

}



function jumpFuc(pageNum) {
    if (pageNum != '') {
        var rowsPerPage;
        if ($("#gzyPaper_select") == null)
            rowsPerPage = 13;
        else
            rowsPerPage = $("#gzyPaper_select").val();
        $("#PageBox").val(pageNum + "/" + rowsPerPage + "");
        $("#RefreshButton").click();
    }
}


function pageNumCheck(obj, maxNum) {
    var newPageNum = 1;
    if (obj.val() != '') {
        if (isNaN(obj.val()))
            obj.val(1);
        else {
            newPageNum = parseInt(obj.val());
            if (newPageNum > maxNum)
                newPageNum = maxNum;

        }
    }
    obj.parent().find("#gotoPage").attr("href", "javascript:jump(" + newPageNum + ");");
}


$(function () {
    $("<link>")
    .attr({
        rel: "stylesheet",
        type: "text/css",
        href: "/scripts/webFormPager/gzyPager.css"
    })
    .appendTo("head");
});

