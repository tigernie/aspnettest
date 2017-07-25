<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="RoundFirstJudgeProgress.ascx.cs" Inherits="Web.UserControl.RoundFirstJudgeProgress" %>


<script type="text/javascript">

    var updateTaskSizePanel;
    function updateTaskSize(examid, CurrentJGroupID, userid,name, method) {

        var r = "Widget/UpdateTaskSizeByUser.aspx?examid=" + examid + "&CurrentJGroupID="+CurrentJGroupID+
        "&userid=" + userid + "&name=" + name + "&method=" + method;
        updateTaskSizePanel = new gzy.popup("调整任务", 280, 140, { url: r, buttons:
        [{ text: "取消", isCancel: false, click: cancel}]
        });

        return false;
    }

    function cancel(){

        window.location.reload();
        try {
            
        } catch (e) {

        }
        updateTaskSizePanel.close();
    }

</script>

<div style=" width:200px; height:20px; line-height:20px;  background-color:#eee; padding:5px; text-align:center; margin:4px; float:right; border:1px solid #f80;">待分配试题：<span style=" color:#f80; font-weight:bolder;"><asp:Literal ID="Literal1" runat="server"></asp:Literal>道</span></div>
<br  style=" clear:both;"/>
    <asp:GridView ID="gridViewJGroupDetailList" CssClass="list JGroupDetailList" AutoGenerateColumns="false" OnRowDataBound="gridViewJGroupDetailList_RowDataBound" runat="server">
        <Columns>
            <asp:BoundField DataField="" HeaderText="用户名 - 姓名" />
            <asp:BoundField DataField="ComGroupName" HeaderText="所属机构" />
            <asp:BoundField DataField="" HeaderText="完成 + 剩余（道）" />
            <asp:BoundField DataField="AllocatedTotalASD" HeaderText="分配的任务（道）" />
            <asp:BoundField DataField="DonePercent" DataFormatString="{0}%" HeaderText="完成比例" />
            <asp:BoundField DataField="RemainderPercent" DataFormatString="{0}%"  HeaderText="剩余比例" />
            <asp:TemplateField HeaderText="是否在线">
            <ItemTemplate>
                <asp:Image ID="ImageIsOnline" runat="server" />
            </ItemTemplate>
            </asp:TemplateField>
            <asp:TemplateField HeaderText="操作">
                <ItemTemplate>
                    <asp:LinkButton ID="LinkButtonAdd"  runat="server">增加</asp:LinkButton>
                    <asp:LinkButton ID="LinkButtonDel" runat="server">减少</asp:LinkButton>
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
          <EmptyDataTemplate>
            未找到任何数据
            </EmptyDataTemplate>
    </asp:GridView>
