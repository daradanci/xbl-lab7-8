use daSERVERbotDB

insert into users (UserName, [Password])
values
('danzel', '123' ), ('Scaramoush', '321')

insert into deeds (Deed, UserId)
values
('������� ��', 1), ('�������� ������', 1), ('������������', 1), ('��������',2), ('English',2)

select d.Deed,d.IsDone from deeds as d 
join 
users as u 
on (u.IdUser=d.UserId) where u.IdUser=1

select * from deeds

update  deeds
set IsDone = 1 
where Deed = '�������� ������' and UserId=1