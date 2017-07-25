/// <reference path="scheme.js" />

$.readyH(function (hm, x) {
    //scheme.update({__type:""});
    scheme.getList({});
    scheme.update({
        __type: "GZY.Exam.Model.Entity.PaperParam",
        Name: "测试234\"\\",
        ParamType: "Professional",
        CreatedTime: "2012-5-10 8:32:12"
    });
});