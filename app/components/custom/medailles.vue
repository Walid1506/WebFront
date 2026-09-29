<template>
  <div class="space-y-5">
    <!-- Collection : tout ce qui a été gagné depuis le début (missions + médailles de chaque semaine) -->
    <div class="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4">
      <div class="flex items-baseline justify-between">
        <p class="text-white font-[1000] text-2xl tracking-tight">{{ loading ? '…' : totalMedals }} <span class="text-sm font-black text-slate-500">médaille{{ totalMedals > 1 ? 's' : '' }}</span></p>
        <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ta collection</p>
      </div>
      <div class="grid grid-cols-5 gap-2 mt-3 text-center">
        <div v-for="t in TIERS" :key="t.key" class="rounded-xl py-2" :class="collection[t.key] ? 'bg-white/[0.06]' : 'bg-white/[0.02] opacity-40'">
          <p class="text-xl leading-none">{{ t.emoji }}</p>
          <p class="text-white font-black text-sm mt-1">{{ collection[t.key] || 0 }}</p>
        </div>
      </div>
    </div>

    <!-- Médailles de la semaine : elles s'ajoutent à la collection chaque semaine -->
    <div>
      <div class="flex items-center justify-between px-1 mb-2">
        <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cette semaine</p>
        <p class="text-[10px] font-black text-slate-500">{{ weekEarned }}/4</p>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div v-for="m in weekMedals" :key="m.id"
          class="rounded-[20px] border p-4 flex flex-col gap-2 transition-all duration-500"
          :class="m.level ? 'bg-white/[0.06] border-white/[0.10]' : 'bg-white/[0.02] border-white/[0.04]'">
          <div class="text-3xl leading-none select-none">{{ m.level ? tierOf(m.level).emoji : '🔒' }}</div>
          <div>
            <p class="font-black text-sm" :class="m.level ? 'text-white' : 'text-slate-600'">{{ m.name }}</p>
            <p class="text-[11px] mt-0.5" :class="m.level ? 'text-slate-400' : 'text-slate-600'">{{ m.desc }}</p>
          </div>
          <div class="h-1 bg-white/[0.08] rounded-full overflow-hidden mt-0.5">
            <div class="h-full rounded-full transition-all duration-700"
              :style="{ width: `${m.pct}%`, backgroundColor: m.level ? tierOf(m.level).color : '#334155' }" />
          </div>
          <p class="text-[10px] font-black" :class="m.level ? 'text-slate-500' : 'text-slate-600'">{{ m.progressText }}</p>
        </div>
      </div>
      <p class="text-slate-600 text-[11px] font-bold px-1 mt-2">
        Chaque semaine, 3, 4 ou 5 jours réussis = 🥉 🥈 🥇, gardées pour toujours dans ta collection.
      </p>
    </div>

    <!-- Missions : des paliers à débloquer, jamais perdus -->
    <div>
      <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 mb-2">Missions</p>
      <div class="space-y-2">
        <div v-for="m in missions" :key="m.id" class="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3.5">
          <div class="flex items-center gap-3">
            <div class="relative w-11 h-11 rounded-2xl bg-white/[0.06] flex items-center justify-center text-xl shrink-0">
              {{ m.icon }}
              <span v-if="m.reached" class="absolute -bottom-1 -right-1 text-base leading-none">{{ TIERS[m.reached - 1].emoji }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2">
                <p class="text-white font-black text-sm truncate">{{ m.name }}</p>
                <div class="flex gap-1 shrink-0" :aria-label="`${m.reached} palier${m.reached > 1 ? 's' : ''} sur ${m.goals.length}`">
                  <span v-for="(g, i) in m.goals" :key="g" class="w-2 h-2 rounded-full"
                    :style="{ backgroundColor: i < m.reached ? TIERS[i].color : 'rgba(255,255,255,0.1)' }" />
                </div>
              </div>
              <p class="text-slate-500 text-xs mt-0.5 truncate">{{ m.next === null ? 'Toutes les médailles gagnées !' : m.text(m.next) }}</p>
            </div>
          </div>
          <div v-if="m.next !== null" class="flex items-center gap-2 mt-2.5">
            <div class="flex-1 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-700" :style="{ width: `${m.pct}%`, backgroundColor: TIERS[m.reached].color }" />
            </div>
            <p class="text-[10px] font-black text-slate-500 shrink-0">{{ m.format(m.value) }} / {{ m.format(m.next) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  active: { type: Boolean, default: true }
})

const emit = defineEmits(['count'])

const supabase = useSupabaseClient()
const loading = ref(true)

// Paliers : chaque palier atteint d'une mission est une médaille de plus
const TIERS = [
  { key: 'bronze', emoji: '🥉', color: '#cd7f32' },
  { key: 'silver', emoji: '🥈', color: '#94a3b8' },
  { key: 'gold', emoji: '🥇', color: '#fbbf24' },
  { key: 'platinum', emoji: '🏆', color: '#22d3ee' },
  { key: 'diamond', emoji: '💎', color: '#a78bfa' }
]
function tierOf(key) {
  return TIERS.find(t => t.key === key) || TIERS[0]
}

const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`
const count = n => String(n)
const kg = n => (n >= 1000 ? `${(Math.round(n / 100) / 10).toLocaleString('fr-FR')} t` : `${Math.round(n)} kg`)

const MISSIONS = [
  { id: 'seances', icon: '🏋️', name: 'Assidu', goals: [1, 10, 25, 50, 100], format: count, text: g => `Enregistre ${plural(g, 'séance')}` },
  { id: 'serie', icon: '🔥', name: 'En série', goals: [2, 3, 5, 7, 14], format: count, text: g => `${g} jours d'affilée avec une séance` },
  { id: 'semaines', icon: '📅', name: 'Régulier', goals: [1, 4, 8, 16, 32], format: count, text: g => `${plural(g, 'semaine')} à 3 séances ou plus` },
  { id: 'volume', icon: '💪', name: 'Force', goals: [1000, 5000, 20000, 50000, 100000], format: kg, text: g => `Soulève ${kg(g)} au total (poids × séries × répétitions)` },
  { id: 'journal', icon: '📝', name: 'Carnet', goals: [1, 7, 30, 60, 100], format: count, text: g => `Note tes repas ${plural(g, 'jour')}` },
  { id: 'eau', icon: '💧', name: 'Hydratation', goals: [1, 5, 15, 30, 60], format: count, text: g => `${plural(g, 'jour')} à 2 L d'eau` },
  { id: 'proteines', icon: '🥩', name: 'Protéines', goals: [1, 5, 15, 30, 60], format: count, text: g => `Objectif protéines atteint ${plural(g, 'jour')}` },
  { id: 'calories', icon: '🍽️', name: 'Calories', goals: [1, 5, 15, 30, 60], format: count, text: g => `Objectif calories atteint ${plural(g, 'jour')}` },
  { id: 'pas', icon: '👟', name: 'Marcheur', goals: [1, 5, 15, 30, 60], format: count, text: g => `${plural(g, 'jour')} à 10 000 pas` },
  { id: 'amis', icon: '🤝', name: 'Social', goals: [1, 3, 5, 10, 20], format: count, text: g => `Ajoute ${plural(g, 'ami')}` },
  { id: 'modeles', icon: '🗂️', name: 'Organisé', goals: [1, 3, 5, 10, 20], format: count, text: g => `Crée ${plural(g, 'modèle')}` }
]

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Lundi de la semaine d'une date AAAA-MM-JJ
function weekKey(date) {
  const d = new Date(`${date}T12:00:00`)
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return toDateStr(d)
}

// 3 jours (ou séances) = bronze, 4 = argent, 5 = or
function weekLevel(n) {
  if (n >= 5) return 'gold'
  if (n >= 4) return 'silver'
  if (n >= 3) return 'bronze'
  return null
}

const values = ref({})
const weekStats = ref({ sessions: 0, cal: 0, prot: 0, water: 0 })
const weeklyHistory = ref({ bronze: 0, silver: 0, gold: 0 })

const missions = computed(() => MISSIONS.map((m) => {
  const value = values.value[m.id] || 0
  const reached = m.goals.filter(g => value >= g).length
  const next = reached < m.goals.length ? m.goals[reached] : null
  return { ...m, value, reached, next, pct: next ? Math.min(100, (value / next) * 100) : 100 }
}))

const weekMedals = computed(() => {
  const { sessions, cal, prot, water } = weekStats.value
  const medal = (id, name, n, unit, done) => ({
    id, name, level: weekLevel(n), pct: Math.min(100, (n / 5) * 100),
    desc: n >= 5 ? done : n >= 3 ? `Plus que ${5 - n} pour l'or` : `3 ${unit} min. pour une médaille`,
    progressText: `${n} / 5 ${unit}`
  })
  return [
    medal('sessions', 'Séances', sessions, 'séances', 'Semaine parfaite !'),
    medal('calories', 'Calories', cal, 'jours', 'Objectif tenu !'),
    medal('proteines', 'Protéines', prot, 'jours', 'Objectif tenu !'),
    medal('eau', 'Hydratation', water, 'jours', '2 L chaque jour !')
  ]
})

const weekEarned = computed(() => weekMedals.value.filter(m => m.level).length)

const collection = computed(() => {
  const c = { bronze: 0, silver: 0, gold: 0, platinum: 0, diamond: 0 }
  for (const m of missions.value) {
    for (let i = 0; i < m.reached; i++) c[TIERS[i].key]++
  }
  for (const key of ['bronze', 'silver', 'gold']) c[key] += weeklyHistory.value[key]
  return c
})

const totalMedals = computed(() => Object.values(collection.value).reduce((a, b) => a + b, 0))

onMounted(loadMedals)

// L'onglet Profil reste monté : on recalcule quand on y revient (nouvelles séances, repas, eau)
watch(() => props.active, (active) => {
  if (active) loadMedals()
})

async function loadMedals() {
  const { data: { session } } = await supabase.auth.getSession()
  const uid = session?.user?.id
  if (!uid) { loading.value = false; return }
  const today = toDateStr(new Date())

  const [sessionsRes, nutritionRes, stepsRes, sentRes, receivedRes, templatesRes] = await Promise.all([
    supabase.from('sport_sessions').select('date, data').eq('user_id', uid).lte('date', today),
    supabase.from('nutrition_daily').select('date, repas, cibles, eau').eq('user_id', uid).lte('date', today),
    supabase.from('daily_steps').select('date, steps').eq('user_id', uid),
    supabase.from('friendships').select('addressee_id').eq('requester_id', uid).eq('status', 'accepted'),
    supabase.from('friendships').select('requester_id').eq('addressee_id', uid).eq('status', 'accepted'),
    supabase.from('workout_templates').select('id', { count: 'exact', head: true }).eq('user_id', uid)
  ])

  // ── Séances ──
  const sessions = sessionsRes.data || []
  const dates = [...new Set(sessions.map(s => s.date))].sort()
  let bestStreak = 0
  let streak = 0
  let prev = null
  for (const date of dates) {
    const expected = prev ? new Date(`${prev}T12:00:00`) : null
    if (expected) expected.setDate(expected.getDate() + 1)
    streak = expected && toDateStr(expected) === date ? streak + 1 : 1
    bestStreak = Math.max(bestStreak, streak)
    prev = date
  }
  let volume = 0
  for (const s of sessions) {
    for (const ex of s.data?.exercises || []) volume += (Number(ex.weight) || 0) * (Number(ex.sets) || 0) * (Number(ex.reps) || 0)
  }
  const sessionsByWeek = {}
  for (const s of sessions) sessionsByWeek[weekKey(s.date)] = (sessionsByWeek[weekKey(s.date)] || 0) + 1

  // ── Nutrition : une ligne par jour (d'anciennes versions pouvaient en créer plusieurs) ──
  const days = {}
  for (const row of nutritionRes.data || []) {
    const day = days[row.date] || (days[row.date] = { lists: [], eau: 0, cibles: null })
    day.lists.push(row.repas || [])
    day.eau = Math.max(day.eau, Number(row.eau) || 0)
    if (row.cibles) day.cibles = row.cibles
  }
  let journalDays = 0
  let waterDays = 0
  let protDays = 0
  let calDays = 0
  const nutritionByWeek = {}
  for (const [date, day] of Object.entries(days)) {
    const repas = mergeRepas(day.lists)
    const totals = sumMeals(repas)
    const cibles = day.cibles || {}
    const hit = {
      water: day.eau >= 2,
      prot: !!cibles.prot && totals.prot >= cibles.prot * 0.85,
      cal: !!cibles.kcal && totals.kcal >= cibles.kcal * 0.85
    }
    if (repas.length) journalDays++
    if (hit.water) waterDays++
    if (hit.prot) protDays++
    if (hit.cal) calDays++
    const week = nutritionByWeek[weekKey(date)] || (nutritionByWeek[weekKey(date)] = { water: 0, prot: 0, cal: 0 })
    for (const key of ['water', 'prot', 'cal']) if (hit[key]) week[key]++
  }

  // ── Médailles de chaque semaine (y compris la semaine en cours) ──
  const history = { bronze: 0, silver: 0, gold: 0 }
  for (const week of new Set([...Object.keys(sessionsByWeek), ...Object.keys(nutritionByWeek)])) {
    const n = nutritionByWeek[week] || { water: 0, prot: 0, cal: 0 }
    for (const level of [weekLevel(sessionsByWeek[week] || 0), weekLevel(n.cal), weekLevel(n.prot), weekLevel(n.water)]) {
      if (level) history[level]++
    }
  }
  const thisWeek = weekKey(today)
  const current = nutritionByWeek[thisWeek] || { water: 0, prot: 0, cal: 0 }
  weekStats.value = { sessions: sessionsByWeek[thisWeek] || 0, cal: current.cal, prot: current.prot, water: current.water }
  weeklyHistory.value = history

  // ── Pas, amis, modèles (les pas manquent si le script SQL des pas n'est pas lancé) ──
  const stepDays = (stepsRes.error ? [] : stepsRes.data || []).filter(d => d.steps >= 10000).length
  const friends = new Set([...(sentRes.data || []).map(f => f.addressee_id), ...(receivedRes.data || []).map(f => f.requester_id)]).size

  values.value = {
    seances: sessions.length,
    serie: bestStreak,
    semaines: Object.values(sessionsByWeek).filter(n => n >= 3).length,
    volume,
    journal: journalDays,
    eau: waterDays,
    proteines: protDays,
    calories: calDays,
    pas: stepDays,
    amis: friends,
    modeles: templatesRes.count || 0
  }

  loading.value = false
  emit('count', totalMedals.value)
}
</script>
