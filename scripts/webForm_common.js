/// <reference path="jquery-1.7.min.js" />
/// <reference path="console.js" />
/// <reference path="common.js" />
/// <reference path="PopWindow/gzy.popup.js" />

jQuery.fn.rect = function () {
    with ($(this))
        return $.extend({ width: width(), height: height() }, position());
};


$(function () {


    //    toggleKeyWords();

    //    $("#SearchKeywords").click(function () {
    //        $(this).val("");
    //        $(this).removeClass("keyWord");
    //    });

    //    $("#SearchKeywords").blur(function () {
    //        toggleKeyWords();

    //    });

});

function toggleKeyWords() {

    $("#SearchKeywords").click(function () {
        $(this).val("");
        $(this).removeClass("keyWord");
    });


    var keyWordsSearch = $("#SearchKeywords");
    if (keyWordsSearch.val() == "") {
        keyWordsSearch.val("在此输入关键字");
        keyWordsSearch.addClass("keyWord");
    }
    else {
        keyWordsSearch.removeClass("keyword");
    }

}

function showSearch(display) {
    var displayStr = display == true ? "block" : "none";

    $("#searchArea").css("display", displayStr);
    $("#ExamsList_ContentPanel").css("display", displayStr);

}



function check(obj) {
    if (isNaN(obj.val()))
        obj.val(1);
    else
        obj.val(parseInt(obj.val()));


}


function CurrentTime() {


    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日

    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分

    var clock = year + "-";

    if (month < 10)
        clock += "0";

    clock += month + "-";

    if (day < 10)
        clock += "0";

    clock += day + " ";

    if (hh < 10)
        clock += "0";

    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm;
    return (clock);
}


