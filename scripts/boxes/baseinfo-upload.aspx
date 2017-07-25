<%@ Page Language="C#" AutoEventWireup="true" %>

<script runat="server">
    protected void doUpload(object sender, EventArgs e)
    {
        if (file.HasFile)
        {
            string tempname = Guid.NewGuid().ToString("N") + file.FileName.Substring(file.FileName.LastIndexOf('.'));
            file.SaveAs(Server.MapPath("~/temp/") + tempname);
            ScriptManager.RegisterStartupScript(this, this.GetType(), "startup", "parent.document.getElementById('attachment').value='" + tempname + "'", true);
            form.Visible = false;
            result.Visible = true;
        } else
        {
            ScriptManager.RegisterStartupScript(this, this.GetType(), "startup", "alert('请选择一个文件')", true);
        }
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        int exid = 0;
        form.Visible = true;
        result.Visible = false;

        if (int.TryParse(Request.QueryString["exid"], out exid))
        {
            GZY.Exam.BLL.ExamBLL examBll = new GZY.Exam.BLL.ExamBLL();
            GZY.Exam.Model.Entity.Exams exam = examBll.Retrieve(exid);
            bool hasfile = !string.IsNullOrEmpty(exam.DescriptionFileName);
            reupload.Visible = hasfile;
            form.Visible = !hasfile;
            if (hasfile)
                filen.InnerText = exam.DescriptionFileName;
            else
                filen.InnerText = "";
        }
    }
</script>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title></title>
<link href="../../styles/style.css" rel="stylesheet" />
</head>
<body>
    <form runat="server">
        <asp:scriptmanager runat="server" />
        <div id="form" runat="server">
            <asp:fileupload id="file" runat="server" />
            <asp:button runat="server" text="上传" onclick="doUpload" /></div>
        <div id="result" runat="server" visible="false">文件上传成功！<a href="baseinfo-upload.aspx">重新上传</a></div>
        <div id="reupload" runat="server" visible="false">已上传文件 <a href="javascript:;" runat="server" id="filen">关于***的说明</a>！<a href="baseinfo-upload.aspx">重新上传</a></div>
    </form>
</body>
</html>
