const onlineUsers = ref(new Set<string>())
let presenceChannel: any = null
let lastSeenInterval: any = null

export function usePresence() {
  const supabase = useSupabaseClient()

  async function join(userId: string) {
    await supabase.from('profiles').update({ last_seen: new Date().toISOString() }).eq('id', userId)

    presenceChannel = supabase.channel('global-presence', {
      config: { presence: { key: userId } }
    })
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState()
        onlineUsers.value = new Set(Object.keys(state))
      })
      .on('presence', { event: 'join' }, ({ key }: any) => {
        onlineUsers.value = new Set([...onlineUsers.value, key])
      })
      .on('presence', { event: 'leave' }, ({ key }: any) => {
        const s = new Set(onlineUsers.value); s.delete(key); onlineUsers.value = s
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({ user_id: userId })
        }
      })

    lastSeenInterval = setInterval(async () => {
      await supabase.from('profiles').update({ last_seen: new Date().toISOString() }).eq('id', userId)
    }, 60000)
  }

  function leave() {
    presenceChannel?.unsubscribe()
    clearInterval(lastSeenInterval)
  }

  function isOnline(userId: string): boolean {
    return onlineUsers.value.has(userId)
  }

  return { onlineUsers, join, leave, isOnline }
}
