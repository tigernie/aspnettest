/// <reference path="../userplat.js" />

dbmgr = {
    initialize: function (args) {
        var me = this,
            grid,
            form,
            store = Ext.create('Ext.data.Store', {
                fields: ['time', 'name', 'status', 'remark'],
                autoDestroy: true,
                proxy: Ext.create('Ext.data.WebServiceProxy', {
                    url: service.getBackupList,
                    reader: {
                        type: 'json',
                        idProperty: 'id',
                        totalProperty: 'd.count',
                        root: 'd.data.rows'
                    }
                }), remoteSort: true, autoLoad: true
            });

        return Ext.create('Ext.panel.Panel', {
            region: 'center', margins: '5 5 5 0', bodyPaddings: 0, layout: 'border',
            items: [form = new Ext.form.Panel({
                title: '自动备份设置',
                region: 'west',
                width: 300,
                collapsible: true,
                margins: '-1 -1 -1 -1', bodyPadding: 10,
                tbar: {
                    items: [{
                        text: '保存设置',
                        iconCls: 'save settings',
                        handler: function () {
                            me.save(form);
                        }
                    }]
                },
                items: [{
                    xtype: 'fieldset',
                    title: '开启自动备份',
                    checkboxToggle: true,
                    checkboxName: 'enable',
                    collapsed: true,
                    items: [{
                        xtype: 'timefield',
                        fieldLabel: '自动备份时间',
                        name: 'time',
                        triggerAction: 'all',
                        format: 'H:i',
                        value: '00:00',
                        afterLabelTextTpl: userplat.required
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: '备份周期(天)',
                        name: 'interval',
                        value: 7, maxValue: 30, minValue: 1,
                        afterLabelTextTpl: userplat.required
                    }]
                }]
            }), grid = new Ext.grid.Panel( {
                title: '备份列表', region: 'center', margins: '-1 -1 -1 0',
                emptyText: '没有备份档',
                selModel: new Ext.selection.CheckboxModel(),
                store: store,
                columns: [
                    { sortable: false, text: "备份档案名", width: 300, dataIndex: 'name' },
                    { sortable: false, text: '备份时间', dataIndex: 'time' },
                    { sortable: false, text: '状态', dataIndex: 'status' },
                    { sortable: false, text: '备注', dataIndex: 'remark' }
                ],
                tbar: {
                    items: [{
                        text: '立即备份',
                        iconCls: 'add backup',
                        handler: function () {
                            me.backup(store, grid);
                        }
                    }, {
                        text: '删除备份档',
                        iconCls: 'delete backup',
                        handler: function () {
                            me.remove(this,
                                    Ext.Array.map(grid.selModel.selected.items, function (x) { return x.data.id }),
                                    store,
                                    grid)
                        },
                        disabled: true,
                        id: 'btn_delete_backup'
                    }, {
                        text: '还原备份档',
                        iconCls: 'edit backup',
                        handler: function () {
                            me.restore(this,
                                    grid.selModel.selected.items[0].data.id,
                                    store,
                                    grid)
                        },
                        disabled: true,
                        id: 'btn_restore_backup'
                    }]
                },
                listeners: {
                    selectionchange: function (model, selected) {
                        Ext.getCmp('btn_delete_backup').setDisabled(!selected.length).setText(selected.length ? ('删除选中的<b>' + selected.length + '</b>个备份档') : '删除备份档');
                        Ext.getCmp('btn_restore_backup').setDisabled(selected.length != 1).setText(selected.length == 1 ? '还原选中的备份档' : '还原备份档');
                    }
                }
            })],
            listeners: {
                afterrender: function () {
                    userplat.serviceAjax(service.getBackupSetting, {}, function (d) {
                        form.getForm().setValues(d.data);
                    }, masker.loading(form));
                }
            }
        });
    },
    save: function (form) {
        var values = form.getValues();
        if (values.enable) {
            values.enable = true;
            if (!/^\d{2}:\d{2}$/.test(values.time)) return alert('时间格式不对');
            if (isNaN(values.interval) || parseFloat(values.interval) % 1) return alert('备份时间间隔为1-30之间的整数');
            values.interval = parseInt(values.interval);
        } else {
            values.enable = false;
            delete values.time;
            delete values.interval;
        }
        userplat.serviceAjax(service.saveBackupSetting, { setting: values }, function (d) {
            !d.ok && d.msg && alert(d.msg);
        }, masker.saving(form));
    },
    backup: function (store, grid) {
        userplat.serviceAjax(service.doBackup, { }, function (d) {
            !d.ok && d.msg && alert(d.msg);
            store.load();
        }, masker.show(grid, '正在备份数据，请稍候。。。'));
    },
    remove: function (btn, data, store, grid) {
        Ext.MessageBox.show({
            animateTarget: btn,
            title: '操作确认', msg: '删除选中的<b>' + data.length + '</b>个备份档?',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn === 'ok') {
                    userplat.serviceAjax(service.deleteBackups, { ids: data }, function (d) {
                        store.load();
                        Ext.tips.show('提示', '删除备份成功');
                    }, masker.deleting(grid));
                }
            }
        });
    },
    restore: function (btn, data, store, grid) {
        Ext.MessageBox.show({
            animateTarget: btn,
            title: '操作确认', msg: '确定使用选中的档案还原数据?<br/>该操作将导致正在使用系统的其他人的连接中断，正在进行中的操作数据将丢失。',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn === 'ok') {
                    userplat.serviceAjax(service.restoreBackup, { id: data }, function (d) {
                        store.load();
                        Ext.tips.show('提示', '备份还原成功');
                    }, masker.show(grid, '正在还原数据，请稍候。。。'));
                }
            }
        });
    }
};