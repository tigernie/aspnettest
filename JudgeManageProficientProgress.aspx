<%@ Page Title="" Language="C#" MasterPageFile="~/JudgeManage.Master" AutoEventWireup="true" CodeBehind="JudgeManageProficientProgress.aspx.cs" Inherits="Web.JudgeManageProficientProgress" %>
<%@ Register TagPrefix="JudgeManage" TagName="AmbiguousDetailForProficient" Src="~/UserControl/AmbiguousDetailForProficient.ascx" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
<style type="text/css">
    ul.mtabs { font-weight:bold; color:White; margin:10px 0;}
    ul.mtabs li.current  {color:#0c7698;}
    ul.groups{border-right:1px solid #efefef; height:30px; vertical-align:middle;  width:100%; background-attachment:scroll; background-position:center;  background-repeat:repeat-x; background-image:url(images/judge/group_tab_bg.png);}
    ul.groups li{ float:left; vertical-align:middle; height:28px; list-style:none;  }
    ul.groups li > span{border-left:1px solid #e5e5e5;  height:28px; padding:auto  11px auto 11px;  }
    ul.groups li span span{ margin:auto 10px; height:28px; }
    ul.groups li:first-child{  margin-left:10px; }
    ul.groups li:first-child a{border-left:0 none;}
    ul.groups li.cur{ background-repeat:repeat-x;  background-image:url(images/judge/group_tab_bg_cur.png); }
    table.list th { text-align: center; padding: 4px 4px;    background: url(../images/th-bg.gif) repeat-x;   color: #056d80; line-height:18px; }
      table.list tbody td{ text-align:center;}
  
    table tbody tr td ,table,table th{  border:0 none; border-spacing:0;}
   table#ctl00_ContentPlaceHolder1_AmbiguousDetailForProficient1_gridViewAmbiguousDetailList th
   {
        background: url(../images/th-bg.gif) repeat-x ;  line-height: 14px;  background-position:bottom; font-size:12px;
   }
</style>
   
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

<div style=" float:right; margin-right:30px; margin-top:6px;">
    <asp:HyperLink ID="hyperLnk_back" runat="server">返回</asp:HyperLink>
    </div>
 
   <ul class="mtabs"  style=" clear:both;">
   <li>
       <asp:HyperLink ID="HyperLinkJGroupProgress" runat="server">分组进度</asp:HyperLink></li>
   <li  class="current">已阅答题</li>
   <li> <asp:HyperLink ID="HyperLinkWholeProgress" runat="server">整体进度</asp:HyperLink></li>
        </ul>
        <JudgeManage:AmbiguousDetailForProficient id="AmbiguousDetailForProficient1" runat="server"></JudgeManage:AmbiguousDetailForProficient>
  
</asp:Content>
