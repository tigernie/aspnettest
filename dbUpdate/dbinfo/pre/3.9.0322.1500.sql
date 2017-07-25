ALTER view [view_examDetail] as 
select t1.*,t2.XM as CreaterName from ExamInfo as t1 
left join dbo.JCTB0201 as t2  
on t1.createrId = t2.id 