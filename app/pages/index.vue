<template>
  <div class="min-h-screen text-white font-sans" :style="{ backgroundColor: theme.bg }">

    <!-- Blobs de fond (thème dynamique) -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div class="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[130px] transition-colors duration-700" :style="{ backgroundColor: theme.blobs[0] }"></div>
      <div class="absolute top-10 right-0 w-[400px] h-[400px] rounded-full blur-[110px] transition-colors duration-700" :style="{ backgroundColor: theme.blobs[1] }"></div>
      <div class="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full blur-[100px] transition-colors duration-700" :style="{ backgroundColor: theme.blobs[2] }"></div>
      <div class="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] rounded-full blur-[120px] transition-colors duration-700" :style="{ backgroundColor: theme.blobs[3] }"></div>
      <div class="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full blur-[100px] transition-colors duration-700" :style="{ backgroundColor: theme.blobs[4] }"></div>
    </div>

    <!-- Header -->
    <nav class="px-4 py-3 md:px-6 md:py-4 flex justify-between items-center backdrop-blur-2xl sticky top-0 z-50 border-b border-white/[0.06] transition-colors duration-700" :style="{ backgroundColor: bgAlpha(theme.bg, 0.75) }">
      <div class="flex items-center gap-3">
        <div class="bg-white/10 backdrop-blur p-1.5 rounded-xl border border-white/10">
          <img src="/images/logo.jpg" alt="Logo" class="h-7 w-7 md:h-8 md:w-8 rounded-lg" />
        </div>
        <h1 class="text-lg md:text-xl font-[1000] tracking-tighter uppercase italic">
          Fit<span class="bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] bg-clip-text text-transparent">Track</span>
        </h1>
      </div>

      <div class="flex items-center gap-2">
        <!-- Cloche notifications -->
        <button @click="notifOpen = !notifOpen; if(notifOpen) fetchNotifications(currentUserId)" class="relative w-9 h-9 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0 active:scale-95 transition-all">
          <UIcon name="i-heroicons-bell" class="text-slate-400 text-lg" />
          <span v-if="totalBadge > 0"
            class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
            <span class="text-white text-[9px] font-black">{{ totalBadge > 9 ? '9+' : totalBadge }}</span>
          </span>
        </button>

        <button @click="changeTab('profil')" class="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--accent-from)] to-[var(--accent-to)] p-[2px] shrink-0">
          <div class="w-full h-full rounded-full overflow-hidden flex items-center justify-center transition-colors duration-700" :style="{ backgroundColor: theme.bg }">
            <img v-if="avatarUrl" :src="avatarUrl" class="w-full h-full object-cover" alt="Avatar" />
            <span v-else class="text-white font-black text-sm">{{ userName.charAt(0).toUpperCase() }}</span>
          </div>
        </button>
      </div>
    </nav>

    <!-- Tab bar desktop -->
    <div class="hidden md:flex sticky top-[60px] z-40 backdrop-blur-2xl border-b border-white/[0.06] px-6 transition-colors duration-700" :style="{ backgroundColor: bgAlpha(theme.bg, 0.85) }">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="changeTab(tab.id)"
        class="flex items-center gap-2 px-5 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-200 border-b-2 -mb-px"
        :class="activeTab === tab.id ? 'border-[var(--accent-solid)]' : 'text-slate-500 border-transparent hover:text-slate-300'"
        :style="activeTab === tab.id ? { color: 'var(--accent-solid)' } : {}"
      >
        <UIcon :name="tab.icon" class="text-base" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Contenu principal -->
    <main class="max-w-5xl mx-auto pb-28 md:pb-12 md:px-4">

      <!-- Accueil — toujours monté -->
      <section v-show="activeTab === 'accueil'" class="p-4 space-y-5 mt-4 md:mt-8">
        <div class="relative p-6 md:p-10 rounded-[30px] md:rounded-[45px] bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] overflow-hidden shadow-2xl">
          <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[60px] pointer-events-none opacity-40" :style="{ backgroundColor: theme.blobs[0] }"></div>
          <div class="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-[60px] pointer-events-none opacity-30" :style="{ backgroundColor: theme.blobs[2] }"></div>
          <div class="relative flex items-start justify-between gap-4">
            <div>
              <h1 class="text-3xl md:text-5xl font-[1000] tracking-tighter leading-none mb-2 md:mb-4 text-white">
                Salut, <span class="bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] bg-clip-text text-transparent">{{ userName }}</span> !
              </h1>
              <p class="text-slate-400 font-medium italic text-sm md:text-base">Ta rigueur est ta seule limite.</p>
            </div>
          </div>
        </div>
        <ProgrammeWidget :today-session="todaySession" @open-today="openToday" />
      </section>

      <!-- Agenda — monté à la première visite -->
      <section v-if="mountedTabs.has('agenda')" v-show="activeTab === 'agenda'" class="p-4 space-y-4 mt-4 md:mt-8">
        <div class="flex items-center gap-3 px-1">
          <div class="w-2 h-6 md:h-8 bg-gradient-to-b from-[var(--accent-from)] to-[var(--accent-to)] rounded-full"></div>
          <h2 class="text-xl md:text-2xl font-black uppercase tracking-tighter">Ton Planning</h2>
        </div>
        <div class="bg-white/[0.04] backdrop-blur-2xl p-2 rounded-[30px] md:rounded-[40px] border border-white/[0.08] shadow-inner">
          <Calendrier :db-sessions="sessions" @select-date="onDateSelected" @delete-session="handleDeleteSession" />
        </div>
        <Records />
      </section>

      <!-- Nutrition — monté à la première visite -->
      <section v-if="mountedTabs.has('nutrition')" v-show="activeTab === 'nutrition'" class="p-4 space-y-4 mt-4 md:mt-8">
        <div class="flex items-center gap-3 px-1">
          <div class="w-2 h-6 md:h-8 bg-gradient-to-b from-orange-400 to-pink-500 rounded-full"></div>
          <h2 class="text-xl md:text-2xl font-black uppercase tracking-tighter">Nutrition</h2>
        </div>
        <AlimentationSection />
      </section>

      <!-- Amis — monté à la première visite -->
      <section v-if="mountedTabs.has('amis')" v-show="activeTab === 'amis'" class="p-4 space-y-4 mt-4 md:mt-8">
        <div class="flex items-center gap-3 px-1">
          <div class="w-2 h-6 md:h-8 bg-gradient-to-b from-[var(--accent-from)] to-[var(--accent-to)] rounded-full"></div>
          <h2 class="text-xl md:text-2xl font-black uppercase tracking-tighter">Amis</h2>
        </div>
        <Amis @pending-change="pendingCount = $event" />
      </section>

      <!-- Profil — monté à la première visite -->
      <section v-if="mountedTabs.has('profil')" v-show="activeTab === 'profil'" class="p-4 space-y-5 mt-4 md:mt-8">
        <div class="relative p-6 md:p-10 rounded-[30px] md:rounded-[45px] bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] shadow-2xl overflow-hidden">
          <div class="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-[80px] pointer-events-none opacity-50" :style="{ backgroundColor: theme.blobs[0] }"></div>
          <div class="absolute -bottom-16 -left-16 w-56 h-56 rounded-full blur-[80px] pointer-events-none opacity-40" :style="{ backgroundColor: theme.blobs[1] }"></div>

          <div class="relative flex items-center gap-5 mb-8">
            <div class="relative shrink-0 group cursor-pointer" @click="triggerAvatarUpload">
              <div class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-[var(--accent-from)] to-[var(--accent-to)] p-[2px]">
                <div class="w-full h-full rounded-full overflow-hidden flex items-center justify-center transition-colors duration-700" :style="{ backgroundColor: theme.bg }">
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
              <button @click="triggerAvatarUpload" class="mt-2 text-xs font-bold hover:opacity-80 transition flex items-center gap-1" :style="{ color: 'var(--accent-solid)' }">
                <UIcon name="i-heroicons-arrow-up-tray" class="text-sm" />
                {{ avatarUrl ? 'Changer la photo' : 'Ajouter une photo' }}
              </button>
            </div>
          </div>

          <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />

          <!-- Sélecteur de thème -->
          <div class="mt-6 mb-6">
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Thème</p>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="t in Object.values(THEMES)"
                :key="t.id"
                @click="setTheme(t.id)"
                class="relative flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-200 active:scale-95"
                :class="themeId === t.id
                  ? 'bg-white/10 border-white/30 shadow-lg'
                  : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.07]'"
              >
                <div v-if="themeId === t.id" class="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white/25 flex items-center justify-center">
                  <UIcon name="i-heroicons-check" class="text-white text-[10px]" />
                </div>
                <div class="flex gap-1.5">
                  <div v-for="(c, ci) in t.preview" :key="ci" class="w-4 h-4 rounded-full shadow-sm" :style="{ backgroundColor: c }"></div>
                </div>
                <div class="text-center leading-none">
                  <div class="text-xl mb-0.5">{{ t.emoji }}</div>
                  <div class="text-[9px] font-black text-slate-400 uppercase tracking-wider">{{ t.name }}</div>
                </div>
              </button>
            </div>
          </div>

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
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-2xl border-t border-white/[0.08] transition-colors duration-700" :style="{ backgroundColor: bgAlpha(theme.bg, 0.92) }">
      <div class="flex justify-around px-2 pt-2 pb-safe">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200 min-w-[60px]"
          :class="activeTab === tab.id ? '' : 'text-slate-500'"
          :style="activeTab === tab.id ? { color: 'var(--accent-solid)' } : {}"
          @click="changeTab(tab.id)"
        >
          <UIcon :name="tab.icon" class="text-2xl transition-transform duration-200" :class="activeTab === tab.id ? 'scale-110' : 'scale-100'" />
          <span class="text-[10px] font-bold uppercase tracking-wider leading-none">{{ tab.label }}</span>
          <div class="h-0.5 rounded-full mt-0.5 transition-all duration-300" :class="activeTab === tab.id ? 'w-5' : 'bg-transparent w-3'" :style="activeTab === tab.id ? { backgroundColor: 'var(--accent-solid)' } : {}" />
        </button>
      </div>
    </nav>

    <TimerRepos />

    <!-- ── Panel notifications ── -->
    <Transition name="fade">
      <div v-if="notifOpen" class="fixed inset-0 z-[600]" @click.self="notifOpen = false">
        <div class="absolute top-14 right-4 w-80 rounded-[24px] border border-white/[0.08] backdrop-blur-2xl shadow-2xl overflow-hidden"
          :style="{ backgroundColor: bgAlpha(theme.bg, 0.97) }">
          <div class="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
            <p class="font-black text-white">Notifications</p>
            <button @click="notifOpen = false" class="text-slate-500 hover:text-white transition">
              <UIcon name="i-heroicons-x-mark" class="text-lg" />
            </button>
          </div>

          <!-- Demandes d'amis -->
          <div v-if="notifRequests.length" class="p-4 border-b border-white/[0.06]">
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Demandes d'amis</p>
            <div v-for="r in notifRequests" :key="r.id" class="flex items-center gap-3 mb-2 last:mb-0">
              <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--accent-from)] to-[var(--accent-to)] p-[1.5px] shrink-0">
                <div class="w-full h-full rounded-full overflow-hidden flex items-center justify-center" :style="{ backgroundColor: theme.bg }">
                  <img v-if="r.profile?.avatar_url" :src="r.profile.avatar_url" class="w-full h-full object-cover" />
                  <span v-else class="text-white font-black text-xs">{{ r.profile?.username?.charAt(0).toUpperCase() }}</span>
                </div>
              </div>
              <p class="text-white font-black text-sm flex-1 truncate">{{ r.profile?.username }}</p>
              <div class="flex gap-1 shrink-0">
                <button @click="acceptFromNotif(r)" class="px-3 py-1.5 rounded-xl text-xs font-black text-white" :style="{ background: `linear-gradient(to right, var(--accent-from), var(--accent-to))` }">✓</button>
                <button @click="declineFromNotif(r)" class="px-3 py-1.5 rounded-xl text-xs font-black bg-white/[0.06] text-slate-400">✕</button>
              </div>
            </div>
          </div>

          <!-- Messages non lus -->
          <div v-if="notifMessages.length" class="p-4">
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Messages non lus</p>
            <div v-for="m in notifMessages" :key="m.senderId"
              @click="changeTab('amis'); notifOpen = false"
              class="flex items-center gap-3 mb-2 last:mb-0 cursor-pointer hover:bg-white/[0.04] rounded-2xl p-2 -mx-2 transition">
              <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--accent-from)] to-[var(--accent-to)] p-[1.5px] shrink-0">
                <div class="w-full h-full rounded-full overflow-hidden flex items-center justify-center" :style="{ backgroundColor: theme.bg }">
                  <img v-if="m.profile?.avatar_url" :src="m.profile.avatar_url" class="w-full h-full object-cover" />
                  <span v-else class="text-white font-black text-xs">{{ m.profile?.username?.charAt(0).toUpperCase() }}</span>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-white font-black text-sm truncate">{{ m.profile?.username }}</p>
                <p class="text-slate-500 text-xs truncate">{{ m.lastMsg }}</p>
              </div>
              <span class="bg-red-500 text-white text-[9px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shrink-0">{{ m.count }}</span>
            </div>
          </div>

          <!-- Vide -->
          <div v-if="!notifRequests.length && !notifMessages.length" class="p-8 text-center">
            <UIcon name="i-heroicons-bell-slash" class="text-3xl text-slate-700 mb-2" />
            <p class="text-slate-600 text-sm font-black">Aucune notification</p>
          </div>
        </div>
      </div>
    </Transition>

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
        <div class="w-full max-w-lg rounded-t-[36px] border-t border-white/[0.08] overflow-hidden transition-colors duration-700" :style="{ backgroundColor: bgAlpha(theme.bg, 0.97) }">
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
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] flex items-center justify-center shrink-0">
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
      <div v-if="manageSessionsOpen" class="fixed inset-0 z-[260] backdrop-blur-2xl flex flex-col transition-colors duration-700" :style="{ backgroundColor: bgAlpha(theme.bg, 0.98) }">
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
import AlimentationSection from '~/components/custom/alimentation.vue'
import Records from '~/components/custom/records.vue'
import TimerRepos from '~/components/custom/timer.vue'
import ProgrammeWidget from '~/components/custom/programme-widget.vue'
import Programmes from '~/components/custom/programmes.vue'
import Amis from '~/components/custom/amis.vue'

const router = useRouter()
const supabase = useSupabaseClient()

const { theme, themeId, setTheme, initTheme, THEMES } = useTheme()

function bgAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

const activeTab = ref('accueil')
// Onglets montés une fois visités (lazy mount, garde en mémoire après)
const mountedTabs = ref(new Set(['accueil']))
function changeTab(id) {
  activeTab.value = id
  mountedTabs.value.add(id)
}
const tabs = [
  { id: 'accueil', label: 'Accueil', icon: 'i-heroicons-home' },
  { id: 'agenda', label: 'Agenda', icon: 'i-heroicons-calendar' },
  { id: 'nutrition', label: 'Nutrition', icon: 'i-heroicons-fire' },
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
const notifOpen = ref(false)
const notifRequests = ref([])
const notifMessages = ref([])
const unreadMsgCount = ref(0)
const totalBadge = computed(() => pendingCount.value + unreadMsgCount.value)

function localDateStr(d = new Date()) {
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-')
}

const todaySession = computed(() => {
  return sessions.value.find(s => s.date === localDateStr()) || null
})

const { join: joinPresence, leave: leavePresence } = usePresence()
const { requestAndSubscribe } = usePush()

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
  initTheme()
  await fetchSessions()
  fetchPendingCount(user.id)
  fetchNotifications(user.id)
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

async function fetchNotifications(uid) {
  if (!uid) return
  const [{ data: requests }, { data: unread }] = await Promise.all([
    supabase.from('friendships').select('id, requester_id').eq('addressee_id', uid).eq('status', 'pending'),
    supabase.from('messages').select('sender_id, content, created_at').eq('receiver_id', uid).eq('read', false).order('created_at', { ascending: false }),
  ])

  if (requests?.length) {
    const ids = requests.map(r => r.requester_id)
    const { data: profiles } = await supabase.from('profiles').select('id, username, avatar_url').in('id', ids)
    notifRequests.value = requests.map(r => ({ ...r, profile: profiles?.find(p => p.id === r.requester_id) }))
  } else { notifRequests.value = [] }
  pendingCount.value = notifRequests.value.length

  if (unread?.length) {
    const senderIds = [...new Set(unread.map(m => m.sender_id))]
    const { data: profiles } = await supabase.from('profiles').select('id, username, avatar_url').in('id', senderIds)
    const grouped = {}
    for (const m of unread) {
      if (!grouped[m.sender_id]) grouped[m.sender_id] = { senderId: m.sender_id, count: 0, lastMsg: m.content, profile: profiles?.find(p => p.id === m.sender_id) }
      grouped[m.sender_id].count++
    }
    notifMessages.value = Object.values(grouped)
  } else { notifMessages.value = [] }
  unreadMsgCount.value = notifMessages.value.reduce((s, m) => s + m.count, 0)
}

async function acceptFromNotif(r) {
  await supabase.from('friendships').update({ status: 'accepted' }).eq('id', r.id)
  await fetchNotifications(currentUserId)
}

async function declineFromNotif(r) {
  await supabase.from('friendships').delete().eq('id', r.id)
  await fetchNotifications(currentUserId)
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
