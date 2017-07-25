/// <reference path="../userplat.js" />

; logmgr = {
    initialize: function (args) {
        var proxy = Ext.create('Ext.data.WebServiceProxy', {
            url: service.getLogList,
            reader: {
                type: 'json',
                idProperty: 'id',
                totalProperty: 'd.count',
                root: 'd.data.rows'
            },
            extraParams: { query: '', type: '' }
        }),
        store = Ext.create('Ext.data.Store', {
            fields: ['user', 'ip', 'log', 'time', 'type'],
            autoDestroy: true,
            proxy: proxy, remoteSort: true, autoLoad: true
        }),
        columns = [
            { sortable: false, text: "用户名", width: 160, dataIndex: 'user' },
            { sortable: false, text: "IP", width: 120, dataIndex: 'ip' },
            { sortable: false, text: "时间", width: 100, dataIndex: 'time' },
            { sortable: false, text: "操作类别", width: 160, dataIndex: 'type' },
            { sortable: false, text: "信息", dataIndex: 'log' }
        ],
        tbar = new Ext.toolbar.Toolbar({
            layout: { overflowHandler: 'Menu' },
            items: [{
                text: '删除日志',
                iconCls: 'delete log',
                handler: function (me) {
                    logmgr.removeLog(me,
                            Ext.Array.map(grid.selModel.selected.items, function (x) { return x.data.id }),
                            store,
                            grid)
                },
                disabled: true,
                id: 'btn_delete_logs'
            }, {
                text: '清除日志',
                iconCls: 'clear log',
                handler: function (me, e) {
                    logmgr.clearLog(me, store, grid);
                }
            }, '->', {
                xtype: 'combobox',
                displayField: 'text',
                valueField: 'value',
                triggerAction: 'all',
                mode: 'local',
                editable: false, queryMode: 'local', queryMode: 'local',
                name: 'type',
                itemId: 'type',
                value: "",
                store: userplat.getStore(userplat.dict.logTypes, ["", '日志类别...']),
                width: 100,
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        proxy.extraParams.type = newValue;
                        store.loadPage(1);
                    }
                }
            }, {
                xtype: 'searchfield',
                width: 150,
                emptyText: '用户名/日志关键字',
                store: store,
                paramName: 'query'
            }]
        }),
        grid = new Ext.grid.Panel({
            title: args.text,
            columns: columns,
            region: 'center', margins: '5 5 5 0',
            emptyText: '没有符合条件的记录',
            selModel: new Ext.selection.CheckboxModel(),
            store: store,
            tbar: tbar,
            bbar: new Ext.PagingToolbar(userplat.getPagerConfig(store)),
            listeners: {
                selectionchange: function (model, selected) {
                    Ext.getCmp('btn_delete_logs').setDisabled(!selected.length).setText(selected.length ? ('删除选中的<b>' + selected.length + '</b>条日志') : '删除日志');
                }
            }
        });

        return grid;
    },
    removeLog: function (btn, data, store, grid) {
        userplat.serviceAjax(service.deleteLogs, {
            ids: data
        }, function (d) {
            store.load();
            Ext.tips.show('提示', '成功删除' + d.data + '条日志');
        }, masker.deleting(grid));
    },
    clearLog: function (btn, store, grid) {
        Ext.MessageBox.show({
            animateTarget: btn,
            title: '操作确认', msg: '确定清空所有日志记录?',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn === 'ok') {
                    userplat.serviceAjax(service.clearLogs, {}, function (d) {
                        store.load();
                        Ext.tips.show('提示', '成功清除所有日志');
                    }, masker.deleting(grid));
                }
            }
        });
    }
};