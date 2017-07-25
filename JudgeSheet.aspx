<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="JudgeSheet.aspx.cs" Inherits="Web.JudgeSheet" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>已阅试卷</title>
    <link href="styles/style.css" rel="stylesheet" type="text/css" />
    <link href="styles/style_webForms.css" rel="stylesheet" type="text/css" />
    <script src="scripts/jquery-1.7.min.js" type="text/javascript"></script>
    <script src="scripts/PopWindow/gzy.popup.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/My97DatePicker/WdatePicker.js"></script>
    <script type="text/javascript" src="scripts/common.js"></script>
    <script type="text/javascript" src="scripts/webForm_common.js"></script>
    <script type="text/javascript" src="scripts/Judge.js"></script>
    <script type="text/javascript" src="scripts/webFormPager/gzyPager.js"></script>
    <script src="script.ashx?teacher,teacher.ui" type="text/javascript"></script>
    <style type="text/css">
        .return
        {
            background-image: url(../images/icon.gif);
            background-repeat: no-repeat;
            background-attachment: scroll;
            background-position: left;
            height:15px;
            padding-left:18px;
          
        }
        
             .next
        {
            background-image: url(../images/teacher.exam.arrow.jpg);
            background-repeat: no-repeat;
            background-position: left;
            background-attachment: scroll;
            height: 16px;
            padding-left: 18px;
            text-align: left;
            margin-left: 9px;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>
    <div class="body">
        <div class="head problib" style="background: url(../images/teacher.result.jpg);">
            <p>
                <a href="javascript:;" class="user">管理员</a> <a href="../teacher.htm" class="home">返回首页</a>
                <a href="javascript:;" class="setting">系统管理</a> <a href="javascript:;" class="exit">
                    注销</a>
            </p>
        </div>
        <%--      <li class="current">--%>
        <%--<asp:linkbutton ID="ExamsList" runat="server" OnClientClick="showSearch(true)" onclick="ExamsList_Click">试卷列表</asp:linkbutton>--%>
        <%--<a href="javascript:;">试卷列表</a></li>--%>
        <div style="width: 100%; height: 60px; margin-top: 16px;">
          
                <div style="width: 200px; text-align: center; margin:0 auto;">
                    <div style="font-size: 15px; font-weight: bold;">
                        <asp:Label ID="lbl_ExamName" Visible="false" runat="server" Text=""></asp:Label>
                        </div>
                
                    <div style=" margin-top:16px; width:350px;">
                        <div style="width: 120px; float: left; font-size: 12px;">
                            <asp:Label ID="lbl_TotalCount" Visible="false" runat="server" Text=""></asp:Label></div>
                        <div style="width: 100px; float: left; font-size: 12px;">
                            <asp:Label ID="lbl_RemainCount" Visible="false" runat="server" Text=""></asp:Label></div>
                    </div>
                </div>
          
        </div>
        <ul class="mtabs">
        </ul> 
         <div style="width: 980px; margin-bottom: 5px;">
        <div class="wide">
            <div id="searchArea" class="search">
                <asp:DropDownList ID="SortOrderSelect" Visible="false" runat="server" AutoPostBack="True">
                    <asp:ListItem Value="OrderByStartTimeAsc">按开考时间升序</asp:ListItem>
                    <asp:ListItem Value="OrderByStartTimeDesc" Selected="True">按开考时间降序</asp:ListItem>
                </asp:DropDownList>
                <asp:DropDownList ID="PaperJudgeState" Visible="false" runat="server" AutoPostBack="True" OnSelectedIndexChanged="PaperJudgeState_SelectedIndexChanged">
                    <asp:ListItem Value="" Selected="True">所有阅卷状态</asp:ListItem>
                    <asp:ListItem Value="Judging1">正在第一次评阅</asp:ListItem>
                    <asp:ListItem Value="Judged1">第一次评阅完成</asp:ListItem>
                    <asp:ListItem Value="Judging2">正在第二次评阅</asp:ListItem>
                    <asp:ListItem Value="Judged2">第二次评阅完成</asp:ListItem>
                    <asp:ListItem Value="Judging3">正在第三次评阅</asp:ListItem>
                    <asp:ListItem Value="Judged3">第三次评阅完成</asp:ListItem>
                </asp:DropDownList>
                <asp:TextBox ID="SearchKeywords" runat="server" Visible="false" MaxLength="20" ClientIDMode="Static"></asp:TextBox>
                <asp:ImageButton ID="Search" Visible="false" ImageUrl="images/search-small.gif" runat="server"
                    OnClick="Search_Click" />
            </div>
        </div>

      
            <div style="width:120px; float: right; text-align: right;">
                <asp:LinkButton ID="ReGetSheet_LnkBtn" CssClass="next" runat="server" OnClick="ReGetSheet_LnkBtn_Click">批阅新的试卷</asp:LinkButton>
            </div>
            <div style="width: 60px; height: 25px; float: right;">
                <a class="return" href="/JudgeExam_DetailView.aspx">返回</a>
            </div>
        </div>
        <br />
        <asp:UpdatePanel ID="UpdatePanel1" UpdateMode="Conditional" runat="server">
            <Triggers>
                <asp:AsyncPostBackTrigger ControlID="PaperJudgeState" EventName="SelectedIndexChanged" />
            </Triggers>
            <ContentTemplate>
                <%--                <asp:Panel ID="ExamsList_ContentPanel" runat="server" Visible="false" ClientIDMode="Static">--%>
                <div class="wide">
                    <asp:GridView ID="SheetList" runat="server" AutoGenerateColumns="false" GridLines="None"
                        EmptyDataText="-" DataKeyNames="Id" OnRowDataBound="SheetList_RowDataBound" OnRowCommand="SheetList_RowCommand"
                        OnDataBound="SheetList_DataBound" CssClass="list">
                        <Columns>
                            <asp:BoundField DataField="id" HeaderStyle-HorizontalAlign="Center" ItemStyle-HorizontalAlign="Center"
                                HeaderText="答卷" />
                            <asp:BoundField DataField="PersonNumber" HeaderStyle-HorizontalAlign="Center"
                                ItemStyle-HorizontalAlign="Center" HeaderText="学号" />
                            <asp:BoundField DataField="PaperScore" HeaderStyle-HorizontalAlign="Center" ItemStyle-HorizontalAlign="Center"
                                HeaderText="试卷总分" />
                            <asp:BoundField DataField="SubjectiveScore" HeaderStyle-HorizontalAlign="Center"
                                ItemStyle-HorizontalAlign="Center" HeaderText="主观题得分" />
                            <asp:BoundField DataField="ObjectiveScore" HeaderStyle-HorizontalAlign="Center" ItemStyle-HorizontalAlign="Center"
                                HeaderText="客观题得分" />
                            <asp:TemplateField HeaderText="操作">
                                <ItemTemplate>
                                    <asp:LinkButton ID="LinkButton2" CommandName="start" CommandArgument='<%#Eval("id") %>'
                                        runat="server">重阅</asp:LinkButton>
                                </ItemTemplate>
                            </asp:TemplateField>
                        </Columns>
                        <EmptyDataTemplate>
                            未查找到符合条件的数据
                        </EmptyDataTemplate>
                        <HeaderStyle />
                        <PagerSettings Mode="NumericFirstLast" />
                    </asp:GridView>
                    <div class="pager">
                        <asp:TextBox ID="PageBox" runat="server" ClientIDMode="Static" Style="display: none"></asp:TextBox>
                        <asp:Button ID="RefreshButton" runat="server" Text="Button" Style="display: none"
                            OnClick="RefreshButton_Click" ClientIDMode="Static" />
                    </div>
                </div>
                <%--       </asp:Panel>--%>
                <asp:Label ID="Label1" runat="server"></asp:Label>
            </ContentTemplate>
        </asp:UpdatePanel>
        <div class="wide">
            <div id="gzyPager">
            </div>
        </div>
    </div>
    <p class="body">
    </p>
    </form>
</body>
</html>
