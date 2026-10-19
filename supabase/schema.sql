-- Run once in your Supabase project's SQL Editor.
create table public.foundation_members (
 "userId" uuid primary key references auth.users(id) on delete cascade,
 "memberId" text not null unique default ('NGNF-' || upper(substr(replace(gen_random_uuid()::text, '-', ''),1,12))),
 email text not null,
 name text not null check (char_length(name) between 2 and 100),
 phone text not null default '',
 state text not null,
 city text not null,
 interests jsonb not null default '[]'::jsonb check (jsonb_typeof(interests)='array'),
 updates boolean not null default false,
 "consentAt" timestamptz not null,
 "createdAt" timestamptz not null default now(),
 "updatedAt" timestamptz not null default now()
);
alter table public.foundation_members enable row level security;
revoke all on table public.foundation_members from anon;
grant select, insert, update, delete on public.foundation_members to authenticated;
create policy "Read own profile" on public.foundation_members for select to authenticated using ((select auth.uid())="userId");
create policy "Create own profile" on public.foundation_members for insert to authenticated with check ((select auth.uid())="userId" and email = (select auth.jwt()->>'email'));
create policy "Edit own profile" on public.foundation_members for update to authenticated using ((select auth.uid())="userId") with check ((select auth.uid())="userId" and email = (select auth.jwt()->>'email'));
create policy "Delete own profile" on public.foundation_members for delete to authenticated using ((select auth.uid())="userId");
