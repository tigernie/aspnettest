<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ExamMgr.aspx.cs" Inherits="Web.ExamMgr.ExamMgr1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>考务管理</title>
    <link href="styles/style.css" rel="stylesheet" type="text/css" />
    <link href="styles/style_webForms.css" rel="stylesheet" type="text/css" />

    <script src="scripts/jquery-1.7.min.js" type="text/javascript"></script>

    <script src="scripts/PopWindow/gzy.popup.js" type="text/javascript"></script>
        <script src="scripts/TabSet/gzy.tabset.v3.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/common.js"></script>
    <script type="text/javascript" src="scripts/webForm_common.js"></script>
    <script type="text/javascript" src="scripts/md5.js"></script>
    <script type="text/javascript" src="scripts/UserInfo.js"></script>
 <script type="text/javascript" src="scripts/exampublish.js"></script>
    <script type="text/javascript" src="scripts/ExamMgr.js"></script>
    <script type="text/javascript" src="scripts/ExamSlu.js"></script>
    <script type="text/javascript" src="scripts/selectPapers.js"></script>
    <script type="text/javascript" src="scripts/selectSolution.js"></script>
    <script src="script.ashx?teacher" type="text/javascript"></script>
    <script type="text/javascript" src="/scripts/lib/teacher.ui.js"></script>
    <script type="text/javascript" src="/scripts/webFormPager/gzyPager.js"></script>
    <script type="text/javascript" src="scripts/PaperProblems.js"></script>
    <script type="text/javascript" src="scripts/UserInfo.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    <div class="body">
        <div class="head problib" style="background: url(../images/teacher.kaowu.jpg);">
            <p>
                <a href="javascript:;" class="user">管理员</a> <a href="../teacher.htm" class="home">返回首页</a>
                <a href="javascript:;" class="setting">系统管理</a> <a href="javascript:;" class="exit">注销</a>
            </p>
        </div>
        <ul class="mtabs">
            <li class="current"><a href="javascript:;" id="ExamsList">考务信息</a></li>
            <li style="background-image: none;width:96px"><a style="color: #0094ff; text-decoration: underline;" href="javascript:;" id="AddExercise"><img src="images/addp1.gif" />添加练习</a> </li>
            <li style="background-image: none;width:96px"><a style="color: #0094ff; text-decoration: underline;" href="javascript:;" id="AddExam"><img src="images/addp1.gif" />添加考试</a></li>
            <li style ="float:right;background-image: none;width:96px"><a style="color: #0094ff; text-decoration:none;" href="/teacher.htm">返回上级</a></li>
        </ul>
        <div class="wide">
            <span id="searchArea" class="search">
                <asp:DropDownList ID="ExamMgr_PaperTypeSelect" runat="server" AutoPostBack="True" OnSelectedIndexChanged="SortOrderSelect_SelectedIndexChanged">
                    <asp:ListItem Value="" Selected="True">所有试卷类型</asp:ListItem>
                    <asp:ListItem Value="UniPaper">统一卷</asp:ListItem>
                    <asp:ListItem Value="RandomPaper">随机卷</asp:ListItem>
                </asp:DropDownList>
                <asp:DropDownList ID="ExamStateSelect" runat="server" AutoPostBack="True" OnSelectedIndexChanged="ExamStateSelect_SelectedIndexChanged">
                    <asp:ListItem Value="">所有考试状态</asp:ListItem>
                    <asp:ListItem Value="UnStart">未开始</asp:ListItem>
                    <asp:ListItem Value="Testing">考试中</asp:ListItem>
                    <asp:ListItem Value="Over">已结束</asp:ListItem>
                </asp:DropDownList>
                <asp:DropDownList ID="ExamModeSelect" runat="server" AutoPostBack="True" OnSelectedIndexChanged="ExamModeSelect_SelectedIndexChanged">
                    <asp:ListItem Value="">所有考试类型</asp:ListItem>
                    <asp:ListItem Value="ClassTestMode">班级</asp:ListItem>
                    <asp:ListItem Value="FreeMode">自由练习</asp:ListItem>
                </asp:DropDownList>
                <asp:TextBox ID="SearchKeywords" runat="server" MaxLength="20" ClientIDMode="Static"></asp:TextBox>
                <span class="search" style="float:right;padding-right:1px;margin-bottom:0"><asp:DropDownList ID="SortOrderSelect" runat="server" AutoPostBack="True" OnSelectedIndexChanged="SortOrderSelect_SelectedIndexChanged">
                    <asp:ListItem Value="OrderByStartTimeAsc">按开考时间升序</asp:ListItem>
                    <asp:ListItem Value="OrderByStartTimeDesc">按开考时间降序</asp:ListItem>
                    <asp:ListItem Value="OrderByCreatedTimeDesc" Selected="True">按创建时间降序</asp:ListItem>
                </asp:DropDownList></span>
                <button id="searchBtn"></button>
            </span>
        </div>
        <asp:ScriptManager ID="ScriptManager1" runat="server">
        </asp:ScriptManager>
        <asp:UpdatePanel ID="UpdatePanel1" runat="server" UpdateMode="Conditional" ClientIDMode="Static">
            <Triggers>
                <asp:AsyncPostBackTrigger ControlID="ExamStateSelect" EventName="SelectedIndexChanged" />
                <asp:AsyncPostBackTrigger ControlID="SortOrderSelect" EventName="SelectedIndexChanged" />
                <asp:AsyncPostBackTrigger ControlID="ExamModeSelect" EventName="SelectedIndexChanged" />
                <asp:AsyncPostBackTrigger ControlID="ExamMgr_PaperTypeSelect" EventName="SelectedIndexChanged" />
            </Triggers>
            <ContentTemplate>
                <asp:Panel ID="ExamsList_ContentPanel" runat="server" Visible="false" ClientIDMode="Static">
                    <div class="wide">
                        <asp:GridView ID="ExamList" runat="server" AutoGenerateColumns="False"
                            CssClass="list" GridLines="None" EmptyDataText="-" OnPreRender="ExamList_PreRender" OnDataBound="ExamList_DataBound">
                            <Columns>
                                <asp:BoundField DataField="ID" HeaderText="序号" />
                                <asp:HyperLinkField DataTextField="ExamName" HeaderText="考试名称" ItemStyle-Width="200px" />
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
                                        <asp:LinkButton ID="OpenButton" runat="server" ClientIDMode="Static" ForeColor="Red" OnClientClick="javascript:openExam($(this),true);return false;">删除</asp:LinkButton>
                                        <asp:LinkButton ID="CloseButton" runat="server" ClientIDMode="Static" ForeColor="Red" OnClientClick="javascript:openExam($(this),false);return false;">删除</asp:LinkButton>
                                        <asp:LinkButton ID="EditButton" runat="server" Visible="false">修改</asp:LinkButton>
                                        <asp:LinkButton ID="DeleteButton" runat="server" OnClientClick="javascript:showDeleteExamConfirm($(this));return false;">删除</asp:LinkButton>
                                        <asp:HyperLink runat="server" ID="hyperLink" Visible="false"></asp:HyperLink>
                                    </ItemTemplate>
                                </asp:TemplateField>
                            </Columns>
                            <EmptyDataTemplate>
                                <div style="text-align: center">
                                    未查找到符合条件的数据
                                </div>
                            </EmptyDataTemplate>
                            <PagerSettings Mode="NumericFirstLast" />
                        </asp:GridView>
                        <div class="pager">
                            <asp:Button ID="RefreshButton" runat="server" Text="Button" Style="display: none"
                                OnClick="Button1_Click" ClientIDMode="Static" />
                            <asp:TextBox ID="PageBox" runat="server" ClientIDMode="Static" Style="display: none"></asp:TextBox>
                        </div>
                    </div>
                </asp:Panel>

            </ContentTemplate>
        </asp:UpdatePanel>
        <div class="wide">
            <div id="gzyPager">
            </div>
        </div>
    </div>
    <p class="body">
    </p>
    <div class="hide">
    </div>
    <script type="text/javascript" src="scripts/My97DatePicker/WdatePicker.js"></script>
        <script src="scripts/Drag/gzy.drag.js"></script>
    </form>
</body>
</html>
