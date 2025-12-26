-- Create subscription_plans table
create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null default 0,
  duration_months integer not null default 1,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.subscription_plans enable row level security;

-- Policies for subscription_plans
create policy "Public read access"
  on public.subscription_plans for select
  using (true);

-- Create business_subscriptions table
create table if not exists public.business_subscriptions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  plan_id uuid not null references public.subscription_plans(id),
  status text default 'active',
  start_date timestamp with time zone default timezone('utc'::text, now()) not null,
  end_date timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.business_subscriptions enable row level security;

-- Policies for business_subscriptions
create policy "Users can view their own business subscriptions"
  on public.business_subscriptions for select
  using (
    auth.uid() in (
      select owner_id from public.businesses where id = business_subscriptions.business_id
    )
  );

create policy "Users can insert their own business subscriptions"
  on public.business_subscriptions for insert
  with check (
    auth.uid() in (
      select owner_id from public.businesses where id = business_subscriptions.business_id
    )
  );

create policy "Users can update their own business subscriptions"
  on public.business_subscriptions for update
  using (
    auth.uid() in (
      select owner_id from public.businesses where id = business_subscriptions.business_id
    )
  );

-- Seed default plans using the specific UUIDs we hardcoded in the frontend
insert into public.subscription_plans (id, name, price, duration_months, is_active)
values 
  ('11111111-1111-1111-1111-111111111111', 'Başlanğıc', 0, 12, true),
  ('22222222-2222-2222-2222-222222222222', 'Professional', 29, 1, true),
  ('33333333-3333-3333-3333-333333333333', 'Premium', 49, 1, true)
on conflict (id) do nothing;
