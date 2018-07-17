do $$
begin
  	create table Users(UserId SERIAL Primary Key,FirstName text,LastName text,PhoneNumber text,Email text,DOB DATE NOT NULL,Logged text,LogTime DATE NOT NULL,Online boolean,CreationTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,ModifiedTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,Status boolean);
	insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:Users','CTR','INFO','Creation of USERS Table successfull','Users',true);
end;
$$ language 'plpgsql';
do
$$
begin
  	Create table Roles(RoleId SERIAL Primary Key,RoleName text,UserId integer REFERENCES Users(UserId) ,CreationTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,ModifiedTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,Status boolean);
	insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:Roles','CTR','INFO','Creation of ROLES Table successfull','Roles',true);
exception when others then 
    insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:Roles','CTR','WARN','Creation of ROLES Table Unsuccessfull','Roles',False);
end;
$$ language 'plpgsql';
do
$$
begin
  	Create table Courses(CourseId SERIAL Primary Key,Name text,Description text,CreationTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,ModifiedTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,Status boolean);
	insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:Courses','CTR','INFO','Creation of COURSES Table successfull','Courses',true);
exception when others then 
    insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:Courses','CTR','WARN','Creation of COURSES Table Unsuccessfull','Courses',False);
end;
$$ language 'plpgsql';
do
$$
begin
  	Create table Questions(QuestionId SERIAL Primary Key,CourseId integer REFERENCES Courses(CourseId),Title text,Question text,Option1 text,Option2 text,Option3 text,Option4 text,Answer text,CreatedBy integer REFERENCES Users(UserId),Modified integer REFERENCES Users(UserId),CreationTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,ModifiedTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,Status boolean);
	insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:Questions','CTR','INFO','Creation of QUESTIONS Table successfull','Questions',true);
exception when others then 
    insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:Questions','CTR','WARN','Creation of QUESTIONS Table Unsuccessfull','Questions',False);
end;
$$ language 'plpgsql';
do
$$
begin
  	Create table Tests(TestId SERIAL Primary Key,UserId integer REFERENCES Users(UserId),Duration integer,Quantity integer,PME integer,NME integer,TotalMarks integer,MarksObtained integer,FinalizedTime timestamp,CreationTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,ModifiedTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,Status boolean);
	insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:Tests','CTR','INFO','Creation of TESTS Table successfull','Tests',true);
exception when others then 
    insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:Tests','CTR','WARN','Creation of TESTS Table Unsuccessfull','Tests',False);
end;
$$ language 'plpgsql';
do
$$
begin
  	Create table TestDetails(TesterId SERIAL Primary Key,TestId integer REFERENCES Tests(TestId),QuestionId integer REFERENCES Questions(QuestionId),ChoosedOption text,BookMarked boolean,CreationTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,ModifiedTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,Status boolean);
	insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:TestDetails','CTR','INFO','Creation of TESTDETAILS Table successfull','TestDetails',true);
exception when others then 
    insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:TestDetails','CTR','WARN','Creation of TESTDETAILS Table Unsuccessfull','TestDetails',False);
end;
$$ language 'plpgsql';