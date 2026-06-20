<template>
  <div class="relative group">
    <div class="bg-white/[0.04] backdrop-blur-2xl rounded-[28px] md:rounded-[40px] p-5 md:p-8 border border-white/[0.08] shadow-2xl overflow-hidden relative">

      <div class="absolute -bottom-20 -left-20 w-64 h-64 blur-[100px] pointer-events-none opacity-30" :style="{ backgroundColor: theme.blobs[0] }"></div>
      <div class="absolute -top-10 -right-10 w-48 h-48 blur-[80px] pointer-events-none opacity-25" :style="{ backgroundColor: theme.blobs[2] }"></div>

      <div class="flex justify-between items-start mb-8 relative z-10">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <div class="w-2 h-2 rounded-full animate-pulse" :style="{ backgroundColor: 'var(--accent-solid)', boxShadow: '0 0 10px var(--accent-solid)' }"></div>
            <h2 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Suivi du Poids</h2>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-5xl font-[1000] tracking-tighter text-white">{{ currentWeight || '--' }}</span>
            <span class="text-xl font-black bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] bg-clip-text text-transparent italic">kg</span>
          </div>
        </div>

        <button @click="openModal" class="p-4 bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[color:var(--accent-solid)]/15 group/btn">
          <UIcon name="i-heroicons-plus-16-solid" class="text-white text-xl group-hover/btn:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      <div class="relative h-44 w-full bg-white/[0.03] rounded-[30px] border border-white/[0.06] flex items-center justify-center overflow-hidden mb-2 p-4">
        
        <div v-if="history.length === 0" class="text-center p-6 space-y-2 z-10">
          <UIcon name="i-heroicons-presentation-chart-line" class="text-3xl text-slate-600" />
          <p class="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-tight">Aucune pesée</p>
        </div>

        <ClientOnly v-else>
          <div class="w-full h-full relative z-10">
            <Line :data="chartData" :options="chartOptions" />
          </div>
        </ClientOnly>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div class="w-full max-w-sm bg-white rounded-[40px] p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
          <button @click="closeModal" class="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition">
            <UIcon name="i-heroicons-x-mark" class="text-2xl" />
          </button>

          <div class="text-center mb-8">
            <h3 class="text-3xl font-[1000] tracking-tighter text-slate-900 mb-2">Nouvelle pesée</h3>
            <p class="text-slate-400 font-medium italic">Ta rigueur paiera, continue.</p>
          </div>

          <div class="relative mb-8 group">
            <input v-model.number="newWeight" type="number" step="0.1" 
              class="w-full bg-slate-50 text-slate-900 text-center text-5xl py-8 rounded-[30px] font-black border-none focus:ring-4 ring-green-100 transition-all outline-none" 
              placeholder="0.0" autofocus />
            <span class="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-300 font-black uppercase text-xs tracking-widest">Kilogrammes</span>
          </div>

          <button @click="saveWeight" :disabled="!newWeight || loading"
            class="w-full bg-black text-white font-black py-5 rounded-2xl shadow-xl hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-30">
            {{ loading ? 'Enregistrement...' : 'Confirmer' }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { Line } from 'vue-chartjs'
const { theme } = useTheme()
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js'

// On enregistre les modules du graphique
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

const supabase = useSupabaseClient()

// Variables réactives
const isModalOpen = ref(false)
const newWeight = ref(null)
const loading = ref(false)
const history = ref([])

// Calcul du poids actuel basé sur la dernière entrée
const currentWeight = computed(() => {
  return history.value.length > 0 ? history.value[history.value.length - 1].weight : null
})

// Chargement initial des données
onMounted(async () => {
  await fetchWeightHistory()
})

async function fetchWeightHistory() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data, error } = await supabase
    .from('measurements')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
  
  if (!error && data) {
    history.value = data
  }
}

// Fonction blindée pour sauvegarder le poids
async function saveWeight() {
  if (!newWeight.value || newWeight.value <= 0) return
  loading.value = true

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    alert("Erreur : Utilisateur non identifié. Veuillez vous reconnecter.")
    loading.value = false
    return
  }

  const { error } = await supabase.from('measurements').insert({
    user_id: user.id,
    weight: newWeight.value
  })

  if (!error) {
    await fetchWeightHistory()
    closeModal()
  } else {
    alert("Erreur lors de la sauvegarde : " + error.message)
  }
  
  loading.value = false
}

// --- CONFIGURATION DU VRAI GRAPHIQUE CHART.JS ---

// 1. Les données (Dates en bas, Poids sur la courbe)
const chartData = computed(() => {
  // S'il n'y a qu'une seule pesée, on la double artificiellement pour tracer une ligne droite
  let labels = history.value.map(h => formatDate(h.created_at))
  let dataPoints = history.value.map(h => h.weight)

  if (history.value.length === 1) {
    labels = [labels[0], labels[0]]
    dataPoints = [dataPoints[0], dataPoints[0]]
  }

  return {
    labels: labels,
    datasets: [
      {
        label: 'Poids (kg)',
        data: dataPoints,
        borderColor: '#22d3ee',
        backgroundColor: '#060d1a',
        borderWidth: 3,
        pointRadius: 4,
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#22d3ee',
        tension: 0.4 // Arrondit légèrement la courbe
      }
    ]
  }
})

// 2. Les options du graphique (Design Sleek & Dark)
const chartOptions = computed(() => {
  const weights = history.value.map(h => h.weight)
  const minW = weights.length > 0 ? Math.min(...weights) - 2 : 0
  const maxW = weights.length > 0 ? Math.max(...weights) + 2 : 100

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Cache la légende inutile
      tooltip: {
        backgroundColor: '#0f172a', // Tooltip Dark
        titleColor: '#22d3ee',
        bodyColor: '#ffffff',
        bodyFont: { weight: 'bold', size: 14 },
        padding: 12,
        displayColors: false, // Cache le carré de couleur
        callbacks: {
          label: (context) => `${context.parsed.y} kg` // Affiche "XX kg"
        }
      }
    },
    scales: {
      x: {
        display: false // Cache l'axe du bas pour garder un look épuré
      },
      y: {
        display: false, // Cache les chiffres à gauche
        min: minW, // Adapte le zoom automatiquement à tes données
        max: maxW
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  }
})

// Fonctions utilitaires
const openModal = () => isModalOpen.value = true
const closeModal = () => {
  isModalOpen.value = false
  newWeight.value = null
}

function formatDate(dateStr) {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("fr-FR", { month: "short", day: "numeric" })
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>