/// <reference path="lib/problib.js" />

function ProblemBrowser(title) {
    var width = 800, height = 430;
    var me = this, win = new gzy.popup(title, width, height, {
        html: '<table border="0" cellpadding="0" cellspacing="0"><tr><td rowspan="2">\
            <div id="browser_tree" style="width:179px;border-right:1px solid lavender;height:' + (height - 12) + 'px;padding:6px;overflow:auto;"></div>\
            </td><td>\
            <div style="height:35px;border-bottom:1px solid lavender"><form method="post" action="javascript:;" id="browser_form" style="padding:8px 8px 0 8px;margin:0;border:0"><table width="100%" border="0" cellpadding="0" cellspacing="0"><tr><td align="left">\
                <select id="browser_form_type" onchange="$(\'#browser_form\').submit()"><option value="">题型...</option></select>\
                <select id="browser_form_difficulty" onchange="$(\'#browser_form\').submit()"><option value="">所有难度...</option><option value="Hard">难题</option><option value="General">中等题</option><option value="Easy">容易题</option></select>\
            </td><td align="right">\
                <select style="display:none" id="browser_form_sorter" onchange="$(\'#browser_form\').submit()"><option value="">排序...</option></select>\
            </td></tr></table></form></div>\
            </td></tr><tr><td>\
            <div id="browser_list" style="height:' + (height - 36) + 'px;overflow-y:auto"><table border="0" cellpadding="0" cellspacing="0" id="problist" class="list" style="width:600px;">\
            </table></div>\
            </td></tr></table>',
        overflow: 'hidden'
    });
    me.close = function () {
        win.close();
    }

    me.show = function () {

        var browser_form_type = $('#browser_form_type'),
            browser_form_difficulty = $('#browser_form_difficulty');

        probType.getList(function (d) {
            $.each(d.data.rows, function (i, item) {
                browser_form_type[0].options.add(new Option(item.name, item.id));
            });
            browser_form_type.val(me.type).attr('disabled', !isNaN(me.type));
        });
        browser_form_difficulty.val(me.difficulty).attr('disabled', !!me.difficulty);

        var tree, browser_form = $('#browser_form');

        kpoint.getTree(2, function (x) {
            tree = new gzy.tree({
                items: x,
                onselect: function (item) {
                    browser_form.submit();
                }
            }).renderTo('#browser_tree').expand(0).select(0);
        })



        var grid = new DataGrid({
            columns: [/*{ text: '题号', width:50 }, */{ text: '题面内容' }, { text: '题型', width: 50 }, { text: '难度', width: 40 }, { text: '操作', width: 40 }],
            table: '#problist',
            cells: [
                /*'{id}',*/
                new DataGrid.Button({
                    text: '{content}',
                    click: function (e) {
                        var win = new gzy.popup('查看试题内容', 600, 450, {
                            onload: function () {
                                problem.getProblem(e.data.id, function (d) {
                                    win.body.append('<h4 style="padding:10px;background:#efefef">题面内容：</h4>');
                                    win.body.append('<div style="margin:10px">' + d.data.content + '</div>');
                                    win.body.append('<h4 style="padding:10px;background:#efefef">标准答案：</h4>');
                                    win.body.append('<div style="margin:10px">' + d.data.answer + '</div>');
                                    win.body.append('<h4 style="padding:10px;background:#efefef">所属知识点：</h4>');
                                    win.body.append('<div style="margin:10px">' + d.data.kfullpath + '</div>');
                                    win.body.append('<h4 style="padding:10px;background:#efefef">出题人：</h4>');
                                    win.body.append('<div style="margin:10px">' + d.data.author + '</div>');
                                });
                            }
                        });
                    }
                }),
                '{type}', '{difficulty}',
                new DataGrid.Button({
                    text: '选定',
                    click: function (e) {
                        if (me.onselect(e.data) !== false)
                            win.close();
                    }
                })
            ],
            pageSize: 10,
            source: problem.getList,
            params: {}
        });

        browser_form.submit(function () {
            grid.load({
                kpid: tree.selectedItem.id,
                type: browser_form_type.intVal(),
                diff: { "": 0, Easy: 3, General: 2, Hard: 1 }[browser_form_difficulty.val()],
                pagesize: grid.pageSize,
                pageindex: 1,
                sk: ""
            });
        });
    };
};
ProblemBrowser.prototype = { kp: null, type: null, difficulty: null, pid: null, onselect: function () { }, multi: false };

