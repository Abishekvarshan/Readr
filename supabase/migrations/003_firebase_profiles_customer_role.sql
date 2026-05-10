alter table if exists public.firebase_profiles
  alter column role set default 'customer';

update public.firebase_profiles
set role = 'customer'
where role = 'seller';
