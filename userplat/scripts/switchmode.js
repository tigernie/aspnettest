/// <reference path="../userplat.js" />

switchmode = {
    initialize: function (args) {
        var form;
        return form = new Ext.form.Panel({
            title: args.text,
            autoScroll: true, overflowY: 'auto',
            id: 'settings',
            region: 'center', margins: '5 5 5 0', bodyPadding: 20,
            tbar: Ext.toolbar.Toolbar({
                layout: { overflowHandler: 'Menu' },
                items: [{
                    text: '保存设置',
                    iconCls: 'save settings',
                    handler: function () { switchmode.saveSettings(form) }
                }, '->', {
                    text: '切换回上次中心考试',
                    hidden: !(user.version == 1 && user.mode == "SchoolMode"),
                    handler: function () { switchmode.restoreMode(form) }
                }]
            }),
            items: [{
                xtype: 'fieldset',
                defaults: { labelAlign: 'right' },
                items: [{
                    xtype: 'textfield', width: 300,
                    fieldLabel: '中心服务器',
                    name: 'server',
                    afterSubTpl: '<span style="white-space:nowrap">中心端服务器的访问地址，格式为“服务器的地址:服务端口”，如 10.1.1.99:3309，或 exam.nanningedu.com:3309</span>'
                }, {
                    xtype: 'checkboxfield',
                    fieldLabel: '系统运行模式', boxLabel: '选中后保存，系统运行于中心考试模式。取消则恢复学校考试模式。',
                    name: 'mode',
                    inputValue: '1', uncheckedValue: '0'
                }]
            }],
            listeners: {
                afterrender: function () {
                    userplat.serviceAjax(service.getModeSetting, {}, function (d) {
                        var fb = form.getForm(), data = d.data;
                        fb.setValues(data);
                    }, masker.loading(form));
                }
            }
        });
    },
    saveSettings: function (form) {
        var values = form.getForm().getValues(), server = values.server.split(':');
        if (server.length == 1) {
            values.port = 80;
            values.server = server[0];
        } else {
            if (isNaN(server[1]) || server[1] > 65534)
                return alert('端口号不正确');
        }
        userplat.serviceAjax(service.saveModeSetting, values, function (d) {
            if (d.ok && d.needRelogin) {
                //alert('已成功切换回本地数据库!\n请使用本地账号重新登录.');
                Ext.MessageBox.alert('信息', '已成功切换回本地数据库!\n请使用本地账号重新登录.', function () {
                    userplat.serviceAjax(service.logout, { xx: '' }, function () {
                        location.replace('/login.htm');
                    }, masker.saving(form));
                });
            } else
                Ext.tips.show('提示', '设置保存成功');
        }, masker.saving(form));
    },
    restoreMode: function (form) {
        Ext.MessageBox.show({
            title: '操作确认', msg: '确定切换回上次使用的系统模式?',
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function (btn) {
                if (btn == 'ok') {
                    userplat.serviceAjax(service.restoreMode, {}, function (d) {
                        if (d.ok) {
                            Ext.MessageBox.alert('信息', '已成功切换回上次使用的系统模式！\n请重新登录系统。', function () {
                                userplat.serviceAjax(service.logout, { xx: '' }, function () {
                                    location.replace('/login.htm');
                                }, masker.show(form, '正在注销。。。'));
                            });
                        } else {
                            Ext.tips.show('提示', '操作失败<br>' + d.msg);
                        }
                    }, masker.show(form, '正在执行恢复操作，请稍等。。。'));
                }
            }
        })
    }
};