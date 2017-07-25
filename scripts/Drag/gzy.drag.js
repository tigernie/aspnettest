/// <reference path="../../jquery-1.4.1-vsdoc.js" />

if (typeof gzy === 'undefined') gzy = {};

(function()
{
    //var fix = jQuery.event.fix;
    //jQuery.event.fix = function (event)
    //{
    //    var e = fix.call(jQuery.event, event); 
    //    e.x = e.pageX;
    //    e.y = e.pageY;
    //    e.src = $(e.target);
    //    with (e.src.rect()) e.offsetX = e.x - left, e.offsetY = e.y - top;
    //    return e;
    //}
})();

$.fn.extend({
    moveTo: function (x, y)
    {
        return this.each(function () { with (this.style) { left = x + 'px'; top = y + 'px' } });
    },
    rect: function ()
    {
        var p = this[0].getBoundingClientRect();

        return $.extend({
            width: p.right - p.left,
            height: p.bottom - p.top,
            include: function (e) { return p.left < e.x && e.x < p.right && p.top < e.y && e.y < p.bottom }
        }, p);
    },
    drag: function (module, options)
    {
        /// <param name="module" type="jQuery">被拖动的对象</param>
        /// <param name="options" type="DragOptions">拖动的参数设置
        /// <para>Function ondrag({ left, top, width, height }): 在拖动过程中执行的函数, 参数为移动对象的位置信息. 如果此函数返回false, 则不会发生移动.</para>
        /// <para>Function onstop(): 拖放完毕, 松开鼠标时执行.</para>
        /// <para>Boolean lockX, lockY: 是否在X/Y方向锁定坐标.</para>
        /// <para>Rect box { left, top, width, height }: 指定一个区域, 对象只能在该区域内移动.</para>
        /// </param>
        var me = $(this);

        me.mousedown(function (e)
        {
            new gzy.drag(e, module || me.parent(), me, options)
        });
    }
});

var clearSelection = window.getSelection ?
    function () { window.getSelection().removeAllRanges() } :
    function () { document.selection.empty() };

function DragOptions() { };
DragOptions.prototype = {
    cursor: 'move',
    ondrag: function (e) { },
    onstop: function (e) { },
    box: null,
    lockX: false,
    lockY: false,
    init: function (module, handle) { }
};

gzy.drag = function (e, module, handle, options)
{
    /// <param name="e" type="jQuery.Event">注册拖动事件时的事件对象</param>
    /// <param name="module" type="jQuery">被移动的对象</param>
    /// <param name="handle" type="jQuery">拖动的手柄</param>
    /// <param name="options" type="DragOptions">拖动的参数设置
    /// <para>Function ondrag(e): 在拖动过程中执行的函数, 参数为移动对象的位置信息. 如果此函数返回false, 则不会发生移动.</para>
    /// <para>Function onstop(e): 拖放完毕, 松开鼠标时执行.</para>
    /// <para>Boolean lockX, lockY: 是否在X/Y方向锁定坐标.</para>
    /// <para>Rect box { left, top, width, height }: 指定一个区域, 对象只能在该区域内移动.</para>
    /// </param>
    if (this === gzy) throw new Error('please create new instance of dragable.');

    options = $.extend(new DragOptions(), options);

    if (handle === true) handle = module;

    $(document).mousemove(move).mouseup(stop);
    if ($.browser.msie) handle[0].setCapture();
    handle.css({ cursor: options.cursor });

    var m = module[0], x = m.offsetLeft - e.clientX, y = m.offsetTop - e.clientY,
        w = module.width(), h = module.height();

    var box = options.box;
    if (box === window) with ($(window)) box = { left: -1 * width(), top: -1 * height(), width:2* width(), height:2* height() };
    if (box && box.nodeType) box = $(box).rect();

    this.lockX = !!options.lockX, this.lockY = !!options.lockY;

    options.init.call(this, module, handle);

    function move(e)
    {
        clearSelection();

        var left = x + e.clientX, top = y + e.clientY;

        if (box) left = Math.max(Math.min(left, box.width - w), box.left), top = Math.max(Math.min(top, box.height - h), box.top);
        if (options.ondrag.call(this, e) !== false)
        {
            if (!this.lockX) m.style.left = left + 'px';
            if (!this.lockY) m.style.top = top + 'px';
        }
    }

    function stop(e)
    {
        $(document).unbind('mousemove', move).unbind('mouseup', stop);
        handle.css({ cursor: 'move' });
        if ($.browser.msie) handle[0].releaseCapture();
        options.onstop(e);
    }
}
