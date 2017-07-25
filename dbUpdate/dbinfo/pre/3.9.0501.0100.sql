ALTER VIEW [dbo].[view_examInfoBrief] AS 
select t1.ID,t2.XM as CreaterName,t1.ExamName,
t1.ExamStartTime,t1.ExamEndTime,t1.ExamMode,
t1.StudentCount,t1.ExamState,t1.paperType,t1.State,
t1.CreatedTime,t1.ErrorLogId ,t1.ArrangeMentMode,t1.CreaterId,t1.LoginType,t1.Currency,t1.Position,t1.AllowSubmit,t1.RandomArrange,t1.AllowSubmitEndTime
from dbo.ExamInfo as t1  left join dbo.JCTB0201 as t2  on t1.createrId = t2.id;