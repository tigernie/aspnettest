<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="JudgedDetail.aspx.cs" Inherits="Web.Widget.JudgedDetail" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
       <link type="text/css" rel="stylesheet" href="../styles/style.css" />
   
    <link href="../styles/style_webForms.css" rel="stylesheet" type="text/css" />
    <style type="text/css">
        table.t td{ padding:5px 10px;}
    table.t td{ background-color:#eaeaea;}
     table.t td.c{ text-align:right; padding-right:45px;}
 table.t tr{ height:30px;}
 
 table.t tbody tr td.f{   text-align:right; vertical-align:middle;}
 
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:ListView  ID="ListView1" runat="server">
            <LayoutTemplate>
                <table  class="t list">
                    <tbody runat="server" id="itemPlaceholder">
                    </tbody>
                </table>
            </LayoutTemplate>
            <ItemTemplate>
                <tr>
                    
                    <td class="c">一轮 · 一阅：
                    </td>
                    <td><%#Eval("UserName_1", "{0}")%><%#Eval("Score_1", "给了{0}分")%>
                    </td>
                </tr>
                <tr>
                    <td class="c">一轮 · 二阅：
                    </td>
                    <td><%#Eval("UserName_2", "{0}")%><%#Eval("Score_2")==null?  "（当前阅卷模式不包括二阅）": Eval("Score_2", "给了{0}分")%>
                    </td>
                </tr>
                <tr>
                    <td class="c">一轮 · 三阅：
                    </td>
                    <td><%#Eval("UserName_3", "{0}")%><%#Eval("Score_3") == null ? "（当前阅卷模式不包括三阅）" : Eval("Score_3", "给了{0}分")%>
                    </td>
                </tr>
                <tr>
                   
                   <td class="c">二轮 · 组长：
                    </td>
                    <td><%#Eval("GroupLeaderName", "{0}")%><%#Eval("FirstReviewScore") == null ? "（还未给分或无需处理）" : Eval("FirstReviewScore", "给了{0}分")%>
                    </td>
                </tr>
                <tr>
                    
                    <td class="c"> 三轮 · 专家：
                    </td>
                    <td><%#Eval("ProficientName", "{0}")%><%#Eval("SpecialisticScore") == null ? "（当前阅卷模式专家不参与）" : Eval("SpecialisticScore", "给了{0}分")%>
                    </td>
                </tr>
                <tr>
                    <td colspan="1" class="c">
                        分值：
                    </td>
                    <td>
                        <%#Eval("Score", "{0}分")%>
                    </td>
                </tr>
                     <tr>
                    <td colspan="1" class="c">
                        允许阀值：
                    </td>
                    <td>
                        <%#Eval("ThresholdValue", "{0}分")%>
                    </td>
                </tr>
                     <tr>
                    <td colspan="1" class="c">
                        最终分：
                    </td>
                    <td>
                          <%#(double)Eval("FinalScore") == -3 ? "未完成" : Eval("FinalScore", "{0}分")%>
                                
                    </td>
                </tr>
                      <tr>
                    <td colspan="1" class="c">
                        产生歧义的时间：
                    </td>
                    <td>
                        <%#Eval("GeneratedTime", "{0}")%>
                    </td>
                </tr>
                      <tr>
                    <td colspan="1" class="c">
                        歧义处理完时间：
                    </td>
                    <td>
                        <%#Eval("ProcessedTime") == null ? "（还未处理或无需处理）" : Eval("ProcessedTime", "{0}")%>
                    </td>
                </tr>
            </ItemTemplate>
        </asp:ListView>
    </div>
    </form>
</body>
</html>
