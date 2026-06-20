<template>
  <div>
    <!-- Séance prévue aujourd'hui -->
    <div v-if="todaySession" class="relative bg-white/[0.04] backdrop-blur-2xl rounded-[28px] overflow-hidden shadow-lg" style="border: 1px solid color-mix(in srgb, var(--accent-solid) 20%, transparent)">
      <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--accent-from)] via-[var(--accent-to)] to-[var(--accent-from)]"></div>
      <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[60px] pointer-events-none" style="background: color-mix(in srgb, var(--accent-solid) 10%, transparent)"></div>

      <div class="p-5">
        <div class="flex items-center justify-between mb-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <div class="w-2 h-2 rounded-full animate-pulse" style="background: var(--accent-solid); box-shadow: 0 0 8px color-mix(in srgb, var(--accent-solid) 80%, transparent)"></div>
              <span class="text-[10px] font-black uppercase tracking-[0.2em]" style="color: var(--accent-solid)">Séance du jour</span>
            </div>
            <h3 class="text-white font-black text-lg">{{ todaySession.data?.title || 'Entraînement' }}</h3>
            <p class="text-slate-500 text-xs mt-0.5">
              <template v-if="allExercises.length > 0">{{ allExercises.length }} exercice{{ allExercises.length > 1 ? 's' : '' }} prévus</template>
              <template v-else-if="todaySession.data?.notes">Notes disponibles</template>
              <template v-else>Séance planifiée</template>
            </p>
          </div>
          <span v-if="todaySession.data?.category" class="text-xs font-black px-3 py-1.5 rounded-full border"
            :class="categoryClass(todaySession.data.category)">
            {{ todaySession.data.category }}
          </span>
        </div>

        <!-- Notes (si pas d'exercices) -->
        <div v-if="allExercises.length === 0 && todaySession.data?.notes" class="mb-4 bg-white/[0.04] rounded-2xl p-4 border border-white/[0.06]">
          <p class="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{{ todaySession.data.notes }}</p>
        </div>

        <!-- Exercices preview -->
        <div v-else-if="allExercises.length > 0" class="space-y-2 mb-4">
          <div v-for="ex in previewExercises" :key="ex.id || ex.name" class="flex items-center gap-3 bg-white/[0.04] rounded-2xl p-2.5 border border-white/[0.06]">
            <img :src="ex.mediaUrl" class="w-10 h-10 rounded-xl object-cover bg-slate-800 shrink-0" @error="onImgError" />
            <div class="flex-1 min-w-0">
              <p class="text-white font-bold text-sm truncate">{{ ex.name }}</p>
              <p class="text-slate-500 text-xs">{{ ex.sets }} séries × {{ ex.reps }} rép.</p>
            </div>
          </div>
          <p v-if="allExercises.length > 3" class="text-slate-600 text-xs text-center font-bold py-1">
            + {{ allExercises.length - 3 }} autres exercices
          </p>
        </div>

        <button @click="showFull = true"
          class="w-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-black py-3.5 rounded-2xl text-sm shadow-lg shadow-[color:var(--accent-solid)]/20 active:scale-95 transition-all flex items-center justify-center gap-2">
          <UIcon name="i-heroicons-play" />
          Voir la séance
        </button>
      </div>
    </div>

    <!-- Rien de prévu -->
    <div v-else class="bg-white/[0.04] backdrop-blur-2xl rounded-[28px] border border-white/[0.08] p-5 flex items-center justify-between">
      <div>
        <p class="text-slate-400 font-black text-sm">Aucune séance prévue</p>
        <p class="text-slate-600 text-xs mt-0.5">Planifie ta prochaine séance</p>
      </div>
      <button @click="$emit('open-today')"
        class="bg-white/[0.08] border border-white/[0.12] text-white font-black text-sm px-4 py-2.5 rounded-2xl active:scale-95 transition-all">
        Planifier
      </button>
    </div>

    <!-- Overlay séance complète -->
    <Transition name="slide-up">
      <div v-if="showFull" class="fixed inset-0 z-[300] backdrop-blur-2xl flex flex-col" :style="{ backgroundColor: bgAlpha(theme.bg, 0.98) }">
        <div class="flex items-center gap-4 px-5 py-5 border-b border-white/[0.08]">
          <button @click="showFull = false" class="p-2 rounded-xl bg-white/[0.06] text-slate-400 hover:text-white transition">
            <UIcon name="i-heroicons-arrow-left" class="text-xl" />
          </button>
          <div>
            <p class="text-xs font-black uppercase tracking-widest" style="color: var(--accent-solid)">Séance du jour</p>
            <h2 class="text-xl font-black text-white">{{ todaySession?.data?.title || 'Entraînement' }}</h2>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <!-- Notes only -->
          <div v-if="allExercises.length === 0 && todaySession?.data?.notes"
            class="bg-white/[0.04] rounded-[24px] border border-white/[0.08] p-5">
            <p class="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">{{ todaySession.data.notes }}</p>
          </div>
          <!-- Exercises -->
          <div v-for="(ex, i) in allExercises" :key="i" class="bg-white/[0.04] rounded-[24px] border border-white/[0.08] p-4 flex items-center gap-4">
            <img :src="ex.mediaUrl" class="w-16 h-16 rounded-2xl object-cover bg-slate-800 shrink-0" @error="onImgError" />
            <div class="flex-1">
              <p class="text-white font-black text-base">{{ ex.name }}</p>
              <p class="text-slate-500 text-xs mt-0.5">{{ ex.muscle }}</p>
              <div class="flex items-center gap-2 mt-2">
                <span class="text-xs font-black px-3 py-1 rounded-full" style="background: color-mix(in srgb, var(--accent-solid) 10%, transparent); border: 1px solid color-mix(in srgb, var(--accent-solid) 20%, transparent); color: var(--accent-solid)">{{ ex.sets }} séries</span>
                <span class="bg-white/[0.06] border border-white/[0.08] text-white text-xs font-black px-3 py-1 rounded-full">{{ ex.reps }} rép.</span>
                <span v-if="ex.weight" class="text-xs font-black px-3 py-1 rounded-full" style="background: color-mix(in srgb, var(--accent-solid) 12%, transparent); border: 1px solid color-mix(in srgb, var(--accent-solid) 20%, transparent); color: var(--accent-solid)">{{ ex.weight }} kg</span>
              </div>
            </div>
            <span class="text-3xl font-black text-slate-800">{{ i + 1 }}</span>
          </div>
        </div>

        <div class="p-4 border-t border-white/[0.08]">
          <button @click="showFull = false"
            class="w-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-black py-4 rounded-[20px] text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
            <UIcon name="i-heroicons-check-circle" class="text-xl" />
            C'est parti !
          </button>
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
  todaySession: { type: Object, default: null }
})

defineEmits(['open-today'])

const showFull = ref(false)

const allExercises = computed(() => props.todaySession?.data?.exercises || [])
const previewExercises = computed(() => allExercises.value.slice(0, 3))

function categoryClass(cat) {
  const map = {
    push: 'bg-orange-500/10 border-orange-500/20 text-orange-300',
    pull: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
    jambes: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
    'full-body': 'bg-purple-500/10 border-purple-500/20 text-purple-300',
    cardio: 'bg-red-500/10 border-red-500/20 text-red-300',
    haut: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
    bas: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300',
  }
  return map[cat] || 'bg-white/[0.06] border-white/[0.10] text-slate-400'
}

function onImgError(e) {
  e.target.src = 'https://placehold.co/100x100/1e293b/475569?text=Ex'
}
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(40px); }
</style>
