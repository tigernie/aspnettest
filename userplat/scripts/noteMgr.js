/// <reference path="../userplat.js" />

Ext.require('Ext.slider.*');
Ext.QuickTips.init();
Ext.form.Field.prototype.msgTarget = 'side';

//此功能为考试系统专用

noteMgr = {
    explains: {
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
        form = new Ext.form.Panel({
            title: args.text,
            id: 'settings',
            width:1024,
            autoScroll: true, overflowY: 'auto',
            region: 'center', margins: '5 5 5 0', bodyPadding: 20,
            tbar: Ext.toolbar.Toolbar({
                layout: { overflowHandler: 'Menu' },
                items: [{
                    text: '保存设置',
                    iconCls: 'save settings',
                    handler: function () { noteMgr.saveSettings(form) }
                }]
            }),

            items: [
                 {
                     //html: ' <script id="note" name="note" type="text/plain" style="height:400px;""></script>',
                     xtype: 'textfield',
                     name: 'title',
                     fieldLabel: '公告标题',
                     width: 800,
                     //height: 400,
                     afterSubTpl: '',
                     fontFamilies: ['宋体', '隶书', '黑体','Arial','Courier New','Tahoma','Times New Roman','Verdana']
        
                 },

                {
                //html: ' <script id="note" name="note" type="text/plain" style="height:400px;""></script>',
                xtype: 'htmleditor',
                name: 'notice',
                fieldLabel: '公告内容',
                width: 800,
                height: 400,
                afterSubTpl: '',
                fontFamilies: ['宋体', '隶书', '黑体','Arial','Courier New','Tahoma','Times New Roman','Verdana']
        
            }],
            listeners: {
                afterrender: function () {
                    userplat.serviceAjax(service.GetNote, {}, function (d) {
                        var fb = form.getForm(), data = d.data;
                        fb.findField('notice').setValue(data.Content);
                        fb.findField('title').setValue(data.Title);

                    }, masker.loading(form));
                }
            }
        });
        return form;

    },
    saveSettings: function (form) {
        var values = form.getForm().getValues();

        userplat.serviceAjax(service.SaveNote, { content: values.notice, title: values.title }, function (d) {
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