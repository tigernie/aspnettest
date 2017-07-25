/// <reference path="../jquery-1.7.1-vsdoc.js" />

// 111017更新:添加多选模式

; (function (scripts) {
    document.writeln('<link rel="stylesheet" type="text/css" href="' + scripts[scripts.length - 1].src.replace(/\.js$/i, '.css') + '"/>');
})(document.getElementsByTagName('SCRIPT'));

if (typeof gzy === 'undefined') gzy = {};

TreeNode = function (options) { $.extend(this, options, { items: [] }) };
TreeNode.prototype = { text: 'NewNode', path: null, extra: '', items: [] };
TreeNode.fromXml = function (xml) {
    /// <summary>从指定的 xml 结构创建树节点列表</summary>
    /// <returns type="TreeNode" />
    /// <param name="xml" type="XmlDocument">用于创建树节点列表的 xml 结构
    /// <para>1. 节点元素可以任意命名, 但必须包含 text 属性.</para>
    /// <para>2. 如果使用动态结构, 则节点还必须包含 id 属性. 此属性将在请求新节点数据时传回服务器端.</para>
    /// <para>3. 节点可以包含其他自定义属性, 自定义属性将出现在 TreeNode 的属性列表中.</para>
    /// </param>
    var atts = {};
    $.each(xml.attributes, function (i, att) { atts[att.name] = att.value });
    
    var tree = new TreeNode(atts);
    $.each(xml.children || xml.childNodes, function (i, x) {
        if (x.nodeType == 1) tree.items.push(TreeNode.fromXml(x));
    });
    return tree;
};
TreeNode.fromJson = function (json) {
    /// <summary>从指定的 json 结构创建树节点列表</summary>
    /// <returns type="TreeNode" />
    /// <param name="json" type="Json">用于创建树节点列表的 json 结构
    /// <para>1. 此 json 必须是单独的 {} 结构, 不能是数组.</para>
    /// <para>2. json 必须包含 text 属性</para>
    /// <para>2. 如果使用动态结构, 则 json 还必须包含 id 属性. 此属性将在请求新节点数据时传回服务器端.</para>
    /// <para>3. json 可以包含其他自定义属性, 自定义属性将出现在 TreeNode 的属性列表中.</para>
    /// </param>
    var tree = new TreeNode(json);
    $.each(json.items || [], function (i, j) { tree.items.push(TreeNode.fromJson(j)) });
    return tree;
};
TreeNode.fromUrl = function (type, url, data, callback) {
    /// <summary>从指定 URL 创建树节点列表</summary>
    /// <param name="type" type="DataType">请求的数据类型, 只能是 'xml' 或 'json'</param>
    /// <param name="url" type="URL">提供数据的接口地址</param>
    /// <param name="data" type="HashMap">向接口发送的数据</param>
    /// <param name="callback" type="Function">在请求数据成功后将数据主体传入并执行</param>
    $.get(url, data, function (d) { callback(type == 'xml' ? TreeNode.fromXml(d.documentElement) : TreeNode.fromJson(d)) }, type);
};
TreeNode.fromService = function (connector, data, callback) {
    jQuery.ajax({ url: connector.url, contentType: 'application/json;charset=utf-8', type: 'POST', dataType: "json", data: $.fromJSON($.extend(data, connector.params)), success: function (d) { callback(TreeNode.fromJson(d.d)) } });
};
TreeNode.toHTML = function (node, multi, father) {
    /// <summary>将节点列表解析为相应的 HTML 结构</summary>
    /// <param name="node" type="TreeNode"/>
    /// <returns type="jQuery" />
    var dl = $('<dl></dl>');//.bind('onselectstart', function () { alert(''); });
    var dt = $((multi ? ('<dt><span/><input type="checkbox" value="' + node.id + '"/><label title="' + node.text.replace(/　/g, '') + '">') : '<dt><span/><label title="' + node.text.replace(/　/g, '') + '">') + node.text.replace(/　/g, '') + '</label>' + (node.extra || '').italics() + '</dt>').appendTo(dl);
    dt.data('data', $.extend(node, { el: dt }));
    if (node.items.length || String(node.leaf) === 'false') {
        dt.addClass('haschild');
        var dd = $('<dd/>').appendTo(dl);
        if (node.expanded) dt.addClass('expanded'), dd.css('display', 'block');
        $.each(node.items, function (i, item) { dd.append(TreeNode.toHTML(item, multi, node)) });
    }
    node.father = father;
    return dl;
};
TreeNode.prototype.setExtra = function (text) {
    /// <summary>为节点设置额外的显示数据,该数据将在节点文本后以斜体显示</summary>
    var extra = this.el.find('i');
    extra.length ? extra.text(text) : this.el.append(text.toString().italics());
    this.extra = text;
    return this;
};
TreeNode.prototype.parent = function () {
    /// <summary>查找节点的上级节点的原始数据</summary>
    return this.el.parent().parent().prev().data('data');
};

TreeOptions = function (options) { $.extend(this, options) };
TreeOptions.prototype = { xml: null, json: null, useAnimate: 'fast', connector: {}, cls: 'tree', onselect: function (item) { }, multi: false };

gzy.tree = function (options) {
    /// <summary>使用指定的资源生成树</summary>
    /// <param name="options" type="TreeOptions">树配置项
    /// <para>XmlDocument xml: 指定用 xml 结构生成树</para>
    /// <para>Json json: 指定用 json 数据生成树</para>
    /// <para>Int/String useAnimate: 展开/收起树目录的动画速度, 可以使用整数(毫秒), 或预设值 ('fast','normal','slow') 之一</para>
    /// <para>CssClass cls: 定义树外观的样式名</para>
    /// <para>URL connector: 使用动态树时, 提供节点数据的接口地址</para>
    /// <para>Function onselect(item): 选中树的某一节点时发生</para>
    /// </param>
    if (this === gzy) throw new Error('please create new instance of tree.');

    options = new TreeOptions(options);
    if (options.xml) $.extend(this, { items: TreeNode.fromXml(options.xml), sourceType: 'xml' });
    if (options.json) $.extend(this, { items: TreeNode.fromJson(options.json), sourceType: 'json' });

    if (isNaN(options.useAnimate)) options.useAnimate = ({ fast: 200, normal: 400, slow: 600 })[options.useAnimate];

    $.extend(this, options);
    delete this.xml; delete this.json;
};
gzy.tree.prototype = { cls: '', useAnimate: 0, connector: {}, sourceType: '', selectedItem:null, selectedPath: null, selectedPathText: null, checked: [], checkedAll: [], checkedText: [] };
//debugger;
gzy.tree.prototype.reload = function (node, done) {
    var me = this, dt = node.el.addClass('loading'), dl = dt.parent(), dd = dt.next('dd'), data = dt.data('data');
    TreeNode.fromService(this.connector, { id: node.id }, function () {
        me.connector.loading && me.connector.loading.call(me, arguments[0]);
        $.extend(node, arguments[0]);
        dl.replaceWith(TreeNode.toHTML($.extend(node, arguments[0])));
        if (done) done.call(me);
    });
};
gzy.tree.prototype.insert = function (parent, node) {
    /// <summary>把新节点添加到指定节点内部</summary>
    /// <param name="node" type="TreeNode">新节点,其中必须包含id和text属性</param>
    var dt = parent.el;
    var dd = dt.next('dd');
    if (dd.length == 0) {
        dd = $('<dd/>').insertAfter(dt.addClass('haschild'));
    }
    dd.append(TreeNode.toHTML(new TreeNode(node)));
    if (!dt.hasClass('expanded')) dt.find('span').click();
};
gzy.tree.prototype.remove = function (item) {
    /// <summary>从树结构中移除指定的节点</summary>
    var removed = item.el.parent();
    if (removed.siblings().length > 0) {
        removed.parent().prev().click();
        removed.remove();
    } else {
        removed.parent().prev().removeAttr('class').click();
        removed.parent().remove();
    }
};
gzy.tree.prototype.renderTo = function (container) {
    /// <summary>解析整个树节点结构, 并添加到指定的容器内</summary>
    var me = this, selected = null, dx = 0;

    var toggle = {
        show: function (dt, dd) {
            var data = dt.data('data');

            if (!data || data.leaf) return false;
            if (dd.children().length || data.loaded) return dd.show(me.useAnimate, function () { dt.addClass('expanded') });

            if (me.connector.url) me.reload(data, function () { toggle.show(dt, dd) });
        },
        hide: function (dt, dd) {
            dd.hide(me.useAnimate, function () { dt.removeClass('expanded') });
        }
    };
    if (this.connector.url) {
        TreeNode.fromService(me.connector, { id: 0 }, create);
    } else {
        create(me.items);
    }
    return this;

    function create(items) {
        me.items = items;
        me.connector && me.connector.loading && me.connector.loading.call(me, items);
        $('<div onselectstart="return false" class="' + me.cls + '"></div>').appendTo(container).append(TreeNode.toHTML(items, me.multi, null)).click(tree_click).dblclick(tree_dblclick);
        me.connector && me.connector.onload && me.connector.onload.call(me, items);
    }
    function tree_dblclick (e) {
        clearTimeout(dx);
        var clicked = $(e.target);
        switch (clicked[0].tagName.toUpperCase()) {
            case 'LABEL':
            case 'I':
                clicked = clicked.parent();
            case 'DT':
                var data = clicked.data('data');
                clicked.hasClass('expanded') ? toggle.hide(clicked, clicked.next('dd')) : toggle.show(clicked, clicked.next('dd'));
                break;
            default:
                return false;
        };
    }
    function tree_click(e) {
        var clicked = $(e.target), data;
        switch (clicked[0].tagName.toUpperCase()) {
            case 'SPAN':
                clicked = clicked.parent();
                toggle[clicked.hasClass('expanded') ? 'hide' : 'show'](clicked, clicked.next('dd'));
                break;
            case 'INPUT':
                clicked.parent().next().find('input').attr('checked', clicked[0].checked);
                //同级检查选中状态
                (function (dt) {
                    var sboxes = dt.parent().siblings().find('>dt input'), prevdt = dt.parent().parent().prev();
                    if (prevdt.is('dt.haschild')) {
                        prevdt.find('input').attr('checked', dt.find('input').is(':checked') && sboxes.filter(':checked').length == sboxes.length);
                        arguments.callee(prevdt);
                    }
                })(clicked.parent());

                var all = $('input:checked', container);
                me.checkedAll = all.map(function (i, x) {
                    return parseInt(x.value);
                }).toArray();

                me.checked.length = me.checkedText.length = 0;
                for (var i = 0, a; a = all[i++];) {
                    data = $(a).parent().data('data');
                    if (data.items.length == 0 && String(data.leaf) !== 'false') {
                        me.checked.push(parseInt(a.value));
                        me.checkedText.push(data.text);
                    }
                }
                if (e.isTrigger) {
                    me.checkedAll.push(clicked.val());
                    me.checked.push(clicked.val());
                    me.checkedText.push(clicked.next().text());
                }
                break;
            case 'LABEL':
            case 'I':
                clicked = clicked.parent();
            case 'DT':
                if (selected) selected.removeClass('selected');
                (selected = clicked).addClass('selected');
                data = clicked.data('data');
                if ('id' in data) {
                    var sp = [data.id], st = [data.text], t = clicked;
                    while (t = t.parent().parent().prev()) {
                        if (!t.is('dt')) break;
                        with (t.data('data')) {
                            sp.push(id);
                            st.push(text);
                        }
                    }
                    me.selectedPath = sp.reverse();
                    me.selectedPathText = st.reverse();
                }
                me.selectedItem = data;
                if (me.onselect) {
                    clearTimeout(dx);
                    dx = window.setTimeout(function () { me.onselect.call(me, data) }, 300);
                }
                break;
        }
    }
};

gzy.tree.prototype.expand = function (paths, root) {
    /// <summary>展开到路径所指定的目录</summary>
    /// <param name="root" optional="true"></param>
    if (typeof paths === 'string') paths = path.split('/');
    if (typeof paths === 'number') paths = [paths];
    if (root === undefined) root = { items: [this.items] };
    var ex = arguments.callee, me = this;

    for (var i = 0; i < root.items.length; i++) {
        if (root.items[i].id == paths[0]) {
            root = root.items[i];
            if (!root.el.hasClass('expanded')) root.el.find('span').click();
            setTimeout(function () {
                ex.call(me, paths.slice(1), root);
            }, me.useAnimate);
        };
    };
    return this;
};
//debugger;
gzy.tree.prototype.select = function (paths, root) {
	/// <summary>在root指定的节点下选中paths表示的节点。</summary>
    /// <param name="paths" type="Array">表示节点路径的id数组，也可以是用"/"分隔的id串。</param>
    /// <param name="root" type="TreeNode">指定起始节点，paths的第一个元素位于该节点下面。如不指定则为树的根节点。</param>

    var me = this;

    if (root === undefined) root = { items: [this.items] };
    if (typeof paths === 'string') paths = paths.split('/');
    if (typeof paths === 'number') paths = [paths];

    (function (root) {
        if (typeof (x = paths.shift()) !== 'undefined') {
            for (var i = 0, item; item = root.items[i++];) {
                if (item.id == x) {
                    item.el.click();
                    if (!item.items.length && String(item.leaf) === 'false') {
                        me.reload(item, function () {
                            me.select([x], item);
                        });
                    }
                    arguments.callee(item);
                    break;
                }
            }
        }
    })(root);
    return this;
};
gzy.tree.prototype.picked = {
    paths:[],
    texts:[]
};
gzy.tree.prototype.findId = function (id) {
    /// <summary>获取指定ID的节点</summary>
    /// <returns type="TreeNode" />
    var me = this, root = { items: [me.items] }, node = null;

    (function (root) {
        for (var i = 0, item; item = root.items[i++];) {
            if (item.id == id) {
                node = item;
                break;
            } else if (item.items) {
                arguments.callee.call(me, item);
            }
        }
    })(root);
    return node;
};
gzy.tree.prototype.setExtra = function (extras) {
    /// <summary>设置附加数据</summary>
    /// <param name="extras" type="Object[]">{id,extra}</param>
    if (extras instanceof Array) {
        var me = this;
        $.each(extras, function () {
            me.findId(this[0]).setExtra(this[1]);
        });
    } else {
        this.findId(arguments[0]).setExtra(arguments[1]);
    }
};
gzy.tree.prototype.pick = function (ids, root) {
    /// <summary>使ids中包含的节点处于选中状态</summary>
    /// <param name="root" optional="true"></param>
    if (root === undefined) {
        root = { items: [this.items] };
        this.picked.paths.length = this.picked.texts.length = 0;
    }
    if (!this.checkedAll) this.checkedAll = [];

    for (var i = 0; i < ids.length; i++) {
        var item = this.findId(ids[i]);
        item && item.el.find('input').attr('checked', 'checked');
    }

    var me = this, all = $('input:checked', this.items.el.parent());
    me.checkedAll = all.map(function (i, x) {
        return parseInt(x.value);
    }).toArray();

    me.checked.length = me.checkedText.length = 0;
    for (var i = 0, a; a = all[i++];) {
        data = $(a).parent().data('data');
        if (data.items.length == 0 && String(data.leaf) !== 'false') {
            me.checked.push(parseInt(a.value));
            me.checkedText.push(data.text);
        }
    }
    return this;
};
gzy.tree.prototype.setContextMenu = function (config, items) {
    /// <summary>为树组件配置上下文菜单,参考gzy.menu</summary>
    if (gzy.menu) $(config.selector).menu(config, items);
};
