/// <reference path="jquery-1.7.min.js" />
function showChart(scoreData) {
    var categories = scoreData.SocreRange, name = '分数段';
    var colors = Highcharts.getOptions().colors;
    var data = new Array();
    var total = 0;
    $.each(scoreData.StudentsCount, function (i, count) {
        data.push({ y: count, color: colors[i] });
        total += count;
    });

    function setChart(name, categories, data, color) {
        chart.xAxis[0].setCategories(categories, false);
        chart.series[0].remove(false);
        chart.addSeries({
            name: name,
            data: data,
            color: color || 'white'
        }, false);
        chart.redraw();
    }

    var chart = $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text:'<b>'+ scoreData.ExamName+'</b>'
        },
        subtitle: {
            text: ''+scoreData.SchoolName + ' 分数分布情况(共' + total + '人)'
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            title: {
                text: '考生人数(人)'
            }
        },
        plotOptions: {
            column: {
                cursor: 'default',
                dataLabels: {
                    enabled: true,
                    color: colors[0],
                    style: {
                        fontWeight: 'bold'
                    },
                    formatter: function () {
                        return this.y + '人';
                    }
                }
            }
        },
        tooltip: {
            formatter: function () {
                var point = this.point,
                    s = this.x + '分 :<b>' + (this.y * 100.0 / total).toFixed(1) + '%</b><br/>';
                return s;
            }
        },
        series: [{
            name: name,
            data: data,
            color: 'white'
        }],
        exporting: {
            enabled: false
        }
    })
    .highcharts(); // return chart
};