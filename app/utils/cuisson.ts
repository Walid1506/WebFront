// Poids cuit → poids cru. Les valeurs nutritionnelles restent « pour 100 g cru » (emballages, viandes et
// poissons de la bibliothèque) : seul le poids tapé est converti, rien ne change dans la base.
// Facteur = poids après cuisson de 100 g cru (tables de rendement de cuisson, valeurs moyennes).

const RULES: { words: string[], factor: number }[] = [
  // Féculents et légumineuses secs : ils absorbent l'eau de cuisson
  { words: ['pates', 'spaghetti', 'tagliatelle', 'penne', 'macaroni', 'fusilli', 'coquillette', 'nouille', 'linguine', 'farfalle', 'vermicelle', 'torsade'], factor: 2.4 },
  { words: ['riz', 'risotto'], factor: 2.6 },
  { words: ['quinoa'], factor: 2.7 },
  { words: ['semoule', 'couscous'], factor: 2.4 },
  { words: ['boulgour', 'boulghour'], factor: 2.6 },
  { words: ['lentille'], factor: 2.5 },
  { words: ['pois chiche', 'haricot rouge', 'haricot blanc', 'haricot noir', 'flageolet', 'pois casse'], factor: 2.4 },
  // Viandes et poissons : ils perdent de l'eau
  { words: ['poulet', 'dinde', 'boeuf', 'steak', 'veau', 'porc', 'agneau', 'canard', 'escalope', 'hache', 'entrecote', 'bavette', 'rumsteck', 'filet mignon', 'saucisse', 'merguez'], factor: 0.75 },
  { words: ['saumon', 'cabillaud', 'truite', 'colin', 'merlu', 'dorade', 'maquereau', 'pave de thon', 'steak de thon', 'thon frais', 'crevette', 'poisson blanc'], factor: 0.8 }
]

// Déjà cuit ou vendu prêt à manger (conserve, précuit, riz au lait…) : pas de conversion
const ALREADY_COOKED = ['cuit', 'precuit', 'conserve', 'boite', 'fume', 'seche', 'jambon', 'bresaola', 'galette', 'souffle',
  'surimi', 'express', 'micro', 'lait', 'gateau', 'dessert', 'creme', 'salade', 'plat cuisine']

function normalize(text: string) {
  return String(text || '')
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

// Début de mot : « lentille » trouve « lentilles », mais « riz » ne trouve pas « chorizo »
function hasWord(name: string, word: string) {
  return new RegExp(`(^|[^a-z])${word}`).test(name)
}

// Facteur de cuisson d'un aliment, ou null s'il se pèse tel quel (fruits, pain, plats déjà cuits…)
export function cookingFactor(food: { name?: string, cat?: string } | null | undefined) {
  if (!food?.name || food.cat === 'Plats IA') return null
  const name = normalize(food.name)
  if (ALREADY_COOKED.some(word => hasWord(name, word))) return null
  return RULES.find(rule => rule.words.some(word => hasWord(name, word)))?.factor ?? null
}
