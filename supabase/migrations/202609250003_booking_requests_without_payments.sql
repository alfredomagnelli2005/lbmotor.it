-- Rental bookings are contact requests; no deposit or payment is collected.
alter table public.prenotazioni enable row level security;

drop policy if exists "Public can submit booking requests" on public.prenotazioni;

alter table public.prenotazioni
  drop column if exists acconto,
  drop column if exists pagato;

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
    )
  );
