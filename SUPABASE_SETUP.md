# Configurazione Supabase per LB Motors

1. Imposta `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` nell'ambiente di deploy.
2. Applica `supabase/migrations/202609250001_admin_and_public_requests_rls.sql` al progetto Supabase. La migrazione presuppone le tabelle esistenti `cars`, `prenotazioni`, `messaggi` e il bucket Storage pubblico `cars`.
3. In Supabase Auth, crea l'utente proprietario, disabilita le registrazioni pubbliche e assegna a quell'utente il claim `app_metadata.role = "owner"` (Auth > Users > utente > Raw app meta data). Gli altri collaboratori ricevono il claim `admin` tramite invito. Non usare `user_metadata` per i ruoli.
4. Dopo l'assegnazione del claim, fai uscire e rientrare dal gestionale affinché il token contenga il ruolo.

Per attivare gli inviti admin, imposta in Vercel la variabile server-only `SUPABASE_SERVICE_ROLE_KEY` con la service role key del progetto Supabase, poi ridistribuisci. Non usare il prefisso `NEXT_PUBLIC_` per questa chiave. Aggiungi anche `https://lbmotor.it/admin/login` agli URL di redirect consentiti in Supabase Auth (aggiungi `www` se lo usi come dominio canonico).

Per aggiornare il tuo utente attuale da admin a proprietario, esegui una sola volta in SQL Editor sostituendo l'email con quella del tuo account:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"owner"}'::jsonb
where email = 'la-tua-email-admin';
```

Applica anche `supabase/migrations/202609250002_owner_admin_management.sql` in SQL Editor. Questa aggiorna la funzione RLS per riconoscere sia gli utenti `admin` sia l'utente `owner` e abilita gli eventi realtime per messaggi e prenotazioni.

Il pannello richiede il claim `app_metadata.role` uguale ad `admin` o `owner`, verificato dal middleware e dalle policy RLS. I visitatori possono leggere il catalogo e inserire richieste di prenotazione e messaggi; non possono leggerli, modificarli o cancellarli. La richiesta di noleggio non addebita l'acconto: il pagamento va concordato e confermato dall'azienda.
