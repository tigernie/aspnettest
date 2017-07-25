/// <reference path="../userplat.js" />
//Ext.require([
//    'Ext.tree.*',
//    'Ext.data.*'
//]);
rolemgr = {
    initialize: function (args) {
        var proxy = Ext.create('Ext.data.WebServiceProxy', {
            url: service.getRoleList,
            reader: {
                type: 'json',
                idProperty: 'id',
                totalProperty: 'd.count',
                root: 'd.data.rows'
            },
            extraParams: { query: '', type: '' }
        }),
        store = Ext.create('Ext.data.Store', {
            fields: ['name', 'role', 'roles', 'inner'],
            autoDestroy: true,
            proxy: proxy, remoteSort: true, autoLoad: true
        }),
        columns = [
            { sortable: false, text: "角色名", width: 160, dataIndex: 'name' },
            { sortable: false, text: '角色类型', width: 100, dataIndex: 'inner', renderer: function (value) { return value ? '系统内置' : '用户定义' } },
            {
                sortable: false, text: "权限范围", flex: 1, dataIndex: 'role', renderer: function (value, meta, record) {
                    meta.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            }
        ],
        tbar = new Ext.toolbar.Toolbar({
            layout: { overflowHandler: 'Menu' },
            items: [{
                text: '添加角色',
                iconCls: 'add role',
                handler: function (me) {
                    rolemgr.edit(me, null, grid);
                }
            }, {
                text: '修改角色',
                iconCls: 'edit',
                disabled: true,
                id: 'btn_edit_role',
                handler: function (me,e) { rolemgr.modify.call(null, me, e, grid.getSelectionModel(), grid); }
             },{
                text: '删除角色',
                iconCls: 'delete role',
                handler: function (me) {
                    rolemgr.remove(me,
                            Ext.Array.map(grid.selModel.selected.items, function (x) { return x.data.id }),
                            store,
                            grid)
                },
                disabled: true,
                id: 'btn_delete_roles'
            }]
        }),
        grid = new Ext.grid.Panel({
            title: args.text,
            region: 'center', margins: '5 5 5 0',
            emptyText: '没有符合条件的记录',
            selModel: new Ext.selection.CheckboxModel(),
            store: store,
            columns: columns,
            tbar: tbar,
            bbar: new Ext.PagingToolbar(userplat.getPagerConfig(store)),
            listeners: {
                itemdblclick: function (grid, row, e) {
                    //if (row.data.inner) return Ext.tips.show('警告', '不可编辑系统内置角色：' + row.data.name.bold());
                    rolemgr.edit(grid.all.elements[e.rowIndex - 1].childNodes[1], row.data, grid);
                },
                selectionchange: function (model, selected) {
                    var disabled = !selected.length;
                    Ext.getCmp('btn_edit_role').setDisabled(disabled);
                    Ext.each(selected, function (row) { if (row.data.inner) disabled = true });
                    Ext.getCmp('btn_delete_roles').setDisabled(disabled).setText(disabled ? '删除角色' : ('删除选中的<b>' + selected.length + '</b>个角色'));                                       
                }
            }
        });
        return grid;
    },
    modify: function (btn, e, modal, grid) {
        if (modal.getSelection().length == 0) { alert("请选择需要修改的角色"); return; }
        if (modal.getSelection().length > 1) { alert("一次只能修改一个角色"); return; }        
        rolemgr.edit.call(btn,btn, modal.getSelection()[0].data, grid);
    },   
    edit: function (btn, data, grid) {
        var form = new Ext.form.Panel({
            region: 'center', bodyPadding: 10,
            overflowY: 'auto',
            fieldDefaults: { labelAlign: 'right' },
            items: [{
                xtype: 'textfield',
                fieldLabel: '角色名称',
                name: 'name', readOnly: data && data.inner,
                afterLabelTextTpl: userplat.required, allowBlank: false, blankText: '角色名称不能为空'
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: '权限列表',
                height: 275,
                items: [{
                    xtype: 'treepanel', height: 275, id: 'rolestree',
                    rootVisible: false, useArrows: true,
                    store: new Ext.data.TreeStore({
                        root: {
                            expanded: true,
                            children: [{
                                //#region 题库管理
                                text: '题库管理', id: 25, checked: false, expanded: false,
                                children: [{
                                    text: '试题管理', id: 21, checked: false, expanded: false,
                                    children: [{
                                        text: '删除试题', id: 1, checked: false, leaf: true
                                    }, {
                                        text: '修改试题', id: 2, checked: false, leaf: true
                                    }, {
                                        text: '新增试题', id: 3, checked: false, leaf: true
                                    }, {
                                        text: '导入试题', id: 4, checked: false, leaf: true
                                    }, {
                                        text: '收藏试题', id: 5, checked: false, leaf: true
                                    }]
                                }, {
                                    text: '套卷管理', id: 22, checked: false, expanded: false,
                                    children: [{
                                        text: '导入套卷', id: 6, checked: false, leaf: true
                                    }, {
                                        text: '删除套卷', id: 7, checked: false, leaf: true
                                    }, {
                                        text: '修改套卷', id: 8, checked: false, leaf: true
                                    }]
                                }, {
                                    text: '题库结构管理', id: 9, checked: false, leaf: true
                                }, {
                                    text: '试题审核', id: 10, checked: false, leaf: true
                                }, {
                                    text: '题库统计', id: 11, checked: false, leaf: true
                                }],
                                //#endregion
                            }, {
                                //#region 组卷管理
                                text: '组卷管理', id: 26, checked: false, expanded: false,
                                children: [{
                                    text: '组卷方案管理', id: 23, checked: false, expanded: false,
                                    children: [{
                                        text: '创建组卷方案', id: 12, checked: false, leaf: true, qtip: '拥有创建方案和管理自己创建的方案的权限'
                                    }, {
                                        text: '管理组卷方案', id: 13, checked: false, leaf: true
                                    }]
                                }, {
                                    text: '试卷管理', id: 24, checked: false, expanded: false,
                                    children: [{
                                        text: '创建试卷', id: 14, checked: false, leaf: true, qtip: '拥有创建试卷和管理自己创建的试卷的权限'
                                    }, {
                                        text: '管理试卷', id: 15, checked: false, leaf: true
                                    }]
                                }]
                                //#endregion
                            }, {
                                //#region 考务管理
                                text: '考务管理', id: 27, checked: false, expanded: false,
                                children: [{
                                    text: '创建考试', id: 16, checked: false, leaf: true, qtip: '拥有创建考试和管理自己创建的考试的权限'
                                }, {
                                    text: '管理考务', id: 17, checked: false, leaf: true
                                }]
                                //#endregion
                            }, {
                                //#region 系统管理
                                text: '系统管理', id: 28, checked: false, expanded: false,
                                children: [{
                                    text: '用户及权限管理', id: 18, checked: false, leaf: true
                                }, {
                                    text: '组织机构管理', id: 19, checked: false, leaf: true
                                }, {
                                    text: '系统设置管理', id: 20, checked: false, leaf: true
                                }]
                                //#endregion
                            }]
                        }
                    }),
                    listeners: {
                        checkchange: function (node, checked) {
                            //#region 特殊节点处理
                            if (Ext.Array.contains([13, 15, 17], node.raw.id) && checked) {
                                node.parentNode.set({ checked: true });
                                this.fireEvent('checkchange', node.parentNode, true);
                            }
                            if (Ext.Array.contains([12, 14, 16], node.raw.id) && !checked) {
                                return false;
                            }
                            //#endregion
                            //#region 向上选择
                            (function (node, checked) {
                                node[checked ? 'expand' : 'collapse']();
                                node.set({ checked: checked });
                                if (node.hasChildNodes()) {
                                    var callee = arguments.callee;
                                    node.eachChild(function (node) {
                                        callee(node, checked);
                                    });
                                }
                            })(node, checked);
                            //#endregion
                            //#region 向下选择
                            (function (node, checked) {
                                node.set({ checked: checked });

                                if (node.parentNode) {
                                    var parentNode = node.parentNode;

                                    if (checked) {
                                        var flag = true;
                                        parentNode.eachChild(function (child) { if (!child.data.checked) flag = false });
                                        if (flag) arguments.callee(parentNode, true);
                                    } else {
                                        arguments.callee(parentNode, false);
                                    }
                                }
                            })(node, checked);
                            //#endregion
                        },
                        afterrender: function () {
                            if (data) {
                                var me = this;
                                setTimeout(function () { delayer(me.getRootNode()) }, 400);

                                function delayer(node) {
                                    if (Ext.Array.contains(data.roles, node.raw.id)) {
                                        node.set({ checked: true });
                                        me.fireEvent('checkchange', node, true);
                                        (function (node) {
                                            if (!node.parentNode) return;
                                            node.parentNode.expand();
                                            arguments.callee(node.parentNode);
                                        })(node);
                                    }
                                    node.eachChild(arguments.callee);
                                }
                            }
                        }
                    }
                }]
            }],
            buttons: [{
                text: '保存',
                formBind: true,
                //disabled: true,
                hidden: data && data.inner,
                handler: function (btn, e) {
                    btn.setDisabled(true);

                    var values = form.getForm().getValues();
                    values.id = data ? data.id : 0;
                    values.roles = [];

                    Ext.each(Ext.getCmp('rolestree').getChecked(), function (node, i) { if (node.data.leaf) values.roles.push(node.raw.id) });
                    userplat.serviceAjax(service.saveRoleInfo, { role: values }, function (d) {
                        win.destroy();
                        grid.store.load();
                        Ext.tips.show('提示', '角色保存成功');
                    }, masker.saving(form));
                }
            }, {
                text: data && data.inner ? '关闭' : '取消',
                handler: function () { win.close() }
            }]
        }), win = userplat.openWindow('添加角色', 400, 400, [form], {
            animateTarget: btn,
            listeners: {
                show: function () {
                    form.getForm().setValues(data);
                    data && win.setTitle('编辑角色：' + data.name);
                }
            }
        });
    },
    remove: function (btn, data, store, grid) {
        Ext.MessageBox.show({
            animateTarget: btn,
            title: '操作确认', msg: '确定删除选中的<b>' + data.length + '</b>个角色？',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn === 'ok') {
                    userplat.serviceAjax(service.deleteRole, {
                        ids: data
                    }, function (d) {
                        grid.store.load();
                        Ext.tips.show('提示', '删除成功');
                    }, masker.deleting(grid));
                }
            }
        });
    }
}