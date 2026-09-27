// Repas de la journée : chaque aliment du journal porte un champ "meal" (journal et profil des amis)
export const MEALS = [
  { key: 'petit_dej', label: 'Petit-déj', lower: 'petit-déj', icon: 'i-lucide-coffee', color: '#FFB020' },
  { key: 'dejeuner', label: 'Déjeuner', lower: 'déjeuner', icon: 'i-lucide-utensils', color: '#9DFF00' },
  { key: 'gouter', label: 'Goûter', lower: 'goûter', icon: 'i-lucide-cookie', color: '#FF7AB6' },
  { key: 'diner', label: 'Dîner', lower: 'dîner', icon: 'i-lucide-utensils', color: '#8B9CFF' }
]
export const MEAL_KEYS = MEALS.map(m => m.key)

const OTHERS = { key: 'autres', label: 'Autres', lower: 'autres', icon: 'i-heroicons-squares-2x2', color: '#94A3B8' }

type JournalItem = { meal?: string, kcal?: number | string, prot?: number | string, carbs?: number | string, fats?: number | string, name?: string, amount?: number | string }

// Repas proposé selon l'heure (scanner, photo IA) : modifiable avant d'ajouter
export function mealForNow() {
  const now = new Date()
  const h = now.getHours() + now.getMinutes() / 60
  if (h >= 4 && h < 10.5) return 'petit_dej'
  if (h >= 10.5 && h < 15) return 'dejeuner'
  if (h >= 15 && h < 18) return 'gouter'
  return 'diner'
}

// Aliments rangés par repas dans l'ordre de la journée ("index" = position dans la liste d'origine).
// Ceux ajoutés avant les repas vont dans "Autres"
export function groupByMeal<T extends JournalItem>(items: T[]) {
  const entries = items.map((item, index) => ({ item, index }))
  const groups = MEALS.map(m => ({ ...m, entries: entries.filter(e => e.item.meal === m.key) }))
  const others = entries.filter(e => !MEAL_KEYS.includes(e.item.meal || ''))
  if (others.length) groups.push({ ...OTHERS, entries: others })
  return groups.map(g => ({ ...g, kcal: Math.round(g.entries.reduce((s, e) => s + (Number(e.item.kcal) || 0), 0)) }))
}

// Totaux de la journée (kcal arrondies, macros au dixième)
export function sumMeals(items: JournalItem[]) {
  const round1 = (n: number) => Math.round(n * 10) / 10
  const t = items.reduce<{ kcal: number, prot: number, carbs: number, fats: number }>((a, m) => ({
    kcal: a.kcal + (Number(m.kcal) || 0),
    prot: a.prot + (Number(m.prot) || 0),
    carbs: a.carbs + (Number(m.carbs) || 0),
    fats: a.fats + (Number(m.fats) || 0)
  }), { kcal: 0, prot: 0, carbs: 0, fats: 0 })
  return { kcal: Math.round(t.kcal), prot: round1(t.prot), carbs: round1(t.carbs), fats: round1(t.fats) }
}

// Fusionne les listes d'aliments de plusieurs lignes du même jour (anciennes versions) : un aliment présent
// dans plusieurs lignes n'est compté qu'une fois, les vrais doublons d'une même ligne sont gardés
export function mergeRepas<T extends JournalItem>(lists: T[][]) {
  if (lists.length <= 1) return lists[0] || []
  const kept = new Map<string, number>()
  const merged: T[] = []
  for (const list of lists) {
    const seen = new Map<string, number>()
    for (const item of list) {
      const key = JSON.stringify([item.name, item.amount, item.kcal, item.meal])
      const n = (seen.get(key) || 0) + 1
      seen.set(key, n)
      if (n > (kept.get(key) || 0)) {
        kept.set(key, n)
        merged.push(item)
      }
    }
  }
  return merged
}
