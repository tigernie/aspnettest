<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="JudgerTeacherList.aspx.cs" Inherits="Web.JudgerTeacherList" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<title>选择阅卷老师</title>
<script src="scripts/progressBar/jquery-1.8.3.js" type="text/javascript"></script>
<script type="text/javascript" src="scripts/PopWindow/gzy.popup.js"></script>
<script src="scripts/JudgerTeacher.js" type="text/javascript"></script>
<script src="scripts/common.js" type="text/javascript"></script>
<script src="scripts/lib/judge.js" type="text/javascript"></script>
<link href="styles/style.css" rel="stylesheet" />
<style type="text/css">
    .titleText { background-color: #e1e1e1; }
    .text { padding: 5px 15px; }
    .teacher_list { padding: 6px 0 0 6px; overflow: hidden; }
    .teacher_list label { float: left; margin: 0 6px 6px 0; white-space: nowrap; width: 125px; }
    .ttcs { padding: 6px 0 0 6px; overflow: hidden; display: block; }
    .ttcs span { float: left; margin: 0 26px 6px 0; white-space: nowrap; }
</style>
<script type="text/javascript">
    var _dv = '按ID/用户名/姓名过滤';
    var _ds, _array, _div, _sc;
    function display() {
        var f = $.trim(_sc.val());
        if (f) _array = $.grep(_ds, function (x) { return x._checked || x.id == f || x.name.indexOf(f) > -1 || x.uname.indexOf(f) > -1 });
        _div.empty();
        $.each(f && f != _dv ? _array : _ds, function (i, x) {
            $('<label><input type="checkbox" name="uteachers" value="' + x.id + '"' + (x._checked ? ' checked="checked"' : '') + '/>' + x.name + '(' + x.uname + ')</label>')
                .appendTo(_div)
                .click(function () { x._checked = $(this).find('input').attr('checked'); });
        });
    }
    function openaaa(lnk, exid, jtype) {
        if (lnk.text() == '保存') {
            var sd = $('#t' + jtype + ' input:checked');
            if (sd.length == 0) {
                return !!alert('选择至少一个教师用户');
            } else {
                judge.setJudgers(exid, $.map(sd, function (x) { return parseInt(x.value) }), jtype, function () {
                    location.reload();
                });
            }
        } else {
            var loading = showLoding('加载待选教师列表...');
            _sc = $('#sc');
            judge.getJudgers(exid, jtype, function (d) {
                _div = $('#t' + jtype).empty();
                _div.add('#s' + jtype + ',#lnk' + jtype + ',#cc' + jtype).toggle();
                _sc.show().prependTo('#ti' + jtype);
                _ds = _array = d.data.rows;
                _ds.sort(function (x) { return x._checked ? -1 : 1; });

                display();
                loading.close();
                lnk.text('保存');
            });
            $('#sc').keyup(display);
        }
    }
    $(function () {
        $('#sc').focus(function () {
            if (this.value == _dv) {
                this.value = '';
                this.style.color = '';
            }
        }).blur(function () {
            if (!$.trim(this.value)) {
                this.value = _dv;
                this.style.color = 'gray';
            }
        }).val(_dv);
    });
</script>
</head>
<body style="">
    <form id="form1" runat="server">
    <div style="">
        <asp:scriptmanager ID="ScriptManager1" AjaxFrameworkMode="Disabled" runat="server">
        </asp:scriptmanager>
        <asp:updatepanel ID="UpdatePanel1" runat="server">
            <Triggers>
              <%--  <asp:AsyncPostBackTrigger ControlID="CheckBoxList1" EventName="SelectedIndexChanged" />
                <asp:AsyncPostBackTrigger ControlID="CheckBoxList2" EventName="SelectedIndexChanged" />--%>
            </Triggers>
            <ContentTemplate>
               <div style="display:none"><asp:Panel ID="Prior_Panel" runat="server" Style="width: 500px; height: 56px; float: left;">
                    <div style="margin: auto 0; display:none;">
                        <asp:CheckBox ID="CheckBox1"  Checked="true" runat="server" Text="最后选择优先" /><br />
                        <span style="color: Gray">选中此复选框后，同一个项尝试在两个组中都被选中时，系统将上次该项的选中状态设置为“未选中”；否则，此次不能选中。</span>
                      <hr />
                    </div>
                </asp:Panel>
                <div style="height: 28px; float: left;">
                    <div style="margin: auto 0;">
                        <asp:HiddenField ID="HIDDENFIELD_JUDGEMODE" runat="server" />
                    </div>
                </div>
                <br style="clear: both;" />
              <br /></div> 
                <div class="titleText">
                    <div class="text" id="ti1">
                        <input type="text" style="float:right;display:none;text-align:center;color:gray" id="sc" value=""/>
                        <asp:Literal ID="JudgerTitle" runat="server" Text=" 一阅、二阅老师："></asp:Literal>
                        <a href="javascript:;" id="lnk2" onclick="openaaa($(this),<%= Examid %>,1)">选择</a>
                       &nbsp; <a href="javascript:;" id="cc1" style="display:none" onclick="location.reload()">取消</a>
                    </div>
                </div>
                <div id="s1" class="ttcs">
                    <asp:Repeater ID="rep1" runat="server">
                 
                 
                        <ItemTemplate><span id="$<%#DataBinder.Eval(Container.DataItem,"Id")%>"><%#DataBinder.Eval(Container.DataItem,"Name")%></span></ItemTemplate>
                      </asp:Repeater>
<%--
                    <asp:checkboxlist id="CheckBoxList1" onselectedindexchanged="CheckBoxList1_OnSelectedIndexChanged"
                        runat="server" repeatcolumns="40000" autopostback="True" repeatlayout="Flow" visible="false" />--%>
                </div>
                <div id="t1" class="teacher_list" style="display:none"></div>
                <asp:Panel ID="Panel_Professional" runat="server">
                    <div class="titleText">
                        <div class="text" id="ti2">
                            专家组老师：<a href="javascript:;" id="lnk1" onclick="openaaa($(this),<%= Examid %>,2)">选择</a>
                           &nbsp; <a href="javascript:;" id="cc2" style="display:none" onclick="location.reload()">取消</a>
                        </div>
                    </div>
                        <div id="s2" class="ttcs">
                            <asp:Repeater ID="rep2" runat="server">
                           
                            
                                <ItemTemplate><span id='$<%#DataBinder.Eval(Container.DataItem,"Id")%>'><%#DataBinder.Eval(Container.DataItem,"Name")%></span></ItemTemplate>
                            </asp:Repeater>
                          <%--  <asp:CheckBoxList ID="CheckBoxList2" OnSelectedIndexChanged="CheckBoxList2_OnSelectedIndexChanged"
                                runat="server" RepeatColumns="4" AutoPostBack="True" visible="false">
                            </asp:CheckBoxList>--%>
                        </div>
                    <div id="t2" class="teacher_list" style="display:none"></div>
                </asp:Panel>
                <span style="display:none"><span id="tips_span"></span>
                    <img alt="" onclick='Save()'
                        src="images/teacher.btn.save.jpg" />
                </span>
            </ContentTemplate>
        </asp:updatepanel>
        <asp:hiddenfield ID="HiddenField_ExamID" runat="server" />
    </div>
    </form>
</body>
</html>
