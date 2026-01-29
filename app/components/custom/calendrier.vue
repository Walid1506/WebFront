<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between px-2">
      <h2 class="text-2xl font-black text-slate-900 capitalize">{{ formattedMonth }}</h2>
      <div class="flex gap-2">
        <button @click="changeMonth(-1)" class="p-2 rounded-full hover:bg-gray-200 transition">
          <UIcon name="i-heroicons-chevron-left" class="text-xl text-slate-700" />
        </button>
        <button @click="changeMonth(1)" class="p-2 rounded-full hover:bg-gray-200 transition">
          <UIcon name="i-heroicons-chevron-right" class="text-xl text-slate-700" />
        </button>
      </div>
    </div>
    <div class="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        <div v-for="day in weekDays" :key="day" class="py-3 text-center text-xs font-bold text-gray-400 uppercase">{{ day }}</div>
      </div>
      <div class="grid grid-cols-7 auto-rows-[120px] gap-px bg-gray-100">
        <div v-for="(date, index) in calendarDays" :key="index" class="bg-white p-2 flex flex-col hover:bg-gray-50 transition" :class="{ 'bg-green-50/30': isToday(date) }">
          <template v-if="date">
            <div class="flex justify-start">
              <span class="text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full" :class="isToday(date) ? 'bg-green-500 text-white' : 'text-gray-700'">{{ getDayNumber(date) }}</span>
            </div>
            <div class="flex-1 flex items-center justify-center">
              <button v-if="isSessionDone(date)" @click="handleDayClick(date)" class="w-full h-full flex items-center justify-center">
                <div class="bg-green-100 text-green-700 p-2 rounded-lg text-center">
                  <UIcon name="i-heroicons-check-circle" class="text-xl mb-1" />
                  <p class="text-[10px] font-bold">{{ getSessionType(date) }}</p>
                </div>
              </button>
              <button v-else @click="handleDayClick(date)" class="text-gray-300 hover:text-green-500">
                <UIcon name="i-heroicons-plus-circle" class="text-3xl" />
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSportStore } from "~/stores/sport"

const emit = defineEmits(["select-date"])
const store = useSportStore()

const currentMonth = ref(new Date())

const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

const formattedMonth = computed(() => currentMonth.value.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }))

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startDayIndex = getStartDayIndex(firstDayOfMonth)
  const days = createEmptyDays(startDayIndex)
  for (let day = 1; day <= daysInMonth; day++) days.push(toFrCA(new Date(year, month, day)))
  while (days.length % 7 !== 0) days.push(null)
  return days
})

function toFrCA(date) {
  return date.toLocaleDateString("fr-CA")
}

function getStartDayIndex(date) {
  const dayIndex = date.getDay()
  if (dayIndex === 0) return 6
  return dayIndex - 1
}

function createEmptyDays(count) {
  const days = []
  for (let i = 0; i < count; i++) days.push(null)
  return days
}

function changeMonth(step) {
  const nextMonth = new Date(currentMonth.value)
  nextMonth.setMonth(nextMonth.getMonth() + step)
  currentMonth.value = nextMonth
}

function isToday(date) {
  if (!date) return false
  return date === toFrCA(new Date())
}

function getDayNumber(date) {
  return date.split("-")[2]
}

function getSession(date) {
  if (!date) return null
  return store.sessions.find(session => session.date === date) || null
}

function isSessionDone(date) {
  const session = getSession(date)
  return !!session?.sport
}

function getSessionType(date) {
  const session = getSession(date)
  if (!session?.sport) return ""
  return session.sport.type
}

function handleDayClick(date) {
  if (!date) return
  emit("select-date", date)
}
</script>
