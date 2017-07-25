<%@ Page Title="" Language="C#" MasterPageFile="~/Judge.Master" AutoEventWireup="true" CodeBehind="JudgeGL.aspx.cs" Inherits="Web.JudgeGL" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

<div style=" margin-top:10px;">
    <asp:GridView ID="GridViewExamList" OnRowDataBound="GridViewExamList_RowDataBound" CssClass="list" AutoGenerateColumns="false" runat="server">
        <Columns>
            <asp:BoundField DataField="ExamName" HeaderText="名称" />
            <asp:BoundField DataField="examstarttime" DataFormatString="{0:yyyy年MM月dd日}"  HeaderText="考试开始时间" />
            <asp:BoundField DataField="examendtime" DataFormatString="{0:yyyy年MM月dd日}"  HeaderText="考试结束时间" />
            <asp:BoundField DataField="DetailNeedJudgeCount" HeaderText="我的当前任务总数（道）" />
            <asp:BoundField DataField="DetailJudgedCount" HeaderText="已经处理（道）" />
            <asp:TemplateField HeaderText="操作">
                <ItemTemplate>
                    <asp:HyperLink ID="HyperLinkReviewProgress" runat="server">查看进度</asp:HyperLink>
                      <asp:HyperLink ID="HyperLinkProcessAmbiguous" runat="server">处理歧义</asp:HyperLink>
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
        <EmptyDataTemplate>
            未找到任何数据
        </EmptyDataTemplate>
    </asp:GridView>
    </div>
</asp:Content>
