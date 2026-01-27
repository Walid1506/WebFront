<script setup>
import { useSportStore } from "~/stores/sport";

const store = useSportStore();
const today = new Date().toISOString().split("T")[0];

const daysOfWeek = ref([]);
const isModalOpen = ref(false);
const selectedDate = ref(null);

function generateWeek() {
  const current = new Date();
  const dayOfWeek = current.getDay();
  const diff = current.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

  let result = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(current.setDate(diff + i));
    result.push(d.toISOString().split("T")[0]);
  }
  daysOfWeek.value = result;
}

function getSessionForDay(date) {
  for (let i = 0; i < store.sessions.length; i++) {
    if (store.sessions[i].date === date) return store.sessions[i];
  }
  return null;
}

function openModal(date) {
  selectedDate.value = date;
  isModalOpen.value = true;
}

function saveSession(payload) {
  if (payload.type === "sport") store.saveSportSession(selectedDate.value, payload.data);
  isModalOpen.value = false;
}

generateWeek();
</script>

<template>
  <div class="p-4 max-w-6xl mx-auto space-y-8">
    <div class="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl flex justify-between items-center relative overflow-hidden">
      <div class="relative z-10">
        <h1 class="text-3xl font-black mb-2">Bonjour, {{ store.currentUser || "Invité" }} !</h1>
        <p class="text-slate-300 font-medium">Prêt à exploser tes objectifs cette semaine ?</p>
      </div>
      <div class="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
    </div>

    <div>
      <h2 class="text-xl font-bold text-slate-900 mb-4 px-2">Ta Semaine</h2>
      <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div v-for="date in daysOfWeek" :key="date" class="bg-white border rounded-3xl p-4 min-h-[180px] flex flex-col justify-between transition hover:shadow-lg hover:border-green-200 group" :class="date === today ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-100'">
          <div class="text-center pb-2 border-b border-gray-50">
            <span class="text-xs font-bold uppercase text-gray-400 block mb-1">
              {{ new Date(date).toLocaleDateString("fr-FR", { weekday: "short" }) }}
            </span>
            <span class="text-2xl font-black text-slate-800">{{ date.split("-")[2] }}</span>
          </div>

          <div class="mt-4 flex-1 flex flex-col justify-center">
            <div v-if="getSessionForDay(date) && getSessionForDay(date).sport?.done" class="text-center w-full">
              <div class="bg-green-50 text-green-600 p-3 rounded-2xl mb-2">
                <UIcon name="i-heroicons-check-badge" class="text-3xl" />
              </div>
              <p class="text-xs font-bold text-slate-600 truncate">{{ getSessionForDay(date).sport.type }}</p>
            </div>

            <div v-else class="text-center w-full">
              <button @click="openModal(date)" class="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 font-bold text-xs hover:border-green-400 hover:text-green-500 transition">
                + Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Seance v-if="isModalOpen" :date="selectedDate" @close="isModalOpen = false" @save="saveSession" />
  </div>
</template>
