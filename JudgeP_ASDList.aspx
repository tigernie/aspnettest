<%@ Page Title="初审后歧义列表" Language="C#" AutoEventWireup="true" CodeBehind="JudgeP_ASDList.aspx.cs"
    Inherits="Web.JudgeP_ASDList" %>

<%@ Register TagPrefix="JudgeManage" TagName="AmbiguousDetailForProficient" Src="~/UserControl/AmbiguousDetailForProficient.ascx" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
    <link type="text/css" rel="stylesheet" href="styles/style.css" />
    <link type="text/css" rel="stylesheet" href="styles/style_webForms.css" />
    <script type="text/javascript" src="scripts/jquery-1.7.min.js"></script>
    <script type="text/javascript" src="scripts/PopWindow/gzy.popup.js"></script>
    <script type="text/javascript" src="scripts/My97DatePicker/WdatePicker.js"></script>
    <script type="text/javascript" src="scripts/common.js"></script>
    <script type="text/javascript" src="scripts/webForm_common.js"></script>
    <script type="text/javascript" src="scripts/webFormPager/gzyPager.js"></script>
    <script type="text/javascript" src="script.ashx?teacher,teacher.ui"></script>
    <script type="text/javascript" src="scripts/Drag/gzy.drag.js"></script>
        <script type="text/javascript" src="scripts/webFormPager/gzyPager.js"></script>
    <style type="text/css">
        table.list td, th, table.list tbody td
        {
            border: 0 none;
            text-align: center;
        }
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
        table.list
        {
            border-left: 0 none;
            border-right: 0 none;
            border-bottom: 0 none;
        }
        div.body
        {
            width: 1318px;
            background-image: url(../images/judge/bg_body_j.png);
        }
        div.head
        {
            width: 1300px;
        }
        div.wide
        {
            width: 1280px;
        }
        p.body
        {
            width: 1318px;
            background-image: url(../images/judge/bg_body_j2.gif);
        }
        
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
            text-align: center;
        }
        
        table tbody tr td, table, table th
        {
            border: 0 none;
            border-spacing: 0;
        }
        
        div.body > label
        {
            font-size: 32px;
            padding-top: 26px;
            padding-left: 40px;
        }
        table#AmbiguousDetailForProficient1_gridViewAmbiguousDetailList th
        {
            background: url(../images/th-bg.gif) repeat-x;
            line-height: 15px;
            background-position: bottom;
            padding: 5px 0;
        }
    </style>


</head>
<body>
    <form id="form1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>

    <div class="body">
        <%--头部--%>
        <div class="head problib" style="background: url(../images/judge/bg_head_bj.jpg);">
            <p>
                <a href="javascript:;" class="user">管理员</a> <a href="login2.aspx?do=logout" class="exit">
                    注销</a>
            </p>
        </div>
        <div class="wide">
            <div style="margin-top: 9px;">
            <div style=" margin:12px;">
                <asp:Literal ID="Literal1" runat="server"></asp:Literal><span style=" color:#777; font-size:12px;">(您当前登录身份：专家)</span>
</div>
                <div style="float: right; margin-right: 20px;">
                    <asp:HyperLink ID="HyperLinkBack" NavigateUrl="~/JudgeP.aspx" runat="server">返回</asp:HyperLink>
                </div>
                <JudgeManage:AmbiguousDetailForProficient ID="AmbiguousDetailForProficient1" runat="server">
                </JudgeManage:AmbiguousDetailForProficient>
            </div>
        </div>
    </div>
    <p class="body">
    </p>
    </form>
</body>
</html>
