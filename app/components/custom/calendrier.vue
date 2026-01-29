<template>
  <div class="space-y-6">

    <div class="flex items-center justify-between px-2">
      <h2 class="text-2xl font-black text-slate-900 capitalize">
        {{ formattedMonth }}
      </h2>

      <div class="flex gap-2">
        <button
          @click="changeMonth(-1)"
          class="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <UIcon name="i-heroicons-chevron-left" class="text-xl text-slate-700" />
        </button>

        <button
          @click="changeMonth(1)"
          class="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <UIcon name="i-heroicons-chevron-right" class="text-xl text-slate-700" />
        </button>
      </div>
    </div>

    <div class="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">

      <div class="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        <div
          v-for="day in weekDays"
          :key="day"
          class="py-3 text-center text-xs font-bold text-gray-400 uppercase"
        >
          {{ day }}
        </div>
      </div>

      <div class="grid grid-cols-7 auto-rows-[120px] gap-px bg-gray-100">

        <div
          v-for="(date, index) in calendarDays"
          :key="index"
          class="bg-white p-2 flex flex-col hover:bg-gray-50 transition"
          :class="{ 'bg-green-50/30': isToday(date) }"
        >

          <template v-if="date">

            <div class="flex justify-start">
              <span
                class="text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full"
                :class="isToday(date) ? 'bg-green-500 text-white' : 'text-gray-700'"
              >
                {{ date.split('-')[2] }}
              </span>
            </div>

            <div class="flex-1 flex items-center justify-center">

              <button
                v-if="sessionDone(date)"
                @click="handleDayClick(date)"
                class="w-full h-full flex items-center justify-center"
              >
                <div class="bg-green-100 text-green-700 p-2 rounded-lg text-center">
                  <UIcon name="i-heroicons-check-circle" class="text-xl mb-1" />
                  <p class="text-[10px] font-bold">
                    {{ sessionType(date) }}
                  </p>
                </div>
              </button>

              <button
                v-else
                @click="handleDayClick(date)"
                class="text-gray-300 hover:text-green-500"
              >
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

const weekDays = [
  "Lun",
  "Mar",
  "Mer",
  "Jeu",
  "Ven",
  "Sam",
  "Dim"
]

const formattedMonth = computed(() => {
  return currentMonth.value.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric"
  })
})

function toFrCA(date) {
  return date.toLocaleDateString("fr-CA")
}

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  let startDay = firstDay.getDay()
  startDay = startDay === 0 ? 6 : startDay - 1

  const days = []

  for (let i = 0; i < startDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(toFrCA(new Date(year, month, i)))
  }

  while (days.length % 7 !== 0) {
    days.push(null)
  }

  return days
})

function changeMonth(step) {
  const date = new Date(currentMonth.value)
  date.setMonth(date.getMonth() + step)
  currentMonth.value = date
}

function isToday(date) {
  if (!date) return false
  return date === toFrCA(new Date())
}

function getSessionForDay(date) {
  if (!date) return null
  return store.sessions.find(s => s.date === date) || null
}

function sessionDone(date) {
  const session = getSessionForDay(date)
  return !!(session && session.sport)
}

function sessionType(date) {
  const session = getSessionForDay(date)
  if (!session || !session.sport) return ""
  return session.sport.type
}

function handleDayClick(date) {
  if (date) emit("select-date", date)
}
</script>
