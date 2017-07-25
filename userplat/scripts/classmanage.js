/// <reference path="../userplat.js" />

classmanage = {
    initialize: function (args) {       

        var proxy = Ext.create('Ext.data.WebServiceProxy', {
            url: service.getGradeAndClassList,
            reader: {
                type: 'json',
                idProperty: 'id',
                totalProperty: 'd.count',
                root: 'd.data.rows'
            },
            extraParams: { AcademicStartYear: 0, AcademicYearRange: -1, GradeID: 0 }
        }),
        store = Ext.create('Ext.data.Store', {
            fields: ['name', 'gradeName', 'academicStartYear', 'createDate', 'grade', 'enabled', 'studentCount', 'canUpdate'],
            autoDestroy: true,
            proxy: proxy, remoteSort: true, autoLoad: true
        }),
        msstore,
        curYear,
        iscurYear = true,
        tbar = new Ext.toolbar.Toolbar({
            layout: { overflowHandler: 'Menu' },
            items: [{
                xtype: 'buttongroup',
                id: 'button_group',
                items: [{
                    text: '添加班级',
                    iconCls: 'add class',
                    handler: function (me) {
                        classmanage.edit(me, null, grid);
                    },
                    id: 'btn_add_classes'
                }, {
                    text: '删除班级',
                    iconCls: 'delete class',
                    handler: function (me) {
                        classmanage.remove(me, Ext.Array.map(grid.selModel.selected.items, function (x) { return x.data.id }), store, grid)
                    },
                    disabled: true,
                    id: 'btn_delete_classes'
                }]
            }, {
                text: '升级上学年班级',
                iconCls: 'edit class',
                handler: function (me) {
                    //Ext.getCmp("gradePeriod").setValue(curYear - 1);
                    iscurYear = false;                   
                    proxy.extraParams.AcademicYearRange = -5;
                    store.loadPage(1);

                    Ext.getCmp('button_group').setVisible(iscurYear);
                    Ext.getCmp("btn_goupdate_classes").setVisible(iscurYear)
                    Ext.getCmp("btn_update_classes").setVisible(true);
                    Ext.getCmp("canUpdate").setVisible(true);
                },
                id: 'btn_goupdate_classes'
            }, {
                text: '升级选中的班级',
                iconCls: 'edit class',
                handler: function (me) {
                    if (grid.selModel.selected.items.length > 1) {
                        alert("一次只能升级一个班级"); return;
                    };
                    classmanage.update(me, Ext.Array.map(grid.selModel.selected.items, function (x) { return x.data.id }), store, grid)
                },
                disabled: true,
                hidden: true,
                id: 'btn_update_classes'
            }
            /*
            , '->', {
                xtype: 'combobox',
                hideLabel: false,
                fieldLabel: '学年',
                hidden: true,
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
                        if (curYear && curYear != newValue) iscurYear = false;
                        else iscurYear = true;
                        Ext.getCmp('button_group').setVisible(iscurYear);
                        //Ext.getCmp('button_group').setDisabled(combo.valueModels[0].data.text.indexOf('√') == -1);
                        proxy.extraParams.AcademicStartYear = newValue;
                        proxy.extraParams.AcademicYearRange = -4;
                        store.loadPage(1);

                        Ext.getCmp("btn_goupdate_classes").setVisible(iscurYear)
                        Ext.getCmp("btn_update_classes").setVisible((curYear - 1) == newValue ? true : false);
                        Ext.getCmp("canUpdate").setVisible((curYear - 1) == newValue ? true : false);
                    },
                    boxready: function (box) {
                        msstore.load();
                    }
                }
            }
            */
            ]
        }),

        grid = Ext.create('Ext.grid.Panel', {
            title: args.text,
            region: 'center', margins: '5 5 5 0',
            store: store,
            tbar: tbar,
            bbar: new Ext.PagingToolbar(userplat.getPagerConfig(store)),
            selModel: new Ext.selection.CheckboxModel(),
            columns: [
                { text: '班级名称', width: 150, dataIndex: 'name' },
                { text: '所在学年', width: 150, dataIndex: 'academicStartYear', renderer: function (v) { return v + '~' + (v + 1); }
                },
                { text: '所属年级', width: 80, dataIndex: 'gradeName' },
                { text: '创建年月', width: 150, dataIndex: 'createDate' },
            //{ text: '状态', dataIndex: 'enabled', renderer: function (v) {
            //    if (v == false) return "启用";
            //    else return "未启用";
            //}
            //},
                {text: '是否能升级', id: 'canUpdate', width: 150, dataIndex: 'canUpdate', renderer: function (v) {
                    if (v == true) return "是";
                    else return "否"
                }
            },
                { text: '班级学生数', width: 80, dataIndex: 'studentCount' },
                { sortable: false, text: '操作', xtype: 'templatecolumn',
                    tpl: '<a href="javascript:;" class="viewStudent">查看学生</a>',
                    listeners: {
                        click: function (grid, td, rowIndex, columnIndex, event, modal, tr) {
                            if (event.target.tagName === 'A') {
                                classmanage[event.target.className].call(event.target, modal.data, iscurYear);
                            }
                        }
                    }
                }
            ],
            listeners: {
                itemdblclick: function (grid, row, e) {
                    if (iscurYear) classmanage.edit(grid.all.elements[e.rowIndex - 1].childNodes[1], row.data, grid);
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
                    Ext.getCmp('btn_update_classes').setDisabled(disabled || !canUpdate).setText(disabled ? '升级选中的班级' : canUpdate ? '升级选中的班级' : '选中的班级不可升级');
                }
            }
        });
        /*
        msstore.on('load', function () {
            Ext.each(this.data.items, function (item) {
                if (item.data.text.indexOf('√') > -1) {
                    Ext.getCmp('gradePeriod').setValue(item.data.value);
                    curYear = item.data.value
                }
            });
        });*/
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
                name: 'grade', itemId: 'grade',
                store: userplat.getStore('schoolGrades')
                //,readOnly: !!data
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
    },
    viewStudent: function (data, iscurYear) {        
        var tname = data.gradeName + ' > ' + data.name + '(所在学年:' + data.academicStartYear + '~' + (data.academicStartYear + 1) + '学年)';
        var classId = data.id;
        var tmode = "classstu";
        if (tmode in userplat.modelset) {
            return init();
        }
        var js = document.createElement('script');
        js.setAttribute('type', 'text/javascript');
        js.setAttribute('src', functionMap.root + tmode + '.js');
        document.getElementsByTagName('head')[0].appendChild(js);

        js.onload = js.onreadystatechange = function () {
            if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')
                init();
        }
        /*
        if ('onreadystatechange' in js)
        js.onreadystatechange = function () { if (js.readyState == 'complete' || js.readyState == 'loaded') { init() } }
        else
        js.onload = init()
        */
        function init() {
            if (userplat.activePanel) userplat.activePanel.destroy();
            viewport.add(userplat.activePanel = userplat.modelset[tmode] = eval(tmode + '.initialize({text:"' + tname + '",classId:"' + classId + '",canOperate:' + iscurYear + '})'));
        }
    },
    getComboDisplay: function (combo) {
        var value = combo.getValue();
        var valueField = combo.valueField;
        var record;
        combo.getStore().each(function (r) {
            if (r.data[valueField] == value) {
                record = r;
                return false;
            }
        });
        return record ? record.get(combo.displayField) : null;
    }
}