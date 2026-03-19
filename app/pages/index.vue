<template>
  <div class="min-h-screen bg-black text-white font-sans pb-20">
    <nav class="p-6 flex justify-between items-center bg-black/50 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5">
      <div class="flex items-center gap-3">
        <div class="bg-white p-1 rounded-xl">
          <img src="/images/logo.jpg" alt="Logo" class="h-8 w-8 rounded-lg" />
        </div>
        <h1 class="text-xl font-[1000] tracking-tighter uppercase italic">
          Fit<span class="text-green-500">Track</span>
        </h1>
      </div>

      <div class="flex items-center gap-4">
        <button
          @click="router.push('/profile')"
          class="w-10 h-10 rounded-full bg-gradient-to-tr from-green-400 to-green-600 p-[2px]"
        >
          <div class="w-full h-full bg-black rounded-full flex items-center justify-center">
            <span class="text-white font-black text-sm">
              {{ userName.charAt(0).toUpperCase() }}
            </span>
          </div>
        </button>

        <button
          @click="handleLogout"
          class="bg-slate-900 border border-white/10 px-4 py-2 rounded-2xl text-red-400 font-bold text-xs uppercase tracking-widest"
        >
          Quitter
        </button>
      </div>
    </nav>

    <main class="p-4 max-w-5xl mx-auto space-y-12 mt-6">
      <section class="relative p-10 rounded-[45px] bg-gradient-to-br from-slate-900 via-black to-black border border-white/10 overflow-hidden shadow-2xl">
        <h1 class="text-5xl font-[1000] tracking-tighter leading-none mb-4 text-white">
          Salut, <span class="text-green-500">{{ userName }}</span> !
        </h1>
        <p class="text-slate-400 font-medium italic">Ta rigueur est ta seule limite.</p>
      </section>

      <Dashboard />

      <section class="space-y-6">
        <div class="flex items-center gap-3 px-2">
          <div class="w-2 h-8 bg-green-500 rounded-full"></div>
          <h2 class="text-2xl font-black uppercase tracking-tighter">Ton Planning</h2>
        </div>

        <div class="calendar-container bg-slate-900/40 backdrop-blur-md p-2 rounded-[40px] border border-white/5 shadow-inner">
          <Calendrier
            :db-sessions="sessions"
            @select-date="onDateSelected"
            @delete-session="handleDeleteSession"
          />
        </div>
      </section>

      <div class="flex flex-col gap-12">
        <section class="space-y-6">
          <div class="flex items-center gap-3 px-2">
            <div class="w-2 h-8 bg-orange-500 rounded-full"></div>
            <h2 class="text-2xl font-black uppercase tracking-tighter">Nutrition</h2>
          </div>
          <AlimentationSection />
        </section>

        
      </div>
    </main>

    <ModalSeance
      v-if="isModalOpen"
      :date="selectedDate"
      :initial-data="sessionToEdit"
      @close="closeModal"
      @save="saveSession"
    />
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

import Calendrier from '~/components/custom/calendrier.vue'
import ModalSeance from '~/components/custom/seance.vue'
import Dashboard from '~/components/custom/dashboard.vue'
import VideoSection from '~/components/custom/video.vue'
import AlimentationSection from '~/components/custom/alimentation.vue'

const router = useRouter()
const supabase = useSupabaseClient()

const isModalOpen = ref(false)
const selectedDate = ref(null)
const sessionToEdit = ref(null)
const sessions = ref([])
const userName = ref('Invité')

onMounted(async () => {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return router.push('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  userName.value = profile?.username || user.email?.split('@')[0] || 'Invité'

  await fetchSessions()
})

async function fetchSessions() {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) return

  const { data, error } = await supabase
    .from('sport_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: true })

  if (error) {
    console.error('Erreur fetchSessions:', error)
    return
  }

  sessions.value = data || []
}

async function saveSession(payload) {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user || !selectedDate.value) return

  const existing = sessions.value.find((s) => s.date === selectedDate.value)

  if (existing) {
    const { error } = await supabase
      .from('sport_sessions')
      .update({
        data: payload.data
      })
      .eq('id', existing.id)

    if (error) {
      console.error('Erreur update session:', error)
      return
    }
  } else {
    const { error } = await supabase
      .from('sport_sessions')
      .insert({
        user_id: user.id,
        date: selectedDate.value,
        data: payload.data
      })

    if (error) {
      console.error('Erreur insert session:', error)
      return
    }
  }

  await fetchSessions()
  closeModal()
}

async function handleDeleteSession(dateStr) {
  const session = sessions.value.find((s) => s.date === dateStr)
  if (!session) return

  const { error } = await supabase
    .from('sport_sessions')
    .delete()
    .eq('id', session.id)

  if (error) {
    console.error('Erreur delete session:', error)
    return
  }

  await fetchSessions()
}

function onDateSelected(date) {
  selectedDate.value = date

  const session = sessions.value.find((s) => s.date === date)
  sessionToEdit.value = session ? JSON.parse(JSON.stringify(session.data)) : null

  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  sessionToEdit.value = null
  selectedDate.value = null
}

async function handleLogout() {
  await supabase.auth.signOut()
  window.location.href = '/login'
}
</script>