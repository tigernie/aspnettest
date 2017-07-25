/// <reference path="../userplat.js" />

classstu = {
    initialize: function (args) {       
        var classId = args.classId;
        var isHidden = !args.canOperate;
        var proxy = Ext.create('Ext.data.WebServiceProxy', {
            url: service.getContainHistoryStudent,
            reader: {
                type: 'json',
                idProperty: 'id',
                totalProperty: 'd.count',
                root: 'd.data.rows'
            },
            extraParams: { f_stu: {}, ClassID: classId }
        });
        var fields = ['Id', 'PersonNumber', 'RealName', 'Gender', 'ChangeFlag'];

        var store = Ext.create('Ext.data.Store', {
            fields: fields,
            autoDestroy: true,
            proxy: proxy, remoteSort: true, autoLoad: true,
            sorters: [{ property: 'id', direction: 'DESC'}],
            listeners: {
                load: function (store, records, successful, eOpts) {
                    if (store.currentPage > 1 && records.length == 0) store.loadPage(store.currentPage - 1);
                }
            }
        });
        var columns = [
            { text: "学号", width: 150, dataIndex: 'PersonNumber' },
            { text: "姓名", width: 150, dataIndex: 'RealName' },
            { text: "性别", width: 80, dataIndex: 'Gender', renderer: function (v) {
                return userplat.stores.get(userplat.dict.userGender, v)
            }
            },
            { text: "异动情况", width: 120, dataIndex: 'ChangeFlag', renderer: function (v) {
                var changeName = "";
                switch (v) {
                    case 1: changeName = "正常"; break;
                    case 2: changeName = "毕业"; break;
                    case 3: changeName = "开除"; break;
                    case 4: changeName = "退学"; break;
                    case 5: changeName = "离校"; break;
                    case 6: changeName = "复学"; break;
                    case 7: changeName = "肄业"; break;
                    case 8: changeName = "其他异动"; break;
                }
                return changeName;
            }
            }
        ];

        var btn_set_role = [];
        var grid = new Ext.grid.Panel({
            title: args.text,
            margins: '5 5 5 0',
            region: 'center',
            emptyText: '没有符合条件的记录',
            viewConfig: {
                loadingText: '正在加载用户列表...'
            },
            store: store,
            selModel: new Ext.selection.CheckboxModel(),
            columns: columns,
            tbar: new Ext.toolbar.Toolbar({
                layout: {
                    overflowHandler: 'Menu'
                },
                items: [{
                    xtype: 'buttongroup',
                    hidden: isHidden,
                    items: [{
                        text: '从考生基本信息库加人',
                        iconCls: 'add',
                        handler: function (me, e) { classstu.addFromStuLib.call(me, me, e, grid.getSelectionModel(), grid, classId); }
                    }, {
                        text: '从历史班加人',
                        iconCls: 'add',
                        handler: function (me, e) { classstu.addFromHistoryClass.call(me, me, e, grid.getSelectionModel(), grid, classId); }
                    }, {
                        text: '删除考生',
                        iconCls: 'delete',
                        handler: function (me, e) { classstu.remove.call(null, me, e, grid.getSelectionModel(), grid, classId) },
                        disabled: true,
                        id: 'btn_delete_user'
                    }].concat(btn_set_role)
                }, {
                    text: '异动',
                    hidden: isHidden,
                    iconCls: 'import',
                    handler: function (me, e) { classstu.changeFlag.call(null, me, e, grid.getSelectionModel(), grid); }

                }, '->', {
                    text: '返回',
                    iconCls: 'back',
                    handler: function () { userplat.initialize("classmanage", "班级管理"); }
                }]

            }),
            bbar: new Ext.PagingToolbar(userplat.getPagerConfig(store)),
            listeners: {
                itemdblclick: function (grid, row, e) {
                    classstu.add.call(grid.all.elements[e.rowIndex - 1].childNodes[1], row.data);
                },
                selectionchange: function (model, selected) {
                    Ext.getCmp('btn_delete_user').setDisabled(!selected.length).setText(selected.length ? ('删除选中的<b>' + selected.length + '</b>个考生') : '删除考生');

                }
            }
        });
        return grid;

        function action(grid, td, rowIndex, columnIndex, event, modal, tr) {
            if (event.target.tagName === 'A') {
                switch (event.target.className) {
                    case 'transOut': classstu.transOut(event.target, modal.data); break;
                    case 'setAdmin': student.setAdmin(event.target, modal.data); break;
                }
            }
        }
    },
    addFromStuLib: function (btn, e, modal, grid, classId) {
        var required = userplat.required, me = this;
        var title = '考生基本信息库考生列表';

        var store1, stuLibGrid = Ext.create('Ext.grid.Panel', {
            margins: '0',
            emptyText: '没有符合条件的记录',
            viewConfig: {
                loadingText: '正在加载用户列表...'
            },
            store: store1 = Ext.create('Ext.data.Store', {
                fields: ['personNo', 'realname', 'gradeName', 'klassName', 'gender', 'changeFlag', 'klass', 'grade'],
                autoDestroy: true,
                proxy: Ext.create('Ext.data.WebServiceProxy', {
                    url: service.getStudentList,
                    reader: {
                        type: 'json',
                        idProperty: 'id',
                        totalProperty: 'd.count',
                        root: 'd.data.rows'
                    },
                    extraParams: { status: -1, query: '', klass: -1, changeflag: 1 }
                }),
                remoteSort: true, autoLoad: true,
                sorters: [{ property: 'id', direction: 'DESC'}],
                listeners: {
                    load: function (store, records, successful, eOpts) {
                        if (store.currentPage > 1 && records.length == 0) store.loadPage(store.currentPage - 1);
                    }
                }
            }),
            selModel: new Ext.selection.CheckboxModel(),
            columns: [{ text: "学号", dataIndex: 'personNo' },
                      { text: "姓名", dataIndex: 'realname' },
                      { text: "当前年所在年级", dataIndex: 'gradeName' },
                      { text: "当前年所在班", dataIndex: 'klassName' },
                      { text: "性别", dataIndex: 'gender', renderer: function (v) {
                          return userplat.stores.get(userplat.dict.userGender, v)
                      }
                      },
                      { text: "异动情况", dataIndex: 'changeFlag'}],
            tbar: new Ext.toolbar.Toolbar({
                items: ['->', {
                    xtype: 'searchfield',
                    width: 150,
                    emptyText: '按用户名/姓名查找',
                    store: store1,
                    paramName: 'query'
                }]
            }),
            bbar: new Ext.PagingToolbar(userplat.getPagerConfig(store1))
        });

        var form, win = userplat.openWindow(title, 650, 400, [form = Ext.create('Ext.form.Panel', {
            layout: "fit",
            bodyPadding: 5,
            items: [stuLibGrid],
            buttons: [{
                text: '添加',
                formBind: true,
                disabled: true,
                handler: function () {
                    if (stuLibGrid.getSelectionModel().getSelection().length == 0) { Ext.MessageBox.alert("提示", "请选择需要添加的考生"); return; }
                    userplat.serviceAjax(service.FetchStudentFromStudentInfoLib, {
                        CurrentClassID: classId,
                        StudentUserID: Ext.Array.map(stuLibGrid.getSelectionModel().getSelection(), function (x) { return x.data.id })
                    }, function (d) {
                        modal.store.load();
                        Ext.tips.show('提示', '操作成功');
                    }, masker.loading(grid));
                    win.close()
                }
            }, {
                text: '取消',
                handler: function () { win.close() }
            }]
        })], { layout: { type: 'fit', padding: 5 }, animateTarget: me });
    },

    addFromHistoryClass: function (btn, e, modal, grid, classId) {
        var required = userplat.required, me = this, msstore;
        var title = '历史班级列表';
        var store2, historyClassGrid = new Ext.grid.Panel({
            margins: '0',
            emptyText: '没有符合条件的记录',
            viewConfig: {
                loadingText: '正在加载用户列表...'
            },
            store: store2 = Ext.create('Ext.data.Store', {
                fields: ['name', 'gradeName', 'academicStartYear', 'grade', 'enabled', 'studentCount', 'CanReDividedCount'],
                autoDestroy: true,
                proxy: Ext.create('Ext.data.WebServiceProxy', {
                    url: service.getGradeAndClassList,
                    reader: {
                        type: 'json',
                        idProperty: 'id',
                        totalProperty: 'd.count',
                        root: 'd.data.rows'
                    },
                    extraParams: { AcademicStartYear: 0, AcademicYearRange: -2, GradeID: 0 }
                }),
                remoteSort: true, autoLoad: true,
                sorters: [{ property: 'id', direction: 'DESC'}],
                listeners: {
                    load: function (store, records, successful, eOpts) {
                        if (store.currentPage > 1 && records.length == 0) store.loadPage(store.currentPage - 1);
                    }
                }
            }),
            selModel: new Ext.selection.CheckboxModel(),
            columns: [{ text: "班级名称", dataIndex: 'name' },
                      { text: "所属年级", dataIndex: 'gradeName' },
                      { text: '所在学年', dataIndex: 'academicStartYear', renderer: function (v) { return v + '~' + (v + 1); } },
            //{ text: '状态', dataIndex: 'enabled', renderer: function (v) { if (v == false) return "启用"; else return "未启用"; } },
                      {text: '班级学生数', dataIndex: 'studentCount' },
                      { text: '可再分班的人数', dataIndex: 'CanReDividedCount' },
                      {
                          sortable: false, text: '操作', xtype: 'templatecolumn',
                          tpl: '<a href="javascript:;" class="viewStudent">查看考生</a>',
                          listeners: {
                              click: function (historyClassGrid, td, rowIndex, columnIndex, event, modal, tr) {
                                  if (event.target.tagName === 'A') {
                                      classstu[event.target.className].call(event.target, historyClassGrid.getSelectionModel());
                                  }
                              }
                          }
                      }],
            tbar: new Ext.toolbar.Toolbar({
                items: ['->', {
                    xtype: 'combobox',
                    hideLabel: false,
                    fieldLabel: '学年',
                    labelWidth: 36,
                    store: msstore = userplat.getStore(userplat.dict.gradePeriod),
                    displayField: 'text',
                    valueField: 'value',
                    name: 'gradePeriod',
                    id: 'gradePeriod',
                    emptyText: '选择学年...',
                    editable: false,
                    value: '',
                    width: 200,
                    triggerAction: 'all',
                    listeners: {
                        change: function (combo, newValue, oldValue) {
                            //Ext.getCmp('button_group').setDisabled(combo.valueModels[0].data.text.indexOf('√') == -1);   
                            if (combo.valueModels[0].data.text.indexOf('√') > 0) {
                                Ext.MessageBox.alert("提示", "请从历史班级中选择"); return;
                            }
                            store2.proxy.extraParams.AcademicStartYear = newValue;
                            store2.proxy.extraParams.AcademicYearRange = -4;
                            store2.loadPage(1);
                        },
                        boxready: function (box) {
                            msstore.load();
                        }
                    }
                }]
            }),
            bbar: new Ext.PagingToolbar(userplat.getPagerConfig(store2))
        });

        var form, win = userplat.openWindow(title, 650, 400, [form = Ext.create('Ext.form.Panel', {
            layout: "fit",
            bodyPadding: 5,
            items: historyClassGrid,
            buttons: [{
                text: '添加',
                formBind: true,
                disabled: true,
                handler: function () {
                    if (historyClassGrid.getSelectionModel().getSelection().length == 0) { Ext.MessageBox.alert("提示", "请选择历史班级"); return; }
                    if (historyClassGrid.getSelectionModel().getSelection().length > 1) { Ext.MessageBox.alert("提示", "一次只能选择一个历史班级"); return; }
                    if (historyClassGrid.getSelectionModel().getSelection()[0].data.CanReDividedCount == 0) { Ext.MessageBox.alert("提示", "该班级没有能够分配的学生数"); return; }
                    userplat.serviceAjax(service.FetchStudentFromClass, {
                        CurrentClassID: classId,
                        SourceClassID: historyClassGrid.getSelectionModel().getSelection()[0].data.id
                    }, function (d) {
                        modal.store.load();
                        Ext.tips.show('提示', '操作成功');
                    }, masker.loading(grid));
                    win.close()
                }
            }, {
                text: '取消',
                handler: function () { win.close() }
            }]
        })], { layout: { type: 'fit', padding: 5 }, animateTarget: me });
    },

    remove: function (btn, e, modal, grid, classId) {
        var selected = Ext.Array.map(modal.getSelection(), function (x) { return x.data.Id });
        Ext.MessageBox.show({
            animateTarget: btn,
            title: '操作确认', msg: '确定删除选中的 <b>' + selected.length + '</b> 行数据?',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn === 'ok') {
                    userplat.serviceAjax(service.DeleteStudentFromClass, {
                        CurrentClassID: classId,
                        StudentUserIDs: selected
                    }, function (d) {
                        modal.store.load();
                        Ext.tips.show('提示', '操作成功');
                    }, masker.deleting(grid));
                }
            }
        });
    },
    changeFlag: function (btn, e, modal, grid) {
        var selected = Ext.Array.map(modal.getSelection(), function (x) { return x.data.Id });
        if (selected.length == 0) {
            Ext.MessageBox.alert("提示", "请选择记录后再进行操作!");
            return;
        }
        if (selected.length > 1) {
            Ext.MessageBox.alert("提示", "每次只能操作一条记录!");
            return;
        }
        var radioForm = Ext.create('Ext.form.Panel', {
            bodyStyle: 'padding:0 0 0 0',
            style: "margin: 0 0 0 0 ",
            frame: true,
            items: [{
                xtype: 'radiogroup',
                id: 'radiogroup',
                layout: 'vbox',
                items: [{ boxLabel: '正常', name: 'changeFlag', inputValue: '1' },
                            { boxLabel: '毕业', name: 'changeFlag', inputValue: '2' },
                            { boxLabel: '开除', name: 'changeFlag', inputValue: '3' },
                            { boxLabel: '退学', name: 'changeFlag', inputValue: '4' },
                            { boxLabel: '离校', name: 'changeFlag', inputValue: '5' },
                            { boxLabel: '复学', name: 'changeFlag', inputValue: '6' },
                            { boxLabel: '肄业', name: 'changeFlag', inputValue: '7' },
                            { boxLabel: '其它异动', name: 'changeFlag', inputValue: '8' }
                ]
            }]
        });
        var items = Ext.getCmp("radiogroup").items.items;
        for (var k in items) {
            if (items[k].inputValue == modal.getSelection()[0].data.ChangeFlag) {
                items[k].setValue(true);
            }
        }
        var wdl = new Ext.Window({
            title: "学生异动 ",
            width: 200,
            height: 280, 						//是否渲染表单
            layout: 'fit',
            plain: true,
            modal: true,
            draggable: true,
            resizable: false,
            closable: false,
            bodyStyle: 'padding:5px;',
            buttonAlign: 'center',
            items: radioForm,
            buttons: [{
                text: '确定',
                handler: function () {
                    userplat.serviceAjax(service.ChangeStudentStatus, {
                        StudentUserID: selected[0], flag: Ext.getCmp("radiogroup").getValue().changeFlag
                    }, function (d) {
                        modal.store.load();
                        wdl.destroy();
                        Ext.tips.show('提示', '操作成功');
                    });
                }
            },
	        {
	            text: '取消',
	            handler: function () { wdl.destroy(); }
	        }]

        })
        wdl.show();
    },
    viewStudent: function (modal) {
        classId = modal.getSelection()[0].data.id;
        var proxy = Ext.create('Ext.data.WebServiceProxy', {
            url: service.getStudentList,
            reader: {
                type: 'json',
                idProperty: 'id',
                totalProperty: 'd.count',
                root: 'd.data.rows'
            },
            extraParams: { status: -1, query: '', organization: '', type: constant.usertype.STUDENT, searchtype: 'realname', klass: -1 }
        });
        var fields = ['personNo', 'realname', 'gradeName', 'klassName', 'gender', 'changeFlag', 'klass', 'grade'];
        var store = Ext.create('Ext.data.Store', {
            fields: fields,
            autoDestroy: true,
            proxy: proxy, remoteSort: true, autoLoad: true,
            sorters: [{ property: 'id', direction: 'DESC'}],
            listeners: {
                load: function (store, records, successful, eOpts) {
                    if (store.currentPage > 1 && records.length == 0) store.loadPage(store.currentPage - 1);
                }
            }
        });

        var gridList = new Ext.grid.Panel({
            margins: '5 5 5 0',
            region: 'center',
            emptyText: '没有符合条件的记录',
            viewConfig: {
                loadingText: '正在加载用户列表...'
            },
            store: store,
            columns: [
                { text: "学号", width: 100, dataIndex: 'personNo' },
                { text: "姓名", width: 80, dataIndex: 'realname' },
                { text: "当前年所在年级", width: 100, dataIndex: 'gradeName' },
                { text: "当前年所在班", width: 100, dataIndex: 'klassName' },
                { text: "性别", width: 80, dataIndex: 'gender', renderer: function (v) {
                    return userplat.stores.get(userplat.dict.userGender, v)
                }
                },
                { text: "异动情况", width: 80, dataIndex: 'changeFlag' }
            ],
            bbar: new Ext.PagingToolbar(userplat.getPagerConfig(store))
        });

        var stulist = new Ext.Window({
            title: modal.getSelection()[0].data.gradeName + modal.getSelection()[0].data.name + "学生列表 ",
            width: 600,
            height: 380,
            layout: 'fit',
            plain: true,
            modal: true,
            draggable: true,
            resizable: false,
            closable: false,
            bodyStyle: 'padding:5px;',
            buttonAlign: 'center',
            items: gridList,
            buttons: [{
                text: '确定',
                handler: function () {
                    stulist.destroy();
                }
            }]

        })
        stulist.show();
    }

}