import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'https://esm.sh/web-push@3.6.7'

const VAPID_PUBLIC = 'BCDSxtsrIF2goDbtYoj9jxIVnB_Ukf3BirOpe3ZCxOVj0Kvn6RtNHxV0tZo045Lxe-qKAIDfZA0ph8Nh7ih0gjQ'
const VAPID_PRIVATE = Deno.env.get('VAPID_PRIVATE_KEY') || ''
const VAPID_EMAIL = 'mailto:aliwalid97600@gmail.com'

webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, content-type' } })
  }

  try {
    const { receiver_id, sender_username, content, media_url } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: sub } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', receiver_id)
      .single()

    if (!sub?.subscription) return new Response(JSON.stringify({ sent: false }), { status: 200 })

    await webpush.sendNotification(sub.subscription, JSON.stringify({
      title: sender_username,
      body: media_url ? '📷 Photo' : (content || ''),
      url: '/?tab=amis'
    }))

    return new Response(JSON.stringify({ sent: true }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 })
  }
})
