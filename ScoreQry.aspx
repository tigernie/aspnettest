<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ScoreQry.aspx.cs" Inherits="Web.ScoreQry" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>查看阅卷结束了的考试列表</title>
    <link href="styles/style.css" rel="stylesheet" type="text/css" />
    <link href="styles/style_webForms.css" rel="stylesheet" type="text/css" />
    <script src="scripts/jquery-1.7.min.js" type="text/javascript"></script>
    <script src="scripts/PopWindow/gzy.popup.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/My97DatePicker/WdatePicker.js"></script>
    <script type="text/javascript" src="scripts/common.js"></script>
    <script type="text/javascript" src="scripts/webForm_common.js"></script>
    <script type="text/javascript" src="scripts/ExamMgr.js"></script>
    <script type="text/javascript" src="scripts/webFormPager/gzyPager.js"></script>
    <script src="script.ashx?teacher,teacher.ui" type="text/javascript"></script>
    <script type="text/javascript">

        function popupProgress() {
            new gzy.popup(null, 200, 30, { element: $("#progress") });
        }
        </script>
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
        <ul class="mtabs">
            <li><a href="JudgeExam.aspx" id="ExamsList">阅卷</a></li>
            <li class="current"><a href="ScoreQry.aspx" id="A1">成绩</a></li>
        </ul>
        <div class="wide">
            <asp:UpdatePanel ID="UpdatePanel1" UpdateMode="Conditional" runat="server">
                <ContentTemplate>
                    <asp:GridView ID="ExamList" runat="server" AutoGenerateColumns="False" GridLines="None" EmptyDataText="-" OnRowDataBound="ExamList_RowDataBound" ondatabound="ExamList_DataBound" cssclass="list">
                        <Columns>
                            <asp:BoundField DataField="ID" HeaderStyle-HorizontalAlign="Center"
                                    ItemStyle-HorizontalAlign="Center"  HeaderText="考试编号"></asp:BoundField>
                            <asp:BoundField DataField="ExamName" HeaderStyle-HorizontalAlign="Center"
                                     HeaderText="考试名称">
                            </asp:BoundField>
                            <asp:BoundField DataField="JudgeState" HeaderStyle-HorizontalAlign="Center"
                                    ItemStyle-HorizontalAlign="Center"  HeaderText="阅卷状态"></asp:BoundField>
                            <asp:BoundField DataField="ExamStartTime" DataFormatString="{0:yyyy-MM-dd HH:mm}"
                                HeaderText="考试开始时间" HeaderStyle-HorizontalAlign="Center"
                                    ItemStyle-HorizontalAlign="Center" ></asp:BoundField>
                            <asp:BoundField DataField="ExamEndTime" DataFormatString="{0:yyyy-MM-dd HH:mm}"
                                HeaderText="考试结束时间" HeaderStyle-HorizontalAlign="Center"
                                    ItemStyle-HorizontalAlign="Center" ></asp:BoundField>
                            <asp:BoundField DataField="ExamMode"  HeaderStyle-HorizontalAlign="Center"
                                    ItemStyle-HorizontalAlign="Center" HeaderText="考试类型"></asp:BoundField>
                            <asp:BoundField DataField="PaperType"  HeaderStyle-HorizontalAlign="Center"
                                    ItemStyle-HorizontalAlign="Center" HeaderText="试卷类型"></asp:BoundField>
                            <asp:BoundField DataField="StudentCount" HeaderStyle-HorizontalAlign="Center"
                                    ItemStyle-HorizontalAlign="Center"  HeaderText="考生人数" NullDisplayText="-"></asp:BoundField>
                            <asp:TemplateField HeaderText="操作">
                           <HeaderStyle HorizontalAlign="Center" />
                           <ItemStyle HorizontalAlign="Center" />
                                <ItemTemplate>
                                    <asp:LinkButton ID="QueryButton" PostBackUrl="~/ScoreQryDetail.aspx" OnClientClick='$("#_EXAMID_HiddenField").attr("value",$(this).attr("class"))'
                                        CssClass='<%#Eval("ID") %>' runat="server">查看成绩</asp:LinkButton>
                                    <asp:LinkButton ID="StatisticsButton" PostBackUrl="~/ScoreStatistics.aspx" OnClientClick='$("#_EXAMID_HiddenField").attr("value",$(this).attr("class"));popupProgress();'
                                        CssClass='<%#Eval("ID") %>' runat="server">成绩统计</asp:LinkButton>
                                    <asp:Literal ID="ltr_NoSupportStatistics" Visible="false" runat="server">(不支持)</asp:Literal>
                                </ItemTemplate>
                            </asp:TemplateField>
                        </Columns>
                        <EmptyDataTemplate>
                            未查找到符合条件的数据
                        </EmptyDataTemplate>
                        <HeaderStyle />
                        <PagerSettings Mode="NumericFirstLast" />
                    </asp:GridView>
                    <%--<asp:ListView ID="ExamList" DataSourceID="LinqDataSource1" OnItemDataBound="ExamList_ItemDataBound"   runat="server">
                    
                    <LayoutTemplate>
                     <table class="gridview" style=" border:0ps; text-align:center; "   cellspacing="0">
                         <thead class="gridview_head"  style=" border:0; border-width:0;">
                             <tr>
                                 <th style=" text-align:center;">
                                     考试编号
                                 </th>
                                 <th>
                                     考试名称
                                 </th>
                                 <th>
                                     阅卷状态
                                 </th>
                                 <th>
                                     ExamEndTime
                                 </th>
                                 <th>
                                     考试类型
                                 </th>
                                 <th>
                                     试卷类型
                                 </th>
                                 <th>
                                     考生人数
                                 </th>
                                 <th>
                                     操作
                                 </th>
                             </tr>
                         </thead>
                         <tbody>
                             <asp:PlaceHolder ID="itemPlaceholder" runat="server"></asp:PlaceHolder>
                         </tbody>
                         <tfoot>
                         <td></td>
                         </tfoot>
                     </table>
                    </LayoutTemplate>
                        <ItemTemplate>
                            <tr style=" text-align:center;">
                                <td  style=" text-align:center;">
                                    <asp:Label ID="Label1" runat="server" Text='<%#Eval("ID") %>'></asp:Label> 
                                </td>
                                <td> <asp:Label ID="Label2" runat="server" Text='<%#Eval("ID") %>'></asp:Label> 
                                    <%#Eval("ExamName")%>
                                </td>
                                <td> <asp:Label ID="Label3" runat="server" Text='<%#Eval("ID") %>'></asp:Label> 
                                    <%#Eval("JudgeState")%>
                                </td>
                                <td> <asp:Label ID="Label4" runat="server" Text='<%#Eval("ID") %>'></asp:Label> 
                                    <%#Eval("ExamEndTime", "{0:yyyy-MM-dd HH:mm:ss}")%>
                                </td>
                                <td> <asp:Label ID="Label5" runat="server" Text='<%#Eval("ID") %>'></asp:Label> 
                                    <%#Eval("ExamMode")%>
                                </td>
                                <td> <asp:Label ID="Label6" runat="server" Text='<%#Eval("ID") %>'></asp:Label> 
                                    <%#Eval("PaperType")%>
                                </td>
                                <td> <asp:Label ID="Label7" runat="server" Text='<%#Eval("ID") %>'></asp:Label> 
                                    <%#Eval("StudentCount")%>
                                </td>
                                <td>
                                    <asp:LinkButton ID="QueryButton" runat="server"
                                     PostBackUrl='<%# "~/ScoreQryDetail.aspx?id=" + Eval("ID")+"&JudState=" + Eval("JudgeState")+""%>'>查看成绩
                                     </asp:LinkButton>
                                </td>
                            </tr>
                        </ItemTemplate>
                    </asp:ListView>--%>
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
    <div style="display: none;">
        <div id="progress">
            <center>
                <img alt="请稍后" src="/images/startJudge.gif" />正在初始化...</center>
        </div>
    </div>
    <asp:HiddenField ID="_EXAMID_HiddenField" runat="server" />
    </form>
</body>
</html>
