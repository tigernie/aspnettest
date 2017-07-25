/// <reference path="alertAndConfirm/alertAndConfirm.js" />
/// <reference path="jquery-1.7.1-vsdoc.js" />
/// <reference path="PopWindow/gzy.popup.js" />
/// <reference path="Tree/gzy.tree.js" />
/// <reference path="jquery-1.7.min.js" />

;( function () {


    function OnSuccess(msg) {
        //告知服务器 我在线的操作 成功后的回调函数
        //会返回 当前会话的ID Session["SessionID"]，不是会话ID
        //还会返回 当前在线人数 和在线账户的 账户名和会话的ID
        $("#msg_checkOnline").html(msg);
    }
    var intervalRand = 0;
    window.lock = false;
    function CheckOnline() {
        if(!window.lock)
        {
            window.lock = true;
            $.post("LoginHandler.ashx", { "token": "get_interval_time" }, function (msg) {
                var intervalTime = parseInt(msg);
                if (intervalTime > 0) {
                  var t=  setInterval(CallServer, intervalTime);
                }
            });
        }
    }
    function CallServer() {
        $.post("LoginHandler.ashx", { "intervalRand": intervalRand++, "token": "i_am_online" }, function (msg, status) { OnSuccess(msg); });
    }

    $(document).ready(function () {
        CheckOnline();
    });

})();


window.onerror = function () {
    jQuery.post('/errors.ashx', 'userAgent=' + escape(window.navigator.userAgent) +
        '&errorInfo=' + escape(Array.prototype.join.call(arguments, '-->')))
};
jQuery.fn.extend({
    disable: function () {
        this.attr('disabled', 'disabled').addClass('disabled').find('input,select,textarea').attr('disabled', 'disabled').addClass('disabled');
        if (this.is('A')) this.attr('_href', this.attr('href')).attr('href', 'javascript:;');
        return this;
    },
    enable: function () {
        this.removeAttr('disabled').removeClass('disabled').find('input,select,textarea').filter(function () {
            return !$(this.parentNode).attr('disabled');
        }).removeAttr('disabled').removeClass('disabled');
        if (this.is('a')) this.attr('href', this.attr('_href')).removeAttr('_href');
        return this;
    },

    every: function (selector) {
        for (var i = 0; i < length; i++) {
            if (!this.eq(i).is(selector)) return false;
        }
        return true;
    }
});
jQuery.fn.rect = function () {
    with ($(this))
        return $.extend({ width: width(), height: height() }, position());
};
jQuery.fn.intVal = function () {
    return parseInt($(this).val());
};
jQuery.fn.getValues = function (append) {
    var me = this, values = {};
    this.find('[name]').each(function (i, item) {
        switch (item.type) {
            case 'checkbox':
                if (item.name in values) return;
                var items = me.find('[name=' + item.name + ']');
                if (items.length > 1) {
                    values[item.name] = items.filter('[checked=checked]').map(function () { return this.value }).toArray();
                } else {
                    if (item.checked) values[item.name] = item.value === 'true' ? true : item.value === 'false' ? false : item.value;
                    else {
                        var value = $(item).attr('xvalue');
                        if (value) values[item.name] = value === 'true' ? true : value === false ? false : value;
                    }
                }
                break;
            case 'radio':
                if (item.checked) values[item.name] = item.value;
                break;
            default:
                if (item.name in values) {
                    if (!(values[item.name] instanceof Array)) values[item.name] = [values[item.name]];
                    values[item.name].push(item.value);
                } else {
                    values[item.name] = item.value;
                }
        }
    });
    return $.extend(values, append || {});
};
jQuery.fn.setValues = function (values) {
    for (var field in values) {
        var inputs = this.find('[name=' + field + ']');
        if (!inputs.length) continue;

        var value = values[field];

        switch (inputs[0].tagName) {
            case 'TEXTAREA':
                inputs.val(value);
                continue;
            default:
                switch (inputs[0].type) {
                    case 'checkbox':
                        inputs.each(function (i, checkbox) { checkbox.checked = value.indexOf(checkbox.value) > -1; });
                        break;
                    case 'radio':
                        inputs.each(function (i, radio) { radio.checked = radio.value == value; });
                        break;
                    default:
                        inputs.val(value);
                }
        }
    }
    return this;
};
jQuery.fn.valid = function (fields, success, failure) {
    /// <param name="fields" type="Array">要验证的字段列表，格式支持以下三种设置：
    /// &#10;1. 字段名  --只判断字段值是否为空，仅包含空格也被判定为空。
    /// &#10;2. 字段名:Function  --使用函数对字段值进行验证，返回 true 即为通过验证。传入参数为字段的值。
    /// &#10;3. 字段名:Regexp  --使用正则来验证字段值是否合法。</param>
	/// <param name="success" type="Function">所有字段全部通过验证时执行。</param>
    /// <param name="failure" type="Function">当有字段未通过验证时执行，参数为[字段名, 字段值, 表单值]。</param>
    /// <returns type="jQuery" />
    var values = this.getValues();
    try {
        for (var i = 0, arg; arg = fields[i++];) {
            if (typeof arg === 'string') {
                if (arg in values && $.trim(values[arg]) === '') throw arg;
            } else {
                for (var name in arg) {
                    if (arg[name] instanceof Function)
                        if (arg[name](values[name]) === false) throw name;

                    if (arg[name] instanceof RegExp)
                        if (arg[name].test(values[name]) === false) throw name;
                }
            }
        }
        success(values);
    } catch (ex) {
        failure(ex, values[ex], values);
    }
    return this;
};
jQuery.fn.sum = function (calculator) {
    var result = 0;
    this.each(function (i, item) {
        result += calculator(item);
    });
    return result;
};
jQuery.service = function (url, data, success) {
    if (this instanceof String)
        return url.replace('undefined', this);

    if (data instanceof Function) {
        success = data;
        data = {};
    };

    data = jQuery.fromJSON(data);
    var method = data ? 'POST' : 'GET';

    if (!success instanceof Function) success = new Function();

    return jQuery.ajax({
        url: url,
        type: method,
        contentType: 'application/json;charset=utf-8',
        dataType: "json",
        data: data,
        success: function (json) { success(json.d) },
        complete: function () { }
    });
};

jQuery.fromJSON = function (o) {
    if (o === null) return 'null';

    var type = typeof o;
    if (type === 'string') return '"' + o.replace(/\\/, "\\\\").replace(/\"/g, "\\\"") + '"';
    if (type === 'number' || type === 'boolean') return o.toString();

    var items = [];
    if (o instanceof Array) {
        for (var i = 0, l = o.length; i < l; i++) items.push(arguments.callee(o[i]));
        return '[' + items.join(',') + ']';
    } else {
        var quote = arguments[1] === true ? '' : '"';
        for (var x in o) items.push(quote + x + quote + ':' + arguments.callee(o[x]));
        return arguments[1] === true ? items.join(',') : ('{' + items.join(',') + '}');
    }
};
jQuery.gf = function (source) {
    if (arguments.length == 1) return jQuery(source);
    return jQuery(String.$.apply(null, arguments));
};
jQuery.delay = function (fn, ms) {
    var args = Array.prototype.slice.call(arguments, 2);
    return setTimeout(function () {
        fn.apply(null, args);
    }, ms);
};

String.$ = function (string) {
    var args = arguments;
    if (args[1] instanceof Array) {
        return String.$.apply(null, [args[0]].concat(args[1]));
    } else if (typeof args[1] == 'object') {
        return string.replace(/{(.+?)}/g, function (all, x) { with (args[1]) return eval(x) });
    } else {
        return string.replace(/{(\d+)}/g, function (all, i) { return args[parseInt(i)] });
    }
};
String.repeat = function (string, times) {
    return new Array(times + 1).toString().replace(/,/g, string);
};
(function () {
    var toString = Date.prototype.toString;
    Date.prototype.toString = function (format) {
        if (!format) return toString.call(this);

        var d = this,
            zeroize = function (value, length) {
                return (new Array(length + 1).join('0') + value).slice(Math.min(length, String(value).length));
            };
        return format.replace(/yyyy|yy|MMMM|MM|MM|M|dddd|ddd|dd|d|hh|h|HH|H|mm|m|ss|s|l|L|tt|TT|Z/g, function (exp) {
            switch (exp) {
                case 'd': return d.getDate();
                case 'dd': return zeroize(d.getDate(), 2);
                case 'ddd': return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
                case 'dddd': return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
                case 'M': return d.getMonth() + 1;
                case 'MM': return zeroize(d.getMonth() + 1, 2);
                case 'MMM': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
                case 'MMMM': return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
                case 'yy': return String(d.getFullYear()).substr(2);
                case 'yyyy': return d.getFullYear();
                case 'h': return d.getHours() % 12 || 12;
                case 'hh': return zeroize(d.getHours() % 12 || 12, 2);
                case 'H': return d.getHours();
                case 'HH': return zeroize(d.getHours(), 2);
                case 'm': return d.getMinutes();
                case 'mm': return zeroize(d.getMinutes(), 2);
                case 's': return d.getSeconds();
                case 'ss': return zeroize(d.getSeconds(), 2);
                case 'l': return zeroize(d.getMilliseconds(), 3);
                case 'L': var m = d.getMilliseconds(); return zeroize(m > 99 ? m = Math.round(m / 10) : m, 2);
                case 'tt': return d.getHours() < 12 ? 'am' : 'pm';
                case 'TT': return d.getHours() < 12 ? 'AM' : 'PM';
                case 'Z': return d.toUTCString().match(/[A-Z]+$/);
                default: return exp.substr(1, exp.length - 2);
            }
        });
    }
})();

PropertyGrid = function () { };
PropertyGrid.prototype = { headAlign: 'right' };

DataGridHeaderDefine = { prototype: { text: 'head', sortKey: null, width: null} };

DataGridOptions = {
    prototype: {
        columns: null, //列定义，排序字段，决定表格有多少列:  [{text:'序号',sortKey:'id',width:60},{text:'名称',sortKey:'name'},'操作']
        selectKey: null, //多选列，如果指定则会在表格第一列生成复选框，并将选择的结果保存在Grid的selectedValues属性中
        table: '#table', //将要生成Grid的表格
        source: null, //数据源，提供数据的WebService接口
        params: null, //向数据接口发送的数据
        cells: null, //定义各列显示的内容及格式
        pageSize: -1, //显示分页部件
        onload: function (params) { },
        emptyMsg: '没有要显示的项'
    }
};

String.prototype.gblen = function () {
    var len = 0;
    for (var i = 0; i < this.length; i++) {
        if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
            len += 2;
        } else {
            len++;
        }
    }
    return len;
};

String.prototype.gbtrim = function (len, s, keepLeft) {
    var str = '';
    var sp = s || '';
    var len2 = 0;
    for (var i = 0; i < this.length; i++) {
        if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
            len2 += 2;
        } else {
            len2++;
        }
    }
    if (len2 <= len) {
        return this;
    }
    len2 = 0;
    len = (len > sp.length) ? len - sp.length : len;
    if (keepLeft) {
        for (var i = 0; i < this.length; i++) {
            if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
                len2 += 2;
            } else {
                len2++;
            }
            if (len2 > len) {
                str += sp;
                break;
            }
            str += this.charAt(i);
        }
    }
    else {
        for (var i = this.length - 1; i >= 0; i--) {
            if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
                len2 += 2;
            } else {
                len2++;
            }
            if (len2 > len) {
                str = sp + str;
                break;
            }
            str = this.charAt(i) + str;
        }
    }
    return str;
};

DataGrid = function (options) {
    /// <summary>提供数据绑定功能</summary>
    /// <param name="options" type="DataGridOptions">数据表格定义参数</param>

    var me = this;
    options = $.extend({}, DataGridOptions.prototype, options);
    me.trans = options.trans;
    
    var table = me.table = $(options.table),
        thead = $('<tr/>').appendTo($('<thead/>').appendTo(table)),
        tbody = $('<tbody/>').appendTo(table),
        tfoot = $('<tr/>').appendTo($('<tfoot/>').appendTo(table));

    var __ca, _width = options.columns.length;
    if (options.selectKey) {
        _width++;
        $('<th width="30" style="text-align:center"/>').append(__ca = $('<input type="checkbox"/>').click(function () {
            tbody.find('input[name="' + options.selectKey + '"]').attr('checked', this.checked);
            setSelected(tbody.find('input[name="' + options.selectKey + '"]:checked'));
        })).appendTo(thead);
        me.selectedValues = [];
        me.selectedRows = [];
    }

    //生成表头
    $.each(options.columns, function (i, column) {
        /// <param name="column" type="DataGridHeaderDefine">列定义</param>
        if (typeof column === 'string') column = { text: column };
        var cell = $('<th/>').appendTo(thead).append(column.sortKey ? $('<a href="javascript:;">' + column.text + '</a>').click(function () {
        }) : ('<span>' + column.text + '</span>'));
        if (column.width) cell.attr('width', column.width);
    });

    me.pageSize = options.pageSize;
    me.pageCount = 1;
    me.pageIndex = 1;
    me.recordCount = 0;
    //生成表尾分页部件
    var pager, pager_msg, _foot;

    function setSelected(inputs) {
        var values = [], rows = $();
        $.each(inputs, function (i, input) {
            if (input.checked) {
                values.push(parseInt(input.value));
                rows[i] = input.parentNode.parentNode;
                rows.length = i + 1;
            }
        });
        me.selectedValues = values;
        me.selectedRows = rows;
    };
    me.onload = options.onload || function () { };
    me.source = options.source;
    me.load = function (params) {
        me.load.params = $.extend({ pagesize: options.pageSize }, me.load.params, params);
        me.pageSize = options.pageSize = me.load.params.pagesize;
        if (me.pageSize > 0) {
            _foot = _foot || $('<td colspan="' + _width + '"></td>').appendTo(tfoot);
            pager_msg = (pager_msg || $('<label class="grid_pager"/>').appendTo(_foot));
            pager = (pager || $('<div class="grid_pager"/>').appendTo(_foot));
        }
        if (me.load.params.pagesize == -1) delete me.load.params.pagesize;

        if (this.source instanceof Function) this.source(me.load.params, me.fill);
        else $.service(this.source, me.load.params, me.fill);

        if (options.selectKey) {
            thead.find('input:checkbox:first').attr('checked', false);
        }

        return me;
    };
    me.records = [];
    me.fill = function (d, params) {
        if (!d) return;
        if (params) $.extend(me.load.params, params);
        if (options.pageSize > 0) {
            pager.empty(), pager_msg.empty();
            me.pageIndex = params ? params.pageindex : me.load.params.pageindex;
            me.pageCount = Math.ceil(d.count / (params ? params.pagesize : me.load.params.pagesize));
            me.recordCount = d.count;
            createPager.call([pager, pager_msg], me.pageIndex, me.pageCount);
        }

        tbody.empty();
        if (d.count) {
            $.each(me.records = d.data.rows, function (i, row) { me.addRow(row, true, i) });
        } else {
            me.showBodyMsg(options.emptyMsg);
        }
        me.onload.call(me, me.load.params, d);
    };
    me.load.params = {};
    $.extend(me.load.params, options.params);
    me.params = me.load.params;

    me.showBodyMsg = function (msg) {
        tbody.append($.gf('<tr><td colspan="{2}" class="empty">{1}</td></tr>', msg, _width));
        return me;
    };

    me.addRow = function (data, inner, index) {
        if (!inner) me.records.push(data);
        var r = document.createElement('TR'); tbody.append(r);
        if (options.selectKey) $('<td style="text-align:center"/>').appendTo(r).append($(String.$('<input type="checkbox" value="{1}" name="{2}"/>', data[options.selectKey], options.selectKey)).click(boxClick));
        $.each(options.cells, function (j, field) { $('<td' + (field && field.align ? ' align="' + field.align + '"' : '') + '/>').appendTo(r).append(DataGrid.Methods.$.call(me, field, data, index)) });
    };
    me.deleteRow = function (row, finish, css) {
        if (row === true) row = me.selectedRows;
        var i = 0;
        row.addClass(css || 'deleting').fadeOut('normal', function () {
            row.remove();
            finish && (++i === row.length) && finish();
        });
    };
    me.clear = function () {
        me.recordCount = me.pageCount = 0;
        me.records = [];
        tbody.empty();
    };
    me.selectRows = function (values) {
        if (!options.selectKey) throw '没有键列，不能选择行。';
        tbody.find('tr td:first input[name=' + options.selectKey + ']').each(function () {
            this.ckecked = (',' + this.value + ',').indexOf(',' + values.join(',') + ',') > -1;
        });
    };
    function boxClick(event) {
        var __cs = tbody.find('input[name="' + options.selectKey + '"]:checked');
        __ca.attr('checked', __cs.length == me.records.length);
        setSelected(__cs);
        options.oncheck && options.oncheck.call(me);
    };

    function createPager(index, count) {
        if (options.pagerMsg) {
            this[1].html(String.$(options.pagerMsg, {
                total: me.recordCount,
                start: (me.pageIndex - 1) * me.pageSize + 1,
                end: Math.min(me.recordCount, me.pageIndex * me.pageSize),
                index: me.pageIndex,
                size: me.pageSize,
                count: me.pageCount
            }));
        }
        if (count > 1) {
            var link;
            if (index > 1) {
                $.gf('<a href="javascript:\/\/page:previous;">上一页</a>', i + 1).appendTo(this[0]).click(function () { me.load({ pageindex: index - 1 }) });
            }
            for (var i = 0; i < Math.min(count, 3) ; i++) {
                link = $.gf('<a href="javascript:\/\/page:{1};">{1}</a>', i + 1).appendTo(this[0]).click(function () { me.load({ pageindex: parseInt($(this).text()) }) });
                if (i + 1 == index) link.addClass('current');
            }
            if (index > 6) {
                this[0].append('<span>...</span>');
                i = index - 3;
            }
            for (; i <= index + 1 && i < count; i++) {
                link = $.gf('<a href="javascript:\/\/page:{1};">{1}</a>', i + 1).appendTo(this[0]).click(function () { me.load({ pageindex: parseInt($(this).text()) }) });
                if (i + 1 == index) link.addClass('current');
            }
            if (index + 2 < count - 1) {
                this[0].append('<span>...</span>');
            }
            if (count > i) {
                link = $.gf('<a href="javascript:\/\/page:{1};">{1}</a>', count).appendTo(this[0]).click(function () { me.load({ pageindex: count }) });
                if (count == index) link.addClass('current');
            }
            if (index < count) {
                $.gf('<a href="javascript:\/\/page:next;">下一页</a>', i + 1).appendTo(this[0]).click(function () { me.load({ pageindex: index + 1 }) });
            }
            var go = $.gf('<input type="text" value="{1}" size="{2}" maxlength="{2}" style="width:{3}px"/>', index, String(count).length, String(count).length * 6 + 5).appendTo(this[0])
                .focus(function () { this.select() })
                .change(function () { this.value = isNaN(this.value) ? 1 : Math.min(Math.max(1, parseInt(this.value)), count) });
            $('<button>GO</button>').appendTo(this[0]).click(function () { me.load({ pageindex: go.intVal() }) });
        }
    }
};

DataGrid.Link = function (options) { $.extend(this, options) };
DataGrid.Link.prototype = { text: 'DataGrid.Link', href: '#', target: '_self', align: false };
DataGrid.Button = function (options) { $.extend(this, options) };
DataGrid.Button.prototype = { text: 'DataGrid.Button', click: function () { }, disabled: false, visible: true, align: false, cls: '' };
DataGrid.Label = function (options) { $.extend(this, options) };
DataGrid.Label.prototype = { text: 'DataGrid.Label', align: false, visible: true };

DataGrid.Methods = {
    $: function (input, source) {
        if (input instanceof Function) return input(source);
        if (typeof input === 'string') input = new DataGrid.Label({ text: input });
        var me = this, args = Array.prototype.slice.call(arguments, 1);

        if (input instanceof DataGrid.Label) {
            if ($$visible.call(source, input.visible)) {
                return String.$('<span class="dglabel"{1}>{2}</span>',
                        input.style ? ' style="' + input.style(source) + '"' : '',
                        input.text instanceof Function ? input.text(source) : input.text
                    ).replace(/{(.+?)}/g, function (all, x) { with (source) try { return eval(x) } catch (ex) { return all } }).replace(/{#(\w+)}/g, function (all, x) { return me.trans[x].apply(me, args) });
            }
        }
        if (input instanceof DataGrid.Link) {
            return String.$('<a class="dglink" href="{1}" target="{2}"{3}>{4}</a>',
                    input.href,
                    input.target,
                    input.style ? ' style="' + input.style(source) + '"' : '',
                    input.text instanceof Function ? input.text(source) : input.text
                ).replace(/{(\w+)}/g, function (all, x) { return source[x] });
        }
        if (input instanceof DataGrid.Button) {
            if ($$visible.call(source, input.visible)) {
                var disabled = $$disabled.call(source, input.disabled);
                return $(String.$('<a class="dgbutton{4}{3}" href="javascript:;"{2}>{1}</a>',
                        input.icon ? ('<img src="' + input.icon + '"/>') : (input.text instanceof Function ? input.text(source, me) : input.text.replace(/{(\w+)}/g, function (all, x) { return source[x] })),
                        input.style ? ' style="' + input.style(source) + '"' : '',
                        disabled ? ' disabled" disabled="disabled' : '',
                        input.cls ? ' ' + input.cls : '')
                    ).click(function () { if (disabled) return; var me = $(this); input.click({ src: me, row: me.parents('TR'), data: source }) });
            }
        }
        if (input instanceof Array) {
            for (var bs = $('<div/>'), i = 0, b; b = input[i++]; ) bs.append(arguments.callee(b, source));
            return bs.children();
        }

        function $$disabled(expression) {
            switch (typeof expression) {
                case 'boolean': return expression;
                case 'function': return expression.call(this);
                default: with (this) return eval(expression);
            }
        }
        function $$visible(expression) {
            switch (typeof expression) {
                case 'boolean': return expression;
                case 'function': return expression.call(this);
                default: with (this) return eval(expression);
            }
        }
    }
};

DataGrid.prototype = {
    selectedValues: null, //无需定义
    selectedRows: null,
    pageIndex: null,
    pageCount: null,
    params: {}
};

DataForm = function (options) {
    var me = this;
    this.form = $('<form action="javascript:;" method="post"><div/><p/></form>').submit(function () { options.onsubmit.call(me); });
    this.items = {};
    $.each(options.items, function (context) { context.add(this, context.form.find('div')) }, [this]);
    if (options.submit) this.form.find('p').append('<input class="submit" type="submit" value="' + options.submit + '"/>');
    if (options.cancel) $('<input class="cancel" type="button" value="' + options.cancel + '"/>').appendTo(this.form.find('p')).click(options.oncancel);
};
DataFormItem = { prototype: { label: '', key: '', type: '', items: null, nullable: true, text: '', click: function () { } } };
DataForm.prototype = {
    add: function (item, cont) {
        /// <param name="item" type="DataFormItem"/>
        var me = this, dl = $('<dl/>').appendTo(cont), dt = $('<dt/>').appendTo(dl), dd = $('<dd/>').appendTo(dl);
        dt.append(String.$(!!item.key ? '<label for="{1}">{3}{2}：</label>' : '{3}{2}：', item.key, item.label, item.key && !item.nullable ? '<b>*</b> ' : ''));

        var builder;

        switch (item.type) {
            case 'label':
                dd.append(item.text);
                break;
            case 'cmdlink':
                var el = $('<input type="hidden" id="' + item.key + '"/><a href="javascript:;" class="cmdlink"></a>').appendTo(dd);
                this.items[item.key] = $.extend(item, { el: el });
                el.eq(1).click(function () { item.click.call(el.eq(0)) });
                break;
            case 'number':
                this.items[item.key] = $.extend(item, {
                    el: $('<input type="text" id="' + item.key + '"/>').appendTo(dd).numberBox({ max: item.max, min: item.min, step: item.step })
                });
                break;
            case 'select':
                if (item.source) {
                    this.items[item.key] = { '#source$': item.source };
                    item.options = [];
                    item.source({}, function (d) {
                        $.each(d.data.rows, function (i, x) {
                            item.options.push([x[item.field[0]], x[item.field[1]]])
                        });
                        select_done(me.items[item.key].loaded);
                    });
                } else {
                    select_done();
                }
                break;
            case 'radiogroup':
                builder = [];
                $.each(item.options, function (i, option) { builder.push('<input type="radio" value="' + option[0] + '" name="' + item.key + '" id="' + item.key + '_' + i + '"/><label for="' + item.key + '_' + i + '">' + option[1] + '</label>') });
                this.items[item.key] = $.extend(item, {
                    el: $('<div class="radiogroup">' + builder.join('') + '</div>').appendTo(dd)
                });
                break;
            case 'textarea':
                this.items[item.key] = $.extend(item, { el: $('<textarea type="' + (item.type || 'text') + '" id="' + item.key + '" name="' + item.key + '" rows="5" cols="30" />').appendTo(dd) });
                break;
            default:
                debugger;
                this.items[item.key] = $.extend(item, { el: $('<input type="' + (item.type || 'text') + '" id="' + item.key + '" name="' + item.key + '" ' + (item.length ? (' maxlength="' + item.length + '"') : '') + ' />').appendTo(dd) });
        }
        function select_done(loaded) {
            builder = [];
            if (item.options) {
                $.each(item.options, function (i, option) { builder.push('<option value="' + option[0] + '">' + option[1] + '</option>') });
            }
            me.items[item.key] = $.extend(item, {
                el: $('<select id="' + item.key + '">' + builder.join('') + '</select>').appendTo(dd)
            });
            if (loaded) loaded();
        }
    },
    set: function (key, value) {
        var me = this;
        if ('#source$' in this.items[key]) {
            this.items[key].loaded = function () {
                me.set(key, value);
            };
            return;
        }
        var el = this.items[key].el;

        switch (this.items[key].type) {
            case 'cmdlink':
                el[0].value = value[0];
                el[1].innerHTML = value[1];
                break;
            case 'radiogroup':
                el.find('input[type=radio]').each(function (i, radio) { if (radio.value == value) { radio.checked = true; return false } });
                break;
            default:
                el.val(value);
        }
    },
    get: function (key) {
        var el = this.items[key].el;

        switch (this.items[key].type) {
            case 'cmdlink':
                return el[0].value;
                break;
            case 'radiogroup':
                for (var rs = el.find('input[type=radio]'), i = 0, r; r = rs[i++]; )
                    if (r.checked) return r.value;
                break;
            default:
                return el.val();
        }
    },
    check: function () {
        return true;
    },
    changed: function () {
        return true;
    }
};

HashManager = function (ready) {
    if (window.location.hash) {
        this.hash = eval('({' + window.location.hash.substr(1) + '})');
    }
    ready.call(this, this.hash);
};
HashManager.prototype = {
    hash: {},
    set: function (pairs, raise) {
        var orin = $.extend({}, this.hash);

        for (var key in pairs) {
            if (pairs[key] === null) {
                if (this.hash[key] !== undefined) delete this.hash[key];
            } else {
                this.hash[key] = pairs[key];
            }
        }
        window.location.hash = $.fromJSON(this.hash, true);
        if (raise === true) {
            for (var x in this.watches) {
                if (orin[x] !== this.hash[x]) {
                    this.watches[x](this.hash[x]);
                }
            }
        }
    },
    clear: function () { this.hash = {}; return this },
    watches: {},
    watch: function (key, callback) {
        if (typeof key === 'object')
            for (var c in key) arguments.callee.call(this, c, key[c]);

        if (callback === null) {
            if (this.watches[key]) delete this.watches[key];
        } else {
            this.watches[key] = callback;
        }
    }
};

jQuery.readyH = function (callback) {
    jQuery(function () {
        new HashManager(function (x) {
            callback(this, x);
        });
    });
};

cookie = {
    get: function (name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        return arr != null ? decodeURIComponent(arr[2]) : null;
    },
    set: function (name, value, expire) {
        if (value === null) expire = -1;
        if (expire) {
            var exdate = new Date();
            exdate.setTime(exdate.getTime() + (expire * 24 * 60 * 60 * 1000));
            expire = '; expires=' + exdate.toUTCString();
        }
        document.cookie = [name, '=', encodeURIComponent(value), expire].join(''); //name + "=" + encodeURIComponent(value) + ";expires=" + exdate.toGMTString();
    }
};
uic = (function () {
    function confirm(text, ok, rect, width, boxKey) {
        if (window.confirm(text)) ok();
        //if (cookie.get(boxKey) == 'y') return ok();
        //
        //var c = $(String.$('<div class="confirm" style="position:absolute;width:{1}px;top:{2}px;left:{3}px;" class="confirm"><span></span><div>{4}</div><p>{5}<button type="button">确定</button></p></div>',
        //    width,
        //    rect.top + rect.height + 5,
        //    rect.left - width - 12 + 5 + 9 + rect.width * .5,
        //    text,
        //    boxKey ? '<label><input type="checkbox">不再提示</label>' : ''
        //)).appendTo('body').mouseleave(function () { c.remove() });
        //
        //c.find('button').click(function () { ok(); if (!!boxKey && c.find('input')[0].checked) cookie.set(boxKey, 'y'); c.fadeOut(function () { c.remove() }); });
    }
    function tip(msg) {

    }

    return {
        confirm: confirm,
        tip: tip
    };
})();
jQuery.fn.numberBox = function (options) {
    /// <param name="options" type="Object">
    /// <para>max,min,step</para>
    /// </param>
    $(this).each(function (i, input) {
        NumberBox(input, options);
    });
    return this;
};
function NumberBox(input, options,onNumberChange) {
    if (input.readOnly) return;
    input = $(input).attr({ 'autocomplete': 'off' });

    this.setMax = function (v) {
        options.max = v;
        $(input).each(function (i, input) {
            if (Number(input.value) > v) input.value = v;
        });
    };
    this.setMin = function (v) {
        options.min = v;
        $(input).each(function (i, input) {
            if (Number(input.value) < v) input.value = v;
        });
    };
    $('<a href="javascript:\/\/+;" class="up" tabindex="-1"></a>\
        <a href="javascript:\/\/-;" class="down" tabindex="-1"></a>')
    .appendTo($('<span class="numberbox"/>').insertAfter(input).append(input))
    .click(function (e) { input.val(add(e.target.href.indexOf('+') > 0)).change() });

    input.bind('mousewheel', function (e) {
        if (input.is(':focus')) {
            input.val(add(e.originalEvent.wheelDelta > 0)).change().select();
            return false;
        }
    }).keydown(function (e) {
        e = e.keyCode;
        if (e.between(37, 40) || e.between(8, 9) || e == 46 || e.between(96, 105) || e.between(48, 57)) {
            if (e == 40 || e == 38) {
                input.val(add(e == 38)).change().select();
            }
        }
        else return false;
    }).keyup(function (e) {
        e = e.keyCode;
        if (e.between(37, 40) || e.between(8, 9) || e == 46 || e.between(96, 105) || e.between(48, 57)) {
            if (onNumberChange != null)
            {
                var num = parseFloat(input.val());
                if (isNaN(num)) {
                    num = options.min;
                    input.val(num);
                }
                if (num > options.max)
                    onNumberChange(options.max);
                else if(num < options.min)
                    onNumberChange(options.min);
                else
                    onNumberChange(num);

            }
        }

    }).change(function () {
        if (isNaN(this.value)) {
            this.value = options.min;
        } else {
            var v = Number(parseFloat(this.value).toFixed(4)); if (!v.between(options.min, options.max)) {
                this.value = Math.max(Math.min(v, options.max), options.min);
            }
        }

    });

    function add(x) {
        var v = Number(input.val()) + (x ? options.step : -options.step);
        var number = Number(Math.min(Math.max(v, options.min), options.max).toFixed(4));
        if (onNumberChange != null)
            onNumberChange(number);
        return number;
    }
};
Number.prototype.between = function (min, max) {
    return min <= this && this <= max;
};

utility = {
    form: function (form) {
        /// <param name="form" type="jQuery"></param>
        form = $(form)[0];
        return {
            get: function (name) {
                var el = form.elements[name];
                if ('length' in el) {
                    if (!el.length) return '';
                    var values = [];
                    for (var i = 0, e; e = el[i++];) {
                        if (e.checked || e.selected) values.push(e.value);
                    }
                    return values.length == 1 ? values[0] : values;
                } else {
                    return el.value;
                }
            }
        }
    }
};
if ('fireEvent' in document.documentElement == false) {
    HTMLElement.prototype.fireEvent = function (eventName) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent(eventName.substr(2), true, true);
        this.dispatchEvent(event);
    }
};
if ('indexOf' in Array.prototype == false) {
    Array.prototype.indexOf = function (item) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === item) return i;
        }
        return -1;
    }
};


function QueryString(name) {
    var AllVars = window.location.search.substring(1);
    var Vars = AllVars.split("&");
    for (i = 0; i < Vars.length; i++) {
        var Var = Vars[i].split("=");
        if (Var[0] == name) return Var[1];
    }
    return "";
};

Function.overLoad = function (dispatcher, functionMaps) {
    /// <summary>函数参数重载方法
    /// <para>对函数参数进行模式匹配   一个任意类型?    任意多个某类型type*    任意个任意类型.*</para>
    /// <para>默认的dispatcher支持*和...以及?，"*"表示一个任意类型的参数，"..."表示多个任意类型的参数，"?"一般用在",?..."表示0个或任意多个参数</para>
    /// </summary>
    /// <param name="dispatcher" type="Function" optional="true">用来匹配参数负责派发的函数</param>
    /// <param name="functionMaps" type="Object">函数映射表</param>
    /// <returns type="Function" />
    if (!(dispatcher instanceof Function)) {
        functionMaps = dispatcher;
        dispatcher = function (args) {
            return Array.prototype.map(args, function (object) {
                return typeof object === 'object' ? Object.prototype.toString.call(object).slice(8, -1).toLowerCase() : typeof object;
            }).join();
        }
    }
    return function () {
        var key = dispatcher.call(this, Array.prototype.slice.apply(arguments));
        for (var i in functionMaps)
            if (new RegExp("^" + i.replace("*", "[^,]*").replace("...", ".*") + "$").test(key))
                return functionMaps[i].apply(this, arguments);
    }
};
xx = location.hostname === 'localhost' ? {
    alert: function (message) { window.alert(message); },
    log: function (message) { if (console && console.log) console.log(message); },
    dir: function (message) { if (console && console.dir) console.dir(message); }
} : { alert: function () { }, log: function () { }, dir: function () { } };

function showLoding(msg) {
    /// <summary>此消息将延迟0.5秒显示。&#10;如果操作在0.5秒以内完成，则不会显示该消息。</summary>
    var win, timer = setTimeout(function () {
        win = new gzy.popup(null, 220, 45, {
            html: '<div style="text-align:center;padding-top:6px;font-size:12px">' + (msg || "请稍候...") + '<img src="/images/ajax-loader.gif"/></div>'
        });
    }, 500);
    return {
        close: function () {
            clearTimeout(timer);
            win && win.close();
        }
    }
};


function loadScript(scripts) {
    /// <param name="scripts" type="Object[]">{ id, src, onload }</param>
    /// <param name="callback" type="Function"></param>

    var callback;
    if (arguments[arguments.length - 1] instanceof Function) {
        callback = arguments[arguments.length - 1];
        scripts = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
    } else {
        callback = function () { };
        scripts = arguments;
    }
    var count = 0, all = scripts.length;

    for (var i = 0, script; i < all; i++) {
        script = scripts[i];
        if ($('script#' + script.id).length >0) {
            ++count == all && callback();
            continue;
        }
        var js = document.createElement('script');
        var k;
        if (i == 0)
            k =js;
        js.setAttribute('type', 'text/javascript');
        js.setAttribute('src', script.src);
        js.setAttribute('id', script.id);
        document.getElementsByTagName('head')[0].appendChild(js);
        if ('onreadystatechange' in js) {
            js.onreadystatechange = function () {
                if (js.readyState == 'complete' || js.readyState == 'loaded') {
                    ++count == all && callback();
                }
            };
        } else {
            js.onload = function () {
                ++count == all && callback();
            }
        }
    }
};

///<param>userType:可访问的用户类型列表,多个类型之间用逗号分隔
///可用用户类型：Student,Teacher,RandAccount
///</param>
function checkPageAccessPermision(userTypes,curUserType, defaultUrl) {
    if (userTypes.toLowerCase().indexOf(curUserType.toLowerCase()) == -1)
        location.replace(defaultUrl);
};


function getFileSize(obj) {
    var objValue = obj.value;
    if (objValue == "") return;
    var fileLenth = -1;
    try {
        //对于IE判断要上传的文件的大小  
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        fileLenth = parseInt(fso.getFile(objValue).size);
    } catch (e) {
        try {
            //对于非IE获得要上传文件的大小  
            fileLenth = parseInt(obj.files[0].size);
        } catch (e) {
            fileLenth = -1;

        }

    }

    return fileLenth;
};

function getFileSizeName(fileSize,fractionDigits) {
    if(fractionDigits ==null)
        fractionDigits = 1;
    var unit='B';
    if (fileSize > 1024) {
        unit = 'KB';
        fileSize = fileSize / 1024;
    }
    if (fileSize > 1024) {
        unit = 'MB';
        fileSize = fileSize / 1024;
    }
    if (fileSize > 1024) {
        unit = 'GB';
        fileSize = fileSize / 1024;
    }
    if (fileSize > 1024) {
        unit = 'TB';
        fileSize = fileSize / 1024;
    }
    return fileSize.toFixed(fractionDigits) + unit;
};

jQuery.fn.slideLeftHide = function (speed, callback) {
    /// <param name="speed" type="String">显示速度</param>
    this.animate({ width: "hide", paddingLeft: "hide", paddingRight: "hide", marginLeft: "hide", marginRight: "hide" }, speed, callback);
};
jQuery.fn.slideLeftShow = function (speed, callback) {
    this.animate({ width: "show", paddingLeft: "show", paddingRight: "show", marginLeft: "show", marginRight: "show" }, speed, callback);
};



