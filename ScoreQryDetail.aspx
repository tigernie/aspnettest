<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ScoreQryDetail.aspx.cs"
    Inherits="Web.ScoreQryDetail" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="content-type" content="application/ms-excel; charset=UTF-8"/>
    <title>查看考生成绩列表（试卷列表）</title>
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
    <script src="script.ashx?teacher,teacher.ui" type="text/javascript"></script>

    <style type="text/css">
        .excel {
            background-image: url(../images/excel.jpg);
            background-repeat: no-repeat;
            background-position: left;
            background-attachment: scroll;
            text-align: left;
            padding-left: 20px;
            height: 16px;
        }

        .return {
            background-image: url(../images/icon.gif);
            background-repeat: no-repeat;
            background-position: left;
            background-attachment: scroll;
            height: 16px;
            padding-left: 18px;
            text-align: left;
        }

        .SearchKeywords_CssClass {
            margin-left: 9px;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="body">
            <asp:ScriptManager ID="ScriptManager1" runat="server">
            </asp:ScriptManager>
            <%--教师界面头部--%>
            <asp:Panel ID="TeacherPanel" runat="server">
                <div class="head problib" style="background: url(../images/teacher.result.jpg);">
                    <p>
                        <a class="user" href="javascript:;">管理员</a> <a class="home" href="../teacher.htm">返回首页</a>
                        <a class="setting" href="javascript:;">系统管理</a> <a class="exit" href="javascript:;">注销</a>
                    </p>
                </div>
            </asp:Panel>
            <%--  学生界面头部--%>
            <asp:Panel ID="StudentPanel" runat="server" Visible="false">
                <div class="head problib" style="background: url(../images/student_result.jpg);">
                </div>
            </asp:Panel>
            <br />
            <center>
            <div style="text-align: center;">
                <asp:Label ID="Label1" runat="server" Font-Bold="True" Font-Size="15px" ForeColor="Black"></asp:Label>
            </div>
        </center>
            <div class="wide">
                <div id="searchArea" class="search">
                    <%--过滤条件--%>
                    <div style="float: left; width: 650px;">
                        <asp:DropDownList ID="ClassSelect" runat="server" AutoPostBack="True" OnSelectedIndexChanged="ClassSelect_SelectedIndexChanged">
                        </asp:DropDownList>
                        <asp:CheckBox ID="chkBox" Text="不显示缺考成绩" AutoPostBack="true" Checked="false"  ClientIDMode="Static"
                            runat="server" OnCheckedChanged="chkBox_CheckedChanged" BorderWidth="0" BorderColor="White" BorderStyle="None" Style="border: 0 none;" />
                        <asp:TextBox ID="SearchKeywords" CssClass="SearchKeywords_CssClass" runat="server" MaxLength="20" ClientIDMode="Static"></asp:TextBox>
                        <asp:ImageButton ID="Search" ImageUrl="images/search-small.gif" runat="server" OnClick="Search_Click" />
                       
                    </div>
                    <div style="width: 200px; float: right;">
                        <div style="float: left; width: 130px;">

                            <asp:Panel ID="Panel1" runat="server">
                                <%--学生界面不显示此Panel--%>
                                <asp:LinkButton ID="LinkButton1" CssClass="excel" OnClick="LinkButton1_Click" runat="server">导出到Excel文件</asp:LinkButton>
                                

                            </asp:Panel>

                        </div>
                        <div style="float: left; margin-left: 5px;">
                            <asp:LinkButton ID="lnkBack" CssClass="return" runat="server">返回</asp:LinkButton>
                        </div>
                    </div>
                </div>
                 
                    <asp:FileUpload ID="FileUpload1" runat="server" Width="70" />
                    <asp:Button ID="Button1" runat="server" Text="上传实操成绩" OnClick="Button1_Click1" />
                 <asp:Button ID="OpenScore_Org" runat="server" Text="开放机构查询" OnClick="OpenScore_Org_Click"  />
                 <asp:Button ID="OpenScore_Company" runat="server" Text="开放单位查询" OnClick="OpenScore_Company_Click"  />
                 <asp:Button ID="OpenScore_Students" runat="server" Text="开放考生查询" OnClick="OpenScore_Students_Click"  />
                <input type="button" id="setPassScore" value="设置合格分数" />
                <asp:Button ID="Button2" runat="server" Text="打印合格证" OnClick="LinkButton2_Click" />
                <label id="PassRate"></label>
            </div>
            <br />
            <div class="wide">
                <asp:HiddenField ID="ExamID_HiddenField" runat="server" />
                <asp:UpdatePanel ID="UpdatePanel1" UpdateMode="Conditional" ChildrenAsTriggers="true"
                    runat="server">
                    <Triggers>
                        <asp:AsyncPostBackTrigger ControlID="ClassSelect" EventName="SelectedIndexChanged" />
                    </Triggers>
                    <ContentTemplate>
                        <asp:GridView ID="ExamList" runat="server" AutoGenerateColumns="False" GridLines="None"
                            EmptyDataText="0" DataKeyNames="Id" OnRowDataBound="ExamList_RowDataBound"
                            OnDataBound="ExamList_DataBound" CssClass="list">
                            <Columns>
                                <%--Index:0--%>

                                <asp:BoundField DataField="PersonNumber" HeaderStyle-HorizontalAlign="Center" ItemStyle-HorizontalAlign="Center"
                                    HeaderText="身份证号"></asp:BoundField>

                                <%--Index:1--%>
                                <asp:BoundField DataField="StudentName" HeaderStyle-HorizontalAlign="Center" ItemStyle-HorizontalAlign="Center"
                                    HeaderText="考生姓名"></asp:BoundField>
                                <%--Index:2--%>
                                <asp:BoundField DataField="SubjectiveScore" HeaderStyle-HorizontalAlign="Center" 
                                    ItemStyle-HorizontalAlign="Center" NullDisplayText="0" HeaderText="实操得分"></asp:BoundField>
                                <%--Index:3--%>
                                <asp:BoundField DataField="ObjectiveScore" HeaderStyle-HorizontalAlign="Center" ItemStyle-HorizontalAlign="Center"
                                    NullDisplayText="0" HeaderText="客观题得分"></asp:BoundField>
                                <%--Index:4--%>
                                <asp:BoundField DataField="TotalScore" HeaderStyle-HorizontalAlign="Center" Visible="false"
                                    ItemStyle-HorizontalAlign="Center" NullDisplayText="0" HeaderText="实际得分"></asp:BoundField>
                                <%--Index:5--%>
                                <asp:BoundField DataField="ScoreLevel" HeaderStyle-HorizontalAlign="Center" ItemStyle-HorizontalAlign="Center"
                                    NullDisplayText="-" HeaderText="成绩等级"></asp:BoundField>
                                <%--Index:6--%>
                                <asp:BoundField DataField="ExamState" HeaderText="备注" HeaderStyle-HorizontalAlign="Center"
                                    ItemStyle-HorizontalAlign="Center"></asp:BoundField>
                                <%--Index:7--%>
                                <asp:TemplateField HeaderText="操作">
                                    <HeaderStyle HorizontalAlign="Center" />
                                    <ItemStyle HorizontalAlign="Center" />
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
        <asp:HiddenField ID="_ISSTUDENT_HIDDENFIELD" runat="server" />
    </form>
</body>
</html>

<script>
    $('#setPassScore').click(function () {
        var score = window.prompt('设置', '请输入合格分数');
        if (score && !isNaN(score)) {
            jQuery.service('exam.asmx/SetPassScore', { examId: QueryString('examid'), score: score }, function (d) {
                if (d.ok) {
                    alert('设置成功');
                    // $('#PassRate').html('&nbsp;&nbsp;&nbsp;合格分数：' + score + ',&nbsp;&nbsp;&nbsp;&nbsp;合格率：' + d.msg + '%');
                    location.reload();
                }
                else
                    alert('设置失败');
            });
        }
        else
            alert('请输入正确的分数');

    });


    function getPassScoreAndRate() {
        jQuery.service('exam.asmx/GetPassScoreAndRate', { examId: QueryString('examid'),exceptAbsent:($('#chkBox').attr('checked')?true:false)}, function (d) {
            if (d.ok) {
                var arr = d.msg.split(',');
                if (parseFloat(arr[0]) == 0)
                    $('#PassRate').html('未设置合格分数');
                else
                    $('#PassRate').html('&nbsp;&nbsp;&nbsp;合格分数：' + arr[0] + ',&nbsp;&nbsp;&nbsp;&nbsp;合格率：' + arr[1]+'%');
            }
        });


    }

    $(function () {
        getPassScoreAndRate();

    })


</script>
