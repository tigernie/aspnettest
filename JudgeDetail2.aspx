<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="JudgeDetail2.aspx.cs" Inherits="Web.JudgeDetail2" %>

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
        span p {
            text-align: left;
            font-size: 15px;
        }

        .next {
            background-image: url(../images/teacher.exam.arrow.jpg);
            background-repeat: no-repeat;
            background-position: left;
            background-attachment: scroll;
            height: 16px;
            padding-left: 18px;
            text-align: left;
            margin-left: 9px;
        }

        .myJudgedSheet {
            background-image: url(../images/icon.gif);
            background-repeat: no-repeat;
            background-position: left;
            background-attachment: scroll;
            height: 16px;
            padding-left: 18px;
            text-align: left;
        }

        .dropdownlist {
        }

        .titleText {
            background-color: #f6f6f6;
            padding: 6px;
            font-weight: bolder;
            font-size: 14px;
        }

        .text {
            padding: 5px;
        }

        .return {
            background-image: url(../images/icon.gif);
            background-repeat: no-repeat;
            background-attachment: scroll;
            background-position: left;
            height: 15px;
            padding-left: 18px;
        }


        #nextLinkText {
            color: White;
            text-align: center;
            vertical-align: middle;
            line-height: 30px;
            margin: 9px;
        }

        div.nextLinkTextParent {
            width: 93px;
            background-image: url(../images/judge_open_noText.jpg);
            background-repeat: no-repeat;
            background-position: center;
            height: 31px;
            color: White;
            float: right;
            margin-right: 10px;
        }

        div.body > label {
            font-size: 32px;
            padding-top: 26px;
            padding-left: 40px;
            display: none;
        }

        .new {
            background-image: url(../images/judge/new.png);
            background-repeat: no-repeat;
            width: 28px;
            height: 14px;
        }

        .ocxLeft {
            float: left;
            height: 580px;
            padding: 10px;
            background: #ececec;
            overflow: auto;
        }

            .ocxLeft.wide {
                width: 230px;
            }

            .ocxLeft button {
                background: url(../images/save_and_submit_wide.jpg) no-repeat;
                border: none;
                width: 272px;
                height: 38px;
                cursor: pointer;
            }

            .ocxLeft.narrow {
                width: 180px;
            }

                .ocxLeft.narrow button {
                    background-image: url(../images/save_and_submit_narrow.jpg);
                    width: 172px;
                }

            .ocxLeft fieldset {
                margin-top: 20px;
                padding-top: 8px;
            }

                .ocxLeft fieldset legend {
                    margin-left: 10px;
                    font-size: 14px;
                    font-weight: bold;
                }

                .ocxLeft fieldset div {
                    height: 460px;
                    overflow: auto;
                    padding: 0 8px;
                }

                    .ocxLeft fieldset div p {
                        line-height: 1.2em;
                        margin-bottom: 0.5em;
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

                    pp.setRect({ width: '+=' + (screen.width > 1024 ? 300 : 200), left: '-=' + (screen.width > 1024 ? 150 : 100) }, function () {
                        $('<div class="ocxLeft ' + (screen.width > 1024 ? 'wide' : 'narrow') + '" style="">'
                            + '<div id="ocxLeft"></div>'
                            + '</div>')
                            .prependTo(pp.body).append('<fieldset><legend>做题要求</legend><div>' + $('.div_content').html() + '</div></fieldset>');
                        loading.close();
                        office.style.display = '';
                    });

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

        function JudgeNeedKnow() {
            new gzy.popup("阅卷须知", 640, 480, { url: "/Widget/judgeNeedKnow.htm", buttons: [{ text: '取消', isCancel: true }] });
            return false;
        }

        function NextASD() {
            var v = $(".nextTips").attr("ID");

            if (v != "OK") {
                alert("您还没有保存给分");
                return false;
            }
            else {
                return true;
            }

        }

    </script>

    <script src="Widget/myProgress.js" type="text/javascript"></script>
    <link href="Widget/myProress.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript">

        function RenderMyProgreee(total, done, ing) {
            renderMyProgreee(total, done, ing, 200, 16);
        }

    </script>
</head>
<body>
    <form id="form1" runat="server">

        <div class="body">
            <%-- <div class="head problib" style="background: url(../images/judge/bg_head_j.jpg); ">
            <p>
                <a href="javascript:;" class="user">管理员</a>  
                <a href="javascript:;" class="setting">系统管理</a> 
                <a href="login2.aspx?do=logout" class="exit">注销</a>
            </p>
        </div>
        <div class="wide">
           
        </div>
        <br />
        <div style="width: 100%; height: 124px; background: url(../images/judge/bg_head_j.jpg); ">
            <center>
                <div style="font-size: 15px; font-weight: bold;">
                    <asp:Label ID="LabelExamName" runat="server" Text=""></asp:Label>
                </div>
              </center>
                <div style="width: 94%; margin-top: 15px; height:22px; margin-left:30px; ">
                    
                        <div style="font-size: 12px; float: left; height: 22px; vertical-align: middle;">
                            <asp:Label ID="lbl_TotalCount" runat="server" Text=""></asp:Label>&nbsp;&nbsp;&nbsp;&nbsp;
                            <span style="width: 20px;" class="myProgress_c1">&nbsp;&nbsp;</span>
                            <asp:Literal ID="ltl_JudgedCount" runat="server"></asp:Literal>&nbsp;&nbsp;&nbsp;&nbsp;
                            <span style="height: 26px; line-height: 26px; width: 20px;" class="myProgress_c2">&nbsp;&nbsp;</span>
                            <asp:Literal ID="ltl_JudgingCount" runat="server"></asp:Literal>
                            （<asp:Literal ID="LiteralGotOnLast" runat="server"></asp:Literal>）&nbsp;&nbsp;&nbsp;&nbsp;
                            <span style="height: 26px; line-height: 26px; width: 20px;" class="myProgress_c3">&nbsp;&nbsp;</span>
                            <asp:Literal ID="lbl_RemainCount" runat="server"></asp:Literal>&nbsp;&nbsp;&nbsp;&nbsp;
                        </div>
                        <div id="my_progress" style="float: left; line-height: 22px; height: 22px; margin: 4px 0;
                            vertical-align: middle;">
                            <table cellpadding="0" cellspacing="0">
                                <tbody>
                                    <tr>
                                        <td class="c1">
                                        </td>
                                        <td class="c2">
                                        </td>
                                        <td class="c3">
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div style="float: right; line-height: 22px; height: 22px; width:35px;    vertical-align: middle;">
                            <asp:Panel ID="PanelBack" Visible="false"    runat="server">
                                <asp:HyperLink ID="HyperLinkBack" runat="server">返回</asp:HyperLink>
                            </asp:Panel>
                        </div>
                    
        </div>  </div>
          <ul class="mtabs">
        </ul>--%>
            <%-- background: url(../images/judge/bg_head_j.jpg);  color:White;--%>
            <div class="head problib" style="background-image: none; background-color: rgb(252,253,252);">
                <div style="float: right; margin: 8px;"><a href="#" onclick="return JudgeNeedKnow();">阅卷须知</a></div>
                <center>
                    <div style="font-size: 18px; font-weight: bold; padding-top: 30px;">
                        <asp:Label ID="LabelExamName" runat="server" Text=""></asp:Label>
                    </div>
                </center>
                <div style="width: 94%; margin-top: 15px; height: 22px; margin-left: 30px;">

                    <div style="font-size: 12px; float: left; height: 22px; vertical-align: middle;">
                        <%--总数--%>
                        <asp:Label ID="lbl_TotalCount" runat="server" Text=""></asp:Label>&nbsp;&nbsp;&nbsp;&nbsp;
                        <%--完成数--%>
                        <span style="width: 20px;" class="myProgress_c1">&nbsp;&nbsp;</span>
                        <asp:Literal ID="ltl_JudgedCount" runat="server"></asp:Literal>&nbsp;&nbsp;&nbsp;&nbsp;
                        <%--进行数--%>
                        <span style="height: 26px; line-height: 22px; width: 20px;" class="myProgress_c2">&nbsp;&nbsp;</span>
                        <asp:Label ID="LabelGotOnLast" runat="server" Visible="false" Style="line-height: 20px; margin-top: -4px;" Text="">
<img src="images/judge/new.png" alt="新抽到的题目"  />
                        </asp:Label>
                        <asp:Label ID="LabelJudging" runat="server" Text="">
                            <asp:Literal ID="ltl_JudgingCount" runat="server">
                            </asp:Literal>
                        </asp:Label>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <%--剩余数--%>
                        <span style="height: 26px; line-height: 26px; width: 20px;" class="myProgress_c3">&nbsp;&nbsp;</span>
                        <asp:Literal ID="lbl_RemainCount" runat="server"></asp:Literal>&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                    <div id="my_progress" style="float: left; line-height: 22px; height: 22px; margin: 4px 0; vertical-align: middle;">
                        <table cellpadding="0" cellspacing="0">
                            <tbody>
                                <tr>
                                    <td class="c1"></td>
                                    <td class="c2"></td>
                                    <td class="c3"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style="float: right; line-height: 22px; height: 22px; width: 55px; vertical-align: middle;">

                        <asp:Panel ID="PanelBack" Visible="false" runat="server">
                            <asp:HyperLink ID="HyperLinkBack" runat="server"><img src="/images/judge/back.png" alt="返回" />返回</asp:HyperLink>
                        </asp:Panel>
                    </div>

                </div>
            </div>

            <div style="width: 900px;">
                <div style="width: 280px; float: right; text-align: right;">


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
                                                <td width="55%" style="padding-right: 12px; border-right: 2px  dashed rgb(226,226,226);">
                                                    <%--试题内容--%>
                                                    <!--div class="titleText"><div> 题面内容：</div> </div-->
                                                    <div class="text">
                                                        <div>
                                                            <div style="text-align: left; padding: 10px; width: 100%;" class="div_content" id="div_content" runat="server">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!--div class="titleText"> <div>  参考答案：</div>  </div-->
                                                    【评分标准】
                                                <div class="text">
                                                    <div>
                                                        <%-- 参考答案--%>
                                                        <asp:Literal ID="ltr_standardAnswer" runat="server" Visible="false"></asp:Literal>
                                                    </div>
                                                </div>
                                                </td>
                                                <td valign="top" style="padding-left: 18px;">
                                                    <div class="titleText">
                                                        <div>
                                                            学生答案：
                                                        </div>
                                                    </div>
                                                    <div class="text">
                                                        <div>
                                                            <%-- 学生答案--%>
                                                            <asp:Literal ID="ltr_StudentStringAnswer" runat="server"></asp:Literal>
                                                            <asp:LinkButton ID="actual_answer" Visible="false" CommandName="GETACTUALANSWER"
                                                                CommandArgument='<%#Eval("ID") %>' runat="server" Text="获取附件" />

                                                            (试题原始材料附件：<asp:HyperLink ID="attachment" runat="server" Visible="false">HyperLink</asp:HyperLink>)
                                                            <asp:Panel ID="Panel_OnlineView" Style="display: inline" Visible="false" runat="server">
                                                                |

                                                        <a href="JudgeDetail2.aspx?CommandName=GETACTUALANSWER&CommandArgument=<%#Eval("ID") %>" onclick="return openoffice.call(this,'<%# (Eval("StudentSubjectFileName")+"").Split('.').Last() %>')">在线查看</a>
                                                            </asp:Panel>
                                                        </div>
                                                    </div>
                                                    <div class="titleText">
                                                        <div>
                                                            判分操作：<asp:Label Style="font-weight: normal" ID="Label3" runat="server" Text='<%#Eval("ProblemScore","(该题总分：{0} 分)") %>'></asp:Label>
                                                        </div>
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
                                                                                <td></td>
                                                                                <td align="left">
                                                                                    <div id='<%#Eval("ID", "jb_{0}")%>'>
                                                                                    </div>
                                                                                    <input id='<%#Eval("ID", "Hidden_ProblemScore{0}")%>' value='<%#Eval("ProblemScore") %>'
                                                                                        type="hidden" />
                                                                                    <input id='<%#Eval("ID", "Hidden_JudgeStandardCount{0}")%>' value='<%#Eval("JudgeStandardCount") %>'
                                                                                        type="hidden" />
                                                                                    <input id='<%#Eval("ID", "Hidden_Score{0}")%>' type="hidden" />
                                                                                    <input id='<%#Eval("ID", "save{0}")%>' style="margin: 10px auto 10px 210px; width: 100px; height: 29px;"
                                                                                        type="button" onclick="save(this)" value="给分" />
                                                                                    <span id='<%#Eval("ID","tips{0}") %>'></span>
                                                                                    <br />
                                                                                    <span id='<%#Eval("ID","nextTips{0}") %>'
                                                                                        class="nextTips" style="display: none; color: Red"></span>
                                                                                    <div style="color: Gray; font-size: 11px;">
                                                                                        小贴士：输完分后可直接按【Enter】键保存，并按【F5】跳到下一题<br />
                                                                                        快捷提示：请在按【Enter】键并看到成功提示后，再按【F5】键。
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </table>

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
                        <asp:HyperLink ID="HyperLinkNext" onclick="return NextASD();" runat="server"> <div class="nextLinkTextParent"><span id="nextLinkText">下一题 >></span> </div></asp:HyperLink>

                    </div>
                </div>
            </div>
        </div>

        <asp:HiddenField ID="HiddenFieldExamID" ClientIDMode="Static" runat="server" />
        <asp:HiddenField ID="HiddenFieldUserID" ClientIDMode="Static" runat="server" />
        <asp:HiddenField ID="HiddenFieldASDID" ClientIDMode="Static" runat="server" />
        <asp:HiddenField ID="HiddenFieldJudgerType" ClientIDMode="Static" runat="server" />
        <asp:HiddenField ID="HiddenFieldTotalTimesOnRound1" ClientIDMode="Static" runat="server" />
        <asp:HiddenField ID="HiddenFieldAmbiguousID" ClientIDMode="Static" runat="server" />
        <asp:HiddenField ID="HiddenFieldJudgeDetailID" ClientIDMode="Static" runat="server" />
        <asp:HiddenField ID="HiddenFieldIamArbiter" ClientIDMode="Static" runat="server" />
        <asp:HiddenField ID="HiddenFieldJudgeVersion" ClientIDMode="Static" Value="2" runat="server" />
        <asp:Label ID="Label1" runat="server"></asp:Label>
        <p class="body">
        </p>

    </form>
    <div style="position: absolute; left: -10000px; top: -10000px; z-index: -10000; zoom: 1; width: 1px; height: 1px; overflow: hidden; display: none" id="office-container">
        <object width="800" id="office" height="600" classid="clsid:e77e049b-23fc-4db8-b756-60529a35fad5" codebase="scripts/activex/weboffice.cab#version=6,0,5,0"></object>
    </div>



</body>
</html>
