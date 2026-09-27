// Objectif par semaine : un modèle de séance par jour, du lundi (0) au dimanche (6).
// Le plan est gardé dans le compte (métadonnées Supabase) : il suit l'utilisateur sur tous ses appareils,
// sans nouvelle table. Les validations sont les séances du calendrier de la semaine en cours :
// elles repartent donc à zéro chaque lundi, le plan reste.

export const WEEK_DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

export type PlanEntry = { id: string, name: string, color?: string }
export type WeeklyPlan = Partial<Record<number, PlanEntry>>

function toDateStr(d: Date) {
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-')
}

// Dates (AAAA-MM-JJ) du lundi au dimanche de la semaine qui contient le jour donné
export function weekDates(day: string) {
  const d = new Date(`${day}T12:00:00`)
  const monday = new Date(d)
  monday.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return WEEK_DAYS.map((_, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    return toDateStr(date)
  })
}

// Le compte peut contenir n'importe quoi (modifié à la main, ancienne version) : on ne garde que les jours valides
function sanitizePlan(raw: unknown): WeeklyPlan {
  const plan: WeeklyPlan = {}
  if (!raw || typeof raw !== 'object') return plan
  for (const [key, value] of Object.entries(raw as Record<string, { id?: unknown, name?: unknown, color?: unknown }>)) {
    const index = Number(key)
    if (Number.isInteger(index) && index >= 0 && index < 7 && value?.id) {
      plan[index] = { id: String(value.id), name: String(value.name || 'Séance'), color: String(value.color || '') }
    }
  }
  return plan
}

export function useWeeklyPlan() {
  const supabase = useSupabaseClient()
  const plan = useState<WeeklyPlan>('weekly-plan', () => ({}))

  function loadPlan(user: { user_metadata?: Record<string, unknown> } | null | undefined) {
    plan.value = sanitizePlan(user?.user_metadata?.weekly_plan)
  }

  // Modèle prévu pour un jour, ou null pour en faire un jour de repos.
  // Nom et couleur sont copiés pour afficher le plan avant que les modèles soient chargés.
  async function setDay(index: number, template: PlanEntry | null) {
    const previous = plan.value
    const next: WeeklyPlan = Object.fromEntries(Object.entries(previous).filter(([key]) => Number(key) !== index))
    if (template) next[index] = { id: template.id, name: template.name, color: template.color || '' }
    plan.value = next

    const { error } = await supabase.auth.updateUser({ data: { weekly_plan: next } })
    if (error) {
      // Annulé seulement si aucun autre changement n'a eu lieu entre-temps
      if (plan.value === next) plan.value = previous
      throw error
    }
  }

  return { plan, loadPlan, setDay }
}
