<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="RegionGroupTree.ascx.cs"
    Inherits="Web.UserControl.RegionGroupTree" %>
<asp:UpdatePanel ID="UpdatePanel1" UpdateMode="Conditional" runat="server">
    <Triggers>
        <asp:AsyncPostBackTrigger ControlID="RegionGroupTreeView" EventName="SelectedNodeChanged" />
    </Triggers>
    <ContentTemplate>
        <asp:TreeView ID="RegionGroupTreeView" OnSelectedNodeChanged="RegionGroupTreeView_SelectedNodeChanged"
            runat="server">
        </asp:TreeView>
    </ContentTemplate>
</asp:UpdatePanel>
