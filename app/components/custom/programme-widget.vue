<template>
  <div>
    <!-- Séance du jour : déjà dans le calendrier (validée), sinon le modèle prévu dans l'objectif de la semaine -->
    <div v-if="current" class="space-y-2.5">
      <div class="arena-cut bg-[var(--accent-solid)] text-[var(--accent-ink)] p-5">
        <div class="flex items-start justify-between gap-3">
          <p class="text-sm font-bold uppercase">Séance prévue · {{ dayLabel }}</p>
          <span v-if="validated" class="shrink-0 inline-flex items-center gap-1 text-sm font-bold uppercase">
            <UIcon name="i-heroicons-check" class="text-base" />
            Validée
          </span>
        </div>
        <h3 class="arena-display text-5xl leading-none mt-1 line-clamp-2 break-words">{{ current.title }}</h3>
        <p class="font-bold mt-1">
          <template v-if="current.exercises.length > 0">{{ current.exercises.length }} exercice{{ current.exercises.length > 1 ? 's' : '' }}</template>
          <template v-else-if="current.notes">Notes disponibles</template>
          <template v-else>Séance planifiée</template>
        </p>

        <div class="flex gap-2 mt-4 pr-4">
          <button class="flex-1 flex items-center justify-center gap-1.5 border-2 border-[var(--accent-ink)] py-2.5 font-bold uppercase active:scale-95 transition-all" @click="showFull = true">
            <UIcon name="i-heroicons-play" />
            Voir
          </button>
          <button v-if="!validated" :disabled="validating" class="arena-display not-italic flex-1 flex items-center justify-center gap-2 bg-[var(--accent-ink)] text-[var(--accent-solid)] py-2.5 text-lg arena-slant-soft active:scale-95 transition-all disabled:opacity-50" @click="$emit('validate-today')">
            <span v-if="validating" class="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
            Valider
          </button>
        </div>
      </div>

      <!-- Notes (si pas d'exercices) -->
    <div v-if="current.exercises.length === 0 && current.notes" class="bg-white/[0.04] rounded-2xl p-4 border border-white/[0.06]">
      <p class="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed line-clamp-4">{{ current.notes }}</p>
    </div>

    <!-- Exercices preview -->
    <div v-else-if="current.exercises.length > 0" class="space-y-2">
      <div v-for="(ex, i) in previewExercises" :key="ex.id || `${ex.name}-${i}`" class="flex items-center gap-3 bg-white/[0.04] rounded-2xl p-2.5 border border-white/[0.06]">
        <img :src="ex.mediaUrl" class="w-10 h-10 rounded-xl object-cover bg-slate-800 shrink-0" @error="onImgError" />
        <div class="flex-1 min-w-0">
          <p class="text-white font-bold text-sm truncate">{{ ex.name }}</p>
          <p class="text-slate-500 text-xs">{{ ex.sets }} séries × {{ ex.reps }} rép.</p>
        </div>
      </div>
      <p v-if="current.exercises.length > 3" class="text-slate-600 text-xs text-center font-bold py-1">
        + {{ current.exercises.length - 3 }} autres exercices
      </p>
    </div>
    </div>

    <!-- Rien dans la ligne du jour : repos (le singe somnole au-dessus, près de la citation) -->
    <div v-else class="bg-white/[0.04] border-l-[5px] border-l-[var(--accent-solid)] p-5 overflow-hidden">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="text-sm font-bold uppercase text-slate-400">Séance prévue · {{ dayLabel }}</p>
          <p class="arena-display text-5xl leading-none mt-1 text-white">Repos</p>
        </div>
        <button @click="$emit('go-plan')"
          class="shrink-0 bg-white/[0.08] border border-white/[0.12] text-white font-black text-sm px-4 py-2.5 rounded-2xl active:scale-95 transition-all">
          Planifier
        </button>
      </div>
      <button type="button" class="block w-full text-left mt-3 bg-white/[0.08] px-4 py-3" aria-label="Une autre phrase" @click="nextRestMessage">
        <Transition name="bubble-text" mode="out-in">
          <span :key="restIndex" class="block text-white font-bold text-sm leading-snug">{{ REST_MESSAGES[restIndex] }}</span>
        </Transition>
      </button>
    </div>

    <!-- Overlay séance complète -->
    <Transition name="slide-up">
      <div v-if="showFull && current" class="fixed inset-0 z-[300] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl flex flex-col" :style="{ backgroundColor: bgAlpha(theme.bg, 0.98) }">
        <div class="flex items-center gap-4 px-5 py-5 border-b border-white/[0.08]">
          <button @click="showFull = false" class="p-2 rounded-xl bg-white/[0.06] text-slate-400 hover:text-white transition">
            <UIcon name="i-heroicons-arrow-left" class="text-xl" />
          </button>
          <div class="min-w-0">
            <p class="text-xs font-black uppercase tracking-widest" style="color: var(--accent-solid)">Séance prévue · {{ dayLabel }}</p>
            <h2 class="text-xl font-black text-white truncate">{{ current.title }}</h2>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <!-- Notes only -->
          <div v-if="current.exercises.length === 0 && current.notes"
            class="bg-white/[0.04] rounded-[24px] border border-white/[0.08] p-5">
            <p class="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">{{ current.notes }}</p>
          </div>
          <!-- Exercises -->
          <div v-for="(ex, i) in current.exercises" :key="i" class="bg-white/[0.04] rounded-[24px] border border-white/[0.08] p-4 flex items-center gap-4">
            <img :src="ex.mediaUrl" class="w-16 h-16 rounded-2xl object-cover bg-slate-800 shrink-0" @error="onImgError" />
            <div class="flex-1 min-w-0">
              <p class="text-white font-black text-base">{{ ex.name }}</p>
              <p class="text-slate-500 text-xs mt-0.5">{{ ex.muscle }}</p>
              <div class="flex flex-wrap items-center gap-2 mt-2">
                <span class="whitespace-nowrap text-xs font-black px-3 py-1 rounded-full" style="background: color-mix(in srgb, var(--accent-solid) 10%, transparent); border: 1px solid color-mix(in srgb, var(--accent-solid) 20%, transparent); color: var(--accent-solid)">{{ ex.sets }} séries</span>
                <span class="whitespace-nowrap bg-white/[0.06] border border-white/[0.08] text-white text-xs font-black px-3 py-1 rounded-full">{{ ex.reps }} rép.</span>
                <span v-if="ex.weight" class="whitespace-nowrap text-xs font-black px-3 py-1 rounded-full" style="background: color-mix(in srgb, var(--accent-solid) 12%, transparent); border: 1px solid color-mix(in srgb, var(--accent-solid) 20%, transparent); color: var(--accent-solid)">{{ ex.weight }} kg</span>
              </div>
            </div>
            <span class="text-3xl font-black text-slate-800">{{ i + 1 }}</span>
          </div>
        </div>

        <!-- Séance déjà dans le calendrier : on la modifie ; sinon on la valide (ou on change le modèle du jour) -->
        <div class="p-4 border-t border-white/[0.08] flex gap-3">
          <template v-if="validated">
            <button @click="$emit('edit-today'); showFull = false"
              class="flex-1 bg-white/[0.08] border border-white/[0.12] text-white font-black py-4 rounded-[20px] text-base active:scale-95 transition-all flex items-center justify-center gap-2">
              <UIcon name="i-heroicons-pencil-square" class="text-lg" />
              Modifier
            </button>
            <button @click="showFull = false"
              class="flex-1 bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-black py-4 rounded-[20px] text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
              <UIcon name="i-heroicons-play" />
              C'est parti !
            </button>
          </template>
          <template v-else>
            <button @click="$emit('go-plan'); showFull = false"
              class="flex-1 bg-white/[0.08] border border-white/[0.12] text-white font-black py-4 rounded-[20px] text-base active:scale-95 transition-all flex items-center justify-center gap-2">
              <UIcon name="i-heroicons-table-cells" class="text-lg" />
              Mon objectif
            </button>
            <button @click="$emit('validate-today'); showFull = false" :disabled="validating"
              class="flex-1 bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-black py-4 rounded-[20px] text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              <UIcon name="i-heroicons-check-circle" class="text-lg" />
              Valider
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const { theme } = useTheme()

function bgAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

const props = defineProps({
  todaySession: { type: Object, default: null },
  // Ligne du jour dans l'objectif de la semaine : { label, template, ... }
  todayPlan: { type: Object, default: null },
  validating: { type: Boolean, default: false }
})

defineEmits(['edit-today', 'go-plan', 'validate-today'])

const showFull = ref(false)

const dayLabel = computed(() => props.todayPlan?.label || new Date().toLocaleDateString('fr-FR', { weekday: 'long' }).replace(/^./, c => c.toUpperCase()))

// Une séance déjà dans le calendrier aujourd'hui compte comme validée
const validated = computed(() => !!props.todaySession)

const current = computed(() => {
  if (props.todaySession) {
    const data = props.todaySession.data || {}
    return { title: data.title || 'Entraînement', exercises: data.exercises || [], notes: data.notes || '' }
  }
  const template = props.todayPlan?.template
  if (template) return { title: template.name || 'Séance', exercises: template.exercises || [], notes: template.notes || '' }
  return null
})

const previewExercises = computed(() => current.value?.exercises.slice(0, 3) || [])

// Jour de repos : une phrase qui change à chaque ouverture (jamais deux fois de suite la même),
// et un appui dessus en donne une autre
const REST_MESSAGES = [
  'Repose-toi bien, tu l\'as mérité ! 😌',
  'Journée off : tes muscles se reconstruisent 💪',
  'Le repos fait partie de l\'entraînement.',
  'Recharge les batteries, on repart demain 🔋',
  'Pense à bien dormir et à boire de l\'eau 💧',
  'Un peu d\'étirements ? Tranquille 🧘',
  'Chill aujourd\'hui, champion 😎',
  'Tes muscles grandissent pendant que tu te reposes.',
  'Profite de ta journée, pas de séance !',
  'Détente totale, tu reviendras plus fort 🐒'
]
const LAST_REST_KEY = 'fittrack-last-repos'

function saveRestIndex(index) {
  try { localStorage.setItem(LAST_REST_KEY, String(index)) } catch {}
}

function pickRestIndex() {
  let last = -1
  try { last = Number(localStorage.getItem(LAST_REST_KEY) ?? -1) } catch {}
  const hasLast = Number.isInteger(last) && last >= 0 && last < REST_MESSAGES.length
  let index = Math.floor(Math.random() * (REST_MESSAGES.length - (hasLast ? 1 : 0)))
  if (hasLast && index >= last) index++
  saveRestIndex(index)
  return index
}

const restIndex = ref(pickRestIndex())

function nextRestMessage() {
  restIndex.value = (restIndex.value + 1) % REST_MESSAGES.length
  saveRestIndex(restIndex.value)
}

function onImgError(e) {
  if (e.target.dataset.fallback) return
  e.target.dataset.fallback = '1'
  e.target.src = 'https://placehold.co/100x100/1e293b/475569?text=Ex'
}
</script>

<style scoped>
.bubble-text-enter-active, .bubble-text-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.bubble-text-enter-from { opacity: 0; transform: translateY(6px); }
.bubble-text-leave-to { opacity: 0; transform: translateY(-6px); }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(40px); }
</style>
