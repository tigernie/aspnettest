<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="centerExamView.aspx.cs" Inherits="Web.centerExamView" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>中心对接考试</title>
    <link href="styles/style.css" rel="stylesheet" type="text/css" />
    <link href="styles/center.css" rel="stylesheet" type="text/css" />
    <link href="styles/style_webForms.css" rel="stylesheet" type="text/css" />
    <link href="styles/centerexamInfoView.css" rel="stylesheet" type="text/css" />
    <script src="scripts/jquery-1.7.min.js" type="text/javascript"></script>
    <script src="scripts/TabSet/gzy.tabset.v3.js"></script>
    <script src="scripts/PopWindow/gzy.popup.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/common.js"></script>
    <script src="scripts/lib/teacher.js"></script>


    <script type="text/javascript" src="scripts/centerExamView.js"></script>


    <%--<script src="/script.ashx?teacher,center,center.ui" type="text/javascript"></script>--%>

</head>
<body>
    <form id="form1" runat="server">
        <div class="body">
            <div class="head problib" style="background: url(../images/teacher.kaowu.jpg);">
                <p>
                    <a href="javascript:;" class="user"></a>
                    <a href="teacher.htm" class="home">返回首页</a>
                    <a href="javascript:;" class="setting">系统管理</a>
                    <a href="../login.htm" class="exit">注销</a>
                </p>
            </div>

            <div class="main">
                <div style="float: right; margin-right: 10px; margin-top: 10px;"><a id="goback" style="color: #0094ff; text-decoration: none;" href="/exammgr.aspx">返回上级</a></div>
                <div class="centerexamInfoView">
                    <div class="centerExamView_title" id="examinfo">
                        <%--<a href="javascript:;" id="return-link">
                        <img src="/images/icon.gif" />返回</a>--%>
                        <h2 id="titleText"></h2>
                    </div>
                    <div class="box">
                        <label class="examCenterTitile" id="examCenterTitile"></label>
                        <label class="examCenterCode" id="examCenterCode"></label>
                        <label class="elseInfo" id="elseInfo"></label>
                    </div>
                    <div class="container" id="container">
                    </div>
                </div>
            </div>
        </div>
        <p class="body">
        </p>
        <iframe id="iframe-download" style="display: none"></iframe>
    </form>
</body>
</html>
