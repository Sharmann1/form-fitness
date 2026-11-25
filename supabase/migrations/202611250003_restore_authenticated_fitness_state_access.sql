-- Restore only the privileges required by signed-in clients.
-- Existing RLS policies continue to restrict every row to auth.uid().
grant usage on schema public to authenticated;
grant select, insert, update on table public.fitness_states to authenticated;
