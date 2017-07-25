<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Signup.aspx.cs" Inherits="Web.Signup" %>

<!DOCTYPE html>

<html>
<head>
    <title>考试报名系统</title>
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <style type="text/css">
        body, td, th {
            font-size: 12px;
            color: #333;
        }

        BODY {
            MARGIN: 0px;
            FONT-FAMILY: "宋体";
            COLOR: #3e3e3e;
            FONT-SIZE: 12px;
        }

        .m2 {
            BORDER-LEFT: #e3e3e3 1px solid;
            WIDTH: 800px;
            BORDER-RIGHT: #e3e3e3 1px solid;
        }

        .m2-text {
            PADDING-BOTTOM: 10px;
            LINE-HEIGHT: 24px;
            PADDING-LEFT: 10px;
            PADDING-RIGHT: 10px;
            COLOR: #0377b2;
            FONT-SIZE: 14px;
            PADDING-TOP: 10px;
        }

        .footer2 {
            TEXT-ALIGN: center;
            BORDER-LEFT: #e3e3e3 1px solid;
            PADDING-BOTTOM: 20px;
            LINE-HEIGHT: 24px;
            PADDING-LEFT: 20px;
            WIDTH: 800px;
            PADDING-RIGHT: 20px;
            FONT-FAMILY: Arial, Helvetica, sans-serif;
            BACKGROUND: #f5f5f5;
            FONT-SIZE: 12px;
            BORDER-RIGHT: #e3e3e3 1px solid;
            PADDING-TOP: 20px;
        }

        .search_table {
            font-size: 12px;
            margin-top: 17px;
        }

        .search_form {
            BORDER-BOTTOM: #bbb 1px solid;
            BORDER-LEFT: #bbb 1px solid;
            HEIGHT: 18px;
            BORDER-TOP: #bbb 1px solid;
            BORDER-RIGHT: #bbb 1px solid;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <table align="center" class="header" border="0" cellspacing="0"
            cellpadding="0">
            <tbody>
                <tr>
                    <td width="800" height="120" align="center" bgcolor="#216397">
                        <strong><span style="font-size: 30px; color: #ffffff">反假货币培训考试<br />考试报名</span>
                            <span style="font-size: 18px; color: #ffffff"></span></strong>
                    </td>
                </tr>
            </tbody>
        </table>

        <input type="hidden" name="table" value="RKCJCX_RKCJCX">
        <input type="hidden" name="unitId" value="100">
        <input type="hidden" name="type" value="2">
        <table class="m2" border="0" cellspacing="0" cellpadding="0"
            align="center" id="table1">
            <tbody>
                <tr>
                    <td height="246" valign="top" align="center">
                        <p></p>
                        <p>&nbsp;</p>
                        <table border="0" cellspacing="0" cellpadding="0" width="0"
                            align="center">
                            <tbody>
                                <tr>
                                    <td height="29" colspan="2" bgcolor="#FFFFFF"></td>
                                </tr>
                                <tr>
                                    <td width="6" bgcolor="#98CDEF">
                                        <h6>&nbsp;
                                        </h6>
                                    </td>
                                    <td width="379" bgcolor="#98CDEF" valign="top">
                                        <br>
                                        <table width="0" align="center" class="search_table"
                                            border="0" cellspacing="8" cellpadding="0">
                                            <tbody>
                                                <tr>
                                                    <td>身份证号
                                                    </td>
                                                    <td width="207">
                                                        <asp:TextBox ID="TestCardNumber" runat="server"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="64">姓名
                                                    </td>
                                                    <td>
                                                        <asp:TextBox ID="RealName" runat="server"></asp:TextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td >
                                                        选择考试
                                                    </td>
                                                    <td>
                                                        <asp:DropDownList ID="ExamSelector" runat="server" ClientIDMode="Static">
                                                        </asp:DropDownList>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td height="40" colspan="2" align="center" valign="bottom">
                                                        <asp:Button ID="Button1" runat="server" Text="登  录" OnClick="Button1_Click" />

                                                        <asp:Button ID="Button2" runat="server" Text="注  册" OnClick="Button2_Click" />
                                                           <asp:Button ID="Button3" runat="server" Text="下载准考证" OnClick="Button3_Click" />
                                                        <a style="text-decoration:none;color:blue;" href="/ScoreQuery.aspx">成绩查询</a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table width="100%">
                                            <tbody>
                                                <tr>
                                                    <td align="center">&nbsp;
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="center">&nbsp;
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>



        <table class="m2" border="0" cellspacing="0" cellpadding="0" align="center">
            <tr>
                <td>&nbsp;
                </td>
            </tr>
            <tr>
                <td>&nbsp;
                </td>
            </tr>
            <tr>
                <td>&nbsp;
                </td>
            </tr>
        </table>
    </form>
</body>
<script type="text/javascript">




    function myReset() {
        var form = document.forms[0];
        form.reset();
        var isCheck = "";
        if (isCheck == 'Y') {
            form.yzm.value = "";
        }
    }
    function sub() {
        var ZKZH = document.all('columns[0].property').value;
        var SFZH = document.all('columns[1].property').value;
        var KSCD = document.all('columns[2].property').value;
        var xm = document.all('columns[3].property').value;
        if (xm == null || xm.trim() == "") {
            alert("姓名不能为空!");
            return false;
        }
        if (KSCD == "" || KSCD == null) {
            alert("考试时间不能为空!");
            return false;
        }
        var patrn = /^[0-9]{12}$/g;
        ZKZH = ZKZH.trim();
        var boo = patrn.test(ZKZH);
        if (SFZH.trim() == "" && ZKZH.trim() == "") {
            alert("身份证号、准考证号二者必填一项!");
            return false;
        }
        if (SFZH.trim() != "") {
            if (getLength(SFZH) > 18) {
                alert('身份证号不能大于18个字符！');
                return false;
            }
        }
        if (ZKZH.trim() != "") {
            if (!boo) {
                alert("准考证号应该是12位的数字格式!");
                return false;
            }
        }

        if (!checkSpecialChar(document.all('columns[0].property'), ZKZH)) {
            document.all('columns[0].property').focus();
            return false;
        }

        if (!checkSpecialChar(document.all('columns[1].property'), SFZH)) {
            document.all('columns[1].property').focus();
            return false;
        }
        if (!checkSpecialChar(document.all('columns[3].property'), xm)) {
            document.all('columns[3].property').focus();
            return false;
        }

        if (document.all.verifyData.value == null || document.all.verifyData.value == '') {
            alert('校验码不能为空！');
            document.all('verifyData').focus();
            return false;
        }
        document.all('columns[1].property').value = SFZH.toUpperCase();
        document.forms[0].submit();
    }
    function re() {
        document.all('table1').style.display = '';
        document.all('table2').style.display = 'none';
    }
    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    };
    //校验特殊字符
    function checkSpecialChar(obj, txt) {
        var patrn = /[\"\'<>,.*?%=/\\]/;
        if (patrn.exec(txt)) {
            alert("不能包含特殊字符\"\'<>,.*?%=/\\");
            obj.value = "";
            return false;
        }
        return true;
    }
    function loadImage() {
        var t = new Date();
        document.all.pic.src = 'createImageAction.do?method=getImg&t=' + t;
    }
    // 获取参数的字符长度，汉字为2个，英文数字为1个
    function getLength(field) {
        var temp_1 = field.replace(/[^\x00-\xff]/g, "xx");
        var temp_2 = temp_1;// .replace(/·/g,"xx"); 64位机器不认识·
        var iLength = temp_2.length;
        return iLength;
    }
    loadImage();
</script>

<script language="javascript">
    var message = "";
    if (message != "") {
        alert(message);
    }
</script>
</html>
