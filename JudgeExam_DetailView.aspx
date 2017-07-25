<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="JudgeExam_DetailView.aspx.cs" Inherits="Web.JudgeExam_DetailView" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>阅卷及成绩管理</title>
    <link href="styles/style.css" rel="stylesheet" type="text/css" />
    <link href="styles/style_webForms.css" rel="stylesheet" type="text/css" />
    <script src="scripts/jquery-1.7.min.js" type="text/javascript"></script>
    <script src="scripts/PopWindow/gzy.popup.js" type="text/javascript"></script>
    <script src="scripts/Drag/gzy.drag.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/My97DatePicker/WdatePicker.js"></script>
    <script type="text/javascript" src="scripts/common.js"></script>
    <script type="text/javascript" src="scripts/webForm_common.js"></script>
    <script type="text/javascript" src="scripts/Judge.js"></script>
    <script src="scripts/lib/judge.js"></script>
    <script src="scripts/judgeExam.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/webFormPager/gzyPager.js"></script>
    <script src="script.ashx?teacher,teacher.ui" type="text/javascript"></script>
    <script src="scripts/JudgeExam_DetailView.js" type="text/javascript"></script>
    <link href="styles/Judge.css" rel="stylesheet" type="text/css" />
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
           <%--<li class="current"><a href="JudgeExam.aspx" id="ExamsList" style=" width:130px;">阅卷及成绩管理</a></li>--%>
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
                     
                        <asp:ListView ID="ListView1"   runat="server" DataKeyNames="Id" OnItemDataBound="ListView1_ItemDataBound"
                         OnDataBound="ListView1_DataBound"  OnItemCommand="ListView1_ItemCommand" >
                            <LayoutTemplate>
                         
                                <asp:PlaceHolder ID="itemPlaceholder" runat="server"></asp:PlaceHolder>
                               
                            </LayoutTemplate>
                            <ItemTemplate>
                               <div class="examitem <%# Eval("JudgeState").ToString().ToLower() %>">
                          <h4><label>
                              <asp:Panel ID="Panel_Processer" runat="server" style=" display:inline;">
                                <a href="javascript:;" onclick='<%#Eval("ID","judgeProgress({0})") %>'>总体进度</a>&nbsp;
                                <%--<a href='<%#Eval("ID","ManucalJudgeProgress.aspx?EXAMID={0}") %>' target="_blank"  >手动批阅进度</a>--%> </asp:Panel> &nbsp;    阅卷状态：<asp:Label ID="lv_JudgeState" runat="server" Text="Label"></asp:Label>
                                     
                                            </label>
                                                <span style="display:none">ID:<asp:Literal ID="lv_ExamID" Text='<%#Eval("Id") %>'    runat="server"></asp:Literal></span>
                                                 
                                                <asp:Literal ID="lv_ExamName" Text='<%#Eval("ExamName") %>'  runat="server"></asp:Literal>
                                          </h4>
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr height="30">
                                    <td width="23%">考试模式：<asp:Literal ID="lv_ExamMode"   runat="server"></asp:Literal></td>
                                    <td width="23%">开始时间：<asp:Literal ID="lv_StartTime"    runat="server"></asp:Literal></td>
                                    <td width="23%">结束时间：<asp:Literal ID="lv_EndTime"    runat="server"></asp:Literal></td>
                                    <td>试卷类型： <asp:Literal ID="lv_PaperType"  runat="server"></asp:Literal></td>
                                </tr>
                                <tr height="30">
                                 <td>
                                 <asp:Panel ID="Panel_JudgeMode" runat="server">阅卷模式：<asp:Literal ID="lv_JudgeMode" runat="server"></asp:Literal>
                                  </asp:Panel>
                                 </td>
                                    <td>
                                        <asp:Panel ID="Panel_TotalDetailCount" runat="server">
                                       
                                    试题总数：<asp:Literal ID="lv_TotalDetailCount" Text='<%#Eval("DetailNeedJudgeCount") %>'  runat="server"></asp:Literal>
                                    </asp:Panel>
                                    </td>
                                    <td>
                                    <asp:Panel ID="Panel_JudgedDetailCount" runat="server">
                                       
                                    已阅总题数：<asp:Literal ID="lv_JudgedDetailCount" Text='<%#Eval("DetailJudgedCount") %>'  runat="server"></asp:Literal>
                                     </asp:Panel>
                                    </td>
                                   
                                    <td> <asp:Panel ID="Panel_JudgingDetailCount" runat="server">
                                    待阅总题数：<asp:Literal ID="Literal_JudgingDetailCount" runat="server" Text='<%# Convert.ToInt32( Eval("DetailNeedJudgeCount"))-Convert.ToInt32(Eval("DetailJudgedCount"))>0?(Convert.ToInt32(Eval("DetailNeedJudgeCount"))-Convert.ToInt32(Eval("DetailJudgedCount"))).ToString():"（已全部完成）" %>'></asp:Literal>
                                      </asp:Panel>
                                      </td>
                                </tr>
                                <asp:Panel ID="Panel_ForPro" runat="server">
                               
                                <tr height="30"> 
                                <td>
                                    <asp:Panel ID="Panel_myTotal" runat="server">
                                   
                                    我总共需要批阅：<asp:Literal ID="ltl_myTotal" runat="server"></asp:Literal>
                                     </asp:Panel>
                                    </td>
                                <td>
                                  <asp:Panel ID="Panel_MyJudged" runat="server">
                                   
                                我已经批阅：<asp:Literal ID="ltl_MyJudged" runat="server"></asp:Literal> </asp:Panel>
                                </td>
                                <td>
                                  <asp:Panel ID="Panel_MyRemain" runat="server">
                                   
                                我还要批阅：<asp:Literal ID="ltl_MyRemain" runat="server"></asp:Literal> </asp:Panel>
                                </td>
                                    <td>
                                        <asp:Panel ID="Panel_ExpertTask" Visible="false" runat="server">
                                            <script type="text/javascript">

                                                getExpertTaskCount('<%#Eval("id") %>');
                                                function d() {
                                                    getExpertTaskCount('<%#Eval("id") %>');
                                                }
                                                setInterval(d, 5000);
                                            
                                            </script>
                                            专家组待阅：<asp:Literal ID="ltl_ExpertTask" Visible="false" runat="server"></asp:Literal>
                                            <asp:Label ID='lbl_ExpertTask' runat="server" Text=''></asp:Label>
                                        </asp:Panel>
                                    </td>
                                </tr>
                                 </asp:Panel>
                                <td colspan="4" align="right">
                                          
                                            <asp:Button ID="SetBtn" OnClientClick='<%#Eval("ID","return JudgeSet({0}),false") %>'
                                                runat="server" Text="阅卷设置" />
                                               
                                            <asp:Button ID="StartBtn" Visible="false" CommandName="start" CommandArgument='<%#Eval("id") %>'
                                                runat="server" OnClientClick="popupProgress()" Text="开始阅卷" />

                                           <span class="closed">
                                            <asp:Button ID="StopBtn" Visible="false" OnClientClick='return confirmEndJudge($(this))'
                                                CssClass='<%#Eval("id","examid{0}") %>' CommandName="stop" CommandArgument=''
                                                runat="server" Text="结束阅卷" /></span>
                                           
                                           <span style=" display:none;">
                                            <asp:Literal ID="tips" Visible="false" runat="server" Text="（已经关闭）"></asp:Literal>
                                        
                                        </span>

                                          <asp:Button ID="QueryButton"  PostBackUrl='<%#Eval("ID","ScoreQryDetail.aspx?examid={0}") %>' OnClientClick='$("#_EXAMID_HiddenField").attr("value",$(this).attr("class"))'
                                         runat="server" Text="查看成绩" ></asp:Button>
                                    <asp:Button ID="StatisticsButton" PostBackUrl='<%#Eval("ID","ScoreStatistics.aspx?examid={0}") %>'  OnClientClick='$("#_EXAMID_HiddenField").attr("value",$(this).attr("class"));popupProgress();'
                                       runat="server" Text="成绩统计"  ClientIDMode="Static"></asp:Button>
                                     <asp:Button ID="RejudgeButton" OnClientClick='<%#Eval("ID","setRejudge({0})") %>'
                                       runat="server" Text="重新阅卷"  ClientIDMode="Static"></asp:Button>


                            </table>
                             </div>
                            </ItemTemplate>
                           <EmptyDataTemplate>
                             未查找到符合条件的数据
                           </EmptyDataTemplate>
                           
                        </asp:ListView>

                    

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
      <asp:HiddenField ID="_EXAMID_HiddenField" runat="server" />
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
    <div style="display: none;">
        <div id="close_judge">
            正在关闭，后台还在处理相关数据，您可能需要等待5到10分钟后才能查看成绩统计。
        </div>
    </div>
    </form>
</body>
</html>
