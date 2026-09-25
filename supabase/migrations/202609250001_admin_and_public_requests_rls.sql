-- Create admin accounts in Supabase Auth and set app_metadata.role = 'admin'
-- using the Supabase dashboard/service role. Never set this claim from the client.

alter table public.cars enable row level security;
alter table public.prenotazioni enable row level security;
alter table public.messaggi enable row level security;

-- Remove legacy policies first: permissive RLS policies are OR-ed together.
do $$
declare existing_policy record;
begin
  for existing_policy in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public' and tablename in ('cars', 'prenotazioni', 'messaggi')
  loop
    execute format('drop policy %I on %I.%I', existing_policy.policyname, existing_policy.schemaname, existing_policy.tablename);
  end loop;
end
$$;

create or replace function public.is_lbmotors_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

drop policy if exists "Public can view cars" on public.cars;
create policy "Public can view cars" on public.cars
  for select to anon, authenticated using (true);

drop policy if exists "LB Motors admins manage cars" on public.cars;
create policy "LB Motors admins manage cars" on public.cars
  for all to authenticated using (public.is_lbmotors_admin())
  with check (public.is_lbmotors_admin());

drop policy if exists "Public can submit booking requests" on public.prenotazioni;
create policy "Public can submit booking requests" on public.prenotazioni
  for insert to anon, authenticated
  with check (
    coalesce(length(trim(cliente)), 0) between 2 and 160
    and coalesce(length(trim(email)), 0) between 5 and 254
    and coalesce(length(trim(telefono)), 0) between 5 and 40
    and date_from is not null and date_to > date_from
    and giorni = (date_to - date_from)
    and exists (
      select 1 from public.cars
      where cars.id = prenotazioni.car_id
        and cars.type = 'noleggio'
        and cars.available = true
        and prenotazioni.prezzo_totale = cars.price * prenotazioni.giorni
        and prenotazioni.acconto = round(cars.price * prenotazioni.giorni * 0.30)
    )
    and pagato = false
  );

drop policy if exists "LB Motors admins manage bookings" on public.prenotazioni;
create policy "LB Motors admins manage bookings" on public.prenotazioni
  for all to authenticated using (public.is_lbmotors_admin())
  with check (public.is_lbmotors_admin());

drop policy if exists "Public can submit contact messages" on public.messaggi;
create policy "Public can submit contact messages" on public.messaggi
  for insert to anon, authenticated
  with check (
    coalesce(length(trim(nome)), 0) between 2 and 160
    and coalesce(length(trim(email)), 0) between 5 and 254
    and coalesce(length(trim(oggetto)), 0) between 2 and 100
    and coalesce(length(trim(messaggio)), 0) between 2 and 5000
    and letto = false
  );

drop policy if exists "LB Motors admins manage messages" on public.messaggi;
create policy "LB Motors admins manage messages" on public.messaggi
  for all to authenticated using (public.is_lbmotors_admin())
  with check (public.is_lbmotors_admin());

grant select on public.cars to anon, authenticated;
grant insert on public.prenotazioni, public.messaggi to anon, authenticated;
grant select, insert, update, delete on public.cars, public.prenotazioni, public.messaggi to authenticated;

-- The existing `cars` bucket stays publicly readable for vehicle photos; only admins can write.
drop policy if exists "Anyone can view car photos" on storage.objects;
create policy "Anyone can view car photos" on storage.objects
  for select to anon, authenticated using (bucket_id = 'cars');

drop policy if exists "LB Motors admins manage car photos" on storage.objects;
create policy "LB Motors admins manage car photos" on storage.objects
  for all to authenticated using (bucket_id = 'cars' and public.is_lbmotors_admin())
  with check (bucket_id = 'cars' and public.is_lbmotors_admin());
