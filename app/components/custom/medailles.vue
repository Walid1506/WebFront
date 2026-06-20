<template>
  <div class="bg-white/[0.04] backdrop-blur-2xl rounded-[28px] border border-white/[0.08] p-5 shadow-2xl relative overflow-hidden">
    <div class="absolute -top-12 -right-12 w-52 h-52 rounded-full blur-[80px] pointer-events-none" style="background: rgba(250,204,21,0.07)"></div>

    <!-- Header -->
    <div class="flex items-center gap-2 mb-1">
      <div class="w-2 h-2 rounded-full bg-yellow-400" style="box-shadow: 0 0 8px rgba(250,204,21,0.8)"></div>
      <h2 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Médailles</h2>
    </div>
    <div class="flex items-center justify-between mb-5">
      <p class="text-xl font-[1000] tracking-tighter text-white">Cette semaine</p>
      <p class="text-xs font-black text-slate-500">{{ loading ? '...' : `${earnedCount}/4` }}</p>
    </div>

    <!-- Grid 2x2 -->
    <div class="grid grid-cols-2 gap-3">
      <div v-for="m in medals" :key="m.id"
        class="rounded-[20px] border p-4 flex flex-col gap-2 transition-all duration-500"
        :class="m.level ? 'bg-white/[0.06] border-white/[0.10]' : 'bg-white/[0.02] border-white/[0.04]'">

        <!-- Icon -->
        <div class="text-3xl leading-none select-none">{{ m.level ? LEVEL_EMOJI[m.level] : '🔒' }}</div>

        <!-- Name + desc -->
        <div>
          <p class="font-black text-sm" :class="m.level ? 'text-white' : 'text-slate-600'">{{ m.name }}</p>
          <p class="text-[11px] mt-0.5" :class="m.level ? 'text-slate-400' : 'text-slate-700'">{{ m.desc }}</p>
        </div>

        <!-- Progress bar -->
        <div class="h-1 bg-white/[0.08] rounded-full overflow-hidden mt-0.5">
          <div class="h-full rounded-full transition-all duration-700"
            :style="{ width: `${m.pct}%`, backgroundColor: m.level ? LEVEL_COLOR[m.level] : '#334155' }" />
        </div>

        <!-- Count -->
        <p class="text-[10px] font-black" :class="m.level ? 'text-slate-500' : 'text-slate-700'">{{ m.progressText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const loading = ref(true)

const LEVEL_EMOJI = { bronze: '🥉', silver: '🥈', gold: '🥇' }
const LEVEL_COLOR = { bronze: '#cd7f32', silver: '#94a3b8', gold: '#fbbf24' }

function getLevel(n) {
  if (n >= 5) return 'gold'
  if (n >= 4) return 'silver'
  if (n >= 3) return 'bronze'
  return null
}

function weekStart() {
  const now = new Date()
  const diff = now.getDay() === 0 ? -6 : 1 - now.getDay()
  const mon = new Date(now)
  mon.setDate(now.getDate() + diff)
  mon.setHours(0, 0, 0, 0)
  return mon
}

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const sessionsCount = ref(0)
const calDays = ref(0)
const protDays = ref(0)
const waterDays = ref(0)

const medals = computed(() => [
  {
    id: 'sessions', name: 'Séances',
    desc: sessionsCount.value >= 5 ? 'Semaine parfaite !' : sessionsCount.value >= 3 ? `Plus que ${5 - sessionsCount.value} pour l'or` : `3 min. pour une médaille`,
    level: getLevel(sessionsCount.value),
    pct: Math.min(100, (sessionsCount.value / 5) * 100),
    progressText: `${sessionsCount.value} / 5 séances cette semaine`
  },
  {
    id: 'calories', name: 'Calories',
    desc: calDays.value >= 5 ? 'Objectif tenu !' : calDays.value >= 3 ? `Plus que ${5 - calDays.value}j pour l'or` : `3 jours min. pour une médaille`,
    level: getLevel(calDays.value),
    pct: Math.min(100, (calDays.value / 5) * 100),
    progressText: `${calDays.value} / 5 jours atteints`
  },
  {
    id: 'proteines', name: 'Protéines',
    desc: protDays.value >= 5 ? 'Objectif tenu !' : protDays.value >= 3 ? `Plus que ${5 - protDays.value}j pour l'or` : `3 jours min. pour une médaille`,
    level: getLevel(protDays.value),
    pct: Math.min(100, (protDays.value / 5) * 100),
    progressText: `${protDays.value} / 5 jours atteints`
  },
  {
    id: 'eau', name: 'Hydratation',
    desc: waterDays.value >= 5 ? '8 verres chaque jour !' : waterDays.value >= 3 ? `Plus que ${5 - waterDays.value}j pour l'or` : `3 jours min. pour une médaille`,
    level: getLevel(waterDays.value),
    pct: Math.min(100, (waterDays.value / 5) * 100),
    progressText: `${waterDays.value} / 5 jours à 8 verres`
  },
])

const earnedCount = computed(() => medals.value.filter(m => m.level).length)

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { loading.value = false; return }

  const mon = weekStart()
  const sun = new Date(mon)
  sun.setDate(mon.getDate() + 6)
  const monStr = toDateStr(mon)
  const sunStr = toDateStr(sun)

  // Sessions cette semaine
  const { count } = await supabase.from('sport_sessions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('date', monStr)
    .lte('date', sunStr)
  sessionsCount.value = count || 0

  // Nutrition : jours où l'objectif kcal et prot est atteint à 85%+
  const { data: days } = await supabase.from('nutrition_daily')
    .select('repas, cibles')
    .eq('user_id', user.id)
    .gte('date', monStr)
    .lte('date', sunStr)

  if (days) {
    let cal = 0, prot = 0
    for (const day of days) {
      const repas = day.repas || []
      const cibles = day.cibles || {}
      const totalKcal = repas.reduce((s, r) => s + (r.kcal || 0), 0)
      const totalProt = repas.reduce((s, r) => s + (r.prot || 0), 0)
      if (cibles.kcal && totalKcal >= cibles.kcal * 0.85) cal++
      if (cibles.prot && totalProt >= cibles.prot * 0.85) prot++
    }
    calDays.value = cal
    protDays.value = prot
  }

  // Eau : jours où 8 verres atteints (localStorage)
  let water = 0
  for (let i = 0; i < 7; i++) {
    const d = new Date(mon)
    d.setDate(mon.getDate() + i)
    const val = parseInt(localStorage.getItem(`fittrack_water_${toDateStr(d)}`) || '0')
    if (val >= 8) water++
  }
  waterDays.value = water

  loading.value = false
})
</script>
