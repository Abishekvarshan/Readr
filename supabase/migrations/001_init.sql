create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'customer' check (role in ('customer', 'seller', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  author text not null,
  description text not null,
  category text not null,
  condition text not null check (condition in ('new', 'like_new', 'good', 'fair', 'acceptable')),
  language text not null default 'English',
  price numeric(10,2) not null,
  stock integer not null default 0,
  image_url text not null,
  seller_name text not null,
  isbn text,
  published_year integer,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_address text not null,
  total_amount numeric(10,2) not null,
  currency text not null default 'LKR',
  order_status text not null default 'pending' check (order_status in ('pending', 'paid', 'cancelled', 'failed')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid', 'refunded', 'failed')),
  payhere_payment_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders(id) on delete cascade,
  book_id uuid references public.books(id) on delete set null,
  quantity integer not null,
  unit_price numeric(10,2) not null,
  title text not null
);

create table if not exists public.payment_logs (
  id uuid primary key default gen_random_uuid(),
  order_id text,
  payload jsonb not null,
  is_valid boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payment_logs enable row level security;

create policy if not exists "Profiles are viewable by owner"
on public.profiles for select using (auth.uid() = id);

create policy if not exists "Profiles are editable by owner"
on public.profiles for update using (auth.uid() = id);

create policy if not exists "Books are public readable"
on public.books for select using (true);

create policy if not exists "Orders readable by owner"
on public.orders for select using (auth.uid() = user_id);

create policy if not exists "Order items readable via parent order"
on public.order_items for select using (
  exists (
    select 1 from public.orders
    where public.orders.id = order_items.order_id and public.orders.user_id = auth.uid()
  )
);