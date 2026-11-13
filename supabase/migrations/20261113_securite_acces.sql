-- À exécuter une fois dans Supabase : Dashboard > SQL Editor > New query > coller > Run.
-- Le script peut être relancé sans risque.
--
-- Sécurité : d'anciennes règles laissaient n'importe quel compte connecté lire, modifier et supprimer
-- les journaux, profils nutrition, pesées et séances de tout le monde. Chacun ne garde que ses données,
-- plus ce que l'app montre à ses amis (séances, journal alimentaire d'aujourd'hui et d'hier).

begin;

-- 1) Journal alimentaire (la règle « Amis : lecture du journal alimentaire du jour » reste en place)
drop policy if exists "Accès daily" on public.nutrition_daily;
drop policy if exists "Accès total nutrition_daily" on public.nutrition_daily;
drop policy if exists "Chacun gère son journal alimentaire" on public.nutrition_daily;
create policy "Chacun gère son journal alimentaire"
  on public.nutrition_daily
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- 2) Profil nutrition et besoins : à soi seul
drop policy if exists "Accès global" on public.nutrition_globals;
drop policy if exists "Accès total nutrition_globals" on public.nutrition_globals;
drop policy if exists "Chacun gère son profil nutrition" on public.nutrition_globals;
create policy "Chacun gère son profil nutrition"
  on public.nutrition_globals
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- 3) Pesées : à soi seul
drop policy if exists "Accès total pour utilisateur connecté" on public.measurements;
drop policy if exists "Chacun gère ses pesées" on public.measurements;
create policy "Chacun gère ses pesées"
  on public.measurements
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- 4) Séances : à soi, et visibles par ses amis (profil d'un ami, comparaison, séances du mois)
drop policy if exists "Accès total pour utilisateur connecté sport" on public.sport_sessions;
drop policy if exists "Sessions visible by authenticated users" on public.sport_sessions;
drop policy if exists "Chacun gère ses séances" on public.sport_sessions;
create policy "Chacun gère ses séances"
  on public.sport_sessions
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Amis : lecture des séances" on public.sport_sessions;
create policy "Amis : lecture des séances"
  on public.sport_sessions
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.friendships f
      where f.status = 'accepted'
        and (
          (f.requester_id = auth.uid() and f.addressee_id = sport_sessions.user_id)
          or (f.addressee_id = auth.uid() and f.requester_id = sport_sessions.user_id)
        )
    )
  );

commit;

-- Recharge le cache de l'API
notify pgrst, 'reload schema';
