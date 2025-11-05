insert into role(name) values ('ROLE_ADMIN') on conflict do nothing;
insert into role(name) values ('ROLE_ORGANIZER') on conflict do nothing;
insert into role(name) values ('ROLE_USER') on conflict do nothing;

insert into category(name) values ('технологии') on conflict do nothing;
insert into category(name) values ('культура') on conflict do nothing;
insert into category(name) values ('образование') on conflict do nothing;

