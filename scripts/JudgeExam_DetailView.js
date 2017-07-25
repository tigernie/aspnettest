/// <reference path="../jquery-1.7.min.js" />
/// <reference path="PopWindow/gzy.popup.js" />

var SelectTeacherPopup; //从儿子中产生的父亲的儿子
var JudgeSetPopup; //儿子
top.mywin = null;

function TeacherList(Judgemode, Examid) {

    //1 表示专业 ，2表示普通
    //普通时高端减半
    SelectTeacherPopup = new gzy.popup("选择阅卷老师：", 540, 400, {
        url: "JudgerTeacherList.aspx?examid=" + Examid + "&judgemode=" + Judgemode,
        onclose: function () {//关闭时需要做的事情：找到第一个儿子中的指定元素，并调用其click事件
            JudgeSetPopup.body.find("#btnAllocate").click();
        }, id: 'select_teachers', onload: function (win) {
            top.mywin = win;
        } 
    });
}





function JudgeSet(examid) {
    JudgeSetPopup = new gzy.popup('阅卷设置', 600, 430, {
        url: 'judgeset.aspx?id=' + examid,

        onclose: function () {
            $("#RefreshButton").click()
        },
        buttons: [{ text: '确定', isCancel: true }]
    });
}

//查看普通阅卷老师的任务分配
function retrieveAllocate(examid) {

    new gzy.popup("普通组阅卷任务分配", 330, 200, { url: "JudgerTaskSize.aspx?examid=" + examid })
}









var judgeProgressPopup;

var tmpData = "";

//显示阅卷进度
function judgeProgress(examid) {
    var loading = showLoding('正在获取数据，请稍候');
    $("#proJudgeMode").css("display", "none")
    $("#geshu").css("display", "none")
    $("#norJudgeMode").css("display", "none")
    $("#fenshu").css("display", "none")


    //获得阅卷模式  和 4 个值（自动总数，自动完成数，人工总数，人工完成数）
    //从而计算出所有总数，所有完成数
    //进而计算出自动、人工以及所有的比例

    //1：专业模式；2：普通模式；0：默认值
    var judgeMode = 0//读取到的值
    var examname = ""

    var auto_total = 0; var auto_done = 0; var manual_total = 0;var manual_done = 0; //四个读取到的值

    var all_total = 0;var all_done = 0; //计算得到

    var auto_percent = 0.0; var manual_percent = 0.0;var all_percent = 0.0; //计算得到

    //读取阅卷模式
    judgeMode = 1;
    //读取考试名称
    examname = "默认考试名称";
    //读取前面的4个值
    auto_total = 120;
    auto_done = 62;
    manual_total = 80;
    manual_done = 16;

    //调用处理程序
    $.ajax(
            {
                type: "post",
                url: "JudgeProgressHandler2.ashx",
                data: { "examidKey": examid },
                timeout: 30000,
                dataType: "json",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("失败:" + "\n错误状态文本描述：" + textStatus
                    + "\n详细错误：" + errorThrown +
                    "\n服务器返回状态码：" + XMLHttpRequest.status +
                    "\n异步状态码：" + XMLHttpRequest.readyState);
                },
                success: function (result) {
                    loading.close();
                    success(result);
                }

            }
          );
    //            $.post("JudgeProgress.ashx", { "examidKey": examid }, function (data) { success(data) }, "json");

    //            $.post("JudgeProgress.ashx", { "examidKey": examid }, function (data) { alert(1) }, "json");
}



function success(data) {

    var auto_total = 0; var auto_done = 0; var manual_total = 0;var manual_done = 0; //四个读取到的值

    var all_total = 0;var all_done = 0; //计算得到

    var auto_percent = 0.0; var manual_percent = 0.0;var all_percent = 0.0; //计算得到

    if (data.status != "fail") {
        var judgeMode = data.examjudgemode;
        var examname = data.examname;
        var auto_total = data.auto_total;
        var auto_done = data.auto_done;
        var manual_total = data.manual_total;
        var manual_done = data.manual_done;

        //计算后面的5个值
        all_total = eval(auto_total) + eval(manual_total);
        all_done = eval(auto_done) + eval(manual_done);

        if (auto_total != 0) {
            auto_percent = auto_done / auto_total;
        }


        if (manual_total != 0) {

            manual_percent = manual_done / manual_total;
        }

        if (all_total != 0) {
            all_percent = all_done / all_total;
        }


        //给ui元素赋值

        $("#auto_total").html(auto_total);
        $("#auto_done").html(auto_done);
        $("#manual_total").html(manual_total);
        $("#manual_done").html(manual_done);

        $("#all_total").html(all_total);
        $("#all_done").html(all_done);

        if (auto_total != 0) {
            $("#auto_percent").html((auto_percent * 100).toFixed(2) + "%");
        }
        else {
            $("#auto_percent").html("100%");
        }

        if (manual_total != 0) {
            $("#manual_percent").html((manual_percent * 100).toFixed(2) + "%");
        }
        else {
            $("#manual_percent").html("100%");
        }
        if (all_total != 0) {
            $("#all_percent").html((all_percent * 100).toFixed(2) + "%");
        }
        else {
            $("#all_percent").html("100%");
        }

        if (judgeMode == 1) {//专业模式
            $("#proJudgeMode").css("display", "")
            $("#geshu").css("display", "")

            $("#norJudgeMode").css("display", "none")
            $("#fenshu").css("display", "none")
        }
        else if (judgeMode == 2) {//普通模式
            $("#proJudgeMode").css("display", "none")
            $("#geshu").css("display", "none")

            $("#norJudgeMode").css("display", "")
            $("#fenshu").css("display", "")
        }


        $("#examname").html(examname);

        judgeProgressPopup = new gzy.popup("阅卷进度", 500, 250, { element: $("#judgeProgress") });


    }
    else {//失败

    }

}


var popup_detailView;

function popupProgress() {
    popup_detailView=new gzy.popup(null, 200, 25, { element: $("#progress") });
}

function getExpertTaskCount(examid) {

    $.ajax(
            {
                type: "post",
                url: "JudgeSetHandler.ashx",
                data: { "examid": examid, "method": "getExpertTaskCount" },
                timeout: 30000,
                dataType: "json",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("失败:" + "\n错误状态文本描述：" + textStatus
                    + "\n详细错误：" + errorThrown +
                    "\n服务器返回状态码：" + XMLHttpRequest.status +
                    "\n异步状态码：" + XMLHttpRequest.readyState);
                },
                success: function (result) {

                    if (result == "-1") {
                        $(".etc_" + examid).html("（目前无争议试题，请稍后）");
                    }
                    else {
                        $(".etc_" + examid).html(result); 
                    }
                },
                async: true

            }
          );
        }


        //关闭阅卷提示
        function closeJudge() {
            new gzy.popup(null, 200, 25, { element: $("#close_judge") });
            
        }