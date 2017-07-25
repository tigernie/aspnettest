<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="RoundFirstJudgeFinshedASD.ascx.cs"
    Inherits="Web.UserControl.RoundFirstJudgeFinshedASD" %>
<script src="../Widget/cookieHelper.js" type="text/javascript"></script>
<script type="text/javascript">

    function openDetail(id) {

        new gzy.popup("处理详情", 455, 320, { url: "Widget/JudgedDetail.aspx?AMBIGUOUSDETAILID=" + id });
        return false;
    }

    function setRequestAmbiguousDetailsID(AmbiguousDetailsID) {

        $("#AmbiguousDetailsID").val(AmbiguousDetailsID);
    }


    var __needKnowPanel;
    var __sender;
    function tips(sender) {

        var nextNeedTips = $.cookie('nextNeedTips_GL');
        

        __sender = sender;
        if (nextNeedTips == null) {
            __needKnowPanel = new gzy.popup("阅卷须知", 640, 480, { url: "/Widget/judgeNeedKnow.htm", buttons: [{ text: '我知道了', isCancel: false, click: request }, { text: '下次不提示', isCancel: false, click: request2}] });
            return false;
        }
        else {
            return true;
        }

    }

    function request() {
        window.location.replace(__sender.href);
        __needKnowPanel.close();
    }

    function request2() {
        $.cookie('nextNeedTips_GL', '1')
        request();
    }

    </script>


    <br style="clear:both;" />
    <div style=" padding:8px; background-color:#ffa000; border:1px solid #ffa000; color:White; vertical-align:middle; text-align:left;  height:20px; line-height:20px; margin:0;  ">
    <asp:CheckBox ID="CheckBoxDisplayAll" runat="server" AutoPostBack="true"  Checked="false" style=" line-height:20px; margin:0; padding:0;"  Text="显示所有已阅答题" />
<asp:Literal ID="LiteralTotal" runat="server"></asp:Literal>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    我所在的组一轮后总歧义：<asp:Literal ID="LiteralTotalAmbiguousAfterRound1" runat="server"></asp:Literal>道&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我已经处理：<asp:Literal
        ID="LiteralMyDoneSize" runat="server"></asp:Literal>道
    </div>
<asp:GridView ID="gridViewAmbiguousDetailList" CssClass="list JGroupDetailList" AutoGenerateColumns="false"
    OnRowDataBound="gridViewAmbiguousDetailList_RowDataBound" runat="server">
    <Columns>
        <asp:BoundField DataField="ASDID" HeaderText="题目编号" />
        <asp:BoundField DataField="Score" HeaderText="分值" />
        <asp:BoundField DataField="Score_1" NullDisplayText="-" HeaderText="一轮一阅" />
        <asp:BoundField DataField="Score_2" NullDisplayText="-" HeaderText="一轮二阅" />
        <asp:BoundField DataField="Score_3" NullDisplayText="-" HeaderText="一轮三阅" />
        <asp:BoundField DataField="FirstReviewScore" NullDisplayText="-" HeaderText="组长给分"
            HeaderStyle-Width="40" />
        <asp:BoundField DataField="ThresholdValue" HeaderText="最大允许差值" HeaderStyle-Width="45" />
        <asp:BoundField DataField="Diffs_Rounded1" NullDisplayText="无" HeaderText="一轮后有效差值列表"
            HeaderStyle-Width="75" />
        <asp:BoundField DataField="AdoptedDiff" NullDisplayText="无" HeaderText="已采纳的差值" HeaderStyle-Width="45" />
        <asp:BoundField DataField="AdoptedCause" NullDisplayText="无" HeaderText="采纳原因"  HeaderStyle-Width="120" />
        <asp:BoundField DataField="AdoptedDiffSource" NullDisplayText="无" HeaderText="差值来源分"  HeaderStyle-Width="65"/>
        <asp:BoundField DataField="FinalScore" NullDisplayText="-" HeaderText="最终分" />
        <asp:BoundField DataField="AdoptedFinalscoreCause" NullDisplayText="未完" HeaderText="得到最终分的方式" />
        <asp:TemplateField HeaderText="操作" HeaderStyle-Width="90">
            <ItemTemplate>
                <asp:LinkButton ID="lnkBtnDetail" runat="server">详情</asp:LinkButton>
                <%--<asp:LinkButton ID="LinkButtonProcess" Visible="false" runat="server">处理</asp:LinkButton>--%>
                <asp:HyperLink ID="HyperLinkProcess" Visible="false" onclick="return tips(this);" runat="server">开始审核</asp:HyperLink>
            </ItemTemplate>
        </asp:TemplateField>
    </Columns>
    <EmptyDataTemplate>
        未找到任何数据
    </EmptyDataTemplate>
</asp:GridView>
<span style="  color:Gray; margin:5px; font-size:12px; float:left;">提示：最近处理的在最后面</span>
<asp:HiddenField ID="AmbiguousDetailsID" ClientIDMode="Static" runat="server" />
<div class="pager">
    <asp:TextBox ID="PageBox" runat="server" ClientIDMode="Static" Style="display: none;"></asp:TextBox>
    <asp:Button ID="RefreshButton" runat="server" Text="Button" Style="display: none;"
        OnClick="Button1_Click" ClientIDMode="Static" />
</div>
<div class="wide">
    <div id="gzyPager">
    </div>
</div>
