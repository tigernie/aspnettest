/// <reference path="../viewProblemContent.js" />
/// <reference path="../Tree/gzy.tree.js" />
/// <reference path="problib.js" />
/// <reference path="../jquery-1.7.min.js" />
/// <reference path="paperAnalysis.js" />
/// <reference path="teacher.js" />

//0-非管理员，1-学校管理员，2-成绩管理员
var RESULT_ADMIN = 2, SCHOOL_ADMIN = 1, NOTADMIN = 0;
var adminType ;
$.readyH(function (h, x) {
    paperAnalysis.getAdminType(QueryString('exid'), function (data) {
        adminType = data.amdimType;
        if (adminType == NOTADMIN)
            goOut();
        teacher.getMyInfo(function () {
            new gzy.tabset('ul.mtabs li', 'div.wide>div', {
                changed: function (c) {
                    h.set({ tab: c.index });

                    switch (c.index) {
                        case 0:
                            if (!c.init) {
                                c.init = initPanel_A(h, x);
                            }
                            break;
                        case 1:
                            if (!c.init) {
                                c.init = initPanel_B(h, x);
                            }
                            break;
                        case 2:
                            if (!c.init) {
                                c.init = initPanel_C(h, x);
                            }
                            break;
                        case 3:
                            if (!c.init) {
                                c.init = initPanel_D(h, x);
                            }
                            break;
                        case 4:
                            if (!c.init) {
                                c.init = initPanel_E(h, x);
                            }
                            break;
                    }
                },
                defaultTab: x.tab || 0
            });
        });
    });
});

$(function () {
    $('#exportScoreAnalysis').click(function () {
        paperAnalysis.exportExamAnalysis(QueryString('exid'), function (result) {
            if (result.ok)
                location.replace(result.file);

        })

    })


})

function initPanel_A(h, x) {
    var grid = new DataGrid({
        columns: [{ text: '试卷名称', width: 60 }, { text: '命题难度', width: 60 }, { text: '实测难度', width: 60 }, ],
        table: '#paperDifficulty',
        cells: ['{PaperName}', function (data) {
            if (data.ExpectedDifficulty == null)
                data.ExpectedDifficulty = '未设置初始难度';
            return data.ExpectedDifficulty;
        }, '{ActualDifficulty}'],
        source: paperAnalysis.getPaperDifficulties,
    });
    grid.load({ examId: QueryString('exid') });

    var standardDeviationGrid = new DataGrid({
        columns: [{ text: '单位名称', width: 60 }, { text: '平均分', width: 60 }, { text: '方差', width: 60 }, { text: '标准差', width: 60 }],
        table: '#StandardDeviation',
        cells: ['{SchoolName}', '{Avarage}', '{Variance}', '{StandardDeviation}'],
        source: paperAnalysis.getSchoolScoreInfo,
    });
    standardDeviationGrid.load({ examId: QueryString('exid'), areaCode: null });
    return true;
}

function initPanel_B(h, x) {
    var grid = new DataGrid({
        columns: [{ text: '单位名称', width: 60 }, { text: '平均分', width: 60 }, { text: '最高分', width: 60 }, { text: '最低分', width: 60 }, { text: '排名', width: 60 }],
        table: '#schoolRank',
        cells: ['{SchoolName}', '{Avarage}', '{MaxScore}', '{MinScore}', '{Rank}'],
        source: paperAnalysis.getSchoolRank,
        params: { pagesize: 15 },
    });
    grid.load({ examId: QueryString('exid'), pageindex: 1, areaCode: null });
    return true;
};

function initPanel_C(h, x) {
    showSchoolSelector('#schoolSelectorContainer', function (schoolId) {
        debugger;
        if(schoolId!=null)
            paperAnalysis.getScoreDistribution(QueryString('exid'), schoolId, function (data) {
            showChart(data);
        });
    });
    return true;
};

function showSchoolSelector(container, onclickCallBack) {
    if (adminType == RESULT_ADMIN) {//成绩管理员
        var tree = new gzy.tree({
            sourceType: 'json',
            connector: {
                url: center.getSchoolTree,
                params: { exid: QueryString('exid'), flag: false, noschool: false },
                onload: function () { this.select('0') },
                loading: function (data) {
                    ord = $.extend({}, data.items);
                    data.items = $.grep(data.items, function (item) { return !!item.extra });
                    $.each(data.items, function (i, item) {
                        item.extra = '';
                    });
                }
            },
            onselect: function (item) {
                var schoolId = null;
                if (item.leaf) {
                    schoolId = item.id;
                } else if (item.fid == item.id)
                    schoolId = -1;
                onclickCallBack(schoolId);
            }
        }).renderTo(container);
    }
    else if (adminType == SCHOOL_ADMIN) {
        paperAnalysis.getTopTenSchools(QueryString('exid'), function (data) {
            showList(container, data.data, function (schoolId) {
                onclickCallBack(schoolId);
            });
        });
    }
    else {
    }
};

function goOut() {
    alert('你没有权限查看本次考试成绩统计');
    location.replace('/teacher.htm');
};


function showList(container, data,onclickCallBack) {
    var html = '<ul class="schoolSelectorList">';
    html += '<li><a name="-1">全市</a></li>';
    $.each(data, function (i, item) {
        html += '<li><a name="'+item.Id+'">' + item.Name + '</a></li>';
    });
    $(container).html(html + '</ul>');
    $(container + ' .schoolSelectorList li a').click(function () {
        onclickCallBack($(this).attr('name'));
    });
};


function initPanel_D(h, x) {
    var typeSelector = $('#type');
    typeSelector.append('<option value="1">最难10题</option>');
    typeSelector.append('<option value="0">最易10题</option>');

    var kpSelector = $('#kpSelector');
    kpSelector.empty();
    kpoint.getNodes(function (data) {
        $.each(data.data.rows, function (i, KP) {
            kpSelector.append('<option value="' + KP.id + '">' + KP.text + '</option>');
        });
    });

    var grid = new DataGrid({
        columns: [{ text: '试卷名称', width: 60 }, { text: '题序号', width: 60 }, { text: '试题内容', width: 60 }, { text: '命题难度系数', width: 60 }, { text: '本次实测难度系数', width: 60 }],
        table: '#probDifficulty',
        cells: ['{PaperName}', '{InnerIndex}', new DataGrid.Button({
            text: '{ProblemContent}',
            click: function (e) {
                showProblemContent(e.data.ProblemId);
            }
        }), '{ExpectedDifficulty}', '{ActualDifficulty}'],
        source: paperAnalysis.getPaperProblemDifficulty,
        params: { },
    });
    grid.load({ examId: QueryString('exid'), hardestTopTen: typeSelector.val() == "1", kpId: kpSelector.val() == null ? 0 : kpSelector.val() });

    typeSelector.change(function () {
        reloadTopTen(grid);
    });

    kpSelector.change(function () {
        reloadTopTen(grid);
    });
    return true;
};

function reloadTopTen(grid) {
    var kpSelector = $('#kpSelector');
    var typeSelector = $('#type');
    grid.load({ examId: QueryString('exid'), hardestTopTen: typeSelector.val() == "1", kpId: kpSelector.val() == null ? 0 : kpSelector.val() });
};

function initPanel_E(h, x) {

    var grid = new DataGrid({
        columns: [{ text: '模块', width: 60 }, { text: '模块总题分', width: 60 }, { text: '模块平均得分', width: 60 }, { text: '得分率', width: 60 }],
        table: '#kpScore',
        cells: ['{KPName}', '{KPTotoalScore}', '{KPAvarageScore}', function(data){
            return (data.KPScoreRate * 100).toFixed(1) + '%';

        }],
        source: paperAnalysis.getExamKP,
        params: {},
    });

    showSchoolSelector('#kpAnalysis_schoolSelector', function (schoolId) {
        if (schoolId != null)
            grid.load({ examId: QueryString('exid'), schoolId: schoolId });
    });
    return true;
};