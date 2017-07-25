<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="login2.aspx.cs" Inherits="Web.login2" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>阅卷教师登录</title>
<meta http-equiv="x-ua-compatible" content="IE=9; IE=8; IE=7; IE=EDGE" />
<style type="text/css">
* { margin: 0; padding: 0; }
body, td, th { font-size: 14px; font-family: 微软雅黑; }
body { background:url(images/loginbg.teacher.png) repeat-x top left; }
th { text-align: left; }
form { width: 1000px; height: 533px; position: relative; background: url("images/login2.teacher.png") no-repeat; margin: 0 auto; overflow: hidden; }
input.text { height: 33px; line-height: 32px; background-image: url(images/login.input.png); border: none; width: 170px; padding: 0 5px; }
button { background: none; border: none; width: 129px; height: 33px; background: url("images/login2.btn.png"); cursor: pointer; }
table { position: absolute; top: 240px; left: 560px; }
#msg { font-weight:bold; color:red; }
</style>
<script src="scripts/jquery-1.7.min.js" type="text/javascript"></script>
<script type="text/javascript" src="scripts/common.js"></script>
<script type="text/javascript">
    $(function () {
        $('#version').load('/version.txt');
    });
</script>
</head>
<body>
<!--[if lte ie 7]>
<style type="text/css">
.badie { height: 70px; padding: 50px 0 0 0; text-align: center; font-size: 20px; background: yellow; border-bottom:2px solid silver; }
body { background-position-y: 24px; }
</style>
<div class="badie"><img src="images/warning.png"/> 为了保证各项功能的正常使用，请使用IE8或以上版本的IE浏览器。</div>
<![endif]-->
<form method="post" class="tl">
<table width="300" border="0" cellpadding="0" cellspacing="5">
	<tr>
		<td height="40" width="80" nowrap="nowrap" align="right">用户名：</td>
		<td><input value="" type="text" name="uname" id="uname" class="text" /></td>
	</tr>
	<tr>
		<td height="40" nowrap="nowrap" align="right">密　码：</td>
		<td><input value="" name="upass" type="password" id="upass" class="text" /></td>
	</tr>
    <tr>
        <td align="right">身　份：</td>
        <td align="left"><select name="identity">
            <option value="1">阅卷组老师</option>
            <option value="2">阅卷组组长</option>
            <option value="3">专家</option>
        </select></td>
    </tr>
	<tr>
		<td height="50"></td>
		<td align="left" valign="bottom"><button type="submit"></button></td>
	</tr>
</table>
</form>
<div id="msg_checkOnline" style=" display:none;"></div>
<div class="copyright" align="center">版权所有 © 2013-2015 中国人民银行</div>
<div class="copyright" align="center" id="version"></div>
</body>
</html>
