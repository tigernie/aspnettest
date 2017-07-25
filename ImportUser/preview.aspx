<%@ Page Language="C#" MaintainScrollPositionOnPostback="false" AutoEventWireup="true"
    CodeBehind="preview.aspx.cs" Inherits="Web.ImportUser.preview" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>预览学生</title>
    <script src="../scripts/jquery-1.7.min.js" type="text/javascript"></script>
    <script src="../scripts/PopWindow/gzy.popup.js" type="text/javascript"></script>
    <script src="../scripts/common.js" type="text/javascript"></script>
    <script src="../scripts/webForm_common.js" type="text/javascript"></script>
    <link href="../styles/style.css" rel="stylesheet" type="text/css" />
    <link href="../styles/style_webForms.css" rel="stylesheet" type="text/css" />
    <link href="importStudent.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript">
        function pop() {
            new gzy.popup("添加用户", 400, 300, { element: $("#insert_pop") });
        }
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div id="body">
      
    <div  style="margin: 0 auto; width: 960px; ">
        <asp:ScriptManager ID="ScriptManager1" runat="server">
        </asp:ScriptManager>

        <asp:UpdatePanel ID="UpdatePanel1" ChildrenAsTriggers="true" runat="server">
            <ContentTemplate>
                
                <div class="topTitle">

               <div class="Operation_bar">
                 
                    <asp:LinkButton ID="LinkButton_Import" Height="20" CssClass="float_right" 
                        Width="100"  runat="server" onclick="LinkButton_Import_Click">导入可用数据</asp:LinkButton>
                  <div class="filter">
                            <asp:DropDownList ID="DropDownList_Filter" runat="server" OnSelectedIndexChanged="DropDownListFilter_SelectedIndexChanged" AutoPostBack="true">
                            <asp:ListItem Text="仅显示错误数据" Value="1" Selected="True"></asp:ListItem>
                            <asp:ListItem Text="仅显示可导入数据" Value="2"></asp:ListItem>
                            <asp:ListItem Text="显示所有数据" Value="3"></asp:ListItem>
                            </asp:DropDownList>
                        </div>
                   <asp:CheckBox ID="CheckBox_RenderImported" CssClass="display_none" AutoPostBack="true" Checked="false" runat="server" Text="显示已导入数据" />
                        <span class="float_right" style=" color:Red; margin-top:2px;">  <asp:Literal ID="Litera_tips"  runat="server"></asp:Literal></span>
                        </div>
                    <%--颜色块 示例--%>
                    &nbsp;<%--颜色块 示例--%><div class="graphical">
                        <div class="row_error">
                            <div class="square"><span style=" color:Black; ">
                            <asp:Literal ID="tips_row_error" runat="server"></asp:Literal>
                            </span>
                            </div>
                            <div class="introduce">整行数据不能识别</div>
                        </div>
                        <div class="nonrelation_error">
                            <div class="square"><span style=" color:white;">
                            <asp:Literal ID="tips_nonrelation_error" runat="server"></asp:Literal></span>
                          
                            </div>
                            <div class="introduce">单元格的值不正确</div>
                        </div>
                        <div class="relation_error">
                            <div class="square"><span style=" color:white;">
                            <asp:Literal ID="tips_relation_error" runat="server"></asp:Literal></span>
                            </div>
                            <div class="introduce">与其他数据冲突
                            </div>
                        </div>
                        <div class="warn">
                            <div class="square"><span style=" color:Black;">
                            <asp:Literal ID="tips_warn" runat="server"></asp:Literal></span>
                            </div>
                            <div class="introduce">警告
                            </div>
                        </div>

                   
                    </div>
                    <%--表头--%>
                    <table class="gridview_header" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <th style="width: 180px;">
                                学号
                            </th>
                            <th style="width: 100px;">
                                姓名
                            </th>
                            <th style="width: 180px;">
                                性别
                            </th>
                            <th style="width: 90px;">
                                班级
                            </th>
                            <th style="width: 90px;">
                                年级
                            </th>
                            <th style="width: 160px;">
                                学校
                            </th>
                            <th style=" ">
                                操作
                            </th>
                        </tr>
                    </table>
           </div>
           <div class="rows">
                <asp:GridView ID="GridView1" AutoGenerateColumns="false" Width="100%" runat="server"
                    OnRowDataBound="GridView1_RowDataBound" OnRowEditing="GridView1_RowEditing" OnRowUpdating="GridView1_RowUpdating"
                    OnRowCancelingEdit="GridView1_RowCancelingEdit" OnRowDeleting="GridView1_RowDeleting"
                    AutoGenerateEditButton="false" AutoGenerateDeleteButton="false" DataKeyNames="Id"  OnPreRender="GridView1_PreRender">
                    <HeaderStyle BackColor="#0286ce" ForeColor="#ffffff"  CssClass="display_none" Height="30"  />
                    <RowStyle Height="25"  CssClass="datarow" />
                    <EditRowStyle  HorizontalAlign="Center" VerticalAlign="Middle"/>
                    
                    <Columns>
                        <asp:BoundField DataField="stuNum" NullDisplayText="(空)" ItemStyle-Width="180" ControlStyle-Width="170" HeaderStyle-Width="180" 
                            ConvertEmptyStringToNull="true" HeaderText="学号" InsertVisible="true"  />
                        <asp:BoundField DataField="name" NullDisplayText="(空)" ItemStyle-Width="100" ControlStyle-Width="90" HeaderStyle-Width="100" 
                            ConvertEmptyStringToNull="true" HeaderText="姓名" />
                        <asp:BoundField DataField="gender" NullDisplayText="(空)" ItemStyle-Width="180" ControlStyle-Width="170" HeaderStyle-Width="180" 
                            ConvertEmptyStringToNull="true" HeaderText="考号" />
                        <asp:BoundField DataField="className" NullDisplayText="(空)" ItemStyle-Width="90" HeaderStyle-Width="90" 
                            ControlStyle-Width="80" ConvertEmptyStringToNull="true" HeaderText="班级" />
                        <asp:TemplateField HeaderText="年级" ItemStyle-Width="90" ControlStyle-Width="80" HeaderStyle-Width="90">
                            <ItemTemplate>
                                <asp:Literal ID="Literal1" runat="server" Text='<%#Eval("gradeName") %>' />
                            </ItemTemplate>
                            <EditItemTemplate>
                                <asp:DropDownList ID="DropDownList1" runat="server">
                                    <asp:ListItem Text="初一" Value="7" Selected="True">
                                    </asp:ListItem>
                                    <asp:ListItem Text="初二" Value="8">
                                    </asp:ListItem>
                                    <asp:ListItem Text="初三" Value="9">
                                    </asp:ListItem>
                                    <asp:ListItem Text="高一" Value="10">
                                    </asp:ListItem>
                                    <asp:ListItem Text="高二" Value="11">
                                    </asp:ListItem>
                                    <asp:ListItem Text="高三" Value="12">
                                    </asp:ListItem>
                                </asp:DropDownList>
                            </EditItemTemplate>
                        </asp:TemplateField>
                        <asp:BoundField DataField="schoolName" NullDisplayText="(空)" ItemStyle-Width="160"
                            HeaderStyle-Width="160" ControlStyle-Width="150" ConvertEmptyStringToNull="true"
                            HeaderText="学校" />
                        <asp:TemplateField>
                            <ItemTemplate>
                                <asp:LinkButton ID="LinkButton_Edit" CommandName="Edit"  runat="server">编辑</asp:LinkButton>
                                <asp:LinkButton ID="LinkButton_Delete" CommandName="Delete" runat="server">删除</asp:LinkButton>
                            </ItemTemplate>
                            <EditItemTemplate>
                                <asp:LinkButton ID="LinkButton_Update" CommandName="Update" runat="server">更新</asp:LinkButton>
                                <asp:LinkButton ID="LinkButton_Cancel" CommandName="Cancel" runat="server">取消</asp:LinkButton>
                            </EditItemTemplate>
                        </asp:TemplateField>
                    </Columns>
                </asp:GridView>
                </div>
            </ContentTemplate>
        </asp:UpdatePanel>
    </div>
        <div class="right_bar" style=" display:none;">
           <a href="javascript:void()" onclick="pop()" > <b>+</b>&nbsp;添加</a>
        </div>

        <div style=" display:none;">
        <div id="insert_pop">
            <asp:DetailsView ID="DetailsView1"  runat="server" AutoGenerateRows="false" Height="50px"
                Width="125px">
                <Fields>
                    <asp:BoundField HeaderText="学号" DataField="stuNum" />
                    <asp:BoundField HeaderText="姓名" DataField="name" />
                    <asp:BoundField HeaderText="考号" DataField="examNum" />
                    <asp:BoundField HeaderText="班级" DataField="className" />
                    <asp:BoundField HeaderText="年级" DataField="gradeName" />
                    <asp:BoundField HeaderText="学校" DataField="schoolName" />
                  
                </Fields>
                
            </asp:DetailsView>test
<%--
            <asp:ObjectDataSource ID="ObjectDataSource1"
             TypeName="Web.ImportUser.preview" InsertMethod="InsertUser"
             runat="server"></asp:ObjectDataSource>--%>

        </div>
        </div>
    </div>
    </form>
</body>
</html>
