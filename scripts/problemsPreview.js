/// <reference path="lib/problib.js" />
/// <reference path="common.js" />
/// <reference path="jquery-1.7.min.js" />
/// <reference path="probEditor.js" />

var callbackFromImport;
var probPreviewAnalysisLoading = null;
var previewType = QueryString('type');
var probIds;
$(function () {
    teacher.getMyInfo();
    $('#preview_editor').hide();
    $('#prob-import').show();
    $('#resultArea').hide();
    $('#prviewBtnArea').hide();
    $('#opArea').hide();

    if (previewType == '1' || previewType == '2') {
        $('#previewBtn').click(function () {
            try {
                probPreviewAnalysisLoading = showLoding('正在上传文件，请稍候');
                $('#porb-import-form').submit();
            }
            catch (e) {
                alert('上传文件失败\n失败原因：' + e.message);
            }
            return false;
        });

        $('#probImport_upload').bind('load', function () {
            if (probPreviewAnalysisLoading != null)
                probPreviewAnalysisLoading.close();
            try {
                if (this.contentWindow.document.body.innerHTML != null && this.contentWindow.document.body.innerHTML[0] == '{') {
                    var d = $.parseJSON(this.contentWindow.document.body.innerHTML);
                    if (!d.ok)
                        throw new Error(d.msg);
                    var files = new Array();
                    var tmp;
                    var total = 0;
                    $.each(d.data, function (i, fileName) {
                        files.push(fileName);
                        total++;
                    });
                    if (total > 1) {
                        var htmlStr = '<div id="chooseWordFile">';
                        $.each(files, function (i, fileName) {
                            var shortName = fileName;
                            if (fileName.gblen() > 70) {
                                shortName = fileName.gbtrim(70, '...', false);
                                htmlStr += '<div title="' + fileName + '" class="row"><input type="radio" name="chooseWordFile" value="' + fileName + '" />' + shortName + '</div>';
                            }
                            else
                                htmlStr += '<div class="row"><input type="radio" name="chooseWordFile" value="' + fileName + '" />' + shortName + '</div>';
                        });
                        htmlStr += '</div>';
                        var popup = new gzy.popup('选择试题文件', 600, 240, {
                            html: htmlStr,
                            buttons: [
                                {
                                    text: '确定', click: function () {
                                        var wordFileName = $('div#chooseWordFile :checked').val();
                                        submitProbImportFileCallBack(escape(wordFileName));
                                        popup.close();
                                    }
                                },
                                {
                                    text: '取消', click: function () {
                                        popup.close();
                                    }
                                },
                            ],
                            info:'系统无法正确识别您导入文件压缩包中的主文件，请您手动从下列文件中选择主文件!'
                        });
                    }
                    else if (total == 1)
                        submitProbImportFileCallBack(escape(files.toString()));
                    else 
                        alert('压缩包中未发现Word文件，请确认压缩包是否正确!');
                }
            } catch (e) {
                alert('上传文件过程中失败\n失败原因：' + e.message);
            }
        });
    }
    else
        $('#fileAreaContainer').toggle(false);

    InitShowImport($('#importContainer'),previewType, function () { });

    if (previewType == '1' || previewType == '2') {
        $('#probImportFile').change(function () {
            var fileName = $(this).val();
            var tmp = fileName.split('.');
            var ext = tmp[tmp.length - 1].toLowerCase();
            if (ext == 'doc' || ext == 'docx' || ext == 'rar' || ext == 'zip' || ext == '7z') {
                fileName = fileName.gbtrim(30, '...', false).toString();
                $('#filePath').html(fileName);
                $('#filechooseTitle').html('更换试题导入文件');
                $('#prviewBtnArea').toggle(true);
            }
            else {
                $(this).val('');
                $('#filePath').html('未选择文件');
                alert('只允许上传Word文件或者包含Word文件的rar、zip、7z格式压缩包！');
                $('#filechooseTitle').html('选择试题导入文件');
                $('#prviewBtnArea').toggle(false);
            }
        });


        $('#btn_ensure').click(function () {
            $('#import_warning').stop(1);
            if (previewErrorsCount > 0) {
                $('#import_warning').toggle(false).html('有' + previewErrorsCount + '个题目有错误，需要修改后才能导入').fadeIn(2000).delay(4000).fadeOut(3500);
            }
            else if (probsCount == 0)
                $('#import_warning').toggle(false).html('没有试题，不能导入').fadeIn(2000).delay(4000).fadeOut(3500);
            else {
                var typeStr;
                var method, params;
                if (QueryString('type') == 1) {
                    method = 'EnsureImportedProblems';
                    params = {};
                    typeStr = '试题';
                }
                else {
                    method = 'EnsureImportedPaper';
                    var scores = '';
                    typeStr = '试卷';
                    var i = 0;
                    $('.score').each(function () {
                        if (i++ > 0)
                            scores += ',';
                        scores += $(this)[0].id.split('_')[1] + ':' + $(this).val();
                    });
                    params = { paperName: $('#paperTitle').val(), discrimination: $('#dis').val(), difficulty: $('#paperDiff').val(), author: $('#paperAuthor').val(), scores: scores };
                }

                var loading = showLoding('正在导入，请稍候...');
                jQuery.service.call(this, 'problib.asmx/' + method, params, function (data) {
                    loading.close();
                    if (data.ok) {
                        if (data.data)
                            alert('导入成功\n' + typeStr + '将进入待审核状态，需要审核通过后才能使用');
                        else
                            alert('导入成功\n' + typeStr + '已通过审核');
                        reload();
                    }
                    else
                        alert('导入失败\n失败原因：' + data.msg);
                });
            }
        });
    }
    else {
        $('#btn_ensure').click(function () {
            alert('ok');
        });
    }
});

function submitProbImportFileCallBack(filePath) {
    if (probPreviewAnalysisLoading != null)
        probPreviewAnalysisLoading.close();
    probPreviewAnalysisLoading = showLoding('文件正在上传,请稍候...');
    jQuery.service.call(this, 'problib.asmx/AnalyzeProbFile', { filePath: filePath, type: QueryString('type') }, function (data) {
        probPreviewAnalysisLoading.close();
        if (data.ok) {
            location.reload(true);
        }
        else
            alert('分析文件过程中出现问题：\n' + data.msg);
    });

}

function InitShowImport(container, type, callback) {
    /// <param name="container" type="String">待呈现导入界面的容器</param>
    /// <param name="type" type="String">导入类型（1-导入试题，2-导入套卷,3-创建试卷）</param>
    var loading = showLoding('请稍候...');

    if (type == 1) {
        $('#importTitle').html('试题导入');
        $('#filechooseTitle').html('选择试题导入文件');
        jQuery.service.call(this, 'problib.asmx/GetImportedProblems', {}, function (data) {
            loading.close();
            if (data.ok) {

                if (data.data != null && data.data.HasProblem)
                    showProblem(container, data.data.Problems, loading, data.data.ImportInfo.Id);//显示试题
            }
            else
                alert(data.msg);
            showState(data.data != null ? data.data.ImportInfo : null);

        });
        document.title = '试题导入';
    }
    else if (type == 2) {
        $('#importTitle').html('套卷导入');
        $('#filechooseTitle').html('选择套卷导入文件');
        jQuery.service.call(this, 'problib.asmx/GetImportedPaper', {}, function (data) {
            loading.close();
            if (data.ok) {
                if (data.data != null && data.data.HasProblem)
                    showPaper(container, data.data, loading,data.data.ImportInfo.Id);//显示试题
            }
            else
                alert(data.msg);
            showState(data.data != null ? data.data.ImportInfo : null);

        });
        document.title = '套卷导入';
    }
    else if (type == 3) {
        $('#stateBar').hide();
        document.title = '新建试卷';
        $('#importTitle').html('新建试卷');
        //var prbIds = '83239,67802,78279,73891,78598,79996,66766,76087,80260,65888,81686,72251,69773,81754,71566,75782,64926,73482,67638,79806';
        var prbIds = QueryString('probIds').toString().replace(/%2C/g, ',');
        jQuery.service.call(this, 'problib.asmx/GetProblemsDetailByIds', { ids: prbIds }, function (data) {
            showBlankPaper(container, data.data.rows, loading);//显示试题
        });
    }
    callbackFromImport = callback;
};


function showState(importInfo)
{
    var steps = ['选择导入文件', '等待系统处理', '系统处理中', '预览'];

    $('#stateBar').show();
    $('#importContainer').hide();
    $('#import_Waiting').hide();
    $('#errorInfo').hide();
    $('#fileAreaContainer').hide();
    $('#opArea').hide();
    $('#progressBarContainer').hide();
    var flowContainer = $('#stateBar');
    if (importInfo != null) {
        switch (importInfo.Result) {
            case 1://系统处理中
                showFlow(flowContainer, 3, steps);
                showProgress(importInfo.Id,importInfo.Info);
                setTimeout('reload()', 500);
                break;
            case 0://等待系统处理
                showFlow(flowContainer, 2, steps);
                $('#import_Waiting').show();
                break;
            case 2://系统失败
                steps[3] = '处理结果';
                showFlow(flowContainer, 4, steps);
                showErrorInfo(importInfo.Id,importInfo.Info);
                break;
            case 5://待确认
                showFlow(flowContainer, 4, steps);
                InitConfirming(importInfo.Id);
                $('#importContainer').show();
                break;
        }
    }
    else {
        $('#opArea').show();
        $('#fileAreaContainer').show();
        $('#errorInfo').hide();
        $('#importContainer').hide();
        $('#resultArea').hide();
        $('#progressBarContainer').hide();
        showFlow(flowContainer, 1, steps);
    }
};

function InitConfirming(importinfoId)
{
    $('#btn_cancel').click(function () {
        var method;
        if (QueryString('type') == 1)
            method = 'CancelImportedProblems';
        else
            method = 'CancelImportedPaper';
        var loading = showLoding('正在执行取消操作，请稍候...');
        jQuery.service.call(this, 'problib.asmx/' + method, { importInfoId: importinfoId }, function (data) {
            loading.close();
            if (data.ok) {
                alert('取消导入成功');
                reload();
            }
            else
                alert('取消导入失败\n失败原因：' + data.msg);
        });
    });
};

function showProgress(importId,percentage) {
    var progressInfo = $.parseJSON(percentage);
    if (isNaN(parseFloat(progressInfo.Percentage)))
        progressInfo.Percentage = 50;
    $('#opArea').show();
    $('#progressBarContainer').show();
    $('#progressBar').progressbar({ value: progressInfo.Percentage });
    $('#progressInfo').html('总体进度：' + progressInfo.Percentage + '%\n' + progressInfo.Info);
    $('div#progressBarContainer .backToFirstStep').click(function () {
        problem.close(importId, function (d) {
            if (d.ok)
                reload();
            else
                alert('失败:\n' + d.msg);
        });
    });
};

function showErrorInfo(id,errorMsg) {
    $('#opArea').show();
    $('#fileAreaContainer').hide();
    $('#errorInfo').show();
    var errors = errorMsg.split('\n');
    var html = '';
    var index = 0;
    $.each(errors, function (i, error) {
        if($.trim(error)!='')
        html += (++index) + '、' + error + '<br />';
    });
    $('#error_msg').html(html);
    $('div#errorInfo .backToFirstStep').click(function () {
        problem.close(id, function (d) {
            if (d.ok)
                reload();
            else
                alert('失败:\n'+d.msg);
        });
    });
};

var importedProbs;
var previewErrorsCount, previewWarningsCount, probsCount;
var errorIds, warningIds;

function showProblem(container, probs, loadingWin, importInfoId) {
    var htmlStr;
    previewErrorsCount = previewWarningsCount = 0;
    errorIds = '';
    warningIds = '';
    container.html('');
    probsCount = 0;
    $.each(probs, function (i, prob) {
        htmlStr = '<div class="probBoxContainer" id="probBox_' + (i + 1) + '" name="' + prob.typeId + '"></div>';
        container.append(htmlStr);
        getProbInBoxHtml($('#probBox_' + (i + 1)), i + 1, prob, QueryString('type'), null, null, null, importInfoId);
        probsCount++;
    });

    if (probsCount > 0) 
        refreshNumbers();//显示题目数量
    $('#import_warning').toggle(probsCount > 0);
    $('#resultArea').toggle(probsCount > 0);
    $('#importContainer').toggle(probsCount > 0);
    $('#opArea').toggle(probsCount == 0);
    importedProbs = probs;
    loadingWin.close();
}

function showPaper(container, paper, loadingWin,importInfoId) {
    var htmlStr;
    previewErrorsCount = previewWarningsCount = 0;
    errorIds = '';
    warningIds = '';
    probsCount = 0;
    container.html('');
    var hasPaper;
    if (paper.paper != null) {
        var paperScore = paper.paper.PaperScore == null ? 0 : paper.paper.PaperScore;
        var difficulty = paper.paper.Difficulty == null ? 0 : paper.paper.Difficulty;
        var discrimination = paper.paper.Discrimination == null ? 0 : paper.paper.Discrimination;
        htmlStr = '<div class="paperInfo">试卷标题：<input type="text" id="paperTitle" value="' + paper.paper.PaperName + '" /><br/>试卷难度：<input type="text" id="paperDiff" value="' + difficulty + '"  disabled="disabled" />\
             <label>试卷总分：</label><input type="text" id="paperScore" value="' + paperScore + '" /><label>试卷作者：</label><input type="text" id ="paperAuthor" value="' + paper.paper.Author + '" /><label>区分度：</label><input type="text" id="dis" value="' + discrimination + '"/></div>';
        container.append(htmlStr);

        $('#paperScore').attr('disabled', true);//禁用总分
        NumberBox($('#dis'), { "max": 2, "min": -1, "step": 0.1 });
        var scores = new Array();
        var innerindex = new Array();
        $.each(paper.paper.ProbsCollection, function (i, item) {
            scores.push(item.ProblemScore);
            innerindex.push(item.InnerIndex);
        });

        //显示试题
        $.each(paper.Problems, function (i, prob) {
            htmlStr = '<div class="probBoxContainer" id="probBox_' + (i + 1) + '" name="' + prob.typeId + '"></div>';
            container.append(htmlStr);
            getProbInBoxHtml($('#probBox_' + (i + 1)), i + 1, prob, previewType, innerindex[i], scores[i], paper.paper.Id, importInfoId);
            probsCount++;
        });
        importedProbs = paper.Problems;
        hasPaper = true;
    }
    else {
        hasPaper = false;
    }
    if (paper.paper != null) {
        $('#resultArea').toggle(true);
        $('#import_warning').toggle(false);
    }
    else
        $('#resultArea').toggle(false);
    refreshNumbers(hasPaper);//显示题目数量
    loadingWin.close();
};

function showBlankPaper(container, probs, loadingWin) {
    var htmlStr;
    previewErrorsCount = previewWarningsCount = 0;
    errorIds = '';
    warningIds = '';
    probsCount = 0;
    container.html('');
    var hasPaper;
    var paperScore = 0;
    var difficulty = 0;
    var discrimination = 0;
    htmlStr = '<div class="paperInfo">试卷标题：<input type="text" id="paperTitle" value="" /><input id="generatePaper" type="button" value="生成试卷" class="Btn" /><br/>试卷难度：<input type="text" id="paperDiff" disabled="disabled" value="0" />\
             <label>试卷总分：</label><input type="text" id="paperScore" value="0" /><label>试卷作者：</label><input type="text" disabled="disabled" id ="paperAuthor" value="' + user.realname + '" /><label>区分度：</label><input type="text" id="dis" value="0.5"/></div>';
    container.append(htmlStr);
    $('#paperScore').attr('disabled', true);//禁用总分
    NumberBox($('#dis'), { "max": 2, "min": -1, "step": 0.1 });
    var scores = new Array();
    var innerindex = new Array();
    $.each(probs, function (i, item) {
        scores.push(0);
        innerindex.push(i + 1);
    });

    //显示试题
    probIds = new Array();
    lastprob = null;
    $.each(probs, function (i, prob) {
        htmlStr = '<div class="probBoxContainer" id="probBox_' + (i + 1) + '" name="' + prob.typeId + '"></div>';
        container.append(htmlStr);
        getProbInBoxHtml($('#probBox_' + (i + 1)), i + 1, prob, previewType, innerindex[i], scores[i]);
        probsCount++;
        probIds.push(prob.id);
    });
    if (previewType == 3)
        $($('#down_' + probs.length)[0]).remove();//最后一题不允许下移
    importedProbs = probs;
    hasPaper = true;

    loadingWin.close();

    $('#generatePaper').click(function () {
        if ($('#paperTitle').val().replace(/ /g, '') == '')
            alert('请填空试卷名称');
        else {
            method = 'CreatePaper';
            var scores = '';
            typeStr = '试卷';
            var i = 0;
            $('.score').each(function () {
                if (i++ > 0)
                    scores += ',';
                scores += $(this)[0].id.split('_')[1] + ':' + $(this).val();
            });
            params = { paperName: $('#paperTitle').val().replace(/ /g, ''), discrimination: $('#dis').val(), difficulty: $('#paperDiff').val(), scores: scores };

            var loading = showLoding('正在生成试卷，请稍候...');
            jQuery.service.call(this, 'problib.asmx/' + method, params, function (data) {
                loading.close();
                if (data.ok) {
                    alert('生成试卷成功');
                    location.replace('/scheme.htm#tab:1');
                }
                else
                    alert('生成失败\n失败原因：' + data.msg);
            });
        }
    });
};

var lastShowSetSameArea;
function getProbInBoxHtml(container, index, prob,previewType, innerIndex, score,paperId,importInfoId) {
    var msgIcon = '', changeMark = '';
    if (!prob.integrityInfo.IsIntegrity) {
        var infodetail = '';
        $.each(prob.integrityInfo.InfoDetail, function (i, info) {
            infodetail += info + "\n";
        });
        if (prob.integrityInfo.InfoType == '警告') {
            previewWarningsCount++;
            msgIcon = '<a class="warningBtn info" title="' + infodetail + '" href="javascript:;" ></a>';
            warningIds += prob.id + ',';
        }
        else {
            previewErrorsCount++;
            msgIcon = '<a class="errorBtn info" title="' + infodetail + '" href="javascript:;" ></a>';
            errorIds += prob.id + ',';
        }
    }
    if (prob.ImprotChangeType != null)
    {
        var imgUrl = '/images/';
        if (prob.ImprotChangeType == 1)
            imgUrl += 'prob_add.gif';
        else if (prob.ImprotChangeType == 2)
            imgUrl += 'prob_update.gif';
        else if (prob.ImprotChangeType == 3)
            imgUrl += 'prob_delete.gif';
        changeMark = '<img style="float:right;" src="' + imgUrl + '" />';
    }


    var hasUp = false;
    var htmlStr = '<div class="probheader">\
                      <div class="title">题&nbsp;#<label class="probIndex">' + index + '</label></div><label>题型：</label>' + prob.type + '<label>&nbsp;&nbsp;|&nbsp;&nbsp;难度：</label>' + prob.difficulty + '<label>&nbsp;&nbsp;|&nbsp;&nbsp;知识点：</label>' + (prob.kfullpath && prob.kfullpath.length > 30 ? '<span title="' + prob.kfullpath + '">' + prob.kfullpath.substr(0, 30) + '…</span>' : prob.kfullpath);
    if (previewType == 2 || previewType == 3) {
        htmlStr += '&nbsp;&nbsp;|&nbsp;&nbsp;<label>分值：</label><input type="text" id="probIndex_' + prob.id + '" name="' + prob.typeId + '" class="score" value="' + score + '" />分<span id="setScore_' + prob.id + '" class="setSameScore"><input id="setSameScore_' + prob.id + '" type="checkbox" value="" />将该分值应用至所有' + prob.type + '</span>';
    }
    htmlStr += changeMark+ '<div class="edit">';
    htmlStr += '<a id="detailProb_' + prob.id + '" class="detailbtn hide" title="试题详情" href="javascript:;"></a>';
    if (prob.ImprotChangeType == null || prob.ImprotChangeType != 3)
        htmlStr += '<a id="editProb_' + prob.id + '" class="editbtn hide" title="修改" href="javascript:;"></a>';
    if (previewType == 3)
    {
        if (index > 1) {
            var lastType = $('#probBox_' + (index - 1)).attr('name');
            if (lastType== prob.typeId) {
                htmlStr += '<a id="up_' + index+ '" class="upbtn hide" title="上移" href="javascript:;"></a>';
                hasUp = true;
            }
            else if (lastType != prob.typeId) {
                $($('#down_' + (index-1))[0]).remove();
            }
        }

        htmlStr += '<a id="down_' + index + '" class="downbtn hide" title="下移" href="javascript:;"></a>';
        //htmlStr += '<a id="change_' + prob.id + '" class="changebtn hide" title="换题" href="javascript:;"></a>';
    }
    if (previewType == 3)
        htmlStr += '<a id="delProb_' + prob.id + '" class="hide delbtn" href="javascript:;" title ="删除"></a>';
    else
        htmlStr += msgIcon;
    htmlStr += '</div></div>';

    htmlStr += '<div class="probcontent">' + prob.content;
    if (prob.answer != null && prob.answer != '' && prob.answer != 'null') {
        if (prob.typeId != 6)//非打字题
            htmlStr += '<br />【参考答案】&nbsp;' + prob.answer + '<br />';
        else {
            var s_int = parseInt(prob.answer);
            var min = s_int % 60 == 0 ? s_int / 60 : (s_int / 60).toFixed(1);
            htmlStr += '<br />【限时】&nbsp;' + prob.answer + '秒(' + min + '分钟)<br />';
        }
    }
    if (prob.proDetail != null && prob.proDetail != '' && prob.proDetail != 'null')
        htmlStr += '<br />【试题详解】<br />' + prob.proDetail;
    if (prob.judgeStandard != null && prob.judgeStandard != '' && prob.judgeStandard != 'null')
        htmlStr += '<br />【评分细则】<br />' + prob.judgeStandard;
    htmlStr += '</div>';
    if (prob.typeId == 2) {
        var attachFile = prob.attachment != null && prob.attachment != '' ? prob.attachment : '';
        var attachFileName = '无';
        if (attachFile != '') {
            var tmp = attachFile.split('\\');
            attachFileName = tmp[tmp.length - 1];
        }
        var isSame = prob.isUploadSameWithDownload != null && prob.isUploadSameWithDownload == true ? '是' : '否';
        var uploadExt = prob.uploadFileExt == null ? '<label style="color:red">未填写</label>' : prob.uploadFileExt;
        htmlStr += '<div class="foot"><label>附件：</label><label style="display:none" id="attachFile_' + index + '">' + attachFile + '</label><a href="javascript:;" id="attachFileLink_' + index + '" title="点击下载附件" onclick="probPreview_attachDownload($(this))" >' + attachFileName + '</a><label>&nbsp;&nbsp;&nbsp;&nbsp;关联：</label>' +
                   isSame + '<label>&nbsp;&nbsp;&nbsp;&nbsp;上传文件格式：</label>' + uploadExt + '</div>';
    }
    container.html(htmlStr);
    $('#detailProb_' + prob.id).click(function () {
        showProblemContent(prob.id);
    });
    if (prob.ImprotChangeType == null || prob.ImprotChangeType != 3) {
        $('#editProb_' + prob.id).click(function () {
            var c = true;
            $('#preview_editor').html('');
            $('#prob-import,#preview_editor').toggle(function () {
                if (c && !(c = !c)) {
                    location.replace('#top');
                    showEditor([prob], '修改试题', $('#preview_editor'), function () {
                        var c = true;
                        $('#prob-import,#preview_editor').toggle(function () {
                            if (c && !(c = !c)) {
                                removeProbInfo(prob.id);
                                if (previewType == 1 || previewType == 2) {
                                    problem.getImportProlbem(importInfoId, prob.id, function (data) {
                                        getProbInBoxHtml(container, index, data.data, previewType, innerIndex, score);
                                        location.replace('#' + container[0].id);
                                        refreshNumbers();
                                    });
                                }
                                else {
                                    problem.getProblem(prob.id, function (data) {
                                        getProbInBoxHtml(container, index, data.data, previewType, innerIndex, score);
                                        location.replace('#' + container[0].id);
                                        refreshNumbers();
                                    });
                                }
                            }
                        });
                    });
                }
            });
        });
    }

    if (previewType == 3) {
        $('#delProb_' + prob.id).click(function () {
            uic.confirm('您确定要删除此题？', function () {
                var delFun, params;
                if (previewType <= 2) {
                    if (previewType == 1) {
                        delFun = problem.remove;
                        params = [prob.id];
                    }
                    else if (previewType == 2) {
                        delFun = paper.removeProblem;
                        params = { paperId: paperId, probId: prob.id };
                    }
                    delFun(params, function (data) {
                        if (data.ok) {
                            removeProbInfo(prob.id);
                            container.slideUp(700, function () {
                                container.detach();
                                refreshNumbers();
                            });
                        }
                        else
                            alert('删除失败！\n失败原因:' + data.msg);
                    });
                }
                else {
                    var tmp = new Array(), tmp_probs = new Array();
                    $.each(probIds, function (i, id) {
                        if (id != prob.id)
                            tmp.push(id);
                        if (prob.id != importedProbs[i].id)
                            tmp_probs.push(importedProbs[i]);
                    });
                    probIds = tmp;
                    importedProbs = tmp_probs;
                    container.slideUp(700, function () {
                        container.detach();
                        refreshNumbers();
                    });
                }
            }, $(this).rect(), 150, true);
        });
    }

    if (hasUp)
    {
        $('#up_' + index).click(function () {
            change(index, index - 1);
        });
    }

    $('#down_' + index).click(function () {
        change(index, index + 1);
    });

    container.mouseenter(function () {
        $('div#'+$(this)[0].id+' .hide').toggle(true);
    }).mouseleave(function () {
        $('div#' + $(this)[0].id + ' .hide').toggle(false);
    });
    $('div#' + container[0].id + ' .hide').toggle(false);

    $('div#' + container[0].id + ' .info').click(function () {
        alert($(this).attr("title"));
    });

    if (previewType==2||previewType==3) {
        $('#setScore_' + prob.id).toggle(false);
        NumberBox($('#probIndex_' + prob.id), { "max": 10000, "min": 0, "step": 1 }, function (score) {
            var oriScore = parseFloat($('#probIndex_' + prob.id).val());
            oriScore = isNaN(oriScore) ? 0 : oriScore;
            score = parseFloat(score);
            score = isNaN(score) ? 0 : score;
            var paperScore = 0;
            var tmp_score,tmp_diff=0;
            $('.score').each(function (i) {
                tmp_score = parseFloat($(this).val());
                if (isNaN(tmp_score))
                    tmp_score = 0;
                tmp_diff += tmp_score * parseFloat(importedProbs[i].difficulty);
                paperScore += tmp_score;
            });
            paperScore -= oriScore;
            paperScore += score;
            $('#paperScore').val(paperScore);
            $('#paperDiff').val((tmp_diff / paperScore).toFixed(1));
            if (lastShowSetSameArea != null && lastShowSetSameArea[0].id != $('#setScore_' + prob.id)[0].id) {
                lastShowSetSameArea.stop(true, false).clearQueue().fadeOut(1);
            }
            lastShowSetSameArea = $('#setScore_' + prob.id);

            $('#setSameScore_' + prob.id).attr('checked', false);
            if (!$('#setScore_' + prob.id).is(":animated"))
                $('#setScore_' + prob.id).stop(true, false).clearQueue().fadeOut(1).fadeIn(1700).delay(4000).fadeOut(2500);
        });

        $('#setSameScore_' + prob.id).change(function () {
            if ($(this).attr('checked') == 'checked') {
                var paperScore = 0, tmp_score, tmp_diff = 0;
                var score = $('#probIndex_' + prob.id).val();

                $('.score').each(function (i) {
                    if ($(this).attr('name') == prob.typeId)
                        $(this).val(score);
                    tmp_score = parseFloat($(this).val());
                    if (isNaN(tmp_score))
                        tmp_score = 0;
                    tmp_diff += tmp_score * importedProbs[i].difficulty;
                    paperScore += tmp_score;
                });
                $('#paperScore').val(paperScore);
                if (paperScore > 0)
                    $('#paperDiff').val((tmp_diff / paperScore).toFixed(1));
                else
                    $('#paperDiff').val(0);
                $('.setSameScore').stop(1).fadeOut(1);
            }
        });
    }
};

function change(index_A, index_B)
{
    var scores = $('.score');
    var scoreA=$(scores[index_A-1]).val(), scoreB=$(scores[index_B-1]).val();
    var tmp = new Array(), temp_probs = new Array();
    for(var i=1;i<=importedProbs.length;i++) {
        if (i == index_A) {
            tmp.push(probIds[index_B-1]);
            temp_probs.push(importedProbs[index_B - 1]);
            $('#probBox_' + (index_A)).fadeOut(400, function () {
                $(this).fadeIn(200);
            });
            getProbInBoxHtml($('#probBox_' + (index_A)), index_A, importedProbs[index_B - 1], 3, index_A, scoreB);
        }
        else if (i == index_B) {
            tmp.push(probIds[index_A-1]);
            temp_probs.push(importedProbs[index_A - 1]);
            $('#probBox_' + (index_B)).fadeOut(400, function () {
                $(this).fadeIn(200);
            });
            getProbInBoxHtml($('#probBox_' + (index_B)), index_B, importedProbs[index_A - 1], 3, index_B, scoreA);
        }
        else {
            tmp.push(probIds[i-1]);
            temp_probs.push(importedProbs[i-1]);
        }
    }
    probIds = tmp;
    importedProbs = temp_probs;
    refreshNumbers();
    $($('#down_' + importedProbs.length)[0]).remove();//最后一题不允许下移
};

function removeProbInfo(id) {
    --probsCount;
    if (errorIds.indexOf(id) > -1) {
        previewErrorsCount--;
        errorIds = errorIds.replace(id + ',', '');
    }
    else if (warningIds.indexOf(id) > -1) {
        previewWarningsCount--;
        warningIds = warningIds.replace(id + ',', '');
    }
};

function refreshNumbers(hasPaper) {

    $('#totalNum').html(probsCount);
    $('#errors').toggle(false);
    $('#warnings').toggle(false);
    if (previewErrorsCount > 0) {
        $('#errors').toggle(true);
        $('#errorsNum').html(previewErrorsCount);
    }
    if (previewWarningsCount > 0) {
        $('#warnings').toggle(true);
        $('#warningsNum').html(previewWarningsCount);
    }
    $('.probIndex').each(function (i) {
        if ($(this).css("display") != "none")
            $(this).html(i+1);
    });
    $('.probBoxContainer').each(function (i) {
        $(this).attr('id', 'probBox_' + (i + 1));
    });
    if (probsCount == 0 && !(hasPaper != null && hasPaper)) {
        $('#resultArea').toggle(false);
        $('#filePath').html('未选择任何文件');
    }
    $('#prviewBtnArea').toggle(false);
};

function probPreview_attachDownload(obj) {
    var index = obj[0].id.split('_')[1];
    var filePath = $('#attachFile_' + index).html();
    $('#iframe-upload')[0].contentWindow.location = 'probSave.ashx?type=download&file=/temp/' + filePath;
};


function showLogsInContainer(container, logsNum) {
    container.html('');
    var getImportLog;
    if (QueryString('type') == '1')
        getImportLog = problem.getImportLog;
    else
        getImportLog = paper.getImportLog;
    getImportLog(logsNum, function (data) {
        if (data.count <= 5)
            $('#showMoreLogs').toggle(false);
        else
            $('#showMoreLogs').toggle(true);

        $.each(data.data.rows, function (i, log) {
            var logBrief, resultMsg, detailMsg;
            var arr;
            arr = log.log.split(':');
            resultMsg = arr[0];
            detailMsg = '';
            $.each(arr, function (i, data) {
                if (i != 0)
                    detailMsg += arr[i];
            });
            if (resultMsg.indexOf('失败') > -1 || detailMsg != '') {
                html = '<div class="log log' + parseInt(i % 2) + '">您于' + log.time + ' ' + resultMsg + '<a id="log_' + (i + 1) + '" href="javascript:;">详细...</a></div>';
            }
            else
                html = '<div class="log log' + parseInt(i % 2) + '">您于' + log.time + ' ' + resultMsg + '</div>';
            container.append(html);
            $('#log_' + (i + 1)).click(function () {
                var nextLine = '\n';
                if (detailMsg[0] == '\n')
                    nextLine = '';
                alert(resultMsg + '，失败原因如下：'+nextLine + detailMsg);
            });
        });
        container.slideToggle(1000);
    });
};

function reload() {
    InitShowImport($('#importContainer'), QueryString('type'), function () { });
};


function showFlow(container, currentStep, allSteps) {
    /// <param name="container" type="String">待装载的容器</param>
    /// <param name="currentStep" type="int">当前所在的步骤</param>
    var html = '<div class="flowBox">';
    if (allSteps.length > 0) {
        $.each(allSteps, function (i, stepContent) {
            html += getFlowStepAreaSpan(i, stepContent, currentStep >= i + 1);
            if (i != allSteps.length - 1)
                html += getFlowArrow(i);
        });
    }
    container.html(html+'</div>');
};

function getFlowStepAreaSpan(stepIndex, stepContent, highlight) {
    var span;
    if (highlight)
        span = '<span class="normal highlight">';
    else
        span = '<span class="normal">';
    span += '<span class="content title">' + stepContent + '</span>\
             <span class="content number">'+ (stepIndex + 1) + '</span>\
           </span>';
    return span;
};

function getFlowArrow(stepIndex) {
    var span = '<span class="arrow';
    if (stepIndex % 2 == 1)
        span += ' flipy';
    span += '"></span>';
    return span;
};
