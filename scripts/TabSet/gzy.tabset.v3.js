/// <reference path="../jquery-1.7.1-vsdoc.js" />

if (typeof gzy === 'undefined') gzy = {};

function format$object(string, object)
{
    return string.replace(/{(\w+?)}/g, function (all, x) { return object[x] });
};

function TabSetOptions(options) { $.extend(this, options) };
TabSetOptions.prototype = {
    method: 'click',
    normalCss: 'normal',
    currentCss: 'current',
    defaultTab: 0,
    transfer: function (current, last) { last.panel.hide(); current.panel.show() },
    manual: function (current) { },
    changed: function (current) { },
    changing: function (current, last) { return true },
    init: function (tabs, panels) { },
    delay: 0,
    tabTemplate: '',
    tabContainer: null,
    panelContainer: null,
    playInterval: 0,
    allowReRun: false
};
function TabPanelGroup(options) { $.extend(this, options) };
TabPanelGroup.prototype = { tab: null, panel: null, text: 'newTab', index: -1 };

gzy.tabset = function (tabs, panels, options) {
    /// <param name="tabs" type="jQuery">面板控制对象组</param>
    /// <param name="panels" type="jQuery">内容面板组</param>
    /// <param name="options" type="TabSetOptions">选项卡组件设置
    /// <para>String method: 设置触发切换的动作名称，默认为 click。</para>
    /// <para>String normalCss, String currentCss: 常规选项卡和当前选项卡的样式名，默认为 normal 和 current。</para>
    /// <para>Function manual: 手动切换之前执行。</para>
    /// <para>Function transfer(current, last): 内容面板的切换效果，默认为直接切换。</para>
    /// <para>Function changed(current): 切换完成时执行。</para>
    /// <para>Function init(tabs, panels): 初始化选项卡行为时执行。</para>
    /// <para>Int defaultTab: 默认选项卡索引，默认为 0</para>
    /// <para>Int delay: 手动切换时的延迟时间。</para>
    /// <para>String tabTemplate: 新标签模板，如要用 text 添加标签，必须指定此参数。</para>
    /// <para>jQuery tabContainer, panelContainer: 新标签、新面板的容器。如要添加标签，则必须指定。</para>
    /// <para>Int playInterval: 指定自动切换的时间间隔，默认为 0，即不自动切换。</para>
    /// </param>
    if (this === gzy) throw new Error('please create new instance of tabset.');

    var me = this, playTimer;
    options = new TabSetOptions(options);

    this.tabs = $(tabs);
    this.panels = $(panels).hide();

    this.current = { tab: $(), panel: $(), index: -1 };
    this.groups = [];

    options.init.call(this, me.tabs, me.panels);
    me.tabs.each(function (i) { init({ tab: me.tabs.eq(i), panel: me.panels.eq(i), index: i }) });

    this.show = function (index) { run(get(index)) }
    if (options.defaultTab !== false) this.show(options.defaultTab);

    this.add = function (group) {
        /// <param name="group" type="TabPanelGroup">包含新建选项卡的信息
        /// <para>String text: 要新建选项卡的文字。</para>
        /// <para>Int index: 新选项卡的位置。</para>
        /// <para>jQuery tab: 作为新选项卡的对象。</para>
        /// <para>jQuery panel: 作为新面板的对象。</para>
        /// </param>
        group = new TabPanelGroup(group);

        var index = group.index,
            refer = get(index) || { tab: $(options.tabContainer), panel: $(options.panelContainer), index: -1 },
            relat = refer.index < 0 ? 'appendTo' : index < 0 ? 'insertAfter' : 'insertBefore';

        group.index = index = index < 0 ? index + me.groups.length + 1 : index;

        var tab = group.tab || $(format$object(options.tabTemplate, group))[relat](refer.tab),
            panel = refer.panel[0] ? $(group.panel)[relat](refer.panel) : $(group.panel).appendTo(options.panelContainer);

        $.each(me.groups, function (i, x) { if (x.index >= index) x.index++ });
        init(group = { tab: tab, panel: panel, index: index });

        this.show(index);
        return group;
    };
    this.remove = function (index) {
        var ro = get(index);
        ro.tab.remove() && ro.panel.remove();
        me.groups = me.groups.slice(0, ro.index).concat(me.groups.slice(ro.index + 1));
        $.each(me.groups, function (i, x) { if (x.index >= ro.index) x.index-- });
        me.show(ro.index === 0 ? 0 : ro.index === me.groups.length ? -1 : ro.index - 1);
    };
    this.exist = function (index) {
        if (index < 0 || index >= me.tabs.length) return null;
        return index;
    }
    function get(i) {
        return i < 0 ? me.groups.slice(i)[0] : me.groups[i];
    }
    function init(group) {
        me.groups = me.groups.slice(0, group.index).concat(group, me.groups.slice(group.index));

        if (options.delay > 0) {
            var timer;
            group.tab.mouseleave(function () { clearTimeout(timer) })
                  [options.method](function () {
                      timer = setTimeout(function () { run(group) }, options.delay);
                      if (options.playInterval > 0) clearInterval(playTimer), play();
                  });
        }
        else
            group.tab[options.method](function () {
                options.manual(group);
                run(group);
                if (options.playInterval > 0) clearInterval(playTimer), play();
            });
    }
    function run(curr) {
        if (!curr) return;

        var last = me.current;

        if (options.changing(curr, last) === false) return;
        if (me.current.index === curr.index) if (!options.allowReRun) return;

        me.current = curr;

        last.tab.removeClass(options.currentCss).addClass(options.normalCss);
        curr.tab.removeClass(options.normalCss).addClass(options.currentCss);

        options.transfer(curr, last);
        options.changed(curr);
    }

    function play() {
        playTimer = setInterval(function () {
            me.show(me.current.index === me.groups.length - 1 ? 0 : me.current.index + 1);
        }, options.playInterval);
    }
    if (options.playInterval > 0) play();
}

gzy.tabset.setup = function (options)
{
    /// <summary>设置组件的默认选项值,该语句之后建立的所有实例都具有此选项,直到选项下一次被修改.</summary>
    /// <param name="options" type="TabSetOptions" />
    TabSetOptions.prototype = $.extend(TabSetOptions.prototype, options);
}

$.fn.extend({
	tabset: function (panels, options) {
		return new gzy.tabset(this, panels, options);
	}
});
