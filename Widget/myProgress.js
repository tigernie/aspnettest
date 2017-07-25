//前两个数为百分数的整数部分，第一个固定为100
function renderMyProgreee(total, done, ing, width, height) {

    if (done > total) {
        done = total;
    }

    $("div#my_progress").css("width", width);
    $("div#my_progress").css("height", height);

    $("div#my_progress table").css("width", width);
    $("div#my_progress table").css("height", height);

    var remainder = total - (done + ing);

    remainder = remainder < 0 ? 0 : remainder;

    var perWidth = width / 100;

    if (done == 0) {
        $("div#my_progress table tbody tr td.c1").css("display", 'none');
    }
    else {
        $("div#my_progress table tbody tr td.c1").css("width", done * perWidth);
    }
    $("div#my_progress table tbody tr td.c2").css("width", ing * perWidth);


    $("div#my_progress table tbody tr td.c3").css("width", remainder * perWidth);

}