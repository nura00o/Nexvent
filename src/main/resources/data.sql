insert into role(name) values ('ROLE_ADMIN') on conflict do nothing;
insert into role(name) values ('ROLE_USER') on conflict do nothing;

insert into users(id, email, password, full_name, enabled, locked)
values (
           1,
           'admin@event.com',
           '$2a$10$7EqJtq98hPqEX7fNZaFWoO5Gx2QxQq8qG7Y8ZQ2zY8X7a8n7Q7Q7W', -- пароль: admin123
           'System Admin',
           true,
           false
       );

insert into user_roles(user_id, role_id)
select 1, id from role where name = 'ROLE_ADMIN';

insert into category(name) values ('технологии') on conflict do nothing;
insert into category(name) values ('культура') on conflict do nothing;
insert into category(name) values ('образование') on conflict do nothing;

