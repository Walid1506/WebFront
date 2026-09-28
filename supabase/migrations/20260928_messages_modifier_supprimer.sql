-- À exécuter une fois dans Supabase : Dashboard > SQL Editor > New query > coller > Run.
-- Le script peut être relancé sans risque.
--
-- Chat : chacun peut modifier et supprimer ses propres messages.

-- 1) Date de modification (affiche « modifié » sous le message)
alter table public.messages add column if not exists edited_at timestamptz;

-- 2) L'expéditeur peut modifier ses messages
drop policy if exists "Expéditeur : modifier ses messages" on public.messages;
create policy "Expéditeur : modifier ses messages"
  on public.messages
  for update
  to authenticated
  using (sender_id = auth.uid())
  with check (sender_id = auth.uid());

-- 3) L'expéditeur peut supprimer ses messages
drop policy if exists "Expéditeur : supprimer ses messages" on public.messages;
create policy "Expéditeur : supprimer ses messages"
  on public.messages
  for delete
  to authenticated
  using (sender_id = auth.uid());

-- 4) La photo ou le vocal d'un message supprimé est retiré du stockage :
--    chacun ne peut supprimer que les fichiers de son propre dossier
drop policy if exists "Chacun supprime ses fichiers du chat" on storage.objects;
create policy "Chacun supprime ses fichiers du chat"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id in ('chat-photos', 'chat-audio')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Recharge le cache de l'API pour que la nouvelle colonne soit visible tout de suite
notify pgrst, 'reload schema';
