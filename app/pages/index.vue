<template>
  <div class="p-4 max-w-6xl mx-auto space-y-8">
    <div class="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl flex justify-between items-center relative overflow-hidden">
      <div class="relative z-10">
        <h1 class="text-3xl font-black mb-2">Bonjour, {{ store.currentUser || "Invité" }} !</h1>
        <p class="text-slate-300 font-medium">Voici ton historique d'activités.</p>
      </div>
      <div class="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
    </div>

    <Calendrier @select-date="onDateSelected" />

    <Seance v-if="isModalOpen" :date="selectedDate" :initial-data="sessionToEdit" @close="isModalOpen = false" @save="saveSession" />
  </div>
</template>

<script setup>
import { useSportStore } from "~/stores/sport"
import Calendrier from "~/components/custom/Calendrier.vue"

const store = useSportStore()

const isModalOpen = ref(false)
const selectedDate = ref(null)
const sessionToEdit = ref(null)

function getSessionForDay(date) {
  if (!date) return null
  return store.sessions.find(s => s.date === date) || null
}

function onDateSelected(date) {
  selectedDate.value = date

  const existing = getSessionForDay(date)
  if (existing && existing.sport) {
    sessionToEdit.value = JSON.parse(JSON.stringify(existing.sport))
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
