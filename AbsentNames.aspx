<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AbsentNames.aspx.cs" Inherits="Web.AbsentNames" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href="styles/style.css" rel="stylesheet" type="text/css" />
    <link href="styles/style_webForms.css" rel="stylesheet" type="text/css" />
       <script src="scripts/jquery-1.7.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="scripts/webFormPager/gzyPager.js"></script>
     
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:ScriptManager ID="ScriptManager1" runat="server">
        </asp:ScriptManager>
        <%--       <asp:DataList ID="DataList1" CssClass="list"  runat="server">
        <HeaderTemplate>
            <table>
                <thead>
                    <tr>
                        <th>
                            姓名
                        </th>
                        <th>
                            学号
                        </th>
                        <th>
                            年级
                        </th>
                        <th>
                            班级
                        </th>
                        <th>
                            状态
                        </th>
                    </tr>
                </thead>
                <tbody>
        </HeaderTemplate>
            <ItemTemplate>
                <tr>
                    <td>
                        <%#Eval("RealName") %>
                    </td>
                    <td>
                        <%#Eval("PersonNumber") %>
                    </td>
                    <td>
                        <%#Eval("GradeName") %>
                    </td>
                    <td>
                        <%#Eval("ClassName") %>
                    </td>
                    <td>
                        <font color='red'>缺考</font>
                    </td>
                </tr>
            </ItemTemplate>
            <SeparatorTemplate></SeparatorTemplate>
            <FooterTemplate>
                </tbody> </table>
            </FooterTemplate>
        </asp:DataList>
        --%>
        <asp:UpdatePanel ID="UpdatePanel1" UpdateMode="Conditional" ClientIDMode="Static"
            runat="server">
            <ContentTemplate>
                <asp:GridView ID="GridView1" CssClass="list" AutoGenerateColumns="false" GridLines="None"
                    runat="server">
                    <Columns>
                        <asp:BoundField DataField="RealName" ItemStyle-CssClass="center" HeaderText="姓名" />
                        <asp:BoundField DataField="PersonNumber" ItemStyle-HorizontalAlign="Center" HeaderStyle-HorizontalAlign="Center" HeaderText="学号" />
                        <asp:BoundField DataField="GradeName" HeaderText="年级" />
                        <asp:BoundField DataField="ClassName" HeaderText="班级" />
                        <asp:TemplateField>
                            <HeaderTemplate>
                                状态
                            </HeaderTemplate>
                            <ItemTemplate>
                                缺考
                            </ItemTemplate>

                            <ItemStyle ForeColor="Red" />

                        </asp:TemplateField>
                    </Columns>
                    <EmptyDataTemplate>
                    <center>未找到符合条件的数据，可能已经被删除</center>
                    </EmptyDataTemplate>
                </asp:GridView>
                <div class="pager">
                    <asp:TextBox ID="PageBox" runat="server" ClientIDMode="Static" Style="display: none"></asp:TextBox>
                    <asp:Button ID="RefreshButton" runat="server" Text="Button" Style="display: none"
                        OnClick="Button1_Click" ClientIDMode="Static" />
                </div>
            </ContentTemplate>
        </asp:UpdatePanel>
        <div style="width:100%">
            <div id="gzyPager"></div>
        </div>
    </div>
    </form>
</body>
</html>
