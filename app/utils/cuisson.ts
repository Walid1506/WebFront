// Poids cuit → poids cru. Les valeurs nutritionnelles restent « pour 100 g cru » (emballages, viandes et
// poissons de la bibliothèque) : seul le poids tapé est converti, rien ne change dans la base.
// Facteur = poids après cuisson de 100 g cru (tables de rendement de cuisson, valeurs moyennes).

// Types proposés quand le nom ne dit rien (« Le Kamaris », « Le Basmati du Penjab »…)
export const COOKING_TYPES = [
  { id: 'riz', label: 'Riz', factor: 2.6 },
  { id: 'pates', label: 'Pâtes', factor: 2.4 },
  { id: 'semoule', label: 'Semoule, couscous', factor: 2.4 },
  { id: 'quinoa', label: 'Quinoa, boulgour', factor: 2.6 },
  { id: 'legumes-secs', label: 'Lentilles, pois chiches', factor: 2.5 },
  { id: 'viande', label: 'Viande', factor: 0.75 },
  { id: 'poisson', label: 'Poisson', factor: 0.8 }
]

// dry : féculent vendu sec, converti seulement si ses valeurs sont bien celles du sec (≥ 250 kcal pour 100 g) ;
// un sachet précuit ou un plat (≈ 150 kcal) se pèse tel quel
const RULES: { words: string[], factor: number, dry?: boolean }[] = [
  { words: ['pates', 'pasta', 'spaghetti', 'tagliatelle', 'penne', 'macaroni', 'fusilli', 'coquillette', 'nouille', 'linguine', 'farfalle', 'vermicelle', 'torsade', 'rigatoni', 'orzo', 'noodle'], factor: 2.4, dry: true },
  { words: ['riz', 'rice', 'basmati', 'thai', 'jasmin', 'risotto', 'arborio', 'carnaroli'], factor: 2.6, dry: true },
  { words: ['quinoa'], factor: 2.7, dry: true },
  { words: ['semoule', 'couscous'], factor: 2.4, dry: true },
  { words: ['boulgour', 'boulghour', 'ebly'], factor: 2.5, dry: true },
  { words: ['lentille'], factor: 2.5, dry: true },
  { words: ['pois chiche', 'haricot rouge', 'haricot blanc', 'haricot noir', 'flageolet', 'pois casse'], factor: 2.4, dry: true },
  // Viandes et poissons crus : ils perdent de l'eau
  { words: ['poulet', 'dinde', 'boeuf', 'steak', 'veau', 'porc', 'agneau', 'canard', 'escalope', 'hache', 'entrecote', 'bavette', 'rumsteck', 'filet mignon', 'saucisse', 'merguez'], factor: 0.75 },
  { words: ['saumon', 'cabillaud', 'truite', 'colin', 'merlu', 'dorade', 'maquereau', 'pave de thon', 'thon frais', 'crevette', 'poisson blanc'], factor: 0.8 }
]

// Déjà cuit ou vendu prêt à manger (conserve, précuit, riz au lait…) : pas de conversion
const ALREADY_COOKED = ['cuit', 'precuit', 'conserve', 'boite', 'fume', 'seche', 'jambon', 'bresaola', 'galette', 'souffle',
  'surimi', 'express', 'micro', 'lait', 'gateau', 'dessert', 'creme', 'salade', 'plat cuisine', 'doypack']

export function normalizeFoodName(text: string) {
  return String(text || '')
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

// Début de mot : « lentille » trouve « lentilles », mais « riz » ne trouve pas « chorizo »
function hasWord(name: string, word: string) {
  return new RegExp(`(^|[^a-z])${word}`).test(name)
}

// Facteur de cuisson d'un aliment, ou null s'il se pèse tel quel (fruits, pain, plats déjà cuits…)
export function cookingFactor(food: { name?: string, cat?: string, k?: number | string } | null | undefined) {
  if (!food?.name || food.cat === 'Plats IA') return null
  const name = normalizeFoodName(food.name)
  if (ALREADY_COOKED.some(word => hasWord(name, word))) return null
  const rule = RULES.find(r => r.words.some(word => hasWord(name, word)))
  if (!rule) return null
  if (rule.dry && !(Number(food.k) >= 250)) return null
  return rule.factor
}
