<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="upload.aspx.cs" Inherits="Web.ImportUser.upload" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>导入学生</title>
    <script src="../scripts/jquery-1.7.min.js" type="text/javascript"></script>
    <%--  <script type="text/javascript">
        function AjaxFileUpload1_ClientUploadComplete(sender, e) {

             
            var id = e.get_fileId();
            var url = e.get_postedUrl();
            url = url.replace("&amp;","&");//&amp;是&的转义
            $("#fileId").val(id);
            $("#postedUrl").val(url);

            $("#preview_page").attr("src", url);
            //            top.location = url;

            setTimeout(Refresh, 100);
            setTimeout(Refresh, 200);
            setTimeout(Refresh, 300);
            setTimeout(Refresh, 500);
            setTimeout(Refresh, 1000);
        }

        function AjaxFileUpload1_ClientUploadError(sender, e) {

        }

        $(document).ready(function () {

            //上传按钮
            $("#AjaxFileUpload1_UploadOrCancelButton").css("background-color", "rgb(33,33,33)");
            $("#AjaxFileUpload1_UploadOrCancelButton").css("color", "rgb(208,208,208)");

            //已上传文件名
            $(".ajax__fileupload_queueContainer").css("color", "rgb(33,33,33)");
            $("#AjaxFileUpload1_UploadOrCancelButton").html("上传");
            $("#AjaxFileUpload1_SelectFileButton").html("选择文件");
           // $("#AjaxFileUpload1_InputFileElement").html("选择文件");


        });
        function Refresh() {
            $("#AjaxFileUpload1_UploadOrCancelButton").html("上传");
            $("#AjaxFileUpload1_SelectFileButton").html("选择文件");
            $("#AjaxFileUpload1_Html5DropZone").html("将文件拖拽至此");
            $(".removeButton").html("移除");
            $(".uploadstatus").html("（已经上传）");

            $("#AjaxFileUpload1_InputFileElement").css("display", "")
            $("#AjaxFileUpload1_InputFileElement").css("visibility", "visible")
            $("#AjaxFileUpload1_InputFileElement").css("opacity", "50")

        };

//        document.onclick = Refresh();
        // body.onclick = Refresh();
        setTimeout(Refresh, 100);
        setTimeout(Refresh, 200);
        setTimeout(Refresh, 300);
        setTimeout(Refresh, 500);
        setTimeout(Refresh, 1000);
    </script>--%>
</head>
<body>
    <form id="form1" runat="server"  >
    <div style="width: 980px; margin: 0 auto;">
        <%--<asp:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
        </asp:ToolkitScriptManager>
        请选择csv格式的学生用户数据文件：<a href="导入学生用户数据.xls">下载模板</a>
        <asp:AjaxFileUpload ID="AjaxFileUpload1" AllowedFileTypes="csv,vnd.ms-excel" OnClientUploadComplete="AjaxFileUpload1_ClientUploadComplete"
            MaximumNumberOfFiles="15" OnUploadComplete="AjaxFileUpload1_UploadComplete" OnClientUploadError="AjaxFileUpload1_ClientUploadError"
            runat="server" />
        <input id="fileId" type="hidden" />
        <input id="postedUrl" type="hidden" />
        <input id="Hidden1" type="hidden" />
        <br /> <asp:Button ID="btnSubmit" runat="server" Text="Submit" />
     

    <script type="text/javascript">
        $(function () {
            setTimeout(Refresh, 100);
            setTimeout(Refresh, 200);
            setTimeout(Refresh, 300);
            setTimeout(Refresh, 500);
            setTimeout(Refresh, 1000);

        });
    </script>--%>
     <center>
        导入学生</center>
    <a href="导入学生用户数据.xls">下载模板</a><br />
    请选择Excel文件：
         

       <iframe frameborder="0" width="980" id="Iframe1" height="720" scrolling="yes" src="upload.htm" style=" margin-left:0;"></iframe>
  
   
      <iframe  frameborder="0" width="980" id="preview_page" height="600" scrolling="yes" style=" margin-left:0;"></iframe>
  
    </div>
    </form>
</body>
</html>
