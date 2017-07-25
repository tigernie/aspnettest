DELETE FROM [SysConfig] WHERE CfgName='MinVersion';
insert into [SysConfig] values('MinVersion','',32,'String',null,null);