<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UpdateTaskSizeByUser.aspx.cs"
    Inherits="Web.Widget.UpdateTaskSizeByUser" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script src="../scripts/jquery-1.7.min.js" type="text/javascript"></script>
    <script type="text/javascript">
        function check() {

            var v = $("#TextBox1").val()
            var maxV = $("#HiddenFieldMaxValue").val();
            var vInt = parseInt(v);
            if (vInt.toString() != v || vInt <= 0 || vInt > maxV) {
                
                $("#tips").html("请输入指定范围内的数字");
                $("#tips").fadeIn(1000).fadeOut(3000);
                return false;
            }
            else {
                return true;
            }


        }


        function display() {
//             $("#tips").fadeIn(1000).fadeOut(3000);
            $("#tips").fadeIn(1000);
        }

    </script>

    <style type="text/css">
    
    table td{ padding-left:25px;}
    span.t1{ color:#333;}
    span.t2{ color:#888; }
    span.t2 b{ color:Red; font-weight:normal;}
    span.t3{ color:#C7CBCB;}
    </style>
</head>
<body style=" overflow:hidden;margin:0; background-color:white; ">
    <form id="form1" runat="server">
    <div style=" ">
        <asp:ScriptManager ID="ScriptManager1" runat="server">
        </asp:ScriptManager>
        <asp:UpdatePanel ID="UpdatePanel1" ChildrenAsTriggers="true" runat="server">
            <ContentTemplate>

                <table cellspacing="0" cellpadding="0"  style=" margin-top:15px; font-size:12px; width:100%; border:0 none; border-spacing:0;  " >
                    <tr style="  line-height:18px; height:40px;  ">
                        <td >
                            <asp:Literal ID="Literal1" runat="server"></asp:Literal>
                        </td>
                    </tr>
                    <tr style="  line-height:55px;">
                        <td>
                            <asp:TextBox ID="TextBox1" ClientIDMode="Static" runat="server"></asp:TextBox>
                            <asp:Button ID="Button1" runat="server" Text="" OnClientClick="return check();" OnClick="Button1_Click" />
                        </td>
                    </tr>
                   <tr style="">
                        <td>
                            <span id="tips" style="color: Red; line-height:15px;  background-color:#f5f5f5;">
                                <asp:Literal ID="LiteralTips" ClientIDMode="Static" runat="server"></asp:Literal></span>
                        </td>
                    </tr>
                </table>

                <asp:HiddenField ID="HiddenFieldMaxValue" ClientIDMode="Static" runat="server" />
            </ContentTemplate>
        </asp:UpdatePanel>

   
    </div>
    </form>
</body>
</html>
