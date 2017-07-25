/// <reference path="../userplat.js" />


gradeandclass = {
    initialize: function (args) {
        var proxy = Ext.create('Ext.data.WebServiceProxy', {
            url: service.getGradeAndClassList,
            reader: {
                type: 'json',
                idProperty: 'id',
                totalProperty: 'd.count',
                root: 'd.data.rows'
            },
            extraParams: { AcademicStartYear: 0, AcademicYearRange: -3 }
        }),
        store = Ext.create('Ext.data.Store', {
            fields: ['name', 'gradeName', 'grade', 'canUpdate'],
            autoDestroy: true,
            groupField: 'gradeName',
            proxy: proxy, remoteSort: true, autoLoad: false
        }),
        msstore,
        tbar = new Ext.toolbar.Toolbar({
            layout: { overflowHandler: 'Menu' },
            items: [{
                xtype: 'buttongroup',
                id: 'button_group',
                items: [{
                    text: '添加班级',
                    iconCls: 'add class',
                    handler: function (me) {
                        gradeandclass.edit(me, null, grid);
                    },
                    id: 'btn_add_classes'
                }, {
                    text: '删除班级',
                    iconCls: 'delete class',
                    handler: function (me) {
                        gradeandclass.remove(me,
                                Ext.Array.map(grid.selModel.selected.items, function (x) { return x.data.id }),
                                store,
                                grid)
                    },
                    disabled: true,
                    id: 'btn_delete_classes'
                }]
            }, {
                text: '升级班级',
                iconCls: 'edit class',
                handler: function (me) {
                    gradeandclass.update(me,
                            Ext.Array.map(grid.selModel.selected.items, function (x) { return x.data.id }),
                            store,
                            grid)
                },
                disabled: true,
                id: 'btn_update_classes'
            }, {
                text: '折叠/展开',
                enableToggle: true,
                toggleHandler: function (btn, pressed) {
                    feature[pressed ? 'collapseAll' : 'expandAll']();
                }
            }, '->', {
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
                        Ext.getCmp('button_group').setDisabled(combo.valueModels[0].data.text.indexOf('√') == -1);
                        proxy.extraParams.gradePeriod = newValue;
                        store.loadPage(1);
                    },
                    boxready: function (box) {
                        msstore.load();
                    }
                }
            }]
        }),
        feature = Ext.create('Ext.grid.feature.Grouping', {
            groupHeaderTpl: '{name} &nbsp; <span style="font-weight:normal">共有 {rows.length} 个班级</span>',
            hideGroupedHeader: true,
            listeners: {
            }
        }),
        grid = Ext.create('Ext.grid.Panel', {
            title: args.text,
            region: 'center', margins: '5 5 5 0',
            store: store,
            tbar: tbar,
            selModel: new Ext.selection.CheckboxModel(),
            features: [feature],
            columns: [
                { text: '年级', width: 100, dataIndex: 'gradeName' },
                { text: '班级名', dataIndex: 'name', width: 200 }
            ],
            listeners: {
                itemdblclick: function (grid, row, e) {
                    gradeandclass.edit(grid.all.elements[e.rowIndex - 1].childNodes[1], row.data, grid);
                },
                selectionchange: function (model, selected) {
                    var disabled = !selected.length;
                    Ext.each(selected, function (row) { if (row.data.inner) disabled = true });
                    Ext.getCmp('btn_delete_classes').setDisabled(disabled).setText(disabled ? '删除班级' : ('删除选中的<b>' + selected.length + '</b>个班级'));

                    var canUpdate = true;
                    Ext.each(selected, function (item) {
                        if (canUpdate) {
                            if (!selected[0].data.canUpdate) canUpdate = false;
                        }
                    });
                    Ext.getCmp('btn_update_classes').setDisabled(disabled || !canUpdate).setText(disabled ? '升级班级' : canUpdate ? '升级选中的<b>' + selected.length + '</b>个班级' : '选中的班级不可升级');
                }
            }
        });
        msstore.on('load', function () {
            Ext.each(this.data.items, function (item) {
                if (item.data.text.indexOf('√') > -1)
                    Ext.getCmp('gradePeriod').setValue(item.data.value);
            });
        });
        return grid;
    },
    edit: function (btn, data, grid) {
        var form = new Ext.form.Panel({
            region: 'center', bodyPadding: 10,
            fieldDefaults: { labelAlign: 'right' },
            items: [{
                xtype: 'textfield',
                fieldLabel: '班级名称',
                name: 'name',
                afterLabelTextTpl: userplat.required, allowBlank: false, blankText: '班级名称不能为空'
            }, {
                xtype: 'combobox', fieldLabel: '所在年级',
                displayField: 'text', valueField: 'value',
                triggerAction: 'all',
                editable: false, queryMode: 'local',
                name: 'grade', itemId: 'grade', value: 1,
                store: userplat.getStore('schoolGrades'),
                readOnly: !!data
            }],
            buttons: [{
                text: '保存',
                formBind: true,
                disabled: true,
                handler: function (btn, e) {
                    btn.setDisabled(true);

                    var values = form.getForm().getValues();
                    values.id = data ? data.id : 0;

                    userplat.serviceAjax(service.saveGradeClass, values, function (d) {
                        win.destroy();
                        grid.store.load();
                        Ext.tips.show('提示', '班级保存成功');
                        delete userplat.stores['classes'];
                    }, masker.saving(form));
                }
            }, {
                text: '取消',
                handler: function () { win.close() }
            }]
        }), win = userplat.openWindow('添加班级', 400, 160, [form], {
            animateTarget: btn,
            listeners: {
                show: function () {
                    data && form.getForm().setValues(data);
                    data && win.setTitle('编辑班级：' + data.name);
                }
            }
        });
    },
    remove: function (btn, data, store, grid) {
        Ext.MessageBox.show({
            animateTarget: btn,
            title: '操作确认', msg: '确定删除选中的<b>' + data.length + '</b>个班级？',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn === 'ok') {
                    userplat.serviceAjax(service.deleteGradeClass, {
                        ids: data
                    }, function (d) {
                        grid.store.load();
                        delete userplat.stores['classes'];
                        Ext.tips.show('提示', '删除成功');
                    }, masker.deleting(grid));
                }
            }
        });
    },
    update: function (btn, data, store, grid) {
        Ext.MessageBox.show({
            animateTarget: btn,
            title: '操作确认', msg: '确定升级选中的<b>' + data.length + '</b>个班级？',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn === 'ok') {
                    userplat.serviceAjax(service.upgradeGradeClass, {
                        ids: data
                    }, function (d) {
                        grid.store.load();
                        delete userplat.stores['classes'];
                        Ext.tips.show('提示', '升级成功');
                    }, masker.deleting(grid));
                }
            }
        });
    }
}