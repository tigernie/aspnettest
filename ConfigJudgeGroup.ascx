<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="ConfigJudgeGroup.ascx.cs" Inherits="Web.ConfigJudgeGroup" %>
<%--<script src="scripts/PopWindow/gzy.popup.js" type="text/javascript"></script>--%>
 <script type="text/javascript">

     //以下是选择知阅卷老师和组长部分////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     //参数1表示，选择的是组长，组长只能选一个人；0表示阅卷老师

     var __identity = '';//选择时的全局变量

     var _selectJudgerPanel;


     function selectJudger(identity) {
         var examid = $("#HiddenField_ExamID").val();
         __identity = identity;
         _selectJudgerPanel = new gzy.popup('选择阅卷老师', 800, 480, { url: 'Widget/SelectJudger.aspx?id=' + examid + '&identity=' + identity,
             buttons: [{ text: '确定', isCancel: false, click: confirmSelect}]
         });
     }

     var selectedUserIDs = '';
     var selectedGroupLeaderID = '';
     function confirmSelect() {
       
         if (__identity == '0') {//确认阅卷老师
              selectedUserIDs = getUserIDs();
             var selectCount = 0;
             if (selectedUserIDs.length > 0) {
                 selectCount = selectedUserIDs.split(',').length;
             }
             $("#selectedTeacherSpan").html("已经选择" + selectCount + "人");
           
         }
         else if (__identity == '1') {
             selectedGroupLeaderID = getUserIDs();
             $("#selectedGroupLeader").html(getUserNames());
             
         }
         _selectJudgerPanel.close();
     }

     function getUserIDs() {

         var ids = "";
        
         _selectJudgerPanel.body.find("#SelectUser1_selectedTeacherList option").each(function () {

             ids += $(this).val() + ",";
             
         });
         ids = ids.substr(0, ids.length - 1);
         return ids;
     }

     function getUserNames() {
        
         var names = "";
         _selectJudgerPanel.body.find("#SelectUser1_selectedTeacherList option").each(function () {

            
             names += $(this).text() + ",";
         });
         names = names.substr(0, names.length - 1);
         return names;
     }


     //以下是选择知识点部分////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

     var _selectKpPanel;
     function selectKP() {
         var examid = $("#HiddenField_ExamID").val();
         _selectKpPanel = new gzy.popup('选择知识点模块', 550, 260, { url: 'Widget/SelectKP.aspx?id=' + examid,
             buttons: [{ text: '确定', isCancel: false, click: confirmSelectKP}]
         });
     }


    //获取选择的知识点ID
     function getSelectedKpIds() {
         var _SelectedKpids = '';
         $(_selectKpPanel.body.find('#kpList input:checked')).each(
         function () {
             _SelectedKpids += $(this).parent().attr('class') + ',';
         }
           );
         _SelectedKpids = _SelectedKpids.substr(0, _SelectedKpids.length - 1);
         return _SelectedKpids

     }

 var _SelectedKpids = '';
     function confirmSelectKP() {
        
         _SelectedKpids = getSelectedKpIds();
         $("#selectedKpSpan").html("已经选择" + _SelectedKpids.split(',').length + "个知识点");
         _selectKpPanel.close();
     }

    
 </script>

 

<table class="configJGroup" cellpadding="0" cellspacing="0" style="   background-color:#eee; margin:8px; width:430px;  ">
    <tbody>
        <tr>
            <td class="t1">
                组名：
            </td>
            <td>
                <asp:TextBox ID="TextBox1" runat="server"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td class="t1">
                组长：
            </td>
            <td>
                <span id="selectedGroupLeader"></span><a href="#" onclick="selectJudger(1)">选择组长</a>
            </td>
        </tr>
        <tr>
            <td class="t1">
                知识点模块：
            </td>
            <td>
                <span id="selectedKpSpan"></span><a href="#" onclick="selectKP()">选择模块</a>
            </td>
        </tr>
        <tr>
            <td class="t1">
                阅卷老师：
            </td>
            <td>
                <span style="" id="selectedTeacherSpan"></span><a href="#" onclick="selectJudger(0)">
                    选择老师</a><span style=" color:Red;"><asp:Literal ID="Literal1" runat="server"></asp:Literal></span>
            </td>
        </tr>
    </tbody>
</table>
<span style=" margin:12px;  font-style:normal; font-variant:normal; font-size:12px; color:#777;">注意：同一位老师不能同时既是组长又是组员。</span>
<asp:HiddenField ID="HiddenField_ExamID" ClientIDMode="Static" runat="server" />


