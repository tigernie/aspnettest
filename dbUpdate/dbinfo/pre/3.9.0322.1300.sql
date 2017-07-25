    
if not exists(select * from syscolumns where id=object_id('ExamInfo') and name='AllowSubmit')
 begin     
   ALTER TABLE examInfo ADD AllowSubmit bit not null default(1)
end  

