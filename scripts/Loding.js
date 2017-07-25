
var loadWin;
function showLoding() {

var htmlStr="<div class=\"loading\">正在创建，请稍候...<img src=\"images/ajax-loader.gif\" alt=\"\" /></div>"
   
    loadWin = new gzy.popup("", 220, 40, {
        html: htmlStr
    });
}

function closeLoding() {
    loadWin.close();
}