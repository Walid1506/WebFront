<template>
  <div class="select-none">
    <!-- Header mois -->
    <div class="flex items-center justify-between px-4 py-3">
      <button @click="changeMonth(-1)" class="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center active:scale-90 transition-all">
        <UIcon name="i-heroicons-chevron-left" class="text-white text-lg" />
      </button>
      <h2 class="text-xl font-black text-white capitalize tracking-tight">{{ formattedMonth }}</h2>
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
          <div class="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
            :class="[
              isToday(dateStr) ? 'bg-gradient-to-br from-cyan-400 to-emerald-500 shadow-lg shadow-cyan-500/30' : '',
              selectedDay === dateStr && !isToday(dateStr) ? 'bg-white/[0.10] border border-white/20' : '',
            ]">
            <span class="text-sm font-black leading-none"
              :class="[
                isToday(dateStr) ? 'text-black' : '',
                isPast(dateStr) && !isToday(dateStr) ? 'text-slate-600' : 'text-white',
              ]">
              {{ getDayNumber(dateStr) }}
            </span>
          </div>

          <!-- Indicateur session -->
          <div class="mt-1 h-1.5 flex items-center justify-center">
            <div v-if="isSessionDone(dateStr)"
              class="w-1.5 h-1.5 rounded-full"
              :class="getCategoryDot(getSessionCategory(dateStr))">
            </div>
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
  dbSessions: { type: Array, default: () => [] }
})

const emit = defineEmits(['select-date', 'delete-session'])

const currentMonth = ref(new Date())
const selectedDay = ref(null)
const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

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

function getCategoryDot(cat) {
  const map = {
    push: 'bg-orange-400', pull: 'bg-blue-400', jambes: 'bg-emerald-400',
    'full-body': 'bg-purple-400', cardio: 'bg-red-400', haut: 'bg-cyan-400',
    bas: 'bg-yellow-400', mobilite: 'bg-teal-400', repos: 'bg-slate-400',
  }
  return map[cat] || 'bg-cyan-400'
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
