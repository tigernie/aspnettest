/// <reference path="../userplat.js" />

organizations = {
    initialize: function (args) {
        userplat.getStore(userplat.dict.orgTypes);
        var proxy = Ext.create('Ext.data.WebServiceProxy', {
            url: service.getOrganizeList,
            reader: {
                type: 'json',
                idProperty: 'id',
                totalProperty: 'd.count',
                root: 'd.data.rows'
            },
            extraParams: { query: '', organization: '', type: '' }
        }),
        store = Ext.create('Ext.data.Store', {
            fields: ['name', 'type', 'boss', 'area', 'department'],
            autoDestroy: true,
            proxy: proxy, remoteSort: true, autoLoad: true,
            sorters: [{ property: 'id', direction: 'DESC' }]
        }),
        columns = [
            { sortable: false, text: "机构名", width: 160, dataIndex: 'name' },
            { sortable: false, text: "所属区域", width: 120, dataIndex: 'area' },
            { sortable: false, text: "管理员", width: 100, dataIndex: 'boss' },
            { sortable: false, text: "主管部门", width: 160, dataIndex: 'department' },
            { sortable: false, text: "机构类别", width: 100, dataIndex: 'type', renderer: function (v) { return ['', '行政机构', '单位'][v] } },
            {
                text: '管理', flex: 1, xtype: 'templatecolumn',
                tpl: '<a href="javascript:;" class="resetPassword">重置密码</a> ',//'<a href="javascript:;" class="setAdmin">授权管理员</a> | <a href="javascript:;" class="innerMgr">机构内部管理</a>',
                listeners: {
                    click: function (grid, td, rowIndex, columnIndex, event, modal, tr) {
                        if (event.target.tagName === 'A') {
                            organizations[event.target.className].call(event.target, modal.data);
                        }
                    }
                }
            }
        ];
        var grid = new Ext.grid.Panel({
            tbar: new Ext.toolbar.Toolbar({
                layout: { overflowHandler: 'Menu' },
                items: [{
                    text: '新建机构',
                    iconCls: 'add orgs',
                    menu: [
                        { text: '行政机构', handler: function (me, e) { organizations.editOrgs() } },
                        { text: '单位', handler: function (me, e) { organizations.addSchool() } }
                    ]
                }, {
                    text: '删除机构',
                    iconCls: 'delete orgs',
                    handler: function (me, e) {
                        organizations.remove(me,
                                Ext.Array.map(grid.selModel.selected.items, function (x) { return x.data.id }),
                                store,
                                grid)
                    },
                    disabled: true,
                    id: 'btn_delete_orgs'
                }/*, {
                    text: '查看行政主管结构',
                    iconCls: 'edituser',
                    handler: function () { userplat.showOrganizTree(this, true) }
                }*/, {
                    text: '查看行政区域结构',
                    iconCls: 'view orgs',
                    handler: function () { userplat.showAreaTree(this, true) }
                }, '->', {
                    xtype: 'combobox',
                    displayField: 'text',
                    valueField: 'value',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: false, queryMode: 'local', queryMode: 'local',
                    name: 'type',
                    itemId: 'type',
                    value: -1,
                    store: userplat.getStore(userplat.dict.orgTypes, [-1, '机构类别...']),
                    width: 100,
                    listeners: {
                        change: function (combo, newValue, oldValue) {
                            proxy.extraParams.type = newValue;
                            store.loadPage(1);
                        }
                    }
                }/*, {
                    xtype: 'searchfield',
                    width: 150,
                    emptyText: '上级组织机构...',
                    store: store,
                    paramName: 'organization',
                    listeners: {
                        focus: function (me) { userplat.showOrganizTree(me) }
                    }
                }*/, {
                    xtype: 'searchfield',
                    width: 150,
                    emptyText: '机构名称',
                    store: store,
                    paramName: 'query'
                }]
            }),
            flex: 1, region: 'center', margins: '-1 -1 -1 -1',
            emptyText: '没有符合条件的记录',
            selModel: new Ext.selection.CheckboxModel(),
            store: store,
            columns: columns,
            bbar: new Ext.PagingToolbar(userplat.getPagerConfig(store)),
            listeners: {
                selectionchange: function (model, selected) {
                    Ext.getCmp('btn_delete_orgs').setDisabled(!selected.length).setText(selected.length ? ('删除选中的<b>' + selected.length + '</b>个机构') : '删除机构');
                },
                itemdblclick: function (grid, row, e) {
                    organizations[row.data.type === 2 ? 'editSchool' : 'editOrgs'].call(grid.all.elements[e.rowIndex - 1].childNodes[1], row.data);
                }
            }
        });
        var tree = Ext.create('Ext.tree.Panel', {
            tbar: { items: ['<label style="line-height:22px">行政组织机构目录</label>'] },
            width: 240, region: 'west', margins: '-1 0 -1 -1',
            useArrows: true,
            store: Ext.create('Ext.data.TreeStore', {
                proxy: Ext.create('Ext.data.WebServiceProxy', {
                    url: service.getOrganizeTree,
                    reader: { type: 'json', root: 'd' }
                }),
                autoLoad: true,
                nodeParam: 'root'
            }),
            root: { id: 0, text: '.', expanded: true },
            rootVisible: false, autoScroll: tree,
            listeners: {
                itemclick: function ($, node) {
                    proxy.extraParams.organization = node.data.id;
                    store.loadPage(1);
                }
            }
        });
        return new Ext.panel.Panel({
            title: args.text,
            layout: 'border',
            margins: '5 5 5 0', region: 'center',
            items: [tree, grid]
        });
    },
    editSchool: function (data) {
        var baseinfo = Ext.create('Ext.form.Panel', {
            bodyPadding: 10, height: 400,
            region: 'center',
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
                        fieldLabel: '单位名称',
                        name: 'name',
                        afterLabelTextTpl: userplat.required,
                        allowBlank: false, blankText: '单位名称不能为空'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '单位编码',
                        name: 'code',
                        afterLabelTextTpl: userplat.required,
                        allowBlank: false, blankText: '单位编码不能为空'
                    }, {
                        xtype: 'hidden',
                        fieldLabel: '办学类型',
                        displayField: 'text',
                        valueField: 'value',
                        triggerAction: 'all',
                        queryMode: 'local',
                        editable: false,
                        name: 'teachType',
                        itemId: 'teachType',value:11,
                        store: userplat.getStore(userplat.dict.userTeachLevel),
                        afterLabelTextTpl: userplat.required
                    }, {
                        xtype: 'hidden',
                        fieldLabel: '联系电话',
                        name: 'telephone',value:'123456',
                        afterLabelTextTpl: userplat.required,
                        allowBlank: false, blankText: '联系电话不能为空'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '所在区域',
                        name: 'area',
                        afterLabelTextTpl: userplat.required,
                        allowBlank: false, blankText: '所在区域不能为空',
                        listeners: {
                            focus: function (me) {
                                userplat.showAreaTree(me, false, 0, function (node) {
                                    var x = [];
                                    do { x.unshift(node.raw.text); } while ((node = node.parentNode) && node.raw);
                                    if (x[0] == '根区域') x.shift();
                                    var a = form.getForm().getFields().items[9], v = a.getValue();
                                    a.setValue(x.join('') + (v.indexOf(',') == -1 ? ',' : v.substring(v.indexOf(','))));
                                });
                            }
                        }
                    }]
                }, {
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '主管部门',
                        name: 'department',
                        listeners: {
                            focus: function (me) { userplat.showOrganizTree(me) }
                        },
                        afterLabelTextTpl: userplat.required, allowBlank: false, blankText: '主管部门不能为空'
                    }, {
                        xtype: 'hidden',
                        fieldLabel: '单位负责人',
                        name: 'boss',value:'ok',
                        afterLabelTextTpl: userplat.required, allowBlank: false, blankText: '单位负责人不能为空'
                    }, {
                        xtype: 'hidden',
                        fieldLabel: '电子邮箱',
                        name: 'email'
                    }, {
                        xtype: 'hidden',
                        fieldLabel: '主页地址',
                        name: 'url'
                    }]
                }]
            }, {
                xtype: 'textfield',
                fieldLabel: '单位地址',
                name: 'address',
                width: 533
            }],
            buttons: [{
                text: '保存',
                formBind: true,
                disabled: true,
                handler: function () {
                    var values = baseinfo.getForm().getValues();
                    values.id = data ? data.id : 0;

                    userplat.serviceAjax(service.saveSchoolInfo, { school: values }, function (d) {
                        userplat.activePanel.items.items[1].store.load();
                        Ext.tips.show('提示', '资料保存成功');
                        win.close();
                    }, masker.saving(baseinfo));
                }
            }, {
                text: '取消',
                handler: function () { win.close() }
            }]
        });
        var branchs_store, branchs = new Ext.grid.Panel({
            margins: '5 5 5 0',
            height: 401,
            region: 'center',
            emptyText: '没有符合条件的记录',
            selModel: new Ext.selection.CheckboxModel(),
            store: branchs_store = Ext.create('Ext.data.Store', {
                fields: ['name', 'telephone', 'zipcode', 'fax', 'boss', 'address'],
                autoDestroy: true,
                proxy: Ext.create('Ext.data.WebServiceProxy', {
                    url: service.getSchoolBranches,
                    reader: {
                        type: 'json',
                        idProperty: 'id',
                        totalProperty: 'd.count',
                        root: 'd.data.rows'
                    },
                    extraParams: { schoolId: data.id }
                }),
                sorters: [{ property: 'id', direction: 'DESC'}]
            }),
            columns: [
                { text: "校区名称", width: 120, dataIndex: 'name' },
                { text: "负责人", width: 80, dataIndex: 'boss' },
                { text: "校区地址", width: 170, dataIndex: 'address' }
            ],
            tbar: new Ext.toolbar.Toolbar({
                items: [{
                    text: '添加校区',
                    iconCls: 'edituser',
                    handler: function (me, e) { organizations.editSchoolBranch(null, branchs_store, data.id) }
                }, {
                    text: '删除校区',
                    iconCls: 'edituser',
                    id: 'btn_delete_branches',
                    disabled: true,
                    handler: function (me, e) {
                        organizations.removeSchoolBranch(
                            me,
                            Ext.Array.map(branchs.selModel.selected.items, function (x) { return x.data.id }),
                            branchs_store,
                            branchs)
                    }
                }]
            }),
            listeners: {
                selectionchange: function (model, selected) {
                    Ext.getCmp('btn_delete_branches').setDisabled(!selected.length).setText(selected.length ? ('删除选中的<b>' + selected.length + '</b>个校区') : '删除校区');
                },
                itemdblclick: function (grid, item) {
                    organizations.editSchoolBranch(item.data, branchs_store, data.id);
                }
            }
        });
        var grades_store, grades = new Ext.grid.Panel({
            height: 401,
            region: 'center',
            emptyText: '没有符合条件的记录',
            selModel: new Ext.selection.CheckboxModel(),
            store: grades_store = Ext.create('Ext.data.Store', {
                fields: ['name', 'code'],
                autoDestroy: true,
                proxy: Ext.create('Ext.data.WebServiceProxy', {
                    url: service.getSchoolGrades,
                    reader: {
                        type: 'json',
                        idProperty: 'id',
                        totalProperty: 'd.count',
                        root: 'd.data.rows'
                    },
                    extraParams: { schoolId: data.id }
                }),
                sorters: [{ property: 'id', direction: 'DESC'}]
            }),
            columns: [
                { text: "年级名称", width: 150, dataIndex: 'name' }
            ],
            tbar: new Ext.toolbar.Toolbar({
                items: [{
                    text: '添加年级',
                    iconCls: 'edituser',
                    handler: function (me, e) { organizations.editSchoolGrade(null, grades_store, data.id) }
                }, {
                    text: '删除年级',
                    iconCls: 'edituser',
                    id: 'btn_delete_grades',
                    disabled: true,
                    handler: function (me, e) {
                        organizations.removeSchoolGrades(
                            me,
                            Ext.Array.map(grades.selModel.selected.items, function (x) { return x.data.id }),
                            grades_store,
                            grades)
                    }
                }]
            }),
            listeners: {
                selectionchange: function (model, selected) {
                    Ext.getCmp('btn_delete_grades').setDisabled(!selected.length).setText(selected.length ? ('删除选中的<b>' + selected.length + '</b>个年级') : '删除校区');
                },
                itemdblclick: function (grid, item) {
                    organizations.editSchoolGrade(item.data, grades_store, data.id);
                }
            }
        });

        var win = userplat.openWindow('编辑单位信息：' + data.name + '(' + data.id + ')', 640, 480, [{
            xtype: 'tabpanel',
            width: 618, height: 438, bodyPadding: '5 5 5 5',
            items: [
                { title: '基础信息', items: [baseinfo] }
                
            ],
            listeners: {
                tabchange: function (me, tab) {
                    switch (tab.title) {
                        case '校区数据':
                        case '年级数据':
                            if (!tab.items.items[0].store.data.items.length) {
                                tab.items.items[0].store.load();
                            }
                            break;
                    }
                }
            }
        }], {
            animateTarget: this,
            listeners: {
                show: function () {
                    userplat.serviceAjax(service.getSchoolInfo, { schoolId: data.id }, function (d) {
                        baseinfo.getForm().setValues(d.data);
                    }, masker.loading(baseinfo));
                }
            }
        });
    },
    removeSchoolGrades: function (btn, data, store, grid) {
        Ext.MessageBox.show({
            animateTarget: btn,
            title: '操作确认', msg: '确定删除选中的 <b>' + data.length + '</b> 个年级？',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn === 'ok') {
                    userplat.serviceAjax(service.deleteSchoolGrades, {
                        ids: data
                    }, function (d) {
                        store.load();
                        Ext.tips.show('提示', '操作成功');
                    }, masker.deleting(grid));
                }
            }
        });
    },
    editSchoolBranch: function (data, store, schoolId) {
        var form = Ext.create('Ext.form.Panel', {
            bodyPadding: 10,
            region: 'center',
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
                        fieldLabel: '校区名称',
                        name: 'name',
                        afterLabelTextTpl: userplat.required,
                        allowBlank: false, blankText: '校区名称不能为空'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '校区邮编',
                        name: 'zipcode'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '负责人',
                        name: 'boss',
                        afterLabelTextTpl: userplat.required,
                        allowBlank: false, blankText: '联系电话不能为空'
                    }]
                }, {
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '校区电话',
                        name: 'telephone'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '校区传真',
                        name: 'fax'
                    }]
                }]
            }, {
                xtype: 'textfield',
                fieldLabel: '校区地址',
                name: 'address',
                width: 533
            }],
            buttons: [{
                text: '保存',
                formBind: true,
                disabled: true,
                handler: function () {
                    var values = form.getForm().getValues();
                    values.id = data ? data.id : 0;
                    values.schoolId = schoolId;

                    userplat.serviceAjax(service.saveSchoolBranche, { branch: values }, function (d) {
                        win.close();
                        store.load();
                        Ext.tips.show('提示', '资料保存成功');
                    }, masker.saving(form));
                }
            }, {
                text: '取消',
                handler: function () { win.close() }
            }]
        });
        if (data) form.getForm().setValues(data);
        var win = userplat.openWindow(data ? '编辑校区信息：' + data.name : '添加新单位', 600, 300, [form]);
    },
    removeSchoolBranch: function (btn, data, store, grid) {
        Ext.MessageBox.show({
            animateTarget: btn,
            title: '操作确认', msg: '确定删除选中的 <b>' + data.length + '</b> 个校区?',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn === 'ok') {
                    userplat.serviceAjax(service.deleteSchoolBranches, {
                        ids: data
                    }, function (d) {
                        store.load();
                        Ext.tips.show('提示', '操作成功');
                    }, masker.deleting(grid));
                }
            }
        });
    },
    editSchoolGrade: function (data, store, schoolId) {
        var form = Ext.create('Ext.form.Panel', {
            bodyPadding: 10,
            region: 'center',
            fieldDefaults: { labelAlign: 'right' },
            items: [{
                xtype: 'textfield',
                fieldLabel: '年级名称',
                name: 'name',
                itemId: 'name',
                afterLabelTextTpl: userplat.required,
                allowBlank: false, blankText: '年级名称不能为空'
            }, {
                xtype: 'combobox',
                fieldLabel: '年级编码',
                name: 'code',
                displayField: 'text', valueField: 'value', triggerAction: 'all', editable: false, queryMode: 'local',
                store: userplat.getStore(userplat.dict.grades)
            }],
            buttons: [{
                text: '保存',
                formBind: true,
                disabled: true,
                handler: function () {
                    var values = this.up('form').getForm().getValues();
                    values.id = data ? data.id : 0;
                    values.schoolId = schoolId;

                    userplat.serviceAjax(service.saveSchoolGrade, { grade: values }, function (d) {
                        win.close();
                        store.load();
                        Ext.tips.show('提示', '资料保存成功');
                    }, masker.saving(form));
                }
            }, {
                text: '取消',
                handler: function () { win.close() }
            }]
        });
        if (data) form.getForm().setValues(data);
        var win = userplat.openWindow(data ? '编辑年级信息：' + data.name : '添加年级', 400, 200, [form]);

    },
    innerMgr: function (data) {
        var bstore, bpanel, items = [{
            title: '内部机构管理',
            items: [bpanel = new Ext.grid.Panel({
                height: 401,
                region: 'center',
                emptyText: '没有符合条件的记录',
                selModel: new Ext.selection.CheckboxModel(),
                store: bstore = Ext.create('Ext.data.Store', {
                    fields: ['name', 'code', 'address', 'fax', 'parent', 'boss', 'telephone'],
                    autoDestroy: true, autoLoad: true,
                    proxy: Ext.create('Ext.data.WebServiceProxy', {
                        url: service.getDepartmentsList,
                        reader: {
                            type: 'json',
                            idProperty: 'id',
                            totalProperty: 'd.count',
                            root: 'd.data.rows'
                        },
                        extraParams: { orgId: data.id, parent: '', query: '' }
                    }),
                    sorters: [{ property: 'id', direction: 'DESC' }]
                }),
                columns: [
                    { text: "部门编码", width: 80, dataIndex: 'code' },
                    { text: "部门名称", width: 120, dataIndex: 'name' },
                    { text: "部门地址", flex: 1, dataIndex: 'address' },
                    { text: "部门传真", width: 100, dataIndex: 'fax' },
                    { text: "上级部门", width: 100, dataIndex: 'parent' },
                    { text: '管理', width: 100, xtype: 'templatecolumn',
                        tpl: '<a href="javascript:;" class="menbers">查看成员</a>',
                        listeners: {
                            click: function (grid, td, rowIndex, columnIndex, event, modal, tr) {
                                if (event.target.tagName === 'A') {
                                    switch (event.target.className) {
                                        case 'menbers': organizations.viewDepartmentMenbers.call(event.target, modal.data); break;
                                    }
                                }
                            }
                        }
                    }
                ],
                tbar: new Ext.toolbar.Toolbar({
                    items: [{
                        text: '添加部门',
                        iconCls: 'edituser',
                        handler: function (me, e) { organizations.editDepartment.call(me, null, bstore, data) }
                    }, {
                        text: '删除部门',
                        iconCls: 'edituser',
                        id: 'btn_delete_grades',
                        disabled: true,
                        handler: function (me, e) {
                            organizations.removeDepartment(
                                me,
                                Ext.Array.map(bpanel.selModel.selected.items, function (x) { return x.data.id }),
                                bstore,
                                bpanel);
                        }
                    }, '->', {
                        xtype: 'searchfield',
                        width: 150,
                        emptyText: '所属部门...',
                        store: bstore,
                        paramName: 'parent',
                        listeners: {
                            focus: function (me) { userplat.showOrganizTree(me) }
                        }
                    }, {
                        xtype: 'searchfield',
                        width: 150,
                        emptyText: '部门名称...',
                        store: bstore,
                        paramName: 'query'
                    }]
                }),
                bbar: new Ext.PagingToolbar(userplat.getPagerConfig(bstore)),
                listeners: {
                    selectionchange: function (model, selected) {
                        Ext.getCmp('btn_delete_grades').setDisabled(!selected.length).setText(selected.length ? ('删除选中的<b>' + selected.length + '</b>个部门') : '删除部门');
                    },
                    itemdblclick: function (grid, item) {
                        organizations.editDepartment(item.data, bstore, data);
                    }
                }
            })]
        }];
        var astore, apanel;
        if (data.type == 2) items.push({
            title: '班级管理',
            items: [apanel = new Ext.grid.Panel({
                height: 401,
                region: 'center',
                emptyText: '没有符合条件的记录',
                selModel: new Ext.selection.CheckboxModel(),
                store: astore = Ext.create('Ext.data.Store', {
                    fields: ['name', 'code', 'year', 'grade', 'gradeName'],
                    autoDestroy: true,
                    proxy: Ext.create('Ext.data.WebServiceProxy', {
                        url: service.getClassList,
                        reader: {
                            type: 'json',
                            idProperty: 'id',
                            totalProperty: 'd.count',
                            root: 'd.data.rows'
                        },
                        extraParams: { schoolId: data.id, year: '', query: '' }
                    }),
                    sorters: [{ property: 'id', direction: 'DESC' }]
                }),
                columns: [
                    { text: "班级名称", width: 120, dataIndex: 'name' },
                    { text: "班级编码", width: 80, dataIndex: 'code' },
                    { text: "所属学年", flex: 1, dataIndex: 'year' },
                    { text: "所属年级", width: 100, dataIndex: 'gradeName' },
                    { text: '管理', width: 100, xtype: 'templatecolumn',
                        tpl: '<a href="javascript:;" class="setStudent">调整学生</a>',
                        listeners: {
                            click: function (grid, td, rowIndex, columnIndex, event, modal, tr) {
                                if (event.target.tagName === 'A') {
                                    switch (event.target.className) {
                                        case 'setStudent': organizations.viewDepartmentMenbers.call(event.target, modal.data); break;
                                    }
                                }
                            }
                        }
                    }
                ],
                tbar: new Ext.toolbar.Toolbar({
                    items: [{
                        text: '添加班级',
                        iconCls: 'edituser',
                        handler: function (me, e) { organizations.editClass.call(me, null, astore, data.id) }
                    }, {
                        text: '删除班级',
                        iconCls: 'edituser',
                        id: 'btn_delete_classes',
                        disabled: true,
                        handler: function (me, e) {
                            organizations.removeClass(me,
                            Ext.Array.map(apanel.selModel.selected.items, function (x) { return x.data.id }),
                            astore,
                            apanel)
                        }
                    }, '->', {
                        xtype: 'combobox',
                        hideLabel: true,
                        displayField: 'text',
                        valueField: 'value',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: false, queryMode: 'local',
                        emptyText: '选择学年...',
                        name: 'year',
                        itemId: 'year',
                        width: 100,
                        store: Ext.create('Ext.data.ArrayStore', {
                            fields: ['value', 'text'],
                            data: [['', '选择学年...'], ['2010', '2010年'], ['2011', '2011年'], ['2012', '2012年']]
                        })
                    }, {
                        xtype: 'searchfield',
                        width: 150,
                        emptyText: '班级名称...',
                        store: astore,
                        paramName: 'query'
                    }]
                }),
                bbar: new Ext.PagingToolbar(userplat.getPagerConfig(astore)),
                listeners: {
                    selectionchange: function (model, selected) {
                        Ext.getCmp('btn_delete_classes').setDisabled(!selected.length).setText(selected.length ? ('删除选中的<b>' + selected.length + '</b>个班级') : '删除班级');
                    },
                    itemdblclick: function (grid, item) {
                        organizations.editClass(item.data, astore, data.id);
                    }
                }
            })]
        });
        var win = userplat.openWindow(['', '行政机构', '单位'][data.type] + '管理：' + data.name, 700, 480, [{
            xtype: 'tabpanel',
            width: 678, height: 438, bodyPadding: '5 5 5 5',
            items: items,
            listeners: {
                tabchange: function (me, tab) {
                    switch (tab.title) {
                        case '班级管理':
                            if (!tab.items.items[0].store.data.items.length) {
                                tab.items.items[0].store.load();
                            }
                            break;
                    }
                }
            }
        }], { animateTarget: this });
    },
    editDepartment: function (data, store, parent) {

        var form = Ext.create('Ext.form.Panel', {
            bodyPadding: 10, height: 250,
            region: 'center',
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
                        fieldLabel: '部门名称',
                        name: 'name',
                        afterLabelTextTpl: userplat.required,
                        allowBlank: false, blankText: '部门名称不能为空'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '部门编码',
                        name: 'code'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '负责人',
                        name: 'boss'
                    }]
                }, {
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '部门电话',
                        name: 'telephone'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '部门传真',
                        name: 'fax'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '上级部门',
                        name: 'parent',
                        listeners: {
                            focus: function (me) { userplat.showOrganizTree(me) }
                        },
                        value: parent.id + ':' + parent.name
                    }]
                }]
            }, {
                xtype: 'textfield',
                fieldLabel: '部门地址',
                name: 'address',
                width: 500
            }],
            buttons: [{
                text: '保存',
                formBind: true,
                disabled: true,
                handler: function () {
                    var department = form.getForm().getValues();
                    department.id = data ? data.id : 0;
                    userplat.serviceAjax(service.saveDepartmentInfo, { department: department }, function (d) {
                        store.load();
                        Ext.tips.show('提示', '资料保存成功');
                        win.close();
                    }, masker.saving(form));
                }
            }, {
                text: '取消',
                handler: function () { win.close() }
            }]
        });
        var win = userplat.openWindow(data ? '编辑部门信息：' + data.name : '添加部门', 570, 300, [form], {
            listeners: {
                show: function () {
                    if (data) form.getForm().setValues(data);
                }
            }
        });
    },
    removeDepartment: function (btn, data, store, grid) {
        Ext.MessageBox.show({
            animateTarget: btn,
            title: '操作确认', msg: '确定删除选中的 <b>' + data.length + '</b> 个部门？',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn === 'ok') {
                    userplat.serviceAjax(service.deleteDepartments, {
                        ids: data
                    }, function (d) {
                        store.load();
                        Ext.tips.show('提示', '操作成功');
                    }, masker.deleting(grid));
                }
            }
        });
    },
    editClass: function (data, store, schoolId) {
        var form = Ext.create('Ext.form.Panel', {
            bodyPadding: 10, height: 250,
            region: 'center',
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
                        fieldLabel: '班级名称',
                        name: 'name',
                        afterLabelTextTpl: userplat.required, allowBlank: false, blankText: '班级名称不能为空'
                    }, {
                        xtype: 'combobox',
                        fieldLabel: '所属年级',
                        displayField: 'text',
                        valueField: 'value',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: false, queryMode: 'local',
                        name: 'grade',
                        itemId: 'grade',
                        store: userplat.getStoreByUrl(service.getGradesBySchoolId, { schoolId: schoolId }),
                        emptyText: '选择年级',
                        afterLabelTextTpl: userplat.required, allowBlank: false, blankText: '所属年级不能为空'
                    }, {
                        xtype: 'combobox',
                        fieldLabel: '所属学年',
                        displayField: 'text',
                        valueField: 'value',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: false, queryMode: 'local',
                        name: 'year',
                        itemId: 'year',
                        store: Ext.create('Ext.data.ArrayStore', {
                            fields: ['value', 'text'],
                            data: userplat.gradePeriod
                        }),
                        emptyText: '选择学年',
                        afterLabelTextTpl: userplat.required, allowBlank: false, blankText: '所属学年不能为空'
                    }]
                }, {
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '班级编号',
                        name: 'code',
                        afterLabelTextTpl: userplat.required, allowBlank: false, blankText: '班级编号不能为空'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '班主任',
                        name: 'boss'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '班长',
                        name: 'monitor'
                    }]
                }]
            }],
            buttons: [{
                text: '保存',
                formBind: true,
                disabled: true,
                handler: function () {
                    var klass = this.up('form').getForm().getValues();
                    klass.id = data ? data.id : 0;
                    klass.schoolId = schoolId;

                    userplat.serviceAjax(service.saveClassInfo, { klass: klass }, function (d) {
                        store.load();
                        Ext.tips.show('提示', '资料保存成功');
                        win.close();
                    }, masker.saving(form));
                }
            }, {
                text: '取消',
                handler: function () { win.close() }
            }]
        });
        if (data) form.getForm().setValues(data);
        var win = userplat.openWindow(data ? '编辑班级信息：' + data.name : '添加班级', 570, 300, [form]/*, { animateTarget: this }*/);
    },
    removeClass: function (btn, data, store, grid) {
        Ext.MessageBox.show({
            animateTarget: btn,
            title: '操作确认', msg: '确定删除选中的 <b>' + data.length + '</b> 个班级?',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn === 'ok') {
                    userplat.serviceAjax(service.deleteClasses, {
                        ids: data
                    }, function (d) {
                        store.load();
                        Ext.tips.show('提示', '操作成功');
                    }, masker.deleting(grid));
                }
            }
        });
    },
    viewDepartmentMenbers: function (data) {

    },
    addSchool: function () {
        var form = Ext.create('Ext.form.Panel', {
            bodyPadding: 10,
            region: 'center',
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
                        fieldLabel: '单位名称',
                        name: 'name',
                        afterLabelTextTpl: userplat.required,
                        allowBlank: false, blankText: '单位名称不能为空'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '单位编码',
                        name: 'code',
                        afterLabelTextTpl: userplat.required,
                        allowBlank: false, blankText: '单位编码不能为空'
                    }, {
                        xtype: 'hidden',
                        fieldLabel: '单位类型',
                        displayField: 'text',
                        valueField: 'value',
                        triggerAction: 'all',
                        queryMode: 'local',
                        editable: false,
                        name: 'teachType',
                        itemId: 'teachType',value:11,
                        store: userplat.getStore(userplat.dict.userTeachLevel),
                        afterLabelTextTpl: userplat.required,
                        allowBlank: false, blankText: '单位类型不能为空'
                    }, {
                        xtype: 'hidden',
                        fieldLabel: '联系电话',
                        name: 'telephone',value:'123456',
                        afterLabelTextTpl: userplat.required,
                        allowBlank: false, blankText: '联系电话不能为空'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '所在区域',
                        name: 'area',
                        afterLabelTextTpl: userplat.required,
                        allowBlank: false, blankText: '所在区域不能为空',
                        listeners: {
                            focus: function (me) {
                                userplat.showAreaTree(me, false, 0, function (node) {
                                    var x = [];
                                    do { x.unshift(node.raw.text); } while ((node = node.parentNode) && node.raw);
                                    if (x[0] == '根区域') x.shift();
                                    var a = form.getForm().getFields().items[9], v = a.getValue();
                                    a.setValue(x.join('') + (v.indexOf(',') == -1 ? ',' : v.substring(v.indexOf(','))));
                                });
                            }
                        }
                    }]
                }, {
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '主管部门',
                        name: 'department',
                        listeners: {
                            focus: function (me) { userplat.showOrganizTree(me) }
                        },
                        afterLabelTextTpl: userplat.required,
                        allowBlank: false, blankText: '主管部门不能为空'
                    }, {
                        xtype: 'hidden',
                        fieldLabel: '单位负责人',
                        name: 'boss',value:'ok',
                        afterLabelTextTpl: userplat.required,
                        allowBlank: false, blankText: '单位负责人不能为空'
                    }, {
                        xtype: 'hidden',
                        fieldLabel: '电子邮箱', value: 'ok',
                        name: 'email'
                    }, {
                        xtype: 'hidden',
                        fieldLabel: '主页地址', value: 'ok',
                        name: 'url'
                    }]
                }]
            }, {
                xtype: 'textfield',
                fieldLabel: '单位地址',
                name: 'address',
                width: 533
            }],
            buttons: [{
                text: '保存',
                formBind: true,
                disabled: true,
                handler: function () {
                    var values = this.up('form').getForm().getValues();
                    values.id = 0;

                    userplat.serviceAjax(service.saveSchoolInfo, { school: values }, function (d) {
                        win.close();
                        userplat.activePanel.items.items[1].store.load();
                        Ext.tips.show('提示', '资料保存成功');
                    }, masker.saving(form));
                }
            }, {
                text: '取消',
                handler: function () { win.close() }
            }]
        });
        var win = userplat.openWindow('添加新单位', 600, 300, [form]);
    },
    editOrgs: function (data, parent) {
        var title = data ? '编辑行政机构信息:' + data.name + '(' + data.id + ')' : '添加行政机构';
        var form = Ext.create('Ext.form.Panel', {
            bodyPadding: 10,
            region: 'center',
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
                        fieldLabel: '机构名称',
                        name: 'name',
                        afterLabelTextTpl: userplat.required,
                        allowBlank: false, blankText: '机构名称不能为空'
                    }, {
                        xtype: 'hidden',
                        fieldLabel: '机构简称',
                        name: 'simpleName',
                        afterLabelTextTpl: userplat.required,value:'ok',
                        allowBlank: false, blankText: '机构简称不能为空'
                    }, {
                        xtype: 'hidden',
                        fieldLabel: '英文名称',
                        name: 'ename',
                        afterLabelTextTpl: userplat.required, value: 'ok',
                        allowBlank: false, blankText: '英文名称不能为空'
                    }, {
                        xtype: 'combobox',
                        fieldLabel: '机构类别',
                        displayField: 'text',
                        valueField: 'value',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: false, queryMode: 'local',
                        name: 'orgType',
                        itemId: 'orgType',
                        value: 1, readOnly: true,
                        store: userplat.getStore(userplat.dict.orgTypes)
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '所在区域',
                        name: 'area',
                        listeners: {
                            focus: function (me) {
                                userplat.showAreaTree(me, false, 0, function (node) {
                                    var x = [];
                                    do { x.unshift(node.raw.text) } while ((node = node.parentNode).raw);
                                    var a = form.getForm().getFields().items[9], v = a.getValue();
                                    a.setValue(x.join('') + (v.indexOf(',') == -1 ? ',' : v.substring(v.indexOf(','))));
                                })
                            }
                        },
                        afterLabelTextTpl: userplat.required,
                        allowBlank: false, blankText: '所在区域不能为空'
                    }]
                }, {
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '主管部门',
                        name: 'department',
                        afterLabelTextTpl: userplat.required,
                        allowBlank: false, blankText: '主管部门不能为空',
                        listeners: {
                            focus: function (me) { userplat.showOrganizTree(me) }
                        }
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '管辖区域',
                        name: 'adminArea',
                        afterLabelTextTpl: userplat.required,
                        allowBlank: false, blankText: '管辖区域不能为空',
                        listeners: {
                            focus: function (me) { userplat.showAreaTree(me) }
                        }
                    }, {
                        xtype: 'hidden',
                        fieldLabel: '负责人',
                        name: 'boss',
                        afterLabelTextTpl: userplat.required,value:'ok',
                        allowBlank: false, blankText: '负责人姓名不能为空'
                    }, {
                        xtype: 'hidden',
                        fieldLabel: '机构办别',
                        displayField: 'text',
                        valueField: 'value',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: false, queryMode: 'local',
                        name: 'orgLevel',
                        itemId: 'orgLevel',value:1,
                        store: userplat.getStore(userplat.dict.orgLevel, [-1, '请选择...'])
                    }]
                }]
            }, {
                xtype: 'textfield',
                fieldLabel: '机构地址',
                name: 'address',
                width: 533
            }],
            buttons: [{
                text: '保存',
                formBind: true,
                disabled: true,
                handler: function () {
                    var values = this.up('form').getForm().getValues();
                    values.id = data ? data.id : 0;

                    userplat.serviceAjax(service.saveOrganizeInfo, { organization: values }, function (d) {
                        userplat.activePanel.items.items[1].store.load();
                        Ext.tips.show('提示', '资料保存成功');
                        win.close();
                    }, masker.saving(form));
                }
            }, {
                text: '取消',
                handler: function () { win.close() }
            }]
        });
        var listensers = {
            show: function (win) {
                var mask = masker.loading(form);
                userplat.serviceAjax(service.getOrganizeInfo, { orgId: data.id }, function (d) {
                    form.getForm().setValues(d.data);
                    mask.hide();
                });
            }
        };
        var win = userplat.openWindow(title, 600, 300, [form], { listeners: data ? listensers : null, animateTarget: data ? this : null });
    },
    remove: function (btn, data, store, grid) {
        Ext.MessageBox.show({
            animateTarget: btn,
            title: '操作确认', msg: '确定删除选中的 <b>' + data.length + '</b> 个机构?',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn === 'ok') {
                    userplat.serviceAjax(service.deleteOrganize, {
                        ids: data
                    }, function (d) {
                        store.load();
                        Ext.tips.show('提示', '操作成功');
                    }, masker.deleting(grid));
                }
            }
        });
    },
    resetPassword: function (data, el) {

        Ext.MessageBox.show({
            title: '操作确认', msg: '确定要重置'+data.name+'的登录密码吗？',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn === 'ok') {
                    userplat.serviceAjax(service.ResetPassword, { orgId: data.id }, function (d) {
                        Ext.tips.show('提示', '密码已成功重置为:' + d.data);
                        mask.hide();
                    });
                }
            }
        });
    },
    setAdmin: function (data, el) {
        var store, cm, bgroup, admins = {}, boxes = [];

        var _top = Ext.create('Ext.Component', {
            height: 50, region: 'north',
            style: {backgroundColor:'#f9f9f9'},
            autoEl: {
                tag: 'div',
                html: '<label style="padding:6px 0 0 6px;float:left;">已经设置的管理员：</label><div id="bgroup" style="padding:6px 0 0 6px;clear:left;"></div>'
            }
        }), _tree = {
            xtype: 'treepanel',
            region: 'west', flex: 1, margins: '0 -1 -1 -1',
            store: Ext.create('Ext.data.TreeStore', {
                proxy: Ext.create('Ext.data.WebServiceProxy', {
                    url: service.getOrganizeTree,
                    reader: { type: 'json', root: 'd' }
                }),
                autoLoad: true,
                nodeParam: 'root'
            }),
            root: { id: 0, text: '全国', expanded: true },
            rootVisible: true,
            listeners: {
                itemclick: function ($, node) {
                    store.proxy.extraParams.organization = String(node.data.id);
                    store.load({ page: 1, start: 0 });
                }
            },
            tbar: new Ext.toolbar.Toolbar({ items: ['<label style="line-height:20px">按行政机构过滤</label>'] })
        }, _grid = {
            xtype: 'gridpanel',
            region: 'center', flex: 2, margins: '0 -1 -1 0',
            emptyText: '没有符合条件的记录',
            viewConfig: {
                loadMask: true,
                loadingText: '正在加载数据...'
            },
            store: store = Ext.create('Ext.data.Store', {
                fields: ['username', 'realname', 'status', 'usertype'],
                autoDestroy: true,
                proxy: Ext.create('Ext.data.WebServiceProxy', {
                    url: service.getTeacherList,
                    reader: {
                        type: 'json',
                        idProperty: 'id',
                        totalProperty: 'd.count',
                        root: 'd.data.rows'
                    },
                    extraParams: { status: -1, query: '', organization: '', type: -1, searchtype: 'username' }
                }), remoteSort: true,
                sorters: [{ property: 'id', direction: 'DESC' }],
                listeners: {
                    load: function () {
                        var records = new Array();
                        store.each(function (record) { if (String(record.data.id) in admins) records.push(record) });
                        cm.select(records, true);
                    }
                }
            }),
            selModel: cm = new Ext.selection.RowModel(),
            columns: [
                { text: "用户名", width: 100, dataIndex: 'username' },
                { text: "真实姓名", width: 100, dataIndex: 'realname' }
            ],
            tbar: new Ext.toolbar.Toolbar({
                items: ['<label>双击添加为管理员</label>', '->', {
                    xtype: 'searchfield',
                    store: store,
                    name: 'query',
                    paramName: 'query',
                    emptyText: '搜索用户名'
                }]
            }),
            bbar: new Ext.PagingToolbar(userplat.getPagerConfig(store, { displayMsg: '', emptyMsg: '' })),
            listeners: {
                itemdblclick: function (grid, item) {
                    var id = item.data.id.toString();
                    if (!(id in admins)) {
                        admins[id] = item.data.realname;
                        init_box();
                    }
                }
            }
        };

        var form, win = userplat.openWindow('设置管理员：' + data.name, 542, 440, [form = Ext.create('Ext.panel.Panel', {
            width: 520, height: 369, layout: 'border',
            items: [_top, _tree, _grid]
        })], {
            animateTarget: this,
            listeners: {
                show: function () {
                    userplat.serviceAjax(service.getOrgAdmins, { orgId: data.id }, function (d) {
                        for (var x in d.data) {
                            admins[x.toString()] = d.data[x];
                        }
                        init_box();
                    }, masker.loading(form));
                }
            },
            buttons: [{
                text: '保存',
                handler: function () {
                    values = $('#bgroup input:checked').map(function (i, x) { return x.value }).toArray();
                    if (values.length === 0) {
                        return Ext.tips.show('提示', '没有选择管理员...');
                    }
                    userplat.serviceAjax(service.setAdministrator, { orgId: data.id, admins: values }, function (d) {
                        win.close();
                        Ext.tips.show('提示', '资料保存成功');
                    }, masker.saving(form));
                }
            }, {
                text: '取消',
                handler: function () { win.close() }
            }]
        });

        function init_box() {
            var bgroup = $('#bgroup').empty();
            for (var x in admins) {
                bgroup.append('<label for="admins_' + x + '" style="margin:6px 0 0 6px;"><input style="vertical-align:middle" type="checkbox" id="admins_' + x + '" name="admins" value="' + x + '" checked="checked"/> ' + admins[x] + '</label>');
            }
        }
    }
};