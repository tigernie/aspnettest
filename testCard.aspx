<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="testCard.aspx.cs" Inherits="Web.testCard" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="UTF-8">
    <title></title>
    <style>
        table td {
         border:1px solid black;
         border-collapse:collapse;
         height:55px;
         width:120px;
         font-size:16px;
        }
        table {
          border-collapse: collapse;
          margin:auto;
        }
        .title {
          text-align:right;
          width:100px;
          padding-right:10px;
          font-weight:bold;
        }
        .img {
         width:118px;
         vertical-align:middle;
        }
        img {
          width:114px;
          height:160px;
        }

    </style>
</head>
<body>
    <h1>全国反假货币培训考试</h1>
    <h2>准考证</h2>
    <div style="width:100%;">
        <table style="" cellpadding="0" cellspacing="0">
            <tr>
                <td class="title">考试名称</td>
                <td colspan="3"><label id="examName"></label></td>
                <td rowspan="3" class="img"><img src="" /></td>
            </tr>
            <tr>
                <td class="title">考生编号</td>
                <td colspan="3" ><label id="testcardNumber"></label></td>
            </tr>
            <tr>
                <td class="title">考生姓名</td>
                <td><label id="name"></label></td>
                <td class="title">性别</td>
                <td><label id="sex"></label></td>
            </tr>
            <tr>
                <td class="title">身份证号码</td>
                <td colspan="4"><label id="idcardNumber"></label></td>
            </tr>
            <tr>
                <td class="title">考生单位</td>
                <td colspan="4"><label id="company"></label></td>
            </tr>
            <tr>
                <td class="title">考试时间</td>
                <td colspan="4"><label id="examTime"></label></td>
            </tr>
            <tr>
                <td class="title">考场名称</td>
                <td colspan="4"><label id="examRoom"></label></td>
            </tr>
        </table>
    </div>
</body>
</html>
