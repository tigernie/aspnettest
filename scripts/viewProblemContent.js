function showProblemContent(id) {
    debugger;
    var win = new gzy.popup('查看试题内容', 600, 450, {
        onload: function () {
            var t = $('<table class="property_grid" cellspacing="1" cellpadding="0" width="100%"/>').appendTo(win.body),
                add = function (name, value) { $.gf('<tr><th valign="top">{1}：</th><td valign="top">{2}</td></tr>', name, value).appendTo(t) };
            problem.getProblem(id, function (d) {
                with (d.data) {
                    add('题型', type);
                    add('题面内容', content);
                    switch (typeId) {
                        case 2: //操作题
                            add('评分细则', judgeStandard || '(无)');
                            if (attachment) add('试题附件', String.$('<a href="/problemattachment.get.ashx?pid={1}" target="_blank">{2}</a>',
                                id, attachment.split(/[\\\/]/).reverse()[0]));
                            break;
                        case 3: //判断题
                            add('标准答案', answer == '1' ? '正确' : '错误');
                            break;
                        default:
                            var sep = String.fromCharCode(0x1f);
                            var reg = new RegExp(sep, 'g');
                            add('标准答案', answer.replace(reg, '&nbsp;'));
                    }
                    add('所属知识点', kfullpath);
                    add('难度', difficulty);
                    add('出题', author + '，' + crdate);
                    add('审核', audit.status == 2 ? (audit.user ? (audit.user + '审核于' + audit.time) : '(已审核)') : '(未审核)');
                    add('曝光', used + '次' + (exposal ? '，最后曝光于 ' + exposal : ''));
                    add('组卷次数', generated + '次');
                    add('实测难度', right || wrong ? (parseInt(right*1.0 / (right + wrong))) : 0);

                    if (properties.length) {
                        var props = [];
                        for (var i = 0, prop; prop = properties[i++];) {
                            props.push('<span style="min-width:100px;float:left;clear:left">' + prop.name + '：</span><span style="float:left">' + prop.value + '</span>');
                        }
                        add('扩展属性', props.join(''));
                    }
                }
            });
        }
    });
};