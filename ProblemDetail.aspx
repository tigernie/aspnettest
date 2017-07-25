<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ProblemDetail.aspx.cs"
    Inherits="Web.ProblemDetail" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href="styles/style.css" rel="stylesheet" type="text/css" />
    <link href="styles/style_webForms.css" rel="stylesheet" type="text/css" />

    <style type="text/css">
    .titleText
    {
        background-color:#e1e1e1;
        width:500px;
        height:30px;
    
    }
    .text
    {
        padding-top:5px;
        padding-left:15px;
    }
    
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div style=" padding:9px; width:500px; margin:0 auto;">
        <div class="titleText"><div class="text">题目内容：</div></div>

        <div class="text"><asp:Literal ID="Literal2" runat="server"></asp:Literal></div><br />
        <div class="titleText"><div class="text">参考答案：</div></div>
        <div class="text"><asp:Literal ID="Literal3" runat="server"></asp:Literal></div><br />
        <div class="titleText"><div class="text">学生答案：</div></div>
        <div class="text"><asp:Literal ID="Literal1" runat="server"></asp:Literal>
            <asp:LinkButton ID="LinkButton1" runat="server" onclick="Button1_Click">下载答案</asp:LinkButton>
        </div>
    </div>
    </form>
</body>
</html>
