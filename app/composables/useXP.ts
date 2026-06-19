const THRESHOLDS = [0, 300, 700, 1300, 2100, 3200, 4600, 6300, 8500, 11000, 14500]
const LEVEL_NAMES = ['', 'Débutant', 'Apprenti', 'Régulier', 'Confirmé', 'Athlète', 'Expert', 'Élite', 'Maître', 'Champion', 'Légende']
const LEVEL_COLORS = [
  '',
  'from-slate-400 to-slate-500',
  'from-slate-300 to-slate-400',
  'from-emerald-400 to-green-500',
  'from-emerald-400 to-teal-500',
  'from-cyan-400 to-blue-500',
  'from-blue-400 to-indigo-500',
  'from-violet-400 to-purple-600',
  'from-purple-400 to-pink-500',
  'from-yellow-400 to-orange-500',
  'from-yellow-300 to-amber-500',
]

function localDate(d = new Date()): string {
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-')
}

function computeStreak(dates: string[]): number {
  if (!dates.length) return 0
  const unique = [...new Set(dates)].sort().reverse()
  let streak = 0
  for (let i = 0; i < unique.length; i++) {
    const expected = new Date()
    expected.setDate(expected.getDate() - i)
    if (unique[i] === localDate(expected)) streak++
    else break
  }
  return streak
}

function xpToLevel(xp: number) {
  let level = 1
  for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= THRESHOLDS[i]) { level = i + 1; break }
  }
  level = Math.min(level, 10)
  const currentThreshold = THRESHOLDS[level - 1] || 0
  const nextThreshold = THRESHOLDS[level] || THRESHOLDS[THRESHOLDS.length - 1]
  const progress = level >= 10 ? 100 : Math.floor(((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100)
  const xpToNext = level >= 10 ? 0 : nextThreshold - xp
  return {
    level,
    name: LEVEL_NAMES[level] || 'Légende',
    color: LEVEL_COLORS[level] || LEVEL_COLORS[10],
    progress,
    xpToNext,
    currentThreshold,
    nextThreshold,
  }
}

export function useXP() {
  const supabase = useSupabaseClient()
  const totalXP = ref(0)
  const breakdown = ref({ sessions: 0, templates: 0, streak: 0, streakDays: 0 })
  const loading = ref(true)

  const levelInfo = computed(() => xpToLevel(totalXP.value))

  async function fetchXP(userId?: string) {
    const uid = userId || (await supabase.auth.getUser()).data.user?.id
    if (!uid) return

    const [{ data: sessions }, { data: templates }] = await Promise.all([
      supabase.from('sport_sessions').select('date').eq('user_id', uid),
      supabase.from('workout_templates').select('id').eq('user_id', uid),
    ])

    const streak = computeStreak((sessions || []).map(s => s.date))
    const sessionsXP = (sessions?.length || 0) * 100
    const templatesXP = (templates?.length || 0) * 30
    const streakXP = streak * 25

    breakdown.value = { sessions: sessionsXP, templates: templatesXP, streak: streakXP, streakDays: streak }
    totalXP.value = sessionsXP + templatesXP + streakXP
    loading.value = false
  }

  return { totalXP, levelInfo, breakdown, loading, fetchXP, xpToLevel, LEVEL_NAMES, LEVEL_COLORS }
}
