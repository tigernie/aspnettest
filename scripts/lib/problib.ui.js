/// <reference path="../importProbs.js" />
/// <reference path="../tiny_mce/tiny_mce.js" />
/// <reference path="../common.js" />
/// <reference path="problib.js" />
/// <reference path="../TabSet/gzy.tabset.v3.js" />
/// <reference path="teacher.js" />
/// <reference path="../PopWindow/gzy.popup.js" />
/// <reference path="../probEditor.js" />
/// <reference path="../jquery.ui.effect-transfer.js" />


$.readyH(function (h, x) {
    /// <param name="h" type="HashManager"></param>


    teacher.getMyInfo(init);

    function init(show) {
        if (!user.$(21)) $('ul.mtabs li:eq(0),div.mpanel:eq(0)').disable();
        if (!user.$(22)) $('ul.mtabs li:eq(1),div.mpanel:eq(1)').disable();
        if (!user.$(09)) $('ul.mtabs li:eq(2),div.mpanel:eq(2)').disable();
        if (!user.$(10)) $('ul.mtabs li:eq(3),div.mpanel:eq(3)').disable();
        if (!user.$(11)) $('ul.mtabs li:eq(4),div.mpanel:eq(4)').disable();

        if (show == null) {
            new gzy.tabset('ul.mtabs li:not(.disabled)', 'div.mpanel:not(.disabled)', {
                changed: function (c) {
                    h.set({ tab: c.index });
                    $('#probBasket').hide();
                    switch (c.tab.attr('xml:lang')) {
                        case 'prob':
                            $('#probBasket').show();
                            if (!c.init) {
                                c.init = initPanel_A(h, x, true);
                            } else {
                                c.init.form.submit();
                            }
                            break;
                        case 'paper':
                            if (!c.init) {
                                c.init = initPanel_B(h, x);
                            }
                            c.init.forms.eq(0).submit();
                            break;
                        case 'struc':
                            if (!c.init) {
                                c.init = initPanel_C(h, x);
                            } else {
                                c.init.show(0);
                            }
                            break;
                        case 'aduit':
                            if (!c.init) {
                                c.init = initPanel_D(h, x);
                            }
                        case 'count':
                            if (!c.init) {
                                c.init = initPanel_E(h, x);
                            } break;
                        case 'person':
                            $('#probBasket').show();
                            if (!c.init) {
                                c.init = initPanel_A(h, x, false);
                            } else {
                                c.init.form.submit();
                            }
                            break;
                    }
                },
                defaultTab: x.tab || 0,
                manual: function (c) {
                    h.clear();
                }
            })
        }
    }
});
function viewProblemContent(id) {
    loadScript(
        { id: 'viewProblemContent', src: '/scripts/viewProblemContent.js' },
        function () {
            showProblemContent(id);
        }
    );
};
var BasketProbs=new Array();
var basketBrief = '';
var basket = false;

var c = {};
var ckeditorUrl = '/scripts/ckeditor_v4.3.2/ckeditor.js';
function initPanel_A(h, x,shareLib) {
    /// <param name="h" type="HashManager"></param>
    /// <param name="x" type="HashMap"></param>
    /// <param name="shareLib" type="String">是否为共享题库</param>
    var form ;
    var treeContainer;
    // 加载参数选项
    var options,table, params, method, startIndex, hiddenElem, editorContainer, selectKey, deleteTitle,opeartionWidth;
    if (shareLib){
        treeContainer = 'trees';
        form = $('#problist_search');
        options = $('#type,#diff,#sk');
        table = '#problist';
        method = problem.getList;
        startIndex = 0;
        hiddenElem = $('#prob-slide,#prob-grid,#prob-editor');
        editorContainer = $('#editorContainer');
        selectKey = 'id';
        deleteTitle = '删除这道试题';
        opeartionWidth =100;
    }
    else{
        treeContainer = 'plib_tree';
        form = $('#plib_search');
        options = $('#plib_type,#plib_diff,#plib_sk,#plib_category');
        table = '#plib_problist';
        method = pLib.getList;
        startIndex = 1;
        hiddenElem = $('#plib_prob-slide,#plib_prob-grid,#plib_prob-editor');
        editorContainer = $('#plib_editorContainer');
        selectKey = 'personalProblemLibId';
        deleteTitle = '从个人题库中移除这道试题';
        opeartionWidth = 76;
    }
    var tree;
    var subjectSelector = $('#subject');
    subjectSelector.empty();
    subject.getAllSubjects(function (subjects) {
        $.each(subjects, function (i, item) {
            subjectSelector.append('<option id="' + item.Id + '">' + item.SubjectName + '</option>');
        });
        subjectSelector.change(function (selectedSubject) {
            var subjectId = subjectSelector.find('option:selected').attr('id');
            kpoint.getTree(subjectId, function (x) {
                $('#' + treeContainer).empty();
                tree = new gzy.tree({
                    items: x,
                    onselect: function (item) {
                        form.submit();
                    }
                }).renderTo('#' + treeContainer).expand(0).select(0);
            })
        });
        subjectSelector.change();

    });




    basketBrief = '';
    probType.getList(function (d) {
        $.each(d.data.rows, function (i, item) {
            options[0 + startIndex].options.add(new Option(item.name, item.id));
            basketBrief += '<tr><td width="100" class="typeName">' + item.name + '</td><td width="50" class="probNumCell"><label id="basket_probType_' + item.id + '" class="probNum">0</label>个</td><td width="43"><a href="javascript:;" id="clear_'+item.id+'" class="clearProb">清空</a></td></tr>';
        });
        basketBrief += '<tr><td colspan="3" style="text-align:center;" ><span style="text-align:center;width:100%;" class="search "><input id="generatepaper" style="padding:0;float:none;width:85px;cursor:pointer;" type="button" value="组卷" /></span></td></tr>';
        if (!basket) {
            BasketProbs = new Array();
            basketProbIds = new Array();
            basket = true;
            $('#basketDetail').html(basketBrief);
            $('#generatepaper').click(function () {
                var probIds = new Array();
                $.each(c, function (type, ids) {
                    if (ids.length > 0)
                        probIds.push(ids);
                });
                if (probIds.length==0)
                    alert('请至少选择一个试题加入至试题篮');
                else
                    $('<form action="/probsPreview.html" method="get" target="_blank"><input name="type" value="3"/><input name="probIds" value="' + probIds.toString() + '"/></form>').appendTo('body').submit().remove();
            });
            $('.clearProb').click(function () {
                var typeId = parseInt(this.id.split('_')[1]);
                c[typeId] = [];
                refresh();
                grid.load();

            });
        }
        options[0 + startIndex].value = x.type || -1;
        options[1 + startIndex].value = x.diff || 0;
        options[2 + startIndex].value = x.sk || '';
        if (!shareLib)
            options[0].value = x.category || -1;
    });

    function refresh() {
        var labels = $('#probBasket label').text('0');
        basketProbIds = new Array();
        $.each(c, function (type, ids) {
            $('#basket_probType_' + type).text(ids.length);
            basketProbIds.push(ids);
        });
        var all = [];
        for (var type in c) all = all.concat(c[type]);
        $('#basketProbsCount').html(all.length);
    };

    options.change(function () {
        form.submit();
        this.blur();
    });

    if (shareLib && !user.$(1)) $('#prob-multi-delete').disable();
    if (!user.$(3)) $('#createProb').disable();
    if (!user.$(4)) $('#probs-import').disable();

    // 生成表格
    var grid = new DataGrid({
        columns: [{ text: '题面内容预览' }, { text: '题型', width: 80 }, { text: '难度', width: 30 }, { text: shareLib ? '' : '分类', width: shareLib ? 0 : 70 }, { text: '操作', width: opeartionWidth }],
        selectKey: selectKey,
        table: table,
        cells: [
            new DataGrid.Button({
                text: '{content}',
                click: function (e) {
                    viewProblemContent(e.data.id);
                }
            }),
            '{type}',
            '{difficulty}',
            new DataGrid.Label({
                text: '{categoryName}',
                visible: !shareLib
            }),
            [
                new DataGrid.Button({
                    text: function (data) {
                        var imgName, cursor,title;
                        if ($.inArray(data.id, c[data.typeId]) > -1) {
                            imgName = 'basket_add_gray.png';
                            cursor = 'cursor:pointer;';
                            title = '从试题篮中删除该试题';
                        }
                        else {
                            imgName = 'basket_add.png';
                            cursor = 'cursor:pointer;';
                            title = '添加试题至试题篮';
                        }
                        return '<img src="/images/' + imgName + '" style="'+cursor+'" title="'+title+'" />';
                    },
                    click: function (e) {
                        if (c[e.data.typeId]) {
                          
                            var xi = $.inArray(e.data.id, c[e.data.typeId]);
                            if (xi == -1) {
                                c[e.data.typeId].push(e.data.id);
                                e.src.html('<img src="/images/basket_add_gray.png" style="cursor:pointer;" title="从试题篮中删除该试题" />');
                            } else {
                                c[e.data.typeId].splice(xi, 1);
                                e.src.html('<img src="/images/basket_add.png" style="cursor:pointer;" title="添加试题至试题篮" />');
                            }
                        }
                        else {
                            c[e.data.typeId] = [e.data.id];
                            e.src.html('<img src="/images/basket_add_gray.png" style="cursor:pointer;" title="从试题篮中删除该试题" />');
                        }
                        refresh();
                    }
                }),
                new DataGrid.Button({
                    disabled: !user.$(5),
                    text:function(data){
                            return '';
                    },
                    click: function (e) {
                        if (!e.data.hasBeenAddedToLib) {
                            pLib.add2Lib(e.data.id, 1, function (d) {
                                if (d.ok) {
                                    e.src.html('<img id="favorite_' + e.data.id + '" src="/images/favorite_gray.png" style="cursor:default;" title="该题已经被添加至收藏" />');
                                    e.data.hasBeenAddedToLib = true;
                                }
                                else
                                    alert('添加失败\n原因：' + d.msg);
                            });
                        }
                    }
                }),
                new DataGrid.Button({
                    disabled: function () {
                        return !(this.creator == user.id || user.$(2));
                    },
                    text: function (data) {
                        var enable = data.creator == user.id || user.$(2);
                        return String.$('<img src="/images/' + (!enable ? 'cannt_' : '') + 'edit.png" title="' + (!enable ? '' : '修改试题') + '" />');
                    },
                    click: function (e) {
                        var c = true;
                        hiddenElem.toggle(0, function () {
                            if (c && !(c = !c)) {
                                loadScript(
                                    { id: 'ckeditor', src: ckeditorUrl },
                                    function () {
                                        initEditor(false, false, e.data.id, editorContainer);
                                    }
                                );
                            }
                        });
                    }
                }),
                new DataGrid.Button({
                    disabled: function (a, b, c) {
                        return (shareLib && !user.$(1)) && user.id !== this.creator;
                    },
                    text: function (source, me) {
                        var disabled = this.disabled.call(source);
                        return '<img src="/images/' + (disabled ? 'cannt_del' : 'del') + '.png" title="'+(disabled?'':'删除试题')+'"/>';
                    },
                    click: function (e) {
                        var note;
                        var fun;
                        var id;
                        if (shareLib) {
                            note = '确定删除这道试题?';
                            fun = problem.remove;
                            id = e.data.id;
                        }
                        else {
                            note = '确定要从个人题库中移除该试题？';
                            fun = pLib.remove;
                            id = e.data.personalProblemLibId;
                        }
                        uic.confirm(note, function () {
                            fun([id], function (d) {
                                if (d.ok) grid.deleteRow(e.row);
                                else
                                    alert(d.msg);
                            });
                        }, e.src.rect(), 150, 'dqc');
                    }
                }),
            ],
        ],
        params: { pagesize: 15 },
        source: method,
        pagerMsg: '共有试题 {total} 道'//，当前显示第 {start}-{end} 道
    });

    function initEditor(isCreate, isPaper, probid, container) {
        ///<summary>初始化试题编辑</summary>
        ///<param name="isCreate" type="bool">是否为创建模式</param>
        ///<param name="isPaper" type="bool">当前修改的对象是否为试卷</param>
        ///<param name="probid" type="int">试题编号（新建试题不需要填该值）</param>
        ///<param name="container" >用于呈现编辑界面的容器</param>
        if (!isPaper) {//普通试题
            if (!isCreate) {//修改
                problem.getProblemWithStyle(probid, function (prob) {
                    if (prob.ok) {
                        var probs = [prob.data];
                        showEditor(probs, '试 题 编 辑', container, function () {
                            var c = true;
                            hiddenElem.toggle(0, function () {
                                if (c && !(c = !c)) {
                                    grid.load();
                                }
                            });
                        });
                    }
                });
            }
            else {//创建试题
                showEditor(null, '新 建 试 题', container, function () {
                    var c = true;
                    $('#prob-slide,#prob-grid,#prob-editor').toggle(0, function () {
                        if (c && !(c = !c)) {
                            grid.load();
                        }
                    });
                });
            }
        }

    };
    if (shareLib) {
        $('#createProb').click(function () {
            var c = true;
            $('#prob-slide,#prob-grid,#prob-editor').toggle(0, function () {
                if (c && !(c = !c)) {
                    loadScript(
                        { id: 'ckeditor', src: ckeditorUrl },
                        function () {
                            initEditor(true, false, null, $('#editorContainer'));
                        }
                    );
                }
            });
            return false;
        });


        $('#prob-multi-delete').click(function () {
            if (grid.selectedValues.length <= 0) return alert('没有选择要删除的项');
            confirm('确定删除选中的' + grid.selectedValues.length + '道试题？') &&
            problem.remove(grid.selectedValues, function (d) {
                d.ok ? grid.deleteRow(grid.selectedRows, function () {
                    grid.load();
                }) : (d.msg && alert(d.msg));
            });
        });


        $('#checkDuplication').click(function () {
            alert('未检测到重复试题');//
        });


        $('#probs-import').click(function () {
            $('<form action="/probsPreview.html" method="get" target="_blank"><input name="type" value="1"/></form>').appendTo('body').submit().remove();
        });


    }
    else {
        $('#plib-prob-multi-delete').click(function () {
            if (grid.selectedValues.length <= 0) return alert('没有选择要移除的项');
            confirm('确定移除选中的' + grid.selectedValues.length + '道试题？') &&
            pLib.remove(grid.selectedValues, function (d) {
                d.ok ? grid.deleteRow(grid.selectedRows, function () {
                    grid.load();
                }) : (d.msg && alert(d.msg));
            });
        });
    }

    
    // 注册加载列表的事件
    form.submit(function () {
        grid.load(form.getValues({ kpid: tree.selectedItem.id, pageindex: 1 }));
    });

    return {
        tree: tree,
        form: form,
        grid: grid
    };
};
function initPanel_B(h, x) {
    if (!user.$(6)) $('#paper-import').disable();

    var grid = new DataGrid({
        columns: [{ text: '套卷编号', width: 60 }, { text: '套卷标题' }, { text: '创建时间', width: 120 }, { text: '出题人', width: 80 }, { text: '操作', width: 80}],
        table: '#paperlist',
        cells: ['{id}', new DataGrid.Button({
            text: '{name}',
            click: function (e) {
                ShowPaperInfo(e.data.id);
            }
        }), '{create}', '{author}', [
            new DataGrid.Button({
                disabled: !user.$(8),
                text: '修改',
                click: function (e) {
                    var form = new DataForm({
                        items: [{ label: '套卷标题', key: 'papername'}],
                        submit: '提交',
                        onsubmit: function () {
                            paper.update({
                                __type: 'GZY.Exam.Model.Entity.Paper',
                                Id: e.data.id,
                                PaperName: this.get('papername')
                            }, function (d) {
                                if (d.ok) {
                                    win.close();
                                    grid.load();
                                } else {
                                    alert(d.msg);
                                }
                            });
                        }
                    });
                    
                    var win = new gzy.popup('编辑套卷信息', 500, 350, {
                        element: form.form,
                        onload: function () {
                            paper.getPaper(e.data.id, function (d) {
                                form.set('papername', d.PaperName);
                            });
                        }
                    });
                }
            }),
            new DataGrid.Button({
                disabled: !user.$(7),
                text: '删除',
                click: function (e) {
                    uic.confirm('确定删除试卷"' + e.data.name + '"?', function () {
                        paper.remove([e.data.id], function (data) {
                            if (data.ok)
                                grid.deleteRow(e.row);
                            else
                                alert(data.msg);
                        });
                        
                    }, e.src.rect(), 200, 'dpc');
                }
            })
        ]],
        source: paper.getList,
        params: { pagesize: 15 }
    });
    
    var form = $('#paperlist_search').submit(function () {
        grid.load(form.getValues({ pageindex: 1 }));
    });

    var pt = $('#pt').focus(function () {
        WdatePicker({ maxDate: pe.val() || 'today' });
    }), pe = $('#pe').focus(function () {
        WdatePicker({ minDate: pt.val(), maxDate: 'today' });
    });

    $('#paper-import').click(function () {
        $('<form action="/probsPreview.html" method="get" target="_blank"><input name="type" value="2"/></form>').appendTo('body').submit().remove();
    });

    return {
        forms: form
    };
};
function initPanel_C(h, x) {
    var tree;
    return new gzy.tabset('div.dict .leftpanel p a', 'div.dict .centerpanel div.spanel', {
        changed: function (c) {
            h.set({ stab: c.index, sid: null });

            switch (c.index) {
                case 0:
                    if (!c.init) {
                        c.init = true;
                        (function () {
                            var grid = new DataGrid({
                                table: '#typelist',
                                columns: ['题型名称', '基本题型', '判分类型', { text: '操作', width: 100}],
                                cells: ['{name}', '{isBasic}' ? '是' : '否', '{judgeTypeName}', [
                                    new DataGrid.Button({
                                        text: '修改',
                                        disabled: '{isBasic}',
                                        click: function (e) {
                                            var form = new DataForm({
                                                items: [
                                                    { label: '题型名称', key: 'name' },
                                                //{ label: '基本题型', key: 'inputtype', type: 'select', source: probType.getList, field: ['InputType', 'Name'] },
                                                    {label: '判分类型', key: 'judgeType', type: 'radiogroup', options: [[1, '自动判分'], [2, '人工判分']] }
                                                ]
                                            });
                                            var win = new gzy.popup('编辑题型', 400, 200, {
                                                element: form.form,
                                                onload: function () {
                                                    form.set('name', e.data.name);
                                                    //form.set('inputtype', e.data.InputType);
                                                    form.set('judgeType', e.data.judgeType);
                                                },
                                                buttons: [{
                                                    text: '确定',
                                                    click: function () {
                                                        probType.update({
                                                            id: e.data.id,
                                                            name: form.get('name'),
                                                            judgeType: parseInt(form.get('judgeType'))
                                                        }, function (d) {
                                                            if (d.ok) grid.load();
                                                            else alert(d.msg);
                                                        });
                                                    }
                                                }]
                                            });
                                        }
                                    }),
                                    new DataGrid.Button({
                                        text: '删除',
                                        disabled: '{isBasic}',
                                        click: function (e) {
                                            uic.confirm('确定删除题型"' + e.data.name + '"?', function () {
                                                grid.deleteRow(e.row);
                                            }, e.src.rect(), 200, 'dtpc');
                                        }
                                    })
                                ]]
                            });

                            probType.getList({}, grid);
                        })();
                    }
                    break;
                case 1:
                    if (!c.init) {
                        c.init = true;
                        (function () {

                            var tree;


                            var subjectSelector = $('#subject_kp');
                            subjectSelector.empty();
                            subject.getAllSubjects(function (subjects) {
                                $.each(subjects, function (i, item) {
                                    subjectSelector.append('<option value="' + item.Id + '">' + item.SubjectName + '</option>');
                                });
                                subjectSelector.change(function (selectedSubject) {
                                    var subjectId = subjectSelector.val();
                                    kpoint.getTree(subjectId, function (x) {
                                        x.extra = x.code;
                                        (function (items) {
                                            for (var i = 0, t; t = items[i++];) {
                                                t.extra ='';
                                                if (t.items && t.items.length) arguments.callee(t.items);
                                            }
                                        })(x.items);
                                        $('#tree_mgr').empty();
                                        $('#mod_nodename,#del_treenode').attr('disabled', true);
                                        tree = new gzy.tree({
                                            items: x,
                                            onselect: function (item) {
                                                $('#mod_nodename,#del_treenode').attr('disabled', item.id <= 0);
                                            }
                                        }).renderTo('#tree_mgr').expand(0).select(0);
                                    })
                                });
                                subjectSelector.change();

                            });
                            $('#get_tree').click(function () {
                                document.getElementById('iframe-upload').src = 'problib_getkptree.ashx';
                            });

                            $('#mod_nodename').click(function () {
                                var form = new DataForm({
                                    items: [
                                        { type: 'label', label: '当前节点', text: tree.selectedPathText.join('/') },
                                        { label: '新名称', key: 'kpname', length: 20, type: 'textarea' },
                                        { label: '知识点编码', key: 'kpcode', length: 10 }
                                    ]
                                });
                                var win = new gzy.popup('编辑知识点', 400, 250, {
                                    element: form.form,
                                    onload: function () {
                                        form.set('kpname', tree.selectedItem.text.split('(')[0]);
                                        form.set('kpcode', tree.selectedItem.code);
                                    },
                                    buttons: [{
                                        text: '提交', click: function () {
                                            var text = $.trim(form.get('kpname')), code = $.trim(form.get('kpcode'));
                                            if (!text) return alert('知识点的新名称不能为空');
                                            if (!code) return alert('知识点编码不能为空');
                                            if (form.changed()) {
                                                kpoint.update({
                                                    Id: tree.selectedItem.id,
                                                    KPName: text,
                                                    KPCode: code
                                                    
                                                }, function (d) {
                                                    if (d.ok) {
                                                        tree.selectedItem.el.find('>label').text(tree.selectedItem.text = text);
                                                        var n = tree.findId(d.data);
                                                        n.el.find('i').text('(' + (n.extra = n.code = code) + ')');
                                                        win.close();
                                                    } else alert(d.msg);
                                                });
                                            }
                                        }
                                    }]
                                });
                            });
                            $('#add_subnode').click(function () {
                                var form = new DataForm({
                                    items: [
                                        { type: 'label', label: '父节点', text: tree.selectedPathText.join('/') },
                                        { label: '新知识点', key: 'kpname' ,length:20,type:'textarea'},
                                        { label: '知识点编码', key: 'kpcode' ,length:10}
                                    ]
                                });
                                var win = new gzy.popup('添加子知识点', 400, 250, {
                                    element: form.form,
                                    buttons: [{
                                        text: '提交', click: function () {
                                            var text = $.trim(form.get('kpname')), code = $.trim(form.get('kpcode'));
                                            if (!text) return alert('新知识点名称不能为空');
                                            if (!code) return alert('知识点编码不能为空');
                                            if (form.changed()) {
                                                kpoint.update({
                                                    Id: 0,
                                                    KPName: text,
                                                    KPCode: code,
                                                    ParentKPID: tree.selectedItem.id < 0 ? 0 : tree.selectedItem.id,
                                                    State: 'Normal',
                                                    SubjectID: parseInt($('#subject_kp').val())
                                                }, function (d) {
                                                    if (d.ok) {
                                                        tree.insert(tree.selectedItem, { text: text, id: d.data, code: code, extra: '(' + code + ')' });
                                                        win.close();
                                                    } else alert(d.msg);
                                                });
                                            }
                                        }
                                    }]
                                });
                            });
                            $('#del_treenode').click(function () {
                                uic.confirm('确定删除知识点“' + tree.selectedItem.text + '”？', function () {
                                    kpoint.remove(tree.selectedItem.id, function (d) {
                                        if (d.ok) {
                                            tree.remove(tree.selectedItem);
                                        } else alert(d.msg);
                                    });
                                }, $(this).rect(), 200);
                            });
                        })();
                    }
                    break;
                case 2:
                    if (!c.init) {
                        c.init = true;
                        (function () {
                            var grid = new DataGrid({
                                table: '#extendTypesList',
                                columns: ['类型名称', '说明', { text: '操作', width: 100}],
                                cells: ['{ExtendPropertyName}', '{Description}', [
                                    new DataGrid.Button({
                                        text: '修改',
                                        click: function (e) {
                                            showEdit(false, e.data.Id);
                                        }
                                    }),
                                    new DataGrid.Button({
                                        text: '删除',
                                        click: function (e) {
                                            uic.confirm('确定删除扩展属性"' + e.data.ExtendPropertyName + '"?', function () {
                                                extendType.del(e.data.Id, function (d) {
                                                    if (d.ok)
                                                        grid.deleteRow(e.row);
                                                    else
                                                        alert(d.msg);
                                                });
                                            }, e.src.rect(), 200, 'dtpc');
                                        }
                                    })
                                ]],
                                source: extendType.getAllExtendTypes,
                                params: { pageindex: 1, pagesize: 15 }
                            });
                            grid.load();
                            $('#add_extendtype').click(function () {
                                showEdit(true);
                            });
                            showEdit = function (isCreate, id) {
                                var form = new DataForm({
                                    items: [
                                        { label: '扩展属性名称', key: 'name' },
                                        { label: '属性说明', key: 'description' }
                                    ]
                                });
                                var createExtendTypWin = new gzy.popup('创建试题扩展属性类型', 360, 120, {
                                    element: form.form,
                                    buttons: [{
                                        text: '确定', click: function () {
                                            var name = form.get('name');
                                            if (name.toString().replace(/ /g, '') == '') {
                                                alert('属性名称不能为空');
                                                return;
                                            }
                                            var fun, params;
                                            if (isCreate) {
                                                fun = extendType.create;
                                                params = { name: form.get('name'), description: form.get('description') };
                                            }
                                            else {
                                                fun = extendType.update;
                                                params = { id: id, name: form.get('name'), description: form.get('description') };
                                            }
                                            fun(params, function (data) {
                                                if (!data.ok)
                                                    alert(data.msg);
                                                else {
                                                    createExtendTypWin.close();
                                                    grid.load();
                                                }
                                            });
                                        }
                                    }]
                                });
                            };
                        })();
                    }
                    break;
                case 3:
                    if (!c.init) {
                        c.init = true;
                        (function () {
                            var grid = new DataGrid({
                                table: '#liblist',
                                columns: [{ text: '题库编号', width: 160 }, '题库名称', { text: '试题数', width: 100 }, { text: '操作', width: 100}],
                                cells: []
                            });

                            $('#add_lib').click(function () {
                                alert('暂时未提供功能');
                            });
                        })();
                    }
                    break;
            }
        },
        defaultTab: x.stab || 0
    });
};
function initPanel_D(h, x) {
    var ap_form, ae_form;
    return new gzy.tabset('div.audit .leftpanel p a', 'div.audit .centerpanel div.spanel', {
        changed: function (c) {
            h.set({ stab: c.index });
            switch (c.index) {
                case 0:
                    if (!c.init) {
                        c.init = true;
                        ap_form = $('#ap_form');
                        var grid = new DataGrid({
                            table: '#unauditproblist',
                            selectKey: 'id',
                            columns: ['题面内容', { text: '题型', width: 60 }, { text: '出题人', width: 110 }, { text: '操作', width: 60 }],
                            cells: [new DataGrid.Button({
                                text: '{content}',
                                click: function (e) { viewProblemContent(e.data.id, true) }
                            }), '{type}', '{author}', new DataGrid.Button({
                                text: '编辑',
                                click: function (e) {
                                    var c = true;
                                    $('#audit-slide,#audit-grid,#audit-editor').toggle(0, function () {
                                        if (c && !(c = !c)) {
                                            loadScript(
                                                { id: 'ckeditor', src: ckeditorUrl },
                                                function () {
                                                    problem.getProblemWithStyle(e.data.id, function (prob) {
                                                        if (prob.ok) {
                                                            var probs = [prob.data];
                                                            showEditor(probs, '试 题 编 辑', $('#auditEditorContainer'), function (arg) {
                                                                var c = true;
                                                                $('#audit-slide,#audit-grid,#audit-editor').toggle(0, function () {
                                                                    if (c && !(c = !c)) {
                                                                        if (arg === true) problem.audit([e.data.id], true, function (d) {
                                                                            if (d.ok)
                                                                                grid.load();
                                                                            else
                                                                                alert(d.msg);
                                                                        });
                                                                        else grid.load();
                                                                    }
                                                                });
                                                            });
                                                        }
                                                    });
                                                }
                                            );
                                        }
                                    });
                                }
                            })],
                            source: problem.getListByState,
                            params: { pagesize: 15 }
                        });
                        ap_form.submit(function () {
                            grid.load(ap_form.getValues({ pageindex: 1 }));
                        });
                        ap_form.find('select').change(function () {
                            ap_form.submit();
                        });
                        var for_all = $('#for_all');
                        $('#ap_ok').click(function () {
                            if (for_all.attr('checked')) {
                                if (!confirm('确定审核通过所有试题？')) return false;
                                problem.auditAllProbs(true, function () {
                                    grid.load();
                                });
                            }
                            problem.audit(grid.selectedValues, true, function (d) {
                                if (d.ok)
                                    grid.deleteRow(true, function () {
                                        grid.load();
                                    }, 'greate');
                                else
                                    alert(d.msg);
                            });
                        });
                        $('#ap_refu').click(function () {
                            problem.audit(grid.selectedValues, false, function (d) {
                                if (d.ok)
                                    grid.deleteRow(true, function () {
                                        grid.load();
                                    });
                                else
                                    alert(d.msg);
                            });
                        });
                        $('#ap_del').click(function () {
                            if (!grid.selectedValues.length)
                                return alert('没有选择要删除的项');
                            confirm('确定删除选中的试题？') && problem.remove(grid.selectedValues, function (d) {
                                if (d.ok)
                                    grid.deleteRow(true, function () {
                                        grid.load();
                                    });
                                else
                                    alert(d.msg);
                            });
                        });
                    }
                    ap_form.submit();
                    break;
                case 1:
                    if (!c.init) {
                        c.init = true;
                        ae_form = $('#ae_form');
                        var grid_paper = new DataGrid({
                            table: '#unaudit_paper_list',
                            selectKey: 'id',
                            columns: ['套卷标题', { text: '出题人', width: 150 }, { text: '出题时间', width: 100 }],
                            cells: [new DataGrid.Button({
                                text: '{name}',
                                click: function (e) {
                                    ShowPaperInfo(e.data.id);
                                }
                            }), '{author}', '{time}'],
                            source: paper.getUnAuditList,
                            params: { pagesize: 15 }
                        });
                        ae_form.submit(function () {
                            grid_paper.load(ae_form.getValues({ pageindex: 1 }));
                        });
                        $('#ae_refu,#ae_ok').click(function () {
                            paper.audit(grid_paper.selectedValues, this.id == 'ae_ok', function (d) {
                                if (d.ok)
                                    grid_paper.load();
                                else
                                    alert(d.msg);
                            });
                        });
                        $('#ae_del').click(function () {
                            if (!grid_paper.selectedValues.length)
                                return alert('没有选择要删除的项');
                            confirm('确定删除选中的套卷？') && paper.remove(grid_paper.selectedValues, function (d) {
                                if (d.ok)
                                    grid_paper.load();
                                else
                                    alert(d.msg);
                            });
                        });
                    }
                    ae_form.submit();
                    break;
            }
        },
        defaultTab: x.stab || 0
    });
};
function initPanel_E(h, x) {
    var grid_counter = new DataGrid({
        table: '#grid_counter',
        columns: ['项', { text: '值', width: 100 }, { text: '百分比', width: 300 }],
        cells: ['{name}', '{value}', '{percent}%'],
        source: problem.getCounter
    });

    return new gzy.tabset('div.counter .leftpanel p a', null, {
        changed: function (c) {
            h.set({ stab: c.index });
            grid_counter.load({ type: c.tab.attr('href').split('\/\/')[1] });
        }
    });
};