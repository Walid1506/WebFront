<template>
  <div class="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 relative overflow-hidden">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-black text-slate-900 flex items-center gap-2"><UIcon name="i-heroicons-chart-bar" class="text-green-500" />Suivi du Poids</h2>
        <p v-if="currentWeight" class="text-sm text-slate-500 font-medium">Actuel : <span class="text-2xl font-black text-slate-900">{{ currentWeight }} kg</span></p>
      </div>
      <button @click="openModal" class="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-800 transition">
        <UIcon name="i-heroicons-plus" />
        Nouvelle pesée
      </button>
    </div>
    <div class="relative h-48 w-full bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden">
      <div v-if="history.length < 2" class="text-center p-4">
        <p class="text-slate-400 text-sm font-bold mb-2">Pas assez de données pour le graphique</p>
        <p class="text-xs text-slate-300">Ajoute au moins 2 pesées à des dates différentes pour voir ta courbe !</p>
      </div>
      <svg v-else class="w-full h-full px-2 pt-4 pb-6" viewBox="0 0 100 50" preserveAspectRatio="none">
        <polyline fill="none" stroke="#22c55e" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" :points="chartPoints" class="drop-shadow-sm" />
        <circle v-for="(point, index) in chartDots" :key="index" :cx="point.x" :cy="point.y" r="1.5" class="fill-white stroke-green-600 stroke-2" />
      </svg>
      <div v-if="history.length >= 2" class="absolute bottom-1 left-0 right-0 flex justify-between px-4 text-[8px] font-bold text-slate-400 uppercase">
        <span>{{ formatDate(history[0].date) }}</span>
        <span>{{ formatDate(history[history.length - 1].date) }}</span>
      </div>
    </div>
    <div v-if="isModalOpen" class="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col justify-center p-6 animate-fade-in">
      <h3 class="font-black text-lg mb-1 text-center text-slate-900">Nouvelle pesée</h3>
      <p class="text-xs text-center text-slate-400 mb-6 font-medium">Quel est ton poids aujourd'hui ?</p>
      <div class="relative w-full max-w-[150px] mx-auto mb-6">
        <input v-model.number="newWeight" type="number" step="0.1" placeholder="0.0" class="w-full bg-slate-100 text-slate-900 text-center text-3xl p-4 rounded-2xl font-black border-none focus:ring-4 ring-green-100 outline-none placeholder-slate-300" autofocus />
        <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">kg</span>
      </div>
      <div class="flex gap-2">
        <button @click="saveWeight" class="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition">Enregistrer</button>
        <button @click="closeModal" class="px-4 bg-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-200">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSportStore } from "~/stores/sport"

const store = useSportStore()

const isModalOpen = ref(false)
const newWeight = ref(null)

const history = computed(() => (Array.isArray(store.myWeightHistory) ? store.myWeightHistory : []))

const currentWeight = computed(() => store.currentWeight)

const chartPoints = computed(() => {
  if (history.value.length < 2) return ""
  return history.value.map((entry, index) => formatPoint(getCoordinates(entry.weight, index))).join(" ")
})

const chartDots = computed(() => {
  if (history.value.length < 2) return []
  return history.value.map((entry, index) => getCoordinates(entry.weight, index))
})

function openModal() {
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

function saveWeight() {
  if (!isWeightValid(newWeight.value)) return
  store.addWeightEntry(newWeight.value)
  closeModal()
  newWeight.value = null
}

function isWeightValid(weight) {
  if (!weight) return false
  if (weight <= 0) return false
  return true
}

function getCoordinates(weight, index) {
  const data = history.value
  const x = getX(index, data.length)
  const y = getY(weight, data)
  return { x, y }
}

function getX(index, length) {
  if (length <= 1) return 0
  return (index / (length - 1)) * 100
}

function getY(weight, data) {
  const weights = data.map(item => item.weight)
  const maxWeight = Math.max(...weights) + 1
  const minWeight = Math.min(...weights) - 1
  const range = maxWeight - minWeight
  const normalized = (weight - minWeight) / (range || 1)
  return 50 - normalized * 40 - 5
}

function formatPoint(point) {
  return `${point.x},${point.y}`
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("fr-FR", { month: "short", day: "numeric" })
}
</script>
