<%@ Page Title="" Language="C#" MasterPageFile="~/Judge.Master" AutoEventWireup="true"
    CodeBehind="JudgeGL_ASDList.aspx.cs" Inherits="Web.JudgeGL_ASDList" %>

<%@ Register TagPrefix="JudgeManage" TagName="RoundFirstJudgeFinshedASD" Src="~/UserControl/RoundFirstJudgeFinshedASD.ascx" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style type="text/css">
        table.list th
        {
            text-align: center;
            padding: 0 4px;
            background: url(../images/th-bg.gif) repeat-x;
            color: #056d80;
            line-height: 30px;
        }
        table.JGroupDetailList tbody td
        {
            text-align: center;
        }
        div.jgDetailsTabs
        {
            height: 500px;
        }
        table tbody tr td, table, table th
        {
            border: 0 none;
            border-spacing: 0;
        }
          table#ctl00_ContentPlaceHolder1_RoundFirstJudgeFinshedASD1_gridViewAmbiguousDetailList
          { 
              margin-top:6px;
          }
        table#ctl00_ContentPlaceHolder1_RoundFirstJudgeFinshedASD1_gridViewAmbiguousDetailList th
        {
             background: url(../images/th-bg.gif) repeat-x ;  line-height: 20px;  background-position:bottom;  height:50px;
        }
        

    </style>
        <script type="text/javascript" src="scripts/webFormPager/gzyPager.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <asp:ScriptManagerProxy ID="ScriptManagerProxy1" runat="server">
    </asp:ScriptManagerProxy>
 <div style=" margin:12px;">
 <asp:Literal ID="Literal1" runat="server"></asp:Literal><span style=" color:#777; font-size:12px;">(您当前登录身份：组长)</span>
 </div>
<div style=" float:right; margin-right:20px;">
    <asp:HyperLink ID="HyperLinkBack" NavigateUrl="~/JudgeGL.aspx" runat="server">返回</asp:HyperLink>
</div>
    <JudgeManage:RoundFirstJudgeFinshedASD ID="RoundFirstJudgeFinshedASD1" runat="server">
    </JudgeManage:RoundFirstJudgeFinshedASD>



</asp:Content>
