<%@ Page Language="C#" AutoEventWireup="true"   CodeBehind="ManucalJudgeProgress.aspx.cs" Inherits="Web.ManucalJudgeProgress" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>手动批阅进度</title>
    <script src="scripts/jquery-1.7.min.js" type="text/javascript"></script>
    <script src="scripts/PopWindow/gzy.popup.js" type="text/javascript"></script>
    <script src="scripts/common.js" type="text/javascript"></script>
    <script src="scripts/Drag/gzy.drag.js" type="text/javascript"></script>
    <script src="scripts/ManualJudgeProgressHandler.js" type="text/javascript"></script>
    <link href="styles/style.css" rel="stylesheet" type="text/css" />
    <link href="styles/style_webForms.css" rel="stylesheet" type="text/css" />
    <style type="text/css">
        table.list thead tr th,table.list tbody td{ text-align:center;}
        table.list{  width:980px;   border-spacing:0;}
        ul.mtabs{ margin: 0 auto; width:996px;}
        .b{ background-image:url(images/teacher.kaowu.jpg); background-position:350px 1px; color:White;}
       .underline{ border-bottom:1px solid #616161; padding-bottom:-1px;}
       
       .changeTaskSizeInput{ text-align:center;}
       .judgerTd{ width:180px;}
    </style>

</head>
<body class="body">
    <form id="form1" runat="server">
    <asp:Timer ID="TimerASYNC" Interval="30000"   Enabled="true" runat="server">
    </asp:Timer>
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>
    <asp:UpdatePanel ID="UpdatePanel1" UpdateMode="Always" ChildrenAsTriggers="true" OnPreRender="UpdatePanel_PreRender"
        ViewStateMode="Enabled" runat="server">
        <Triggers>
            <asp:PostBackTrigger ControlID="TimerASYNC" />
        </Triggers>
        <ContentTemplate>
            <div class="body">
                <div class="head problib" style="background: url(images/head.jpg); height: 100px;
                    margin-top: 0px;">
                    <center style="height: 80px; padding-top: 20px; color: #004b4f;">
                        <span style="height: 50px; font-size: 30px; color: #004b4f; display: block;">
                            <asp:Literal ID="LiteralExamName" runat="server"></asp:Literal></span> <span style="font-size: 16px;
                                margin-top: 10px;">
                                <asp:Literal ID="Literal2" runat="server">手动批阅进度</asp:Literal></span>
                    </center>
                </div>
                <ul class="mtabs">
                </ul>
                <div class="wide" style="margin-top: 15px;">
                    <table style="width: 100%; margin: 10px;">
                        <tr>
                            <td>
                                总任务：<span class="underline"><asp:Literal ID="LiteralTotal" runat="server"></asp:Literal></span>&nbsp;个
                            </td>
                            <td>
                                正在进行：<span class="underline"><asp:Literal ID="LiteralJudging" runat="server"></asp:Literal></span>&nbsp;个
                            </td>
                            <td>
                                已完成：<span class="underline"><asp:Literal ID="LiteralJudged" runat="server"></asp:Literal></span>&nbsp;个
                            </td>
                            <td>
                                完成比例：<span class="underline"><asp:Literal ID="LiteralPercent" runat="server"></asp:Literal></span>&nbsp;%
                            </td>
                            <td>
                                <span style="width: 230px; border: 1px solid #d4d4d4; font-weight: bolder; padding: 3px 6px;
                                    background-color: #f1f1f1;">待分配任务： <span style="text-align: center;"><span style="text-align: center;
                                        margin: 0 auto;"><span class="underline"><span id="UnAllocated">
                                            <asp:Literal ID="LiteralUnAllocated" runat="server"></asp:Literal></span></span>&nbsp;个</span>
                                    </span></span>
                            </td>
                            <td style=" display:none;">
                                <input id="Checkbox1" type="checkbox" />每隔<select id="Select1">
                                    <option>5秒</option>
                                    <option>10秒</option>
                                    <option>20秒</option>
                                    <option>60秒</option>
                                </select>刷新
                            </td>
                            <td>
                                <a href="#" onclick='GetAddibleTeacher($("#HiddenField_ExamID").val())'>添加普通阅卷老师</a>
                            </td>
                        </tr>
                    </table>
                    <script type="text/javascript">
                        var num = 0;
                    </script>
                    <asp:ListView ID="ListView1" OnItemDataBound="ListView1_ItemDataBound" runat="server">
                        <LayoutTemplate>
                            <table class="list" style="height: 100%;">
                                <thead>
                                    <tr style="height: 25px;">
                                        <th style="width: 60px;">
                                            序号
                                        </th>
                                        <th style="width: 180px;">
                                            用户名（姓名）
                                        </th>
                                        <th style="width: 160px;">
                                            状态
                                        </th>
                                        <th style="width: 200px;">
                                            完成任务/分配的任务（个）
                                        </th>
                                        <th style="width: 100px;">
                                            完成比例
                                        </th>
                                        <th>
                                            调整任务
                                        </th>
                                    </tr>
                                </thead>
                                <tbody style="text-align: center; width: 800px; height: 100%;">
                                    <asp:PlaceHolder ID="itemPlaceholder" runat="server"></asp:PlaceHolder>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="5">
                                            <div style="padding: 10px 20px; margin-left: 20px;">
                                                注意：<br />
                                                1、表格中的“-”，表示该用户为专家组老师或未分配，系统未给专家组老师预分配任务。<br />
                                                2、任务个数=题目道数x2。<br />
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </LayoutTemplate>
                        <ItemTemplate>
                            <tr>
                                <td>
                                    <script type="text/javascript">

                                        document.write(++num);
                                    </script>
                                </td>
                                <td id='name_<%#Eval("ID") %>'>
                                    <%#Eval("UserName")%>（<%#Eval("RealName")%>）
                                </td>
                                <td>
                                    <img src="images/online.png" alt="" style="display: none;" id='online_<%#Eval("ID") %>' />
                                    <img src="images/offline.png" alt="" style="display: none;" id='offline_<%#Eval("ID") %>' />
                                    <script type="text/javascript">
                                        var b = '<%#Eval("IsOnline")%>';
                                        if (b.toLowerCase() == 'true') {
                                            $('#online_<%#Eval("ID") %>').css("display", "");
                                        }
                                        else {

                                            $('#offline_<%#Eval("ID") %>').css("display", "");
                                        }
                                    </script>
                                    <asp:Literal ID="isOnline" runat="server"></asp:Literal>
                                </td>
                                <td>
                                    <span style="color: #0759d4;" id='done_<%#Eval("Id") %>'></span>/ <span id='allocated_<%#Eval("Id") %>'>
                                    </span>
                                    <script type="text/javascript">
                                        var DoneSize = '<%#Eval("DoneSize")%>';
                                        var AllocatedSize = '<%#Eval("AllocatedSize")%>';

                                        $('#done_<%#Eval("ID") %>').html(DoneSize);

                                        if (AllocatedSize > 0) {
                                            $('#allocated_<%#Eval("ID") %>').html(AllocatedSize);
                                        } else {
                                            document.write("-");
                                        }
                                    </script>
                                </td>
                                <td>
                                <span id='progress_<%#Eval("Id") %>'>
                                    <script type="text/javascript">
                                        if (AllocatedSize > 0) {
                                            document.write((DoneSize * 100 / AllocatedSize).toFixed(1) + "%");
                                        }
                                        else {
                                            document.write("-");
                                        }
                                    </script>
                                     </span>
                                </td>
                                <td>
                                    <span id='operation_<%#Eval("ID") %>' style="display: none;">
                                    <span id='IncreaseSpans_<%#Eval("ID") %>'><a href="#" id='Increase_<%#Eval("ID") %>'
                                        onclick='Increase($("#HiddenField_ExamID").val(),<%#Eval("Id") %>,$("#UnAllocated").html())'>
                                        增加任务</a></span>
                                        &nbsp;&nbsp; <span id='DecreaseSpan_<%#Eval("ID") %>'><a href="#" id='Decrease_<%#Eval("ID") %>' onclick='Decrease($("#HiddenField_ExamID").val(),<%#Eval("Id") %>,((parseInt(<%#Eval("AllocatedSize")%>)-parseInt(<%#Eval("DoneSize")%>))-4))'>
                                            减少任务</a> </span></span>
                                    <script type="text/javascript">

                                        if (!(parseInt($("#UnAllocated").html()) > 0)) {//待分配任务为0 则不允许增加任务
                                            $('#Increase_<%#Eval("ID") %>').css("display", "none");
                                        }

                                        if ((AllocatedSize - DoneSize) - 4 <= 0) {//该用户待完成任务 小于 4个 则不允许减少任务
                                            $('#Decrease_<%#Eval("ID") %>').css("display", "none");
                                        }

                                        if ('<%#Eval("JudgerType") %>' != "ExpertGroup")//是普通组
                                        {
                                            $('#operation_<%#Eval("ID") %>').css("display", "");
                                        }
                                    </script>
                                </td>
                            </tr>
                        </ItemTemplate>
                        <EmptyDataTemplate>
                            未查找到符合条件的数据
                        </EmptyDataTemplate>
                    </asp:ListView>
                    <asp:HiddenField ID="HiddenField_ExamID" runat="server" />
                </div>
            </div>
            <p class="body">
            </p>
            <div style="display: none;">
                <div id="addjudger">
                    <div style="width: 650px;">
                        <div style="margin-left: 40px; margin-top: 10px;">
                            可分配题目数： <span class="addjudger_unallocated underline"></span>， 最多可以选择 <span class="addjudger_unallocated underline">
                            </span>个人。<br />
                        </div>
                        <div style="width: 680px; margin: 10px 30px;">
                            <div style="height: 25px;">
                                <span id="addjudgerTips" style="width: 550px; height: 23px; line-height: 23px; color: #f00;">
                                    &nbsp;</span></div>
                            <table id="teacherlist">
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div style="display: none;">
                <div id="increase">
                    <div style="width: 380px; margin: 10px auto;">
                        最多可增加的任务数： <span id="increase_MaxSize" class="underline"></span>个<br />
                        为“<span id="increase_name"></span>”增加
                        <input id="increase_input" size="8" class="changeTaskSizeInput" onkeyup="checkInput(this,$('#increase_MaxSize').html(),$('#increase_tips'))"
                            type="text" />个任务<br />
                        <span id="increase_tips" style="color: Red;"></span>
                    </div>
                </div>
            </div>
            <div style="display: none;">
                <div id="decrease">
                    <div style="width: 320px; margin: 10px auto;">
                        最多可减少的任务数： <span id="decrease_MaxSize" class="underline"></span>个<br />
                        为“<span id="decrease_name"></span>”减少
                        <input id="decrease_input" size="8" class="changeTaskSizeInput" onkeyup="checkInput(this,$('#decrease_MaxSize').html(),$('#decrease_tips'))"
                            type="text" />个任务<br />
                        <span id="decrease_tips" style="color: Red;"></span>
                    </div>
                </div>
            </div>
        </ContentTemplate>
    </asp:UpdatePanel>
    </form>
</body>
</html>
