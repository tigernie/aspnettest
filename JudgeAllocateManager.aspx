<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="JudgeAllocateManager.aspx.cs"
    Inherits="Web.JudgeAllocateManager" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>阅卷任务管理</title>
    <link href="styles/style.css" rel="stylesheet" type="text/css" />
    <link href="styles/style_webForms.css" rel="stylesheet" type="text/css" />
    <script src="scripts/jquery-1.7.min.js" type="text/javascript"></script>
    <script src="scripts/PopWindow/gzy.popup.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/My97DatePicker/WdatePicker.js"></script>
    <script type="text/javascript" src="scripts/common.js"></script>
    <script type="text/javascript" src="scripts/webForm_common.js"></script>
    <script type="text/javascript" src="scripts/Judge.js"></script>
    <script src="scripts/judgeExam.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/webFormPager/gzyPager.js"></script>
    <script src="script.ashx?teacher,teacher.ui" type="text/javascript"></script>
</head>
<body>
    <form id="form1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>
    <div class="body">
        <%--头部--%>
        <div class="head problib" style="background: url(../images/teacher.result.jpg);">
            <p>
                <a href="javascript:;" class="user">管理员</a> <a href="../teacher.htm" class="home">返回首页</a>
                <a href="javascript:;" class="setting">系统管理</a> <a href="javascript:;" class="exit">
                    注销</a>
            </p>
        </div>
        <ul class="mtabs">
        </ul>
        <asp:UpdatePanel ID="UpdatePanel1" UpdateMode="Conditional" runat="server">
            <Triggers>
            </Triggers>
            <ContentTemplate>
           
                <div class="wide">
                    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False" CssClass="list"
                        OnRowDataBound="GridView1_RowDataBound" OnDataBound="GridView1_DataBound" GridLines="None" EmptyDataText="-" DataKeyNames="Id">
                        <Columns>
                            <asp:BoundField DataField="Username" HeaderText="用户名" />
                            <asp:BoundField DataField="Realname" HeaderText="姓名" />
                            <asp:BoundField DataField="JudgerType" HeaderText="阅卷老师类型" />
                            <asp:BoundField DataField="TaskSize" NullDisplayText="-" HeaderText="分配的任务数" />
                            <asp:BoundField DataField="DoneSize" NullDisplayText="-" HeaderText="已完成数" />
                            <asp:TemplateField>
                                <HeaderTemplate>
                                    操作
                                </HeaderTemplate>
                                <ItemTemplate>
                                </ItemTemplate>
                            </asp:TemplateField>
                        </Columns>
                        <EmptyDataTemplate>
                            未查找到符合条件的数据
                        </EmptyDataTemplate>
                        <PagerSettings Mode="NumericFirstLast" />
                    </asp:GridView>
                    <div class="pager">
                        <asp:TextBox ID="PageBox" runat="server" ClientIDMode="Static" Style="display: none"></asp:TextBox>
                        <asp:Button ID="RefreshButton" runat="server" Text="Button" Style="display: none"
                            OnClick="Button1_Click" ClientIDMode="Static" />
                    </div>
                </div>
            
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
