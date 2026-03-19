<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between px-4 py-2">
      <h2 class="text-2xl font-[1000] text-white capitalize tracking-tighter">
        {{ formattedMonth }}
      </h2>

      <div class="flex gap-2">
        <button
          @click="changeMonth(-1)"
          class="p-2 bg-slate-800 rounded-xl text-white hover:bg-slate-700 transition-colors"
        >
          <UIcon name="i-heroicons-chevron-left" />
        </button>

        <button
          @click="changeMonth(1)"
          class="p-2 bg-slate-800 rounded-xl text-white hover:bg-slate-700 transition-colors"
        >
          <UIcon name="i-heroicons-chevron-right" />
        </button>
      </div>
    </div>

    <div class="grid grid-cols-7 gap-2 p-4">
      <div
        v-for="day in weekDays"
        :key="day"
        class="text-center text-[10px] font-black text-slate-600 uppercase"
      >
        {{ day }}
      </div>

      <div
        v-for="(dateStr, index) in calendarDays"
        :key="index"
        class="relative aspect-square rounded-2xl flex flex-col items-center justify-start pt-2 group transition-all overflow-hidden"
        :class="[
          dateStr ? 'hover:bg-slate-800 cursor-pointer' : '',
          isToday(dateStr) ? 'bg-slate-800 border border-white/10' : ''
        ]"
        @click="handleDayClick(dateStr)"
      >
        <template v-if="dateStr">
          <span
            class="text-[10px] font-bold z-10"
            :class="isToday(dateStr) ? 'text-white' : 'text-slate-500'"
          >
            {{ getDayNumber(dateStr) }}
          </span>

          <div
            v-if="isSessionDone(dateStr)"
            class="mt-1 flex flex-col items-center w-full relative px-1 z-10"
          >
            <div
              class="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[8px] text-black shadow-[0_0_10px_rgba(34,197,94,0.5)]"
            >
              <UIcon name="i-heroicons-check" />
            </div>

            <span
              class="text-[7px] font-black text-green-400 uppercase mt-1 truncate w-full text-center px-1"
            >
              {{ getSessionTitle(dateStr) }}
            </span>

            <span
              v-if="getSessionCategory(dateStr)"
              class="mt-1 px-1.5 py-0.5 rounded-full text-[6px] font-black uppercase tracking-wider border"
              :class="getCategoryClass(getSessionCategory(dateStr))"
            >
              {{ formatCategoryLabel(getSessionCategory(dateStr)) }}
            </span>

            <button
              @click.stop="confirmDelete(dateStr)"
              class="absolute -top-6 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-xl"
            >
              <UIcon name="i-heroicons-trash-solid" class="text-[10px]" />
            </button>
          </div>

          <div
            v-else
            class="mt-1 opacity-10 group-hover:opacity-100 transition-opacity"
          >
            <UIcon name="i-heroicons-plus-circle" class="text-slate-500 text-lg" />
          </div>

          <div
            v-if="isSessionDone(dateStr)"
            class="absolute inset-0 rounded-2xl bg-green-500/5 pointer-events-none"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  dbSessions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select-date', 'delete-session'])

const currentMonth = ref(new Date())
const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const formattedMonth = computed(() => {
  const s = currentMonth.value.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  })
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
    days.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    )
  }

  while (days.length % 7 !== 0) days.push(null)

  return days
})

function changeMonth(step) {
  const nextMonth = new Date(currentMonth.value)
  nextMonth.setMonth(nextMonth.getMonth() + step)
  currentMonth.value = nextMonth
}

function isToday(dateStr) {
  if (!dateStr) return false
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return dateStr === `${yyyy}-${mm}-${dd}`
}

function getDayNumber(dateStr) {
  return dateStr ? parseInt(dateStr.split('-')[2], 10) : ''
}

function getSessionByDate(dateStr) {
  return props.dbSessions.find(s => s.date === dateStr) || null
}

function isSessionDone(dateStr) {
  return !!getSessionByDate(dateStr)
}

function getSessionTitle(dateStr) {
  const session = getSessionByDate(dateStr)
  if (!session) return ''
  return session.data?.title || session.data?.customTitle || 'Sans titre'
}

function getSessionCategory(dateStr) {
  const session = getSessionByDate(dateStr)
  if (!session) return ''
  return session.data?.category || ''
}

function formatCategoryLabel(category) {
  const map = {
    haut: 'Haut',
    bas: 'Bas',
    push: 'Push',
    pull: 'Pull',
    jambes: 'Jambes',
    'full-body': 'Full',
    cardio: 'Cardio',
    mobilite: 'Mobilité',
    repos: 'Repos'
  }
  return map[category] || category
}

function getCategoryClass(category) {
  const map = {
    haut: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    bas: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    push: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
    pull: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
    jambes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    'full-body': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    cardio: 'bg-red-500/15 text-red-400 border-red-500/20',
    mobilite: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
    repos: 'bg-slate-500/15 text-slate-300 border-slate-500/20'
  }
  return map[category] || 'bg-white/10 text-white border-white/10'
}

function handleDayClick(dateStr) {
  if (dateStr) emit('select-date', dateStr)
}

function confirmDelete(dateStr) {
  if (confirm('Supprimer cette séance ?')) {
    emit('delete-session', dateStr)
  }
}
</script>