select b.name,a.name as columnName, 
case when systypes.name in ('binary','char','nchar') then (systypes.name + '(' + cast(a.prec as varchar(50)) + ')') 
when systypes.name in ('decimal','numeric') then (systypes.name + '(' + cast(a.prec as varchar(50)) + ',' + cast(a.scale as varchar(50)) + ')') 
when systypes.name in ('nvarchar','varchar','varbinary') then (case when a.prec = -1 then (systypes.name + '(MAX)') else (systypes.name + '(' + cast(a.prec as varchar(50)) + ')') end) 
else systypes.name end as columnType,
 syscomments.text as defaultValue, a.isnullable as isnullable,
  cast(sys.extended_properties.value as varchar(1024)) as comments,a.colstat as isIdentity
  from syscolumns as a  inner join systypes on  a.xtype = systypes.xtype right join (select * from sysobjects where name=@tableName) as b
on a.id = b.id left outer join sys.extended_properties 
on ( sys.extended_properties.minor_id = a.colid and sys.extended_properties.major_id = a.id) left outer join syscomments 
on a.cdefault = syscomments.id where a.id in (select id from sysobjects where xtype = 'u') and (systypes.name <> 'sysname') order by a.colid