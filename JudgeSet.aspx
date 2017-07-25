<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="JudgeSet.aspx.cs" Inherits="Web.JudgeSet" AsyncTimeout="300" Async="true"  %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">

    <title>阅卷设置</title>
    <link href="styles/style.css" rel="stylesheet" type="text/css" />
    <link href="styles/style_webForms.css" rel="stylesheet" type="text/css" />
<%--<script src="scripts/jquery-1.7.min.js" type="text/javascript"></script>--%>
<link rel="stylesheet" type="text/css" href="scripts/progressBar/theme/jquery.ui.all.css" />
    <script src="scripts/progressBar/jquery-1.8.3.js" type="text/javascript"></script>
    <script src="scripts/PopWindow/gzy.popup.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/My97DatePicker/WdatePicker.js"></script>
    <script type="text/javascript" src="scripts/common.js"></script>
    <script type="text/javascript" src="scripts/webForm_common.js"></script>
    <script type="text/javascript" src="scripts/Judge.js"></script>
    <script src="scripts/judgeExam.js" type="text/javascript"></script>
    <script src="scripts/progressBar/jquery.ui.core.js" type="text/javascript"></script>
    <script src="scripts/progressBar/jquery.ui.widget.js" type="text/javascript"></script>
    <script src="scripts/progressBar/jquery.ui.mouse.js" type="text/javascript"></script>
    <script src="scripts/progressBar/jquery.ui.progressbar.js" type="text/javascript"></script>
    <script src="scripts/progressBar/jquery.ui.resizable.js" type="text/javascript"></script>
    <script src="scripts/JudgeSet.js" type="text/javascript"></script>
    <style type="text/css">
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
    </style>

</head>
<body>
    <form id="form1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>

    <asp:HiddenField runat="server" ID="sysVersion" ClientIDMode="Static" />
    <div style="padding: 10px;">
        <div id="judgeset_content" style="width: 570px;height: 180px; float: left;">
            <center style="font-size: 16px; font-weight: bold;">
                <asp:Label ID="lbl_ExamName" runat="server" Text="Label"></asp:Label></center>
            <br />
            <div style="width: 565px; height: 22px; background-color: #d7d7d7; padding: 3px;">
                自动批阅：</div>
            <table class="list">
                <asp:Panel ID="Panel_MRQ" runat="server">
                <tr>
                    <td style="text-align: right; width: 100px;">
                        评分选项：
                    </td>
                    <td>
                        多选题不全对时得
                        <asp:DropDownList ID="ddl_MRQ"  CssClass="ddl_style" runat="server" />
                        分<span id="ddl_MRQ_tips" style=" color:Red;"></span>
                    </td>
                </tr>
                </asp:Panel>
                <tr>
                    <td style="text-align: right; vertical-align:middle; width: 140px;">
                        自动批阅客观题：
                    </td>
                    <td style=" vertical-align:middle;height:45px;">
                        <div id="caozuoPanel" style=" height:45px;">
                            <input id="ObjStartBtn" class="start_btn"   type="button" value="开启" onclick="Judge_Open()" />
                
                            <asp:Label ID="lbl_tip" runat="server"></asp:Label>
                        </div>
                        <div id="progressBarPanel" style=" width:350px; height:45px; cursor:pointer; display:none; padding-top:5px;">
                            <div id="progressbarWrapper" style="height: 12px; "
                                class="ui-widget-default">
                                <div id="progressbar" style="height: 100%;">
                                </div>
                            </div>
                            <center>
                                <span id="percent_tips"></span>
                                <span id="xianShiCaoZuo" style=" text-decoration:underline; color:Blue;" onclick='DisplayCaozuo()'>显示操作</span>
                                </center>
                        </div>
                    </td>
                </tr>
            </table>
            <div style="width: 565px; height: 22px; background-color: #d7d7d7; padding: 3px;">
                手动批阅：</div>
            <table class="list">
                <asp:Panel ID="Panel1_judgemode" runat="server">
            
                <tr>
                    <td style="text-align: right; width: 140px;">
                        阅卷模式：
                    </td>
                    <td>
                        <asp:UpdatePanel ID="UpdatePanel1" UpdateMode="Conditional" runat="server">
                            <Triggers>
                                <asp:AsyncPostBackTrigger ControlID="rbt_Professional" EventName="CheckedChanged" />
                                <asp:AsyncPostBackTrigger ControlID="rbt_Normal" EventName="CheckedChanged" />
                            </Triggers>
                            <ContentTemplate>
                                <div>
                                    <asp:RadioButton ID="rbt_Normal" AutoPostBack="true" GroupName="rbtJudgeMode" Text=""
                                        OnCheckedChanged="rbt_CheckedChanged" runat="server" />普通阅卷 <font color="#cccccc">阅卷老师每次批阅的答题来自同一份答卷</font>
                                </div>
                                <asp:Panel ID="Panel_Professional" runat="server">
                               
                                <div>

                                    <asp:RadioButton ID="rbt_Professional" AutoPostBack="true" GroupName="rbtJudgeMode"
                                        Text="" OnCheckedChanged="rbt_CheckedChanged" runat="server" />专业阅卷 <font color="#cccccc">
                                            阅卷老师将批阅来自不同试卷但题面内容相同的答题</font><%--（考试方案为统一卷）--%></div>
  </asp:Panel>
                             
                            </ContentTemplate>
                        </asp:UpdatePanel>
                      
                    </td>
                </tr>
                    </asp:Panel>
                       <asp:HiddenField ID="Selected_Judgemode" Value="2" runat="server" /><!--默认为普通阅卷模式-->
                      <asp:HiddenField ID="EXAMID_HIDDENFIELD" runat="server" />
                <tr style=" display:none;">
                    <td style="text-align: right; width: 140px;">
                        阅卷阀值：
                    </td>
                    <td>

                        <input id="ThreShold_TextBox" style=" width:40px;" type="text"  />%&nbsp;&nbsp;
                        <input id="ThreShold_Submit" type="button" value="确定"  onclick='SetThreshold($("#EXAMID_HIDDENFIELD").attr("value"),$("#ThreShold_TextBox").attr("value"))' />
                        <span id="ThreSholdTips" style=" color:Red;"></span>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: right; width:140px;">
                        阅卷老师：
                    </td>
                    <td>
                        <asp:UpdatePanel ID="UpdatePanel2" runat="server">
                            <Triggers>
                                <asp:AsyncPostBackTrigger ControlID="rbt_Professional" EventName="CheckedChanged" />
                                <asp:AsyncPostBackTrigger ControlID="rbt_Normal" EventName="CheckedChanged" />
                            </Triggers>
                            <ContentTemplate>
                                <asp:Panel ID="SelectJudgerPanel" Visible="false" runat="server">
                                    <input  class="start_btn" id="Button1" type="button"  onclick='SelectJudgerTeacher()'   value="选择老师" />
                                    <asp:Button ID="ButtonSelectJudgers" runat="server" style=" display:none;" Text="Button" />
                                </asp:Panel>
                                <asp:Panel ID="PanelTips" Visible="false" runat="server">
                                  <%--请在“<asp:HyperLink ID="HyperLink1" Target="_blank" runat="server">手动批阅进度</asp:HyperLink>”页面中调整阅卷老师和任务。--%>
                                </asp:Panel>
                                 
                               
                            </ContentTemplate>
                        </asp:UpdatePanel>
                    </td>
                </tr>
                 <tr>
                    <td style="text-align: right;">
                        任务分配：
                    </td>
                    <td>
                    <span style=" display:none;">
                    <asp:UpdatePanel ID="UpdatePanel5" runat="server" RenderMode="Inline">
                            <Triggers>
                                <asp:AsyncPostBackTrigger ControlID="btnAllocate" EventName="Click" />
                                <asp:AsyncPostBackTrigger ControlID="ButtonSelectJudgers" EventName="Click" />
                            </Triggers>
                            <ContentTemplate>
                        <asp:Button  style=" width:160px; height:29px;" ID="btnAllocate"  runat="server" 
                                    Text="自动分配" onclick="btnAllocate_Click" />
                                </ContentTemplate>
                        </asp:UpdatePanel>
                        </span>
                        <a href="#" onclick='parent.retrieveAllocate($("#EXAMID_HIDDENFIELD").attr("value"))'>浏览已分配情况</a>
                       <%-- <asp:LinkButton ID="lnkBtnAdjust" runat="server">手动调整</asp:LinkButton>--%>
                    </td>
                </tr>
                  <tr>
                    <td style="text-align: right;">
                        开启主观题批阅：
                    </td>
                    <td>
                        <asp:Panel ID="Panel_openJudgeObject" runat="server">
                      
                          <input id="openJudgeObject"  class="start_btn" type="button" value="开启" onclick='OpenJudgeObject($("#EXAMID_HIDDENFIELD").attr("value"))' />
                          <span id="openJudgeObjectTips" style=" color:Red"></span>

                        </asp:Panel>
                        <span style=" color:Red;"><asp:Literal ID="Literal1" runat="server"></asp:Literal></span>
                    </td>
                </tr>


            </table>
            <%--<img alt="关闭" style="cursor:pointer; margin-left:420px;"   onclick="parent.JudgeSetPopup.close();" src="/images/teacher.return.jpg" />--%>


        </div>
    </div>

    </form>
</body>
</html>
