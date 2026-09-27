<template>
  <div>
    <div class="bg-white/[0.04] backdrop-blur-2xl rounded-[28px] md:rounded-[36px] border border-white/[0.08] overflow-hidden">
      <!-- Progression de la semaine (repart à zéro chaque lundi) -->
      <div class="flex items-center gap-4 px-4 pt-4 pb-3.5">
        <div class="flex-1 min-w-0">
          <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Semaine du {{ weekRange }}</p>
          <div class="h-1.5 bg-white/[0.08] rounded-full overflow-hidden mt-2">
            <div class="h-full rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] transition-[width] duration-700" :style="{ width: `${progress}%` }" />
          </div>
        </div>
        <p class="shrink-0 text-sm font-black" :class="goalCount ? 'text-white' : 'text-slate-600'">
          {{ doneCount }}<span class="text-slate-500">/{{ goalCount }}</span>
        </p>
      </div>

      <!-- Tableau : jour | modèle | validé -->
      <div role="table" aria-label="Objectif par semaine">
        <div role="row" class="grid grid-cols-[76px_1fr_52px] items-center px-4 py-2 border-y border-white/[0.06] bg-white/[0.02]">
          <span role="columnheader" class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Jour</span>
          <span role="columnheader" class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Modèle</span>
          <span role="columnheader" class="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Validé</span>
        </div>

        <div
          v-for="day in week"
          :key="day.index"
          role="row"
          class="grid grid-cols-[76px_1fr_52px] items-center px-4 py-2.5 border-b border-white/[0.04] last:border-0 transition-colors"
          :style="day.isToday ? { backgroundColor: 'color-mix(in srgb, var(--accent-solid) 8%, transparent)' } : {}"
        >
          <!-- Jour -->
          <div role="cell" class="min-w-0">
            <p class="font-black text-sm leading-tight" :class="day.isToday ? '' : 'text-white'" :style="day.isToday ? { color: 'var(--accent-solid)' } : {}">
              {{ day.label }}
            </p>
            <p class="text-[11px] font-bold text-slate-500 mt-0.5">{{ day.isToday ? "Aujourd'hui" : formatShort(day.date) }}</p>
          </div>

          <!-- Modèle : le petit + pour en ajouter un, ou le modèle choisi (appui : changer) -->
          <div role="cell" class="min-w-0 pr-2">
            <button
              v-if="day.template"
              type="button"
              class="max-w-full inline-flex items-center gap-2 pl-2.5 pr-3 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] active:scale-95 transition-all"
              :aria-label="`Changer le modèle de ${day.label}`"
              @click="openPicker(day)"
            >
              <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: day.template.color || 'var(--accent-solid)' }" />
              <span class="text-white font-black text-sm truncate">{{ day.template.name }}</span>
            </button>
            <div v-else class="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-all"
                style="background: color-mix(in srgb, var(--accent-solid) 14%, transparent); border: 1.5px dashed color-mix(in srgb, var(--accent-solid) 50%, transparent)"
                :aria-label="`Ajouter un modèle pour ${day.label}`"
                @click="openPicker(day)"
              >
                <UIcon name="i-heroicons-plus" class="text-base" :style="{ color: 'var(--accent-solid)' }" />
              </button>
              <span class="text-xs font-bold truncate" :class="day.session ? 'text-slate-400' : 'text-slate-600'">
                {{ day.session ? (day.session.data?.title || 'Séance') : 'Repos' }}
              </span>
            </div>
          </div>

          <!-- Validé : rond à cocher, la séance du modèle s'ajoute au calendrier ce jour-là -->
          <div role="cell" class="flex justify-center">
            <button
              type="button"
              class="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 disabled:active:scale-100"
              :class="circleClass(day)"
              :style="day.validated ? { background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))', boxShadow: '0 4px 14px color-mix(in srgb, var(--accent-solid) 45%, transparent)' } : {}"
              :disabled="busyIndex !== null || (!day.validated && !day.template)"
              :aria-pressed="day.validated"
              :aria-label="day.validated ? `${day.label} validé` : `Valider ${day.label}`"
              @click="day.validated ? (confirmDay = day) : $emit('validate', day)"
            >
              <span v-if="busyIndex === day.index" class="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
              <UIcon v-else-if="day.validated" name="i-heroicons-check" class="text-white text-lg check-pop" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <!-- Choix du modèle pour un jour -->
      <Transition name="sheet">
        <div v-if="pickerDay" class="fixed inset-0 z-[500] flex items-end justify-center bg-black/60 backdrop-blur-sm" @click.self="pickerDay = null">
          <div class="sheet-panel w-full max-w-lg rounded-t-[36px] border-t border-white/[0.08] overflow-hidden transition-colors duration-700" :style="{ backgroundColor: bgAlpha(theme.bg, 0.97) }">
            <div class="flex justify-center pt-3 pb-1">
              <div class="w-10 h-1 bg-white/20 rounded-full"></div>
            </div>
            <div class="px-5 pt-3 pb-[max(24px,env(safe-area-inset-bottom))]">
              <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{{ pickerDay.label }} · chaque semaine</p>
              <h3 class="text-xl font-black text-white mt-0.5 mb-4">Quel modèle ?</h3>

              <div v-if="templates.length" class="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                <button
                  v-for="t in templates"
                  :key="t.id"
                  type="button"
                  class="w-full flex items-center gap-4 border rounded-[18px] p-3.5 active:scale-[0.98] transition-all text-left"
                  :class="pickerDay.template?.id === t.id ? 'bg-white/[0.10] border-white/25' : 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.07]'"
                  :disabled="saving"
                  @click="choose(t)"
                >
                  <div
                    class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-black text-base text-white"
                    :style="{ backgroundColor: t.color || 'color-mix(in srgb, var(--accent-solid) 30%, transparent)', boxShadow: t.color ? `0 2px 8px ${t.color}55` : 'none' }"
                  >
                    {{ t.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-white font-black text-sm truncate">{{ t.name }}</p>
                    <p class="text-slate-500 text-xs truncate">{{ describe(t) }}</p>
                  </div>
                  <UIcon v-if="pickerDay.template?.id === t.id" name="i-heroicons-check-circle-solid" class="text-xl shrink-0" :style="{ color: 'var(--accent-solid)' }" />
                </button>
              </div>
              <div v-else class="text-center py-6 bg-white/[0.03] rounded-[20px] border border-white/[0.06]">
                <p class="text-white font-black text-sm">Aucun modèle pour l'instant</p>
                <p class="text-slate-500 text-xs mt-1">Crée un modèle avec tes exercices, puis choisis-le ici.</p>
              </div>

              <div class="flex gap-2 mt-4">
                <button
                  v-if="pickerDay.template"
                  type="button"
                  class="flex-1 py-3 rounded-2xl bg-white/[0.06] border border-white/[0.08] text-slate-300 font-black text-sm active:scale-95 transition-all"
                  :disabled="saving"
                  @click="choose(null)"
                >
                  Mettre en repos
                </button>
                <button
                  type="button"
                  class="flex-1 py-3 rounded-2xl text-white font-black text-sm active:scale-95 transition-all flex items-center justify-center gap-1.5 bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]"
                  @click="pickerDay = null; $emit('create-template')"
                >
                  <UIcon name="i-heroicons-plus" />
                  Créer un modèle
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Retirer une validation (supprime la séance du calendrier) -->
      <Transition name="fade">
        <div v-if="confirmDay" class="fixed inset-0 z-[550] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" @click.self="confirmDay = null">
          <div class="w-full max-w-sm rounded-[28px] border border-white/[0.10] p-6 text-center" :style="{ backgroundColor: bgAlpha(theme.bg, 0.98) }">
            <p class="text-white font-black text-lg">Retirer la validation ?</p>
            <p class="text-slate-400 text-sm mt-2">
              La séance « {{ confirmDay.session?.data?.title || 'Séance' }} » du {{ formatLong(confirmDay.date) }} sera supprimée du calendrier.
            </p>
            <div class="flex gap-2 mt-5">
              <button type="button" class="flex-1 py-3 rounded-2xl bg-white/[0.06] text-slate-300 font-black text-sm" @click="confirmDay = null">Annuler</button>
              <button type="button" class="flex-1 py-3 rounded-2xl bg-red-500/15 border border-red-500/25 text-red-400 font-black text-sm" @click="$emit('unvalidate', confirmDay); confirmDay = null">Retirer</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
const props = defineProps({
  // Jours de la semaine en cours : { index, label, date, template, session, validated, isToday }
  week: { type: Array, default: () => [] },
  templates: { type: Array, default: () => [] },
  // Jour en cours de validation (ajout de la séance)
  busyIndex: { type: Number, default: null }
})

defineEmits(['validate', 'unvalidate', 'create-template'])

const { theme } = useTheme()
const { setDay } = useWeeklyPlan()

function bgAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

const goalCount = computed(() => props.week.filter(d => d.template || d.validated).length)
const doneCount = computed(() => props.week.filter(d => d.validated).length)
const progress = computed(() => (goalCount.value ? Math.round((doneCount.value / goalCount.value) * 100) : 0))

function formatShort(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function formatLong(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

const weekRange = computed(() => {
  const first = props.week[0]?.date
  const last = props.week[6]?.date
  return first && last ? `${formatShort(first)} au ${formatShort(last)}` : ''
})

function circleClass(day) {
  if (day.validated) return ''
  if (day.template) return 'border-2 border-white/25 hover:border-white/40'
  return 'border-2 border-dashed border-white/[0.08] opacity-60'
}

function describe(t) {
  const n = t.exercises?.length || 0
  if (n) return `${n} exercice${n > 1 ? 's' : ''}`
  return t.notes ? t.notes.split('\n')[0] : 'Aucun exercice'
}

// ── Choix du modèle ──
const pickerDay = ref(null)
const saving = ref(false)
const confirmDay = ref(null)

function openPicker(day) {
  pickerDay.value = day
}

async function choose(template) {
  if (!pickerDay.value || saving.value) return
  saving.value = true
  try {
    await setDay(pickerDay.value.index, template && { id: template.id, name: template.name, color: template.color })
    pickerDay.value = null
  } catch (error) {
    console.error('Erreur objectif de la semaine :', error)
    alert("Le modèle n'a pas pu être enregistré. Vérifie ta connexion et réessaie.")
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.check-pop { animation: check-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes check-pop {
  from { transform: scale(0.3); opacity: 0; }
}

.sheet-enter-active, .sheet-leave-active { transition: opacity 0.35s ease; }
.sheet-enter-active .sheet-panel, .sheet-leave-active .sheet-panel { transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-from .sheet-panel, .sheet-leave-to .sheet-panel { transform: translateY(100%); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
