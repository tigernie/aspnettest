<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="CreateUniPaper.aspx.cs"
    Inherits="Web.CreateUniPaper" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href="styles/style.css" rel="stylesheet" type="text/css" />
    <link href="styles/style_webForms.css" rel="stylesheet" type="text/css" />
    <script src="scripts/jquery-1.7.min.js" type="text/javascript"></script>
    <script src="scripts/PopWindow/gzy.popup.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/My97DatePicker/WdatePicker.js"></script>
    <script type="text/javascript" src="scripts/common.js"></script>
    <script type="text/javascript" src="scripts/webForm_common.js"></script>
    <script type="text/javascript" src="scripts/createUniSlu.js"></script>
    <script type="text/javascript" src="scripts/ExamSlu.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>
    <div style="width:100%; text-align:center;">
    <table class="list" style="width: 80%">
        <tr>
            <td class="title">
                <label>
                    统一卷方案名称：</label>
            </td>
            <td class="content">
                <input type="text" id="UniPaperSluNameBox" />
            </td>
        </tr>
        <tr>
            <td class="title">
                <label>
                    创建类型：</label>
            </td>
            <td class="content">
                <asp:RadioButton ID="byPaperParam" runat="server" Text="使用组卷方案生成试卷" ClientIDMode="Static"
                    Checked="true" GroupName="solution" />
                <asp:RadioButton ID="byFixedPaper" runat="server" Text="使用套卷" ClientIDMode="Static"
                    Enabled="false" GroupName="solution" />
            </td>
        </tr>
        <tr>
            <td class="title">
                <label>
                    选择方案：</label>
            </td>
            <td class="content">
                <input type="text" id="SolutionID" />&nbsp;<input type="button" id="selSolution"
                    value="选择方案" class="btn" />
            </td>
        </tr>
        <tr>
            <td class="title">
                <label>
                    试卷份数：</label>
            </td>
            <td class="content">
                <input type="text" id="PapersCount" />
            </td>
        </tr>
        <tr>
            <td class="title">
                <label>
                    使用随机题序：</label>
            </td>
            <td class="content">
                <input type="checkbox" id="isRandomOrder"  />
            </td>
        </tr>
    </table>
    <div style="text-align: center">
        <br />
        <br />
        <br />
        <img alt="" src="images/teacher.btn.save.jpg" class="Btn" id="saveSlu" />
    </div>
    </div>
    <!-- 以下需要在后期实现模块化-->
    <div class="hide">
        <div id="paperSolutionList">
            <asp:UpdatePanel ID="UpdatePanel2" runat="server" UpdateMode="Conditional">
                <ContentTemplate>
                    <asp:GridView ID="SolutionList" runat="server" AutoGenerateColumns="False" HeaderStyle-CssClass="gridview_head"
                        CssClass="gridview" GridLines="None" EmptyDataText="-" OnPreRender="PaperParamList_PreRender">
                        <Columns>
                            <asp:TemplateField HeaderText="选择">
                                <ItemTemplate>
                                    <asp:RadioButton ID="RadioButton1" onclick="chooseSolution($(this))" runat="server"
                                        ClientIDMode="Static" GroupName="chooseSolution" />
                                </ItemTemplate>
                            </asp:TemplateField>
                        </Columns>
                        <EmptyDataTemplate>
                            未查找到符合条件的数据
                        </EmptyDataTemplate>
                        <HeaderStyle CssClass="gridview_head" />
                        <PagerSettings Mode="NumericFirstLast" />
                    </asp:GridView>
                    <asp:Button ID="RefreshBtn" runat="server" Text="Button" ClientIDMode="Static" Style="display: none"
                        OnClick="RefreshBtn_Click" />
                </ContentTemplate>
            </asp:UpdatePanel>
        </div>
    </div>
    </form>
</body>
</html>
