/// <reference path="../../jquery-1.4.1-vsdoc.js" />

; (function (scripts) {
    document.writeln('<link rel="stylesheet" type="text/css" href="' + scripts[scripts.length - 1].src.replace(/\.js$/i, '.css') + '"/>');
})(document.getElementsByTagName('SCRIPT'));

if (typeof gzy === 'undefined') gzy = {};

$.fn.menu = function (options, items) {
    /// <param name="options" type="MenuOptions">菜单配置参数
    /// <para>String method: 触发菜单的方法，默认为 contextmenu，即点击右键或按下 Menu 键。</para>
    /// <para>String icons: 此菜单所有菜单项使用的图标文件。此文件应被设计为 16*16px 的图标集，且第一个图标的位置留空。</para>
    /// </param>
    /// <param name="items" type="MenuItem[]">菜单项的集合
    /// <para>String text: 菜单项上显示的文本。</para>
    /// <para>String href: 菜单项的链接地址，默认为“javascript:;”。</para>
    /// <para>String icon: 单独为此项指定图标。</para>
    /// <para>Int iconX, iconY: 此菜单项图标在图标集上的偏移位置。</para>
    /// <para>MenuItem[] items: 此菜单项的下一级菜单项。</para>
    /// <para>Function cmd: 点击该项时要执行的函数，其中的 this 指向激发菜单的元素。</para>
    /// <para>Boolen enable: 表示该项是否可用。</para>
    /// </param>
    options = new MenuOptions(options);
    options.target = this.selector;
    new gzy.menu(options, items);
    return this;
};

function MenuOptions(options) { $.extend(this, options) };
MenuOptions.prototype = { target: 'body', method: 'contextmenu', icons: '', items: [], dataGetter: function (e) { return e }, beforeShow: function () { return true } };

gzy.menu = function (options, items) {
    /// <param name="options" type="MenuOptions">菜单配置参数
    /// <para>String target: 使用该菜单的目标元素规则，请使用符合 jQuery 选择器的字符串。</para>
    /// <para>String method: 触发菜单的方法，默认为 contextmenu，即点击右键或按下 Menu 键。</para>
    /// <para>String icons: 此菜单所有菜单项使用的图标文件。此文件应被设计为 16*16px 的图标集，且第一个图标的位置留空。</para>
    /// <para>Function dataGetter(e): 定义一个函数, 用于向 command 函数的 e 参数传值。</para>
    /// </param>
    /// <param name="items" type="MenuItem[]">菜单项的集合
    /// <para>String text: 菜单项上显示的文本。</para>
    /// <para>String href: 菜单项的链接地址，默认为“javascript:;”。</para>
    /// <para>String icon: 单独为此项指定图标。</para>
    /// <para>Int iconX, iconY: 此菜单项图标在图标集上的偏移位置。</para>
    /// <para>MenuItem[] items: 此菜单项的下一级菜单项。</para>
    /// <para>Function command: 点击该项时要执行的函数，其中的 this 指向激发菜单的元素。</para>
    /// <para>Boolean enable: 表示该项是否可用。</para>
    /// </param>
    if (this === gzy) throw new Error('please create new instance of menu.');
    if (!top.zIndex) top.zIndex = 10000;

    options = new MenuOptions(options);

    var me = this;

    $('body').bind(options.method, function (e) {
        if (!$(e.target).is(options.target)) return;

        me.target = e.target;
        me.dataGetter = options.dataGetter;

        if (options.beforeShow.call(me) !== false)
            me.create(items, me.base = $('<div style="top:' + (e.pageY - 2) + 'px;left:' + (e.pageX - 2) + 'px;z-index:' + (top.zIndex++) + '" class="menu"/>'))
              .mouseleave(function () { $(this).remove() })
              .appendTo(document.body);

        return false;
    });

    MenuItem.prototype.icon = options.icons;
};

function MenuItem(item) { $.extend(this, item); };
MenuItem.prototype = { text: 'new Item', href: 'javascript:;', icon: '', iconX: 0, iconY: 0, items: [], command: new Function, enable: true };

gzy.menu.prototype.create = function (items, baseNode) {
    /// <private />
    var me = this, ul = $('<ul/>').appendTo(baseNode);

    $.each(items, function (i, item) {
        if (item === '-' || item.text === '-')
            return $('<li class="separate" />').appendTo(ul);

        item = new MenuItem(item);

        if (item.enable instanceof Function ? item.enable.call(me) : item.enable) {
            var li = $('<li><a href="' + item.href + '">' + item.text + '</a></li>').appendTo(ul), a = li.children();
            li.hover(function () { li.addClass('current') }, function () { li.removeClass('current') });

            if (item.items.length) me.create(item.items, $('<div/>').appendTo(li));
            else a.click(function (e) { me.base.remove(); item.command.call(me, me.dataGetter(e)) });
        } else {
            var a = $('<li><label>' + item.text + '</label></li>').appendTo(ul).children();
        }

        if (item.icon && item.iconX || item.iconY)
            $('<span style="background:url(' + item.icon + ') -' + item.iconX + 'px -' + item.iconY + 'px"/>').appendTo(a);
    });

    return baseNode;
}