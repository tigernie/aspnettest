create proc p_helpindex
@tbname sysname ='' ,
@CLUSTERED int = '1'
as
--生成索引信息及索引创建脚本
--@tbname 表名，空返回空
--@CLUSTERED   是否显示聚集索引,1显示聚集索引,2不显示聚集索引
--调用：p_helpindex 'dbo.customers','1'
--转载请注明出处
if @tbname is null or @tbname = ''
    return -1
declare @t table(
    table_name nvarchar(100),
    schema_name nvarchar(100),
    fill_factor int,
    is_padded int,
    ix_name nvarchar(100),
    type int,
    keyno int,
    column_name nvarchar(200),
    cluster varchar(20),
    ignore_dupkey varchar(20),
    [unique] varchar(20),
    groupfile varchar(10)
)
declare
    @table_name nvarchar(100),
    @schema_name nvarchar(100),
    @fill_factor int,
    @is_padded int,
    @ix_name nvarchar(100),@ix_name_old nvarchar(100),
    @type int,
    @keyno int,
    @column_name nvarchar(100),--@column_name_temp nvarchar(500),
    @cluster varchar(20),
    @ignore_dupkey varchar(20),
    @unique varchar(20),
    @groupfile varchar(10)
declare ms_crs_ind cursor local static for
    select
        distinct table_name = a.name,
        schema_name = b.name,
        fill_factor= c.origfillfactor,
        is_padded = case when c.status = 256 then 1 else 0 end,
        ix_name = c.name,
       type =  c.indid  , d.keyno,
        column_name = e.name + case when  indexkey_property(a.id,c.indid, d.keyno, 'isdescending') =1 then ' desc ' else '' end,
       case when (c.status & 16)<>0 then 'clustered' else 'nonclustered' end,
       case when (c.status & 1) <>0 then  'IGNORE_DUP_KEY' else '' end,
       case when (c.status & 2) <>0 then  'unique' else '' end ,
        g.groupname
    from sysobjects a
    inner join sysusers b on a.uid = b.uid
    inner join sysindexes c on a.id = c.id
    inner join sysindexkeys d on a.id = d.id and c.indid = d.indid
    inner join syscolumns e on   a.id = e.id and d.colid = e.colid
    inner join sysfilegroups g on g.groupid = c.groupid
    left join master.dbo.spt_values f on f.number = c.status and f.type = 'I'
    where a.id = object_id(@tbname) and c.indid < 255
          and (c.status & 64)=0 and c.indid >= @CLUSTERED
    order by c.indid,d.keyno
 
open ms_crs_ind
fetch ms_crs_ind into @table_name ,
    @schema_name ,
    @fill_factor,
    @is_padded,
    @ix_name,
    @type ,
    @keyno,
    @column_name,
    @cluster ,
    @ignore_dupkey ,
    @unique ,
    @groupfile
 
 
if @@fetch_status < 0
begin
    deallocate ms_crs_ind
    raiserror(15472,-1,-1) --'Object does not have any indexes.'
    return -1
end
while @@fetch_status >= 0
begin
    if exists(select 1 from @t where ix_name = @ix_name)
        update @t
        set column_name = column_name+','+@column_name
        WHERE IX_NAME = @IX_NAME
    else
        insert into @t
        select @table_name ,
        @schema_name ,
        @fill_factor,
        @is_padded,
        @ix_name,
        @type ,
        @keyno,
        @column_name,
        @cluster ,
        @ignore_dupkey ,
        @unique ,
        @groupfile
    fetch ms_crs_ind into @table_name ,
        @schema_name ,
        @fill_factor,
        @is_padded,
        @ix_name,
        @type ,
        @keyno,
        @column_name,
        @cluster ,
        @ignore_dupkey ,
        @unique ,
        @groupfile
 
end
deallocate ms_crs_ind
 
select ix_name as Name
     , 'CREATE '+upper([unique])+
     case when [unique] = '' then '' else ' ' end+upper(cluster)+' INDEX ['+ix_name+'] ON '+table_name+'('+column_name+')' +
     case when fill_factor > 0 or is_padded = 1 or (upper(cluster) != 'NONCLUSTERED' and ignore_dupkey = 'IGNORE_DUP_KEY' )
     then ' WITH '
       +case when is_padded = 1 then 'PAD_INDEX,' else '' end
        +case when fill_factor > 0 then 'FILLFACTOR ='+ltrim(fill_factor) else '' end
        +case when ignore_dupkey = 'IGNORE_DUP_KEY' and upper(cluster) = 'NONCLUSTERED'
              then case when  (fill_factor > 0 or is_padded = 1)
                   then ',IGNORE_DUP_KEY' else ',IGNORE_DUP_KEY' end
              else '' end
     else '' end
+' ON ['+  groupfile+']' as Scripts
from @t
return 0
