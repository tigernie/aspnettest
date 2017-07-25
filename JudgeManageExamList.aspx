<%@ Page Title="" Language="C#" MasterPageFile="~/JudgeManage.Master" AutoEventWireup="true"
    CodeBehind="JudgeManageExamList.aspx.cs" Inherits="Web.JudgeManage.JudgeManageExamList" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>考试列表</title>
    <style type="text/css">
    table.list td , th, table.list tbody td  { border:0 none; text-align:center;}
     table.list th
        {
            text-align: center;
            padding: 0 4px;
            background: url(../images/th-bg.gif) repeat-x;
            color: #056d80;
            line-height: 30px;
        }
        table.list tbody td
        {
            vertical-align: middle;
        }
    .secondCellRightLine{border-right:#ebebeb 1px dashed;}
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
<div style=" margin-top:10px;">
    <asp:GridView ID="ExamList"  AutoGenerateColumns="false"  OnRowDataBound="ExamList_RowDataBound"
     runat="server" CssClass="list" BorderStyle="None" BorderWidth="0">
    <Columns>
    <asp:BoundField DataField="examname" HeaderText="考试名称"  />
   
    <asp:BoundField DataField="examstarttime" DataFormatString="{0:yyyy年MM月dd日}" HeaderText="考试开始时间"  />
    <asp:BoundField DataField="examendtime" DataFormatString="{0:yyyy年MM月dd日}"  HeaderText="考试结束时间"  />
    <asp:BoundField DataField="" HeaderText="参考人数/安排总人数"  />
    <asp:BoundField DataField="" HeaderText="已阅题数/待阅总题数"  />
      <asp:TemplateField HeaderText="操作"  >
      <ItemTemplate>
          <asp:HyperLink ID="HyperLinkJM" runat="server">阅卷管理</asp:HyperLink>
          <asp:HyperLink ID="HyperLinkScore" runat="server">成绩</asp:HyperLink>
          <asp:HyperLink ID="HyperLinkStatistics" runat="server">成绩统计</asp:HyperLink>
          </ItemTemplate>
      </asp:TemplateField>
    </Columns>

        <EmptyDataTemplate>
            未查找到符合条件的数据
        </EmptyDataTemplate>
    </asp:GridView>
    <div class="pager">
        <asp:TextBox ID="PageBox" runat="server" ClientIDMode="Static" Style="display: none"></asp:TextBox>
        <asp:Button ID="RefreshButton" runat="server" Text="Button" Style="display: none"
            OnClick="Button1_Click" ClientIDMode="Static" />
    </div>
     <div class="wide">
            <div id="gzyPager">
            </div>
        </div>
        </div>
</asp:Content>
