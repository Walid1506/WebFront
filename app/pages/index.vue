<template>
  <div class="min-h-screen bg-black text-white font-sans">
    <!-- Header -->
    <nav class="px-4 py-3 md:px-6 md:py-4 flex justify-between items-center bg-black/50 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5">
      <div class="flex items-center gap-3">
        <div class="bg-white p-1 rounded-xl">
          <img src="/images/logo.jpg" alt="Logo" class="h-7 w-7 md:h-8 md:w-8 rounded-lg" />
        </div>
        <h1 class="text-lg md:text-xl font-[1000] tracking-tighter uppercase italic">
          Fit<span class="text-green-500">Track</span>
        </h1>
      </div>

      <div class="flex items-center gap-2">
        <button @click="activeTab = 'profil'" class="w-9 h-9 rounded-full bg-gradient-to-tr from-green-400 to-green-600 p-[2px] shrink-0">
          <div class="w-full h-full bg-black rounded-full overflow-hidden flex items-center justify-center">
            <img v-if="avatarUrl" :src="avatarUrl" class="w-full h-full object-cover" alt="Avatar" />
            <span v-else class="text-white font-black text-sm">{{ userName.charAt(0).toUpperCase() }}</span>
          </div>
        </button>
      </div>
    </nav>

    <!-- Tab bar desktop (md+) -->
    <div class="hidden md:flex sticky top-[60px] z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="flex items-center gap-2 px-5 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-200 border-b-2 -mb-px"
        :class="activeTab === tab.id ? 'text-green-400 border-green-400' : 'text-slate-500 border-transparent hover:text-slate-300'"
      >
        <UIcon :name="tab.icon" class="text-base" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Contenu principal -->
    <main class="max-w-5xl mx-auto pb-28 md:pb-12 md:px-4">
      <!-- Section Accueil -->
      <section :class="{ 'hidden': activeTab !== 'accueil' }" class="p-4 space-y-5 mt-4 md:mt-8">
        <div class="relative p-6 md:p-10 rounded-[30px] md:rounded-[45px] bg-gradient-to-br from-slate-900 via-black to-black border border-white/10 overflow-hidden shadow-2xl">
          <h1 class="text-3xl md:text-5xl font-[1000] tracking-tighter leading-none mb-2 md:mb-4 text-white">
            Salut, <span class="text-green-500">{{ userName }}</span> !
          </h1>
          <p class="text-slate-400 font-medium italic text-sm md:text-base">Ta rigueur est ta seule limite.</p>
        </div>
        <Dashboard />
      </section>

      <!-- Section Agenda -->
      <section :class="{ 'hidden': activeTab !== 'agenda' }" class="p-4 space-y-4 mt-4 md:mt-8">
        <div class="flex items-center gap-3 px-1">
          <div class="w-2 h-6 md:h-8 bg-green-500 rounded-full"></div>
          <h2 class="text-xl md:text-2xl font-black uppercase tracking-tighter">Ton Planning</h2>
        </div>
        <div class="bg-slate-900/40 backdrop-blur-md p-2 rounded-[30px] md:rounded-[40px] border border-white/5 shadow-inner">
          <Calendrier :db-sessions="sessions" @select-date="onDateSelected" @delete-session="handleDeleteSession" />
        </div>
        <Records />
      </section>

      <!-- Section Nutrition -->
      <section :class="{ 'hidden': activeTab !== 'nutrition' }" class="p-4 space-y-4 mt-4 md:mt-8">
        <div class="flex items-center gap-3 px-1">
          <div class="w-2 h-6 md:h-8 bg-orange-500 rounded-full"></div>
          <h2 class="text-xl md:text-2xl font-black uppercase tracking-tighter">Nutrition</h2>
        </div>
        <AlimentationSection />
      </section>

      <!-- Section Profil -->
      <section :class="{ 'hidden': activeTab !== 'profil' }" class="p-4 space-y-5 mt-4 md:mt-8">
        <div class="relative p-6 md:p-10 rounded-[30px] md:rounded-[45px] bg-gradient-to-br from-slate-900 via-black to-black border border-white/10 shadow-2xl">

          <!-- Avatar + infos -->
          <div class="flex items-center gap-5 mb-8">
            <!-- Zone avatar cliquable -->
            <div class="relative shrink-0 group cursor-pointer" @click="triggerAvatarUpload">
              <div class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-green-400 to-green-600 p-[2px]">
                <div class="w-full h-full bg-black rounded-full overflow-hidden flex items-center justify-center">
                  <img v-if="avatarUrl" :src="avatarUrl" class="w-full h-full object-cover" alt="Avatar" />
                  <span v-else class="text-white font-black text-2xl md:text-3xl">{{ userName.charAt(0).toUpperCase() }}</span>
                </div>
              </div>
              <!-- Overlay upload -->
              <div class="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <UIcon v-if="!uploadingAvatar" name="i-heroicons-camera" class="text-white text-xl" />
                <div v-else class="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
              </div>
            </div>

            <div>
              <h2 class="text-2xl md:text-3xl font-black">{{ userName }}</h2>
              <p class="text-slate-400 text-sm font-medium">Membre FitTrack</p>
              <button
                @click="triggerAvatarUpload"
                class="mt-2 text-xs font-bold text-green-400 hover:text-green-300 transition flex items-center gap-1"
              >
                <UIcon name="i-heroicons-arrow-up-tray" class="text-sm" />
                {{ avatarUrl ? 'Changer la photo' : 'Ajouter une photo' }}
              </button>
            </div>
          </div>

          <!-- Input fichier caché -->
          <input
            ref="avatarInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleAvatarUpload"
          />

          <button
            @click="handleLogout"
            class="w-full md:max-w-xs bg-black border border-red-500/40 px-4 py-3 rounded-2xl text-red-400 font-bold text-sm uppercase tracking-widest active:scale-95 transition-all duration-150"
          >
            Se déconnecter
          </button>
        </div>
      </section>
    </main>

    <!-- Bottom Navigation (mobile uniquement) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10">
      <div class="flex justify-around px-2 pt-2 pb-5">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200 min-w-[60px]"
          :class="activeTab === tab.id ? 'text-green-400' : 'text-slate-500'"
        >
          <UIcon :name="tab.icon" class="text-2xl transition-transform duration-200" :class="activeTab === tab.id ? 'scale-110' : 'scale-100'" />
          <span class="text-[10px] font-bold uppercase tracking-wider leading-none">{{ tab.label }}</span>
          <div class="h-0.5 rounded-full mt-0.5 transition-all duration-300" :class="activeTab === tab.id ? 'bg-green-400 w-5' : 'bg-transparent w-3'" />
        </button>
      </div>
    </nav>

    <TimerRepos />

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
import AlimentationSection from '~/components/custom/alimentation.vue'
import Records from '~/components/custom/records.vue'
import TimerRepos from '~/components/custom/timer.vue'

const router = useRouter()
const supabase = useSupabaseClient()

const activeTab = ref('accueil')
const tabs = [
  { id: 'accueil', label: 'Accueil', icon: 'i-heroicons-home' },
  { id: 'agenda', label: 'Agenda', icon: 'i-heroicons-calendar' },
  { id: 'nutrition', label: 'Nutrition', icon: 'i-heroicons-fire' },
]

const isModalOpen = ref(false)
const selectedDate = ref(null)
const sessionToEdit = ref(null)
const sessions = ref([])
const userName = ref('Invité')
const avatarUrl = ref('')
const avatarInput = ref(null)
const uploadingAvatar = ref(false)

let currentUserId = null

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return router.push('/login')
  currentUserId = user.id

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', user.id)
    .single()

  userName.value = profile?.username || user.email?.split('@')[0] || 'Invité'
  avatarUrl.value = profile?.avatar_url || ''
  await fetchSessions()
})

function triggerAvatarUpload() {
  avatarInput.value?.click()
}

async function handleAvatarUpload(event) {
  const file = event.target.files?.[0]
  if (!file || !currentUserId) return

  const ext = file.name.split('.').pop()
  const path = `${currentUserId}/avatar.${ext}`
  uploadingAvatar.value = true

  // Upload dans le bucket "avatars"
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    uploadingAvatar.value = false
    return
  }

  // Récupère l'URL publique
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(path)

  // Ajoute un cache-buster pour forcer le rechargement
  const url = `${publicUrl}?t=${Date.now()}`

  // Sauvegarde dans la table profiles
  await supabase
    .from('profiles')
    .upsert({ id: currentUserId, avatar_url: url })

  avatarUrl.value = url
  uploadingAvatar.value = false

  // Reset l'input pour permettre re-upload du même fichier
  event.target.value = ''
}

async function fetchSessions() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data, error } = await supabase
    .from('sport_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: true })

  if (error) { console.error('Erreur fetchSessions:', error); return }
  sessions.value = data || []
}

async function saveSession(payload) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !selectedDate.value) return

  const existing = sessions.value.find(s => s.date === selectedDate.value)
  if (existing) {
    const { error } = await supabase.from('sport_sessions').update({ data: payload.data }).eq('id', existing.id)
    if (error) { console.error('Erreur update session:', error); return }
  } else {
    const { error } = await supabase.from('sport_sessions').insert({ user_id: user.id, date: selectedDate.value, data: payload.data })
    if (error) { console.error('Erreur insert session:', error); return }
  }

  await fetchSessions()
  closeModal()
}

async function handleDeleteSession(dateStr) {
  const session = sessions.value.find(s => s.date === dateStr)
  if (!session) return
  const { error } = await supabase.from('sport_sessions').delete().eq('id', session.id)
  if (error) { console.error('Erreur delete session:', error); return }
  await fetchSessions()
}

function onDateSelected(date) {
  selectedDate.value = date
  const session = sessions.value.find(s => s.date === date)
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
