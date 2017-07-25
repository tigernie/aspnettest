<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="JudgeExam.aspx.cs" Inherits="Web.JudgeExam" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>阅卷</title>
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
    <script src="scripts/Drag/gzy.drag.js"></script>
    <style type="text/css">
        /*.ddl
        {
            margin-left: 12px;
        }*/

    </style>
    <script type="text/javascript">
        var SelectTeacherPopup; //从儿子中产生的父亲的儿子
        var JudgeSetPopup; //儿子


        function TeacherList(Judgemode, Examid) {
     
            //1 表示专业 ，2表示普通
            //普通时高端减半
            SelectTeacherPopup = new gzy.popup("选择阅卷老师：", 540, Judgemode == 2 ? 300 : 460, {
                url: "JudgerTeacherList.aspx?examid=" + Examid + "&judgemode=" + Judgemode,
                onclose: function () {//关闭时需要做的事情：找到第一个儿子中的指定元素，并调用其click事件
                    JudgeSetPopup.body.find("#btnAllocate").click();
                }
            });
        }





        function JudgeSet(examid) {
            JudgeSetPopup = new gzy.popup('阅卷设置', 600, 430, {
                url: 'judgeset.aspx?id=' + examid,

                onclose: function () {
                    $("#RefreshButton").click()
                }

            });
        }

        //查看普通阅卷老师的任务分配
        function retrieveAllocate(examid) {

            new gzy.popup("普通组阅卷任务分配", 330, 200, { url: "JudgerTaskSize.aspx?examid=" + examid })
        }









        var judgeProgressPopup;

        var tmpData = "";

        //显示阅卷进度
        function judgeProgress(examid) {
            var loading = showLoding('正在获取数据，请稍候');
            $("#proJudgeMode").css("display", "none")
            $("#geshu").css("display", "none")
            $("#norJudgeMode").css("display", "none")
            $("#fenshu").css("display", "none")


            //获得阅卷模式  和 4 个值（自动总数，自动完成数，人工总数，人工完成数）
            //从而计算出所有总数，所有完成数
            //进而计算出自动、人工以及所有的比例

            //1：专业模式；2：普通模式；0：默认值
            var judgeMode = 0//读取到的值
            var examname = ""

            var auto_total = 0;
            var auto_done=0;
              var manual_total=0 ;
              var manual_done = 0; //四个读取到的值

              var all_total = 0;
              var all_done = 0; //计算得到

              var auto_percent = 0.0;var manual_percent = 0.0;var  all_percent = 0.0//计算得到

            //读取阅卷模式
            judgeMode = 1;
            //读取考试名称
            examname = "默认考试名称";
            //读取前面的4个值
            auto_total = 120;
            auto_done = 62;
            manual_total = 80;
            manual_done = 16;

            //调用处理程序
            $.ajax(
            {
                type: "post",
                url: "JudgeProgressHandler2.ashx",
                data: { "examidKey": examid },
                timeout: 30000,
                dataType: "json",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("失败:" + "\n错误状态文本描述：" + textStatus
                    + "\n详细错误：" + errorThrown +
                    "\n服务器返回状态码：" + XMLHttpRequest.status +
                    "\n异步状态码：" + XMLHttpRequest.readyState);
                },
                success: function (result) {
                    loading.close();
                    success(result);
                }

            }
          );
            //            $.post("JudgeProgress.ashx", { "examidKey": examid }, function (data) { success(data) }, "json");

            //            $.post("JudgeProgress.ashx", { "examidKey": examid }, function (data) { alert(1) }, "json");
        }



        function success(data) {

            var auto_total = 0;var auto_done = 0;var manual_total = 0;var manual_done = 0; //四个读取到的值

            var all_total = 0;var all_done = 0; //计算得到

            var auto_percent = 0;var manual_percent = 0;var  all_percent = 0.0//计算得到

            if (data.status != "fail") {
                var judgeMode = data.examjudgemode;
                var examname = data.examname;
                var auto_total = data.auto_total;
                var auto_done = data.auto_done;
                var manual_total = data.manual_total;
                var manual_done = data.manual_done;

                //计算后面的5个值
                all_total = eval(auto_total) + eval(manual_total);
                all_done = eval(auto_done) + eval(manual_done);

                if (auto_total != 0) {
                    auto_percent = auto_done / auto_total;
                }


                if (manual_total != 0) {

                    manual_percent = manual_done / manual_total;
                }

                if (all_total != 0) {
                    all_percent = all_done / all_total;
                }


                //给ui元素赋值

                $("#auto_total").html(auto_total);
                $("#auto_done").html(auto_done);
                $("#manual_total").html(manual_total);
                $("#manual_done").html(manual_done);

                $("#all_total").html(all_total);
                $("#all_done").html(all_done);

                if (auto_total != 0) {
                    $("#auto_percent").html((auto_percent * 100).toFixed(2) + "%");
                }
                else {
                    $("#auto_percent").html("100%");
                }

                if (manual_total != 0) {
                    $("#manual_percent").html((manual_percent * 100).toFixed(2) + "%");
                }
                else {
                    $("#manual_percent").html("100%");
                }
                if (all_total != 0) {
                    $("#all_percent").html((all_percent * 100).toFixed(2) + "%");
                }
                else {
                    $("#all_percent").html("100%");
                }

                if (judgeMode == 1) {//专业模式
                    $("#proJudgeMode").css("display", "")
                    $("#geshu").css("display", "")

                    $("#norJudgeMode").css("display", "none")
                    $("#fenshu").css("display", "none")
                }
                else if (judgeMode == 2) {//普通模式
                    $("#proJudgeMode").css("display", "none")
                    $("#geshu").css("display", "none")

                    $("#norJudgeMode").css("display", "")
                    $("#fenshu").css("display", "")
                }


                $("#examname").html(examname);

                judgeProgressPopup = new gzy.popup("阅卷进度", 500, 250, { element: $("#judgeProgress") });


            }
            else {//失败

            }

        }




        function popupProgress() {
            new gzy.popup(null, 200, 25, { element: $("#progress") });
        }



    </script>
<style type="text/css">
    .examitem { border:1px solid #d6d6d6; padding: 10px; }
    .examitem h4 { height: 32px; line-height:32px; background: url(images/exam-icon.gif) no-repeat; padding: 0 12px 10px 32px; margin-bottom: 10px; border-bottom: 1px dashed #d6d6d6; }
    .examitem h4 label { float:right; line-height: 12px; font-weight: normal; padding:8px; }
    .examitem.opened h4 label { border:1px solid #c4e7b2; }
    .examitem.opened h4 label span { color:#2f9000; }
    .examitem.closed h4 label { border:1px solid #f6deaa; }
    .examitem.closed h4 label span { color:#db5e36; }
    .examitem button { border: 1px solid #89aacb; background: #e9f0f3; padding: 2px 6px; margin-top: 10px; white-space: nowrap; cursor: pointer; color:#015bc0; }
    .examitem button.closed { border-color: #f6bf60; background: #ffeec4; color: #b95300; }
</style>
</head>
<body>
    <form id="form1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>
    <div class="body">
        <%--头部--%>
        <div class="head problib" style="background: url(../images/teacher.result.jpg); ">
            <p>
                <a href="javascript:;" class="user">管理员</a> <a href="../teacher.htm" class="home">返回首页</a>
                <a href="javascript:;" class="setting">系统管理</a> <a href="javascript:;" class="exit">
                    注销</a>
            </p>
        </div>
        <ul class="mtabs">
            <li class="current"><a href="JudgeExam.aspx" id="ExamsList">阅卷</a></li>
         
            <li id="ScoreQry_Panel" runat="server"><a href="ScoreQry.aspx" id="A1">成绩</a></li> 
        </ul>
        <div class="wide">
            <%--过滤--%>
            <div id="searchArea" class="search">
                <asp:DropDownList ID="SortOrderSelect" runat="server" AutoPostBack="True" OnSelectedIndexChanged="SortOrderSelect_SelectedIndexChanged">
                    <asp:ListItem Value="OrderByStartTimeAsc">按开考时间升序</asp:ListItem>
                    <asp:ListItem Value="OrderByStartTimeDesc" Selected="True">按开考时间降序</asp:ListItem>
                </asp:DropDownList>
                <asp:DropDownList ID="JudgeStateSelect" CssClass="ddl" runat="server" AutoPostBack="True" OnSelectedIndexChanged="JudgeStateSelect_SelectedIndexChanged">
                    <asp:ListItem Value="">所有阅卷状态</asp:ListItem>
                    <asp:ListItem Value="PreOpen">阅卷未开始</asp:ListItem>
                    <asp:ListItem Value="Opened">阅卷已开启</asp:ListItem>
                    <asp:ListItem Value="Closed">阅卷已关闭</asp:ListItem>
                </asp:DropDownList>
           
                <asp:TextBox CssClass="ddl" ID="SearchKeywords" runat="server" MaxLength="20" ClientIDMode="Static"></asp:TextBox>
                <button ID="Search" runat="server" onserverclick="Search_Click"></button>
            
            </div>
        </div>


        <%-- GridView列表--%>
        <asp:UpdatePanel ID="UpdatePanel1" UpdateMode="Conditional" ClientIDMode="Static"
            runat="server">
            <Triggers>
                <asp:AsyncPostBackTrigger ControlID="JudgeStateSelect" EventName="SelectedIndexChanged" />
                <asp:AsyncPostBackTrigger ControlID="SortOrderSelect" EventName="SelectedIndexChanged" />
                <asp:AsyncPostBackTrigger ControlID="Search" EventName="ServerClick" />
            </Triggers>
            <ContentTemplate>
                <asp:Panel ID="ExamsList_ContentPanel" runat="server" Visible="false" ClientIDMode="Static">
                    <div class="wide">

                        <!-- repeater start -->
<%--                        <div runat="server" class="examitem opened"> <!-- 根据考试的状态，给循环体附加“opened”或“closed”样式 -->
                            <h4><label>阅卷状态：<asp:label runat="server" text="全操作题" /></label><asp:literal runat="server" text="全操作题" /></h4>
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td width="20%">考试模式：<asp:label runat="server" text="自由练习" /></td>
                                    <td width="20%">开始时间：<asp:label runat="server" text="09月18日 09时38分" /></td>
                                    <td width="20%">结束时间：<asp:label runat="server" text="10月31日 10时18分" /></td>
                                    <td width="20%">试卷类型：<asp:label runat="server" text="随机卷" /></td>
                                </tr>
                                <tr>
                                    <td>试题总数：<asp:label runat="server" text="17" /></td>
                                    <td>已阅题数：<asp:label runat="server" text="12" /></td>
                                    <td>阅卷模式：<asp:label runat="server" text="常规阅卷" /></td>
                                    <td><a href="javascript:;">点击查看评阅进度</a></td>
                                </tr>
                                <td colspan="4" align="right">
                                    <button>设置</button>
                                    <button>阅卷</button>
                                    <button class="closed">结束</button>
                                    <button>查看成绩</button>
                                </td>
                            </table>
                        </div>--%>
                        <!-- repeater end -->

                        <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False" CssClass="list"
                            GridLines="None" EmptyDataText="-" OnRowDataBound="GridView1_RowDataBound" DataKeyNames="Id"
                            OnRowCommand="GridView1_RowCommand" OnDataBound="GridView1_DataBound">
                            <Columns>
                                <asp:BoundField DataField="id" ItemStyle-Width="60" HeaderStyle-HorizontalAlign="Center"
                                    ItemStyle-HorizontalAlign="Center" HeaderText="编号" />
                                <asp:BoundField DataField="ExamName" ItemStyle-Width="170" HeaderStyle-HorizontalAlign="Center"
                                    HeaderText="考试名称" />
                                <asp:BoundField DataField="ExamMode" ItemStyle-Width="90" HeaderStyle-HorizontalAlign="Center"
                                    ItemStyle-HorizontalAlign="Center" HeaderText="考试模式" />
                                 <asp:BoundField DataField="JudgeMode" ItemStyle-Width="90" HeaderStyle-HorizontalAlign="Center"
                                    ItemStyle-HorizontalAlign="Center" HeaderText="阅卷模式" />
                                <asp:BoundField DataField="DetailNeedJudgeCount" ItemStyle-Width="115" HeaderStyle-HorizontalAlign="Center"
                                    ItemStyle-HorizontalAlign="Center" HeaderText="总题数" />
                                <asp:BoundField DataField="DetailJudgedCount" ItemStyle-Width="95" HeaderStyle-HorizontalAlign="Center"
                                    ItemStyle-HorizontalAlign="Center" HeaderText="已阅题数" />
                                <asp:BoundField DataField="JudgeState" ItemStyle-Width="69" HeaderStyle-HorizontalAlign="Center"
                                    ItemStyle-HorizontalAlign="Center" HeaderText="阅卷状态" />
<%--
                                       <asp:BoundField DataField="AnsweredSheetWhichHasAnsweredSubjectDetailCount" ItemStyle-Width="95" HeaderStyle-HorizontalAlign="Center"
                                    ItemStyle-HorizontalAlign="Center" NullDisplayText="-" HeaderText="总答题（专）" />
                                <asp:BoundField DataField="JudgedSheetCount" ItemStyle-Width="78" HeaderStyle-HorizontalAlign="Center"
                                    ItemStyle-HorizontalAlign="Center" NullDisplayText="-" HeaderText="已阅（专）" />--%>
                                   
                                <asp:TemplateField HeaderText="操作">
                                    <HeaderStyle HorizontalAlign="Center" />
                                    <ItemTemplate>
                                        <span style="width: 80px; height: 10px;"></span>
                                        <asp:Panel ID="Panel1" runat="server">


                                            <asp:LinkButton ID="SetBtn" OnClientClick='<%#Eval("ID","return JudgeSet({0}),false") %>'
                                                runat="server" Text="<font style=' margin-left:20px;'>设置</font>" />

                                                <a href="#" onclick='<%#Eval("ID","judgeProgress({0})") %>'><font style=' padding-left:10px;'>进度</font></a>
                     
                                            <asp:LinkButton ID="StartBtn" Visible="false" CommandName="start" CommandArgument='<%#Eval("id") %>'
                                                runat="server" OnClientClick="popupProgress()" Text="<font style=' padding-left:10px;'>阅卷</font>" />

                                               <%--  OnClientClick="return showConfirm($(this)),false"--%>
                                            <asp:LinkButton ID="StopBtn" Visible="false" OnClientClick='return confirmEndJudge($(this))'
                                                CssClass='<%#Eval("id","examid{0}") %>' CommandName="stop" CommandArgument='<%#Eval("id") %>'
                                                runat="server" Text="<font style=' padding-left:10px;'>结束</font>" />
                                           
                                           
                                            <asp:Literal ID="tips" Visible="false" runat="server" Text="<font style=' margin-left:20px;'>（已经关闭）</font>"></asp:Literal>
                                        </asp:Panel>
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
    <div style="display: none;">
        <div id="progress">
            <center>
                <img alt="请稍后" src="/images/startJudge.gif" />请稍后...</center>
        </div>
    </div>

    <%--阅卷进度--%>
    <div style="display: none;">
        <div id="judgeProgress" style=" width:500px;">
      <br />
        <center>
        <span style=" width:500px; text-align:center; font-size:larger; font-style:normal; font-variant:normal; "  id="examname"> </span><br />
        </center><br />
            模式：<span id="proJudgeMode" style="display: none;">专业阅卷</span><span id="norJudgeMode"
                style="display: none;">普通阅卷</span><span style=" width:290px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            单位：<span id="geshu" style="display: none;">题目个数</span><span id="fenshu" style="display: none;">试卷份数</span><br />
          
            <table border="0" style=" width:100%; text-align:center;  border:0; ">
                <thead style=" border:0;">
                    <tr style=" background:#e1f5f8">
                        <th>
                            分类
                        </th>
                        <th>
                            总数
                        </th>
                        <th>
                            完成数
                        </th>
                        <th>
                            完成比例
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr style=" background:#f2f2f2">
                        <td>
                            自动批阅部分
                        </td>
                        <td><span id="auto_total"></span>
                        </td>
                        <td><span id="auto_done"></span>
                        </td>
                        <td><span id="auto_percent"></span>
                        </td>
                    </tr>
                    <tr style=" background:#bfbfbf">
                        <td>
                            人工批阅部分
                        </td>
                        <td><span id="manual_total"></span>
                        </td>
                        <td><span id="manual_done"></span>
                        </td>
                        <td><span id="manual_percent"></span>
                        </td>
                    </tr>
                    <tr style=" background:#f2f2f2">
                        <td>
                            全部
                        </td>
                        <td><span id="all_total"></span>
                        </td>
                        <td><span id="all_done"></span>
                        </td>
                        <td><span id="all_percent"></span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>


    </form>
</body>
</html>
