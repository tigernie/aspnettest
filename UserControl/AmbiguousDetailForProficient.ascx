<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="AmbiguousDetailForProficient.ascx.cs"
    Inherits="Web.UserControl.AmbiguousDetailForProficient" %>

<script src="../Widget/cookieHelper.js" type="text/javascript"></script>
<script type="text/javascript">

    function openDetail(id) {

        new gzy.popup("处理详情", 455, 320, { url: "Widget/JudgedDetail.aspx?AMBIGUOUSDETAILID=" + id });

        return false;
    }

    var __needKnowPanel;
    var __sender;
    function tips(sender) {

        var nextNeedTips = $.cookie('nextNeedTips_P');
       

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
        $.cookie('nextNeedTips_P', '1')
        request();
    }

    </script>

 
    <div style=" clear:both; padding:8px; background-color:#ffa000; border:1px solid #ffa000; color:White; margin:4px 0;">
        <asp:Literal ID="LiteralTotalAmbiguousAfterRound1" Visible="false" runat="server"></asp:Literal>二轮后歧义总数：<asp:Literal ID="LiteralTotalAmbiguousAfterRound2" runat="server"></asp:Literal><asp:Literal
        ID="LiteralMyDoneSize" runat="server"></asp:Literal>
    </div>


<asp:GridView ID="gridViewAmbiguousDetailList" OnRowDataBound="gridViewAmbiguousDetailList_RowDataBound"
    CssClass="list" AutoGenerateColumns="false" runat="server">
    <Columns>
        <asp:BoundField DataField="ASDID" HeaderText="题目编号" />
        <asp:BoundField DataField="Score" HeaderText="分值" />
        <asp:BoundField DataField="Score_1" NullDisplayText="-" HeaderText="一轮一阅" />
        <asp:BoundField DataField="Score_2" NullDisplayText="-" HeaderText="一轮二阅" />
        <asp:BoundField DataField="Score_3" NullDisplayText="-" HeaderText="一轮三阅" />
        <asp:BoundField DataField="FirstReviewScore" NullDisplayText="-" HeaderText="组长给分"
            HeaderStyle-Width="40" />
        <asp:BoundField DataField="ThresholdValue" HeaderText="最大允许差值" HeaderStyle-Width="45" />
        <asp:BoundField DataField="Diffs_Rounded1" NullDisplayText="-" HeaderText="一轮后有效差值列表"
            HeaderStyle-Width="70" />
        <asp:BoundField DataField="Diffs_Rounded2" NullDisplayText="-" HeaderText="二轮后有效差值列表"
            HeaderStyle-Width="70" />
        <asp:BoundField DataField="AdoptedDiff" HeaderText="已采纳的差值" NullDisplayText="无" HeaderStyle-Width="45" />
        <asp:BoundField DataField="AdoptedCause" NullDisplayText="无" HeaderText="采纳原因" />
        <asp:BoundField DataField="AdoptedDiffSource" NullDisplayText="无" HeaderText="差值来源分"
            HeaderStyle-Width="65" />
        <asp:BoundField DataField="SpecialisticScore" NullDisplayText="-" HeaderText="专家给分"
            HeaderStyle-Width="40" />
        <asp:BoundField DataField="FinalScore" NullDisplayText="未完" HeaderText="最终分" HeaderStyle-Width="40" />
        <asp:BoundField DataField="AdoptedFinalscoreCause" NullDisplayText="未完" HeaderText="得到最终分的方式"
            HeaderStyle-Width="100" />
        <asp:TemplateField HeaderText="操作">
            <ItemTemplate>
                <asp:LinkButton ID="lnkBtnDetail" runat="server">详情</asp:LinkButton>
                <asp:HyperLink ID="HyperLinkProcess" Visible="false"   onclick="return tips(this);"  runat="server">开始终审</asp:HyperLink>
            </ItemTemplate>
        </asp:TemplateField>
    </Columns>
    <EmptyDataTemplate>
        未找到任何数据
    </EmptyDataTemplate>
</asp:GridView>
<div class="pager">
    <asp:TextBox ID="PageBox" runat="server" ClientIDMode="Static" Style="display: none"></asp:TextBox>
    <asp:Button ID="RefreshButton" runat="server" Text="Button" Style="display: none"
        OnClick="Button1_Click" ClientIDMode="Static" />
</div>
<div class="wide">
    <div id="gzyPager" style="font: 14px;">
    </div>
</div>
