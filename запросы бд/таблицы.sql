use daSERVERbotDB

if OBJECT_ID('users', 'U') is not null drop table users
create table users(
	IdUser int identity(1,1) constraint pk_user primary key,
	UserName nvarchar(30) not null unique,
	[Password] nvarchar(12) not null unique,
	ChatId nvarchar(30)
)


if OBJECT_ID('deeds', 'U') is not null drop table deeds
create table deeds(
	IdDeed int identity(1,1) constraint pk_deed primary key,
	Deed nvarchar(300) not null,
	UserId int not null,
	IsDone bit default 0
)


alter table deeds
add constraint FR_User_Deed
foreign key (UserId) references users (IdUser)