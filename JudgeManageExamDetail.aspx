<%@ Page Title="阅卷管理" Language="C#" MasterPageFile="~/JudgeManage.Master" AutoEventWireup="true" CodeBehind="JudgeManageExamDetail.aspx.cs" Inherits="Web.JudgeManage.JudgeManageExamDetail" %>

<%@ Register   tagPrefix="JM" tagName="ProgressSumary" src="~/ExamJudgeProgressSumary.ascx" %>
 
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style type="text/css">
    
    table.list{ margin-bottom:0px;}
        .noneDisplay
        {
            display: none;
        }
        .blockDisplay
        {
            display: block;
        }
        .ddl_style
        {
            width: 60px;
           text-align:center;
           
        }
        .ui-progressbar .ui-progressbar-value
        {
            background-image: url(scripts/progressBar/theme/images/progressBar1.gif);
        }
        .tips
        {
            color: Red;
            width: 50px;
        }
        .tips_w
        {
            color: Red;
            width: 75px;
        }
        .start_btn
        {
            border: 1 solid white;
            color: White;
            background-image: url(images/judge_open_noText.jpg);
            background-position: center;
            background-repeat: no-repeat;
            width: 95px;
            height: 32px;
        }
        select{ width:90px;}
    table.c td.a{  width:250px; text-align:right; padding-right:20px; }
    
  
    </style> 
    <link rel="stylesheet" type="text/css" href="scripts/progressBar/theme/jquery.ui.all.css" />
  <%--  <script src="scripts/progressBar/jquery-1.8.3.js" type="text/javascript"></script>--%>
     <script type="text/javascript" src="scripts/Judge.js"></script>
    <script src="scripts/judgeExam.js" type="text/javascript"></script>
    <script src="scripts/progressBar/jquery.ui.core.js" type="text/javascript"></script>
    <script src="scripts/progressBar/jquery.ui.widget.js" type="text/javascript"></script>
    <script src="scripts/progressBar/jquery.ui.mouse.js" type="text/javascript"></script>
    <script src="scripts/progressBar/jquery.ui.progressbar.js" type="text/javascript"></script>
    <script src="scripts/progressBar/jquery.ui.resizable.js" type="text/javascript"></script>
    <script src="scripts/JudgeSet.js" type="text/javascript"></script>

    <script type="text/javascript">

        var state = 2;
        function showSetting() {
            $("#setting").css('display', '');
            $("#judging").css('display', 'none');
            $("#result").css('display', 'none');
        }
        function showJudgeing() {
            $("#setting").css('display', 'none');
            $("#judging").css('display', '');
            $("#result").css('display', 'none');
        }
        function showResult() {
            $("#setting").css('display', 'none');
            $("#judging").css('display', 'none');
            $("#result").css('display', '');
        }

       


        function switchPanel(sta) {
            if (sta == 1) {
                showSetting();
            }
            if (sta == 2) {
                showJudgeing();
            }
            if (sta == 3) {
                showResult();
            }
        }


        ////////////////////////////////选择阅卷管理员/////////////////////////////////////////

        var _judgeMnagerPanel;

        function showJudgeMangerPanel() {
            var examid = $("#EXAMID_HIDDENFIELD").val();

            _judgeMnagerPanel = new gzy.popup("添加专家", 800, 480, { url: 'Widget/SelectJudger.aspx?id=' + examid + '&identity=0',
                buttons: [{ text: '确定', isCancel: false, click: confirmSelectJudgerManger}]
            });

        }

        function confirmSelectJudgerManger() { //确认选的阅卷管理员

            var SelectedJudgerMangerIDs = getUserIDs_p();

          
            if (SelectedJudgerMangerIDs.length > 0) {
                CallServer(SelectedJudgerMangerIDs, null);
            }
            else {
                alert("未选择任何老师");
            }

        }

        function getUserIDs_p() {
            var ids = "";
            _judgeMnagerPanel.body.find("#SelectUser1_selectedTeacherList option").each(function () {
                ids += $(this).val() + ",";
            });
            ids = ids.substr(0, ids.length - 1);
            return ids;
        }

        function getUserNames_p() {
            var names = "";
            _judgeMnagerPanel.body.find("#SelectUser1_selectedTeacherList option").each(function () {
                names += $(this).text() + ",";
            });
            names = names.substr(0, names.length - 1);
            return names;
        }

        function ReceiveData(data) {
           
            if (data == '100') {

                $("#selectedJudgeManagerNames").html(getUserNames_p());
                $("#refreshBtn").click();
                _judgeMnagerPanel.close();
                
            }
            else {
                alert("no");
            }
        
        }


        function manualAllocated() {

            var examid = $("#EXAMID_HIDDENFIELD").val();

            var url = "/JudgeManageTaskAllocate.aspx?id=" + examid;

            if (checkSetting()) {
                location.replace(url);
            }

            return false;
        }

        function checkSetting() {
            var r = true;
            if ($("#DropDownListProIsArbiter:selected").val() == '-1') {
                alert("请先选择是否由专家终审");
                r = false;
            }
            if ($("#DropDownListTotalTimesOnRound1 option:selected").val() == '-1') {
                alert("请先选择第一轮每题的阅卷人数");
                r = false;
            }

            

            return r;
        }

    </script>

    <link href="Widget/groupProgress.css" rel="stylesheet" type="text/css" />
    <script src="Widget/groupProgress.js" type="text/javascript"></script>
        <script type="text/javascript">

            function RenderGroupProgress(total, ing, needReview, ed) {
                renderGroupProgress(total, ing, needReview, ed, 300, 20);
            }
    </script>



    <style type="text/css">
     div#group_progress  table > tbody td{ border-bottom:0 none;}
    </style>
 
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <asp:ScriptManagerProxy ID="ScriptManagerProxy1" runat="server">
    </asp:ScriptManagerProxy>
    <div id="sumary" style="margin: 10px; height: 30px; width: 600px; float: left;">
        当前考试：<b><asp:Label ID="lbl_ExamName" runat="server" Text=""></asp:Label></b>&nbsp;&nbsp;&nbsp;&nbsp;阅卷状态：
        <b style=" color:#E13227; padding:5px;"><asp:Label     ID="lbl_ExamJudgeState" runat="server" Text=""></asp:Label></b>
    </div>
<div style=" float:right; width:80px; height:30px;  margin-right:15px; margin:10px; "><a href="JudgeManageExamList.aspx" >返回</a></div>
<br style="clear:both;" /> 
<%--<div style=" float:right; width:300px;"><a>设置</a>阅卷中<a></a><a>成绩</a></div>--%>
<br style="clear:both;" /> 

<map id="status" name="status">
<area alt="阅卷设置"  shape="rect" onclick="showSetting()" href="#" coords="0,0,150,83"  title="阅卷未开始" />
<area alt="阅卷进行中"  shape="rect" onclick="showJudgeing()"  href="#"  coords="257,0,406,83"  title="正在阅卷"  />
<area alt="成绩与统计"  shape="rect" onclick="showResult()" href="#"   coords="511,0,660,83"  title="阅卷已结束" />
</map>

<div id="setting" class="step" >
<div style=" width:100%; margin:5px; margin-top:15px; ">
   <center> <%--<div  style=" width:574px; height:78px; background-image:url(images/judge/judgeSetting.png) "> </div>--%> 
     <img src="images/judge/judgeSetting.png" usemap="#status"  alt="阅卷设置" />
    </center></div>
  
    <table class="list">
        <tbody>
            <tr>
                <td  style=" width:200px; vertical-align:middle;  background-color:#f7f7f7;text-align:right;  padding-right:30px; ">
                    计算机自动批阅：
                </td>
                <td >
                    <table style=" width:100%">
                        <asp:Panel ID="Panel_MRQ" runat="server">
                            <tr>
                                <td style="width: 150px; width: 150px; border-right: #ebebeb 1px dashed;">
                                    评分选项：
                                </td>
                                <td>
                                    多选题不全对时得
                                    <asp:DropDownList ID="ddl_MRQ" CssClass="ddl_style" runat="server"  ClientIDMode="Static"  />
                                    分 <span id="ddl_MRQ_tips" style="color: Red;"></span>
                                </td>
                                <td>
                                     案例分析题不全对时得
                                    <asp:DropDownList ID="analyseNAR" CssClass="ddl_style" runat="server"  ClientIDMode="Static"  />
                                    分 <span id="ddl_MRQ_tips" style="color: Red;"></span>
                                    
                                </td>
                            </tr>
                            <tr>
                            </tr>
                        </asp:Panel>
                            <tr>
                                <td  style=" border:0 none; width:150px; border-right:#ebebeb 1px dashed;">
                                    自动批阅客观题：
                                </td>
                                <td style=" border:0 none;">
                                    <div id="caozuoPanel" style="height: 45px;">
                                        <asp:Button ID="ObjStartBtn" CssClass="start_btn" ClientIDMode="Static" OnClientClick="Judge_Open();return false;" runat="server" Text="开启"  />
                                         
                                        <asp:Label ID="lbl_tip" runat="server"></asp:Label>
                                    </div>
                                    <div id="progressBarPanel" style="width: 350px; height: 45px; cursor: pointer; display: none;
                                        padding-top: 5px;">
                                        <div id="progressbarWrapper" style="height: 12px;" class="ui-widget-default">
                                            <div id="progressbar" style="height: 100%;">
                                            </div>
                                        </div>
                                        <center>
                                            <span id="percent_tips"></span><span id="xianShiCaoZuo" style="text-decoration: underline;
                                                color: Blue;" onclick='DisplayCaozuo()'>显示操作</span>
                                        </center>
                                    </div>
                                </td>
                            </tr>
                        
                    </table>
                </td>
            </tr>
            <tr>
                <td style=" vertical-align:middle;  background-color:#f7f7f7; text-align:right;  padding-right:30px; ">
                    阅卷老师手动批阅：
                </td>
                <td>
                    <table style="width: 100%">
                        <tr>
                            <td style="width: 150px; width: 150px; border-right: #ebebeb 1px dashed;">
                                第一轮每题阅卷人数：
                            </td>
                            <td>
                                <asp:UpdatePanel ID="UpdatePanel3" UpdateMode="Conditional" runat="server">
                                    <Triggers>
                                        <asp:AsyncPostBackTrigger ControlID="DropDownListTotalTimesOnRound1" EventName="SelectedIndexChanged" />
                                    </Triggers>
                                    <ContentTemplate>
                                        <asp:DropDownList ClientIDMode="Static" ID="DropDownListTotalTimesOnRound1" AutoPostBack="true" OnSelectedIndexChanged="DropDownListTotalTimesOnRound1_SelectedIndexChanged"
                                            runat="server">
                                             <asp:ListItem Text="（未选）" Value="-1" Selected="True" />
                                            <asp:ListItem Text="1" Value="1" Enabled="false" />
                                            <asp:ListItem Text="2" Value="2" />
                                            <asp:ListItem Text="3" Value="3" />
                                        </asp:DropDownList>
                                        人
                                    </ContentTemplate>
                                </asp:UpdatePanel>
                            </td>
                        </tr>
                        <tr>
                            <td style="border: 0 none; width: 150px; border-right: #ebebeb 1px dashed;">
                                是否由专家终审：
                            </td>
                            <td style="border: 0 none;">
                                <asp:UpdatePanel ID="UpdatePanel2" UpdateMode="Conditional" runat="server">
                                    <Triggers>
                                        <asp:AsyncPostBackTrigger ControlID="DropDownListProIsArbiter" EventName="SelectedIndexChanged" />
                                    </Triggers>
                                    <ContentTemplate>
                                        <asp:DropDownList ClientIDMode="Static" ID="DropDownListProIsArbiter" runat="server" AutoPostBack="true"
                                            OnSelectedIndexChanged="DropDownListProIsArbiter_SelectedIndexChanged">
                                             <asp:ListItem Text="（未选）" Value="-1" Selected="True" />
                                            <asp:ListItem Text="否" Value="false"  />
                                            <asp:ListItem Text="是" Value="true" />
                                        </asp:DropDownList>
                                    </ContentTemplate>
                                </asp:UpdatePanel>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 150px; width: 150px; border-right: #ebebeb 1px dashed;">
                                阅卷任务：
                            </td>
                            <td>
                                <asp:LinkButton ID="lnk" OnClientClick="return manualAllocated();" runat="server">手动分配</asp:LinkButton>
                              
                            </td>
                        </tr>

                               <tr>
                            <td style="border: 0 none; width: 150px; border-right: #ebebeb 1px dashed;">
                                允许最大差值比：
                            </td>
                            <td style="border: 0 none;">
                                <asp:UpdatePanel ID="UpdatePanel4" UpdateMode="Conditional" runat="server">
                                    <Triggers>
                                        <asp:AsyncPostBackTrigger ControlID="DropDownListAllowMaxDiffRate" EventName="SelectedIndexChanged" />
                                    </Triggers>
                                    <ContentTemplate>
                                        <asp:DropDownList ClientIDMode="Static" ID="DropDownListAllowMaxDiffRate" runat="server" AutoPostBack="true"
                                            OnSelectedIndexChanged="DropDownListAllowMaxDiffRate_SelectedIndexChanged">
                                            <asp:ListItem Text="（未选）" Value="-1" Selected="True" />
                                            <asp:ListItem Text="10%" Value="0.1" />
                                            <asp:ListItem Text="20%" Value="0.2" />
                                            <asp:ListItem Text="30%" Value="0.3" />
                                            <asp:ListItem Text="40%" Value="0.4" />
                                            <asp:ListItem Text="50%" Value="0.5" />
                                            <asp:ListItem Text="60%" Value="0.6" />
                                            <asp:ListItem Text="70%" Value="0.7" />
                                            <asp:ListItem Text="80%" Value="0.8" />
                                            <asp:ListItem Text="90%" Value="0.9" />
                                        </asp:DropDownList>（差值超过该比例后视为存在歧义）
                                    </ContentTemplate>
                                </asp:UpdatePanel>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 150px; border-right: #ebebeb 1px dashed;">
                                阅卷管理员：
                            </td>
                            <td>
                                <div style="display: none;">
                                    <asp:Button ID="refreshBtn" ClientIDMode="Static" runat="server" Text="" />
                                </div>
                                <asp:UpdatePanel ID="UpdatePanel1" runat="server">
                                    <Triggers>
                                        <asp:AsyncPostBackTrigger ControlID="refreshBtn" EventName="Click" />
                                    </Triggers>
                                    <ContentTemplate>
                                        <asp:Literal ID="selectedJudgeManagerNames" ClientIDMode="Static" runat="server"></asp:Literal>
                                        <a href="#" onclick="showJudgeMangerPanel();">
                                            <asp:Literal ID="LiteralSetJudgeManager" runat="server" Text="设置"></asp:Literal></a>

                                    </ContentTemplate>
                                </asp:UpdatePanel>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    <center>
        <%--<asp:ImageButton ImageUrl="images/judge/startJudge.png" AlternateText="开启手动批阅" runat="server" />--%>
        <asp:Panel ID="Panel_openJudgeObject" runat="server">
            <input id="openJudgeObject" class="start_btn" type="button" value="开启" onclick='OpenJudgeObject($("#EXAMID_HIDDENFIELD").attr("value"))' />
            <span id="openJudgeObjectTips" style="color: Red"></span>
        </asp:Panel>
        <span style="color: Red;">
            <asp:Literal ID="Literal1" runat="server"></asp:Literal></span>
    </center>
<%--
    <asp:HiddenField ID="HiddenFieldLeastJudgersIsSetted" ClientIDMode="Static" runat="server" />
    <asp:HiddenField ID="HiddenFieldProficientIsArbitrateHasSetted" ClientIDMode="Static"  runat="server" />
--%>
</div>
<div id="judging" class="step" >
<div style=" width:100%; margin:5px; margin-top:15px; clear:both;">
   <center>
     <img src="images/judge/judgeing.png" usemap="#status"  alt="阅卷进行中" /> 
     </center>
     </div>
    <table class="list" style=" margin-bottom:0;">
        <tbody>
             <tr>
                <td style=" width:200px; vertical-align:middle;  background-color:#f7f7f7; text-align:right;  padding-right:30px; ">
                    该考试包含的模块：
                </td>
                <td>
                <table  style=" width:100%;"><tr><td style=" border:0 none;"> 
                 <asp:Label ID="LabelKpNames" runat="server" Text="Label"></asp:Label></td></tr> </table>
                  
                </td>
            </tr> 
            <tr>
                <td style=" width:200px; vertical-align:middle;  background-color:#f7f7f7; text-align:right;  padding-right:30px; ">
                    阅卷管理员：
                </td>
                <td>
                <table  style=" width:100%;"><tr><td style=" border:0 none;"> 

                 <asp:Label ID="LabelJudgeManager" runat="server" Text="Label"></asp:Label></td></tr> </table>
                  
                </td>
            </tr>
            <tr>
                <td style="width: 200px; vertical-align: middle; background-color: #f7f7f7; text-align: right;
                    padding-right: 30px;">
                    手动批阅总数：
                </td>
                <td>
                    <table style="width: 100%;">
                        <tr>
                            <td style="border: 0 none;">
                                
                                   <span style=" float:left;"> <asp:Label ID="LabelTotalOfASDByTeacher" runat="server" Text="Label"></asp:Label></span>
                                    
                                <div id="group_progress" style="  float:left; width: 350px; margin:2px auto;">
                                    <table cellpadding="0" cellspacing="0" style=" border-spacing:0;">
                                        <tbody>
                                            <tr>
                                                <td class="c1">
                                                </td>
                                                <td class="c2">
                                                </td>
                                                <td class="c3">
                                                </td>
                                                <td class="c4">
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    <JM:ProgressSumary ID="ProgressSumary" runat="server"></JM:ProgressSumary>
    <table class="list" style=" border-top:0 none;">
    <tbody>
       <tr>
            <td style="width: 200px; vertical-align: middle; background-color: #f7f7f7;text-align:right;  padding-right:30px;                  ">
                详细批阅进度：
            </td>
            <td style=" padding:4px 0;">
              <asp:HyperLink style="width:93px; height:31px;margin:4px 0;" ID="HyperLink1" runat="server" Text=""><span  style=" background:url(../images/judge_open_noText.jpg); padding:6px 18px;  width:93px; color:White; height:31px;">查看详情</span> </asp:HyperLink> 
            </td>
        </tr>
            </tbody>
    </table>
     <center style=" margin-top:6px;">  
     <asp:ImageButton ID="ImageButtonCloseJudge" OnClick="ImageButtonCloseJudge_Click"   ImageUrl="images/judge/endJudge.png" AlternateText="关闭手动批阅" runat="server" />
  </center>
    <div style=" margin-left:15px; font-size:12px; line-height:22px; color:#939393; margin-top:15px;">

    注意：<br />
        1、总体进度按每个答题的当前批阅状态统计，主要为体现整场考试的答题的批阅进度。<br />
        2、详细进度按每个人批阅的答题数量统计，主要为体现每个人的批阅情况。<br />
           第一轮的每个答题要批阅了“一轮每题最少批阅次数（阅卷设置中设置）”后才算完成。<br />
           由于第一轮和第二轮完成后可能会产生歧义，所以总任务在批阅过程中是递增的。<br />
   
    </div>


</div>
<div id="result" class="step" >
<div style=" width:100%; margin:5px; margin-top:15px; clear:both;">
   <center>
     <img src="images/judge/result.png" usemap="#status"  alt="成绩查看与统计" /> 
     </center>
     </div>
     <table class="list c">
     <tbody>
         <tr>
             <td class="a">
                 一轮结评率①：
             </td>
             <td>
                 <asp:Literal ID="LiteralRounded1" runat="server"></asp:Literal>
             </td>
         </tr>
         <tr>
             <td class="a">
                 二轮结评率（组长）：
             </td>
             <td>
                 <asp:Literal ID="LiteralRounded2" runat="server"></asp:Literal>
             </td>
         </tr>
         <tr>
             <td class="a">
                 三轮结评率（专家）：
             </td>
             <td>
                 <asp:Literal ID="LiteralRounded3" runat="server"></asp:Literal>
             </td>
         </tr>
     </tbody>
     </table>
     <div style=" margin-left:15px; font-size:12px; line-height:22px; color:#939393; margin-top:15px;">
     注释①：<br />
     结评率：按照预期设置，如果一道题目的评阅结果没有出现争议，那么在第一轮评阅完后，这道题目就可以得到最终分，简而言之，该题在第一轮后结束评阅了。这样的题目数量占总共需要手动批阅的题目数量的比例叫做一轮结评率。同理二轮结评率是指在第二轮评阅即组长评阅后得到最终分的题目的数量占总数的比例。三轮结评率只专家批阅数占总数比例。
     </div>
</div>

 <asp:HiddenField ID="EXAMID_HIDDENFIELD" ClientIDMode="Static" runat="server" />
</asp:Content>
