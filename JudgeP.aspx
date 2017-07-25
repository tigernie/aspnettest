<%@ Page Title="" Language="C#" MasterPageFile="~/Judge.Master" AutoEventWireup="true" CodeBehind="JudgeP.aspx.cs" Inherits="Web.JudgeP" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style type="text/css"> 
   
    </style>
   
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

<div style=" margin-top:10px;">
    <asp:GridView ID="GridViewExamList" OnRowDataBound="GridViewExamList_RowDataBound" CssClass="list" AutoGenerateColumns="false" runat="server">
        <Columns>
            <asp:BoundField DataField="ExamName" HeaderText="名称" />
            <asp:BoundField DataField="examstarttime" DataFormatString="{0:yyyy年MM月dd日}"  HeaderText="考试开始时间" />
            <asp:BoundField DataField="examendtime" DataFormatString="{0:yyyy年MM月dd日}"  HeaderText="考试结束时间" />
            <asp:BoundField DataField="DetailNeedJudgeCount" HeaderText="初审后歧义总数（道）" />
            <asp:BoundField DataField="DetailJudgedCount" HeaderText="我已经处理（道）" />
            <asp:TemplateField HeaderText="操作">
                <ItemTemplate>
                    <asp:HyperLink ID="HyperLinkAmbiguous" runat="server">处理歧义</asp:HyperLink>
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
        <EmptyDataTemplate>
            未找到任何数据
        </EmptyDataTemplate>
    </asp:GridView>
    </div>
</asp:Content>
