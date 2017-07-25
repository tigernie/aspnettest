/// <reference path="../jquery-1.7.min.js" />
/// <reference path="PopWindow/gzy.popup.js" />

var Increase_popup = null;
function Increase(examid, userid, MaxSize) {

    $("#increase_input").val('');
    Increase_popup=new gzy.popup("增加任务", 450, 150, { element: $("#increase")
    ,
        buttons: [{ text: '确定', isCancel: false,id:"increase_confirm_id" },{ text: '取消', isCancel: true }]
    })


    $("#increase_MaxSize").html(MaxSize);
    $("#increase_name").html($("#name_" + userid).html());

    $("#increase_confirm_id").bind("click", function () { increase_confirm(examid, userid) });
}

function increase_confirm(examid, userid) {
    var value = $("#increase_input").val();
    var maxSize = $("#increase_MaxSize").html();
    var increase_tips = $("#increase_tips");

    if (value.length == 0) { clear(increase_tips); tips(increase_tips, "请输入有效值！"); }

    checkInput($("#increase_input"), maxSize, increase_tips);

    IncreaseSize(examid, userid, value);
}

function IncreaseSize(examid, userid, size) {
    if (parseInt(size).toString() == 'NaN') {
        alert("请输入调整的任务数");
        return;
    }
    $.ajax({

        type: "post",
        url: "ManualJudgeProgressHandler.ashx",
        data: { "EXAMID": examid, "METHOD": "IncreaseSize", "USERID": userid, "SIZE": size },
        success: function (result) {

            if (result == "ok") {
               
                subToUnallocated(size); //添加到待分配任务池 仅显示

                addUserSizeAndPercent(userid, size);
                alert("成功增加任务！");

                Increase_popup.close();
            }
        }
    });
}


var Decarese_popup = null;
function Decrease(examid, userid, MaxSize) {
    $("#decrease_input").val('');
   Decarese_popup= new gzy.popup("减少任务", 450, 150, { element: $("#decrease")
    ,
        buttons: [{ text: '确定', isCancel: false,id:"decrease_confirm_id" }, { text: '取消', isCancel: true}]
    })

    $("#decrease_MaxSize").html(MaxSize);
    $("#decrease_name").html($("#name_" + userid).html());

    $("#decrease_confirm_id").bind("click",function(){ decrease_confirm(examid, userid)});


}
//确定减少
function decrease_confirm(examid, userid) {

    var value = $("#decrease_input").val();
    var maxSize = $("#decrease_MaxSize").html();
    var decrease_tips = $("#decrease_tips");

    if (value.length == 0) {clear(decrease_tips);tips(decrease_tips, "请输入有效值！"); }

    checkInput($("#decrease_input"), maxSize, decrease_tips);

    DecreaseSize(examid, userid, value);

}

function DecreaseSize(examid, userid, size) {

    if (parseInt(size).toString() == 'NaN') {
        alert("请输入调整的任务数");
        return;
    }
    $.ajax({

        type: "post",
        url: "ManualJudgeProgressHandler.ashx",
        data: { "EXAMID": examid, "METHOD": "DecreaseSize", "USERID": userid, "SIZE": size },
        success: function (result) {

            if (result == "ok") {
              
                addToUnallocated(size);//添加到待分配任务池 仅显示


                subUserSizeAndPercent(userid, size);

                alert("成功削减任务！");
                Decarese_popup.close();

               
            }
        }
    });
}
//减少该用户的显示
function subUserSizeAndPercent(userid, size) {
    var curTaskSize = $("#allocated_" + userid).html();

    var freshTaskSize = parseInt(curTaskSize) - parseInt(size);
    $("#allocated_" + userid).html(freshTaskSize);

    var curDoneSize = $("#done_" + userid).html();

    $("#progress_" + userid).html((parseInt(curDoneSize) * 100 / parseInt(freshTaskSize)).toFixed(1) + "%");

    if (freshTaskSize <= 4) {
        //剩余分配的量小于等于4个时，隐藏“减少任务的按钮”


        $("#DecreaseSpan_" + userid).css("display", "none");
    }

}

//增加 该用户的显示
function addUserSizeAndPercent(userid, size) {

    var curTaskSize = $("#allocated_" + userid).html();

    var freshTaskSize = parseInt(curTaskSize) + parseInt(size);
    $("#allocated_" + userid).html(freshTaskSize);

    var curDoneSize = $("#done_" + userid).html();

    $("#progress_" + userid).html((parseInt(curDoneSize) * 100 / parseInt(freshTaskSize)).toFixed(1) + "%");

    if (freshTaskSize > 4) {//当该用户的剩余分配任务大于4个时 显示“减少任务”的按钮

        $("#DecreaseSpan_" + userid).css("display", "");
    }
}


function addToUnallocated(size) {

    var str = $("#UnAllocated").html();

    var freshUnAllocated = parseInt(str) + parseInt(size);

    $("#UnAllocated").html(freshUnAllocated);

    if (freshUnAllocated > 0) {//待分配任务大于0  显示所有增加人物按钮
        $("span[id^='IncreaseSpans_']").css("display", "");
    }

}

function subToUnallocated(size) {

    var str = $("#UnAllocated").html();
    var freshUnAllocated = parseInt(str) -parseInt(size);
    $("#UnAllocated").html(freshUnAllocated);

    if (freshUnAllocated <= 0) { //待分配任务等于0 隐藏所有增加任务按钮
        $("span[id^='IncreaseSpans_']").css("display", "none");
    } 

}

//检查输入
function checkInput(sender, MaxSize, tip) {
    clear(tip);
    var value = $(sender).val();
    if (value.length > 0) {
        if (parseInt(value) != parseFloat(value) || value.length != parseInt(value).toString().length) {
            tips(tip, "请输入整数！");
            $(sender).val('');
        }
        else if (parseInt(value) < 0 || parseInt(value) > parseInt(MaxSize)) {
            tips(tip, "请输入“0~" + MaxSize + "”间的数");
            $(sender).val('');
        }
    }
}

function clear(target) {
    target.html('');
}
 
//添加阅卷老师
function GetAddibleTeacher(examid) {
   addjudger_popup= new gzy.popup("添加阅卷老师", 720, 320, {
       element: $("#addjudger"),
        buttons: [/*{ text: '下一步', isCancel: false, id: 'nextStep' }, */{ text: '确定并平均分配', isCancel: false,id:"addJudger_confirm_id" }, { text: '取消', isCancel: true}]
    });

//    $("#nextStep").bind("click", AddJudgerSecondStep);

    $("#addJudger_confirm_id").bind("click", addJudger_confirm);
    $(".addjudger_unallocated").html($("#UnAllocated").html());

    $.ajax({

        type: "post",
        url: "ManualJudgeProgressHandler.ashx",
        data: { "EXAMID": examid, "METHOD": "GetAddibleTeacher" },
        success: function (result) {
            //result为json字符串
            RenderAddibleJudger(eval(result));
        }
    });
}

//选择阅卷老师后确定并平均分配
function addJudger_confirm() {
    var boxes = $("input:checked[id^='CheckboxJudger_']");
    if (boxes.length == 0) {
        addjTips("请先选择阅卷教师！");
    }
    else {

        var teacherIds = ''; //选中的待添加的阅卷老师ID
        $.each(boxes, function (i, obj) {
            teacherIds += obj.id.substring(15) + ","
        })
        teacherIds = teacherIds.replace(/,$/g, ''); //去掉最后一个逗号

        var unallocatedSize = $("#UnAllocated").html(); //待分配的总任务数

        var examid = $("#HiddenField_ExamID").val();

        $.ajax({

            type: "post",
            url: "ManualJudgeProgressHandler.ashx",
            data: { "examid": examid, "METHOD": "AddJudger_AVG", "teacherIds": teacherIds },
            success: function (result) {

                if (result == "100") {
                    alert("分配成功");
                    addjudger_popup.close();
                }
                else if (result == "99") {
                    alert("分配成功，但是分配过程中总任务发生了变化，已经处理。")
                    addjudger_popup.close();
                }
                else if (result == "90") {
                    addjTips("错误，分配过程中总任务发生了变化，导致超过人数限制。")
                }
            }
        });

    }
}


//添加阅卷老师的第二步
function AddJudgerSecondStep() {
    var boxes = $("input:checked[id^='CheckboxJudger_']");
    
    if (boxes.length == 0) {
        addjTips("请先选择阅卷教师！");
    }
    else {
        $.each(boxes, function (i, obj) {
            alert(obj.id);
        })
    }

}

//显示提示
function addjTips(str) {

    tips($("#addjudgerTips"),str); 
}

function tips(target, str) {
    target.html(str);
    target.fadeIn(500).delay(1000).fadeOut(1000);
}

 //显示可以添加的阅卷老师
function RenderAddibleJudger(teachers) {

    //teachers 中的内容形式 json对象
    var totalLine = GetTotalLine(teachers.length);

    var th = '';
    $.each(teachers, function (i, teacher) {

        if (i % 4 == 0) {
            th += "<tr>"
        }
        th += '<td class="judgerTd"><input id="CheckboxJudger_' + teacher.Id + '" onchange="checkCheckedLength(this)" class="c' + teacher.Id + '" type="checkbox" />' + teacher.UserName + '（' + teacher.RealName + '）' + '</td>';
        if ((i + 1) % 4 == 0) {
            th += "</tr>";
        }
    });

    $("#teacherlist").html(th);
}

//检查已经选择的个数 是否超过允许的最大值
function checkCheckedLength(sender) {
    var boxes = $("input:checked[id^='CheckboxJudger_']");

    var max = $("#UnAllocated").html();

    var tips = "";
    if (boxes.length > parseInt(max)) {
        tips = "最多只能选择" + max + "个老师！";

        $(sender).removeAttr('checked');
    }
     
    addjTips(tips);
}


//根据元素个数 计算需要多少行  每行固定为4列
function GetTotalLine(length) {
    var totalLine = length / 4;

    if (length <= 4) { totalLine = 1; }

    if (length % 4 != 0) { totalLine += 1; }

    return totalLine;
}
//根据元素索引 判断当前是第多少行
function GetCurrentLine(index) {
    return index / 4 + 1;
}