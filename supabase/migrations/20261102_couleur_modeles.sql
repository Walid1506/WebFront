-- À exécuter une fois dans Supabase : Dashboard > SQL Editor > New query > coller > Run.
-- Le script peut être relancé sans risque.
--
-- Couleur des modèles de séance : jusqu'ici gardée seulement dans le navigateur, elle disparaissait
-- quand l'app était réinstallée et n'était pas partagée entre les appareils.

-- 1) La couleur est maintenant enregistrée avec le modèle
alter table public.workout_templates add column if not exists color text;

-- 2) Couleurs perdues : retrouvées dans les séances du calendrier, qui en gardent une copie
update public.workout_templates t
set color = s.color
from (
  select distinct on (data::jsonb ->> 'templateId')
    data::jsonb ->> 'templateId' as template_id,
    data::jsonb ->> 'color' as color
  from public.sport_sessions
  where coalesce(data::jsonb ->> 'templateId', '') <> ''
    and coalesce(data::jsonb ->> 'color', '') <> ''
  order by data::jsonb ->> 'templateId', date desc
) s
where t.id::text = s.template_id
  and coalesce(t.color, '') = '';

-- 3) Sinon dans l'objectif de la semaine, gardé dans le compte
update public.workout_templates t
set color = plan.value ->> 'color'
from auth.users u
cross join lateral jsonb_each(
  case when jsonb_typeof(u.raw_user_meta_data -> 'weekly_plan') = 'object'
    then u.raw_user_meta_data -> 'weekly_plan'
    else '{}'::jsonb
  end
) as plan
where u.id = t.user_id
  and plan.value ->> 'id' = t.id::text
  and coalesce(plan.value ->> 'color', '') <> ''
  and coalesce(t.color, '') = '';

-- Recharge le cache de l'API pour que la nouvelle colonne soit visible tout de suite
notify pgrst, 'reload schema';
