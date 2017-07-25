<%@ Page Title="考试列表" Language="C#" MasterPageFile="~/Judge.Master" AutoEventWireup="true" CodeBehind="JudgeT.aspx.cs" Inherits="Web.JudgeT" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script src="Widget/cookieHelper.js" type="text/javascript"></script>
    <script type="text/javascript">

        var __needKnowPanel;
        var __sender;
        function tips(sender) {

            var nextNeedTips = $.cookie('nextNeedTips_T');
            

            __sender = sender;
            if (nextNeedTips == null) {
                __needKnowPanel = new gzy.popup("阅卷须知", 640, 480, { url: "/Widget/judgeNeedKnow.htm", buttons: [{ text: '我知道了', isCancel: false, click: request }, { text: '下次不提示', isCancel: false, click: request2}] });
                return false;
            }
            else {
                return true;
            }
           
        }

        function request(){
            window.location.replace(__sender.href);
            __needKnowPanel.close();
        }

        function request2() {
            $.cookie('nextNeedTips_T', '1')
            request();
        }

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
<div style=" margin-top:10px;">
    <asp:GridView ID="GridViewExamList" OnRowDataBound="GridViewExamList_RowDataBound" CssClass="list" AutoGenerateColumns="false" runat="server">
        <Columns>
            <asp:BoundField DataField="ExamName" HeaderText="名称" />
                <asp:BoundField DataField="examstarttime" DataFormatString="{0:yyyy年MM月dd日}"  HeaderText="考试开始时间"  />
    <asp:BoundField DataField="examendtime"  DataFormatString="{0:yyyy年MM月dd日}"  HeaderText="考试结束时间"  />
            <asp:BoundField DataField="DetailNeedJudgeCount" HeaderText="我的任务总数（道）" />
            <asp:BoundField DataField="DetailJudgedCount" HeaderText="已经完成（道）" />
            <asp:TemplateField HeaderText="操作">
                <ItemTemplate>
                    <asp:HyperLink ID="HyperLinkJudge" onclick="return tips(this);" runat="server">开始批阅</asp:HyperLink>
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
        <EmptyDataTemplate>
            未找到任何数据
        </EmptyDataTemplate>
    </asp:GridView></div>
   
</asp:Content>
