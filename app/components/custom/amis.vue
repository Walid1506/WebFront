<template>
  <div class="space-y-5">

    <!-- Recherche -->
    <div class="bg-white/[0.04] backdrop-blur-2xl rounded-[28px] border border-white/[0.08] p-5">
      <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Ajouter un ami par pseudo</label>
      <div class="flex gap-2">
        <div class="relative flex-1">
          <UIcon name="i-heroicons-at-symbol" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input v-model="searchQuery" @keyup.enter="searchUser" type="text" placeholder="pseudo exact..."
            class="w-full h-12 bg-white/[0.06] border border-white/[0.10] rounded-2xl pl-10 pr-4 text-white font-bold outline-none placeholder:text-slate-700" style="outline: none" @focus="e => e.target.style.borderColor='var(--accent-solid)'" @blur="e => e.target.style.borderColor=''" />
        </div>
        <button @click="searchUser" :disabled="searching || !searchQuery.trim()"
          class="h-12 px-5 bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-black rounded-2xl text-sm active:scale-95 transition-all disabled:opacity-40 shrink-0">
          {{ searching ? '...' : 'Chercher' }}
        </button>
      </div>

      <!-- Résultat de recherche -->
      <div v-if="searchResult" class="mt-3 flex items-center gap-3 bg-white/[0.04] rounded-2xl p-3 border border-white/[0.08]">
        <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--accent-from)] to-[var(--accent-to)] p-[2px] shrink-0">
          <div class="w-full h-full bg-[#060d1a] rounded-full overflow-hidden flex items-center justify-center">
            <img v-if="searchResult.avatar_url" :src="searchResult.avatar_url" class="w-full h-full object-cover" />
            <span v-else class="text-white font-black text-sm">{{ searchResult.username?.charAt(0).toUpperCase() }}</span>
          </div>
        </div>
        <div class="flex-1">
          <p class="text-white font-black text-sm">{{ searchResult.username }}</p>
          <p class="text-slate-500 text-xs">{{ searchResultStatus }}</p>
        </div>
        <button v-if="searchResultStatus === 'Ajouter'" @click="sendRequest"
          class="bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-black text-xs px-4 py-2 rounded-xl active:scale-95 transition-all">
          + Ajouter
        </button>
      </div>
      <p v-else-if="searchDone && !searchResult" class="mt-3 text-slate-600 text-xs font-black text-center">Aucun utilisateur trouvé avec ce pseudo</p>
    </div>

    <!-- Demandes reçues -->
    <div v-if="pendingReceived.length > 0" class="bg-white/[0.04] backdrop-blur-2xl rounded-[28px] border border-violet-500/20 p-5">
      <div class="flex items-center gap-2 mb-3">
        <div class="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
        <p class="text-[10px] font-black text-violet-400 uppercase tracking-widest">Demandes reçues</p>
        <span class="bg-violet-500/20 text-violet-300 text-xs font-black px-2 py-0.5 rounded-full">{{ pendingReceived.length }}</span>
      </div>
      <div class="space-y-2">
        <div v-for="r in pendingReceived" :key="r.id" class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-400 to-purple-500 p-[2px] shrink-0">
            <div class="w-full h-full bg-[#060d1a] rounded-full overflow-hidden flex items-center justify-center">
              <img v-if="r.profile?.avatar_url" :src="r.profile.avatar_url" class="w-full h-full object-cover" />
              <span v-else class="text-white font-black text-sm">{{ r.profile?.username?.charAt(0).toUpperCase() }}</span>
            </div>
          </div>
          <p class="text-white font-black text-sm flex-1">{{ r.profile?.username }}</p>
          <div class="flex gap-2">
            <button @click="acceptRequest(r.id)" class="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-black text-xs px-3 py-1.5 rounded-xl active:scale-95 transition-all">
              Accepter
            </button>
            <button @click="declineRequest(r.id)" class="bg-red-500/10 border border-red-500/20 text-red-400 font-black text-xs px-3 py-1.5 rounded-xl active:scale-95 transition-all">
              Refuser
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste amis -->
    <div>
      <div class="flex items-center gap-3 mb-3 px-1">
        <div class="w-2 h-6 bg-gradient-to-b from-[var(--accent-from)] to-[var(--accent-to)] rounded-full"></div>
        <h2 class="text-xl font-black uppercase tracking-tighter">Mes amis</h2>
        <span class="text-slate-600 font-black text-sm">{{ friends.length }}</span>
      </div>

      <div v-if="friends.length === 0" class="bg-white/[0.04] backdrop-blur-2xl rounded-[28px] border border-white/[0.08] p-8 text-center">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" :style="{ backgroundColor: `color-mix(in srgb, var(--accent-solid) 12%, transparent)`, border: `1px solid color-mix(in srgb, var(--accent-solid) 20%, transparent)` }">
          <UIcon name="i-heroicons-user-group" class="text-2xl" :style="{ color: 'var(--accent-solid)' }" />
        </div>
        <p class="text-white font-black">Aucun ami pour l'instant</p>
        <p class="text-slate-500 text-sm mt-1">Cherche un ami par son pseudo ci-dessus</p>
      </div>

      <div v-else class="space-y-3">
        <div v-for="f in friends" :key="f.friendId"
          class="bg-white/[0.04] backdrop-blur-2xl rounded-[24px] border border-white/[0.08] p-4 flex items-center gap-3">
          <div class="relative shrink-0 cursor-pointer active:scale-90 transition-all" @click="openFriendProfile(f)">
            <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-[var(--accent-from)] to-[var(--accent-to)] p-[2px]">
              <div class="w-full h-full bg-[#060d1a] rounded-full overflow-hidden flex items-center justify-center">
                <img v-if="f.profile?.avatar_url" :src="f.profile.avatar_url" class="w-full h-full object-cover" />
                <span v-else class="text-white font-black">{{ f.profile?.username?.charAt(0).toUpperCase() }}</span>
              </div>
            </div>
            <!-- Point de présence -->
            <div class="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#060d1a]"
              :class="isOnline(f.friendId) ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-slate-600'">
            </div>
          </div>
          <div class="flex-1 min-w-0 cursor-pointer" @click="openFriendProfile(f)">
            <p class="text-white font-black truncate">{{ f.profile?.username }}</p>
            <p class="text-xs mt-0.5" :class="isOnline(f.friendId) ? 'text-emerald-400 font-black' : 'text-slate-500'">
              {{ isOnline(f.friendId) ? 'En ligne' : `${f.xp} XP · Niv. ${f.level?.level}` }}
            </p>
          </div>
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-black text-sm text-white"
            :class="`bg-gradient-to-br ${f.level?.color}`">
            {{ f.level?.level }}
          </div>
          <button @click="chatFriend = f"
            class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 active:scale-90 transition-all"
            :style="{ backgroundColor: `color-mix(in srgb, var(--accent-solid) 15%, transparent)`, border: `1px solid color-mix(in srgb, var(--accent-solid) 20%, transparent)` }">
            <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="text-lg" :style="{ color: 'var(--accent-solid)' }" />
          </button>
        </div>
      </div>
    </div>

    <!-- Chat -->
    <Transition name="slide-up">
      <Chat v-if="chatFriend" :friend="chatFriend.profile" :friend-id="chatFriend.friendId" @close="chatFriend = null" />
    </Transition>

    <!-- Overlay profil ami -->
    <Transition name="slide-up">
      <div v-if="friendProfile" class="fixed inset-0 z-[300] bg-[#060d1a]/98 backdrop-blur-2xl flex flex-col">
        <div class="flex items-center gap-4 px-5 py-5 border-b border-white/[0.08]">
          <button @click="friendProfile = null" class="p-2 rounded-xl bg-white/[0.06] text-slate-400 hover:text-white transition">
            <UIcon name="i-heroicons-arrow-left" class="text-xl" />
          </button>
          <p class="text-xl font-black">{{ friendProfile.profile?.username }}</p>
        </div>

        <div class="flex-1 overflow-y-auto p-5 space-y-4">
          <!-- Avatar + stats globales -->
          <div class="relative bg-white/[0.04] rounded-[28px] border border-white/[0.08] p-6 text-center overflow-hidden">
            <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[60px]" :style="{ backgroundColor: theme.blobs[0] }"></div>
            <div class="w-20 h-20 rounded-full bg-gradient-to-tr from-[var(--accent-from)] to-[var(--accent-to)] p-[2px] mx-auto mb-3">
              <div class="w-full h-full rounded-full overflow-hidden flex items-center justify-center" :style="{ backgroundColor: theme.bg }">
                <img v-if="friendProfile.profile?.avatar_url" :src="friendProfile.profile.avatar_url" class="w-full h-full object-cover" />
                <span v-else class="text-white font-black text-2xl">{{ friendProfile.profile?.username?.charAt(0).toUpperCase() }}</span>
              </div>
            </div>
            <p class="text-white font-black text-xl">{{ friendProfile.profile?.username }}</p>
            <div class="flex justify-center gap-6 mt-4">
              <div>
                <p class="font-black text-2xl" :style="{ color: 'var(--accent-solid)' }">{{ friendProfile.sessionCount }}</p>
                <p class="text-slate-500 text-xs font-black uppercase">séances/mois</p>
              </div>
              <div class="w-px bg-white/[0.08]"></div>
              <div>
                <p class="font-black text-2xl" :style="{ color: 'var(--accent-to, #34d399)' }">{{ friendProfile.totalSessions }}</p>
                <p class="text-slate-500 text-xs font-black uppercase">total</p>
              </div>
            </div>
          </div>

          <!-- Dernières séances -->
          <div class="bg-white/[0.04] rounded-[28px] border border-white/[0.08] p-5">
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Dernières séances</p>
            <div v-if="friendProfile.recentSessions?.length > 0" class="space-y-2">
              <div v-for="s in friendProfile.recentSessions" :key="s.id"
                class="flex items-center gap-3 bg-white/[0.04] rounded-2xl p-3 border border-white/[0.06]">
                <div class="w-2 h-2 rounded-full shrink-0" :style="{ backgroundColor: 'var(--accent-solid)' }"></div>
                <div class="flex-1">
                  <p class="text-white font-black text-sm">{{ s.data?.title || 'Séance' }}</p>
                  <p class="text-slate-500 text-xs">{{ formatDate(s.date) }}</p>
                </div>
                <span v-if="s.data?.category" class="text-[10px] font-black px-2 py-0.5 rounded-full border" :class="catClass(s.data.category)">
                  {{ s.data.category }}
                </span>
              </div>
            </div>
            <p v-else class="text-slate-600 text-sm font-black text-center py-4">Aucune séance récente</p>
          </div>

          <!-- Envoyer un message -->
          <button @click="chatFriend = friendProfile; friendProfile = null"
            class="w-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-black py-3.5 rounded-2xl text-sm active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[color:var(--accent-solid)]/15">
            <UIcon name="i-heroicons-chat-bubble-left-ellipsis" />
            Envoyer un message
          </button>

          <!-- Supprimer ami -->
          <button @click="removeFriend(friendProfile)" class="w-full border border-red-500/20 text-red-400 font-black py-3 rounded-2xl text-sm active:scale-95 transition-all hover:bg-red-500/5">
            Retirer de mes amis
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
const emit = defineEmits(['pending-change', 'unread-change'])
const { theme } = useTheme()

import Chat from '~/components/custom/chat.vue'

const supabase = useSupabaseClient()
const { isOnline } = usePresence()

const searchQuery = ref('')
const searching = ref(false)
const searchResult = ref(null)
const searchDone = ref(false)
const friends = ref([])
const pendingReceived = ref([])
const friendProfile = ref(null)
const chatFriend = ref(null)

let currentUserId = null

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  currentUserId = user.id
  await Promise.all([fetchFriends(), fetchPending()])
})

async function searchUser() {
  if (!searchQuery.value.trim()) return
  searching.value = true
  searchResult.value = null
  searchDone.value = false

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .ilike('username', searchQuery.value.trim())
    .limit(1)
    .maybeSingle()

  searchDone.value = true
  searching.value = false

  if (!data || data.id === currentUserId) { searchResult.value = null; return }
  searchResult.value = data
}

const searchResultStatus = computed(() => {
  if (!searchResult.value) return ''
  const id = searchResult.value.id
  if (friends.value.some(f => f.profile?.id === id)) return 'Déjà ami'
  if (pendingReceived.value.some(r => r.requester_id === id)) return 'Demande reçue'
  return 'Ajouter'
})

async function sendRequest() {
  if (!searchResult.value || !currentUserId) return

  // Si l'autre a déjà envoyé une demande → l'accepter directement
  const { data: incoming } = await supabase.from('friendships')
    .select('id').eq('requester_id', searchResult.value.id).eq('addressee_id', currentUserId).maybeSingle()

  if (incoming) {
    await supabase.from('friendships').update({ status: 'accepted' }).eq('id', incoming.id)
  } else {
    // Vérifier qu'une demande n'existe pas déjà dans l'autre sens
    const { data: existing } = await supabase.from('friendships')
      .select('id').eq('requester_id', currentUserId).eq('addressee_id', searchResult.value.id).maybeSingle()
    if (!existing) {
      await supabase.from('friendships').insert({ requester_id: currentUserId, addressee_id: searchResult.value.id })
    }
  }

  searchResult.value = null
  searchQuery.value = ''
  searchDone.value = false
  await Promise.all([fetchFriends(), fetchPending()])
}

async function fetchPending() {
  const { data: requests } = await supabase.from('friendships').select('*')
    .eq('addressee_id', currentUserId).eq('status', 'pending')
  if (!requests?.length) { pendingReceived.value = []; return }

  const ids = requests.map(r => r.requester_id)
  const { data: profiles } = await supabase.from('profiles').select('id, username, avatar_url').in('id', ids)

  pendingReceived.value = requests.map(r => ({
    ...r,
    profile: profiles?.find(p => p.id === r.requester_id) || null
  }))
}

async function acceptRequest(id) {
  await supabase.from('friendships').update({ status: 'accepted' }).eq('id', id)
  await Promise.all([fetchFriends(), fetchPending()])
  emit('pending-change', pendingReceived.value.length)
}

async function declineRequest(id) {
  await supabase.from('friendships').delete().eq('id', id)
  await fetchPending()
  emit('pending-change', pendingReceived.value.length)
}

const { xpToLevel } = useXP()

async function fetchFriends() {
  const now = new Date()
  const firstOfMonth = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), '01'].join('-')

  const [{ data: sent }, { data: received }] = await Promise.all([
    supabase.from('friendships').select('id, addressee_id').eq('requester_id', currentUserId).eq('status', 'accepted'),
    supabase.from('friendships').select('id, requester_id').eq('addressee_id', currentUserId).eq('status', 'accepted'),
  ])

  // Déduplication : si les deux se sont ajoutés mutuellement, un ami peut apparaître 2x
  const allFriendIds = [...new Set([
    ...(sent || []).map(f => f.addressee_id),
    ...(received || []).map(f => f.requester_id),
  ])]

  if (!allFriendIds.length) { friends.value = []; return }

  const { data: profiles } = await supabase.from('profiles').select('id, username, avatar_url').in('id', allFriendIds)

  const enriched = await Promise.all(allFriendIds.map(async friendId => {
    const [{ data: sessions }, { data: allSess }, { data: templates }] = await Promise.all([
      supabase.from('sport_sessions').select('id').eq('user_id', friendId).gte('date', firstOfMonth),
      supabase.from('sport_sessions').select('date').eq('user_id', friendId),
      supabase.from('workout_templates').select('id').eq('user_id', friendId),
    ])
    const xp = (allSess?.length || 0) * 100 + (templates?.length || 0) * 30
    return {
      friendId,
      profile: profiles?.find(p => p.id === friendId) || null,
      sessionCount: sessions?.length || 0,
      xp,
      level: xpToLevel(xp)
    }
  }))

  friends.value = enriched
}

async function openFriendProfile(f) {
  const { data: recentSessions } = await supabase.from('sport_sessions').select('*').eq('user_id', f.friendId)
    .order('date', { ascending: false }).limit(5)

  const { data: allSessions } = await supabase.from('sport_sessions').select('id').eq('user_id', f.friendId)

  friendProfile.value = { ...f, recentSessions: recentSessions || [], totalSessions: allSessions?.length || 0 }
}

async function removeFriend(f) {
  await Promise.all([
    supabase.from('friendships').delete().eq('requester_id', currentUserId).eq('addressee_id', f.friendId),
    supabase.from('friendships').delete().eq('requester_id', f.friendId).eq('addressee_id', currentUserId),
  ])
  friendProfile.value = null
  await fetchFriends()
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
}

function catClass(cat) {
  const map = {
    push: 'bg-orange-500/10 border-orange-500/20 text-orange-300',
    pull: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
    jambes: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
    'full-body': 'bg-purple-500/10 border-purple-500/20 text-purple-300',
    cardio: 'bg-red-500/10 border-red-500/20 text-red-300',
    haut: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
    bas: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300',
  }
  return map[cat] || 'bg-white/[0.06] border-white/[0.08] text-slate-400'
}
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(30px); }
</style>
