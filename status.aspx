<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="status.aspx.cs" Inherits="Web.status" %>

<!DOCTYPE html>

<html>
<head>
<meta charset="utf-8"/>
<title>用户状态管理</title>
</head>
<body>
<form id="statusForm" runat="server">
<table border="1" cellspacing="0">
    <thead>
        <tr>
            <th>登录名</th>
            <th>姓名</th>
            <th>用户类型</th>
            <th>登录IP</th>
            <th>登录时间</th>
            <th>最后活动时间</th>
            <th>操作</th>
        </tr>
    </thead>
    <tbody>
        <asp:repeater runat="server" id="onlineList">
            <itemtemplate>
                <tr>
                    <td><%# Eval("UserName") %></td>
                    <td><%# Eval("RealName") %></td>
                    <td><%# Eval("UserType") %></td>
                    <td><%# Eval("IP") %></td>
                    <td><%# Eval("LogonTime", "{0:hh:mm:ss}") %></td>
                    <td><%# Eval("LastActivityTime", "{0:hh:mm:ss}") %></td>
                    <td><a href="?kick=<%# Eval("UserID") %>">踢下线</a></td>
                </tr>
            </itemtemplate>
        </asp:repeater>
    </tbody>
</table>
</form>
</body>
</html>
