do $$
begin
  	create table Users(UserId SERIAL Primary Key,FirstName text NOT NULL,LastName text NOT NULL,PhoneNumber text NOT NULL,Email text NOT NULL,DOB DATE NOT NULL,Password text NOT NULL,OTP text NOT NULL,Logged text DEFAULT 'NOLOG',LogTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,Online boolean DEFAULT false,CreationTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,ModifiedTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,Status boolean NOT NULL);
	insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:Users','CTR','INFO','Creation of USERS Table successfull','Users',true);
exception when others then 
    insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:Users','CTR','WARN','Creation of USERS Table Unsuccessfull','Users',False);
end;
$$ language 'plpgsql';
do
$$
begin
  	Create table UserRoles(RoleId SERIAL Primary Key,RoleName text REFERENCES Roles(RoleName),UserId integer REFERENCES Users(UserId) ,CreationTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,ModifiedTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,Status boolean NOT NULL);
	insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:UserRoles','CTR','INFO','Creation of USERROLES Table successfull','UserRoles',true);
exception when others then 
    insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:UserRoles','CTR','WARN','Creation of USERROLES Table Unsuccessfull','UserRoles',False);
end;
$$ language 'plpgsql';
do
$$
begin
  	Create table Courses(CourseId SERIAL Primary Key,Name text,Description text,CreationTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,ModifiedTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,Status boolean NOT NULL);
	insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:Courses','CTR','INFO','Creation of COURSES Table successfull','Courses',true);
exception when others then 
    insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:Courses','CTR','WARN','Creation of COURSES Table Unsuccessfull','Courses',False);
end;
$$ language 'plpgsql';
do
$$
begin
  	Create table Questions(QuestionId SERIAL Primary Key,CourseId integer REFERENCES Courses(CourseId),Title text,Question text,Option1 text,Option2 text,Option3 text,Option4 text,Answer text,Difficulty text,CreatedBy integer REFERENCES Users(UserId),Modified integer REFERENCES Users(UserId),CreationTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,ModifiedTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,Status boolean NOT NULL,CONSTRAINT chk_Diffculty CHECK (Difficulty IN ('Easy','Medium','Hard')));
	insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:Questions','CTR','INFO','Creation of QUESTIONS Table successfull','Questions',true);
exception when others then 
    insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:Questions','CTR','WARN','Creation of QUESTIONS Table Unsuccessfull','Questions',False);
end;
$$ language 'plpgsql';
do
$$
begin
  	Create table Tests(TestId SERIAL Primary Key,UserId integer REFERENCES Users(UserId),Duration integer,Quantity integer,PME integer,NME integer,TotalMarks integer,MarksObtained integer,FinalizedTime timestamp,CreationTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,ModifiedTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,Status boolean NOT NULL);
	insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:Tests','CTR','INFO','Creation of TESTS Table successfull','Tests',true);
exception when others then 
    insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:Tests','CTR','WARN','Creation of TESTS Table Unsuccessfull','Tests',False);
end;
$$ language 'plpgsql';
do
$$
begin
  	Create table TestDetails(TesterId SERIAL Primary Key,TestId integer REFERENCES Tests(TestId),QuestionId integer REFERENCES Questions(QuestionId),ChoosedOption text,BookMarked boolean,CreationTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,ModifiedTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,Status boolean NOT NULL);
	insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:TestDetails','CTR','INFO','Creation of TESTDETAILS Table successfull','TestDetails',true);
exception when others then 
    insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-Creation:TestDetails','CTR','WARN','Creation of TESTDETAILS Table Unsuccessfull','TestDetails',False);
end;
$$ language 'plpgsql';
do
$$
begin
	insert into Users(FirstName,LastName,PhoneNumber,Email,DOB,Password,OTP,status) values ('Sukesh','Kappuram','7207160996','iamsukeshk@gmail.com','1991-07-19','P@ssw0rd','753159',false);
	insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Adding-Data:User','INT','INFO','Insertion of SuperAdmin User successfull','Users',true);
	insert into UserRoles(RoleName,UserId,status) values ('SuperAdmin',1,true);
	insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Adding-Data:User-Role','INT','INFO','Insertion of SuperAdmin User-Role successfull','UserRoles',true);
exception when others then
	insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Adding-Data:User','INT','WARN','Insertion of SuperAdmin User unsuccessfull','Users',false);
end;
$$ language 'plpgsql';
