<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SelectJudger.aspx.cs" Inherits="Web.Widget.SelectJudger" %>


<%@ Register TagPrefix="JM" TagName="SelectUser" Src="~/UserControl/SelectUserByRegionGroupControl.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script src="../scripts/jquery-1.7.min.js" type="text/javascript"></script>

     <script type="text/javascript">

//         function ReveiceDataFromServerWhenCallBack(result) {
//             alert(result);
//         }

//         function getUserIDs() {

//             var ids="";
//             $("#SelectUser1_selectedTeacherList option").each(function () {

//                 ids += $(this).val() + ",";
//             });
//             ids = ids.substr(0, ids.length - 1);
//             return ids;
//         }

       
 </script>

</head>
<body style=" overflow:hidden;">
    <form id="form1" runat="server">
    <div>
        <asp:ScriptManager ID="ScriptManager1" runat="server">
        </asp:ScriptManager>
    <JM:SelectUser ID="SelectUser1" runat="server" />

   
    </div>
    </form>
</body>
</html>
