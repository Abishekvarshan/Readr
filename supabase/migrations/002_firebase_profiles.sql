create table if not exists public.firebase_profiles (
  id text primary key,
  full_name text,
  email text unique,
  photo_url text,
  provider text,
  role text not null default 'customer' check (role in ('customer', 'seller', 'admin')),
  last_login_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.firebase_profiles enable row level security;
