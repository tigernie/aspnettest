/// <reference path="../extjs/ext-all-dev.js" />
/// <reference path="config.js" />
/// <reference path="../scripts/jquery-1.7.1-vsdoc.js" />



(function () {
    Ext.Ajax.request({
        url: '/LoginHandler.ashx',
        params: { token: 'get_interval_time' },
        success: function (response) {
            setInterval(function () {
                Ext.Ajax.request({
                    url: '/LoginHandler.ashx',
                    params: { token: 'i_am_online' },
                    success: function (response) {
                        //$("#msg_checkOnline").html(response.responseText);
                    }
                });
            }, parseInt(response.responseText));
        }
    });
})();


Ext.Loader.setConfig({ enabled: true });
Ext.Loader.setPath('Ext.ux', functionMap.ext + 'ux');
Ext.require(['Ext.ux.form.SearchField']);

Ext.data.WebServiceProxy = Ext.extend(Ext.data.HttpProxy, {
    doRequest: function (operation, callback, scope) {
        var writer = this.getWriter(),
            request = this.buildRequest(operation, callback, scope);

        if (typeof request.params.sort === 'string')
            request.params.sort = eval(request.params.sort);
        request.proxy.actionMethods = { read: 'POST' };

        if (operation.allowWrite()) {
            request = writer.write(request);
        }

        if (operation.filters.length) {
            Ext.each(operation.filters, function (filter) {
                request.params[filter.property] = filter.value;
            });
        }

        Ext.apply(request, {
            params: Ext.encode(request.params), //JSON转换成字符串
            headers: { 'Content-Type': 'application/json;charset=utf-8' }, //标记为JSON请求
            timeout: this.timeout,
            scope: this,
            callback: this.createRequestCallback(request, operation, callback, scope),
            method: this.getMethod(request),
            disableCaching: true
        });

        Ext.Ajax.request(request);
        return request;
    }
});

Ext.tips = function () {
    var msgCt;

    function createBox(t, s) {
        return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
    };
    return {
        show: function (title, format, delay) {
            if (!msgCt) {
                msgCt = Ext.DomHelper.insertFirst(document.body, { id: 'msg-div' }, true);
            }
            var m = Ext.DomHelper.append(msgCt, createBox(title, Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1))), true);
            m.hide();
            m.slideIn('t').ghost("t", { delay: delay || 2000, remove: true });
        }
    };
} ();

var viewport, user;

Ext.onReady(function () {
    userplat.serviceAjax(service.getUserState, {}, function (d) {
        user = d;
        if (user.id) {
            if (user.version == 1) {//1学校版  0中心版
                functionMap.items[1] = {
                    text: '组织机构管理',
                    id: 'orgmanage',
                    cls: 'organization',
                    children: [
                    //{ text: '班级信息', id: 'gradeandclass', leaf: true },
                        {text: '班级管理', id: 'classmanage', leaf: true }
                    ]
                };
                Ext.Array.remove(functionMap.items[2].children, functionMap.items[2].children[1]);

                var usershow = parseInt(d.access.charAt(17)),
                orgshow = parseInt(d.access.charAt(18)),
                sysshow = parseInt(d.access.charAt(19));
                if (functionMap.items[0].id == "modules-user") functionMap.items[0].hidden = !usershow;
                if (functionMap.items[1].id == "orgmanage") functionMap.items[1].hidden = !orgshow;
                if (functionMap.items[2].id == "modules-sys") functionMap.items[2].hidden = !sysshow;
            } else {
                Ext.Array.remove(functionMap.items[2].children, functionMap.items[2].children[2]);
            }
            ready();
        } else {
            location.replace(userplat.loginUrl);
        };
        
    });
});

function ready() {

    Ext.QuickTips.init();

    viewport = Ext.create('Ext.Viewport', {
        layout: 'border',
        items: [Ext.create('Ext.Component', {
            region: 'north',
            height: 80,
            autoEl: {
                tag: 'div',
                html: '<h1>统一用户管理平台</h1><a href="javascript:;" onclick="location.replace(\'../teacher.htm\')" id="returnBack" class="returnBack">返回</a>'
            },
            cls: 'header'
        }), {
            region: 'west',
            title: '功能导航',
            id: 'navigation',
            width: 200,
            collapsible: true,
            margins: '5 5 5 5',
            layout: 'accordion',
            layoutConfig: { animate: true }
        }]
    });

    var user, orgmanager, sys, navigation = Ext.getCmp('navigation');

    Ext.each(functionMap.items, function (x) {        
        navigation.add({ title: x.text, iconCls: x.cls, layout: 'border', overflow: 'auto', hidden: x.hidden, items: [getNavigationTree(x.id, x.children)] });
    });  

    userplat.activePanel = viewport.add({
        region: 'center',
        title: '开始',
        html: '从左侧选择一项功能',
        margins: '5 5 5 0'
    });

    var curpanel = { id: '' };

    function getNavigationTree(id, children) {
        var panel = new Ext.tree.Panel({
            rootVisible: false, useArrows: true, region: 'center',
            autoScroll: true,
            border: 0,
            store: new Ext.data.TreeStore({ root: { id: 'root', expanded: true, children: children } })
        });

        panel.on('itemclick', function (selModel, record) {
            if (record.isLeaf()) {
                userplat.initialize(record.getId(), record.data.text);
            }
        });
        return panel;
    }
};

var userplat = {
    loginUrl: '../login.htm',

    stores: {
        get: function (type, value) {
            if (type in userplat.stores) {
                for (var i = 0; i < userplat.stores[type].length; i++) {
                    if (userplat.stores[type][i][0] == value) return userplat.stores[type][i][1];
                }
            }
        },
        yesno: [[true, '是'], [false, '否']],
        userStatus: [[3, '正常'], [0, '禁用']]//, [2, '待审核'], [1, '未通过验证']
        , orgTypes: [[1, '行政机构'], [2, '学校']],
        gender: [[0, '未知的性别'], [1, '男性'], [2, '女性']],
        userStatus: [[0, '禁用'], [3, '正常'], [4, '已删除']],
        changeFlag: [[1, '正常'], [2, '毕业'], [3, '开除'], [4, '退学'], [5, '离校'], [6, '复学'], [7, '肄业'], [8, '其他异动']]
        //, schoolGrades: [[7, '初一'], [8, '初二'], [9, '初三'], [10, '高一'], [11, '高二'], [12, '高三']]
    },

    getStore: function (type, hItem) {
        if (type in userplat.stores) {
            return Ext.create('Ext.data.ArrayStore', {
                fields: ['value', 'text'],
                data: hItem ? [hItem].concat(userplat.stores[type]) : userplat.stores[type]
            });
        }
        return userplat.getStoreByUrl(service.getDictionary, { type: type }, {
            load: function (store, records, successful) {
                if (successful) {
                    userplat.stores[type] = [];
                    store.each(function (record) {
                        userplat.stores[type].push(record.raw || [record.data['value'], record.data['text']]);
                    });
                    if (hItem) store.insert(0, [hItem]);
                }
            }
        });
    },
    getStoreByUrl: function (url, params, listeners) {
        return Ext.create('Ext.data.ArrayStore', {
            fields: ['value', 'text'],
            proxy: Ext.create('Ext.data.WebServiceProxy', {
                url: url,
                reader: new Ext.data.reader.Array({ fields: ['value', 'text'], root: 'd' }),
                extraParams: params
            }),
            autoLoad: true, remoteFilter: false, remoteGroup: false, remoteSort: false,
            listeners: listeners || {}
        });
    },
    //字典数据
    dict: {
        classes: 'classes',
        //当前年班级
        curClasses: 'curClasses',
        //用户状态
        userStatus: 'userStatus',
        //用户类型
        userTypes: 'userTypes',
        //编制类别
        userWorkout: 'userWorkout',
        //办学类型
        userTeachLevel: 'userTeachLevel',
        //学历
        userEduLevel: 'userEduLevel',
        //岗位职业码
        userStation: 'userStation',
        //政治面貌
        userPolitics: 'userPolitics',
        //机构类别
        orgTypes: 'orgTypes',
        //机构办别
        orgLevel: 'orgLevel',
        //婚姻状况
        marriage: 'marriage',
        //宗教信仰
        religion: 'religion',
        //民族
        nation: 'nation',
        //健康状况
        healthy: 'healthy',
        //血型
        bloodType: 'bloodType',
        //学生类别码
        xslbm: 'xslbm',
        //学制
        xz: 'xz',
        //学年
        gradePeriod: 'gradePeriod',
        //学生当前状态
        studentStatus: 'xsdqztm',
        //异动类型
        transType: 'transType',
        //异动原因
        transReason: 'transReason',
        //性别
        userGender: 'gender',
        //港澳台侨外码
        gatqwm: 'gatqwm',
        //学位
        degree: 'degree',
        //年级
        grades: 'grades',
        //日志类别
        logTypes: 'logTypes',
        //身份证件类型
        icType: 'icType',
        //党政职务码
        dutyPoli: 'dutyPoli',
        //技术职务码
        dutyTech: 'dutyTech',

        //年级
        grades: 'schoolGrades'
    },

    //所属学年
    gradePeriod: [['2010', '2010年'], ['2011', '2011年'], ['2012', '2012年']],

    getPagerConfig: function (store, options) {
        return Ext.Object.merge({
            displayInfo: true,
            store: store
        }, options);
    },
    openWindow: function (title, width, height, items, config) {
        return Ext.create('widget.window', Ext.Object.merge({
            title: title,
            width: width, height: height,
            modal: true, resizable: false,
            layout: { type: 'border', padding: 5 },
            items: items
        }, config || {})).show();
    },

    ajaxCache: {},
    serviceAjax: function (url, jsonData, success, mask, cache) {
        var data = Ext.encode(jsonData),
            cacheKey = url + data;

        if (cache && cacheKey in userplat.ajaxCache) {
            if (mask) mask.hide();
            return success(userplat.ajaxCache[cacheKey]);
        }
        Ext.Ajax.request({
            method: 'post',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            url: url,
            params: data,
            success: function (request) {
                if (mask) mask.hide();
                var d = eval("(" + request.responseText + ").d");
                if (d.ok === false) {
                    if (d.msg) Ext.MessageBox.alert('消息', d.msg);
                    if (d.msg == '登录已超时，请重新登录系统。') location.href = userplat.loginUrl;
                } else {
                    if (d.msg) Ext.MessageBox.alert('消息', d.msg);
                    if (cache) userplat.ajaxCache[cacheKey] = d;
                    success(d);
                }
            },
            failure: function () {
                if (mask) mask.hide();
                Ext.MessageBox.alert('错误', constant.message.AJAX_FAILURE);
            }
        });
    },

    modelset: {},
    activePanel: null,
    initialize: function (model, name) {       
        var navigation = Ext.getCmp('navigation').items.items;
        for (var i = 0; i < navigation.length; i++) {
            if (!navigation[i].collapsed) {
                name = navigation[i].title + ' > ' + name;
                break;
            }
        }
        var args = model.split(':');
        model = args.shift();
        args = args.join(':');

        if (model in userplat.modelset) {
            return init();
        }
        var js = document.createElement('script');
        js.setAttribute('type', 'text/javascript');
        js.setAttribute('src', functionMap.root + model + '.js');
        document.getElementsByTagName('head')[0].appendChild(js);
        if ('onreadystatechange' in js)
            js.onreadystatechange = function () { if (js.readyState == 'complete' || js.readyState == 'loaded') { init() } }
        else
            js.onload = init;

        function init() {
            if (userplat.activePanel) userplat.activePanel.destroy();
            viewport.add(userplat.activePanel = userplat.modelset[model] = eval(model + '.initialize({text:"' + name + '",args:"' + args + '"})'));
        }
    },

    organizSelector: {},
    organizeStore: null,
    showAreaTree: function (me, center, root, callback) {
        var p = Ext.get(me.getEl()).getXY(), size = center === true ? [400, 300] : [300, 200];

        if (!userplat.organizSelector[me.id]) {
            var s = userplat.organizSelector[me.id] = Ext.create('Ext.window.Window', {
                title: '选择行政区域',
                height: size[1], width: size[0],
                layout: 'fit',
                animateTarget: me.inputEl ? me.inputEl.dom : me,
                closeAction: 'hide',
                modal: true,
                listeners: {
                    afterrender: loadTree
                }
            });
            if (center !== true) s.setPosition(p[0] + me.getWidth() - 300, p[1] + me.getHeight());
        }
        userplat.organizSelector[me.id].show();
        function loadTree() {
            userplat.organizSelector[me.id].add(Ext.create('Ext.tree.Panel', {
                useArrows: true,
                store: Ext.create('Ext.data.TreeStore', {
                    proxy: Ext.create('Ext.data.WebServiceProxy', {
                        url: service.getAreaTree,
                        reader: { type: 'json', root: 'd' }
                    }),
                    autoLoad: true,
                    nodeParam: 'root'
                }),
                root: { id: root || 0, text: '根区域', expanded: true },
                rootVisible: true,
                listeners: {
                    itemclick: function ($, node) {
                        if (center !== true) {
                            me.setValue(node.data.id + ':' + node.data.text);
                            userplat.organizSelector[me.id].hide();
                            callback && callback(node);
                        }
                    }
                }
            }));
        }
    },
    showOrganizTree: function (me, callback) {
        if (!userplat.organizSelector[me.id]) {
            userplat.organizSelector[me.id] = Ext.create('Ext.window.Window', {
                title: '选择组织机构',
                height: 410, width: 500, layout: 'fit', bodyPadding: 5,
                animateTarget: me.inputEl ? me.inputEl.dom : me,
                closeAction: 'destroy', modal: true, resizable: false,
                listeners: { afterrender: loadTree, close: function () { delete userplat.organizSelector[me.id] } }
            });
        }
        userplat.organizSelector[me.id].show();

        function loadTree() {
            var panel;
            userplat.organizSelector[me.id].add(panel = Ext.create('Ext.panel.Panel', {
                html: '<div id="p_tree" class="p_tree"><div><div class="a" id="a1"></div><div class="a" id="a2"></div><div class="a" id="a3"></div></div><form><div id="fs" style="height:30px;background:#dfe9f5"><label style="margin:5px;float:left;">搜索：<input/></label></div><div id="os" style="padding:5px"></div><div id="ds" style="padding:5px;display:none;border-top:#99bce8 solid 1px"></div></form></div>',
                listeners: {
                    afterrender: function () {
                        $('#p_tree div.a').click(function (event) {
                            if (event.target.tagName == 'A') {
                                $(this).find('a.current').removeClass('current'); $(event.target).addClass('current');
                                request.call(panel, event.target.href.split('//')[1]);
                            }
                            ds.hide();
                        });
                        var oh, os = $('#os').click(function (event) {
                            if (!oh) oh = os.height() + 9;
                            var target = event.target.tagName == 'FONT' ? event.target.parentNode : event.target;
                            if (target.tagName != 'A' || target.className == 'current') return false;

                            ds.empty();
                            var id = target.href.split('//')[1];
                            if (callback) {
                                os.height(oh).find('a.current').removeClass(target.className = 'current');

                                userplat.serviceAjax(service.getDepartmentsList, { orgId: id }, function (d) {
                                    ds.show().append('<a href="javascript://0">不选择部门</a>');
                                    Ext.each(d.data.rows, function (item) {
                                        ds.append('<a href="javascript://' + item.id + '">' + item.name + '</a>');
                                    });
                                    os.animate({ height: '-=' + ds.height() }, 'fast');
                                }, masker.loading(panel), true);
                            } else {
                                me.setValue(id + ':' + $(target).text());
                                userplat.organizSelector[me.id].close();
                            }
                        });
                        var ds = $('#ds').click(function (event) {
                            if (event.target.tagName != 'A') return;
                            var o = os.find('a.current'), d = $(event.target);
                            callback({ id: parseInt(o.attr('href').split('//')[1]), name: o.text() }, { id: parseInt(d.attr('href').split('//')[1]), name: d.text() });
                            userplat.organizSelector[me.id].close();
                        });

                        $('#fs input').keyup(function () { filter($.trim(this.value), cache[1], $('#os')) });
                        setTimeout(function () { request.call(panel, 0) }, 100);
                    }
                }
            }));
        }
        var cache;
        function request(root) {
            userplat.serviceAjax(service.getMixedAreaTree, { root: root }, function (d) { updateUI(cache = d.data) }, masker.loading(this), true);
        }
        function updateUI(data) {
            if (data[0].length) {
                var div = /0000$/.test(data[0][0].id) ? ($('#a2,#a3').hide(), $('#a1')) : /00$/.test(data[0][0].id) ? ($('#a3').hide(), $('#a2')) : $('#a3');
                div.show().empty();
                Ext.each(data[0], function (item, index) {
                    div.append('<a href="javascript://' + item.id + '">' + item.text.replace('　', '') + '</a>');
                });
            }
            if (data.length == 2) {
                var form = $('#os').height($('#p_tree').parent().innerHeight() - $('#p_tree>div').height() - 30 - 10 - 2);
                filter('', data[1], form);
            }
        }
        function filter(text, all, form) {
            form.empty();
            Ext.each(all, function (item, index) {
                if (text) {
                    if (item.name.indexOf(text) > -1) form.append('<a href="javascript://' + item.id + '">' + item.name.replace(text, text.fontcolor('red')) + '</a>');
                } else {
                    form.append('<a href="javascript://' + item.id + '">' + item.name + '</a>');
                }
            });
        }
    },

    required: '<b style="color:red" data-qtip="Required">*</b>'
}
var masker = {
    show: function (panel, msg) {
        return new Ext.LoadMask(panel, { msg: msg, useTargetEl: true }).show();
    },
    loading: function (panel) {
        return this.show(panel, '正在读取数据...');
    },
    saving: function (panel) {
        return this.show(panel, '正在保存数据...');
    },
    deleting: function (panel) {
        return this.show(panel, '正在删除数据...');
    }
}