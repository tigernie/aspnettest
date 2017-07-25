<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ClearMachineCode.aspx.cs" Inherits="Web.ClearMachineCode" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
       清除密码： <asp:TextBox ID="TextBox1"  TextMode="Password" runat="server"></asp:TextBox><asp:Button ID="Button1" runat="server" Text="确定" OnClick="Button1_Click" />
    </div>

    </form>
</body>
</html>
