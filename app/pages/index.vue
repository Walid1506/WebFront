<template>
  <div class="p-4 max-w-6xl mx-auto space-y-6">
    <div class="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl flex justify-between items-center relative overflow-hidden">
      <div class="relative z-10">
        <h1 class="text-3xl font-black mb-2">Bonjour, {{ store.currentUser || "Invité" }} !</h1>
        <p class="text-slate-300 font-medium">Voici ton historique d'activités.</p>
      </div>
      <div class="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
    </div>

    <div class="flex items-center justify-between px-2">
      <h2 class="text-2xl font-black text-slate-900 capitalize">{{ formattedMonth }}</h2>
      <div class="flex gap-2">
        <button @click="changeMonth(-1)" class="p-2 rounded-full hover:bg-gray-200 transition"><UIcon name="i-heroicons-chevron-left" class="text-xl text-slate-700" /></button>
        <button @click="changeMonth(1)" class="p-2 rounded-full hover:bg-gray-200 transition"><UIcon name="i-heroicons-chevron-right" class="text-xl text-slate-700" /></button>
      </div>
    </div>

    <div class="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        <div v-for="day in ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']" :key="day" class="py-3 text-center text-xs font-bold text-gray-400 uppercase">{{ day }}</div>
      </div>

      <div class="grid grid-cols-7 auto-rows-[120px] divide-x divide-gray-100 bg-gray-100 gap-px border-b border-gray-200">
        <div v-for="(date, index) in calendarDays" :key="index" class="bg-white relative flex flex-col p-2 group transition hover:bg-gray-50" :class="{ 'bg-green-50/30': isToday(date) }">
          <template v-if="date">
            <div class="flex justify-between items-start">
              <span class="text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full" :class="isToday(date) ? 'bg-green-500 text-white shadow-md' : 'text-gray-700'">{{ date.split('-')[2] }}</span>
            </div>

            <div class="flex-1 flex flex-col justify-center items-center mt-1">
              <button v-if="getSessionForDay(date)?.sport?.done" @click="openModal(date)" class="w-full transition transform hover:scale-105 active:scale-95 focus:outline-none">
                <div class="bg-green-100 text-green-700 p-1.5 rounded-lg text-center mx-auto w-full max-w-[80px] border border-green-200 hover:bg-green-200 hover:shadow-md transition">
                  <UIcon name="i-heroicons-check-circle" class="text-xl block mx-auto mb-1" />
                  <p class="text-[10px] font-bold truncate">{{ getSessionForDay(date).sport.type }}</p>
                </div>
              </button>

              <button v-else @click="openModal(date)" class="opacity-0 group-hover:opacity-100 w-full h-full flex items-center justify-center text-gray-300 hover:text-green-500 transition-all duration-200 focus:opacity-100">
                <UIcon name="i-heroicons-plus-circle" class="text-3xl" />
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>

    <Seance v-if="isModalOpen" :date="selectedDate" :initial-data="sessionToEdit" @close="isModalOpen = false" @save="saveSession" />
  </div>
</template>

<script setup>
import { useSportStore } from "~/stores/sport"

const store = useSportStore()

const isModalOpen = ref(false)
const selectedDate = ref(null)
const currentMonth = ref(new Date())
const sessionToEdit = ref(null)

const formattedMonth = computed(() => {
  return currentMonth.value.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
})

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  let startDay = firstDayOfMonth.getDay()
  startDay = startDay === 0 ? 6 : startDay - 1
  const days = []

  for (let i = 0; i < startDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    days.push(date.toLocaleDateString("fr-CA"))
  }

  return days
})

function changeMonth(step) {
  const newDate = new Date(currentMonth.value)
  newDate.setMonth(newDate.getMonth() + step)
  currentMonth.value = newDate
}

function isToday(dateStr) {
  if (!dateStr) return false
  return dateStr === new Date().toLocaleDateString("fr-CA")
}

function getSessionForDay(date) {
  if (!date) return null
  return store.sessions.find(s => s.date === date) || null
}

function openModal(date) {
  if (!date) return
  selectedDate.value = date

  const existing = getSessionForDay(date)
  if (existing && existing.sport) {
    sessionToEdit.value = existing.sport
  } else {
    sessionToEdit.value = null
  }

  isModalOpen.value = true
}

function saveSession(payload) {
  if (payload.type === "sport") store.saveSportSession(selectedDate.value, payload.data)
  isModalOpen.value = false
}
</script>
