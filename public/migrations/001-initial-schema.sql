--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
create table Files (
    'id' integer primary key,
    'path' text not null unique,
    'last_modified' integer not null
);

create table AttributesMeta (
    'name' text primary key not null
);

create table Attributes (
    'file_id' integer not null,
    'attr_name' text not null,
    'attr_data' text not null,
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