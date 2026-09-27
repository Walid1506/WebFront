<template>
  <div>
    <!-- Pas du jour, envoyés par le raccourci iOS « FitTrack Pas » (une web app ne peut pas lire l'app Santé) -->
    <div
      role="button"
      tabindex="0"
      class="relative bg-white/[0.04] backdrop-blur-2xl rounded-[28px] border border-white/[0.08] p-5 overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
      @click="guideOpen = true"
      @keydown.enter="guideOpen = true"
    >
      <div class="absolute -bottom-12 -right-10 w-40 h-40 rounded-full blur-[60px] pointer-events-none opacity-40" :style="{ backgroundColor: theme.blobs[1] }"></div>
      <div class="relative flex items-center gap-4">
        <!-- Anneau : progression vers l'objectif de pas -->
        <div class="relative w-16 h-16 shrink-0">
          <svg viewBox="0 0 64 64" class="w-full h-full -rotate-90" aria-hidden="true">
            <defs>
              <linearGradient id="pas-anneau" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" style="stop-color: var(--accent-from)" />
                <stop offset="1" style="stop-color: var(--accent-to)" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="27" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="7" />
            <circle
              cx="32" cy="32" r="27" fill="none" stroke="url(#pas-anneau)" stroke-width="7" stroke-linecap="round"
              :stroke-dasharray="RING"
              :stroke-dashoffset="RING * (1 - progress)"
              class="transition-[stroke-dashoffset] duration-1000 ease-out"
            />
          </svg>
          <UIcon name="i-lucide-footprints" class="absolute inset-0 m-auto text-xl" :style="{ color: 'var(--accent-solid)' }" />
        </div>

        <div class="flex-1 min-w-0">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Pas aujourd'hui</p>
          <p class="text-white font-[1000] text-3xl tracking-tighter leading-none mt-1">
            {{ steps === null ? '—' : formatNumber(steps) }}
            <span v-if="steps !== null" class="text-sm font-black text-slate-500 tracking-normal">/ {{ formatNumber(GOAL) }}</span>
          </p>
          <p class="text-xs font-bold mt-1.5 truncate" :class="linked ? 'text-slate-500' : ''" :style="linked ? {} : { color: 'var(--accent-solid)' }">
            {{ subtitle }}
          </p>
        </div>

        <button
          v-if="linked"
          type="button"
          class="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0 active:scale-90 transition-all"
          aria-label="Actualiser les pas avec le raccourci"
          @click.stop="runShortcut"
        >
          <UIcon name="i-heroicons-arrow-path" class="text-lg text-slate-300" :class="{ 'animate-spin': waitingForShortcut }" />
        </button>
        <UIcon v-else name="i-heroicons-chevron-right" class="text-slate-600 shrink-0" />
      </div>
    </div>

    <!-- Guide : connecter l'app Santé avec un raccourci -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div v-if="guideOpen" class="fixed inset-0 z-[450] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl flex flex-col text-white transition-colors duration-700" :style="{ backgroundColor: bgAlpha(theme.bg, 0.98) }">
          <div class="flex items-center gap-4 px-5 py-5 border-b border-white/[0.08] shrink-0">
            <button type="button" class="p-2 rounded-xl bg-white/[0.06] text-slate-400 hover:text-white transition" aria-label="Retour" @click="guideOpen = false">
              <UIcon name="i-heroicons-arrow-left" class="text-xl" />
            </button>
            <h2 class="text-xl font-black">Pas · app Santé</h2>
          </div>

          <div class="flex-1 overflow-y-auto p-5 space-y-4">
            <!-- État -->
            <div class="bg-white/[0.04] rounded-[24px] border border-white/[0.08] p-5 flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style="background: color-mix(in srgb, var(--accent-solid) 14%, transparent)">
                <UIcon name="i-lucide-footprints" class="text-2xl" :style="{ color: 'var(--accent-solid)' }" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-white font-black text-lg leading-tight">{{ steps === null ? 'Aucun pas reçu aujourd\'hui' : `${formatNumber(steps)} pas` }}</p>
                <p class="text-slate-500 text-xs font-bold mt-0.5">{{ updatedAt ? `Mis à jour à ${formatTime(updatedAt)}` : 'Le raccourci n\'a encore rien envoyé' }}</p>
              </div>
            </div>

            <div v-if="status === 'unavailable'" class="bg-amber-500/10 border border-amber-500/25 rounded-[20px] p-4 text-amber-200 text-sm font-bold leading-relaxed">
              Le serveur n'est pas encore prêt pour les pas : le script
              <span class="font-black">supabase/migrations/20260927_pas_sante.sql</span>
              doit être lancé une fois dans Supabase (SQL Editor).
            </div>

            <template v-else>
              <p class="text-slate-400 text-sm leading-relaxed px-1">
                Apple ne laisse pas les web apps lire l'app Santé. Un raccourci iOS s'en charge : il lit tes pas et les envoie à FitTrack.
                À configurer une seule fois (2 minutes).
              </p>

              <!-- 1. Lien personnel -->
              <div class="bg-white/[0.04] rounded-[24px] border border-white/[0.08] p-5">
                <p class="text-[10px] font-black uppercase tracking-widest mb-3" :style="{ color: 'var(--accent-solid)' }">1 · Ton lien personnel</p>
                <div class="flex items-center gap-2">
                  <p class="flex-1 min-w-0 bg-white/[0.06] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs font-mono text-slate-300 truncate">
                    {{ link || 'Création du lien...' }}
                  </p>
                  <button
                    type="button"
                    class="shrink-0 px-4 py-2.5 rounded-xl text-white font-black text-sm active:scale-95 transition-all bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] disabled:opacity-40"
                    :disabled="!link"
                    @click="copyLink"
                  >
                    {{ copied ? 'Copié ✓' : 'Copier' }}
                  </button>
                </div>
                <p class="text-slate-600 text-xs font-bold mt-2">Garde-le pour toi : il sert à envoyer des pas sur ton compte.</p>
              </div>

              <!-- 2. Raccourci -->
              <div class="bg-white/[0.04] rounded-[24px] border border-white/[0.08] p-5">
                <p class="text-[10px] font-black uppercase tracking-widest mb-3" :style="{ color: 'var(--accent-solid)' }">2 · Crée le raccourci</p>
                <ol class="space-y-3 text-sm text-slate-300 leading-relaxed">
                  <li class="flex gap-3">
                    <span class="step-num">1</span>
                    <span>Ouvre l'app <b class="text-white">Raccourcis</b>, touche <b class="text-white">+</b> et nomme le raccourci <b class="text-white">{{ SHORTCUT_NAME }}</b> (exactement).</span>
                  </li>
                  <li class="flex gap-3">
                    <span class="step-num">2</span>
                    <span>
                      Ajoute l'action <b class="text-white">Rechercher des échantillons de santé</b> (tape « santé » dans la recherche) :
                      type <b class="text-white">Nombre de pas</b>, date de début <b class="text-white">aujourd'hui</b>, grouper par <b class="text-white">jour</b>.
                      Autorise l'accès à Santé si l'iPhone le demande.
                    </span>
                  </li>
                  <li class="flex gap-3">
                    <span class="step-num">3</span>
                    <span>Ajoute <b class="text-white">Calculer des statistiques</b> et choisis <b class="text-white">Somme</b>.</span>
                  </li>
                  <li class="flex gap-3">
                    <span class="step-num">4</span>
                    <span>Ajoute <b class="text-white">Obtenir le contenu de l'URL</b>, colle ton lien, puis insère la variable <b class="text-white">Statistiques</b> juste après <b class="text-white">pas=</b>.</span>
                  </li>
                </ol>
              </div>

              <!-- 3. Automatisation -->
              <div class="bg-white/[0.04] rounded-[24px] border border-white/[0.08] p-5">
                <p class="text-[10px] font-black uppercase tracking-widest mb-3" :style="{ color: 'var(--accent-solid)' }">3 · Envoi automatique</p>
                <p class="text-sm text-slate-300 leading-relaxed">
                  Dans Raccourcis, onglet <b class="text-white">Automatisation</b> → <b class="text-white">+</b> → <b class="text-white">Heure de la journée</b>
                  (par exemple 12:00), <b class="text-white">Quotidiennement</b>, <b class="text-white">Exécuter immédiatement</b>, puis choisis
                  <b class="text-white">{{ SHORTCUT_NAME }}</b>. Ajoutes-en d'autres (18:00, 22:00...) pour des pas à jour toute la journée.
                </p>
                <p class="text-slate-500 text-xs font-bold mt-2">Le bouton ↻ de l'accueil lance aussi le raccourci à la demande.</p>
              </div>

              <button
                type="button"
                class="w-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-black py-4 rounded-[20px] text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                @click="runShortcut"
              >
                <UIcon name="i-heroicons-play" />
                Lancer le raccourci
              </button>
            </template>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
const props = defineProps({
  userId: { type: String, default: null },
  // L'accueil est affiché : on relit les pas (ils ont pu arriver pendant qu'on était ailleurs)
  active: { type: Boolean, default: true }
})

const GOAL = 10000
const RING = 2 * Math.PI * 27
// Nom exact du raccourci : le bouton ↻ le lance par son nom
const SHORTCUT_NAME = 'FitTrack Pas'

const supabase = useSupabaseClient()
const config = useRuntimeConfig()
const { theme } = useTheme()

function bgAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function localDateStr(d = new Date()) {
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-')
}

const numberFormat = new Intl.NumberFormat('fr-FR')
function formatNumber(n) {
  return numberFormat.format(n)
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

// 'loading' → 'ready', ou 'unavailable' si les tables des pas n'existent pas encore côté Supabase
const status = ref('loading')
const steps = ref(null)
const updatedAt = ref(null)
const linked = ref(false)
const token = ref('')
const guideOpen = ref(false)
const copied = ref(false)
const waitingForShortcut = ref(false)

const progress = computed(() => Math.min(1, (steps.value || 0) / GOAL))

const subtitle = computed(() => {
  if (status.value === 'loading') return 'Chargement...'
  if (!linked.value) return 'Connecter l\'app Santé →'
  if (steps.value === null) return 'Pas encore reçu aujourd\'hui · ↻ pour actualiser'
  const left = GOAL - steps.value
  const time = updatedAt.value ? ` · ${formatTime(updatedAt.value)}` : ''
  return (left > 0 ? `Encore ${formatNumber(left)} pas` : 'Objectif atteint 🎉') + time
})

const link = computed(() => token.value ? `${config.public.siteUrl}/api/pas?cle=${token.value}&pas=` : '')

// Tables absentes (script SQL pas encore lancé)
function isMissingTable(error) {
  return error?.code === 'PGRST205' || error?.code === '42P01'
}

async function fetchSteps() {
  if (!props.userId) return
  const [{ data: day, error: stepsError }, { data: sync, error: syncError }] = await Promise.all([
    supabase.from('daily_steps').select('steps, updated_at').eq('user_id', props.userId).eq('date', localDateStr()).maybeSingle(),
    supabase.from('health_sync').select('token').eq('user_id', props.userId).maybeSingle()
  ])
  if (isMissingTable(stepsError) || isMissingTable(syncError)) {
    status.value = 'unavailable'
    return
  }
  if (stepsError || syncError) {
    console.error('Erreur pas du jour :', stepsError || syncError)
    return
  }
  steps.value = day ? day.steps : null
  updatedAt.value = day?.updated_at || null
  linked.value = !!sync?.token
  if (sync?.token) token.value = sync.token
  status.value = 'ready'
}

// Lien personnel créé à la première ouverture du guide (le jeton est généré par la base)
async function ensureLink() {
  if (token.value || !props.userId || status.value === 'unavailable') return
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Paris'
  const { data, error } = await supabase.from('health_sync')
    .upsert({ user_id: props.userId, timezone }, { onConflict: 'user_id' })
    .select('token')
    .single()
  if (isMissingTable(error)) {
    status.value = 'unavailable'
    return
  }
  if (error) {
    console.error('Erreur lien des pas :', error)
    return
  }
  token.value = data.token
  linked.value = true
}

watch(guideOpen, (open) => {
  if (open) ensureLink()
})

async function copyLink() {
  if (!link.value) return
  try {
    await navigator.clipboard.writeText(link.value)
  } catch {
    // Presse-papiers refusé : sélection manuelle du lien
    window.prompt('Copie ton lien :', link.value)
    return
  }
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

// Lance le raccourci dans l'app Raccourcis ; au retour dans FitTrack, les pas sont relus quelques fois
// (l'envoi peut finir juste après le retour)
let pollTimer = null
function runShortcut() {
  waitingForShortcut.value = true
  window.location.href = `shortcuts://run-shortcut?name=${encodeURIComponent(SHORTCUT_NAME)}`
  setTimeout(() => { waitingForShortcut.value = false }, 15000)
}

function onVisible() {
  if (document.visibilityState !== 'visible') return
  fetchSteps()
  if (!waitingForShortcut.value) return
  clearInterval(pollTimer)
  let tries = 0
  pollTimer = setInterval(() => {
    fetchSteps()
    if (++tries >= 4) {
      clearInterval(pollTimer)
      waitingForShortcut.value = false
    }
  }, 2500)
}

onMounted(() => {
  fetchSteps()
  document.addEventListener('visibilitychange', onVisible)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', onVisible)
  clearInterval(pollTimer)
})

watch(() => props.userId, fetchSteps)
watch(() => props.active, (active) => {
  if (active) fetchSteps()
})
</script>

<style scoped>
.step-num {
  width: 1.5rem; height: 1.5rem; margin-top: 1px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border-radius: 9999px; background: rgb(255 255 255 / 0.08);
  color: #fff; font-size: 0.75rem; font-weight: 900;
}
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(30px); }
</style>
