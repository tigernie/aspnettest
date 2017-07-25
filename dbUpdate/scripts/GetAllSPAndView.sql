SELECT name,[type] as TypeName FROM sys.all_objects 
WHERE ([type] = 'P'  OR [type]='v' or [type]='FN' or [type]='IF') and [is_ms_shipped] = 0 
and name not in ('sp_helpdiagramdefinition','sp_helpdiagrams','sp_alterdiagram','sp_creatediagram','sp_dropdiagram','sp_renamediagram','sp_upgraddiagrams','fn_diagramobjects')
ORDER BY name

