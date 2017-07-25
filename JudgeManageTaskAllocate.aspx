<%@ Page Title="" Language="C#" MasterPageFile="~/JudgeManage.Master" AutoEventWireup="true"
    CodeBehind="JudgeManageTaskAllocate.aspx.cs" Inherits="Web.JudgeManage.JudgeManageTaskAllocate" %>

<%@ Register TagPrefix="JM" TagName="ConfigJudgeGroup" Src="~/ConfigJudgeGroup.ascx" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script type="text/javascript">


        function StartWith(str, arg) {//判断str是否是以arg开头

            if (arg.length == 0 && str.length == 0) {
                return true;
            }
            else {

                var prefix = str.substr(0, arg.length);

                return arg == prefix ? true : false;
            }
        }

        function removePrefix(str, arg) {//如果str是以arg开头，那么去掉arg

            if (StartWith(str, arg) == false) { return false; }

            else {


                return str.substr(arg.length, str.length - arg.length);
            }
        }


        var _AddJGroup_Panel;
        function AddJGroup() {
            _AddJGroup_Panel = new gzy.popup('添加分组', 450, 240,
        {
            element: $("#addGroupPanel"),
            buttons: [{ text: '确定', isCancel: false, click: confirmAddGroupConfig

            },
                { text: '取消', isCancel: true}]
        });

        }

        var __prefix_normal = "normal_"; //普通组回调参数前缀
        //确定添加组
        function confirmAddGroupConfig() {

            var newGroupName = $("#ctl00_ContentPlaceHolder1_addOrUpdateJudgeGroup_TextBox1").val();
            var groupLeaderID = selectedGroupLeaderID;
            var kpIDs = _SelectedKpids;
            var judgersOfThisGroup = selectedUserIDs;

            var args = newGroupName + "|" + groupLeaderID + "|" + kpIDs + "|" + judgersOfThisGroup;

            args = __prefix_normal + args;
            CallServer(args, null); //回调服务器   与普通函数的区别，该函数是在服务器端注册到前端，并且该删除可以直接调用服务器端隐藏代码中的函数

        }

        function ReceiveData(data) {//接收来自服务器端的 回调响应，data为服务器响应的结果，

            if (StartWith(data, __prefix_normal)) {//普通组发出的回调响应
                data = removePrefix(data, __prefix_normal);
                if (data == '100') {

                    alert("添加成功");
                    $("#refresh_btn").click();
                    checkAllKpHasAllocated();

                    _AddJGroup_Panel.close();
                }
                else if (data == "-1") {
                    alert("考试的第一轮每题阅卷人数未设置。");
                }
                else if (data == "-2") {

                    alert("添加失败。组员数量过少，请按提示设置。");
                }
                else if (data == "-3") {
                alert("组长不能同时为组员！");
                }
                else if (data == '1') {
                    alert("组名已被使用");
                }
                else {
                    alert("no");
                }
            }
            else if (StartWith(data, __prefix_proficient)) {//专家组发出的回调响应
                data = removePrefix(data, __prefix_proficient);
                if (data == '100') {
                    $("#refresh_btn").click();
                    alert("添加成功");


                    __AddProficientPanel.close();
                }

                else {
                    alert("no");
                }
            }
        }
        $("#UpdatePanel2").css("display", "");

        function checkAllKpHasAllocated() {
            var examid = $("#HiddenField_ExamID").val();
            var method = "checkKpHasAllAllocated";

            $.ajax(
            {
                type: "get",
                data: { "method": method, "examid": examid },
                url: "JudgeSetHandler.ashx",
                success: function (result) {
                    if (result == "ok") {

                        //                        $("#UpdatePanel2").css("display","none");
                    }
                }
            }
            );
        }

        function confirmDeleteGroup(name) {
            if (confirm("确认删除名为“" + name + "”的组吗？")) {
                return true;
            }
            else {
                return false;
            }

        }

        var _ReviewJudgerPanel;
        function ReviewJudger(groupID, name) {

            _ReviewJudgerPanel = new gzy.popup("查看“" + name + "”的成员", 400, 320,
            {
                element: $("#ReviewJudgerPanel"),
                buttons: [{ text: "取消", isCancel: true}]
            });

            $("#ReviewJudgerPanel_span").html($(".lbl" + groupID).html());

            return false;
        }


        //////////////////////////////////////////////////////以下是添加专家部分//////////////////////////////////////////////////////////////////////////

        var __prefix_proficient = "profic_"; //专家部分回调参数前缀

        var __AddProficientPanel;
        function showAddProficientPanel() {
            var examid = $("#HiddenField_ExamID").val();
            //identity=1表示 只能选一个人，等于0表示可以选多个
            __AddProficientPanel = new gzy.popup("添加专家", 800, 480, { url: 'Widget/SelectJudger.aspx?id=' + examid + '&identity=0',
                buttons: [{ text: '确定', isCancel: false, click: confirmSelectProficient}]
            });

        }

        function confirmSelectProficient() {

            var selectedProficientIDs = getUserIDs_p();

            if (selectedProficientIDs.length > 0) {
                var args = __prefix_proficient + selectedProficientIDs;

                CallServer(args, null); //调用服务器的添加方法，该函数是在服务器端注册，加载此页面时自动生成的。此方法为异步，后续的处理在ReceiveData方法中
                //                __AddProficientPanel.close();
            }
            else {
                alert("未选择任何老师作为专家！");

            }


        }

        function getUserIDs_p() {

            var ids = "";

            __AddProficientPanel.body.find("#SelectUser1_selectedTeacherList option").each(function () {

                ids += $(this).val() + ",";

            });
            ids = ids.substr(0, ids.length - 1);
            return ids;
        }

        function getUserNames_p() {

            var names = "";
            __AddProficientPanel.body.find("#SelectUser1_selectedTeacherList option").each(function () {


                names += $(this).text() + ",";
            });
            names = names.substr(0, names.length - 1);
            return names;
        }



        function confirmDelProficient(username, realname) {

            if (confirm("确定不再要“" + username + "(" + realname + ")作为该考试的专家？")) {
                return true;
            }
            else {
                return false;
            }

        }

    </script>
    <style type="text/css">
        table.list th
        {
            text-align: center;
            padding: 0 4px;
            background: url(../images/th-bg.gif) repeat-x;
            color: #056d80;
            line-height: 30px;
        }
        table.list tbody td
        {
            vertical-align: middle;
        }
        table.list tbody tr, table.list tbody tr td, table.list th, table.list
        {
            border: 0 none;
        }
        .tdKey
        {
            background-color: #f2f2f2;
            width: 160px;
        }
        .tdValue
        {
            background-color: #f9f9f9;
        }
        table.tipsTable
        {
            border: 1 solid gray;
            margin: 10px 0 10px 0;
            width: 100%;
        }
        table.tipsTable td
        {
            padding: 8px;
        }
        
        table.listProficient tbody td
        {
            text-align: center;
        }
    </style>


    <style type="text/css">
    table.configJGroup td.t1{ text-align:right; padding-right:5px; width:110px;}
    table.configJGroup td{ padding:5px; border:1px solid #ddd;}
    </style>

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <asp:ScriptManagerProxy ID="ScriptManagerProxy1" runat="server">
    </asp:ScriptManagerProxy>
    <div style="width: 100%; text-align: right; padding-right: 100px; margin-top: 15px;">
        <span style="padding-right: 50px;">
            <asp:HyperLink ID="HyperLinkBack" runat="server">返回</asp:HyperLink></span>
    </div>
    <div style="width: 100%;">
        <div style="float: left;">
            <img src="images/judge/nomalJudgeGroup.png" alt="普通阅卷组" />
        </div>
        <br />
        <div style="float: right; margin: 10px 50px 10px 10px;">
            <span style="margin-right: 10px; display: none;">立即检查目前配置是否可以开启阅卷</span><span><a
                href="#" onclick="AddJGroup()">新建分组</a></span>
        </div>
    </div>

    <asp:UpdatePanel ID="UpdatePanel1" UpdateMode="Always" ChildrenAsTriggers="true" runat="server">
 <ContentTemplate>

    <div>
        <asp:PlaceHolder ID="PlaceHolder1" runat="server">
            <table class="tipsTable">
                <tbody>
                    <tr>
                        <td class="tdKey">
                            <span>当前未分配的模块：</span>
                        </td>
                        <td class="tdValue">
                            <asp:Literal ID="Literal1" runat="server"></asp:Literal>
                        </td>
                    </tr>
                </tbody>
            </table>
        </asp:PlaceHolder>
    </div>
    <div>
        <asp:GridView CssClass="list" ID="JudgeGroupList" OnRowCommand="JudgeGroupList_RowCommand"
            OnRowDataBound="JudgeGroupList_RowDataBound" AutoGenerateColumns="false" runat="server">
            <Columns>
                <asp:BoundField DataField="Name" HeaderText="组名" />
                <asp:TemplateField HeaderText="知识点">
                    <ItemTemplate>
                    </ItemTemplate>
                </asp:TemplateField>
                <asp:TemplateField HeaderText="阅卷老师">
                    <ItemTemplate>
                        <asp:LinkButton ID="judgerOfGroup_LnkBtn" runat="server"></asp:LinkButton>
                        <div style="display: none;">
                            <asp:Label ID="JudgerNames_lbl" runat="server" Text=""></asp:Label>
                        </div>
                    </ItemTemplate>
                </asp:TemplateField>
                <asp:BoundField DataField="GroupLeaderUserNameAndRealName" HeaderText="组长" />
                <asp:TemplateField HeaderText="操作">
                    <ItemTemplate>
                        <asp:HyperLink ID="HyperLink1" Visible="false" runat="server">调整</asp:HyperLink>
                        <asp:LinkButton ID="del_LnkBtn" CommandName="del" runat="server">删除</asp:LinkButton>
                    </ItemTemplate>
                </asp:TemplateField>
            </Columns>
            <EmptyDataTemplate>
                <center>
                    未找到任何阅卷小组</center>
            </EmptyDataTemplate>
        </asp:GridView>
        <div style="display: none;">
            <asp:Button ID="refresh_btn" runat="server" ClientIDMode="Static" Text="refresh" />
            <asp:Button ID="refresh_btn_post" runat="server" ClientIDMode="Static" Text="refresh" /></div>
        <asp:HiddenField ID="HiddenField_ExamID" runat="server" />
    </div>

     <asp:PlaceHolder ID="PlaceHolderProficient" runat="server">
    <div style="margin-top: 25px;">
        <span>
            <img src="images/judge/proficientJudgeGroup.jpg" alt="专家阅卷组" /></span><br />
        <span style="width: 75px; float: right; margin-right: 50px; text-align: right;"><a
            href="#" onclick="showAddProficientPanel()">添加专家</a></span>
    </div>
    <asp:GridView ID="ProficientList" OnRowCommand="ProficientList_RowCommand" OnRowDataBound="ProficientList_RowDataBound"
        AutoGenerateColumns="false" runat="server" CssClass="list listProficient">
        <Columns>
            <asp:BoundField HeaderText="序号" />
            <asp:BoundField HeaderText="用户名" DataField="UserName" />
            <asp:BoundField HeaderText="姓名" DataField="RealName" />
            <asp:BoundField HeaderText="身份" DataField="UserName" DataFormatString="专家" />
            <asp:TemplateField HeaderText="操作">
                <ItemTemplate>
                    <asp:LinkButton ID="lnk_del" CommandName="del" runat="server">删除</asp:LinkButton>
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
        <EmptyDataTemplate>
            未设置任何专家
        </EmptyDataTemplate>
    </asp:GridView>

</asp:PlaceHolder>

    <div style="display: none;">
        <div id="addGroupPanel">
            <JM:ConfigJudgeGroup ID="addOrUpdateJudgeGroup" runat="server"></JM:ConfigJudgeGroup>
        </div>
    </div>
    </ContentTemplate>
   </asp:UpdatePanel>
    <div style="display: none;">
        <div id="ReviewJudgerPanel" style="margin: 10px;">
            <span id="ReviewJudgerPanel_span"></span>
        </div>
    </div>
    <%--   <div style="display: none;">
        <div id="addProficentPanel">

        </div>
    </div>--%>
</asp:Content>
