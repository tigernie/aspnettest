<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="JudgerTaskSize.aspx.cs" Inherits="Web.JudgerTaskSize" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
        <link href="styles/style.css" rel="stylesheet" type="text/css" />
    <link href="styles/style_webForms.css" rel="stylesheet" type="text/css" />
</head>
<body>
    <form id="form1" runat="server">
    <div class="">
        <asp:GridView GridLines="None" ID="GridView1" runat="server" AutoGenerateColumns="false" CssClass="list">
        <Columns>
        <asp:BoundField DataField="Username" ItemStyle-HorizontalAlign="Center" HeaderText="用户名" />
        <asp:BoundField DataField="Realname" ItemStyle-HorizontalAlign="Center" HeaderText="姓名" />
        <asp:BoundField DataField="TaskSize" ItemStyle-HorizontalAlign="Center" HeaderText="任务量" />
       
        </Columns>
        <EmptyDataRowStyle  VerticalAlign="Middle" />
        <EmptyDataTemplate>  <div style="text-align: center">
                                    未查找到符合条件的数据
                                </div></EmptyDataTemplate>
        </asp:GridView>
    </div>
    </form>
</body>
</html>
