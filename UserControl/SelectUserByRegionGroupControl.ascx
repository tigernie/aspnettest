<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="SelectUserByRegionGroupControl.ascx.cs"
    Inherits="Web.UserControl.SelectUserByRegionGroupControl" %>
<%@ Register TagPrefix="RG" TagName="RegionGroupTree" Src="RegionGroupTree.ascx" %>
<script type="text/javascript">
    function addCheck() {

        if (this.parent.__identity == '1')//表示正在选择组长  只能选一个人
        {
            var selectedCount = 0;
            selectedCount = $("#SelectUser1_selectedTeacherList option").length;//已经选中的老师
            if (selectedCount > 0) {
                if (confirm("已经选择了一位老师作为当前组组长，确定要替换吗？")) {
                    $("#SelectUser1_selectedTeacherList option").each(function () {
                        $(this).remove();
                    });
                }
                else {
                    return false;
                }
            }
        }
    }
</script>
<div>
    <div style="width: 280px; float: left; height: 450px; font-size: 10pt; overflow-y: scroll;">
        <RG:RegionGroupTree ID="RegionGroupTree1" runat="server"></RG:RegionGroupTree>
        <%--机构树--%>
    </div>
    <div style="margin-left: 30px; width: 180px; float: left; height: 450px">
        <%--待选列表--%>
        <asp:UpdatePanel ID="UpdatePanel1" UpdateMode="Conditional" runat="server">
            <Triggers>
                <asp:AsyncPostBackTrigger ControlID="RegionGroupTree1" EventName="SelectedNodeChanged" />
                <asp:AsyncPostBackTrigger ControlID="btnAdd" EventName="Click" />
                <asp:AsyncPostBackTrigger ControlID="btnDelete" EventName="Click" />
            </Triggers>
            <ContentTemplate>
                <asp:ListBox ID="teacherList" Width="160" SelectionMode="Multiple" Height="450" runat="server">
                </asp:ListBox>
            </ContentTemplate>
        </asp:UpdatePanel>
    </div>
    <div style="width: 30px; float: left; height: 450px; vertical-align: middle;">
        <div style="margin-top: 180px;">
            <asp:Button ID="btnAdd" runat="server" OnClick="btnAdd_Click" OnClientClick="addCheck()" Text=">>" /><br />
            <br />
            <asp:Button ID="btnDelete" runat="server" OnClick="btnDelete_Click" Text="<<" />
        </div>
    </div>
    <div style="margin-left: 30px; width: 180px; float: left; height: 450px">
        <%--已选择的老师列表--%>
        <asp:UpdatePanel ID="UpdatePanel2" UpdateMode="Conditional" runat="server">
            <Triggers>
                <asp:AsyncPostBackTrigger ControlID="btnAdd" EventName="Click" />
                <asp:AsyncPostBackTrigger ControlID="btnDelete" EventName="Click" />
            </Triggers>
            <ContentTemplate>
                <asp:ListBox ID="selectedTeacherList" SelectionMode="Multiple" Width="160" Height="450"
                    runat="server"></asp:ListBox>
            </ContentTemplate>
        </asp:UpdatePanel>
    </div>
</div>
