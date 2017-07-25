/// <reference path="../userplat.js" />

student = {
    initialize: function (args) {
        userplat.getStore(userplat.dict.userTypes);

        var proxy = Ext.create('Ext.data.WebServiceProxy', {
            url: service.getStudentList,
            reader: {
                type: 'json',
                idProperty: 'id',
                totalProperty: 'd.count',
                root: 'd.data.rows'
            },
            extraParams: { status: -1, query: '', klass: -1, changeflag: 1 }
        });

        var fields = ['personNo', 'realname', 'gradeName', 'klassName', 'gender', 'changeFlag', 'klass', 'grade', 'ClassRefInfo'];

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
            { text: "学号", width: 150, dataIndex: 'personNo' },
            { text: "姓名", width: 150, dataIndex: 'realname' },
            { text: "当前年所在年级", width: 120, dataIndex: 'gradeName' },
            { text: "当前年所在班", width: 120, dataIndex: 'klassName', renderer: function (v) {
                if (v == null) return "<span style='color:gray'>当前学年还未分班</span>"
                else return v;
            }
            },
            { text: "性别", width: 100, dataIndex: 'gender', renderer: function (v) {
                return userplat.stores.get(userplat.dict.userGender, v)
            }
            },
            { text: "异动情况", width: 100, dataIndex: 'changeFlag' }

        /*,
        { text: "备注", width: 200, dataIndex: 'ClassRefInfo', renderer: function (v) {               
        var info;
        switch (v) {
        case 1: info = "可以直接删除"; break;
        case 2: info = "若要删除请先在当前年的班级中移除"; break;
        case 3: info = "不可以删除，建议标记为其他异动"; break;
        }
        return info;
        }
        }*/

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
                    items: [{
                        text: '添加学生',
                        iconCls: 'add user',
                        handler: function (me) { student.add.call(me, null, constant.usertype.STUDENT); }
                    }, {
                        text: '修改学生',
                        iconCls: 'edit',
                        disabled: true,
                        id: 'btn_edit_user',
                        handler: function (me, e) { student.edit.call(null, me, e, grid.getSelectionModel(), grid); }
                    }, {
                        text: '删除学生',
                        iconCls: 'delete user',
                        handler: function (me, e) { student.remove.call(null, me, e, grid.getSelectionModel(), grid) },
                        disabled: true,
                        id: 'btn_delete_user'
                    }].concat(btn_set_role)
                }, {
                    text: '导入学生',
                    iconCls: 'import user',
                    handler: function (me, e) { student.iimport(me, grid, constant.usertype.STUDENT) }
                }, {
                    text: '异动',
                    iconCls: 'change user',
                    handler: function (me, e) { student.changeFlag.call(null, me, e, grid.getSelectionModel(), grid); }

                }, '->',
                {
                    xtype: 'combobox',
                    hideLabel: true,
                    hidden: true,
                    store: userplat.getStore(userplat.dict.userStatus, [-1, "用户状态..."]),
                    displayField: 'text',
                    valueField: 'value',
                    name: 'status',
                    editable: false,
                    value: -1,
                    width: 100,
                    triggerAction: 'all',
                    listeners: {
                        change: function (combo, newValue, oldValue) {
                            proxy.extraParams.status = newValue;
                            store.loadPage(1);
                        }
                    }
                },
                {
                    xtype: 'searchfield',
                    width: 150, hidden: user.version == 1,
                    emptyText: '组织机构',
                    store: store,
                    paramName: 'organization',
                    listeners: {
                        focus: userplat.showOrganizTree
                    }
                }, {
                    xtype: 'combobox',
                    fieldLabel: '异动情况',
                    store: userplat.getStore("changeFlag", [-1, "所有异动"]),
                    displayField: 'text',
                    valueField: 'value',
                    editable: false, queryMode: 'local',
                    name: 'changeFlag',
                    labelWidth: 60,
                    value: 1,
                    listeners: {
                        change: function (combo, newValue, oldValue) {
                            proxy.extraParams.changeflag = newValue;
                            store.loadPage(1);
                        }
                    }
                }, {
                    xtype: 'searchfield',
                    width: 150,
                    emptyText: '按学号/姓名查找',
                    store: store,
                    paramName: 'query'
                }]
            }),
            bbar: new Ext.PagingToolbar(userplat.getPagerConfig(store)),
            listeners: {
                itemdblclick: function (grid, row, e) {
                    student.add.call(grid.all.elements[e.rowIndex - 1].childNodes[1], row.data);
                },
                selectionchange: function (model, selected) {
                    Ext.getCmp('btn_delete_user').setDisabled(!selected.length).setText(selected.length ? ('删除选中的<b>' + selected.length + '</b>个学生') : '删除学生');
                    Ext.getCmp('btn_edit_user').setDisabled(!selected.length);
                    for (var v in selected) {
                        if (selected[v].data.ClassRefInfo == 2 || selected[v].data.ClassRefInfo == 3) {
                            Ext.getCmp('btn_delete_user').setText('不能删除'); break;
                        }
                    }
                }
            }
        });
        return grid;

       
        function action(grid, td, rowIndex, columnIndex, event, modal, tr) {
            if (event.target.tagName === 'A') {
                switch (event.target.className) {
                    case 'transOut': student.transOut(event.target, modal.data); break;
                    case 'setAdmin': student.setAdmin(event.target, modal.data); break;
                }
            }
        }
    },

    iimport: function (btn, grid, type) {
        $('<form method="get" action="/ImportUser/upload.aspx" target="_blank"><input name="type" value="' + type + '"/></form>').appendTo(document.body).submit().remove();
        Ext.MessageBox.show({
            title: '操作提示',
            msg: '请在新打开的页面里上传文件，预览数据。如果数据无误则执行导入。<br><br>导入成功后点“确定”按钮刷新数据。',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn === 'ok') {
                    grid.store.loadPage(1);
                }
            }
        });
        return;
    },
    add: function (data, type) {
        var required = userplat.required, me = this, gradeId = 0;
        var title = data ? '编辑学生信息:' + data.realname + '(' + data.personNo + ')' : '添加新学生';
        if (data) {
            gradeId = data.grade;
        }
        var clstore, form, win = userplat.openWindow(title, 600, 330, [form = Ext.create('Ext.form.Panel', {
            region: 'center', bodyPadding: 10,
            fieldDefaults: { labelAlign: 'right' },
            items: [{
                xtype: 'container',
                anchor: '100%',
                layout: 'hbox',
                items: [{
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '学号',
                        afterLabelTextTpl: !data ? required : '',
                        name: 'personNo', itemId: 'personNo',
                        readOnly: !!data, allowBlank: !!data
                    }, {
                        xtype: 'combobox',
                        afterLabelTextTpl: required,
                        fieldLabel: '性别',
                        store: userplat.getStore(userplat.dict.userGender),
                        displayField: 'text',
                        valueField: 'value',
                        editable: false, queryMode: 'local',
                        name: 'gender',
                        itemId: 'gender',
                        value: 0
                    }, new Ext.form.ComboBox({
                        name: 'status',
                        fieldLabel: '状态',
                        triggerAction: 'all',
                        editable: false,
                        mode: 'local',
                        value: 3,
                        store: userplat.getStore(userplat.dict.userStatus),
                        displayField: 'text',
                        valueField: 'value'
                    })]
                }, {
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '真实姓名',
                        afterLabelTextTpl: required,
                        allowBlank: false,
                        blankText: '真实姓名不能为空',
                        name: 'realname',
                        itemId: 'realname'
                    }, {
                        xtype: 'combobox',
                        fieldLabel: '所在年级',
                        id: 'gradebox',
                        name: 'grade',
                        itemId: 'grade',
                        store: userplat.getStore('schoolGrades', [-1, ""]),
                        displayField: 'text', valueField: 'value',
                        queryMode: 'local',
                        listeners: {
                            select: function (combo, record, index) {
                                var classbox = Ext.getCmp("classbox");
                                classbox.reset();
                                clstore.proxy.extraParams.GradeID = combo.value;
                                clstore.load();
                            }
                        }
                    }, {
                        xtype: 'combobox',
                        fieldLabel: '所在班级',
                        id: 'classbox',
                        name: 'klass',
                        itemId: 'klass',
                        displayField: 'name', valueField: 'id',
                        store: clstore = Ext.create('Ext.data.Store', {
                            fields: ['id', 'name'],
                            autoDestroy: true,
                            proxy: Ext.create('Ext.data.WebServiceProxy', {
                                url: service.getGradeAndClassList,
                                reader: {
                                    type: 'json',
                                    idProperty: 'id',
                                    root: 'd.data.rows'
                                },
                                extraParams: { AcademicStartYear: 0, AcademicYearRange: -1, GradeID: gradeId }
                            }),
                            remoteSort: true, autoLoad: true,
                            listeners: {
                                load: function (store, records, successful) {
                                    store.insert(0, [{ id: -1 }, { name: ' '}]);
                                    //store.insert(0, [-1, ""])
                                }
                            }
                        })
                        //store: userplat.getStore(userplat.dict.curClasses, [-1, ""]),

                    }]
                }]
            }],
            buttons: [{
                text: '保存',
                formBind: true,
                disabled: true,
                handler: function () {
                    var values = this.up('form').getForm().getValues();
                    values.id = data ? data.id : 0;
                    values.usertype = constant.usertype.STUDENT;
                    userplat.serviceAjax(service.saveTeacherInfo, { user: values }, function (d) {
                        userplat.activePanel.store.load();
                        if (data) {
                            Ext.tips.show('提示', '资料保存成功');
                        }
                        win.close();
                    }, masker.saving(form));
                }
            }, {
                text: '取消',
                handler: function () { win.close() }
            }]
        })], { layout: { type: 'border', padding: 5 }, animateTarget: me });

        if (data) {
            with (form.getForm()) {
                setValues(data);
                //findField('username').setReadOnly(!IS_STUDENT);
            }
        }
    },
    remove: function (btn, e, modal, grid) {
        var selected = Ext.Array.map(modal.getSelection(), function (x) { return x.data.id });
        Ext.MessageBox.show({
            animateTarget: btn,
            title: '操作确认', msg: '确定删除选中的 <b>' + selected.length + '</b> 行数据?',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn === 'ok') {
                    userplat.serviceAjax(service.DeleteStudentInfoFromSystem, {
                        StudentUserIDs: selected
                    }, function (d) {
                        modal.store.load();
                        Ext.tips.show('提示', '操作成功');
                    }, masker.deleting(grid));
                }
            }
        });
    },
    edit: function (btn, e, modal, grid) {
        if (modal.getSelection().length == 0) { alert("请选择需要修改的学生"); return; }
        if (modal.getSelection().length > 1) { alert("一次只能修改一个学生"); return; }
        student.add.call(btn, modal.getSelection()[0].data, constant.usertype.STUDENT);
    },
    status: function (status, modal, grid) {
        userplat.serviceAjax(service.setTeacherStatus, {
            status: status,
            ids: Ext.Array.map(modal.getSelection(), function (x) { return x.data.id })
        }, function (d) {
            modal.store.load();
            Ext.tips.show('提示', '操作成功');
        }, masker.loading(grid));
    },
    changeFlag: function (btn, e, modal, grid) {
        debugger;
        var selected = Ext.Array.map(modal.getSelection(), function (x) { return x.data.id });
        if (selected.length == 0) {
            Ext.MessageBox.alert("提示", "请选择记录后再进行操作!");
            return;
        }
        if (selected.length > 1) {
            Ext.MessageBox.alert("提示", "每次只能操作一条记录!");
            return;
        }

        var chgflg = modal.getSelection()[0].data.changeFlag;
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
            if (items[k].boxLabel == modal.getSelection()[0].data.changeFlag) {
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
    }

}
