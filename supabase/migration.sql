-- LEN Credit Wallet — Supabase Schema Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ─── Profiles ───────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  initials text not null default '',
  mobile text not null default '',
  email text not null default '',
  membership_tier text not null default 'Standard Member',
  role text not null default 'member' check (role in ('member', 'merchant', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ─── Wallets ────────────────────────────────────────────────────────────────

create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  balance numeric not null default 0,
  total_earned numeric not null default 0,
  total_used numeric not null default 0,
  expiry text not null default '',
  renewal_status text not null default '',
  loyalty_credit text not null default '',
  created_at timestamptz not null default now()
);

alter table public.wallets enable row level security;

create policy "Users can read own wallet"
  on public.wallets for select
  using (auth.uid() = user_id);

create policy "Users can update own wallet"
  on public.wallets for update
  using (auth.uid() = user_id);

-- ─── Transactions ───────────────────────────────────────────────────────────

create table if not exists public.transactions (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  amount numeric not null,
  type text not null check (type in ('earned', 'used', 'expired')),
  status text not null default 'completed',
  created_at timestamptz not null default now()
);

alter table public.transactions enable row level security;

create policy "Users can read own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

-- ─── Notifications ──────────────────────────────────────────────────────────

create table if not exists public.notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null default '',
  icon_type text not null default 'credit',
  unread boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "Users can read own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Users can insert own notifications"
  on public.notifications for insert
  with check (auth.uid() = user_id);

-- ─── Members Directory ──────────────────────────────────────────────────────

create table if not exists public.members (
  id bigint generated always as identity primary key,
  name text not null,
  business text not null,
  photo text not null default '',
  phone text,
  whatsapp text,
  website text,
  created_at timestamptz not null default now()
);

alter table public.members enable row level security;

-- All authenticated users can read the directory
create policy "Authenticated users can read members"
  on public.members for select
  using (auth.role() = 'authenticated');

-- ─── Settlements ────────────────────────────────────────────────────────────

create table if not exists public.settlements (
  id bigint generated always as identity primary key,
  merchant text not null,
  period text not null,
  redeemed text not null,
  amount text not null,
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Paid')),
  created_at timestamptz not null default now()
);

alter table public.settlements enable row level security;

create policy "Authenticated users can read settlements"
  on public.settlements for select
  using (auth.role() = 'authenticated');

create policy "Admins can update settlements"
  on public.settlements for update
  using (
    exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ─── Trigger: Auto-create profile on signup ─────────────────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, initials)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'initials', '')
  );

  insert into public.wallets (user_id, balance, total_earned, total_used, expiry, renewal_status, loyalty_credit)
  values (new.id, 0, 0, 0, '', '', '');

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Seed: Member directory ─────────────────────────────────────────────────

insert into public.members (name, business, photo, phone, whatsapp, website) values
  ('Bryan Cheung', '人工智能辦公室應用', 'BC', '91001001', '85291001001', 'https://example.com'),
  ('Eddy To', '保險及強積金 / 理財顧問', 'ET', '91001002', '85291001002', 'https://example.com'),
  ('Jacky Chiu', '營銷科技學院', 'JC', '91001003', '85291001003', 'https://example.com'),
  ('Joseph Ng', '舞蹈治療', 'JN', '91001004', '85291001004', 'https://example.com'),
  ('Miranda Mok', '基因抗衰老產品', 'MM', '91001005', '85291001005', 'https://example.com'),
  ('Jason Li', '投資教育', 'JL', '91001006', '85291001006', 'https://example.com'),
  ('Anita Cheung', '交友約會', 'AC', '91001007', '85291001007', 'https://example.com'),
  ('Fanny Lam', '皮膚護理及減壓按摩服務', 'FL', '91001008', '85291001008', 'https://example.com'),
  ('Horace Lai', '會計核數', 'HL', '91001009', '85291001009', 'https://example.com'),
  ('Jenny Tse', '企業文化諮詢顧問', 'JT', '91001010', '85291001010', 'https://example.com'),
  ('Marco Leung', '商舖地產代理', 'ML', '91001011', '85291001011', 'https://example.com'),
  ('Fung Lo', '泰式到會服務 / 到會餐飲', 'FL', '91001012', '85291001012', 'https://example.com'),
  ('Cathy Wong', 'ERP 企業管理系統顧問', 'CW', '91001013', '85291001013', 'https://example.com')
on conflict do nothing;

-- ─── Seed: Settlements ──────────────────────────────────────────────────────

insert into public.settlements (merchant, period, redeemed, amount, status) values
  ('ABC Design Studio', 'Oct 2024', 'HKD 3,840', 'HKD 3,648', 'Pending'),
  ('XYZ Photography', 'Oct 2024', 'HKD 2,100', 'HKD 1,995', 'Approved'),
  ('DEF Consulting', 'Sep 2024', 'HKD 4,500', 'HKD 4,275', 'Paid')
on conflict do nothing;
