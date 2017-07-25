<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="JudgeDetail.aspx.cs" Inherits="Web.JudgeDetail" %>

<%--<%@ Register Assembly="GZY.Exam.Custom"    Namespace="GZY.Exam.Custom" TagPrefix="Gzy" %>
--%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>阅题</title>
    <link href="styles/style.css" rel="stylesheet" type="text/css" />
    <link href="styles/style_webForms.css" rel="stylesheet" type="text/css" />
    <script src="scripts/jquery-1.7.min.js" type="text/javascript"></script>
    <script src="scripts/common.js" type="text/javascript"></script>
    <script src="scripts/PopWindow/gzy.popup.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/My97DatePicker/WdatePicker.js"></script>
    <script type="text/javascript" src="scripts/webForm_common.js"></script>
    <script type="text/javascript" src="scripts/Judge.js"></script>
    <script src="script.ashx?teacher,teacher.ui" type="text/javascript"></script>
    <script src="scripts/judgeExam.js" type="text/javascript"></script>
    <script src="scripts/JudgeBox.js" type="text/javascript"></script>
    <script src="scripts/JudgeDetail.js" type="text/javascript"></script>
    <style type="text/css">
        span p
        {
            text-align: left;
            font-size: 15px;
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
        
        .myJudgedSheet
        {
            background-image: url(../images/icon.gif);
            background-repeat: no-repeat;
            background-position: left;
            background-attachment: scroll;
            height: 16px;
            padding-left: 18px;
            text-align: left;
        }
        
        .dropdownlist
        {
        }
        
        .titleText
        {
            background-color: #f6f6f6;
            padding: 6px;
            font-weight: bolder;
            font-size: 14px;
        }
        .text
        {
            padding: 5px;
        }
           .return
        {
            background-image: url(../images/icon.gif);
            background-repeat: no-repeat;
            background-attachment: scroll;
            background-position: left;
            height:15px;
            padding-left:18px;
          
        }
    </style>
    <%--   .titleText
        {
            background-color: #e1e1e1;
            padding:6px;
        
        }
        .text
        {
             background-color: #f6f6f6;
             padding:12px;
             
        }--%>
    <script src="scripts/Drag/gzy.drag.js" type="text/javascript"></script>
    <script type="text/javascript">
        function openoffice(ext) {
            var src = this.href, pp = new gzy.popup('OFFICE答题窗口 --**如果没有出现OFFICE窗口, 请关闭此小窗口再重新打开.**--', 800, 600, {
                element: office,
                onload: function () {
                    try {
                        office.style.display = 'none';
                        office.CloseDoc(0);
                        office.DocType = is_office(ext);
                    }
                    catch (e) {
                    }
                    office.ShowToolBar = false;
                    $.delay(function (loading) {
                        office.LoadOriginalFile(src, ext);
                        loading.close();
                        office.style.display = '';
                    }, 1000, showLoding('正在启动程序，请稍候...'));
                },
                onclose: function () {
                    office.CloseDoc(0);
                }
            });
            return false;
        }
        function is_office(ext) {
            if (ext) {
                ext = ext.toLowerCase();
                if (ext.indexOf('doc') > -1) return 11;
                if (ext.indexOf('xls') > -1) return 12;
                if (ext.indexOf('ppt') > -1) return 13;
            }
            return 0;
        };
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
        <div class="wide">
            <div id="searchArea" class="search">
                <asp:DropDownList ID="SortOrderSelect" runat="server" Visible="false" AutoPostBack="True">
                    <asp:ListItem Value="OrderByStartTimeAsc">按开考时间升序</asp:ListItem>
                    <asp:ListItem Value="OrderByStartTimeDesc" Selected="True">按开考时间降序</asp:ListItem>
                </asp:DropDownList>
                <asp:DropDownList ID="ExamStateSelect" runat="server" Visible="false" AutoPostBack="True">
                    <asp:ListItem Value="">所有考试状态</asp:ListItem>
                    <asp:ListItem Value="UnStart">未开始</asp:ListItem>
                    <asp:ListItem Value="Testing">考试中</asp:ListItem>
                    <asp:ListItem Value="Over">已结束</asp:ListItem>
                </asp:DropDownList>
            </div>
        </div>
        <br />
        <div style="width: 100%; height: 60px;">
            <center>
                <div style="width: 400px; text-align: center;">
                    <div style="font-size: 15px; font-weight: bold;">
                        <asp:Label ID="lbl_ExamName" Visible="false" runat="server" Text=""></asp:Label>
                    </div>
                    <div style="margin-top: 15px; width: 200px; text-align: center;">
                        <div style="width: 400px;  font-size: 12px;">
                            <asp:Label ID="lbl_TotalCount" Visible="false" runat="server" Text=""></asp:Label>&nbsp;&nbsp;&nbsp;&nbsp;
                            <asp:Literal ID="ltl_JudgedCount" Visible="false" runat="server"></asp:Literal>&nbsp;&nbsp;&nbsp;&nbsp;
                            <asp:Literal ID="ltl_JudgingCount" Visible="false"  runat="server"></asp:Literal>&nbsp;&nbsp;&nbsp;&nbsp;
                            <asp:Literal ID="lbl_RemainCount" Visible="false" runat="server"></asp:Literal>
                        </div>
                    </div>
                </div>
            </center>
        </div>
        <ul class="mtabs">
        </ul>
        <div style="width: 900px;">
            <%-- <input id="Checkbox2" type="checkbox" onchange="changeDDLselectedItem($(this))" title="未批阅题目自动打0分" />未批阅题目自动打0分--%>
            <div style="width: 280px; float: right; text-align: right;">
                <%--  <asp:Button ID="Refresh_RemainCount" OnClientClick=";"  runat="server"  />
                --%>
                 <div style="width: 120px; height: 25px; float: left;">
                  <a class="return" href="/JudgeExam_DetailView.aspx">返回到考试列表</a>
                  </div>
                <span><span class="tips" style="float: left; color: Red;"></span><span style="float: right;">
                    <asp:LinkButton ID="BackBtn" CommandName="back" Visible="false" CssClass="myJudgedSheet"
                        OnCommand="BackBtn_Command" runat="server">我阅过的试卷</asp:LinkButton>
                    <asp:LinkButton ID="lnk_nextSheet" OnClick="lnkbtnNextSheet_Click" OnClientClick='return checkJudge()'
                        Visible="false" Text="下一份试卷" runat="server" CssClass="next"></asp:LinkButton>
                    <%--  OnClientClick="return checkJudge()"--%>
                </span></span>
                <asp:HiddenField ID="hfield_examid" runat="server" />
            </div>
        </div>
        <div style="margin: 10px;">
            <center>
                <%--OnPreRender="DataList1_PreRender"--%>
                <asp:HiddenField ID="HiddenField_DetailIdList" runat="server" />
                <asp:HiddenField ID="HiddenField_JudgeModeList" runat="server" />
                <asp:HiddenField ID="HiddenField_JudgeTimesList" runat="server" />
                <asp:DataList ID="DataList1" DataKeyField="ID" runat="server" OnItemDataBound="DataList1_ItemDataBound"
                    OnItemCommand="DataList1_ItemCommand">
                    <ItemTemplate>
                        <asp:Panel ID="Panel1" runat="server">
                            <fieldset style="margin: 5px 0 5px 0; padding: 10px; text-align: left;">
                                <legend>&nbsp;第<%#Eval("InnerIndex") %>题<%--，试题编号：<asp:Label ID="lbl_probID" runat="server"
                                    Text='<%#Eval("ID") %>'></asp:Label>--%>&nbsp;</legend>
                                <div style="width: 950px; margin: 0 auto;">
                                    <asp:HiddenField ID="HIDDENFIELD_DID" Value='<%#Eval("ID") %>' runat="server" />
                                    <table width="100%">
                                        <tr>
                                            <td width="60%">
                                                <%--试题内容--%>
                                                <!--div class="titleText"><div> 题面内容：</div> </div-->
                                                <div class="text">
                                                    <div>
                                                        <div style="text-align: left; padding: 10px; width: 100%;" id="div_content" runat="server">
                                                        </div>
                                                    </div>
                                                </div>
                                                <!--div class="titleText"> <div>  参考答案：</div>  </div-->
                                                【参考答案】
                                                <div class="text">
                                                    <div>
                                                        <%-- 参考答案--%>
                                                        <asp:Literal ID="ltr_standardAnswer" runat="server" Visible="false"></asp:Literal>
                                                    </div>
                                                </div>
                                            </td>
                                            <td valign="top">
                                                <div class="titleText">
                                                    <div>
                                                        学生答案：</div>
                                                </div>
                                                <div class="text">
                                                    <div>
                                                        <%-- 学生答案--%>
                                                        <asp:Literal ID="ltr_StudentStringAnswer" runat="server"></asp:Literal>
                                                        <asp:LinkButton ID="actual_answer" Visible="false" CommandName="GETACTUALANSWER"
                                                            CommandArgument='<%#Eval("ID") %>' runat="server" Text="获取附件" />
                                                            <asp:Panel ID="Panel_OnlineView"  style=" display:inline" Visible="false"  runat="server"> |
                                                        <a href="?CommandName=GETACTUALANSWER&CommandArgument=<%#Eval("ID") %>" onclick="return openoffice.call(this,'<%# (Eval("StudentSubjectFileName")+"").Split('.').Last() %>')">在线查看</a>        </asp:Panel> 
                                                    </div>
                                                </div>
                                                <div class="titleText">
                                                    <div>
                                                        判分操作：<asp:Label Style="font-weight: normal" ID="Label3" runat="server" Text='<%#Eval("ProblemScore","(该题总分：{0} 分)") %>'></asp:Label></div>
                                                </div>
                                                <div class="text">
                                                    <div>
                                                        <%--操作--%>
                                                        <table style="margin-left: 10px;">
                                                            <tr>
                                                                <td colspan="2">
                                                                    <%--根据评分细则 用输入框打分并 手动提交--%>
                                                                    <table>
                                                                        <tr>
                                                                            <td>
                                                                            </td>
                                                                            <td align="left">
                                                                                <div id='<%#Eval("ID", "jb_{0}")%>'>
                                                                                </div>
                                                                                <input id='<%#Eval("ID", "Hidden_ProblemScore{0}")%>' value='<%#Eval("ProblemScore") %>'
                                                                                    type="hidden" />
                                                                                <input id='<%#Eval("ID", "Hidden_JudgeStandardCount{0}")%>' value='<%#Eval("JudgeStandardCount") %>'
                                                                                    type="hidden" />
                                                                                <input id='<%#Eval("ID", "Hidden_Score{0}")%>' type="hidden" />
                                                                                <input id='<%#Eval("ID", "save{0}")%>' style="margin: 10px auto 10px 210px; width: 100px;
                                                                                    height: 29px;" type="button" onclick="save(this)" value="给分" />
                                                                                <span id='<%#Eval("ID","tips{0}") %>'></span>
                                                                                <br /><span id='<%#Eval("ID","nextTips{0}") %>'
                                                                                    class="nextTips" style="display: none; color: Red"></span>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                    <%--下面是下拉打分--%>
                                                                    <%--  该试题得分：
                                            <asp:UpdatePanel ID="UpdatePanel1" RenderMode="Inline" UpdateMode="Conditional" runat="server">
                                                <Triggers>
                                                    <asp:AsyncPostBackTrigger ControlID="ddlJudge" EventName="SelectedIndexChanged" />
                                                </Triggers>
                                                <ContentTemplate>
                                                    <asp:DropDownList ID="ddlJudge" CssClass="dropdownlist" AutoPostBack="true"
                                                        OnSelectedIndexChanged="ddlJudge_SelectedIndexChanged" runat="server">
                                                    </asp:DropDownList> （分） <span class="HasJudged"></span>
                                                    <asp:Literal ID="tips" runat="server"></asp:Literal>
                                                  
                                             
                                                </ContentTemplate>
                                            </asp:UpdatePanel>--%>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </fieldset>
                        </asp:Panel>
                    </ItemTemplate>
                </asp:DataList>
            </center>
            <div style="width: 900px;">
                <div style="width: 360px; float: right; text-align: right;">
                    <span class="tips" style="float: left; color: Red;"></span>
                    <asp:LinkButton ID="lnk_nextSheet_bottom" runat="server" CommandName="nextSheet"
                        Visible="false" CssClass="next" OnClientClick='return checkJudge()' OnClick="lnkbtnNextSheet_Click">下一份试卷</asp:LinkButton>
                </div>
            </div>
        </div>
    </div>
    <asp:Label ID="Label1" runat="server"></asp:Label>
    <p class="body">
    </p>
    </form>
<div style="position:absolute;left:-10000px;top:-10000px;z-index:-10000;zoom:1;width:1px;height:1px;overflow:hidden;display:none" id="office-container">
    <object width="800" id="office" height="600" classid="clsid:e77e049b-23fc-4db8-b756-60529a35fad5" codebase="scripts/activex/weboffice.cab#version=6,0,5,0"></object>
</div></body>
</html>
