-- 0001_init.sql
create table if not exists public.categories (
  id text primary key,                 -- 'health','education','agriculture',...
  pillar text not null check (pillar in ('justice','liberty','equality','fraternity')),
  name_i18n jsonb not null             -- {"en":"Health","hi":"स्वास्थ्य","mr":"आरोग्य"}
);

create table if not exists public.schemes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  level text not null check (level in ('central','state')),
  state_code text,                     -- null = all-India
  category_id text references public.categories(id),
  name_i18n jsonb not null,
  summary_i18n jsonb not null,
  benefit_i18n jsonb not null,
  benefit_tier smallint not null default 2 check (benefit_tier between 1 and 3),
  ease smallint not null default 2 check (ease between 1 and 3), -- 3 = easiest to apply
  status text not null default 'open' check (status in ('open','closed','unknown')),
  apply_url text not null,
  source_url text not null,            -- official source of rules
  last_verified date not null,
  rules jsonb not null,                -- rule tree
  articles text[] default '{}',        -- constitutional articles linked, e.g. {'21A','41'}
  is_published boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists public.scheme_documents (
  id uuid primary key default gen_random_uuid(),
  scheme_id uuid references public.schemes(id) on delete cascade,
  sort smallint not null,
  mandatory boolean not null default true,
  alt_group text,                      -- documents sharing a group are "any one of"
  name_i18n jsonb not null,
  hint_i18n jsonb                      -- where/how to obtain
);

create table if not exists public.scheme_steps (
  id uuid primary key default gen_random_uuid(),
  scheme_id uuid references public.schemes(id) on delete cascade,
  sort smallint not null,
  text_i18n jsonb not null
);

-- Shortlist table: only user-linked table. Stores scheme ids, never personal answers.
create table if not exists public.shortlist (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  scheme_id uuid not null references public.schemes(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, scheme_id)
);

-- RLS
alter table public.categories enable row level security;
alter table public.schemes enable row level security;
alter table public.scheme_documents enable row level security;
alter table public.scheme_steps enable row level security;
alter table public.shortlist enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'public read categories') then
    create policy "public read categories" on public.categories for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'public read schemes') then
    create policy "public read schemes" on public.schemes for select using (is_published);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'public read docs') then
    create policy "public read docs" on public.scheme_documents for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'public read steps') then
    create policy "public read steps" on public.scheme_steps for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'own shortlist select') then
    create policy "own shortlist select" on public.shortlist for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'own shortlist insert') then
    create policy "own shortlist insert" on public.shortlist for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'own shortlist delete') then
    create policy "own shortlist delete" on public.shortlist for delete using (auth.uid() = user_id);
  end if;
end $$;

-- Self-service data wipe
create or replace function public.delete_my_data() returns void
language sql security invoker as $$ 
  delete from public.shortlist where user_id = auth.uid(); 
$$;
