<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="StudentResult.aspx.cs"
    Inherits="Web.StudentResult" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>成绩查询</title>
    <link href="styles/style.css" rel="stylesheet" type="text/css" />
    <link href="styles/style_webForms.css" rel="stylesheet" type="text/css" />
    <script src="scripts/jquery-1.7.min.js" type="text/javascript"></script>
    <script src="scripts/PopWindow/gzy.popup.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/My97DatePicker/WdatePicker.js"></script>
    <script type="text/javascript" src="scripts/common.js"></script>
    <script type="text/javascript" src="scripts/webForm_common.js"></script>
    <script type="text/javascript" src="scripts/ExamMgr.js"></script>
    <script type="text/javascript" src="scripts/Score.js"></script>
    <script type="text/javascript" src="scripts/webFormPager/gzyPager.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    <div class="body">
        <asp:ScriptManager ID="ScriptManager1" runat="server">
        </asp:ScriptManager>
        <div class="head problib" style="background: url(../images/student_result.jpg);">
        </div>
        <br />
        <center>
            <div>
                <asp:Label ID="Label1" runat="server" Font-Bold="True" Font-Size="15px" ForeColor="Black"></asp:Label>
            </div>
        </center>
        <br />
        <div style="width: 60px; padding-right: 0px; float: right;">
            <a href="/">返回</a>
        </div>
        <asp:HiddenField ID="StudentID" runat="server" />
        <asp:HiddenField ID="AnswerSheetIds" runat="server" />
        <div class="wide">
            <asp:UpdatePanel ID="UpdatePanel1" UpdateMode="Conditional" runat="server">
                <ContentTemplate>
                    <asp:Panel ID="ExamsList_ContentPanel" runat="server" Visible="false" ClientIDMode="Static">
                        <asp:GridView ID="ExamList" runat="server" AutoGenerateColumns="False" HeaderStyle-CssClass="gridview_head"
                            CssClass="gridview" GridLines="None" EmptyDataText="-" DataKeyNames="id" OnRowDataBound="ExamList_RowDataBound">
                            <Columns>
                                <asp:BoundField DataField="id" ItemStyle-CssClass="center" HeaderText="编号" />
                                <asp:BoundField DataField="ExamName" HeaderText="考试名称" />
                                <asp:BoundField DataField="ExamState" ItemStyle-CssClass="center" HeaderText="考试状态" />
                                <asp:BoundField DataField="ExamMode" ItemStyle-CssClass="center" HeaderText="考试模式" />
                                <asp:BoundField DataField="ExamStartTime" ItemStyle-CssClass="center" HeaderText="考试开始时间" />
                                <asp:BoundField DataField="ExamEndTime" ItemStyle-CssClass="center" HeaderText="考试结束时间" />
                                <asp:TemplateField HeaderText="操作">
                                    <ItemTemplate>
                                        <asp:UpdatePanel ID="UpdatePanel2" runat="server">
                                            <Triggers>
                                                <asp:AsyncPostBackTrigger ControlID="QueryButton" EventName="Click" />
                                            </Triggers>
                                            <ContentTemplate>

                                 <%--           需要异步回传的理由：LinkButton的PostBack正常情况下是普通回传到指定页面，但是弹出窗口时，底下的页面还看得见，会刷新，所以要异步回传--%>
                                                <asp:LinkButton ID="QueryButton" OnClientClick='$("#_EXAMID_HiddenField").attr("value",$(this).attr("class"))'
                                                    CssClass='<%#Eval("ID") %>' PostBackUrl="~/ScoreQryDetail.aspx" runat="server">查看试题得分</asp:LinkButton>
                                                <%-- OnClientClick事件的解释：将id为_EXAMID_HiddenField的隐藏域的value设置为当前button的class属性的值--%>
                                            </ContentTemplate>
                                        </asp:UpdatePanel>
                                    </ItemTemplate>
                                    <ItemStyle HorizontalAlign="Center" />
                                </asp:TemplateField>
                            </Columns>
                            <EmptyDataTemplate>
                                未查找到符合条件的数据
                            </EmptyDataTemplate>
                            <HeaderStyle CssClass="gridview_head" />
                            <PagerSettings Mode="NumericFirstLast" />
                        </asp:GridView>
                        <div class="pager">
                            <asp:TextBox ID="PageBox" runat="server" ClientIDMode="Static" Style="display: none"></asp:TextBox>
                            <asp:Button ID="RefreshButton" runat="server" Text="Button" Style="display: none"
                                OnClick="Button1_Click" ClientIDMode="Static" />
                        </div>
                    </asp:Panel>
                </ContentTemplate>
            </asp:UpdatePanel>
            <div class="wide">
                <div id="gzyPager">
                </div>
            </div>
        </div>
    </div>
    <p class="body">
    </p>
    <asp:HiddenField ID="_SHEETIDS_HiddenField" runat="server" />
    <asp:HiddenField ID="_EXAMID_HiddenField" runat="server" />
    </form>
</body>
</html>
