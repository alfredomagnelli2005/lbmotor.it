# Configurazione Supabase per LB Motors

1. Imposta `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` nell'ambiente di deploy.
2. Applica `supabase/migrations/202609250001_admin_and_public_requests_rls.sql` al progetto Supabase. La migrazione presuppone le tabelle esistenti `cars`, `prenotazioni`, `messaggi` e il bucket Storage pubblico `cars`.
3. In Supabase Auth, crea l'utente admin, disabilita le registrazioni pubbliche e assegna a quell'utente il claim `app_metadata.role = "admin"` (Auth > Users > utente > Raw app meta data). Non usare `user_metadata` per il ruolo.
4. Dopo l'assegnazione del claim, fai uscire e rientrare l'admin affinché il token contenga il ruolo.

Il pannello richiede l'utente Auth con il claim admin sia nel middleware sia nelle policy RLS. I visitatori possono leggere il catalogo e inserire richieste di prenotazione e messaggi; non possono leggerli, modificarli o cancellarli. La richiesta di noleggio non addebita l'acconto: il pagamento va concordato e confermato dall'azienda.
