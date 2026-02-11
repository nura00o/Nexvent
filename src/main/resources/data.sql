-- roles
insert into roles(name) values ('ROLE_ADMIN') on conflict (name) do nothing;
insert into roles(name) values ('ROLE_USER') on conflict (name) do nothing;
insert into roles(name) values ('ROLE_ORGANIZER') on conflict (name) do nothing;

-- admin (без ручного id)
with ins as (
insert into users(email, password, full_name, enabled, locked)
values (
    'admin@event.com',
    '$2a$10$7EqJtq98hPqEX7fNZaFWoO5Gx2QxQq8qG7Y8ZQ2zY8X7a8n7Q7Q7W',
    'System Admin',
    true,
    false
    )
on conflict (email) do update
                           set full_name = excluded.full_name,
                           enabled   = excluded.enabled,
                           locked    = excluded.locked
                           returning id
                           )
                       insert into user_roles(user_id, role_id)
select ins.id, r.id
from ins
         join roles r on r.name = 'ROLE_ADMIN'
    on conflict do nothing;
