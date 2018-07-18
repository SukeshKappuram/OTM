do $$
begin
    Create table DomainLogs(LogId SERIAL Primary Key,LogHeader text,LogCode text,LogType text,Message text,ReferenceId integer,LoggedFor text,CreationTime DATE NOT NULL DEFAULT CURRENT_DATE,ModifiedTime DATE NOT NULL,Status boolean NOT NULL);
    insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:DomainLogs','CTR','INFO','Creation of DOMAINLOGS Table successfull','DomainLogs',True);
exception when others then 
    insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:DomainLogs','CTR','WARN','DOMAINLOGS Table already Exits','DomainLogs',False);
end;
$$ language 'plpgsql';

DROP Table IF EXISTS Roles CASCADE;
insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Deletion:Roles','DTR','INFO','Deletion of ROLES Table successfull','Roles',true);

Create table Roles(RoleId SERIAL Primary Key,RoleName text UNIQUE,CreationTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,ModifiedTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,Status boolean NOT NULL);
insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:Roles','CTR','INFO','Creation of ROLES Table successfull','Roles',true);

insert into Roles(RoleName,status) Values('SuperAdmin',true);
insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Adding-Data:Roles','INT','INFO','Insertion of SuperAdmin Role is successfull','Roles',true);
insert into Roles(RoleName,status) Values('Admin',true);
insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Adding-Data:Roles','INT','INFO','Insertion of Admin Role is successfull','Roles',true);
insert into Roles(RoleName,status) Values('Invisilator',true);
insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Adding-Data:Roles','INT','INFO','Insertion of Invisilator Role is successfull','Roles',true);
insert into Roles(RoleName,status) Values('Evaluator',true);
insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Adding-Data:Roles','INT','INFO','Insertion of Evaluator Role is successfull','Roles',true);
insert into Roles(RoleName,status) Values('TestTaker',true);
insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Adding-Data:Roles','INT','INFO','Insertion of TestTaker Role is successfull','Roles',true);
