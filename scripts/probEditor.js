/// <reference path="lib/problib.js" />
/// <reference path="ckeditor/ckeditor.js" />
/// <reference path="Tree/gzy.tree.js" />
/// <reference path="common.js" />
/// <reference path="PopWindow/gzy.popup.js" />


showEditor = (function () {
    var ckeditor_width = 882, ckeditor_height = 800;
    function initEditorUI(ids) {
        $.each(ids, function (i, id) {
            CKEDITOR.replace(id, {
                uiColor: '#F5FBFA',
                extraPlugins: 'tableresize',
                extraPlugins: 'autogrow',
                autoGrow_maxHeight: ckeditor_height,
                removePlugins: 'resize',
                width: ckeditor_width
            });
        });
    };

    window.onload = function () {
        if (window.addEventListener)
            document.body.addEventListener('dblclick', onDoubleClick, false);
        else if (window.attachEvent)
            document.body.attachEvent('ondblclick', onDoubleClick);
    };

    function onDoubleClick(ev) {
        var element = ev.target || ev.srcElement;
        var name;
        while (element && (name = element.nodeName.toLowerCase()) && (name != 'div' || element.className.indexOf('editable') == -1) && name != 'body') {
            element = element.parentNode;
        }

        if (name == 'div' && element.className.indexOf('editable') != -1)
            replaceDiv(element);
    };

    var editor;
    var callBack;
    var isSameFileCheckBox;
    var _title;
    var _container;
    var areaId;

    function replaceDiv(div) {

        if (editor)
            editor.destroy();
        editor = CKEDITOR.replace(div, {
            uiColor: '#F5FBFA',
            extraPlugins: 'tableresize',
            extraPlugins: 'autogrow',
            autoGrow_maxHeight: ckeditor_height,
            removePlugins: 'elementspath',
            width: ckeditor_width,
            toolbar: 'MyToolbar'
        });
    };

    function showKPTree(callBack, container) {
        var tree;
        selectKPWin = new gzy.popup('选择知识点', 450, 400, {
            html: '<select id="subjectSelector"></select><div id="kpTreeContainer"></div>',
            buttons: [
                {
                    text: '确认', id: 'ensure_kp', click: function () {
                        callBack(tree.checkedAll, tree.checkedText, container);
                        selectKPWin.close();
                    }
                },
                {
                    text: '取消', id: 'cancel_kp', click: function () {
                        selectKPWin.close();
                    }
                }
            ]
        });




        var subjectSelector = $('#subjectSelector');
        subjectSelector.empty();
        subject.getAllSubjects(function (subjects) {
            debugger;
            $.each(subjects, function (i, item) {
                subjectSelector.append('<option value="' + item.Id + '">' + item.SubjectName + '</option>');
            });
            subjectSelector.change(function (selectedSubject) {
                var subjectId = subjectSelector.val();
                kpoint.getTree(subjectId, function (x) {
                    $('#kpTreeContainer').empty();
                    tree = new gzy.tree({
                        items: x,
                        multi: true,
                        onload: function () {
                            var kpidsArr = new Array();
                            $.each(probKPids.toString().split(','), function (i, kpid) { kpidsArr.push(parseInt(kpid)); });
                            this.expand(0).pick(kpidsArr);
                        }
                    }).renderTo('#kpTreeContainer').expand(0).select(0);
                })





                //tree = new gzy.tree({
                //    multi: true,
                //    sourceType: 'json',
                //    connector: {
                //        url: kpoint.getTree, onload: function () {
                //            var kpidsArr = new Array();
                //            $.each(probKPids.toString().split(','), function (i, kpid) { kpidsArr.push(parseInt(kpid)); });
                //            this.expand(0).pick(kpidsArr);
                //        }
                //    }
                //}).renderTo('#kpTreeContainer');




            });
            subjectSelector.change();

        });




    };


    function showEditor(probs, title, container, back_call) {
        /// <param name="back_call" type="function">用户返回或保存试题后调用的方法，本方法带一个参数，用户直接返回时参数为False，用户保存试题成功后调用时参数为True</param>
        var date = new Date();
        var area = date.getTime();
        clear();
        _title = title;
        _container = container;
        callBack = back_call;
        container.html('')//.click(function (e) { if($(e.target).is('div.editable')) replaceDiv(this);});
        container.append('<div class="form_title"><a href="javascript:;" id="' + area + 'cancel-edit" class="form_return" ><img src="/images/goback.gif" />返回试题列表</a>' + title + '</div>');
        if (back_call != null)
            $('#' + area + 'cancel-edit').click(function () {
                GoBack(false);
            });
        var allprobTypes;
        probType.getAllTypes(function (d) {
            allprobTypes = d.data.rows;
            var editorIds = new Array();
            if (probs != null) {
                $.each(probs, function (i, prob) {
                    areaId = area + (i + 1).toString();
                    getEditForm(prob, container, allprobTypes);
                    editorIds.push(areaId);
                });
            }
            else {
                areaId = area;
                probTypeId = 0;
                getEditForm(null, container, allprobTypes);
                editorIds.push(areaId);
            }
        });
    };

    function getAllExtendProperties() {
        var extend = new Array();
        $('.extendText').each(function (i, data) {
            if ($.trim(data.value) != '')
                extend.push(data.id.split('_')[1] + ':' + data.value);
        });
        return extend;
    };

    var probTypeId;
    function submitform() {
        var loading = new showLoding('正在保存试题，请稍候!');
        if (editor)
            editor.destroy();
        var selectedTypeOptionId = $('#sel_' + areaId + ' option:selected')[0].id.split('_');
        probTypeId = selectedTypeOptionId[selectedTypeOptionId.length - 1];
        var diff = $('#hard' + areaId).val();
        var probContent = $('#' + areaId).html();
        var probDetail = $('#prob_detail_' + areaId).html();
        var answerFiledCount = $('#answer_' + areaId + '_num').val();
        var objectAnswer;
        var judgeCount = $('#judgeCount' + areaId).val();
        var judgeStandard = $('#judgeStandard_' + areaId).html();
        var hasUpload = $('#needUpload_answer_' + areaId).attr("checked") == "checked";
        var isSameTypeWithDonload = $('#isSame_answer_' + areaId).attr("checked") == "checked";
        var uploadFileExt = getUploadFileExt(areaId);
        var extendProperties = getAllExtendProperties();
        if (judgeStandard == '在此添加内容')
            judgeStandard = null;
        if (probDetail == '在此添加内容')
            probDetail = null;

        if (probTypeId != 2)
            isSameTypeWithDonload = '';
        if (probTypeId == 6)
            objectAnswer = $('#answer_' + areaId + '_timeBox').val();
        else
            objectAnswer = probEdit_answer;

        loading.close();

        if (probTypeId == 2 && !isSameTypeWithDonload && uploadFileExt.toString() == '')
            alert('请至少选择一种上传文件类型')
        else if (probKPids.toString() == '')
            alert('请至少选择一个知识点');
        else if ((probTypeId <= 1||probTypeId==7) && objectAnswer == '')
            alert('请选择答案');
        else if (probContent.replace(' ', '').replace('\t', '') == '' || probContent == '在此添加内容')
            alert('请输入题面内容');
        else if ((probTypeId == 4 || probTypeId == 5) && !checkAllFillInAreaFilled()) {
            alert('答案项中不能存在空项，请将各项答案填写完整');
        } else if (probTypeId == 6 && objectAnswer.length > 300)
            alert('题面不能超过300个字符');
        else {
            if ($('#checkSimilarity').attr('checked') == 'checked') {
                var checkLoading = showLoding('正在进行试题查重，请稍候');
                $.post("/probSave.ashx?type=GetMaxSimilarity", { probId: probId, content: probContent, probTypeId: probTypeId }, function (d) {
                    checkLoading.close();
                    if (d.length > 0) {
                        var htmlStr = '<table class="list"><thead><tr><th>题号</th><th>题面</th><th>相似度</th></tr></thead><tbody>';
                        $.each(d, function (i, item) {
                            item.Similarity *= 100;
                            htmlStr += '<tr><td>' + item.ProblemId + '</td><td><a href="javascript:;" onclick="viewProblemContent(' + item.ProblemId + ')">' + item.Content + '</a></td><td>' + item.Similarity.toFixed(1) + '%</td></tr>';
                        });
                        htmlStr += '</tbody></table>';
                        var win = new gzy.popup('查询到相类似的试题', 600, 240,
                            {
                                html: htmlStr,
                                buttons: [
                                    {
                                        text: '确定保存',
                                        click: function () {
                                            save(probId, probTypeId, diff, probKPids, probContent, probDetail,
                                                    answerFiledCount, objectAnswer, judgeCount, judgeStandard,
                                                    hasUpload, isSameTypeWithDonload, uploadFileExt, attachFile, submitFileName, extendProperties);
                                            win.close();
                                        }
                                    }
                                    ,
                                       {
                                           text: '返回编辑界面',
                                           click: function () {
                                               win.close();
                                           }
                                       }
                                ],
                                info: '系统检查发现了<label style="color:red;fong-weight:bold;margin:0 4px;">' + d.length + '</label>个试题的题面内容与本题的相似，您可以查看这些试题以确认是否与正在编辑的试题相同，您也可以直接保存编辑的试题。'
                            });
                    }
                    else//保存
                        save(probId, probTypeId, diff, probKPids, probContent, probDetail,
                            answerFiledCount, objectAnswer, judgeCount, judgeStandard,
                            hasUpload, isSameTypeWithDonload, uploadFileExt, attachFile, submitFileName, extendProperties);


                }, "json");
            }
            else
                save(probId, probTypeId, diff, probKPids, probContent, probDetail,
                           answerFiledCount, objectAnswer, judgeCount, judgeStandard,
                           hasUpload, isSameTypeWithDonload, uploadFileExt, attachFile, submitFileName, extendProperties);
        }
        return false;
    };

    function clear() {
        attachFile = '';
        submitFileName = '';
        
    };


    function save(probId, probTypeId, diff, probKPids, probContent, probDetail, answerFiledCount, objectAnswer, judgeCount, judgeStandard, hasUpload, isSameTypeWithDonload
        , uploadFileExt, attachFile, submitFileName, extendProperties) {
        var saveLoading = showLoding('正在保存试题，请稍候');
        $.post("/probSave.ashx?type=form", {
            "id": probId, "probTypeId": probTypeId, "diff": diff, "kpids": probKPids.toString(), "probContent": probContent,
            "probDetail": probDetail, "answerFiledCount": answerFiledCount, "objectAnswer": objectAnswer, "judgeCount": judgeCount,
            "judgeStandard": judgeStandard, "hasUpload": hasUpload, "isSameTypeWithDonload": isSameTypeWithDonload,
            "uploadFileExt": uploadFileExt.toString(), "attachFilePath": attachFile, "attachFileName": submitFileName, "extendProperties": extendProperties.toString()
        },
            function (data) {
                saveLoading.close();
                var str = probId == -1 ? '创建' : '修改';
                if (data.ok) {
                    if (probId != -1) {
                        alert('修改成功！');
                        GoBack(true);//返回试题列表
                    }
                    else {
                        if (confirm('新建成功！\n是否继续新建试题？'))
                            showEditor(null, _title, _container, callBack);
                        else
                            GoBack(true);
                    }
                }
                else {
                    alert(str + '失败\n失败原因:' + data.msg);
                }
            }, "json");

    };

    function checkAllFillInAreaFilled() {
        var result = false;
        var tmp = $.trim(probEdit_answer.toString());
        var sep = String.fromCharCode(31);
        if (tmp != '' && tmp[0] != sep && tmp[tmp.length - 1] != sep && tmp.indexOf(tmp + tmp) == -1)
            result = true;
        return result;
    };

    var attachFile = '';
    $(function () {
        $('#iframe-upload').bind('load', function () {
            try {
                if (this.contentWindow.document.body.innerHTML != null && this.contentWindow.document.body.innerHTML[0] == '{') {
                    var d = $.parseJSON(this.contentWindow.document.body.innerHTML);
                    if (!d.ok) throw new Error(d.msg);
                    var tmp = d.msg.split('\\');
                    attachFile = tmp[tmp.length - 1];
                    submitFileCallBack(d.msg);
                }
            } catch (e) {
                alert('提交附件失败\n失败原因：' + e.message);
                submitFileName = '';
                attachFile = '';
                submitFileTitle.css("display", "");
                fileNameContainer.html('');
            }
        });

    });

    var probKPids;
    var probId;
    function getEditForm(prob, container, allprobTypes) {
        var proDetail, judgeStandard, content;
        if (prob != null) {
            probId = prob.id;
            probTypeId = prob.typeId;
            if (prob.proDetail == null || prob.proDetail == 'null')
                proDetail = '在此添加内容';
            else
                proDetail = prob.proDetail;
            if (prob.judgeStandard == null || prob.judgeStandard == 'null')
                judgeStandard = '在此添加内容';
            else
                judgeStandard = prob.judgeStandard;
            content = prob.content;
        }
        else {
            proDetail = judgeStandard = content = '在此添加内容';
            probId = -1;
        }

        var difficulty = prob != null ? prob.difficulty : 0.5;
        var judgeStandardCount = prob != null ? prob.judgeStandardCount : 1;
        var kps;
        
        if (prob != null) {
            kps = prob.kfullpath.split(',').toString();
            if (kps.length > 35)
                kps = kps.substr(0, 35) + '...';
        }
        else {
            kps = cookie.get('probKPids') != null && cookie.get('probKPids') != '' ? cookie.get('kps') : '请选择知识点'
        }
        probKPids = prob != null ? prob.kpids : (cookie.get('probKPids') != null && cookie.get('probKPids') != '' ? cookie.get('probKPids') : '');
        var formHtml = '<div  class="probEditor" id ="form_' + areaId + '">\
               <div class="row"><div class ="header">题型：</div>\
                <div class="content"><select id = "sel_' + areaId + '"><option>单选题</option></select></div>\
                <div class ="header">难度系数：</div>\
                <div class="content"><input type="text" class="num" id = "hard' + areaId + '" value="' + difficulty + '"/></div>\
                <div class ="header">知识点：</div>\
                <div class="content"><a id = "kp' + areaId + '" href="javascript:;" >' + kps + '</a></div></div>\
                <div class="row"><div class="header">题面：</div>\
                <div class="content" style="margin:0px"><div class="editable minHeight" title="双击可进行编辑" id ="' + areaId + '">' + content + '</div></div></div>\
                <div class="row"><div class="header">试题详解：</div>\
                <div class="content" style="margin:0px"><div class="editable minHeight" title="双击可进行编辑" id ="prob_detail_' + areaId + '">' + proDetail + '</div></div></div>\
                <div  id="answer_' + areaId + '"></div>\
                <div class="row" name="judge" ><div class="header">评分项数：</div><div class="content" ><input type = "text" class="num" id = "judgeCount' + areaId + '" value="' + judgeStandardCount + '"</input></div></div>\
                <div class="row" name="judge"><div class="header">评分标准：</div><div class="content" style="margin:0px" ><div class="editable minHeight" title="双击可进行编辑" id ="judgeStandard_' + areaId + '">' + judgeStandard + '</div></div></div>\
                <div id="extendProperties_'+ areaId + '"></div>\
                </div>\
                <div class="row" style="text-align:center; background-image:none" ><input type="checkbox" id="checkSimilarity" />保存时检查相似的试题<br /><input type="button" id="' + areaId + '_submit"  class="save" value="" /></div>';
        container.append(formHtml);

        $('#kp' + areaId).click(function () {
            showKPTree(selectKpIdsCallBack, $(this));
        });

        $('#' + areaId + '_submit').click(function () {
            return submitform($(this)[0]);
        });

        NumberBox($('#hard' + areaId), { "max": 1, "min": 0, "step": 0.1 });
        NumberBox($('#judgeCount' + areaId), { "max": 50, "min": 1, "step": 1 });
        var sel = $('#sel_' + areaId);
        sel.html('');//清空下拉列表
        var checked;
        var probTypeName;
        $.each(allprobTypes, function (i, data) {
            if (data.id == probTypeId) {
                checked = ' selected = "selected" ';
                probTypeName = data.name;
            }
            else
                checked = '';
            option = '<option id="probTypeSel_' + data.id + '" value="' + data.judgeType + ',' + i + '" ' + checked + '>' + data.name + '</option>';
            sel.append(option);
        });
        changeAnswerArea($('#judge_' + areaId), $('#answer_' + areaId), probTypeName, prob, prob != null ? prob.isSubject : false);
        sel.change(function () {
            probTypeId = sel.val().split(',')[1];
            var judgeType = sel.val().split(',')[0];
            changeAnswerArea($('#judge_' + areaId), $('#answer_' + areaId), sel.find("option:selected").text(), prob, judgeType == 2);
        });


        var extendContainer = $('#extendProperties_' + areaId);
        extendContainer.html('');
        jQuery.service.call(this, 'problib.asmx/GetAllExtendType', {}, function (data) {
            $.each(data.data, function (i, extendType) {
                extendContainer.append('<div class="row"><div class="header">' + extendType.ExtendPropertyName + '：</div>\
                    <div class="content" style="margin:0px"><input type="text" class="extendText" id="extendType_' + extendType.Id + '" />\
                    </div></div>');
            });
            if (prob != null)
                $.each(prob.properties, function (i, property) {
                    $('#extendType_' + property.typeId).val(property.value);
                });
        });

        if (cookie.get('checkSimilarity')=='true')
            $('#checkSimilarity').attr('checked', true);
        else
            $('#checkSimilarity').attr('checked', false);

        $('#checkSimilarity').change(function () {
            if ($(this).attr('checked'))
                cookie.set('checkSimilarity', true);
            else
                cookie.set('checkSimilarity', false);
        });


    };

    function download(filePath) {
        $('#iframe-upload')[0].contentWindow.location = 'probSave.ashx?type=download&file=' + filePath;
    };

    var probEdit_answer;
    var submitFileTitle, fileNameContainer, submitFileName;
    function submitFileCallBack(filePath) {
        submitFileTitle.css("display", "");
        if (filePath != null) {
            submitFileTitle.html('更换附件');
            fileNameContainer.html('已添加附件：<a href="javascript:;" title="点击下载附件" class="link" >' + submitFileName + '</a>\
                               <button class="del_attach" title="清除附件" ></button>');
            $('#' + fileNameContainer[0].id + ' .link').click(function () {
                download('/temp/' + filePath);
            });

            $('#' + fileNameContainer[0].id + ' .del_attach').click(function () {
                submitFileCallBack(null);
            });
        }
        else {
            fileNameContainer.html('');
            submitFileTitle.html('添加附件');
            submitFileName = '';
            attachFile = '';
        }
        if (attachFile == null || attachFile == '') {
            isSameFileCheckBox.attr("disabled", true).attr("checked", false).attr('title', '指定了附件才能使用本功能')
            showFileExt(isSameFileCheckBox);
        }
        else {
            isSameFileCheckBox.attr("disabled", false).attr('title', '');
        }
    };

    function addattach(fileUploader, title, fileName, answerAreaID) {
        if (fileUploader.val() == '') {
            fileName.html('');
            title.html('添加附件');
        }
        else {
            var fileSize = getFileSize(fileUploader[0]);
            var fileSizeWithMB = fileSize / 1024 / 1024;
            if (fileSizeWithMB <= 5) {//判断附件是否小于5M
                var name = fileUploader.val().split('\\');
                submitFileTitle = title;
                fileNameContainer = fileName;
                submitFileName = name[name.length - 1];
                $('#submit_' + answerAreaID).click();
                title.css("display", "none");
                fileNameContainer.html('附件正在上传中<img src="/images/ajax-loader(2).gif" />');
            }
            else {
                alert('上传的附件文件大小不能大于5MB，当前您选择的文件大小为:' + getFileSizeName(fileSize, 1));
            }
        }
    };

    function changeAnswerArea(judgeArea, answerArea, probTypeName, prob, isSubject) {
        var htmlStr = '', filedShow;
        answerArea.html('');
        var filedCount;
        var answer = prob != null ? prob.answer : '';
        var maxAnswerNum;//最大答案个数
        if (probTypeId == 0 || probTypeId == 1 || probTypeId == 7) {
            maxAnswerNum = 15;
            filedCount = prob != null ? prob.filedCount : 4;
            //if ()
            filedShow = ''; //'style="display:none"';
            //else
            //    filedShow = '';
            htmlStr = '<div class ="header" ' + filedShow + ' >选项数：</div><div class="content" ' + filedShow + '><input type="text" class="num" id="' + answerArea[0].id + '_num" value="' + filedCount + '" /></div>';
            htmlStr += '<div class="header">答案：</div><div class="content" id="' + answerArea[0].id + '_answerArea"></div>';
            answerArea.append('<div class="row" >' + htmlStr + '</div>');
            var fun;
            if (probTypeId == 0) {
                fun = showSingleChoiceFiled;
                $('#' + answerArea[0].id + '_num').attr("disabled", "disabled").val(4);//单选题不提供可选选项数
            }
            else {
                fun = showMultiChoiceFiled;
            }
            fun(filedCount, $('#' + answerArea[0].id + '_answerArea'), answer);
        }
        else if (probTypeId == 2) {
            var isSameChecked = '';
            htmlStr += '<div class="header">附件：</div><div class="content">\
                    <form target="iframe-upload" action="probSave.ashx?type=file" method="post" enctype="multipart/form-data">\
                    <span class="btn btn-success fileinput-button">\
                    <img src="/images/addfile.png" />\
                    <span id ="fileTitle_' + answerArea[0].id + '">添加附件</span>\
                    <input type="file" id="' + answerArea[0].id + '_addattach" name="attach" />\
                    </span><span id="fileName_' + answerArea[0].id + '" ></span>\
                    <input type="submit" id="submit_' + answerArea[0].id + '" class="displayNone" />\
                    </form></div>';
            answerArea.append('<div class="row" >' + htmlStr + '</div>');
            answerArea.append('<div class="row" >\
                                         <div class="header">上传文件：</div>\
                                          <div class="content" name="isSame"><input type = "checkbox" id="isSame_' + answerArea[0].id + '" ></input>上传与下载是否为同一文件\
                                         </div>\
                                         <div class="header displayNone" style="height:50px;" title="上传文件的类型" name="fileExt">上传文件<br/>类型：</div>\
                                        <div class="content displayNone" id="fileExt_' + answerArea[0].id + '" name="fileExt">\
                                                <input type="checkbox" class="ext" value="doc" />doc\
                                                <input type="checkbox" class="ext"  value="docx"  />docx\
                                                <input type="checkbox" class="ext" value="xls"  />xls\
                                                <input type="checkbox" class="ext" value="xlsx"   />xlsx\
                                                <input type="checkbox"  class="ext" value="ppt"  />ppt\
                                                <input type="checkbox"  class="ext" value="pptx"  />pptx\
                                                <input type="checkbox"  class="ext" value="jpg"   />jpg\
                                                <input type="checkbox"  class="ext" value="gif"  />gif\
                                                <input type="checkbox"  class="ext" value="png"  />png\
                                                <input type="checkbox"  class="ext" value="bmp"  />bmp\
                                                <input type="checkbox"  class="ext" value="psd"  />psd<br/>\
                                                <input type="checkbox"  class="ext" value="rar"  />rar\
                                                <input type="checkbox"  class="ext" value="zip"  />zip\
                                                <input type="checkbox"  class="ext" value="swf"  />swf\
                                                <input type="checkbox"  class="ext" value="fla"  />fla\
                                                <input type="checkbox"  class="ext" value="exe"  />exe\
                                        </div>\
                                     </div>\
                                  ');
            isSameFileCheckBox = $('#isSame_' + answerArea[0].id);
            if (prob != null && prob.attachment != null && prob.attachment != '') {
                submitFileTitle = $('#fileTitle_' + answerArea[0].id);
                fileNameContainer = $('#fileName_' + answerArea[0].id);
                var temp = prob.attachment.split('\\');
                submitFileName = temp[temp.length - 1];
                attachFile = prob.attachment;
                submitFileCallBack(attachFile);
            }

            $('#' + answerArea[0].id + '_addattach').change(function () {
                addattach($(this), $('#fileTitle_' + answerArea[0].id), $('#fileName_' + answerArea[0].id), answerArea[0].id);
            });

            $('#isSame_' + answerArea[0].id).change(function () {
                showFileExt($(this));
            });

        }
        else if (probTypeId == 3) {
            var rightChecked = '', wrongChecked = '';
            probEdit_answer = answer;
            if (answer == '1') {
                rightChecked = 'checked = checked';
            }
            else {
                wrongChecked = 'checked = checked';
            }
            htmlStr += '<div class="header">答案：</div><div class="content" id="' + answerArea[0].id + '_answerArea">\
                         <input type="radio" class="choice" name="judgments" value="1" ' + rightChecked + ' />正确 <input type="radio"  class="choice" name="judgments" value="0" ' + wrongChecked + ' />错误 </div>';
            answerArea.append('<div class="row" >' + htmlStr + '</div>');

            $('#' + answerArea[0].id + '_answerArea').click(function () {
                getAnswer(answerArea[0].id + '_answerArea');
            });

        }
        else if (probTypeId == 4 || probTypeId == 5) {
            filedCount = prob != null ? prob.filedCount : 1;
            maxAnswerNum = 7;
            htmlStr = '<div class ="header" >答案项数：</div><div class="content" ><input type="text" class="num" id="' + answerArea[0].id + '_num" value="' + filedCount + '" /></div>';
            htmlStr += '<div class="header">答案：</div><div class="content" id="' + answerArea[0].id + '_answerArea"></div>';
            answerArea.append('<div class="row" >' + htmlStr + '</div>');
            fun = showFill_InFiled;
            fun(filedCount, $('#' + answerArea[0].id + '_answerArea'), answer);
        }
        else if (probTypeId == 6)//打字题
        {
            htmlStr += '<div class="header">限时：</div><div class="content" id="' + answerArea[0].id + '_answerArea"><input type="text" id="' + answerArea[0].id + '_timeBox" class="num" value="300" />秒(<label id="' + answerArea[0].id + '_timeBox_minutes">5分钟</label>)</div>';
            answerArea.append('<div class="row" >' + htmlStr + '</div>');
            NumberBox($('#' + answerArea[0].id + '_timeBox'), { "max": 2000, "min": 1, "step": 10 }, function (num) {
                var min = num / 60;
                var round = false;
                if (num % 60 != 0) {
                    min = min.toFixed(1);
                    round = true;
                }
                $('#' + answerArea[0].id + '_timeBox_minutes').html((round ? '约' : '') + min + '分钟');
            });
        }

        var formHtml = '';
        judgeArea.html();
        if (isSubject)
            $('[name="judge"]').css("display", "");
        else
            $('[name="judge"]').css("display", "none");

        var filedCount = $('#' + answerArea[0].id + '_num');

        if (filedCount != -1)
            NumberBox(filedCount, { "max": maxAnswerNum, "min": 1, "step": 1 }, function (num) {
                fun(num, $('#' + answerArea[0].id + '_answerArea'), answer);
                getAnswer(answerArea[0].id + '_answerArea');
            });
        getAnswer(answerArea[0].id + '_answerArea');

        if (prob != null && prob.isUploadSameWithDownload) {
            $('#isSame_' + answerArea[0].id).attr("checked", "checked");
            $('[name="fileExt"]').toggle(false);
        }
        else {
            if (prob == null)
                $('#isSame_' + answerArea[0].id).attr("disabled", true).attr('title', '指定了附件才能使用本功能');
            $('[name="fileExt"]').toggle(true);
            var uploadFileExt, uploadFileExt;
            uploadFileExt = prob == null || prob.uploadFileExt == null ? '' : prob.uploadFileExt;
            uploadFileExt = uploadFileExt.toLowerCase();
            var extName;
            $('.ext').each(function () {
                extName = $(this).val().toLowerCase();
                if (uploadFileExt.indexOf(extName) != -1)
                    $(this).attr("checked", "checked");
            });
        }
    };


    function getUploadFileExt(areaID) {
        var uploadFileExt = new Array();
        $('div#form_' + areaID + ' .ext').each(function () {
            if ($(this).attr("checked") == "checked")
                uploadFileExt.push($(this).val());
        });
        // alert(uploadFileExt);
        return uploadFileExt;
    };



    function showFileExt(obj) {
        isSameFileCheckBox = obj;
        var show = obj.attr("checked") != "checked";
        $('[name="fileExt"]').toggle(show);
    };

    var choices = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    function showSingleChoiceFiled(inputCount, container, answer) {
        var htmlStr = '';
        var id = container[0].id;
        var attr = ' name = "' + id + '" ';
        var checked;
        for (var i = 0; i < inputCount; i++) {
            if (answer.toUpperCase() == choices[i])
                checked = ' checked = "checked" ';
            else
                checked = '';
            htmlStr += '<input type="radio" class="choice" id="sc_' + i + '"  ' + attr + ' value="' + choices[i] + '" ' + checked + ' />' + choices[i];
            htmlStr += '&nbsp;&nbsp;';
        }
        container.html(htmlStr);
        $('div#' + id + ' .choice').click(function () {
            getAnswer(id);

        });

    };


    function getAnswer(id) {
        probEdit_answer = '';
        var sep;
        if (probTypeId == 0 || probTypeId == 1 || probTypeId == 3 || probTypeId == 7 ) {
            $('div#' + id + ' .choice').each(function () {
                if ($(this).attr("checked") == "checked") {
                    if (probEdit_answer != '')
                        sep = String.fromCharCode(31);
                    else
                        sep = '';
                    if (probTypeId != 3)
                        probEdit_answer += sep + (choices[parseInt($(this).attr('id').split('_')[1])]);
                    else
                        probEdit_answer = $(this).val();
                }
            });
        }
        else if (probTypeId == 4 || probTypeId == 5)//填空题
        {
            probEdit_answer = '';
            var value;
            $('div#' + id + ' .fill_in').each(function (i) {
                value = $.trim($(this).val());
                if (i > 0)
                    sep = String.fromCharCode(31);
                else
                    sep = '';
                probEdit_answer += sep + value;
            });
        }
    };

    function showMultiChoiceFiled(inputCount, container, answer) {
        var htmlStr = '';
        var attr = ' name = "' + container[0].id + '" ';
        var checked;
        for (var i = 0; i < inputCount; i++) {
            if (answer.toUpperCase().indexOf(choices[i]) > -1)
                checked = ' checked = "checked" ';
            else
                checked = '';
            htmlStr += '<input type="checkbox" class="choice" id="mc_' + i + '" ' + attr + ' value="' + choices[i] + '" ' + checked + ' />' + choices[i];
            htmlStr += '&nbsp;&nbsp;';
        }
        container.html(htmlStr);

        $('div#' + container[0].id + ' .choice').click(function () {
            getAnswer(container[0].id);
        });

    };

    function showFill_InFiled(inputCount, container, answer) {
        var htmlStr = '';
        var sep = String.fromCharCode(31);
        var answers = answer.split(sep);
        var tmp;
        for (var i = 0; i < inputCount; i++) {
            if (i > 0)
                htmlStr += '、';
            tmp = answers[i] == null ? '' : answers[i];
            htmlStr += '<input type="text" class="fill_in" id="mc_' + i + '" value="' + tmp + '" />';
        }
        container.html(htmlStr);

        $('div#' + container[0].id + ' .fill_in').keyup(function () {
            getAnswer(container[0].id);
        });

    };

    function GoBack(hasSave) {
        if (editor)
            editor.destroy();
        callBack(hasSave);
    };




    function selectKpIdsCallBack(selectedKpids, kpNames, container) {
        var kpNamesStr = kpNames.toString();
        if (kpNamesStr.length > 35)
            kpNamesStr = kpNamesStr.substr(0, 35) + '...';
        else if (kpNamesStr.length == 0)
            kpNamesStr = '请选择知识点';
        cookie.set('kps', kpNamesStr);
        container.html(kpNamesStr);
        kpNamesStr = "";
        $.each(kpNames, function (i, kpname) {
            kpNamesStr += kpname + "\n";
        });
        container.attr("title", kpNamesStr);
        probKPids = selectedKpids;
        cookie.set('probKPids', probKPids);
    };

    return showEditor;
})();