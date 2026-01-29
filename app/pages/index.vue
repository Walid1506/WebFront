<template>
  <div class="p-4 max-w-6xl mx-auto space-y-8">
    <div class="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex items-center justify-between">
      <div class="relative z-10">
        <h1 class="text-3xl font-black mb-2">Bonjour, {{ store.currentUser||"Invité" }} !</h1>
        <p class="text-slate-300 font-medium">Voici ton historique d'activités.</p>
      </div>
      <div class="absolute top-0 right-0 w-64 h-64 -mr-16 -mt-16 bg-white opacity-5 rounded-full pointer-events-none"></div>
    </div>
    <Calendrier @select-date="onDateSelected" />
    <section class="space-y-4"><AlimentationSection /></section>
    <section class="space-y-4">
      <h2 class="text-2xl font-black text-slate-900 flex items-center gap-2"><UIcon name="i-heroicons-play-circle" class="text-green-500" />Cours Vidéo</h2>
      <VideoSection />
    </section>
    <Seance v-if="isModalOpen" :date="selectedDate" :initial-data="sessionToEdit" @close="closeModal" @save="saveSession" />
  </div>
</template>

<script setup>
import { useSportStore } from "~/stores/sport"
import Calendrier from "~/components/custom/Calendrier.vue"
import VideoSection from "~/pages/video.vue"
import AlimentationSection from "~/pages/alimentation.vue"
import Seance from "~/components/seance.vue"
const store=useSportStore()
const isModalOpen=ref(false)
const selectedDate=ref(null)
const sessionToEdit=ref(null)
const clone=(data)=>{try{return structuredClone(data)}catch{return data?JSON.parse(JSON.stringify(data)):null}}
const getSportSession=(date)=>{const s=(store.sessions||[]).find(x=>x.date===date);return s&&s.sport?clone(s.sport):null}
function onDateSelected(date){if(!date)return;selectedDate.value=date;sessionToEdit.value=getSportSession(date);isModalOpen.value=true}
function closeModal(){isModalOpen.value=false}
function saveSession(payload){if(payload&&payload.type==="sport")store.saveSportSession(selectedDate.value,payload.data);closeModal()}
</script>
