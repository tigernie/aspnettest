/// <reference path="../userplat.js" />

users = {
    initialize: function (args) {
        userplat.getStore(userplat.dict.userTypes);

        var is_teacher = args.args === 'teacher',
            is_student = args.args === 'student',
            cb_type = is_student ? constant.usertype.STUDENT : is_teacher ? constant.usertype.TEACHER : constant.usertype.ALL,
            cb_name = is_student ? '学生' : is_teacher ? '教师' : '用户';

        var proxy = Ext.create('Ext.data.WebServiceProxy', {
            url: is_student ? service.getStudentList : is_teacher ? service.getTeacherList : service.getUserList,
            reader: {
                type: 'json',
                idProperty: 'id',
                totalProperty: 'd.count',
                root: 'd.data.rows'
            },
            extraParams: { status: -1, query: '', organization: '', type: constant.usertype.ALL, searchtype: 'username', klass: -1 }
        });

        var fields = ['username', 'realname', 'status', 'email', 'usertype', 'gender', 'identity', 'lastlogin', 'birthday', 'organization', 'klass', 'role', 'personNo'];
        if (is_teacher) {
            fields.push('department');
        } else if (is_student) {
            fields.push('grade');
            fields.push('klass');
            fields.push('klassName');
            fields.push('gradeName');
        }
        var store = Ext.create('Ext.data.Store', {
            fields: fields,
            autoDestroy: true,
            proxy: proxy, remoteSort: true, autoLoad: true,
            sorters: [{ property: 'id', direction: 'DESC' }],
            listeners: {
                load: function(store,  records,  successful,  eOpts ){
                    if (store.currentPage > 1 && records.length == 0) store.loadPage(store.currentPage - 1);
                }
            }
        });
        var columns = [
            { text: is_student ? '学号' : "用户名", width: 160, dataIndex: 'username' },
            { text: "姓名", width: 100, dataIndex: 'realname' },
            { text: "状态", width: 80, dataIndex: 'status', renderer: function (v) { return userplat.stores.get(userplat.dict.userStatus, v) } }
        ];
        if (user.version == 0) columns.push({ text: is_student ? '所属单位' : "所属机构", width: 160, dataIndex: 'organization', renderer: function (v) { v = (v || ':').split(':'); return v.length > 1 ? v[1] : v[0] } });
        var btn_set_role = [];
        if (is_teacher) {
            columns.push({ text: "角色", width: 360, dataIndex: 'role' });
            //columns.push({ text: '管理', width: 180, xtype: 'templatecolumn', tpl: '<a href="javascript:;" class="transOut">调出</a> | <a href="javascript:;" class="setAdmin">设为组管理员</a>', listeners: { click: action} });
            btn_set_role.push({
                text: '用户授权',
                iconCls: 'edit user',
                handler: function (me) { users.accredit(me, grid.selModel.selected.items[0].data, grid) },
                id: 'btn_accredit_user',
                disabled: true
            });
        } else if (is_student) {
            columns.push({ text: "考号", width: 120, dataIndex: 'personNo' });
            columns.push({ text: "年级", width: 120, dataIndex: 'gradeName' });
            columns.push({ text: "班级", width: 120, dataIndex: 'klassName' });
            //columns.push({ text: '管理', width: 80, xtype: 'templatecolumn', tpl: '<a href="javascript:;" class="transOut">转出</a>', listeners: { click: action} });
        } else {
            columns.push({ text: "最近登录时间", width: 120, dataIndex: 'lastlogin' });
            columns.push({ sortable: false, text: "用户类别", width: 80, dataIndex: 'usertype', renderer: function (v) { return userplat.stores.get(userplat.dict.userTypes, v) } });
            //columns.push({ text: '管理', width: 150, xtype: 'templatecolumn', tpl: '<a href="javascript:;" class="transOut">调出</a> | <a href="javascript:;" class="setAdmin">设为组管理员</a>', listeners: { click: action} });
        }

        if (user.version == 0) columns.push({
            text: '管理',
            flex: .8,
            xtype: 'templatecolumn',
            tpl: '',
            renderer: function (a, b, record) {
                if (record.data.usertype === constant.usertype.STUDENT) {
                    return '';
                    //return '<a href="javascript:;" class="transOut">转出</a>';
                }
                if (record.data.usertype === constant.usertype.TEACHER) {
                    return '<a href="javascript:;" class="setAdmin">设为组管理员</a>';
                    //return '<a href="javascript:;" class="transOut">调出</a> | <a href="javascript:;" class="setAdmin">设为组管理员</a>';
                }
            },
            listeners: { click: action }
        });

        var grid;
        return grid = new Ext.grid.Panel({
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
                        text: '添加' + cb_name,
                        iconCls: 'add user',
                        handler: function (me) { users.add.call(me, null, cb_type == -1 ? 1 : cb_type); }
                    }, {
                        text: '修改' + cb_name,
                        iconCls: 'edit',
                        disabled: true,
                        id: 'btn_edit_user',
                        handler: function (me, e) { users.edit.call(null, me, e, grid.getSelectionModel(), grid); }
                    },{
                        text: '删除' + cb_name,
                        iconCls: 'delete user',
                        handler: function (me, e) { users.remove.call(null, me, e, grid.getSelectionModel(), grid) },
                        disabled: true,
                        id: 'btn_delete_user'
                    }, {
                        text: '用户状态',
                        iconCls: 'edit user',
                        menu: [
                            { text: '审核通过', hidden: true, handler: function (me, e) { users.status(3, grid.getSelectionModel(), grid) } },
                            { text: '审核不通过', hidden: true, handler: function (me, e) { users.status(1, grid.getSelectionModel(), grid) } },
                            { text: '启用', handler: function (me, e) { users.status(3, grid.getSelectionModel(), grid) } },
                            { text: '禁用', handler: function (me, e) { users.status(0, grid.getSelectionModel(), grid) } }
                        ],
                        disabled: true,
                        id: 'btn_set_status'
                    }].concat(btn_set_role)
                }, {
                    text: '导入' + cb_name,
                    iconCls: 'import user',
                    handler: function (me, e) { users.iimport(me, grid, cb_type) },
                    hidden: true
                }, {
                    text: '清除所有学生',
                    iconCls: 'delete user',
                    handler: function (me, e) { users.clear(me, grid) },
                    hidden: !is_student
                }, /*{
                    text: '调入',
                    iconCls: 'edituser',
                    handler: users.transIn
                }, */'->', {
                    xtype: 'combobox',
                    displayField: 'text',
                    valueField: 'value',
                    triggerAction: 'all',
                    hideLabel: true,
                    editable: false, queryMode: 'local',
                    name: 'type',
                    itemId: 'cb_type',
                    store: userplat.getStore(userplat.dict.userTypes, [-1, '所有用户...']),
                    value: cb_type,
                    disabled: is_student || is_teacher,
                    width: 100,
                    listeners: {
                        change: function (combo, newValue, oldValue) {
                            proxy.extraParams.type = newValue;
                            store.loadPage(1);
                        }
                    }
                }, {
                    xtype: 'combobox',
                    hideLabel: true,
                    store: userplat.getStore(userplat.dict.classes, [-1, "班级..."]),
                    displayField: 'text',
                    valueField: 'value',
                    editable: false,
                    value: -1,
                    width: 100,
                    triggerAction: 'all',
                    listeners: {
                        change: function (combo, newValue, oldValue) {
                            proxy.extraParams.klass = newValue;
                            store.loadPage(1);
                        }
                    },
                    hidden: !is_student
                }, {
                    xtype: 'combobox',
                    hideLabel: true,
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
                }, {
                    xtype: 'searchfield',
                    width: 150, hidden: user.version == 1,
                    emptyText: '组织机构',
                    store: store,
                    paramName: 'organization',
                    listeners: {
                        focus: userplat.showOrganizTree
                    }
                }, {
                    xtype: 'buttongroup',
                    items: [{
                        xtype: 'combobox',
                        hideLabel: true,
                        store: Ext.create('Ext.data.ArrayStore', {
                            fields: ['value', 'text'],
                            data: [
                                ['username', '按用户名查找'],
                                ['realname', '按姓名查找'],
                                ['identity', '按身份证查找']
                            ]
                        }),
                        displayField: 'text',
                        valueField: 'value',
                        name: 'searchtype',
                        editable: false,
                        value: 'username',
                        width: 100,
                        triggerAction: 'all',
                        listeners: {
                            change: function (combo, newValue, oldValue) {
                                proxy.extraParams.searchtype = newValue;
                            }
                        },
                        hidden: true
                    }, {
                        xtype: 'searchfield',
                        width: 150,
                        emptyText: '按用户名/姓名查找',
                        store: store,
                        paramName: 'query'
                    }]
                }]
            }),
            bbar: new Ext.PagingToolbar(userplat.getPagerConfig(store)),
            listeners: {
                itemdblclick: function (grid, row, e) {
                    users.add.call(grid.all.elements[e.rowIndex - 1].childNodes[1], row.data);
                },
                selectionchange: function (model, selected) {
                    Ext.getCmp('btn_delete_user').setDisabled(!selected.length).setText(selected.length ? ('删除选中的<b>' + selected.length + '</b>个' + cb_name) : '删除' + cb_name);
                    Ext.getCmp('btn_set_status').setDisabled(!selected.length);
                    Ext.getCmp('btn_edit_user').setDisabled(!selected.length);
                    if (btn_set_role.length) Ext.getCmp('btn_accredit_user').setDisabled(selected.length != 1);
                }
            }
        });

        function action(grid, td, rowIndex, columnIndex, event, modal, tr) {
            if (event.target.tagName === 'A') {
                switch (event.target.className) {
                    case 'transOut': users.transOut(event.target, modal.data); break;
                    case 'setAdmin': users.setAdmin(event.target, modal.data); break;
                }
            }
        }
    },
    clear: function (btn, grid) {
        Ext.MessageBox.show({
            animateTarget: btn,
            title: '操作确认', msg: '确定清除所有学生用户数据？',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn === 'ok') {
                    Ext.MessageBox.show({
                        left: 0, top: 0,
                        title: '再次确认', msg: '确定清除所有学生用户数据？<br><br>该操作将从数据库彻底清除学生数据，清除后无法恢复！',
                        buttons: Ext.MessageBox.OKCANCEL,
                        fn: function (btn) {
                            if (btn === 'ok') {
                                userplat.serviceAjax(service.clearStudents, {}, function (d) {
                                    grid.store.load();
                                    Ext.tips.show('提示', '操作成功');
                                }, masker.deleting(grid));
                            }
                        }
                    }).setPosition(10, 10, true);
                }
            }
        });
    },
    accredit: function (btn, user, grid) {
        var form = new Ext.form.Panel({
            region: 'center', bodyPadding: 10,
            items: [],
            buttons: [{
                text: '保存',
                handler: function () {
                    var values = form.getForm().getValues();
                    if (!values.roles) values.roles = [];
                    else if (!isNaN(values.roles)) values.roles = [values.roles];

                    userplat.serviceAjax(service.saveUserRole, { userId: user.id, roleIds: values.roles }, function (d) {
                        win.close();
                        Ext.tips.show('提示', '用户角色保存成功');
                        grid.store.reload();
                    }, masker.saving(form));
                }
            }, {
                text: '取消', handler: function () { win.close() }
            }]
        }), win = userplat.openWindow('用户授权：' + user.realname, 400, 300, [form], {
            animateTarget: btn,
            listeners: {
                show: function () {
                    userplat.serviceAjax(service.getUserRole, { uid: user.id }, function (d) {
                        var items = [];
                        Ext.each(d.data[1].data.rows, function (box, i) { items.push({ boxLabel: box.name, inputValue: box.id, name: 'roles' }) });
                        form.add({ xtype: 'checkboxgroup', fieldLabel: '可用角色列表', columns: 2, items: items });
                        form.getForm().setValues({ roles: d.data[0] });
                    }, masker.loading(form));
                }
            }
        });
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
        //#region
        //#endregion

        //var form = new Ext.FormPanel({
        //    region: 'center', bodyPadding: 10,
        //    items: [{
        //        xtype: 'filefield',
        //        name: 'file',
        //        margin: '30 0 20 0',
        //        fieldLabel: '上传文件', labelAlign: 'right', labelWidth: 70,
        //        msgTarget: 'side',
        //        allowBlank: false,
        //        anchor: '100%',
        //        buttonText: '选择文件...'
        //    }, {
        //        xtype: 'box',
        //        autoEl: {
        //            tag: 'div', style: { textAlign: 'center' },
        //            html: '<a href="import_student_format.csv">下载导入格式模板</a><br/><br/><br/><strong>目前只支持导入学生</strong>'
        //        }
        //    }],
        //    buttons: [{
        //        text: '开始导入',
        //        handler: function () {
        //            var form = this.up('form').getForm();
        //            if (form.isValid()) {
        //                form.submit({
        //                    url: service.importUsers,
        //                    waitMsg: '正在导入用户数据, 请稍候...',
        //                    success: function (f, o) {
        //                        Ext.tips.show('提示', '成功导入 ' + o.result.count + ' 个用户.');
        //                        win.close();
        //                        grid.store.loadPage(1);
        //                    },
        //                    failure: function (f, o) {
        //                        alert(o.result.msg);
        //                    }
        //                });
        //            }
        //        }
        //    }, {
        //        text: '取消',
        //        handler: function () { win.close() }
        //    }]
        //});
        //var win = userplat.openWindow('导入用户', 400, 300, [form], { animateTarget: btn });
    },
    edit: function (btn, e, modal, grid) {
        if (modal.getSelection().length == 0) { alert("请选择需要修改的用户"); return; }
        if (modal.getSelection().length > 1) { alert("一次只能修改一个用户"); return; }
        users.add.call(btn, modal.getSelection()[0].data);
    },
    add: function (data, type) {
        var required = userplat.required, me = this;
        Ext.apply(Ext.form.field.VTypes, {
            password: function (val, field) {
                if (field.initialPassField) {
                    return (val == field.up('form').down('#' + field.initialPassField).getValue());
                }
                return true;
            },
            passwordText: '两次输入的密码不一致'
        }); //
        var IS_STUDENT = (type || data.usertype) == constant.usertype.STUDENT;
        var title = data ? '编辑用户信息:' + data.realname + '(' + data.id + ')' : '添加新用户';
        var form, win = userplat.openWindow(title, 600, 330, [form = Ext.create('Ext.form.Panel', {
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
                        fieldLabel: IS_STUDENT ? '学号' : '登录名',
                        afterLabelTextTpl: !data ? required : '',
                        name: 'username', itemId: 'username',
                        readOnly: !!data, allowBlank: !!data
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '考号',
                        afterLabelTextTpl: required,
                        name: 'personNo', itemId: 'personNo',
                        hidden: !IS_STUDENT, allowBlank: !IS_STUDENT
                    }, {
                        xtype: 'textfield',
                        vtype: 'password',
                        inputType: 'password',
                        fieldLabel: '登录密码',
                        name: 'password',
                        itemId: 'password', hidden: IS_STUDENT,
                        afterLabelTextTpl: IS_STUDENT || data ? '' : required,
                        allowBlank: IS_STUDENT || data
                    }, {
                        xtype: 'textfield',
                        inputType: 'password',
                        vtype: 'password',
                        fieldLabel: '确认密码',
                        initialPassField: 'password',
                        name: 'password2', hidden: IS_STUDENT,
                        afterLabelTextTpl: IS_STUDENT || data ? '' : required,
                        allowBlank: IS_STUDENT || data
                    }, new Ext.form.TextField({
                        name: 'question',
                        fieldLabel: '安全问题', hidden: IS_STUDENT
                    }), new Ext.form.TextField({
                        name: 'answer',
                        fieldLabel: '安全问题答案', hidden: IS_STUDENT
                    }), new Ext.form.ComboBox({
                        name: 'status',
                        fieldLabel: '状态',
                        triggerAction: 'all',
                        editable: false,
                        mode: 'local',
                        value: 3,
                        store:  userplat.getStore(userplat.dict.userStatus),
                        displayField: 'text',
                        valueField: 'value'
                    })]
                }, {
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [{
                        xtype: 'combobox',
                        fieldLabel: '用户类型',
                        afterLabelTextTpl: required,
                        store: userplat.getStore(userplat.dict.userTypes),
                        displayField: 'text',
                        valueField: 'value',
                        editable: false, queryMode: 'local',                       
                        name: 'usertype',
                        itemId: 'usertype',
                        value: type,
                        readOnly: type == 2 || type == 3 || data,
                        hidden: IS_STUDENT
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
                        hidden: IS_STUDENT
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '真实姓名',
                        afterLabelTextTpl: required,
                        allowBlank: false,
                        blankText: '真实姓名不能为空',
                        name: 'realname',
                        itemId: 'realname'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '身份证号码',
                        allowBlank: true,
                        regex: /^\d{15}$|^\d{17}[x\d]$/i,
                        regexText: '身份证号码是15位数字或18位数字或17位数字+x',
                        name: 'identity',
                        itemId: 'identity',
                        hidden: IS_STUDENT
                    }, {
                        xtype: 'textfield',
                        afterLabelTextTpl: required,
                        fieldLabel: '所属机构',
                        name: 'organization',
                        itemId: 'organization',
                        allowBlank: user.version == 1,
                        blankText: '所属组织机构不能为空', hidden: user.version == 1 || IS_STUDENT,
                        listeners: {
                            focus: function (me) {
                                userplat.showOrganizTree(me, function (a, b) {
                                    form.getForm().setValues({ organization: a.id + ':' + a.name, department: b.id ? b.id + ':' + b.name : '' });
                                });
                            }
                        }
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '所在部门',
                        name: 'department',
                        itemId: 'department', hidden: user.version == 1 || IS_STUDENT,
                        readOnly: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '电子邮箱',
                        vtype: 'email',
                        name: 'email',
                        itemId: 'email', hidden: IS_STUDENT
                    }, {
                        xtype: 'datefield',
                        fieldLabel: '出生日期',
                        name: 'birthday',
                        itemId: 'birthday',
                        format: 'Y-m-d',
                        maxValue: new Date(), hidden: IS_STUDENT
                    }, {
                        xtype: 'combobox', hidden: (type || data.usertype) != constant.usertype.STUDENT,
                        fieldLabel: '所在班级', name: 'klass', itemId: 'klass',
                        store: userplat.getStore(userplat.dict.classes),
                        displayField: 'text', valueField: 'value',
                        editable: false, queryMode: 'local'
                    }]
                }]
            }],
            buttons: [{
                text: '详细信息',
                margin: '0 335 0 0',
                id: 'btn_detail',
                disabled: true, hidden: true,
                handler: function () {
                    win.close();
                    users.detail.call(me, data);
                }
            }, {
                text: '保存',
                formBind: true,
                disabled: true,
                handler: function () {
                    var values = this.up('form').getForm().getValues();
                    values.id = data ? data.id : 0;
                    if (values.password) values.password = Ext.String.trim(values.password);
                    delete values.password2;

                    userplat.serviceAjax(service.saveTeacherInfo, { user: values }, function (d) {
                        win.close();
                        userplat.activePanel.store.load();
                        if (data) {
                            Ext.tips.show('提示', '资料保存成功');
                        //} else {
                        //    Ext.MessageBox.confirm('提示', '新增用户成功, 是否继续填写详细资料?', function (btn) {
                        //        if (btn === 'yes') users.detail(Ext.Object.merge(values, { id: d.data }));
                        //    });
                        }
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
            Ext.getCmp('btn_detail').setDisabled(data.usertype != 2 && data.usertype != 3);
        }
    },
    detail: function (user) {
        var form = new Ext.form.Panel({
            bodyPadding: 10, height: 400,
            region: 'center',
            fieldDefaults: { labelAlign: 'right', labelWidth: 100 },
            items: [{
                xtype: 'container',
                anchor: '100%',
                layout: 'hbox',
                items: [{
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [{
                        xtype: 'combobox',
                        fieldLabel: '政治面貌',
                        displayField: 'text',
                        valueField: 'value',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: false, queryMode: 'local',
                        name: 'politic',
                        itemId: 'politic',
                        store: userplat.getStore(userplat.dict.userPolitics, [-1, "请选择..."])
                    }/*, {
                        xtype: 'combobox',
                        fieldLabel: '编制类别',
                        displayField: 'text',
                        valueField: 'value',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: false,
                        name: 'workout',
                        itemId: 'workout',
                        store: Ext.create('Ext.data.ArrayStore', {
                            fields: ['value', 'text'],
                            data: userplat.userWorkout
                        })
                    }*/, {
                        xtype: 'textfield',
                        fieldLabel: '英文名',
                        name: 'ename',
                        itemId: 'ename'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '籍贯',
                        name: 'birthplace',
                        itemId: 'birthplace'
                    }, {
                        xtype: 'combobox',
                        fieldLabel: '婚姻状况',
                        displayField: 'text',
                        valueField: 'value',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: false, queryMode: 'local',
                        name: 'marriage',
                        itemId: 'marriage',
                        store: userplat.getStore(userplat.dict.marriage, [-1, "请选择..."])
                    }, {
                        xtype: 'combobox',
                        fieldLabel: '宗教信仰',
                        displayField: 'text',
                        valueField: 'value',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: false, queryMode: 'local',
                        name: 'religion',
                        itemId: 'religion',
                        store: userplat.getStore(userplat.dict.religion, [-1, "请选择..."])
                    }, {
                        xtype: 'combobox',
                        fieldLabel: '是否独生子女',
                        displayField: 'text',
                        valueField: 'value',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: false,
                        name: 'onlychild',
                        itemId: 'onlychild',
                        store: userplat.getStore('yesno')
                    }]
                }, {
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [, {
                        xtype: 'textfield',
                        fieldLabel: '姓名拼音',
                        name: 'spellname',
                        itemId: 'spellname'
                    }, {
                        xtype: 'combobox',
                        fieldLabel: '民族',
                        displayField: 'text',
                        valueField: 'value',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: false, queryMode: 'local',
                        name: 'nation',
                        itemId: 'nation',
                        store: userplat.getStore(userplat.dict.nation, [-1, "请选择..."])
                    }, {
                        xtype: 'combobox',
                        fieldLabel: '健康状况',
                        displayField: 'text',
                        valueField: 'value',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: false, queryMode: 'local',
                        name: 'healthy',
                        itemId: 'healthy',
                        store: userplat.getStore(userplat.dict.healthy, [-1, "请选择..."])
                    }, {
                        xtype: 'combobox',
                        fieldLabel: '身份证件类型',
                        displayField: 'text',
                        valueField: 'value',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: false, queryMode: 'local',
                        name: 'icType',
                        itemId: 'icType',
                        store: userplat.getStore(userplat.dict.icType, [-1, "请选择..."])
                    }, {
                        xtype: 'datefield',
                        fieldLabel: '身份证有效期',
                        name: 'periodOfId',
                        itemId: 'periodOfId',
                        format: 'Y-m-d'
                    }, {
                        xtype: 'combobox',
                        fieldLabel: '血型',
                        displayField: 'text',
                        valueField: 'value',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: false, queryMode: 'local',
                        name: 'bloodType',
                        itemId: 'bloodType',
                        store: userplat.getStore(userplat.dict.bloodType, [-1, "请选择..."])
                    }, {
                        xtype: 'combobox',
                        fieldLabel: '港澳台侨外码',
                        displayField: 'text',
                        valueField: 'value',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: false, queryMode: 'local',
                        name: 'gatqwm',
                        itemId: 'gatqwm',
                        store: userplat.getStore(userplat.dict.gatqwm, [-1, "请选择..."])
                    }]
                }]
            }],
            buttons: [{
                text: '保存',
                formBind: true,
                disabled: true,
                handler: function () {
                    var values = form.getForm().getValues();
                    values.id = user.id;
                    userplat.serviceAjax(service.saveTeacherDetail, { teacher: values }, function (d) {
                        win.close();
                        Ext.tips.show('提示', '资料保存成功');
                    }, masker.saving(form));
                }
            }, {
                text: '取消',
                handler: function () { win.close() }
            }]
        });

        var studies_store, studies, works_store, works, xueji_store, xueji;

        studies = new Ext.grid.Panel({
            region: 'center',
            height: 401,
            emptyText: '没有符合条件的记录',
            viewConfig: {
                loadMask: true,
                loadingText: '正在加载数据...'
            },
            store: studies_store = Ext.create('Ext.data.Store', {
                fields: ['mark', 'attestor', 'degree', 'domain', 'content', 'school', 'end', 'start'],
                autoDestroy: true,
                proxy: Ext.create('Ext.data.WebServiceProxy', {
                    url: service.getStudies,
                    reader: {
                        type: 'json',
                        idProperty: 'id',
                        totalProperty: 'd.count',
                        root: 'd.data.rows'
                    },
                    extraParams: { uid: user.id }
                }), remoteSort: true, autoLoad: false,
                sorters: [{ property: 'id', direction: 'DESC' }]
            }),
            selModel: new Ext.selection.CheckboxModel(),
            columns: [
                { text: '学习单位', width: 200, dataIndex: 'school' },
                { text: '起始日期', width: 120, dataIndex: 'start' },
                { text: '结束日期', width: 120, dataIndex: 'end' }
            ],
            tbar: new Ext.toolbar.Toolbar({
                items: [{
                    text: '添加学习简历',
                    iconCls: 'adduser',
                    handler: function (me) { users.editStudy(null, studies_store, user.id); }
                }, {
                    text: '删除学习简历',
                    iconCls: 'deleteuser',
                    handler: function (me, e) {
                        users.removeStudies.call(me,
                            Ext.Array.map(studies.selModel.selected.items, function (x) { return x.data.id }),
                            studies_store,
                            studies)
                    },
                    disabled: true,
                    id: 'btn_delete_studies'
                }]
            }),
            listeners: {
                selectionchange: function (model, selected) {
                    Ext.getCmp('btn_delete_studies').setDisabled(!selected.length).setText(selected.length ? ('删除选中的<b>' + selected.length + '</b>个简历') : '删除学习简历');
                },
                itemdblclick: function (grid, item) {
                    users.editStudy(item.data, studies_store, user.id);
                }
            }
        });
        if (user.usertype == constant.usertype.TEACHER) works = new Ext.grid.Panel({
            region: 'center',
            height: 401,
            emptyText: '没有符合条件的记录',
            viewConfig: {
                loadMask: true,
                loadingText: '正在加载数据...'
            },
            store: works_store = Ext.create('Ext.data.Store', {
                fields: ['mark', 'attestor', 'duty_plc', 'duty_tech', 'content', 'company', 'end', 'start'],
                autoDestroy: true,
                proxy: Ext.create('Ext.data.WebServiceProxy', {
                    url: service.getWorks,
                    reader: {
                        type: 'json',
                        idProperty: 'id',
                        totalProperty: 'd.count',
                        root: 'd.data.rows'
                    },
                    extraParams: { uid: user.id }
                }), remoteSort: true, autoLoad: false,
                sorters: [{ property: 'id', direction: 'DESC' }]
            }),
            selModel: new Ext.selection.CheckboxModel(),
            columns: [
                { text: '工作单位', width: 200, dataIndex: 'company' },
                { text: '起始日期', width: 120, dataIndex: 'start' },
                { text: '结束日期', width: 120, dataIndex: 'end' }
            ],
            tbar: new Ext.toolbar.Toolbar({
                items: [{
                    text: '添加工作简历',
                    iconCls: 'adduser',
                    handler: function (me) { users.editWork(null, works_store, user.id); }
                }, {
                    text: '删除工作简历',
                    iconCls: 'deleteuser',
                    handler: function (me, e) {
                        users.removeWorks.call(me,
                            Ext.Array.map(works.selModel.selected.items, function (x) { return x.data.id }),
                            works_store,
                            works)
                    },
                    disabled: true,
                    id: 'btn_delete_works'
                }]
            }),
            listeners: {
                selectionchange: function (model, selected) {
                    Ext.getCmp('btn_delete_works').setDisabled(!selected.length).setText(selected.length ? ('删除选中的<b>' + selected.length + '</b>个简历') : '删除工作简历');
                },
                itemdblclick: function (grid, item) {
                    users.editWork(item.data, works_store, user.id)
                }
            }
        });
        if (user.usertype == constant.usertype.STUDENT) xueji = new Ext.grid.Panel({
            region: 'center',
            height: 401,
            emptyText: '没有符合条件的记录',
            store: xueji_store = Ext.create('Ext.data.Store', {
                fields: ['rn', 'xslbm', 'xz', 'zym', 'banji', 'niji', 'xsdqztm'],
                autoDestroy: true,
                proxy: Ext.create('Ext.data.WebServiceProxy', {
                    url: service.getXuejiList,
                    reader: {
                        type: 'json',
                        idProperty: 'id',
                        totalProperty: 'd.count',
                        root: 'd.data.rows'
                    },
                    extraParams: { uid: user.id }
                }), remoteSort: true, autoLoad: false,
                sorters: [{ property: 'id', direction: 'DESC' }]
            }),
            selModel: new Ext.selection.CheckboxModel(),
            columns: [
                { text: '入学年月', width: 200, dataIndex: 'rn' },
                { text: '所在班', width: 120, dataIndex: 'banji', renderer: function (v) { v = (v || ':').split(':'); return v.length > 1 ? v[1] : v[0] } },
                { text: '所在年级', width: 120, dataIndex: 'niji', renderer: function (v) { v = (v || ':').split(':'); return v.length > 1 ? v[1] : v[0] } }
            ],
            //tbar: new Ext.toolbar.Toolbar({
            //    items: [{
            //        text: '添加学籍信息',
            //        iconCls: 'adduser',
            //        handler: function (me) { users.editXueji(null, xueji_store, user.id); }
            //    }, {
            //        text: '删除学籍信息',
            //        iconCls: 'deleteuser',
            //        handler: function (me, e) {
            //            users.removeXuejis.call(me,
            //                Ext.Array.map(xueji.selModel.selected.items, function (x) { return x.data.id }),
            //                xueji_store,
            //                xueji)
            //        },
            //        disabled: true,
            //        id: 'btn_delete_xueji'
            //    }]
            //}),
            listeners: {
                //selectionchange: function (model, selected) {
                //    Ext.getCmp('btn_delete_xueji').setDisabled(!selected.length).setText(selected.length ? ('删除选中的<b>' + selected.length + '</b>个学籍信息') : '删除学籍信息');
                //},
                itemdblclick: function (grid, item) {
                    users.editXueji(item.data, xueji_store, user.id)
                }
            }
        });

        var items = [{ title: '详细信息', items: [form]}];
        studies && items.push({ title: '学习简历', items: [studies] });
        works && items.push({ title: '工作简历', items: [works] });
        xueji && items.push({ title: '学籍信息', items: [xueji] });

        var win = userplat.openWindow('编辑用户详细信息：' + user.realname + '(' + user.id + ')', 640, 480, [{
            xtype: 'tabpanel',
            width: 618, height: 438, bodyPadding: '5 5 5 5',
            items: items,
            listeners: {
                tabchange: function (me, tab) {
                    switch (tab.title) {
                        case '学习简历':
                        case '工作简历':
                        case '学籍信息':
                            if (!tab.items.items[0].store.data.items.length) {
                                tab.items.items[0].store.load();
                            }
                            break;
                    }
                }
            }
        }], {
            listeners: {
                show: function () {
                    userplat.serviceAjax(service.getUserInfo, { id: user.id }, function (d) {
                        form.getForm().setValues(d.data);
                    }, masker.loading(form));
                }
            }
        });
    },
    editXueji: function (data, store, uid) {
        var form = Ext.create('Ext.form.Panel', {
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
                        fieldLabel: '入学年月',
                        name: 'rn', readOnly: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '学生类别',
                        name: 'xslbm', readOnly: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '学制',
                        name: 'xz', readOnly: true
                    }]
                }, {
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '专业',
                        name: 'zym', readOnly: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '所在班',
                        name: 'banji', readOnly: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '所在年级',
                        name: 'niji', readOnly: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '学生当前状态',
                        name: 'xsdqztm', readOnly: true
                    }]
                }]
            }],
            buttons: [/*{
                text: '保存',
                formBind: true,
                disabled: true,
                handler: function () {
                    var values = form.getForm().getValues();
                    values.uid = uid;
                    values.id = data ? data.id : 0;

                    userplat.serviceAjax(service.saveXueji, { xueji: values }, function (d) {
                        store.load();
                        Ext.tips.show('提示', '资料保存成功');
                        win.close();
                    }, masker.saving(form));
                }
            }, */{
                text: '关闭',
                handler: function () { win.close() }
            }]
        });
        var win = userplat.openWindow('查看学籍信息', 640, 360, [form], {
            listeners: {
                show: function () {
                    if (data) form.getForm().setValues(data);
                }
            }
        });
    },
    removeXuejis: function (data, store, grid) {
        Ext.MessageBox.show({
            animateTarget: this,
            title: '操作确认', msg: '确定删除选中的 <b>' + data.length + '</b> 个学籍信息？',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn === 'ok') {
                    userplat.serviceAjax(service.deleteXueji, {
                        ids: data
                    }, function (d) {
                        store.load();
                        Ext.tips.show('提示', '操作成功');
                    }, masker.deleting(grid));
                }
            }
        });
    },
    editStudy: function (data, store, uid) {
        var form = Ext.create('Ext.form.Panel', {
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
                        xtype: 'datefield', format: 'Y-m-d',
                        fieldLabel: '起始日期',
                        name: 'start',
                        afterLabelTextTpl: userplat.required, allowBlank: false, blankText: '起始日期不能为空'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '学习单位',
                        name: 'school',
                        afterLabelTextTpl: userplat.required, allowBlank: false, blankText: '学习单位不能为空'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '专业名称',
                        name: 'domain'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '证明人',
                        name: 'attestor'
                    }]
                }, {
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [{
                        xtype: 'datefield', format: 'Y-m-d',
                        fieldLabel: '结束日期',
                        name: 'end',
                        afterLabelTextTpl: userplat.required, allowBlank: false, blankText: '结束日期不能为空'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '学习内容',
                        name: 'content'
                    }, {
                        xtype: 'combobox',
                        fieldLabel: '所获学位',
                        displayField: 'text',
                        valueField: 'value',
                        triggerAction: 'all',
                        editable: false, queryMode: 'local',
                        name: 'degree',
                        itemId: 'degree',
                        store: userplat.getStore(userplat.dict.degree, [-1, '请选择...'])
                    }]
                }]
            }, {
                xtype: 'textfield',
                fieldLabel: '备注',
                name: 'mark',
                width: 553
            }],
            buttons: [{
                text: '保存',
                formBind: true,
                disabled: true,
                handler: function () {
                    var values = form.getForm().getValues();
                    values.id = data ? data.id : 0;
                    values.uid = uid;

                    userplat.serviceAjax(service.saveStudy, { resume: values }, function (d) {
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
        var win = userplat.openWindow('编辑简历信息', 640, 360, [form], {
            listeners: {
                show: function () { if (data) form.getForm().setValues(data); }
            }
        });
    },
    removeStudies: function (data, store, grid) {
        Ext.MessageBox.show({
            animateTarget: this,
            title: '操作确认', msg: '确定删除选中的 <b>' + data.length + '</b> 个学习简历？',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn === 'ok') {
                    userplat.serviceAjax(service.deleteStudies, {
                        ids: data
                    }, function (d) {
                        store.load();
                        Ext.tips.show('提示', '操作成功');
                    }, masker.deleting(grid));
                }
            }
        });
    },
    editWork: function (data, store, uid) {
        var form = Ext.create('Ext.form.Panel', {
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
                        xtype: 'datefield', format: 'Y-m-d',
                        fieldLabel: '起始日期',
                        name: 'start',
                        afterLabelTextTpl: userplat.required, allowBlank: false, blankText: '起始日期不能为空'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '工作单位',
                        name: 'company',
                        afterLabelTextTpl: userplat.required, allowBlank: false, blankText: '工作单位不能为空'
                    }, {
                        xtype: 'combobox',
                        fieldLabel: '党政职务',
                        displayField: 'text',
                        valueField: 'value',
                        triggerAction: 'all',
                        editable: false, queryMode: 'local',
                        name: 'duty_plc',
                        itemId: 'duty_plc',
                        store: userplat.getStore(userplat.dict.dutyPoli, [-1, '请选择...'])
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '证明人',
                        name: 'attestor'
                    }]
                }, {
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [{
                        xtype: 'datefield', format: 'Y-m-d',
                        fieldLabel: '结束日期',
                        name: 'end'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '工作内容',
                        name: 'content'
                    }, {
                        xtype: 'combobox',
                        fieldLabel: '技术职务',
                        displayField: 'text', valueField: 'value', triggerAction: 'all', editable: false, queryMode: 'local',
                        name: 'duty_tech',
                        itemId: 'duty_tech',
                        store: userplat.getStore(userplat.dict.dutyTech, [-1, '请选择...'])
                    }]
                }]
            }, {
                xtype: 'textfield',
                fieldLabel: '备注',
                name: 'mark',
                width: 553
            }],
            buttons: [{
                text: '保存',
                formBind: true,
                disabled: true,
                handler: function () {
                    var values = form.getForm().getValues();
                    values.id = data ? data.id : 0;
                    values.uid = uid;

                    userplat.serviceAjax(service.saveWork, { resume: values }, function (d) {
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
        var win = userplat.openWindow('编辑简历信息', 640, 360, [form], {
            listeners: {
                show: function () { if (data) form.getForm().setValues(data); }
            }
        });
    },
    removeWorks: function (data, store, grid) {
        Ext.MessageBox.show({
            animateTarget: this,
            title: '操作确认', msg: '确定删除选中的 <b>' + data.length + '</b> 个工作简历？',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn === 'ok') {
                    userplat.serviceAjax(service.deleteWorks, {
                        ids: data
                    }, function (d) {
                        store.load();
                        Ext.tips.show('提示', '操作成功');
                    }, masker.deleting(grid));
                }
            }
        });
    },
    remove: function (btn, e, modal, grid) {
        var selected = Ext.Array.map(modal.getSelection(), function (x) { return x.data.id });
        Ext.MessageBox.show({
            animateTarget: btn,
            title: '操作确认', msg: '确定删除选中的 <b>' + selected.length + '</b> 行数据?',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn === 'ok') {
                    userplat.serviceAjax(service.deleteTeachers, {
                        ids: selected, check: true
                    }, function (d) {
                        if (d.msg) {
                            Ext.MessageBox.show({
                                title: '操作确认',
                                msg: d.msg+'<br><br><br>是否强行删除？',
                                buttons: Ext.MessageBox.OKCANCEL,
                                fn: function (btn) {
                                    if (btn === 'ok') {
                                        userplat.serviceAjax(service.deleteTeachers, {
                                            ids: selected, check: false
                                        }, function (d) {
                                            modal.store.load();
                                            Ext.tips.show('提示', '操作成功');
                                        });
                                    }
                                }
                            });
                        } else {
                            modal.store.load();
                            Ext.tips.show('提示', '操作成功');
                        }
                    }, masker.deleting(grid));
                }
            }
        });
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
    transOut: function (btn, data) {
        var me = this;
        var form, win = userplat.openWindow('调出用户：' + data.realname, 400, 300, [form = Ext.create('Ext.form.Panel', {
            region: 'center',
            bodyPadding: 10,
            fieldDefaults: { labelAlign: 'right' },
            items: [new Ext.form.TextField({
                name: 'transNo',
                fieldLabel: '异动编号',
                width: 300
            }), new Ext.form.ComboBox({
                name: 'transResponse',
                fieldLabel: '异动原因',
                triggerAction: 'all',
                mode: 'local',
                displayField: 'text',
                valueField: 'value',
                store: userplat.getStore(userplat.dict.transReason),
                width: 300
            }), new Ext.form.ComboBox({
                name: 'transType',
                fieldLabel: '异动类型',
                triggerAction: 'all',
                mode: 'local',
                displayField: 'text',
                valueField: 'value',
                store: userplat.getStore(userplat.dict.transType),
                width: 300
            }), new Ext.form.TextField({
                name: 'transRapper',
                fieldLabel: '证明人',
                width: 300
            }), new Ext.form.TextField({
                name: 'transSource',
                fieldLabel: '异动源',
                width: 300
            })],
            buttons: [{
                text: '确定调出',
                handler: function () {
                    var values = form.getForm().getValues();
                    values.uid = data.id;
                    userplat.serviceAjax(service.transferOut, values, function (d) {
                        Ext.tips.show('提示', '操作成功');
                        me.store.load();
                        win.close();
                    }, masker.saving(form));
                }
            }, {
                text: '取消',
                handler: function () { win.close() }
            }]
        })], { animateTarget: btn });
    },
    transIn: function () {
        var grid, store, proxy;
        userplat.openWindow('调入用户', 900, 500, [grid = new Ext.grid.Panel({
            region: 'center',
            waitMsgTarget: true,
            viewConfig: { loadMask: true, loadingText: '正在加载数据...' },
            selModel: new Ext.selection.CheckboxModel(),
            columns: [
                { sortable: false, text: "用户名", width: 160, dataIndex: 'username' },
                { sortable: false, text: "真实姓名", width: 100, dataIndex: 'realname' },
                { sortable: false, text: "调出单位", width: 200, dataIndex: 'origin_organization' },
                { sortable: false, text: "身份证号码", width: 200, dataIndex: 'identity' },
                { sortable: false, text: "用户类别", width: 80, dataIndex: 'usertype', renderer: function (v) { return userplat.stores.get(userplat.userTypes, v) } }
            ],
            store: store = Ext.create('Ext.data.Store', {
                fields: ['username', 'realname', 'usertype', 'identity', 'origin_organization'],
                remoteSort: true, autoDestroy: true, autoLoad: true,
                sorters: [{
                    property: 'id',
                    direction: 'DESC'
                }], proxy: proxy = Ext.create('Ext.data.WebServiceProxy', {
                    url: service.getInorganizedTeacherList,
                    reader: {
                        type: 'json',
                        idProperty: 'id',
                        totalProperty: 'd.count',
                        root: 'd.data.rows'
                    },
                    extraParams: { query: '', origin_organization: '', searchtype: 'username' }
                })
            }),
            tbar: new Ext.toolbar.Toolbar({
                items: [{
                    xtype: 'buttongroup',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '调入目的地', labelAlign: 'right', labelWidth: 70,
                        emptyText: '组织机构',
                        id: 'trans_to',
                        readOnly: true,
                        listeners: {
                            focus: userplat.showOrganizTree
                        }
                    }, {
                        xtype: 'button',
                        text: '调入',
                        handler: function () {
                            var selected = grid.getSelectionModel().selected.items;
                            if (!selected.length) return Ext.MessageBox.alert('提示', '请选择要调动的用户');
                            var trans_to = Ext.getCmp('trans_to').value;
                            if (!trans_to) return Ext.MessageBox.alert('提示', '请选择调入目标机构');

                            selected = Ext.Array.map(selected, function (x) { return x.data.id });
                            trans_to = trans_to.split(':');

                            Ext.MessageBox.show({
                                animateTarget: this,
                                title: '操作确认', msg: '确定调入选中的 <b>' + selected.length + '</b> 个用户到 <b>' + trans_to[1] + '</b>?',
                                buttons: Ext.MessageBox.OKCANCEL,
                                fn: function (btn) {
                                    if (btn === 'ok') {
                                        userplat.serviceAjax(service.transferIn, {
                                            ids: selected,
                                            target: parseInt(trans_to[0])
                                        }, function (d) {
                                            store.load();
                                            Ext.tips.show('提示', '操作成功');
                                        }, masker.saving(grid));
                                    }
                                }
                            });
                        }
                    }]
                }, '->', {
                    xtype: 'searchfield',
                    width: 150,
                    emptyText: '调出的组织机构',
                    store: store,
                    paramName: 'origin_organization',
                    listeners: {
                        focus: userplat.showOrganizTree
                    }
                }, {
                    xtype: 'buttongroup',
                    items: [{
                        xtype: 'combobox',
                        hideLabel: true,
                        store: Ext.create('Ext.data.ArrayStore', {
                            fields: ['value', 'text'],
                            data: [
                            ['username', '用户名'],
                            ['realname', '姓名'],
                            ['identity', '身份证']
                        ]
                        }),
                        displayField: 'text',
                        valueField: 'value',
                        name: 'searchtype',
                        editable: false,
                        value: 'username',
                        width: 64,
                        triggerAction: 'all',
                        listeners: {
                            change: function (combo, newValue, oldValue) {
                                proxy.extraParams.searchtype = newValue;
                            }
                        }
                    }, {
                        xtype: 'searchfield',
                        width: 150,
                        emptyText: '查询关键字',
                        store: store,
                        paramName: 'query'
                    }]
                }]
            })
        })], { animateTarget: this });
    },
    setAdmin: function (btn, data) {
        var admind = {};

        var form = Ext.create('Ext.panel.Panel', {
            width: 520, height: 324, layout: 'border',
            items: [{
                xtype: 'treepanel',
                region: 'west', flex: .5,
                useArrows: true, margins: '-1 0 -1 -1',
                store: Ext.create('Ext.data.TreeStore', {
                    proxy: Ext.create('Ext.data.WebServiceProxy', {
                        url: service.getOrganizeTree,
                        reader: { type: 'json', root: 'd' }
                    }),
                    autoLoad: true,
                    nodeParam: 'root'
                }),
                columns: [{
                    xtype: 'treecolumn',
                    text: '可选范围',
                    sortable: false,
                    dataIndex: 'text',
                    width: 190
                }, {
                    xtype: 'templatecolumn',
                    tpl: '<a href="javascript:;" class="selectArea">选择</a>',
                    sortable: false,
                    dataIndex: 'id',
                    flex: 1,
                    listeners: {
                        click: function (grid, td, rowIndex, columnIndex, event, modal, tr) {
                            var id = modal.data.id.toString(), text = [], path = [];
                            if ($(event.target).is('a.selectArea')) {
                                do { text.push(modal.data.text), path.push(modal.data.id); }
                                while (modal = modal.parentNode, modal.data.text != '.');

                                text = text.reverse().join('>');
                                path = '>' + path.reverse().join('>') + '>';

                                for (var x in admind) {
                                    if (admind[x].path.substr(0, path.length) == path) {
                                        delete admind[x];
                                    } else if (path.substr(0, admind[x].path.length) == admind[x].path) {
                                        return Ext.MessageBox.alert('提示', '已经具有"' + admind[x].text + '"的管理权限');
                                    }
                                }

                                admind[id] = { text: text, path: path }
                                init_box();
                            }
                        }
                    }
                }],
                root: { id: 0, text: '.', expanded: true },
                rootVisible: false
            }, Ext.create('Ext.Component', {
                flex: .5, region: 'center',
                style: {backgroundColor:'white'},
                autoEl: {
                    tag: 'div',
                    html: '<label style="padding:6px;display:block;background:#dfe9f5">已经选择的管理区域：</label><div id="admind" style="padding:6px 0 0 6px;height:295px;"></div>'
                }
            })]
        });
        var win = userplat.openWindow('管理员权限范围选择：' + data.realname + '(' + data.username + ')', 542, 395, [form], {
            animateTarget: btn,
            listeners: {
                show: function () {
                    userplat.serviceAjax(service.getControldAreas, { uid: data.id }, function (d) {
                        Ext.each(d.data, function (item, i) {
                            admind[item.path.split('>').reverse()[0]] = { path: '>' + item.path + '>', text: item.pathtext }
                        });
                        init_box();
                    }, masker.loading(form));
                }
            },
            buttons: [{
                text: '保存',
                handler: function () {
                    var bgroup = Ext.getDom('admind').getElementsByTagName('INPUT'), values = [];
                    for (var i = 0; i < bgroup.length; i++) {
                        if (bgroup[i].checked) values.push(parseInt(bgroup[i].value));
                    }
                    if (values.length === 0) {
                        return Ext.tips.show('提示', '没有选择管理区域...');
                    }

                    userplat.serviceAjax(service.setAreaAdmin, { uid: data.id, areas: values }, function (d) {
                        win.close();
                        Ext.tips.show('提示', '管理区域保存成功');
                    }, masker.saving(form));
                }
            }, {
                text: '取消',
                handler: function () { win.close() }
            }]
        });

        function init_box() {
            var html = [];
            for (var x in admind) {
                html.push('<label for="admind_' + x + '" style="margin:6px 0 0 6px;display:block;"><input style="vertical-align:middle" type="checkbox" id="admind_' + x + '" name="admind" value="' + x + '" checked="checked"/> ' + admind[x].text + '</label>');
            }
            Ext.getDom('admind').innerHTML = html.join('');
        }
    }
}
