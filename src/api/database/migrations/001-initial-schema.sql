--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
create table Files (
    'id' integer primary key,
    'path' text not null unique,
    'last_modified' integer not null
);

create table AttributesMeta (
    'name' text primary key
);

create table Attributes (
    'file_id' integer,
    'attr_name' text,
    'attr_data' text,
    primary key ('file_id', 'attr_name'),
    foreign key ('file_id') references Files ('id') on delete cascade,
    foreign key ('attr_name') references AttributesMeta ('name') on delete cascade
);


--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
drop table Files;
drop table Attributes;
drop table AttributesMeta;