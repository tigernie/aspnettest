function queryScores(id,isStudent) {
    new gzy.popup('试题得分', 670, 490, {
        url: 'ScoreByStudent.aspx?AnswerSheetID=' + id + "&ignoreStu=true" //+ '&isStudent=' + isStudent
    });

}