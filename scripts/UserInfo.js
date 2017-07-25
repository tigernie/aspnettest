



function showStudetnInfo(className, classIds,examId) {
    $.post("UserInfo.ashx", { "method": "showStudentByClassIds", "classIds": classIds,"examId":examId },
           function (data) {
               var htmlStr = "";
               htmlStr += "<thead><tr><th>学号</th><th>姓名</td></tr></thead>";
               $.each(data.result, function (index, content) {
                   htmlStr += "<tr><td>" + content.stuid + "</td><td>" + content.name + "</td></tr>";
               });

               htmlStr = "<table class=\"list\">" + htmlStr + "</table>";
               new gzy.popup(className + ' 学生信息', 350, 450, {
                   html: htmlStr
               });

           }, "Json");

}