<template>
  <div class="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 relative overflow-hidden transition-all duration-500">
    <div v-if="!hasGoals" class="flex flex-col items-center justify-center py-8 space-y-4 text-center">
      <div class="bg-green-100 p-4 rounded-full mb-2 animate-bounce">
        <UIcon name="i-heroicons-chart-bar" class="text-4xl text-green-600" />
      </div>
      <h2 class="text-xl font-black text-slate-900">Bienvenue sur ton Dashboard !</h2>
      <p class="text-slate-500 text-sm max-w-xs mx-auto">Pour que les graphiques fonctionnent, commence par définir tes objectifs (Poids, Calories visées).</p>
      <button @click="openEditor" class="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">🎯 Définir mes objectifs</button>
    </div>
    <div v-else>
      <div class="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h2 class="text-xl font-black text-slate-900 flex items-center gap-2"><UIcon name="i-heroicons-chart-pie" class="text-green-500" />Aujourd'hui</h2>
          <p class="text-sm text-slate-500 font-medium">Poids actuel : <span class="text-slate-900 font-bold">{{ poidsAffiche }} kg</span></p>
        </div>
        <button @click="openEditor" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-bold transition">Modifier mes cibles</button>
      </div>
      <div class="grid grid-cols-3 gap-2 md:gap-4 relative z-10">
        <CircleProgress label="Calories" subLabel="Consommées" :current="store.userGoals.consumedCal" :target="store.userGoals.targetCal" color="text-orange-500" icon="i-heroicons-fire" />
        <CircleProgress label="Protéines" subLabel="Grammes" :current="store.userGoals.consumedProt" :target="store.userGoals.targetProt" color="text-blue-500" icon="i-heroicons-bolt" />
        <div class="flex flex-col items-center justify-center p-2">
          <div class="w-20 h-20 rounded-full border-4 border-green-100 flex items-center justify-center bg-green-50 shadow-inner mb-2 relative">
            <UIcon name="i-heroicons-trophy" class="text-3xl text-green-500" />
            <div class="absolute -bottom-1 bg-green-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">SPORT</div>
          </div>
          <div class="text-center">
            <span class="block text-xl font-black text-slate-900">{{ store.caloriesBurnedToday }}</span>
            <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Kcal Brûlées</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isEditing" class="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col justify-center p-6 animate-fade-in">
      <h3 class="font-black text-lg mb-4 text-center text-slate-900">{{ editorTitle }}</h3>
      <div class="space-y-4">
        <div>
          <label class="text-xs font-bold text-slate-500 uppercase mb-1 block">Poids actuel (kg)</label>
          <input v-model.number="tempGoals.weight" type="number" placeholder="Ex: 75" class="w-full bg-slate-100 text-slate-900 p-3 rounded-xl font-bold border-none focus:ring-2 ring-green-500 outline-none placeholder-slate-400" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs font-bold text-slate-500 uppercase mb-1 block">Cible Calories</label>
            <input v-model.number="tempGoals.targetCal" type="number" placeholder="Ex: 2500" class="w-full bg-slate-100 text-slate-900 p-3 rounded-xl font-bold border-none focus:ring-2 ring-green-500 outline-none placeholder-slate-400" />
          </div>
          <div>
            <label class="text-xs font-bold text-slate-500 uppercase mb-1 block">Cible Protéines</label>
            <input v-model.number="tempGoals.targetProt" type="number" placeholder="Ex: 140" class="w-full bg-slate-100 text-slate-900 p-3 rounded-xl font-bold border-none focus:ring-2 ring-green-500 outline-none placeholder-slate-400" />
          </div>
        </div>
        <div class="flex gap-2 pt-4">
          <button @click="saveGoals" class="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition">Valider</button>
          <button v-if="hasGoals" @click="closeEditor" class="px-4 bg-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-300">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSportStore } from "~/stores/sport"

const store = useSportStore()

const isEditing = ref(false)

const hasGoals = computed(() => !!store.userGoals?.targetCal)

const editorTitle = computed(() => (hasGoals.value ? "Modifier mes objectifs" : "Configurer mon profil"))

const poidsAffiche = computed(() => (store.userGoals?.weight ? store.userGoals.weight : "?"))

const tempGoals = reactive(createTempGoals())

function createTempGoals() {
  const goals = store.userGoals || {}
  return { weight: goals.weight || null, targetCal: goals.targetCal || null, targetProt: goals.targetProt || null }
}

function openEditor() {
  syncTempGoals()
  isEditing.value = true
}

function closeEditor() {
  isEditing.value = false
}

function syncTempGoals() {
  const goals = store.userGoals || {}
  tempGoals.weight = goals.weight || null
  tempGoals.targetCal = goals.targetCal || null
  tempGoals.targetProt = goals.targetProt || null
}

function saveGoals() {
  if (!isGoalsValid(tempGoals)) return
  store.updateGoals({ weight: tempGoals.weight, targetCal: tempGoals.targetCal, targetProt: tempGoals.targetProt })
  isEditing.value = false
}

function isGoalsValid(goals) {
  if (!goals.targetCal) return false
  if (!goals.targetProt) return false
  return true
}
</script>

<script>
import { h } from "vue"

const CircleProgress = props => {
  const radius = 35
  const circumference = 2 * Math.PI * radius
  const current = Number(props.current) || 0
  const target = Number(props.target) || 1
  const percent = Math.min(100, (current / target) * 100)
  const offset = circumference - (percent / 100) * circumference
  return h("div", { class: "flex flex-col items-center justify-center p-2" }, [
    h("div", { class: "relative w-20 h-20 mb-2" }, [
      h("svg", { class: "w-full h-full transform -rotate-90", viewBox: "0 0 80 80" }, [
        h("circle", { cx: "40", cy: "40", r: radius, stroke: "#f1f5f9", "stroke-width": "8", fill: "transparent" }),
        h("circle", { cx: "40", cy: "40", r: radius, stroke: "currentColor", "stroke-width": "8", fill: "transparent", "stroke-dasharray": circumference, "stroke-dashoffset": offset, "stroke-linecap": "round", class: `${props.color} transition-all duration-1000 ease-out` })
      ]),
      h("div", { class: "absolute inset-0 flex items-center justify-center" }, [h("span", { class: `text-xl ${props.color}` }, h("i", { class: props.icon }))])
    ]),
    h("div", { class: "text-center" }, [
      h("span", { class: "block text-xl font-black text-slate-900" }, [current, h("span", { class: "text-xs text-slate-400 font-normal ml-0.5" }, `/${props.target}`)]),
      h("span", { class: "text-[10px] text-slate-400 font-bold uppercase tracking-wide" }, props.label)
    ])
  ])
}
</script>
