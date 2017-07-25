<%@ Page Title="" Language="C#" MasterPageFile="~/Judge.Master" AutoEventWireup="true" CodeBehind="JudgeGL_progress.aspx.cs" Inherits="Web.JudgeGL_progress" %>
 <%@ Register   tagPrefix="JudgeManage" tagName="RoundFirstJudgeProgress" src="~/UserControl/RoundFirstJudgeProgress.ascx" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">

    <style type="text/css">
    
     table.list th { text-align: center; padding: 0 4px;    background: url(../images/th-bg.gif) repeat-x;   color: #056d80; line-height: 30px; }
    table.JGroupDetailList tbody td{ text-align:center;}
    div.jgDetailsTabs{ height:500px;}
    table tbody tr td ,table,table th{  border:0 none; border-spacing:0;}
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
 <div style=" margin:12px;  ">
 <asp:Literal ID="Literal1" runat="server"></asp:Literal><span style=" color:#777; font-size:12px;">(您当前登录身份：组长)</span>
 </div>
<div style=" float:right; height:26px; width:40px;  margin:10px 20px 0 20px;">
    <asp:HyperLink ID="HyperLinkBack" NavigateUrl="~/JudgeGL.aspx" runat="server">返回</asp:HyperLink>
</div>
           <JudgeManage:RoundFirstJudgeProgress ID="RoundFirstJudgeProgress1" runat="server">
           </JudgeManage:RoundFirstJudgeProgress>
</asp:Content>
