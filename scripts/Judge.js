/// <reference path="../jquery-1.7.min.js" />
/// <reference path="../console.js" />
/// <reference path="../common.js" />
/// <reference path="../Scripts/PopWindow/gzy.popup.js" />
/// <reference path="../webForm_common.js" />
/// <reference path="../My97DatePicker/WdatePicker.js" />







function AbsentNames() {
    new gzy.popup('缺考人名单', 600, 400, 
    { url: 'AbsentNames.aspx'});
     //?classid='+id 
}

function ProblemDetail(id) {
    
    new gzy.popup('试题详情', 550, 300,
    { url: 'ProblemDetail.aspx?probid='+id });
}


function getJudgerList() {
//    new gzy.popup('阅卷老师列表', 600, 300, {
//    
//         element: $("#TeacherList")
//    });

    var tlist = document.getElementById("TeacherList");
    tlist.style.display = "block";

}



//点击下一份试卷时 触发的事件

//规则：至少有一个下拉列表的 当前选项是 空格，则不能跳转到下一份试卷。但是可以将 为批阅项给0分的复选框选上，然后方可到下一份试卷

//参数说明：sender是产生事件的元素的ID；e是下拉列表的class属性值




var sender="#linkbutton", e=".dropdownlist"
$(document).ready(function () {
    $(sender).click(function () {

    })
}
)

//      $("#Checkbox1").css("display", "block");
//  
//有未批阅的情况 自动将复选框 显示出来
//function checkJudge() {
//    var result = true;
//    var isFirst = true;
//    $(e).each(function (index) {
//        if ($(this).val() == ' ') {
//            if (isFirst) {

//                $(".tips").html("<font color='red'>（还有题目未阅，请阅完后再试……）</font>");
//              

//                //显示复选框

//             $(".tips").fadeIn(300).delay(1500).fadeOut(900);     

//                isFirst = false;
//            }
//            result = false;
//        }

//    });
//    return result;
//}

function checkJudge() {
    var tmp = true;
    $(".nextTips").each(function (index, element) {
        if ($(this).attr("ID") != 'OK') {//不等于OK 表示 未打分成功
                tmp=false;
                $(this).html("该题未阅");
                $(this).css("display", "");
                $(this).fadeIn(300).delay(1500).fadeOut(900);
            }
        return tmp;//如果是false 将终止遍历
    });
    return tmp;//一false  则返回false
}



//复选框变动的时候 判断 复选框当前是否选中  如果是选中 立即将 所有当前选中的空格的下来 调整为 0被选中

function changeDDLselectedItem(e) {
    if ($(e).attr("checked") == "checked") {

        $(".dropdownlist").each(function (index) {
           // alert(true)
            if ($(this).val() == ' ') {

                //$(this).val(0); //将值为0的项设为选中

            }
     });
    }
}

//下拉列表变动时 后面给一个提示  绿色成功  红色表示 空格 未阅

function checkHasJudged(e) {



}

$(document).ready(function () {
    $(".dropdownlist").change(function () {

        if ($(e).val() == ' ') {
            $(e + "span > span").innerlHTML = "90";
           // alert(true)
        }
        else {
           // alert("不是空格")
        }
    })
}
)



function showConfirm(e) {
    var result = false;
    uic.confirm('你确定关闭阅卷吗？', function () {
        $.post("StopJudgeHandler.ashx", { "method": "stop", "examid": e.attr("class") },
             function (data) {
               
                 alert(111);
                 alert(data);
                 $("#RefreshButton").click();
             }, "json");
    }, e.rect(), 150, true);

    // alert('no');
    return false;
   
}
