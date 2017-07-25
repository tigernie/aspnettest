<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ExamSlu.aspx.cs" Inherits="Web.ExamSlu" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>组卷管理</title>
    <link href="styles/style.css" rel="stylesheet" type="text/css" />
    <link href="styles/style_webForms.css" rel="stylesheet" type="text/css" />
    <script src="scripts/jquery-1.7.min.js" type="text/javascript"></script>
    <script src="scripts/PopWindow/gzy.popup.js" type="text/javascript"></script>
    <script src="scripts/TabSet/gzy.tabset.v3.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/webForm_common.js"></script>
    <script type="text/javascript" src="scripts/webFormPager/gzyPager.js"></script>
    <script type="text/javascript" src="script.ashx?teacher,problib,scheme"></script>
    <script type="text/javascript" src="scripts/Tree/gzy.tree.js"></script>
    <script type="text/javascript" src="scripts/Drag/gzy.drag.js"></script>
    <script type="text/javascript" src="scripts/problembrowser.js"></script>
    <link rel="stylesheet" type="text/css" href="styles/downloadPaper.css" />
</head> 
<body>
    <form id="form1" runat="server">
    <%--<asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>--%>
    <div class="body">

        <div class="head problib" style="background: url(../images/teacher.schame.jpg);">
            <p>
                <a href="javascript:;" class="user">管理员</a> <a href="../teacher.htm" class="home">返回首页</a>
                <a href="javascript:;" class="setting">系统管理</a> <a href="javascript:;" class="exit">注销</a>
            </p>
        </div>
        <ul class="mtabs">
            <li xml:lang="params"><a href="javascript:;">组卷方案</a></li>
            <li xml:lang="papers"><a href="javascript:;">试卷管理</a></li>
        </ul>
        <div class="wide">
            <span class="search">
                <select id="PaperTypeSelect" style="width:90px;"></select>
                <asp:TextBox ID="SearchKeywords" runat="server" MaxLength="20" ClientIDMode="Static"></asp:TextBox>
                <button id="searchBtn"></button>
            </span>
            <span style="margin-left:40px" id="cmd1">
                 <a id="add_pro" href="javascript:;"><img src="images/pp.gif" />专业出卷</a> &nbsp;
                <a id="add_normal" href="javascript:;"><img src="images/pp.gif" />常规出卷</a> &nbsp;
                 <a id="add_quick" href="javascript:;"><img src="images/pp.gif" />快速出卷</a>
            </span>
            <span style="margin-left:40px;display:none" id="cmd3">
                 <a id="addnew" href="javascript:;"><img src="images/newP.jpg" />新建试卷</a>
                
            </span>
        </div>
        <div class="wide" style="margin-top: 10px">
            <table border="0" cellpadding="0" cellspacing="0" id="slutions" class="list"></table>
            <table border="0" cellpadding="0" cellspacing="0" id="papers" class="list"></table>
        </div>
        <%--<asp:UpdatePanel ID="UpdatePanel1" runat="server" UpdateMode="Conditional" ClientIDMode="Static">
            <Triggers>
                <asp:AsyncPostBackTrigger ControlID="RefreshButton" EventName="Click" />
            </Triggers>
            <ContentTemplate>
                <asp:Panel ID="ExamsList_ContentPanel" runat="server" ClientIDMode="Static">
                    <div class="wide">
                        <asp:GridView ID="SolutionList" runat="server" AutoGenerateColumns="False" CssClass="list"
                            GridLines="None" EmptyDataText="-" OnPreRender="SolutionList_PreRender">
                            <Columns>
                                <asp:BoundField DataField="ID" HeaderText="序号" />
                                <asp:HyperLinkField DataTextField="ExamName" HeaderText="考试名称" />
                                <asp:BoundField DataField="CreaterName" HeaderText="创建者姓名" />
                                <asp:BoundField DataField="ExamStartTime" DataFormatString="{0:yyyy-MM-dd HH:mm}"
                                    HeaderText="考试开始时间" />
                                <asp:BoundField DataField="ExamEndTime" DataFormatString="{0:yyyy-MM-dd HH:mm}" HeaderText="考试结束时间" />
                                <asp:BoundField DataField="ExamMode" HeaderText="考试类型" />
                                <asp:BoundField DataField="PaperType" HeaderText="试卷类型" />
                                <asp:BoundField DataField="StudentCount" HeaderText="考生人数" />
                                <asp:BoundField DataField="ExamState" HeaderText="考试状态" />
                                <asp:TemplateField HeaderText="操作">
                                    <ItemTemplate>
                                        <asp:LinkButton ID="EditButton" runat="server">修改</asp:LinkButton>
                                        <asp:LinkButton ID="DeleteButton" runat="server" ClientIDMode="Static" OnClientClick="showConfirm($(this));return false;">删除</asp:LinkButton>
                                    </ItemTemplate>
                                </asp:TemplateField>
                            </Columns>
                            <EmptyDataTemplate>
                                <div style="text-align: center;">
                                    未查找到符合条件的数据</div>
                            </EmptyDataTemplate>
                            <PagerSettings Mode="NumericFirstLast" />
                        </asp:GridView>
                        <asp:TextBox ID="PageBox" Text="1/10" runat="server" Style="display: none" ClientIDMode="Static"></asp:TextBox>
                        <asp:TextBox ID="PaperTypeNum" Text="2" runat="server" Style="display: none" ClientIDMode="Static"></asp:TextBox>
                        <asp:TextBox ID="SelectIndex" Style="display: none" runat="server" Text=""></asp:TextBox>
                        <asp:Button ID="RefreshButton" runat="server" Text="Button" Style="display: none" 
                            OnClick="Button1_Click" ClientIDMode="Static" />
                    </div>
                </asp:Panel>
            </ContentTemplate>
        </asp:UpdatePanel>--%>
        <%--<div class="wide">
            <div id="gzyPager">
            </div>
        </div>--%>
    </div>
    <p class="body">
    </p>
    </form>
    <script type="text/javascript" src="scripts/createUniSlu.js"></script>
    <script type="text/javascript" src="scripts/PaperProblems.js"></script>
    <script type="text/javascript" src="scripts/selectSolution.js"></script>
    <script type="text/javascript" src="scripts/selectPapers.js"></script>
    <script type="text/javascript" src="scripts/createPaper.js"></script>
    <script type="text/javascript" src="scripts/ExamSlu.js"></script>
</body>
</html>
