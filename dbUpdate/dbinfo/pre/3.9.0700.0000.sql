CREATE VIEW view_answerSheet
AS
SELECT *,(select top 1 StudentNum from examStudent where userid = StudentId) as IDCardNumber from answersheet ;