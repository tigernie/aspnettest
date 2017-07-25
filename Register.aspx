<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Register.aspx.cs" EnableEventValidation="false" Inherits="Web.Register" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script src="scripts/jquery-1.7.min.js"></script>
    <style>
        .title {
            text-align: right;
        }

        .required {
            color: red;
            font-size: small;
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
        <div>
            <table align="center" style="width: 800px;">
                <tr>
                    <td class="title">
                        <label class="required">*</label>
                        姓名：</td>
                    <td>
                        <asp:TextBox ID="Name" runat="server" ClientIDMode="Static"></asp:TextBox></td>

                    <td class="title">
                        <label class="required">*</label>
                        性别：</td>
                    <td>

                        <asp:DropDownList ID="Sex" runat="server" ClientIDMode="Static">
                            <asp:ListItem Text="请选择" Selected="True" Value=""></asp:ListItem>
                            <asp:ListItem Value="1" Text="男"></asp:ListItem>
                            <asp:ListItem Value="2" Text="女"></asp:ListItem>
                        </asp:DropDownList>
                    </td>
                    <td rowspan="4">
                        <label class="required">*</label>
                        照片</td>
                    <td rowspan="4">
                        <asp:Image ID="Image1" runat="server" Style="width: 91px; height: 125px;border:1px solid gray" ClientIDMode="Static" /><br />

                        <div id="important-student-container" style="width:113px; margin-bottom:10px; display:inline-block ;height:18px;overflow:hidden;background:url(/images/center/selectFile.jpg) no-repeat;text-align:right">
                            <asp:FileUpload ID="FileUpload1" ClientIDMode="Static" runat="server" style="opacity:0;width:500px;cursor:pointer;border-left:500px solid red;border-bottom:100px solid red;height:22px;filter:alpha(opacity=0)" />
                        </div>

                        <asp:Button ID="ImageUploadBtn" ClientIDMode="Static" Style="display: none" runat="server" Text="Button" OnClick="ImageUploadBtn_Click" />
                    </td>
                </tr>
                <tr>
                    <td class="title">
                        <label class="required">*</label>
                        岗位：</td>
                    <td>

                        <asp:DropDownList ID="Position" runat="server" ClientIDMode="Static" OnSelectedIndexChanged="position_SelectedIndexChanged" AutoPostBack="True">
                            <asp:ListItem Value="1">临柜</asp:ListItem>
                            <asp:ListItem Value="2">清分</asp:ListItem>
                            <asp:ListItem Value="3">鉴定</asp:ListItem>
                            <asp:ListItem Value="4">管理</asp:ListItem>
                        </asp:DropDownList>
                    </td>
                    <td class="title" style="visibility:hidden">
                        <label class="required">*</label>
                        币种：</td>
                    <td  style="visibility:hidden">
                        <asp:DropDownList ID="Currency" runat="server" ClientIDMode="Static" OnSelectedIndexChanged="position_SelectedIndexChanged" AutoPostBack="True">
                            <asp:ListItem Value="1">本币</asp:ListItem>
                            <asp:ListItem Value="2" Selected="True">本外币</asp:ListItem>
                        </asp:DropDownList>
                    </td>
                </tr>
                <tr>
                    <td class="title">
                        <label class="required">*</label>
                        身份证号：</td>
                    <td>
                        <asp:TextBox ID="IDCard" runat="server" ClientIDMode="Static"></asp:TextBox></td>

                    <td class="title">
                        <label class="required">*</label>选择考试：

                    </td>
                    <td>
                        <asp:DropDownList ID="ExamSelector" runat="server" ClientIDMode="Static">
                        </asp:DropDownList>
                    </td>


                </tr>
                <tr>
                    <td class="title">
                        <label class="required">*</label>
                        单位编码：</td>
                    <td>
                        <asp:TextBox ID="CompanyCodeBox" MaxLength="15" runat="server" ClientIDMode="Static"></asp:TextBox><asp:Button ID="CheckCode" runat="server" style="display:none" ClientIDMode="Static" Text="检查单位" OnClick="CheckCode_Click" />
                    </td>
                    <td class="title">
                        <label class="required">*</label>
                        E-mail：
                    </td>
                    <td>
                        <asp:TextBox ID="Email" runat="server"></asp:TextBox>
                    </td>
                </tr>
                <tr>
                    <td class="title">
                        <label class="required">*</label>
                        单位名称：
                    </td>
                    <td colspan="3">
                        <asp:TextBox ID="CompanyName" style="width:100%;border-width:0px;background-color:white;" ClientIDMode="Static" runat="server" Enabled="false"></asp:TextBox>
                    </td>

                </tr>
                <tr>


                    <td class="title">QQ：

                    </td>
                    <td>
                        <asp:TextBox ID="QQNO" runat="server"></asp:TextBox>

                    </td>


                    <td class="title">手机：</td>
                    <td>
                        <asp:TextBox ID="CellPhone" runat="server"></asp:TextBox>
                    </td>

                </tr>
                <tr>
                    <td colspan="6">
                        考生照片说明：照片尺寸要求为114×156，JPG/JPEG格式，300KB以内大小，背景颜色为白色， 照片清晰!
                    </td>
                </tr>
                <tr>
                    <td colspan="6" style="text-align: center">
                        <br />
                        <asp:Button ID="Save" runat="server" Style="width: 100px; height: 40px; cursor: pointer;" Text="提交报名信息" OnClientClick="return checkSubmit()" OnClick="Save_Click" />
                    </td>
                </tr>
            </table>

        </div>
    </form>
    <script>

        $(function () {

            $('#FileUpload1').change(function () {
                if (checkImgType(this))
                    $('#ImageUploadBtn').click();
            });

            $('#CompanyCodeBox').keyup(function () {
                var code = $(this).val();
                if (code.length == 15) {
                    $('#CheckCode').click();
                }

            });



        });

        function checkSubmit() {
            var result = false;
            if (!$('#Name').val())
                alert('请填空姓名');
            else if (new RegExp("[0-9]").test($('#Name').val()))
                alert('姓名不能包含数字');
            else if (!$('#Sex').val())
                alert('请选择性别');
            else if (!$('#Image1').attr('src'))
                alert('请上传照片');
            else if (!$.trim($('#IDCard').val()))
                alert('请填写身份证号');
            else if ($.trim($('#IDCard').val()).indexOf(' ') > -1 || $.trim($('#IDCard').val()).indexOf('　') > -1)
                alert('身份证号不能包含空格');
            else if (!IdCardValidate($.trim($('#IDCard').val())))
                alert('身份证号错误');
            else if (!$('#ExamSelector').val())
                alert('请选择考试');
            else if (!$('#CompanyCodeBox').val())
                alert('请填写单位编号');
            else if (!$('#CompanyName').val())
                alert('请确保单位编号填写正确后点击 检查 按钮');
            else if (!$('#Email').val())
                alert('请填写邮箱');
            else if (!checkEmail($('#Email').val()))
                alert('请填写正确的邮箱');
            else
                result = true;
            return result;
        }


        function checkEmail(email) {
            var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            return reg.test(email);

        }


        /* 
 * 判断图片类型 
 *  
 * @param ths  
 *          type="file"的javascript对象 
 * @return true-符合要求,false-不符合 
 */
        function checkImgType(ths) {
            debugger;
            if (ths.value == "") {
                alert("请上传图片");
                return false;
            } else {
                if (!/\.(jpg|JPG)$/.test(ths.value)) {
                    alert("图片类型必须是jpg");
                    ths.value = "";
                    return false;
                }

                else {
                    while (true) {
                        if (ths.files[0].size > 2 * 1024 * 1024) {
                            alert("图片不大于2M。");
                            return false;
                        }
                        break;

                    }
                }
            }
            return true;
        }


        /* 
 * 判断图片大小 
 *  
 * @param ths  
 *          type="file"的javascript对象 
 * @param width 
 *          需要符合的宽  
 * @param height 
 *          需要符合的高 
 * @return true-符合要求,false-不符合 
 */
        function checkImgPX(ths, width, height) {
            var img = null;
            img = document.createElement("img");
            document.body.insertAdjacentElement("beforeEnd", img); // firefox不行  
            img.style.visibility = "hidden";
            img.src = ths.value;
            var imgwidth = img.offsetWidth;
            var imgheight = img.offsetHeight;

            alert(imgwidth + "," + imgheight);

            if (imgwidth != width || imgheight != height) {
                alert("图的尺寸应该是" + width + "x" + height);
                ths.value = "";
                return false;
            }
            return true;
        }



    </script>
    <script src="scripts/idCardValidate.js"></script>




</body>
</html>
