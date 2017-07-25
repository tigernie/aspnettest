/// <reference path="../jquery-1.7.1-vsdoc.js" />

; (function (scripts)
{
    document.writeln('<link rel="stylesheet" type="text/css" href="' + scripts[scripts.length - 1].src.replace(/\.js$/i, '.css') + '"/>');
})(document.getElementsByTagName('SCRIPT'));

if (typeof gzy === 'undefined') gzy = {};

function PopupWindowOptions(options) { $.extend(this, options) };
PopupWindowOptions.prototype = { html: '', url: '', element: null, icon: '', top: -1, left: -1, cmd: new Function, onload: new Function, onclose: new Function, useMask: true, buttons: [], info: '', target: self };

gzy.popup = function (title, width, height, options) {
    /// <param name="title" type="String">弹出窗口的标题。如为空字符串""，则不会生成标题栏。</param>
    /// <param name="width" type="Int">必须，弹出窗口的宽度。</param>
    /// <param name="height" type="Int">必须，弹出窗口的高度。</param>
    /// <param name="options" type="PopupWindowOptions">窗口的选项设置。
    /// <para>String html: 要设置到窗口的HTML内容</para>
    /// <para>String url: 要设置到窗口的页面地址</para>
    /// <para>String element: 要设置到窗口的元素对象</para>
    /// <para>String icon: 窗口标题前面的图标地址，16*16px</para>
    /// <para>String cls: 窗口内容的附加样式</para>
    /// <para>Boolean useMask: 指定窗口是否使用背景遮罩</para>
    /// <para>Int left, top: 窗口初始位置x、y坐标，如不指定则定位于浏览器中央</para>
    /// <para>Function cmd( args ): 响应窗口内执行的函数</para>
    /// <para>Function onload( win ): 窗口打开后执行的函数，this 指向当前窗口。如指定 url，则在 url 打开后执行，win 为 IFrame 中的 window 对象。</para>
    /// </param>
    if (this === gzy) throw new Error('please create new instance of tabset.');

    options = new PopupWindowOptions(options);

    var me = this, id = options.id || (new Date().valueOf().toString());

    top.zIndex = top.zIndex || 10000;

    with ($(options.target)) var win_h = height(), win_w = width(), st = scrollTop();

    var position = $.browser.msie && $.browser.version == '6.0' ? 'absolute' : 'fixed';
    
    if (title !== null) {
        var icon = options.icon ? '<img src="' + options.icon + '" style="width:16px;height:16px;vertical-align:middle;margin:-2px 6px 0 0;" ondblclick="top.gzy.popup.instance[\'' + id + '\'].close()"/>' : '';
        title = '\
            <div class="popup_title" style="margin:0;background-color:#e9f2fb;">\
                <label style="float:left">' + icon + title + '</label>\
                <span style="float:right"><a href="javascript:;" style="border-width:0" onclick="top.gzy.popup.instance[\'' + id + '\'].close()"></a></span>\
            </div>'
    }
    var mask = options.useMask === false ? '' : '<div style="border:0;position:' + position + ';top:0;left:0;width:100%;height:100%;_height:' + Math.max(win_h, $(document.body).height()) + 'px;background:silver;filter:alpha(opacity=50);opacity:.5;display:none;z-index:' + (top.zIndex++) + '"></div>';

    var info = !options.info ? '' : ('<div class="popup_info">' + options.info + '</div>');

    var popup = $(mask +
        '<div style="position:' + position + ';overflow:hidden;background-color:white;display:none;width:' + width + 'px;z-index:' + (top.zIndex++) + ';top:' + ((options.top === -1 ? (win_h - height) * .5 : options.top) + (position === 'absolute' ? st : 0)) + 'px;left:' + (options.left === -1 ? (win_w - width) * .5 : options.left) + 'px;" class="popup_window">\
            ' + (title || '') + info + '<div class="popup_body ' + (options.cls || '') + '" style="height:' + height + 'px;zoom:1;overflow:hidden;overflow:' + (options.overflow || 'auto') + '"></div>\
        </div>\
    ').appendTo(options.target.document.body);
    
    if (options.buttons.length) {
        me.buttons = {};
        var popup_buttons = $('<div class="popup_buttons"></div>').appendTo(popup.last()), el;
        for (var i = 0, btn; btn = options.buttons[i++];) {
            if ('label' in btn) {
                el = $('<label/>').appendTo(popup_buttons).html(btn.label);
            } else {
                el = $('<button' + (btn.enable === false ? ' disabled="disabled"' : '') + (btn.id ? ' id="' + btn.id + '"' : '') + '>' + btn.text + '</button>').click(btn.isCancel ? function () { me.close() } : btn.click).appendTo(popup_buttons);
            }
            if (btn.id) me.buttons[btn.id] = el;
        }
    };

    title && $.fn.drag && popup.find('div.popup_title').drag(null, { box: window });

    var content, holder;
    if (options.html) content = options.html;
    else if (options.url) content = $('<iframe src="' + options.url + '" frameborder="0" width="100%" height="100%"></iframe>');
    else if (options.element) {
        content = $(options.element);
        holder = content.after('<br/>').next();
    }

    me.body = popup.show().last().children('div.popup_body').append(content);
    if (options.url) content.load(function () { me.body = $(content[0].contentWindow.document.body) });

    options.url ?
        content.load(function () { options.onload.call(window, content[0].contentWindow); content[0].contentWindow.focus()/**/ }) :
        setTimeout(function () { options.onload.call(window) }, 0);

    top.gzy.popup.instance[id] = me;

    me.close = function () {
        if (options.onclose() !== false) {
            holder && holder.replaceWith(content);
            popup.remove();
            delete top.gzy.popup.instance[id];
            options.afterclose && options.afterclose();
        }
    };
    me.setTitle = function (title) {
        popup.find('.popup_title label').text(title);
        return me;
    };
    me.setRect = function (rect, done) {
        me.body.parent().animate(rect, done);
        return me;
    };

    me.cmd = options.cmd;
}

if (typeof top.gzy === 'undefined') top.gzy = {};
if (typeof top.gzy.popup === 'undefined') top.gzy.popup = {};
if (!top.gzy.popup.instance) {
    top.gzy.popup.instance = {};
    top.gzy.popup.close = function (pid) {
        if (pid) top.gzy.popup.instance[pid].close();
        else for (pid in top.gzy.popup.instance) top.gzy.popup.instance[pid].close();
    }
}
