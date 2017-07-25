/// <reference path="../userplat.js" />

Ext.require('Ext.slider.*');
Ext.QuickTips.init();
Ext.form.Field.prototype.msgTarget = 'side';

//此功能为考试系统专用

settings = {
    explains:{
        resultLevel: '分数＜{0}%为“不及格”，{0}%≤分数＜{1}%为“一般”，{1}≤分数＜{2}%为“良好”，分数≥{2}%为“优秀”',
        difficultyLevel: '难度＜{0}为“难题”，{0}≤难度＜{1}为“难度一般”，难度≥{1}为“容易题”',
        multiSelectCfg: '多选题漏选正确项时，给满分的{0}% .(此值为系统参考值，以实际考试评分设置为准)',
        threSholdRateKey: '多人评分阀值{0}% .(此值为系统参考值，以实际考试评分设置为准)',
        changePCTimes: '允许最多换机{0}次',
        studentCount: '练习模式最多允许{0}个学生登录考试',
        prepaperCount: '练习模式下提前生成{0}份试卷',
        readyTime: '考生可提前{0}分钟登录就绪'
    },
    initialize: function (args) {
        var form;
        return form = new Ext.form.Panel({
            title: args.text,
            id: 'settings',
            autoScroll: true, overflowY: 'auto',
            region: 'center', margins: '5 5 5 0', bodyPadding: 20,
            tbar: Ext.toolbar.Toolbar({
                layout: { overflowHandler: 'Menu' },
                items: [{
                    text: '保存设置',
                    iconCls: 'save settings',
                    handler: function () { settings.saveSettings(form) }
                }]
            }),
            
            items: [{
                xtype: 'textfield',
                name: 'schoolName', hidden: user.version == 0,
                fieldLabel: '单位名称', labelAlign: 'right'
            }, {
                xtype: 'fieldset',
                title: '成绩等级设置',
                items: [{
                    xtype: 'multislider',
                    name: 'resultLevel',
                    fieldLabel: '成绩等级', labelAlign: 'right', width: 700, clickToChange: false,
                    minValue: 0, maxValue: 100, values: [0, 0, 0], increment: 1,
                    tipText: function (thumb) {
                        var i = thumb.index,
                            thumbs = thumb.slider.thumbs,
                            start = i == 0 ? 0 : thumbs[i - 1].value,
                            end = thumb.value,
                            level = ['不及格', '一般', '良好', '优秀'][i];
                        Ext.get('resultLevel-msg').setHTML(string.format(settings.explains.resultLevel, [thumbs[0].value, thumbs[1].value, thumbs[2].value]));
                        return Ext.String.format('<b>{0}%-{1}%</b> 之间为“{2}”', start, end, level);
                    },
                    afterSubTpl: '<span id="resultLevel-msg"></span>'
                }],

            }, {
                xtype: 'fieldset',
                title: '评分设置',
                defaults: { labelAlign: 'right', width: 400 },
                items: [{
                    xtype: 'slider',
                    name: 'multiSelectCfg',
                    fieldLabel: '多选题少选', clickToChange: false,
                    minValue: 0, maxValue: 90, value: 0, increment: 10,
                    tipText: function (thumb) {
                        Ext.get('multiSelectCfg-msg').setHTML(string.format(settings.explains.multiSelectCfg, thumb.value));
                        return Ext.String.format('给<b>{0}%</b>', thumb.value)
                    },
                    afterSubTpl: '<span id="multiSelectCfg-msg"></span>'
                }, {
                    xtype: 'multislider',
                    name: 'difficultyLevel',
                    fieldLabel: '难度系数', clickToChange: false,
                    minValue: 0, maxValue: 10, values: [0, 0], increment: 1,
                    tipText: function (thumb) {
                        var i = thumb.index,
                            thumbs = thumb.slider.thumbs,
                            start = i == 0 ? 0 : thumbs[i - 1].value,
                            end = thumb.value,
                            level = ['难', '中等', '容易'][i];
                        Ext.get('difficultyLevel-msg').setHTML(string.format(settings.explains.difficultyLevel, [thumbs[0].value / 10, thumbs[1].value / 10]));
                        return Ext.String.format('<b>{0} - {1}</b> 之间为“{2}”', start / 10, end / 10, level);
                    },
                    afterSubTpl: '<span id="difficultyLevel-msg" style="white-space:nowrap"></span>'
                }, {
                    xtype: 'checkboxfield',
                    fieldLabel: '客观题自动判分', boxLabel: '练习模式下客观题自动判分',
                    name: 'autoJudgeObjective',
                    inputValue: '1', uncheckedValue: '0'
                }, {
                    xtype: 'slider',
                    name: 'threSholdRateKey', hidden: user.version == 1,
                    fieldLabel: '多人评分阀值', clickToChange: false,
                    minValue: 0, maxValue: 100, value: 0, increment: 10,
                    tipText: function (thumb) {
                        Ext.get('threSholdRateKey-msg').setHTML(string.format(settings.explains.threSholdRateKey, thumb.value));
                        return Ext.String.format('<b>{0}%</b>', thumb.value)
                    },
                    afterSubTpl: '<span id="threSholdRateKey-msg" style="white-space:nowrap"></span>'
                }, {
                    xtype: 'radiogroup',
                    fieldLabel: '每题至少批阅人数',
                    disabled: user.mode == "SchoolMode", hidden: user.mode == "SchoolMode",
                    items: [
                        { boxLabel: '2人', name: 'minJudgers', inputValue: '2' },
                        { boxLabel: '3人', name: 'minJudgers', inputValue: '3' },
                    ]
                }]
            }, {
                xtype: 'fieldset',
                title: '考试设置',
                defaults: { labelAlign: 'right', width: 400 },
                items: [{
                    xtype: 'slider',
                    name: 'changePCTimes', hidden: user.version == 1,
                    fieldLabel: '允许最多换机次数', clickToChange: false,
                    minValue: 0, maxValue: 5, value: 0, increment: 1,
                    tipText: function (thumb) {
                        Ext.get('changePCTimes-msg').setHTML(string.format(settings.explains.changePCTimes, thumb.value));
                        return Ext.String.format('<b>{0}次</b>', thumb.value)
                    },
                    afterSubTpl: '<span id="changePCTimes-msg"></span>'
                }, {
                    xtype: 'checkboxfield',
                    fieldLabel: '限制IP', boxLabel: '考场内限制IP',
                    name: 'limitSessionIp', hidden: user.version == 1,
                    inputValue: '1', uncheckedValue: '0'
                }, {
                    xtype: 'checkboxfield',
                    fieldLabel: '限制IP', boxLabel: '登录时限制IP',
                    name: 'limitLoginIp',
                    inputValue: '1', uncheckedValue: '0'
                }, {
                    xtype: 'checkboxfield',
                    fieldLabel: '验证重复登录', boxLabel: '验证重复登录',
                    name: 'checkReLogin',
                    inputValue: '1', uncheckedValue: '0'
                }, {
                    xtype: 'slider',
                    name: 'studentCount', hidden: user.version == 1,
                    fieldLabel: '练习模式最多允许的学生数', clickToChange: false,
                    minValue: 40, maxValue: 100, value: 40, increment: 1,
                    tipText: function (thumb) {
                        Ext.get('studentCount-msg').setHTML(string.format(settings.explains.studentCount, thumb.value));
                        return Ext.String.format('<b>{0}人</b>', thumb.value)
                    },
                    afterSubTpl: '<span id="studentCount-msg"></span>'
                }, {
                    xtype: 'checkboxfield',
                    fieldLabel: '缺考人成绩', boxLabel: '统计成绩时包含缺考人成绩',
                    name: 'absentScore', hidden: user.version == 1,
                    inputValue: '1', uncheckedValue: '0'
                }, {
                    xtype: 'slider',
                    name: 'prepaperCount',
                    fieldLabel: '练习模式下提前生成试卷的份数', clickToChange: false,
                    minValue: 40, maxValue: 100, value: 40, increment: 10,
                    tipText: function (thumb) {
                        Ext.get('prepaperCount-msg').setHTML(string.format(settings.explains.prepaperCount, thumb.value));
                        return Ext.String.format('<b>{0}份</b>', thumb.value)
                    },
                    afterSubTpl: '<span id="prepaperCount-msg"></span>'
                }, {
                    xtype: 'slider',
                    name: 'readyTime', hidden: user.version == 1,
                    fieldLabel: '考生登录考试', clickToChange: false,
                    minValue: 0, maxValue: 20, value: 5, increment: 1,
                    tipText: function (thumb) {
                        Ext.get('readyTime-msg').setHTML(string.format(settings.explains.readyTime, thumb.value));
                        return Ext.String.format('<b>{0}分钟</b>', thumb.value)
                    },
                    afterSubTpl: '<span id="readyTime-msg"></span>'
                }, {
                    xtype: 'slider',
                    name: 'ignoreScore',
                    fieldLabel: '成绩最低统计分数阀值', clickToChange: false,
                    minValue: 0, maxValue: 100, value: 5, increment: 1,
                    tipText: function (thumb) {
                        Ext.get('readyTime-msg').setHTML(string.format(settings.explains.readyTime, thumb.value));
                        return Ext.String.format('<b>{0}</b>', thumb.value)
                    },
                    afterSubTpl: '<span id="readyTime-msg"></span>'
                }]
            }, {
                xtype: 'fieldset',
                title: '系统设置',
                margins: '0 0 20 0',
                defaults: { labelAlign: 'right' },
                items: [{
                    xtype: 'textarea',
                    name: 'ipLimits',
                    fieldLabel: '允许登录的IP<br>(或IP范围)',
                    width: 500,
                    rows: 10,
                    afterSubTpl: '每行填写一个ip地址，或ip范围，如："127.0.0.1"，"172.16.0.0-172.31.255.255"'
                },
                {
                    xtype: 'textfield',
                    name: 'minVersion',
                    fieldLabel: '考点对接最小版本',
                    width: 500,
                    rows: 10,
                    afterSubTpl: '不填表示任何版本均可对接'
                }
                ]
            }],
            listeners: {
                afterrender: function () {
                    userplat.serviceAjax(service.getSettings, {}, function (d) {
                        var fb = form.getForm(), data = d.data;
                        
                        Ext.each(data.resultLevel, function (score, i) { this.setValue(i, score) }, fb.findField('resultLevel'));

                        Ext.each(data.difficultyLevel, function (score, i) { this.setValue(i, score) }, fb.findField('difficultyLevel'));

                        fb.findField('multiSelectCfg').setValue(data.multiSelectCfg);

                        fb.findField('threSholdRateKey').setValue(data.threSholdRateKey);
                        fb.findField('autoJudgeObjective').setValue(data.autoJudgeObjective);
                        fb.findField('changePCTimes').setValue(data.changePCTimes);
                        fb.findField('limitSessionIp').setValue(data.limitSessionIp);
                        fb.findField('limitLoginIp').setValue(data.limitLoginIp);
                        fb.findField('checkReLogin').setValue(data.checkReLogin);
                        fb.findField('studentCount').setValue(data.studentCount);
                        fb.findField('absentScore').setValue(data.absentScore);
                        fb.findField('prepaperCount').setValue(data.prepaperCount);
                        fb.findField('readyTime').setValue(data.readyTime);
                        fb.findField('schoolName').setValue(data.schoolName);
                        fb.findField('ipLimits').setValue(data.ipLimits.join('\n'));
                        fb.findField('minJudgers').setValue(data.minJudgers);
                        fb.findField('minVersion').setValue(data.minVersion);
                        data['difficultyLevel'] = [data['difficultyLevel'][0] / 10, data['difficultyLevel'][1] / 10];
                        $.each(settings.explains, function (x) { Ext.get(x + '-msg').setHTML(string.format(settings.explains[x], data[x])) });
                    }, masker.loading(form));
                }
            }
        });
    },
    saveSettings: function (form) {
        var values = form.getForm().getValues();
        userplat.serviceAjax(service.saveSettings, { settings: values }, function (d) {
            Ext.tips.show('提示', '设置保存成功');
        }, masker.saving(form));
    }
};

string = {
    format: function (string, array) {
        if (!(array instanceof Array)) array = [array];
        return string.replace(/{(\d+)}/g, function (all, i) { return array[parseInt(i)] });
    }
}