<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ScoreStatistics.aspx.cs"
    Inherits="Web.ScoreStatistics" Buffer="true" %>

<%@ OutputCache Duration="10" VaryByParam="none" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>成绩统计</title>
    <link href="styles/style.css" rel="stylesheet" type="text/css" />
    <link href="styles/style_webForms.css" rel="stylesheet" type="text/css" />
    <script src="scripts/jquery-1.7.min.js" type="text/javascript"></script>
    <script src="scripts/PopWindow/gzy.popup.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/My97DatePicker/WdatePicker.js"></script>
    <script type="text/javascript" src="scripts/common.js"></script>
    <script type="text/javascript" src="scripts/webForm_common.js"></script>
    <script type="text/javascript" src="scripts/Judge.js"></script>
    <script type="text/javascript" src="scripts/TabSet/gzy.tabset.v3.js"></script>
    <script src="script.ashx?teacher,teacher.ui" type="text/javascript"></script>
    <style type="text/css">
        .statistics_cell { width: 100%; padding: 10px; }
        .statistics_cell tr td { margin: 5px; }

        .key { width: 100px; }
        .value { width: 300px; }

        fieldset legend { background-color: White; color: Black; margin-left: 20px; padding: 4px; }

        .wide div { margin: 0 auto; padding: 5px auto; width: 905px; }

        .statistics_filed { margin-top: -10px; margin: 0 auto; }

        .return { background-image: url(../images/icon.gif); background-repeat: no-repeat; background-attachment: scroll; background-position: left; height: 15px; padding-left: 18px; }


        .HeadOfKpTab { width: 100%; background: #f1f1f1; color: #056d80; text-align: left; line-height: 30px; }
        .HeadOfKpTab th.lb1 { width: 210px; }
        .HeadOfKpTab tr th { padding: 0 4px; }
        .gridview tbody tr td.c1 { width: 210px; }

        .HeadOfKpTab th.lb2, th.lb3, th.lb4, th.lb5, th.lb6, th.lb7 { width: 50px; }

        .gridview tbody tr td.c2, td.c3, td.c4, td.c5, td.c6, td.c7 { width: 50px; }


        .gridview { width: 100%; }

        .bg { background-image: url(../images/watch-exname-bg.gif); background-repeat: repeat; background-position: left top; background-color: White; }

        .fixed { position: fixed; z-index: 100; background-color: White; }
        .relative { position: relative; }
    </style>
    <script type="text/javascript">
        function post(UserIDs) {
            $.post("AbsentNames.aspx", { sa: UserIDs }, function (data) {
                return AbsentNames($("#SelectedClassId_HiddenField").attr("value")), false;
            })
        }

        function showErrorList() {

            new gzy.popup("错题列表", 920, 500, { element: $("#errorDetails") });

        }

        function checkAll() {
            if ($("#Checkbox1").attr("checked") == true || $("#Checkbox1").attr("checked") == "checked") {//选中所有


                $(".chkItem").each(function (i, e) {

                    if (!$(this).attr("checked") || $(this).attr("checked") != "checked") {
                        $(this).attr("checked", "checked")
                    }
                })
            }
            else {//去掉所有选中


                $(".chkItem").each(function (i, e) {
                    if ($(this).attr("checked") == "checked") {
                        $(this).removeAttr("checked")
                    }
                })
            }
        }

        function getCheckValue() {
            var res = "";
            $(".chkItem").each(function (i, e) {
                if ($(this).attr("checked") == "checked") {
                    res += $(this).attr("value") + ",";
                }
            })
            if (res.length > 0) {
                res = res.substr(0, res.length - 1);
            }
            else {
                alert("未选中任何试题");
                return;
            }
            return res;
        }

        function zujuan(probids) {//利用错题 组卷 ，打开一个页面

            if (probids.length > 0 && probids.toString().length > 0) {
                $('<form action="/probsPreview.html" method="get" target="_blank"><input name="type" value="3"/><input name="probIds" value="' + probids.toString() + '"/></form>').appendTo('body').submit().remove();

            }
        }
        function shoucang(probids) {//收藏  向处理程序发送请求

            if (probids.length > 0 && probids.toString().length > 0) {
                $.ajax(
                {
                    type: "post",
                    data: { "probids": probids },
                    url: "AddToMyProbLib.ashx",
                    success: function (result) {
                        if (result == "OK") {
                            alert("添加成功");
                        }
                        else {
                            alert("出错:" + result);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("失败:" + "\n错误状态文本描述：" + textStatus
                            + "\n详细错误：" + errorThrown +
                            "\n服务器返回状态码：" + XMLHttpRequest.status +
                            "\n异步状态码：" + XMLHttpRequest.readyState);
                    },
                    async: true
                }
                );
            }

        }

        //        window.onscroll = function () {
        //           
        //            if (document.documentElement.scrollTop <168) {
        //                $("#title").css("position", "fixed");
        //            }
        //        };
        // $(document).ready(function () {  var elm = $('#title'); var startPos = $(elm).offset().top;  $.event.add(window, "scroll", function () { var p = $(window).scrollTop();  $(elm).css('position', ((p) > startPos) ? 'fixed' : 'static'); $(elm).css('top', ((p) > startPos) ? '0px' : '');  }); })
        //        function tt() {
        //            new gzy.tabset('#mytab a', 'div.statistics_filed');
        //        }



        $(function () {

            if ($('#lbl_PaperType').html() == '统一卷')
                $('#export').attr('href', 'ExportScoreStaticsFile.aspx?examId=' + QueryString('examid'));
            else
                $('#export').hide();

        })


    </script>
    <style type="text/css">
        #mytab { padding-left: 20px; }
        #mytab a { margin-right: 10px; }
        #mytab a.current { font-weight: bold; font-size: 16px; }
    </style>
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
                    <a href="javascript:;" class="setting">系统管理</a> <a href="javascript:;" class="exit">注销</a>
                </p>
            </div>
            <div>
                <div style="width: 60px; height: 25px; float: right; margin: 10px 50px 10px auto;">
                    <a class="return" href="/JudgeExam_DetailView.aspx">返回</a>
                </div>
                <div style="clear: both;">
                </div>
                <div class="wide">
                    <%--主要内容--%>
                    <%-- title--%>
                    <asp:UpdatePanel ID="UpdatePanel2" ChildrenAsTriggers="false" UpdateMode="Conditional"
                        runat="server">
                        <Triggers>
                            <asp:AsyncPostBackTrigger ControlID="ddlClasses" EventName="SelectedIndexChanged" />
                        </Triggers>
                        <ContentTemplate>
                            <div style="clear: both;">
                                <div id="title" class="bg" style="height: 80px; width: 905px; margin-left: 0px; overflow: hidden">
                                    <%-- <div style="width: 182px; height: 60px; float: right; margin-right: 30px;">


                                    <asp:Panel ID="Panel1" runat="server" Height="50px" Width="200px">
                                        统计范围：
                                        <asp:DropDownList ID="ddlClasses" runat="server" OnSelectedIndexChanged="ddlClasses_SelectedIndexChanged"
                                            AutoPostBack="True">
                                        </asp:DropDownList>
                                    </asp:Panel>


                                </div>
                                <div style="width: 590px; float: right; height: 60px; text-align: center;">

                                    <span style="font-size: larger; font-weight: bolder; padding-left: 120px;">
                                        <asp:Label ID="lblExamName" runat="server"></asp:Label></span><span style="font-size: smaller;
                                            font-weight: lighter;">(成绩统计)</span>

                                </div>--%>

                                    <div style="font-size: larger; font-weight: bolder; text-align: center; padding: 20px 0 10px">
                                        <asp:Literal ID="lblExamName" runat="server"></asp:Literal>
                                    </div>
                                    <div id="mytab" style="float: left; width: auto">
                                        <%--<a href="javascript:;">基本信息</a>
                                        <a href="javascript:;">考试人数情况</a>
                                        <a href="javascript:;">成绩质量分析</a>
                                        <a href="javascript:;">成绩分布与方差统计</a>
                                        <a href="javascript:;">及格率统计</a>--%>
                                    </div>
                                    <asp:Panel ID="Panel1" runat="server" Style="float: right; width: auto; padding-right: 20px">
                                        统计范围：
                                        <asp:DropDownList ID="ddlSchools" runat="server" Visible="false" OnSelectedIndexChanged="ddlClasses_SelectedIndexChanged" AutoPostBack="True">
                                        </asp:DropDownList>
                                        <asp:DropDownList ID="ddlClasses" runat="server" OnSelectedIndexChanged="ddlClasses_SelectedIndexChanged"
                                            AutoPostBack="True">
                                        </asp:DropDownList>
                                    </asp:Panel>
                                </div>
                                <div class="statistics_filed">
                                    <fieldset>
                                        <legend>基本信息</legend>
                                        <%--考试固有信息--%>
                                        <%--三行五列--%>
                                        <table class="statistics_cell">
                                            <tr>
                                                <td class="key">试卷总分：
                                                </td>
                                                <td class="value">
                                                    <asp:Label ID="lbl_ExamScore" runat="server"></asp:Label>
                                                </td>
                                                <td style="width: 120px;"></td>
                                                <td class="key">考试时长：
                                                </td>
                                                <td class="value">
                                                    <asp:Label ID="lbl_ExamDuration" runat="server"></asp:Label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="key">平均成绩：
                                                </td>
                                                <td class="value">
                                                    <asp:Label ID="lbl_average" runat="server"></asp:Label>
                                                </td>
                                                <td style="width: 120px;"></td>
                                                <td class="key">成绩方差：
                                                </td>
                                                <td class="value">
                                                    <asp:Label ID="lbl_variance" runat="server"></asp:Label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="key">最高得分：
                                                </td>
                                                <td class="value">
                                                    <asp:Label ID="lbl_MaxScore" runat="server"></asp:Label>
                                                </td>
                                                <td style="width: 120px;"></td>
                                                <td class="key">最低得分：
                                                </td>
                                                <td class="value">
                                                    <asp:Label ID="lbl_MinScore" runat="server"></asp:Label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="key">考试时间：
                                                </td>
                                                <td class="value">
                                                    <asp:Label ID="lbl_ExamTime" runat="server"></asp:Label>
                                                </td>
                                                <td style="width: 120px;"></td>
                                                <td class="key">试卷类型：
                                                </td>
                                                <td class="value">
                                                    <asp:Label ID="lbl_PaperType" runat="server" ClientIDMode="Static"></asp:Label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="key">考试方案：
                                                </td>
                                                <td class="value">
                                                    <asp:Label ID="lbl_ExamSolution" runat="server"></asp:Label>
                                                </td>
                                                <td style="width: 120px;"></td>
                                                <td class="key">其他信息：
                                                </td>
                                                <td class="value">
                                                    <a href="javascript:;" onclick="showErrorList()">试题分析</a>&nbsp;&nbsp;&nbsp;
                                                    <a id="export" target="_blank">导出试卷质量分析</a>
                                                </td>
                                               
                                            </tr>
                                          
                                        </table>
                                    </fieldset>
                                </div>
                                <div class="statistics_filed">
                                    <fieldset>
                                        <legend>考试人数情况</legend>
                                        <table class="statistics_cell">
                                            <tr>
                                                <td class="key">应到人数：
                                                </td>
                                                <td class="value">
                                                    <asp:Label ID="lbl_ShouldArriveCount" runat="server"></asp:Label>
                                                </td>
                                                <td style="width: 120px;"></td>
                                                <td class="key">实考人数：
                                                </td>
                                                <td class="value">
                                                    <asp:Label ID="lbl_ActualArriveCount" runat="server"></asp:Label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="key">缺考比例：
                                                </td>
                                                <td class="value">
                                                    <asp:Label ID="lbl_AbsentRate" runat="server"></asp:Label>
                                                </td>
                                                <td style="width: 120px;"></td>
                                                <td class="key">提前交卷：
                                                </td>
                                                <td>
                                                    <asp:Label ID="lbl_HandCount" runat="server"></asp:Label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="key">缺考名单：
                                                </td>
                                                <td class="value">
                                                    <a href="#" onclick='return AbsentNames(),false;'>
                                                        <%-- <a href="#" onclick='return AbsentNames($("#SelectedClassId_HiddenField").attr("value")),false;'>
                                            <asp:HiddenField ID="SelectedClassId_HiddenField" runat="server" />--%>
                                                    点击查看
                                                    </a>
                                                    <%--<asp:Label ID="lbl_AbsentNames" runat="server"></asp:Label>
                                                <asp:Literal ID="ltr_AbsentNames" Visible="false" runat="server">(无)</asp:Literal>--%>
                                                </td>
                                                <td style="width: 120px;"></td>
                                                <td class="key">强制交卷：
                                                </td>
                                                <td>
                                                    <asp:Label ID="lbl_AutoHandCount" runat="server"></asp:Label>
                                                </td>
                                            </tr>
                                        </table>
                                    </fieldset>
                                </div>
                                <div class="statistics_filed">
                                    <fieldset style="padding: 9px;">
                                        <legend>成绩质量分析</legend>
                                        <center>
                                        <asp:ListView ID="ListView1" ItemPlaceholderID="PlaceHolder1" OnLayoutCreated="ListView1_LayoutCreated"
                                            runat="server">
                                            <LayoutTemplate>
                                                <%--表头空间占位--%>
                                                <%--  右下角的7列class分别命名为lb1~lb7--%>
                                              <%--  <asp:PlaceHolder ID="tablePlaceHolder" runat="server"></asp:PlaceHolder>--%>
                                                <table class="gridview">
                                                    <thead>
                                                         <tr class="gridview_head center" style="text-align: center;">
                                                    <th style="text-align: center;" rowspan="3">
                                                        知识点名称
                                                    </th>
                                                    <th style="text-align: center;" rowspan="3">
                                                        知识点总分
                                                    </th>
                                                 
                                                    <th style="text-align: center;" colspan="11">
                                                        得分率
                                                    </th>
                                                </tr>
                                                <tr class="gridview_head center" style="text-align: center; background-color: #f1f1f1;">
                                                    <th style="text-align: center;" rowspan="2">
                                                        知识点得分率
                                                    </th>
                                                    <th style="text-align: center;" colspan="3">
                                                        难度
                                                    </th>
                                                    <th style="text-align: center;" colspan="7">
                                                        题型
                                                    </th>
                                                </tr>
                                                <tr class="gridview_head center" style="text-align: center;">
                                                    <th style="text-align: center;">
                                                        难
                                                    </th>
                                                    <th style="text-align: center;">
                                                        中等
                                                    </th>
                                                    <th style="text-align: center;">
                                                        容易
                                                    </th>
                                                    <th style="text-align: center;">
                                                        单选
                                                    </th>
                                                    <th style="text-align: center;">
                                                        多选
                                                    </th>
                                                    <th style="text-align: center;">
                                                        判断
                                                    </th>
                                                    <th style="text-align: center;">
                                                        填空
                                                    </th>
                                                    <th style="text-align: center;">
                                                        简答
                                                    </th>
                                                    <th style="text-align: center;">
                                                        操作
                                                    </th>
                                                    <th style="text-align: center;">
                                                        打字题
                                                    </th>
                                                </tr>
                                                        <tr>
                                                            <th>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody style=" text-align:center;">
                                                        <%--表体空间占位--%>
                                                        <%-- 左边7列分别命名为c1~c7,其他列为动态生成--%>
                                                        <asp:PlaceHolder ID="PlaceHolder1" runat="server"></asp:PlaceHolder>
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <td colspan="13" style="text-align: left; font-size: 11px;">
                                                                <br />
                                                                注：“难度”列中的“-”表示该知识点无此难度的题目； “题型”列中的“-”表示该知识点无此题型的题目。
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </LayoutTemplate>
                                            <ItemTemplate>
                                                <tr style=" text-align:center;">
                                                    <td class="c1">
                                                        <%#Eval("KPName")%>
                                                    </td>
                                                    <td class="c2">
                                                        <%#Eval("ScoreOfKP")%>
                                                    </td>
                                                    <td class="c4">
                                                        <%#Eval("RateOfKP")%>
                                                    </td>
                                                    <td class="c5">
                                                        <%#GetValue(Eval("RateOfHard"))%>
                                                    </td>
                                                    <td class="c6">
                                                        <%#GetValue(Eval("RateOfGenerate"))%>
                                                    </td>
                                                    <td class="c7">
                                                        <%#GetValue(Eval("RateOfEasy"))%>
                                                    </td>

                                                    <td  >
                                                        <%#GetValue(Eval("KpRadioScoringAvg"))%>
                                                    </td>
                                                     <td  >
                                                        <%#GetValue(Eval("KpMrqScoringAvg"))%>
                                                    </td>
                                                     <td  >
                                                        <%#GetValue(Eval("KpJudgeScoringAvg"))%>
                                                    </td>

                                                      <td  >
                                                        <%#GetValue(Eval("KpCompletionScoringAvg"))%>
                                                    </td>
                                                     <td  >
                                                        <%#GetValue(Eval("KpResumeScoringAvg"))%>
                                                    </td>
                                                     <td  >
                                                        <%#GetValue(Eval("KpOperateScoringAvg"))%>
                                                    </td>

                                                     <td  >
                                                        <%#GetValue(Eval("KpTypeScoring"))%>
                                                    </td>
                                                </tr>
                                            </ItemTemplate>
                                           <%-- <EmptyItemTemplate></EmptyItemTemplate>--%>
                                            <EmptyDataTemplate>自由练习模式或随机卷不支持该统计</EmptyDataTemplate>
                                        </asp:ListView>
                                    </center>
                                    </fieldset>
                                </div>
                                <div class="statistics_filed">
                                    <fieldset>
                                        <legend>成绩分布与方差统计</legend>
                                        <div>
                                            <div style="width: 800px; height: 480px;">
                                                <asp:Image ID="ImgBrokenLine" Width="800" Height="480" runat="server" />
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                                <div class="statistics_filed">
                                    <fieldset>
                                        <legend>及格率统计</legend>
                                        <div>
                                            <div style="float: left; width: 260px;">
                                                <ul style="margin-left: 30px;">
                                                    <li>
                                                        <asp:Label ID="lbl_Excellent" runat="server"></asp:Label></li>
                                                    <li>
                                                        <asp:Label ID="lbl_Well" runat="server"></asp:Label></li>
                                                    <li>
                                                        <asp:Label ID="lbl_General" runat="server"></asp:Label></li>
                                                    <li>
                                                        <asp:Label ID="lbl_Fail" runat="server"></asp:Label></li>
                                                </ul>
                                            </div>
                                            <div style="float: right; width: 500px;">
                                                <asp:Image ID="imgPie" Width="495" Height="280" runat="server" />
                                            </div>
                                            <div style="width: 100%; height: 2px;"></div>
                                            <div style="clear: right; float: left; width: 800px;">
                                                <asp:Image ID="imgBar" Width="800" Height="480" runat="server" />
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                                <div style="width: 500px; height: 90px;"></div>
                            </div>
                        </ContentTemplate>
                    </asp:UpdatePanel>
                </div>
            </div>
        </div>
        <p class="body">
        </p>
        <div style="display: none;">
            <div id="errorDetails" style="">

                <asp:ListView ID="ErrorDetailList" OnItemDataBound="ErrorDetailList_ItemDataBound"
                    DataKeyNames="ProbID" ItemPlaceholderID="Panel2" runat="server">
                    <LayoutTemplate>
                        <div style="position: absolute; height: 39px; background-color: White; width: 904px; z-index: 200;">
                            <input id="Button1" type="button" onclick="zujuan(getCheckValue());" style="width: 80px; height: 29px; margin: 5px;" value="错题组卷" />
                            <input id="Button2" type="button" onclick="shoucang(getCheckValue());" style="width: 120px; height: 29px; margin: 5px;" value="加入我的错题库" />
                        </div>
                        <table cellspacing="0" class="list" style="position: absolute; top: 63px; z-index: 199; width: 904px;">
                            <thead style="text-align: center;">
                                <tr>
                                    <th style="width: 60px;">
                                        <input id="Checkbox1" type="checkbox" onchange="checkAll();" />编号
                                    </th>
                                    <th style="width: 400px;">试题题面
                                    </th>
                                    <th style="width: 125px;">知识点
                                    </th>
                                    <th style="width: 50px;">错误数
                                    </th>
                                    <th style="width: 70px;">本次难度
                                    </th>
                                    <th style="width: 70px;">累计难度
                                    </th>
                                    <th style="width: 70px;">原始难度
                                    </th>
                                    <th style="width: 80px;">操作
                                    </th>
                                </tr>
                            </thead>
                        </table>
                        <table style="position: relative; border-color: Silver; top: 75px;">
                            <tbody>
                                <asp:Panel ID="Panel2" runat="server">
                                </asp:Panel>
                            </tbody>
                        </table>
                    </LayoutTemplate>
                    <ItemTemplate>
                        <tr>
                            <td style="width: 60px; text-align: center;">
                                <input id="Checkbox1" class="chkItem" value='<%#Eval("ProbID") %>' type="checkbox" />
                                <asp:CheckBox ID="chkItem" Visible="false" CssClass="chkItem" runat="server" />
                                <asp:Literal ID="ltr_id" Visible="false" runat="server"></asp:Literal>
                            </td>
                            <td style="width: 400px;">
                                <asp:Literal ID="ltr_content" runat="server"></asp:Literal>
                            </td>
                            <td style="width: 125px;">
                                <asp:Literal ID="ltr_kpname" runat="server"></asp:Literal>
                            </td>
                            <td style="width: 50px; text-align: center;">
                                <asp:Literal ID="ltr_errorcount" runat="server"></asp:Literal>
                            </td>
                            <td style="width: 70px; text-align: center;">
                                <asp:Literal ID="ltr_errorrate" runat="server"></asp:Literal>
                            </td>
                                                        <td style="width: 70px; text-align: center;">
                                <asp:Literal ID="ltr_totalDifficulty" runat="server"></asp:Literal>
                            </td>                            <td style="width: 70px; text-align: center;">
                                <asp:Literal ID="ltr_expectedDifficulty" runat="server"></asp:Literal>
                            </td>
                            <td style="width: 80px; text-align: center;">
                                <a href="javascript:;" onclick='zujuan(&quot;<%#Eval("ProbID") %>&quot;);'>组卷</a> <a href="javascript:;" onclick='shoucang(&quot;<%#Eval("ProbID") %>&quot;);'>收藏</a>
                            </td>
                        </tr>
                    </ItemTemplate>
                </asp:ListView>
            </div>
        </div>
    </form>
</body>
</html>
