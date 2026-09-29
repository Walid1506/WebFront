<template>
  <div class="space-y-4">
    <!-- En-tête : comme le profil d'un ami (photo, dernière séance, compteurs) -->
    <div class="relative bg-white/[0.04] backdrop-blur-2xl rounded-[28px] md:rounded-[40px] border border-white/[0.08] p-6 text-center overflow-hidden shadow-2xl">
      <div class="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-[70px] pointer-events-none opacity-70" :style="{ backgroundColor: theme.blobs[0] }"></div>
      <div class="absolute -bottom-14 -left-14 w-44 h-44 rounded-full blur-[70px] pointer-events-none opacity-50" :style="{ backgroundColor: theme.blobs[1] }"></div>

      <!-- Photo : un appui pour la changer -->
      <button type="button" class="relative block w-24 h-24 mx-auto mb-3" aria-label="Changer la photo de profil" @click="avatarInput?.click()">
        <span class="block w-full h-full rounded-full bg-gradient-to-tr from-[var(--accent-from)] to-[var(--accent-to)] p-[2px]">
          <span class="w-full h-full rounded-full overflow-hidden flex items-center justify-center transition-colors duration-700" :style="{ backgroundColor: theme.bg }">
            <img v-if="avatarUrl" :src="avatarUrl" class="w-full h-full object-cover" alt="Photo de profil" />
            <span v-else class="text-white font-black text-3xl">{{ userName.charAt(0).toUpperCase() }}</span>
          </span>
        </span>
        <span
          class="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border-2 bg-gradient-to-tr from-[var(--accent-from)] to-[var(--accent-to)]"
          :style="{ borderColor: theme.bg }"
        >
          <span v-if="uploadingAvatar" class="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
          <UIcon v-else name="i-heroicons-camera" class="text-white text-sm" />
        </span>
      </button>
      <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />

      <!-- Pseudo : un appui sur le crayon pour le modifier -->
      <form v-if="editingName" class="relative flex items-center justify-center gap-2 max-w-xs mx-auto" @submit.prevent="saveUsername">
        <input
          ref="nameInput"
          v-model="nameDraft"
          type="text"
          maxlength="20"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          class="flex-1 min-w-0 bg-white/[0.08] border border-white/[0.14] rounded-xl px-3 py-2 text-white font-black text-center outline-none focus:border-[color:var(--accent-solid)]"
          @input="nameError = ''"
          @keydown.esc="editingName = false"
        />
        <button type="submit" :disabled="savingName" class="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-white bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] disabled:opacity-50" aria-label="Enregistrer le pseudo">
          <span v-if="savingName" class="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
          <UIcon v-else name="i-heroicons-check" class="text-lg" />
        </button>
        <button type="button" class="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-white/[0.06] text-slate-400" aria-label="Annuler" @click="editingName = false">
          <UIcon name="i-heroicons-x-mark" class="text-lg" />
        </button>
      </form>
      <button v-else type="button" class="relative inline-flex items-center gap-2 text-white font-black text-xl active:opacity-70" aria-label="Modifier le pseudo" @click="startEditName">
        {{ userName }}
        <UIcon name="i-heroicons-pencil-square" class="text-base text-slate-500" />
      </button>
      <p v-if="nameError" class="relative text-red-400 text-xs font-bold mt-1.5">{{ nameError }}</p>
      <p class="relative text-xs text-slate-500 mt-1">
        {{ recentSessions[0] ? `Dernière séance : ${formatDate(recentSessions[0].date)}` : 'Membre FitTrack' }}
      </p>

      <div class="relative flex justify-center gap-6 mt-4">
        <div>
          <p class="font-black text-2xl" :style="{ color: 'var(--accent-solid)' }">{{ monthCount }}</p>
          <p class="text-slate-500 text-xs font-black uppercase">ce mois</p>
        </div>
        <div class="w-px bg-white/[0.08]"></div>
        <div>
          <p class="font-black text-2xl" :style="{ color: 'var(--accent-to)' }">{{ sessions.length }}</p>
          <p class="text-slate-500 text-xs font-black uppercase">total</p>
        </div>
      </div>

      <!-- Thème : un seul bouton, le choix s'ouvre par-dessus -->
      <button
        type="button"
        class="relative mt-5 inline-flex items-center gap-2 pl-3 pr-3.5 py-2 rounded-2xl bg-white/[0.06] border border-white/[0.10] text-sm font-black text-white active:scale-95 transition-all"
        @click="themeOpen = true"
      >
        <UIcon name="i-heroicons-swatch" class="text-base" :style="{ color: 'var(--accent-solid)' }" />
        Thème · {{ theme.emoji }} {{ theme.name }}
        <UIcon name="i-heroicons-chevron-down" class="text-slate-500" />
      </button>
    </div>

    <Depliant title="Mon assiette aujourd'hui" :subtitle="mealsSummary" icon="i-heroicons-fire" icon-color="#fb923c">
      <AssietteJour :meals="todayMeals" :water="todayWater" />
    </Depliant>

    <Depliant title="Dernières séances" :subtitle="sessionsSummary" icon="i-heroicons-bolt">
      <SeancesRecentes :sessions="recentSessions" empty-text="Aucune séance pour l'instant" />
    </Depliant>

    <Depliant title="Médailles" :subtitle="medalCount === null ? 'Missions et médailles' : `${medalCount} médaille${medalCount > 1 ? 's' : ''} gagnée${medalCount > 1 ? 's' : ''}`" icon="i-heroicons-trophy" icon-color="#facc15">
      <Medailles :active="active" @count="medalCount = $event" />
    </Depliant>

    <button
      type="button"
      class="w-full border border-red-500/30 bg-red-500/5 px-4 py-3 rounded-2xl text-red-400 font-bold text-sm uppercase tracking-widest active:scale-95 transition-all duration-150 hover:bg-red-500/10"
      @click="$emit('logout')"
    >
      Se déconnecter
    </button>

    <!-- Choix du thème (dans body : le flou des cartes confinerait une fenêtre fixe) -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="themeOpen" class="fixed inset-0 z-[500] flex items-end justify-center bg-black/60 backdrop-blur-sm" @click.self="themeOpen = false">
          <div class="sheet-panel w-full max-w-lg rounded-t-[36px] border-t border-white/[0.08] pb-[max(24px,env(safe-area-inset-bottom))] transition-colors duration-700" :style="{ backgroundColor: bgAlpha(theme.bg, 0.97) }">
            <div class="flex justify-center pt-3 pb-1">
              <div class="w-10 h-1 bg-white/20 rounded-full"></div>
            </div>
            <div class="px-5 pt-3">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-black text-white">Choisis ton thème</h3>
                <button type="button" class="p-2 rounded-xl bg-white/[0.06] text-slate-400 hover:text-white transition" aria-label="Fermer" @click="themeOpen = false">
                  <UIcon name="i-heroicons-x-mark" class="text-lg" />
                </button>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="t in Object.values(THEMES)"
                  :key="t.id"
                  type="button"
                  class="relative flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-200 active:scale-95"
                  :class="themeId === t.id ? 'bg-white/10 border-white/30 shadow-lg' : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.07]'"
                  @click="chooseTheme(t.id)"
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
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
const props = defineProps({
  userId: { type: String, default: null },
  userName: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  // Toutes les séances de l'utilisateur (déjà chargées par l'accueil)
  sessions: { type: Array, default: () => [] },
  active: { type: Boolean, default: true }
})

const emit = defineEmits(['avatar-updated', 'username-updated', 'logout'])

const supabase = useSupabaseClient()
const { theme, themeId, setTheme, THEMES } = useTheme()

function bgAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function localDateStr(d = new Date()) {
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-')
}

function formatDate(d) {
  return new Date(`${d}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
}

// ── Séances ──
// Les 8 dernières jusqu'à aujourd'hui (les séances planifiées plus tard ne sont pas « dernières »)
const recentSessions = computed(() => {
  const today = localDateStr()
  return props.sessions.filter(s => s.date <= today).sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 8)
})

const monthCount = computed(() => {
  const firstOfMonth = `${localDateStr().slice(0, 7)}-01`
  return props.sessions.filter(s => s.date >= firstOfMonth).length
})

const sessionsSummary = computed(() => {
  const n = recentSessions.value.length
  return n ? `${n} séance${n > 1 ? 's' : ''} récente${n > 1 ? 's' : ''}` : 'Aucune séance pour l\'instant'
})

// ── Assiette du jour ──
const todayMeals = ref([])
const todayWater = ref(0)
const mealsLoaded = ref(false)

const mealsSummary = computed(() => {
  if (!mealsLoaded.value) return 'Chargement...'
  if (!todayMeals.value.length) return 'Rien d\'enregistré aujourd\'hui'
  const n = todayMeals.value.length
  return `${sumMeals(todayMeals.value).kcal} kcal · ${n} aliment${n > 1 ? 's' : ''}`
})

async function fetchTodayMeals() {
  if (!props.userId) return
  const { data: rows, error } = await supabase.from('nutrition_daily')
    .select('repas, eau').eq('user_id', props.userId).eq('date', localDateStr())
  if (error) {
    console.error('Erreur assiette du jour :', error)
    return
  }
  // Plusieurs lignes possibles pour un même jour (anciennes versions) : fusionnées comme dans le journal
  todayMeals.value = mergeRepas((rows || []).map(r => r.repas || []))
  todayWater.value = Math.max(0, ...(rows || []).map(r => Number(r.eau) || 0))
  mealsLoaded.value = true
}

onMounted(fetchTodayMeals)

// L'onglet reste monté : l'assiette est rechargée à chaque retour (repas ajoutés dans Nutrition)
watch(() => props.active, (active) => {
  if (active) fetchTodayMeals()
})
watch(() => props.userId, fetchTodayMeals)

// ── Médailles ──
const medalCount = ref(null)

// ── Pseudo ──
const editingName = ref(false)
const nameDraft = ref('')
const nameError = ref('')
const savingName = ref(false)
const nameInput = ref(null)

function startEditName() {
  nameDraft.value = props.userName
  nameError.value = ''
  editingName.value = true
  nextTick(() => nameInput.value?.select())
}

// 3 à 20 caractères : lettres, chiffres, point, tiret et tiret bas (c'est ce que les amis tapent pour te trouver)
async function saveUsername() {
  const username = nameDraft.value.trim()
  if (username === props.userName) {
    editingName.value = false
    return
  }
  if (!/^[\p{L}\p{N}._-]{3,20}$/u.test(username)) {
    nameError.value = '3 à 20 caractères : lettres, chiffres, point, tiret ou tiret bas.'
    return
  }
  if (!props.userId || savingName.value) return

  savingName.value = true
  try {
    // La recherche d'amis ne tient pas compte des majuscules : « Walid » et « walid » seraient confondus
    const { data: taken } = await supabase.from('profiles').select('id').ilike('username', username).neq('id', props.userId).limit(1)
    if (taken?.length) {
      nameError.value = 'Ce pseudo est déjà pris, choisis-en un autre.'
      return
    }
    const { error } = await supabase.from('profiles').update({ username }).eq('id', props.userId)
    if (error) {
      nameError.value = error.code === '23505' ? 'Ce pseudo est déjà pris, choisis-en un autre.' : "Le pseudo n'a pas pu être enregistré. Réessaie."
      return
    }
    // Aussi dans le compte : c'est lui qui recrée le profil s'il venait à manquer
    supabase.auth.updateUser({ data: { username } })
    emit('username-updated', username)
    editingName.value = false
  } finally {
    savingName.value = false
  }
}

// ── Thème ──
const themeOpen = ref(false)
function chooseTheme(id) {
  setTheme(id)
  themeOpen.value = false
}

// ── Photo de profil ──
const avatarInput = ref(null)
const uploadingAvatar = ref(false)

async function handleAvatarUpload(event) {
  const file = event.target.files?.[0]
  if (!file || !props.userId) return

  const ext = file.name.split('.').pop()
  const path = `${props.userId}/avatar.${ext}`
  uploadingAvatar.value = true

  try {
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    const url = `${publicUrl}?t=${Date.now()}`

    await supabase.from('profiles').upsert({ id: props.userId, avatar_url: url })
    emit('avatar-updated', url)
  } finally {
    uploadingAvatar.value = false
    event.target.value = ''
  }
}
</script>

<style scoped>
.sheet-enter-active, .sheet-leave-active { transition: opacity 0.35s ease; }
.sheet-enter-active .sheet-panel, .sheet-leave-active .sheet-panel { transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-from .sheet-panel, .sheet-leave-to .sheet-panel { transform: translateY(100%); }
</style>
