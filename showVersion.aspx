<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="showVersion.aspx.cs" Inherits="Web.showVersion" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <table>
                <thead>
                    <tr><td colspan="2">系统程序集清单</td></tr>
                </thead>
                <tr>
                    <td>Adapter版本：</td>
                    <td><asp:Label ID="AdapterVersion" runat="server" Text="Label"></asp:Label></td>
                </tr>
                <tr>
                    <td>BLL版本：</td>
                    <td><asp:Label ID="BLLVersion" runat="server" Text="Label"></asp:Label></td>
                </tr>
                <tr>
                    <td>DAL版本：</td>
                    <td><asp:Label ID="DALVersion" runat="server" Text="Label"></asp:Label></td>
                </tr>
                <tr>
                    <td>Framework版本：</td>
                    <td><asp:Label ID="FrameworkVersion" runat="server" Text="Label"></asp:Label></td>
                </tr>
                <tr>
                    <td>Model版本：</td>
                    <td><asp:Label ID="ModelVersion" runat="server" Text="Label"></asp:Label></td>
                </tr>
                <tr>
                    <td>Web版本：</td>
                    <td><asp:Label ID="WebVersion" runat="server" Text="Label"></asp:Label></td>
                </tr>
            </table>

        </div>
    </form>
</body>
</html>
