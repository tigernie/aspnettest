/// <reference path="../userplat.js" />

studentall = {
    initialize: function (args) {
        userplat.getStore(userplat.dict.userTypes);

        var proxy = Ext.create('Ext.data.WebServiceProxy', {
            url: service.RetrieveContainHistoryStudent,
            reader: {
                type: 'json',
                idProperty: 'id',
                totalProperty: 'd.count',
                root: 'd.data.rows'
            },
            extraParams: { f_stu: {}, query: '' }
        });

        var fields = ['PersonNumber', 'RealName', 'Gender', 'ClassName', 'GradeName', 'Active_Flag', 'AcademicYearName'];

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
            { text: "学号", width: 150, dataIndex: 'PersonNumber' },
            { text: "姓名", width: 150, dataIndex: 'RealName' },
            { text: "性别", width: 80, dataIndex: 'Gender', renderer: function (v) {
                return userplat.stores.get(userplat.dict.userGender, v)
            }
            },
            { text: "班级", width: 150, dataIndex: 'ClassName' },
            { text: "年级", width: 150, dataIndex: 'GradeName' },
            { text: "当前状态", width: 120, dataIndex: 'Active_Flag', renderer: function (v) {
                return userplat.stores.get(userplat.dict.userStatus, v)
            }
            },
            { text: "所在学年", width: 120, dataIndex: 'AcademicYearName'}
        ];

        var btn_set_role = [];


        var clstore, grid = new Ext.grid.Panel({
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
            bbar: new Ext.PagingToolbar(userplat.getPagerConfig(store)),
            tbar: new Ext.toolbar.Toolbar({
                layout: {
                    overflowHandler: 'Menu'
                },
                items: ['->', {
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
                            proxy.extraParams.f_stu.AcademicStartYear = newValue;
                            store.loadPage(1);
                        },
                        boxready: function (box) {
                            msstore.load();
                        }
                    }
                }, {
                    xtype: 'combobox',
                    hideLabel: true,
                    store: gradetore = userplat.getStore(userplat.dict.grades),
                    displayField: 'text',
                    valueField: 'value',
                    emptyText: '选择年级...',
                    name: 'grades',
                    editable: false,
                    value: '',
                    width: 100,
                    triggerAction: 'all',
                    listeners: {
                        select: function (combo, record, index) {
                            var classbox = Ext.getCmp("classbox");
                            classbox.clearValue();
                            clstore.proxy.extraParams.GradeID = combo.value;
                            clstore.load();                           
                        }
                    }
                }, {
                    xtype: 'combobox',
                    hideLabel: true,
                    id: 'classbox',
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
                            extraParams: { AcademicStartYear: 0, AcademicYearRange: -1, GradeID: 0 }
                        }),
                        remoteSort: true, autoLoad: true                        
                    }),
                    displayField: 'name',
                    valueField: 'id',
                    emptyText: '选择班级...',
                    name: 'classes',
                    editable: false,
                    value: '',
                    width: 100,
                    triggerAction: 'all',
                    listeners: {
                        change: function (combo, newValue, oldValue) {
                            proxy.extraParams.f_stu.ClassID = newValue;
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
            })
        });
        return grid;
    }

}
