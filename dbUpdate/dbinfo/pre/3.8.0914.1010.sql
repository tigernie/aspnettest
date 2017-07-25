  update [ProbInfo] set Answer=REPLACE(Answer,CHAR(31),'') where ProbTypeID = 1
  update [ProbInfo] set 
  Answer =
  substring(answer,1,1)+CHAR(31)+
  substring(answer,2,1)+CHAR(31)+
  substring(answer,3,1)+CHAR(31)+
  substring(answer,4,1)
  where ProbTypeID = 1

  update [ProbInfo] set Answer=SUBSTRING(Answer,1,LEN(answer)-1) where  ProbTypeID = 1 and SUBSTRING(answer,len(answer),1)=CHAR(31)