<template>
  <div class="select-none">
    <!-- Header mois -->
    <div class="flex items-center justify-between px-4 py-3">
      <button @click="changeMonth(-1)" class="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center active:scale-90 transition-all">
        <UIcon name="i-heroicons-chevron-left" class="text-white text-lg" />
      </button>
      <div class="flex items-center gap-2">
        <h2 class="text-xl font-black text-white capitalize tracking-tight">{{ formattedMonth }}</h2>
        <div class="flex rounded-xl overflow-hidden border border-white/[0.10] text-xs font-black">
          <button @click="setDotStyle('dot')" class="px-2.5 py-1.5 transition-colors" :class="dotStyle === 'dot' ? 'bg-white/[0.18] text-white' : 'bg-white/[0.03] text-slate-600'">●</button>
          <button @click="setDotStyle('ring')" class="px-2.5 py-1.5 transition-colors border-l border-white/[0.10]" :class="dotStyle === 'ring' ? 'bg-white/[0.18] text-white' : 'bg-white/[0.03] text-slate-600'">○</button>
        </div>
      </div>
      <button @click="changeMonth(1)" class="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center active:scale-90 transition-all">
        <UIcon name="i-heroicons-chevron-right" class="text-white text-lg" />
      </button>
    </div>

    <!-- Jours de la semaine -->
    <div class="grid grid-cols-7 mb-1 px-2">
      <div v-for="day in weekDays" :key="day" class="text-center text-[11px] font-black text-slate-600 uppercase py-1">
        {{ day }}
      </div>
    </div>

    <!-- Grille -->
    <div class="grid grid-cols-7 gap-y-1 px-2 pb-2">
      <div v-for="(dateStr, i) in calendarDays" :key="i"
        class="flex flex-col items-center justify-start py-1 relative"
        :class="dateStr ? 'cursor-pointer' : ''"
        @click="handleDayClick(dateStr)">

        <template v-if="dateStr">
          <!-- Numéro du jour -->
          <div class="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
            :style="dayCircleStyle(dateStr)">
            <span class="text-sm font-black leading-none"
              :style="(isSessionDone(dateStr) && dotStyle === 'dot') ? { color: 'white' } : (isToday(dateStr) ? { color: 'var(--accent-solid)' } : {})"
              :class="!(isSessionDone(dateStr) && dotStyle === 'dot') && !isToday(dateStr) ? (isPast(dateStr) ? 'text-slate-600' : 'text-white') : ''">
              {{ getDayNumber(dateStr) }}
            </span>
          </div>
          <!-- Marqueur aujourd'hui (quand pas de séance) -->
          <div class="mt-1 h-1.5 flex items-center justify-center">
            <div v-if="isToday(dateStr) && !isSessionDone(dateStr)"
              class="w-1 h-1 rounded-full"
              style="background: var(--accent-solid)" />
          </div>
        </template>
      </div>
    </div>

    <!-- Panneau de détail (jour sélectionné avec séance) -->
    <Transition name="slide-detail">
      <div v-if="selectedDay && isSessionDone(selectedDay)"
        class="mx-2 mb-2 bg-white/[0.06] rounded-[20px] border border-white/[0.10] overflow-hidden">
        <div class="p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{{ formatSelectedDate(selectedDay) }}</p>
              <p class="text-white font-black text-base truncate">{{ getSessionTitle(selectedDay) }}</p>
              <span v-if="getSessionCategory(selectedDay)"
                class="inline-block mt-1.5 text-[10px] font-black px-2.5 py-1 rounded-full border"
                :class="getCategoryClass(getSessionCategory(selectedDay))">
                {{ formatCategoryLabel(getSessionCategory(selectedDay)) }}
              </span>
            </div>
            <button @click="selectedDay = null" class="p-1.5 text-slate-600 hover:text-slate-400 transition shrink-0">
              <UIcon name="i-heroicons-x-mark" class="text-lg" />
            </button>
          </div>
          <div class="flex gap-2 mt-3">
            <button @click="emit('select-date', selectedDay); selectedDay = null"
              class="flex-1 bg-white/[0.08] border border-white/[0.12] text-white font-black text-sm py-2.5 rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-1.5">
              <UIcon name="i-heroicons-pencil-square" class="text-sm" />
              Modifier
            </button>
            <button @click="doDelete(selectedDay)"
              class="flex-1 bg-red-500/10 border border-red-500/20 text-red-400 font-black text-sm py-2.5 rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-1.5">
              <UIcon name="i-heroicons-trash" class="text-sm" />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const props = defineProps({
  dbSessions: { type: Array, default: () => [] },
  templates: { type: Array, default: () => [] }
})

const emit = defineEmits(['select-date', 'delete-session'])

const currentMonth = ref(new Date())
const selectedDay = ref(null)
const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const dotStyle = ref('dot')

onMounted(() => { dotStyle.value = localStorage.getItem('fittrack_cal_style') || 'dot' })
function setDotStyle(s) { dotStyle.value = s; localStorage.setItem('fittrack_cal_style', s) }

const formattedMonth = computed(() => {
  const s = currentMonth.value.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  return s.charAt(0).toUpperCase() + s.slice(1)
})

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0).getDate()
  const startIdx = first.getDay() === 0 ? 6 : first.getDay() - 1
  const days = Array(startIdx).fill(null)
  for (let i = 1; i <= last; i++) {
    const d = new Date(year, month, i)
    days.push([d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-'))
  }
  while (days.length % 7 !== 0) days.push(null)
  return days
})

function changeMonth(step) {
  const d = new Date(currentMonth.value)
  d.setMonth(d.getMonth() + step)
  currentMonth.value = d
  selectedDay.value = null
}

function todayStr() {
  const d = new Date()
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-')
}

function isToday(dateStr) { return dateStr === todayStr() }

function isPast(dateStr) { return dateStr < todayStr() }

function getDayNumber(dateStr) { return dateStr ? parseInt(dateStr.split('-')[2], 10) : '' }

function getSessionByDate(dateStr) { return props.dbSessions.find(s => s.date === dateStr) || null }
function isSessionDone(dateStr) { return !!getSessionByDate(dateStr) }
function getSessionTitle(dateStr) {
  const s = getSessionByDate(dateStr)
  return s?.data?.title || s?.data?.customTitle || 'Séance'
}
function getSessionCategory(dateStr) { return getSessionByDate(dateStr)?.data?.category || '' }

function handleDayClick(dateStr) {
  if (!dateStr) return
  if (isSessionDone(dateStr)) {
    selectedDay.value = selectedDay.value === dateStr ? null : dateStr
  } else {
    selectedDay.value = null
    emit('select-date', dateStr)
  }
}

function doDelete(dateStr) {
  emit('delete-session', dateStr)
  selectedDay.value = null
}

function formatSelectedDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

function formatCategoryLabel(cat) {
  const map = { haut: 'Haut du corps', bas: 'Bas du corps', push: 'Push', pull: 'Pull', jambes: 'Jambes', 'full-body': 'Full Body', cardio: 'Cardio', mobilite: 'Mobilité', repos: 'Repos' }
  return map[cat] || cat
}

function getSessionColor(dateStr) {
  const s = getSessionByDate(dateStr)
  // 1. Couleur live depuis le template (priorité absolue)
  if (s?.data?.templateId) {
    const tpl = props.templates.find(t => t.id === s.data.templateId)
    if (tpl?.color) return tpl.color
    // Fallback localStorage direct
    try {
      const lc = JSON.parse(localStorage.getItem('fittrack_tpl_colors') || '{}')
      if (lc[s.data.templateId]) return lc[s.data.templateId]
    } catch {}
  }
  // 2. Couleur stockée dans la session au moment de l'assignation
  if (s?.data?.color) return s.data.color
  // 3. Couleur par catégorie
  const catColors = {
    push: '#f97316', pull: '#3b82f6', jambes: '#22c55e',
    'full-body': '#a855f7', cardio: '#ef4444', haut: '#22d3ee',
    bas: '#eab308', mobilite: '#14b8a6', repos: '#94a3b8',
  }
  return catColors[s?.data?.category] || '#22d3ee'
}

function dayCircleStyle(dateStr) {
  const style = {}
  if (isSessionDone(dateStr)) {
    const color = getSessionColor(dateStr)
    if (dotStyle.value === 'dot') {
      style.backgroundColor = color
      style.boxShadow = `0 2px 8px ${color}55`
    } else {
      // Anneau : juste le contour coloré
      style.boxShadow = `0 0 0 2.5px ${color}`
    }
  } else if (selectedDay.value === dateStr) {
    style.backgroundColor = 'rgba(255,255,255,0.10)'
  }
  if (selectedDay.value === dateStr) {
    style.outline = '2px solid rgba(255,255,255,0.30)'
    style.outlineOffset = '2px'
  }
  return style
}

function getCategoryClass(cat) {
  const map = {
    haut: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    bas: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    push: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    pull: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    jambes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    'full-body': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    cardio: 'bg-red-500/15 text-red-400 border-red-500/20',
    mobilite: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
    repos: 'bg-slate-500/15 text-slate-300 border-slate-500/20',
  }
  return map[cat] || 'bg-white/10 text-white border-white/10'
}
</script>

<style scoped>
.slide-detail-enter-active, .slide-detail-leave-active { transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-detail-enter-from, .slide-detail-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
