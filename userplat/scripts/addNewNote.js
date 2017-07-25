
; addNewNote = {
    initialize: function (args) {
        var proxy = Ext.create('Ext.data.WebServiceProxy', {
            url: service.getNoteList,
            reader: {
                type: 'json',
                idProperty: 'id',
                totalProperty: 'd.total',
                root: 'd.rows'
            },
            extraParams: { query: '', type: '' }
        }),
        store = Ext.create('Ext.data.Store', {
            fields: ['id', 'title', 'time'],
            autoDestroy: true,
            proxy: proxy, remoteSort: true, autoLoad: true
        }),
        columns = [
            { sortable: false, text: "标题", width: 160, dataIndex: 'title' },
            { sortable: false, text: "时间", width: 200, dataIndex: 'time' },
        ],
        tbar = new Ext.toolbar.Toolbar({
            layout: { overflowHandler: 'Menu' },
            items: [{
                text: '删除公告',
                iconCls: 'delete note',
                handler: function (me) {
                    addNewNote.removeLog(me,
                            Ext.Array.map(grid.selModel.selected.items, function (x) {
                                return x.data.id
                            }),
                            store,
                            grid)
                },
                id: 'btn_delete_note'
            }, {
                text: '置顶日志',
                iconCls: 'clear note',
                handler: function (me, e) {
                    addNewNote.topNote(me,
                           Ext.Array.map(grid.selModel.selected.items, function (x) {
                               return x.data.id
                           }),
                           store,
                           grid)
                }
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
        userplat.serviceAjax(service.deleteNote, {
            ids: data
        }, function (d) {
            store.load();
            Ext.tips.show('提示', '成功删除' + d.data + '条公告');
        }, masker.deleting(grid));
    },
    topNote: function (btn, data, store, grid) {
        userplat.serviceAjax(service.topNote, { ids: data }, function (d) {
            store.load();
            Ext.tips.show('提示', '成功置顶');
        }, masker.deleting(grid));
    }
};