-- One private JSON snapshot per authenticated FORM Fitness user.
create table if not exists public.fitness_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.fitness_states enable row level security;

drop policy if exists "Read own fitness state" on public.fitness_states;
create policy "Read own fitness state" on public.fitness_states
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Insert own fitness state" on public.fitness_states;
create policy "Insert own fitness state" on public.fitness_states
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Update own fitness state" on public.fitness_states;
create policy "Update own fitness state" on public.fitness_states
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'fitness_states'
  ) then
    alter publication supabase_realtime add table public.fitness_states;
  end if;
end $$;
