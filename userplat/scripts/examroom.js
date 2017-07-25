/// <reference path="../userplat.js" />

examroom = {
    initialize: function (args) {
        var proxy = new Ext.data.WebServiceProxy({
            url: service.getRoomList,
            reader: {
                type: 'json',
                idProperty: 'id',
                totalProperty: 'd.count',
                root: 'd.data.rows'
            },
            extraParams: { schoolId: 0 }
        }),
        store = new Ext.data.Store({
            fields: ['name', 'count', 'location', 'ip'],
            autoDestroy: true,
            proxy: proxy, remoteSort: true, autoLoad: true
        }),
        columns = [
            { sortable: false, text: "考场名称", width: 160, dataIndex: 'name' },
            { sortable: false, text: "考场位置", width: 160, dataIndex: 'location' },
            { sortable: false, text: "机位数", width: 60, dataIndex: 'count' },
            { sortable: false, text: "IP范围", width: 240, dataIndex: 'ip' }
        ],
        tbar = new Ext.toolbar.Toolbar({
            items: [{
                text: '添加考场',
                iconCls: 'add sence',
                handler: function (me, e) {
                    examroom.edit(me, null, grid);
                }
            }, {
                text: '删除考场',
                iconCls: 'delete sence',
                handler: function (me) {
                    examroom.remove(me,
                            Ext.Array.map(grid.selModel.selected.items, function (x) { return x.data.id }),
                            grid)
                },
                disabled: true,
                id: 'btn_delete_sence'
            }]
        }),
        grid = new Ext.grid.Panel({
            disabled: true,
            region: 'center', margins: '-1',
            emptyText: '没有符合条件的记录',
            selModel: new Ext.selection.CheckboxModel(),
            store: store,
            columns: columns,
            tbar: tbar,
            bbar: new Ext.PagingToolbar(userplat.getPagerConfig(store)),
            listeners: {
                itemdblclick: function (grid, row, e) {
                    examroom.edit(grid.all.elements[e.rowIndex - 1].childNodes[1], row.data, grid);
                },
                selectionchange: function (model, selected) {
                    Ext.getCmp('btn_delete_sence').setDisabled(!selected.length).setText(selected.length ? ('删除选中的<b>' + selected.length + '</b>个考场') : '删除考场');
                }
            }
        }),
        tree = new Ext.tree.Panel({
            tbar: { items: ['<label style="line-height:22px">单位列表</label>'] },
            width: 240, region: 'west', margins: '-1 0 -1 -1',
            useArrows: true,
            store: new Ext.data.TreeStore({
                proxy: new Ext.data.WebServiceProxy({
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
                    grid.setDisabled(node.raw.type == 'org');

                    if (node.raw.type == 'school') {
                        proxy.extraParams.schoolId = node.data.id;
                        store.loadPage(1);
                    }
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
    remove: function (btn, data, grid) {
        Ext.MessageBox.show({
            animateTarget: btn,
            title: '操作确认', msg: '确定删除选中的<b>' + data.length + '</b>个考场？',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn === 'ok') {
                    userplat.serviceAjax(service.deleteRoom, {
                        ids: data
                    }, function (d) {
                        grid.store.load();
                        Ext.tips.show('提示', '删除成功');
                    }, masker.deleting(grid));
                }
            }
        });
    },
    edit: function (btn, data, grid) {
        var form = new Ext.form.Panel( {
            region: 'center', bodyPadding: 10,
            fieldDefaults: { labelAlign: 'right' },
            items: [{
                xtype: 'textfield',
                fieldLabel: '考场名称',
                afterLabelTextTpl: userplat.required, allowBlank: false, blankText: '考场名称不能为空',
                name: 'name', itemId: 'name'
            }, {
                xtype: 'textfield',
                fieldLabel: '考场位置',
                afterLabelTextTpl: userplat.required, allowBlank: false, blankText: '考场位置不能为空',
                name: 'location', itemId: 'location'
            }, {
                xtype: 'numberfield',
                fieldLabel: '机位数',
                afterLabelTextTpl: userplat.required, allowBlank: false, blankText: '机位数不能为空',
                name: 'count', itemId: 'count', minValue: 1
            }, {
                xtype: 'textfield',
                fieldLabel: 'IP起始于',
                name: 'ip', itemId: 'ip',
                regex: /^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/,regexText: 'IP地址格式不对'
            }, {
                xtype: 'textfield',
                fieldLabel: 'IP终止于',
                name: 'ip2', itemId: 'ip2',
                regex: /^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/, regexText: 'IP地址格式不对'
            }],
            buttons: [{
                text: '保存',
                formBind: true,
                disabled: true,
                handler: function (btn, e) {
                    btn.setDisabled(true);

                    var values = form.getForm().getValues();
                    values.id = data ? data.id : 0;
                    values.schoolId = grid.store.proxy.extraParams.schoolId;

                    values.ip = [values.ip, values.ip2].join('-');
                    delete values.ip2;

                    userplat.serviceAjax(service.saveRoom, { room: values }, function (d) {
                        win.close();
                        grid.store.load();
                        Ext.tips.show('提示', '资料保存成功');
                    }, masker.saving(form));
                }
            }, {
                text: '取消',
                handler: function () { win.close() }
            }]
        }), win = userplat.openWindow(data ? '编辑考场：'+data.name : '添加考场', 400, 300, [form], {
            animateTarget: btn,
            listeners: {
                show: function () {
                    if (data) {
                        var ips = data.ip.split('-');
                        data.ip = ips[0];
                        data.ip2 = ips[1] || '';
                        form.getForm().setValues(data);
                    }
                }
            }
        });
    }
};
