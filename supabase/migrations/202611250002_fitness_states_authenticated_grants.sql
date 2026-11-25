-- The project disables automatic Data API grants for newly created tables.
-- Keep the user-owned table private to signed-in clients and let RLS scope rows.
revoke all on table public.fitness_states from public, anon, authenticated;
grant usage on schema public to authenticated;
grant select, insert, update on table public.fitness_states to authenticated;
