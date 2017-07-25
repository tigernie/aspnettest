<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="OrgImport.aspx.cs" Inherits="Web.OrgImport" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    </div>
        <asp:FileUpload ID="FileUpload1" runat="server" />
        <asp:Button ID="Button1" runat="server" OnClick="Button1_Click" Text="上传" />
    </form>
    <label runat="server" id="Errors"></label>
</body>
</html>
