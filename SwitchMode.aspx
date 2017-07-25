<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SwitchMode.aspx.cs" Inherits="Web.SwitchMode" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:Button ID="SwitchToExamMode" runat="server" Text="切换至最后一次考试状态" OnClick="SwitchToExamMode_Click" OnClientClick="return confirm('您确定要切换至最后一次考试的状态？');" />
    </div>
    </form>
</body>
</html>
