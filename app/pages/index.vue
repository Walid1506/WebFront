<template>
  <div class="min-h-screen bg-[#060d1a] text-white font-sans">

    <!-- Aurore boréale (fond fixe) -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div class="absolute -top-32 -left-32 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[130px]"></div>
      <div class="absolute top-10 right-0 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[110px]"></div>
      <div class="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-sky-500/10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-0 left-0 w-[400px] h-[300px] bg-teal-500/10 rounded-full blur-[100px]"></div>
    </div>

    <!-- Header -->
    <nav class="px-4 py-3 md:px-6 md:py-4 flex justify-between items-center bg-[#060d1a]/60 backdrop-blur-2xl sticky top-0 z-50 border-b border-white/[0.06]">
      <div class="flex items-center gap-3">
        <div class="bg-white/10 backdrop-blur p-1.5 rounded-xl border border-white/10">
          <img src="/images/logo.jpg" alt="Logo" class="h-7 w-7 md:h-8 md:w-8 rounded-lg" />
        </div>
        <h1 class="text-lg md:text-xl font-[1000] tracking-tighter uppercase italic">
          Fit<span class="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Track</span>
        </h1>
      </div>

      <div class="flex items-center gap-2">
        <!-- Cloche notifications -->
        <button @click="activeTab = 'amis'" class="relative w-9 h-9 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0 active:scale-95 transition-all">
          <UIcon name="i-heroicons-bell" class="text-slate-400 text-lg" />
          <span v-if="pendingCount > 0"
            class="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-violet-500 rounded-full flex items-center justify-center px-1 shadow-lg shadow-violet-500/40">
            <span class="text-white text-[10px] font-black">{{ pendingCount }}</span>
          </span>
        </button>

        <button @click="activeTab = 'profil'" class="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 p-[2px] shrink-0">
          <div class="w-full h-full bg-[#060d1a] rounded-full overflow-hidden flex items-center justify-center">
            <img v-if="avatarUrl" :src="avatarUrl" class="w-full h-full object-cover" alt="Avatar" />
            <span v-else class="text-white font-black text-sm">{{ userName.charAt(0).toUpperCase() }}</span>
          </div>
        </button>
      </div>
    </nav>

    <!-- Tab bar desktop -->
    <div class="hidden md:flex sticky top-[60px] z-40 bg-[#060d1a]/80 backdrop-blur-2xl border-b border-white/[0.06] px-6">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="flex items-center gap-2 px-5 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-200 border-b-2 -mb-px"
        :class="activeTab === tab.id
          ? 'text-cyan-400 border-cyan-400'
          : 'text-slate-500 border-transparent hover:text-slate-300'"
      >
        <UIcon :name="tab.icon" class="text-base" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Contenu principal -->
    <main class="max-w-5xl mx-auto pb-28 md:pb-12 md:px-4">

      <!-- Accueil -->
      <section :class="{ 'hidden': activeTab !== 'accueil' }" class="p-4 space-y-5 mt-4 md:mt-8">
        <div class="relative p-6 md:p-10 rounded-[30px] md:rounded-[45px] bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] overflow-hidden shadow-2xl">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-[60px] pointer-events-none"></div>
          <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/15 rounded-full blur-[60px] pointer-events-none"></div>
          <div class="relative flex items-start justify-between gap-4">
            <div>
              <h1 class="text-3xl md:text-5xl font-[1000] tracking-tighter leading-none mb-2 md:mb-4 text-white">
                Salut, <span class="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">{{ userName }}</span> !
              </h1>
              <p class="text-slate-400 font-medium italic text-sm md:text-base">Ta rigueur est ta seule limite.</p>
            </div>
            <!-- Mini badge niveau -->
            <button @click="activeTab = 'niveau'" class="shrink-0 flex flex-col items-center gap-1 active:scale-95 transition-all">
              <div class="w-14 h-14 rounded-[18px] flex items-center justify-center shadow-xl"
                :class="homeLevelColor ? `bg-gradient-to-br ${homeLevelColor}` : 'bg-white/10'">
                <span class="text-white font-[1000] text-xl">{{ homeLevelInfo?.level || '?' }}</span>
              </div>
              <span class="text-[9px] font-black text-slate-500 uppercase tracking-wider">{{ homeLevelInfo?.name || 'XP' }}</span>
            </button>
          </div>
        </div>
        <ProgrammeWidget :today-session="todaySession" @open-today="openToday" />
        <Dashboard />
      </section>

      <!-- Agenda -->
      <section :class="{ 'hidden': activeTab !== 'agenda' }" class="p-4 space-y-4 mt-4 md:mt-8">
        <div class="flex items-center gap-3 px-1">
          <div class="w-2 h-6 md:h-8 bg-gradient-to-b from-cyan-400 to-emerald-400 rounded-full"></div>
          <h2 class="text-xl md:text-2xl font-black uppercase tracking-tighter">Ton Planning</h2>
        </div>
        <div class="bg-white/[0.04] backdrop-blur-2xl p-2 rounded-[30px] md:rounded-[40px] border border-white/[0.08] shadow-inner">
          <Calendrier :db-sessions="sessions" @select-date="onDateSelected" @delete-session="handleDeleteSession" />
        </div>
        <Records />
      </section>

      <!-- Nutrition -->
      <section :class="{ 'hidden': activeTab !== 'nutrition' }" class="p-4 space-y-4 mt-4 md:mt-8">
        <div class="flex items-center gap-3 px-1">
          <div class="w-2 h-6 md:h-8 bg-gradient-to-b from-orange-400 to-pink-500 rounded-full"></div>
          <h2 class="text-xl md:text-2xl font-black uppercase tracking-tighter">Nutrition</h2>
        </div>
        <AlimentationSection />
      </section>

      <!-- Niveau / XP -->
      <section :class="{ 'hidden': activeTab !== 'niveau' }" class="p-4 space-y-4 mt-4 md:mt-8">
        <div class="flex items-center gap-3 px-1">
          <div class="w-2 h-6 md:h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full"></div>
          <h2 class="text-xl md:text-2xl font-black uppercase tracking-tighter">Progression</h2>
        </div>
        <Niveau />
      </section>

      <!-- Amis -->
      <section :class="{ 'hidden': activeTab !== 'amis' }" class="p-4 space-y-4 mt-4 md:mt-8">
        <div class="flex items-center gap-3 px-1">
          <div class="w-2 h-6 md:h-8 bg-gradient-to-b from-cyan-400 to-emerald-400 rounded-full"></div>
          <h2 class="text-xl md:text-2xl font-black uppercase tracking-tighter">Amis</h2>
        </div>
        <Amis @pending-change="pendingCount = $event" />
      </section>

      <!-- Profil -->
      <section :class="{ 'hidden': activeTab !== 'profil' }" class="p-4 space-y-5 mt-4 md:mt-8">
        <div class="relative p-6 md:p-10 rounded-[30px] md:rounded-[45px] bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] shadow-2xl overflow-hidden">
          <div class="absolute -top-16 -right-16 w-56 h-56 bg-cyan-500/15 rounded-full blur-[80px] pointer-events-none"></div>
          <div class="absolute -bottom-16 -left-16 w-56 h-56 bg-violet-500/10 rounded-full blur-[80px] pointer-events-none"></div>

          <div class="relative flex items-center gap-5 mb-8">
            <div class="relative shrink-0 group cursor-pointer" @click="triggerAvatarUpload">
              <div class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 p-[2px]">
                <div class="w-full h-full bg-[#060d1a] rounded-full overflow-hidden flex items-center justify-center">
                  <img v-if="avatarUrl" :src="avatarUrl" class="w-full h-full object-cover" alt="Avatar" />
                  <span v-else class="text-white font-black text-2xl md:text-3xl">{{ userName.charAt(0).toUpperCase() }}</span>
                </div>
              </div>
              <div class="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <UIcon v-if="!uploadingAvatar" name="i-heroicons-camera" class="text-white text-xl" />
                <div v-else class="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
              </div>
            </div>

            <div>
              <h2 class="text-2xl md:text-3xl font-black">{{ userName }}</h2>
              <p class="text-slate-400 text-sm font-medium">Membre FitTrack</p>
              <button @click="triggerAvatarUpload" class="mt-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1">
                <UIcon name="i-heroicons-arrow-up-tray" class="text-sm" />
                {{ avatarUrl ? 'Changer la photo' : 'Ajouter une photo' }}
              </button>
            </div>
          </div>

          <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />

          <button
            @click="handleLogout"
            class="relative w-full md:max-w-xs border border-red-500/30 bg-red-500/5 px-4 py-3 rounded-2xl text-red-400 font-bold text-sm uppercase tracking-widest active:scale-95 transition-all duration-150 hover:bg-red-500/10"
          >
            Se déconnecter
          </button>
        </div>
      </section>
    </main>

    <!-- Bottom nav mobile -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#060d1a]/90 backdrop-blur-2xl border-t border-white/[0.08]">
      <div class="flex justify-around px-2 pt-2 pb-5">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200 min-w-[60px]"
          :class="activeTab === tab.id ? 'text-cyan-400' : 'text-slate-500'"
        >
          <UIcon :name="tab.icon" class="text-2xl transition-transform duration-200" :class="activeTab === tab.id ? 'scale-110' : 'scale-100'" />
          <span class="text-[10px] font-bold uppercase tracking-wider leading-none">{{ tab.label }}</span>
          <div class="h-0.5 rounded-full mt-0.5 transition-all duration-300" :class="activeTab === tab.id ? 'bg-cyan-400 w-5' : 'bg-transparent w-3'" />
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

    <!-- ── Picker de séance (calendrier) ── -->
    <Transition name="slide-up">
      <div v-if="pickerOpen" class="fixed inset-0 z-[250] flex items-end justify-center bg-black/60 backdrop-blur-sm" @click.self="pickerOpen = false">
        <div class="w-full max-w-lg bg-[#0a1525] rounded-t-[36px] border-t border-white/[0.08] overflow-hidden">
          <!-- Handle -->
          <div class="flex justify-center pt-3 pb-1">
            <div class="w-10 h-1 bg-white/20 rounded-full"></div>
          </div>

          <div class="px-5 pt-3 pb-4">
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{{ formatPickerDate(pickerDate) }}</p>
            <h3 class="text-xl font-black text-white mt-0.5 mb-4">Quelle séance ?</h3>

            <!-- Nouvelle séance from scratch -->
            <button @click="openNewSession"
              class="w-full flex items-center gap-4 bg-white/[0.06] border border-white/[0.10] rounded-[20px] p-4 mb-4 active:scale-95 transition-all">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shrink-0">
                <UIcon name="i-heroicons-plus" class="text-white text-lg" />
              </div>
              <div class="text-left">
                <p class="text-white font-black text-sm">Nouvelle séance</p>
                <p class="text-slate-500 text-xs">Créer depuis zéro</p>
              </div>
            </button>

            <!-- Séances sauvegardées -->
            <div v-if="savedTemplates.length > 0">
              <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Mes séances</p>
              <div class="space-y-2 max-h-72 overflow-y-auto pr-1">
                <button v-for="t in savedTemplates" :key="t.id" @click="assignTemplate(t)"
                  class="w-full flex items-center gap-4 bg-white/[0.04] border border-white/[0.08] rounded-[18px] p-3.5 active:scale-95 transition-all text-left hover:bg-white/[0.07]">
                  <div class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-black text-base" :class="templateBg(t.category)">
                    {{ t.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-white font-black text-sm truncate">{{ t.name }}</p>
                    <p class="text-slate-500 text-xs truncate">{{ t.notes || 'Aucune note' }}</p>
                  </div>
                  <UIcon name="i-heroicons-arrow-right" class="text-slate-600 text-sm shrink-0" />
                </button>
              </div>
            </div>
            <div v-else-if="!loadingPicker" class="text-center py-4">
              <p class="text-slate-600 text-xs font-black mb-3">Aucune séance sauvegardée</p>
            </div>

            <!-- Gérer les séances -->
            <button @click="pickerOpen = false; manageSessionsOpen = true"
              class="w-full mt-3 flex items-center justify-center gap-2 text-slate-500 text-xs font-black py-2 hover:text-slate-300 transition">
              <UIcon name="i-heroicons-cog-6-tooth" class="text-sm" />
              Gérer mes séances sauvegardées
            </button>
          </div>
          <div class="pb-8"></div>
        </div>
      </div>
    </Transition>

    <!-- ── Gérer mes séances sauvegardées ── -->
    <Transition name="slide-up">
      <div v-if="manageSessionsOpen" class="fixed inset-0 z-[260] bg-[#060d1a]/98 backdrop-blur-2xl flex flex-col">
        <div class="flex items-center gap-4 px-5 py-5 border-b border-white/[0.08]">
          <button @click="manageSessionsOpen = false" class="p-2 rounded-xl bg-white/[0.06] text-slate-400 hover:text-white transition">
            <UIcon name="i-heroicons-arrow-left" class="text-xl" />
          </button>
          <h2 class="text-xl font-black">Mes séances</h2>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <Programmes @refresh="refreshTemplates" />
        </div>
      </div>
    </Transition>
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
import ProgrammeWidget from '~/components/custom/programme-widget.vue'
import Programmes from '~/components/custom/programmes.vue'
import Amis from '~/components/custom/amis.vue'
import Niveau from '~/components/custom/niveau.vue'

const router = useRouter()
const supabase = useSupabaseClient()

const activeTab = ref('accueil')
const tabs = [
  { id: 'accueil', label: 'Accueil', icon: 'i-heroicons-home' },
  { id: 'agenda', label: 'Agenda', icon: 'i-heroicons-calendar' },
  { id: 'nutrition', label: 'Nutrition', icon: 'i-heroicons-fire' },
  { id: 'niveau', label: 'Niveau', icon: 'i-heroicons-star' },
  { id: 'amis', label: 'Amis', icon: 'i-heroicons-user-group' },
]

const isModalOpen = ref(false)
const selectedDate = ref(null)
const sessionToEdit = ref(null)
const sessions = ref([])
const userName = ref('Invité')
const avatarUrl = ref('')
const avatarInput = ref(null)
const uploadingAvatar = ref(false)

const pickerOpen = ref(false)
const pickerDate = ref(null)
const savedTemplates = ref([])
const loadingPicker = ref(false)
const manageSessionsOpen = ref(false)
const pendingCount = ref(0)

function localDateStr(d = new Date()) {
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-')
}

const todaySession = computed(() => {
  return sessions.value.find(s => s.date === localDateStr()) || null
})

// Mini badge niveau sur l'accueil
const { totalXP: homeXP, levelInfo: homeLevelInfo, fetchXP: fetchHomeXP } = useXP()
const homeLevelColor = computed(() => homeLevelInfo.value?.color || '')

const { join: joinPresence, leave: leavePresence } = usePresence()
const { requestAndSubscribe } = usePush()

const LEVEL_COLORS_HOME = [
  '', 'from-slate-400 to-slate-500', 'from-slate-300 to-slate-400',
  'from-emerald-400 to-green-500', 'from-emerald-400 to-teal-500',
  'from-cyan-400 to-blue-500', 'from-blue-400 to-indigo-500',
  'from-violet-400 to-purple-600', 'from-purple-400 to-pink-500',
  'from-yellow-400 to-orange-500', 'from-yellow-300 to-amber-500',
]

let currentUserId = null

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return router.push('/login')
  currentUserId = user.id

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', user.id)
    .maybeSingle()

  const defaultUsername = user.email?.split('@')[0] || 'user'

  if (!profile) {
    await supabase.from('profiles').upsert({ id: user.id, username: defaultUsername }, { onConflict: 'id' })
    userName.value = defaultUsername
  } else if (!profile.username) {
    await supabase.from('profiles').update({ username: defaultUsername }).eq('id', user.id)
    userName.value = defaultUsername
  } else {
    userName.value = profile.username
  }

  avatarUrl.value = profile?.avatar_url || ''
  await fetchSessions()
  fetchHomeXP()
  fetchPendingCount(user.id)
  joinPresence(user.id)
  // Demander permission push après 3s (laisse l'app charger)
  setTimeout(() => requestAndSubscribe(user.id), 3000)
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

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    uploadingAvatar.value = false
    return
  }

  const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
  const url = `${publicUrl}?t=${Date.now()}`

  await supabase.from('profiles').upsert({ id: currentUserId, avatar_url: url })
  avatarUrl.value = url
  uploadingAvatar.value = false
  event.target.value = ''
}

async function fetchSessions() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { data, error } = await supabase.from('sport_sessions').select('*').eq('user_id', user.id).order('date', { ascending: true })
  if (error) { console.error('Erreur fetchSessions:', error); return }
  sessions.value = data || []
}

async function saveSession(payload) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !selectedDate.value) return
  const existing = sessions.value.find(s => s.date === selectedDate.value)
  if (existing) {
    await supabase.from('sport_sessions').update({ data: payload.data }).eq('id', existing.id)
  } else {
    await supabase.from('sport_sessions').insert({ user_id: user.id, date: selectedDate.value, data: payload.data })
  }
  await fetchSessions()
  closeModal()
}

async function handleDeleteSession(dateStr) {
  const session = sessions.value.find(s => s.date === dateStr)
  if (!session) return
  await supabase.from('sport_sessions').delete().eq('id', session.id)
  await fetchSessions()
}

async function onDateSelected(date) {
  const existing = sessions.value.find(s => s.date === date)
  if (existing) {
    // Date already has a session → open editor directly
    selectedDate.value = date
    sessionToEdit.value = JSON.parse(JSON.stringify(existing.data))
    isModalOpen.value = true
    return
  }
  // No session yet → show picker
  pickerDate.value = date
  pickerOpen.value = true
  loadingPicker.value = true
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data } = await supabase.from('workout_templates').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    savedTemplates.value = data || []
  }
  loadingPicker.value = false
}

function openNewSession() {
  pickerOpen.value = false
  selectedDate.value = pickerDate.value
  sessionToEdit.value = null
  isModalOpen.value = true
}

async function assignTemplate(template) {
  pickerOpen.value = false
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !pickerDate.value) return
  const sessionData = {
    title: template.name,
    category: template.category || '',
    notes: template.notes || '',
    exercises: template.exercises || []
  }
  await supabase.from('sport_sessions').insert({ user_id: user.id, date: pickerDate.value, data: sessionData })
  await fetchSessions()
}

function formatPickerDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

async function fetchPendingCount(uid) {
  const { count } = await supabase.from('friendships').select('id', { count: 'exact', head: true })
    .eq('addressee_id', uid).eq('status', 'pending')
  pendingCount.value = count || 0
}

async function refreshTemplates() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { data } = await supabase.from('workout_templates').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  savedTemplates.value = data || []
}

function templateBg(cat) {
  const map = {
    push: 'bg-orange-500/10 text-orange-400',
    pull: 'bg-blue-500/10 text-blue-400',
    jambes: 'bg-emerald-500/10 text-emerald-400',
    'full-body': 'bg-purple-500/10 text-purple-400',
    cardio: 'bg-red-500/10 text-red-400',
    haut: 'bg-cyan-500/10 text-cyan-400',
    bas: 'bg-yellow-500/10 text-yellow-400',
  }
  return map[cat] || 'bg-violet-500/10 text-violet-400'
}

function closeModal() {
  isModalOpen.value = false
  sessionToEdit.value = null
  selectedDate.value = null
}

function openToday() {
  onDateSelected(localDateStr())
}

async function handleLogout() {
  leavePresence()
  await supabase.auth.signOut()
  window.location.href = '/login'
}
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(20px); }
</style>
