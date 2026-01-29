<template>
  <div class="p-4 max-w-6xl mx-auto space-y-8 relative">
    <div class="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex items-center justify-between">
      <div class="relative z-10 w-full">
        <div class="flex justify-between w-full items-start gap-4">
          <div>
            <h1 class="text-3xl font-black mb-2">Bonjour, {{ userName }} !</h1>
            <p class="text-slate-300 font-medium">Voici ton historique d'activités.</p>
          </div>
          <button @click="handleLogout" class="text-xs bg-red-500/20 text-red-300 px-3 py-2 rounded-xl hover:bg-red-500 hover:text-white transition font-bold">Se déconnecter</button>
        </div>
      </div>
      <div class="absolute top-0 right-0 w-64 h-64 -mr-16 -mt-16 bg-white opacity-5 rounded-full pointer-events-none"></div>
    </div>
    <Calendrier @select-date="onDateSelected" />
    <section class="space-y-4"><AlimentationSection /></section>
    <section class="space-y-4"><VideoSection /></section>
    <ModalSeance v-if="isModalOpen" :date="selectedDate" :initial-data="sessionToEdit" @close="closeModal" @save="saveSession" />
  </div>
</template>

<script setup>
import { useSportStore } from "~/stores/sport"
import Calendrier from "~/components/custom/Calendrier.vue"
import VideoSection from "~/pages/video.vue"
import AlimentationSection from "~/pages/alimentation.vue"
import ModalSeance from "~/components/seance.vue"

const store = useSportStore()
const router = useRouter()

const isModalOpen = ref(false)
const selectedDate = ref(null)
const sessionToEdit = ref(null)

const userName = computed(() => (store.currentUser ? store.currentUser : "Invité"))

onMounted(() => redirectIfNotLoggedIn())

function redirectIfNotLoggedIn() {
  if (!store.currentUser) router.push("/login")
}

function handleLogout() {
  store.logout()
  router.push("/login")
}

function onDateSelected(date) {
  if (!date) return
  selectedDate.value = date
  sessionToEdit.value = getSportSession(date)
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

function saveSession(payload) {
  if (!payload) return
  if (payload.type !== "sport") return
  store.saveSportSession(selectedDate.value, payload.data)
  closeModal()
}

function getSportSession(date) {
  const session = findSessionByDate(date)
  if (!session) return null
  if (!session.sport) return null
  return deepCopy(session.sport)
}

function findSessionByDate(date) {
  const sessions = Array.isArray(store.sessions) ? store.sessions : []
  return sessions.find(session => session.date === date) || null
}

function deepCopy(data) {
  try {
    return structuredClone(data)
  } catch {
    if (!data) return null
    return JSON.parse(JSON.stringify(data))
  }
}
</script>
