/// <reference path="jquery-1.7.min.js" />

/// <reference path="common.js" />

$(function () {
    $('a.setting').hide();
    teacher.getMyInfo(init);
    if ($('#return-link').length > -1)
        $('#return-link').toggle(false);
});

function init() {
    var loadingWin = showLoding('正在加载，请稍候');
    $.post("/centerExamview.ashx", { "method": "getcenterinfo", "examid": QueryString('examid') },
         function (data) {
             showExamSessions(data, '#container');
             loadingWin.close();
         }, "json");


    if (user.version == 0) {
        $('#goback').attr('href','/center.htm');
    }
    else
        $('#goback').attr('href', '/exammgr.aspx');


    $('#return-link').click(function () {
        location.replace('../exammgr.aspx');
    });



}

var refreshInterval = 1500;

function showExamSessions(data, container) {
    var htmlStr = '', examid, roomid, totalSize;
    $("#titleText").html(data.examName);
    $('#examCenterTitile').html('考点：' + data.examCenterName);
    $('#examCenterCode').html('(考点编码：' + data.examCenterCode + ')');
    if (data.isAdmin)//是考点管理员时，提供下载整个考点考务信息的下载链接
        $('#examCenterCode').append('<a href="javascript:;" style="margin-left:15px;font-weight:normal;" title="下载考点【' + data.examCenterName + '】所有场次考务信息" onclick="downloadExamCenterExamInfo(' + data.examCenterId + ')">下载考点所有考务信息</a>');

    $("#elseInfo").html('<span>考场数：<label>' + data.roomsCount + '</label>个</span><span>场次数：<label >' + data.sessionCount + '</label>个</span><span>考生人数：<label>' + data.stuCount + '</label>人</span>');
    $.each(data.rooms, function (i, room) {
        var sessionIndex = 1;
        htmlStr += '<div>';
        room.openPsw = room.openPsw == null ? '未公布' : room.openPsw;
        var pswLabel;
        if (user.mode == 'CenterTestMode')
            pswLabel = '';
        else
            pswLabel = '<span><label>考场考试开启密码：</label>' + room.openPsw + '</span>';
        htmlStr += '<div class="examroominfo" ><span class="roomname"><label>考场：' + room.name + '</label></span>' +/*'<span><label>考场管理员账号：</label>' + room.roomAdmin + '</span>' +*/pswLabel + '</div><div class="dotline"></div>';
        htmlStr += getpackageArea(room, data);
        htmlStr += '<div><table cellpadding="0" cellspacing="0" class="list centerexamviewTable" border="0" ><thead><th>场次序号</th><th>考试日期</th><th>开始时间</th><th>结束时间</th><th>考生人数</th><th>监考账号</th><th>考试状态</th><tbody>';
        $.each(room.sessions, function (j, d) {
            htmlStr += '<tr><td>' + (sessionIndex++) + '</td><td>' + d.date + '</td><td>' + d.start + '</td><td>' + d.end + '</td><td>' + d.stuCount + '</td><td>' + d.inviligator + '</td><td>' + d.state + '</td></tr>';
        });
        htmlStr += '</tbody></table></div>';
        htmlStr += '</div>';
        examid = data.examid;
        roomid = room.roomID;
        totalSize = room.packageSize;
    });
    $(container).html(htmlStr);
    if (user.mode == "CenterTestMode") {
        $('.resultpkg').toggle(true);
        $('.exampkg').toggle(false);
        checkResultPackage();
    }
    else {
        $('.resultpkg').toggle(false);
        $('.exampkg').toggle(true);
        checkDownloadStaus(examid, roomid, totalSize);
    }
}


function getpackageArea(room, data) {
    var htmlStr = '';
    htmlStr += '<div style="text-align:center">';
    htmlStr += '<table class="packageArea" cellpadding="2" cellspacing="0" >';
    if (data.isAdmin) {
        htmlStr += '<tr><td><a href="javascript:;" title="下载考场【' + room.name + '】的管理员\n及所有场次监考账号信息" onclick="downloadAccount(' + data.examId + ',' + room.roomID + ',false)">下载监考及考场管理员信息</a></td>';
        htmlStr += '<td><a href="javascript:;" title="下载考场【' + room.name + '】的考生安排" onclick="downloadAccount(' + data.examId + ',' + room.roomID + ',true)">下载考生信息</a></td>';
    }
    else {
        htmlStr += '<thead><tr><td>数据包类型</td>\
                               <td class="resultpkg">生成状态</td>\
                               <td class="exampkg ">下载状态</td>\
                               <td class="packageSize">数据包大小</td>\
                               <td class="op importOp" id="packageOP">数据包操作</td>\
                               <td class="resultpkg upload">上传状态</td>\
                               <td class="resultpkg upload progress progressbar">进度</td>\
                               <td class="resultpkg upload progress" style="width:70px;">速率</td>\
                               <td class="resultpkg upload progress">剩余时间</td>\
                               <td class="resultpkg upload op progress">上传操作</td>\
                               <td class="packageInfo importOp op">备注</td>\
                           </tr></thead>\
                    <tr>\
                    <td class="headcell exampkg" >考务包</td>\
                    <td class="headcell resultpkg">考试结果包</td><td class="resultpkg"><label id="generateState"></label></td>\
                    <td class="exampkg "><label id="downloadState"></label></td>\
                    <td class="packageSize"><label id="packageSize"></label></td>\
                    <td class="resultpkg op"><input type="button" class="centerviewBtn" id="exportDataBtn" title="生成结果数据包" onclick="generateResultPackage(' + room.roomID + ')" value="生成" /></td>\
                    <td class="exampkg importOp"><input type="button" class="centerviewBtn" style="" id ="downLoadBtn"  title="从中心服务器下载考务数据包" onclick="download(' + data.examId + ',' + room.roomID + ',\'' + room.packageName + '\',' + room.packageSize + ',true);return false;" value="下载" /></td>\
                    <td class="exampkg import importOp importBtn"><input type="button" class="centerviewBtn" id ="importBtn"  title="将考务数据包导入本地服务器" onclick="importPackage(' + data.examId + ',' + room.roomID + ',\'' + room.packageName + '\')" value="导入" /></td>\
                    <td class="resultpkg upload "><label id="uploadState"></label></td>\
                    <td class="resultpkg upload progress progressbar"><label id="progress"></label></td>\
                    <td class="resultpkg upload progress"><label id="speed"></label></td>\
                    <td class="resultpkg upload progress"><label id="leftTime"></label></td>\
                    <td class="progress"><input type="button" class="centerviewBtn" id="stop" title="暂停传送数据包" value="暂停" onclick="stopTransmission()" /></td></td>\
                    <td class="resultpkg upload op"><input type="button" class="centerviewBtn" id="upload"  style="display:none" title="将结果数据包上传至中心服务器" onclick="uploadPackage()" value="上传数据包" /></td>';
        htmlStr += '<td class="packageInfo importOp op" id="packageInfo"></td>';

        htmlStr += '</tr>';
    }
    htmlStr += '</table></div>';
    return htmlStr;
}


function downloadAccount(examid, roomid, isStudent) {
    $('#iframe-download')[0].contentWindow.location = '../centerExamview.ashx?method=downLoadAccount&examid=' + examid + '&roomid=' + roomid + '&isStudent=' + isStudent;
}


function downloadExamCenterExamInfo(examCenterId) {
    $('#iframe-download')[0].contentWindow.location = '../centerExamview.ashx?method=downloadExamCenterExamInfo&examCenterId=' + examCenterId;
}

function download(examId, roomId, packageName, packageSize, fullDownLoad) {
    keepTransmission = true;
    $('#stop').val('暂停').attr('disabled', false).css('cursor', 'pointer');
    if ($('#downLoadBtn').val().indexOf('正在下载') == -1) {
        var loading = showLoding('正在请求下载，请稍候!');
        $.post("../centerExamview.ashx", { "method": "download", "examid": QueryString('examid'), "roomid": roomId, "fullDownload": fullDownLoad, "totalSize": packageSize },
                 function (data) {
                     loading.close();
                     if (data.result == "ok") {
                         $('#downLoadBtn').val('请求数据中').attr('disabled', true).css("cursor", "not-allowed");
                         checkDownloadStaus(examId, roomId, packageSize);
                         //init();
                     }
                     else {
                         alert('下载失败\n' + data.message);
                     }
                 }, "json");
    }
}

var packageFileName;
var keepTransmission = true;
function stopTransmission() {
    keepTransmission = false;
    $('#stop').val('正在暂停').attr('disabled', true).css('cursor', 'default');
}

function checkDownloadStaus(examId, roomId, totalSize) {
    if (totalSize >= 0) {
        var refresh = false;
        $.post("../centerExamview.ashx", { "method": "checkDownload", "examid": QueryString('examid'), "roomid": roomId, 'totalSize': totalSize, "keep": keepTransmission },
             function (data) {
                 $('.resultpkg').hide();
                 $('#packageSize').html(getSizeString(data.size));
                 if (data.download == 'Downloading') {
                     try{
                         $('#upload').hide();
                         $('.packageSize').hide();
                         $('#downloadState').html('下载中').css('color', 'red');
                         $('#downLoadBtn').val('正在下载');
                         $('.import').hide();
                         $('.progress').show();
                         $('.importOp').hide();
                         $('#packageOP').attr('colspan', '1');
                         $('.packageSize').show();
                         $('#progress').html(data.percentage + '%');
                     }
                     catch (e) {
                     }
                     try{
                         packageFileName = data.fileName;
                         $('#speed').html(getSpeedString(data.speed));
                         var min = data.leftTime > 60 ? parseInt(data.leftTime / 60) + '分' : '';
                         var second = data.leftTime % 60;
                         second += '秒';
                         var leftTime = min + second;
                         if (leftTime == '0秒' && parseFloat(data.percentage) < 99)
                             leftTime = '-';
                         $('#leftTime').html(leftTime);
                         console.log(data.bufferSize / 1024 + 'KB');
                     }
                     catch (e){
                         //console.log(e.message);
                     }
                     finally {
                         refresh = true;
                     }
                 }
                 else if (data.download == 'Donwloaded') {
                     $('.packageSize').show();
                     $('#downloadState').html('已下载').css('color', 'green');
                     $('#downLoadBtn').val('重新下载')
                         .css("background-image", "url(/images/center/btn_bkgnd.gif)")
                         .css("width", "72px")
                         .css("text-align", "center")
                         .css("cursor", "pointer")
                         .attr('disabled', false);
                     $('.import').show();
                     $('.importOp').show();
                     $('.progress').hide();
                     $('#packageOP').attr('colspan', '2');
                     $('#packageInfo').html('请导入数据包').css('color', 'blue');

                 }
                 else {
                     $('.importOp').show();
                     $('.packageSize').hide();

                     $('.progress').hide();
                     $('.packageSize').show();
                     $('#packageOP').attr('colspan', '1');
                     $('#downloadState').html(data.msg).css('color', 'red');

                     var downloadBtnText = '下载';
                     if (data.download == 'Checking') {
                         $('.importOp').hide();
                         refresh = true;
                     }
                     if (data.download == 'CheckFailed' || data.download == 'Failed' || data.download == 'Stop' || data.download == 'Pause') {
                         $('.importOp').show();
                         if (data.download == 'Stop' || data.download == 'Pause')
                             downloadBtnText = '继续下载';
                         if (data.download == 'CheckFailed' || data.download == 'Failed')
                             downloadBtnText = '重新下载';
                     }

                     $('#downLoadBtn').val(downloadBtnText).attr('disabled', false).css('cursor', 'pointer');
                     $('#packageInfo').html('请' + downloadBtnText + '考务数据包').css('color', 'blue');
                     $('.importBtn').hide();
                 }

                 if (refresh) {
                     setTimeout(function () {
                         checkDownloadStaus(examId, roomId, totalSize);
                     }, refreshInterval);
                 }

             }, "json");
    }
}



function getSizeString(size) {
    var sizeStr = '-';
    if (size != null && size > 0) {
        if (size > 1024 * 1024 * 1024)//大于1G
            sizeStr = (size / 1024 / 1024 / 1024).toFixed(1) + 'GB';
        else if (size > 1024 * 1024)//大于1M
            sizeStr = (size / 1024 / 1024).toFixed(1) + 'MB';
        else
            sizeStr = (size / 1024).toFixed(1) + 'KB';
    }
    return sizeStr;
}


function importPackage(examId, roomId, packageName) {
    if (confirm('导入数据将清空以往的本地接收到的考试数据，确定要导入吗？')) {
        var importLoading = showLoding('正在导入考务数据包');
        $.post("../centerExamview.ashx", { "method": "import", "filename": examId + '-' + roomId + '.gzy', "examid": examId, "packageName": packageName },
                function (importResult) {
                    importLoading.close();
                    if (importResult.ok ) {
                        alert("导入成功!");
                        location.replace('/teacher.htm');
                    }
                    else
                        alert("导入失败!\n" + importResult.msg);
                }, "json");
    }
}

function generateResultPackage(roomid) {
    if (confirm('请在所有考试结束之后再生成数据包\n您确定要现在生成吗？')) {
        var loading = showLoding('正在生成，请稍候!');
        $.post("../centerExamview.ashx", { "method": "ExportResultPackage", "examid": QueryString('examid') },
                 function (data) {
                     loading.close();
                     if (data.ok) {
                         $('#exportDataBtn').val('准备生成中').attr('disabled', true).css("cursor", "not-allowed");
                         $('#packageInfo').html('').css('color', 'black');
                         $('#upload').toggle(false);
                         setTimeout(function () {
                             checkResultPackage();
                         }, refreshInterval);
                     }
                     else
                         alert(data.msg);
                 }
           , "json");
    }
}

function uploadPackage() {
    keepTransmission = true;
    $('#stop').val('暂停').attr('disabled', false).css('cursor', 'pointer');
    $('#upload').val('连接中...').attr('disabled', true);
    $('#exportDataBtn').attr('disabled', true);
    $.post("../centerExamview.ashx", { "method": "upload", "examid": QueryString('examid') },
        function (data) {
            if (data.result != null) {
                if (data.result) {
                    cookie.set('confirmChangeMode', true);
                    checkResultPackage();
                }
                else {
                    alert('上传失败!\n' + data.message);
                    $('#upload').val('上传数据包').attr('disabled', false);
                    $('#exportDataBtn').attr('disabled', false);
                }
            }
            else {
                if (!data.ok) {
                    alert('未能连接至中心服务器，请在系统设置中检查中心服务器地址及端口是否配置正确后再试!');
                    $('#upload').val('上传数据包').attr('disabled', false);
                    $('#exportDataBtn').attr('disabled', false);
                }
            }
        }, "json");
}

function checkResultPackage() {
    $('#packageInfo').html('').css('color','black');
    var refresh = false;
    $.post("../centerExamview.ashx", { "method": "checkResultPackage", "examid": QueryString('examid'),"keep":keepTransmission },
    function (data) {
        if (data.generate == 'Generated') {
            $('.packageSize').show();
            $('.upload').show();
            $('#generateState').html('已生成').css('color', 'green');
            
            $('#packageSize').html(getSizeString(data.size));
            $('#exportDataBtn').val('重新生成').attr("disabled", false).css("cursor", "pointer");
            
            if (data.upload == 'UnUpload' || data.upload == 'Stop' || data.upload == 'Pause') {
                $('#upload').val('上传数据包').attr('title', '').toggle(true)
                 .css("background-image", "url(/images/center/btn_bkgnd.gif)").css("width", "72px").css("text-align", "center").css("cursor", "pointer")
                .attr('disabled', false);
                $('#packageInfo').html('请上传结果数据包！').css('color', 'blue');
                if (data.upload == 'UnUpload')
                    $('#uploadState').html('未上传').css('color', 'blue');
                else
                    $('#uploadState').html('已暂停').css('color', 'red');
                $('.progress').hide();
                $('.packageInfo').show();
                $('.op').show();
            }
            else if (data.upload == 'Uploading') {
                try{
                    packageFileName = data.fileName;
                    $('.op').hide();
                    $('#uploadState').html('上传中').css('color','red');
                    $('.progress').show();
                    if ($('#upload').val().indexOf('正在上传') == -1) {
                        $('#upload').toggle(true).attr('disabled', true).attr('title', '')
                        .css("background-image", "url(/images/center/btn_bkgnd_wide.gif)")
                        .css("width", "102px")
                        .css("text-align", "left")
                        .css("cursor", "not-allowed");
                    }
                    $('#progress').html(data.percentage + '%').show();
                    $('#upload').hide();
                    $('#speed').html(getSpeedString(data.speed)).show();
                    var min = data.leftTime > 60 ? parseInt(data.leftTime / 60) + '分' : '';
                    var second = data.leftTime % 60;
                    second += '秒';
                    var leftTime = min + second;
                    if (leftTime == '0秒' && parseFloat(data.percentage) < 99)
                        leftTime = '-';
                    $('#leftTime').html(leftTime);
                    $('.packageInfo').hide();
                    console.log(data.bufferSize / 1024 + 'KB');
                }
                catch (e) {
                    console.log(e.message);
                }
                finally {
                    refresh = true;
                }
            }
            else if (data.upload == 'Uploaded') {
                $('.packageInfo').show();
                $('#uploadState').html('已上传').css('color', 'green');
                $('#exportDataBtn').val('重新生成').css("cursor", "pointer");
                $('#upload').val('再次上传').attr('title', '单击可重新上传').toggle(true).attr('disabled', false)
                .css("background-image", "url(/images/center/btn_bkgnd.gif)").css("width", "72px").css("text-align", "center").css("cursor", "pointer")
                ;
                $('#packageInfo').html('结果数据包已上传！请将系统<a href="javascript:;" style="color:red;text-decoration:underline;" onclick="switchBackToSchoolMode(\'是否确定将系统切换中心对接模式\')">切换回中心对接模式</a>.').css('color', 'green');
                $('.progress').hide();
                $('.op').show();
                if (cookie.get('confirmChangeMode') == 'true') {
                    switchBackToSchoolMode();
                    cookie.set('confirmChangeMode', false);
                }
            }
            else if (data.upload == 'Failed' || data.upload == 'CheckFailed') {
                $('.packageInfo').show();
                $('#uploadState').html(data.msg).css('color', 'red');
                $('#upload').val('重新上传').attr('title', '上传出错,请重新上传').toggle(true).attr('disabled', false)
                 .css("background-image", "url(/images/center/btn_bkgnd.gif)").css("width", "72px").css("text-align", "center").css("cursor", "pointer")
                ;
                $('#packageInfo').html('请重新上传！').css('color', 'red');
                $('.progress').hide();
                $('.op').show();
            }
            else if (data.upload == 'Checking') {
                packageFileName = data.fileName;
                $('.op').hide();
                $('#uploadState').html('校验中').css('color', 'red');
                $('.progress').hide();
                $('#upload').hide();
                $('#speed').hide();
                $('.packageInfo').hide();
                refresh = true;
            }
        }
        else if (data.generate == 'UnGenerated' || data.generate == 'Failed') {
            if (data.generate == 'Failed')
                $('#generateState').html('生成失败').css('color', 'red');
            else
                $('#generateState').html('未生成').css('color', 'blue');
            $('#exportDataBtn').val('生成').css("cursor", "pointer");
            $('#upload').css('display', 'none');
            $('.progress').hide();
            $('.op').show();
            $('.upload').hide();
            $('.packageInfo').show();
            $('#packageInfo').html('请生成考试结果数据包！').css('color', 'blue');
            $('.packageSize').hide();
        }
        else if (data.generate == 'Generating' || data.generate == 'Compressing') {
            $('.op').hide();
            $('.progress').hide();
            $('#upload').hide();
            $('.upload').hide();
            $('.packageInfo').hide();
            $('.packageSize').hide();
            if (data.generate == 'Generating') {
                $('#generateState').html('正在生成');
                $('#progress').html(data.percentage + '%');
                $('.progressbar').show();
            }
            else {
                $('#generateState').html('正在压缩');
                $('#progress').html(data.percentage + '%');
                $('.progressbar').show();
            }
            $('#generateState').css('color', 'red')
            $('#exportDataBtn').attr('disabled',true);
            refresh = true;
        }

        if (refresh)
            setTimeout(function () {
                checkResultPackage();
            }, refreshInterval);
    }, "json");

}

function switchBackToSchoolMode(confirmMsg) {
    if (!confirmMsg)
        confirmMsg = '考试结果数据包已成功上传至中心！\n是否立即将系统切换回中心对接模式?';
   // if (confirm(confirmMsg)) {
        jQuery.service.call(this, '/system.asmx/SwitchToSchoolMode', {}, function (d) {
            if (d.ok && d.needRelogin) {
                alert('已成功切换回本地数据库!\n请使用本地账号重新登录!');
                location.replace('/login.htm');
            }
            else
                alert('切换失败!\n原因：' + d.msg);
        });
   // }

}

function getSpeedString(speed) {
    var speedString;
    if (speed > 1024 * 1024)//大于1M
        speedString = (speed / 1024 / 1024).toFixed(1) + 'MB/s';
    else if (speed > 1024)//大于K
        speedString = (speed / 1024).toFixed(1) + 'KB/s';
    else
        speedString = speed.toFixed(1) + 'B/s';
    return speedString;
}