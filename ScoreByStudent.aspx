<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ScoreByStudent.aspx.cs"
    Inherits="Web.ScoreByStudent" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>查看学生的答题列表</title>
    <link href="styles/style.css" rel="stylesheet" type="text/css" />
    <link href="styles/style_webForms.css" rel="stylesheet" type="text/css" />

    <script src="scripts/jquery-1.7.min.js" type="text/javascript"></script>
    <script src="scripts/PopWindow/gzy.popup.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/My97DatePicker/WdatePicker.js"></script>
    <script type="text/javascript" src="scripts/common.js"></script>
    <script type="text/javascript" src="scripts/webForm_common.js"></script>
    <script src="script.ashx?teacher,teacher.ui" type="text/javascript"></script>
    <script src="scripts/Judge.js" type="text/javascript"></script>

        <style type="text/css">
        table.list  thead  > tr >  th 
        {
            text-align: center;
        }
        
            table.list   tr >  td 
        {
            text-align: center;
        }
                table.list  
        {
            margin:16px auto;
        }
        
        table.list tr > td.td_left
        {
            text-align: left;
            padding-left: 12px;
          
        }
        table.list tr > td.td_right
        {
            text-align: right;
            padding-right: 26px;
            width: 90px;
        }

    </style>
</head>
<body>
    <form id="form1" runat="server">
    <asp:GridView ID="ExamList" runat="server" AutoGenerateColumns="False" EmptyDataText="-"
        GridLines="None" OnRowDataBound="ExamList_RowDataBound" OnDataBound="ExamList_DataBound"
        CssClass="list" Width="650">
        <Columns>
            <%--Index:0--%>
            <asp:BoundField DataField="InnerIndex" ItemStyle-HorizontalAlign="Center" HeaderStyle-HorizontalAlign="Center"
                HeaderText="题号"></asp:BoundField>
            <%--Index:1--%>
            <asp:BoundField DataField="InputType" HeaderText="题型"></asp:BoundField>
            <%--Index:2--%>
            <asp:BoundField DataField="IsObject" HeaderText="是否为客观题"></asp:BoundField>
            <%--Index:3--%>
            <asp:BoundField DataField="ProblemScore" HeaderText="实际得分/试题满分"></asp:BoundField>
            <%--<asp:BoundField DataField="Score" NullDisplayText="-" HeaderText="实际得分"></asp:BoundField>--%>
            <%--Index:4--%>
            <asp:TemplateField>
                <HeaderTemplate>
                    
                </HeaderTemplate>
                <ItemTemplate>
                <asp:Image ID="Image1"   runat="server" />
                </ItemTemplate>
            </asp:TemplateField>
            <%--Index:5--%>
            <asp:TemplateField>
                <HeaderTemplate>
                    操作
                </HeaderTemplate>
                <ItemTemplate>
                    <a href="#" class='<%#Eval("ProbID") %>&id=<%#Eval("id") %>' onclick='return ProblemDetail($(this).attr("class")),false'>
                        查看试题</a>
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
        <EmptyDataTemplate>
            未查找到符合条件的数据
        </EmptyDataTemplate>
    </asp:GridView>
    </form>
</body>
</html>
