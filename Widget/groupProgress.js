
//前四个数 是百分数的 整数部分，第一个固定为100
function renderGroupProgress(total, ing, needReview, ed, width, height) {

    if (total != 0) {
        var remainder = total - (ing + ed + needReview);

        remainder = remainder < 0 ? 0 : remainder;

        $("div#group_progress").css("width", width);
//        $("div#group_progress").css("height", height);

        $("div#group_progress table").css("width", 10);
        $("div#group_progress table").css("height", height);

        var perWidth = width / 100;

        if (ed <= 0) {
            $("div#group_progress table tbody tr td.c1").css("display", "none");
        }
        else {
            $("div#group_progress table tbody tr td.c1").css("width", ed * perWidth);
        }


        if (ing <= 0) {
            $("div#group_progress table tbody tr td.c2").css("display", "none");
        }
        else {
            $("div#group_progress table tbody tr td.c2").css("width", ing * perWidth);
        }


        if (needReview <= 0) {
            $("div#group_progress table tbody tr td.c3").css("display", "none");
        }
        else {
            $("div#group_progress table tbody tr td.c3").css("width", needReview * perWidth);
        }

        if (remainder <= 0) {
            $("div#group_progress table tbody tr td.c4").css("display", "none");
        }
        else {
            $("div#group_progress table tbody tr td.c4").css("width", remainder * perWidth);
        }


     
    }
}

$(document).ready(function () {
    $("div#group_progress table").animate({ "width": "300px" }, { "speed": "1000" });
 });
