import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'https://esm.sh/web-push@3.6.7'

const VAPID_PUBLIC = 'BCDSxtsrIF2goDbtYoj9jxIVnB_Ukf3BirOpe3ZCxOVj0Kvn6RtNHxV0tZo045Lxe-qKAIDfZA0ph8Nh7ih0gjQ'
const VAPID_PRIVATE = Deno.env.get('VAPID_PRIVATE_KEY') || ''
const VAPID_EMAIL = 'mailto:aliwalid97600@gmail.com'
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type'
}

webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE)

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // L'expéditeur est identifié par son jeton de connexion, jamais par le contenu de la requête
    const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '')
    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) return json({ error: 'Non authentifié' }, 401)

    const { receiver_id, content, media_url } = await req.json()
    if (typeof receiver_id !== 'string' || !UUID.test(receiver_id) || receiver_id === user.id) {
      return json({ error: 'Destinataire invalide' }, 400)
    }

    // Seuls des amis peuvent s'envoyer des notifications
    const { data: friendship } = await supabase
      .from('friendships')
      .select('id')
      .eq('status', 'accepted')
      .or(`and(requester_id.eq.${user.id},addressee_id.eq.${receiver_id}),and(requester_id.eq.${receiver_id},addressee_id.eq.${user.id})`)
      .limit(1)
    if (!friendship?.length) return json({ error: 'Pas amis' }, 403)

    const [{ data: profile }, { data: sub }] = await Promise.all([
      supabase.from('profiles').select('username').eq('id', user.id).maybeSingle(),
      supabase.from('push_subscriptions').select('subscription').eq('user_id', receiver_id).maybeSingle()
    ])
    if (!sub?.subscription) return json({ sent: false })

    try {
      await webpush.sendNotification(sub.subscription, JSON.stringify({
        title: profile?.username || 'FitTrack',
        body: String(content || (media_url ? '📷 Photo' : '')).slice(0, 200),
        url: '/?tab=amis'
      }))
    } catch (e) {
      // Abonnement expiré ou révoqué côté navigateur : on le supprime
      if (e?.statusCode === 404 || e?.statusCode === 410) {
        await supabase.from('push_subscriptions').delete().eq('user_id', receiver_id)
        return json({ sent: false })
      }
      throw e
    }

    return json({ sent: true })
  } catch (e) {
    return json({ error: e?.message || String(e) }, 500)
  }
})
