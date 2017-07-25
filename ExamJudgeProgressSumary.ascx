<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="ExamJudgeProgressSumary.ascx.cs"
    Inherits="Web.ExamJudgeProgressSumary" %>
<table class="list" style="border-top: 0 none;">
    <tbody>
        <tr>
            <td rowspan="4" style="width: 200px; vertical-align: middle; text-align: right; padding-right: 30px;
                background-color: #f7f7f7;">
                整体批阅进度：
            </td>

                <td style="border-right: #ebebeb 1px dashed;" title="已经批阅无歧义及有歧义但歧义处理完成的总题数" >
            <span style=" height:26px; line-height:26px; width:20px;" class="groupProgress_c1">&nbsp;&nbsp;</span>
                已经完成：<asp:Label ID="LabelDoneASD" runat="server" Text="Label"></asp:Label>道
                （<asp:Label ID="LabelDoneASDPercent" runat="server" Text="Label"></asp:Label>%）
            </td>
            <td title="答题获得最终分才算完成">
                普通阅卷组：<asp:Label ID="LabelDoneASD_Nomal" runat="server" Text="Label"></asp:Label>道；&nbsp;&nbsp;&nbsp;&nbsp;组长：<asp:Label ID="LabelDoneASD_JGroupLeader" runat="server" Text="Label"></asp:Label>道；&nbsp;&nbsp;&nbsp;&nbsp;专家：<asp:Label ID="LabelDoneASD_Proficient" runat="server" Text="Label"></asp:Label>道；
            </td>

          
        </tr>
        <tr>
        
          <td style="width: 200px; border-right: #ebebeb 1px dashed;">
            <span style=" height:26px; line-height:26px; width:20px;" class="groupProgress_c2">&nbsp;&nbsp;</span>
                正在批阅：<asp:Label ID="LabelJudging" runat="server" Text="Label"></asp:Label>道
                （<asp:Label ID="LabelJudgingPercent" runat="server" Text="Label"></asp:Label>%）
            </td>
            <td>
            普通阅卷组：<asp:Label ID="LabelJudging_Nomal" runat="server" Text="Label"></asp:Label>道；&nbsp;&nbsp;&nbsp;&nbsp;组长：<asp:Label ID="LabelJudging_JGroupLeader" runat="server" Text="Label"></asp:Label>道；&nbsp;&nbsp;&nbsp;&nbsp;专家：<asp:Label ID="LabelJudging_Proficient" runat="server" Text="Label"></asp:Label>道；
            </td>
        </tr>
        <tr>
            <td style=" border-right: #ebebeb 1px dashed;" title="待处理的有歧义的题数">
            <span style=" height:26px; line-height:26px; width:20px;" class="groupProgress_c3">&nbsp;&nbsp;</span>
                待审核：<asp:Label ID="LabelCountOfAmbiguous" runat="server" Text="Label"></asp:Label>道
                （<asp:Label ID="LabelCountOfAmbiguousPercent" runat="server" Text="Label"></asp:Label>%）
            </td>
            <td>
                初评后歧义：<asp:Label ID="LabelCountOfAmbiguous_FirstTrial" runat="server" Text="Label"></asp:Label>道；&nbsp;&nbsp;&nbsp;&nbsp;初审后歧义：<asp:Label ID="LabelCountOfAmbiguous_Retrial" runat="server" Text="Label"></asp:Label>道</pre>
            </td>
        </tr>
        <tr>
            <td style="border-right: #ebebeb 1px dashed;" title="待第一轮批阅的总题数">
            <span style=" height:26px; line-height:26px; width:20px;" class="groupProgress_c4">&nbsp;&nbsp;</span>
                待初评：<asp:Label ID="LabelRemainder" runat="server" Text="Label"></asp:Label>道
                （<asp:Label ID="LabelRemainderPercent" runat="server" Text="Label"></asp:Label>%）
            </td>
            <td>
                -
            </td>
        </tr>
    </tbody>
</table>
