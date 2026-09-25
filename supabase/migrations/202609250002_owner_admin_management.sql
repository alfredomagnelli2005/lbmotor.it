-- Admin and owner roles can manage LB Motors application data.
-- The owner can be assigned in Supabase Auth by setting app_metadata.role = 'owner'.
create or replace function public.is_lbmotors_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'owner'), false);
$$;

-- Keep INSERT events available to the admin dashboard's live inbox and bookings.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messaggi') then
      execute 'alter publication supabase_realtime add table public.messaggi';
    end if;
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'prenotazioni') then
      execute 'alter publication supabase_realtime add table public.prenotazioni';
    end if;
  end if;
end
$$;
