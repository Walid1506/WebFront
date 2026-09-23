const VAPID_PUBLIC_KEY = 'BCDSxtsrIF2goDbtYoj9jxIVnB_Ukf3BirOpe3ZCxOVj0Kvn6RtNHxV0tZo045Lxe-qKAIDfZA0ph8Nh7ih0gjQ'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

export function usePush() {
  const supabase = useSupabaseClient()

  function isSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
  }

  async function subscribe(userId: string) {
    try {
      const reg = await navigator.serviceWorker.ready
      const existing = await reg.pushManager.getSubscription()
      const subscription = existing || await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      })
      const { error } = await supabase.from('push_subscriptions').upsert(
        { user_id: userId, subscription: JSON.parse(JSON.stringify(subscription)), updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )
      if (error) console.error('Push subscription save failed:', error)
    } catch (e) {
      console.error('Push subscription failed:', e)
    }
  }

  // À la déconnexion : sinon le prochain compte connecté sur ce téléphone recevrait les notifications de l'ancien
  async function unsubscribe(userId: string) {
    try {
      await supabase.from('push_subscriptions').delete().eq('user_id', userId)
      if (!isSupported()) return
      const reg = await navigator.serviceWorker.getRegistration()
      const sub = await reg?.pushManager.getSubscription()
      await sub?.unsubscribe()
    } catch (e) {
      console.error('Push unsubscribe failed:', e)
    }
  }

  // Doit être appelé directement depuis un tap : iOS ignore la demande sinon (aucun await avant)
  async function requestAndSubscribe(userId: string) {
    if (!isSupported()) return false
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return false
    await subscribe(userId)
    return true
  }

  return { isSupported, subscribe, requestAndSubscribe, unsubscribe }
}
