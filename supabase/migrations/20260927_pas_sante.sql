-- À exécuter une fois dans Supabase : Dashboard > SQL Editor > New query > coller > Run.
-- Le script peut être relancé sans risque.
--
-- Nombre de pas de l'app Santé. Une web app ne peut pas lire Santé : c'est un raccourci iOS
-- qui envoie le total du jour à /api/pas avec un lien personnel (jeton), vérifié ici par log_steps.

-- 1) Lien personnel de chaque utilisateur (jeton secret) et son fuseau horaire,
--    pour ranger les pas au bon jour quel que soit le fuseau du serveur.
create table if not exists public.health_sync (
  user_id uuid primary key references auth.users (id) on delete cascade,
  token text not null unique default replace(gen_random_uuid()::text, '-', ''),
  timezone text not null default 'Europe/Paris',
  created_at timestamptz not null default now()
);

alter table public.health_sync enable row level security;

drop policy if exists "Chacun gère son lien Santé" on public.health_sync;
create policy "Chacun gère son lien Santé"
  on public.health_sync
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- 2) Pas du jour (un total par utilisateur et par jour, remplacé à chaque envoi).
create table if not exists public.daily_steps (
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  steps integer not null check (steps >= 0 and steps <= 200000),
  updated_at timestamptz not null default now(),
  primary key (user_id, date)
);

alter table public.daily_steps enable row level security;

drop policy if exists "Chacun lit ses pas" on public.daily_steps;
create policy "Chacun lit ses pas"
  on public.daily_steps
  for select
  to authenticated
  using (user_id = auth.uid());

-- 3) Enregistrement par le raccourci : seul le jeton identifie l'utilisateur.
--    security definer : la fonction écrit pour lui sans être connectée à son compte.
create or replace function public.log_steps(p_token text, p_steps integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid;
  v_timezone text;
  v_date date;
begin
  if p_steps is null or p_steps < 0 or p_steps > 200000 then
    raise exception 'Nombre de pas invalide';
  end if;

  select user_id, timezone into v_user, v_timezone
  from public.health_sync
  where token = p_token;

  if v_user is null then
    raise exception 'Lien inconnu';
  end if;

  begin
    v_date := (now() at time zone v_timezone)::date;
  exception when others then
    v_date := (now() at time zone 'Europe/Paris')::date;
  end;

  insert into public.daily_steps (user_id, date, steps, updated_at)
  values (v_user, v_date, p_steps, now())
  on conflict (user_id, date)
  do update set steps = excluded.steps, updated_at = now();

  return p_steps;
end;
$$;

revoke all on function public.log_steps(text, integer) from public;
grant execute on function public.log_steps(text, integer) to anon, authenticated;

-- Recharge le cache de l'API pour que les nouvelles tables soient visibles tout de suite
notify pgrst, 'reload schema';
