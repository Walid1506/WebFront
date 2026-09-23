-- À exécuter une fois dans Supabase : Dashboard > SQL Editor > New query > coller > Run.
-- Le script peut être relancé sans risque.

-- 1) Les amis (amitié acceptée) peuvent voir le journal alimentaire du jour.
--    Limité à aujourd'hui et hier (décalage entre l'heure française et l'UTC de la base) :
--    l'historique complet reste privé.
drop policy if exists "Amis : lecture du journal alimentaire du jour" on public.nutrition_daily;
create policy "Amis : lecture du journal alimentaire du jour"
  on public.nutrition_daily
  for select
  to authenticated
  using (
    nutrition_daily.date::date >= current_date - 1
    and exists (
      select 1
      from public.friendships f
      where f.status = 'accepted'
        and (
          (f.requester_id = auth.uid() and f.addressee_id = nutrition_daily.user_id)
          or (f.addressee_id = auth.uid() and f.requester_id = nutrition_daily.user_id)
        )
    )
  );

-- 2) Table des abonnements aux notifications push.
--    Elle n'existait pas : l'app et la fonction send-push l'utilisent, donc aucune notification ne pouvait partir.
create table if not exists public.push_subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  subscription jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

drop policy if exists "Chacun gère son abonnement push" on public.push_subscriptions;
create policy "Chacun gère son abonnement push"
  on public.push_subscriptions
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Recharge le cache de l'API pour que la nouvelle table soit visible tout de suite
notify pgrst, 'reload schema';
