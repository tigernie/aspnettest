SELECT 
a.name,
object_name(b.fkeyid) as foreignTable ,
 (SELECT name FROM syscolumns WHERE colid = b.fkey AND id = b.fkeyid) foreignColumn,
 object_name(b.rkeyid) primaryTable,
 (SELECT name FROM syscolumns WHERE colid = b.rkey AND id = b.rkeyid) primaryColumn,
 ObjectProperty(a.id,'CnstIsUpdateCascade') updateCascade,
ObjectProperty(a.id,'CnstIsDeleteCascade') deleteCascade 
FROM sysobjects a 
JOIN sysforeignkeys b ON a.id = b.constid 
JOIN sysobjects c ON a.parent_obj = c.id 
WHERE object_name(b.fkeyid) = @tableName 