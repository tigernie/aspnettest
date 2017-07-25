<%@ Page Title="" Language="C#"  MasterPageFile="~/JudgeManage.Master" AutoEventWireup="true" CodeBehind="JudgeManageManualProgress.aspx.cs" Inherits="Web.JudgeManage.JudgeManageManualProgress" %>

<%@ Register   tagPrefix="JudgeManage" tagName="ProgressSumary" src="~/ExamJudgeProgressSumary.ascx" %>
 <%@ Register   tagPrefix="JudgeManage" tagName="RoundFirstJudgeProgress" src="~/UserControl/RoundFirstJudgeProgress.ascx" %>
 <%@ Register   tagPrefix="JudgeManage" tagName="RoundFirstJudgeFinshedASD" src="~/UserControl/RoundFirstJudgeFinshedASD.ascx" %>
 
 
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
<style type="text/css">
    ul.mtabs { font-weight:bold; color:White; margin:10px 0;}
    ul.mtabs li.current  {color:#0c7698;}
    ul.groups{border-right:1px solid #efefef; height:30px; vertical-align:middle;  width:100%; background-attachment:scroll; background-position:center;  background-repeat:repeat-x; background-image:url(images/judge/group_tab_bg.png);}
    ul.groups li{ float:left; vertical-align:middle; height:28px; list-style:none;  }
    ul.groups li > span{border-left:1px solid #e5e5e5;  height:28px; padding:auto  11px auto 11px;  }
    ul.groups li span span{ margin:auto 10px; height:28px; }
    ul.groups li:first-child{  margin-left:10px; }
    ul.groups li:first-child a{border-left:0 none;}
    ul.groups li.cur{ background-repeat:repeat-x;  background-image:url(images/judge/group_tab_bg_cur.png); }
    table.list th { text-align: center; padding: 0 4px;    background: url(../images/th-bg.gif) repeat-x ;  color: #056d80; line-height: 30px;  }
  table#ctl00_ContentPlaceHolder1_RoundFirstJudgeFinshedASD1_gridViewAmbiguousDetailList tr  th 
  {   background: url(../images/th-bg.gif) repeat-x ;  line-height: 20px;  background-position:bottom;  }
    table.JGroupDetailList tbody td{ text-align:center;}
    div.jgDetailsTabs{ }
    table tbody tr td ,table,table th{  border:0 none; border-spacing:0;}
    div.jgroup_detail_tab{ float:left;}
    .jgroup_detail_tab span { background-color:rgb(255,181,137);width:95px;  margin:0 10px 0 10px; padding:5px 8px;  height:20px;}
    .jgroup_detail_tab span  a{ color:rgb(220,116,53); } 
    .jgroup_detail_tab_Current span { background-color:rgb(241,129,61);}
    .jgroup_detail_tab_Current span a{color:White; }
    .jgroup_detail_tab_Current{background-image:url(images/judge/tab_selected2.png); background-position:50% 24px; background-repeat:no-repeat; height:35px }
    .tabs_span{ text-decoration:none;  cursor:pointer;}
    .tabs_span:hover{ text-decoration:underline;}
</style>
   
    <script type="text/javascript">

        //要求参数形式：[{'id':1,'name':'a'},{'id':2,'name':'b'}]
        function renderGroups(groupDics) {//自动生成切换组的Tab

            var htmlStr = '';
            htmlStr += '<ul class="groups">';
            var i = 1;
            $.each(eval(groupDics), function (index, item) {
                if (i == 1) {
                    htmlStr += '<li class="cur">';
                    i = 0;
                }
                else {
                    htmlStr += '<li>';
                }

                htmlStr += '<span class="tabs_span"  onclick="switchGroup(this,' + item.id + ');"><span>' + item.name + '</span></span></li>';

            })
            htmlStr += '</ul>';
            $("#groups").append(htmlStr);
        }


        var _sender_onSwicthJGroup;

        function switchGroup(sender, id) {//切换阅卷小组
            _sender_onSwicthJGroup = sender;

            $("#HiddenFieldCurrentJGroupID").val(id);
            setCurrentGroupTab(sender);
            $("#refreshBtn").click();
        }

        function setCurrentGroupTab(sender) {
            $("#groups ul li").each(function () { $(this).attr('class', ''); });
          
            $(sender).parent().attr('class', 'cur');
        
        }

        //切换小组详情中的选项卡
        function switchJGroupDetailTab(sender, e) {
            $("#JGroupDetailTab .jgroup_detail_tab").each(function () { $(this).removeClass('jgroup_detail_tab_Current'); });

            if (e == 1) {//显示初评进度

                showFirstJudgeProgressTab();
                
            }
            else if (e == 2) {//显示已初评的题目

            showFirstJudgeFinshedASDTab();
            
            }

            $(sender).parent().parent().addClass('jgroup_detail_tab_Current');
        }

        function showFirstJudgeProgressTab() {
            $("#FirstJudgeProgressTab").css('display', '');
            $("#FirstJudgeFinshedASDTab").css('display', 'none');
        }

        function showFirstJudgeFinshedASDTab() {
            $("#FirstJudgeProgressTab").css('display', 'none');
            $("#FirstJudgeFinshedASDTab").css('display', '');
        }

        HashManager = function () { }


        function ReceiveData(data) { //回调成功后调用

            if (data == "ok") {
               alert(1)
                setCurrentGroupTab(_sender_onSwicthJGroup); //切换小组成功
                //$("#refreshBtn").click();
              
            }
        }
        $(function () {
            teacher.getMyInfo();
        });
      
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <asp:ScriptManagerProxy ID="ScriptManagerProxy2" runat="server">
    </asp:ScriptManagerProxy>
<div style=" float:right; margin-right:30px; margin-top:6px;">
    <asp:HyperLink ID="hyperLnk_back" runat="server">返回</asp:HyperLink>
    </div>
 
   <ul class="mtabs"  style=" clear:both;">
   <li class="current">分组进度</li>
   <li>
       <asp:HyperLink ID="HyperLinkProficientProgress" runat="server">已阅答题</asp:HyperLink></li>
   <li>
       <asp:HyperLink ID="HyperLinkWholeProgress" runat="server">整体进度</asp:HyperLink></li>
        </ul>
  
  <div style=" border:1px solid #eee;">
        <div id="groups">
        </div>
    <span style=" display:none;">  
    <a href="#groups" id="toTabs">xxx</a>
        <asp:HiddenField ID="HiddenFieldCurrentJGroupID" ClientIDMode="Static" runat="server" />
    <asp:Button ID="refreshBtn" ClientIDMode="Static" runat="server" Text="" />
    </span>
    
      <asp:UpdatePanel ID="UpdatePanel1" UpdateMode="Conditional" runat="server">
          <Triggers>
              <asp:AsyncPostBackTrigger ControlID="refreshBtn" EventName="Click" />
          </Triggers>
          <ContentTemplate>
        <div style=" clear:both; margin:10px auto;">
            <img src="images/judge/Jgroup_about.png" alt="小组阅卷概括" />
            </div>
    <table class="list" style=" margin-bottom:0;">
        <tbody>
            <tr>
                <td style=" width:200px; vertical-align:middle;  background-color:#f7f7f7; text-align:right;  padding-right:30px;" >
                    该组负责的模块：
                </td>
                <td>
                    <asp:Label ID="LabelKpOfNames" runat="server" Text="Label"></asp:Label>
                </td>
            </tr>
            <tr>
                <td style=" width:200px; vertical-align:middle;  background-color:#f7f7f7; text-align:right;  padding-right:30px;" >
                    该组组长：
                </td>
                <td>
                    <asp:Label ID="LabelJGroupLeaderName" runat="server" Text="Label"></asp:Label>
                </td>
            </tr>
            <tr>
                <td style=" width:200px; vertical-align:middle;  background-color:#f7f7f7; text-align:right;  padding-right:30px;" >
                    该组总题数：
                </td>
                <td>
                    <asp:Label ID="LabelTotalASDByTeacher" runat="server" Text="Label"></asp:Label>
                </td>
            </tr>
        </tbody>
    </table>
<JudgeManage:ProgressSumary ID="ProgressSumary"   runat="server"></JudgeManage:ProgressSumary>

<div  style=" margin:10px 0 10px 0;">
    <img src="images/judge/Jgroup_detail.png" alt="小组阅卷详情" />
    </div>
              <div id="JGroupDetailTab" style="width: 100%; height: 30px;  display:none;">
                  <div class="jgroup_detail_tab jgroup_detail_tab_Current">
                      <span><a href="#JGroupDetailTab" onclick="switchJGroupDetailTab(this,1)">初评进度</a>
                      </span>
                  </div>
                  <div class="jgroup_detail_tab" style=" display:none;">
                      <span><a href="#JGroupDetailTab" onclick="switchJGroupDetailTab(this,2)">一轮后有歧义的答题</a>
                      </span>
                  </div>
              </div>
   <div class="jgDetailsTabs">
       <div id="FirstJudgeProgressTab">
           <JudgeManage:RoundFirstJudgeProgress ID="RoundFirstJudgeProgress1" runat="server">
           </JudgeManage:RoundFirstJudgeProgress>
       </div>
       <div id="FirstJudgeFinshedASDTab"  style=" display:none;">
        
           <JudgeManage:RoundFirstJudgeFinshedASD  ID="RoundFirstJudgeFinshedASD1" runat="server">
           </JudgeManage:RoundFirstJudgeFinshedASD>

       </div>
   </div>

    <script type="text/javascript">
        showFirstJudgeProgressTab();
    </script> 
</ContentTemplate>
 </asp:UpdatePanel>

</div>
    <script type="text/javascript">
        showFirstJudgeProgressTab();
    </script> 

</asp:Content>
