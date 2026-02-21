-- =============================================
-- ComfyCube Initial Schema
-- =============================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- =============================================
-- USERS TABLE (custom, separate from auth.users)
-- =============================================
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  password_hash text not null,
  role text not null default 'user',
  created_at timestamptz default now()
);

-- =============================================
-- PROFILES TABLE (linked to auth.users)
-- =============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  avatar_url text,
  role text not null default 'user'
);

-- Auto-create profile on new auth user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- CATEGORIES TABLE
-- =============================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  created_at timestamptz default now()
);

-- =============================================
-- PRODUCTS TABLE
-- =============================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price numeric(10,2) not null,
  quantity integer not null default 0,
  image_url text not null,
  measurements text not null,
  category_id uuid references public.categories(id) on delete set null,
  created_at timestamptz default now()
);

-- =============================================
-- CART TABLE
-- =============================================
create table if not exists public.cart (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id)
);

-- =============================================
-- CART ITEMS TABLE
-- =============================================
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid references public.cart(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  quantity integer not null default 1,
  created_at timestamptz default now()
);

-- =============================================
-- ORDERS TABLE
-- =============================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  total_price numeric(10,2) not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- =============================================
-- ORDER ITEMS TABLE
-- =============================================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null,
  price_at_purchase numeric(10,2) not null
);

-- =============================================
-- REVIEWS TABLE
-- =============================================
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz default now()
);

-- =============================================
-- WISHLIST TABLE
-- =============================================
create table if not exists public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- =============================================
-- RPC: get_profile
-- =============================================
create or replace function public.get_profile(user_id uuid)
returns json as $$
  select row_to_json(p)
  from public.profiles p
  where p.id = user_id;
$$ language sql security definer;
