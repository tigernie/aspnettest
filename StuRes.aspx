<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="StuRes.aspx.cs" Inherits="Web.StuRes" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
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
    <style type="text/css">
        table.list tr > td
        {
            text-align: center;
        }
        
        table.list tr > td.td_left
        {
            text-align: left;
            padding-left: 12px;
              width:230px;
        }
        table.list tr > td.td_right
        {
            text-align: right;
            padding-right: 26px;
            width: 90px;
        }
        .return
        {
            background-image:url(../images/icon.gif);
            background-repeat:no-repeat;
            background-attachment:scroll;
            background-position:center;
            margin:1;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div class="body">
        <asp:ScriptManager ID="ScriptManager1" runat="server">
        </asp:ScriptManager>
        <div class="head problib" style="background: url(../images/student_result.jpg);">
        </div>
        <br />

        <div style="width: 100%;">
            <div style="padding-left: 30px; width: 260px; height: 25px; float: left;">
                <asp:Literal ID="ltr_nameAndNo" runat="server" Text="的历史成绩："></asp:Literal>
            </div>
            <div style="width: 90px; height: 25px;  float: right;">
              <a   class="return" href="/"> <span style=" padding-left:45px;"> 返回</span></a>
            </div>
        </div>
        <asp:HiddenField ID="StudentID" runat="server" />
        <asp:HiddenField ID="AnswerSheetIds" runat="server" />
        <div class="wide">
            <asp:UpdatePanel ID="UpdatePanel1" UpdateMode="Conditional" runat="server">
                <ContentTemplate>
                    <asp:GridView ID="MySheetList" runat="server" AutoGenerateColumns="False" HeaderStyle-CssClass=""
                        CssClass="list" GridLines="None" EmptyDataText="-" DataKeyNames="Id"
                        OnRowDataBound="ExamList_RowDataBound">
                        <Columns>
                            <asp:BoundField DataField="ExamName" ItemStyle-CssClass="td_left" HeaderText="考试名称">
                            </asp:BoundField>
                             <asp:BoundField DataField="ExamStartTime" ItemStyle-Width="140" DataFormatString="{0:yy年MM月dd日 HH:mm}" ItemStyle-CssClass="td_left" HeaderText="开始时间">
                            </asp:BoundField>
                          <%--  <asp:BoundField DataField="SheetExamDuration" ItemStyle-CssClass="td_right" HeaderText="考试用时">
                            </asp:BoundField>--%>
                            <asp:BoundField DataField="SubjectiveScore" NullDisplayText="未阅" HeaderText="主观题得分">
                            </asp:BoundField>
                            <asp:BoundField DataField="ObjectiveScore" NullDisplayText="未阅" HeaderText="客观题得分">
                            </asp:BoundField>
                           <%-- <asp:BoundField DataField="ActualSheetScore" NullDisplayText="未阅" HeaderText="实际得分">
                            </asp:BoundField>--%>
                            <%--     <asp:BoundField DataField="Ranking" HeaderText="班级内排名">
                                </asp:BoundField>--%>
                            <asp:BoundField DataField="ScoreLevel" NullDisplayText="-" HeaderText="成绩等级"></asp:BoundField>
                            <asp:TemplateField HeaderText="操作">
                                <ItemTemplate>
                                    <%--OnClientClick='queryScores(<%#Eval("AnswerSheetID") %>,$("#_ISSTUDENT_HIDDENFIELD").attr("value"))'--%>
                                    <asp:UpdatePanel ID="UpdatePanel2" UpdateMode="Conditional" runat="server">
                                        <Triggers>
                                            <asp:AsyncPostBackTrigger ControlID="QueryButton" EventName="Click" />
                                        </Triggers>
                                        <ContentTemplate>
                                            <asp:LinkButton ID="QueryButton" runat="server">查看试题得分</asp:LinkButton>
                                        </ContentTemplate>
                                    </asp:UpdatePanel>
                                    <asp:HiddenField ID="HiddenField1" Value='<%#Eval("ExamState") %>' runat="server" />
                                </ItemTemplate>
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
    <div>
    <asp:HiddenField ID="_SHEETIDS_HiddenField" runat="server" />
    <asp:HiddenField ID="_EXAMID_HiddenField" runat="server" />
    </div>
    </form>
</body>
</html>
